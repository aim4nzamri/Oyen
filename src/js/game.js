import { mountNav } from './nav.js';
import { loadGameSprites } from './sprites.js';
import { play } from './sound.js';
import { confetti } from './nav.js';

mountNav();

// ---------- constants ----------
// Logical canvas width is fixed; the logical height follows the board's
// on-screen shape so the game fills tall phones and short laptops alike.
const W = 400;
let H = 600;
let FLOOR = H - 34;
const PLAYER_W = 92;
const PLAYER_H = (PLAYER_W * 228) / 200;
const PLAYER_SPEED = 430; // px/s for keyboard control
const START_LIVES = 3;
const HS_KEY = 'oyen.game.highscore';

const GAME_OVER_LINES = [
  { min: 0, text: 'Mak dah tangkap kau. Malu keturunan Oyen. 😿' },
  { min: 5, text: 'Boleh la... tapi kucing jiran lagi terer.' },
  { min: 15, text: 'Not bad! Mak pun tak perasan ikan hilang.' },
  { min: 30, text: 'Samseng dapur sejati. Ikan goreng tunduk pada kau. 😎' },
  { min: 50, text: 'LEGEND. Mak dah mula sorok ikan dalam peti besi.' },
  { min: 80, text: 'Ini bukan kucing. Ini sindiket. 🚨' },
];

const CATCH_LINES = ['Sedapnya!', 'Nyum!', 'Rezeki!', 'Mak tak nampak 🤫', 'Lagi!'];
const HIT_LINES = ['ADUH!', 'Selipar mak!', 'Sakit woi!', 'Kena!'];

// ---------- DOM ----------
const $ = (s) => document.querySelector(s);
const canvas = $('#game');
const ctx = canvas.getContext('2d');
const scoreEl = $('#score');
const livesEl = $('#lives');
const bestEl = $('#best');
const overlay = $('#overlay');

// ---------- storage ----------
function getBest() {
  try {
    return Number(localStorage.getItem(HS_KEY)) || 0;
  } catch {
    return 0;
  }
}
function setBest(v) {
  try {
    localStorage.setItem(HS_KEY, String(v));
  } catch {
    /* private mode etc. */
  }
}

// ---------- canvas sizing (crisp on high-DPI screens) ----------
function resize() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  H = Math.max(440, Math.min(780, Math.round((W * rect.height) / rect.width)));
  FLOOR = H - 34;
  canvas.width = Math.round(rect.width * dpr);
  canvas.height = Math.round(rect.height * dpr);
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  bg = null; // rebuild background at the new resolution
  if (state !== 'playing') draw();
}

// ---------- kitchen background (cached) ----------
let bg = null;
function buildBackground() {
  const off = document.createElement('canvas');
  off.width = canvas.width;
  off.height = canvas.height;
  const c = off.getContext('2d');
  c.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);

  // wall tiles
  c.fillStyle = '#FFF4E0';
  c.fillRect(0, 0, W, H);
  c.strokeStyle = '#F1DDBA';
  c.lineWidth = 2;
  for (let x = 0; x <= W; x += 40) {
    c.beginPath();
    c.moveTo(x, 0);
    c.lineTo(x, FLOOR - 70);
    c.stroke();
  }
  for (let y = 0; y <= FLOOR - 70; y += 40) {
    c.beginPath();
    c.moveTo(0, y);
    c.lineTo(W, y);
    c.stroke();
  }

  // window
  c.fillStyle = '#9BD6FF';
  c.strokeStyle = '#3B2314';
  c.lineWidth = 5;
  c.fillRect(250, 50, 120, 100);
  c.strokeRect(250, 50, 120, 100);
  c.beginPath();
  c.moveTo(310, 50);
  c.lineTo(310, 150);
  c.moveTo(250, 100);
  c.lineTo(370, 100);
  c.stroke();
  c.fillStyle = '#FFE066';
  c.beginPath();
  c.arc(345, 75, 12, 0, Math.PI * 2);
  c.fill();

  // shelf with pots
  c.fillStyle = '#8A5A3B';
  c.fillRect(24, 120, 170, 12);
  c.strokeRect(24, 120, 170, 12);
  const jar = (x, w, h, col) => {
    c.fillStyle = col;
    c.fillRect(x, 120 - h, w, h);
    c.strokeRect(x, 120 - h, w, h);
  };
  jar(36, 30, 40, '#FF8A1F');
  jar(76, 26, 30, '#7BC96F');
  jar(112, 34, 48, '#FF5C7A');
  jar(156, 26, 34, '#FFD23F');

  // "Dapur Mak" sign
  c.fillStyle = '#3B2314';
  c.font = "800 22px 'Baloo 2', sans-serif";
  c.textAlign = 'left';
  c.fillText('DAPUR MAK', 30, 190);
  c.font = "600 14px 'Baloo 2', sans-serif";
  c.fillText('(kucing dilarang masuk)', 30, 208);

  // counter + floor
  c.fillStyle = '#C98B5A';
  c.fillRect(0, FLOOR - 70, W, 70);
  c.fillStyle = '#B07447';
  for (let x = 0; x < W; x += 80) c.fillRect(x + 6, FLOOR - 62, 68, 54);
  c.fillStyle = '#8A5A3B';
  c.fillRect(0, FLOOR, W, H - FLOOR);
  c.beginPath();
  c.moveTo(0, FLOOR - 70);
  c.lineTo(W, FLOOR - 70);
  c.moveTo(0, FLOOR);
  c.lineTo(W, FLOOR);
  c.stroke();
  return off;
}

