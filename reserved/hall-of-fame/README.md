# Hall of Fame (reserved, not published)

This feature is parked and is not part of the website build. To bring it back:

1. Move the files back:
   - `hall.html` → project root
   - `hall.js` → `src/js/hall.js`
   - `data/` → `public/data/`
   - `oyens/` → `public/oyens/`
2. Add `hall: resolve(import.meta.dirname, 'hall.html')` to `build.rollupOptions.input` in `vite.config.js`.
3. Add the Hall link back to `LINKS` in `src/js/nav.js`.

The styles are still in `src/styles/main.css` (the "Hall of Fame" section). The mascot fur palettes it uses (`PALETTES` in `src/js/mascot.js`) are still there too.

For real photo uploads, see the plan to move hosting to Cloudflare Pages with Functions, R2, D1 and Turnstile.
