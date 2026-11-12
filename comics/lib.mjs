// Building blocks for "Kawasan Oyen" 4-panel comics, all original SVG art.
// Everything is drawn in a panel coordinate system of 1000 x 760.
import { mascotSVG } from '../src/js/mascot.js';
import { fishSVG } from '../src/js/sprites.js';

export const PW = 1000; // panel width
export const PH = 760; // panel height
export const LINE = '#3B2314';
const S = (w = 5, c = LINE) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

/** Place any standalone <svg> string at x,y with a given size. */
export function place(svg, x, y, w, h, extra = '') {
  return svg.replace('<svg ', `<svg x="${x}" y="${y}" width="${w}" height="${h}" ${extra} preserveAspectRatio="xMidYMid meet" `);
}

/** Oyen, full body (w is width; height follows the 200x228 artwork). */
export function oyen(mood, x, y, w = 220) {
  return place(mascotSVG({ mood, label: '' }), x, y, w, (w * 228) / 200);
}

/** Oyen head only (164x160 artwork). */
export function oyenHead(mood, x, y, w = 400) {
  return place(mascotSVG({ mood, headOnly: true, label: '' }), x, y, w, (w * 160) / 164);
}

export function fish(x, y, w = 160, gold = false) {
  return place(fishSVG(gold), x, y, w, (w * 60) / 110);
}

// ---------------------------------------------------------------------------
// Mak: original character. Tudung, baju kurung, always in charge of the kitchen.
// Artwork box: 260 x 440.
// ---------------------------------------------------------------------------
const SKIN = '#E9B48C';
const TUD = '#2FA58F';
const TUD_D = '#22826F';
const BAJU = '#F4C542';
const BAJU_D = '#D9A520';

function makFace(face) {
  const blush = `<ellipse cx="96" cy="170" rx="11" ry="6" fill="#FF8A8A" opacity=".55"/><ellipse cx="164" cy="170" rx="11" ry="6" fill="#FF8A8A" opacity=".55"/>`;
  const nose = `<path d="M130 152 q-4 10 2 12" fill="none" ${S(3)}/>`;
  switch (face) {
    case 'hum':
      return `${blush}${nose}
        <path d="M98 142 Q110 132 122 142 M138 142 Q150 132 162 142" fill="none" ${S(4.5)}/>
        <ellipse cx="130" cy="186" rx="7" ry="8" fill="#8B3A3A" ${S(3)}/>`;
    case 'shock':
      return `${nose}
        <circle cx="110" cy="142" r="15" fill="#fff" ${S(4)}/><circle cx="150" cy="142" r="15" fill="#fff" ${S(4)}/>
        <circle cx="110" cy="143" r="3.5" fill="${LINE}"/><circle cx="150" cy="143" r="3.5" fill="${LINE}"/>
        <path d="M94 118 Q110 108 124 116 M136 116 Q150 108 166 118" fill="none" ${S(4)}/>
        <ellipse cx="130" cy="192" rx="15" ry="19" fill="#8B3A3A" ${S(4)}/>
        <path d="M108 96 v14 M122 92 v16 M138 92 v16 M152 96 v14" stroke="#6C7BD9" stroke-width="4" stroke-linecap="round"/>`;
    case 'angry':
      return `${nose}
        <path d="M94 126 L124 136 M166 126 L136 136" ${S(5)}/>
        <path d="M100 146 Q110 140 120 146 Q110 150 100 146 Z M140 146 Q150 140 160 146 Q150 150 140 146 Z" fill="${LINE}"/>
        <rect x="110" y="182" width="40" height="16" rx="4" fill="#fff" ${S(3.5)}/>
        <path d="M120 182 v16 M130 182 v16 M140 182 v16" ${S(2)}/>
        <path d="M174 92 q8 8 0 16 M194 92 q-8 8 0 16 M176 90 q8 8 16 0 M176 110 q8 -8 16 0" fill="none" stroke="#E0303F" stroke-width="5" stroke-linecap="round"/>`;
    default:
      return `${blush}${nose}<circle cx="110" cy="144" r="5" fill="${LINE}"/><circle cx="150" cy="144" r="5" fill="${LINE}"/>
        <path d="M116 184 Q130 194 144 184" fill="none" ${S(3.5)}/>`;
  }
}

