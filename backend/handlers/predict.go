package handlers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"heart-predict-backend/models"
	"heart-predict-backend/utils"
)

func Predict() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req models.PredictRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":   "validation_error",
				"message": "Invalid request body: " + err.Error(),
			})
			return
		}

		// ── Field-level range validation ─────────────────────
		fields := req.FieldMap()
		for field, val := range fields {
			r, ok := models.Ranges[field]
			if !ok {
				continue
			}
			if val < r.Min || val > r.Max {
				c.JSON(http.StatusBadRequest, gin.H{
					"error":   "validation_error",
					"message": fmt.Sprintf("%s must be between %.0f and %.0f", field, r.Min, r.Max),
					"field":   field,
				})
				return
			}
		}

		// ── Run Python inference ──────────────────────────────
		resp, err := utils.RunInference(&req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"error":   "inference_error",
				"message": "Model inference failed: " + err.Error(),
			})
			return
		}

		c.JSON(http.StatusOK, resp)
	}
}
