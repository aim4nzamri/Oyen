import { basename, resolve } from 'node:path';
import { defineConfig } from 'vite';

// Public URL of the deployed site. Social previews (WhatsApp, Facebook, X)
// need absolute URLs for og:image. The GitHub Actions workflow passes the
// real Pages URL via SITE_URL; this default is used for local builds.
const SITE_URL = (process.env.SITE_URL || 'https://aim4nzamri.github.io/Oyen/').replace(/\/?$/, '/');

const attr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

/** Injects favicon, manifest, Open Graph and Twitter tags into every page. */
function seoTags() {
  return {
    name: 'oyen-seo-tags',
    transformIndexHtml(html, ctx) {
      const file = basename(ctx.filename);
      const url = SITE_URL + (file === 'index.html' ? '' : file);
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? 'Oyen';
      const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '';
      const image = `${SITE_URL}og-image.png`;
      const tags = `
    <link rel="icon" href="./favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="./favicon-32.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="./apple-touch-icon.png" />
    <link rel="manifest" href="./site.webmanifest" />
    <link rel="canonical" href="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Oyen" />
    <meta property="og:locale" content="ms_MY" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${attr(title)}" />
    <meta property="og:description" content="${attr(desc)}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="Oyen, kucing oren samseng pakai cermin mata hitam" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(title)}" />
    <meta name="twitter:description" content="${attr(desc)}" />
    <meta name="twitter:image" content="${image}" />
  `;
      return html.replace('</head>', `${tags}</head>`);
    },
  };
}

// Relative base so the site works under https://<user>.github.io/<repo>/
// regardless of the repo name's casing.
export default defineConfig({
  base: './',
  plugins: [seoTags()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        quiz: resolve(import.meta.dirname, 'quiz.html'),
        game: resolve(import.meta.dirname, 'game.html'),
        kedai: resolve(import.meta.dirname, 'kedai.html'),
      },
    },
  },
});
