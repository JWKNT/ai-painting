// Johan, far down the street, alone in the middle of it. He stands easily, in a dark suit,
// his fair hair wet. He has lifted his right hand and laid one finger against his forehead.
// The bright road is behind him and under him, so he is a dark upright mark on it, and he
// stands in it again upside down.
'use strict';
const { studio, open, JOHAN } = require('./scene');
const { mix } = studio;

const p = open('johan');
const r = p.rng;
const s = JOHAN.h / 100, J = (x, y) => [JOHAN.x + x * s, JOHAN.y + y * s];   // he is laid out 100 units tall
const mark = (a, b, w, color, extra = {}) => p.stroke({ brush: 'bristle', color, width: w, mix: 0, dry: 0, rag: 0.05, cap: 'round', ...extra, points: [J(...a), J(...b)] });
const suit = '#191d26', suitLit = '#3c4654';

// Himself in the wet road: a long dark shape below his feet, broken by the stones.
for (let k = 0; k < 7; k++) {
  const y0 = 2 + k * 9, w = 13 - k * 1.1;
  p.tryStroke({ brush: 'bristle', color: mix('#20262c', '#3a4248', k / 7), width: Math.max(4.6, w), opacity: 0.6 - k * 0.06, mix: 0.25, dry: 0.1, rag: 0.4, taper: [0.2, 0.2], points: [J(-7 + r.range(-1.5, 1.5), y0), J(r.range(-1, 1), y0 + 1), J(7 + r.range(-1.5, 1.5), y0)] });
}
p.tryStroke({ brush: 'bristle', color: '#b8a060', width: 5, opacity: 0.3, mix: 0.3, dry: 0.1, rag: 0.4, points: [J(-4, 78), J(4, 79)] });   // and his hair, faintly

// Legs, one a little forward.
mark([-3.4, -47], [-4.6, -3], 10, suit, { taper: [0, 0.3] });
mark([3.6, -47], [6, -4], 10, suit, { taper: [0, 0.3] });
mark([-7.4, -1.5], [-0.6, -1.2], 5.5, '#0e1014');
mark([2.4, -2.5], [9.4, -2.2], 5.5, '#0e1014');
// The jacket.
mark([0, -45], [0, -77], 21, suit);
mark([-8, -77.5], [8, -77.5], 9.5, suit);
p.tryStroke({ brush: 'bristle', color: suitLit, width: 5, opacity: 0.8, mix: 0.2, dry: 0, rag: 0.1, cap: 'round', points: [J(-9, -80.5), J(0, -81.5), J(9, -80.5)] });   // the sky on his shoulders
mark([0, -79], [0, -70.5], 5, '#c9cdc6');                               // his shirt
mark([0.2, -77], [0.2, -66], 4.4, '#30343c');                           // and tie
// The arm that hangs.
mark([10, -77], [12.4, -49], 7, suit, { taper: [0, 0.2] });
mark([12.4, -50], [12.8, -43.4], 5, '#c8b09c');
// The arm that is lifted: out from the shoulder, and back up to his brow.
mark([-10, -77], [-18, -70.5], 7, suit);
mark([-18, -70.5], [-9.4, -85], 6.5, suit);
mark([-10.4, -84.4], [-2.6, -91], 4.8, '#e0ccb6');                       // his hand, one finger on his forehead
// His head: a pale face, fair hair.
mark([0, -82], [0, -75], 5.5, '#c8b09c');                               // neck
mark([0, -96], [0, -82.8], 12, '#dcc8b2');                              // his face
p.stroke({ brush: 'bristle', color: '#d9c078', width: 7, mix: 0, dry: 0, rag: 0.05, cap: 'round', points: [J(-5.6, -92), J(-2.6, -96.6), J(2.6, -96.6), J(5.6, -92)] });   // his hair
p.tryStroke({ brush: 'bristle', color: '#f0e0a4', width: 4.6, opacity: 0.85, mix: 0.1, dry: 0, rag: 0, cap: 'round', points: [J(-3.6, -97.4), J(0.4, -98.2), J(4.2, -96.6)] });
p.tryStroke({ brush: 'bristle', color: '#c8ae6a', width: 4.6, opacity: 0.9, mix: 0.1, dry: 0, rag: 0, cap: 'round', points: [J(5.4, -93), J(6.2, -89.4), J(5.6, -85.6)] });   // falling at the side

p.save();
