// Last touches. The shade of the man, which goes up the two steps and over the white block
// at our left, with clean edges. What shows in the dark stone under the steps. The shade
// that the bed of the sign puts on the flowers below it. Petals: on the stone, on the floor,
// and a few in the air, which the wind takes to the left. And the sun on the crystals.
'use strict';
const { studio, open, W, H, CAM, at, unit, groundAt, LIGHT, FACES, FRIEND, friendShade, BED, COFFIN, CARPET, STEPS, RAYS, PRISMS, seeHeap, standShade, heapShade, nA, nB } = require('./scene');
const { mix, clamp, lerp, inPoly, glow } = studio;

const p = open('light');
const r = p.rng;

// ---- the shade of the man on the steps and on the block: small strokes, so that its edges are clean

for (const f of FACES) {
  const xs = f.quad.map((q) => q[0]), ys = f.quad.map((q) => q[1]), b = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], inQuad = inPoly(f.quad);
  const shaded = (x, y) => inQuad(x, y) && friendShade(...f.place(x, y));
  const level = Math.abs(f.n[1]) > 0.5;
  p.fill({ inside: shaded, bounds: b, width: 5, length: level ? 18 : 16, spacing: 0.55, overlap: 0.6, angle: level ? 0 : f.name === 'blockSide' ? -0.5 * f.s : 0, color: (x, y) => mix('#8388b8', '#9a9cc8', nB(x / 7, y / 7)), stroke: { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.02, cap: 'round', opacity: 0.92 } });
}
// and on the dark stone, from his feet to the first step
p.fill({ inside: (x, y) => { if (y < 822) return false; const [X, Z] = groundAt(x, y); return Z < STEPS.z[0] && Math.abs(X) < CARPET.half && friendShade(X, 0, Z); }, bounds: [560, 818, 860, 850], width: 5, length: 20, spacing: 0.5, overlap: 0.6, angle: -0.12, color: () => mix('#0a060c', '#140c14', r()), stroke: { brush: 'bristle', mix: 0.15, dry: 0, rag: 0.05, cap: 'round', opacity: 0.6 } });

// ---- what shows in the dark stone: the white of the steps and the flowers, in soft upright streaks, more just under the steps

for (let k = 0; k < 70; k++) {
  const y0 = 822 + r() * r() * 110, x = 800 + r.range(-1, 1) * (CAM.f * CARPET.half / groundAt(800, y0 + 30)[1] - 14);
  if (Math.abs(x - 800) < 46) continue;                                  // he shows there, not the flowers
  const len = r.range(24, 80);
  p.tryStroke({ brush: 'soft', color: mix('#f0e4d0', '#cfd0e8', r()), width: r.range(8.4, 13), opacity: r.range(0.05, 0.13) * (1 - (y0 - 822) / 190), points: [[x, y0], [x + (x - 800) / 2600 * len, y0 + len]] });
}

// ---- shades on the hill: under the bed of the sign, and where the coffin goes into the flowers

for (let k = 0; k < 20; k++) {
  const a = lerp(0.35, 2.6, k / 19) + r.range(-0.05, 0.05), x = BED.x + Math.cos(a) * (BED.a + 13), y = BED.y + Math.sin(a) * (BED.b + 13), toSun = Math.cos(a) * LIGHT[0] + Math.sin(a) * LIGHT[1];
  const w = r.range(18, 30), l = w * 1.1;
  if (!seeHeap(x, y + 6)) continue;
  p.stroke({ brush: 'soft', color: '#4c5290', width: w, opacity: clamp(0.1 - 0.1 * toSun, 0.04, 0.2), points: [[x + Math.sin(a) * l, y - Math.cos(a) * l], [x, y + 3], [x - Math.sin(a) * l, y + Math.cos(a) * l]] });
}
{
  const [hl, hr, sr, , , sl] = COFFIN.outline;
  for (const [a, b, o] of [[hl, sl, 0.2], [hl, hr, 0.14], [hr, sr, 0.08]]) for (let i = 0; i < 3; i++) {
    const t0 = i / 3, t1 = (i + 1) / 3, out = a === hl && b === hr ? [0, -6] : a === hl ? [-7, 0] : [7, 0];
    p.stroke({ brush: 'soft', color: '#3c3c74', width: 10.5, opacity: o, points: [[lerp(a[0], b[0], t0) + out[0], lerp(a[1], b[1], t0) + out[1]], [lerp(a[0], b[0], t1) + out[0], lerp(a[1], b[1], t1) + out[1] + (out[1] ? 0 : 0.1)]] });
  }
}

// ---- petals

