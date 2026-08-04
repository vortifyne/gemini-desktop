package main

import (
	"embed"
	"log"

	"github.com/energye/systray"
	"github.com/vortifyne/gemini-desktop/internal/bindings"
	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

//go:embed build/appicon.png
var trayIcon []byte

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

	go systray.Run(func() {
		systray.SetIcon(trayIcon)
		systray.SetTitle("Gemini Desktop")
		systray.SetTooltip("Gemini Desktop")

		mShow := systray.AddMenuItem("Show Gemini Desktop", "Open application window")
		systray.AddSeparator()
		mQuit := systray.AddMenuItem("Quit", "Quit application")

		mShow.Click(func() {
			app.ShowWindow()
		})
		mQuit.Click(func() {
			app.QuitApp()
		})
		systray.SetOnClick(func(_ systray.IMenu) {
			app.ShowWindow()
		})
	}, func() {})

	// Create application with options
	err = wails.Run(&options.App{
		Title:  "Gemini Desktop",
		Width:  1280,
		Height: 720,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 9, G: 9, B: 11, A: 255},
		OnStartup:        app.Startup,
		OnBeforeClose:    app.OnBeforeClose,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
