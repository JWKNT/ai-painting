// The hall: its wall of gold, the three tall windows with the sign of the kingdom in
// each, the pillars between them, and the floor of orange squares, on which each window
// lays a long bright shape of itself.
'use strict';
const { studio, open, W, H, BASE, VP, STEP, rowT, rowOf, WINDOWS, WIN, COLS, nA, nC, inArch, windowAt, floorAt, onFloor, pool } = require('./scene');
const { mix, clamp, smooth, glow, arc } = studio;

const p = open('hall');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.12, cap: 'round' };
const flat = { ...line, cap: 'flat', mix: 0.05 };

// ---------------------------------------------------------------- the wall
// It is gold. It is brighter round each window, where the light comes in, and darker up in the corners.
const nearWindow = (x, y) => { let d = 1e9; for (const cx of WINDOWS) d = Math.min(d, Math.hypot((x - cx) * 0.8, (y - 330) * 0.5)); return Math.exp(-Math.pow(d / 190, 2)); };
const wall = (x, y) => { let c = mix('#d08c24', '#f0b230', clamp(y / BASE + 0.15, 0, 1)); c = mix(c, '#ffd458', nearWindow(x, y) * 0.6); c = mix(c, '#b06c20', (nA(x / 140, y / 60) - 0.5) * 0.24); return y > WIN.sill + 26 ? mix(c, '#c07a22', 0.45) : c; };
p.fill({ inside: (x, y) => windowAt(x, y, 8) < 0, bounds: [0, 0, W, BASE + 4], width: 12, length: 90, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.03, 0.03), color: wall, stroke: { ...line, opacity: 0.96 } });
// courses of stone: thin level lines, a little darker
for (let y = 44; y < WIN.sill; y += 56) p.tryStroke({ brush: 'round', color: '#a86820', width: 4, opacity: 0.22, points: [[-10, y], [W / 2, y + 1], [W + 10, y]] });
// the low part of the wall, under the windows: a rail along its top, and a foot along the floor
p.tryStroke({ ...flat, color: '#ffd058', width: 9, points: [[-10, WIN.sill + 22], [W / 2, WIN.sill + 22], [W + 10, WIN.sill + 22]] });
p.tryStroke({ ...flat, color: '#9c5c1c', width: 6, points: [[-10, WIN.sill + 30], [W / 2, WIN.sill + 30], [W + 10, WIN.sill + 30]] });
p.tryStroke({ ...flat, color: '#8c4c1c', width: 12, points: [[-10, BASE - 4], [W / 2, BASE - 4], [W + 10, BASE - 4]] });
p.tryStroke({ ...flat, color: '#e8a838', width: 5, points: [[-10, BASE - 12], [W / 2, BASE - 12], [W + 10, BASE - 12]] });

// ---------------------------------------------------------------- the windows
for (const cx of WINDOWS) {
  // the glass: pale and full of light, most of all in its middle
  p.fill({ inside: (x, y) => inArch(x - cx, y), bounds: [cx - WIN.half, 60, cx + WIN.half, WIN.sill], width: 10, length: 70, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.05, 0.05), color: (x, y) => { let c = mix('#ffe9a0', '#fffbe4', Math.exp(-Math.pow(Math.hypot(x - cx, (y - 340) * 0.6) / 150, 2))); return mix(c, '#ffd870', (nC(x / 30, y / 50) - 0.5) * 0.3); }, stroke: { ...line, rag: 0.05, opacity: 0.97 } });
  // the bars of the window: one up the middle, two more at the sides, and bars across
  const bar = (pts, w = 5.4, c = '#e8a424') => p.tryStroke({ ...flat, color: c, width: w, opacity: 0.9, points: pts });
  bar([[cx, WIN.sill], [cx, 300]]); bar([[cx - 75, WIN.sill], [cx - 75, 262]]); bar([[cx + 75, WIN.sill], [cx + 75, 262]]);
  for (const y of [468, 388]) bar([[cx - WIN.half, y], [cx + WIN.half, y]]);
  // The sign of the kingdom. Under the bars across are its three points: two that point up, and one between them that points down.
  for (const [ax, s] of [[-75, 1], [75, 1], [0, -1]]) { const y0 = 428 + s * 30, y1 = 428 - s * 30; bar([[cx + ax - 34, y0], [cx + ax, y1], [cx + ax + 34, y0]], 6.5, '#f0ac28'); bar([[cx + ax - 34, y0], [cx + ax + 34, y0]], 6.5, '#f0ac28'); }
  // Over them is the ring with its wings.
  const ey = 250;
  for (let k = 0; k < 2; k++) p.tryStroke({ ...line, mix: 0, color: k ? '#ffc840' : '#e89c20', width: k ? 14 : 22, points: arc(cx, ey, k ? 20 : 24, 0, Math.PI * 2, 24) });
  p.tryStroke({ ...line, mix: 0, color: '#ffd860', width: 16, points: [[cx - 8, ey], [cx + 8.4, ey]] });
  for (const s of [-1, 1]) for (const [dy, len, w] of [[-10, 92, 15], [6, 76, 13], [20, 54, 11]]) p.tryStroke({ ...line, mix: 0, color: mix('#e89c20', '#f8bc38', r()), width: w, taper: [0, 0.75], points: [[cx + s * 30, ey + dy], [cx + s * (30 + len * 0.55), ey + dy - 16], [cx + s * (30 + len), ey + dy - 10 - len * 0.2]] });
  // lines from the ring up into the point of the arch
  for (const a of [-2.3, -1.57, -0.84]) bar([[cx + Math.cos(a) * 46, ey + Math.sin(a) * 46], [cx + Math.cos(a) * 118, ey + Math.sin(a) * 118]], 5, '#e8a424');
  // the frame of the window: a dark line, then a bright one
  const edge = (grow) => { const pts = []; pts.push([cx - WIN.half - grow, WIN.sill]); pts.push([cx - WIN.half - grow, WIN.spring]); for (let i = 1; i <= 14; i++) { const a = Math.PI - Math.acos(WIN.c / (WIN.R + grow)) * i / 14; pts.push([cx + WIN.c + Math.cos(a) * (WIN.R + grow), WIN.spring - Math.sin(a) * (WIN.R + grow)]); } const right = pts.slice(0, -1).reverse().map(([x, y]) => [2 * cx - x, y]); return pts.concat(right); };
  p.tryStroke({ ...line, mix: 0.02, color: '#a86018', width: 9, points: edge(6) });
  p.tryStroke({ ...line, mix: 0.02, color: '#ffe078', width: 6, points: edge(14) });
  p.tryStroke({ ...flat, color: '#ffe078', width: 10, points: [[cx - WIN.half - 22, WIN.sill + 6], [cx + WIN.half + 22, WIN.sill + 6]] });
  for (const [w, op] of [[300, 0.05], [190, 0.07]]) glow(p, cx, 330, w, '#fff0b0', op, 6, 1.3);
}

