package database

import (
	"database/sql"
	"os"
	"path/filepath"

	_ "modernc.org/sqlite"
)

type Storage struct {
	db *sql.DB
}

func NewStorage() (*Storage, error) {
	// Creating app directory: user-config-dir + app-name
	configDir, err := os.UserConfigDir()
	if err != nil {
		return nil, err
	}

	appDir := filepath.Join(configDir, "gemini-desktop")
	if err := os.MkdirAll(appDir, 0755); err != nil { // Create app directory with permission 755
		return nil, err
	}

	// Path to database file in app directory
	dbPath := filepath.Join(appDir, "app.db")
	dsn := "file:" + dbPath + "?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)" // WAL

	// Preparing database structure
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}

	// Check if database is alive
	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Storage{db}, nil
}

func (s *Storage) Close() error {
	if err := s.db.Close(); err != nil {
		return err
	}

	return nil
}