// ---------- game state ----------
let sprites = null;
let state = 'loading'; // loading | ready | playing | paused | over
let player;
let items;
let popups;
let score;
let lives;
let elapsed;
let spawnIn;
let hurtFor;
let eatFor;
let shake;
let best = getBest();
const keys = { left: false, right: false };
let pointerX = null;

function reset() {
  player = { x: W / 2 };
  items = [];
  popups = [];
  score = 0;
  lives = START_LIVES;
  elapsed = 0;
  spawnIn = 0.6;
  hurtFor = 0;
  eatFor = 0;
  shake = 0;
  updateHud();
}

function updateHud() {
  scoreEl.textContent = score;
  livesEl.textContent = '🧡'.repeat(Math.max(lives, 0)) + '🖤'.repeat(START_LIVES - Math.max(lives, 0));
  livesEl.setAttribute('aria-label', `${lives} nyawa`);
  bestEl.textContent = best;
}

// Difficulty ramps up over about 90 seconds.
function difficulty() {
  return Math.min(elapsed / 90, 1);
}

function spawn() {
  const d = difficulty();
  const r = Math.random();
  const seliparChance = 0.22 + d * 0.25;
  let type = 'fish';
  if (r < seliparChance) type = 'selipar';
  else if (r < seliparChance + 0.06) type = 'gold';
  const size = type === 'selipar' ? 34 : 46;
  items.push({
    type,
    x: 24 + Math.random() * (W - 48),
    y: -40,
    vy: (150 + d * 200) * (0.85 + Math.random() * 0.35) * (type === 'gold' ? 1.25 : 1),
    vx: type === 'selipar' ? (Math.random() - 0.5) * 60 * (1 + d) : 0,
    rot: Math.random() * Math.PI,
    spin: type === 'selipar' ? (Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 5) : 0,
    size,
    t: Math.random() * 10,
  });
}

