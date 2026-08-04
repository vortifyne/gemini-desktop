package domain

import (
	"time"
)

type Chat struct {
	ID                     int64     `json:"id"`
	Title                  string    `json:"title"`
	SystemPrompt           string    `json:"system_prompt"`
	ModelName              string    `json:"model_name"`
	Temperature            float32   `json:"temperature"`
	TopP                   float32   `json:"top_p"`
	TopK                   int32     `json:"top_k"`
	MaxOutputTokens        int32     `json:"max_output_tokens"`
	SafetyHateSpeech       string    `json:"safety_hate_speech"`
	SafetyHarassment       string    `json:"safety_harassment"`
	SafetyDangerousContent string    `json:"safety_dangerous_content"`
	SafetySexuallyExplicit string    `json:"safety_sexually_explicit"`
	CreatedAt              time.Time `json:"created_at"`
}

type ChatConfig struct {
	Temperature            float32 `json:"temperature"`
	TopP                   float32 `json:"top_p"`
	TopK                   int32   `json:"top_k"`
	MaxOutputTokens        int32   `json:"max_output_tokens"`
	SafetyHateSpeech       string  `json:"safety_hate_speech"`
	SafetyHarassment       string  `json:"safety_harassment"`
	SafetyDangerousContent string  `json:"safety_dangerous_content"`
	SafetySexuallyExplicit string  `json:"safety_sexually_explicit"`
}

func (c *Chat) ApplyDefaults() {
	if c.Temperature == 0 {
		c.Temperature = 0.7
	}
	if c.TopP == 0 {
		c.TopP = 0.95
	}
	if c.TopK == 0 {
		c.TopK = 40
	}
	if c.MaxOutputTokens == 0 {
		c.MaxOutputTokens = 8192
	}
	if c.SafetyHateSpeech == "" {
		c.SafetyHateSpeech = "NONE"
	}
	if c.SafetyHarassment == "" {
		c.SafetyHarassment = "NONE"
	}
	if c.SafetyDangerousContent == "" {
		c.SafetyDangerousContent = "NONE"
	}
	if c.SafetySexuallyExplicit == "" {
		c.SafetySexuallyExplicit = "NONE"
	}
}
