import { kitchenWall, wallCabinet, counter, kuali, platter, oyen, oyenHead, mak, bubble, sfx, sparkle, burst, LINE } from '../lib.mjs';

export const meta = {
  number: 1,
  slug: 'ikan-goreng-1',
  title: 'IKAN GORENG I',
  caption: 'Oyen korang pernah buat macam ni? Tag kawan yang ada Oyen 😹',
};

// Panel 1: Mak angkat ikan, letak atas pinggan berlapik tisu supaya sejuk.
// Oyen atas kabinet, tunggu dengan sabar (sangat sabar).
const p1 = `
  ${kitchenWall()}
  ${wallCabinet(20, 250)}
  ${oyen('fokus', 60, 32, 200)}
  ${mak({ face: 'hum', pose: 'sudip' }, 730, 150, 250)}
  ${counter()}
  ${kuali(660, false, false)}
  ${platter(340, true, 3)}
  ${sfx('PANAS!', 470, 360, { size: 56, rotate: 8, fill: '#FF8A1F' })}
  ${bubble({ x: 480, y: 120, lines: ['*Sabar*...', 'sabar...'], tail: [250, 110], kind: 'think', size: 40 })}
  ${bubble({ x: 770, y: 74, lines: ['Biar *sejuk* dulu...'], tail: [830, 170], size: 32 })}
`;

// Panel 2: Mak pusing panggil Abah. Ikan dah sejuk. Mata Oyen bersinar.
const p2 = `
  ${kitchenWall()}
  ${wallCabinet(20, 250)}
  ${oyen('bling', 50, 22, 210)}
  ${sparkle(290, 90, 30)}${sparkle(40, 210, 22)}${sparkle(300, 210, 16)}
  ${mak({ view: 'back' }, 730, 160, 240)}
  ${counter()}
  ${kuali(660, false, false)}
  ${platter(340, true, 0)}
  ${sfx('BLING~!', 400, 140, { size: 92, rotate: -10, fill: '#FFD23F' })}
  ${sfx('BLING~!', 430, 290, { size: 62, rotate: 6, fill: '#FFD23F' })}
  ${bubble({ x: 740, y: 96, lines: ['ABAH! Mari *makan*!'], tail: [830, 190], kind: 'shout', size: 34 })}
`;

// Panel 3: Mak pusing balik. Pinggan kosong, tinggal tisu berminyak.
// Oyen duduk sopan sebelah pinggan.
const p3 = `
  ${kitchenWall()}
  ${wallCabinet(20, 250)}
  ${counter()}
  ${kuali(660, false, false)}
  ${mak({ face: 'shock', pose: 'plate' }, 735, 140, 250)}
  ${platter(330, false)}
  ${oyen('innocent', 20, 332, 200)}
  ${sfx('JENG!', 130, 200, { size: 84, rotate: -12 })}
  ${sfx('JENG!', 560, 300, { size: 64, rotate: 8 })}
  ${sfx('!!!', 690, 150, { size: 90, rotate: 10, fill: '#FFD23F' })}
  ${bubble({ x: 360, y: 70, lines: ['Meow? *(Ikan apa?)*'], tail: [140, 350], size: 36 })}
`;

// Panel 4: Close-up. Mak tunjuk ekor ikan. Oyen: "...Tu misai aku."
const finger = `
  <path d="M1040 600 L760 600" stroke="${LINE}" stroke-width="64" stroke-linecap="round"/>
  <path d="M1040 600 L760 600" stroke="#F4C542" stroke-width="52" stroke-linecap="round"/>
  <path d="M800 572 q-60 -6 -130 4 q-14 10 0 18 l84 2 q-20 18 6 26 q40 6 56 -10 Z" fill="#E9B48C" stroke="${LINE}" stroke-width="5" stroke-linejoin="round"/>
  <path d="M640 586 l-26 -2 M642 600 l-22 8 M640 572 l-20 -12" stroke="${LINE}" stroke-width="5" stroke-linecap="round"/>`;
const p4 = `
  ${burst(380, 420)}
  ${oyenHead('serius', 90, 150, 520)}
  ${finger}
  ${bubble({ x: 280, y: 90, lines: ['...Tu *misai* aku.'], tail: [300, 210], size: 40 })}
  ${bubble({ x: 800, y: 300, lines: ['......'], tail: [900, 560], kind: 'shout', size: 50 })}
  <path d="M870 200 q12 12 0 24 M898 200 q-12 12 0 24 M872 198 q12 12 24 0 M872 226 q12 -12 24 0" fill="none" stroke="#E0303F" stroke-width="8" stroke-linecap="round"/>
`;

export const panels = [p1, p2, p3, p4];
