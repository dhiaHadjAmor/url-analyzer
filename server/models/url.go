package models

type URL struct {
	ID        uint        `gorm:"primaryKey" json:"id"`
	CreatedAt int64       `json:"created_at"`
	UpdatedAt int64       `json:"updated_at"`
	Address   string      `gorm:"type:varchar(255);uniqueIndex"`
	Status    string      `json:"status"` // e.g. queued, running, done, error
	Results   []URLResult `gorm:"foreignKey:URLID"`
}
