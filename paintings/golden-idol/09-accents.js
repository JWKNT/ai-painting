// Last touches: big leaves close to us in the corner, stones knocked loose from the lip,
// gulls, and the corners brought down a tone.
'use strict';
const { studio, open, W, H, EDGE, edgeX } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;

// Leaves in the near corner: dark blades, some edged with the idol's gold, some with the sun.
for (let k = 0; k < 34; k++) {
  const x = r() < 0.7 ? r.range(-30, 190) : r.range(440, 600), base = H + 20, bend0 = r.range(-0.5, 0.7);
  const h = x < 200 ? r.range(110, 260) * (1 - x / 420) : r.range(60, 130), bend = (x < 200 ? Math.min(bend0, 0.1) : bend0) * h;   // nothing leans across the idol
  const pts = [[x, base], [x + bend * 0.3, base - h * 0.6], [x + bend, base - h]];
  p.stroke({ brush: 'bristle', color: r.pick(['#141024', '#1a1630', '#151c2c', '#100d1c']), width: r.range(16, 30), taper: [0, 0.9], mix: 0, dry: 0, rag: 0.2, streak: 0.2, points: pts });
  if (r() < 0.5) p.tryStroke({ color: mix('#d9a030', '#ffd860', r()), width: 4.2, opacity: r.range(0.35, 0.7), taper: [0.2, 0.6], points: pts.map(([px, py]) => [px + 7, py - 2]) });
}
for (let k = 0; k < 16; k++) {                                       // and a few at the foot of the picture, right of the crate
  const x = r.range(520, 860), base = H + 16, h = r.range(50, 120), bend = r.range(-0.4, 0.6) * h;
  const pts = [[x, base], [x + bend * 0.3, base - h * 0.6], [x + bend, base - h]];
  p.stroke({ brush: 'bristle', color: r.pick(['#141024', '#1a1630', '#100d1c']), width: r.range(10, 18), taper: [0, 0.9], mix: 0, dry: 0, rag: 0.2, points: pts });
  if (r() < 0.4) p.tryStroke({ color: '#e8884a', width: 4.2, opacity: r.range(0.35, 0.6), taper: [0.2, 0.6], points: pts.map(([px, py]) => [px + 5, py - 2]) });
}

// Stones knocked loose from the lip, falling.
for (const [dx, dy, a, w] of [[30, 28, 1.2, 6], [52, 70, 1.4, 5], [20, 96, 1.5, 4.4], [64, 130, 1.3, 5], [40, 176, 1.5, 4.4], [78, 44, 1.1, 4.4]]) {
  const x = edgeX(EDGE.y + 90) + dx + 24, y = EDGE.y + 84 + dy, len = Math.max(12.4, w * 2.1);
  p.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, { color: r.pick(['#5a3040', '#7a4048', '#3a2434']), width: w });
  p.tryStroke({ color: '#f0a060', width: 4, opacity: 0.6, points: [[x + 3, y - 1], [x + 3 + Math.cos(a) * 12.4, y - 1 + Math.sin(a) * 12.4]] });
}

// Gulls, far off: each one a single bent stroke, never quite the same.
for (const [x, y, s, tilt] of [[640, 306, 1, 0.2], [712, 334, 0.8, -0.3], [1428, 296, 0.9, 0.35], [1496, 208, 1, -0.15]]) {
  p.stroke({ color: '#2c2440', width: 4, opacity: 0.55, taper: [0.5, 0.5], points: [[x - 15 * s, y - (3 + 5 * tilt) * s], [x - 6 * s, y - 6 * s], [x, y], [x + 8 * s, y - 5 * s], [x + 17 * s, y - (1 - 6 * tilt) * s]] });
}

// The corners, quieted with a wide soft brush.
for (const [x0, y0, x1, y1, w, o] of [
  [-60, H + 20, 660, H + 36, 170, 0.3], [W + 60, H + 30, 1100, H + 40, 170, 0.34], [-70, -40, 520, -70, 210, 0.26], [W + 70, -40, 1080, -70, 210, 0.26], [W + 80, 620, W + 60, H + 30, 190, 0.22],
]) {
  p.stroke({ brush: 'soft', color: '#0d0a18', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
