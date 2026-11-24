// Friend. He stands on the dark stone in front of his own coffin, and faces us: a man of
// middle height in a grey suit with a white shirt and a red tie. A white cloth is tied over
// his whole head, and on the front of it is his sign. His arms hang a little out from his
// sides, with the hands open toward us. The sun is at our right: the side of him at our
// right is warm and light, and the other side is in a cool shade, with a little light from
// the pale floor. So each part of him goes from light to dark across its width.
'use strict';
const { studio, open, LIGHT, FRIEND } = require('./scene');
const { mix, clamp, lerp, shape, solid } = studio;

const p = open('friend');
const r = p.rng;
const S = FRIEND.s, F = (u, v) => [FRIEND.x + u * S, FRIEND.feet - v * S];   // a place on him: metres to our right of his middle, metres over the ground
const poly = (list) => list.map(([u, v]) => F(u, v));
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.03, cap: 'round', streak: 0.15, jitter: 0.25 };
const mark = (a, b, color, w, o = {}) => p.stroke({ brush: 'round', color, width: w, ...o, points: [F(...a), ...(o.via ? o.via.map((q) => F(...q)) : []), F(...b)] });
// A part of him that is round from side to side: lighter toward our right, darker toward our left. `mid` is its middle and `half` its half width, in metres.
const turned = (mid, half, light = '#d9d0cc', dark = '#221d38', kl = 0.42, kd = 0.4) => (c, x) => { const k = clamp(((x - FRIEND.x) / S - mid) / half, -1, 1); return k > 0 ? mix(c, light, kl * k) : mix(c, dark, -kd * k); };

const SUIT = { shadow: '#332e4c', half: '#6f6989', lit: '#aca5ba', rim: '#fff0da', bounce: '#5c5d8c' };
const SUIT_DIM = { shadow: '#2c2743', half: '#454061', lit: '#6a6486', bounce: '#4c4d7a' };               // the leg and the arm that are more in the shade
const MASK = { shadow: '#a39ec8', half: '#d8d2de', lit: '#fffaf0', rim: '#ffffff', bounce: '#c4c0e0' };
const SKIN = ['#8c6e72', '#a9867c', '#c9a084', '#e0b896', '#f0cfac'];                                     // from the shade to the sun

// ---- where he stands: the dark under his shoes

for (const u of [-0.1, 0.1]) p.stroke({ brush: 'soft', color: '#08060c', width: 13, opacity: 0.5, points: [F(u - 0.11, 0.0), F(u, -0.012), F(u + 0.07, 0.0)] });

// ---- the trousers: two legs, a little apart below the knee, so that what is behind him shows between them

const leg = (s, tones) => shape(p, poly([[s * 0.004, 0.86], [s * 0.18, 0.86], [s * 0.174, 0.66], [s * 0.163, 0.5], [s * 0.156, 0.3], [s * 0.152, 0.075], [s * 0.05, 0.075], [s * 0.046, 0.3], [s * 0.03, 0.5], [s * 0.012, 0.66]]), tones,
  { light: LIGHT, round: 11, turn: -0.2, flow: () => Math.PI / 2 + s * 0.03, width: 4.8, length: 30, mix: 0.18, rag: 0.03, vary: 0.06, tint: turned(s * 0.1, 0.07, s > 0 ? '#cfc7c8' : '#8882a0', '#1f1a33', s > 0 ? 0.4 : 0.22, 0.38), edge: s > 0, edgeOpacity: 0.7, dash: 36, gap: 14 });
leg(-1, SUIT_DIM);
leg(1, SUIT);
mark([0, 0.84], [0.005, 0.6], '#221d36', 4.6, { opacity: 0.85 });                                        // where the two legs are together, high up
for (const s of [-1, 1]) {
  mark([s * 0.045, 0.47], [s * 0.148, 0.5], s > 0 ? '#474163' : '#262038', 4.2, { opacity: 0.38, taper: [0.3, 0.3] });      // the fold at the knee
  mark([s * 0.052, 0.14], [s * 0.148, 0.125], s > 0 ? '#443e60' : '#241e36', 4.4, { opacity: 0.45, taper: [0.2, 0.2] });    // the cloth breaks over the shoe
  mark([s * 0.052, 0.086], [s * 0.15, 0.086], s > 0 ? '#3a3454' : '#201a32', 4.8, { opacity: 0.9 });                        // the lower edge of the trouser leg
}
mark([0.104, 0.8], [0.1, 0.16], '#d3ccd6', 4, { opacity: 0.42, taper: [0.2, 0.3] });                     // the crease of the leg that is in the sun
mark([-0.094, 0.8], [-0.098, 0.16], '#77718f', 4, { opacity: 0.26, taper: [0.2, 0.3] });

// ---- the shoes: black, a little apart, the toes turned out

