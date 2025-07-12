package controllers

import (
	"net/http"
	"server/services"

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