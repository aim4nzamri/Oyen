// Small SVG sprites for the game, turned into <img> objects for canvas drawing.
import { mascotSVG } from './mascot.js';

const LINE = '#3B2314';

export const fishSVG = (gold = false) => {
  const body = gold ? '#FFD23F' : '#C9772A';
  const tail = gold ? '#F2B705' : '#A85A1A';
  const crisp = gold ? '#C99700' : '#7A3D0E';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 60">
  <path d="M8 30 Q30 4 70 14 Q84 20 92 30 Q84 40 70 46 Q30 56 8 30 Z" fill="${body}" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M88 30 L106 12 L100 30 L106 48 Z" fill="${tail}" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M34 18 l6 24 M48 16 l6 27 M62 17 l5 25" stroke="${crisp}" stroke-width="4" stroke-linecap="round"/>
  <circle cx="20" cy="27" r="4" fill="${LINE}"/><circle cx="21" cy="26" r="1.3" fill="#fff"/>
  ${gold ? '<path d="M40 4 l3 6 l6 1 l-5 4 l1 6 l-5 -3 l-5 3 l1 -6 l-5 -4 l6 -1 Z" fill="#fff" stroke="#3B2314" stroke-width="2"/>' : ''}
</svg>`;
};

// Classic blue-and-white "selipar Jepun", seen from the top.
export const seliparSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 110">
  <path d="M30 4 C50 4 54 24 52 44 C50 62 54 80 50 96 C46 108 14 108 10 96 C6 80 10 62 8 44 C6 24 10 4 30 4 Z" fill="#2F7DE1" stroke="${LINE}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M30 10 C45 10 48 26 46 44 C44 62 48 80 45 93 C42 102 18 102 15 93 C12 80 16 62 14 44 C12 26 15 10 30 10 Z" fill="#F7F3EA"/>
  <path d="M30 26 L12 58 M30 26 L48 58" stroke="#2F7DE1" stroke-width="8" stroke-linecap="round"/>
  <circle cx="30" cy="26" r="5" fill="#2F7DE1" stroke="${LINE}" stroke-width="2"/>
</svg>`;

export function loadImage(svg) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

export async function loadGameSprites() {
  const [oyen, oyenHit, oyenEat, fish, goldFish, selipar] = await Promise.all([
    loadImage(mascotSVG({ mood: 'smug' })),
    loadImage(mascotSVG({ mood: 'drama' })),
    loadImage(mascotSVG({ mood: 'manja' })),
    loadImage(fishSVG(false)),
    loadImage(fishSVG(true)),
    loadImage(seliparSVG),
  ]);
  return { oyen, oyenHit, oyenEat, fish, goldFish, selipar };
}
