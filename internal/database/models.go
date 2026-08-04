package database

import (
	"time"
)

type Chat struct {
	ID                     int64
	Title                  string
	SystemPrompt           string
	ModelName              string
	Temperature            float32
	TopP                   float32
	TopK                   int32
	MaxOutputTokens        int32
	SafetyHateSpeech       string
	SafetyHarassment       string
	SafetyDangerousContent string
	SafetySexuallyExplicit string
	CreatedAt              time.Time
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

type ChatConfig struct {
	Temperature            float32
	TopP                   float32
	TopK                   int32
	MaxOutputTokens        int32
	SafetyHateSpeech       string
	SafetyHarassment       string
	SafetyDangerousContent string
	SafetySexuallyExplicit string
}
