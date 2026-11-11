import { mountNav } from './nav.js';
import { mascotSVG } from './mascot.js';
import { play } from './sound.js';
import { DONATION, CATEGORIES, PRODUCTS } from './kedaiData.js';

mountNav();

const root = document.getElementById('kedai');
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const safeUrl = (u) => (typeof u === 'string' && /^https:\/\//i.test(u.trim()) ? u.trim() : '');
const safeAsset = (p) =>
  typeof p === 'string' && /^[\w\-./]+$/.test(p) && !p.includes('..') ? `./${p.replace(/^\.?\//, '')}` : '';

let filter = 'semua';

// ---------- sections ----------
function hero() {
  return `
    <section class="kedai-hero">
      <div class="kedai-hero-pic">${mascotSVG({ mood: 'pencuri', label: 'Oyen jaga kedai' })}</div>
      <div>
        <h1>Kedai Oyen 🛍️</h1>
        <p>Barang pilihan Oyen. Semua dah dia "test" sendiri. Sebahagiannya dia curi.</p>
        <nav class="jump" aria-label="Bahagian kedai">
          <a href="#belanja">🐟 Belanja Oyen</a>
          <a href="#barang">🛒 Barang Wajib</a>
          <a href="#merch">👕 Merch</a>
        </nav>
      </div>
    </section>`;
}

function belanja() {
  const qr = safeAsset(DONATION.qrImage);
  const links = (DONATION.links || []).filter((l) => safeUrl(l.url));
  return `
    <section class="belanja card" id="belanja" aria-labelledby="belanja-title">
      <div class="belanja-head">
        <div class="belanja-pic">${mascotSVG({ mood: 'manja', label: '' })}</div>
        <div>
          <h2 id="belanja-title">Belanja Oyen Ikan 🐟</h2>
          <p>Suka Oyen? Sokongan kau bantu Oyen terus hidup: bayar domain, buat game baru dan video Oyen yang lagi mengarut.</p>
        </div>
      </div>

      <ul class="tiers">
        ${(DONATION.tiers || [])
          .map(
            (t) => `<li><span class="tier-emoji" aria-hidden="true">${esc(t.emoji)}</span>
              <b>${esc(t.amount)}</b><span>${esc(t.label)}</span></li>`,
          )
          .join('')}
      </ul>

      ${
        qr
          ? `<div class="qr-wrap">
        <div class="qr-box">
          <img src="${esc(qr)}" alt="QR DuitNow untuk belanja Oyen" width="220" height="220" id="qr-img" />
          <div class="qr-missing" hidden>QR DuitNow<br/>akan datang 🐾</div>
        </div>
        <div class="qr-steps">
          <h3>Cara belanja guna DuitNow QR</h3>
          <ol>
            <li><b>Kat phone?</b> Tekan "Simpan QR" dulu.</li>
            <li>Buka app bank / e-wallet → <b>Scan</b> → pilih gambar QR dari galeri.</li>
            <li>Masukkan jumlah ikan yang kau nak belanja. Siap! 🧡</li>
          </ol>
          ${DONATION.qrName ? `<p class="qr-name">Nama penerima: <b>${esc(DONATION.qrName)}</b></p>` : ''}
          ${DONATION.qrNote ? `<p class="qr-name fineprint">${esc(DONATION.qrNote)}</p>` : ''}
          <a class="btn btn-primary" id="qr-save" href="${esc(qr)}" download="belanja-oyen-duitnow.png">Simpan QR 📥</a>
        </div>
      </div>`
          : ''
      }

      ${
        links.length
          ? `<div class="belanja-links">${links
              .map(
                (l) =>
                  `<a class="btn" href="${esc(safeUrl(l.url))}" target="_blank" rel="noopener">${esc(l.icon)} ${esc(l.label)}</a>`,
              )
              .join('')}</div>`
          : ''
      }
      <p class="fineprint">Belanja ni sumbangan sukarela, bukan pembelian. Terima kasih, geng! 🧡</p>
    </section>`;
}

function productCard(p) {
  const url = safeUrl(p.url);
  const img = safeAsset(p.image);
  const cat = CATEGORIES.find((c) => c.id === p.category);
  const fish = Math.max(0, Math.min(10, Number(p.rating) || 0));
  return `
    <li class="product" data-cat="${esc(p.category)}">
      <div class="product-pic">${
        img ? `<img src="${esc(img)}" alt="" loading="lazy" />` : `<span aria-hidden="true">${esc(p.emoji)}</span>`
      }</div>
      <div class="product-info">
        ${cat ? `<span class="chip">${esc(cat.emoji)} ${esc(cat.label)}</span>` : ''}
        <h3>${esc(p.name)}</h3>
        <p class="review">“${esc(p.review)}”<span> — Oyen</span></p>
        <p class="rating" aria-label="Rating Oyen ${fish} daripada 10">Rating Oyen: <b>${fish}/10</b> 🐟</p>
        ${
          url
            ? `<a class="btn btn-primary" href="${esc(url)}" target="_blank" rel="sponsored noopener">Tengok di Shopee ↗</a>`
            : `<button class="btn" disabled>Link akan datang</button>`
        }
      </div>
    </li>`;
}

function barang() {
  const list = filter === 'semua' ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);
  return `
    <section class="barang" id="barang" aria-labelledby="barang-title">
      <h2 id="barang-title">Barang Wajib Oyen 🛒</h2>
      <p>Oyen dah review. Jujur. Sebab dia tak reti tipu (dia reti curi je).</p>
      <div class="filters" role="group" aria-label="Tapis kategori">
        <button data-filter="semua" aria-pressed="${filter === 'semua'}">Semua</button>
        ${CATEGORIES.map(
          (c) =>
            `<button data-filter="${esc(c.id)}" aria-pressed="${filter === c.id}">${esc(c.emoji)} ${esc(c.label)}</button>`,
        ).join('')}
      </div>
      <ul class="products">${list.map(productCard).join('')}</ul>
      <p class="fineprint disclosure">ℹ️ Sesetengah link di sini ialah link affiliate. Kalau kau beli melaluinya, Oyen dapat komisen kecil, <b>tanpa sebarang kos tambahan</b> pada kau. Harga & stok ikut kedai masing-masing.</p>
    </section>`;
}

