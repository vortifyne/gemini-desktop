package database

import (
	"testing"

	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func TestBookmarksCRUD(t *testing.T) {
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	// Create test chat
	chatID, err := storage.CreateChat("Bookmarks Test Chat")
	if err != nil {
		t.Fatalf("CreateChat() failed: %v", err)
	}

	// Mock request/response
	userPrompt := "Explain Goroutines in Go"
	aiAnswer := "Goroutines are lightweight threads managed by Go runtime."

	err = storage.SaveMessages(
		chatID,
		domain.MessageItem{Role: "user", Content: userPrompt},
		domain.MessageItem{Role: "model", Content: aiAnswer},
	)
	if err != nil {
		t.Fatalf("SaveMessages() failed: %v", err)
	}

	// Get IDs from database
	msgs, err := storage.GetMessages(chatID)
	if err != nil || len(msgs) != 2 {
		t.Fatalf("GetMessages() failed or returned unexpected count: %v", err)
	}

	userMsgID := msgs[0].ID
	aiMsgID := msgs[1].ID

	// Check that there's not any bookmarks on start
	bookmarks, err := storage.GetBookmarks()
	if err != nil {
		t.Fatalf("GetBookmarks() failed: %v", err)
	}
	if len(bookmarks) != 0 {
		t.Fatalf("Expected 0 bookmarks initially, got %d", len(bookmarks))
	}

	// Add AI answer to bookmark list
	if err := storage.AddBookmark(aiMsgID); err != nil {
		t.Fatalf("AddBookmark() failed: %v", err)
	}

	bookmarks, err = storage.GetBookmarks()
	if err != nil {
		t.Fatalf("GetBookmarks() after insert failed: %v", err)
	}
	if len(bookmarks) != 1 {
		t.Fatalf("Expected 1 bookmark, got %d", len(bookmarks))
	}

	b := bookmarks[0]
	if b.MessageID != aiMsgID {
		t.Errorf("Bookmark MessageID mismatch. Expected %d, got %d", aiMsgID, b.MessageID)
	}
	if b.ChatID != chatID {
		t.Errorf("Bookmark ChatID mismatch. Expected %d, got %d", chatID, b.ChatID)
	}
	if b.ChatTitle != "Bookmarks Test Chat" {
		t.Errorf("Bookmark ChatTitle mismatch. Expected 'Bookmarks Test Chat', got '%s'", b.ChatTitle)
	}
	if b.Sender != "model" {
		t.Errorf("Bookmark Sender mismatch. Expected 'model', got '%s'", b.Sender)
	}
	if b.MessageContent != aiAnswer {
		t.Errorf("Bookmark MessageContent mismatch. Expected '%s', got '%s'", aiAnswer, b.MessageContent)
	}

	// Check unique constraint
	if err := storage.AddBookmark(aiMsgID); err == nil {
		t.Fatal("Expected error on duplicate AddBookmark(aiMsgID), got nil")
	}

	// Add user message to bookmark list
	if err := storage.AddBookmark(userMsgID); err != nil {
		t.Fatalf("AddBookmark(userMsgID) failed: %v", err)
	}
	bookmarks, _ = storage.GetBookmarks()
	if len(bookmarks) != 2 {
		t.Fatalf("Expected 2 bookmarks, got %d", len(bookmarks))
	}

	// Delete bookmark
	if err := storage.DeleteBookmark(aiMsgID); err != nil {
		t.Fatalf("DeleteBookmark() failed: %v", err)
	}
	bookmarks, err = storage.GetBookmarks()
	if err != nil {
		t.Fatalf("GetBookmarks() after delete failed: %v", err)
	}
	if len(bookmarks) != 1 {
		t.Fatalf("Expected 1 bookmark remaining, got %d", len(bookmarks))
	}
	if bookmarks[0].MessageID != userMsgID {
		t.Errorf("Expected remaining bookmark to be userMsgID (%d), got %d", userMsgID, bookmarks[0].MessageID)
	}
}

func TestBookmarksCascadeDeletion(t *testing.T) {
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	// Create test chat
	chatID, _ := storage.CreateChat("Cascade Test Chat")
	_ = storage.SaveMessages(chatID, domain.MessageItem{Role: "model", Content: "Important pinned note"})

	msgs, err := storage.GetMessages(chatID)
	if err != nil || len(msgs) == 0 {
		t.Fatalf("GetMessages() failed: %v", err)
	}

	// Add bookmark
	if err := storage.AddBookmark(msgs[0].ID); err != nil {
		t.Fatalf("AddBookmark() failed: %v", err)
	}

	// Delete entire chat
	if err := storage.DeleteChat(chatID); err != nil {
		t.Fatalf("DeleteChat() failed: %v", err)
	}

	// Check that bookmarmk deleted automatically
	bookmarks, err := storage.GetBookmarks()
	if err != nil {
		t.Fatalf("GetBookmarks() failed: %v", err)
	}
	if len(bookmarks) != 0 {
		t.Fatalf("Expected 0 bookmarks after chat deletion (cascade failed), got %d", len(bookmarks))
	}
}
