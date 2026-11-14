// The snow that falls. The wind takes it a little to the right. Far off it is small and
// thin; near us each flake is a soft pale touch. Then a thin mist over the far water,
// and the corners of the picture, a tone darker.
'use strict';
const { studio, open, W, H, SHORE } = require('./scene');
const { mix } = studio;

const p = open('snow');
const r = p.rng;
// mist over the far part of the lake
for (let k = 0; k < 12; k++) { const x = r.range(-100, W - 200), len = r.range(300, 700), y = r.range(SHORE - 10, SHORE + 50); p.stroke({ brush: 'soft', color: mix('#aebac2', '#dfe6e8', r()), width: r.range(20, 40), opacity: r.range(0.05, 0.1), points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y]] }); }
// not much of it falls over her: she is the nearest thing
const onHer = (x, y) => x > 300 && x < 570 && y > 470 && y < 820;
for (const [n, len, w, op, soft] of [[260, [12.4, 14], 4, [0.14, 0.36], false], [110, [13, 18], 4.4, [0.25, 0.55], false], [44, [20, 28], 9.6, [0.25, 0.5], true]]) for (let k = 0; k < n; k++) {
  const x = r.range(0, W), y = r.range(0, H), l = r.range(len[0], len[1]), a = 1.1 + r.range(-0.5, 0.5);
  if (onHer(x, y) && (soft || r() < 0.7)) continue;
  p.tryStroke({ brush: soft ? 'soft' : 'round', color: mix('#e4eaee', '#ffffff', r()), width: soft ? r.range(9, 12) : w, opacity: r.range(op[0], op[1]), taper: [0.7, 0.7], points: [[x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
}
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 190, 0.2], [W + 60, -40, 1140, -70, 190, 0.26], [-60, H + 50, 520, H + 60, 130, 0.2], [W + 60, H + 50, 1080, H + 60, 150, 0.2]]) p.stroke({ brush: 'soft', color: '#161e26', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
