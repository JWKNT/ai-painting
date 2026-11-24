// Friend. He stands on the dark stone in front of his own coffin, and faces us: a man of
// middle height in a grey suit with a white shirt and a red tie. A white cloth is tied over
// his whole head, and on the front of it is his sign. His arms hang a little out from his
// sides, with the hands open toward us. The sun is at our right: it is on his left side, and
// the other side of him is in shade, with a little light from the pale floor.
'use strict';
const { studio, open, LIGHT, FRIEND } = require('./scene');
const { mix, clamp, lerp, shape, solid } = studio;

const p = open('friend');
const r = p.rng;
const S = FRIEND.s, F = (u, v) => [FRIEND.x + u * S, FRIEND.feet - v * S];   // a place on him: metres to our right of his middle, metres over the ground
const poly = (list) => list.map(([u, v]) => F(u, v));
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.03, cap: 'round', streak: 0.15, jitter: 0.25 };
const mark = (a, b, color, w, o = {}) => p.stroke({ brush: 'round', color, width: w, ...o, points: [F(...a), ...(o.via ? o.via.map((q) => F(...q)) : []), F(...b)] });

const SUIT = { shadow: '#38324f', half: '#686285', lit: '#a39dba', rim: '#ece2dc', bounce: '#5e5c86' };
const SUIT_DIM = { shadow: '#302a48', half: '#454061', lit: '#676184', bounce: '#4e4c76' };               // the leg that the other leg puts in shade
const MASK = { shadow: '#a5a0c6', half: '#d8d2dc', lit: '#fffaf0', rim: '#ffffff', bounce: '#c0bcdc' };
const SKIN = { shadow: '#a07a86', half: '#d2a690', lit: '#f6d6b6' };

// ---- where he stands: the dark under his shoes

for (const u of [-0.1, 0.1]) p.stroke({ brush: 'soft', color: '#08060c', width: 13, opacity: 0.5, points: [F(u - 0.11, 0.0), F(u, -0.012), F(u + 0.07, 0.0)] });

// ---- the trousers: two legs, with a narrow gap between them below the knee

const leg = (side, tones) => shape(p, poly([[side * 0.004, 0.84], [side * 0.174, 0.84], [side * 0.166, 0.66], [side * 0.153, 0.5], [side * 0.143, 0.3], [side * 0.137, 0.075], [side * 0.046, 0.075], [side * 0.04, 0.3], [side * 0.024, 0.5], [side * 0.01, 0.66]]), tones,
  { light: LIGHT, round: 11, turn: -0.25, flow: () => Math.PI / 2 + side * 0.03, width: 5.2, length: 34, mix: 0.16, rag: 0.03, edge: side > 0, edgeOpacity: 0.7, dash: 34, gap: 14 });
leg(-1, SUIT_DIM);
leg(1, SUIT);
// the dark between the legs high up, where they are together, and the fold of cloth at each knee and over each shoe
mark([0, 0.83], [0.006, 0.56], '#262139', 4.6, { opacity: 0.85 });
for (const s of [-1, 1]) {
  mark([s * 0.04, 0.475], [s * 0.14, 0.5], s > 0 ? '#4a4466' : '#2a2440', 4.2, { opacity: 0.35, taper: [0.3, 0.3] });
  mark([s * 0.05, 0.135], [s * 0.132, 0.12], s > 0 ? '#474163' : '#27213b', 4.4, { opacity: 0.45, taper: [0.2, 0.2] });
  mark([s * 0.05, 0.088], [s * 0.132, 0.088], s > 0 ? '#3c3656' : '#231d37', 4.8, { opacity: 0.9 });                 // the lower edge of the trouser leg
}
mark([0.1, 0.78], [0.094, 0.16], '#c9c3d4', 4, { opacity: 0.4, taper: [0.2, 0.3] });                   // the crease of the leg that is in the sun
mark([-0.08, 0.78], [-0.086, 0.16], '#7a7496', 4, { opacity: 0.28, taper: [0.2, 0.3] });

// ---- the shoes: black, a little apart, the toes turned out

for (const s of [-1, 1]) {
  shape(p, poly([[s * 0.04, 0.085], [s * 0.142, 0.085], [s * 0.158, 0.045], [s * 0.152, 0.008], [s * 0.095, -0.004], [s * 0.042, 0.008], [s * 0.034, 0.045]]), { shadow: '#0c0a10', half: '#1a1822', lit: '#3c3642' },
    { light: LIGHT, round: 7, turn: -0.3, flow: () => 0, width: 5, length: 16, mix: 0.05, rag: 0, edge: false });
  mark([s * 0.05, 0.066], [s * 0.134, 0.066], '#07060a', 4.4, { opacity: 0.8 });                          // the shade of the trouser leg on it
}
mark([0.078, 0.026], [0.152, 0.036], '#8c8690', 4, { opacity: 0.75, taper: [0.3, 0.3] });                  // the shine on the toe that is in the sun
mark([-0.118, 0.026], [-0.044, 0.03], '#4a4654', 4, { opacity: 0.5, taper: [0.3, 0.3] });

