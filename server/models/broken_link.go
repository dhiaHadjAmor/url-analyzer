package models

import "time"

type BrokenLink struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	URLID     uint      `json:"urlId"`           // foreign key to URL
	URLResultID uint  `json:"url_result_id"` // foreign key to result
	Link      string    `gorm:"type:text" json:"link"`
	Status    int       `json:"statusCode"`      // e.g. 404, 500
	CreatedAt time.Time `json:"createdAt"`
}
