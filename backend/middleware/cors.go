package middleware

import (
	"os"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {
	allowedOrigins := []string{
    "https://heart-predict.vercel.app",
    "https://heart-predict-vcuh.vercel.app",
    "http://localhost:3000",
}
	if extra := os.Getenv("ALLOWED_ORIGINS"); extra != "" {
		allowedOrigins = append(allowedOrigins, strings.Split(extra, ",")...)
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowed := false
		for _, o := range allowedOrigins {
			if strings.TrimSpace(o) == origin {
				allowed = true
				break
			}
		}

		if allowed {
			c.Header("Access-Control-Allow-Origin",  origin)
			c.Header("Vary", "Origin")
		}
		c.Header("Access-Control-Allow-Methods",  "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers",  "Content-Type, Accept")
		c.Header("Access-Control-Max-Age",        "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		_ = time.Now() // keep import happy if no other usage
		c.Next()
	}
}
