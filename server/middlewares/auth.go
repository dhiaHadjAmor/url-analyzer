package middlewares

import (
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

// AuthMiddleware checks for a valid API key in the request header
// It returns a 401 Unauthorized response if the key is missing or invalid.
// Basic authentication is used for simplicity, but you can replace it with a more secure method if needed.

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		expectedToken := os.Getenv("API_KEY")
		providedToken := c.GetHeader("x-api-key")

		if expectedToken == "" || providedToken != expectedToken {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			return
		}

		c.Next()
	}
}
