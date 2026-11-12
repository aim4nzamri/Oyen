import { mountNav } from './nav.js';
import { play } from './sound.js';
import { decorate } from './fx.js';

mountNav();

const OYEN_LINES = [
  'Woi, mana makanan aku?',
  'Jangan kacau. Aku tengah tidur.',
  'Ini kawasan aku. Sofa tu pun aku punya.',
  'Aku tak curi. Aku "pinjam".',
  'Abu dah balik ke? ...Bukan aku tunggu pun.',
  'Satu sel otak pun cukup, bro.',
  'Mak goreng ikan ke tu? 👀',
  'Luar rumah? Tak nak. Panas.',
];
const ABU_LINES = [
  'Meow~ 🥺',
  'Abang Oyen, jom main luar!',
  'Mak cik sebelah bagi Abu ikan bilis tadi 😋',
  'Abu jumpa daun. Cantik kan?',
  'Usap lagi... lagi... 🥰',
  'Shhh... jangan bagitau Abang Oyen.',
];

function setup(btnId, speechId, lines, sound, hearts) {
  const btn = document.getElementById(btnId);
  const speech = document.getElementById(speechId);
  let i = 0;
  btn.addEventListener('click', () => {
    i = (i + 1) % lines.length;
    speech.textContent = lines[i];
    speech.classList.remove('pop');
    btn.classList.remove('poked');
    void btn.offsetWidth; // restart animations
    speech.classList.add('pop');
    btn.classList.add('poked');
    play(sound);
    if (hearts) floatHearts(btn);
  });
}

function floatHearts(el) {
  for (let i = 0; i < 4; i++) {
    const h = document.createElement('span');
    h.className = 'heart-fly';
    h.textContent = ['🩶', '💕', '✨', '🩶'][i];
    h.style.left = `${35 + Math.random() * 30}%`;
    h.style.top = '35%';
    h.style.setProperty('--dx', `${(Math.random() - 0.5) * 90}px`);
    h.style.setProperty('--d', `${0.7 + Math.random() * 0.5}s`);
    el.append(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

setup('poke-oyen', 'speech-oyen', OYEN_LINES, 'meow', false);
setup('poke-abu', 'speech-abu', ABU_LINES, 'mew', true);

// Comic effects around the duo (positions are % of the hero panel).
const duo = document.querySelector('.duo');
decorate(duo, [
  { type: 'anger', x: '38%', y: '30%', size: 30, className: 'oyen-anger' },
  { type: 'sweat', x: '8%', y: '36%', size: 18 },
  { type: 'sparkle', x: '57%', y: '38%', size: 26, rotate: 10 },
  { type: 'sparkle', x: '91%', y: '44%', size: 20, delay: 0.6 },
  { type: 'sparkle', x: '4%', y: '70%', size: 18, delay: 1.1 },
  { type: 'heart', x: '86%', y: '62%', size: 24, rotate: 12, delay: 0.4 },
  { type: 'heart', x: '55%', y: '78%', size: 16, rotate: -14, delay: 1.2 },
  { type: 'fish', x: '40%', y: '86%', size: 34, rotate: -8, delay: 0.8 },
]);

// Poking Oyen makes his anger vein pop.
document.getElementById('poke-oyen').addEventListener('click', () => {
  const vein = duo.querySelector('.oyen-anger');
  vein.classList.remove('burst');
  void vein.offsetWidth;
  vein.classList.add('burst');
});
