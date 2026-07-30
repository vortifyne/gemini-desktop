package database

import (
	"context"
	"fmt"
	"log"
	"time"
)

func (s *Storage) CreateChat(title string) (int64, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert new chat with title in the table
	res, err := s.db.ExecContext(ctx, "INSERT INTO chats (title) VALUES (?)", title)
	if err != nil {
		return 0, fmt.Errorf("CreateChat.ExecContext(): %w", err)
	}

	// Last inserted chat (information for frontend)
	lastInserted, err := res.LastInsertId()
	if err != nil {
		return 0, fmt.Errorf("CreateChat.LastInsertID(): %w", err)
	}

	return lastInserted, nil
}

func (s *Storage) SaveMessage(chatID int64, role, content string) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert message in the table
	_, err := s.db.ExecContext(
		ctx,
		"INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)",
		chatID, role, content)
	if err != nil {
		return fmt.Errorf("SaveMessage.ExecContext(): %w", err)
	}

	return nil
}

func (s *Storage) GetMessages(chatID int64) ([]Message, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Extract all messages from chatID
	rows, err := s.db.QueryContext(
		ctx,
		"SELECT id, chat_id, role, content, created_at FROM messages where chat_id = ? ORDER BY id ASC", chatID)
	if err != nil {
		return nil, fmt.Errorf("GetMessages.QueryContext(): %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Printf("Error closing rows: %v\n", err)
		}
	}()

	// Extract all data from query rows to messages slice
	var msgs []Message

	for rows.Next() {
		var msg Message

		if err := rows.Scan(&msg.ID, &msg.ChatID, &msg.Role, &msg.Content, &msg.CreatedAt); err != nil {
			return nil, fmt.Errorf("Rows.Next() iterations: %w", err)
		}

		msgs = append(msgs, msg)
	}

	// Check that cycle finished correctly
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("connection interrupted after rows.Next() iterations: %w", err)
	}

	return msgs, nil
}

func (s *Storage) GetChats() ([]Chat, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get all chats by descendancy (new chats will be on top)
	rows, err := s.db.QueryContext(
		ctx,
		"SELECT id, title, created_at FROM chats ORDER BY id DESC")
	if err != nil {
		return nil, fmt.Errorf("GetChats.QueryContext(): %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Printf("Error closing rows: %v\n", err)
		}
	}()

	// Extract all chats row by row
	var chats []Chat

	for rows.Next() {
		var c Chat

		if err := rows.Scan(&c.ID, &c.Title, &c.CreatedAt); err != nil {
			return nil, fmt.Errorf("Rows.Next() iterations: %w", err)
		}

		chats = append(chats, c)
	}

	// Check that cycle finished correctly
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("connection interrupted after rows.Next() iterations: %w", err)
	}

	return chats, nil
}
