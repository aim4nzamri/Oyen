// Renders comic episodes to PNG.
// Usage: node comics/render.mjs [episode-file-name ...]   (default: all episodes)
// Output: public/komik/<number>-<slug>.png
// Needs Playwright + Chromium (see README "Comics").
import { readdirSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { page, PAGE_W, PAGE_H } from './lib.mjs';

const dir = resolve(import.meta.dirname, 'episodes');
const outDir = process.env.COMIC_OUT || resolve(import.meta.dirname, '../public/komik');
mkdirSync(outDir, { recursive: true });

const wanted = process.argv.slice(2);
const files = readdirSync(dir)
  .filter((f) => f.endsWith('.mjs'))
  .filter((f) => !wanted.length || wanted.some((w) => f.includes(w)))
  .sort();

const browser = await chromium.launch();
const tab = await browser.newPage({ viewport: { width: PAGE_W, height: PAGE_H } });

for (const f of files) {
  const ep = await import(pathToFileURL(resolve(dir, f)).href);
  const svg = page({ number: ep.meta.number, title: ep.meta.title, panels: ep.panels });
  await tab.setContent(`<!doctype html><html><head>
    <link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&family=Bangers&display=swap" rel="stylesheet">
    <style>*{margin:0} body{width:${PAGE_W}px}</style></head><body>${svg}</body></html>`);
  await tab.evaluate(() => document.fonts.ready);
  const name = `${String(ep.meta.number).padStart(3, '0')}-${ep.meta.slug}.png`;
  await tab.locator('svg').first().screenshot({ path: resolve(outDir, name) });
  console.log('wrote public/komik/' + name);
}
await browser.close();
