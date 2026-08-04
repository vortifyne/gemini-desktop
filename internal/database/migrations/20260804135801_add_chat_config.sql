-- +goose Up
ALTER TABLE chats ADD COLUMN temperature REAL DEFAULT 0.7;
ALTER TABLE chats ADD COLUMN top_p REAL DEFAULT 0.95;
ALTER TABLE chats ADD COLUMN top_k INTEGER DEFAULT 40;
ALTER TABLE chats ADD COLUMN max_output_tokens INTEGER DEFAULT 8192;
ALTER TABLE chats ADD COLUMN safety_hate_speech TEXT DEFAULT 'NONE';
ALTER TABLE chats ADD COLUMN safety_harassment TEXT DEFAULT 'NONE';
ALTER TABLE chats ADD COLUMN safety_dangerous_content TEXT DEFAULT 'NONE';
ALTER TABLE chats ADD COLUMN safety_sexually_explicit TEXT DEFAULT 'NONE';

-- +goose Down
ALTER TABLE chats DROP COLUMN temperature;
ALTER TABLE chats DROP COLUMN top_p;
ALTER TABLE chats DROP COLUMN top_k;
ALTER TABLE chats DROP COLUMN max_output_tokens;
ALTER TABLE chats DROP COLUMN safety_hate_speech;
ALTER TABLE chats DROP COLUMN safety_harassment;
ALTER TABLE chats DROP COLUMN safety_dangerous_content;
ALTER TABLE chats DROP COLUMN safety_sexually_explicit;
