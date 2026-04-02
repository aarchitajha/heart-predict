// ─── Request ───────────────────────────────────────────────
export interface PredictRequest {
  age: number;
  sex: number;                  // 0=Female, 1=Male
  chest_pain_type: number;      // 1–4
  resting_bp_s: number;         // 80–200 mm Hg
  cholesterol: number;          // 100–603 mg/dL
  fasting_blood_sugar: number;  // 0 or 1
  resting_ecg: number;          // 0–2
  max_heart_rate: number;       // 60–202 bpm
  exercise_angina: number;      // 0 or 1
  oldpeak: number;              // -3 to 7
  ST_slope: number;             // 0–3
}

// ─── Response ──────────────────────────────────────────────
export type RiskLevel = "High" | "Medium" | "Low";

export interface RiskFactor {
  feature: string;
  value: number;
  impact: "high" | "medium" | "low";
}

export interface PredictResponse {
  predicted_class: number;
  category: string;
  category_description: string;
  risk_level: RiskLevel;
  confidence: string;
  probability: number;
  probabilities: Record<string, number>;
  risk_factors: RiskFactor[];
}

// ─── Model Info ────────────────────────────────────────────
export interface ModelInfo {
  model_name: string;
  version: string;
  accuracy: number;
  f1_macro: number;
  n_classes: number;
  class_labels: Record<string, string>;
  trained_on: string;
  features_count: number;
  features: string[];
  dataset_source: string;
  training_date: string;
  description: string;
}

// ─── Health ────────────────────────────────────────────────
export interface HealthResponse {
  status: "ok" | "error";
  model?: string;
  version?: string;
  uptime?: string;
  message?: string;
}

// ─── Report ────────────────────────────────────────────────
export interface ReportRequest {
  patient_data: PredictRequest;
  result: PredictResponse;
}
