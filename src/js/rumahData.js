// ===========================================================================
// RUMAH OYEN & ABU: game content. Tune timings, prices and lines here.
// ===========================================================================

// Timing (seconds). Short for the prototype so things happen quickly;
// a real cozy game would use minutes/hours.
export const TIMING = {
  firstVisit: [4, 10], // wait before a cat first shows up after you arrive
  cooldown: [12, 35], // rest between visits while you're watching
  awayCooldown: [900, 2400], // rest between visits while you're away (15-40 min)
  visit: [40, 95], // how long a visit lasts
  awayCapHours: 24, // how far back to simulate when you come back
};

export const START_IKAN = 20;

// type: 'dalam' (inside, Oyen) or 'luar' (outside, Abu)
// spots: x/y = % of the scene where the item's bottom-centre sits,
//        s = item width as % of the scene width (smaller = further away)
export const AREAS = [
  {
    id: 'ruangtamu',
    name: 'Ruang Tamu',
    icon: '🛋️',
    type: 'dalam',
    bg: 'locations/ruangtamu_A_siang.webp',
    spots: [
      { id: 'sofa', x: 27, y: 66, s: 21 },
      { id: 'karpet', x: 58, y: 85, s: 24 },
      { id: 'tepi', x: 86, y: 73, s: 18 },
    ],
  },
  {
    id: 'dapur',
    name: 'Dapur',
    icon: '🍳',
    type: 'dalam',
    bg: 'locations/dapur_A_siang.webp',
    spots: [
      { id: 'sudut', x: 20, y: 73, s: 18 },
      { id: 'depan', x: 31, y: 94, s: 24 },
      { id: 'kanan', x: 83, y: 91, s: 21 },
    ],
  },
  {
    id: 'bilik',
    name: 'Bilik Aiman',
    icon: '🛏️',
    type: 'dalam',
    bg: 'locations/bilikaiman_A_siang.webp',
    spots: [
      { id: 'katil', x: 20, y: 74, s: 20 },
      { id: 'karpet', x: 60, y: 94, s: 24 },
      { id: 'tepi', x: 89, y: 83, s: 18 },
    ],
  },
  {
    id: 'laman',
    name: 'Laman',
    icon: '🌿',
    type: 'luar',
    bg: 'locations/depanrumah_A_siang.webp',
    spots: [
      { id: 'kiri', x: 17, y: 73, s: 19 },
      { id: 'laluan', x: 50, y: 85, s: 22 },
      { id: 'kanan', x: 84, y: 75, s: 19 },
    ],
  },
];

// ratio = width / height of the item artwork
export const ITEMS = {
  mangkuk: { name: 'Mangkuk makanan', type: 'dalam', price: 0, ratio: 200 / 110, desc: 'Wajib. Oyen akan datang. Selalu.' },
  kusyen: { name: 'Kusyen gebu', type: 'dalam', price: 0, ratio: 220 / 120, desc: 'Tempat tidur 20 jam.' },
  kotak: { name: 'Kotak kadbod', type: 'dalam', price: 15, ratio: 200 / 160, desc: 'Terlalu kecil. Sempurna.' },
  bola: { name: 'Bola bulu', type: 'dalam', price: 10, ratio: 160 / 120, desc: 'Musuh nombor satu Oyen.' },
  air: { name: 'Mangkuk air', type: 'luar', price: 0, ratio: 200 / 110, desc: 'Abu suka minum lepas jalan-jalan.' },
  bulu: { name: 'Mainan bulu', type: 'luar', price: 10, ratio: 200 / 140, desc: 'Wewit! Abu tak boleh tahan.' },
  rumahkayu: { name: 'Rumah kayu', type: 'luar', price: 20, ratio: 200 / 170, desc: 'Rumah kecil untuk Abu berteduh.' },
};

// How each cat looks when using each item.
//  img    = character art in public/characters/
//  w      = picture width relative to the item width
//  bottom = how high the picture sits (% of item height)
//  dx     = horizontal shift (% of item width)
//  layer  = 'behind' (item drawn in front), 'front', or 'inside' (box)
export const POSES = {
  'oyen:mangkuk': { img: 'oyen_face_happy', w: 1.15, bottom: 30, dx: 0, layer: 'behind', line: 'Nom nom nom 😋', photo: 'Oyen makan' },
  'oyen:lapar': { img: 'oyen_face_marah', w: 1.15, bottom: 30, dx: 0, layer: 'behind', line: 'Woi, mana makanan aku?! 😾', photo: 'Oyen lapar' },
  'oyen:kusyen': { img: 'oyen_pose_terbongkang', w: 1.05, bottom: 28, dx: 0, layer: 'front', line: 'Zzz... jangan kacau...', photo: 'Oyen tidur' },
  'oyen:kotak': { img: 'oyen_pose_duduk', w: 0.95, bottom: 18, dx: 0, layer: 'inside', line: 'Muat. Muat je ni.', photo: 'Oyen dalam kotak' },
  'oyen:bola': { img: 'oyen_pose_gremlin', w: 1.75, bottom: 0, dx: -38, layer: 'front', line: 'Bola ni musuh negara.', photo: 'Oyen vs bola' },
  'abu:air': { img: 'abu_pose_sisi', w: 1.55, bottom: 6, dx: -30, layer: 'front', line: 'Slurp slurp~ 💧', photo: 'Abu minum' },
  'abu:bulu': { img: 'abu_pose_guling', w: 1.5, bottom: 0, dx: 18, layer: 'front', line: 'Wewit! Wewit! 🪶', photo: 'Abu main bulu' },
  'abu:rumahkayu': { img: 'abu_pose_flattery', w: 0.8, bottom: 2, dx: 0, layer: 'front', line: 'Rumah Abu! Cantik kan? 🥺', photo: 'Abu di rumah kayu' },
};

export const PHOTO_REWARD = { first: 10, again: 2 };

export const GIFTS = {
  daun: { name: 'Daun', reward: 2, line: 'Abu bawa daun. Cantik katanya.' },
  bunga: { name: 'Bunga', reward: 4, line: 'Abu petik bunga jiran. Shhh...' },
  ikanbilis: { name: 'Ikan bilis', reward: 6, line: 'Ikan bilis dari mak cik sebelah! 😋' },
};
export const GIFT_CHANCE = 0.6;
