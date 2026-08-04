package bindings

import (
	"errors"
	"fmt"
	"strings"

	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetMessages(chatID int64) ([]database.Message, error) {
	msgs, err := a.storage.GetMessages(chatID)
	if err != nil {
		return nil, fmt.Errorf("failed to get messages from database: %w", err)
	}

	return msgs, nil
}

func (a *App) SendMessageToAI(chatID int64, prompt, systemPrompt, modelName string) (string, error) {
	if strings.TrimSpace(prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Send user prompt to generative model
	resp, err := a.aiClient.SendMessage(prompt, systemPrompt, modelName, func(chunk string) error {
		runtime.EventsEmit(a.ctx, "ai-stream-chunk", chunk)
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("failed to get response: %w", err)
	}

	err = a.storage.SaveMessages(
		chatID,
		database.MessageItem{Role: "user", Content: prompt},
		database.MessageItem{Role: "model", Content: resp})

	if err != nil {
		return "", fmt.Errorf("failed to save messages in database: %w", err)
	}

	return resp, nil
}

func (a *App) RegenerateResponse(chatID int64, prompt, systemPrompt, modelName string) (string, error) {
	if strings.TrimSpace(prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Send it back to regenerate response for the same prompt
	resp, err := a.aiClient.SendMessage(prompt, systemPrompt, modelName, func(chunk string) error {
		runtime.EventsEmit(a.ctx, "ai-stream-chunk", chunk)
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("failed to regenerate response: %w", err)
	}

	// Check if response have any candidates
	if len(resp) == 0 {
		return "", errors.New("gemini returned no candidates")
	}

	// Save new response to database
	if err := a.storage.DeleteLastResponse(chatID); err != nil {
		return "", fmt.Errorf("failed to delete last response: %w", err)
	}
	if err := a.storage.SaveMessages(chatID, database.MessageItem{Role: "model", Content: resp}); err != nil {
		return "", fmt.Errorf("failed to save response in database: %w", err)
	}

	return resp, nil
}
