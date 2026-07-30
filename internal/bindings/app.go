package bindings

import (
	"context"
	"fmt"

	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/vortifyne/gemini-desktop/internal/gemini"
)

// App struct
type App struct {
	ctx      context.Context
	storage  *database.Storage
	aiClient *gemini.Client
}

// NewApp creates a new App application struct
func NewApp(storage *database.Storage, client *gemini.Client) *App {
	return &App{storage: storage, aiClient: client}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) CreateChat(title string) (int64, error) {
	res, err := a.storage.CreateChat(title)
	if err != nil {
		return 0, fmt.Errorf("failed to created chat in frontend: %w", err)
	}

	return res, nil
}

func (a *App) GetMessages(chatID int64) ([]database.Message, error) {
	msgs, err := a.storage.GetMessages(chatID)
	if err != nil {
		return nil, fmt.Errorf("failed to get messages from database: %w", err)
	}

	return msgs, nil
}

func (a *App) SendMessageToAI(chatID int64, prompt string) (string, error) {
	// Save user prompt
	if err := a.storage.SaveMessage(chatID, "user", prompt); err != nil {
		return "", fmt.Errorf("failed to save user message in database: %w", err)
	}

	// Send user prompt to generative model
	resp, err := a.aiClient.SendMessage(prompt)
	if err != nil {
		return "", fmt.Errorf("failed to get response: %w", err)
	}

	// Save generative model response
	if err := a.storage.SaveMessage(chatID, "model", resp); err != nil {
		return "", fmt.Errorf("failed to save response in database: %w", err)
	}

	return resp, nil
}

func (a *App) SetApiKey(apiKey string) (bool, error) {
	isValid, err := gemini.CheckGeminiKeyLive(apiKey)
	if !isValid || err != nil {
		return false, err
	}

	a.aiClient = gemini.NewGeminiClient(apiKey)
	return true, nil
}
