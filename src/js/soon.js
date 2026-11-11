import { mountNav } from './nav.js';
import { mascotSVG } from './mascot.js';

mountNav();
document.querySelectorAll('[data-mascot]').forEach((el) => {
  el.innerHTML = mascotSVG({ mood: el.dataset.mascot });
});
