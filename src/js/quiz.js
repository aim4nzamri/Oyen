import { mountNav, confetti } from './nav.js';
import { play } from './sound.js';
import { mascotSVG } from './mascot.js';
import { QUESTIONS, RESULTS } from './quizData.js';
import { drawResultCard } from './card.js';

mountNav();

const root = document.getElementById('quiz');
const KEYS = ['A', 'B', 'C', 'D', 'E'];
let answers = [];

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function siteUrl() {
  return location.origin + location.pathname;
}

// ---------- screens ----------
function renderIntro() {
  answers = [];
  root.innerHTML = `
    <section class="quiz-intro card slide-in">
      <img class="quiz-hero" src="./characters/oyen.webp" width="560" height="680" alt="Oyen tengah menilai kau" />
      <h1>Oyen Kau Jenis Apa?</h1>
      <p>Semua kucing oren kongsi satu sel otak, tapi perangai lain-lain. Jawab ${QUESTIONS.length} soalan ni dengan jujur. Oyen tengah tengok.</p>
      <button class="btn btn-primary" id="start">Jom mula! 🐾</button>
    </section>`;
  root.querySelector('#start').addEventListener('click', () => renderQuestion(0));
}

function renderQuestion(i) {
  const q = QUESTIONS[i];
  const pct = Math.round((i / QUESTIONS.length) * 100);
  root.innerHTML = `
    <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="${QUESTIONS.length}" aria-valuenow="${i}" aria-label="Kemajuan kuiz">
      <div class="progress-bar" style="width:${pct}%"></div>
    </div>
    <section class="card slide-in">
      <div class="q-count">Soalan ${i + 1} / ${QUESTIONS.length}</div>
      <h1 class="q-text">${esc(q.q)}</h1>
      <div class="options">
        ${q.options
          .map(
            (o, j) =>
              `<button class="option" data-j="${j}"><span class="option-key">${KEYS[j]}</span><span>${esc(o.text)}</span></button>`,
          )
          .join('')}
      </div>
      ${i > 0 ? '<p><button class="btn" id="back" style="margin-top:14px">← Soalan sebelum</button></p>' : ''}
    </section>`;

  root.querySelectorAll('.option').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (root.dataset.locked) return;
      root.dataset.locked = '1';
      btn.classList.add('is-picked');
      answers[i] = Number(btn.dataset.j);
      setTimeout(() => {
        delete root.dataset.locked;
        if (i + 1 < QUESTIONS.length) renderQuestion(i + 1);
        else renderResult(computeResult());
      }, 220);
    }),
  );
  root.querySelector('#back')?.addEventListener('click', () => renderQuestion(i - 1));
  window.scrollTo({ top: 0 });
}

// ---------- scoring ----------
function computeResult() {
  const score = Object.fromEntries(Object.keys(RESULTS).map((k) => [k, 0]));
  answers.forEach((j, i) => {
    for (const [type, n] of Object.entries(QUESTIONS[i].options[j].pts)) score[type] += n;
  });
  const max = Math.max(...Object.values(score));
  const tied = Object.keys(score).filter((k) => score[k] === max);

  // Tie-break: the most recent answer that pointed to one of the tied types wins.
  let winner = tied[0];
  for (let i = answers.length - 1; i >= 0; i--) {
    const hit = Object.keys(QUESTIONS[i].options[answers[i]].pts).find((t) => tied.includes(t));
    if (hit) {
      winner = hit;
      break;
    }
  }

  const r = RESULTS[winner];
  // Deterministic "power level" so the same answers give the same number.
  const seed = answers.reduce((acc, j, i) => acc + (j + 1) * (i + 7) * 13, 0);
  const power = r.powerLabel ?? (r.basePower + max * 111 + (seed % 100)).toLocaleString('en-MY');
  return { key: winner, ...r, power };
}

// ---------- result ----------
function renderResult(r) {
  root.innerHTML = `
    <section class="result slide-in">
      <p class="result-kicker">Keputusan rasmi makmal Oyen:</p>
      <div class="result-card" id="result-card">
        <div class="result-inner">
          ${mascotSVG({ mood: r.mood, label: r.title })}
          <h1 class="result-title">${esc(r.title)}</h1>
          <p class="result-quote">${esc(r.quote)}</p>
          <div class="power">⚡ Power Level: ${esc(r.power)}</div>
          <p class="result-desc">${esc(r.desc)}</p>
          <div class="stats">
            ${Object.entries(r.stats)
              .map(
                ([k, v]) => `
              <div class="stat">
                <span>${esc(k)}</span>
                <span class="stat-track"><span class="stat-fill" data-w="${v}"></span></span>
                <span class="stat-val">${v}</span>
              </div>`,
              )
              .join('')}
          </div>
          <div class="result-brand">🧡 Oyen — kawasan kucing oren</div>
        </div>
      </div>
      <div class="result-actions">
        <a class="btn btn-whatsapp" id="wa" target="_blank" rel="noopener">Share ke WhatsApp 💬</a>
        <button class="btn btn-primary" id="dl">Download kad (gambar) 📸</button>
        <button class="btn" id="again">Main lagi 🔁</button>
      </div>
    </section>`;

  play('result');
  confetti();

  // Animate stat bars after paint.
  requestAnimationFrame(() =>
    requestAnimationFrame(() =>
      root.querySelectorAll('.stat-fill').forEach((el) => (el.style.width = `${el.dataset.w}%`)),
    ),
  );

  const text = `Oyen aku jenis "${r.title}"! ⚡ Power level: ${r.power} 😹\nOyen kau jenis apa? Cuba sini:`;
  root.querySelector('#wa').href = `https://wa.me/?text=${encodeURIComponent(`${text} ${siteUrl()}`)}`;

  const dl = root.querySelector('#dl');
  dl.addEventListener('click', async () => {
    const label = dl.textContent;
    dl.disabled = true;
    dl.textContent = 'Oyen tengah lukis... 🎨';
    try {
      const host = location.host + location.pathname.replace(/\/[^/]*$/, '');
      const canvas = await drawResultCard(r, host || 'Oyen');
      const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `oyen-${r.key}.png`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (err) {
      console.error(err);
      alert('Alamak, Oyen terlanggar berus. Cuba lagi sekali.');
    } finally {
      dl.disabled = false;
      dl.textContent = label;
    }
  });

  root.querySelector('#again').addEventListener('click', renderIntro);
  window.scrollTo({ top: 0 });
}

renderIntro();
