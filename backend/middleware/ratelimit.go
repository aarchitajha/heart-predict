package middleware

import (
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
)

type ipRecord struct {
	count     int
	windowEnd time.Time
}

var (
	mu      sync.Mutex
	records = make(map[string]*ipRecord)
)

const (
	maxRequests = 10
	windowSize  = time.Minute
)

func RateLimiter() gin.HandlerFunc {
	// Disable rate limiting in development
	env := os.Getenv("ENV")
	if env == "development" || env == "" {
		return func(c *gin.Context) {
			c.Next()
		}
	}

	// background cleaner
	go func() {
		for {
			time.Sleep(5 * time.Minute)
			mu.Lock()
			now := time.Now()
			for ip, rec := range records {
				if now.After(rec.windowEnd) {
					delete(records, ip)
				}
			}
			mu.Unlock()
		}
	}()

	return func(c *gin.Context) {
		// Only rate-limit mutating endpoints
		if c.Request.Method == "GET" {
			c.Next()
			return
		}

		ip := c.ClientIP()
		now := time.Now()

		mu.Lock()
		rec, exists := records[ip]
		if !exists || now.After(rec.windowEnd) {
			records[ip] = &ipRecord{count: 1, windowEnd: now.Add(windowSize)}
			mu.Unlock()
			c.Next()
			return
		}
		rec.count++
		if rec.count > maxRequests {
			mu.Unlock()
			c.JSON(http.StatusTooManyRequests, gin.H{
				"error":   "rate_limit_exceeded",
				"message": "Too many requests. Limit: 10 per minute.",
			})
			c.Abort()
			return
		}
		mu.Unlock()
		c.Next()
	}
}
