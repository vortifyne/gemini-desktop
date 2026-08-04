package database

import "testing"

func TestChatCRUD(t *testing.T) {
	storage := setupTestDB(t)
	defer func() { _ = storage.Close() }()

	// Test chat creation
	chatId, err := storage.CreateChat("Test Chat 1")
	if err != nil || chatId <= 0 {
		t.Fatalf("CreateChat() failed: %v", err)
	}

	// Test get list of chats
	chats, err := storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats() failed: %v", err)
	}
	if len(chats) != 1 {
		t.Fatalf("expected 1 chat, got %d", len(chats))
	}
	if chats[0].Title != "Test Chat 1" {
		t.Fatalf("expected title 'Test Chat 1', got '%s'", chats[0].Title)
	}

	// Test ordered list of chats BY DESC
	chatId2, err := storage.CreateChat("Test Chat 2")
	if err != nil {
		t.Fatalf("CreateChat() 2 failed: %v", err)
	}

	chats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats() after second chat failed: %v", err)
	}
	if len(chats) != 2 {
		t.Fatalf("expected 2 chats, got %d", len(chats))
	}
	if chats[0].ID != chatId2 {
		t.Fatalf("sorting order incorrect: expected chat ID %d first, got %d", chatId2, chats[0].ID)
	}

	// Test update chat title
	newTitle := "Updated Title"
	if err := storage.UpdateChatTitle(chatId, newTitle); err != nil {
		t.Fatalf("UpdateChatTitle() failed: %v", err)
	}

	// Test update system prompt update
	sysPrompt := "You are a Go Senior Developer"
	if err := storage.UpdateSystemPrompt(chatId, sysPrompt); err != nil {
		t.Fatalf("UpdateSystemPrompt() failed: %v", err)
	}

	// Test update chat generative model
	modelName := "gemini-2.0-flash"
	if err := storage.UpdateChatModel(chatId, modelName); err != nil {
		t.Fatalf("UpdateChatModel() failed: %v", err)
	}

	// Test all fields updated
	chats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats() failed: %v", err)
	}

	var updatedChat *Chat
	for _, c := range chats {
		if c.ID == chatId {
			updatedChat = &c
			break
		}
	}

	if updatedChat == nil {
		t.Fatalf("updated chat not found")
	}
	if updatedChat.Title != newTitle {
		t.Errorf("title mismatch: expected '%s', got '%s'", newTitle, updatedChat.Title)
	}
	if updatedChat.SystemPrompt != sysPrompt {
		t.Errorf("system_prompt mismatch: expected '%s', got '%s'", sysPrompt, updatedChat.SystemPrompt)
	}
	if updatedChat.ModelName != modelName {
		t.Errorf("model_name mismatch: expected '%s', got '%s'", modelName, updatedChat.ModelName)
	}

	// Delete chat delete and cascade deletion
	if err := storage.SaveMessages(chatId, MessageItem{Role: "user", Content: "Hello"}); err != nil {
		t.Fatalf("SaveMessages() for delete test failed: %v", err)
	}

	if err := storage.DeleteChat(chatId); err != nil {
		t.Fatalf("DeleteChat() failed: %v", err)
	}

	// Check that one chat left
	chats, err = storage.GetChats()
	if err != nil {
		t.Fatalf("GetChats() after delete failed: %v", err)
	}
	if len(chats) != 1 || chats[0].ID != chatId2 {
		t.Fatalf("chat deletion failed: expected 1 remaining chat with ID %d", chatId2)
	}

	// Check no orphans
	orphanedMsgs, err := storage.GetMessages(chatId)
	if err != nil {
		t.Fatalf("GetMessages() for deleted chat failed: %v", err)
	}
	if len(orphanedMsgs) != 0 {
		t.Fatalf("expected 0 orphaned messages, got %d", len(orphanedMsgs))
	}
}
