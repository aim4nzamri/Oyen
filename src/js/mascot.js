// Original "Oyen" mascot, drawn as an inline SVG string.
// One base cat + swappable faces/accessories per mood.
// No ids/clipPaths are used, so many copies can live on one page safely.

const C = {
  line: '#3B2314',
  fur: '#FF8A1F',
  stripe: '#D9620B',
  cream: '#FFF1D6',
  ear: '#FFB59A',
  eye: '#C9E04A',
  nose: '#F27A8A',
};

// Shared outline attributes. Call as ${S()} or ${S(3)} or ${S(5, color)}.
const S = (w = 4, color = C.line) =>
  `stroke="${color}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;

function body() {
  return `
  <path d="M150 196 C188 190 196 150 178 128" fill="none" stroke="${C.line}" stroke-width="20" stroke-linecap="round"/>
  <path d="M150 196 C188 190 196 150 178 128" fill="none" stroke="${C.fur}" stroke-width="12" stroke-linecap="round"/>
  <path d="M184 150 l-9 -3 M188 166 l-10 -1" ${S(3)}/>
  <ellipse cx="100" cy="182" rx="60" ry="40" fill="${C.fur}" ${S()}/>
  <ellipse cx="100" cy="188" rx="30" ry="26" fill="${C.cream}"/>
  <path d="M46 170 l14 4 M44 184 l14 1 M154 170 l-14 4 M156 184 l-14 1" ${S(4, C.stripe)}/>
  <ellipse cx="76" cy="214" rx="16" ry="9" fill="${C.cream}" ${S()}/>
  <ellipse cx="124" cy="214" rx="16" ry="9" fill="${C.cream}" ${S()}/>
  <path d="M70 210 v6 M78 210 v7 M118 210 v7 M126 210 v6" ${S(2.5)}/>`;
}

function head() {
  return `
  <path d="M44 72 L50 18 L90 50 Z" fill="${C.fur}" ${S()}/>
  <path d="M55 62 L58 34 L78 52 Z" fill="${C.ear}"/>
  <!-- right ear with a fight notch -->
  <path d="M110 50 L148 16 L144 34 L152 38 L156 72 Z" fill="${C.fur}" ${S()}/>
  <path d="M122 52 L142 34 L146 60 Z" fill="${C.ear}"/>
  <ellipse cx="100" cy="98" rx="64" ry="54" fill="${C.fur}" ${S()}/>
  <path d="M100 46 v16 M86 48 l3 14 M114 48 l-3 14" ${S(5, C.stripe)}/>
  <path d="M38 96 l14 2 M40 110 l12 -2 M162 96 l-14 2 M160 110 l-12 -2" ${S(4, C.stripe)}/>
  <ellipse cx="89" cy="122" rx="16" ry="12" fill="${C.cream}"/>
  <ellipse cx="111" cy="122" rx="16" ry="12" fill="${C.cream}"/>
  <path d="M94 110 h12 l-6 7 Z" fill="${C.nose}" ${S(3)}/>
  <path d="M60 120 L24 114 M60 127 L26 130 M140 120 L176 114 M140 127 L174 130" ${S(2.5)}/>`;
}

// ---------- faces ----------
const eyesSmug = `
  <ellipse cx="75" cy="96" rx="13" ry="11" fill="${C.eye}" ${S(3)}/>
  <ellipse cx="125" cy="96" rx="13" ry="11" fill="${C.eye}" ${S(3)}/>
  <ellipse cx="78" cy="100" rx="3" ry="6" fill="${C.line}"/>
  <ellipse cx="128" cy="100" rx="3" ry="6" fill="${C.line}"/>
  <path d="M59 80 H92 V95 L59 91 Z" fill="${C.fur}"/>
  <path d="M108 80 H141 V91 L108 95 Z" fill="${C.fur}"/>
  <path d="M61 91 L90 95 M110 95 L139 91" ${S(3.5)}/>
  <path d="M60 80 L88 86" ${S()}/>
  <path d="M110 76 Q126 64 142 74" ${S()}/>`;

const mouthSmirk = `
  <path d="M100 117 Q94 126 85 122 M100 117 Q110 125 121 116" fill="none" ${S(3)}/>
  <path d="M112 121 l3 7 l3 -8" fill="#fff" ${S(2)}/>`;

const eyesHappy = `
  <path d="M63 98 Q75 84 87 98 M113 98 Q125 84 137 98" fill="none" ${S()}/>
  <ellipse cx="62" cy="112" rx="9" ry="5" fill="#FF6F7D" opacity=".55"/>
  <ellipse cx="138" cy="112" rx="9" ry="5" fill="#FF6F7D" opacity=".55"/>`;

const mouthCute = `<path d="M100 117 Q94 125 88 120 M100 117 Q106 125 112 120" fill="none" ${S(3)}/>`;

const eyesSleep = `
  <path d="M63 96 Q75 104 87 96 M113 96 Q125 104 137 96" fill="none" ${S()}/>`;

const mouthSleep = `
  <path d="M100 117 Q100 124 94 124 M100 117 Q100 124 106 124" fill="none" ${S(3)}/>
  <ellipse cx="114" cy="128" rx="4" ry="5" fill="#9BD6FF" ${S(2)}/>`;

const eyesShifty = `
  <ellipse cx="75" cy="96" rx="13" ry="11" fill="${C.eye}" ${S(3)}/>
  <ellipse cx="125" cy="96" rx="13" ry="11" fill="${C.eye}" ${S(3)}/>
  <ellipse cx="68" cy="98" rx="3.5" ry="7" fill="${C.line}"/>
  <ellipse cx="118" cy="98" rx="3.5" ry="7" fill="${C.line}"/>
  <path d="M59 80 H92 V91 L59 89 Z M108 80 H141 V89 L108 91 Z" fill="${C.fur}"/>
  <path d="M61 89 L90 91 M110 91 L139 89" ${S(3.5)}/>`;

const eyesDrama = `
  <ellipse cx="75" cy="96" rx="15" ry="15" fill="${C.eye}" ${S(3)}/>
  <ellipse cx="125" cy="96" rx="15" ry="15" fill="${C.eye}" ${S(3)}/>
  <circle cx="75" cy="98" r="9" fill="${C.line}"/>
  <circle cx="125" cy="98" r="9" fill="${C.line}"/>
  <circle cx="79" cy="93" r="4" fill="#fff"/><circle cx="72" cy="102" r="2" fill="#fff"/>
  <circle cx="129" cy="93" r="4" fill="#fff"/><circle cx="122" cy="102" r="2" fill="#fff"/>
  <path d="M60 80 Q72 72 86 80 M114 80 Q128 72 140 80" fill="none" ${S()}/>
  <path d="M64 110 q-4 10 0 14 q4 -4 0 -14 Z M136 110 q-4 10 0 14 q4 -4 0 -14 Z" fill="#7CC8FF" ${S(2)}/>`;

const mouthWail = `<path d="M90 120 Q100 136 110 120 Z" fill="#B5303F" ${S(3)}/>`;

const eyesDerp = `
  <ellipse cx="74" cy="96" rx="15" ry="14" fill="${C.eye}" ${S(3)}/>
  <ellipse cx="126" cy="98" rx="10" ry="9" fill="${C.eye}" ${S(3)}/>
  <circle cx="68" cy="92" r="5" fill="${C.line}"/>
  <circle cx="130" cy="101" r="3.5" fill="${C.line}"/>`;

const mouthBlep = `
  <path d="M100 117 Q94 124 88 120 M100 117 Q106 124 112 120" fill="none" ${S(3)}/>
  <path d="M96 121 v6 a4 4 0 0 0 8 0 v-6" fill="#FF7E92" ${S(2.5)}/>`;

// ---------- accessories ----------
const bandaid = `
  <g transform="rotate(-25 124 62)">
    <rect x="110" y="56" width="28" height="11" rx="5" fill="#F6D7A7" ${S(2.5)}/>
    <rect x="119" y="56" width="10" height="11" fill="#EBC28A"/>
    <circle cx="122" cy="60" r="1" fill="${C.line}"/><circle cx="126" cy="63" r="1" fill="${C.line}"/>
  </g>`;

const shades = `
  <path d="M56 86 H94 V98 Q92 110 76 110 Q58 110 56 98 Z" fill="#1E1410" ${S(3)}/>
  <path d="M106 86 H144 V98 Q142 110 126 110 Q108 110 106 98 Z" fill="#1E1410" ${S(3)}/>
  <path d="M94 90 H106 M56 88 L40 84 M144 88 L160 84" ${S(3)}/>
  <path d="M63 92 l8 -3 M113 92 l8 -3" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;

