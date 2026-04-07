package middleware

import (
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

func CORS() gin.HandlerFunc {

	// Base allowed origins
	allowedOrigins := []string{
		"http://localhost:3000",
	}

	// Add from env (comma-separated)
	if extra := os.Getenv("ALLOWED_ORIGINS"); extra != "" {
		allowedOrigins = append(allowedOrigins, strings.Split(extra, ",")...)
	}

	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		allowed := false

		if origin != "" {
			// Check static list
			for _, o := range allowedOrigins {
				if strings.TrimSpace(o) == origin {
					allowed = true
					break
				}
			}

			// Allow dynamic domains
			if strings.HasSuffix(origin, ".vercel.app") ||
				strings.HasSuffix(origin, ".onrender.com") {
				allowed = true
			}
		}

		if allowed {
			c.Header("Access-Control-Allow-Origin", origin)
			c.Header("Vary", "Origin")
		}

		c.Header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Accept")
		c.Header("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}