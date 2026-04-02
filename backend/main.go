package main

import (
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"

	"heart-predict-backend/handlers"
	"heart-predict-backend/middleware"
)

var startTime = time.Now()

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if os.Getenv("ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// ── Middleware ──────────────────────────────────────────
	r.Use(middleware.CORS())
	r.Use(middleware.RateLimiter())

	// ── Routes ─────────────────────────────────────────────
	r.GET("/health",     handlers.Health(startTime))
	r.POST("/predict",   handlers.Predict())
	r.GET("/model-info", handlers.ModelInfo())
	r.POST("/report",    handlers.Report())

	log.Printf("HeartPredict API starting on :%s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