function popup(text, x, y, color) {
  popups.push({ text, x, y, color, life: 0.9 });
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ---------- update ----------
function update(dt) {
  elapsed += dt;

  // movement: keyboard or pointer
  if (pointerX !== null) {
    player.x += (pointerX - player.x) * Math.min(1, dt * 18);
  } else {
    const dir = (keys.right ? 1 : 0) - (keys.left ? 1 : 0);
    player.x += dir * PLAYER_SPEED * dt;
  }
  player.x = Math.max(PLAYER_W / 2 - 8, Math.min(W - PLAYER_W / 2 + 8, player.x));

  // spawning
  spawnIn -= dt;
  if (spawnIn <= 0) {
    spawn();
    const d = difficulty();
    spawnIn = (0.95 - d * 0.55) * (0.7 + Math.random() * 0.6);
  }

  // catch box around Oyen's head/mouth
  const top = FLOOR - PLAYER_H;
  const box = { l: player.x - 36, r: player.x + 36, t: top + 18, b: top + 120 };

  for (const it of items) {
    it.t += dt;
    it.y += it.vy * dt;
    it.x += it.vx * dt;
    if (it.x < 18 || it.x > W - 18) it.vx *= -1;
    it.rot += it.spin * dt;

    const half = it.size * 0.42;
    const hit = it.x + half > box.l && it.x - half < box.r && it.y + half > box.t && it.y - half < box.b;
    if (hit) {
      it.dead = true;
      if (it.type === 'selipar') {
        if (hurtFor <= 0) {
          lives -= 1;
          hurtFor = 1.1;
          shake = 0.3;
          popup(pick(HIT_LINES), it.x, it.y - 20, '#D7263D');
          play('hit');
          navigator.vibrate?.(120);
          if (lives <= 0) {
            updateHud();
            return gameOver();
          }
        }
      } else {
        const pts = it.type === 'gold' ? 5 : 1;
        score += pts;
        eatFor = 0.35;
        play(pts > 1 ? 'gold' : 'catch');
        popup(pts > 1 ? '+5 IKAN EMAS!' : `+1 ${pick(CATCH_LINES)}`, it.x, it.y - 20, pts > 1 ? '#C99700' : '#3B2314');
      }
      updateHud();
    } else if (it.y - it.size > H) {
      it.dead = true;
    }
  }
  items = items.filter((i) => !i.dead);

  for (const p of popups) {
    p.life -= dt;
    p.y -= 40 * dt;
  }
  popups = popups.filter((p) => p.life > 0);

  hurtFor = Math.max(0, hurtFor - dt);
  eatFor = Math.max(0, eatFor - dt);
  shake = Math.max(0, shake - dt);
}

// ---------- draw ----------
function draw() {
  ctx.save();
  if (shake > 0) ctx.translate((Math.random() - 0.5) * 10 * shake * 3, (Math.random() - 0.5) * 10 * shake * 3);
  if (!bg) bg = buildBackground();
  ctx.drawImage(bg, 0, 0, W, H);
  if (!sprites || !player) {
    ctx.restore();
    return;
  }

  // items
  for (const it of items) {
    ctx.save();
    ctx.translate(it.x, it.y);
    if (it.type === 'selipar') {
      ctx.rotate(it.rot);
      const h = it.size * 1.8;
      ctx.drawImage(sprites.selipar, -it.size / 2, -h / 2, it.size, h);
    } else {
      ctx.rotate(Math.sin(it.t * 6) * 0.25 + Math.PI / 2);
      const w = it.size * 1.6;
      const h = (w * 60) / 110;
      if (it.type === 'gold') {
        ctx.shadowColor = '#FFD23F';
        ctx.shadowBlur = 18;
      }
      ctx.drawImage(it.type === 'gold' ? sprites.goldFish : sprites.fish, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
  }

  // player (blink while invulnerable)
  const blink = hurtFor > 0 && Math.floor(hurtFor * 12) % 2 === 0;
  if (!blink) {
    const img = hurtFor > 0 ? sprites.oyenHit : eatFor > 0 ? sprites.oyenEat : sprites.oyen;
    const squash = eatFor > 0 ? 1 + Math.sin((eatFor / 0.35) * Math.PI) * 0.06 : 1;
    // keep each picture's own shape, fitted to the player's height
    const h = (PLAYER_H * 1.05) / squash;
    const w = Math.min(h * (img.width / img.height), PLAYER_W * 1.35) * squash;
    ctx.drawImage(img, player.x - w / 2, FLOOR - h + 6, w, h);
  }

  // popups
  ctx.textAlign = 'center';
  ctx.font = "800 20px 'Baloo 2', sans-serif";
  for (const p of popups) {
    ctx.globalAlpha = Math.min(1, p.life * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#FFF4E0';
    ctx.strokeText(p.text, p.x, p.y);
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ---------- loop ----------
let last = 0;
let rafId = 0;
function frame(now) {
  if (state !== 'playing') return;
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(dt);
  draw();
  if (state === 'playing') rafId = requestAnimationFrame(frame);
}

function runLoop() {
  cancelAnimationFrame(rafId);
  last = performance.now();
  rafId = requestAnimationFrame(frame);
}

function start() {
  if (state === 'playing' || state === 'loading') return;
  reset();
  hideOverlay();
  state = 'playing';
  canvas.focus({ preventScroll: true });
  runLoop();
}

function pause() {
  if (state !== 'playing') return;
  state = 'paused';
  showOverlay(`
    <h2>Rehat kejap</h2>
    <p>Oyen tengah jilat tangan. Sambung?</p>
    <button class="btn btn-primary" data-act="resume">Sambung ▶</button>`);
}

function resume() {
  if (state !== 'paused') return;
  hideOverlay();
  state = 'playing';
  runLoop();
}

function gameOver() {
  state = 'over';
  draw();
  const isRecord = score > best;
  if (isRecord && score > 0) {
    play('record');
    confetti(['🐟', '🧡', '🏆', '✨']);
  } else {
    play('over');
  }
  if (isRecord) {
    best = score;
    setBest(best);
    updateHud();
  }
  const line = [...GAME_OVER_LINES].reverse().find((l) => score >= l.min).text;
  showOverlay(`
    <div class="overlay-mascot"><img src="./characters/${score >= 30 ? 'oyen_face_happy' : 'oyen_face_marah'}.webp" alt="" /></div>
    <h2>Game Over!</h2>
    <p class="final-score">${score} ikan goreng</p>
    ${isRecord && score > 0 ? '<p class="record">🏆 REKOD BARU!</p>' : `<p>Rekod kau: <b>${best}</b></p>`}
    <p class="over-line">${line}</p>
    <div class="overlay-actions">
      <button class="btn btn-primary" data-act="start">Main lagi 🔁</button>
      <a class="btn btn-whatsapp" target="_blank" rel="noopener" href="https://wa.me/?text=${encodeURIComponent(
        `Aku dapat selamatkan ${score} ikan goreng dari dapur mak! 🐟😼 Boleh lawan? ${location.origin + location.pathname}`,
      )}">Cabar kawan 💬</a>
    </div>`);
}

// ---------- overlay ----------
function syncPauseBtn() {
  const paused = state === 'paused';
  pauseBtn.classList.toggle('is-paused', paused);
  pauseBtn.setAttribute('aria-label', paused ? 'Sambung' : 'Pause');
  pauseBtn.disabled = state !== 'playing' && state !== 'paused';
}

function showOverlay(html) {
  overlay.innerHTML = `<div class="overlay-box">${html}</div>`;
  overlay.hidden = false;
  syncPauseBtn();
  overlay.querySelector('button')?.focus({ preventScroll: true });
}
function hideOverlay() {
  overlay.hidden = true;
  queueMicrotask(syncPauseBtn);
}

overlay.addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'start') start();
  if (act === 'resume') resume();
});

// ---------- input ----------
const KEYMAP = { ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' };
window.addEventListener('keydown', (e) => {
  if (KEYMAP[e.key]) {
    keys[KEYMAP[e.key]] = true;
    pointerX = null;
    if (state === 'playing') e.preventDefault();
  } else if ((e.key === ' ' || e.key === 'Enter') && (state === 'ready' || state === 'over') && !overlay.hidden) {
    if (document.activeElement?.tagName !== 'A') {
      e.preventDefault();
      start();
    }
  } else if ((e.key === 'p' || e.key === 'P' || e.key === 'Escape') && state === 'playing') {
    pause();
  } else if ((e.key === 'p' || e.key === 'P') && state === 'paused') {
    resume();
  }
});
window.addEventListener('keyup', (e) => {
  if (KEYMAP[e.key]) keys[KEYMAP[e.key]] = false;
});

function toLogicalX(clientX) {
  const rect = canvas.getBoundingClientRect();
  return ((clientX - rect.left) / rect.width) * W;
}
canvas.addEventListener('pointerdown', (e) => {
  pointerX = toLogicalX(e.clientX);
  canvas.setPointerCapture?.(e.pointerId);
});
canvas.addEventListener('pointermove', (e) => {
  // Mouse: follow on hover. Touch/pen: follow while finger is down.
  if (e.pointerType === 'mouse' || e.buttons || e.pressure > 0) pointerX = toLogicalX(e.clientX);
});

const pauseBtn = $('#pause');
pauseBtn.addEventListener('click', () => (state === 'playing' ? pause() : resume()));
document.addEventListener('visibilitychange', () => document.hidden && pause());
window.addEventListener('resize', resize);

// ---------- boot ----------
(async () => {
  reset();
  resize();
  try {
    await document.fonts?.load("800 22px 'Baloo 2'");
  } catch {
    /* ignore */
  }
  sprites = await loadGameSprites();
  bg = null;
  draw();
  state = 'ready';
  showOverlay(`
    <div class="overlay-mascot"><img src="./characters/oyen_pose_gremlin.webp" alt="" /></div>
    <h2>Selamatkan Ikan Goreng!</h2>
    <p>Mak tengah goreng ikan. Tangkap seberapa banyak boleh, tapi <b>elak selipar mak</b>!</p>
    <ul class="howto">
      <li>🐟 Ikan goreng = +1</li>
      <li>✨ Ikan emas = +5</li>
      <li>🩴 Selipar = hilang 1 nyawa</li>
    </ul>
    <p class="controls-hint">📱 Seret jari kiri-kanan &nbsp;·&nbsp; ⌨️ ← → atau A / D</p>
    <button class="btn btn-primary" data-act="start">Mula! 🐾</button>`);
})();
