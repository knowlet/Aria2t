# Aria2t (Tauri)

## Introduction
This is a Tauri-based desktop wrapper for AriaNg. It migrates the original Electron app to Tauri, keeping the same Angular 1.x frontend and features while drastically reducing footprint and improving startup.

## Requirements
- Rust (for Tauri backend)
- Node.js and npm

## Install
```
bun install
```
This will also copy vendor assets from `node_modules` into `app/vendor` via `scripts/setup-vendor.js`.

If you add or update frontend dependencies, run:
```
bun run setup:vendor
```

## Develop
```
bun run tauri dev
```
This launches the Tauri dev window loading the frontend from `app/`.

## Build
```
bun run tauri build
```
Artifacts are produced by Tauri. Update `src-tauri/tauri.conf.json` for bundle identifiers and icons.

### Mobile (optional)
Android:
```
bun run tauri:android:dev
bun run tauri:android:build
```

iOS:
```
bun run tauri:ios:dev
bun run tauri:ios:build
```

## Notes
- The Angular frontend is in `app/`. Third‑party CSS/JS are copied to `app/vendor`.
- Some Electron-specific features are stubbed or replaced. Core RPC over HTTP/WebSocket works in-browser.
- If icons don’t render, ensure `app/vendor/font-awesome/fonts/*` exists (re-run `npm run setup:vendor`).

## Legacy scripts
Electron utilities and build files have been removed during migration. Tauri serves static files directly from `app/`, and `scripts/setup-vendor.js` handles copying required assets.

## License
MIT
