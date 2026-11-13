// Last touches: a few stars that flare, grass in the near dark picking up the fire, and the
// corners brought down a little so the eye stays in the middle.
'use strict';
const { studio, open, W, H, FIRE, aroundSun, nB, clamp } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;

// The brightest stars: a longer, whiter streak with a halo round it.
for (const [x, y, tint] of [[586, 196], [1118, 64], [1512, 96], [706, 36], [1196, 316], [906, 262]].map(([x, y]) => [x, y, r.pick(['#ffffff', '#e8efff', '#fff3dc'])])) {
  const a = aroundSun(x, y), c = Math.cos(a), s = Math.sin(a);
  p.stroke({ brush: 'soft', color: '#a8b8ff', width: 20, opacity: 0.28, points: [[x - c * 21, y - s * 21], [x + c * 21, y + s * 21]] });
  p.line(x - c * 11, y - s * 11, x + c * 11, y + s * 11, { color: tint, width: 5 });
}

// Grass in the foreground: dark blades, and nearer the fire a few that catch its light.
for (let k = 0; k < 120; k++) {
  const x = r.range(210, 1000), y = r.range(952, H + 8);
  if (nB(x / 60, y / 30 + 40) < 0.45) continue;
  const h = r.range(18, 42), lean = r.range(-0.25, 0.25) * h;
  const near = Math.exp(-Math.pow(Math.hypot(x - FIRE.x, (y - FIRE.y) * 1.6) / 230, 2));
  const lit = r() < near * 0.75;
  if (!lit && Math.abs(x - FIRE.x) < 70) continue;   // keep the dark blades off the firelit ground
  p.tryStroke({
    color: lit ? mix('#7a3c1c', '#d07a30', r() * near) : r.pick(['#07070d', '#0b0a14', '#0e0c18']),
    width: r.range(4, 5.5), opacity: lit ? r.range(0.5, 0.85) : 0.9, taper: [0, 0.7],
    points: [[x, y], [x + lean * 0.35, y - h * 0.6], [x + lean, y - h]],
  });
}

// Corners, quieted with a wide soft brush.
for (const [x0, y0, x1, y1, w, o] of [
  [-60, H + 10, 700, H + 30, 190, 0.34], [1640, H + 20, 1000, H + 34, 170, 0.3], [-80, 540, -40, H + 40, 200, 0.2], [W + 80, 600, W + 50, H + 40, 180, 0.2],
  [-60, -40, 560, -70, 220, 0.22], [W + 60, -50, 1100, -80, 220, 0.2],
]) {
  p.stroke({ brush: 'soft', color: '#05060f', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
