package gemini

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/googleapi"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type Client struct {
	apiKey string
}

func NewGeminiClient(apiKey string) *Client {
	return &Client{apiKey}
}

func CheckGeminiKeyLive(apiKey string) (bool, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// Create new client with API key
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return false, fmt.Errorf("genai.NewClient() error: %w", err)
	}
	defer func() {
		if err := client.Close(); err != nil {
			log.Printf("failed to close Gemini client: %v\n", err)
		}
	}()

	// Get model info by this API key
	it := client.ListModels(ctx)
	if _, err = it.Next(); err != nil {
		if errors.Is(err, iterator.Done) { // empty list of models but without system errors
			return true, nil
		}

		var apiErr *googleapi.Error

		if errors.As(err, &apiErr) { // server sent bad answer but without system errors
			if apiErr.Code == http.StatusUnauthorized || apiErr.Code == http.StatusForbidden {
				return false, nil
			}
		}

		return false, fmt.Errorf("server haven't answered: %w", err)
	}

	return true, nil
}

func (c *Client) SendMessage(promt string) (string, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// Create client
	client, err := genai.NewClient(ctx, option.WithAPIKey(c.apiKey))
	if err != nil {
		return "", fmt.Errorf("failed to send message: %w", err)
	}
	defer func() {
		if err := client.Close(); err != nil {
			log.Printf("failed to close client while sending message: %v\n", err)
		}
	}()

	// Choose generative model and try to get response from it
	genModel := client.GenerativeModel("gemini-3.6-flash")
	resp, err := genModel.GenerateContent(ctx, genai.Text(promt))
	if err != nil {
		return "", fmt.Errorf("failed to get response from generative model: %w", err)
	}
	if len(resp.Candidates) == 0 { // Check if model even give any response
		log.Println("gemini returned no candidates")
		return "", nil
	}

	// Check if content is empty
	candidate := resp.Candidates[0]
	if candidate.Content == nil || len(candidate.Content.Parts) == 0 {
		return "", fmt.Errorf("gemini returned empty content")
	}

	// Extract text from content of response
	// TODO(Feature): think about extracting not just a text but images, URLs. For now return "" because it wasn't a text
	if textPart, ok := resp.Candidates[0].Content.Parts[0].(genai.Text); ok {
		return string(textPart), nil
	}

	return "", fmt.Errorf("unexpected content type in response")
}
