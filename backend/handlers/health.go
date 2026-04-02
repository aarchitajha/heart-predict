package handlers

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"

	"heart-predict-backend/models"
)

func Health(start time.Time) gin.HandlerFunc {
	return func(c *gin.Context) {
		mlDir := os.Getenv("ML_DIR")
		if mlDir == "" {
			mlDir = "./ml"
		}

		// Check model files exist
		modelPath  := filepath.Join(mlDir, "model.pkl")
		scalerPath := filepath.Join(mlDir, "scaler.pkl")

		if _, err := os.Stat(modelPath); os.IsNotExist(err) {
			c.JSON(http.StatusServiceUnavailable, models.HealthResponse{
				Status:  "error",
				Message: "Model file not found",
			})
			return
		}
		if _, err := os.Stat(scalerPath); os.IsNotExist(err) {
			c.JSON(http.StatusServiceUnavailable, models.HealthResponse{
				Status:  "error",
				Message: "Scaler file not found",
			})
			return
		}

		uptime := time.Since(start)
		h := int(uptime.Hours())
		m := int(uptime.Minutes()) % 60

		c.JSON(http.StatusOK, models.HealthResponse{
			Status:  "ok",
			Model:   "GaussianNB",
			Version: "1.0.0",
			Uptime:  fmt.Sprintf("%dh %dm", h, m),
		})
	}
}
