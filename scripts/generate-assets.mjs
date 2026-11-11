// Generates favicon / app icons / Open Graph image from the SVG mascot.
// Usage: node scripts/generate-assets.mjs
// Needs Playwright with Chromium available (npm i -D playwright && npx playwright install chromium).
// Output goes to public/ and is committed, so this only needs re-running when the mascot changes.
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';
import { mascotSVG } from '../src/js/mascot.js';

const out = (f) => resolve(import.meta.dirname, '../public', f);
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap" rel="stylesheet">`;

// 1) SVG favicon (scales perfectly in modern browsers)
writeFileSync(out('favicon.svg'), mascotSVG({ headOnly: true, label: 'Oyen' }));

const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(html, w, h, file) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head>${FONT}<style>
    *{margin:0;box-sizing:border-box} body{width:${w}px;height:${h}px;overflow:hidden;font-family:'Baloo 2',sans-serif;color:#3B2314}
  </style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out(file), omitBackground: file.startsWith('favicon') });
  console.log('wrote', file);
}

// 2) PNG icons
const icon = (pad) => `<div style="width:100%;height:100%;display:grid;place-items:center;background:#FF8A1F;
  background-image:radial-gradient(#FFC285 2px,transparent 2px);background-size:16px 16px">
  <div style="width:${100 - pad * 2}%;height:${100 - pad * 2}%;border-radius:50%;background:#FFF4E0;border:6px solid #3B2314;display:grid;place-items:center">
  <div style="width:84%;margin-top:-4%">${mascotSVG({ headOnly: true })}</div></div></div>`;
await shot(`<div style="width:32px;height:32px">${mascotSVG({ headOnly: true })}</div>`, 32, 32, 'favicon-32.png');
await shot(icon(8), 180, 180, 'apple-touch-icon.png');
await shot(icon(8), 512, 512, 'icon-512.png');

// 3) Open Graph image for WhatsApp / social previews (1200x630)
await shot(
  `<div style="width:1200px;height:630px;background:#FF8A1F;position:relative;
    background-image:radial-gradient(rgba(255,255,255,.22) 4px,transparent 4px);background-size:44px 44px">
    <div style="position:absolute;left:60px;top:60px;width:470px;height:510px;background:#FFF4E0;border:8px solid #3B2314;
      border-radius:48px;box-shadow:14px 14px 0 #3B2314;display:grid;place-items:center">
      <div style="width:400px">${mascotSVG({ mood: 'samseng' })}</div>
    </div>
    <div style="position:absolute;left:590px;top:70px;right:50px">
      <div style="display:inline-block;background:#3B2314;color:#FFD23F;font-weight:800;font-size:30px;padding:4px 24px;border-radius:999px;transform:rotate(-2deg)">⚠️ KAWASAN OYEN</div>
      <div style="font-weight:800;font-size:150px;line-height:1;margin-top:16px;text-shadow:6px 6px 0 #FFC285">Oyen</div>
      <div style="font-weight:800;font-size:44px;line-height:1.15;margin-top:6px">Jangan kacau.<br/>Bawak ikan goreng.</div>
      <div style="display:flex;gap:12px;margin-top:34px;flex-wrap:wrap">
        ${['❓ Kuiz', '🐟 Game', '🛍️ Kedai Oyen']
          .map(
            (t) =>
              `<span style="background:#FFF4E0;border:5px solid #3B2314;border-radius:18px;box-shadow:5px 5px 0 #3B2314;padding:4px 18px;font-weight:800;font-size:32px">${t}</span>`,
          )
          .join('')}
      </div>
    </div>
  </div>`,
  1200,
  630,
  'og-image.png',
);

await browser.close();
