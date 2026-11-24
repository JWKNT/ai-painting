// The sky over the stadium. The sun is behind us, so this is the deep part of the sky: blue
// high up, pale where it comes down to the roof of the stands. A few thin clouds are very high
// in it, and the wind has drawn them out into threads. The sun is on them from the right.
'use strict';
const { studio, open, W, rimLine, skyColor, nB, nC } = require('./scene');
const { mix, shift, clamp } = studio;

const p = open('sky');
const r = p.rng;
const inSky = (x, y) => y < rimLine(x) + 26;
const sky = (x, y) => skyColor(x, Math.min(y, 530));
const flow = (x, y) => -0.04 - (x - 800) / 7000 + 0.16 * (nB(x / 520, y / 240) - 0.5);        // nearly level: it rises a little toward the sides
const line = { brush: 'bristle', mix: 0.3, dry: 0.04, rag: 0.3, cap: 'round' };

// The body of it: wide strokes, then narrower ones over them.
p.fill({ inside: inSky, bounds: [0, 0, W, 560], width: 46, length: 330, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(sky(x, y), r.range(-2, 2), r.range(-0.02, 0.02), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.95 } });
p.fill({ inside: inSky, bounds: [0, 0, W, 560], width: 24, length: 240, spacing: 0.8, overlap: 0.7, angle: flow, color: (x, y) => shift(sky(x + r.range(-14, 14), y + r.range(-10, 10)), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.014, 0.016)), stroke: { ...line, opacity: 0.8 } });
p.fill({ inside: inSky, bounds: [0, 0, W, 560], width: 12, length: 180, spacing: 1.1, overlap: 0.75, angle: flow, color: (x, y) => shift(sky(x + r.range(-8, 8), y + r.range(-6, 6)), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.018, 0.02)), stroke: { ...line, opacity: 0.7, taper: [0.3, 0.3] } });
p.fill({ inside: inSky, bounds: [0, 0, W, 560], width: 7, length: 140, spacing: 1.5, overlap: 0.8, angle: flow, color: (x, y) => shift(sky(x + r.range(-6, 6), y + r.range(-4, 4)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.024, 0.028)), stroke: { ...line, mix: 0.2, opacity: 0.6, taper: [0.4, 0.4] } });

// The air near the roof of the stands is thick and pale.
for (let k = 0; k < 16; k++) {
  const x0 = r.range(-60, W - 300), len = r.range(320, 620), y = rimLine(x0 + len / 2) - r.range(-6, 46);
  p.stroke({ brush: 'soft', color: mix('#dce6f0', '#f4e8d0', clamp((x0 - 500) / 1100, 0, 1) * r()), width: r.range(36, 70), opacity: r.range(0.06, 0.12), points: [[x0, rimLine(x0) - (rimLine(x0 + len / 2) - y)], [x0 + len / 2, y], [x0 + len, rimLine(x0 + len) - (rimLine(x0 + len / 2) - y)]] });
}

// A high cloud that the wind has drawn out: a veil with no edge, and in it threads that start together, come apart and turn up at their ends.
function wisp(x0, y0, len, ang, n, o = {}) {
  const sc = o.scale || 1, bright = o.bright != null ? o.bright : 1, curl = o.curl != null ? o.curl : 0.5, wide = len * (o.wide || 0.1);
  const way = (t, off, wob = 0) => {                                      // a place on a thread: t along it, off to the side of its middle line
    const a = ang - curl * t * t, d = len * t, m = ang - curl * t * t / 3, spread = 0.2 + 0.8 * t;
    return [x0 + Math.cos(m) * d - Math.sin(a) * (off * spread + wob), y0 + Math.sin(m) * d + Math.cos(a) * (off * spread + wob)];
  };
  const thread = (t0, t1, off, k = 8, phase = r() * 6) => { const pts = []; for (let i = 0; i <= k; i++) { const t = t0 + (t1 - t0) * i / k; pts.push(way(t, off, Math.sin(t * 7 + phase) * 2.5 * sc)); } return pts; };
  for (let k = 0; k < Math.round(n * 0.8); k++) {                         // the veil
    const t0 = r.range(0, 0.4), pts = thread(t0, t0 + r.range(0.3, 0.6), r.range(-1, 1) * wide, 6);
    p.stroke({ brush: 'soft', color: mix('#e4eaf4', '#fff4e0', r()), width: r.range(18, 44) * sc, opacity: r.range(0.04, 0.09) * bright, points: pts });
  }
  for (let k = 0; k < n; k++) {                                           // the threads
    const t0 = r.range(0, 0.45), pts = thread(t0, t0 + r.range(0.3, 0.55), r.range(-1, 1) * wide), w = r.range(5, 12) * sc, m = pts[4];
    p.tryStroke({ ...line, mix: 0.3, rag: 0, color: mix(mix('#dfe8f4', '#fff4e0', r()), sky(m[0], m[1]), r.range(0.2, 0.55)), width: Math.max(4.8, w), opacity: r.range(0.22, 0.5) * bright, taper: [0.6, 0.75], points: pts });
  }
  for (let k = 0; k < Math.round(n * 0.35); k++) {                        // the sun on a few of them
    const t0 = r.range(0.05, 0.5), pts = thread(t0, t0 + r.range(0.2, 0.36), r.range(-0.8, 0.5) * wide, 6);
    p.tryStroke({ brush: 'soft', color: '#fff8ea', width: Math.max(8.4, r.range(8.4, 11) * sc), opacity: r.range(0.14, 0.3) * bright, points: pts });
  }
}
wisp(30, 214, 560, -0.1, 18, { scale: 1.1, curl: 0.55 });
wisp(230, 104, 400, -0.06, 11, { bright: 0.8, curl: 0.4 });
wisp(-80, 330, 430, -0.04, 9, { bright: 0.7, scale: 0.9, curl: 0.3 });
wisp(1000, 196, 600, -0.05, 18, { scale: 1.1, curl: 0.5 });
wisp(1230, 76, 400, -0.02, 10, { bright: 0.8, curl: 0.4 });
wisp(1150, 318, 460, -0.02, 9, { bright: 0.65, scale: 0.9, curl: 0.3 });
wisp(500, 40, 320, -0.02, 7, { bright: 0.6, scale: 0.8, curl: 0.35 });

p.save();
