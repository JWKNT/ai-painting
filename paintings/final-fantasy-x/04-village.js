// Kilika. Far off, across the water, the low shore of the island with its palms. Nearer, at
// each side, what Sin has left of the port: houses on posts over the water, with roofs of
// thatch, and the walks of planks that join them, some of them broken and down in the sea.
// The people of the village stand on the walks and watch. Torches burn on poles, and each
// lays a small road of fire on the water.
'use strict';
const { studio, open, HORIZON, far } = require('./scene');
const { mix, clamp, glint } = studio;

const p = open('village');
const r = p.rng;
const wood = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'flat' };
const dark = (x, y, d) => far(mix('#1c1226', '#34203a', r()), x, y, d);

// The far shore: two low arms of land, one at each side, and palms on them.
for (const [x0, x1, high, d] of [[-40, 520, 30, 0.42], [1100, 1640, 34, 0.42], [-40, 250, 54, 0.3], [1380, 1640, 58, 0.3]]) {
  const top = (x) => HORIZON - high * Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.02, 0.98)) * (0.7 + 0.3 * Math.sin(x / 47)) - 2;
  p.fill({ inside: (x, y) => x > x0 && x < x1 && y > top(x) && y < HORIZON + 3, bounds: [x0, HORIZON - high - 6, x1, HORIZON + 3], width: 7, length: 44, spacing: 0.5, angle: () => r.range(-0.1, 0.1), color: (x, y) => dark(x, y, d), stroke: { brush: 'bristle', opacity: 0.95, mix: 0.15, rag: 0.3 } });
  for (let x = x0 + 30; x < x1 - 20; x += r.range(34, 80)) {                 // palms: a thin bent trunk, and fronds that hang from its top
    const base = top(x) + 4, h = r.range(34, 70) * (1.2 - d), lean = r.range(-0.35, 0.35), tx = x + lean * h, ty = base - h, c = dark(x, ty, d);
    p.tryStroke({ ...wood, cap: 'round', color: c, width: 4.8, taper: [0, 0.3], points: [[x, base], [x + lean * h * 0.4, base - h * 0.55], [tx, ty]] });
    for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.52 + r.range(-0.15, 0.15), l = h * r.range(0.4, 0.62); p.tryStroke({ ...wood, cap: 'round', color: c, width: 4.8, taper: [0, 0.8], points: [[tx, ty], [tx + Math.cos(a) * l * 0.6, ty + Math.sin(a) * l * 0.5 - 2], [tx + Math.cos(a) * l, ty + Math.sin(a) * l * 0.4 + l * 0.42]] }); }
  }
}

