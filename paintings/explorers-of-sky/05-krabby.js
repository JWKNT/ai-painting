// The Krabby, on the rocks. Each is a crab as big as a child's head: a red shell above, with
// two points on it over the eyes, and a pale body below, with a toothed edge where the two
// meet. It has two big claws, each with a red upper part and a small pale lower part, and
// four thin legs. They look out to sea and blow bubbles. The sun is beyond them, so the
// sides of them that we see are in shade, with its light along the tops of their shells
// and claws.
'use strict';
const { studio, open, SUNLIGHT } = require('./scene');
const { mix, solid, shape, glint } = studio;

const p = open('krabby');
const r = p.rng;
const red = { shadow: '#6c1c1c', half: '#b43424', lit: '#f46c3c', rim: '#ffe0a0', bounce: '#84304c' };
const pale = { shadow: '#94746c', half: '#d0ae88', lit: '#fbeac0', rim: '#fffbe0', bounce: '#a08094' };
const o = { light: SUNLIGHT, turn: 0.2, width: 5, length: 14, vary: 0.07, dash: 14, gap: 6, edgeOpacity: 0.9 };
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.1, cap: 'round' };

// One Krabby: where the middle of its body rests, how big it is, and which way it looks (1: to the right).
function krabby(kx, ky, s, face = 1) {
  const K = (x, y) => [kx + face * x * s, ky - y * s], C = (x, y, rad) => [kx + face * x * s, ky - y * s, rad * s], poly = (pts) => pts.map(([x, y]) => K(x, y));
  // its legs: two at each side, each in two parts with a joint, and a point at the end
  for (const [hx, kxx, kyy, fx] of [[-22, -40, 12, -50], [-12, -24, 4, -26], [16, 30, 4, 34], [26, 46, 12, 58]]) {
    p.tryStroke({ ...line, color: '#a4826c', width: Math.max(4.8, 6 * s), points: [K(hx, 6), K(kxx, kyy), K(fx, -14)], taper: [0, 0.6] });
    p.tryStroke({ color: '#f4d8a8', width: 4, opacity: 0.7, points: [K(hx, 9), K(kxx, kyy + 3)].map(([x, y], i) => [x + (i ? face * 4 : -face * 4), y]) });
  }
  // the claw on its far side: an arm, then the hand, which is a big upper part and a small lower part with a gap between them
  solid(p, [C(26, 14, 6), C(44, 34, 6)], red, { ...o, edge: false });
  shape(p, poly([[40, 34], [46, 58], [58, 74], [74, 78], [70, 62], [60, 50], [54, 34]]), red, { ...o, round: 8 });
  shape(p, poly([[54, 34], [62, 44], [76, 50], [72, 38], [62, 30]]), pale, { ...o, round: 6, length: 13 });
  // its body: the pale lower part, then the red shell over it
  shape(p, poly([[-34, 10], [-30, -8], [-12, -16], [14, -16], [32, -8], [36, 10]]), pale, { ...o, round: 12, length: 16 });
  shape(p, poly([[-38, 10], [-38, 26], [-28, 40], [-10, 46], [14, 46], [32, 40], [40, 26], [40, 10]]), red, { ...o, round: 16, length: 18 });
  for (let x = -30; x <= 30; x += 12) p.tryStroke({ ...line, color: '#fbeac0', width: Math.max(4.8, 6 * s), points: [K(x - 6, 9), K(x, 1), K(x + 6, 9)] });   // the toothed edge where the two parts meet
  for (const x of [-16, 16]) { p.tryStroke({ ...line, color: '#b43424', width: Math.max(5, 10 * s), taper: [0, 0.85], points: [K(x, 42), K(x + 1, 55), K(x + 3, 68)] }); p.tryStroke({ color: '#ffd090', width: 4, opacity: 0.8, taper: [0, 0.7], points: [K(x + 3, 46), K(x + 5, 64)] }); }   // the two points on its shell
  // its eyes: white, each with a small dark middle, on the side that it looks to
  for (const x of [-4, 20]) {
    p.tryStroke({ ...line, color: '#fffaf0', width: Math.max(5, 6.4 * s), points: [K(x, 37), K(x, 22)] });
    p.tryStroke({ ...line, color: '#201418', width: 4.6, points: [K(x + 2, 33), K(x + 2, 33 - 12.4 / s)] });
  }
  // the claw on our side, bigger: it is held up, open
  solid(p, [C(-28, 14, 7), C(-46, 36, 7)], red, { ...o, edge: false });
  shape(p, poly([[-52, 34], [-58, 60], [-52, 80], [-36, 90], [-26, 84], [-36, 74], [-40, 58], [-38, 38]]), red, { ...o, round: 9 });
  shape(p, poly([[-38, 38], [-30, 52], [-18, 62], [-12, 56], [-22, 40], [-32, 32]]), pale, { ...o, round: 6, length: 13 });
  glint(p, [K(-36, 12), K(-38, 28), K(-26, 42), K(-8, 48), K(14, 48)], () => mix('#ffb060', '#ffe4a0', r()), { width: 4.2, dash: 12, gap: 12, opacity: 0.5, rng: r });   // the sun along the top of its shell
}
krabby(72, 620, 1.25);
krabby(180, 660, 1.15);
krabby(290, 722, 1.05);
krabby(1318, 736, 1.0, -1);

p.save();