const toothpick = `<path d="M114 122 L146 132" stroke="#E4C38E" stroke-width="4" stroke-linecap="round"/>`;

const fish = `
  <g transform="rotate(-8 100 128)">
    <path d="M70 128 Q86 114 112 122 Q122 126 128 128 Q122 132 112 134 Q86 142 70 128 Z" fill="#C9772A" ${S(3)}/>
    <path d="M126 128 L144 116 L140 128 L144 140 Z" fill="#B8641E" ${S(3)}/>
    <path d="M86 122 l4 12 M96 121 l4 13 M106 122 l3 11" stroke="#8A4510" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="78" cy="126" r="2.5" fill="${C.line}"/>
  </g>`;

const zzz = `
  <g font-family="Arial Black, Arial, sans-serif" font-weight="900" fill="${C.line}">
    <text x="150" y="44" font-size="22">Z</text>
    <text x="168" y="26" font-size="16">z</text>
    <text x="182" y="14" font-size="12">z</text>
  </g>`;

const hearts = `
  <path d="M166 40 c-6 -8 -18 -2 -12 8 l12 10 l12 -10 c6 -10 -6 -16 -12 -8 Z" fill="#FF5C7A" ${S(2.5)}/>
  <path d="M30 34 c-4 -5 -12 -1 -8 5 l8 7 l8 -7 c4 -6 -4 -10 -8 -5 Z" fill="#FF5C7A" ${S(2)}/>`;

