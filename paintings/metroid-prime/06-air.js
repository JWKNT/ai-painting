// The air of the cavern: small seeds of light that drift up from the mushrooms; black
// rock near us at the right, which the Phazon lights from behind; and the corners of
// the picture, darker.
'use strict';
const { studio, open, W, H, FUNGI, PHAZON, fungal, floorY } = require('./scene');
const { mix, glow } = studio;

const p = open('air');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.04, dry: 0, rag: 0.2, cap: 'round' };
// the seeds of light: more of them near a mushroom. Each is a small round light with no edge.
for (let k = 0; k < 70; k++) { const f = FUNGI[Math.floor(r() * FUNGI.length)], x = f.x + r.gauss() * f.cap * 1.3, y = f.base - f.h * r.range(-0.1, 1.0) + r.range(-40, 40); if (x < 0 || x > W || y < 20 || y > floorY(x)) continue; const b = Math.pow(r(), 1.6); glow(p, x, y, 9 + 5 * b, mix('#2fb8d0', '#bff8ff', b), 0.1 + 0.3 * b, 8); }
// black rock near us, at the right foot of the picture: the Phazon is behind it, so we see only its shape
for (const [pts, w] of [[[[1290, 1010], [1380, 950], [1470, 930], [1560, 900], [1620, 870]], 90], [[[1180, 1020], [1300, 990], [1420, 985]], 60]]) p.stroke({ ...line, color: '#020308', width: w, points: pts.map(([x, y]) => [x, y + w * 0.4]) });
for (let k = 0; k < 9; k++) { const x = r.range(1300, 1590), y = 930 - (x - 1300) * 0.2 + r.range(-10, 6), h = r.range(30, 80), lean = r.range(-0.4, 0.3); p.tryStroke({ ...line, color: '#020308', width: r.range(5, 8), taper: [0, 0.85], points: [[x, y + 8], [x + lean * h * 0.4, y - h * 0.6], [x + lean * h, y - h]] }); }   // thin dark growths on it
// the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 200, 0.4], [W + 60, -40, 1140, -70, 200, 0.4], [-60, H + 50, 520, H + 60, 150, 0.4], [W + 60, H + 50, 1080, H + 60, 150, 0.3]]) p.stroke({ brush: 'soft', color: '#010206', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void PHAZON; void fungal;

p.save();
