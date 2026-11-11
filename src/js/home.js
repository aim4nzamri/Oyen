import { mountNav } from './nav.js';
import { mascotSVG } from './mascot.js';

mountNav();

const LINES = [
  'Woi, mana makanan aku?',
  'Jangan kacau, Oyen tengah tidur.',
  'Ini kawasan aku. Bayar cukai ikan bilis.',
  'Aku tak curi. Aku "pinjam".',
  'Kucing sebelah tu? Dah settle.',
  'Satu sel otak pun cukup, bro.',
  'Mak goreng ikan ke tu? 👀',
];

const MOODS = ['smug', 'samseng', 'pencuri', 'otak'];

const holder = document.getElementById('hero-mascot');
const speech = document.getElementById('speech');
let i = 0;

function render(mood) {
  holder.innerHTML = mascotSVG({ mood, className: 'hero-mascot' });
}

render('smug');

// Poke Oyen: he changes face and says something cheeky.
holder.setAttribute('role', 'button');
holder.setAttribute('tabindex', '0');
holder.setAttribute('aria-label', 'Cucuk Oyen');
holder.style.cursor = 'pointer';

function poke() {
  i = (i + 1) % LINES.length;
  speech.textContent = LINES[i];
  render(MOODS[i % MOODS.length]);
}

holder.addEventListener('click', poke);
holder.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    poke();
  }
});