// A petal on a floor: a thin pale mark that lies nearly level, with a little shade at its left.
function petalOn(x, y, s, dark) {
  const a = r.range(-1.3, 1.3), l = Math.max(6.3, s * r.range(0.8, 1.2)), w = clamp(s * 0.4, 4, 4.8);
  if (!dark) p.tryStroke({ brush: 'round', color: '#9a98c0', width: w, opacity: 0.5, points: [[x - Math.cos(a) * l - 2.5, y - Math.sin(a) * l * 0.5 + 1.6], [x + Math.cos(a) * l - 2.5, y + Math.sin(a) * l * 0.5 + 1.6]] });
  p.tryStroke({ brush: 'round', color: mix('#fffdf4', '#f6e8c8', r()), width: w, opacity: r.range(0.8, 1), taper: [0.3, 0.3], points: [[x - Math.cos(a) * l, y - Math.sin(a) * l * 0.5], [x + Math.cos(a) * l, y + Math.sin(a) * l * 0.5]] });
}
// on the stone: most near the steps
for (let k = 0; k < 38; k++) {
  const Z = STEPS.z[0] - 0.1 - r() * r() * 3.2, X = r.range(-1, 1) * (CARPET.half - 0.08), [x, y] = at(X, 0, Z);
  if (y > H - 6 || (Math.abs(X) < 0.36 && Z > FRIEND.Z - 0.32 && Z < FRIEND.Z + 0.3)) continue;                // not on his shoes
  petalOn(x, y, unit(Z) * 0.058, true);
}
// on the pale floor, round the foot of the hill
for (let k = 0; k < 80; k++) {
  const side = r() < 0.55 ? -1 : 1, Z = r.range(6.6, 9.4), X = side * (CARPET.half + 0.25 + r() * r() * 5), [x, y] = at(X, 0, Z);
  if (seeHeap(x, y) || Math.abs(X) < STEPS.half + 0.5 && Z > 7.05) continue;
  petalOn(x, y, unit(Z) * 0.055, false);
}
// in the air: the wind takes them to the left
for (let k = 0; k < 34; k++) {
  const x = 800 - r.range(90, 560) * (r() < 0.8 ? 1 : -0.7), y = r.range(430, 800), a = r.range(-1.2, 0.6), l = r.range(6.4, 8.6);
  const lit = r() < 0.75;
  p.tryStroke({ brush: 'round', color: lit ? mix('#fffef6', '#fff0c8', r()) : '#b4b6dc', width: r.range(4, 4.8), opacity: r.range(0.7, 1), taper: [0.25, 0.45], points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x + Math.cos(a) * l * 0.2, y + Math.sin(a) * l * 0.2 - 1.5], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
}

// ---- the sun on the crystals: a light with no edge at a place on an upper edge, and one long thin ray through it

{
  const C = at(RAYS.X, RAYS.Y, RAYS.Z), K = unit(RAYS.Z);
  const spots = [[7, 0.62, 1], [7, 0.93, 1], [6, 0.8, 1], [8, 0.7, 1], [10, 0.55, 1], [9, 0.97, 0.2], [10, 0.98, 0.2], [11, 0.97, 0.3], [1, 0.9, 1], [4, 0.96, 0.2]];
  for (const [i, t, v] of spots) {
    const q = PRISMS[i], ca = Math.cos(q.a), sa = Math.sin(q.a), d = q.L * t;
    const x = C[0] + q.side * ca * d * K + (q.side > 0 ? -sa : sa) * v * q.T * K * 0.56, y = C[1] - sa * d * K - ca * v * q.T * K * 0.56;
    if (x < 10 || x > W - 10 || y < 8 || seeHeap(x, y)) continue;
    glow(p, x, y, r.range(26, 40), '#ffffff', 0.09, 6);
    glow(p, x, y, r.range(10, 14), '#ffffff', 0.3, 6);
    const a = -0.32 + r.range(-0.08, 0.08), l = r.range(26, 46);
    p.stroke({ brush: 'round', color: '#ffffff', width: 4, opacity: 0.8, taper: [0.9, 0.9], points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
  }
}

// ---- the corners of the picture are a little deeper, so that the eye stays in the middle

for (const [x0, y0, x1, y1, c, o] of [[-40, 30, 330, -30, '#1c3c8c', 0.1], [1270, -30, 1640, 30, '#1c3c8c', 0.1], [-60, 960, 380, 1010, '#8a7a64', 0.1], [1220, 1010, 1660, 960, '#8a7a64', 0.1], [-60, 900, 300, 1000, '#8a7a64', 0.06], [1300, 1000, 1660, 900, '#8a7a64', 0.06]]) {
  p.stroke({ brush: 'soft', color: c, width: 170, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
