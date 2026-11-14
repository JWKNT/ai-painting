// Lumiere. It is a piece of Paris that was torn from the world, and nothing in it is whole.
// Its tower of iron stands at the left, bent over like a reed: we see its net of bars
// against the sky, with the lamps of the feast on it. Blocks of its houses hang in the air
// at the right, each with its stone front, its tall windows, its roof of slate and its
// chimneys, and broken stone under it. Along the foot of the picture are the roofs of the
// part of the city that still stands. The sides of all these that are turned to the
// number have a thin line of its gold.
'use strict';
const { studio, open, W, H, NUM, gold, nA, nC, hash } = require('./scene');
const { mix, clamp, smooth, inPoly, glow, through } = studio;

const p = open('lumiere');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0.02, rag: 0.08, cap: 'round' };
const IRON = '#070c10';
const lamp = (x, y, s = 1) => { glow(p, x, y, 13 * s, '#ffb050', 0.14, 6); p.tryStroke({ brush: 'round', color: mix('#ffd48c', '#fff4d8', r()), width: 4, opacity: 0.9, taper: [0.5, 0.5], points: [[x - 6.2, y], [x + 6.2, y]] }); };

// ---------------------------------------------------------------- the houses that hang in the air
// A block: (cx, cy) its middle, w and h its size, `tilt` how it leans, d how far off it is (0 near, 1 far).
function block(cx, cy, w, h, tilt, seed, d) {
  const c = Math.cos(tilt), sn = Math.sin(tilt), P = (u, v) => [cx + u * c - v * sn, cy + u * sn + v * c], haze = (col, x, y) => mix(col, '#1c3a42', d * 0.7);
  const rh = h * 0.26, top = -h / 2, wallTop = top + rh, bottom = (u) => h / 2 - 16 * nC(u / 26 + seed, 3) - (hash(Math.floor(u / 30), seed) > 0.6 ? 14 : 0);
  const toNum = cx > NUM.x ? -1 : 1;                                        // the end of it that is toward the number
  // the broken stone under it: dark pieces that hang, each ends in a point
  for (let u = -w / 2 + 8; u < w / 2 - 6; u += r.range(12, 26)) { const l = r.range(16, 54) * (1 - Math.abs(u) / w), a = P(u, bottom(u) - 4), b = P(u + r.range(-6, 6), bottom(u) + l); p.tryStroke({ ...line, rag: 0.3, color: haze(mix('#0a0f12', '#1c2428', r())), width: r.range(7, 13), taper: [0, 0.85], points: [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b] }); }
  // its front: stone, in shade; a little warm where the number lights its end
  const wall = [P(-w / 2, wallTop), P(w / 2, wallTop), P(w / 2, h / 2), P(-w / 2, h / 2)], xs = wall.map((q) => q[0]), ys = wall.map((q) => q[1]), poly = inPoly(wall);
  const local = (x, y) => [(x - cx) * c + (y - cy) * sn, -(x - cx) * sn + (y - cy) * c];
  p.fill({ inside: (x, y) => { if (!poly(x, y)) return false; const [u, v] = local(x, y); return v < bottom(u); }, bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 7, length: 44, spacing: 0.5, overlap: 0.6, angle: () => tilt + r.range(-0.02, 0.02),
    color: (x, y) => { const [u] = local(x, y), k = clamp(0.5 + toNum * u / w, 0, 1); return haze(mix(mix('#343a40', '#4c5052', nA(x / 30, y / 30)), '#8c7c58', k * k * 0.6)); }, stroke: { ...line, cap: 'flat', opacity: 0.97 } });
  p.tryStroke({ ...line, cap: 'flat', color: haze('#12181c'), width: Math.max(8, w * 0.07), opacity: 0.8, points: [P(-toNum * (w / 2 - w * 0.04), wallTop + 4), P(-toNum * (w / 2 - w * 0.04), h / 2 - 22)] });   // its far end is darker
  // the floors: a thin pale line between each two, and tall windows; some have a lamp inside
  const floors = Math.max(2, Math.round((h - rh) / 34));
  for (let f = 0; f < floors; f++) {
    const v = wallTop + (h - rh) * (f + 0.5) / floors;
    if (f > 0) p.tryStroke({ brush: 'round', color: haze('#6c6c68'), width: 4, opacity: 0.5, points: [P(-w / 2 + 3, v - (h - rh) / floors / 2), P(w / 2 - 3, v - (h - rh) / floors / 2)] });
    for (let u = -w / 2 + 16; u < w / 2 - 12; u += 22) { if (v + 8 > bottom(u) - 8) continue; const lit = hash(Math.floor(u), seed + f) < 0.4, a = P(u, v - 7), b = P(u, v + 7); if (lit) glow(p, ...P(u, v), 10, '#ffb050', 0.12, 6); p.tryStroke({ brush: 'round', color: lit ? mix('#ffc468', '#ffe8b0', r()) : haze('#0c1216'), width: lit ? 5 : 5.6, opacity: 0.95, points: [a, b] }); }
  }
  // its roof: slate, a little narrower at its top; small windows in it; chimneys on it
  const roof = [P(-w / 2 - 4, wallTop + 2), P(-w / 2 + 12, top), P(w / 2 - 12, top), P(w / 2 + 4, wallTop + 2)], rx = roof.map((q) => q[0]), ry = roof.map((q) => q[1]);
  p.fill({ inside: inPoly(roof), bounds: [Math.min(...rx), Math.min(...ry), Math.max(...rx), Math.max(...ry)], width: 6.5, length: 40, spacing: 0.5, overlap: 0.6, angle: () => tilt, color: (x, y) => { const [u] = local(x, y), k = clamp(0.5 + toNum * u / w, 0, 1); return haze(mix(mix('#1a262e', '#26343c', nA(x / 20, y / 20)), '#6c6450', k * k * 0.5)); }, stroke: { ...line, cap: 'flat', opacity: 0.97 } });
  for (let u = -w / 2 + 26; u < w / 2 - 20; u += 38) { const lit = hash(Math.floor(u), seed + 9) < 0.3; p.tryStroke({ brush: 'round', color: lit ? '#ffd080' : haze('#0a1014'), width: 5, points: [P(u, top + rh * 0.34), P(u, top + rh * 0.34 + 13)] }); }
  for (const u of [-w * 0.3, w * 0.08, w * 0.36]) { p.tryStroke({ ...line, cap: 'flat', color: haze('#2c2c2c'), width: 10, points: [P(u, top + 3), P(u, top - 18)] }); p.tryStroke({ ...line, cap: 'flat', color: haze('#5c4c3c'), width: 5, points: [P(u - 3, top - 22), P(u + 3, top - 22)].map(([x, y], i) => [x + (i ? 4 : -4) * c, y + (i ? 4 : -4) * sn]) }); }
  p.tryStroke({ brush: 'round', color: haze('#8c8478'), width: 4.4, opacity: 0.7, points: [P(-w / 2 - 4, wallTop + 2), P(0, wallTop + 2), P(w / 2 + 4, wallTop + 2)] });   // the edge of the roof
  // the gold of the number along the end of it that is toward the number
  p.tryStroke({ brush: 'round', color: mix('#c8a45c', '#ffe6a8', r()), width: 4.4, opacity: 0.8 * (1 - d * 0.6), taper: [0.1, 0.4], points: [P(toNum * (w / 2 + 2), top + 8), P(toNum * (w / 2 + 2), 0), P(toNum * (w / 2 + 2), h / 2 - 26)] });
  // small pieces of stone that hang in the air under it and beside it
  for (let k = 0; k < 9; k++) { const [x, y] = P(r.range(-w * 0.6, w * 0.6), h / 2 + r.range(20, 90)), l = r.range(12.6, 22), a = r.range(0, Math.PI); p.tryStroke({ ...line, rag: 0.4, color: haze(mix('#0c1216', '#2a3034', r())), width: r.range(5, 9), taper: [0.3, 0.3], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] }); }
}
block(1486, 270, 150, 104, 0.3, 5.1, 0.5);
block(1292, 470, 270, 180, -0.18, 2.3, 0.2);
block(1474, 716, 230, 160, 0.13, 8.7, 0.05);
block(1160, 792, 140, 104, -0.1, 4.4, 0.1);