// ---- the coat

const COAT = poly([[-0.058, 1.515], [-0.13, 1.5], [-0.206, 1.462], [-0.198, 1.36], [-0.18, 1.25], [-0.167, 1.08], [-0.172, 0.92], [-0.186, 0.782], [-0.022, 0.772], [0, 0.806], [0.022, 0.772], [0.186, 0.782], [0.172, 0.92], [0.167, 1.08], [0.18, 1.25], [0.198, 1.36], [0.206, 1.462], [0.13, 1.5], [0.058, 1.515], [0.046, 1.47], [0, 1.14], [-0.046, 1.47]]);
shape(p, COAT, SUIT, { light: LIGHT, round: 27, turn: -0.22, flow: (x, y) => Math.PI / 2 + (x - FRIEND.x) / 420, width: 5.5, length: 30, mix: 0.16, rag: 0.04, edgeOpacity: 0.75, dash: 30, gap: 12 });
// the shade of its lower edge on the trousers
p.stroke({ brush: 'soft', color: '#1c1730', width: 8.4, opacity: 0.22, points: [F(-0.14, 0.76), F(0, 0.752), F(0.14, 0.76)] });
// its front edge, from the button down, and the pull of the cloth toward the button
mark([0.004, 1.13], [0.012, 0.79], '#37314f', 4.2, { opacity: 0.6 });
for (const [a, b] of [[[0.02, 1.1], [0.13, 1.16]], [[-0.02, 1.09], [-0.12, 1.03]]]) mark(a, b, a[0] > 0 ? '#57516f' : '#2c2640', 4.2, { opacity: 0.2, taper: [0.1, 0.6] });
mark([-0.036, 1.121], [0.038, 1.115], '#2a2440', 4.4, { opacity: 0.75, taper: [0.3, 0.3] });                                  // the button, in the shade of the cloth

// ---- the shirt and the tie, in the opening of the coat

// the side of the shirt at our left takes the sun; the side at our right is in the shade of the lapel
mark([-0.03, 1.5], [-0.004, 1.19], '#fffaf0', 6, { brush: 'bristle', mix: 0.04, rag: 0, cap: 'round' });
mark([0.03, 1.5], [0.005, 1.19], '#b6b2d2', 6, { brush: 'bristle', mix: 0.04, rag: 0, cap: 'round' });
// the tie: red, narrow at the knot and wider below, with the sun down its left half
p.stroke({ ...line, rag: 0, color: '#9a1622', width: 9.5, points: [[...F(0, 1.498), 0.62], [...F(0, 1.4), 0.8], [...F(0, 1.16), 1]] });
p.stroke({ brush: 'round', color: '#e0343c', width: 4.4, opacity: 0.95, points: [F(-0.008, 1.49), F(-0.012, 1.35), F(-0.014, 1.18)] });
// the collar: two points of white at the sides of the knot
mark([-0.062, 1.522], [-0.016, 1.468], '#fffdf6', 5, {});
mark([0.062, 1.522], [0.016, 1.468], '#cfcbe0', 5, {});

// ---- the lapels: the one at our left is turned to the sun, the other is turned from it

p.stroke({ ...line, rag: 0, color: '#cdc7d8', width: 7.5, points: [[...F(-0.07, 1.5), 1], [...F(-0.062, 1.4), 1], [...F(-0.034, 1.26), 0.75], [...F(-0.008, 1.15), 0.55]] });
p.stroke({ ...line, rag: 0, color: '#5e5878', width: 7.5, points: [[...F(0.07, 1.5), 1], [...F(0.062, 1.4), 1], [...F(0.034, 1.26), 0.75], [...F(0.008, 1.15), 0.55]] });
mark([-0.114, 1.396], [-0.04, 1.42], '#4a4464', 4, { opacity: 0.55 });                                     // the notch of each lapel
mark([0.114, 1.396], [0.04, 1.42], '#39334f', 4, { opacity: 0.55 });
mark([0.052, 1.47], [0.012, 1.17], '#e9e2e2', 4, { opacity: 0.5, taper: [0.2, 0.4] });                   // the light on the folded edge of the lapel at our right

// ---- the arms: sleeves, a line of white cuff, and the open hands

