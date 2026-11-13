// Eruruu, beside him and a step ahead, turned to the valley like him. She is seen from the
// side: dark hair tied low at her neck, a white ear that hangs down over it, a long pale
// dress with bands of red at the hem, a blue sash, and behind her the thick white tail of
// her people. The sun is on her face and down the front of her dress.
'use strict';
const { studio, open, ERURUU, SUNWARD, body } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('eruruu');
const r = p.rng;
const E = body(ERURUU), s = ERURUU.s;
const o = { light: SUNWARD, turn: 0, width: 7, length: 30, vary: 0.05, dash: 24, gap: 10, edgeOpacity: 0.8 };
const dress = { shadow: '#8e8698', half: '#cdc0b4', lit: '#fff0d4', rim: '#fffaea', bounce: '#a59db6' };
const fur = { shadow: '#847e9c', half: '#c0b8c4', lit: '#fff2da', rim: '#fffbea', bounce: '#9a93b2' };
const hair = { shadow: '#272226', half: '#463c40', lit: '#847266', rim: '#e6c298', bounce: '#34303c' };
const skin = { shadow: '#a06e5c', half: '#d49e80', lit: '#fad4ac', rim: '#ffecd0', bounce: '#b08070' };
const boot = { shadow: '#38261f', half: '#5c4029', lit: '#96703f', rim: '#e0bc84', bounce: '#463630' };
const line = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.15, cap: 'round' };

// her shadow, long on the grass, away from the sun
for (const [dy, w, op] of [[0, 40, 0.42], [16, 30, 0.28]]) p.stroke({ brush: 'soft', color: '#333d2a', width: w, opacity: op, points: [E(30, 6 - dy), E(-120, -2 - dy), E(-330, -10 - dy), E(-560, -18 - dy)] });

// her tail
solid(p, [E(-28, 206, 15), E(-60, 196, 21), E(-86, 160, 24), E(-92, 116, 19), E(-84, 86, 11)], fur, { ...o, length: 24 });
for (let k = 0; k < 14; k++) {                                           // the long fur of it
  const t = r(), x = -60 - 30 * t + r.range(-16, 16), y = 190 - 90 * t + r.range(-14, 14);
  p.tryStroke({ ...line, color: mix('#a59eb6', '#fff6e2', r()), width: 4.8, opacity: 0.8, rag: 0.3, taper: [0.1, 0.7], points: [E(x, y), E(x - 4, y - 16)] });
}

// her boots, her dress, the red bands at its hem
solid(p, [E(-14, 46, 13), E(-12, 16, 12), E(4, 9, 10)], boot, { ...o, length: 16 });
solid(p, [E(14, 46, 13), E(18, 16, 12), E(36, 9, 10)], boot, { ...o, length: 16 });
solid(p, [E(2, 72, 50), E(2, 150, 42), E(4, 228, 31)], dress, { ...o, length: 44 });
for (const [fy, w] of [[44, 9], [64, 6]]) {
  p.stroke({ ...line, color: '#7e2a2c', width: w, points: [E(-46, fy + 8), E(-20, fy - 2), E(8, fy - 4)] });
  p.stroke({ ...line, color: '#c84a30', width: w, points: [E(8, fy - 4), E(32, fy), E(49, fy + 9)] });
}
for (const [x0, y0, x1, y1, x2, y2, op] of [[-8, 222, -18, 150, -22, 70, 0.4], [14, 220, 18, 150, 14, 76, 0.3], [-24, 214, -36, 140, -42, 84, 0.34]]) p.stroke({ ...line, color: '#847c92', width: 7, opacity: op, rag: 0.3, taper: [0.3, 0.3], points: [E(x0, y0), E(x1, y1), E(x2, y2)] });   // folds
p.stroke({ ...line, color: '#fffaea', width: 6, opacity: 0.6, rag: 0.3, taper: [0.3, 0.3], points: [E(30, 216), E(40, 150), E(42, 90)] });                                    // the light down the front of it

// her body, the sash, her arm, her hands
solid(p, [E(4, 228, 31), E(6, 290, 33), E(6, 318, 28)], dress, { ...o, length: 34 });
p.stroke({ ...line, color: '#34508e', width: 17 * s, points: [E(-29, 232), E(-8, 228), E(10, 228)] });
p.stroke({ ...line, color: '#6e90d2', width: 17 * s, points: [E(4, 228), E(22, 230), E(40, 235)] });
for (const [x1, y1] of [[-40, 176], [-30, 164]]) p.stroke({ ...line, color: '#2f4884', width: 8, taper: [0, 0.4], points: [E(-28, 232), E((x1 - 28) / 2 - 4, (y1 + 232) / 2), E(x1, y1)] });       // its ends, behind her
solid(p, [E(2, 314, 16), E(6, 262, 14), E(30, 232, 12)], dress, { ...o, length: 26 });
p.stroke({ ...line, color: '#c84a30', width: 5, points: [E(20, 226), E(30, 246)] });                                                          // the red at her sleeve
solid(p, [E(38, 228, 8), E(48, 224, 7.5)], skin, { ...o, width: 5, length: 14 });

// her neck, her hair, her face, her ear
solid(p, [E(6, 322, 9.5), E(8, 336, 9.5)], skin, { ...o, width: 5, length: 14, edge: false });
solid(p, [E(-16, 342, 12), E(-26, 306, 11), E(-28, 268, 9), E(-24, 240, 6.5)], hair, { ...o, width: 5.5, length: 22 });                       // tied low, and down her back
solid(p, [E(24, 354, 15), E(27, 342, 11)], skin, { ...o, width: 5, length: 14 });
solid(p, [E(2, 364, 27), E(4, 372, 24)], hair, { ...o, width: 6, length: 22 });
solid(p, [E(20, 380, 12), E(29, 369, 8.5)], hair, { ...o, width: 5, length: 14 });                                                            // over her brow
solid(p, [E(14, 352, 8), E(12, 332, 7)], hair, { ...o, width: 5, length: 14, edge: false });                                                  // a lock in front of her ear
p.tryStroke({ ...line, color: '#a8745e', width: 4.8, opacity: 0.6, points: [E(24, 358), E(37.5, 357)] });                                      // the shade of her eye
p.stroke({ ...line, color: '#fad4ac', width: 5, points: [E(33, 361), E(42, 350)] });                                                           // the end of her nose
// Her ear: it is the ear of an animal, white and soft. It leaves the side of her head and hangs down and back, to a point.
solid(p, [E(5, 362, 8.5), E(-3, 346, 9), E(-9, 329, 6.5), E(-11, 318, 4.8)], fur, { ...o, width: 5, length: 16 });
p.stroke({ ...line, color: '#a8a0b6', width: 4.8, opacity: 0.6, taper: [0.2, 0.5], points: [E(2, 356), E(-4, 342), E(-9, 326)] });               // the hollow of it
for (const [fx, fy, a] of [[-12, 322, 0.35], [-7, 319, 0.05]]) p.tryStroke({ ...line, color: mix('#c8c0cc', '#fff6e4', r()), width: 4.8, opacity: 0.85, rag: 0.3, taper: [0.1, 0.7], points: [E(fx, fy), E(fx - Math.sin(a) * 15, fy - Math.cos(a) * 15)] });   // the long fur at its edge
glint(p, [E(4, 393), E(16, 393), E(26, 387)], () => '#e6c298', { width: 4.2, dash: 12, gap: 12, opacity: 0.4, rng: r });                       // light on the top of her hair

p.save();
