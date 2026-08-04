package bindings

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/vortifyne/gemini-desktop/internal/domain"
	"github.com/vortifyne/gemini-desktop/internal/gemini"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (a *App) GetMessages(chatID int64) ([]domain.Message, error) {
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

	// Cancel context based on Wails context
	a.cancelMu.Lock()
	ctx, cancel := context.WithCancel(a.ctx)
	a.cancelFunc = cancel
	a.cancelMu.Unlock()

	// Cancel context clean up
	defer func() {
		cancel()
		a.cancelMu.Lock()
		a.cancelFunc = nil
		a.cancelMu.Unlock()
	}()

	chats, err := a.storage.GetChats()
	if err != nil {
		return "", fmt.Errorf("failed to get chat config: %w", err)
	}

	var chatCfg domain.ChatConfig
	for _, c := range chats {
		if c.ID == chatID {
			chatCfg = domain.ChatConfig{
				Temperature:            c.Temperature,
				TopP:                   c.TopP,
				TopK:                   c.TopK,
				MaxOutputTokens:        c.MaxOutputTokens,
				SafetyHateSpeech:       c.SafetyHateSpeech,
				SafetyHarassment:       c.SafetyHarassment,
				SafetyDangerousContent: c.SafetyDangerousContent,
				SafetySexuallyExplicit: c.SafetySexuallyExplicit,
			}
			break
		}
	}

	msgParams := gemini.AIParameter{
		Prompt:       prompt,
		SystemPrompt: systemPrompt,
		ModelName:    modelName,
		Cfg:          chatCfg,
		OnChunk: func(chunk string) error {
			runtime.EventsEmit(a.ctx, "ai-stream-chunk", chunk)
			return nil
		},
	}

	// Send user prompt to generative model
	resp, err := a.aiClient.SendMessage(ctx, msgParams)
	if err != nil {
		if errors.Is(err, context.Canceled) {
			return "", errors.New("generation canceled by user")
		}
		return "", fmt.Errorf("failed to get response: %w", err)
	}

	err = a.storage.SaveMessages(
		chatID,
		domain.MessageItem{Role: "user", Content: prompt},
		domain.MessageItem{Role: "model", Content: resp})

	if err != nil {
		return "", fmt.Errorf("failed to save messages in database: %w", err)
	}

	return resp, nil
}

func (a *App) RegenerateResponse(chatID int64, prompt, systemPrompt, modelName string) (string, error) {
	if strings.TrimSpace(prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Cancel context based on Wails context
	a.cancelMu.Lock()
	ctx, cancel := context.WithCancel(a.ctx)
	a.cancelFunc = cancel
	a.cancelMu.Unlock()

	// Cancel context clean up
	defer func() {
		cancel()
		a.cancelMu.Lock()
		a.cancelFunc = nil
		a.cancelMu.Unlock()
	}()

	chats, err := a.storage.GetChats()
	if err != nil {
		return "", fmt.Errorf("failed to get chat config: %w", err)
	}

	var chatCfg domain.ChatConfig
	for _, c := range chats {
		if c.ID == chatID {
			chatCfg = domain.ChatConfig{
				Temperature:            c.Temperature,
				TopP:                   c.TopP,
				TopK:                   c.TopK,
				MaxOutputTokens:        c.MaxOutputTokens,
				SafetyHateSpeech:       c.SafetyHateSpeech,
				SafetyHarassment:       c.SafetyHarassment,
				SafetyDangerousContent: c.SafetyDangerousContent,
				SafetySexuallyExplicit: c.SafetySexuallyExplicit,
			}
			break
		}
	}

	msgParams := gemini.AIParameter{
		Prompt:       prompt,
		SystemPrompt: systemPrompt,
		ModelName:    modelName,
		Cfg:          chatCfg,
		OnChunk: func(chunk string) error {
			runtime.EventsEmit(a.ctx, "ai-stream-chunk", chunk)
			return nil
		},
	}

	// Send it back to regenerate response for the same prompt
	resp, err := a.aiClient.SendMessage(ctx, msgParams)
	if err != nil {
		if errors.Is(err, context.Canceled) {
			return "", errors.New("regeneration canceled by user")
		}
		return "", fmt.Errorf("failed to regenerate response: %w", err)
	}

	// Check if response have any candidates
	if len(resp) == 0 {
		return "", errors.New("gemini returned no candidates")
	}

	// Save new response to database
	if err := a.storage.DeleteLastMessage(chatID, "model"); err != nil {
		return "", fmt.Errorf("failed to delete last response: %w", err)
	}
	if err := a.storage.SaveMessages(chatID, domain.MessageItem{Role: "model", Content: resp}); err != nil {
		return "", fmt.Errorf("failed to save response in database: %w", err)
	}

	return resp, nil
}

func (a *App) CancelGeneration() {
	a.cancelMu.Lock()
	defer a.cancelMu.Unlock()

	if a.cancelFunc != nil {
		a.cancelFunc()
		a.cancelFunc = nil
	}
}
