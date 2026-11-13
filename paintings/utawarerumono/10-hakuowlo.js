// Hakuowlo, nearest to us, seen from the side as he looks out over Tuskur. His hair is black
// and comes to his shoulders. The mask is white, like bone: it is over his brow, his eyes and
// his nose, and a horn of it goes up at each temple. His long robe is the blue of slate, with
// a broad white collar edged with gold that comes down the front of it. The iron fan that he
// fights with is shut in his hand. The sun is on the mask and down the front of him.
'use strict';
const { studio, open, HAKUOWLO, SUNWARD, body } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('hakuowlo');
const r = p.rng;
const K = body(HAKUOWLO);
const o = { light: SUNWARD, turn: 0, width: 8, length: 36, vary: 0.05, dash: 28, gap: 11, edgeOpacity: 0.8 };
const robe = { shadow: '#283044', half: '#44536f', lit: '#8c9bb2', rim: '#f4deb6', bounce: '#3b4674' };
const hair = { shadow: '#0c0b10', half: '#1d1b24', lit: '#4a4852', rim: '#d8c0a0', bounce: '#1a1a2c' };
const skin = { shadow: '#96634f', half: '#c99274', lit: '#f4c8a0', rim: '#ffe6c6', bounce: '#a47464' };
const dark = { shadow: '#15151c', half: '#24242e', lit: '#4c4c58', rim: '#c8b89c', bounce: '#1c1c2c' };
const line = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.15, cap: 'round' };

// his shadow, long on the grass, away from the sun
for (const [dy, w, op] of [[0, 48, 0.44], [18, 36, 0.3]]) p.stroke({ brush: 'soft', color: '#303a28', width: w, opacity: op, points: [K(34, 6 - dy), K(-110, -2 - dy), K(-300, -10 - dy), K(-520, -16 - dy)] });

// his feet and the long skirts of the robe
solid(p, [K(-22, 17, 13), K(2, 11, 11)], dark, { ...o, width: 5.5, length: 16 });
solid(p, [K(10, 17, 13), K(38, 11, 11)], dark, { ...o, width: 5.5, length: 16 });
solid(p, [K(2, 62, 58), K(4, 150, 52), K(6, 240, 47)], robe, { ...o, length: 52 });
for (const [x0, y0, x1, y1, x2, y2, op] of [[-10, 234, -22, 150, -28, 40, 0.5], [18, 232, 22, 150, 18, 44, 0.36], [-30, 226, -44, 140, -50, 60, 0.4]]) p.stroke({ ...line, color: '#161c30', width: 9, opacity: op, rag: 0.3, taper: [0.3, 0.3], points: [K(x0, y0), K(x1, y1), K(x2, y2)] });   // folds
p.stroke({ ...line, color: '#f4deb6', width: 6, opacity: 0.5, rag: 0.3, taper: [0.3, 0.3], points: [K(46, 226), K(52, 150), K(54, 60)] });       // the light down the front edge

// his body, the white collar that comes down the front of it, his belt
solid(p, [K(6, 240, 47), K(8, 310, 50), K(8, 352, 44)], robe, { ...o, length: 40 });
solid(p, [K(15, 368, 12), K(25, 352, 9.5)], dark, { ...o, width: 5.5, length: 16, edge: false });                                               // the dark under-collar at his neck
p.stroke({ ...line, color: '#b9b2c4', width: 17, points: [K(20, 370), K(36, 332), K(45, 284), K(44, 244)] });                                    // the collar, first in its shade
p.stroke({ ...line, color: '#fff3da', width: 11, points: [K(24, 368), K(40, 330), K(49, 284), K(48, 246)] });                                    // then where the sun is on it
for (const dx of [-9, 9]) glint(p, [K(20 + dx, 368), K(36 + dx, 332), K(45 + dx, 284), K(44 + dx, 246)], () => mix('#d6a544', '#f0cc70', r()), { width: 4, dash: 40, gap: 5, opacity: 0.9, rng: r });   // its gold edges
p.stroke({ ...line, color: '#1d2238', width: 19, points: [K(-40, 246), K(-10, 240), K(14, 240)] });                                              // the belt
p.stroke({ ...line, color: '#4b5b86', width: 19, points: [K(12, 240), K(36, 243), K(52, 248)] });

