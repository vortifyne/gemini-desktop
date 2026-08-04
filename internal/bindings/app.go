package bindings

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/vortifyne/gemini-desktop/internal/database"
	"github.com/vortifyne/gemini-desktop/internal/gemini"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx           context.Context
	closeBehavior string
	storage       *database.Storage
	aiClient      *gemini.Client
	cancelMu      sync.Mutex
	cancelFunc    context.CancelFunc
}

type ReleaseInfo struct {
	TagName string `json:"tag_name"`
	HtmlUrl string `json:"html_url"`
}

// NewApp creates a new App application struct
func NewApp(storage *database.Storage, client *gemini.Client) *App {
	return &App{storage: storage, aiClient: client}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
	go a.CheckForUpdates()
}

func (a *App) GetModels() ([]string, error) {
	return a.aiClient.GetModels()
}

func (a *App) CheckForUpdates() {
	ctx, cancel := context.WithTimeout(context.Background(), 60*time.Second)
	defer cancel()

	client := &http.Client{Timeout: 30 * time.Second}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, "https://api.github.com/repos/vortifyne/gemini-desktop/releases/latest", nil)
	if err != nil {
		log.Printf("Can't create request: %v", err)
		return
	}
	req.Header.Set("User-Agent", "Gemini-Desktop-App")

	resp, err := client.Do(req)
	if err != nil {
		log.Printf("Can't send request to URL: %v", err)
		return
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			log.Printf("Can't close resp.Body: %v", err)
			return
		}
	}()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Github returned status: %d", resp.StatusCode)
		return
	}

	var release ReleaseInfo
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		log.Printf("failed to decode release json: %v", err)
		return
	}

	const currentVersion = "v0.3.0"
	if release.TagName != currentVersion {
		runtime.EventsEmit(a.ctx, "update-available", release)
	}
}

func (a *App) OnBeforeClose(ctx context.Context) bool {
	switch a.closeBehavior {
	case "minimize":
		runtime.WindowHide(ctx)
		return true
	case "quit":
		return false
	default:
		runtime.EventsEmit(ctx, "prompt-close-behavior")
		return true
	}
}

func (a *App) ShowWindow() {
	if a.ctx != nil {
		runtime.WindowShow(a.ctx)
	}
}

func (a *App) QuitApp() {
	a.closeBehavior = "quit"
	if a.ctx != nil {
		runtime.Quit(a.ctx)
	}
}

func (a *App) SetCloseBehavior(behavior string) {
	a.closeBehavior = behavior
}
