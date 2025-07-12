package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"

	"server/db"
	"server/models"
	"server/routes"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, continuing with system envs")
	}

	// Connect to the database
	db.Connect()

	// Auto-migrate models
	if err := db.DB.AutoMigrate(&models.URL{}, &models.URLResult{}, &models.BrokenLink{}); err != nil {
		log.Fatal("❌ Failed to migrate database schema:", err)
	}
	log.Println("✅ Database migration complete")

	router := routes.SetupRouter()


	// Start server on PORT from env or default to 8080
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Println("🚀 Server running on port", port)
	router.Run(":" + port)
}