function arm(points, sleeve = BAJU) {
  return `<path d="${points}" fill="none" stroke="${LINE}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="${points}" fill="none" stroke="${sleeve}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>`;
}
const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="16" fill="${SKIN}" ${S(4)}/>`;

/**
 * @param {{view?:'front'|'back', face?:'hum'|'shock'|'angry'|'normal', pose?:'sudip'|'plate'|'reach'}} o
 */
export function makSVG({ view = 'front', face = 'normal', pose = 'sudip' } = {}) {
  const body = `<path d="M52 238 L208 238 L244 440 L16 440 Z" fill="${BAJU}" ${S()}/>
    ${[
      [70, 300],
      [130, 280],
      [190, 300],
      [100, 370],
      [160, 360],
      [60, 410],
      [200, 410],
    ]
      .map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff" opacity=".7"/><circle cx="${x}" cy="${y}" r="3" fill="${BAJU_D}"/>`)
      .join('')}`;
  const headBack = `<path d="M34 262 Q22 170 58 110 Q130 6 202 110 Q238 170 226 262 Q130 300 34 262 Z" fill="${TUD}" ${S()}/>`;

  let arms = '';
  let front = '';
  if (view === 'back') {
    arms = arm('M206 262 L236 190 L252 120') + hand(252, 112);
    front = `<path d="M70 120 Q130 60 190 120 M60 200 Q130 240 200 200" fill="none" stroke="${TUD_D}" stroke-width="5" stroke-linecap="round"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 440">${body}${arms}${headBack}${front}</svg>`;
  }

  if (pose === 'sudip') {
    arms =
      arm('M58 262 L30 330 L70 372') +
      hand(74, 374) +
      arm('M204 262 L234 320 L222 352') +
      `<path d="M222 352 L262 236" stroke="#8A5A3B" stroke-width="9" stroke-linecap="round"/>
       <rect x="246" y="198" width="34" height="44" rx="6" transform="rotate(18 263 220)" fill="#C9CED6" ${S(4)}/>` +
      hand(222, 354);
  } else if (pose === 'plate') {
    arms =
      arm('M58 262 L40 330 L64 360') +
      arm('M204 262 L222 330 L196 360') +
      `<ellipse cx="130" cy="362" rx="92" ry="22" fill="#fff" ${S(5)}/><ellipse cx="130" cy="358" rx="60" ry="11" fill="none" stroke="#9BD6FF" stroke-width="4"/>` +
      hand(64, 362) +
      hand(196, 362);
  }
  front = `
    <ellipse cx="130" cy="150" rx="60" ry="66" fill="${SKIN}" ${S()}/>
    ${makFace(face)}
    <path d="M66 140 Q70 76 130 70 Q190 76 194 140 Q186 98 130 94 Q74 98 66 140 Z" fill="${TUD_D}"/>
    <path d="M40 236 Q130 300 220 236 L230 276 Q130 330 30 276 Z" fill="${TUD}" ${S()}/>
    <path d="M70 252 Q130 290 190 252" fill="none" stroke="${TUD_D}" stroke-width="4" stroke-linecap="round"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 440">${headBack}${body}${front}${arms}</svg>`;
}

export function mak(o, x, y, w = 250) {
  return place(makSVG(o), x, y, w, (w * 440) / 280);
}

// ---------------------------------------------------------------------------
// Backgrounds & props
// ---------------------------------------------------------------------------
export function kitchenWall() {
  let tiles = '';
  for (let x = 0; x <= PW; x += 62) tiles += `<path d="M${x} 0 V560" stroke="#F0DCB8" stroke-width="3"/>`;
  for (let y = 0; y <= 560; y += 62) tiles += `<path d="M0 ${y} H${PW}" stroke="#F0DCB8" stroke-width="3"/>`;
  return `<rect width="${PW}" height="${PH}" fill="#FFF4E0"/>${tiles}
    <g>
      <rect x="400" y="50" width="200" height="170" fill="#9BD6FF" ${S()}/>
      <path d="M500 50 V220 M400 135 H600" ${S()}/>
      <circle cx="560" cy="88" r="18" fill="#FFE066"/>
      <path d="M392 50 h216 M392 226 h216" stroke="#8A5A3B" stroke-width="10" stroke-linecap="round"/>
    </g>`;
}

