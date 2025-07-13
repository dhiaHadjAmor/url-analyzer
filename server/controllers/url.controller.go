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