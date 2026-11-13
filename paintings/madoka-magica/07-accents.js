// The last touches: sparks that the storm takes up from the fires, the pale light round the
// witch over what is near her, and the corners of the picture brought down.
'use strict';
const { studio, open, W, H, WITCH } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;
for (let k = 0; k < 80; k++) {
  const x = r.range(20, W - 20), y = 800 - Math.pow(r(), 1.5) * 420, a = Math.atan2(y - WITCH.y, x - WITCH.x) + Math.PI / 2 + 0.4 + r.range(-0.3, 0.3), len = r.range(12.4, 20);
  if (Math.abs(x - 330) < 60 && y > 660) continue;                                               // not over her
  p.tryStroke({ color: mix('#ff8a2c', '#ffe490', r()), width: r.range(4, 4.8), opacity: r.range(0.35, 0.85), taper: [0.6, 0], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}
for (const [w, o] of [[420, 0.07], [260, 0.08]]) p.stroke({ brush: 'soft', color: '#e4f4e0', width: w, opacity: o, points: [[WITCH.x - w * 1.02, WITCH.y + 30], [WITCH.x, WITCH.y], [WITCH.x + w * 1.02, WITCH.y + 30]] });
for (const [x0, y0, x1, y1, w, o] of [[-80, H + 40, 640, H + 60, 200, 0.3], [W + 80, H + 40, 960, H + 60, 220, 0.4], [-90, -50, 420, -80, 220, 0.3], [W + 90, -50, 1240, -80, 200, 0.24]]) p.stroke({ brush: 'soft', color: '#04060a', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
