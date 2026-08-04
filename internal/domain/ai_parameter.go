package domain

type AIParameter struct {
	Prompt       string
	SystemPrompt string
	ModelName    string
	OnChunk      func(string) error
	Cfg          ChatConfig
}
