package models

// ── Request ─────────────────────────────────────────────────

type PredictRequest struct {
	Age               float64 `json:"age"`
	Sex               float64 `json:"sex"`
	ChestPainType     float64 `json:"chest_pain_type"`
	RestingBPS        float64 `json:"resting_bp_s"`
	Cholesterol       float64 `json:"cholesterol"`
	FastingBloodSugar float64 `json:"fasting_blood_sugar"`
	RestingECG        float64 `json:"resting_ecg"`
	MaxHeartRate      float64 `json:"max_heart_rate"`
	ExerciseAngina    float64 `json:"exercise_angina"`
	Oldpeak           float64 `json:"oldpeak"`
	STSlope           float64 `json:"ST_slope"`
}

// ── Validation ──────────────────────────────────────────────

type FieldRange struct {
	Min, Max float64
}

var Ranges = map[string]FieldRange{
	"age":                 {1, 100},
	"sex":                 {0, 1},
	"chest_pain_type":     {1, 4},
	"resting_bp_s":        {80, 200},
	"cholesterol":         {100, 603},
	"fasting_blood_sugar": {0, 1},
	"resting_ecg":         {0, 2},
	"max_heart_rate":      {60, 202},
	"exercise_angina":     {0, 1},
	"oldpeak":             {-3, 7},
	"ST_slope":            {0, 3},
}

func (r *PredictRequest) FieldMap() map[string]float64 {
	return map[string]float64{
		"age":                 r.Age,
		"sex":                 r.Sex,
		"chest_pain_type":     r.ChestPainType,
		"resting_bp_s":        r.RestingBPS,
		"cholesterol":         r.Cholesterol,
		"fasting_blood_sugar": r.FastingBloodSugar,
		"resting_ecg":         r.RestingECG,
		"max_heart_rate":      r.MaxHeartRate,
		"exercise_angina":     r.ExerciseAngina,
		"oldpeak":             r.Oldpeak,
		"ST_slope":            r.STSlope,
	}
}

// ── Response (Multi-Class) ───────────────────────────────────

type RiskFactor struct {
	Feature string  `json:"feature"`
	Value   float64 `json:"value"`
	Impact  string  `json:"impact"`
}

type PredictResponse struct {
	PredictedClass      int                `json:"predicted_class"`
	Category            string             `json:"category"`
	CategoryDescription string             `json:"category_description"`
	RiskLevel           string             `json:"risk_level"`
	Confidence          string             `json:"confidence"`
	Probability         float64            `json:"probability"`
	Probabilities       map[string]float64 `json:"probabilities"`
	RiskFactors         []RiskFactor       `json:"risk_factors"`
}

// ── Health ───────────────────────────────────────────────────

type HealthResponse struct {
	Status  string `json:"status"`
	Model   string `json:"model,omitempty"`
	Version string `json:"version,omitempty"`
	Uptime  string `json:"uptime,omitempty"`
	Message string `json:"message,omitempty"`
}

// ── ModelInfo ────────────────────────────────────────────────

type ModelInfoResponse struct {
	ModelName       string            `json:"model_name"`
	Version         string            `json:"version"`
	Accuracy        float64           `json:"accuracy"`
	F1Macro         float64           `json:"f1_macro"`
	NClasses        int               `json:"n_classes"`
	ClassLabels     map[string]string `json:"class_labels"`
	TrainedOn       string            `json:"trained_on"`
	FeaturesCount   int               `json:"features_count"`
	Features        []string          `json:"features"`
	DatasetSource   string            `json:"dataset_source"`
	TrainingDate    string            `json:"training_date"`
	Description     string            `json:"description"`
}

// ── Report ───────────────────────────────────────────────────

type ReportRequest struct {
	PatientData PredictRequest  `json:"patient_data"`
	Result      PredictResponse `json:"result"`
}
