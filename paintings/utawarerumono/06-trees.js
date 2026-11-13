// The firs close to us on the right, heavy with snow, and one small one on the left. They
// stand in the shade below; higher up the sun reaches the snow on the boughs that face it.
'use strict';
const { studio, open, nA } = require('./scene');
const { mix, smooth } = studio;

const p = open('trees');
const r = p.rng;
const darks = ['#0e1a24', '#14262e', '#101e2a', '#182c34', '#0c1620'];
const reach = (y) => smooth(720, 540, y);                               // how far the sun has come down: 1 high up, 0 near the ground

// A fir: tier on tier of boughs that hang outward, each with its needles under it and snow
// lying along it. The lowest tier is painted first, so each tier hangs over the one below.
function fir(x, base, h, spread = 0.2, step = 46) {
  const top = base - h, tiers = Math.max(5, Math.round(h / step));
  p.stroke({ brush: 'bristle', color: '#0b0f18', width: Math.max(8, h * 0.03), taper: [0, 0.9], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[x, base + 6], [x + 1, base - h * 0.5], [x, top + 10]] });
  for (let i = tiers - 1; i >= 0; i--) {
    const f = (i + 0.7) / tiers, y = top + h * f, wide = h * spread * (0.12 + 0.88 * Math.pow(f, 0.85));
    for (const s of [1, -1]) {
      const n = 2 + Math.round(wide / 70);
      for (let k = 0; k < n; k++) {
        const rr = wide * (k === 0 ? r.range(0.9, 1.08) : r.range(0.45, 0.85)), droop = rr * r.range(0.4, 0.62), y0 = y + r.range(-0.25, 0.25) * h / tiers;
        const at = (t) => [x + s * rr * t, y0 + droop * t * t - rr * 0.07 * Math.sin(t * Math.PI)];
        const bw = Math.max(7, Math.min(24, rr * 0.2));
        p.tryStroke({ brush: 'bristle', color: r.pick(darks), width: bw, taper: [0, 0.7], rag: 0.35, mix: 0, dry: 0, streak: 0.2, jitter: 0.4, points: [at(0), at(0.5), at(1)] });
        const m = Math.round(rr / 18);
        for (let j = 0; j < m; j++) {                                   // needles hanging from it
          const [nx, ny] = at((j + r()) / m), len = Math.max(13.5, bw * 1.3) * r.range(1, 1.5);
          p.tryStroke({ brush: 'bristle', color: r.pick(darks), width: Math.max(4.6, bw * 0.5), taper: [0, 0.8], rag: 0.3, mix: 0, dry: 0, streak: 0.15, jitter: 0.3, points: [[nx, ny - 2], [nx + s * len * 0.12, ny + len * 0.55], [nx + s * len * 0.25, ny + len]] });
        }
        // the snow lying along it: in the sun on the side that faces it and high enough, blue otherwise
        const sun = s < 0 ? reach(y0) * r.range(0.7, 1) : reach(y0) * 0.12;
        p.tryStroke({ brush: 'bristle', color: mix(mix('#7486c6', '#9cace0', r()), mix('#ffdcc8', '#fff6ea', r()), sun), width: Math.max(5, bw * 0.6), opacity: 0.96, taper: [0.15, 0.5], rag: 0.25, mix: 0.05, dry: 0, points: [at(0.1), at(0.5), at(0.92)].map(([px, py]) => [px, py - bw * 0.34]) });
      }
    }
  }
  p.tryStroke({ brush: 'bristle', color: mix('#9cace0', '#fff0e0', reach(top)), width: 7, taper: [0, 0.6], mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[x, top + 16], [x, top - 2]] });   // the snow on its tip
}

fir(1534, 1034, 640, 0.21);
fir(1392, 1018, 800, 0.2);
fir(1276, 994, 372, 0.22, 40);
fir(96, 958, 236, 0.24, 36);

// Snow heaped at their feet.
for (const [x, y, w] of [[1392, 1000, 220], [1276, 990, 120], [96, 956, 110], [1560, 1000, 160]]) {
  p.stroke({ brush: 'bristle', color: mix('#5464a8', '#6c7cc0', nA(x / 50, 3)), width: 26, opacity: 0.9, mix: 0.2, dry: 0.05, rag: 0.3, taper: [0.4, 0.4], points: [[x - w / 2, y + 8], [x, y - 6], [x + w / 2, y + 8]] });
}

p.save();
