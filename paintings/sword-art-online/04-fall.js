// The fall: the lowest floors have come away from the castle in great slabs. The nearest
// still hang under it, tilting; the rest are on their way down to the clouds with their
// dust behind them, and the keel that hung beneath the castle is falling point first.
'use strict';
const { studio, open, SUN, AX, glow, toSun, breakLine, half, nA } = require('./scene');
const { mix, clamp, glint } = studio;

const p = open('fall');
const r = p.rng;
const warm = () => mix('#ff9a60', '#ffe6b4', r());
// A piece against the light is darker than the wall it came from.
const rock = (x, y) => { const g = glow(x, y, 260); return mix(mix('#1c1842', '#2c2759', nA(x / 24, y / 10)), mix('#544684', '#a8688a', g), 0.12 + 0.3 * g); };

// Dust hanging where a piece has just been.
function dust(x, y, len, w, lean = 0) {
  const g = clamp(glow(x, y, 360) * 1.3, 0, 1);
  p.tryStroke({ brush: 'soft', color: mix(mix('#7a6a9c', '#a888a8', r()), '#ffd09a', g), width: w, opacity: r.range(0.1, 0.17), taper: [0.1, 0.7], points: [[x, y], [x + lean * 0.4, y - len * 0.5], [x + lean, y - len]] });
}

// A slab of the castle: a block of floors seen from the side, turned through `deg`. It is
// laid in along its length, marked with the openings of its floors, and lit on whichever
// faces are turned to the sun.
function slab(cx, cy, w, h, deg) {
  const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
  const P = (u, v) => [cx + u * ca - v * sa, cy + u * sa + v * ca];
  const lanes = Math.max(2, Math.round(h / 8)), lw = Math.max(4.8, h / lanes + 2.5);
  for (let j = 0; j < lanes; j++) {
    const v = -h / 2 + (j + 0.5) * h / lanes, u0 = -w / 2 * r.range(0.74, 1.05), u1 = w / 2 * r.range(0.74, 1.05), [mx, my] = P(0, v);
    p.tryStroke({ brush: 'bristle', color: mix(rock(mx, my), '#0e0c2a', r() * 0.1), width: lw, mix: 0, dry: 0, rag: 0.45, streak: 0.15, jitter: 0.3, cap: 'flat', points: [P(u0, v), P((u0 + u1) / 2, v + r.range(-1, 1)), P(u1, v)] });
  }
  for (let j = 0; j < Math.floor(h / 12.4); j++) {                    // the openings of each floor in it
    const v = -h / 2 + (j + 0.5) * (h / Math.floor(h / 12.4));
    for (let u = -w / 2 + 9; u < w / 2 - 20; u += 19) {
      if (r() < 0.5) continue;
      const [x0, y0] = P(u, v + 1.5), [x1, y1] = P(u + 12.6, v + 1.5);
      p.tryStroke({ brush: 'bristle', color: mix(rock(x0, y0), '#08071e', 0.5), width: 4.6, opacity: 0.5, mix: 0.15, dry: 0.05, rag: 0.1, cap: 'round', points: [[x0, y0], [x1, y1]] });
    }
  }
  const [lx, ly] = toSun(cx, cy);
  for (const [nx, ny, a0, b0] of [[-sa, ca, P(-w / 2 + 3, h / 2 - 2), P(w / 2 - 3, h / 2 - 2)], [sa, -ca, P(-w / 2 + 3, -h / 2 + 2), P(w / 2 - 3, -h / 2 + 2)], [ca, sa, P(w / 2 - 2, -h / 2 + 2), P(w / 2 - 2, h / 2 - 2)], [-ca, -sa, P(-w / 2 + 2, -h / 2 + 2), P(-w / 2 + 2, h / 2 - 2)]]) {
    const facing = nx * lx + ny * ly;
    if (facing > 0.15) glint(p, [a0, [(a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2], b0], warm, { width: 4.2, dash: 30, gap: 7, opacity: 0.45 + 0.5 * facing, rng: r });
  }
}

// Dust and haze under the break, before anything else, so the pieces stand in front of it.
for (let k = 0; k < 16; k++) {
  const x = r.range(AX - 230, AX + 230), y = breakLine(x) + r.range(4, 60);
  dust(x, y + 30, r.range(50, 110), r.range(30, 60), r.range(-20, 20));
}

// The slabs, the far ones first: those still hanging under the castle, then those well on
// their way, the keel among them.
const pieces = [
  [636, 438, 150, 46, -8], [884, 444, 140, 44, 10], [768, 492, 120, 40, 4],                  // just come away
  [560, 508, 122, 42, -22], [962, 520, 112, 40, 24],
  [752, 572, 104, 46, 112],                                                                  // the keel
  [664, 566, 86, 36, 34], [868, 586, 82, 34, -28], [520, 606, 62, 30, -48], [1046, 512, 54, 28, 40],
  [716, 648, 52, 28, 64], [620, 664, 46, 26, -18], [918, 668, 48, 26, 12],
];
for (const [cx, cy, w, h, deg] of pieces) {
  for (let k = 0; k < 2; k++) dust(cx + r.range(-0.25, 0.25) * w, cy - h * 0.3, r.range(70, 130) + (cy - 430) * 0.3, Math.max(18, Math.min(w, h) * r.range(0.7, 1.1)), r.range(-14, 14));
  slab(cx, cy, w, h, deg);
}
// The keel is a spire: it ends in a point.
p.stroke({ brush: 'bristle', color: rock(735, 640), width: 38, mix: 0, dry: 0, rag: 0.1, cap: 'flat', taper: [0, 1], points: [[742, 596], [729, 640], [716, 686]] });

// Rubble: small pieces everywhere beneath, most of all close under the break.
for (let k = 0; k < 150; k++) {
  const close = r() < 0.45, x = r.range(AX - 270, AX + 280), y = close ? breakLine(clamp(x, AX - 220, AX + 220)) + r.range(2, 46) : r.range(470, 720);
  if (!close && (Math.abs(x - AX) > 150 + (y - 430) * 0.5 || Math.hypot(x - SUN.x, y - SUN.y) < 80)) continue;
  if (close && Math.abs(x - AX) > half(430) + 10) continue;
  const len = r.range(12.4, 24) * (close ? 0.85 : 1), w = Math.max(4.6, Math.min(len / 2.1, r.range(4.6, 9))), a = r.range(0, 3.14), c = Math.cos(a), s = Math.sin(a);
  p.tryStroke({ brush: 'bristle', color: mix(rock(x, y), '#0e0c2a', r() * 0.2), width: w, opacity: r.range(0.8, 1), mix: 0, dry: 0, rag: 0.3, cap: 'flat', points: [[x - c * len / 2, y - s * len / 2], [x + c * len / 2, y + s * len / 2]] });
  if (r() < 0.3) { const [lx, ly] = toSun(x, y); p.tryStroke({ color: warm(), width: 4, opacity: r.range(0.4, 0.8), points: [[x - c * 6.3 + lx * w * 0.4, y - s * 6.3 + ly * w * 0.4], [x + c * 6.3 + lx * w * 0.4, y + s * 6.3 + ly * w * 0.4]] }); }
}

// Light coming through the gaps between the pieces, low down toward the sun.
for (const [x, y, w, o] of [[900, 560, 120, 0.1], [820, 620, 100, 0.08], [980, 650, 90, 0.1]]) {
  p.stroke({ brush: 'soft', color: '#ffd9a0', width: w, opacity: o, points: [[x - w * 1.02, y + 8], [x, y], [x + w * 1.02, y - 6]] });
}

p.save();
