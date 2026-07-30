package database

import (
	"database/sql"
	"embed"
	"errors"
	"os"
	"path/filepath"

	"github.com/pressly/goose/v3"
	_ "modernc.org/sqlite"
)

//go:embed migrations/*.sql
var embedMigrations embed.FS

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
	dsn := "file:" + dbPath + "?_pragma=journal_mode(WAL)&_pragma=busy_timeout(5000)&_pragma=synchronous(NORMAL)"

	// Preparing database structure
	db, err := sql.Open("sqlite", dsn)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1)
	db.SetMaxIdleConns(1)

	// Check if database is alive
	if err := db.Ping(); err != nil {
		return nil, err
	}

	dbStorage := &Storage{db}
	if err := dbStorage.runMigrations(); err != nil {
		closeErr := dbStorage.Close()
		return nil, errors.Join(err, closeErr)
	}

	return dbStorage, nil
}

func (s *Storage) Close() error {
	if err := s.db.Close(); err != nil {
		return err
	}

	return nil
}

func (s *Storage) runMigrations() error {
	goose.SetBaseFS(embedMigrations)

	if err := goose.SetDialect("sqlite3"); err != nil {
		return err
	}

	if err := goose.Up(s.db, "migrations"); err != nil {
		return err
	}

	return nil
}
