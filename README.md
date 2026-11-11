# Oyen 🧡🐈

A fun, mobile-first website about **Oyen**, the Malaysian orange cat: samseng, chaotic, greedy, and sharing one brain cell with every other orange cat.

The site is in Bahasa Melayu / Manglish. It's a static site built with **Vite + vanilla JS** and hosted for free on **GitHub Pages**.

## Features

| Page | File | Status |
| --- | --- | --- |
| Laman Utama (Home) | `index.html` | ✅ |
| Kuiz: "Oyen Kau Jenis Apa?" | `quiz.html` | ✅ |
| Game: "Selamatkan Ikan Goreng" | `game.html` | ✅ |
| Kedai Oyen (shop + Belanja Oyen) | `kedai.html` | ✅ |
| Hall of Fame Oyen | `reserved/hall-of-fame/` | ⏸️ Parked, not published |

**Game:** canvas game. Drag a finger (phone) or use ← → / A D (desktop) to move Oyen. Catch ikan goreng (+1) and golden fish (+5), and dodge mak's flying selipar. You have 3 lives, it gets harder over time, P/Esc pauses, and the high score is saved in `localStorage`.

**Kedai Oyen:**
- *Barang Wajib Oyen*: affiliate product picks with Oyen's reviews and category filters.
- *Belanja Oyen*: donations through a DuitNow QR and optional Ko-fi/e-wallet links.
- A merch teaser.

**Polish:**
- 🔊/🔇 sound toggle in the header. All sounds are synthesized with the Web Audio API, so there are no audio files.
- Confetti, a wagging tail and page animations. They are reduced when `prefers-reduced-motion` is set.
- Favicon, app icons, and Open Graph/Twitter meta tags for rich WhatsApp link previews.

The quiz has 8 questions and 6 result types. Each result shows a stat card, a "Share to WhatsApp" link and a downloadable PNG card drawn on a `<canvas>`.

## Project structure

```
.
├── index.html            # Home
├── quiz.html             # Quiz page
├── game.html             # Game page
├── kedai.html            # Kedai Oyen (affiliate shop + donations)
├── public/               # Static files copied as-is
│   ├── og-image.png      # 1200x630 social preview image
│   ├── favicon.svg, favicon-32.png, apple-touch-icon.png, icon-512.png
│   ├── site.webmanifest
│   └── belanja/duitnow-qr.png  # Your DuitNow QR (add this)
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
│   │   ├── sound.js      # Synthesized sound effects + on/off state
│   │   ├── kedai.js      # Kedai Oyen page
│   │   ├── kedaiData.js  # ← EDIT: affiliate links, products, DuitNow/donation settings
│   │   └── siteConfig.js # ← EDIT: TikTok / IG / YouTube links (shown in footer)
│   └── styles/main.css   # All styles (design tokens at the top)
├── reserved/hall-of-fame/  # Parked Hall of Fame feature (see its README)
├── scripts/generate-assets.mjs  # Regenerates icons + OG image from the mascot
├── vite.config.js        # Multi-page build config + SEO/OG tag injection
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

The workflow passes the real Pages URL to the build as `SITE_URL`. A small plugin in `vite.config.js` then writes absolute `og:image` and `og:url` tags, which WhatsApp needs. For local builds it falls back to `https://aim4nzamri.github.io/Oyen/`. If you move to a custom domain, nothing needs changing.

**WhatsApp preview cache:** WhatsApp caches previews per URL. If an old preview shows, add a query string such as `?v=2` to the link.

`vite.config.js` uses `base: './'` (relative paths), so the build works under any repo name or custom domain without changes.

## Editing content

- **Quiz questions/results:** `src/js/quizData.js`. Each option gives points to one or more result types (`pts: { samseng: 2 }`).
- **Colours/fonts:** CSS variables at the top of `src/styles/main.css`.
- **Game tuning:** constants and `difficulty()` / `spawn()` at the top of `src/js/game.js`. Game-over messages are in `GAME_OVER_LINES`.
- **Mascot moods:** `src/js/mascot.js` (`smug`, `samseng`, `manja`, `pencuri`, `tidur`, `drama`, `otak`).

## Kedai Oyen: affiliate links and donations

Everything is in **`src/js/kedaiData.js`**:

- **Products:** paste your Shopee Affiliate link into each product's `url`. Leave it empty (`''`) and the button shows "Link akan datang". Add, remove or reorder products freely. To use a product photo, put it in `public/kedai/` and set `image: 'kedai/<file>.jpg'`.
- **DuitNow QR:** save your QR image as `public/belanja/duitnow-qr.png`. Until it exists, a "QR DuitNow akan datang" placeholder is shown. Set `qrName` to the account name people will see when they scan, so they know it's legit.
- **Other donation links:** fill in `links` (Ko-fi, TNG, etc.) with `https://` URLs. Empty ones are hidden.

Product links use `rel="sponsored"`, and the page shows an affiliate disclosure, as Shopee and Google require.

Social accounts (TikTok, Instagram, YouTube, Facebook) go in **`src/js/siteConfig.js`**. They appear in the footer once filled in.

## Regenerating icons and the OG image

The PNGs in `public/` are generated from the SVG mascot and committed. You only need to regenerate them after changing the mascot:

```bash
npm i -D playwright && npx playwright install chromium
node scripts/generate-assets.mjs
```
