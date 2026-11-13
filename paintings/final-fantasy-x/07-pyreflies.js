// The pyreflies: what is left of the dead. They leave the water as lights, go round the
// column and round her as she turns, and go up into the sky. Each is a small round light
// with a thread of light behind it, and there is a little of every color in them.
'use strict';
const { studio, open, W, COLUMN, YUNA } = require('./scene');
const { mix, clamp } = studio;

const p = open('pyreflies');
const r = p.rng;
const tints = ['#fff6c8', '#d8ffd0', '#ffd8ec', '#d0ecff', '#fff0a8'];

// One light: where it is, how big, which way it goes, and how bright.
function light(x, y, s, heading, strength = 1) {
  const color = tints[Math.floor(r() * tints.length)], tail = r.range(26, 60) * s, bend = r.range(-0.4, 0.4);
  // its thread, behind it
  const bx = x - Math.cos(heading) * tail, by = y - Math.sin(heading) * tail, mx = x - Math.cos(heading + bend) * tail * 0.5, my = y - Math.sin(heading + bend) * tail * 0.5;
  p.tryStroke({ brush: 'soft', color, width: Math.max(8.2, 9 * s), opacity: 0.2 * strength, taper: [0.9, 0], points: [[bx, by], [mx, my], [x, y]] });
  p.tryStroke({ color: mix(color, '#ffffff', 0.4), width: 4, opacity: 0.45 * strength, taper: [1, 0], points: [[bx, by], [mx, my], [x, y]] });
  // the light itself: many soft strokes that cross at its middle, so that it is round and has no rays
  const turn = r.range(0, 0.5), g = Math.max(12, 13 * s), c = Math.max(8.2, 8.4 * s);
  for (let q = 0; q < 6; q++) { const a = turn + q * Math.PI / 6; p.stroke({ brush: 'soft', color, width: g, opacity: 0.13 * strength, points: [[x - Math.cos(a) * g * 1.02, y - Math.sin(a) * g * 1.02], [x + Math.cos(a) * g * 1.02, y + Math.sin(a) * g * 1.02]] }); }
  for (let q = 0; q < 6; q++) { const a = turn + 0.26 + q * Math.PI / 6; p.stroke({ brush: 'soft', color: '#ffffff', width: c, opacity: 0.24 * strength, points: [[x - Math.cos(a) * c * 1.02, y - Math.sin(a) * c * 1.02], [x + Math.cos(a) * c * 1.02, y + Math.sin(a) * c * 1.02]] }); }
}

// Round the column and round her, from the sea up into the sky: three turns of a long winding path.
for (let k = 0; k < 46; k++) {
  const t = (k + r.range(0, 1)) / 46, y = 930 - 850 * Math.pow(t, 0.9), turn = t * 6.283 * 3 + 1, wide = 170 - 70 * Math.sin(Math.PI * clamp(t * 1.6, 0, 1)) + 220 * Math.pow(t, 3);
  const x = COLUMN.x + Math.cos(turn) * wide + r.range(-16, 16), front = Math.sin(turn);
  if (Math.abs(x - YUNA.x) < 34 && y > YUNA.y - 250 && y < YUNA.y - 120) continue;                        // not over her face and her body
  light(x, y + r.range(-12, 12), front > 0 ? r.range(1, 1.5) : r.range(0.7, 1), Math.atan2(-850 / 46 * 2.2, -Math.sin(turn) * wide * 0.4) + r.range(-0.3, 0.3), front > 0 ? 1 : 0.7);
}
// Others, leaving the water wherever the dead are.
for (let k = 0; k < 20; k++) {
  const x = r.range(120, W - 120), y = r.range(640, 960);
  if (Math.abs(x - COLUMN.x) < 110) continue;
  light(x, y, r.range(0.7, 1.2) * (0.6 + 0.6 * (y - 600) / 360), -Math.PI / 2 + (COLUMN.x - x) / 1400 + r.range(-0.4, 0.4), 0.8);
}
// And those that have gone up, high in the sky, small.
for (let k = 0; k < 12; k++) light(r.range(420, 1180), r.range(40, 240), r.range(0.7, 0.9), -Math.PI / 2 + r.range(-0.6, 0.6), 0.6);

p.save();