// ---------------------------------------------------------------- the tower of iron
// A length of it: stations up its middle line, and half its width at each. We paint its two sides, a bar across at each station,
// and two bars that cross between each two stations. The sky shows through it.
function lattice(stations) {
  const n = stations.length, A = [], B = [];
  for (let i = 0; i < n; i++) { const a = stations[Math.max(0, i - 1)], b = stations[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l, w = stations[i][2]; A.push([stations[i][0] + nx * w, stations[i][1] + ny * w]); B.push([stations[i][0] - nx * w, stations[i][1] - ny * w]); }
  const bar = (a, b, w) => { if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= Math.max(12.5, w * 2.05)) p.tryStroke({ ...line, ...(w < 4.8 ? { brush: 'round' } : {}), mix: 0, color: IRON, width: w, points: [a, b] }); };
  for (let i = 0; i + 1 < n; i++) {
    const w = (stations[i][2] + stations[i + 1][2]) / 2, side = clamp(w * 0.16, 5, 13), thin = clamp(w * 0.09, 4.2, 7);
    if (w < 7) { bar([stations[i][0], stations[i][1]], [stations[i + 1][0], stations[i + 1][1]], Math.max(5, w * 2)); continue; }
    bar(A[i], A[i + 1], side); bar(B[i], B[i + 1], side);
    bar(A[i], B[i + 1], thin); bar(B[i], A[i + 1], thin); bar(A[i], B[i], thin);
    const lit = clamp(gold((A[i][0] + A[i + 1][0]) / 2, (A[i][1] + A[i + 1][1]) / 2, 700) * 1.3, 0, 1);   // the gold of the number along the side that is toward it
    if (Math.hypot(A[i + 1][0] - A[i][0], A[i + 1][1] - A[i][1]) >= 12.5) p.tryStroke({ brush: 'round', color: mix('#8c7848', '#f0d898', lit), width: 4, opacity: 0.25 + 0.5 * lit, points: [[A[i][0] + 3, A[i][1]], [A[i + 1][0] + 3, A[i + 1][1]]] });
  }
}
// stations along a smooth line through some places, closer together where the tower is thin
function along(ctrl) {
  const up = [...ctrl].sort((a, b) => a[1] - b[1]), xs = through(up.map((q) => [q[1], q[0]])), ws = through(up.map((q) => [q[1], q[2]])), out = []; let y = ctrl[0][1]; const y1 = ctrl[ctrl.length - 1][1];
  while (y > y1) { out.push([xs(y), y, ws(y)]); y -= clamp(ws(y) * 0.95, 15, 60); }
  out.push([xs(y1), y1, ws(y1)]); return out;
}
// Its two legs stand wide apart, with a bow between them; they meet at its first floor. Its body goes in to its second floor, and
// above that is its long neck, which is bent over to the right like a reed, so that its head hangs.
lattice(along([[52, 918, 48], [88, 842, 39], [124, 768, 30]]));
lattice(along([[342, 918, 48], [306, 842, 39], [270, 768, 30]]));
p.tryStroke({ ...line, mix: 0, color: IRON, width: 10, points: [[104, 916], [136, 836], [197, 796], [258, 836], [290, 916]] });
for (const [y, x0, x1, w] of [[766, 84, 310, 15], [748, 98, 296, 7]]) p.tryStroke({ ...line, cap: 'flat', mix: 0, color: IRON, width: w, points: [[x0, y], [x1, y]] });
lattice(along([[197, 748, 92], [203, 680, 66], [211, 606, 46]]));
p.tryStroke({ ...line, cap: 'flat', mix: 0, color: IRON, width: 11, points: [[158, 604], [264, 604]] });
lattice([...along([[212, 598, 40], [222, 520, 30], [240, 440, 23], [270, 364, 18]]), [292, 322, 16], [322, 286, 14], [358, 258, 12.5], [398, 240, 11], [440, 234, 9.5], [478, 242, 8], [508, 262, 6.5], [526, 290, 5]]);
// the lamps of the feast on it
for (let x = 96; x < 300; x += 26) lamp(x + r.range(-3, 3), 758);
for (let x = 164; x < 262; x += 24) lamp(x, 596, 0.8);
for (const [x, y] of [[224, 510], [242, 430], [274, 356], [326, 282], [400, 238], [480, 242], [526, 292]]) lamp(x, y, 0.8);

