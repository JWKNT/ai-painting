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
for (let k = 0; k < 12; k++) { const left = k < 5, x = left ? r.range(206, 300) : r.range(1190, 1400); person(x, (left ? 684 + (x - 190) / 310 * 10 : 694 - (x - 1110) / 310 * 12) - 2, r.range(56, 68), 0.08); }
person(318, 687, 84, 0.06, { body: '#263466', hair: '#d8dcf0', rim: '#8cb0f0' });                              // Kimahri
person(350, 688, 66, 0.06, { body: '#16101c', hair: '#120c16', rim: '#e8d0d0', skirt: true });                 // Lulu
person(378, 689, 72, 0.06, { body: '#3c2c34', hair: '#d0602c', rim: '#ffc078' });                              // Wakka
person(416, 690, 66, 0.06, { body: '#2c2430', hair: '#f0cc5c', rim: '#ffe89c' });                              // Tidus
torch(258, 686, 100, 1.05); torch(1340, 684, 100, 1.05);
for (const [x, y, lean] of [[520, 716, 0.3], [566, 730, -0.2], [1090, 722, -0.35], [1052, 742, 0.15], [640, 700, 0.5]]) p.tryStroke({ ...wood, color: dark(x, y, 0.06), width: 6.5, points: [[x, y + 22], [x + lean * 60, y - 44]] });   // posts with nothing on them now, leaning
for (const [x, y, len, a] of [[470, 736, 60, 0.12], [1120, 750, 70, -0.08], [590, 762, 50, 0.05], [1000, 768, 46, 0.1]]) p.tryStroke({ ...wood, color: dark(x, y, 0.04), width: 6.5, opacity: 0.9, points: [[x, y], [x + len, y + len * a]] });   // planks on the water

p.save();
