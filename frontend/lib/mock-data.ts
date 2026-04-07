import { PredictRequest, PredictResponse } from "@/types/prediction";
import { AssessmentRecord } from "./db";

export const MOCK_USER = {
  id: "user-123",
  name: "Dr. Sarah Mitchell",
  email: "s.mitchell@hospital.org",
  avatar: "https://github.com/shadcn.png",
  role: "Lead Cardiologist",
  hospital: "St. Mary's Medical Center",
};

export const MOCK_RECORDS: AssessmentRecord[] = [
  {
    id: "rec-7a2b",
    userId: "user-123",
    date: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    request: {
      age: 62, sex: 1, chest_pain_type: 4, resting_bp_s: 145, cholesterol: 289,
      fasting_blood_sugar: 1, max_heart_rate: 120, resting_ecg: 1, exercise_angina: 1, oldpeak: 2.5, ST_slope: 2,
    },
    response: buildMockResponse("Coronary Artery Disorders", "High", 0.894)
  },
  {
    id: "rec-1c4d",
    userId: "user-123",
    date: new Date(Date.now() - 1000 * 60 * 120).toISOString(), // 2 hours ago
    request: {
      age: 45, sex: 0, chest_pain_type: 2, resting_bp_s: 120, cholesterol: 210,
      fasting_blood_sugar: 0, max_heart_rate: 165, resting_ecg: 0, exercise_angina: 0, oldpeak: 0.0, ST_slope: 1,
    },
    response: buildMockResponse("Normal", "Low", 0.125)
  },
  {
    id: "rec-8f9g",
    userId: "user-123",
    date: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    request: {
      age: 54, sex: 1, chest_pain_type: 3, resting_bp_s: 135, cholesterol: 250,
      fasting_blood_sugar: 0, max_heart_rate: 148, resting_ecg: 0, exercise_angina: 0, oldpeak: 1.2, ST_slope: 2,
    },
    response: buildMockResponse("Irregular Heartbeat Disorders", "Medium", 0.542)
  },
  {
    id: "rec-9k2j",
    userId: "user-123",
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    request: {
      age: 70, sex: 1, chest_pain_type: 4, resting_bp_s: 160, cholesterol: 310,
      fasting_blood_sugar: 1, max_heart_rate: 110, resting_ecg: 2, exercise_angina: 1, oldpeak: 3.0, ST_slope: 3,
    },
    response: buildMockResponse("Weak Heart Muscle Conditions", "High", 0.957)
  },
];

export const MOCK_STATS = {
  totalPredictions: 1248,
  highRiskCount: 342,
  avgAccuracy: 94.2,
  avgLatency: 0.85,
  monthlyChange: 12, // +12%
};

function buildMockResponse(category: string, riskLevel: "High" | "Medium" | "Low", probability: number): PredictResponse {
  return {
    predicted_class: 1,
    category,
    category_description: "Mocked response used for local UI scaffolding.",
    risk_level: riskLevel,
    confidence: `${(probability * 100).toFixed(1)}%`,
    probability,
    probabilities: {
      Normal: riskLevel === "Low" ? 0.8 : 0.05,
      "Coronary Artery Disorders": category === "Coronary Artery Disorders" ? probability : 0.05,
      "Irregular Heartbeat Disorders": category === "Irregular Heartbeat Disorders" ? probability : 0.05,
      "Weak Heart Muscle Conditions": category === "Weak Heart Muscle Conditions" ? probability : 0.05,
      "Congenital Heart Defects": 0.03,
      "Cardiovascular Defects": 0.02,
    },
    risk_factors: [],
  };
}
