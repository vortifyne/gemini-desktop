package database

import (
	"database/sql"
	"testing"

	_ "modernc.org/sqlite"
)

func setupTestDB(t *testing.T) *Storage {
	t.Helper()

	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("failed to open in-memory database: %v", err)
	}

	storage := &Storage{db}
	if err := storage.runMigrations(); err != nil {
		t.Fatalf("failed to run database migrations: %v", err)
	}

	return storage
}
