package gemini

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/vortifyne/gemini-desktop/internal/domain"
	"google.golang.org/genai"
)

func (c *Client) SendMessage(ctx context.Context, param domain.AIParameter, attachments []domain.Attachment) (string, error) {
	if strings.TrimSpace(param.Prompt) == "" && len(attachments) == 0 {
		return "", errors.New("prompt and attachments cannot both be empty")
	}

	modelName := strings.TrimSpace(param.ModelName)
	if modelName == "" {
		modelName = "gemini-3.6-flash"
	}

	ctx, cancel := context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	var parts []*genai.Part

	if strings.TrimSpace(param.Prompt) != "" {
		parts = append(parts, &genai.Part{
			Text: param.Prompt,
		})
	}

	// Give chat history context to AI
	// It allows AI to understand conversation context
	contents := make([]*genai.Content, 0, len(param.History)+1)

	for _, msg := range param.History {
		historyParts := make([]*genai.Part, 0, len(attachments)+1)

		// Message text
		historyParts = append(historyParts, &genai.Part{Text: msg.Content})

		// Message attachments
		for _, att := range msg.Attachments {
			if part := attachmentToPart(att); part != nil {
				historyParts = append(historyParts, part)
			}
		}

		if len(historyParts) == 0 {
			continue
		}

		// Role of message
		role := "user"
		if msg.Role == "model" {
			role = "model"
		}

		// Add formed record in history
		contents = append(contents, &genai.Content{
			Role:  role,
			Parts: historyParts,
		})
	}

	// Make current user's prompt
	currentParts := make([]*genai.Part, 0, len(attachments)+1)
	currentParts = append(currentParts, &genai.Part{Text: param.Prompt})
	for _, att := range attachments {
		if part := attachmentToPart(att); part != nil {
			currentParts = append(currentParts, part)
		}
	}

	if len(currentParts) == 0 {
		return "", errors.New("current user turn has no valid parts")
	}

	// Give all context (current prompt and current chat history) to AI
	contents = append(contents, &genai.Content{
		Role:  "user",
		Parts: currentParts,
	})

	config := &genai.GenerateContentConfig{
		Temperature:     genai.Ptr(param.Cfg.Temperature),
		TopP:            genai.Ptr(param.Cfg.TopP),
		TopK:            genai.Ptr(float32(param.Cfg.TopK)),
		MaxOutputTokens: param.Cfg.MaxOutputTokens,
		SafetySettings: []*genai.SafetySetting{
			{
				Category:  genai.HarmCategoryHateSpeech,
				Threshold: parseSafetyThreshold(param.Cfg.SafetyHateSpeech),
			},
			{
				Category:  genai.HarmCategoryHarassment,
				Threshold: parseSafetyThreshold(param.Cfg.SafetyHarassment),
			},
			{
				Category:  genai.HarmCategoryDangerousContent,
				Threshold: parseSafetyThreshold(param.Cfg.SafetyDangerousContent),
			},
			{
				Category:  genai.HarmCategorySexuallyExplicit,
				Threshold: parseSafetyThreshold(param.Cfg.SafetySexuallyExplicit),
			},
		},
	}

	if strings.TrimSpace(param.SystemPrompt) != "" {
		config.SystemInstruction = &genai.Content{
			Parts: []*genai.Part{
				{Text: param.SystemPrompt},
			},
		}
	}

	var fullText strings.Builder

	for resp, err := range c.gClient.Models.GenerateContentStream(ctx, modelName, contents, config) {
		if err != nil {
			return "", fmt.Errorf("stream error: %w", err)
		}

		for _, cand := range resp.Candidates {
			if cand.Content != nil {
				for _, part := range cand.Content.Parts {
					if part.Text != "" {
						fullText.WriteString(part.Text)

						if param.OnChunk != nil {
							if err := param.OnChunk(part.Text); err != nil {
								return "", err
							}
						}
					}
				}
			}
		}
	}

	return fullText.String(), nil
}
