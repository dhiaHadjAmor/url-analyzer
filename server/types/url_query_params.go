package types

import "server/models"

type PaginatedUrls struct {
	Urls  []models.URL
	Total int64
}

type UrlQueryParams struct {
	Page      int    `form:"page"`
	Limit     int    `form:"limit"`
	SortBy    string `form:"sortBy"`
	SortOrder string `form:"sortOrder"`
	Search    string `form:"search"`
}