# Oyen 🧡🐈

A fun, mobile-first website about **Oyen**, the Malaysian orange cat: samseng, chaotic, greedy, and sharing one brain cell with every other orange cat.

The site is in Bahasa Melayu / Manglish. It's a static site built with **Vite + vanilla JS** and hosted for free on **GitHub Pages**.

## Features

| Page | File | Status |
| --- | --- | --- |
| Laman Utama (Home) | `index.html` | ✅ |
| Kuiz: "Oyen Kau Jenis Apa?" | `quiz.html` | ✅ |
| Game: "Selamatkan Ikan Goreng" | `game.html` | 🚧 Phase 2 |
| Hall of Fame Oyen | `hall.html` | 🚧 Phase 3 |

The quiz has 8 questions and 6 result types. Each result shows a stat card, a "Share to WhatsApp" link and a downloadable PNG card drawn on a `<canvas>`.

## Project structure

```
.
├── index.html            # Home
├── quiz.html             # Quiz page
├── game.html             # Game page (placeholder for now)
├── hall.html             # Hall of Fame (placeholder for now)
├── public/               # Static files copied as-is (favicon, OG image, data)
├── src/
│   ├── js/
│   │   ├── mascot.js     # Original Oyen mascot as inline SVG, with moods
│   │   ├── nav.js        # Shared header, mobile tab bar and footer
│   │   ├── home.js       # Home page logic
│   │   ├── quiz.js       # Quiz flow, scoring and result screen
│   │   ├── quizData.js   # Questions + result types (edit content here)
│   │   ├── card.js       # Draws the downloadable result card on a canvas
│   │   └── soon.js       # "Coming soon" pages
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
- **Mascot moods:** `src/js/mascot.js` (`smug`, `samseng`, `manja`, `pencuri`, `tidur`, `drama`, `otak`).