for (const s of [-1, 1]) {
  shape(p, poly([[s * 0.05, 0.085], [s * 0.15, 0.085], [s * 0.166, 0.045], [s * 0.158, 0.008], [s * 0.106, -0.004], [s * 0.056, 0.008], [s * 0.046, 0.045]]), { shadow: '#0c0a10', half: '#1a1822', lit: '#3c3642' },
    { light: LIGHT, round: 7, turn: -0.3, flow: () => 0, width: 5, length: 16, mix: 0.05, rag: 0, edge: false });
  mark([s * 0.056, 0.066], [s * 0.146, 0.066], '#07060a', 4.4, { opacity: 0.8 });                        // the shade of the trouser leg on it
}
mark([0.082, 0.028], [0.158, 0.036], '#9a94a0', 4, { opacity: 0.8, taper: [0.3, 0.3] });                 // the shine on the toe that is in the sun
mark([-0.128, 0.026], [-0.052, 0.03], '#4a4654', 4, { opacity: 0.5, taper: [0.3, 0.3] });

// ---- the coat

const COAT = poly([[-0.06, 1.515], [-0.14, 1.5], [-0.226, 1.462], [-0.23, 1.4], [-0.205, 1.25], [-0.186, 1.08], [-0.189, 0.92], [-0.2, 0.79], [-0.03, 0.776], [0, 0.82], [0.03, 0.776], [0.2, 0.79], [0.189, 0.92], [0.186, 1.08], [0.205, 1.25], [0.23, 1.4], [0.226, 1.462], [0.14, 1.5], [0.06, 1.515], [0.046, 1.47], [0, 1.15], [-0.046, 1.47]]);
shape(p, COAT, SUIT, { light: LIGHT, round: 26, turn: -0.18, flow: (x) => Math.PI / 2 + (x - FRIEND.x) / 440, width: 5, length: 28, mix: 0.18, rag: 0.03, vary: 0.06, tint: turned(0, 0.2), edgeOpacity: 0.8, dash: 34, gap: 12 });
p.stroke({ brush: 'soft', color: '#1c1730', width: 8.4, opacity: 0.24, points: [F(-0.15, 0.764), F(0, 0.756), F(0.15, 0.764)] });   // the shade of its lower edge on the trousers
mark([0.004, 1.14], [0.014, 0.83], '#2c2644', 4.2, { opacity: 0.62 });                                   // its front edge, from the button down
mark([-0.038, 1.124], [0.04, 1.118], '#241f3a', 4.4, { opacity: 0.7, taper: [0.3, 0.3] });               // the button, in the shade of the cloth

// ---- the shirt and the tie, in the opening of the coat

mark([-0.03, 1.5], [-0.004, 1.2], '#c3bfdc', 6, { brush: 'bristle', mix: 0.04, rag: 0, cap: 'round' });  // the side of the shirt at our left is in the shade of the head
mark([0.03, 1.5], [0.005, 1.2], '#fffaf0', 6, { brush: 'bristle', mix: 0.04, rag: 0, cap: 'round' });    // the side at our right takes the sun
// the tie: red, narrow at the knot and wider below, with the sun down its right half
p.stroke({ ...line, rag: 0, color: '#8e1420', width: 9.5, points: [[...F(0, 1.498), 0.62], [...F(0, 1.4), 0.8], [...F(0, 1.165), 1]] });
p.stroke({ brush: 'round', color: '#e23a40', width: 4.4, opacity: 0.95, points: [F(0.008, 1.49), F(0.012, 1.35), F(0.014, 1.185)] });
// the collar: two points of white at the sides of the knot
mark([-0.066, 1.526], [-0.014, 1.464], '#cdc9e2', 5, {});
mark([0.066, 1.526], [0.014, 1.464], '#fffdf6', 5, {});

// ---- the lapels: the one at our right is turned to the sun, the other is turned from it

p.stroke({ ...line, rag: 0, color: '#4d4768', width: 7.5, points: [[...F(-0.072, 1.5), 1], [...F(-0.064, 1.4), 1], [...F(-0.036, 1.26), 0.75], [...F(-0.008, 1.16), 0.55]] });
p.stroke({ ...line, rag: 0, color: '#d2cbd2', width: 7.5, points: [[...F(0.072, 1.5), 1], [...F(0.064, 1.4), 1], [...F(0.036, 1.26), 0.75], [...F(0.008, 1.16), 0.55]] });
mark([-0.116, 1.396], [-0.04, 1.42], '#2a2540', 4, { opacity: 0.5 });                                    // the notch of each lapel
mark([0.116, 1.396], [0.04, 1.42], '#5c5676', 4, { opacity: 0.5 });
mark([0.094, 1.46], [0.05, 1.2], '#fff4e2', 4, { opacity: 0.5, taper: [0.2, 0.5] });                     // the sun on the outer edge of the lapel at our right
mark([-0.05, 1.47], [-0.012, 1.18], '#241f3a', 4, { opacity: 0.4, taper: [0.2, 0.4] });                  // the shade under the edge of the other

// ---- the arms: sleeves, a line of white cuff, and the open hands

