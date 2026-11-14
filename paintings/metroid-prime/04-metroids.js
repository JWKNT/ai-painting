// The Metroids. Each floats in the air with its bell up and its fangs under it. The bell is
// clear, like green glass: we see into it, so it is dark in its middle and bright round its
// edge, with a shine on the side where a light is. Inside it are its three red hearts.
// Under it are four fangs: two great ones that curve in like the horns of a beetle, and
// two small ones between them. Far ones are only a green light with a red point in it.
// One is in ice. The greatest comes down toward Samus with its fangs wide.
'use strict';
const { studio, open, BIG, ICED, PHAZON, fungal, phazon, nA, nC } = require('./scene');
const { mix, clamp, smooth, glow, disc, glint } = studio;

const p = open('metroids');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.08, cap: 'round' };

// A Metroid at (x, y), with a bell of the radius R; `a` is the way that the top of its bell points. `o.ice` puts it in ice;
// `o.dim` (0 to 1) is how far off it is in the dark.
function metroid(x, y, R, a, o = {}) {
  const T = [Math.cos(a), Math.sin(a)], Sd = [-Math.sin(a), Math.cos(a)], P = (u, v) => [x + (Sd[0] * u + T[0] * v) * R, y + (Sd[1] * u + T[1] * v) * R];
  const local = (px, py) => [((px - x) * Sd[0] + (py - y) * Sd[1]) / R, ((px - x) * T[0] + (py - y) * T[1]) / R];
  const dim = o.dim || 0, ice = o.ice ? 0.6 : 0, tint = (c) => mix(mix(c, '#cfeaff', ice), '#0a1428', dim * 0.7);
  const blue = phazon(x, y + R, 420), cyan = fungal(x, y);
  // its light in the air
  for (const [k, op] of [[3.0, 0.05], [1.9, 0.08]]) glow(p, x, y, R * k, tint('#46dc5c'), op * (1 - dim * 0.5), 5);
  if (R < 26) {                                                             // far off: a round green light with a red point in it
    glow(p, x, y, Math.max(9, R * 1.5), tint('#7cf078'), 0.2, 8);
    glow(p, x, y, Math.max(9, R * 0.9), tint('#c8ffb0'), 0.16, 8);
    glow(p, x, y + 1, 9, tint('#ff4c30'), 0.5, 8);
    return;
  }
  // its fangs, first those of the far side: each is thick where it leaves the bell and comes to a point, and curves in
  const fang = (s, b, c, t, w, tone) => { const pts = []; for (let i = 0; i <= 8; i++) { const q = i / 8; pts.push(P(s * ((1 - q) * (1 - q) * b[0] + 2 * q * (1 - q) * c[0] + q * q * t[0]), (1 - q) * (1 - q) * b[1] + 2 * q * (1 - q) * c[1] + q * q * t[1])); }
    p.tryStroke({ ...line, color: tint(tone[0]), width: Math.max(5, R * w), taper: [0, 0.9], points: pts });
    p.tryStroke({ ...line, color: tint(tone[1]), width: Math.max(4.8, R * w * 0.56), taper: [0.1, 0.9], points: pts.map(([px, py]) => [px + s * Sd[0] * R * w * 0.16 + T[0] * R * w * 0.1, py + s * Sd[1] * R * w * 0.16 + T[1] * R * w * 0.1]) });
    if (R > 50) p.tryStroke({ brush: 'round', color: tint(mix('#fff8d0', '#7ca4ff', blue * 0.7)), width: 4, opacity: 0.8, taper: [0.2, 0.7], points: pts.slice(1, 7).map(([px, py]) => [px - s * Sd[0] * R * w * 0.26, py - s * Sd[1] * R * w * 0.26]) }); };
  const BONE = ['#5c2416', '#dcc884'], BONE2 = ['#4a1c12', '#b89c64'];
  for (const s of [-1, 1]) fang(s, [0.24, -0.44], [0.36, -0.8], [0.1, -1.04], 0.12, BONE2);
  // the dark of its mouth, under the bell
  p.tryStroke({ brush: 'soft', color: tint('#3c0c10'), width: Math.max(9, R * 0.5), opacity: 0.7, points: [P(-0.5, -0.46), P(0, -0.52), P(0.5, -0.46)] });
  // the bell: dark where we see through it, bright round its edge
  const inBell = (px, py) => { const [u, v] = local(px, py); return v > -0.42 - 0.08 * (1 - u * u) && u * u + Math.pow((v + 0.1) / 0.9, 2) < 1; };
  const glass = (px, py) => {
    const [u, v] = local(px, py), t = Math.sqrt(u * u + Math.pow((v + 0.1) / 0.9, 2)), n = nA(px / (R * 0.3) + 7, py / (R * 0.3));
    let c = mix(mix('#06201a', '#0f4630', n), '#74e268', Math.pow(t, 3.2));
    c = mix(c, '#e2ffc0', smooth(0.86, 1, t) * 0.8);                                               // its edge
    c = mix(c, '#0e3c28', smooth(-0.2, -0.42, v) * 0.6);                                           // its under side is thicker, and darker
    c = mix(c, '#3ce0f0', smooth(0.2, 0.9, t) * cyan * 0.3 * smooth(-0.2, 0.7, v));                // the light of the mushrooms on its top
    return tint(mix(c, '#3c64ff', smooth(0, -0.42, v) * blue * 0.6));                              // the light of the Phazon under it
  };
  p.fill({ inside: inBell, bounds: [x - R * 1.1, y - R * 1.1, x + R * 1.1, y + R * 1.1], width: clamp(R * 0.06, 5, 10), length: clamp(R * 0.5, 14, 80), spacing: 0.45, overlap: 0.7, angle: (px, py) => { const [u, v] = local(px, py); return Math.atan2(v + 0.1, u) + a + Math.PI; }, color: glass, stroke: { ...line, mix: 0.3, rag: 0.02, opacity: 0.95 } });
  p.fill({ inside: inBell, bounds: [x - R * 1.1, y - R * 1.1, x + R * 1.1, y + R * 1.1], width: 5, length: clamp(R * 0.3, 14, 50), spacing: 1.0, overlap: 0.8, angle: (px, py) => { const [u, v] = local(px, py); return Math.atan2(v + 0.1, u) + a + Math.PI; }, color: (px, py) => glass(px + r.range(-3, 3), py + r.range(-3, 3)), stroke: { ...line, mix: 0.3, rag: 0.02, opacity: 0.8 } });
  // the veins of the bell: thin lines from its top toward its edge
  if (R > 50) for (const k of [-0.7, -0.35, 0, 0.35, 0.7]) { const pts = []; for (let i = 1; i <= 7; i++) { const q = i / 7 * 1.25; pts.push(P(Math.sin(k * 1.3) * Math.sin(q) * 0.96, -0.1 + 0.88 * Math.cos(q) * Math.cos(k * 0.6))); } p.tryStroke({ brush: 'round', color: tint('#b4f890'), width: 4, opacity: 0.3, taper: [0.2, 0.4], points: pts }); }
  // its three hearts: each a ball of red with a bright middle, and red threads between them
  const hearts = [[-0.3, 0.12], [0.3, 0.12], [0, -0.16]], hr = R * 0.2;
  for (const [w, op] of [[R * 1.1, 0.1], [R * 0.7, 0.14]]) glow(p, ...P(0, 0.02), w, tint('#ff3c24'), op, 6);
  if (hr >= 9) {
    for (let i = 0; i < 3; i++) { const b = P(...hearts[i]), c = P(...hearts[(i + 1) % 3]); p.tryStroke({ ...line, color: tint('#8c1814'), width: Math.max(5, hr * 0.5), opacity: 0.9, points: [b, c] }); }
    for (const [u, v] of hearts) { const [hx, hy] = P(u, v); disc(p, hx, hy, hr, tint('#a81c18'), Math.max(6.2, hr * 0.5), { ...line, mix: 0 }); glow(p, hx - hr * 0.1, hy - hr * 0.1, Math.max(9, hr * 0.8), tint('#ff7c44'), 0.34, 8); if (hr > 16) glow(p, hx - hr * 0.2, hy - hr * 0.2, Math.max(9, hr * 0.36), tint('#ffd8a0'), 0.4, 8); }
  } else { glow(p, ...P(0, 0), Math.max(9, R * 0.5), tint('#ff5c34'), 0.4, 8); p.tryStroke({ ...line, color: tint('#e8402c'), width: Math.max(6, R * 0.3), taper: [0.3, 0.3], points: [P(-Math.max(0.34, 6.4 / R), 0.02), P(0, 0.08), P(Math.max(0.34, 6.4 / R), 0.02)] }); }
  // the shine on the bell, on the side where the nearest light is, and the bright line of its edge
  { const side = o.shine != null ? o.shine : -1;
    glow(p, ...P(side * 0.46, 0.46), Math.max(9, R * 0.3), tint('#eaffe8'), 0.16, 6);
    p.tryStroke({ brush: 'round', color: tint('#f4fff0'), width: R > 80 ? 6 : 4.4, opacity: 0.85, taper: [0.5, 0.5], points: [P(side * 0.66, 0.3), P(side * 0.56, 0.5), P(side * 0.36, 0.64)] });
    const pts = []; for (let i = 0; i <= 20; i++) { const q = -1.25 + 2.5 * i / 20; pts.push(P(Math.sin(q) * 0.985, -0.1 + 0.885 * Math.cos(q))); }
    glint(p, pts, () => tint(mix('#b8ff9c', '#f6fff0', r())), { width: R > 80 ? 5 : 4, dash: 50, gap: 10, opacity: 0.8, rng: r }); }
  // its two great fangs, on the near side
  for (const s of [-1, 1]) fang(s, [0.68, -0.4], [0.98, -0.9], [0.3, -1.34], 0.17, BONE);
  // in ice: a crust of pale ice over all of it, and long sharp pieces that stand out from it
  if (o.ice) {
    for (let k = 0; k < 6; k++) { const q = r.range(0, Math.PI * 2), d = r.range(0.1, 0.7), w = Math.max(9, R * r.range(0.3, 0.5)); p.tryStroke({ brush: 'soft', color: '#e4f4ff', width: w, opacity: r.range(0.08, 0.16), points: [[x + Math.cos(q) * d * R - w * 1.1, y + Math.sin(q) * d * R], [x + Math.cos(q) * d * R, y + Math.sin(q) * d * R - 4], [x + Math.cos(q) * d * R + w * 1.1, y + Math.sin(q) * d * R]] }); }
    // sharp pieces of ice on the side where the shot came, and long ones that hang from under it
    for (const [q, l, w] of [[2.5, 0.7, 9], [2.9, 0.5, 7], [2.1, 0.44, 7], [3.3, 0.6, 8], [1.75, 0.34, 6]]) { const b = [x + Math.cos(q) * R * 0.9, y + Math.sin(q) * R * 0.9], e = [b[0] + Math.cos(q) * R * l, b[1] + Math.sin(q) * R * l]; p.tryStroke({ ...line, cap: 'flat', rag: 0.02, color: mix('#a8d4f4', '#ffffff', r()), width: w, opacity: 0.9, taper: [0, 0.9], points: [b, e] }); }
    for (const [dx, l] of [[-0.5, 0.7], [-0.16, 1.0], [0.2, 0.6], [0.5, 0.86]]) { const b = [x + dx * R, y + R * 0.8], e = [b[0] + r.range(-3, 3), b[1] + R * l]; p.tryStroke({ ...line, rag: 0.02, color: mix('#a8d4f4', '#f4fbff', r()), width: r.range(5, 8), opacity: 0.85, taper: [0, 0.9], points: [b, [(b[0] + e[0]) / 2, (b[1] + e[1]) / 2], e] }); }
    for (const [k, op] of [[1.9, 0.07], [1.2, 0.1]]) glow(p, x, y, R * k, '#cfeaff', op, 6);
  }
}

// ---------------------------------------------------------------- the far ones
for (const [x, y, R, a, d] of [[544, 628, 15, -1.3, 0.5], [1436, 520, 19, -1.8, 0.4], [860, 570, 14, -1.5, 0.5], [1240, 150, 24, -1.2, 0.4], [330, 236, 17, -1.6, 0.5], [1098, 430, 13, -1.4, 0.6], [706, 300, 12, -1.7, 0.6]]) metroid(x, y, R, a, { dim: d });
// ---------------------------------------------------------------- those in the middle distance
metroid(770, 172, 34, -1.1, { dim: 0.3 });
metroid(436, 268, 44, -1.0, { dim: 0.25, shine: 1 });
metroid(1018, 690, 46, -1.9, { dim: 0.15, shine: 1 });
metroid(1150, 548, 76, -2.1, { dim: 0.1, shine: 1 });
// ---------------------------------------------------------------- the one that her shot has put in ice
metroid(ICED.x, ICED.y, ICED.R, -0.7, { ice: true });
// ---------------------------------------------------------------- the greatest
metroid(BIG.x, BIG.y, BIG.R, -0.5, {});
void nC; void PHAZON;

p.save();
