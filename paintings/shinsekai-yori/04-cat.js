// The cat. It stands on the ridge of the school roof, and the bright sky is behind it, so
// it is a black shape. It is not made as a cat should be: its legs are as long as stilts,
// its body is thin, and its neck is as long as its legs. Its head is small. It has put
// one foot down on the hip of the roof and has let its head down, and it looks at the
// child on the path. Rough hair stands up behind its jaw and along its back. Its tail is
// up, with a hook at the end. One eye shows, and it shines red. The light behind it puts
// a thin warm edge on the parts of it that are turned down and to the left; the sky puts
// a little blue on its back.
'use strict';
const { studio, open, GLOW } = require('./scene');
const { glow, solid } = studio;

const p = open('cat');
const r = p.rng;
// a line through points that each have a width: it goes round its corners
const spline = (P, per = 5) => { const out = []; for (let i = 0; i < P.length - 1; i++) { const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)]; for (let k = 0; k < per; k++) { const t = k / per, t2 = t * t, t3 = t2 * t; out.push([0, 1, 2].map((c) => 0.5 * (2 * p1[c] + (p2[c] - p0[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2 + (3 * p1[c] - p0[c] - 3 * p2[c] + p3[c]) * t3))); } } out.push(P[P.length - 1]); return out; };
const BLACK = { shadow: '#0a0814', half: '#100d1c', lit: '#2a1a2a', bounce: '#211f44', rim: '#f4905c' };
const DIM = { shadow: '#0e0c1c', half: '#131020', lit: '#221826', bounce: '#1e1c3c', rim: '#b06858' };       // for the legs of its far side
const part = (pts, tones = BLACK, o = {}) => solid(p, spline(pts), tones, { light: { at: [GLOW.x - 120, GLOW.y + 80] }, width: 5.5, length: 22, edgeWidth: 4.2, edgeOpacity: 0.75, dash: 30, gap: 6, bounce: 0.5, rim: 0.5, vary: 0.05, ...o });
// a lock of rough hair: wide at its root, a point at its end
const lock = (x, y, a, len, w = 7) => p.tryStroke({ brush: 'bristle', mix: 0, dry: 0, rag: 0.05, cap: 'round', color: '#0a0814', width: w, taper: [0, 0.9], points: [[x, y], [x + Math.cos(a) * len * 0.55, y + Math.sin(a) * len * 0.55], [x + Math.cos(a) * len, y + Math.sin(a) * len + 1]] });

// ---------------------------------------------------------------- its tail: up, and a hook at its end
part([[1212, 212, 12], [1262, 240, 9.5], [1318, 240, 8.2], [1368, 204, 7.4], [1398, 150, 6.8], [1394, 98, 6.2], [1370, 68, 5.6], [1344, 70, 5], [1332, 90, 4.6]]);

// ---------------------------------------------------------------- the two legs of its far side
part([[950, 240, 16], [922, 290, 10.5], [884, 342, 7.4], [856, 388, 7]], DIM);               // the front one goes down to the hip of the roof
part([[858, 392, 8], [838, 402, 7]], DIM, { edge: false });
part([[1198, 224, 24], [1184, 282, 13.5], [1232, 314, 8], [1220, 350, 7]], DIM);            // the back one
part([[1220, 354, 8], [1201, 357, 7]], DIM, { edge: false });

// ---------------------------------------------------------------- its body: a deep chest, and nothing at the waist. Its back end is higher than its shoulders, as a cat's is when it is about to go down.
part([[968, 236, 35], [1012, 238, 31], [1060, 234, 25], [1108, 224, 21], [1150, 214, 24], [1186, 210, 29]]);
part([[950, 224, 20], [974, 217, 19], [1002, 221, 17]], BLACK, { edge: false });             // the bones of its shoulder stand up over its back
part([[1170, 205, 20], [1206, 214, 14]], BLACK, { edge: false });                            // its hip bones

// ---------------------------------------------------------------- the two legs of its near side
part([[966, 244, 18], [962, 290, 11], [948, 330, 7.6], [940, 350, 7.2]]);
part([[940, 354, 8.4], [922, 357, 7]], BLACK, { edge: false });
part([[1182, 226, 28], [1148, 280, 15.5], [1198, 316, 8.6], [1185, 350, 7.6]]);
part([[1185, 354, 8.6], [1164, 357, 7]], BLACK, { edge: false });

// ---------------------------------------------------------------- its neck, and its head
part([[950, 224, 22], [900, 234, 16.5], [852, 254, 15], [812, 276, 15]]);
part([[784, 296, 28], [762, 313, 19], [748, 325, 13.5]]);                                    // the head is round, and its nose is short: it points down at the child
part([[784, 320, 13], [774, 340, 9], [769, 354, 6.5]], BLACK, { edge: false });             // the jaw hangs open
// its ears: each is wide at its root and comes to a point
for (const [x, y, tx, ty, w] of [[795, 276, 799, 234, 10], [775, 280, 762, 242, 9]]) for (const o of [-8, 0, 8]) p.stroke({ brush: 'bristle', mix: 0, dry: 0, rag: 0.04, cap: 'round', color: '#0a0814', width: w + (o ? 0 : 3), taper: [0, 0.85], points: [[x + o, y], [(x + o * 0.5 + tx) / 2, (y + ty) / 2], [tx, ty]] });
// its long teeth: two that come down from the top jaw, and one that comes up from the lower jaw
for (const [x0, y0, x1, y1] of [[748, 333, 754, 351], [757, 327, 763, 344], [768, 352, 758, 341]]) p.stroke({ brush: 'round', color: '#0a0814', width: 4, taper: [0, 0.8], points: [[x0, y0], [x1, y1]] });

// ---------------------------------------------------------------- the rough hair: a ruff behind its jaw, and a short mane down the back of its neck
for (const [x, y, a, len, w] of [[806, 296, -0.1, 20, 11], [808, 306, 0.25, 26, 12], [804, 316, 0.6, 22, 11], [798, 324, 0.95, 18, 10], [806, 288, -0.4, 16, 10]]) p.tryStroke({ brush: 'bristle', mix: 0, dry: 0, rag: 0.05, cap: 'round', color: '#0a0814', width: w, taper: [0, 0.9], points: [[x, y], [x + Math.cos(a) * len * 0.5, y + Math.sin(a) * len * 0.5 + 2], [x + Math.cos(a + 0.25) * len, y + Math.sin(a + 0.25) * len]] });
for (let k = 0; k < 12; k++) { const t = k / 11, x = 808 + t * 136, y = 266 - t * 48; lock(x, y, -0.62 + r.range(-0.2, 0.2), r.range(13, 17), 7); }

// ---------------------------------------------------------------- its eye
for (const [w, op] of [[30, 0.07], [18, 0.2]]) glow(p, 771, 300, w, '#ff3c78', op, 8);
p.stroke({ brush: 'round', color: '#ff3c74', width: 8.4, points: [[761, 305.6], [771, 300], [781.4, 295]] });      // the eye is long and thin, and it slants
p.tryStroke({ brush: 'round', color: '#ffd8e6', width: 4, points: [[764.4, 303.8], [778.4, 296.6]] });

p.save();
