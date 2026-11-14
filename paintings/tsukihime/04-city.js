// The city under the castle. Far blocks stand in the white mist at its foot, pale in its
// light, each with its rows of dark windows. Nearer blocks are dark against the mist, with
// a few windows lit. Nearest of all are the roofs just under us, with their tanks and
// aerials. Then small lights that rise in the air about the castle, and the corners.
'use strict';
const { studio, open, W, H, CX, hash } = require('./scene');
const { mix, clamp, smooth, glow } = studio;

const p = open('city');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.1, cap: 'flat' };
const mist = (y0, y1, n, op) => { for (let k = 0; k < n; k++) { const x = r.range(-200, W - 300), len = r.range(400, 900), y = r.range(y0, y1); p.stroke({ brush: 'soft', color: mix('#a8ccff', '#ffffff', r()), width: r.range(40, 80), opacity: op * r.range(0.6, 1), points: [[x, y], [x + len / 2, y + r.range(-6, 6)], [x + len, y]] }); } };
// A block: a wall from its top down, and its windows in rows. `lit` is the color of a window that is lit, and `part` how many are.
function block(x, top, w, wall, o = {}) {
  const foot = o.foot || H + 10;
  for (let y = top + 4; y < foot; y += 7.4) p.stroke({ ...line, color: mix(wall, o.low || wall, clamp((y - top) / 160, 0, 1)), width: 8.5, points: [[x, y], [x + w, y + r.range(-0.3, 0.3)]] });
  if (o.cap) p.stroke({ ...line, color: o.cap, width: 5, points: [[x - 2, top + 1], [x + w + 2, top + 1]] });
  const step = o.step || 13, colW = o.colW || 17;
  for (let y = top + 12; y < foot - 8; y += step) for (let wx = x + 5; wx + 12.4 < x + w - 3; wx += colW) if (hash(Math.floor(wx), Math.floor(y)) < (o.part != null ? o.part : 0.5)) p.tryStroke({ brush: 'round', color: typeof o.lit === 'function' ? o.lit() : o.lit, width: 4, opacity: o.op || 0.85, points: [[wx, y], [wx + 12.4, y]] });
  return x + w;
}

// ---------------------------------------------------------------- the mist, and the far blocks that stand in it
mist(790, 870, 26, 0.24);
for (let x = -20; x < W + 20;) {
  const inFront = Math.abs(x - CX) < 250, top = inFront ? r.range(840, 880) : r.range(730, 820), w = r.range(38, 86);
  if (r() < 0.14) { x += r.range(20, 60); continue; }
  x = block(x, top, w, mix('#8cb4ec', '#dcecff', r()), { low: '#f0f8ff', foot: 900, lit: () => mix('#2c54b0', '#4c7cd0', r()), part: 0.7, op: 0.7, step: 12, colW: 16, cap: '#ffffff' }) + r.range(2, 22);
}
mist(850, 900, 22, 0.3);

// ---------------------------------------------------------------- nearer blocks: dark against the mist, with a few windows lit
const warm = () => (r() < 0.55 ? mix('#ffe2a0', '#fff4d8', r()) : mix('#a8d0ff', '#e8f4ff', r()));
for (let x = -30; x < W + 20;) {
  const top = r.range(846, 912), w = r.range(60, 130);
  if (r() < 0.1) { x += r.range(20, 50); continue; }
  const x1 = block(x, top, w, mix('#16246c', '#24388c', r()), { low: '#0a1244', lit: warm, part: 0.24, cap: '#6c94e0' });
  if (r() < 0.4) { const ax = x + r.range(8, w - 8); p.tryStroke({ brush: 'round', color: '#16246c', width: 4, points: [[ax, top], [ax, top - r.range(14, 34)]] }); }      // an aerial
  if (r() < 0.3) p.stroke({ ...line, color: '#101c58', width: 9, points: [[x + w * 0.2, top - 4], [x + w * 0.2 + Math.max(19, w * 0.3), top - 4]] });                     // a tank, or a hut on the roof
  x = x1 + r.range(2, 16);
}
mist(900, 950, 10, 0.12);

// ---------------------------------------------------------------- the roofs just under us: nearly black, with the light of the castle along their tops
for (let x = -30; x < W + 20;) {
  const top = r.range(930, 978), w = r.range(110, 240);
  block(x, top, w, mix('#060a2c', '#0c1444', r()), { low: '#03051c', lit: warm, part: 0.1, step: 17, colW: 24, cap: '#4c74d0' });
  if (r() < 0.6) { const tx = x + r.range(14, w - 50), tw = r.range(26, 44), th = r.range(16, 26); for (let y = top - th + 4; y < top; y += 7) p.stroke({ ...line, color: '#060a2c', width: 8.5, points: [[tx, y], [tx + tw, y]] }); p.tryStroke({ brush: 'round', color: '#5c84dc', width: 4, opacity: 0.8, points: [[tx, top - th + 1], [tx + tw, top - th + 1]] }); }   // a water tank
  if (r() < 0.5) { const ax = x + r.range(10, w - 10), ah = r.range(26, 60); p.tryStroke({ brush: 'round', color: '#060a2c', width: 4, points: [[ax, top], [ax + r.range(-2, 2), top - ah]] }); }   // a thin mast (a bar across it would make a cross of it)
  x += w + r.range(-6, 10);
}

// ---------------------------------------------------------------- the last touches
// Small lights that rise in the air about the castle: short level touches, each in a faint glow.
for (let k = 0; k < 70; k++) {
  const x = CX + r.gauss() * 330, y = r.range(260, 800);
  if (Math.abs(x - CX) < 60 + (y - 200) * 0.34) continue;
  if (r() < 0.4) p.tryStroke({ brush: 'soft', color: '#8cc0ff', width: 9, opacity: 0.2, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: mix('#bfe0ff', '#ffffff', r()), width: 4, opacity: r.range(0.4, 0.9), points: [[x - 6.2, y], [x + 6.2, y]] });
}
glow(p, CX, 860, 300, '#ffffff', 0.05, 4, 0.4);
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 190, 0.34], [W + 60, -40, 1140, -70, 190, 0.34], [-70, 200, -70, 760, 150, 0.2], [W + 70, 200, W + 70, 760, 150, 0.2], [-60, H + 50, 520, H + 60, 130, 0.3], [W + 60, H + 50, 1080, H + 60, 130, 0.3]]) p.stroke({ brush: 'soft', color: '#02031a', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
