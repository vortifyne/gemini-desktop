-- +goose Up
ALTER TABLE chats ADD COLUMN system_prompt TEXT DEFAULT '';

-- +goose Down
ALTER TABLE chats DROP COLUMN system_prompt;
