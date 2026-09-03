package database

import (
	"testing"

	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func TestChatCRUD(t *testing.T) {
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	var (
		chatId  int64
		chatId2 int64
	)

	t.Run("Create chat and initial messages", func(t *testing.T) {
		var err error
		chatId, err = storage.CreateChat("test chat 1")
		if err != nil || chatId <= 0 {
			t.Fatalf("CreateChat failed: %v", err)
		}

		if err := storage.SaveMessages(chatId, domain.MessageItem{Role: "user", Content: "API give me response"}); err != nil {
			t.Fatalf("SaveMessages (user) failed: %v", err)
		}
		if err := storage.SaveMessages(chatId, domain.MessageItem{Role: "model", Content: "API gave response to user"}); err != nil {
			t.Fatalf("SaveMessages (model) failed: %v", err)
		}

		msgs, err := storage.GetMessages(chatId)
		if err != nil {
			t.Fatalf("GetMessages failed: %v", err)
		}
		if len(msgs) != 2 {
			t.Fatalf("Expected 2 messages, got %d", len(msgs))
		}
		if msgs[0].Role != "user" || msgs[1].Role != "model" {
			t.Errorf("Unexpected message roles: [0]=%s, [1]=%s", msgs[0].Role, msgs[1].Role)
		}
	})

	t.Run("Verify default configuration values", func(t *testing.T) {
		chats, err := storage.GetChats()
		if err != nil {
			t.Fatalf("GetChats failed: %v", err)
		}
		if len(chats) != 1 {
			t.Fatalf("Expected 1 chat, got %d", len(chats))
		}

		c := chats[0]
		if c.Temperature != 0.7 {
			t.Errorf("Expected default Temperature 0.7, got %f", c.Temperature)
		}
		if c.TopP != 0.95 {
			t.Errorf("Expected default TopP 0.95, got %f", c.TopP)
		}
		if c.TopK != 40 {
			t.Errorf("Expected default TopK 40, got %d", c.TopK)
		}
		if c.MaxOutputTokens != 8192 {
			t.Errorf("Expected default MaxOutputTokens 8192, got %d", c.MaxOutputTokens)
		}
		if c.SafetyHateSpeech != "NONE" {
			t.Errorf("Expected default SafetyHateSpeech 'NONE', got %s", c.SafetyHateSpeech)
		}
	})

	t.Run("Update chat title", func(t *testing.T) {
		const newTitle = "updated chat title"
		if err := storage.UpdateChatTitle(chatId, newTitle); err != nil {
			t.Fatalf("UpdateChatTitle failed: %v", err)
		}

		chats, err := storage.GetChats()
		if err != nil {
			t.Fatalf("GetChats after title update failed: %v", err)
		}
		if chats[0].Title != newTitle {
			t.Errorf("Title mismatch: expected %q, got %q", newTitle, chats[0].Title)
		}
	})

	t.Run("Update chat configuration", func(t *testing.T) {
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
			t.Fatalf("UpdateChatConfiguration failed: %v", err)
		}

		chats, err := storage.GetChats()
		if err != nil {
			t.Fatalf("GetChats after config update failed: %v", err)
		}

		c := chats[0]
		if c.Temperature != newConfig.Temperature {
			t.Errorf("Temperature mismatch: expected %f, got %f", newConfig.Temperature, c.Temperature)
		}
		if c.TopP != newConfig.TopP {
			t.Errorf("TopP mismatch: expected %f, got %f", newConfig.TopP, c.TopP)
		}
		if c.TopK != newConfig.TopK {
			t.Errorf("TopK mismatch: expected %d, got %d", newConfig.TopK, c.TopK)
		}
		if c.MaxOutputTokens != newConfig.MaxOutputTokens {
			t.Errorf("MaxOutputTokens mismatch: expected %d, got %d", newConfig.MaxOutputTokens, c.MaxOutputTokens)
		}
		if c.SafetyHarassment != newConfig.SafetyHarassment {
			t.Errorf("SafetyHarassment mismatch: expected %s, got %s", newConfig.SafetyHarassment, c.SafetyHarassment)
		}
	})

	t.Run("Sorting order DESC with multiple chats", func(t *testing.T) {
		var err error
		chatId2, err = storage.CreateChat("test chat 2")
		if err != nil {
			t.Fatalf("CreateChat (second) failed: %v", err)
		}

		chats, err := storage.GetChats()
		if err != nil {
			t.Fatalf("GetChats failed: %v", err)
		}
		if len(chats) != 2 {
			t.Fatalf("Expected 2 chats, got %d", len(chats))
		}
		if chats[0].ID != chatId2 {
			t.Errorf("Sorting order incorrect: expected newest chat ID %d first, got %d", chatId2, chats[0].ID)
		}
	})

	t.Run("Resilience to NULL fields", func(t *testing.T) {
		_, err := storage.db.Exec("INSERT INTO chats (title, temperature, top_p) VALUES ('null chat', NULL, NULL)")
		if err != nil {
			t.Fatalf("Failed to insert chat with NULL fields: %v", err)
		}

		chats, err := storage.GetChats()
		if err != nil {
			t.Fatalf("GetChats with NULL records failed: %v", err)
		}
		if len(chats) != 3 {
			t.Fatalf("Expected 3 chats, got %d", len(chats))
		}
		if chats[0].Temperature != 0.7 {
			t.Errorf("COALESCE fallback for Temperature failed: expected 0.7, got %f", chats[0].Temperature)
		}
		if chats[0].TopP != 0.95 {
			t.Errorf("COALESCE fallback for TopP failed: expected 0.95, got %f", chats[0].TopP)
		}
	})

	t.Run("Delete last message", func(t *testing.T) {
		if err := storage.DeleteLastMessage(chatId, "model"); err != nil {
			t.Fatalf("DeleteLastMessage failed: %v", err)
		}

		msgs, err := storage.GetMessages(chatId)
		if err != nil {
			t.Fatalf("GetMessages after DeleteLastMessage failed: %v", err)
		}
		if len(msgs) != 1 {
			t.Fatalf("Expected 1 message left, got %d", len(msgs))
		}
		if msgs[0].Role != "user" {
			t.Errorf("Expected remaining message to be 'user', got %s", msgs[0].Role)
		}
	})

	t.Run("Delete chat and check cascade cleanup", func(t *testing.T) {
		if err := storage.DeleteChat(chatId); err != nil {
			t.Fatalf("DeleteChat failed: %v", err)
		}

		chats, err := storage.GetChats()
		if err != nil {
			t.Fatalf("GetChats after deletion failed: %v", err)
		}
		if len(chats) != 2 {
			t.Fatalf("Expected 2 chats remaining, got %d", len(chats))
		}

		orphanMsgs, err := storage.GetMessages(chatId)
		if err != nil {
			t.Fatalf("GetMessages for deleted chat failed: %v", err)
		}
		if len(orphanMsgs) != 0 {
			t.Errorf("Expected 0 orphan messages for deleted chat %d, got %d", chatId, len(orphanMsgs))
		}
	})
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
