package domain

import (
	"path/filepath"
	"strings"
)

type Attachment struct {
	FileName string
	MimeType string
	Data     []byte
}

func IsTextFile(filename string) bool {
	ext := strings.ToLower(filepath.Ext(filename))
	switch ext {
	case ".txt", ".go", ".js", ".ts", ".py", ".html", ".css", ".json", ".md", ".sql", ".sh", ".yaml", ".yml", ".xml", ".csv", ".log":
		return true
	}
	return false
}
