package domain

import "time"

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
