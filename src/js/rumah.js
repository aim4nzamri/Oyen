import { mountNav, confetti } from './nav.js';
import { play } from './sound.js';
import { ART } from './rumahArt.js';
import { TIMING, START_IKAN, AREAS, ITEMS, POSES, PHOTO_REWARD, GIFTS, GIFT_CHANCE } from './rumahData.js';

mountNav();

const SAVE_KEY = 'oyen.rumah.v1';
const CATS = { oyen: { name: 'Oyen', type: 'dalam' }, abu: { name: 'Abu', type: 'luar' } };
const now = () => Date.now() / 1000;
const rand = ([a, b]) => a + Math.random() * (b - a);
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------
function freshState() {
  const t = now();
  return {
    v: 1,
    ikan: START_IKAN,
    owned: ['mangkuk', 'kusyen', 'air'],
    placed: { 'dapur:sudut': { item: 'mangkuk', full: true }, 'laman:laluan': { item: 'air' } },
    cats: { oyen: { at: null, nextAt: t + rand(TIMING.firstVisit) }, abu: { at: null, nextAt: t + rand(TIMING.firstVisit) } },
    gifts: {},
    album: {},
    giftLog: {},
    area: 'dapur',
    last: t,
  };
}

function load() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (s && s.v === 1) return s;
  } catch {
    /* corrupted or blocked storage */
  }
  return freshState();
}

let state = load();
function save() {
  state.last = now();
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    /* private mode: game still works for this visit */
  }
}

const spotKey = (areaId, spotId) => `${areaId}:${spotId}`;
const areaOf = (key) => AREAS.find((a) => a.id === key.split(':')[0]);
const catAt = (key) => Object.keys(CATS).find((c) => state.cats[c].at?.spot === key);

// ---------------------------------------------------------------------------
// Simulation: event-driven, so it also catches up on time spent away
// ---------------------------------------------------------------------------
function poseFor(cat, placed) {
  if (cat === 'oyen' && placed.item === 'mangkuk') return placed.full ? 'oyen:mangkuk' : 'oyen:lapar';
  const k = `${cat}:${placed.item}`;
  return POSES[k] ? k : null;
}

function startVisit(cat, t, log) {
  const cs = state.cats[cat];
  const options = [];
  for (const [key, placed] of Object.entries(state.placed)) {
    if (areaOf(key)?.type !== CATS[cat].type || state.gifts[key] || catAt(key)) continue;
    const pose = poseFor(cat, placed);
    if (!pose) continue;
    const weight = pose === 'oyen:lapar' ? 3 : 1; // hungry Oyen goes straight to the empty bowl
    for (let i = 0; i < weight; i++) options.push({ key, pose });
  }
  if (!options.length) {
    cs.nextAt = t + 6;
    return;
  }
  const choice = pick(options);
  cs.at = { spot: choice.key, pose: choice.pose, start: t, end: t + rand(TIMING.visit), snapped: false };
  log.visits[cat]++;
}

function endVisit(cat, t, log, away) {
  const cs = state.cats[cat];
  const { spot, pose } = cs.at;
  const placed = state.placed[spot];
  if (pose === 'oyen:mangkuk' && placed) {
    placed.full = false; // Oyen finishes the bowl. Always.
    log.makan++;
  }
  if (cat === 'abu' && Math.random() < GIFT_CHANCE) {
    state.gifts[spot] = pick(Object.keys(GIFTS));
    log.hadiah++;
  }
  cs.at = null;
  cs.nextAt = t + rand(away ? TIMING.awayCooldown : TIMING.cooldown);
}

function simulate(until, away = false) {
  const log = { visits: { oyen: 0, abu: 0 }, makan: 0, hadiah: 0 };
  for (let guard = 0; guard < 5000; guard++) {
    let next = null;
    for (const cat of Object.keys(CATS)) {
      const cs = state.cats[cat];
      const t = cs.at ? cs.at.end : cs.nextAt;
      if (t <= until && (!next || t < next.t)) next = { cat, t };
    }
    if (!next) break;
    if (state.cats[next.cat].at) endVisit(next.cat, next.t, log, away);
    else startVisit(next.cat, next.t, log);
  }
  return log;
}

const changed = (log) => log.visits.oyen + log.visits.abu + log.makan + log.hadiah > 0;

// ---------------------------------------------------------------------------
// Rendering
// ---------------------------------------------------------------------------
const $ = (s) => document.querySelector(s);
const scene = $('#scene');
const tabs = $('#area-tabs');

function itemArt(placed) {
  if (placed.item === 'mangkuk') return ART.mangkuk(placed.full);
  return ART[placed.item]();
}

