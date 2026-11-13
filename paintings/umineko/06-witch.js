// The witch. Golden butterflies pour out of the portrait and down onto the stairs, and there
// they make her: the wide skirt, the full sleeves, the piled hair, the long pipe held up in
// one hand, the other hand held out toward the man below. She is made of light, so she is
// painted in gold from deep amber to nearly white, and her edges are butterflies. She stands
// taller than a woman would.
'use strict';
const { studio, open, WITCH, butterfly, fleck } = require('./scene');
const { mix, solid } = studio;

const p = open('witch');
const r = p.rng;
const K = 1.2, FOOT = 722;                                             // she is laid out life size and painted larger, from her hem up
const at = ([x, y, rad]) => (rad == null ? [905 + (x - 905) * K, FOOT + (y - FOOT) * K] : [905 + (x - 905) * K, FOOT + (y - FOOT) * K, rad * K]);
const form = (chains, tones, o) => solid(p, typeof chains[0][0] === 'number' ? chains.map(at) : chains.map((c) => c.map(at)), tones, o);
const over = (x, y) => y > 330 && y < 708 && Math.abs(x - 904) < 58 + Math.max(0, y - 520) * 0.5 || Math.hypot(x - 900, y - 400) < 76;   // where she herself is

// Her light, first: wide and faint, then closer and brighter.
for (const [w, o] of [[420, 0.1], [300, 0.14], [200, 0.2], [130, 0.26]]) {
  p.stroke({ brush: 'soft', color: mix('#f09020', '#ffd060', w < 250 ? 1 : 0), width: w, opacity: o, points: [[WITCH.x - w * 1.05, WITCH.y + 40], [WITCH.x, WITCH.y - 16], [WITCH.x + w * 1.05, WITCH.y + 40]] });
}

// The stream of them, out of the portrait and down to her.
const stream = (t) => [800 + 96 * Math.pow(t, 0.8) + 22 * Math.sin(t * 5), 290 + 96 * t + 12 * Math.sin(t * 7 + 1)];
for (const [w, o] of [[56, 0.18], [34, 0.24]]) p.stroke({ brush: 'soft', color: '#ffc040', width: w, opacity: o, points: [0, 0.25, 0.5, 0.75, 1].map(stream) });
for (let k = 0; k < 44; k++) {
  const t = r(), [sx, sy] = stream(t), spread = 18 + 50 * Math.sin(t * Math.PI), x = sx + r.range(-1, 1) * spread, y = sy + r.range(-1, 1) * spread;
  if (Math.hypot(x - 800, y - 218) < 34) continue;                                                           // not over the painted face
  if (r() < 0.55) butterfly(p, x, y, r.range(13, 22), r.range(0, 6.283), { bright: 0.6 }); else if (r() < 0.5) fleck(p, x, y);
}

// The witch herself.
const gilt = { shadow: '#7a4a0e', half: '#c8881c', lit: '#ffd45a', rim: '#fff6cc', bounce: '#e8a030' };
const o = { light: [-0.55, -0.75], turn: -0.1, width: 6.5, length: 30, vary: 0.1, dash: 22, gap: 8, edgeOpacity: 0.9 };
form([[905, 566, 34], [905, 610, 58], [905, 652, 82]], gilt, { ...o, length: 46, width: 8 });               // the skirt
for (const [x0, x1, bow] of [[-52, -66, 6], [-22, -32, 3], [14, 22, -3], [44, 60, -6]]) {                   // its folds
  p.tryStroke({ brush: 'bristle', color: '#8a520e', width: 8, opacity: 0.5, mix: 0.25, dry: 0.05, rag: 0.2, taper: [0.4, 0.2], points: [at([905 + x0 * 0.4, 580]), at([905 + (x0 + x1) / 2 + bow, 640]), at([905 + x1, 708])] });
}
form([[905, 560, 30], [903, 528, 26], [901, 500, 31]], gilt, o);                                             // the bodice
form([[[870, 498, 19], [873, 511, 18]], [[934, 498, 19], [931, 511, 18]]], gilt, o);                         // the sleeves, full at the shoulder
form([[868, 514, 8], [840, 544, 6.6], [810, 570, 5.6]], gilt, { ...o, width: 5.5 });                         // the arm held out to him
form([[805, 574, 5.6], [793, 584, 4.8]], { ...gilt, half: '#e8b040' }, { ...o, length: 16, width: 5.5 });    // its open hand
form([[936, 514, 8], [958, 488, 6.6], [956, 458, 5.6]], gilt, { ...o, width: 5.5 });                         // the arm that holds the pipe
p.stroke({ brush: 'bristle', color: '#fff2b8', width: 5.5, mix: 0, dry: 0, rag: 0, cap: 'round', points: [at([957, 449]), at([986, 431]), at([1014, 414])] });   // the pipe
p.stroke({ brush: 'soft', color: '#fff0c0', width: 13, opacity: 0.4, points: [at([1004, 420]), at([1020, 396]), at([1012, 368])] });                              // and its smoke
form([[[899, 440, 24], [899, 444, 24]], [[913, 419, 12], [919, 416, 11]]], gilt, { ...o, length: 20 });       // her hair, piled up
form([[901, 478, 9], [900, 468, 9]], gilt, { ...o, edge: false, length: 16 });                              // her neck
form([[899, 448, 18], [899, 456, 17]], { shadow: '#b87818', half: '#f0b848', lit: '#fff0b0', rim: '#ffffff' }, { ...o, length: 18 });   // her face
form([[[884, 433, 10], [899, 428, 11.5], [914, 433, 10]], [[878, 448, 8], [874, 480, 7]], [[921, 447, 8], [925, 478, 7]]], gilt, { ...o, length: 18 });   // the hair over her brow, and the locks beside it
p.tryStroke({ brush: 'bristle', color: '#8a4c10', width: 5, opacity: 0.55, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.4, 0.4], points: [at([890, 462]), at([899, 465.5]), at([908, 461])] });   // her smile

// Where she ends, she is still butterflies: thick round her skirt, fewer further out.
for (let k = 0; k < 150; k++) {
  const a = r.range(0, 6.283), far = Math.pow(r(), 1.3), d = 80 + far * 230;
  const x = WITCH.x + Math.cos(a) * d * 1.1, y = 560 + Math.sin(a) * d * 0.95;
  if (over(x, y)) continue;
  if (far < 0.55 && r() < 0.5) butterfly(p, x, y, r.range(13, 24) * (1.1 - far * 0.5), r.range(0, 6.283), { bright: 0.7 * (1 - far) }); else if (r() < 0.5) fleck(p, x, y, 1 - far * 0.5);
}
for (let k = 0; k < 18; k++) {                                                                              // the hem itself, breaking up
  const x = WITCH.x + r.range(-110, 110), y = FOOT + r.range(-14, 20) - Math.abs(x - WITCH.x) * 0.2;
  butterfly(p, x, y, r.range(15, 26), r.range(0, 6.283), { bright: 0.8, glow: r() < 0.5 });
}

p.save();
