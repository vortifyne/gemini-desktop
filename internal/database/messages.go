package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func (s *Storage) SaveMessages(chatID int64, msgs ...domain.MessageItem) error {
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

	// Prepared context for fast inserting rows of messages/attachments
	msgStmt, err := tx.PrepareContext(ctx, "INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)")
	if err != nil {
		return fmt.Errorf("failed to prepare message context: %w", err)
	}
	defer func() { _ = msgStmt.Close() }()

	attStmt, err := tx.PrepareContext(ctx, "INSERT INTO attachments (message_id, file_name, mime_type, data) VALUES (?, ?, ?, ?)")
	if err != nil {
		return fmt.Errorf("failed to prepare attachment context: %w", err)
	}
	defer func() { _ = attStmt.Close() }()

	// Inserting messages and attachments
	for _, msg := range msgs {
		res, err := msgStmt.ExecContext(ctx, chatID, msg.Role, msg.Content)
		if err != nil {
			return fmt.Errorf("SaveMessages.msgStmt.ExecContext (role=%s): %w", msg.Role, err)
		}

		// If current message has attachment - take ID of it and insert all attachments to the table
		if len(msg.Attachments) > 0 {
			messageID, err := res.LastInsertId()
			if err != nil {
				return fmt.Errorf("can't get last message id: %w", err)
			}

			for _, att := range msg.Attachments {
				if _, err := attStmt.ExecContext(ctx, messageID, att.FileName, att.MimeType, att.Data); err != nil {
					return fmt.Errorf("SaveMessage.attStmt.ExecContext (file_name=%s): %w", att.FileName, err)
				}
			}
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("SaveMessages.Commit: %w", err)
	}

	return nil
}

func (s *Storage) GetMessages(chatID int64) ([]domain.Message, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Extract all messages from chatID
	msgRows, err := s.db.QueryContext(ctx, `
		SELECT
			id,
			chat_id,
			COALESCE(role, 'user'),
			COALESCE(content, ''),
			created_at
		FROM messages
		WHERE chat_id = ?
		ORDER BY id ASC`, chatID)
	if err != nil {
		return nil, fmt.Errorf("GetMessages.QueryContext(): %w", err)
	}
	defer func() {
		if err := msgRows.Close(); err != nil {
			log.Printf("Error closing msgRows: %v\n", err)
		}
	}()

	// Extract all data from query msgRows to messages slice
	var msgs []domain.Message

	for msgRows.Next() {
		var msg domain.Message

		if err := msgRows.Scan(&msg.ID, &msg.ChatID, &msg.Role, &msg.Content, &msg.CreatedAt); err != nil {
			return nil, fmt.Errorf("Rows.Next() iterations: %w", err)
		}

		msgs = append(msgs, msg)
	}

	// Check that cycle finished correctly
	if err := msgRows.Err(); err != nil {
		return nil, fmt.Errorf("connection interrupted after msgRows.Next() iterations: %w", err)
	}

	// Chat doesn't have any messages
	if len(msgs) == 0 {
		return msgs, nil
	}

	// Extract all attachments data
	attRows, err := s.db.QueryContext(ctx, `
		SELECT a.message_id, a.file_name, a.mime_type, a.data
		FROM attachments a
		JOIN messages m ON a.message_id = m.id
		WHERE m.chat_id = ?
		ORDER BY a.id ASC
		`, chatID)
	if err != nil {
		return nil, fmt.Errorf("can't extract attachments: %w", err)
	}
	defer func() {
		if err := attRows.Close(); err != nil {
			log.Printf("Error closing attRows: %v\n", err)
		}
	}()

	attMap := make(map[int64][]domain.Attachment)
	for attRows.Next() {
		var msgID int64
		var att domain.Attachment

		if err := attRows.Scan(&msgID, &att.FileName, &att.MimeType, &att.Data); err != nil {
			return nil, fmt.Errorf("error while reading messageID: %w", err)
		}

		attMap[msgID] = append(attMap[msgID], att)
	}

	if err := attRows.Err(); err != nil {
		return nil, fmt.Errorf("connection interrupted after attRows.Next() iterations: %w", err)
	}

	for i := range msgs {
		msgs[i].Attachments = attMap[msgs[i].ID]
	}

	return msgs, nil
}

func (s *Storage) DeleteLastMessage(chatID int64, role string) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := s.db.ExecContext(ctx,
		"DELETE FROM messages WHERE id = (SELECT MAX(id) FROM messages WHERE chat_id = ? AND role = ?);",
		chatID, role)
	if err != nil {
		return fmt.Errorf("failed to delete last message (%s) from chat: %w", role, err)
	}

	return nil
}
