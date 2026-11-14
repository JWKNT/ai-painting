// The klaxosaur. It is as big as a hill and it walks: a body of black slabs, one on
// another, on four legs like towers, with a long head of slabs that it holds low and
// forward, toward the Plantation. Its hide is black and smooth; the lines where its slabs
// meet shine blue, and in its chest is a great blue light. Each slab has three faces that
// we see: the one toward us, which is black; the one at its left, which the sun finds; and
// its top. Dust stands about its feet.
'use strict';
const { studio, open, HORIZON, CORE, DEPTH, nA } = require('./scene');
const { mix, clamp, inPoly, glow } = studio;

const p = open('klaxosaur');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.08, cap: 'flat' };
const [DX, DY] = DEPTH;
const haze = (c, y) => mix(c, '#d8c8a8', clamp((y - 420) / 260, 0, 1) * 0.5);                 // the dust is thick low down
function face(quad, color, flow) {
  const xs = quad.map((q) => q[0]), ys = quad.map((q) => q[1]);
  p.fill({ inside: inPoly(quad), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 9, length: 60, spacing: 0.45, overlap: 0.7, angle: () => flow, color: (x, y) => haze(mix(color, '#000000', (nA(x / 60, y / 60) - 0.5) * 0.2), y), stroke: { ...line, opacity: 0.97 } });
}
const glowLine = (a, b, w = 4.6, op = 0.95) => { p.tryStroke({ brush: 'soft', color: '#38b8ff', width: 12, opacity: 0.22, points: [a, b] }); p.tryStroke({ brush: 'round', color: '#a8f0ff', width: w, opacity: op, points: [a, b] }); };
// A slab: its face toward us is the rectangle from (x0, y0) to (x1, y1); it goes back by `deep` times the common way.
function slab(x0, y0, x1, y1, deep = 1, o = {}) {
  const dx = DX * deep, dy = DY * deep;
  face([[x0, y0], [x1, y0], [x1 + dx, y0 + dy], [x0 + dx, y0 + dy]], '#243a6c', 0.5);                    // its top
  face([[x0, y0], [x0 + dx, y0 + dy], [x0 + dx, y1 + dy], [x0, y1]], '#16264c', Math.PI / 2);            // its left face, toward the sun
  face([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], '#080c1a', Math.PI / 2);                               // its face toward us
  if (!o.foot) { p.stroke({ ...line, color: haze('#080c1a', y1), width: 10, points: [[x0, y1 - 3], [x1, y1 - 3]] }); p.stroke({ ...line, color: haze('#16264c', y1), width: 9, points: [[x0, y1 - 3], [x0 + dx, y1 + dy - 3]] }); }   // its under edges, clean
  p.stroke({ ...line, color: haze('#080c1a', (y0 + y1) / 2), width: 8, points: [[x1 - 3, y0], [x1 - 3, y1]] });                                              // and its right edge
  if (o.lines !== false) { glowLine([x0, y0], [x1, y0]); glowLine([x0, y0], [x0, y1], 4.4, 0.8); glowLine([x0, y0], [x0 + dx, y0 + dy], 4.4, 0.8); }
  for (const [u, v0, v1] of o.marks || []) glowLine([x0 + (x1 - x0) * u, y0 + (y1 - y0) * v0], [x0 + (x1 - x0) * u, y0 + (y1 - y0) * v1], 4.4, 0.85);
}

// its far legs, then its body, then its near legs, then its head
slab(930, 470, 1010, HORIZON + 10, 0.8, { lines: false, foot: true });
slab(1300, 470, 1390, HORIZON + 10, 0.8, { lines: false, foot: true });
slab(880, 250, 1460, 500, 2.2, { marks: [[0.2, 0.1, 0.9], [0.5, 0.5, 1], [0.78, 0.1, 0.8]] });               // the body
slab(960, 170, 1380, 262, 1.8, { marks: [[0.3, 0.2, 0.9], [0.66, 0.2, 0.9]] });                              // the slab on its back
slab(1080, 110, 1290, 178, 1.2);                                                                           // and the one on that
slab(820, 480, 920, HORIZON + 26, 1, { marks: [[0.5, 0.1, 0.5]], foot: true });                                         // its near legs: towers, thicker toward the foot
slab(804, 600, 938, HORIZON + 30, 1.1, { lines: false, foot: true });
slab(1190, 480, 1300, HORIZON + 30, 1, { marks: [[0.5, 0.1, 0.5]], foot: true });
slab(1174, 600, 1318, HORIZON + 34, 1.1, { lines: false, foot: true });
slab(700, 330, 900, 440, 1.5, { marks: [[0.4, 0.2, 0.8]] });                                               // its neck
slab(560, 370, 740, 462, 1.2);                                                                             // its head: a long slab, held low
for (const [x0, y0, x1, y1] of [[560, 370, 500, 330], [600, 370, 560, 318]]) { p.tryStroke({ ...line, cap: 'round', color: '#080c1a', width: 16, taper: [0, 0.8], points: [[x0 + 16, y0 + 6], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] }); glowLine([x0 + 10, y0], [x1, y1], 4.2, 0.7); }   // two horns on it
glowLine([570, 420], [730, 420], 5, 0.95);                                                                 // the long blue slit that is its eye

// the blue marks on its side: a great X, as these beasts have; and the light in its chest
for (const [a, b] of [[[1000, 300], [1180, 450]], [[1180, 300], [1000, 450]]]) { p.tryStroke({ brush: 'soft', color: '#38b8ff', width: 40, opacity: 0.2, points: [a, b] }); p.tryStroke({ ...line, cap: 'round', color: '#58d0ff', width: 16, points: [a, b] }); p.tryStroke({ brush: 'round', color: '#e8fcff', width: 6, points: [a, b] }); }
for (const [w, op, n] of [[220, 0.08, 4], [130, 0.14, 5], [70, 0.26, 6]]) glow(p, CORE.x, CORE.y, w, '#58d0ff', op, n);
glow(p, CORE.x, CORE.y, 30, '#f4feff', 0.5, 6);

// the dust that it throws up: it stands about its feet and trails away to the right
for (let k = 0; k < 46; k++) { const x = r.range(700, 1560), y = HORIZON + r.range(-70, 46), w = r.range(40, 110); p.stroke({ brush: 'soft', color: mix('#c8b088', '#f0e0c0', r()), width: w, opacity: r.range(0.08, 0.2), points: [[x - w * 1.1, y + 10], [x, y - r.range(4, 20)], [x + w * 1.1, y + 6]] }); }

p.save();
