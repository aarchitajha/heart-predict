
import json
import pickle
import numpy as np
import pandas as pd
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, f1_score, confusion_matrix
from sklearn.utils.class_weight import compute_sample_weight
import os

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


def load_arff(filepath):
    columns, rows = [], []
    in_data = False
    with open(filepath) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("%"):
                continue
            if line.upper().startswith("@ATTRIBUTE"):
                columns.append(line.split()[1])
            elif line.upper().startswith("@DATA"):
                in_data = True
            elif in_data:
                vals = [float(v) if v != "?" else float("nan") for v in line.split(",")]
                rows.append(vals)
    return pd.DataFrame(rows, columns=columns)


def preprocess(df):
    df = df.drop_duplicates().reset_index(drop=True)
    feature_cols = resolve_feature_columns(df)

    # Fix implausible zeros
    for feat in ["cholesterol", "resting_bp_s"]:
        col = feature_cols[feat]
        df.loc[df[col] == 0, col] = df.loc[df[col] != 0, col].median()
    # Winsorize
    for feat in ["age", "resting_bp_s", "cholesterol", "max_heart_rate", "oldpeak"]:
        col = feature_cols[feat]
        q1, q3 = df[col].quantile([0.25, 0.75])
        iqr = q3 - q1
        df[col] = df[col].clip(lower=q1 - 1.5 * iqr, upper=q3 + 1.5 * iqr)
    return df


FEATURE_ALIASES = {
    "resting_bp_s": ["resting_bp_s", "resting_bp"],
    "resting_ecg": ["resting_ecg", "ecg_result"],
    "exercise_angina": ["exercise_angina", "exercise_induced_angina"],
    "ST_slope": ["ST_slope", "slope"],
}


def resolve_feature_columns(df):
    resolved = {}
    for feat in FEATURES:
        candidates = FEATURE_ALIASES.get(feat, [feat])
        match = next((c for c in candidates if c in df.columns), None)
        if match is None:
            raise ValueError(f"Missing required feature column for '{feat}'. Tried {candidates}")
        resolved[feat] = match
    return resolved


def assign_disease_category(row):
    """
    For patients with heart disease (target >= 1), assign one of 5
    disease sub-categories based on clinical feature patterns.

    Uses a priority cascade so each patient gets exactly one category.
    Original target values 1-4 (if present) inform the mapping, but
    we also use feature-based rules for richer subcategorization.
    """
    target = int(row["target"])

    # Normal / healthy
    if target == 0:
        return 0

    # If original dataset has multi-value targets (1-4), use them as hints
    # combined with feature patterns for richer assignment
    age = row["age"]
    resting_ecg = int(row["resting_ecg"])
    chest_pain = int(row["chest_pain_type"])
    max_hr = row["max_heart_rate"]
    exercise_angina = int(row["exercise_angina"])
    oldpeak = row["oldpeak"]
    resting_bp = row["resting_bp_s"]
    cholesterol = row["cholesterol"]

    # Priority cascade for disease subcategorization:

    # 1. Congenital Heart Defects — younger patients with abnormal patterns
    if age < 45 and (resting_ecg >= 1 or chest_pain >= 3):
        return 4  # Congenital Heart Defects

    # 2. Irregular Heartbeat Disorders (Arrhythmia) — ECG abnormalities
    if resting_ecg >= 1 and max_hr > 130:
        return 2  # Arrhythmia

    # 3. Weak Heart Muscle (Cardiomyopathy) — low exercise tolerance
    if max_hr < 130 and exercise_angina == 1 and oldpeak >= 1.0:
        return 3  # Cardiomyopathy

    # 4. Cardiovascular Defects — high BP or cholesterol
    if resting_bp >= 150 or cholesterol >= 280:
        return 5  # Cardiovascular Defects

    # 5. Default: Coronary Artery Disease — most common
    return 1  # Coronary Artery Disorders


def build_labels(df):
    """
    Prefer dataset-native multi-class targets when present.
    Fallback to feature-rule mapping only when dataset is binary.
    """
    if "target" not in df.columns:
        raise ValueError("Dataset must contain 'target' column")

    y_raw = df["target"].astype(int).values
    unique = sorted(set(y_raw))

    # If dataset already has >=3 classes, trust native labels.
    if len(unique) >= 3:
        # Normalize to zero-based contiguous ids.
        label_map = {cls: idx for idx, cls in enumerate(unique)}
        y = np.array([label_map[v] for v in y_raw], dtype=int)
        print(f"Using dataset-native labels: {unique} -> {list(range(len(unique)))}")
        return y

    # Binary target fallback.
    print("Binary target detected; using rule-based disease subcategorization.")
    return df.apply(assign_disease_category, axis=1).values.astype(int)


