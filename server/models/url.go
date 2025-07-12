package models

type URL struct {
	ID        uint        `gorm:"primaryKey" json:"id"`
	CreatedAt int64       `json:"createdAt"`
	UpdatedAt int64       `json:"updatedAt"`
	Address   string      `gorm:"type:varchar(255);uniqueIndex" json:"address"`
	Status    string      `json:"status"` // e.g. queued, running, done, error
	Results   []URLResult `gorm:"foreignKey:URLID" json:"results"`
}
