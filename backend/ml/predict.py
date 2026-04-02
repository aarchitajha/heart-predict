"""
predict.py — Multi-Class Heart Disease Inference Script
========================================================
Called by Go backend:
    python predict.py '<json_string>'

Reads: model.pkl, scaler.pkl (in same directory as this script)
Writes: JSON to stdout

Output format:
{
  "predicted_class": 1,
  "category": "Coronary Artery Disorders",
  "category_description": "...",
  "risk_level": "High",
  "confidence": "72.35%",
  "probabilities": {
    "Normal": 0.05,
    "Coronary Artery Disorders": 0.7235,
    ...
  },
  "risk_factors": [...]
}
"""

import sys
import json
import os
import pickle
import numpy as np

# ── Feature order must match training ─────────────────────────
FEATURES = [
    "age", "sex", "chest_pain_type", "resting_bp_s", "cholesterol",
    "fasting_blood_sugar", "resting_ecg", "max_heart_rate",
    "exercise_angina", "oldpeak", "ST_slope",
]

CLASS_LABELS = {
    0: "Normal",
    1: "Irregular Heartbeat Disorder (Arrhythmia)",
    2: "Weak Heart Muscle (Cardiomyopathy)",
    3: "Congenital Heart Defect",
    4: "Cardiovascular Defect (General)",
    5: "Coronary Artery Disease",
}

CLASS_DESCRIPTIONS = {
    0: "No significant heart disease indicators detected. Maintain healthy lifestyle habits.",
    1: "Abnormal heart rhythms that may cause the heart to beat too fast, too slow, or irregularly.",
    2: "Disease of the heart muscle that makes it harder for the heart to pump blood effectively.",
    3: "Structural heart problem present from birth affecting heart walls, valves, or vessels.",
    4: "General cardiovascular defects affecting blood vessel or cardiac function.",
    5: "Narrowing or blockage of coronary arteries supplying blood to heart muscle.",
}

# ── MI-ranked feature importance (from training) ──────────────
FEATURE_IMPORTANCE = {
    "ST_slope":          0.2074,
    "chest_pain_type":   0.1343,
    "oldpeak":           0.1182,
    "exercise_angina":   0.1089,
    "max_heart_rate":    0.0851,
    "cholesterol":       0.0807,
    "sex":               0.0592,
    "age":               0.0530,
    "resting_bp_s":      0.0386,
    "resting_ecg":       0.0263,
    "fasting_blood_sugar": 0.0198,
}


def _load_pickle(path):
    with open(path, "rb") as f:
        return pickle.load(f)


def load_artifacts():
    """
    Resolve model/scaler paths robustly.
    Prefer multi-class artifacts if both legacy and updated paths exist.
    """
    base = os.path.dirname(os.path.abspath(__file__))
    candidate_dirs = [base, os.path.join(base, "ml")]
    best = None

    for d in candidate_dirs:
        model_path = os.path.join(d, "model.pkl")
        scaler_path = os.path.join(d, "scaler.pkl")
        if not (os.path.exists(model_path) and os.path.exists(scaler_path)):
            continue

        model = _load_pickle(model_path)
        scaler = _load_pickle(scaler_path)
        classes = getattr(model, "classes_", [])
        class_count = len(classes)

        # Keep the richest class-set candidate (fixes stale binary artifact loading).
        model_mtime = os.path.getmtime(model_path)
        if (
            best is None
            or class_count > best["class_count"]
            or (class_count == best["class_count"] and model_mtime > best["model_mtime"])
        ):
            best = {
                "model": model,
                "scaler": scaler,
                "class_count": class_count,
                "model_path": model_path,
                "model_mtime": model_mtime,
            }

    if best is None:
        raise FileNotFoundError("Could not locate model.pkl and scaler.pkl artifacts")

    # Debug log on stderr so stdout remains valid JSON for the Go backend.
    print(
        f"[predict.py] using artifacts: {best['model_path']} (classes={best['class_count']})",
        file=sys.stderr,
    )
    meta = {}
    meta_path = os.path.join(os.path.dirname(best["model_path"]), "model_metadata.json")
    if os.path.exists(meta_path):
        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                meta = json.load(f)
        except Exception as exc:
            print(f"[predict.py] metadata parse warning: {exc}", file=sys.stderr)
    return best["model"], best["scaler"], meta


def risk_level(predicted_class: int, max_prob: float) -> str:
    """Determine risk level from predicted class and confidence."""
    if predicted_class == 0:
        return "Low"
    if max_prob >= 0.60:
        return "High"
    elif max_prob >= 0.35:
        return "Medium"
    return "Low"


