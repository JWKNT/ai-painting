// Tenma, close to us, his back to us: a tall man in a long wet coat, dark hair to his collar.
// Both arms are out in front of him and the pistol is in his hands, level, pointed down the
// street. The light is ahead of him, so we see him dark, with the wet shining along his
// shoulders and the tops of his arms.
'use strict';
const { studio, open, BREAK } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('tenma');
const r = p.rng;
const o = { light: { at: [BREAK.x, BREAK.y] }, turn: 0.7, width: 9, length: 58, vary: 0.07, dash: 34, gap: 16, edgeOpacity: 0.5 };
const coat = { shadow: '#181a17', half: '#2f3129', lit: '#565a50', rim: '#b0b6ae', bounce: '#22282c' };
const cloth = { shadow: '#101214', half: '#1e2226', lit: '#474e54', rim: '#b0b8b8', bounce: '#181c20' };
const hair = { shadow: '#08080c', half: '#15151c', lit: '#3a3e48', rim: '#aab2b6', bounce: '#101218' };
const skin = { shadow: '#4a3a34', half: '#8c7262', lit: '#c8ac98', rim: '#e8dcd0', bounce: '#5a4a44' };
const wetLight = () => mix('#aab2ae', '#e2e6e0', r());

// His legs, going down out of the picture.
solid(p, [[360, 880, 34], [356, 1020, 30]], cloth, { ...o, edge: false });
solid(p, [[430, 880, 34], [438, 1020, 30]], cloth, { ...o, edge: false });

// The arm we cannot see the shoulder of: only the forearm shows, beyond his body.
solid(p, [[498, 556, 22], [566, 532, 19], [620, 514, 16]], coat, { ...o, length: 40, width: 7 });

// The coat: the skirts of it, his back, his shoulders.
solid(p, [[394, 940, 102], [395, 820, 80], [396, 722, 64]], coat, { ...o, length: 70 });      // the skirts, wide at the hem
solid(p, [[396, 716, 64], [397, 650, 76], [398, 580, 86]], coat, o);                            // his back, broad at the shoulders
solid(p, [[304, 562, 30], [398, 538, 37], [492, 552, 30]], coat, { ...o, length: 44 });
// its belt, the fold down the middle of his back, and the folds from his shoulders
p.stroke({ brush: 'bristle', color: '#14160f', width: 17, opacity: 0.85, mix: 0.15, dry: 0.05, rag: 0.15, points: [[334, 716], [396, 724], [458, 714]] });
glint(p, [[336, 706], [396, 714], [456, 704]], wetLight, { width: 4.6, dash: 30, gap: 30, opacity: 0.3, rng: r });
for (const [x0, y0, x1, y1, x2, y2, w, op] of [[396, 600, 394, 760, 392, 930, 9, 0.6], [336, 596, 346, 664, 342, 712, 8, 0.45], [458, 596, 448, 664, 452, 712, 8, 0.45], [350, 740, 326, 850, 306, 968, 9, 0.45], [442, 740, 464, 850, 482, 968, 9, 0.45]]) {
  p.stroke({ brush: 'bristle', color: '#11130f', width: w, opacity: op, mix: 0.2, dry: 0.08, rag: 0.25, taper: [0.3, 0.3], points: [[x0, y0], [x1, y1], [x2, y2]] });
}

// The arm on our side of the pistol: out from the shoulder, straight, to the hands.
solid(p, [[486, 554, 28], [552, 529, 22], [616, 508, 18]], coat, { ...o, length: 44, width: 7.5 });
p.stroke({ brush: 'bristle', color: '#14160f', width: 7, opacity: 0.5, mix: 0.2, dry: 0.05, rag: 0.2, taper: [0.3, 0.3], points: [[486, 574], [552, 550], [612, 528]] });   // the shadow under it

// His hands, shut round the grip, and the pistol.
p.stroke({ brush: 'bristle', color: '#0a0a0d', width: 13, mix: 0, dry: 0, rag: 0.05, cap: 'flat', points: [[640, 497], [668, 495], [698, 493]] });   // the slide and barrel
p.stroke({ brush: 'bristle', color: '#0a0a0d', width: 6, mix: 0, dry: 0, rag: 0, cap: 'flat', points: [[690, 483], [697, 487]].map(([x, y]) => [x, y]).concat([[704, 489]]) });   // the foresight
p.tryStroke({ color: '#8c9698', width: 4, opacity: 0.6, points: [[644, 491.5], [694, 488]] });        // the light along its top
solid(p, [[624, 508, 15], [644, 510, 13]], skin, { ...o, length: 18, width: 6 });

// His neck and the collar of the coat, turned up.
solid(p, [[398, 520, 26], [400, 502, 24]], skin, { ...o, length: 20, width: 6, edge: false });
solid(p, [[346, 536, 16], [372, 512, 15], [398, 524, 14], [426, 510, 15], [452, 534, 16]], coat, { ...o, length: 30, width: 6.5 });

// His head. He is looking down the street at Johan, so we see the back of it and, on the
// right, his ear and the line of his cheek and jaw.
solid(p, [[432, 468, 15], [438, 486, 13], [430, 502, 10]], skin, { ...o, length: 18, width: 6 });         // cheek and jaw
p.stroke({ brush: 'bristle', color: '#5a463e', width: 6, opacity: 0.6, mix: 0.2, dry: 0.05, rag: 0.2, taper: [0.3, 0.3], points: [[428, 490], [436, 500], [432, 508]] });   // unshaven
solid(p, [[398, 456, 43], [400, 478, 41]], hair, { ...o, length: 44, width: 8 });                          // his hair
solid(p, [[388, 500, 36], [384, 528, 27]], hair, { ...o, length: 36, width: 7, edge: false });             // falling to his collar
for (let k = 0; k < 16; k++) {                                         // wet strands of it
  const x = 356 + k * 5.6 + r.range(-2, 2), top = 440 + r.range(-10, 20), len = r.range(60, 110);
  p.tryStroke({ brush: 'bristle', color: k % 3 ? '#07070a' : '#2c3038', width: r.range(4.6, 6.5), opacity: 0.7, mix: 0.1, dry: 0.05, rag: 0.15, taper: [0.1, 0.6], points: [[x, top], [x - 3, top + len * 0.5], [x - 4 + r.range(-3, 3), top + len]] });
}
solid(p, [[424, 474, 8], [427, 486, 7]], skin, { ...o, length: 14, width: 5, edge: false });               // his ear

// The wet on him: light along the tops of his shoulders, his arm and his head.
glint(p, [[296, 540], [346, 518], [394, 506]], wetLight, { width: 5, dash: 30, gap: 14, opacity: 0.55, rng: r });
glint(p, [[446, 512], [480, 524], [520, 522], [600, 494]], wetLight, { width: 5, dash: 30, gap: 14, opacity: 0.6, rng: r });
glint(p, [[384, 418], [412, 416], [436, 432]], wetLight, { width: 5, dash: 24, gap: 12, opacity: 0.55, rng: r });

p.save();
