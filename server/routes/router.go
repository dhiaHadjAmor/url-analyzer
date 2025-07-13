package routes

import (
	"server/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	router := gin.Default()

	// CORS middleware
  	router.Use(cors.Default())


	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// URL routes
	router.POST("/analyse", controllers.AnalyseURL)
	router.GET("/urls", controllers.GetUrls)


	return router
}