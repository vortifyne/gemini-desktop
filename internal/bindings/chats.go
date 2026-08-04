package bindings

import (
	"fmt"

	"github.com/vortifyne/gemini-desktop/internal/database"
)

func (a *App) CreateChat(title string) (int64, error) {
	res, err := a.storage.CreateChat(title)
	if err != nil {
		return 0, fmt.Errorf("failed to created chat in frontend: %w", err)
	}

	return res, nil
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

func (a *App) UpdateSystemPrompt(chatID int64, systemPrompt string) error {
	return a.storage.UpdateSystemPrompt(chatID, systemPrompt)
}

func (a *App) UpdateChatModel(chatID int64, modelName string) error {
	return a.storage.UpdateChatModel(chatID, modelName)
}
