package main

import (
	"embed"
	"log"

	"github.com/vortifyne/gemini-desktop/internal/bindings"
	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := bindings.NewApp()

	storage, err := database.NewStorage()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer func(storage *database.Storage) {
		if err := storage.Close(); err != nil {
			log.Fatalf("Failed to close database: %v", err)
		}
	}(storage)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "gemini-desktop",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
