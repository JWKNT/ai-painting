// The Ice Temple of the Chozo, on the far shore. It stands on a shelf of dark rock with
// snow on it. The great tower is round, of grey stone in courses, with a ring of gallery
// near its top and a roof like that of a pagoda: a dark cap with snow on it and wide red
// eaves that curl up at their ends. A long hall with a row of arches joins it at the
// right, with a pale ribbed dome over it; beyond the hall is a second tower, smaller and
// further off. The snow that falls is between us and all of it. Lamps still burn at the
// door of the tower and at the foot of the shelf.
'use strict';
const { studio, open, W, SHORE, TOWER, veil, nA, nC, nD, hash } = require('./scene');
const { mix, clamp, smooth, through, shape, glow } = studio;

const p = open('temple');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.12, cap: 'flat' };
const AIR = 0.28;                                                          // how much of the falling snow is between us and the temple
const cx = TOWER.x, by = TOWER.base;
const air = (c, x, y, more = 0) => veil(c, x, y, AIR + more);
// Stone: grey with a little brown; each course has its own tone. `turn` is -1 where it faces the light at the left and 1 where it is turned from it.
const stone = (x, y, turn) => { const course = hash(Math.floor(y / 21), Math.floor(x / 46 + (Math.floor(y / 21) % 2) * 0.5)); let c = mix('#7e7a70', '#9c988c', course); c = mix(c, '#cfcfc6', smooth(0, -1, turn) * 0.45); return mix(c, '#2c2e32', smooth(-0.3, 1, turn) * 0.8); };
// A round part of a tower between two heights: upright strokes, light at the left and dark at the right; then the lines between its courses.
function drum(x0, y0, y1, h0, h1, more = 0) {
  const half = (y) => h0 + (h1 - h0) * (y - y0) / (y1 - y0);
  p.fill({ inside: (x, y) => y >= y0 && y <= y1 && Math.abs(x - x0) < half(y), bounds: [x0 - Math.max(h0, h1), y0, x0 + Math.max(h0, h1), y1], width: 6.5, length: clamp((y1 - y0) * 0.7, 14, 60), spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: (x, y) => air(stone(x, y, Math.sin((x - x0) / half(y) * 1.45)), x, y, more), stroke: { ...line, opacity: 0.97 } });
  for (let y = y0 + 20; y < y1 - 6; y += 21) { const hw = half(y) - 4; if (hw > 8) p.tryStroke({ brush: 'round', color: air('#4a4a4c', x0, y, more), width: 4, opacity: 0.3, points: [[x0 - hw, y - 2], [x0, y + 2], [x0 + hw, y - 2]] }); }
}
// A roof of the Chozo over a tower: a dark cap with hollow sides and snow on it, a point on its top, and red eaves that curl up.
function roof(x0, y0, wide, high, more = 0) {
  const k = wide / 150, cap = [[x0 - 122 * k, y0 - 4], [x0 - 76 * k, y0 - 30 * k], [x0 - 42 * k, y0 - high * 0.76], [x0, y0 - high], [x0 + 42 * k, y0 - high * 0.76], [x0 + 76 * k, y0 - 30 * k], [x0 + 122 * k, y0 - 4]];
  p.tryStroke({ ...line, color: air('#2a2c30', x0, y0 + 12 * k, more), width: Math.max(8, 16 * k), points: [[x0 - 70 * k, y0 + 12 * k], [x0 + 70 * k, y0 + 12 * k]] });                                       // the dark under the eaves
  shape(p, cap, { shadow: air('#22262a', x0, y0, more), half: air('#3c4448', x0, y0, more), lit: air('#6c787c', x0, y0, more), bounce: air('#30363a', x0, y0, more) }, { light: [-0.5, -0.86], turn: 0.1, width: 5.5, length: Math.max(14, 30 * k), round: 14 * k, vary: 0.05, flow: (x) => (x < x0 ? -0.5 : 0.5), edge: false });
  for (let i = 0; i < 2; i++) p.tryStroke({ ...line, cap: 'round', rag: 0.3, color: air(i ? '#f4f6f8' : '#d4dce0', x0, y0, more), width: Math.max(5, (i ? 7 : 10) * k), points: [[x0 - (100 - i * 30) * k, y0 - (14 + i * 8) * k], [x0 - (64 - i * 14) * k, y0 - (36 + i * 16) * k], [x0 - (38 - i * 10) * k, y0 - high * (0.7 + i * 0.1)]] });   // snow on its left side
  p.tryStroke({ ...line, cap: 'round', rag: 0.3, color: air('#c4ccd2', x0, y0, more), width: Math.max(5, 7 * k), opacity: 0.8, points: [[x0 + 50 * k, y0 - high * 0.62], [x0 + 80 * k, y0 - 26 * k], [x0 + 108 * k, y0 - 12 * k]] });
  // the eaves: one long band that sags a little and comes up at each end; bright red at the left, where the light is, and deep red at the right
  for (const [s, c] of [[-1, '#5e2018'], [1, '#42160f']]) p.tryStroke({ ...line, cap: 'round', color: air(c, x0, y0, more), width: Math.max(6, 15 * k), points: [[x0, y0 + 13 * k], [x0 + s * 76 * k, y0 + 11 * k], [x0 + s * 126 * k, y0 + 1 * k], [x0 + s * 146 * k, y0 - 14 * k]] });   // their under side, which we see from below: a deep red
  for (const [s, c] of [[-1, '#b8442e'], [1, '#7c2a20']]) p.tryStroke({ ...line, cap: 'round', color: air(c, x0, y0, more), width: Math.max(6, 15 * k), points: [[x0, y0 + 4 * k], [x0 + s * 80 * k, y0 + 2 * k], [x0 + s * 134 * k, y0 - 9 * k], [x0 + s * 154 * k, y0 - 26 * k]] });
  for (const s of [-1, 1]) p.tryStroke({ ...line, cap: 'round', color: air(s < 0 ? '#d45a3c' : '#96342a', x0, y0, more), width: Math.max(5, 7 * k), taper: [0, 0.6], points: [[x0 + s * 146 * k, y0 - 18 * k], [x0 + s * 160 * k, y0 - 34 * k], [x0 + s * 158 * k, y0 - 50 * k]] });   // the curled ends
  p.tryStroke({ brush: 'round', color: air('#eef2f4', x0, y0, more), width: 4, opacity: 0.85, points: [[x0 - 130 * k, y0 - 14 * k], [x0 - 70 * k, y0 - 5 * k], [x0 - 6 * k, y0 - 3 * k]] });                 // snow along the top of the eaves
  p.tryStroke({ ...line, cap: 'round', color: air('#2e3236', x0, y0 - high, more), width: Math.max(5, 6 * k), taper: [0, 0.7], points: [[x0, y0 - high + 4], [x0, y0 - high - Math.max(14, 34 * k)]] });        // the point on its top
}

