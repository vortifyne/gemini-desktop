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
	// Set up database
	storage, err := database.NewStorage()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v\n", err)
	}
	defer func(storage *database.Storage) {
		if err := storage.Close(); err != nil {
			log.Fatalf("Failed to close database: %v\n", err)
		}
	}(storage)

	app := bindings.NewApp(storage, nil)

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "gemini-desktop",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 9, G: 9, B: 11, A: 255},
		OnStartup:        app.Startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
