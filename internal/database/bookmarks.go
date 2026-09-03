package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func (s *Storage) AddBookmark(messageID int64) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Insert message ID in database
	_, err := s.db.ExecContext(ctx, "INSERT INTO bookmarks (message_id) VALUES (?)", messageID)
	if err != nil {
		return fmt.Errorf("failed to insert bookmark in database: %w", err)
	}

	return nil
}

func (s *Storage) DeleteBookmark(messageID int64) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Delete bookmark by message ID
	_, err := s.db.ExecContext(ctx, "DELETE FROM bookmarks WHERE message_id = ?", messageID)
	if err != nil {
		return fmt.Errorf("failed to delete bookmark from database: %w", err)
	}

	return nil
}

func (s *Storage) GetBookmarks() ([]domain.Bookmark, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Get all bookmarks via JOIN
	rows, err := s.db.QueryContext(ctx, `
		SELECT 
			b.id,
			b.message_id,
			m.chat_id,
			COALESCE(c.title, 'No title') AS chat_title,
			COALESCE(m.role, 'user') AS sender,
			COALESCE(m.content, '') AS message_content,
			b.created_at
		FROM bookmarks b
		JOIN messages m ON b.message_id = m.id
		JOIN chats c ON m.chat_id = c.id
		ORDER BY b.created_at DESC;`)
	if err != nil {
		return nil, fmt.Errorf("failed to get all bookmarks from database: %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Printf("Error closing rows: %v\n", err)
		}
	}()

	bookmarks := make([]domain.Bookmark, 0)

	for rows.Next() {
		var b domain.Bookmark

		if err := rows.Scan(
			&b.ID,
			&b.MessageID,
			&b.ChatID,
			&b.ChatTitle,
			&b.Sender,
			&b.MessageContent,
			&b.CreatedAt,
		); err != nil {
			return nil, fmt.Errorf("Rows.Next() iterations: %w", err)
		}

		bookmarks = append(bookmarks, b)
	}

	// Check on n-th iteration interrupt
	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("connection interrupted on iteration: %w", err)
	}

	return bookmarks, nil
}