// ---------------------------------------------------------------- the second tower, beyond the hall
drum(1452, 262, 344, 32, 38, 0.2);
roof(1452, 262, 70, 44, 0.2);

// ---------------------------------------------------------------- the hall: a long wall with a row of arches, and a pale dome over it
{ const top = (x) => 322 + (x - 1084) * 0.03, wallAt = (x, y) => air(mix(stone(x, y, -0.1 + (x - 1084) / 900), '#5c5c5c', smooth(top(x) + 30, by, y) * 0.2), x, y, 0.06);
  // the dome, behind the top of the wall: pale, ribbed, with snow on its upper left
  { const dx = 1238, dy = 324, rx = 104, ry = 82, dome = []; for (let i = 0; i <= 16; i++) { const a = Math.PI + Math.PI * i / 16; dome.push([dx + Math.cos(a) * rx, dy + Math.sin(a) * ry]); }
    shape(p, dome, { shadow: air('#4c5a5c', dx, dy, 0.1), half: air('#7e908e', dx, dy, 0.1), lit: air('#b8c8c4', dx, dy, 0.1), bounce: air('#5c6a6c', dx, dy, 0.1) }, { light: [-0.5, -0.86], turn: 0, width: 6, length: 30, round: 40, vary: 0.05, flow: (x, y) => Math.atan2(y - dy, x - dx) + Math.PI / 2, edge: false });
    for (const k of [-0.75, -0.4, 0, 0.4, 0.75]) { const pts = []; for (let i = 0; i <= 6; i++) { const v = i / 6; pts.push([dx + k * rx * Math.sqrt(1 - v * v * 0.98), dy - v * ry]); } p.tryStroke({ brush: 'round', color: air('#3e4a4c', dx, dy, 0.1), width: 4, opacity: 0.45, points: pts }); }
    for (const [a0, a1, w] of [[3.5, 4.3, 12], [3.9, 4.75, 9]]) p.tryStroke({ ...line, cap: 'round', rag: 0.3, color: air('#f0f4f6', dx, dy, 0.1), width: w, points: studio.arc(dx, dy, rx * 0.9, a0, a1, 6).map(([x, y]) => [x, dy + (y - dy) * ry / rx]) });
    p.tryStroke({ ...line, cap: 'round', color: air('#3a4244', dx, dy, 0.1), width: 5.5, taper: [0, 0.7], points: [[dx, dy - ry + 3], [dx, dy - ry - 22]] }); }
  p.fill({ inside: (x, y) => x > 1084 && x < 1512 && y > top(x) && y < by + 6, bounds: [1084, 318, 1512, by + 6], width: 6.5, length: 50, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2, color: wallAt, stroke: { ...line, opacity: 0.97 } });
  // the arches: each a dark hollow with a round head, and a pale pier between each two
  for (let x = 1128; x < 1500; x += 62) { const t = (x - 1084) / 430, h = 70 - t * 8, y1 = by - 4 - t * 2;
    p.tryStroke({ ...line, cap: 'round', color: air('#26282c', x, y1, 0.06), width: 26 - t * 4, points: [[x, y1], [x, y1 - h]] });
    p.tryStroke({ brush: 'round', color: air('#b4b4ac', x, y1, 0.06), width: 4.4, opacity: 0.7, points: [[x - 17 + t * 2, y1], [x - 17 + t * 2, y1 - h + 8]] });
    p.tryStroke({ ...line, color: air(mix('#8e8a80', '#a8a498', r()), x, y1, 0.06), width: 9, points: [[x + 31, y1 + 2], [x + 31, y1 - h - 10]] }); }
  // the top of the wall: a band that stands out a little, with snow on it
  p.tryStroke({ ...line, color: air('#a09c90', 1300, 322, 0.06), width: 9, points: [[1082, top(1084) + 5], [1300, top(1300) + 5], [1514, top(1512) + 5]] });
  p.tryStroke({ ...line, cap: 'round', rag: 0.4, color: air('#f2f5f6', 1300, 318, 0.06), width: 6, points: [[1080, top(1084) - 1], [1300, top(1300) - 1], [1516, top(1512) - 1]] });
  p.tryStroke({ brush: 'round', color: air('#3c3c40', 1300, 334, 0.06), width: 4, opacity: 0.5, points: [[1084, top(1084) + 13], [1300, top(1300) + 13], [1512, top(1512) + 13]] }); }

