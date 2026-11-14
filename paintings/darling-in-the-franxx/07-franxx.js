// The fight. The Franxx have gone out from the Plantation: we see each only as a line of
// light of its own color, low over the plain, that ends where it meets the horde. The red
// one is Strelizia: its line goes up from the foot of the dome to the point of the great
// klaxosaur, and there it strikes the blue light, in a burst of white and rose; pieces of
// that blue light fly out from the blow. The guns of the Plantation fire too: thin lines
// of gold, and a glow in the dust where they fall.
'use strict';
const { studio, open, DOME, CORE, front, hullAt } = require('./scene');
const { mix, clamp, glow } = studio;

const p = open('franxx');
const r = p.rng;
// A line of light through some places: pieces along it, from its old end (t = 0) to its new end (t = 1), each long enough
// for its width. `tone(t)` gives the color, width, opacity and brush of a piece. Returns the place on the line at a t.
function trail(pts, tone, wMax) {
  const n = pts.length - 1, at = (t) => { const f = clamp(t, 0, 0.9999) * n, i = Math.floor(f), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(n, i + 2)]; const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u); return [cr(0), cr(1)]; };
  let total = 0, prev = at(0); for (let i = 1; i <= 100; i++) { const q = at(i / 100); total += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
  const m = Math.max(3, Math.floor(total / (wMax * 2.5)));
  for (let i = 0; i < m; i++) { const t0 = i / m, t1 = Math.min(1, (i + 1.3) / m), [color, w, op, brush] = tone((t0 + t1) / 2), seg = []; for (let k = 0; k <= 6; k++) seg.push(at(t0 + (t1 - t0) * k / 6)); p.tryStroke({ brush: brush || 'soft', color, width: w, opacity: op, mix: 0.2, rag: 0.2, cap: 'round', points: seg }); }
  return at;
}
// ---------------------------------------------------------------- the guns of the Plantation
for (const [x0, y0, x1, y1, up] of [[DOME.x + 296, DOME.base - 30, 940, 598, 50], [DOME.x + 276, DOME.base - 46, 1080, 600, 80], [DOME.x + 250, DOME.base - 66, 1230, 602, 116]]) {
  const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 - up, n = 11, q = (t) => [(1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * mx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * my + t * t * y1];
  for (let i = 0; i < n; i++) if (r() < 0.62) { const t0 = (i + r.range(0, 0.2)) / n, t1 = t0 + r.range(0.5, 0.8) / n; p.tryStroke({ brush: 'round', color: mix('#ffb868', '#fff0c8', r()), width: 4, opacity: 0.18 + 0.4 * t1, taper: [0.3, 0.1], points: [q(t0), q((t0 + t1) / 2), q(t1)] }); }
  glow(p, x0, y0, 16, '#ffc878', 0.16, 4);
  for (const [w, op] of [[40, 0.08], [22, 0.16], [11, 0.3]]) glow(p, x1, y1 - 6, w, mix('#ff8c40', '#ffe0a0', 1 - w / 44), op, 4, 0.7);   // the glow in the dust where it falls
}

// ---------------------------------------------------------------- the other Franxx: four lines of light, low over the plain
for (const [c0, c1, pts] of [
  ['#b8ccf4', '#ffffff', [[DOME.x + 306, 568], [722, 578], [744, 590], [front(600) + 12, 600]]],
  ['#e868a8', '#ffd4e8', [[DOME.x + 312, 572], [730, 592], [780, 612], [front(626) + 8, 626]]],
  ['#8cc84c', '#e8ffb8', [[DOME.x + 316, 576], [740, 606], [820, 640], [front(658) + 4, 658]]],
  ['#a070e0', '#eadcff', [[DOME.x + 318, 580], [736, 622], [840, 670], [front(692) + 2, 692]]],
]) {
  trail(pts, (t) => [mix(c0, c1, t), 15 - 5 * t, 0.04 + 0.2 * t * t], 15);
  const at = trail(pts, (t) => [mix(c0, c1, t), 6 - 1.2 * t, 0.12 + 0.82 * t * t, 'bristle'], 6), [ex, ey] = at(0.999), [bx, by] = at(0.9), way = Math.atan2(ey - by, ex - bx);
  for (const [w, op] of [[30, 0.08], [15, 0.2]]) glow(p, ex, ey, w, mix(c0, '#ffffff', 0.4), op, 4);
  p.tryStroke({ brush: 'round', color: '#ffffff', width: 4.6, points: [[ex - Math.cos(way) * 6.4, ey - Math.sin(way) * 6.4], [ex + Math.cos(way) * 6.4, ey + Math.sin(way) * 6.4]] });
  glow(p, ex + Math.cos(way) * 20, ey + Math.sin(way) * 20 - 6, 26, c1, 0.07, 4, 0.7);   // its light on the dust in front of it
}

// ---------------------------------------------------------------- Strelizia
{
  const pts = [[DOME.x + 300, 552], [752, 506], [820, 424], [880, 336], CORE], [x, y] = CORE, way = Math.atan2(CORE[1] - 336, CORE[0] - 880);
  trail(pts, (t) => [mix('#a8324e', '#ff5c78', t), 54 - 22 * t, 0.05 + 0.18 * t * t], 54);
  trail(pts, (t) => [mix('#d84c68', '#ff8ea0', t), 24 - 9 * t, 0.1 + 0.42 * t * t], 24);
  trail(pts, (t) => [mix('#f8a8b0', '#fff6f6', t), 9 - 2.6 * t, 0.2 + 0.78 * t * t, 'bristle'], 9);
  // the blow. The blue lines of the klaxosaur near its point take the light of it.
  for (const [s0, s1, d] of [[60, 190, 34], [74, 230, 78], [40, 120, 14]]) { const a = hullAt(s0, d), b = hullAt((s0 + s1) / 2, d), c = hullAt(s1, d); p.tryStroke({ brush: 'soft', color: '#bfe8ff', width: 12, opacity: 0.3, taper: [0.1, 0.9], points: [a, b, c] }); p.tryStroke({ brush: 'round', color: '#f4fcff', width: 4.6, opacity: 0.9, taper: [0, 0.9], points: [a, b, c] }); }
  // small pieces of the blue light are thrown out from it, up and to the left: each a short touch, dimmer as it is further out
  for (let k = 0; k < 10; k++) {
    const a = -2.6 + r.gauss() * 0.45, d = 24 + Math.pow(r(), 1.3) * 80, px = x + Math.cos(a) * d, py = y + Math.sin(a) * d * 0.8 + d * d * 0.0012, l = r.range(12.4, 17), b = clamp(1.15 - d / 140, 0.25, 1);
    if (b > 0.6) p.tryStroke({ brush: 'soft', color: '#58b4f4', width: 9, opacity: 0.16 * b, points: [[px - 9.6, py], [px + 9.6, py]] });
    p.tryStroke({ brush: 'round', color: mix('#58b4f0', '#e4f8ff', b * r.range(0.6, 1)), width: r.range(4, 5.2), opacity: 0.45 + 0.5 * b, taper: [0.2, 0.6], points: [[px + Math.cos(a) * l / 2, py + Math.sin(a) * l / 2], [px - Math.cos(a) * l / 2, py - Math.sin(a) * l / 2]] });
  }
  // the smoke of the blow, which the wind takes to the left
  for (let k = 0; k < 9; k++) { const w = r.range(26, 54), dx = x - 30 - k * 16 + r.range(-10, 10), dy = y - 18 - k * 5 + r.range(-14, 14); p.stroke({ brush: 'soft', color: mix('#c890a0', '#f4d0d0', r()), width: w, opacity: r.range(0.05, 0.1), points: [[dx - w * 1.1, dy + 4], [dx, dy - 6], [dx + w * 1.1, dy]] }); }
  // then the light of the blow: rose far out, white in the middle, with no edge
  for (const [w, op, n] of [[150, 0.045, 5], [86, 0.09, 5], [46, 0.2, 6], [22, 0.42, 6]]) glow(p, x, y, w, mix('#ff6c88', '#fffafa', 1 - w / 160), op, n);
  p.tryStroke({ brush: 'soft', color: '#ffffff', width: 12, opacity: 0.8, taper: [0.95, 0.95], points: [[x - Math.cos(way) * 100, y - Math.sin(way) * 100], [x, y], [x + Math.cos(way) * 64, y + Math.sin(way) * 64]] });   // the long light across it, along the way that Strelizia came
  p.tryStroke({ brush: 'round', color: '#ffffff', width: 7.5, points: [[x - 8, y + 3], [x + 8, y - 3]] });
}

p.save();
