// The beds of roses at each side of the way: blocks of clipped green, and on every one of
// them the roses, which are gold and give light. The far ones are only small lights, close
// together; on the near bed each rose is a small cup of petals. The leaves are dark, and
// green-gold where the light of a rose is on them. Over the tops of the beds the air is gold.
'use strict';
const { studio, open, W, H, VX, F, BEDS, at, unit, rose, nC, nD } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('beds');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.22, cap: 'round' };
const inPoly = (poly) => (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
// The leaves of a bed at a place of the picture. `lit` is how much of the gold of its own roses is on them.
const leaf = (x, y, lit) => { const n = nC(x / 9, y / 9), m = nD(x / 46, y / 30); return mix(mix('#030c07', '#12381a', n * 0.7 + m * 0.3), '#7c9628', clamp(lit, 0, 1) * (0.1 + 0.45 * m * n)); };
// One face of a bed: leaves, as short strokes that lie every way. `s` is the scale of the picture there.
function face(quad, litAt, s) {
  const xs = quad.map((q) => q[0]), ys = quad.map((q) => q[1]), b = [Math.max(0, Math.min(...xs)), Math.max(0, Math.min(...ys)), Math.min(W, Math.max(...xs)), Math.min(H, Math.max(...ys))];
  if (b[2] <= b[0] || b[3] <= b[1]) return;
  const w = clamp(0.045 * s, 5, 9);
  p.fill({ inside: inPoly(quad), bounds: b, width: w, length: w * 3, spacing: 0.5, angle: () => r.range(0, Math.PI), color: (x, y) => leaf(x, y, litAt(x, y)), stroke: { ...line, opacity: 0.96 } });
}
const SIZE = 0.066;                                                      // the radius of a rose, in metres

// A bed. `side` is -1 if it is at our left, so that we see its right end, and 1 if it is at our right.
function bed(b, side, o = {}) {
  const xi = side < 0 ? b.x1 : b.x0, xo = side < 0 ? b.x0 : b.x1;                                   // its end toward the way, and its other end
  const zOf = (x) => F * xi / (x - VX);                                                             // on that end: how far off the place is that we see at an x of the picture
  const topY = (Z) => at(0, b.h, Z)[1], footY = (Z) => at(0, 0, Z)[1];
  // the top, the end toward the way, and the front
  face([at(xo, b.h, b.z0), at(xi, b.h, b.z0), at(xi, b.h, b.z1), at(xo, b.h, b.z1)], () => 0.85, unit((b.z0 + b.z1) / 2));
  face([at(xi, b.h, b.z0), at(xi, b.h, b.z1), at(xi, 0, b.z1), at(xi, 0, b.z0)], (x, y) => { const Z = clamp(zOf(x), b.z0, b.z1); return 0.5 - 0.6 * (y - topY(Z)) / (footY(Z) - topY(Z)); }, unit((b.z0 + b.z1) / 2));
  face([at(xo, b.h, b.z0), at(xi, b.h, b.z0), at(xi, 0, b.z0), at(xo, 0, b.z0)], (x, y) => 0.4 - 0.6 * (y - topY(b.z0)) / (footY(b.z0) - topY(b.z0)), unit(b.z0));
  // the edges of the block: its near top edge, where the leaves take the light, and the corner where its front meets its end
  { const a = at(xo, b.h, b.z0), c = at(xi, b.h, b.z0), x0 = clamp(Math.min(a[0], c[0]), -20, W + 20), x1 = clamp(Math.max(a[0], c[0]), -20, W + 20); for (let x = x0; x < x1 - 14; x += r.range(30, 110)) p.tryStroke({ ...line, color: mix('#2c5a20', '#6c8c2c', r()), width: clamp(0.03 * unit(b.z0), 4.8, 7), opacity: r.range(0.25, 0.5), rag: 0.5, points: [[x, a[1] + r.range(-2, 3)], [Math.min(x1, x + r.range(14, 40)), a[1] + r.range(-2, 3)]] }); }
  { const a = at(xi, b.h, b.z0), c = at(xi, b.h, b.z1); if (a[0] > -20 && a[0] < W + 20) { const n = Math.max(2, Math.round(Math.hypot(c[0] - a[0], c[1] - a[1]) / 30)); for (let i = 0; i < n; i++) if (r() < 0.8) { const t0 = i / n, t1 = (i + 0.8) / n; p.tryStroke({ ...line, color: mix('#2c5a20', '#6c8c2c', r()), width: 5, opacity: 0.4, rag: 0.5, points: [[a[0] + (c[0] - a[0]) * t0, a[1] + (c[1] - a[1]) * t0], [a[0] + (c[0] - a[0]) * t1, a[1] + (c[1] - a[1]) * t1]] }); } const f = at(xi, 0, b.z0); p.tryStroke({ ...line, color: '#020806', width: 5, opacity: 0.5, points: [[a[0], a[1] + 6], [f[0], f[1] - 4]] }); } }
  // the dark where it meets the ground, and the line of its near top edge, where the leaves take the light
  for (const [a, c] of [[at(xo, 0, b.z0), at(xi, 0, b.z0)], [at(xi, 0, b.z0), at(xi, 0, b.z1)]]) { const x0 = clamp(a[0], -40, W + 40), x1 = clamp(c[0], -40, W + 40); if (Math.abs(x1 - x0) > 30) { const ya = a[1] + (c[1] - a[1]) * (x0 - a[0]) / (c[0] - a[0] || 1), yc = a[1] + (c[1] - a[1]) * (x1 - a[0]) / (c[0] - a[0] || 1); p.tryStroke({ brush: 'soft', color: '#04080a', width: clamp(0.14 * unit(b.z0), 9, 22), opacity: 0.5, points: [[x0, ya + 3], [(x0 + x1) / 2, (ya + yc) / 2 + 3], [x1, yc + 3]] }); } }
  // its roses: on the top (they stand up a little out of it), on the end and on the front. Far ones first.
  const list = [], lo = (Z) => (side < 0 ? Math.max(xo, (0 - VX) * Z / F - 0.6) : xi), hi = (Z) => (side < 0 ? xi : Math.min(xo, (W - VX) * Z / F + 0.6));
  const area = (b.z1 - b.z0) * (hi((b.z0 + b.z1) / 2) - lo((b.z0 + b.z1) / 2));
  const clump = (u, v) => r() < 0.12 + 1.5 * smooth(0.42, 0.74, nD(u * 1.3 + 31, v * 1.3 + 7));                        // they grow in clumps, with leaves between
  for (let k = 0; k < area * (o.thick || 15); k++) { const Z = r.range(b.z0, b.z1), X = r.range(lo(Z), hi(Z)); if (hi(Z) > lo(Z) && clump(X, Z)) list.push([X, b.h + r.range(-0.03, 0.2), Z]); }
  for (let k = 0; k < (b.z1 - b.z0) * b.h * (o.thick || 15); k++) { const Z = r.range(b.z0, b.z1), Y = b.h * Math.pow(r(), 0.7) * 0.94 + 0.06; if (clump(Z, Y * 2 + 50)) list.push([xi, Y, Z]); }
  if (hi(b.z0) > lo(b.z0)) for (let k = 0; k < (hi(b.z0) - lo(b.z0)) * b.h * (o.thick || 15); k++) { const X = r.range(lo(b.z0), hi(b.z0)), Y = b.h * Math.pow(r(), 0.7) * 0.94 + 0.06; if (clump(X, Y * 2 + 90)) list.push([X, Y, b.z0]); }
  list.sort((a, c) => c[2] - a[2]);
  for (const [X, Y, Z] of list) { const [x, y] = at(X, Y, Z); if (x > -20 && x < W + 20 && y < H + 20) rose(p, x, y, SIZE * unit(Z) * r.range(0.8, 1.25), { dim: Y < b.h * 0.3 ? 0.3 : 0 }); }
  // the gold in the air over its top
  { const a = at(side < 0 ? lo(b.z0) : xi, b.h + 0.2, (b.z0 + b.z1) / 2), c = at(side < 0 ? xi : hi(b.z1), b.h + 0.2, (b.z0 + b.z1) / 2), x0 = clamp(Math.min(a[0], c[0]), -60, W + 60), x1 = clamp(Math.max(a[0], c[0]), -60, W + 60);
    if (x1 - x0 > 120) for (let k = 0; k < 5; k++) { const w = r.range(30, 60), y = a[1] + r.range(-16, 22); p.stroke({ brush: 'soft', color: '#f0b624', width: w, opacity: r.range(0.06, 0.11), points: [[x0 - 20, y], [(x0 + x1) / 2, y + r.range(-4, 4)], [x1 + 20, y]] }); } }
}

bed(BEDS.left2, -1);
bed(BEDS.left1, -1);
bed(BEDS.right, 1);

p.save();
