// What is near us. Ferns of pale blue stand at the foot of the picture, each a stem that
// rolls up at its end, as the young leaf of a fern does. White leaves come down through
// the air from the trees. Then the corners of the picture, a tone darker.
'use strict';
const { studio, open, W, H } = require('./scene');
const { mix } = studio;

const p = open('near');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0.02, rag: 0.1, cap: 'round' };

// A young fern: a thick stem that comes up out of the ground, leans, and rolls up at its end to the side `dir`, as the young
// leaf of a fern does. It is a soft blue. Its inner side is in shade, and the gold sky is a thin broken line along its outer side.
function fern(x, y, h, dir, lean) {
  const R = h * 0.21, sx = x + lean * h, sy = y - h * 0.76, cx = sx + dir * R, cy = sy, path = [[x, y], [x + lean * h * 0.3 - dir * h * 0.05, y - h * 0.4], [sx, sy]];
  for (let i = 1; i <= 30; i++) { const t = i / 30, a = Math.PI * (dir > 0 ? 1 : 0) + dir * t * Math.PI * 2.6, rad = R * (1 - 0.82 * t); path.push([cx + Math.cos(a) * rad, cy - Math.abs(dir) * Math.sin(dir * (a - Math.PI * (dir > 0 ? 1 : 0))) * rad]); }
  const w = Math.max(8, h * 0.105);
  p.tryStroke({ ...line, rag: 0.2, color: '#34467c', width: w * 1.2, taper: [0, 0.6], points: path });                                       // its shade side
  p.tryStroke({ ...line, rag: 0.2, color: mix('#5a76b4', '#7c96cc', r()), width: w * 0.8, taper: [0, 0.6], points: path.map(([px, py]) => [px - dir * w * 0.16, py - w * 0.14]) });
  studio.glint(p, path.slice(0, 16).map(([px, py]) => [px - dir * w * 0.52, py - w * 0.3]), () => mix('#d8c890', '#f4e8c0', r()), { width: 4, dash: 26, gap: 16, opacity: 0.55, rng: r });
}
for (const [x, h, dir, lean] of [[52, 170, 1, 0.05], [196, 120, -1, -0.04], [330, 190, 1, 0.08], [486, 130, -1, -0.02], [1560, 130, -1, -0.03]]) fern(x, H + 16, h, dir, lean);

// White leaves that come down through the air: each a small pale touch, turned its own way. Most are near the two great trees.
for (let k = 0; k < 44; k++) {
  const left = r() < 0.4, x = left ? r.range(0, 420) : r.range(1040, W), y = r.range(left ? 420 : 380, 900), a = r.range(-1.2, 1.2), l = r.range(12.6, 20);
  if (x > 880 && x < 1330 && y > 700) continue;                                                     // not over the three on the path
  p.tryStroke({ brush: 'round', color: mix('#c8d0e4', '#ffffff', r()), width: r.range(4.4, 6.4), opacity: r.range(0.5, 0.9), taper: [0.45, 0.45], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] });
}
// The corners.
for (const [x0, y0, x1, y1, w, op] of [[-60, H + 50, 520, H + 60, 150, 0.34], [W + 60, H + 50, 1100, H + 60, 130, 0.2], [-60, -40, 440, -70, 180, 0.2], [W + 60, -40, 1160, -70, 180, 0.16]]) p.stroke({ brush: 'soft', color: '#0c0a10', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