// Original t-shirt and sticker mockups with the mascot inside.
function merch() {
  const inner = (mood) => mascotSVG({ mood, label: '' }).replace('<svg ', '<svg x="62" y="70" width="96" height="110" ');
  const tee = `<svg viewBox="0 0 220 220" class="tee" aria-hidden="true">
    <path d="M70 20 L40 32 L8 72 L38 94 L50 80 L50 206 L170 206 L170 80 L182 94 L212 72 L180 32 L150 20 Q140 44 110 44 Q80 44 70 20 Z"
      fill="#3B2314" stroke="#3B2314" stroke-width="5" stroke-linejoin="round"/>
    ${inner('samseng')}
    <text x="110" y="196" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="10.5" fill="#FFD23F">SAMSENG KAWASAN</text>
  </svg>`;
  const sticker = `<svg viewBox="0 0 220 220" class="sticker" aria-hidden="true">
    <circle cx="110" cy="110" r="96" fill="#fff" stroke="#3B2314" stroke-width="5"/>
    <circle cx="110" cy="110" r="84" fill="#FF8A1F"/>
    ${mascotSVG({ mood: 'otak', label: '' }).replace('<svg ', '<svg x="50" y="34" width="120" height="138" ')}
    <text x="110" y="190" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="15" fill="#3B2314">1 SEL OTAK</text>
  </svg>`;
  return `
    <section class="merch card" id="merch" aria-labelledby="merch-title">
      <span class="soon-badge">AKAN DATANG</span>
      <h2 id="merch-title">Merch Oyen 👕</h2>
      <p>T-shirt "Samseng Kawasan", sticker "1 Sel Otak", tote bag dan banyak lagi. Oyen tengah berunding dengan kilang (dia ugut).</p>
      <div class="merch-row">${tee}${sticker}</div>
    </section>`;
}

function render() {
  root.innerHTML = hero() + belanja() + barang() + merch();
  const img = root.querySelector('#qr-img');
  img?.addEventListener('error', () => {
    img.hidden = true;
    root.querySelector('.qr-missing').hidden = false;
    root.querySelector('#qr-save')?.remove();
  });
}

root.addEventListener('click', (e) => {
  const f = e.target.closest('[data-filter]');
  if (f) {
    filter = f.dataset.filter;
    const section = root.querySelector('#barang');
    section.outerHTML = barang();
    play('click');
  }
});

render();
