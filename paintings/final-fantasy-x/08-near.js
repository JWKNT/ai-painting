// What is close to us: the fronds of two palms that hang into the top of the picture, dark
// against the sky, with a little of its fire along their ribs; and the corners of the
// picture brought down, so that the eye stays with her.
'use strict';
const { studio, open, W, H } = require('./scene');
const { mix, glint } = studio;

const p = open('near');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.15, cap: 'round' };

// A frond: a rib that bends over with its own weight, and leaflets that hang from the rib.
// They are long in the middle of it and short at its two ends, and each one hangs down.
function frond(x, y, ang, len) {
  const pts = []; for (let k = 0; k <= 12; k++) { const t = k / 12; pts.push([x + Math.cos(ang) * len * t, y + Math.sin(ang) * len * t + len * 0.42 * t * t]); }
  for (let k = 2; k < 60; k++) {
    const t = k / 60, i = Math.min(11, Math.floor(t * 12)), f = t * 12 - i, bx = pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, by = pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f;
    const ll = (len * 0.3 * Math.sin(Math.PI * Math.min(1, t * 1.1)) + 16) * r.range(0.7, 1.15), dir = Math.atan2(pts[i + 1][1] - pts[i][1], pts[i + 1][0] - pts[i][0]), s = k % 2 ? 1 : -1;
    const out = dir + s * r.range(0.9, 1.3), mid = [bx + Math.cos(out) * ll * 0.45, by + Math.sin(out) * ll * 0.3 + ll * 0.12], tip = [bx + Math.cos(out) * ll * 0.62 + r.range(-6, 6), by + Math.sin(out) * ll * 0.3 + ll * 0.78];
    p.tryStroke({ ...line, color: mix('#120a1a', '#2a1630', r()), width: r.range(5, 8), taper: [0, 0.85], points: [[bx, by], mid, tip] });
  }
  p.stroke({ ...line, color: '#120a1a', width: 7, taper: [0, 0.7], points: pts });
  glint(p, pts.map(([px, py]) => [px, py - 3]), () => mix('#e8704c', '#ffc080', r()), { width: 4.2, dash: 46, gap: 22, opacity: 0.55, rng: r });
}
for (const [x, y, ang, len] of [[-50, -40, 0.3, 500], [-70, 80, 0.06, 400], [60, -80, 0.72, 360]]) frond(x, y, ang, len);
for (const [x, y, ang, len] of [[W + 50, -40, Math.PI - 0.3, 470], [W + 70, 90, Math.PI - 0.04, 380], [W - 70, -80, Math.PI - 0.76, 340]]) frond(x, y, ang, len);

// The corners, a tone darker.
for (const [x0, y0, x1, y1, w, o] of [[-80, H + 40, 640, H + 60, 220, 0.36], [W + 80, H + 40, 960, H + 60, 220, 0.36]]) p.stroke({ brush: 'soft', color: '#1c0c28', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
