package database

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

type Message struct {
	ID        int64
	ChatID    int64
	Role      string
	Content   string
	CreatedAt time.Time
}

type MessageItem struct {
	Role    string
	Content string
}