// A house on posts: its floor is at the level of the walks. The roof is a steep cap of thatch.
// It is against the light, so it is dark, with the fire of the sky along the edge of its roof on the side of the sun.
function house(x, floor, s, d, lean = 0, post = 34 * s) {
  const c = dark(x, floor, d), sun = x < 800 ? 1 : -1, w = 46 * s;
  for (const dx of [-0.8, -0.3, 0.3, 0.8]) p.tryStroke({ ...wood, color: c, width: Math.max(4.8, 4 * s), points: [[x + dx * w, floor - 2 - Math.max(0, 14 - post)], [x + dx * w + r.range(-3, 3) + lean * post, floor + post]] });   // its posts, down into the water
  p.tryStroke({ ...wood, color: c, width: Math.max(5, 6.5 * s), points: [[x - w * 1.2, floor], [x + w * 1.2, floor + lean * 6]] });                                                                           // its floor
  const n = Math.max(3, Math.round(w * 2 / 9));
  for (let k = 0; k < n; k++) { const f = (k + 0.5) / n, bx = x - w + 2 * w * f; p.tryStroke({ ...wood, color: mix(c, '#3c2434', r() * 0.3), width: Math.max(4.8, 2 * w / n * 1.6), points: [[bx, floor - 3], [bx + lean * 6, floor - 30 * s]] }); }      // its wall
  for (let k = 0; k < n + 2; k++) {                                                                                                                                                                         // its roof: the thatch comes down from a point to wide eaves
    const f = (k + 0.5) / (n + 2), ex = x - w * 1.3 + 2.6 * w * f, top = [x + lean * 14 + (f - 0.5) * w * 0.3, floor - 86 * s];
    p.tryStroke({ ...wood, rag: 0.35, color: mix(c, sun * (f - 0.5) > 0.1 ? far('#b85c3c', x, floor, d) : '#140c1c', 0.3 + 0.3 * r()), width: Math.max(4.8, 2.6 * w / (n + 2) * 1.7), points: [top, [(top[0] + ex) / 2, floor - 54 * s], [ex, floor - 28 * s]] });
  }
  glint(p, [[x + lean * 14 + sun * 3, floor - 86 * s], [x + sun * w * 0.7, floor - 54 * s], [x + sun * w * 1.3, floor - 28 * s]], () => far(mix('#ff9c50', '#ffd88c', r()), x, floor, d * 0.5), { width: 4.4, dash: 26 * s + 8, gap: 8, opacity: 0.85, rng: r });
  for (let k = 0; k < 8; k++) { const y = floor + post + 6 + k * (6 + 3 * s), half = Math.max(6.4, w * (1.1 - k * 0.1) * r.range(0.6, 1)); p.tryStroke({ brush: 'bristle', color: c, width: Math.max(4.8, 4 * s), opacity: 0.6 - k * 0.06, mix: 0.2, dry: 0.05, rag: 0.3, points: [[x - half, y], [x + half, y + r.range(-1, 1)]] }); }   // what the water shows of it
}
// A walk of planks on posts, from one place to another. Some lengths of it are down: a length that is broken hangs with one end in the sea.
function walk(x0, y0, x1, y1, s, d, broken = [], post = 30 * s) {
  const n = Math.max(2, Math.round(Math.abs(x1 - x0) / (70 * s)));
  for (let k = 0; k < n; k++) {
    const xa = x0 + (x1 - x0) * k / n, xb = x0 + (x1 - x0) * (k + 1) / n, ya = y0 + (y1 - y0) * k / n, yb = y0 + (y1 - y0) * (k + 1) / n, c = dark(xa, ya, d);
    p.tryStroke({ ...wood, color: c, width: Math.max(4.8, 5 * s), points: [[xa, ya - 3 - Math.max(0, 12 - post)], [xa + r.range(-3, 3), ya + post]] });                 // a post
    if (broken.includes(k)) { p.tryStroke({ ...wood, color: c, width: Math.max(4.8, 5.5 * s), points: [[xa, ya], [xa + (xb - xa) * 0.6, ya + post]] }); p.tryStroke({ ...wood, color: c, width: 4.8, points: [[xb, yb - 2], [xb - 6, yb - 30 * s]] }); continue; }
    p.tryStroke({ ...wood, color: c, width: Math.max(4.8, 5.5 * s), points: [[xa - 2, ya], [xb + 2, yb]] });                                                        // its planks
    if (r() < 0.7) p.tryStroke({ color: c, width: 4, opacity: 0.9, points: [[xa, ya - 15 * s - 4], [xb, yb - 15 * s - 4]] });                                       // a rail
  }
}
// A person, standing, far off and against the light: a dark body that is widest at the
// shoulders, legs under it, and a small head. A touch of color in the hair or the clothes of
// some of them is all that the last light gives.
function person(x, feet, h, d, o = {}) {
  const c = far(o.body || mix('#1a1024', '#3c2640', r()), x, feet, d), sun = x < 800 ? 1 : -1, line = { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' };
  // The head is painted first, as the top of a short upright stroke; the shoulders then cover the rest of that stroke.
  const hw = Math.max(4.8, h * 0.13), top = feet - h;
  p.tryStroke({ ...line, color: o.hair ? far(o.hair, x, top, d * 0.5) : c, width: hw, points: [[x, top + hw * 0.5], [x, top + hw * 0.5 + Math.max(12.4, 2.1 * hw)]] });
  if (h >= 50 && !o.skirt && r() < 0.6) for (const dx of [-0.065, 0.065]) p.tryStroke({ ...line, color: c, width: Math.max(4.8, h * 0.095), points: [[x + dx * h, feet], [x + dx * h * 0.8, feet - h * 0.5]] });      // legs
  else p.tryStroke({ ...line, cap: 'flat', color: c, width: Math.max(4.8, h * (o.skirt ? 0.3 : 0.19)), taper: [0, 0.5], points: [[x, feet], [x, feet - Math.max(12.4, h * 0.52)]] });                          // or a long robe
  const sw = Math.max(4.8, h * 0.235);
  p.tryStroke({ ...line, cap: 'flat', color: c, width: sw, taper: [0.3, 0], points: [[x, feet - h * 0.35], [x, feet - h * 0.35 - Math.max(2.1 * sw, h * 0.5)]] });                                            // the body, up to the shoulders
  if (h >= 28 && (o.rim || r() < 0.5)) p.tryStroke({ color: far(o.rim || mix('#c86c5c', '#ffb070', r()), x, feet, d * 0.6), width: 4, opacity: 0.7, points: [[x + sun * sw * 0.45, feet - h * 0.82], [x + sun * sw * 0.5, feet - h * 0.82 + Math.max(12.4, h * 0.42)]] });
}
// A torch on a pole: its fire, the glow of it, and its road on the water.
function torch(x, foot, h, s) {
  p.tryStroke({ ...wood, color: '#1c1226', width: Math.max(4.8, 4.8 * s), points: [[x, foot], [x + r.range(-2, 2), foot - h]] });
  const fy = foot - h;
  for (const [w, op] of [[90 * s, 0.14], [50 * s, 0.22], [26 * s, 0.34]]) p.tryStroke({ brush: 'soft', color: '#ff8a34', width: Math.max(8.2, w), opacity: op, points: [[x - Math.max(8.4, w * 1.02), fy - 6], [x, fy - 10], [x + Math.max(8.4, w * 1.02), fy - 6]] });
  for (const [dx, fh, w, c] of [[-3, 16, 8, '#f2541c'], [3, 14, 7, '#f2541c'], [0, 24, 9, '#ff8a2c'], [0, 17, 6, '#ffd860']]) p.tryStroke({ brush: 'bristle', color: c, width: Math.max(4.8, w * s), mix: 0.1, dry: 0, rag: 0.15, cap: 'round', taper: [0.1, 0.85], points: [[x + dx * s, fy + 3], [x + dx * s + r.range(-2, 2), fy - Math.max(6.5, fh * s * 0.5)], [x + dx * s + r.range(-3, 3), fy - Math.max(13, fh * s)]] });
  for (let k = 0; k < 8; k++) { const y = foot + 24 + k * 11 * s, half = Math.max(6.4, (16 - k * 1.2) * s * r.range(0.6, 1.2)); p.tryStroke({ brush: 'bristle', color: mix('#ff8a34', '#ffd070', r()), width: Math.max(4.8, 5 * s), opacity: 0.75 - k * 0.07, mix: 0.2, dry: 0.05, rag: 0.3, points: [[x - half + r.range(-3, 3), y], [x + half + r.range(-3, 3), y]] }); }
}

// The far side of the port, on each side of the open water: small, and soft in the evening air.
for (const [x, floor, s, lean] of [[112, 618, 0.62, 0], [250, 622, 0.56, 0.3], [1362, 620, 0.58, -0.25], [1500, 616, 0.64, 0]]) house(x, floor, s, 0.34, lean);
walk(40, 620, 420, 628, 0.6, 0.34, [3]);
walk(1200, 628, 1580, 618, 0.6, 0.34, [1]);
for (let k = 0; k < 15; k++) { const left = k < 8, x = left ? r.range(150, 410) : r.range(1210, 1470); person(x, (left ? 620 + (x - 40) / 380 * 8 : 628 - (x - 1200) / 380 * 10) - 1, r.range(26, 32), 0.3); }
torch(190, 620, 44, 0.6); torch(398, 628, 44, 0.6); torch(1228, 628, 44, 0.6); torch(1440, 622, 44, 0.6);

// The near side: bigger and darker. The walks here are those that the people of the village
// stand on to see her. Among the people on the left are the others who guard her: a tall
// Ronso with a blue mane, a woman in black, a man with red hair that stands up, and a boy
// with fair hair who has not seen a sending before.
house(96, 680, 1.9, 0.1, 0.06, 20);
house(1508, 678, 1.95, 0.1, -0.08, 20);
walk(190, 684, 500, 694, 1.3, 0.1, [3], 20);
walk(1110, 694, 1420, 682, 1.3, 0.1, [0], 20);
for (let k = 0; k < 5; k++) { const left = k < 2, x = left ? r.range(206, 290) : r.range(1190, 1400); person(x, (left ? 684 + (x - 190) / 310 * 10 : 694 - (x - 1110) / 310 * 12) - 2, r.range(56, 68), 0.08); }
// Her guardians. Each is small, but each is himself. They look toward her, so we see them from behind and a little from the side.
{
  const d = 0.05, mark = (pts, color, width, extra = {}) => p.tryStroke({ brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round', ...extra, color: far(color, pts[0][0], pts[0][1], d), width: Math.max(4.6, width), points: pts });
  const blob = (x, y, size, color) => { for (const a of [0.6, 2.2]) mark([[x - Math.cos(a) * 6.3, y - Math.sin(a) * 6.3], [x + Math.cos(a) * 6.3, y + Math.sin(a) * 6.3]], color, Math.min(size, 6)); };   // a small round thing: two strokes that cross
  const who = (x, feet, h) => (ux, uy) => [x + ux * h / 100, feet - uy * h / 100];
  // Kimahri: a Ronso, a head taller than a man, blue, with a white mane, a horn, a tail, and a long spear
  { const K = who(322, 687, 94);
    mark([K(21, -2), K(22, 60), K(24, 124)], '#3a2a22', 4.8, { cap: 'flat' }); mark([K(24, 124), K(25, 138)], '#e8e0d0', 5, { taper: [0, 0.6] });
    mark([K(-8, 44), K(-18, 30), K(-21, 14)], '#3a58a8', 5, { taper: [0, 0.6] });
    for (const sx of [-6, 6]) mark([K(sx, 0), K(sx * 0.9, 24), K(sx * 0.8, 44)], '#2c4690', 8.5);
    mark([K(-9, 45), K(9, 45)], '#a8642c', 9, { cap: 'flat' });
    mark([K(0, 44), K(0, 80)], '#3454a0', 15, { cap: 'flat' });
    mark([K(7, 50), K(8, 77)], '#7c9ce0', 4.8, { opacity: 0.8 });
    mark([K(-12, 76), K(-15, 50)], '#2c4690', 7); mark([K(12, 76), K(18, 60), K(21, 62)], '#4464b0', 7);
    mark([K(-4, 92), K(-9, 72), K(-8, 58)], '#e8ecf8', 8.5, { taper: [0, 0.6] });
    blob(...K(1, 88), 6, '#3a58a8'); mark([K(6, 93), K(14, 106)], '#e8dcc0', 4.6, { taper: [0, 0.5] });
  }
  // Lulu: a black dress that is wide at the hem, bare shoulders with grey fur round them, black hair up, with pins in it and long plaits down her back
  { const L = who(352, 688, 70);
    for (const hx of [-16, 0, 16]) mark([L(0, 54), L(hx * 0.5, 28), L(hx, 2)], '#140e1a', 11, { cap: 'flat' });
    for (const [hx, hy] of [[-9, 24], [4, 16], [10, 34], [-3, 40]]) mark([L(hx - 9, hy), L(hx + 9, hy + 3)], '#5c4c60', 4.6, { opacity: 0.7 });
    mark([L(0, 46), L(0, 74)], '#140e1a', 9, { cap: 'flat' }); mark([L(-10, 73), L(10, 73)], '#b8b0b8', 6);
    mark([L(-9, 70), L(-11, 50)], '#d8b8a0', 4.8); mark([L(9, 70), L(12, 52)], '#e8c8ac', 4.8);
    blob(...L(0, 84), 6, '#120c16'); mark([L(0, 88), L(1, 106)], '#120c16', 6);
    mark([L(-10, 103), L(10, 97)], '#e8d8c0', 4.6); mark([L(-9, 96), L(10, 104)], '#e8d8c0', 4.6);
    for (const sx of [-3, 3]) mark([L(sx, 82), L(sx * 1.6, 44)], '#221828', 4.6);
    mark([L(13, 50), L(13, 32)], '#f4f0f0', 5);
  }
  // Wakka: red hair that stands up in front, a blue band round his head, brown arms, a yellow coat, wide trousers, and a ball under his arm
  { const Wk = who(382, 689, 76);
    for (const sx of [-6, 6]) mark([Wk(sx, 0), Wk(sx * 1.1, 22), Wk(sx * 0.8, 44)], '#3c4c6c', 9);
    mark([Wk(0, 42), Wk(0, 76)], '#d4a838', 12, { cap: 'flat' }); mark([Wk(4, 46), Wk(5, 73)], '#f8dc7c', 4.8, { opacity: 0.8 });
    mark([Wk(-11, 74), Wk(-13, 50)], '#a86c44', 6.5); mark([Wk(11, 74), Wk(16, 56)], '#c8885c', 6.5);
    blob(...Wk(18, 50), 6, '#4c7cc8'); mark([Wk(13, 53), Wk(23, 49)].map(([x, y], i) => [x + (i ? 2 : -2), y]), '#e8f0ff', 4.6);
    blob(...Wk(0, 85), 6, '#b87c50'); mark([Wk(-7, 88), Wk(8, 88)].map(([x, y], i) => [x + (i ? 2 : -2), y]), '#4c6cc0', 4.6);
    mark([Wk(-2, 90), Wk(2, 100), Wk(8, 108)], '#e06420', 6.5, { taper: [0, 0.6] });
  }
  // Tidus: fair hair, a short yellow coat over black, one leg of his trousers longer than the other, and a blue sword across his back
  { const T = who(420, 690, 70);
    mark([T(-6, 2), T(-6, 22)], '#d8a880', 5.5); mark([T(6, 2), T(6, 30)], '#d8a880', 5.5);
    mark([T(-6, 22), T(-5, 46)], '#1a1a22', 8.5); mark([T(6, 30), T(5, 46)], '#1a1a22', 8.5);
    mark([T(0, 44), T(0, 78)], '#e4bc3c', 11, { cap: 'flat' }); mark([T(-9, 48), T(9, 48)], '#22222c', 6, { cap: 'flat' });
    mark([T(-11, 74), T(-12, 50)], '#2c2c38', 6); mark([T(11, 74), T(14, 54)], '#e8c8a4', 6);
    mark([T(-12, 40), T(0, 62), T(13, 86)], '#4ca8e8', 5, { cap: 'flat' }); mark([T(-10, 44), T(12, 84)], '#c8ecff', 4.6, { opacity: 0.8 });
    blob(...T(0, 86), 6, '#ecc858'); for (const [ux, uy] of [[-5, 100], [3, 102]]) mark([T(ux * 0.4, 88), T(ux, uy)], '#f4d868', 5, { taper: [0, 0.6] });
  }
}
// The people of the village among them: some lift their arms, and some are children.
for (const [x, h, arms] of [[214, 62, true], [246, 38, false], [276, 64, false], [296, 34, false], [452, 60, true], [1196, 62, true], [1232, 36, false], [1268, 64, false], [1310, 60, true], [1376, 38, false], [1404, 62, false]]) {
  const feet = (x < 800 ? 684 + (x - 190) / 310 * 10 : 694 - (x - 1110) / 310 * 12) - 2;
  person(x, feet, h, 0.08);
  if (arms) for (const sx of [-1, 1]) p.tryStroke({ brush: 'bristle', color: far('#2a1a2c', x, feet, 0.08), width: 4.8, mix: 0.1, dry: 0, rag: 0.1, cap: 'round', points: [[x + sx * h * 0.1, feet - h * 0.78], [x + sx * h * 0.2, feet - h * 1.02]] });
}
torch(258, 686, 100, 1.05); torch(1340, 684, 100, 1.05);
for (const [x, y, lean] of [[520, 716, 0.3], [566, 730, -0.2], [1090, 722, -0.35], [1052, 742, 0.15], [640, 700, 0.5]]) p.tryStroke({ ...wood, color: dark(x, y, 0.06), width: 6.5, points: [[x, y + 22], [x + lean * 60, y - 44]] });   // posts with nothing on them now, leaning
for (const [x, y, len, a] of [[470, 736, 60, 0.12], [1120, 750, 70, -0.08], [590, 762, 50, 0.05], [1000, 768, 46, 0.1]]) p.tryStroke({ ...wood, color: dark(x, y, 0.04), width: 6.5, opacity: 0.9, points: [[x, y], [x + len, y + len * a]] });   // planks on the water

p.save();