// his arm on our side, with the wide sleeve of the robe; his hand, and the fan shut in it
solid(p, [K(22, 262, 24), K(44, 214, 26)], robe, { ...o, length: 30 });                                                                         // the sleeve, hanging
solid(p, [K(4, 350, 25), K(14, 268, 21), K(50, 232, 15)], robe, { ...o, length: 34 });
p.stroke({ ...line, color: '#161c30', width: 7, opacity: 0.55, rag: 0.3, taper: [0.3, 0.3], points: [K(0, 330), K(6, 280), K(26, 250)] });       // the fold inside his elbow
p.stroke({ ...line, color: '#2a2830', width: 9, cap: 'flat', points: [K(58, 238), K(96, 222), K(132, 206)] });                                   // the fan: ribs of iron, shut
p.tryStroke({ color: '#d4c4a0', width: 4, opacity: 0.8, points: [K(64, 240), K(132, 211)] });
solid(p, [K(54, 232, 9.5), K(66, 227, 8.5)], skin, { ...o, width: 5, length: 14 });

// his neck and his head: the hair first, then his face under the mask, then the mask
solid(p, [K(10, 370, 13), K(12, 386, 12.5)], skin, { ...o, width: 5.5, length: 16, edge: false });
solid(p, [K(-14, 398, 20), K(-18, 372, 17), K(-15, 350, 13)], hair, { ...o, width: 6, length: 24 });                                             // down to his shoulders
solid(p, [K(30, 396, 14), K(33, 385, 10)], skin, { ...o, width: 5.5, length: 16 });                                                              // cheek, mouth and chin
solid(p, [K(4, 416, 30), K(8, 428, 26)], hair, { ...o, width: 6.5, length: 26 });
for (let k = 0; k < 9; k++) {                                            // the ends of his hair, loose at his neck
  const x = -34 + k * 5 + r.range(-2, 2), y = 372 + r.range(-10, 14), l = r.range(20, 34);
  p.tryStroke({ ...line, color: k % 3 ? '#0c0b10' : '#2c2a36', width: r.range(4.8, 6.5), taper: [0.1, 0.8], points: [K(x, y), K(x - 4, y - l * 0.5), K(x - 3 + r.range(-4, 4), y - l)] });
}
// the mask
p.stroke({ ...line, color: '#b7b1c6', width: 13, points: [K(13, 413), K(30, 412), K(42, 410)] });                                                // over his cheek and eye, in shade at the back
p.stroke({ ...line, color: '#b7b1c6', width: 13, points: [K(15, 426), K(30, 426), K(42, 424)] });                                                // over his brow
p.stroke({ ...line, color: '#fff4dc', width: 9, points: [K(24, 412), K(34, 411), K(43, 409)] });                                                 // where the sun is on it
p.stroke({ ...line, color: '#fff4dc', width: 9, points: [K(25, 426), K(35, 426), K(43, 423)] });
p.stroke({ ...line, color: '#fff8e6', width: 6.5, points: [K(40, 430), K(45, 416), K(47, 402)] });                                               // down his nose
p.stroke({ ...line, color: '#d9d2dc', width: 8.5, taper: [0, 0.85], points: [K(21, 430), K(15, 450), K(6, 466)] });                              // the horn at his temple
p.tryStroke({ color: '#fff8e6', width: 4, opacity: 0.9, taper: [0, 0.7], points: [K(24, 432), K(18, 450), K(10, 464)] });
p.stroke({ color: '#241a22', width: 4.6, points: [K(23, 417), K(37, 416)] });                                                                   // the opening for his eye
p.tryStroke({ color: '#8c2a2a', width: 4, opacity: 0.9, points: [K(37, 432), K(41, 419.5)] });                                                  // the mark on its brow
solid(p, [K(22, 442, 11), K(33, 433, 8)], hair, { ...o, width: 5.5, length: 15, edge: false });                                                  // his hair over the top of it
glint(p, [K(-6, 446), K(12, 450), K(28, 442)], () => '#b8a890', { width: 4.2, dash: 18, gap: 9, opacity: 0.6, rng: r });                         // light on his hair

p.save();
