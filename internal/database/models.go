package database

import "time"

type chats struct {
	ID        int64
	Title     string
	CreatedAt time.Time
}

type messages struct {
	ID        int64
	chatID    int64
	Role      string
	Content   string
	CreatedAt time.Time
}