// ---------------------------------------------------------------- the great tower
drum(cx, 244, by + 4, 72, 80);
for (const [dx, y] of [[-36, 300], [30, 340], [-10, 372]]) p.tryStroke({ ...line, cap: 'round', color: air('#2a2c30', cx, y), width: 7, points: [[cx + dx, y], [cx + dx, y + 26]] });   // narrow windows
// its door, and the lamp that burns in it
p.tryStroke({ ...line, cap: 'round', color: air('#1e1e20', cx, by), width: 30, points: [[cx - 4, by + 4], [cx - 4, by - 44]] });
for (const [w, op] of [[70, 0.1], [40, 0.2], [20, 0.36]]) glow(p, cx - 4, by - 16, w, mix('#ff9430', '#ffe2a0', 1 - w / 80), op, 6);
p.tryStroke({ ...line, cap: 'round', color: '#ffecb8', width: 6, taper: [0.2, 0.7], points: [[cx - 4, by - 4], [cx - 5, by - 24]] });
// the ring of gallery: wider than the tower, with snow on it and a row of small dark openings under its rail
p.tryStroke({ ...line, color: air('#4a4a4c', cx, 250), width: 12, points: [[cx - 78, 250], [cx + 78, 250]] });
drum(cx, 222, 244, 92, 90);
p.tryStroke({ ...line, cap: 'round', rag: 0.4, color: air('#f2f5f6', cx, 222), width: 6.5, points: [[cx - 96, 221], [cx - 10, 224], [cx + 60, 221]] });
for (let x = cx - 76; x <= cx + 76; x += 19) p.tryStroke({ brush: 'round', color: air('#34363a', x, 232), width: 4.6, opacity: 0.8, points: [[x, 227], [x, 240]] });
drum(cx, 184, 222, 60, 62);
for (const dx of [-34, 0, 34]) p.tryStroke({ ...line, cap: 'round', color: air('#26282c', cx, 200), width: 11, points: [[cx + dx, 220], [cx + dx, 194]] });
roof(cx, 184, 150, 74);

