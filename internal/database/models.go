package database

import "time"

type Chat struct {
	ID        int64
	Title     string
	CreatedAt time.Time
}

type Message struct {
	ID        int64
	ChatID    int64
	Role      string
	Content   string
	CreatedAt time.Time
}
