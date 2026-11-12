// Generates favicon / app icons / Open Graph image from the official
// character art in public/characters/.
// Usage: node scripts/generate-assets.mjs
// Needs Playwright with Chromium (npm i -D playwright && npx playwright install chromium).
// Output goes to public/ and is committed, so this only needs re-running when the art changes.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const pub = (f) => resolve(import.meta.dirname, '../public', f);
const dataUrl = (f) => `data:image/webp;base64,${readFileSync(pub(f)).toString('base64')}`;
const OYEN = dataUrl('characters/oyen.webp');
const ABU = dataUrl('characters/abu.webp');
const OYEN_HEAD = dataUrl('characters/oyen-head.webp');
const LOGO = dataUrl('brand/logo.webp');
const FONT = `<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&display=swap" rel="stylesheet">`;

const browser = await chromium.launch();
const page = await browser.newPage();

async function shot(html, w, h, file, transparent = false) {
  await page.setViewportSize({ width: w, height: h });
  await page.setContent(`<!doctype html><html><head>${FONT}<style>
    *{margin:0;box-sizing:border-box} body{width:${w}px;height:${h}px;overflow:hidden;font-family:'Baloo 2',sans-serif;color:#3B2314;background:transparent}
  </style></head><body>${html}</body></html>`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(100);
  await page.screenshot({ path: pub(file), omitBackground: transparent });
  console.log('wrote', file);
}

// Round icon: Oyen's head in a cream circle on orange
const icon = (size, ring) => `<div style="width:${size}px;height:${size}px;display:grid;place-items:center;background:#FF8A1F">
  <div style="width:${size - ring * 2}px;height:${size - ring * 2}px;border-radius:50%;overflow:hidden;background:#FFF4E0;
    border:${Math.max(2, size / 30)}px solid #3B2314;display:grid;place-items:end center">
    <img src="${OYEN_HEAD}" style="width:96%;margin-bottom:-6%">
  </div></div>`;

await shot(
  `<div style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:#FF8A1F;display:grid;place-items:end center">
     <img src="${OYEN_HEAD}" style="width:100%;margin-bottom:-4%"></div>`,
  64, 64, 'favicon-64.png', true,
);
await shot(icon(180, 10), 180, 180, 'apple-touch-icon.png');
await shot(icon(512, 26), 512, 512, 'icon-512.png');

// Open Graph image for WhatsApp / social previews (1200x630)
await shot(
  `<div style="width:1200px;height:630px;background:#FF8A1F;position:relative;overflow:hidden;
    background-image:radial-gradient(rgba(255,255,255,.22) 4px,transparent 4px);background-size:44px 44px">
    <div style="position:absolute;left:40px;top:40px;width:600px;height:550px;background:#FFF4E0;border:8px solid #3B2314;
      border-radius:48px"></div>
    <img src="${OYEN}" style="position:absolute;left:70px;bottom:52px;width:330px">
    <img src="${ABU}" style="position:absolute;left:372px;bottom:52px;width:250px">
    <div style="position:absolute;left:690px;top:70px;right:40px">
      <div style="display:inline-block;background:#3B2314;color:#FFD23F;font-weight:800;font-size:30px;padding:4px 24px;border-radius:999px;transform:rotate(-2deg)">⚠️ KAWASAN KAMI</div>
      <img src="${LOGO}" style="display:block;width:430px;margin:14px 0 0 -8px">
      <div style="font-weight:800;font-size:34px;line-height:1.2;margin-top:10px">Satu samseng dalam rumah.<br/>Satu comel luar rumah.</div>
      <div style="display:flex;gap:10px;margin-top:26px;flex-wrap:wrap">
        ${['❓ Kuiz', '🐟 Game', '🛍️ Kedai']
          .map(
            (t) =>
              `<span style="background:#FFF4E0;border:5px solid #3B2314;border-radius:18px;padding:2px 16px;font-weight:800;font-size:28px">${t}</span>`,
          )
          .join('')}
      </div>
    </div>
  </div>`,
  1200, 630, 'og-image.png',
);

await browser.close();
