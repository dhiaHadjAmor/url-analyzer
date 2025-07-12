package models

type URLResult struct {
	ID            uint `gorm:"primaryKey"`
	URLID         uint `json:"url_id"`
	HTMLVersion   string
	PageTitle     string
	Headings      HeadingCount `gorm:"embedded" json:"headings"`
	LinksInternal int
	LinksExternal int
	LinksBroken   int
	HasLoginForm  bool
}

type HeadingCount struct {
	H1 int `json:"h1"`
	H2 int `json:"h2"`
	H3 int `json:"h3"`
	H4 int `json:"h4"`
	H5 int `json:"h5"`
	H6 int `json:"h6"`
}