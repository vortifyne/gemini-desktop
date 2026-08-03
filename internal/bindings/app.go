package bindings

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/vortifyne/gemini-desktop/internal/gemini"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx      context.Context
	storage  *database.Storage
	aiClient *gemini.Client
}

type ReleaseInfo struct {
	TagName string `json:"tag_name"`
	HtmlUrl string `json:"html_url"`
}

// NewApp creates a new App application struct
func NewApp(storage *database.Storage, client *gemini.Client) *App {
	return &App{storage: storage, aiClient: client}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	go a.CheckForUpdates()
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
	if strings.TrimSpace(prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Send user prompt to generative model
	resp, err := a.aiClient.SendMessage(prompt, func(chunk string) error {
		runtime.EventsEmit(a.ctx, "ai-stream-chunk", chunk)
		return nil
	})
	if err != nil {
		return "", fmt.Errorf("failed to get response: %w", err)
	}

	// Save user prompt
	if err := a.storage.SaveMessage(chatID, "user", prompt); err != nil {
		return "", fmt.Errorf("failed to save user message in database: %w", err)
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

	client, err := gemini.NewGeminiClient(apiKey)
	if err != nil {
		return false, fmt.Errorf("failed to init gemini client: %w", err)
	}
	a.aiClient = client

	return true, nil
}

func (a *App) GetChats() ([]database.Chat, error) {
	return a.storage.GetChats()
}

func (a *App) DeleteChat(chatID int64) error {
	return a.storage.DeleteChat(chatID)
}

func (a *App) UpdateChatTitle(chatID int64, newTitle string) error {
	return a.storage.UpdateChatTitle(chatID, newTitle)
}

func (a *App) RegenerateResponse(chatID int64, prompt string) (string, error) {
	if strings.TrimSpace(prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Send it back to regenerate response for the same prompt
	resp, err := a.aiClient.SendMessage(prompt, func(chunk string) error {
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
	if err := a.storage.SaveMessage(chatID, "model", resp); err != nil {
		return "", fmt.Errorf("failed to save response in database: %w", err)
	}

	return resp, nil
}

func (a *App) CheckForUpdates() {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	client := &http.Client{Timeout: 30 * time.Second}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.github.com/repos/vortifyne/gemini-desktop/releases/latest", nil)
	if err != nil {
		log.Printf("Can't create request: %v", err)
		return
	}
	req.Header.Set("User-Agent", "Gemini-Desktop-App")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Can't send request to URL: %v", err)
		return
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Printf("Can't close resp.Body: %v", err)
			return
		}
	}()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Github returned status: %d", resp.StatusCode)
		return
	}

	var release ReleaseInfo
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		log.Printf("failed to decode release json: %v", err)
		return
	}

	const currentVersion = "v0.2.0"
	if release.TagName != currentVersion {
		runtime.EventsEmit(a.ctx, "update-available", release)
	}
}
