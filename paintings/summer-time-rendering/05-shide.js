// Shide. He stands in the middle of his shadow and faces Ushio. He is all black: a suit of
// armour that is itself a shadow, with no light in it. He is as tall as two men and very
// thin: a small head with a crest that goes back and one pale slit for an eye, wide
// shoulders that end in points, a waist like a wasp's, long legs with the knees forward,
// and four arms. One arm is stretched out toward her, one is raised high, and two hang
// with their long fingers open. Rags of shadow hang from his waist. The sky gives the
// black a little blue on its upper sides; nothing else lights him.
'use strict';
const { studio, open, SHIDE } = require('./scene');
const { mix, solid, glint, glow } = studio;

const p = open('shide');
const r = p.rng;
const line = { brush: 'bristle', mix: 0, dry: 0, rag: 0.05, cap: 'round' };
const U = SHIDE.U, P = (X, Y) => [SHIDE.x + X * U, SHIDE.feet - Y * U];
const o = { light: [-0.5, -0.86], turn: 0.55, width: 5, length: 16, vary: 0.04, mix: 0, edge: false };
const black = { shadow: '#030307', half: '#08080f', lit: '#232b46', bounce: '#0a0a16' };
const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const limb = (pts) => solid(p, chain(pts), black, o);
const stroke = (pts, w, extra = {}) => p.tryStroke({ ...line, color: mix('#030307', '#0a0a14', r()), width: w, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
const sky = (pts, op = 0.6) => glint(p, pts.map(([X, Y]) => P(X, Y)), () => mix('#6c84b8', '#b8d0f4', r()), { width: 4, dash: 22, gap: 12, opacity: op, rng: r });
// a hand with four long fingers, at the end of an arm that points the way `a`
function fingers(X, Y, a, len = 0.3) { for (const da of [-0.5, -0.16, 0.16, 0.5]) stroke([[X, Y], [X + Math.cos(a + da * 0.6) * len * 0.5, Y + Math.sin(a + da * 0.6) * len * 0.5], [X + Math.cos(a + da) * len, Y + Math.sin(a + da) * len]], 5, { taper: [0, 0.7] }); }

// ---------------------------------------------------------------- the rags that hang from his waist: behind his legs
for (const [x0, l, sway] of [[0.12, 0.95, 0.3], [0.02, 1.1, 0.16], [-0.06, 0.8, 0.06], [0.2, 0.7, 0.44]]) stroke([[x0, 1.5], [x0 + sway * 0.4, 1.5 - l * 0.5], [x0 + sway, 1.5 - l]], 14, { rag: 0.5, taper: [0, 0.8] });

// ---------------------------------------------------------------- his two arms of the far side: one raised high, one that hangs
limb([[0.36, 2.26, 0.06], [0.7, 2.6, 0.048], [0.52, 3.04, 0.04]]);
fingers(0.52, 3.06, 1.9, 0.3);
limb([[0.2, 1.94, 0.055], [0.56, 1.54, 0.045], [0.68, 1.1, 0.038]]);
fingers(0.68, 1.08, -1.4, 0.3);

// ---------------------------------------------------------------- his legs: the knee is forward, the heel is high, and he stands on long toes
limb([[0.1, 1.46, 0.085], [0.02, 0.86, 0.06], [0.24, 0.32, 0.045]]);
stroke([[0.24, 0.32], [0.14, 0.14], [0.02, 0.03]], 8, { taper: [0, 0.6] });
limb([[-0.08, 1.46, 0.09], [-0.3, 0.88, 0.064], [-0.12, 0.32, 0.048]]);
stroke([[-0.12, 0.32], [-0.24, 0.14], [-0.38, 0.03]], 8.5, { taper: [0, 0.6] });

// ---------------------------------------------------------------- his body: hips, a thin waist, a deep chest
limb([[-0.06, 1.5, 0.13], [0.1, 1.5, 0.12]]);
limb([[0.02, 1.62, 0.085], [0.02, 1.8, 0.075]]);
limb([[0.0, 1.98, 0.17], [0.03, 2.14, 0.2]]);
for (const Y of [1.92, 2.02, 2.12]) stroke([[-0.16, Y + 0.02], [0, Y - 0.02], [0.16, Y + 0.02]], 4.4, { brush: 'round', color: '#232b46', opacity: 0.5 });   // the plates of his chest
// his shoulders: each ends in a point that goes up and out
for (const s of [-1, 1]) { limb([[s * 0.2 + 0.03, 2.2, 0.1], [s * 0.36 + 0.03, 2.25, 0.08]]); stroke([[s * 0.34 + 0.03, 2.26], [s * 0.5 + 0.03, 2.4], [s * 0.6 + 0.03, 2.62]], 12, { taper: [0, 0.85] }); }
// his neck and his head: small, long from front to back, with a crest that goes back and up, and one pale slit
limb([[0.01, 2.34, 0.05], [-0.02, 2.44, 0.045]]);
limb([[-0.1, 2.56, 0.1], [0.06, 2.6, 0.1]]);
stroke([[0.04, 2.64], [0.22, 2.78], [0.4, 2.96]], 10, { taper: [0, 0.85] });
stroke([[-0.16, 2.5], [-0.26, 2.44]], 9, { taper: [0, 0.6] });                                                                         // the point of his face
glow(p, ...P(-0.15, 2.58), 12, '#dfeaff', 0.14, 6);
p.tryStroke({ brush: 'round', color: '#f4f8ff', width: 4, taper: [0.3, 0.3], points: [P(-0.2, 2.57), P(-0.2 + 13 / U, 2.6)] });

// ---------------------------------------------------------------- his two arms of the near side: one stretched out toward her, one that hangs
limb([[-0.3, 2.22, 0.062], [-0.64, 1.88, 0.05], [-1.02, 1.98, 0.042]]);
fingers(-1.04, 1.98, 3.0, 0.32);
limb([[-0.14, 1.94, 0.056], [-0.46, 1.52, 0.046], [-0.56, 1.08, 0.04]]);
fingers(-0.56, 1.06, -1.75, 0.3);

// ---------------------------------------------------------------- the blue of the sky on his upper sides: thin and broken
sky([[-0.2, 2.66], [-0.06, 2.7], [0.1, 2.7]], 0.7); sky([[-0.4, 2.3], [-0.22, 2.31], [-0.06, 2.34]], 0.6); sky([[-0.36, 2.16], [-0.66, 1.92], [-1.0, 2.02]], 0.6); sky([[0.4, 2.3], [0.72, 2.62], [0.56, 3.02]], 0.5);
sky([[-0.17, 1.44], [-0.36, 0.9], [-0.18, 0.36]], 0.5); sky([[-0.2, 1.9], [-0.5, 1.52], [-0.6, 1.1]], 0.45); sky([[-0.18, 2.12], [-0.17, 1.98]], 0.5);
// small squares of black leave him too
for (let k = 0; k < 34; k++) { const X = r.range(-0.2, 1.1), Y = r.range(0.4, 3.1), s = r.range(12.4, 22), a = r.range(-0.3, 0.3), [x, y] = P(X + 0.5, Y); p.tryStroke({ ...line, cap: 'flat', rag: 0, color: '#05050c', width: Math.max(5, s * 0.5), opacity: r.range(0.4, 0.95), points: [[x - Math.cos(a) * s / 2, y - Math.sin(a) * s / 2], [x + Math.cos(a) * s / 2, y + Math.sin(a) * s / 2]] }); }

p.save();
