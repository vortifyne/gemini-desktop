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

func (s *Storage) GetChats() ([]Chat, error) {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	rows, err := s.db.QueryContext(
		ctx,
		`SELECT
			id,
			title,
			system_prompt,
			model_name,
			temperature,
			top_p,
			top_k,
			max_output_tokens,
			safety_hate_speech,
			safety_harassment,
			safety_dangerous_content,
			safety_sexually_explicit,
			created_at
		FROM chats
		ORDER BY id DESC`)
	if err != nil {
		return nil, fmt.Errorf("GetChats.QueryContext(): %w", err)
	}
	defer func() {
		if err := rows.Close(); err != nil {
			log.Printf("Error closing rows: %v\n", err)
		}
	}()

	var chats []Chat

	for rows.Next() {
		var c Chat

		if err := rows.Scan(
			&c.ID,
			&c.Title,
			&c.SystemPrompt,
			&c.ModelName,
			&c.Temperature,
			&c.TopP,
			&c.TopK,
			&c.MaxOutputTokens,
			&c.SafetyHateSpeech,
			&c.SafetyHarassment,
			&c.SafetyDangerousContent,
			&c.SafetySexuallyExplicit,
			&c.CreatedAt); err != nil {
			return nil, fmt.Errorf("Rows.Next() iterations: %w", err)
		}

		chats = append(chats, c)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("connection interrupted after rows.Next() iterations: %w", err)
	}

	return chats, nil
}

func (s *Storage) DeleteChat(chatID int64) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Initialize transaction to exclude database inconsistency
	tx, err := s.db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to create transaction: %w", err)
	}
	defer func() { _ = tx.Rollback() }()

	// Firstly, delete all message to exclude orphan messages
	_, err = tx.ExecContext(ctx, "DELETE FROM messages WHERE chat_id = ?", chatID)
	if err != nil {
		return err
	}

	// Delete the whole chat itself
	_, err = tx.ExecContext(ctx, "DELETE FROM chats WHERE id = ?", chatID)
	if err != nil {
		return err
	}

	// Save changes to database if it's successful
	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit changes after transaction: %w", err)
	}

	return nil
}

func (s *Storage) UpdateChatTitle(chatID int64, newTitle string) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Update title of chat in database
	_, err := s.db.ExecContext(ctx, `
		UPDATE chats
		SET title = ?
		WHERE id = ?`,
		newTitle, chatID)
	if err != nil {
		return err
	}

	return nil
}

func (s *Storage) UpdateSystemPrompt(chatID int64, systemPrompt string) error {
	// Set timeout for queries
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Update system prompt
	_, err := s.db.ExecContext(ctx, `
		UPDATE chats
		SET system_prompt = ?
		WHERE id = ?`,
		systemPrompt, chatID)
	if err != nil {
		return err
	}

	return nil
}

func (s *Storage) UpdateChatModel(chatID int64, modelName string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := s.db.ExecContext(ctx, `
		UPDATE chats
		SET model_name = ?
		WHERE id = ?`,
		modelName, chatID)
	if err != nil {
		return fmt.Errorf("failed to update chat model: %w", err)
	}

	return nil
}

func (s *Storage) UpdateChatConfiguration(chatID int64, cfg ChatConfig) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	_, err := s.db.ExecContext(ctx, `
		UPDATE chats SET
			temperature = ?,
			top_p = ?,
			top_k = ?,
			max_output_tokens = ?,
			safety_hate_speech = ?,
			safety_harassment = ?,
			safety_dangerous_content = ?,
			safety_sexually_explicit = ?
		WHERE id = ?`,
		cfg.Temperature, cfg.TopP, cfg.TopK, cfg.MaxOutputTokens, cfg.SafetyHateSpeech,
		cfg.SafetyHarassment, cfg.SafetyDangerousContent, cfg.SafetySexuallyExplicit, chatID)
	if err != nil {
		return fmt.Errorf("failed to update chat configuration: %w", err)
	}

	return nil
}
