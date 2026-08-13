package gemini

import (
	"context"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"github.com/vortifyne/gemini-desktop/internal/domain"
	"google.golang.org/api/iterator"
)

func (c *Client) SendMessage(ctx context.Context, param domain.AIParameter, attachments []domain.Attachment) (string, error) {
	if strings.TrimSpace(param.Prompt) == "" && len(attachments) == 0 {
		return "", errors.New("prompt and attachments cannot both be empty")
	}

	modelName := strings.TrimSpace(param.ModelName)
	if modelName == "" {
		modelName = "gemini-2.0-flash"
	}

	// Set timeout for queries
	ctx, cancel := context.WithTimeout(ctx, 60*time.Second)
	defer cancel()

	// Choose generative model
	genModel := c.gClient.GenerativeModel(modelName)

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

	// Attachments & Prompt assembly
	parts := []genai.Part{}
	if strings.TrimSpace(param.Prompt) != "" {
		parts = append(parts, genai.Text(param.Prompt))
	}

	for _, att := range attachments {
		mime := strings.ToLower(strings.TrimSpace(att.MimeType))

		if mime == "" && len(att.Data) > 0 {
			mime = http.DetectContentType(att.Data)
		}

		switch {
		case strings.HasPrefix(mime, "image/"):
			parts = append(parts, genai.Blob{
				MIMEType: mime,
				Data:     att.Data,
			})
		case strings.HasSuffix(mime, "/pdf"):
			parts = append(parts, genai.Blob{
				MIMEType: mime,
				Data:     att.Data,
			})
		case strings.HasPrefix(mime, "text/") || mime == "application/json" || mime == "" || domain.IsTextFile(att.FileName):
			fileContent := string(att.Data)
			formattedText := fmt.Sprintf("\n\n--- Attached File: %s ---\n%s\n--- End of File ---", att.FileName, fileContent)
			parts = append(parts, genai.Text(formattedText))
		default:
			parts = append(parts, genai.Blob{
				MIMEType: mime,
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
