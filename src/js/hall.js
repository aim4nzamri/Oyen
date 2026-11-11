import { mountNav } from './nav.js';
import { mascotSVG } from './mascot.js';

mountNav();

// Data lives in public/data/oyens.json so new cats (and real photos) can be
// added without touching code. See README "Hall of Fame data".
const DATA_URL = './data/oyens.json';
const LIKES_KEY = 'oyen.hall.likes';
const SORT_KEY = 'oyen.hall.sort';

const root = document.getElementById('hall');
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// ---------- likes (per-browser) ----------
function loadLikes() {
  try {
    return new Set(JSON.parse(localStorage.getItem(LIKES_KEY) || '[]'));
  } catch {
    return new Set();
  }
}
const liked = loadLikes();
function saveLikes() {
  try {
    localStorage.setItem(LIKES_KEY, JSON.stringify([...liked]));
  } catch {
    /* ignore */
  }
}
const likeCount = (cat) => (Number(cat.likes) || 0) + (liked.has(cat.id) ? 1 : 0);

function getSort() {
  try {
    return localStorage.getItem(SORT_KEY) || 'popular';
  } catch {
    return 'popular';
  }
}

// Only allow photos from our own site or https URLs.
function safePhoto(src) {
  if (!src || typeof src !== 'string') return null;
  if (/^https:\/\//i.test(src)) return src;
  if (/^[\w\-./]+$/.test(src) && !src.includes('..')) return `./${src.replace(/^\.?\//, '')}`;
  return null;
}

function picture(cat, big = false) {
  const photo = safePhoto(cat.photo);
  if (photo) {
    return `<img src="${esc(photo)}" alt="${esc(cat.name)}" loading="lazy" decoding="async" />`;
  }
  return mascotSVG({ mood: cat.mood, palette: cat.palette, label: esc(cat.name), className: big ? 'big' : '' });
}

function likeButton(cat) {
  const on = liked.has(cat.id);
  return `<button class="like${on ? ' is-liked' : ''}" data-id="${esc(cat.id)}" aria-pressed="${on}"
    aria-label="${on ? 'Tarik balik like' : 'Like'} ${esc(cat.name)}">
    <span class="like-heart" aria-hidden="true">${on ? '🧡' : '🤍'}</span>
    <span class="like-count">${likeCount(cat).toLocaleString('en-MY')}</span>
  </button>`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ---------- render ----------
function render(data) {
  const { oyens } = data;
  const weekly = oyens.find((c) => c.id === data.oyenOfTheWeek?.id);
  const sort = getSort();
  const list = [...oyens].sort((a, b) =>
    sort === 'new' ? String(b.addedOn).localeCompare(String(a.addedOn)) : likeCount(b) - likeCount(a),
  );

  root.innerHTML = `
    <header class="hall-head">
      <h1>Hall of Fame Oyen 🏆</h1>
      <p>Legenda kucing oren seluruh Malaysia. Tekan 🤍 untuk bagi respek.</p>
    </header>

    ${
      weekly
        ? `<section class="weekly" aria-labelledby="weekly-title">
      <div class="weekly-ribbon">👑 Oyen Minggu Ini</div>
      <div class="weekly-body">
        <div class="weekly-pic">${picture(weekly, true)}</div>
        <div class="weekly-info">
          <h2 id="weekly-title">${esc(weekly.name)}</h2>
          <p class="loc">📍 ${esc(weekly.location)}</p>
          <p class="weekly-reason">${esc(data.oyenOfTheWeek.reason || weekly.caption)}</p>
          ${likeButton(weekly)}
        </div>
      </div>
    </section>`
        : ''
    }

    <div class="hall-toolbar">
      <h2>Semua Legenda <small>(${oyens.length})</small></h2>
      <div class="seg" role="group" aria-label="Susun ikut">
        <button data-sort="popular" aria-pressed="${sort === 'popular'}">🔥 Popular</button>
        <button data-sort="new" aria-pressed="${sort === 'new'}">🆕 Terbaru</button>
      </div>
    </div>

    <ul class="gallery">
      ${list
        .map(
          (cat, i) => `
        <li class="oyen-card" style="--tilt:${(i % 2 ? 1 : -1) * 0.6}deg">
          <div class="oyen-pic pal-${esc(cat.palette || 'oren')}">${picture(cat)}</div>
          <div class="oyen-info">
            <h3>${esc(cat.name)}</h3>
            <p class="loc">📍 ${esc(cat.location)}</p>
            <p class="caption">${esc(cat.caption)}</p>
            <div class="oyen-foot">
              ${likeButton(cat)}
              <time datetime="${esc(cat.addedOn)}">${esc(fmtDate(cat.addedOn))}</time>
            </div>
          </div>
        </li>`,
        )
        .join('')}
    </ul>

    <section class="submit card">
      <h2>Oyen kau layak masuk sini?</h2>
      <p>Tak lama lagi kau boleh upload gambar Oyen kau sendiri. Sementara tu, asah skill samseng dia dulu.</p>
      <a class="btn btn-primary" href="./quiz.html">Buat kuiz dulu ❓</a>
    </section>`;
}

// ---------- interactions ----------
function burst(btn) {
  for (let i = 0; i < 6; i++) {
    const h = document.createElement('span');
    h.className = 'heart-fly';
    h.textContent = '🧡';
    h.style.setProperty('--dx', `${(Math.random() - 0.5) * 80}px`);
    h.style.setProperty('--d', `${0.6 + Math.random() * 0.4}s`);
    btn.append(h);
    h.addEventListener('animationend', () => h.remove());
  }
}

let data = null;

root.addEventListener('click', (e) => {
  const likeBtn = e.target.closest('.like');
  if (likeBtn) {
    const id = likeBtn.dataset.id;
    const cat = data.oyens.find((c) => c.id === id);
    if (!cat) return;
    const on = !liked.has(id);
    if (on) liked.add(id);
    else liked.delete(id);
    saveLikes();
    // Update every button for this cat (it can appear twice: weekly + grid).
    root.querySelectorAll(`.like[data-id="${CSS.escape(id)}"]`).forEach((b) => {
      b.classList.toggle('is-liked', on);
      b.setAttribute('aria-pressed', String(on));
      b.setAttribute('aria-label', `${on ? 'Tarik balik like' : 'Like'} ${cat.name}`);
      b.querySelector('.like-heart').textContent = on ? '🧡' : '🤍';
      b.querySelector('.like-count').textContent = likeCount(cat).toLocaleString('en-MY');
    });
    if (on) {
      burst(likeBtn);
      likeBtn.classList.remove('pop');
      void likeBtn.offsetWidth; // restart animation
      likeBtn.classList.add('pop');
    }
    return;
  }

  const sortBtn = e.target.closest('[data-sort]');
  if (sortBtn) {
    try {
      localStorage.setItem(SORT_KEY, sortBtn.dataset.sort);
    } catch {
      /* ignore */
    }
    render(data);
  }
});

(async () => {
  root.innerHTML = `<p class="loading">Oyen tengah kumpul geng... 🐾</p>`;
  try {
    const res = await fetch(DATA_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(res.status);
    data = await res.json();
    data.oyens = (data.oyens || []).filter((c) => c && c.id && c.name);
    render(data);
  } catch (err) {
    console.error(err);
    root.innerHTML = `<section class="card soon">${mascotSVG({ mood: 'drama' })}
      <h1>Alamak!</h1><p>Oyen terlanggar wayar. Data tak dapat dimuat. Cuba refresh.</p></section>`;
  }
})();
