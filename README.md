# E² Teaching Framework

> Every student has the right to understand.

A complete teaching companion — lesson planning, term blueprints, rubrics,
and reference tools in one place. Works in any browser, installs as a PWA
on phones, tablets, and desktops, and can be packaged as native iOS,
Android, Mac, Windows, and Linux apps.

## Live preview

- 🌐 Launcher: [`index.html`](./index.html)
- ✨ All-in-one app: [`e2-complete-app.html`](./e2-complete-app.html)
- 📖 Reference guide: [`e2-teaching-framework.html`](./e2-teaching-framework.html)
- 📝 Lesson planner: [`e2-lesson-planner.html`](./e2-lesson-planner.html)
- 📅 Blueprint planner: [`e2-blueprint-planner.html`](./e2-blueprint-planner.html)
- 🎯 Rubrics & assessment: [`e2-rubrics-assessment.html`](./e2-rubrics-assessment.html)

Open any HTML file in a browser — no build step required. Data is saved
locally via `localStorage`.

## Install as a phone/desktop app (no store required)

1. Open the launcher URL in Safari (iOS) or Chrome (Android / desktop).
2. Tap **Share → Add to Home Screen** (iOS) or the **Install** button
   (Chrome / Edge — the app auto-prompts).
3. Launch from your home screen — runs full-screen, works offline.

## Run locally

```bash
# Serve the static site on port 8080
npm install
npm run serve
# Open http://localhost:8080
```

## Package as native apps

See [`COMMERCIALIZATION.md`](./COMMERCIALIZATION.md) for step-by-step
instructions for all four distribution paths:

1. **PWA on your own website** — sell directly, $0 platform fees
2. **Google Play + Microsoft Store** — via PWA Builder
3. **Apple App Store + Google Play** — via Capacitor (native wrappers)
4. **Mac / Windows / Linux desktop** — via Tauri

## Repository layout

```
desktop-tutorial/
├── index.html                     ← launcher / home
├── e2-*.html                      ← the 5 apps
├── manifest.webmanifest           ← PWA manifest
├── service-worker.js              ← offline cache
├── pwa.js                         ← install prompt + SW registration
├── license.js                     ← optional license gate (Gumroad/Lemon)
├── icons/                         ← PNG icons for all platforms
├── scripts/generate-icons.py      ← regenerate icon set from palette
├── capacitor.config.json          ← iOS + Android wrapper config
├── src-tauri/                     ← Mac/Windows/Linux desktop wrapper
├── package.json                   ← npm scripts for each pipeline
├── COMMERCIALIZATION.md           ← how to sell it on every platform
├── PRIVACY.md                     ← privacy policy (template)
└── EULA.md                        ← end-user licence agreement (template)
```

## Regenerate icons

```bash
npm run icons    # (requires Python 3 + Pillow)
```

Edit colours or the logo mark in `scripts/generate-icons.py`.

## Licence

This repository is the **Software** referred to in [`EULA.md`](./EULA.md).
Usage is subject to that agreement.

---

© 2026 Dina El Ahl. Every student has the right to understand.
