package types

import "server/models"

type URLDetailsResponse struct {
	InternalLinks int                 `json:"internalLinks"`
	ExternalLinks int                 `json:"externalLinks"`
	BrokenLinks   []models.BrokenLink `json:"brokenLinks"`
}
