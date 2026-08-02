.PHONY: dev build

dev:
	wails dev -tags webkit2_41

build:
	wails build -tags webkit2_41

release-build:
	wails build -tags webkit2_41
	wails build -platform windows/amd64
	cd ./build/bin && tar -czvf gemini-desktop-linux-amd64.tar.gz gemini-desktop