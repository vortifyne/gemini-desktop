package domain

import (
	"path/filepath"
	"strings"
)

type Attachment struct {
	FileName string `json:"file_name"`
	MimeType string `json:"mime_type"`
	Data     []byte `json:"data"`
}

func IsTextFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".txt", ".go", ".js", ".ts", ".py", ".html", ".css", ".json", ".md", ".sql", ".sh", ".yaml", ".yml", ".xml", ".csv", ".log":
		return true
	}
	return false
}
