package gemini

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/vortifyne/gemini-desktop/internal/domain"
	"google.golang.org/genai"
)

func attachmentToPart(att domain.Attachment) *genai.Part {
	if len(att.Data) == 0 {
		return nil
	}

	mime := strings.ToLower(strings.TrimSpace(att.MimeType))

	if mime == "" && len(att.Data) > 0 {
		mime = http.DetectContentType(att.Data)
	}

	if domain.IsTextFile(att.FileName) || strings.HasPrefix(mime, "text/") {
		fileContent := string(att.Data)
		formattedText := fmt.Sprintf("\n\n--- Attached File: %s ---\n%s\n--- End of File ---", att.FileName, fileContent)
		return &genai.Part{Text: formattedText}
	}

	return &genai.Part{
		InlineData: &genai.Blob{
			MIMEType: mime,
			Data:     att.Data,
		},
	}
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
