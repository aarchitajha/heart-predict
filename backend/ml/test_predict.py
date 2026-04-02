"""Quick multi-sample validation for predict.py"""
import json
import subprocess
import sys

SAMPLES = {
    "normal_like": {
        "age": 42, "sex": 0, "chest_pain_type": 1, "resting_bp_s": 118, "cholesterol": 184,
        "fasting_blood_sugar": 0, "resting_ecg": 0, "max_heart_rate": 172, "exercise_angina": 0,
        "oldpeak": 0.0, "ST_slope": 1,
    },
    "coronary_like": {
        "age": 62, "sex": 1, "chest_pain_type": 4, "resting_bp_s": 145, "cholesterol": 282,
        "fasting_blood_sugar": 1, "resting_ecg": 1, "max_heart_rate": 132, "exercise_angina": 1,
        "oldpeak": 2.1, "ST_slope": 3,
    },
    "arrhythmia_like": {
        "age": 57, "sex": 1, "chest_pain_type": 3, "resting_bp_s": 130, "cholesterol": 210,
        "fasting_blood_sugar": 0, "resting_ecg": 2, "max_heart_rate": 158, "exercise_angina": 0,
        "oldpeak": 0.9, "ST_slope": 2,
    },
}

for name, payload in SAMPLES.items():
    result = subprocess.run(
        [sys.executable, "predict.py", json.dumps(payload)],
        capture_output=True,
        text=True,
    )
    print(f"\n=== {name} ===")
    if result.stderr:
        print("DEBUG:", result.stderr.strip())
    data = json.loads(result.stdout)
    print("Predicted:", data["category"], "| Risk:", data["risk_level"], "| Confidence:", data["confidence"])
    print("Probabilities:", json.dumps(data["probabilities"], indent=2))
