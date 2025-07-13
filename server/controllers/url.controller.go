package controllers

import (
	"net/http"
	"server/services"
	"server/types"
	"strconv"

	"github.com/gin-gonic/gin"
)

type URLRequest struct {
	Address string `json:"address" binding:"required,url"`
}

type BulkUrlRequest struct {
	IDs []uint `json:"ids"`
}


func AnalyseURL(c *gin.Context) {
	var req URLRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid URL"})
		return
	}

	url, err := services.CreateURL(req.Address)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, url)
}

func GetUrls(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "10"))
	sortBy := c.DefaultQuery("sortBy", "created_at")
	sortOrder := c.DefaultQuery("sortOrder", "desc")
	search := c.DefaultQuery("search", "")

	result, err := services.GetPaginatedUrls(types.UrlQueryParams{
		Page:      page,
		Limit:     limit,
		SortBy:    sortBy,
		SortOrder: sortOrder,
		Search:    search,
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to load URLs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data": result.Urls,
		"meta": gin.H{
			"page":  page,
			"limit": limit,
			"total": result.Total,
		},
	})
}

func RerunUrlsHandler(c *gin.Context) {
	var req BulkUrlRequest
	if err := c.ShouldBindJSON(&req); err != nil || len(req.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing IDs"})
		return
	}

	if err := services.RerunUrls(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to re-analyze URLs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Re-analysis started"})
}

func StopUrlsHandler(c *gin.Context) {
	var req BulkUrlRequest
	if err := c.ShouldBindJSON(&req); err != nil || len(req.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing IDs"})
		return
	}

	if err := services.StopUrls(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to stop analysis"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Analysis stopped"})
}

func DeleteUrlsHandler(c *gin.Context) {
	var req BulkUrlRequest
	if err := c.ShouldBindJSON(&req); err != nil || len(req.IDs) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or missing IDs"})
		return
	}

	if err := services.DeleteUrls(req.IDs); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete URLs"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "URLs deleted"})
}

func GetUrlDetails(c *gin.Context) {
	idParam := c.Param("id")
	id, err := strconv.Atoi(idParam)
	if err != nil || id <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}

	details, err := services.GetUrlDetails(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "URL not found"})
		return
	}

	c.JSON(http.StatusOK, details)
}