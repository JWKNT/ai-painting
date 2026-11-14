// The castle. Its tower is round storeys of blue glass, one on another, each smaller than
// the one under it. The walls are thin upright rods, like the pipes of an organ or like
// ice, and the light inside comes through them, so they are lines of light and of dark.
// Each storey has a pale rim at its top, with points that stand up on it. Half way up, a
// wide skirt of roofs stands out. On the top storey is a cone, and on that a spire. Long
// bridges hang from the tower out over the town, on thin legs, and at the right is a lower
// hall with a pointed roof. Everything is white where it comes out of the mist and deep
// blue at the top.
'use strict';
const { studio, open, W, CX, TOP, FOOT, TIERS, hash, depth, glass, nB } = require('./scene');
const { mix, clamp, smooth, glow, inPoly } = studio;

const p = open('castle');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'flat' };
const rod = (x) => hash(Math.floor(x / 6.5), 3);                          // each rod of the wall has its own light
// The glass at a place: its light by its height, darker toward the two sides of a round drum, and the light or dark of its rod.
const wall = (xc, w) => (x, y) => {
  const u = (x - xc) / (w / 2), side = Math.pow(Math.abs(u), 2.2), t = depth(y);
  let c = glass(clamp(t + (rod(x) - 0.5) * 0.3 - side * 0.2, 0, 1));
  return mix(c, '#06103c', side * (0.5 - 0.3 * t));
};
// A drum: a wall of rods between two heights, with a rim at its top and points on the rim.
function drum(xc, w, y0, y1, o = {}) {
  const color = wall(xc, w);
  p.fill({ bounds: [xc - w / 2, y0, xc + w / 2, y1], width: 6.5, length: Math.min(90, (y1 - y0) * 0.8), spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color, stroke: { ...line, opacity: 0.96 } });
  for (let x = xc - w / 2 + 5; x < xc + w / 2 - 4; x += r.range(7, 16)) {   // rods that are brighter than the others, in pieces
    const ya = r.range(y0 + 6, y1 - 30), len = r.range(26, Math.min(120, y1 - ya - 4));
    if (len > 14) p.tryStroke({ brush: 'round', color: mix(color(x, ya + len / 2), '#ffffff', r.range(0.3, 0.75)), width: 4, opacity: r.range(0.5, 0.95), points: [[x, ya], [x, ya + len]] });
  }
  for (let x = xc - w / 2 + 8; x < xc + w / 2 - 6; x += r.range(18, 40)) { const ya = r.range(y0 + 10, y1 - 40), len = r.range(20, 60); p.tryStroke({ brush: 'round', color: '#050c34', width: 4, opacity: 0.5, points: [[x, ya], [x, ya + len]] }); }   // and dark ones
  const t = depth(y0), rim = mix(glass(clamp(t + 0.3, 0, 1)), '#ffffff', 0.4), over = o.over != null ? o.over : 8;
  p.stroke({ ...line, cap: 'round', color: mix(rim, '#0c1c6c', 0.5), width: 8, points: [[xc - w / 2 - over, y0 + 7], [xc, y0 + 9], [xc + w / 2 + over, y0 + 7]] });   // the shade under the rim
  p.stroke({ ...line, cap: 'round', color: rim, width: 6.5, points: [[xc - w / 2 - over, y0], [xc, y0 + 2], [xc + w / 2 + over, y0]] });                                 // the rim
  if (o.points !== false) for (let x = xc - w / 2 - over + 6; x < xc + w / 2 + over - 4; x += r.range(11, 19)) { const h = r.range(13, 26) * (1 - 0.5 * Math.pow(Math.abs(x - xc) / (w / 2 + over), 2)); p.tryStroke({ brush: 'round', color: mix(rim, '#ffffff', r() * 0.5), width: 4, opacity: 0.9, points: [[x, y0 - 1], [x, y0 - 1 - Math.max(12.4, h)]] }); }   // the points on it
}
// A bridge: a long line that hangs between the tower and the edge of the picture, with thin legs under it.
function bridge(pts, legsTo, far) {
  const n = 28, at = (t) => { const f = t * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(pts.length - 1, i + 2)]; const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u); return [cr(0), cr(1)]; };
  for (let i = 1; i < n; i++) if (i % 2 === 0) { const [x, y] = at(i / n); if (legsTo - y > 20) p.tryStroke({ brush: 'round', color: mix(glass(depth(y) * 0.9), '#0c1c6c', far ? 0.5 : 0.2), width: 4, opacity: far ? 0.45 : 0.7, points: [[x, y + 3], [x, legsTo]] }); }
  for (let i = 0; i < n; i++) { const a = at(i / n), b = at((i + 0.55) / n), c = at(Math.min(1, (i + 1.1) / n)); p.tryStroke({ ...line, cap: 'round', color: mix(glass(clamp(depth(b[1]) + 0.12, 0, 1)), '#0c1c6c', far ? 0.45 : 0), width: far ? 5 : 7, opacity: far ? 0.8 : 0.97, points: [a, b, c] }); }
  if (!far) for (let i = 0; i < n; i++) { const a = at(i / n), c = at(Math.min(1, (i + 1.1) / n)); p.tryStroke({ brush: 'round', color: '#ffffff', width: 4, opacity: 0.6, points: [[a[0], a[1] - 3], [c[0], c[1] - 3]] }); }
}

