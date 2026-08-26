package domain

import "time"

type Bookmark struct {
	ID             int64     `json:"id"`
	MessageID      int64     `json:"message_id"`
	ChatID         int64     `json:"chat_id"`
	ChatTitle      string    `json:"chat_title"`
	Sender         string    `json:"sender"`
	MessageContent string    `json:"message_content"`
	CreatedAt      time.Time `json:"created_at"`
}
