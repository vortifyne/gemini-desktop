package database

import (
	"testing"

	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func TestMessagesCRUD(t *testing.T) {
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	// Create chat playground
	chatID, err := storage.CreateChat("Messages Test Chat")
	if err != nil {
		t.Fatalf("CreateChat() failed: %v", err)
	}

	// Test save and get messages
	err = storage.SaveMessages(
		chatID,
		domain.MessageItem{Role: "user", Content: "How to reverse a string in Go?"},
		domain.MessageItem{Role: "model", Content: "Use []rune slice."},
	)
	if err != nil {
		t.Fatalf("SaveMessages() failed: %v", err)
	}

	msgs, err := storage.GetMessages(chatID)
	if err != nil {
		t.Fatalf("GetMessages() failed: %v", err)
	}
	if len(msgs) != 2 {
		t.Fatalf("expected 2 messages, got %d", len(msgs))
	}
	if msgs[0].Role != "user" || msgs[0].Content != "How to reverse a string in Go?" {
		t.Errorf("first message content incorrect: %+v", msgs[0])
	}
	if msgs[1].Role != "model" || msgs[1].Content != "Use []rune slice." {
		t.Errorf("second message content incorrect: %+v", msgs[1])
	}

	// Test delete last message with role "model"
	if err := storage.DeleteLastMessage(chatID, "model"); err != nil {
		t.Fatalf("DeleteLastMessage('model') failed: %v", err)
	}

	msgs, err = storage.GetMessages(chatID)
	if err != nil {
		t.Fatalf("GetMessages() failed: %v", err)
	}
	if len(msgs) != 1 {
		t.Fatalf("expected 1 message remaining after model response deletion, got %d", len(msgs))
	}
	if msgs[0].Role != "user" {
		t.Fatalf("expected remaining message to be 'user', got '%s'", msgs[0].Role)
	}

	// Test delete last maessage with role "user"
	if err := storage.DeleteLastMessage(chatID, "user"); err != nil {
		t.Fatalf("DeleteLastMessage('user') failed: %v", err)
	}

	msgs, err = storage.GetMessages(chatID)
	if err != nil {
		t.Fatalf("GetMessages() failed: %v", err)
	}
	if len(msgs) != 0 {
		t.Fatalf("expected 0 messages remaining after user prompt deletion, got %d", len(msgs))
	}
}
