package bindings

import (
	"fmt"

	"github.com/vortifyne/gemini-desktop/internal/gemini"
)

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
