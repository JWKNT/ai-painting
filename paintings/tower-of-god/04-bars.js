// The wall of bars. It is of black iron and goes up out of the picture: upright bars, all
// across, with two rails. Over the lower rail each bar has a point like the head of a
// spear, and between the bars along the upper rail there are rings. We see the bars against
// the light, so they are black; only their edges that are toward the light take a little
// of the green.
'use strict';
const { studio, open, W, FLOOR, LIGHT, BARS, bright } = require('./scene');
const { mix, shape } = studio;

const p = open('bars');
const line = { brush: 'bristle', mix: 0, dry: 0, rag: 0.04, cap: 'flat' };
const iron = (x, y) => mix('#030605', '#0c1810', bright(x, y) * 0.6);
const edge = (x, y) => mix('#1c3c24', '#b8f090', bright(x, y));

// the upright bars: thick below the lower rail, thinner over it
for (let x = BARS.step / 2 - 2; x < W + 10; x += BARS.step) {
  const side = x < LIGHT.x ? 1 : -1;
  for (let y = -10; y < FLOOR + 6; y += 150) { const y1 = Math.min(FLOOR + 6, y + 160), w = y > BARS.rail1 - 80 ? 12 : 8.5; p.stroke({ ...line, color: iron(x, (y + y1) / 2), width: y1 > BARS.rail1 ? 12 : w, points: [[x, y], [x, y1]] }); }
  for (let y = 60; y < FLOOR - 40; y += 120) p.tryStroke({ brush: 'round', color: edge(x, y + 50), width: 4, opacity: 0.25 + 0.6 * bright(x, y + 50), points: [[x + side * 4.6, y], [x + side * 4.6, y + 100]] });   // the light on the edge of it
  // its point, over the lower rail: a long head like a spear's
  shape(p, [[x, BARS.rail1 - 96], [x + 15, BARS.rail1 - 42], [x + 6, BARS.rail1 - 14], [x - 6, BARS.rail1 - 14], [x - 15, BARS.rail1 - 42]], { shadow: '#020403', half: '#050a07', lit: '#0c1c10', bounce: '#030605' }, { light: [side, 0.3], turn: 0.4, width: 5.5, length: 22, round: 8, flow: () => Math.PI / 2, edge: false });
  p.tryStroke({ brush: 'round', color: edge(x, BARS.rail1 - 50), width: 4, opacity: 0.3 + 0.5 * bright(x, BARS.rail1 - 50), points: [[x + side * 12, BARS.rail1 - 44], [x + side * 2, BARS.rail1 - 90]] });
}
// the rails: each is two level bars, close together
for (const [y, w] of [[BARS.rail1, 13], [BARS.rail1 + 30, 9], [BARS.rail2, 11], [BARS.rail2 + 62, 9]]) {
  for (let x = -10; x < W + 10; x += 200) p.stroke({ ...line, color: iron(x + 100, y), width: w, points: [[x, y], [x + 212, y]] });
  for (let x = 0; x < W; x += 100) p.tryStroke({ brush: 'round', color: edge(x + 50, y), width: 4, opacity: 0.2 + 0.5 * bright(x + 50, y), points: [[x, y + w * 0.36], [x + 96, y + w * 0.36]] });
}
// the rings between the bars, along the upper rail
for (let x = BARS.step - 2; x < W + 10; x += BARS.step) {
  const cy = BARS.rail2 + 31, R = 16;
  for (let i = 0; i < 6; i++) p.tryStroke({ brush: 'bristle', mix: 0, rag: 0.04, cap: 'round', color: iron(x, cy), width: 6.5, points: studio.arc(x, cy, R, i * Math.PI / 3, (i + 1.15) * Math.PI / 3, 5) });
  p.tryStroke({ brush: 'round', color: edge(x, cy), width: 4, opacity: 0.2 + 0.5 * bright(x, cy), points: studio.arc(x, cy, R - 4, 0.5, 2.6, 6) });
}
// the foot of the wall: a low black sill
for (let x = -10; x < W + 10; x += 200) p.stroke({ ...line, color: '#030504', width: 16, points: [[x, FLOOR - 2], [x + 212, FLOOR - 2]] });

p.save();
