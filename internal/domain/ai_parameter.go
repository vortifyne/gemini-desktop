package domain

type AIParameter struct {
	Prompt       string             `json:"prompt"`
	SystemPrompt string             `json:"system_prompt"`
	ModelName    string             `json:"model_name"`
	OnChunk      func(string) error `json:"-"`
	Cfg          ChatConfig         `json:"cfg"`
	History      []Message          `json:"history"`
}
