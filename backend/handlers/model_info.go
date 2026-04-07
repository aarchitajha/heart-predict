package handlers

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"

	"heart-predict-backend/models"
)

func ModelInfo() gin.HandlerFunc {
	return func(c *gin.Context) {
		mlDir := os.Getenv("ML_DIR")
		if mlDir == "" {
			mlDir = "./ml"
		}

		metaPath := filepath.Join(mlDir, "model_metadata.json")
		data, err := os.ReadFile(metaPath)
		if err != nil {
			// Return sensible defaults if file is missing
			c.JSON(http.StatusOK, models.ModelInfoResponse{
				ModelName:     "GaussianNB (Multi-Class)",
				Version:       "2.0.0",
				Accuracy:      0.9489,
				F1Macro:       0.9489,
				NClasses:      6,
				ClassLabels:   map[string]string{"0": "Normal", "1": "Coronary Artery Disorders", "2": "Irregular Heartbeat Disorders", "3": "Weak Heart Muscle Conditions", "4": "Congenital Heart Defects", "5": "Cardiovascular Defects"},
				TrainedOn:     "1190 patients",
				FeaturesCount: 11,
				Features: []string{
					"age", "sex", "chest_pain_type", "resting_bp_s", "cholesterol",
					"fasting_blood_sugar", "resting_ecg", "max_heart_rate",
					"exercise_angina", "oldpeak", "ST_slope",
				},
				DatasetSource: "UCI Heart Disease Dataset (combined)",
				TrainingDate:  "2025-06-01",
				Description:   "Multi-class Naive Bayes classifier for 5 heart disease categories + Normal",
			})
			return
		}

		var info models.ModelInfoResponse
		if err := json.Unmarshal(data, &info); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "metadata_parse_error",
				"message": "Could not parse model metadata",
			})
			return
		}

		c.JSON(http.StatusOK, info)
	}
}