// ---------------------------------------------------------------- the roofs of the city, along the foot of the picture
// A row of houses seen from above their roofs: each roof is a slope of slate with its chimneys and its small lit windows.
{ const ridge = (x) => 908 + 30 * (hash(Math.floor((x + 40) / 150), 2) - 0.5) + 12 * (hash(Math.floor((x + 40) / 150), 7) > 0.5 ? 1 : 0) + (x - 800) * (x - 800) / 16000 * -1 + 26;
  p.fill({ inside: (x, y) => y > ridge(x), bounds: [0, 850, W, H + 4], width: 9, length: 60, spacing: 0.5, overlap: 0.6, angle: () => 0.5 + r.range(-0.1, 0.1), color: (x, y) => { const lit = gold(x, y - 300, 700); return mix(mix('#0c1418', '#1c2a32', nA(x / 40, y / 30)), '#5c5440', lit * 0.3 * smooth(40, 0, y - ridge(x))); }, stroke: { ...line, cap: 'flat', opacity: 0.97 } });
  for (let x = -20; x < W + 40; x += 150) { p.tryStroke({ ...line, cap: 'flat', color: '#04080b', width: 6, opacity: 0.8, points: [[x - 40 + 150, ridge(x + 10) - 2], [x - 40 + 150, H]] }); }   // the wall between two houses
  for (let x = 0; x < W; x += r.range(40, 90)) { const y = ridge(x); p.tryStroke({ ...line, cap: 'flat', color: mix('#1c1c1c', '#34302c', r()), width: r.range(11, 17), points: [[x, y + 6], [x, y - r.range(16, 34)]] }); p.tryStroke({ brush: 'round', color: '#8c7c58', width: 4, opacity: 0.5 * gold(x, y - 300, 700) + 0.1, points: [[x + (x < NUM.x ? 7 : -7), y + 2], [x + (x < NUM.x ? 7 : -7), y - 16]] }); }   // chimneys
  for (let x = 20; x < W; x += r.range(34, 70)) { const y = ridge(x) + r.range(26, 70); if (y > H - 10) continue; if (r() < 0.55) { glow(p, x, y, 11, '#ffb050', 0.14, 6); p.tryStroke({ brush: 'round', color: mix('#ffc468', '#ffe8b0', r()), width: 5, points: [[x, y - 7], [x, y + 7]] }); } else p.tryStroke({ brush: 'round', color: '#04080b', width: 5.4, points: [[x, y - 7], [x, y + 7]] }); }   // the windows in the roofs
  { const pts = []; for (let x = 0; x <= W; x += 10) pts.push([x, ridge(x) + 1]); studio.glint(p, pts, () => mix('#8c7c50', '#e0c888', r()), { width: 4.2, dash: 40, gap: 30, opacity: 0.55, rng: r }); }   // the gold of the number along the tops of the roofs
  // the feast: strings of lamps from chimney to chimney, and red and white flowers on the edges of the roofs
  for (const [x0, x1, y] of [[420, 640, 930], [700, 960, 922], [1040, 1300, 934]]) for (let i = 0; i <= 8; i++) { const t = i / 8; lamp(x0 + (x1 - x0) * t, y + 22 * 4 * t * (1 - t) - 12, 0.7); }
  for (let k = 0; k < 150; k++) { const x = r.range(380, W), y = ridge(x) + r.range(4, 16), l = r.range(12.4, 15), a = r.range(-0.5, 0.5); p.tryStroke({ ...line, rag: 0.3, color: r() < 0.62 ? mix('#8c141c', '#e03838', r()) : mix('#c8c0b8', '#fbf4ec', r()), width: r.range(4.8, 6.4), opacity: 0.9, taper: [0.5, 0.5], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] }); }
}

p.save();
