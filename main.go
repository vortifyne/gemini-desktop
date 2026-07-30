package main

import (
	"embed"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/vortifyne/gemini-desktop/internal/bindings"
	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/vortifyne/gemini-desktop/internal/gemini"
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

	// Read API key
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, using system ENVs")
	}

	key := os.Getenv("GEMINI_API_KEY")

	// Initialize Gemini Client
	isValid, err := gemini.CheckGeminiKeyLive(key)
	if err != nil || !isValid {
		log.Println("Key read from .env isn't valid")
	}

	client := gemini.NewGeminiClient(key)
	app := bindings.NewApp(storage, client)

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