function catImg(cat, poseKey, visit) {
  const p = POSES[poseKey];
  return `<button class="rumah-cat${visit.snapped ? ' is-snapped' : ''}" data-act="snap" data-cat="${cat}"
      style="width:${p.w * 100}%;left:calc(50% + ${p.dx}%);bottom:${p.bottom}%"
      aria-label="Ambil gambar ${CATS[cat].name}">
      <span class="rumah-say">${p.line}</span>
      <img src="./characters/${p.img}.webp" alt="" draggable="false" />
    </button>`;
}

function renderSpot(area, spot) {
  const key = spotKey(area.id, spot.id);
  const placed = state.placed[key];
  const pos = `left:${spot.x}%;top:${spot.y}%;width:${spot.s}%`;
  if (!placed) {
    return `<div class="rumah-spot is-empty" style="${pos}">
      <button class="spot-add" data-act="place" data-key="${key}" aria-label="Letak barang">+</button></div>`;
  }
  const item = ITEMS[placed.item];
  const cat = catAt(key);
  const visit = cat && state.cats[cat].at;
  const pose = visit && POSES[visit.pose];
  // positioned children stack in DOM order; item layers ignore taps
  let layers;
  if (placed.item === 'kotak') {
    layers = `<span class="layer">${ART.kotakBack()}</span>${visit ? catImg(cat, visit.pose, visit) : ''}<span class="layer">${ART.kotakFront()}</span>`;
  } else if (pose?.layer === 'behind') {
    layers = `${catImg(cat, visit.pose, visit)}<span class="layer">${itemArt(placed)}</span>`;
  } else {
    layers = `<span class="layer">${itemArt(placed)}</span>${visit ? catImg(cat, visit.pose, visit) : ''}`;
  }
  const gift = state.gifts[key];
  return `<div class="rumah-spot" style="${pos}">
    <div class="spot-box" style="aspect-ratio:${item.ratio}">
      <button class="spot-hit" data-act="item" data-key="${key}" aria-label="${item.name}"></button>
      ${layers}
      ${gift ? `<button class="rumah-gift" data-act="gift" data-key="${key}" aria-label="Ambil hadiah: ${GIFTS[gift].name}">${ART[gift]()}</button>` : ''}
    </div>
  </div>`;
}

function render() {
  const area = AREAS.find((a) => a.id === state.area) || AREAS[0];
  $('#ikan').textContent = state.ikan;

  tabs.innerHTML = AREAS.map((a) => {
    const here = Object.keys(CATS).filter((c) => areaOf(state.cats[c].at?.spot || '')?.id === a.id);
    const giftHere = Object.keys(state.gifts).some((k) => k.startsWith(a.id + ':'));
    return `<button class="area-tab${a.id === area.id ? ' is-active' : ''}" data-area="${a.id}" aria-pressed="${a.id === area.id}">
      <span aria-hidden="true">${a.icon}</span> ${a.name}
      ${here.map((c) => `<img class="tab-face" src="./characters/${c}-head.webp" alt="${CATS[c].name} ada di sini" />`).join('')}
      ${giftHere ? '<span class="tab-gift" aria-label="Ada hadiah">🎁</span>' : ''}
    </button>`;
  }).join('');

  scene.style.backgroundImage = `url(./${area.bg})`;
  scene.innerHTML = area.spots.map((s) => renderSpot(area, s)).join('');

  // status line
  const lines = Object.keys(CATS).map((c) => {
    const at = state.cats[c].at;
    return at ? `<b>${CATS[c].name}</b> ada di ${areaOf(at.spot).name}` : `<b>${CATS[c].name}</b> tengah merayau...`;
  });
  $('#status').innerHTML = lines.join(' · ');
}

// ---------------------------------------------------------------------------
// Bottom sheet (place item / item menu / shop / album)
// ---------------------------------------------------------------------------
const sheet = $('#sheet');
// keep the sheet outside <main> (its page-in animation would trap position:fixed)
document.body.append(sheet);
function openSheet(title, body) {
  sheet.innerHTML = `<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="${title}">
    <div class="sheet-head"><h2>${title}</h2><button class="sheet-close" data-act="close" aria-label="Tutup">✕</button></div>
    <div class="sheet-body">${body}</div></div>`;
  sheet.hidden = false;
  sheet.querySelector('.sheet-close').focus();
}
function closeSheet() {
  sheet.hidden = true;
  sheet.innerHTML = '';
}

function itemThumb(id, full = true) {
  return id === 'kotak' ? `<span class="thumb-stack">${ART.kotakBack()}${ART.kotakFront()}</span>` : id === 'mangkuk' ? ART.mangkuk(full) : ART[id]();
}