for (const s of [-1, 1]) {
  const out = 0.97, tones = s > 0 ? SUIT : { ...SUIT_DIM, lit: '#7a7496' };
  solid(p, [[...F(s * 0.21, 1.425), 0.058 * S], [...F(s * 0.246 * out, 1.14), 0.049 * S], [...F(s * 0.272 * out, 0.905), 0.039 * S]], tones, { light: LIGHT, turn: -0.2, width: 4.8, length: 24, mix: 0.18, rag: 0.03, vary: 0.06, edgeOpacity: 0.85, dash: 30, gap: 12 });
  // the folds at the elbow
  mark([s * 0.196, 1.176], [s * 0.284, 1.128], s > 0 ? '#4a4466' : '#221d36', 4.2, { opacity: 0.4, taper: [0.2, 0.5] });
  mark([s * 0.202, 1.11], [s * 0.288, 1.086], s > 0 ? '#4a4466' : '#221d36', 4.2, { opacity: 0.28, taper: [0.2, 0.5] });
  // the cuff of the shirt
  const hx = s * 0.274 * out;                                            // the middle of the hand
  mark([hx - 0.04, 0.884], [hx + 0.04, 0.875], s > 0 ? '#fffaf0' : '#c4c0da', 4.6, {});
  // the hand, open toward us: the palm, four fingers that go down from it and come a little together, and the thumb at its outer side
  const tone = (i) => SKIN[clamp(Math.round(s > 0 ? 2.2 + i * 0.75 : 0.2 + i * 0.5), 0, 4)];             // each finger its own tone: lighter toward the sun
  for (let i = 0; i < 3; i++) { const u = hx + (i - 1) * 0.022; p.stroke({ ...line, rag: 0, mix: 0.1, color: tone(i), width: 5, points: [F(u, 0.868), F(u + s * 0.003, 0.786)] }); }
  for (let i = 0; i < 4; i++) { const u = hx + (i - 1.5) * 0.021; p.stroke({ brush: 'round', color: tone(i * 0.8), width: 4, taper: [0, 0.3], points: [F(u, 0.804), F(u + (i - 1.5) * 0.003 + s * 0.004, 0.718 + Math.abs(i - 1.4) * 0.006)] }); }
  p.stroke({ brush: 'round', color: tone(s > 0 ? 3 : 0), width: 4.8, taper: [0, 0.3], points: [F(hx + s * 0.03, 0.856), F(hx + s * 0.056, 0.778)] });
  mark([hx - 0.043, 0.806], [hx + 0.043, 0.792], s > 0 ? '#b88c80' : '#7c6068', 4, { opacity: 0.3 });   // the line across the palm
}
mark([0.16, 1.3], [0.162, 0.86], '#262038', 5, { opacity: 0.3, taper: [0.3, 0.3] });                   // the shade of the arm at our right on the side of the coat

// ---- the head: a white cloth over all of it, drawn in at the neck

const HEAD = poly([[0, 1.792], [0.05, 1.778], [0.084, 1.732], [0.095, 1.668], [0.089, 1.606], [0.072, 1.558], [0.06, 1.526], [-0.06, 1.526], [-0.072, 1.558], [-0.089, 1.606], [-0.095, 1.668], [-0.084, 1.732], [-0.05, 1.778]]);
shape(p, HEAD, MASK, { light: LIGHT, round: 16, turn: -0.25, flow: (x) => Math.PI / 2 + (x - FRIEND.x) / 60, width: 4.8, length: 20, mix: 0.2, rag: 0, vary: 0.04, tint: turned(0, 0.095, '#fffdf4', '#8f8abc', 0.5, 0.42), edgeOpacity: 0.9, dash: 26, gap: 8 });
p.stroke({ brush: 'soft', color: '#2a2440', width: 9, opacity: 0.36, points: [F(-0.12, 1.49), F(-0.045, 1.506), F(0.025, 1.512)] });   // the shade of the head on the collar and the shoulder at our left
// the folds of the cloth: thin, pale, across the brow and at the neck
mark([-0.07, 1.735], [0.06, 1.728], '#b4aecc', 4, { opacity: 0.28, via: [[-0.01, 1.742]], taper: [0.3, 0.3] });
mark([-0.07, 1.552], [0.05, 1.545], '#9c96bc', 4, { opacity: 0.42, via: [[-0.01, 1.54]], taper: [0.2, 0.3] });
mark([-0.066, 1.71], [-0.08, 1.6], '#8c86b0', 4, { opacity: 0.3, taper: [0.3, 0.3] });
// his sign on the front of it: the outline of an eye, and the finger that points up through it
const INK = '#1a1622';
p.stroke({ brush: 'round', color: INK, width: 4, points: [F(-0.07, 1.644), F(-0.038, 1.672), F(0, 1.681), F(0.038, 1.672), F(0.07, 1.644)] });
p.stroke({ brush: 'round', color: INK, width: 4, points: [F(-0.07, 1.644), F(-0.038, 1.615), F(0, 1.606), F(0.038, 1.615), F(0.07, 1.644)] });
p.stroke({ brush: 'round', color: INK, width: 4, points: [F(0.008, 1.654), F(0.01, 1.752)] });

p.save();
