package gemini

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"google.golang.org/genai"
)

type Client struct {
	apiKey  string
	gClient *genai.Client
}

func NewGeminiClient(apiKey string) (*Client, error) {
	// Create new client with API key
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	gClient, err := genai.NewClient(ctx, &genai.ClientConfig{APIKey: apiKey, Backend: genai.BackendGeminiAPI})
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %v", err)
	}

	// Warmup TCP/TLS socket with Google
	go func() {
		ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
		defer cancel()

		it, err := gClient.Models.List(ctx, nil)
		if err != nil {
			log.Printf("failed to get a list of models\n")
			return
		}
		_, _ = it.Next(ctx)
	}()

	return &Client{apiKey, gClient}, nil
}

func CheckGeminiKeyLive(apiKey string) (bool, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	// Create new client with API key
	client, err := genai.NewClient(ctx, &genai.ClientConfig{APIKey: apiKey, Backend: genai.BackendGeminiAPI})
	if err != nil {
		return false, fmt.Errorf("genai.NewClient() error: %w", err)
	}

	// Get one model to check the key
	it, err := client.Models.List(ctx, &genai.ListModelsConfig{PageSize: 1})
	if err != nil {
		return false, err
	}

	// Make real request on server
	_, err = it.Next(ctx)
	if err != nil {
		var apiErr *genai.APIError
		if errors.As(err, &apiErr) { // server sent bad answer but without system errors
			if apiErr.Code == http.StatusUnauthorized || apiErr.Code == http.StatusForbidden {
				return false, nil
			}
		}

		return false, fmt.Errorf("server didn't answer: %w", err)
	}

	return true, nil
}

func (c *Client) GetModels() ([]string, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	models := make([]string, 0)

	for m, err := range c.gClient.Models.All(ctx) {
		if err != nil {
			return nil, fmt.Errorf("failed to get all models: %w", err)
		}

		models = append(models, m.Name)
	}

	return models, nil
}
