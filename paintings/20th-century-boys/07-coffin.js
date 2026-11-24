// The coffin. It stands nearly upright in the flowers, open and empty: black lacquer with a
// thin line of gold, lined with a purple so deep that the inside is dark. The sun comes in
// from the right, over its right wall, so only a strip of the lining at the left is lit.
'use strict';
const { studio, open, unit, LIGHT, COFFIN, white, flowers, nB } = require('./scene');
const { mix, clamp, lerp, inPoly } = studio;

const p = open('coffin');
const r = p.rng;
const { mum, leaf, daisy } = flowers(p);
const [hl, hr, sr, fr, fl, sl] = COFFIN.outline;
const inside = inPoly(COFFIN.outline);
const U = unit(8.5);                                                      // units of the picture to the metre, at the coffin
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
// how far a place is in from the edge of the coffin
const edgeDist = (x, y) => { let d = 1e9; for (let i = 0; i < 6; i++) { const a = COFFIN.outline[i], b = COFFIN.outline[(i + 1) % 6], dx = b[0] - a[0], dy = b[1] - a[1], t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy), 0, 1); d = Math.min(d, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t)); } return d; };
const RIM = 7;

// the lining: dark, and darkest at the head end, where it is deepest in the shade
const inLit = (x, y) => inside(x + 0.554 * U, y - 0.177 * U) && edgeDist(x + 0.554 * U, y - 0.177 * U) > 2;   // the part of the back that the sun reaches, past the shade of the right wall
p.fill({ inside: (x, y) => inside(x, y) && edgeDist(x, y) > RIM * 0.5, bounds: [740, 476, 860, 748], width: 11, length: 54, spacing: 0.5, overlap: 0.5, angle: Math.PI / 2,
  color: (x, y) => { const d = mix('#150c1e', '#2a183a', clamp((y - 480) / 230, 0, 1) + (nB(x / 9, y / 30) - 0.5) * 0.3); return inLit(x, y) ? mix('#70428a', '#9060a8', nB(x / 6, y / 26)) : d; }, stroke: { ...line, opacity: 0.98 } });
p.fill({ inside: (x, y) => inside(x, y) && edgeDist(x, y) > RIM * 0.6, bounds: [740, 476, 860, 748], width: 5.5, length: 40, spacing: 0.8, overlap: 0.6, angle: Math.PI / 2,
  color: (x, y) => (inLit(x, y) ? mix('#7c4c94', '#a878bc', r()) : mix('#120a1a', '#32203f', r() * clamp((y - 470) / 200, 0.1, 1))), stroke: { ...line, opacity: 0.8 } });
// the inside of its head end, which we look up into, and the inside of its left wall, which the sun is on
p.stroke({ ...line, color: '#3a2448', width: 9, points: [[hl[0] + 9, hl[1] + 11], [hr[0] - 9, hr[1] + 11]] });
p.stroke({ ...line, color: '#a070b4', width: 5, opacity: 0.9, points: [[sl[0] + 9, sl[1] + 2], [lerp(sl[0], fl[0], 0.4) + 8, lerp(sl[1], fl[1], 0.4)]] });
p.stroke({ ...line, color: '#8c5ca4', width: 5, opacity: 0.85, points: [[hl[0] + 8, hl[1] + 16], [sl[0] + 9, sl[1] - 2]] });

