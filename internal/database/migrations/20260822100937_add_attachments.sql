-- +goose Up
CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    data BLOB NOT NULL,
    FOREIGN KEY (message_id) REFERENCES messages (id) ON DELETE CASCADE
);
CREATE INDEX idx_attachments_message_id ON attachments (message_id);

-- +goose Down
DROP INDEX IF EXISTS idx_attachments_message_id;
DROP TABLE attachments;
