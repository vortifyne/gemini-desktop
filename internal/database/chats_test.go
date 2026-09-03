package database

import (
	"testing"

	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func TestChatCRUD(t *testing.T) {
	// Initialize database
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	// Create first chat in database
	chatId, err := storage.CreateChat("test chat 1")
	if err != nil || chatId < 0 {
		t.Fatalf("CreateChat occurred error: %v", err)
	}

	// Add messages from role:user and role:model
	if err := storage.SaveMessages(chatId, domain.MessageItem{Role: "user", Content: "API give me response"}); err != nil {
		t.Fatalf("SaveMessage occurred error (user role): %v", err)
	}
	if err := storage.SaveMessages(chatId, domain.MessageItem{Role: "model", Content: "API gave response to user"}); err != nil {
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

	// Verify default config parameters applied by COALESCE / ApplyDefaults
	if extractedChats[0].Temperature != 0.7 {
		t.Fatalf("Default Temperature incorrect. Expected 0.7, got: %f", extractedChats[0].Temperature)
	}
	if extractedChats[0].TopP != 0.95 {
		t.Fatalf("Default TopP incorrect. Expected 0.95, got: %f", extractedChats[0].TopP)
	}
	if extractedChats[0].TopK != 40 {
		t.Fatalf("Default TopK incorrect. Expected 40, got: %d", extractedChats[0].TopK)
	}
	if extractedChats[0].MaxOutputTokens != 8192 {
		t.Fatalf("Default MaxOutputTokens incorrect. Expected 8192, got: %d", extractedChats[0].MaxOutputTokens)
	}
	if extractedChats[0].SafetyHateSpeech != "NONE" {
		t.Fatalf("Default SafetyHateSpeech incorrect. Expected NONE, got: %s", extractedChats[0].SafetyHateSpeech)
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

	// Test update chat configuration
	newConfig := domain.ChatConfig{
		Temperature:            1.2,
		TopP:                   0.8,
		TopK:                   50,
		MaxOutputTokens:        4096,
		SafetyHateSpeech:       "NONE",
		SafetyHarassment:       "LOW_AND_ABOVE",
		SafetyDangerousContent: "MEDIUM_AND_ABOVE",
		SafetySexuallyExplicit: "ONLY_HIGH",
	}
	if err := storage.UpdateChatConfiguration(chatId, newConfig); err != nil {
		t.Fatalf("UpdateChatConfiguration returned error: %v", err)
	}

	extractedChats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats after config update failed: %v", err)
	}
	if extractedChats[0].Temperature != newConfig.Temperature {
		t.Fatalf("Temperature mismatch. Expected: %f, Got: %f", newConfig.Temperature, extractedChats[0].Temperature)
	}
	if extractedChats[0].TopP != newConfig.TopP {
		t.Fatalf("TopP mismatch. Expected: %f, Got: %f", newConfig.TopP, extractedChats[0].TopP)
	}
	if extractedChats[0].TopK != newConfig.TopK {
		t.Fatalf("TopK mismatch. Expected: %d, Got: %d", newConfig.TopK, extractedChats[0].TopK)
	}
	if extractedChats[0].MaxOutputTokens != newConfig.MaxOutputTokens {
		t.Fatalf("MaxOutputTokens mismatch. Expected: %d, Got: %d", newConfig.MaxOutputTokens, extractedChats[0].MaxOutputTokens)
	}
	if extractedChats[0].SafetyHateSpeech != newConfig.SafetyHateSpeech {
		t.Fatalf("SafetyHateSpeech mismatch. Expected: %s, Got: %s", newConfig.SafetyHateSpeech, extractedChats[0].SafetyHateSpeech)
	}
	if extractedChats[0].SafetyHarassment != newConfig.SafetyHarassment {
		t.Fatalf("SafetyHarassment mismatch. Expected: %s, Got: %s", newConfig.SafetyHarassment, extractedChats[0].SafetyHarassment)
	}
	if extractedChats[0].SafetyDangerousContent != newConfig.SafetyDangerousContent {
		t.Fatalf("SafetyDangerousContent mismatch. Expected: %s, Got: %s", newConfig.SafetyDangerousContent, extractedChats[0].SafetyDangerousContent)
	}
	if extractedChats[0].SafetySexuallyExplicit != newConfig.SafetySexuallyExplicit {
		t.Fatalf("SafetySexuallyExplicit mismatch. Expected: %s, Got: %s", newConfig.SafetySexuallyExplicit, extractedChats[0].SafetySexuallyExplicit)
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

	// Test NULL resilience via raw SQL insertion simulating legacy database records
	_, err = storage.db.Exec("INSERT INTO chats (title, temperature, top_p) VALUES ('null chat', NULL, NULL)")
	if err != nil {
		t.Fatalf("Failed to insert chat with NULL fields: %v", err)
	}

	nullTestChats, err := storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats failed when reading NULL database values: %v", err)
	}
	if len(nullTestChats) != 3 {
		t.Fatalf("Expected 3 chats, got %d", len(nullTestChats))
	}
	// The newly inserted NULL chat should be first due to ORDER BY created_at DESC
	if nullTestChats[0].Temperature != 0.7 {
		t.Fatalf("COALESCE failed for NULL Temperature. Expected 0.7, got %f", nullTestChats[0].Temperature)
	}
	if nullTestChats[0].TopP != 0.95 {
		t.Fatalf("COALESCE failed for NULL TopP. Expected 0.95, got %f", nullTestChats[0].TopP)
	}

	// Last response deletion test
	if err := storage.DeleteLastMessage(chatId, "model"); err != nil {
		t.Fatalf("DeleteLastMessage returned error: %v", err)
	}

	extractedMsgs, err = storage.GetMessages(chatId)
	if err != nil {
		t.Fatalf("GetMessages after DeleteLastMessage failed: %v", err)
	}
	if len(extractedMsgs) != 1 {
		t.Fatalf("Expected 1 message left after DeleteLastMessage, got %d", len(extractedMsgs))
	}
	if extractedMsgs[0].Role != "user" {
		t.Fatalf("Remaining message role should be 'user', got '%s'", extractedMsgs[0].Role)
	}

	// Delete all chat
	if err := storage.DeleteChat(chatId); err != nil {
		t.Fatalf("DeleteChat returned error: %v", err)
	}

	// Check if two chats left (chatId2 and nullTestChat)
	extractedChats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats after DeleteChat failed: %v", err)
	}
	if len(extractedChats) != 2 {
		t.Fatalf("Expected 2 chats remaining after deletion, got %d", len(extractedChats))
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

func TestSearchChat(t *testing.T) {
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	id1, err := storage.CreateChat("Golang Microservices")
	if err != nil {
		t.Fatalf("Failed to create chat 1: %v", err)
	}

	id2, err := storage.CreateChat("React Frontend SPA")
	if err != nil {
		t.Fatalf("Failed to create chat 2: %v", err)
	}

	id3, err := storage.CreateChat("Advanced Golang Concurrency")
	if err != nil {
		t.Fatalf("Failed to create chat 3: %v", err)
	}

	t.Run("Empty and whitespace queries return all chats", func(t *testing.T) {
		for _, q := range []string{"", "   ", "\t\n"} {
			chats, err := storage.SearchChat(q)
			if err != nil {
				t.Fatalf("SearchChat(%q) returned error: %v", q, err)
			}
			if len(chats) != 3 {
				t.Fatalf("SearchChat(%q) expected 3 chats, got %d", q, len(chats))
			}
		}
	})

	t.Run("Substring matching", func(t *testing.T) {
		chats, err := storage.SearchChat("Frontend")
		if err != nil {
			t.Fatalf("SearchChat('Frontend') returned error: %v", err)
		}
		if len(chats) != 1 {
			t.Fatalf("Expected 1 result for 'Frontend', got %d", len(chats))
		}
		if chats[0].ID != id2 {
			t.Fatalf("Expected chat ID %d, got %d", id2, chats[0].ID)
		}
	})

	t.Run("Case-insensitive search and ordering (DESC)", func(t *testing.T) {
		for _, q := range []string{"golang", "GOLANG", "GoLaNg", "  golang  "} {
			chats, err := storage.SearchChat(q)
			if err != nil {
				t.Fatalf("SearchChat(%q) returned error: %v", q, err)
			}
			if len(chats) != 2 {
				t.Fatalf("SearchChat(%q) expected 2 chats, got %d", q, len(chats))
			}

			if chats[0].ID != id3 {
				t.Errorf("SearchChat(%q) sorting error: expected chat ID %d first, got %d", q, id3, chats[0].ID)
			}
			if chats[1].ID != id1 {
				t.Errorf("SearchChat(%q) sorting error: expected chat ID %d second, got %d", q, id1, chats[1].ID)
			}
		}
	})

	t.Run("No matching chats returns empty slice", func(t *testing.T) {
		chats, err := storage.SearchChat("NonExistentKeywordXYZ")
		if err != nil {
			t.Fatalf("SearchChat for non-existent query returned error: %v", err)
		}
		if chats == nil {
			t.Fatalf("SearchChat returned nil slice instead of empty slice make([]Chat, 0)")
		}
		if len(chats) != 0 {
			t.Fatalf("Expected 0 chats, got %d", len(chats))
		}
	})

	t.Run("Resilience to NULL fields in matching records", func(t *testing.T) {
		_, err := storage.db.Exec("INSERT INTO chats (title, temperature, top_p) VALUES ('Special Legacy NULL Chat', NULL, NULL)")
		if err != nil {
			t.Fatalf("Failed to insert NULL test row: %v", err)
		}

		chats, err := storage.SearchChat("Legacy NULL")
		if err != nil {
			t.Fatalf("SearchChat failed on record with NULL fields: %v", err)
		}
		if len(chats) != 1 {
			t.Fatalf("Expected 1 match for NULL chat, got %d", len(chats))
		}
		if chats[0].Temperature != 0.7 {
			t.Errorf("COALESCE failed for Temperature: expected 0.7, got %f", chats[0].Temperature)
		}
		if chats[0].TopP != 0.95 {
			t.Errorf("COALESCE failed for TopP: expected 0.95, got %f", chats[0].TopP)
		}
		if chats[0].SystemPrompt != "" {
			t.Errorf("COALESCE failed for SystemPrompt: expected empty string, got %s", chats[0].SystemPrompt)
		}
	})
}
