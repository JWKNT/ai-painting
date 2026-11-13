// What she has taken up from the city: pieces of its towers, whole floors of them, that go
// round her in the air and rise. The far ones are small and pale in the storm; the near
// ones are big and dark, with the fires on their under sides and her cold light on top.
'use strict';
const { studio, open, far, nA } = require('./scene');
const { mix, glint } = studio;

const p = open('debris');
const r = p.rng;

// A piece of a tower: a block so long and so thick, turned through an angle. It is laid in
// courses along its length; it has the windows of its floors; its two ends are broken.
function piece(cx, cy, w, h, deg, d) {
  const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), P = (u, v) => [cx + u * ca - v * sa, cy + u * sa + v * ca];
  const lanes = Math.max(2, Math.round(h / 9)), lw = Math.max(4.8, h / lanes + 2.5), down = -sa * 0 + ca > 0 ? 1 : -1;   // which of its long sides is under
  const ends = [];
  for (let j = 0; j < lanes; j++) {
    const f = (j + 0.5) / lanes, v = -h / 2 + f * h, u0 = -w / 2 * r.range(0.72, 1.05), u1 = w / 2 * r.range(0.72, 1.05), [mx, my] = P(0, v), under = down > 0 ? f : 1 - f;
    ends.push([u0, u1, v]);
    const c = mix(mix('#1a232c', '#34424e', nA(mx / 20, my / 10)), under > 0.6 ? '#6c3c2c' : '#566c74', Math.abs(under - 0.5) * 0.7);
    p.tryStroke({ brush: 'bristle', color: far(c, mx, my, d), width: lw, mix: 0.05, dry: 0, rag: 0.4, streak: 0.15, jitter: 0.3, cap: 'flat', points: [P(u0, v), P((u0 + u1) / 2, v + r.range(-1, 1)), P(u1, v)] });
  }
  for (let j = 0; j < Math.floor(h / 13); j++) {                          // the windows of each floor in it
    const v = -h / 2 + (j + 0.5) * (h / Math.floor(h / 13));
    for (let u = -w / 2 + 10; u < w / 2 - 22; u += 18) {
      if (r() < 0.45) continue;
      const [x0, y0] = P(u, v), [x1, y1] = P(u + 12.6, v);
      p.tryStroke({ brush: 'bristle', color: far('#080c12', x0, y0, d), width: 4.8, opacity: 0.6, mix: 0.1, dry: 0.03, rag: 0.1, cap: 'round', points: [[x0, y0], [x1, y1]] });
    }
  }
  const top = ends[down > 0 ? 0 : lanes - 1], bot = ends[down > 0 ? lanes - 1 : 0];
  if (w > 70) {
    glint(p, [P(top[0] + 4, top[2] - down * (lw / 2 - 2)), P((top[0] + top[1]) / 2, top[2] - down * (lw / 2 - 2)), P(top[1] - 4, top[2] - down * (lw / 2 - 2))], () => far('#b8d8d0', cx, cy, d * 0.5), { width: 4.2, dash: 30, gap: 10, opacity: 0.6, rng: r });   // her light along its top
    glint(p, [P(bot[0] + 4, bot[2] + down * (lw / 2 - 2)), P((bot[0] + bot[1]) / 2, bot[2] + down * (lw / 2 - 2)), P(bot[1] - 4, bot[2] + down * (lw / 2 - 2))], () => far('#f08a44', cx, cy, d * 0.5), { width: 4.2, dash: 30, gap: 12, opacity: 0.55, rng: r });   // the fires along its under side
  }
  for (let k = 0; k < 3; k++) { const s = r() < 0.5 ? -1 : 1, v = r.range(-h / 2, h / 2), u = s * w / 2 * 0.9, len = r.range(12.4, 26); p.tryStroke({ color: far('#0c1016', cx, cy, d), width: 4, opacity: 0.9, points: [P(u, v), P(u + s * len, v + r.range(-6, 6))] }); }   // rods of iron at its broken ends
}

// The far ones first.
const pieces = [
  [560, 420, 70, 26, -24, 0.6], [690, 300, 54, 22, 38, 0.66], [1340, 300, 60, 24, 62, 0.62], [1430, 480, 84, 30, -12, 0.56], [760, 560, 62, 24, 14, 0.6], [1250, 590, 74, 28, -40, 0.56],
  [470, 250, 110, 40, 18, 0.42], [1500, 200, 120, 44, -30, 0.4], [600, 640, 100, 38, -58, 0.38], [1380, 660, 96, 36, 28, 0.38],
  [300, 430, 170, 62, -34, 0.2], [1540, 560, 150, 56, 46, 0.2], [130, 250, 150, 54, 62, 0.22],
  [820, 690, 80, 32, 8, 0.3],
];
for (const [cx, cy, w, h, deg, d] of pieces) piece(cx, cy, w, h, deg, d);

// Small things that go up with them: sheets of glass and iron, each a short dark mark with a light on it.
for (let k = 0; k < 70; k++) {
  const x = r.range(40, 1560), y = r.range(60, 720), a = r.range(0, 3.14), len = r.range(12.4, 24);
  if (Math.hypot(x - 1010, (y - 330) * 0.9) < 300) continue;                                     // not over her
  p.tryStroke({ brush: 'bristle', color: far('#10161c', x, y, 0.3), width: r.range(4.8, 7), opacity: 0.85, mix: 0.05, dry: 0, rag: 0.3, cap: 'flat', points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
  if (r() < 0.3) p.tryStroke({ color: far('#c8e0d8', x, y, 0.2), width: 4, opacity: 0.6, points: [[x - Math.cos(a) * 6.3, y - Math.sin(a) * 6.3 - 3], [x + Math.cos(a) * 6.3, y + Math.sin(a) * 6.3 - 3]] });
}

p.save();
