package routes

import (
	"server/controllers"
	"server/middlewares"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// CORS middleware
	// Allow frontend origin and custom headers
	config := cors.Config{
		AllowOrigins:     []string{
			"http://localhost:5173", // local dev (Vite)
			"http://localhost:3000", // Docker frontend
		},
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "x-api-key"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}

	router.Use(cors.New(config))

	// Public route for health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Protected routes
	protected := router.Group("/")
	protected.Use(middlewares.AuthMiddleware())
	{
		protected.POST("/analyse", controllers.AnalyseURL)
		protected.GET("/urls", controllers.GetUrls)
		protected.GET("/urls/:id", controllers.GetUrlDetails)
		protected.POST("/urls/rerun", controllers.RerunUrlsHandler)
		protected.POST("/urls/stop", controllers.StopUrlsHandler)
		protected.DELETE("/urls", controllers.DeleteUrlsHandler)
	}

	return router
}
