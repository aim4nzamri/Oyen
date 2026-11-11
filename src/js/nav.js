import { mascotSVG } from './mascot.js';
import { isSoundOn, setSound, onSoundChange, play } from './sound.js';

const LINKS = [
  { id: 'home', href: './index.html', label: 'Laman Utama', short: 'Utama', icon: '🏠' },
  { id: 'quiz', href: './quiz.html', label: 'Kuiz', short: 'Kuiz', icon: '❓' },
  { id: 'game', href: './game.html', label: 'Game', short: 'Game', icon: '🐟' },
  { id: 'hall', href: './hall.html', label: 'Hall of Fame', short: 'Hall', icon: '🏆' },
];

/** Injects the shared header (desktop) and bottom tab bar (mobile). */
export function mountNav() {
  const current = document.body.dataset.page;
  const link = (l, cls, text) =>
    `<a href="${l.href}" class="${cls}${l.id === current ? ' is-active' : ''}"${
      l.id === current ? ' aria-current="page"' : ''
    }>${text}</a>`;

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a href="./index.html" class="brand" aria-label="Oyen - Laman Utama">
      ${mascotSVG({ headOnly: true, className: 'brand-logo', label: '' })}
      <span>Oyen</span>
    </a>
    <div class="header-right">
      <nav class="top-nav" aria-label="Menu utama">
        ${LINKS.map((l) => link(l, 'top-link', l.label)).join('')}
      </nav>
      <button class="sound-toggle" type="button"></button>
    </div>`;

  const tabbar = document.createElement('nav');
  tabbar.className = 'tab-bar';
  tabbar.setAttribute('aria-label', 'Menu');
  tabbar.innerHTML = LINKS.map((l) =>
    link(l, 'tab-link', `<span class="tab-icon" aria-hidden="true">${l.icon}</span><span>${l.short}</span>`),
  ).join('');

  document.body.prepend(header);
  document.body.append(tabbar);

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `Dibuat dengan 🧡 untuk semua Oyen di Malaysia. <br/>Tiada kucing dicederakan. Ikan goreng, ya.`;
  document.querySelector('main')?.after(footer);

  // Sound toggle
  const btn = header.querySelector('.sound-toggle');
  const sync = (on) => {
    btn.textContent = on ? '🔊' : '🔇';
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Bunyi: hidup. Tekan untuk senyap' : 'Bunyi: senyap. Tekan untuk hidupkan');
    btn.title = on ? 'Senyapkan bunyi' : 'Hidupkan bunyi';
  };
  sync(isSoundOn());
  onSoundChange(sync);
  btn.addEventListener('click', () => {
    setSound(!isSoundOn());
    play('meow');
  });

  // Little click sound on buttons and quiz options
  document.addEventListener('click', (e) => {
    if (e.target.closest('.btn, .option, .seg button, .hud-btn')) play('click');
  });
}

/** Emoji confetti burst from the top of the screen. */
export function confetti(emojis = ['🧡', '🐟', '✨', '😼'], count = 28) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const layer = document.createElement('div');
  layer.className = 'confetti';
  layer.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.textContent = emojis[i % emojis.length];
    s.style.left = `${Math.random() * 100}%`;
    s.style.setProperty('--x', `${(Math.random() - 0.5) * 160}px`);
    s.style.setProperty('--r', `${(Math.random() - 0.5) * 720}deg`);
    s.style.animationDelay = `${Math.random() * 0.4}s`;
    s.style.animationDuration = `${1.6 + Math.random() * 1.2}s`;
    s.style.fontSize = `${18 + Math.random() * 16}px`;
    layer.append(s);
  }
  document.body.append(layer);
  setTimeout(() => layer.remove(), 3500);
}
