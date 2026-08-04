package gemini

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/vortifyne/gemini-desktop/internal/domain"
	"google.golang.org/api/iterator"
)

func (c *Client) SendMessage(ctx context.Context, param domain.AIParameter, attachments []domain.Attachment) (string, error) {
	if strings.TrimSpace(param.Prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Set timeout for queries
	ctx, cancel := context.WithTimeout(ctx, 60*time.Second)
	defer cancel()

	// Choose generative model
	genModel := c.gClient.GenerativeModel(param.ModelName)

	// Check if system prompt is set
	if param.SystemPrompt != "" {
		genModel.SystemInstruction = genai.NewUserContent(genai.Text(param.SystemPrompt))
	}

	// Generate parameters
	genModel.Temperature = &param.Cfg.Temperature
	genModel.TopP = &param.Cfg.TopP
	genModel.TopK = &param.Cfg.TopK
	genModel.MaxOutputTokens = &param.Cfg.MaxOutputTokens

	// Safety filters
	genModel.SafetySettings = []*genai.SafetySetting{
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
	}

	// Attachments
	parts := []genai.Part{genai.Text(param.Prompt)}

	for _, att := range attachments {
		switch {
		case strings.HasPrefix(att.MimeType, "image/"):
			parts = append(parts, genai.Blob{
				MIMEType: att.MimeType,
				Data:     att.Data,
			})
		case att.MimeType == "text/plain":
			parts = append(parts, genai.Text(string(att.Data)))
		default:
			parts = append(parts, genai.Blob{
				MIMEType: att.MimeType,
				Data:     att.Data,
			})
		}
	}

	it := genModel.GenerateContentStream(ctx, parts...)
	var fullText strings.Builder

	for {
		resp, err := it.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return "", fmt.Errorf("error in stream: %w", err)
		}
		if len(resp.Candidates) == 0 || resp.Candidates[0].Content == nil {
			continue
		}

		for _, part := range resp.Candidates[0].Content.Parts {
			if textPart, ok := part.(genai.Text); ok {
				chunk := string(textPart)
				fullText.WriteString(chunk)

				if param.OnChunk != nil {
					if err := param.OnChunk(chunk); err != nil {
						return "", err
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
		return genai.HarmBlockNone
	case "LOW_AND_ABOVE", "LOW":
		return genai.HarmBlockLowAndAbove
	case "MEDIUM_AND_ABOVE", "MEDIUM":
		return genai.HarmBlockMediumAndAbove
	case "ONLY_HIGH", "HIGH":
		return genai.HarmBlockOnlyHigh
	default:
		return genai.HarmBlockUnspecified
	}
}
