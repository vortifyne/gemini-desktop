package bindings

import (
	"github.com/vortifyne/gemini-desktop/internal/domain"
)

func (a *App) AddBookmark(messageID int64) error {
	return a.storage.AddBookmark(messageID)
}

func (a *App) DeleteBookmark(messageID int64) error {
	return a.storage.DeleteBookmark(messageID)
}

func (a *App) GetBookmarks() ([]domain.Bookmark, error) {
	return a.storage.GetBookmarks()
}
