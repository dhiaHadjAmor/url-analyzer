package models

type URLResult struct {
	ID            uint         `gorm:"primaryKey"`
	URLID         uint         `json:"urlId"`
	HTMLVersion   string       `json:"htmlVersion"`
	PageTitle     string       `json:"pageTitle"`
	Headings      HeadingCount `gorm:"embedded" json:"headings"`
	LinksInternal int          `json:"linksInternal"`
	LinksExternal int          `json:"linksExternal"`
	BrokenLinks   []BrokenLink `gorm:"foreignKey:URLResultID" json:"brokenLinks"`
	HasLoginForm  bool         `json:"hasLoginForm"`
}

type HeadingCount struct {
	H1 int `json:"h1"`
	H2 int `json:"h2"`
	H3 int `json:"h3"`
	H4 int `json:"h4"`
	H5 int `json:"h5"`
	H6 int `json:"h6"`
}