package services

import (
	"errors"
	"server/crawler"
	"server/db"
	"server/models"
)

func CreateURL(address string) (*models.URL, error) {
	var existing models.URL

	// Check if already exists
	if err := db.DB.Where("address = ?", address).First(&existing).Error; err == nil {
		return &existing, nil
	}

	// Create new URL record
	url := models.URL{
		Address: address,
		Status:  "queued",
	}

	if err := db.DB.Create(&url).Error; err != nil {
		return nil, errors.New("failed to save URL")
	}

	// Start crawling asynchronously
	go crawler.CrawlAndAnalyse(url)

	return &url, nil
}