// ---------------------------------------------------------------- the pillars of the wall
for (const x of COLS) {
  const w = 30;
  p.fill({ inside: (px, py) => Math.abs(px - x) < w && py > 96 && py < BASE - 14, bounds: [x - w, 96, x + w, BASE - 14], width: 8, length: 90, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (px) => { const k = (px - x) / w; return mix(mix('#ffe070', '#f0ac30', Math.abs(k)), '#a86420', smooth(0.3, 1, Math.abs(k)) * 0.7); }, stroke: { ...flat, opacity: 0.97 } });
  for (const k of [-0.5, 0, 0.5]) p.tryStroke({ brush: 'round', color: '#b87424', width: 4, opacity: 0.4, points: [[x + k * w, 104], [x + k * w, BASE - 22]] });    // its flutes
  for (const [y, ww, h, c] of [[84, w + 16, 18, '#ffd860'], [66, w + 26, 14, '#f0b030'], [BASE - 12, w + 12, 18, '#e8a030'], [BASE + 2, w + 20, 12, '#b8701f']]) p.tryStroke({ ...flat, color: c, width: h, points: [[x - ww, y], [x + ww, y]] });
  p.tryStroke({ brush: 'round', color: '#8c4c1c', width: 4, opacity: 0.6, points: [[x - w - 14, 94], [x + w + 14, 94]] });
}

// ---------------------------------------------------------------- the floor
// Squares of two oranges, which get bigger toward us. Where a window lays its light, the squares are yellow.
const tile = (x, y) => { const { t, u } = floorAt(x, y), i = Math.floor((u - VP.x) / STEP), k = rowOf(t), odd = ((i + k) % 2 + 2) % 2, l = pool(x, y);
  let c = odd ? mix('#c4642a', '#ffbc48', l) : mix('#de8434', '#ffe488', l);
  c = mix(c, '#7c3c24', (1 - smooth(1.0, 1.1, t)) * 0.45);                                                   // the shade at the foot of the wall
  return mix(c, odd ? '#a8501f' : '#f09c3c', (nA(x / 50, y / 22) - 0.5) * 0.2); };
p.fill({ bounds: [0, BASE, W, H + 4], width: 9, length: 70, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: tile, stroke: { ...flat, rag: 0.05, opacity: 0.97 } });
p.fill({ bounds: [0, BASE, W, H + 4], width: 5.5, length: 34, spacing: 0.9, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => tile(x + r.range(-2, 2), y + r.range(-1, 1)), stroke: { ...flat, rag: 0.05, opacity: 0.9 } });
// the lines between the squares
for (let k = 1; k < 12; k++) { const y = VP.y + (BASE - VP.y) * rowT(k); if (y > H + 4 || y < BASE) break; p.tryStroke({ brush: 'round', color: '#8c441e', width: 4, opacity: 0.45, points: [[-10, y], [W / 2, y], [W + 10, y]] }); }
for (let i = -30; i <= 30; i++) { const [x0, y0] = onFloor(VP.x + i * STEP, 1.01), [x1, y1] = onFloor(VP.x + i * STEP, (H + 10 - VP.y) / (BASE - VP.y)); if (Math.min(x0, x1) > W + 40 || Math.max(x0, x1) < -40) continue; p.tryStroke({ brush: 'round', color: '#8c441e', width: 4, opacity: 0.4, points: [[x0, y0], [x1, y1]] }); }

// ---------------------------------------------------------------- the light in the air: soft bars from each window down to its shape on the floor
for (const cx of WINDOWS) for (let k = 0; k < 9; k++) { const u = cx + (k - 4) * 30, [fx, fy] = onFloor(u, 1.45 + r.range(-0.1, 0.1)); p.tryStroke({ brush: 'soft', color: '#fff2b8', width: 50, opacity: 0.075, taper: [0.2, 0.9], points: [[u, 300], [(u + fx) / 2, (300 + fy) / 2], [fx, fy]] }); }

p.save();
