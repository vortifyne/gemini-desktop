-- +goose Up
CREATE TABLE bookmarks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_message_id ON bookmarks(message_id);

-- +goose Down
DROP INDEX IF EXISTS idx_bookmarks_message_id;
DROP TABLE IF EXISTS bookmarks
