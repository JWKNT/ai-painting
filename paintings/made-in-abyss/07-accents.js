// Last touches: things with wings, far off in the light; motes drifting in the shafts; the
// glow of the small plants on the stone; and the corners of the picture brought down.
'use strict';
const { studio, open, W, H, shaft, far } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;

// One creature of the place, far out in the haze between the towers: long, slow, with fins.
{
  const body = [[470, 236], [520, 214], [574, 220], [622, 244], [664, 240], [700, 222]], c = far('#17403f', 580, 230, 0.72);
  p.stroke({ brush: 'bristle', color: c, width: 11, opacity: 0.6, taper: [0.25, 0.7], mix: 0.2, dry: 0.05, rag: 0.2, cap: 'round', points: body });
  for (const [x, y, dx, dy] of [[528, 214, -10, -20], [584, 222, -6, 22], [640, 244, 8, -20]]) p.tryStroke({ brush: 'bristle', color: c, width: 6, opacity: 0.5, taper: [0, 0.8], mix: 0.2, dry: 0.05, rag: 0.2, points: [[x, y], [x + dx, y + dy]] });
}

// Motes in the light.
for (let k = 0; k < 260; k++) {
  const x = r.range(0, W), y = r.range(40, 800);
  if (r() > shaft(x, y) * 0.8) continue;
  const a = r.range(0, 3.14), len = r.range(12.4, 14);
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: mix('#f6e6a8', '#fffbe0', r()), width: 4, opacity: r.range(0.2, 0.55) });
}
// And a few that are blue-green, low down, near the plants that glow.
for (let k = 0; k < 12; k++) {
  const x = r.range(100, 1200), y = r.range(760, 940), a = r.range(0, 3.14), len = 12.6;
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: '#9cfbe0', width: 4, opacity: r.range(0.12, 0.3) });
}

// The corners, a tone darker.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.36], [W + 80, H + 40, 900, H + 60, 200, 0.36], [-90, -50, 400, -80, 200, 0.2], [W + 90, -50, 1200, -80, 200, 0.2],
]) {
  p.stroke({ brush: 'soft', color: '#041014', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