function openPlace(key) {
  const type = areaOf(key).type;
  const used = new Set(Object.values(state.placed).map((p) => p.item));
  const free = state.owned.filter((id) => ITEMS[id].type === type && !used.has(id));
  const body = free.length
    ? `<div class="item-list">${free
        .map(
          (id) => `<button class="item-card" data-act="put" data-key="${key}" data-item="${id}">
            <span class="item-pic">${itemThumb(id)}</span><b>${ITEMS[id].name}</b><small>${ITEMS[id].desc}</small></button>`,
        )
        .join('')}</div>`
    : `<p class="sheet-empty">Semua barang ${type === 'dalam' ? 'dalam rumah' : 'luar rumah'} dah diletak.<br/>Beli lagi di <button class="link-btn" data-act="shop">🛍️ Kedai</button></p>`;
  openSheet(type === 'dalam' ? 'Letak barang (untuk Oyen)' : 'Letak barang (untuk Abu)', body);
}

function openItemMenu(key) {
  const placed = state.placed[key];
  const item = ITEMS[placed.item];
  const cat = catAt(key);
  const refill = placed.item === 'mangkuk' && !placed.full;
  openSheet(
    item.name,
    `<div class="item-menu">
      <span class="item-pic big">${itemThumb(placed.item, placed.full)}</span>
      <p>${item.desc}</p>
      ${refill ? `<button class="btn btn-primary" data-act="refill" data-key="${key}">Isi makanan 🍚</button>` : ''}
      ${
        cat
          ? `<p class="sheet-note">${CATS[cat].name} tengah guna. Tunggu dia pergi dulu.</p>`
          : `<button class="btn" data-act="remove" data-key="${key}">Simpan balik</button>`
      }
    </div>`,
  );
}

function openShop() {
  openSheet(
    '🛍️ Kedai Barang',
    `<p class="sheet-wallet">Ikan kau: <b>🐟 ${state.ikan}</b></p>
    <div class="item-list">${Object.entries(ITEMS)
      .map(([id, it]) => {
        const has = state.owned.includes(id);
        return `<div class="item-card${has ? ' is-owned' : ''}">
          <span class="item-pic">${itemThumb(id)}</span>
          <b>${it.name}</b><small>${it.type === 'dalam' ? '🏠 Dalam rumah' : '🌿 Luar rumah'} · ${it.desc}</small>
          ${
            has
              ? '<span class="owned-tag">Dah ada ✓</span>'
              : `<button class="btn btn-primary btn-sm" data-act="buy" data-item="${id}" ${state.ikan < it.price ? 'disabled' : ''}>Beli 🐟 ${it.price}</button>`
          }
        </div>`;
      })
      .join('')}</div>`,
  );
}

function openAlbum() {
  const total = Object.keys(POSES).length;
  const got = Object.keys(state.album).length;
  openSheet(
    `📷 Album Kenangan (${got}/${total})`,
    `<div class="album-grid">${Object.entries(POSES)
      .map(([k, p]) => {
        const have = state.album[k];
        return `<figure class="album-slot${have ? '' : ' is-locked'}">
          <img src="./characters/${p.img}.webp" alt="" loading="lazy" />
          <figcaption>${have ? p.photo : '???'}</figcaption></figure>`;
      })
      .join('')}</div>
    <h3 class="album-sub">🎁 Hadiah dari Abu</h3>
    <div class="gift-row">${Object.entries(GIFTS)
      .map(([k, g]) => `<div class="gift-count"><span>${ART[k]()}</span><b>×${state.giftLog[k] || 0}</b><small>${g.name}</small></div>`)
      .join('')}</div>`,
  );
}

// ---------------------------------------------------------------------------
// Toast + camera flash
// ---------------------------------------------------------------------------
let toastTimer;
function toast(html) {
  const el = $('#toast');
  el.innerHTML = html;
  el.hidden = false;
  el.classList.remove('show');
  void el.offsetWidth;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => (el.hidden = true), 2600);
}

