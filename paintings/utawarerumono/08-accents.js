// Last touches: the glitter of the snow where the sun lies on it, frost in the air where the
// light comes past the trees, a little more light at the left where the sun is, and the
// corners of the picture brought down.
'use strict';
const { studio, open, W, H, sunlit, near } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;

// Glitter on the sunlit snow.
for (let k = 0; k < 260; k++) {
  const x = r.range(0, 1040), y = r.range(730, 920);
  if (y < near(x) + 10 || sunlit(x, y) < 0.7 || r() < 0.6) continue;
  const len = r.range(12.4, 15);
  p.line(x - len / 2, y, x + len / 2, y + r.range(-1, 1), { color: '#ffffff', width: 4, opacity: r.range(0.45, 0.9) });
}

// Frost drifting in the air, lit where it is high enough to be in the sun.
for (let k = 0; k < 70; k++) {
  const x = r.range(40, W - 40), y = r.range(300, 700), a = 0.5 + r.range(-0.5, 0.5), len = r.range(12.4, 14);
  if (r() < 0.45) continue;
  p.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, { color: mix('#ffe6d8', '#ffffff', r()), width: 4, opacity: r.range(0.18, 0.45) });
}

// The sun is to the left: a little warmth in the air on that side.
p.stroke({ brush: 'soft', color: '#ffd8c0', width: 240, opacity: 0.09, points: [[-120, 420], [-60, 640], [-120, 900]] });

// The corners, a tone darker and bluer.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.3], [W + 80, H + 40, 900, H + 60, 200, 0.3], [-90, -50, 520, -80, 220, 0.2], [W + 90, -50, 1080, -80, 220, 0.22],
]) {
  p.stroke({ brush: 'soft', color: '#0c1440', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
