package database

import (
	"context"
	"fmt"
	"log"
	"time"
)

func (s *Storage) SaveMessages(chatID int64, msgs ...MessageItem) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to create transaction: %w", err)
	}
	defer func() {
		_ = tx.Rollback()
	}()

	stmt, err := tx.PrepareContext(ctx, "INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)")
	if err != nil {
		return fmt.Errorf("failed to prepare context: %w", err)
	}
	defer func() {
		_ = stmt.Close()
	}()

	for _, msg := range msgs {
		if _, err := stmt.ExecContext(ctx, chatID, msg.Role, msg.Content); err != nil {
			return fmt.Errorf("SaveMessages.ExecContext (role=%s): %w", msg.Role, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("SaveMessages.Commit: %w", err)
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

func (s *Storage) DeleteLastResponse(chatID int64) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Delete last message from chat with id = chatID
	_, err := s.db.ExecContext(ctx,
		"DELETE FROM messages where id = (SELECT MAX(id) FROM messages WHERE chat_id = ? AND role = 'model');", chatID)
	if err != nil {
		return fmt.Errorf("failed to delete last message from chat: %w", err)
	}

	return nil
}
