package crawler

import (
	"log"
	"net/http"
	"net/url"
	"strings"
	"time"

	"server/db"
	"server/models"

	"github.com/PuerkitoBio/goquery"
)

func CrawlAndAnalyse(url models.URL) {
	// Set status to running
	db.DB.Model(&url).Update("status", "running")

	resp, err := http.Get(url.Address)
	if err != nil {
		log.Println("❌ Failed to fetch URL:", err)
		db.DB.Model(&url).Update("status", "error")
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		log.Println("❌ URL returned error status:", resp.Status)
		db.DB.Model(&url).Update("status", "error")
		return
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		log.Println("❌ Failed to parse HTML:", err)
		db.DB.Model(&url).Update("status", "error")
		return
	}

	// Analyse
	result := models.URLResult{
		URLID:        url.ID,
		PageTitle:    doc.Find("title").Text(),
		HTMLVersion:  detectHTMLVersion(resp.Proto),
		HasLoginForm: detectLoginForm(doc),
	}

	// Headings
	result.Headings.H1 = doc.Find("h1").Length()
	result.Headings.H2 = doc.Find("h2").Length()
	result.Headings.H3 = doc.Find("h3").Length()
	result.Headings.H4 = doc.Find("h4").Length()
	result.Headings.H5 = doc.Find("h5").Length()
	result.Headings.H6 = doc.Find("h6").Length()

	// Links
	internal, external, brokenLinks := analyzeLinks(doc, url.Address, url.ID, result.ID)
	result.LinksInternal = internal
	result.LinksExternal = external
	


	// Save result
	if err := db.DB.Create(&result).Error; err != nil {
		log.Println("❌ Failed to save result:", err)
		db.DB.Model(&url).Update("status", "error")
		return
	}

	// Assign the result ID to broken links
	for i := range brokenLinks {
		brokenLinks[i].URLResultID = result.ID
	}

	// Save broken links
	if len(brokenLinks) > 0 {
		if err := db.DB.Create(&brokenLinks).Error; err != nil {
			log.Println("❌ Failed to save broken links:", err)
		}
	}

	db.DB.Model(&url).Update("status", "done")
	log.Println("✅ Analysis complete for:", url.Address)
}

func detectHTMLVersion(proto string) string {
	if strings.Contains(proto, "1.1") {
		return "HTML 4.x / XHTML"
	}
	return "HTML5"
}

func detectLoginForm(doc *goquery.Document) bool {
	login := false
	doc.Find("form").Each(func(i int, s *goquery.Selection) {
		if s.Find("input[type='password']").Length() > 0 {
			login = true
		}
	})
	return login
}


func analyzeLinks(doc *goquery.Document, baseAddress string, urlID uint, resultId uint) (internal int, external int, brokenLinks []models.BrokenLink) {
	seen := make(map[string]bool)
	baseURL, _ := url.Parse(baseAddress)

	doc.Find("a[href]").Each(func(i int, s *goquery.Selection) {
		href, _ := s.Attr("href")
		link, err := url.Parse(href)
		if err != nil {
			return
		}

		fullURL := baseURL.ResolveReference(link).String()
		if seen[fullURL] {
			return
		}
		seen[fullURL] = true

		if link.Host == "" || link.Host == baseURL.Host {
			internal++
		} else {
			external++
		}

		client := http.Client{Timeout: 5 * time.Second}
		resp, err := client.Get(fullURL)
		if err != nil || (resp != nil && resp.StatusCode >= 400) {

			statusCode := 404
			if resp != nil {
				statusCode = resp.StatusCode
				resp.Body.Close()
			}

			brokenLinks = append(brokenLinks, models.BrokenLink{
				URLID:  urlID,
				URLResultID: resultId,
				Link:   fullURL,
				Status: statusCode,
			})
		}
	})

	return
}

func AnalyzeUrlByID(id uint) error {
	var url models.URL
	if err := db.DB.First(&url, id).Error; err != nil {
		return err
	}

	go CrawlAndAnalyse(url) // Run in goroutine for async behavior
	return nil
}