// ---------------------------------------------------------------- the bridges that are behind the tower
bridge([[CX - 70, 250], [CX - 300, 330], [CX - 560, 450], [CX - 840, 500]], 800, true);
bridge([[CX + 70, 250], [CX + 300, 330], [CX + 560, 450], [CX + 840, 500]], 800, true);

// ---------------------------------------------------------------- the spire and the cone on the top storey
p.stroke({ ...line, cap: 'round', color: '#16308c', width: 5.5, points: [[CX, TOP], [CX, 130]] });
p.tryStroke({ brush: 'round', color: '#a8c8ff', width: 4, opacity: 0.8, points: [[CX - 1.5, TOP + 4], [CX - 1.5, 126]] });
{ const t = TIERS[0], cone = [[CX - t.w / 2 + 4, t.y0 + 2], [CX - 8, 122], [CX + 8, 122], [CX + t.w / 2 - 4, t.y0 + 2]], color = wall(CX, t.w);
  p.fill({ inside: inPoly(cone), bounds: [CX - t.w / 2, 120, CX + t.w / 2, t.y0 + 4], width: 5.5, length: 40, spacing: 0.5, angle: (x) => Math.PI / 2 - (x - CX) / t.w * 1.25, color: (x, y) => mix(color(x, y), '#0a1658', 0.2), stroke: { ...line, opacity: 0.96 } });
  for (const k of [-0.7, -0.35, 0, 0.35, 0.7]) p.tryStroke({ brush: 'round', color: '#8cb0ff', width: 4, opacity: 0.7, points: [[CX + k * 8, 124], [CX + k * (t.w / 2 - 6), t.y0]] }); }   // the ribs of the cone

// ---------------------------------------------------------------- the storeys, from the top down: each stands behind the rim of the one under it
drum(CX, TIERS[0].w, TIERS[0].y0, TIERS[0].y1);
drum(CX, TIERS[1].w, TIERS[1].y0, TIERS[1].y1);
drum(CX, TIERS[2].w, TIERS[2].y0, TIERS[2].y1);
// the skirt of roofs: two wide rings of roof, one under the other, that stand out from the tower. Each is ribbed, and its lower edge is a line of light.
for (const [y0, y1, w0, w1] of [[520, 566, 316, 470], [556, 606, 400, 590]]) {
  const quad = [[CX - w0 / 2, y0], [CX + w0 / 2, y0], [CX + w1 / 2, y1], [CX - w1 / 2, y1]], t = depth((y0 + y1) / 2);
  p.fill({ inside: inPoly(quad), bounds: [CX - w1 / 2, y0, CX + w1 / 2, y1], width: 6, length: 40, spacing: 0.5, angle: (x) => Math.PI / 2 - (x - CX) / w1 * 1.5, color: (x, y) => mix(glass(clamp(t + 0.05 + (rod(x) - 0.5) * 0.2, 0, 1)), '#06103c', Math.pow(Math.abs(x - CX) / (w1 / 2), 2) * 0.4), stroke: { ...line, opacity: 0.96 } });
  for (let k = -1; k <= 1.001; k += 0.125) p.tryStroke({ brush: 'round', color: '#d8ecff', width: 4, opacity: 0.6, points: [[CX + k * w0 / 2, y0 + 1], [CX + k * w1 / 2, y1 - 1]] });
  p.stroke({ ...line, cap: 'round', color: mix(glass(clamp(t + 0.3, 0, 1)), '#ffffff', 0.5), width: 6.5, points: [[CX - w1 / 2 - 6, y1 - 3], [CX, y1 + 3], [CX + w1 / 2 + 6, y1 - 3]] });
  for (let k = -1; k <= 1.001; k += 0.125) { const x = CX + k * (w1 / 2 + 4), y = y1 + 3 - 6 * k * k; p.tryStroke({ brush: 'round', color: '#ffffff', width: 4, opacity: 0.8, points: [[x, y], [x, y + 13]] }); }   // a point hangs from the end of each rib
}
drum(CX, TIERS[3].w, TIERS[3].y0 + 8, TIERS[3].y1, { points: false });
drum(CX, TIERS[4].w, TIERS[4].y0, TIERS[4].y1);

