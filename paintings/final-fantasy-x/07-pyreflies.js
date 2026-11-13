// The pyreflies. The dead city is full of them: small lights, each with a thread of light
// behind it, that come up out of the water and the stone and go up into the evening. There
// are most of them over the city; a few have come as far as the hill. Then the last touches:
// the air of the evening over the water, and the corners of the picture brought down.
'use strict';
const { studio, open, W, H, SHORE, ridge, GLOW } = require('./scene');
const { mix, wave } = studio;

const p = open('pyreflies');
const r = p.rng;
const tints = ['#d8fff0', '#c8f0ff', '#fff6c8', '#e8d8ff', '#d0ffd8'];

// One light: where it is, how big, which way it goes, and how bright.
function light(x, y, s, heading, strength = 1) {
  const color = tints[Math.floor(r() * tints.length)], tail = r.range(18, 40) * s, bend = r.range(-0.5, 0.5);
  const bx = x - Math.cos(heading) * tail, by = y - Math.sin(heading) * tail, mx = x - Math.cos(heading + bend) * tail * 0.5, my = y - Math.sin(heading + bend) * tail * 0.5;
  if (r() < 0.7) {                                                      // most have a short thread of light behind them
    p.tryStroke({ brush: 'soft', color, width: Math.max(8.2, 9 * s), opacity: 0.16 * strength, taper: [0.9, 0], points: [[bx, by], [mx, my], [x, y]] });
    p.tryStroke({ color: mix(color, '#ffffff', 0.3), width: 4, opacity: 0.28 * strength, taper: [1, 0], points: [[bx, by], [mx, my], [x, y]] });
  }
  const turn = r.range(0, 0.5), g = Math.max(12, 13 * s), c = Math.max(8.2, 8.4 * s);
  for (let q = 0; q < 6; q++) { const a = turn + q * Math.PI / 6; p.stroke({ brush: 'soft', color, width: g, opacity: 0.13 * strength, points: [[x - Math.cos(a) * g * 1.02, y - Math.sin(a) * g * 1.02], [x + Math.cos(a) * g * 1.02, y + Math.sin(a) * g * 1.02]] }); }
  for (let q = 0; q < 6; q++) { const a = turn + 0.26 + q * Math.PI / 6; p.stroke({ brush: 'soft', color: '#ffffff', width: c, opacity: 0.24 * strength, points: [[x - Math.cos(a) * c * 1.02, y - Math.sin(a) * c * 1.02], [x + Math.cos(a) * c * 1.02, y + Math.sin(a) * c * 1.02]] }); }
}

// The air of the evening, low over the water and round the feet of the ruins.
for (let k = 0; k < 10; k++) { const x = r.range(-100, W - 300), y = r.range(SHORE + 30, 600), len = r.range(260, 520); if (y < ridge(Math.min(W, Math.max(0, x + len / 2))) - 10) p.stroke({ brush: 'soft', color: mix('#e88a50', '#ffd890', r()), width: r.range(20, 36), opacity: r.range(0.06, 0.12), points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) }); }

// Over the city and the water: many, small.
for (let k = 0; k < 34; k++) {
  const x = r.range(30, W - 30), y = r.range(170, 600);
  if (y > ridge(x) - 12 || Math.hypot(x - GLOW.x, (y - GLOW.y) * 1.5) < 90) continue;
  light(x, y, r.range(0.7, 1.05), -Math.PI / 2 + r.range(-0.9, 0.9), r.range(0.6, 1));
}
// Over the hill: fewer, and bigger, for they are near. None is over the camp or the weapons.
for (const [x, y, s] of [[90, 760, 1.5], [640, 720, 1.3], [820, 890, 1.6], [1300, 720, 1.4], [1500, 900, 1.7], [1420, 560, 1.2], [1180, 930, 1.5], [1560, 640, 1.3]]) light(x, y, s, -Math.PI / 2 + r.range(-0.7, 0.7), 1);

// The corners, a tone darker.
for (const [x0, y0, x1, y1, w, o] of [[-80, H + 40, 640, H + 60, 200, 0.3], [W + 80, H + 40, 960, H + 60, 200, 0.34], [-90, -50, 520, -80, 220, 0.3], [W + 90, -50, 1080, -80, 220, 0.3]]) p.stroke({ brush: 'soft', color: '#0c0810', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
