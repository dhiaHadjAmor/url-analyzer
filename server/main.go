package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"server/db"
	"server/models"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, continuing with system envs")
	}

	// Connect to the database
	db.Connect()

	// Auto-migrate models
	if err := db.DB.AutoMigrate(&models.URL{}, &models.URLResult{}); err != nil {
		log.Fatal("❌ Failed to migrate database schema:", err)
	}
	log.Println("✅ Database migration complete")

	// Setup Gin
	router := gin.Default()

	// Add a basic health check route
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Start server on PORT from env or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("🚀 Server running on port", port)
	router.Run(":" + port)
}