// ---------------------------------------------------------------- the shelf of rock that it stands on
// Dark rock in beds that lean, with snow on each ledge and a thick cap of snow along its top.
{ const top = through([[660, 470], [720, 452], [800, 446], [900, 450], [1000, 446], [1120, 450], [1260, 444], [1400, 448], [1520, 440], [1620, 436]]), foot = (x) => SHORE + 5 * (nC(x / 40, 6) - 0.5);
  p.fill({ inside: (x, y) => x > 650 && y > top(x) + 5 * (nC(x / 22, 4) - 0.5) && y < foot(x), bounds: [650, 430, W, SHORE + 6], width: 7, length: 44, spacing: 0.5, overlap: 0.6, angle: () => 0.16 + r.range(-0.2, 0.2),
    color: (x, y) => { const bed = nA(x / 50, (y - x * 0.16) / 9), snow = smooth(0.6, 0.72, nD(x / 60, y / 9)); return air(mix(mix('#2e3338', '#565c60', bed), '#e6ecee', snow * 0.9), x, y, -0.08); }, stroke: { ...line, cap: 'round', rag: 0.4, opacity: 0.96 } });
  for (let x = 660; x < W; x += r.range(40, 90)) { const l = r.range(50, 130); p.tryStroke({ ...line, cap: 'round', rag: 0.4, color: air(mix('#e4eaec', '#fafcfc', r()), x, 448, -0.08), width: r.range(8, 14), points: [[x, top(x) + 3], [x + l / 2, top(x + l / 2) - 1], [x + l, top(x + l) + 3]] }); }
  // great blocks have come down at its left end, and lie in the edge of the lake
  for (const [x, y, w, h] of [[700, 486, 70, 30], [770, 492, 50, 22], [640, 494, 60, 20]]) { p.tryStroke({ ...line, cap: 'round', rag: 0.4, color: air('#3c4246', x, y, -0.1), width: h, points: [[x - w / 2, y], [x + w / 2, y]] }); p.tryStroke({ ...line, cap: 'round', rag: 0.4, color: air('#eef2f4', x, y, -0.1), width: Math.max(6, h * 0.4), points: [[x - w / 2 + 4, y - h * 0.4], [x + w / 2 - 6, y - h * 0.4]] }); }
  // a second lamp, low at the foot of the shelf
  for (const [w, op] of [[60, 0.1], [34, 0.2], [17, 0.36]]) glow(p, 868, 474, w, mix('#ff9430', '#ffe2a0', 1 - w / 70), op, 6);
  p.tryStroke({ ...line, cap: 'round', color: '#ffecb8', width: 5.5, taper: [0.2, 0.7], points: [[868, 482], [867, 466]] }); }

// ---------------------------------------------------------------- the falling snow lies like a thin mist about the foot of the temple
for (let k = 0; k < 14; k++) { const x = r.range(600, W - 200), len = r.range(260, 600), y = r.range(380, 470); p.stroke({ brush: 'soft', color: mix('#c8d2d8', '#eef2f2', r()), width: r.range(24, 50), opacity: r.range(0.05, 0.11), points: [[x, y], [x + len / 2, y + r.range(-6, 6)], [x + len, y]] }); }

p.save();
