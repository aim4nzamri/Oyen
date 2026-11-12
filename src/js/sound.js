// Tiny synthesized sound effects (Web Audio API). No audio files needed.
// Sound state is saved per browser; the header toggle flips it.

const KEY = 'oyen.sound';
let ctx = null;
let enabled = (() => {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
})();

const listeners = new Set();

export const isSoundOn = () => enabled;

export function setSound(on) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? 'on' : 'off');
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn(on));
}

export function onSoundChange(fn) {
  listeners.add(fn);
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

/** One oscillator note with a quick attack/decay envelope and optional pitch glide. */
function tone({ freq, to = freq, dur = 0.12, type = 'square', vol = 0.12, delay = 0, filter = 0 }) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + delay;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(to, 1), t + dur);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = osc;
  if (filter) {
    const f = a.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filter;
    osc.connect(f);
    node = f;
  }
  node.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

function noise({ dur = 0.15, vol = 0.2, freq = 900, delay = 0 }) {
  const a = ac();
  if (!a) return;
  const t = a.currentTime + delay;
  const len = Math.floor(a.sampleRate * dur);
  const buf = a.createBuffer(1, len, a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = 'bandpass';
  f.frequency.value = freq;
  const g = a.createGain();
  g.gain.value = vol;
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}

const SFX = {
  click: () => tone({ freq: 520, to: 700, dur: 0.06, type: 'triangle', vol: 0.08 }),
  catch: () => {
    tone({ freq: 660, to: 990, dur: 0.09, type: 'square', vol: 0.06, filter: 2500 });
    tone({ freq: 990, to: 1320, dur: 0.08, type: 'square', vol: 0.05, delay: 0.06, filter: 2500 });
  },
  gold: () =>
    [784, 988, 1175, 1568].forEach((f, i) => tone({ freq: f, dur: 0.1, type: 'triangle', vol: 0.1, delay: i * 0.06 })),
  hit: () => {
    noise({ dur: 0.18, vol: 0.5, freq: 500 });
    tone({ freq: 220, to: 70, dur: 0.25, type: 'sawtooth', vol: 0.1, filter: 900 });
  },
  over: () =>
    [523, 440, 349, 262].forEach((f, i) =>
      tone({ freq: f, to: f * 0.97, dur: 0.22, type: 'triangle', vol: 0.12, delay: i * 0.18 }),
    ),
  record: () =>
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) =>
      tone({ freq: f, dur: 0.14, type: 'square', vol: 0.06, delay: i * 0.1, filter: 3000 }),
    ),
  like: () => {
    tone({ freq: 880, to: 1760, dur: 0.12, type: 'sine', vol: 0.12 });
    tone({ freq: 1320, dur: 0.1, type: 'sine', vol: 0.06, delay: 0.07 });
  },
  result: () =>
    [392, 523, 659, 784].forEach((f, i) => tone({ freq: f, dur: 0.18, type: 'triangle', vol: 0.11, delay: i * 0.11 })),
  // Abu's small, high "mew"
  mew: () => {
    tone({ freq: 900, to: 1300, dur: 0.12, type: 'triangle', vol: 0.12 });
    tone({ freq: 1300, to: 950, dur: 0.18, type: 'triangle', vol: 0.1, delay: 0.1 });
  },
  // A cartoon "meow": a nasal sawtooth gliding up then down.
  meow: () => {
    const a = ac();
    if (!a) return;
    const t = a.currentTime;
    const osc = a.createOscillator();
    const f = a.createBiquadFilter();
    const g = a.createGain();
    const base = 420 + Math.random() * 120;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(base, t);
    osc.frequency.linearRampToValueAtTime(base * 1.6, t + 0.12);
    osc.frequency.linearRampToValueAtTime(base * 0.9, t + 0.45);
    f.type = 'bandpass';
    f.Q.value = 3;
    f.frequency.setValueAtTime(900, t);
    f.frequency.linearRampToValueAtTime(1800, t + 0.15);
    f.frequency.linearRampToValueAtTime(700, t + 0.45);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.35, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
    osc.connect(f).connect(g).connect(a.destination);
    osc.start(t);
    osc.stop(t + 0.52);
  },
};

/** @param {keyof typeof SFX} name */
export function play(name) {
  if (!enabled) return;
  try {
    SFX[name]?.();
  } catch {
    /* audio is a nice-to-have */
  }
}
