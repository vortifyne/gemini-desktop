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

	// Extract all created chats
	extractedChats, err := storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats failed to test: %v", err)
	}
	if len(extractedChats) != 1 {
		t.Fatalf("incorrect extracted chat count: %v", err)
	}

	// Update chat title
	newTitle := "updated chat title"
	if err := storage.UpdateChatTitle(chatId, newTitle); err != nil {
		t.Fatalf("UpdateChatTitle returned error: %v", err)
	}

	extractedChats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats after title update failed: %v", err)
	}
	if extractedChats[0].Title != newTitle {
		t.Fatalf("UpdateChatTitle mismatch. Expected: %s, Got: %s", newTitle, extractedChats[0].Title)
	}

	// Test sort by DESC in GetChats()
	chatId2, err := storage.CreateChat("test chat 2")
	if err != nil {
		t.Fatalf("CreateChat for second chat failed: %v", err)
	}

	extractedChats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats failed: %v", err)
	}
	if len(extractedChats) != 2 {
		t.Fatalf("Expected 2 chats, got %d", len(extractedChats))
	}
	if extractedChats[0].ID != chatId2 {
		t.Fatalf("GetChats sorting order incorrect: expected chat ID %d first, got %d", chatId2, extractedChats[0].ID)
	}

	// Last response deletion test
	if err := storage.DeleteLastResponse(chatId); err != nil {
		t.Fatalf("DeleteLastResponse returned error: %v", err)
	}

	extractedMsgs, err = storage.GetMessages(chatId)
	if err != nil {
		t.Fatalf("GetMessages after DeleteLastResponse failed: %v", err)
	}
	if len(extractedMsgs) != 1 {
		t.Fatalf("Expected 1 message left after DeleteLastResponse, got %d", len(extractedMsgs))
	}
	if extractedMsgs[0].Role != "user" {
		t.Fatalf("Remaining message role should be 'user', got '%s'", extractedMsgs[0].Role)
	}

	// Delete all chat
	if err := storage.DeleteChat(chatId); err != nil {
		t.Fatalf("DeleteChat returned error: %v", err)
	}

	// Check if one chat left
	extractedChats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats after DeleteChat failed: %v", err)
	}
	if len(extractedChats) != 1 {
		t.Fatalf("Expected 1 chat remaining after deletion, got %d", len(extractedChats))
	}
	if extractedChats[0].ID != chatId2 {
		t.Fatalf("Expected remaining chat ID to be %d, got %d", chatId2, extractedChats[0].ID)
	}

	// Check orphans after chat deletion
	deletedChatMsgs, err := storage.GetMessages(chatId)
	if err != nil {
		t.Fatalf("GetMessages for deleted chat failed: %v", err)
	}
	if len(deletedChatMsgs) != 0 {
		t.Fatalf("Expected 0 messages for deleted chat, got %d", len(deletedChatMsgs))
	}
}
