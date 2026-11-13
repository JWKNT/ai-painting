// The Krabby, on the rocks. Each is a crab with a red shell above and a pale body below, two
// big claws held up, and two points over its eyes. They face the sea and blow bubbles. The
// sun is beyond them, so we see them dark, with its light along their shells and claws.
'use strict';
const { studio, open, SUNLIGHT } = require('./scene');
const { solid } = studio;

const p = open('krabby');
const red = { shadow: '#7a2420', half: '#c2402c', lit: '#f87a48', rim: '#ffe2a2', bounce: '#8c3048' };
const pale = { shadow: '#9a7a70', half: '#d6b68e', lit: '#fff0c8', rim: '#fffbe0', bounce: '#a88898' };
const o = { light: SUNLIGHT, turn: 0.25, width: 5.5, length: 18, vary: 0.06, dash: 14, gap: 7, edgeOpacity: 0.85 };

// One Krabby: where the middle of its body rests, how big it is, and which way it faces (1: to the right).
function krabby(kx, ky, s, face = 1) {
  const K = (x, y, rad) => [kx + face * x * s, ky + y * s, rad * s];
  const leg = (x0, y0, x1, y1, x2, y2) => p.tryStroke({ brush: 'bristle', color: '#8c6a68', width: Math.max(4.8, 6 * s), mix: 0.1, dry: 0, rag: 0.1, cap: 'round', taper: [0, 0.7], points: [K(x0, y0, 0).slice(0, 2), K(x1, y1, 0).slice(0, 2), K(x2, y2, 0).slice(0, 2)] });
  leg(-18, -8, -34, -2, -40, 14); leg(-6, -6, -14, 6, -16, 18); leg(10, -6, 18, 6, 22, 18); leg(22, -8, 36, -2, 44, 12);   // its legs
  // the claw on its far side, a little smaller
  solid(p, [K(24, -24, 6.5), K(40, -44, 6.5)], red, { ...o, edge: false });
  solid(p, [K(46, -40, 7.5), K(60, -50, 5.5)], pale, o);
  solid(p, [K(42, -48, 11), K(52, -64, 8)], red, o);
  // its body: pale below, red above
  solid(p, [K(-20, -12, 13), K(20, -12, 13)], pale, o);
  solid(p, [K(-22, -27, 17), K(22, -27, 17)], red, { ...o, length: 22 });
  for (const x of [-12, 12]) solid(p, [K(x, -42, 5.5), K(x + 2, -54, 4.6)], red, { ...o, edge: false, length: 13 });   // the points over its eyes
  // the claw on our side
  solid(p, [K(-26, -22, 7), K(-40, -46, 7)], red, { ...o, edge: false });
  solid(p, [K(-30, -46, 8), K(-22, -62, 6)], pale, o);
  solid(p, [K(-42, -50, 13), K(-38, -72, 9)], red, o);
}
krabby(58, 628, 0.92);
krabby(164, 664, 0.86);
krabby(274, 722, 0.8);
krabby(1326, 740, 0.78, -1);

p.save();
