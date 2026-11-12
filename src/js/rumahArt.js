// Placeholder item art for "Rumah Oyen & Abu" (ink outline, flat colours).
// Replace any of these with real artwork later (see ITEMS[].image in rumahData.js).
const INK = '#1F1410';
const S = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
const svg = (vb, body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" aria-hidden="true">${body}</svg>`;

export const ART = {
  mangkuk: (full = true) =>
    svg(
      '0 0 200 110',
      `${
        full
          ? `<path d="M40 52 Q60 18 100 22 Q140 18 160 52 Z" fill="#B5703A" ${S(4)}/>
             <circle cx="78" cy="40" r="7" fill="#8A4F22"/><circle cx="104" cy="32" r="7" fill="#8A4F22"/>
             <circle cx="126" cy="42" r="7" fill="#8A4F22"/><circle cx="96" cy="46" r="6" fill="#8A4F22"/>`
          : ''
      }
      <path d="M20 52 H180 Q172 100 100 102 Q28 100 20 52 Z" fill="#FF8A8A" ${S()}/>
      <path d="M20 52 H180" ${S(6)}/>
      <path d="M44 66 Q100 80 156 66" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".6"/>
      <path d="M86 74 l8 8 l8 -8" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`,
    ),
  kusyen: () =>
    svg(
      '0 0 220 120',
      `<ellipse cx="110" cy="74" rx="102" ry="40" fill="#7C9CF2" ${S()}/>
       <ellipse cx="110" cy="66" rx="70" ry="22" fill="#A9BEFA" ${S(4)}/>
       <path d="M60 92 Q110 108 160 92" fill="none" stroke="#5A78D0" stroke-width="5" stroke-linecap="round"/>`,
    ),
  // the box is split so a cat can sit "inside" it (back -> cat -> front)
  kotakBack: () =>
    svg(
      '0 0 200 160',
      `<path d="M30 60 L58 30 H142 L170 60 Z" fill="#9C6A3C" ${S()}/>
       <path d="M58 30 L40 4 L96 14 L100 30 Z" fill="#C8955E" ${S(4)}/>
       <path d="M142 30 L162 6 L108 14 L100 30 Z" fill="#C8955E" ${S(4)}/>`,
    ),
  kotakFront: () =>
    svg(
      '0 0 200 160',
      `<path d="M30 60 H170 V150 H30 Z" fill="#D9A46A" ${S()}/>
       <path d="M30 60 L8 92 L30 98 Z M170 60 L192 92 L170 98 Z" fill="#C8955E" ${S(4)}/>
       <path d="M86 60 V96 H114 V60" fill="#E8C08E" stroke="${INK}" stroke-width="3"/>
       <path d="M44 120 h30 M44 132 h20" stroke="#9C6A3C" stroke-width="5" stroke-linecap="round"/>`,
    ),
  bola: () =>
    svg(
      '0 0 160 120',
      `<path d="M96 96 Q130 110 156 92" fill="none" stroke="#E5536B" stroke-width="6" stroke-linecap="round"/>
       <circle cx="70" cy="66" r="50" fill="#FF6F8B" ${S()}/>
       <path d="M30 44 Q70 70 112 40 M24 72 Q70 100 118 72 M48 22 Q60 66 44 110 M92 20 Q80 66 100 110"
         fill="none" stroke="#C9405A" stroke-width="5" stroke-linecap="round"/>
       <ellipse cx="52" cy="40" rx="10" ry="6" fill="#fff" opacity=".7" transform="rotate(-30 52 40)"/>`,
    ),
  air: () =>
    svg(
      '0 0 200 110',
      `<path d="M20 52 H180 Q172 100 100 102 Q28 100 20 52 Z" fill="#6FB8FF" ${S()}/>
       <ellipse cx="100" cy="52" rx="80" ry="12" fill="#BFE4FF" ${S(5)}/>
       <path d="M70 52 q15 -6 30 0 M110 50 q12 -4 24 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`,
    ),
  bulu: () =>
    svg(
      '0 0 200 140',
      `<path d="M20 130 Q90 120 130 60" fill="none" stroke="#8A5A3B" stroke-width="8" stroke-linecap="round"/>
       <path d="M130 60 Q150 20 190 10 Q178 46 140 70 Z" fill="#FFD23F" ${S(4)}/>
       <path d="M132 62 Q118 24 132 4 Q150 34 140 66 Z" fill="#FF6F8B" ${S(4)}/>
       <path d="M136 64 Q176 60 196 80 Q160 92 134 68 Z" fill="#7BC96F" ${S(4)}/>`,
    ),
  rumahkayu: () =>
    svg(
      '0 0 200 170',
      `<path d="M20 70 L100 10 L180 70 Z" fill="#C0533A" ${S()}/>
       <path d="M36 70 H164 V160 H36 Z" fill="#D9A46A" ${S()}/>
       <path d="M74 160 V112 Q100 84 126 112 V160 Z" fill="#5A3A22" ${S(4)}/>
       <path d="M46 90 h28 M126 90 h28" stroke="#9C6A3C" stroke-width="5" stroke-linecap="round"/>
       <path d="M60 70 H140" stroke="#9E3F2A" stroke-width="5"/>`,
    ),
  // gifts Abu leaves behind
  daun: () =>
    svg(
      '0 0 100 80',
      `<path d="M10 70 Q20 10 90 12 Q84 70 10 70 Z" fill="#7BC96F" ${S(4)}/>
       <path d="M14 66 Q46 44 80 20" fill="none" stroke="#4E9A44" stroke-width="4" stroke-linecap="round"/>`,
    ),
  bunga: () =>
    svg(
      '0 0 100 90',
      `<path d="M50 50 V88" stroke="#4E9A44" stroke-width="5" stroke-linecap="round"/>
       ${[0, 72, 144, 216, 288]
         .map((a) => `<ellipse cx="50" cy="26" rx="13" ry="18" fill="#FF8FB1" ${S(3.5)} transform="rotate(${a} 50 44)"/>`)
         .join('')}
       <circle cx="50" cy="44" r="11" fill="#FFD23F" ${S(3.5)}/>`,
    ),
  ikanbilis: () =>
    svg(
      '0 0 110 60',
      `<path d="M8 30 Q30 12 70 20 Q84 24 90 30 Q84 36 70 40 Q30 48 8 30 Z" fill="#C9CED6" ${S(4)}/>
       <path d="M88 30 L104 16 L100 30 L104 44 Z" fill="#AEB5C0" ${S(4)}/>
       <circle cx="20" cy="28" r="3" fill="${INK}"/>`,
    ),
};