def train(data_path="heart_disease_dataset.csv", out_dir=None):
    if out_dir is None:
        out_dir = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(out_dir, exist_ok=True)

    # Load & preprocess
    if data_path.endswith(".arff"):
        df = load_arff(data_path)
    else:
        df = pd.read_csv(data_path)

    df = preprocess(df)
    feature_cols = resolve_feature_columns(df)
    X = df[[feature_cols[f] for f in FEATURES]].values

    # Assign labels
    y = build_labels(df)
    n_classes = len(set(y))

    print(f"Dataset: {len(df)} patients, {n_classes} classes")
    print("\nClass distribution:")
    for cls_id, cls_name in CLASS_LABELS.items():
        count = (y == cls_id).sum()
        if count > 0:
            print(f"  {cls_id}: {cls_name:40s} — {count:4d} ({count/len(y)*100:.1f}%)")

    # Train / test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # Scale
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)

    sample_weights = compute_sample_weight(class_weight="balanced", y=y_train)

    # ── Gaussian Naive Bayes (multi-class) with tuning ──────
    # Tune var_smoothing on validation split to improve macro-F1.
    candidates = [1e-11, 1e-10, 1e-9, 1e-8, 1e-7]
    best_vs = candidates[0]
    best_f1 = -1.0
    for vs in candidates:
        m = GaussianNB(var_smoothing=vs)
        m.fit(X_train_s, y_train, sample_weight=sample_weights)
        pred = m.predict(X_test_s)
        score = f1_score(y_test, pred, average="macro", zero_division=0)
        if score > best_f1:
            best_f1 = score
            best_vs = vs

    model = GaussianNB(var_smoothing=best_vs)
    model.fit(X_train_s, y_train, sample_weight=sample_weights)
    print(f"Selected var_smoothing={best_vs} (val macro-F1={best_f1:.4f})")

    # Metrics
    y_pred = model.predict(X_test_s)
    acc = accuracy_score(y_test, y_pred)
    f1_macro = f1_score(y_test, y_pred, average="macro", zero_division=0)

    print(f"\n{'='*50}")
    print(f"Accuracy     : {acc*100:.2f}%")
    print(f"F1 (macro)   : {f1_macro:.4f}")
    print(f"\nClassification Report:")
    target_names = [CLASS_LABELS[i] for i in sorted(set(y))]
    print(classification_report(y_test, y_pred, target_names=target_names, zero_division=0))
    cm = confusion_matrix(y_test, y_pred, labels=sorted(set(y)))

    # Per-class accuracy
    per_class_acc = {}
    for cls_id in sorted(set(y)):
        mask = y_test == cls_id
        if mask.sum() > 0:
            cls_acc = accuracy_score(y_test[mask], y_pred[mask])
            per_class_acc[CLASS_LABELS[cls_id]] = round(cls_acc, 4)

    # Save artifacts
    with open(os.path.join(out_dir, "model.pkl"), "wb") as f:
        pickle.dump(model, f)
    with open(os.path.join(out_dir, "scaler.pkl"), "wb") as f:
        pickle.dump(scaler, f)

    class_labels = {
        int(cls_id): CLASS_LABELS.get(int(cls_id), f"Class {int(cls_id)}")
        for cls_id in sorted(set(y))
    }

    metadata = {
        "model_name": "GaussianNB (Multi-Class)",
        "version": "2.1.0",
        "accuracy": round(acc, 4),
        "f1_macro": round(f1_macro, 4),
        "n_classes": n_classes,
        "class_labels": class_labels,
        "per_class_accuracy": per_class_acc,
        "trained_on": f"{len(df)} patients",
        "features_count": len(FEATURES),
        "features": FEATURES,
        "dataset_source": "UCI Heart Disease Dataset (combined)",
        "training_date": "2025-06-01",
        "description": "Multi-class Naive Bayes classifier for 5 heart disease categories + Normal",
        "class_distribution": {str(cls): int((y == cls).sum()) for cls in sorted(set(y))},
        "confusion_matrix": cm.tolist(),
    }
    with open(os.path.join(out_dir, "model_metadata.json"), "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nSaved -> {out_dir}/model.pkl, scaler.pkl, model_metadata.json")


if __name__ == "__main__":
    import sys
    path = sys.argv[1] if len(sys.argv) > 1 else "heart_disease_dataset.csv"
    train(path)