function flash() {
  const f = document.createElement('div');
  f.className = 'camera-flash';
  scene.append(f);
  f.addEventListener('animationend', () => f.remove());
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------
function act(name, el) {
  const key = el.dataset.key;
  const t = now();
  switch (name) {
    case 'area':
      state.area = el.dataset.area;
      play('click');
      break;
    case 'place':
      play('click');
      return openPlace(key);
    case 'item':
      play('click');
      return openItemMenu(key);
    case 'put': {
      state.placed[key] = { item: el.dataset.item, full: true };
      // a cat that is just wandering may come sooner to try the new thing
      const cat = areaOf(key).type === 'dalam' ? 'oyen' : 'abu';
      const cs = state.cats[cat];
      if (!cs.at) cs.nextAt = Math.min(cs.nextAt, t + rand(TIMING.firstVisit));
      closeSheet();
      play('click');
      toast(`${ITEMS[el.dataset.item].name} diletak. Tunggu ${CATS[cat].name} datang...`);
      break;
    }
    case 'remove':
      if (state.gifts[key]) act('gift', el); // don't lose Abu's gift
      delete state.placed[key];
      closeSheet();
      break;
    case 'refill': {
      state.placed[key].full = true;
      const cat = catAt(key);
      if (cat === 'oyen') state.cats.oyen.at.pose = 'oyen:mangkuk'; // angry Oyen becomes happy Oyen
      closeSheet();
      play('catch');
      toast('Mangkuk penuh! 🍚');
      break;
    }
    case 'snap': {
      const cat = el.dataset.cat;
      const visit = state.cats[cat].at;
      if (!visit) return;
      const pose = POSES[visit.pose];
      if (visit.snapped) {
        toast(`${CATS[cat].name}: “${pose.line}”`);
        play(cat === 'oyen' ? 'meow' : 'mew');
        return;
      }
      visit.snapped = true;
      const first = !state.album[visit.pose];
      state.album[visit.pose] = (state.album[visit.pose] || 0) + 1;
      const reward = first ? PHOTO_REWARD.first : PHOTO_REWARD.again;
      state.ikan += reward;
      flash();
      play('shutter');
      if (first) {
        confetti(['📸', '🐟', '✨', cat === 'oyen' ? '🧡' : '🩶'], 18);
        toast(`📸 Gambar baru: <b>${pose.photo}</b>! +${reward} 🐟`);
      } else {
        toast(`📸 ${pose.photo}. +${reward} 🐟`);
      }
      break;
    }
    case 'gift': {
      const g = state.gifts[key];
      delete state.gifts[key];
      state.giftLog[g] = (state.giftLog[g] || 0) + 1;
      state.ikan += GIFTS[g].reward;
      play('like');
      toast(`🎁 ${GIFTS[g].line} +${GIFTS[g].reward} 🐟`);
      break;
    }
    case 'buy': {
      const id = el.dataset.item;
      if (state.ikan < ITEMS[id].price || state.owned.includes(id)) return;
      state.ikan -= ITEMS[id].price;
      state.owned.push(id);
      play('gold');
      save();
      render();
      return openShop();
    }
    case 'shop':
      play('click');
      return openShop();
    case 'album':
      play('click');
      return openAlbum();
    case 'close':
      return closeSheet();
    default:
      return;
  }
  save();
  render();
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act], [data-area]');
  if (!el) {
    if (e.target === sheet) closeSheet(); // tap outside the panel
    return;
  }
  act(el.dataset.act || 'area', el);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !sheet.hidden) closeSheet();
});

// ---------------------------------------------------------------------------
// Boot: catch up on time away, then tick every second
// ---------------------------------------------------------------------------
function boot() {
  const t = now();
  const awayFrom = Math.max(state.last, t - TIMING.awayCapHours * 3600);
  // replay from where we left off
  for (const c of Object.keys(CATS)) {
    const cs = state.cats[c];
    if (!cs.at && cs.nextAt < awayFrom) cs.nextAt = awayFrom;
  }
  const away = t - state.last;
  const log = simulate(t, away > 90);
  save();
  render();
  if (away > 90 && changed(log)) {
    const bits = [];
    if (log.visits.oyen) bits.push(`🧡 Oyen datang <b>${log.visits.oyen}</b> kali${log.makan ? ` dan habiskan makanan <b>${log.makan}</b> kali` : ''}.`);
    if (log.visits.abu) bits.push(`🩶 Abu singgah <b>${log.visits.abu}</b> kali.`);
    if (log.hadiah) bits.push(`🎁 Abu tinggalkan <b>${log.hadiah}</b> hadiah!`);
    openSheet('Semasa kau tiada...', `<div class="away">${bits.map((b) => `<p>${b}</p>`).join('')}</div>
      <button class="btn btn-primary" data-act="close">Jom tengok!</button>`);
  }
}

setInterval(() => {
  const log = simulate(now());
  if (changed(log)) {
    if (log.visits.oyen) play('meow');
    if (log.visits.abu) play('mew');
    save();
    render();
  }
}, 1000);

// save time stamp when leaving so "time away" is accurate
document.addEventListener('visibilitychange', () => document.hidden && save());

boot();
