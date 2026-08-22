package gemini

import (
	"context"
	"errors"
	"fmt"
	"net/http"
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
		modelName = "gemini-2.0-flash"
	}

	ctx, cancel := context.WithTimeout(ctx, 120*time.Second)
	defer cancel()

	var parts []*genai.Part

	if strings.TrimSpace(param.Prompt) != "" {
		parts = append(parts, &genai.Part{
			Text: param.Prompt,
		})
	}

	for _, att := range attachments {
		mime := strings.ToLower(strings.TrimSpace(att.MimeType))

		if mime == "" && len(att.Data) > 0 {
			mime = http.DetectContentType(att.Data)
		}

		switch {
		case strings.HasPrefix(mime, "image/") || strings.HasSuffix(mime, "/pdf"):
			parts = append(parts, &genai.Part{
				InlineData: &genai.Blob{
					MIMEType: mime,
					Data:     att.Data,
				},
			})
		case strings.HasPrefix(mime, "text/") || mime == "application/json" || mime == "" || domain.IsTextFile(att.FileName):
			fileContent := string(att.Data)
			formattedText := fmt.Sprintf("\n\n--- Attached File: %s ---\n%s\n--- End of File ---", att.FileName, fileContent)
			parts = append(parts, &genai.Part{
				Text: formattedText,
			})
		default:
			parts = append(parts, &genai.Part{
				InlineData: &genai.Blob{
					MIMEType: mime,
					Data:     att.Data,
				},
			})
		}
	}

	contents := []*genai.Content{
		{
			Role:  "user",
			Parts: parts,
		},
	}

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

func parseSafetyThreshold(threshold string) genai.HarmBlockThreshold {
	switch strings.ToUpper(strings.TrimSpace(threshold)) {
	case "NONE":
		return genai.HarmBlockThresholdBlockNone
	case "LOW_AND_ABOVE", "LOW":
		return genai.HarmBlockThresholdBlockLowAndAbove
	case "MEDIUM_AND_ABOVE", "MEDIUM":
		return genai.HarmBlockThresholdBlockMediumAndAbove
	case "ONLY_HIGH", "HIGH":
		return genai.HarmBlockThresholdBlockOnlyHigh
	default:
		return genai.HarmBlockThresholdUnspecified
	}
}