for (const s of [-1, 1]) {
  const tones = s > 0 ? SUIT : { ...SUIT_DIM, lit: '#7d7799' };
  solid(p, [[...F(s * 0.2, 1.425), 0.056 * S], [...F(s * 0.236, 1.14), 0.047 * S], [...F(s * 0.264, 0.905), 0.038 * S]], tones, { light: LIGHT, turn: -0.25, width: 5.2, length: 26, mix: 0.16, rag: 0.04, edgeOpacity: 0.8, dash: 28, gap: 12 });
  // the folds at the elbow
  mark([s * 0.196, 1.172], [s * 0.274, 1.126], s > 0 ? '#4c4668' : '#2a2440', 4.2, { opacity: 0.4, taper: [0.2, 0.5] });
  mark([s * 0.202, 1.108], [s * 0.28, 1.086], s > 0 ? '#4c4668' : '#2a2440', 4.2, { opacity: 0.28, taper: [0.2, 0.5] });
  // the cuff of the shirt
  mark([s * 0.228, 0.884], [s * 0.302, 0.874], s > 0 ? '#fffaf0' : '#c4c0da', 4.6, {});
  // the hand, open toward us: the palm, four fingers that go down from it, and the thumb at its outer side
  const skin = (k) => mix(mix(SKIN.shadow, SKIN.half, clamp(k * 2, 0, 1)), SKIN.lit, clamp(k * 2 - 1, 0, 1));
  const tone = (i) => skin(s > 0 ? 0.45 + 0.16 * i : 0.2 + 0.1 * i);                                     // each finger its own tone: lighter toward the sun
  for (let i = 0; i < 3; i++) { const u = s * 0.266 + (i - 1) * 0.022; p.stroke({ ...line, rag: 0, mix: 0.1, color: tone(i), width: 5, points: [F(u, 0.866), F(u + s * 0.004, 0.785)] }); }
  for (let i = 0; i < 4; i++) { const u = s * 0.267 + (i - 1.5) * 0.021, splay = (i - 1.5) * 0.009; p.stroke({ brush: 'round', color: tone(i * 0.8), width: 4, taper: [0, 0.3], points: [F(u, 0.797), F(u + splay + s * 0.005, 0.703 + Math.abs(i - 1.4) * 0.008)] }); }
  p.stroke({ brush: 'round', color: tone(s > 0 ? 3.4 : 0), width: 4.8, taper: [0, 0.3], points: [F(s * 0.296, 0.85), F(s * 0.322, 0.776)] });
  mark([s * 0.228, 0.804], [s * 0.306, 0.79], s > 0 ? '#c69a8c' : '#8a6878', 4, { opacity: 0.3 });        // the line across the palm
}
// the shade of the arm at our right on the side of the coat
mark([0.148, 1.3], [0.15, 0.86], '#2c2644', 5, { opacity: 0.32, taper: [0.3, 0.3] });

// ---- the head: a white cloth over all of it, drawn in at the neck

const HEAD = poly([[0, 1.79], [0.052, 1.776], [0.088, 1.728], [0.1, 1.662], [0.093, 1.6], [0.074, 1.553], [0.058, 1.522], [-0.058, 1.522], [-0.074, 1.553], [-0.093, 1.6], [-0.1, 1.662], [-0.088, 1.728], [-0.052, 1.776]]);
shape(p, HEAD, MASK, { light: LIGHT, round: 16, turn: -0.3, flow: (x, y) => Math.PI / 2 + (x - FRIEND.x) / 60, width: 5, length: 20, mix: 0.2, rag: 0, vary: 0.05, edgeOpacity: 0.9, dash: 26, gap: 8 });
// the shade of the head on the collar and the shoulder at our left
p.stroke({ brush: 'soft', color: '#2a2440', width: 9, opacity: 0.35, points: [F(-0.11, 1.492), F(-0.04, 1.508), F(0.03, 1.512)] });
// the folds of the cloth: thin, pale, across the brow and at the neck
mark([-0.07, 1.735], [0.06, 1.728], '#b4aecc', 4, { opacity: 0.3, via: [[-0.01, 1.742]], taper: [0.3, 0.3] });
mark([-0.07, 1.552], [0.05, 1.545], '#a8a2c4', 4, { opacity: 0.4, via: [[-0.01, 1.54]], taper: [0.2, 0.3] });
mark([-0.062, 1.71], [-0.078, 1.6], '#9c96bc', 4, { opacity: 0.3, taper: [0.3, 0.3] });
// his sign on the front of it: the outline of an eye, and the finger that points up through it
const INK = '#1a1622';
p.stroke({ brush: 'round', color: INK, width: 4, points: [F(-0.074, 1.642), F(-0.04, 1.672), F(0, 1.682), F(0.04, 1.672), F(0.074, 1.642)] });
p.stroke({ brush: 'round', color: INK, width: 4, points: [F(-0.074, 1.642), F(-0.04, 1.612), F(0, 1.603), F(0.04, 1.612), F(0.074, 1.642)] });
p.stroke({ brush: 'round', color: INK, width: 4, points: [F(0.01, 1.652), F(0.012, 1.752)] });

p.save();