// Thin spires stand up from the rims of the storeys, the tallest at the corners; each is a line of light against the moon or the night.
for (const [i, list] of [[0, [[-0.92, 46], [0.92, 46], [-0.5, 28], [0.5, 28]]], [1, [[-0.95, 62], [0.95, 62], [-0.62, 34], [0.62, 34], [-0.3, 24], [0.3, 24]]], [2, [[-0.97, 78], [0.97, 78], [-0.72, 44], [0.72, 44], [-0.46, 30], [0.46, 30]]]]) {
  const t = TIERS[i];
  for (const [k, h] of list) { const x = CX + k * (t.w / 2 + 4), y = t.y0 - 2; p.tryStroke({ ...line, cap: 'round', rag: 0.03, color: mix(glass(clamp(depth(y - h / 2) + 0.1, 0, 1)), '#0c1c6c', 0.35), width: 5.5, taper: [0, 0.9], points: [[x, y + 4], [x, y - h * 0.5], [x, y - h]] }); p.tryStroke({ brush: 'round', color: '#e8f2ff', width: 4, opacity: 0.75, taper: [0.1, 0.8], points: [[x - 1.4, y + 2], [x - 1.4, y - h * 0.8]] }); }
}
// Small bright places on the glass, where the moon strikes it.
for (let k = 0; k < 34; k++) { const t = TIERS[Math.floor(r() * 5)], x = CX + r.range(-0.44, 0.44) * t.w, y = r.range(t.y0 + 16, Math.min(t.y1, FOOT) - 20); p.tryStroke({ brush: 'round', color: '#ffffff', width: 4, opacity: r.range(0.5, 0.95), taper: [0.5, 0.5], points: [[x, y - 6.4], [x, y + 6.4]] }); }

// ---------------------------------------------------------------- the hall at the right, and a smaller one at the left
function hall(xc, w, y0, y1, peak) {
  const roof = [[xc - w / 2 - 14, y0], [xc - 10, peak], [xc + 10, peak], [xc + w / 2 + 14, y0]], color = wall(xc, w);
  p.fill({ inside: inPoly(roof), bounds: [xc - w / 2 - 14, peak, xc + w / 2 + 14, y0], width: 6, length: 46, spacing: 0.5, angle: (x) => Math.PI / 2 - (x - xc) / w * 1.9, color: (x, y) => mix(color(x, y), '#0a1658', 0.25), stroke: { ...line, opacity: 0.96 } });
  for (let k = -1; k <= 1.001; k += 0.2) p.tryStroke({ brush: 'round', color: '#a8c8ff', width: 4, opacity: 0.6, points: [[xc + k * 9, peak + 2], [xc + k * (w / 2 + 12), y0]] });
  p.stroke({ ...line, cap: 'round', color: '#16308c', width: 5, points: [[xc, peak - 44], [xc, peak + 6]] });
  drum(xc, w, y0, y1, { over: 14, points: false });
}
hall(1290, 250, 600, 900, 500);
hall(332, 170, 660, 900, 590);

// ---------------------------------------------------------------- the bridges in front
bridge([[CX - 150, 440], [CX - 360, 520], [CX - 600, 620], [CX - 860, 640]], 820, false);
bridge([[CX + 150, 440], [CX + 360, 520], [CX + 600, 620], [CX + 860, 640]], 820, false);

// ---------------------------------------------------------------- the mist that the castle stands in: white, with its own light
for (let k = 0; k < 26; k++) { const x = r.range(-200, W - 200), len = r.range(400, 900), y = r.range(760, 860), w = r.range(40, 90); p.stroke({ brush: 'soft', color: mix('#bcdcff', '#ffffff', r()), width: w, opacity: r.range(0.1, 0.2) * smooth(1000, 300, Math.abs(x + len / 2 - CX)) + 0.04, points: [[x, y], [x + len / 2, y + r.range(-8, 8)], [x + len, y]] }); }
for (const [w, op, n] of [[420, 0.07, 4], [260, 0.1, 5]]) glow(p, CX, 800, w, '#e8f4ff', op, n, 0.45);
// and the light of the castle in the air about it
for (const [x, y, w] of [[CX, 640, 300], [CX - 330, 720, 200], [CX + 420, 700, 240]]) glow(p, x, y, w, '#6ca0f4', 0.045, 4);

p.save();
