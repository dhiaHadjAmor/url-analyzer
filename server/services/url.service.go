package services

import (
	"errors"
	"server/crawler"
	"server/db"
	"server/models"
	"server/types"
	"strings"
	"time"

	"gorm.io/gorm"
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
		Preload("Result").
		Preload("Result.BrokenLinks")

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

func RerunUrls(ids []uint) error {
	return db.DB.Transaction(func(tx *gorm.DB) error {
		for _, id := range ids {
			// Reset the status and updated time
			if err := tx.Model(&models.URL{}).Where("id = ?", id).
				Updates(map[string]interface{}{
					"status":     "queued",
					"updated_at": time.Now(),
				}).Error; err != nil {
				return err
			}

			//  delete broken links for the result(s) of this URL
			if err := tx.Where("url_id = ?", id).Delete(&models.BrokenLink{}).Error; err != nil {
				return err
			}

			//  delete the result itself
			if err := tx.Where("url_id = ?", id).Delete(&models.URLResult{}).Error; err != nil {
				return err
			}

			// Start analysis again
			go crawler.AnalyzeUrlByID(id)
		}
		return nil
	})
}


func StopUrls(ids []uint) error {
	return db.DB.Model(&models.URL{}).Where("id IN ?", ids).
		Update("status", "error").Error
}

func DeleteUrls(ids []uint) error {
	return db.DB.Transaction(func(tx *gorm.DB) error {
		// Find related result IDs
		var resultIDs []uint
		if err := tx.Model(&models.URLResult{}).
			Where("url_id IN ?", ids).
			Pluck("id", &resultIDs).Error; err != nil {
			return err
		}

		// Delete broken links
		if len(resultIDs) > 0 {
			if err := tx.Where("url_result_id IN ?", resultIDs).
				Delete(&models.BrokenLink{}).Error; err != nil {
				return err
			}
		}

		// Delete url_results
		if err := tx.Where("url_id IN ?", ids).
			Delete(&models.URLResult{}).Error; err != nil {
			return err
		}

		// Delete urls
		if err := tx.Where("id IN ?", ids).
			Delete(&models.URL{}).Error; err != nil {
			return err
		}

		return nil
	})
}


func GetUrlDetails(id uint) (map[string]interface{}, error) {
	var url models.URL

	// Load URL and associated result + broken links
	if err := db.DB.Preload("Result.BrokenLinks").First(&url, id).Error; err != nil {
		return nil, err
	}

	if url.Result.ID == 0 {
		return map[string]interface{}{
			"id":     url.ID,
			"status": url.Status,
			"error":  "No result available",
		}, nil
	}

	result := url.Result

	return map[string]interface{}{
		"id":             url.ID,
		"address":        url.Address,
		"status":         url.Status,
		"createdAt":      url.CreatedAt,
		"pageTitle":      result.PageTitle,
		"htmlVersion":    result.HTMLVersion,
		"hasLoginForm":   result.HasLoginForm,
		"headings":       result.Headings,
		"linksInternal":  result.LinksInternal,
		"linksExternal":  result.LinksExternal,
		"brokenLinks":    result.BrokenLinks,
	}, nil
}