const crown = `
  <path d="M76 50 L72 26 L88 38 L100 20 L112 38 L128 26 L124 50 Z" fill="#FFD23F" ${S(3)}/>
  <circle cx="100" cy="38" r="4" fill="#FF5C7A"/>`;

const brainCell = `
  <circle cx="100" cy="22" r="9" fill="#FFB3C7" ${S(2.5)}/>
  <path d="M96 20 q4 -4 8 0 M96 25 q4 3 8 0" fill="none" ${S(1.8)}/>
  <path d="M84 12 l-6 -4 M116 12 l6 -4 M100 6 v-4" ${S(3, "#FFC400")}/>`;

const MOODS = {
  smug: { face: eyesSmug + mouthSmirk, extra: bandaid },
  samseng: { face: mouthSmirk + shades, extra: bandaid + toothpick },
  manja: { face: eyesHappy + mouthCute, extra: hearts },
  pencuri: { face: eyesShifty + fish, extra: '' },
  tidur: { face: eyesSleep + mouthSleep, extra: zzz },
  drama: { face: eyesDrama + mouthWail, extra: crown },
  otak: { face: eyesDerp + mouthBlep, extra: brainCell },
};

// Fur colour variants (all still oren, just different shades).
export const PALETTES = {
  oren: { fur: C.fur, stripe: C.stripe },
  cair: { fur: '#FFB25C', stripe: '#E8893A' }, // pale "oren cair"
  pekat: { fur: '#F06A12', stripe: '#B8460A' }, // deep ginger
  krim: { fur: '#FFD08A', stripe: '#F0A955' }, // cream-orange
  karat: { fur: '#D9622B', stripe: '#9E3F14' }, // rusty
};

/**
 * @param {object} [opts]
 * @param {keyof typeof MOODS} [opts.mood]
 * @param {keyof typeof PALETTES} [opts.palette]
 * @param {string} [opts.label] accessible label
 * @param {string} [opts.className]
 * @param {boolean} [opts.headOnly] crop to just the head (for logos)
 */
export function mascotSVG({
  mood = 'smug',
  palette = 'oren',
  label = 'Oyen, kucing oren samseng',
  className = '',
  headOnly = false,
} = {}) {
  const m = MOODS[mood] || MOODS.smug;
  const viewBox = headOnly ? '18 0 164 160' : '0 0 200 228';
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" class="${className}" role="img" aria-label="${label}">
  ${headOnly ? '' : body()}${head()}${m.face}${m.extra}
</svg>`;
  const p = PALETTES[palette];
  if (p && palette !== 'oren') {
    svg = svg.replaceAll(C.fur, p.fur).replaceAll(C.stripe, p.stripe);
  }
  return svg;
}

export const MOOD_NAMES = Object.keys(MOODS);
