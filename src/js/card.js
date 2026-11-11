// Draws a shareable result card onto a canvas (no external libraries).
import { mascotSVG } from './mascot.js';

const W = 1080;
const H = 1350;
const FONT = "'Baloo 2', 'Trebuchet MS', sans-serif";
const BROWN = '#3B2314';

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function boxed(ctx, x, y, w, h, r, fill, shadow = 12) {
  ctx.fillStyle = BROWN;
  roundRect(ctx, x + shadow, y + shadow, w, h, r);
  ctx.fill();
  ctx.fillStyle = fill;
  roundRect(ctx, x, y, w, h, r);
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = BROWN;
  ctx.stroke();
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function loadSvg(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

/**
 * @param {{title:string, quote:string, desc:string, mood:string, power:string, stats:Record<string,number>}} result
 * @param {string} siteLabel short URL/label printed at the bottom
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function drawResultCard(result, siteLabel) {
  try {
    await Promise.all([document.fonts.load(`800 60px ${FONT}`), document.fonts.load(`600 40px ${FONT}`)]);
  } catch {
    /* fall back to system font */
  }

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background with polka dots
  ctx.fillStyle = '#FF8A1F';
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(255,255,255,0.18)';
  for (let y = 20; y < H; y += 54) {
    for (let x = (y / 54) % 2 ? 47 : 20; x < W; x += 54) {
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Header
  ctx.fillStyle = BROWN;
  ctx.textAlign = 'center';
  ctx.font = `800 46px ${FONT}`;
  ctx.fillText('OYEN AKU JENIS...', W / 2, 92);

  // Inner card
  const cx = 70;
  const cy = 130;
  const cw = W - 140 - 12;
  const ch = H - 250;
  boxed(ctx, cx, cy, cw, ch, 44, '#FFF4E0');

  // Mascot
  const img = await loadSvg(mascotSVG({ mood: result.mood }));
  const mw = 340;
  const mh = (mw * 228) / 200;
  ctx.drawImage(img, W / 2 - mw / 2 - 6, cy + 24, mw, mh);

  let y = cy + 24 + mh + 70;

  // Title
  ctx.fillStyle = BROWN;
  ctx.font = `800 82px ${FONT}`;
  ctx.fillText(result.title, W / 2 - 6, y);
  y += 56;

  ctx.font = `italic 700 36px ${FONT}`;
  ctx.fillStyle = '#6B4A35';
  for (const line of wrapLines(ctx, result.quote, cw - 100)) {
    ctx.fillText(line, W / 2 - 6, y);
    y += 44;
  }
  y += 14;

  // Power level pill
  ctx.font = `800 40px ${FONT}`;
  const pill = `⚡ POWER LEVEL: ${result.power}`;
  const pw = ctx.measureText(pill).width + 60;
  ctx.fillStyle = BROWN;
  roundRect(ctx, W / 2 - 6 - pw / 2, y - 44, pw, 64, 32);
  ctx.fill();
  ctx.fillStyle = '#FFD23F';
  ctx.fillText(pill, W / 2 - 6, y);
  y += 70;

  // Stats bars
  const labelX = cx + 60;
  const barX = cx + 330;
  const barW = cw - 330 - 160;
  ctx.textAlign = 'left';
  for (const [name, val] of Object.entries(result.stats)) {
    ctx.fillStyle = BROWN;
    ctx.font = `700 34px ${FONT}`;
    ctx.fillText(name, labelX, y);
    ctx.fillStyle = '#FFFDF8';
    roundRect(ctx, barX, y - 28, barW, 32, 16);
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = BROWN;
    ctx.stroke();
    ctx.fillStyle = '#E86A00';
    roundRect(ctx, barX + 4, y - 24, Math.max(24, ((barW - 8) * val) / 100), 24, 12);
    ctx.fill();
    ctx.fillStyle = BROWN;
    ctx.textAlign = 'right';
    ctx.fillText(String(val), cx + cw - 50, y);
    ctx.textAlign = 'left';
    y += 54;
  }

  // Description, clamped to the space left inside the card
  ctx.textAlign = 'left';
  ctx.fillStyle = BROWN;
  ctx.font = `600 32px ${FONT}`;
  const lineH = 42;
  const maxLines = Math.floor((cy + ch - 30 - y) / lineH);
  let lines = wrapLines(ctx, result.desc, cw - 120);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S+$/, '') + '...';
  }
  y += 6;
  for (const line of lines) {
    ctx.fillText(line, labelX, y);
    y += lineH;
  }

  // Footer
  ctx.textAlign = 'center';
  ctx.fillStyle = BROWN;
  ctx.font = `800 40px ${FONT}`;
  ctx.fillText('Oyen kau jenis apa? 👉 ' + siteLabel, W / 2, H - 52);

  return canvas;
}