def top_risk_factors(input_data: dict, n: int = 3) -> list:
    """
    Returns top-n features sorted by MI score,
    with impact label based on MI tier.
    """
    scored = sorted(
        [(feat, FEATURE_IMPORTANCE.get(feat, 0)) for feat in FEATURES],
        key=lambda x: x[1], reverse=True
    )
    result = []
    for i, (feat, score) in enumerate(scored[:n]):
        if score >= 0.12:
            impact = "high"
        elif score >= 0.07:
            impact = "medium"
        else:
            impact = "low"
        result.append({
            "feature": feat,
            "value":   input_data[feat],
            "impact":  impact,
        })
    return result


def soften_probs(probs, temperature=2.0):
    """
    Applies temperature scaling to soften the over-confident BN distribution.
    Temperature > 1.0 makes the distribution more uniform.
    """
    probs = np.array(probs)
    # Convert to log-space, scale, and back to probability
    logits = np.log(probs + 1e-9)
    scaled = logits / temperature
    exp_probs = np.exp(scaled)
    probs = exp_probs / np.sum(exp_probs)
    # Clip as requested to avoid ~1.0 or ~0.0
    probs = np.clip(probs, 0.01, 0.95)
    # Re-normalize one last time
    return (probs / np.sum(probs)).tolist()


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No input provided"}))
        sys.exit(1)

    try:
        data = json.loads(sys.argv[1])
    except json.JSONDecodeError as e:
        print(json.dumps({"error": f"Invalid JSON input: {e}"}))
        sys.exit(1)

    # Build feature vector in correct order
    try:
        X = np.array([[data[f] for f in FEATURES]], dtype=float)
    except KeyError as e:
        print(json.dumps({"error": f"Missing field: {e}"}))
        sys.exit(1)

    # Load model + scaler
    try:
        model, scaler, metadata = load_artifacts()
    except FileNotFoundError as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

    # Feature count guard to catch training/inference mismatch.
    expected_features = getattr(scaler, "n_features_in_", len(FEATURES))
    if X.shape[1] != expected_features:
        print(json.dumps({"error": f"Feature mismatch: got {X.shape[1]}, expected {expected_features}"}))
        sys.exit(1)

    # Scale
    X_scaled = scaler.transform(X)

    # ── Multi-class prediction ────────────────────────────────
    # P(class_k) × ∏ P(xj | class_k) for each class k
    # argmax → predicted class
    proba_raw = model.predict_proba(X_scaled)[0]
    # Calibrate: Soften probabilities with temperature scaling
    proba = soften_probs(proba_raw, temperature=2.0)
    
    classes_in_model = list(model.classes_)
    predicted_idx = int(np.argmax(proba))
    predicted_class = int(classes_in_model[predicted_idx])

    label_map = CLASS_LABELS.copy()
    meta_labels = metadata.get("class_labels", {}) if isinstance(metadata, dict) else {}
    for k, v in meta_labels.items():
        try:
            label_map[int(k)] = v
        except Exception:
            continue

    # Build per-class probability map
    probabilities = {}
    for i, cls_id in enumerate(classes_in_model):
        label = label_map.get(int(cls_id), f"Class {cls_id}")
        probabilities[label] = float(proba[i])

    # Ensure response includes all known classes, even if absent in artifact.
    for cls_id, cls_name in label_map.items():
        probabilities.setdefault(cls_name, 0.0)

    # Max probability for the predicted class
    max_prob = float(proba[predicted_idx])

    # Per-class posterior debug output to stderr.
    print("[predict.py] posterior probabilities:", file=sys.stderr)
    for i, cls_id in enumerate(classes_in_model):
        label = label_map.get(int(cls_id), f"Class {cls_id}")
        print(f"  - {label}: {float(proba[i]):.6f}", file=sys.stderr)

    category = label_map.get(predicted_class, "Unknown")
    description = CLASS_DESCRIPTIONS.get(predicted_class, f"Predicted category: {category}.")
    rl = risk_level(predicted_class, max_prob)

    response = {
        "predicted_class": predicted_class,
        "category":        category,
        "category_description": description,
        "risk_level":      rl,
        "confidence":      f"{max_prob * 100:.2f}%",
        "probability":     float(max_prob),
        "probabilities":   probabilities,
        "risk_factors":    top_risk_factors(data),
    }

    print(json.dumps(response))


if __name__ == "__main__":
    main()
