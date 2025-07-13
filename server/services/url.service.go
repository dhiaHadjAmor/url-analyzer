package services

import (
	"errors"
	"server/crawler"
	"server/db"
	"server/models"
	"server/types"
	"strings"
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

func GetPaginatedUrls(params types.UrlQueryParams) (types.PaginatedUrls, error) {
	if params.Page <= 0 {
		params.Page = 1
	}
	if params.Limit <= 0 {
		params.Limit = 10
	}
	if params.SortBy == "" {
		params.SortBy = "created_at"
	}
	if params.SortOrder == "" {
		params.SortOrder = "desc"
	}

	offset := (params.Page - 1) * params.Limit
	sort := params.SortBy + " " + strings.ToLower(params.SortOrder)

	var urls []models.URL
	var total int64

	query := db.DB.
		Model(&models.URL{}).
		Preload("Result")

	if params.Search != "" {
		searchPattern := "%" + params.Search + "%"
		query = query.
			Joins("LEFT JOIN url_results AS result ON result.url_id = urls.id").
			Where("urls.address LIKE ? OR result.page_title LIKE ?", searchPattern, searchPattern)
	}

	if err := query.Count(&total).Error; err != nil {
		return types.PaginatedUrls{}, err
	}

	if err := query.
		Order(sort).
		Offset(offset).
		Limit(params.Limit).
		Find(&urls).Error; err != nil {
		return types.PaginatedUrls{}, err
	}

	return types.PaginatedUrls{
		Urls:  urls,
		Total: total,
	}, nil
}