package database

import (
	"database/sql"
	"testing"
)

func setupTestDB(t *testing.T) *Storage {
	db, err := sql.Open("sqlite", ":memory:")
	if err != nil {
		t.Fatalf("Failed to open in-memory database: %v", err)
	}

	storage := &Storage{db}
	if err := storage.runMigrations(); err != nil {
		t.Fatalf("Failed to run database migrations: %v", err)
	}

	return storage
}

func TestChatCRUD(t *testing.T) {
	// Initialize database
	storage := setupTestDB(t)
	defer func() {
		_ = storage.Close()
	}()

	// Create first chat in database
	chatId, err := storage.CreateChat("test chat 1")
	if err != nil || chatId < 0 {
		t.Fatalf("CreateChat occurred error: %v", err)
	}

	// Add messages from role:user and role:model
	if err := storage.SaveMessage(chatId, "user", "API give me response"); err != nil {
		t.Fatalf("SaveMessage occurred error (user role): %v", err)
	}
	if err := storage.SaveMessage(chatId, "model", "API gave response to user"); err != nil {
		t.Fatalf("SaveMessage occurred error (user role): %v", err)
	}

	// Extract messages added before
	extractedMsgs, err := storage.GetMessages(chatId)
	if err != nil {
		t.Fatalf("GetMessages occurred error: %v", err)
	}
	if len(extractedMsgs) != 2 {
		t.Fatalf("Extracted messages count incorrect. Extracted: %d; Should return 2", len(extractedMsgs))
	}
	if extractedMsgs[0].Role != "user" {
		t.Fatalf("extractedMsgs[0] role incorrect: %s", extractedMsgs[0].Role)
	}
	if extractedMsgs[1].Role != "model" {
		t.Fatalf("extractedMsgs[1] role incorrect: %s", extractedMsgs[1].Role)
	}
}
