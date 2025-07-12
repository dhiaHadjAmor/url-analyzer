package controllers

import (
	"net/http"
	"server/db"
	"server/models"
	"server/services"
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

func GetURLs(c *gin.Context) {
	// Pagination params (default to page 1, size 10)
	pageStr := c.DefaultQuery("page", "1")
	limitStr := c.DefaultQuery("limit", "10")

	page, _ := strconv.Atoi(pageStr)
	limit, _ := strconv.Atoi(limitStr)
	offset := (page - 1) * limit

	var urls []models.URL

	// Preload result for summary data
	if err := db.DB.Preload("Results.BrokenLinks").Offset(offset).Limit(limit).Find(&urls).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch URLs"})
		return
	}

	// Transform result
	var response []gin.H
	for _, u := range urls {
		var res models.URLResult
		if len(u.Results) > 0 {
			res = u.Results[len(u.Results)-1] // latest result
		}
		response = append(response, gin.H{
			"id":             u.ID,
			"address":        u.Address,
			"status":         u.Status,
			"pageTitle":     res.PageTitle,
			"htmlVersion":   res.HTMLVersion,
			"linksInternal": res.LinksInternal,
			"linksExternal": res.LinksExternal,
			"brokenLinks":   res.BrokenLinks,
			"createdAt":     u.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"page":     page,
		"limit":    limit,
		"results":  response,
	})
}