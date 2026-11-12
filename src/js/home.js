import { mountNav } from './nav.js';
import { play } from './sound.js';

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