// its case of black lacquer: each edge in pieces. The right edges and the top take the sun.
const edges = [[hl, hr, 0.6], [hr, sr, 1], [sr, fr, 0.9], [fr, fl, 0.2], [fl, sl, 0], [sl, hl, 0.1]];
for (const [a, b, sun] of edges) {
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(len / 60));
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = (i + 1) / n + 0.02;
    p.stroke({ ...line, rag: 0.02, color: mix('#0e0c14', '#4c3e42', sun * r.range(0.5, 1)), width: RIM + 1.5, points: [[lerp(a[0], b[0], t0), lerp(a[1], b[1], t0)], [lerp(a[0], b[0], Math.min(1, t1)), lerp(a[1], b[1], Math.min(1, t1))]] });
  }
}
// the line of gold just inside the edge, and the shine of the lacquer where the sun is on it
const inset = (q, k) => { const cx = 800, cy = 600; const d = Math.hypot(q[0] - cx, q[1] - cy); return [q[0] + (cx - q[0]) / d * k, q[1] + (cy - q[1]) / d * k]; };
for (const [a, b, sun] of edges) {
  const A = inset(a, RIM * 0.9), B = inset(b, RIM * 0.9), len = Math.hypot(B[0] - A[0], B[1] - A[1]);
  let d = 0;
  while (d < len - 14) {
    const d1 = Math.min(len, d + r.range(18, 44));
    p.tryStroke({ brush: 'round', color: mix('#8a6424', '#f4d070', sun), width: 4, opacity: 0.55 + 0.4 * sun, points: [[lerp(A[0], B[0], d / len), lerp(A[1], B[1], d / len)], [lerp(A[0], B[0], d1 / len), lerp(A[1], B[1], d1 / len)]] });
    d = d1 + r.range(2, 10);
  }
  if (sun > 0.5) { const O = inset(a, -1.5), Q = inset(b, -1.5); p.tryStroke({ brush: 'round', color: '#fff2d0', width: 4, opacity: 0.6, taper: [0.3, 0.3], points: [[lerp(O[0], Q[0], 0.15), lerp(O[1], Q[1], 0.15)], [lerp(O[0], Q[0], 0.8), lerp(O[1], Q[1], 0.8)]] }); }
}

// the flowers come in over its edge, here and there, high up
for (let k = 0; k < 26; k++) {
  const side = r() < 0.5 ? -1 : 1, t = r() * 0.55, top = r() < 0.25;
  let x, y;
  if (top) { x = lerp(hl[0], hr[0], r()) + r.range(-6, 6); y = hl[1] - r.range(-2, 9); }
  else if (t < 0.3) { const a = side < 0 ? hl : hr, b = side < 0 ? sl : sr; x = lerp(a[0], b[0], t / 0.3) + side * r.range(-3, 12); y = lerp(a[1], b[1], t / 0.3) + r.range(-6, 6); }
  else { const a = side < 0 ? sl : sr, b = side < 0 ? fl : fr; x = lerp(a[0], b[0], (t - 0.3) / 0.7) + side * r.range(-3, 12); y = lerp(a[1], b[1], (t - 0.3) / 0.7) + r.range(-6, 6); }
  if (side < 0 && !top && r() < 0.45) continue;
  const tone = side > 0 || top ? r.range(0.74, 0.92) : r.range(0.62, 0.8), q = r();
  if (q < 0.2) leaf(x, y, r.range(14, 20), true); else if (q < 0.4) daisy(x, y, r.range(11, 14), tone, true); else mum(x, y, r.range(8.8, 11.5), tone, { lit: true });
}

// Flowers lie in a heap at its foot, as high as a man's waist: they came out with him. So the lower half of the coffin is behind them.
{
  const top = (x) => 648 + 34 * Math.pow(Math.abs(x - 800) / 80, 1.5) * 0 + 16 * Math.sin((x - 730) / 23) + (x < 800 ? 0 : -8);   // the uneven top of the heap
  const list = [];
  for (let y = 626; y < 748; y += 11) for (let x = 716; x < 888; x += 11) {
    const fx = x + r.range(-5, 5), fy = y + r.range(-5, 5);
    if (fy < top(fx) || fy > 746) continue;
    if (Math.abs(fx - 800) > 62 + (fy - 640) * 0.2) continue;
    list.push([fx, fy]);
  }
  list.sort((a, b) => a[1] - b[1]);
  // the dark of the stalks under them first
  for (const [x, y] of list) if (r() < 0.6) { const a = r.range(0, Math.PI); p.tryStroke({ ...line, color: mix('#39424e', white(0.55), r() * 0.5), width: 8, opacity: 0.95, points: [[x - Math.cos(a) * 9, y - Math.sin(a) * 9], [x + Math.cos(a) * 9, y + Math.sin(a) * 9]] }); }
  for (const [x, y] of list) {
    const tone = clamp(0.66 + 0.2 * (x - 800) / 80 + r.range(-0.08, 0.1), 0.4, 0.96), q = r();
    if (q < 0.08) leaf(x, y, r.range(14, 20), true); else if (q < 0.3) daisy(x, y, r.range(11, 15), tone, true); else mum(x, y, r.range(9, 12.5), tone, { lit: true });
  }
}

p.save();
