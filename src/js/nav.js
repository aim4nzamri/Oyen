import { mascotSVG } from './mascot.js';

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
    <nav class="top-nav" aria-label="Menu utama">
      ${LINKS.map((l) => link(l, 'top-link', l.label)).join('')}
    </nav>`;

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
}
