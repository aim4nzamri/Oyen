# Oyen 🧡🐈

A fun, mobile-first website about **Oyen**, the Malaysian orange cat: samseng, chaotic, greedy, and sharing one brain cell with every other orange cat.

The site is in Bahasa Melayu / Manglish. It's a static site built with **Vite + vanilla JS** and hosted for free on **GitHub Pages**.

## Features

| Page | File | Status |
| --- | --- | --- |
| Laman Utama (Home) | `index.html` | ✅ |
| Kuiz: "Oyen Kau Jenis Apa?" | `quiz.html` | ✅ |
| Game: "Selamatkan Ikan Goreng" | `game.html` | ✅ |
| Hall of Fame Oyen | `hall.html` | ✅ |

**Game:** canvas game. Drag a finger (phone) or use ← → / A D (desktop) to move Oyen. Catch ikan goreng (+1) and golden fish (+5), and dodge mak's flying selipar. You have 3 lives, it gets harder over time, P/Esc pauses, and the high score is saved in `localStorage`.

**Hall of Fame:** a gallery of legendary orange cats loaded from `public/data/oyens.json`, with an "Oyen Minggu Ini" (Oyen of the Week) highlight, a Like 🧡 button saved in `localStorage`, and Popular/Terbaru sorting.

The quiz has 8 questions and 6 result types. Each result shows a stat card, a "Share to WhatsApp" link and a downloadable PNG card drawn on a `<canvas>`.

## Project structure

```
.
├── index.html            # Home
├── quiz.html             # Quiz page
├── game.html             # Game page
├── hall.html             # Hall of Fame
├── public/               # Static files copied as-is
│   ├── data/oyens.json   # Hall of Fame data
│   └── oyens/            # Real cat photos go here
├── src/
│   ├── js/
│   │   ├── mascot.js     # Original Oyen mascot as inline SVG, with moods
│   │   ├── nav.js        # Shared header, mobile tab bar and footer
│   │   ├── home.js       # Home page logic
│   │   ├── quiz.js       # Quiz flow, scoring and result screen
│   │   ├── quizData.js   # Questions + result types (edit content here)
│   │   ├── card.js       # Draws the downloadable result card on a canvas
│   │   ├── game.js       # "Selamatkan Ikan Goreng" game loop, input, overlays
│   │   ├── sprites.js    # SVG sprites (fish, selipar) + SVG-to-image loader
│   │   └── hall.js       # Hall of Fame gallery, likes, sorting
│   └── styles/main.css   # All styles (design tokens at the top)
├── vite.config.js        # Multi-page build config
└── .github/workflows/deploy.yml  # GitHub Pages deployment
```

## Run locally

Requirements: Node.js 20+.

```bash
npm install
npm run dev        # dev server at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the built dist/ locally
```

To test on your phone, run `npm run dev -- --host` and open the "Network" URL on a phone connected to the same Wi-Fi.

## Deploy to GitHub Pages

Deployment is automatic via GitHub Actions (`.github/workflows/deploy.yml`).

1. On GitHub, go to **Settings → Pages**. Under **Build and deployment → Source**, choose **GitHub Actions**. You only need to do this once.
2. Push or merge to the `main` branch. The workflow builds the site and publishes `dist/`.
3. The site goes live at **https://aim4nzamri.github.io/Oyen/**. The URL path matches the repo name and is case-sensitive.

You can also trigger a deploy manually from the **Actions** tab ("Deploy to GitHub Pages" → "Run workflow").

`vite.config.js` uses `base: './'` (relative paths), so the build works under any repo name or custom domain without changes.

## Editing content

- **Quiz questions/results:** `src/js/quizData.js`. Each option gives points to one or more result types (`pts: { samseng: 2 }`).
- **Colours/fonts:** CSS variables at the top of `src/styles/main.css`.
- **Game tuning:** constants and `difficulty()` / `spawn()` at the top of `src/js/game.js`. Game-over messages are in `GAME_OVER_LINES`.
- **Mascot moods:** `src/js/mascot.js` (`smug`, `samseng`, `manja`, `pencuri`, `tidur`, `drama`, `otak`).

## Hall of Fame data

Everything is in `public/data/oyens.json`:

```json
{
  "oyenOfTheWeek": { "id": "kapten-oyen", "reason": "Why this cat won this week" },
  "oyens": [
    {
      "id": "kapten-oyen",          // unique, URL-safe
      "name": "Kapten Oyen",
      "location": "Pulau Pinang",
      "caption": "Funny one-liner",
      "mood": "samseng",            // illustration if there is no photo
      "palette": "pekat",           // oren | cair | pekat | krim | karat
      "photo": null,                // e.g. "oyens/kapten-oyen.jpg" or an https:// URL
      "likes": 412,                 // starting like count
      "addedOn": "2026-11-09"       // used by the "Terbaru" sort
    }
  ]
}
```

To add a real cat, drop a photo into `public/oyens/`, add an entry with `"photo": "oyens/<file>.jpg"`, and push. To change the weekly winner, update `oyenOfTheWeek.id`.

Likes are stored per browser only, because there is no backend yet. A future upload/likes backend can return the same JSON shape, and `hall.js` will keep working if you point `DATA_URL` at it.
