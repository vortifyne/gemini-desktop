-- +goose Up
ALTER TABLE chats ADD COLUMN model_name TEXT DEFAULT 'gemini-3.6-flash';

-- +goose Down
ALTER TABLE chats DROP COLUMN model_name;
