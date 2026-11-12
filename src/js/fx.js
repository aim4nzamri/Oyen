// Comic effects drawn in the same style as the character art:
// round shapes, thick black outlines, flat colours.
const INK = '#1F1410';
const svg = (vb, body, cls = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" class="${cls}" aria-hidden="true" focusable="false">${body}</svg>`;

export const FX = {
  sparkle: (color = '#FFD23F') =>
    svg(
      '0 0 40 40',
      `<path d="M20 2 Q23 17 38 20 Q23 23 20 38 Q17 23 2 20 Q17 17 20 2 Z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
       <circle cx="15" cy="14" r="2" fill="#fff"/>`,
    ),
  heart: (color = '#FF6B8B') =>
    svg(
      '0 0 40 36',
      `<path d="M20 33 L6 19 C-1 11 6 0 15 5 L20 9 L25 5 C34 0 41 11 34 19 Z" fill="${color}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
       <ellipse cx="12" cy="12" rx="3.5" ry="2.2" fill="#fff" transform="rotate(-35 12 12)"/>`,
    ),
  sweat: () =>
    svg(
      '0 0 30 40',
      `<path d="M15 2 Q28 22 26 28 A11 11 0 0 1 4 28 Q2 22 15 2 Z" fill="#7CC8FF" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
       <ellipse cx="11" cy="27" rx="3" ry="5" fill="#fff" opacity=".9"/>`,
    ),
  anger: () =>
    svg(
      '0 0 40 40',
      `<g fill="none" stroke="${INK}" stroke-width="8" stroke-linecap="round">
         <path d="M8 15 Q15 15 15 8 M25 8 Q25 15 32 15 M32 25 Q25 25 25 32 M15 32 Q15 25 8 25"/></g>
       <g fill="none" stroke="#E53945" stroke-width="4.5" stroke-linecap="round">
         <path d="M8 15 Q15 15 15 8 M25 8 Q25 15 32 15 M32 25 Q25 25 25 32 M15 32 Q15 25 8 25"/></g>`,
    ),
  fish: () =>
    svg(
      '0 0 60 34',
      `<path d="M4 17 Q18 2 38 8 Q46 12 50 17 Q46 22 38 26 Q18 32 4 17 Z" fill="#E59A3A" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
       <path d="M48 17 L58 7 L55 17 L58 27 Z" fill="#C97B26" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
       <circle cx="12" cy="15" r="2.5" fill="${INK}"/>`,
    ),
};

/**
 * Scatter decorative effects inside a positioned container.
 * items: [{ type: 'sparkle', x: '10%', y: '20%', size: 28, delay: 0.3, color }]
 */
export function decorate(container, items) {
  const layer = document.createElement('div');
  layer.className = 'fx-layer';
  layer.setAttribute('aria-hidden', 'true');
  for (const it of items) {
    const span = document.createElement('span');
    span.className = `fx fx-${it.type}${it.className ? ' ' + it.className : ''}`;
    span.innerHTML = FX[it.type](it.color);
    span.style.left = it.x;
    span.style.top = it.y;
    span.style.width = `${it.size || 26}px`;
    if (it.delay) span.style.animationDelay = `${it.delay}s`;
    if (it.rotate) span.style.setProperty('--rot', `${it.rotate}deg`);
    layer.append(span);
  }
  container.append(layer);
  return layer;
}