export function wallCabinet(x = 20, y = 250, w = 300, h = 180) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#B07447" ${S()}/>
    <path d="M${x + w / 2} ${y + 10} V${y + h - 10}" ${S(4)}/>
    <rect x="${x + 14}" y="${y + 14}" width="${w / 2 - 26}" height="${h - 28}" rx="4" fill="none" stroke="#8A5A3B" stroke-width="4"/>
    <rect x="${x + w / 2 + 12}" y="${y + 14}" width="${w / 2 - 26}" height="${h - 28}" rx="4" fill="none" stroke="#8A5A3B" stroke-width="4"/>
    <circle cx="${x + w / 2 - 22}" cy="${y + h / 2}" r="6" fill="#FFD23F" ${S(3)}/><circle cx="${x + w / 2 + 22}" cy="${y + h / 2}" r="6" fill="#FFD23F" ${S(3)}/>`;
}

export function counter(top = 555) {
  return `<rect x="0" y="${top}" width="${PW}" height="${PH - top}" fill="#C98B5A"/>
    ${[0, 1, 2, 3, 4].map((i) => `<rect x="${i * 200 + 14}" y="${top + 40}" width="172" height="${PH - top - 52}" rx="6" fill="#B87A4B" stroke="#8A5A3B" stroke-width="4"/><rect x="${i * 200 + 80}" y="${top + 60}" width="40" height="8" rx="4" fill="#8A5A3B"/>`).join('')}
    <rect x="-10" y="${top - 6}" width="${PW + 20}" height="34" fill="#8A5A3B" ${S()}/>`;
}

export function dishRack(x = 860, y = 270) {
  const plates = [0, 1, 2, 3]
    .map((i) => `<ellipse cx="${x + 26 + i * 26}" cy="${y + 70}" rx="10" ry="56" fill="#fff" ${S(4)}/>`)
    .join('');
  return `${plates}<rect x="${x}" y="${y + 100}" width="130" height="40" rx="6" fill="#9AA7B8" ${S()}/>
    <path d="M${x + 10} ${y + 100} v40 M${x + 40} ${y + 100} v40 M${x + 70} ${y + 100} v40 M${x + 100} ${y + 100} v40" stroke="#6E7C8E" stroke-width="4"/>`;
}

/** Gas stove on the counter with a kuali. `withFish` puts ikan goreng inside. */
export function kuali(cx = 690, withFish = true, steam = true) {
  const rim = 452; // kuali rim y
  const flames = [-40, -12, 16, 44]
    .map((d) => `<path d="M${cx + d} 494 q8 -16 0 -26 q14 10 12 26 Z" fill="#4AA8FF" stroke="#2B6CB0" stroke-width="2"/>`)
    .join('');
  const steamLines = steam
    ? `<path d="M${cx - 50} ${rim - 70} q-14 -24 0 -42 q14 -18 0 -40 M${cx + 6} ${rim - 82} q-14 -24 0 -42 q14 -18 0 -40 M${cx + 60} ${rim - 70} q-14 -24 0 -42 q14 -18 0 -40"
        fill="none" stroke="#C8B9A8" stroke-width="6" stroke-linecap="round" opacity=".85"/>`
    : '';
  return `${steamLines}
    <rect x="${cx - 130}" y="494" width="260" height="62" rx="10" fill="#4A4F57" ${S()}/>
    <circle cx="${cx - 90}" cy="526" r="11" fill="#C9CED6" ${S(3)}/><circle cx="${cx + 90}" cy="526" r="11" fill="#C9CED6" ${S(3)}/>
    ${flames}
    ${withFish ? `<g transform="rotate(-8 ${cx} ${rim - 20})">${fish(cx - 92, rim - 78, 184)}</g>` : ''}
    <path d="M${cx - 135} ${rim} Q${cx} ${rim + 70} ${cx + 135} ${rim} Z" fill="#2E2A28" ${S()}/>
    <path d="M${cx - 145} ${rim} H${cx + 145}" ${S(8)}/>
    <path d="M${cx + 141} ${rim + 4} q30 0 44 -14" fill="none" stroke="${LINE}" stroke-width="12" stroke-linecap="round"/>
    <path d="M${cx - 141} ${rim + 4} q-26 4 -36 -8" fill="none" stroke="${LINE}" stroke-width="12" stroke-linecap="round"/>`;
}

/** Plate lined with tissue on the counter. steam: 0 (cool) to 3 (just fried). */
export function platter(cx = 400, withFish = true, steam = 3) {
  const top = 520;
  const steamLines = [-40, 0, 40]
    .slice(0, steam)
    .map((d) => `<path d="M${cx + d} ${top - 40} q-12 -20 0 -36 q12 -16 0 -34" fill="none" stroke="#C8B9A8" stroke-width="6" stroke-linecap="round" opacity=".85"/>`)
    .join('');
  const oil = `<ellipse cx="${cx - 30}" cy="${top + 16}" rx="16" ry="5" fill="#F2C14E" opacity=".75"/>
    <ellipse cx="${cx + 34}" cy="${top + 20}" rx="12" ry="4" fill="#F2C14E" opacity=".75"/>
    <ellipse cx="${cx + 4}" cy="${top + 24}" rx="9" ry="3" fill="#F2C14E" opacity=".75"/>`;
  return `${withFish ? steamLines : ''}
    <ellipse cx="${cx}" cy="${top + 22}" rx="120" ry="24" fill="#fff" ${S()}/>
    <path d="M${cx - 92} ${top + 20} l14 -16 l16 10 l18 -14 l18 12 l18 -12 l18 12 l18 -12 l16 10 l14 -6 l8 18 q-90 26 -186 0 Z" fill="#FAFAF7" stroke="#D8D2C8" stroke-width="3" stroke-linejoin="round"/>
    ${withFish ? fish(cx - 85, top - 50, 170) : oil}`;
}

export function burst(cx, cy, colorA = '#FFE3B3', colorB = '#FFF4E0') {
  let rays = '';
  const n = 28;
  for (let i = 0; i < n; i++) {
    const a1 = (i / n) * Math.PI * 2;
    const a2 = ((i + 0.5) / n) * Math.PI * 2;
    const R = 1400;
    rays += `<path d="M${cx} ${cy} L${cx + Math.cos(a1) * R} ${cy + Math.sin(a1) * R} L${cx + Math.cos(a2) * R} ${cy + Math.sin(a2) * R} Z" fill="${colorA}"/>`;
  }
  return `<rect width="${PW}" height="${PH}" fill="${colorB}"/>${rays}`;
}

export function sparkle(x, y, r = 30, color = '#FFD23F') {
  return `<path d="M${x} ${y - r} Q${x + r * 0.12} ${y - r * 0.12} ${x + r} ${y} Q${x + r * 0.12} ${y + r * 0.12} ${x} ${y + r} Q${x - r * 0.12} ${y + r * 0.12} ${x - r} ${y} Q${x - r * 0.12} ${y - r * 0.12} ${x} ${y - r} Z"
    fill="${color}" ${S(3.5)}/>`;
}

// ---------------------------------------------------------------------------
// Text: speech bubbles and sound effects
// ---------------------------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Renders lines; wrap words in *stars* to make them bold red-brown emphasis. */
function richLine(line) {
  return line
    .split(/(\*[^*]+\*)/)
    .map((part) => (part.startsWith('*') ? `<tspan font-weight="800" fill="#B5303F">${esc(part.slice(1, -1))}</tspan>` : esc(part)))
    .join('');
}

/**
 * Speech bubble.
 * @param {object} o
 * @param {number} o.x center x  @param {number} o.y center y
 * @param {string[]} o.lines  @param {[number, number]} [o.tail] point the tail aims at
 * @param {'speech'|'think'|'shout'} [o.kind]
 */
export function bubble({ x, y, lines, tail, kind = 'speech', size = 36, italic = false }) {
  const lh = size * 1.18;
  const longest = Math.max(...lines.map((l) => l.replace(/\*/g, '').length));
  const w = Math.max(110, longest * size * 0.52 + 56);
  const h = lines.length * lh + 40;
  let shape;
  if (kind === 'shout') {
    const pts = [];
    const n = 22;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const r = i % 2 ? 1 : 1.22;
      pts.push(`${x + Math.cos(a) * (w / 2) * r},${y + Math.sin(a) * (h / 2) * r}`);
    }
    shape = `<polygon points="${pts.join(' ')}" fill="#fff" ${S(5)}/>`;
  } else {
    shape = `<ellipse cx="${x}" cy="${y}" rx="${w / 2 + 10}" ry="${h / 2 + 6}" fill="#fff" ${S(5)}/>`;
  }
  let tailSvg = '';
  if (tail && kind !== 'think') {
    const [tx, ty] = tail;
    const ang = Math.atan2(ty - y, tx - x);
    const bx = x + Math.cos(ang) * (w / 2) * 0.82;
    const by = y + Math.sin(ang) * (h / 2) * 0.82;
    const px = -Math.sin(ang) * 18;
    const py = Math.cos(ang) * 18;
    tailSvg = `<path d="M${bx + px} ${by + py} L${tx} ${ty} L${bx - px} ${by - py}" fill="#fff" ${S(5)}/>
      <path d="M${bx + px * 1.1} ${by + py * 1.1} L${bx - px * 1.1} ${by - py * 1.1}" stroke="#fff" stroke-width="9"/>`;
  } else if (tail && kind === 'think') {
    const [tx, ty] = tail;
    const ang = Math.atan2(ty - y, tx - x);
    const sx = x + Math.cos(ang) * (w / 2 + 16);
    const sy = y + Math.sin(ang) * (h / 2 + 10);
    tailSvg = [0.2, 0.5, 0.8]
      .map((t, i) => `<circle cx="${sx + (tx - sx) * t}" cy="${sy + (ty - sy) * t}" r="${15 - i * 4}" fill="#fff" ${S(4)}/>`)
      .join('');
    shape = `<rect x="${x - w / 2 - 6}" y="${y - h / 2}" width="${w + 12}" height="${h}" rx="${h / 2}" fill="#fff" ${S(5)}/>`;
  }
  const text = lines
    .map(
      (l, i) =>
        `<text x="${x}" y="${y - ((lines.length - 1) * lh) / 2 + i * lh + size * 0.36}" text-anchor="middle"
          font-family="'Baloo 2', sans-serif" font-weight="700" font-size="${size}" fill="${LINE}"${italic ? ' font-style="italic"' : ''}>${richLine(l)}</text>`,
    )
    .join('');
  // tail first so the bubble body covers its base
  return kind === 'think' ? `${shape}${tailSvg}${text}` : `${tailSvg}${shape}${text}`;
}

/** Comic sound effect text, e.g. sfx('JENG!', 300, 120, { rotate: -10 }) */
export function sfx(text, x, y, { size = 70, rotate = -8, fill = '#E0303F', stroke = '#fff' } = {}) {
  return `<g transform="rotate(${rotate} ${x} ${y})">
    <text x="${x}" y="${y}" text-anchor="middle" font-family="'Bangers', 'Arial Black', sans-serif" font-size="${size}"
      letter-spacing="2" fill="${fill}" stroke="${LINE}" stroke-width="${size / 9}" paint-order="stroke" stroke-linejoin="round">${esc(text)}</text>
    <text x="${x}" y="${y}" text-anchor="middle" font-family="'Bangers', 'Arial Black', sans-serif" font-size="${size}"
      letter-spacing="2" fill="${fill}" stroke="${stroke}" stroke-width="${size / 30}" paint-order="stroke">${esc(text)}</text>
  </g>`;
}

// ---------------------------------------------------------------------------
// Page layout: title + 4 stacked panels + footer (like a 4-koma strip)
// ---------------------------------------------------------------------------
export const PAGE_W = 1080;
const TOP = 210;
const GAP = 34;
const FOOT = 130;
export const PAGE_H = TOP + PH * 4 + GAP * 3 + FOOT;

export function page({ number, title, panels, site = 'aim4nzamri.github.io/Oyen' }) {
  const x = (PAGE_W - PW) / 2;
  const body = panels
    .map((content, i) => {
      const y = TOP + i * (PH + GAP);
      return `<g transform="translate(${x} ${y})">
        <svg width="${PW}" height="${PH}" viewBox="0 0 ${PW} ${PH}" overflow="hidden">${content}</svg>
        <rect x="0" y="0" width="${PW}" height="${PH}" fill="none" stroke="${LINE}" stroke-width="8"/>
      </g>`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PAGE_W}" height="${PAGE_H}" viewBox="0 0 ${PAGE_W} ${PAGE_H}">
    <rect width="${PAGE_W}" height="${PAGE_H}" fill="#FFFDF8"/>
    <rect x="${PAGE_W / 2 - 170}" y="30" width="340" height="52" rx="26" fill="${LINE}"/>
    <text x="${PAGE_W / 2}" y="68" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="30" fill="#FFD23F">KAWASAN OYEN #${number}</text>
    <text x="${PAGE_W / 2}" y="168" text-anchor="middle" font-family="'Bangers', sans-serif" font-size="92" letter-spacing="3"
      fill="#FF8A1F" stroke="${LINE}" stroke-width="10" paint-order="stroke" stroke-linejoin="round">${esc(title)}</text>
    ${body}
    <text x="${PAGE_W / 2}" y="${PAGE_H - 56}" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="800" font-size="34" fill="${LINE}">🧡 ${esc(site)}</text>
    <text x="${PAGE_W / 2}" y="${PAGE_H - 18}" text-anchor="middle" font-family="'Baloo 2', sans-serif" font-weight="600" font-size="26" fill="#6B4A35">Komik baru setiap Isnin &amp; Khamis</text>
  </svg>`;
}
