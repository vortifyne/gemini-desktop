package gemini

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"slices"
	"strings"
	"time"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/googleapi"
	"google.golang.org/api/iterator"
	"google.golang.org/api/option"
)

type Client struct {
	apiKey  string
	gClient *genai.Client
}

func NewGeminiClient(apiKey string) (*Client, error) {
	// Create new client with API key
	gClient, err := genai.NewClient(context.Background(), option.WithAPIKey(apiKey))
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %v", err)
	}

	// Warmup TCP/TLS socket with Google
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		it := gClient.ListModels(ctx)
		_, _ = it.Next()
	}()

	return &Client{apiKey, gClient}, nil
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

func (c *Client) SendMessage(prompt, systemPrompt, modelName string, onChunk func(string) error) (string, error) {
	if strings.TrimSpace(prompt) == "" {
		return "", errors.New("prompt cannot be empty")
	}

	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// Choose generative model and try to get response from it
	genModel := c.gClient.GenerativeModel(modelName)

	if systemPrompt != "" {
		genModel.SystemInstruction = genai.NewUserContent(genai.Text(systemPrompt))
	}

	it := genModel.GenerateContentStream(ctx, genai.Text(prompt))
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

				if onChunk != nil {
					if err := onChunk(chunk); err != nil {
						return "", err
					}
				}
			}
		}
	}

	return fullText.String(), nil
}

func (c *Client) GetModels() ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	it := c.gClient.ListModels(ctx)
	var models []string

	for {
		m, err := it.Next()
		if errors.Is(err, iterator.Done) {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("can't get a model: %w", err)
		}

		if slices.Contains(m.SupportedGenerationMethods, "generateContent") {
			clearName := strings.TrimPrefix(m.Name, "models/")
			models = append(models, clearName)
		}
	}

	return models, nil
}
