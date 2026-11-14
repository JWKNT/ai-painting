// The shaft. Its wall is plates of steel, and every stroke on it runs to the bright place,
// so that the wall seems to go by us. Over the plates lies a net of six-sided lines of pale
// blue light, small far down and great near us. Rings of darker steel go round the shaft,
// each with the light of the bright place on its inner edge. Thin streams of light run up
// the wall. Far down is the bright place itself.
'use strict';
const { studio, open, W, H, VP, polar, toVP, RINGS, hash, core, wall } = require('./scene');
const { mix, clamp, smooth, glow } = studio;

const p = open('shaft');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.2, cap: 'flat' };
const ringOf = (lo, hi) => (x, y) => { const q = polar(x, y).r; return q >= lo && q < hi; };

// The plates of the wall: short strokes far down, long ones near us.
for (const [lo, hi, w, len] of [[0, 190, 5.5, 30], [170, 420, 8, 70], [400, 780, 12, 130], [760, 1400, 18, 220]]) {
  p.fill({ inside: ringOf(lo, hi), bounds: [0, 0, W, H], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: toVP, color: wall, stroke: { ...line, opacity: 0.96 } });
}
p.fill({ bounds: [0, 0, W, H], width: 6, length: 60, spacing: 1.1, overlap: 0.7, angle: toVP, color: (x, y) => wall(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { ...line, opacity: 0.8 } });

// The net of six-sided lines. In the angle about the point and the logarithm of the distance from it, the net is regular; in the
// picture each mesh is so much greater as it is nearer to us.
{
  const h = Math.PI * 2 / 24, at = (th, u) => { const q = 20 * Math.exp(u); return [VP.x + Math.cos(th) * q, VP.y + Math.sin(th) * q]; };
  for (let i = 0; i < 16; i++) for (let j = 0; j < 12; j++) {
    const tc = 1.5 * h * i, uc = Math.sqrt(3) * h * (j + 0.5 * (i % 2)) + 0.9, v = (k) => [tc + h * Math.cos(k * Math.PI / 3), uc + h * Math.sin(k * Math.PI / 3)];
    for (const k of [0, 1, 2]) {
      const a = at(...v(k)), b = at(...v(k + 1)), mid = polar((a[0] + b[0]) / 2, (a[1] + b[1]) / 2).r, len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 13 || mid > 1500 || (Math.max(a[0], b[0]) < -20 || Math.min(a[0], b[0]) > W + 20 || Math.max(a[1], b[1]) < -20 || Math.min(a[1], b[1]) > H + 20)) continue;
      const w = clamp(len * 0.06, 4, 9), bright = 0.3 + 0.7 * hash(i * 3 + k, j);
      if (w >= 6) p.tryStroke({ brush: 'soft', color: '#3ca8ff', width: Math.max(8.4, w * 2.4), opacity: 0.12 * bright, points: [a, b] });
      p.tryStroke({ brush: w < 4.8 ? 'round' : 'bristle', color: mix('#3c9cf0', '#c4f0ff', bright * core(mid, 500) + 0.2 * bright), width: w, opacity: (0.22 + 0.4 * bright) * smooth(1500, 700, mid), cap: 'round', points: [a, b] });
    }
  }
}

// The rings of the shaft: each a band of dark steel that goes all the way round, with bolts on it and light along its inner edge.
for (const q of RINGS) {
  const w = clamp(q * 0.085, 6, 60), n = Math.max(10, Math.round(q * 0.11));
  for (let i = 0; i < n; i++) {
    const a0 = i / n * Math.PI * 2, a1 = a0 + Math.PI * 2 / n * 1.04, pts = studio.arc(VP.x, VP.y, q, a0, a1, 6);
    if (pts.every(([x, y]) => x < -60 || x > W + 60 || y < -60 || y > H + 60)) continue;
    p.tryStroke({ ...line, cap: 'round', color: mix(mix('#080c14', '#1a2434', hash(i, q)), '#4c88c0', core(q, 300) * 0.5), width: w, opacity: 0.97, points: pts });
  }
  for (let i = 0; i < n; i++) {                                           // the light of the bright place on its inner edge, and the dark behind its outer one
    const a0 = i / n * Math.PI * 2, a1 = a0 + Math.PI * 2 / n * 0.86;
    p.tryStroke({ brush: 'round', color: mix('#6cc8ff', '#f0fbff', core(q, 400)), width: clamp(w * 0.16, 4, 8), opacity: 0.5 + 0.4 * core(q, 600), points: studio.arc(VP.x, VP.y, q - w * 0.42, a0, a1, 6) });
    p.tryStroke({ brush: 'round', color: '#03050a', width: clamp(w * 0.2, 4, 10), opacity: 0.6, points: studio.arc(VP.x, VP.y, q + w * 0.56, a0, a1, 6) });
  }
  if (q > 150) for (let i = 0; i < n * 2; i++) {                           // bolts
    const a = i / (n * 2) * Math.PI * 2 + 0.05, x = VP.x + Math.cos(a) * q, y = VP.y + Math.sin(a) * q, l = Math.max(12.4, w * 0.5);
    if (x > -20 && x < W + 20 && y > -20 && y < H + 20) p.tryStroke({ brush: 'round', color: hash(i, q) > 0.9 ? '#ff9a2c' : '#3c4c64', width: clamp(w * 0.2, 4, 9), opacity: 0.9, points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] });
  }
}

// Streams of light that run up the wall from the bright place.
for (let k = 0; k < 46; k++) {
  const a = r.range(0, Math.PI * 2), r0 = r.range(30, 500), len = r0 * r.range(0.25, 0.7), w = clamp(r0 * 0.012, 4, 8);
  p.tryStroke({ brush: 'round', color: mix('#58c8ff', '#eaffff', r()), width: w, opacity: r.range(0.35, 0.8), taper: [0.5, 0.5], points: [[VP.x + Math.cos(a) * r0, VP.y + Math.sin(a) * r0], [VP.x + Math.cos(a) * (r0 + len), VP.y + Math.sin(a) * (r0 + len)]] });
}

// The bright place: a light with no edge, and its beams.
for (const [w, op, n] of [[300, 0.09, 4], [170, 0.14, 5], [90, 0.26, 6], [44, 0.5, 6]]) glow(p, VP.x, VP.y, w, mix('#58b8ff', '#ffffff', 1 - w / 320), op, n);
for (let k = 0; k < 14; k++) { const a = r.range(0, Math.PI * 2), len = r.range(90, 260); p.tryStroke({ brush: 'soft', color: '#d8f4ff', width: r.range(9, 16), opacity: r.range(0.12, 0.26), taper: [0, 0.8], points: [[VP.x + Math.cos(a) * 14, VP.y + Math.sin(a) * 14], [VP.x + Math.cos(a) * len, VP.y + Math.sin(a) * len]] }); }

p.save();
