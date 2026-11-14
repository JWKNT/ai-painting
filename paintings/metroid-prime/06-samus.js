// Samus Aran. She stands on the ledge with her back to us and looks across the lake at the
// temple; her head is turned a little to the right, so that we see the green edge of her
// visor. She wears the Varia Suit: the red helmet; the two great round shoulders; a broad
// back with the pack of the suit between the shoulders; orange arms and legs with dark
// joints; and on her right arm the cannon, held low. The light of the grey sky is on the
// top of each part, and the pale snow gives a little light back from below. Snow has
// begun to lie on her shoulders.
'use strict';
const { studio, open, cam, SAMUS } = require('./scene');
const { mix, clamp, solid, shape, orb, glow } = studio;

const p = open('samus');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const U = cam.unit(SAMUS.Z), P = (X, Y) => cam.at(SAMUS.X + X, Y, SAMUS.Z);
const LIGHT = [-0.4, -0.92];
const o = { light: LIGHT, turn: 0.12, width: 5.5, length: 18, vary: 0.06, mix: 0.05, edge: false };
const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
// The colors of the suit under a grey sky: dull, and darker than the snow. Each has a little of the blue of the snow in its shade.
const orange = { shadow: '#46240f', half: '#93501d', lit: '#cf8842', bounce: '#6a6a76' };
const gold = { shadow: '#543713', half: '#a27029', lit: '#dbac5a', bounce: '#76767e' };
const red = { shadow: '#2c0d0b', half: '#6c1f17', lit: '#a7432f', bounce: '#5a525a' };
const joint = { shadow: '#0e0c0c', half: '#221c1c', lit: '#463e40', bounce: '#3a3e4a' };
const teal = { shadow: '#0b221e', half: '#1e5246', lit: '#438672', bounce: '#465e6a' };
const lit = (base, hi, lo) => (cx, cy, R) => (x, y) => { const k = clamp(((x - cx) * LIGHT[0] + (y - cy) * LIGHT[1]) / R + 0.1, -1, 1), low = clamp((y - cy) / R, 0, 1); const c = k > 0 ? mix(base, hi, Math.pow(k, 0.9)) : mix(base, lo, Math.pow(-k, 0.8)); return mix(c, '#7c8494', low * 0.3); };
const snowOn = (x, y, w, n) => { for (let k = 0; k < n; k++) { const dx = (k - (n - 1) / 2) * w / n + r.range(-3, 3), l = r.range(13, 20); p.tryStroke({ ...line, rag: 0.4, color: mix('#dfe6ea', '#fbfcfc', r()), width: r.range(5, 7), opacity: 0.92, points: [[x + dx - l / 2, y + Math.abs(dx) * 0.16 + r.range(-1, 1)], [x + dx + l / 2, y + Math.abs(dx) * 0.16 + r.range(-1, 2)]] }); } };

// ---------------------------------------------------------------- her shade on the snow: soft, under her and a little to the right
for (const [w, op, dx] of [[0.56, 0.36, 0.14], [0.36, 0.32, 0.04]]) p.stroke({ brush: 'soft', color: '#63799a', width: w * U * 0.5, opacity: op, points: [P(-0.42 + dx, -0.03), P(dx + 0.12, -0.08), P(0.72 + dx, -0.02)] });

// ---------------------------------------------------------------- her legs. Her weight is on her right leg; her left foot is a little forward.
solid(p, chain([[-0.2, 0.14, 0.12], [-0.21, 0.09, 0.115]]), red, { ...o, flow: () => 0 });                                               // the left boot
solid(p, chain([[-0.185, 0.54, 0.135], [-0.2, 0.23, 0.11]]), gold, { ...o, flow: () => Math.PI / 2 });                                   // the greave over the calf
solid(p, chain([[-0.19, 0.645, 0.1], [-0.17, 0.645, 0.1]]), joint, { ...o, flow: () => 0 });                                              // the back of the knee
solid(p, chain([[-0.15, 0.99, 0.145], [-0.175, 0.73, 0.12]]), orange, { ...o, flow: () => Math.PI / 2 });                                // the thigh
solid(p, chain([[0.19, 0.1, 0.125], [0.2, 0.05, 0.12]]), red, { ...o, flow: () => 0 });
solid(p, chain([[0.18, 0.52, 0.14], [0.19, 0.2, 0.115]]), gold, { ...o, flow: () => Math.PI / 2 });
solid(p, chain([[0.16, 0.625, 0.105], [0.18, 0.625, 0.105]]), joint, { ...o, flow: () => 0 });
solid(p, chain([[0.15, 0.98, 0.15], [0.17, 0.71, 0.125]]), orange, { ...o, flow: () => Math.PI / 2 });
for (const [X, Y] of [[-0.19, 0.4], [0.185, 0.38]]) mark([[X - 0.1, Y + 0.006], [X + 0.1, Y - 0.006]], '#5c3c12', 4.6, { opacity: 0.5 });   // a line round each greave
// she stands in the snow: it is over the soles of her boots
for (const X of [-0.2, 0.2]) { const [x, y] = P(X, 0.012 + (X < 0 ? 0.03 : 0)); snowOn(x, y - 1, 46, 3); }
solid(p, chain([[-0.15, 1.05, 0.155], [0.15, 1.065, 0.155]]), red, { ...o, flow: () => 0 });                                             // her hips
solid(p, chain([[-0.07, 1.2, 0.14], [0.07, 1.205, 0.14]]), joint, { ...o, flow: () => 0 });                                              // her waist: a dark joint

// ---------------------------------------------------------------- her arms: the left one hangs; the right one is the cannon
solid(p, chain([[-0.5, 1.42, 0.11], [-0.535, 1.2, 0.1]]), orange, o);
solid(p, chain([[-0.54, 1.15, 0.082], [-0.542, 1.12, 0.082]]), joint, o);
solid(p, chain([[-0.545, 1.07, 0.105], [-0.555, 0.9, 0.09]]), gold, o);
solid(p, chain([[-0.56, 0.82, 0.082], [-0.56, 0.78, 0.076]]), red, o);                                                                 // her left hand
solid(p, chain([[0.5, 1.43, 0.11], [0.53, 1.24, 0.1]]), orange, o);
solid(p, chain([[0.54, 1.15, 0.122], [0.575, 0.71, 0.138]]), teal, { ...o, width: 6, flow: () => Math.PI / 2 - 0.08 });                   // the cannon: a thick barrel, wider at its mouth
for (const [Y, c, op] of [[1.07, '#0b221e', 0.8], [0.9, '#0b221e', 0.8], [0.79, '#6cb49c', 0.6]]) mark([[0.545 + (1.15 - Y) * 0.08 - 0.118, Y + 0.01], [0.545 + (1.15 - Y) * 0.08 + 0.118, Y - 0.01]], c, 5, { opacity: op });   // the bands round it
mark([[0.455, 0.615], [0.58, 0.59], [0.7, 0.615]], '#0a1614', 10);                                                                    // its mouth
glow(p, ...P(0.535, 0.99), 13, '#6cffb0', 0.1, 6); mark([[0.535 - 6.3 / U, 0.99], [0.535 + 6.3 / U, 0.99]], '#9cf4c4', 4.4, { opacity: 0.9 });   // a small green light on it

// ---------------------------------------------------------------- her back: broad, and wider at the shoulders
solid(p, chain([[-0.1, 1.33, 0.21], [0.1, 1.34, 0.21]]), orange, { ...o, width: 6, length: 22, flow: () => 0 });
solid(p, chain([[-0.16, 1.52, 0.25], [0.16, 1.53, 0.25]]), gold, { ...o, width: 6, length: 24, flow: () => 0 });
// the pack of the suit, high between the shoulders: a raised plate with a round top and a line of green light.
// Its strokes lie level, like those of the back: strokes that go down it make it look like hair.
shape(p, [[-0.2, 1.44], [-0.21, 1.6], [-0.14, 1.72], [0, 1.755], [0.14, 1.72], [0.21, 1.6], [0.2, 1.44]].map(([X, Y]) => P(X, Y)), { shadow: '#4c2a10', half: '#9a5c20', lit: '#d49a4c', bounce: '#6c6468' }, { light: LIGHT, turn: 0, width: 5.5, length: 22, round: 0.07 * U, vary: 0.05, mix: 0.05, flow: () => 0, edge: false });
p.stroke({ brush: 'soft', color: '#3a1c0c', width: 12, opacity: 0.4, points: [P(-0.2, 1.42), P(0, 1.405), P(0.2, 1.42)] });                 // the shade under its lower edge. It has no openings and no dark line: two holes over a line are a face
mark([[-0.06, 1.62], [0.06, 1.62]], '#5ce8a0', 4.4, { opacity: 0.8 });
mark([[-0.22, 1.25], [0, 1.235], [0.22, 1.25]], '#4a2610', 4.6, { opacity: 0.6 });                                                     // the line where the lower plate of the back begins

// ---------------------------------------------------------------- her shoulders: two great balls
for (const [X, Y, Rm] of [[-0.455, 1.6, 0.242], [0.455, 1.62, 0.236]]) {
  const [sx, sy] = P(X, Y), R = Rm * U;
  orb(p, [[sx, sy, R]], lit('#a25c1e', '#e4aa58', '#44220e')(sx, sy, R), { width: 6, reach: R * 0.7 });
  for (const v of [-0.3, 0.3]) { const pts = []; for (let i = 0; i <= 8; i++) { const u = -0.9 + 1.8 * i / 8, hw = Math.sqrt(Math.max(0, 1 - v * v)); pts.push([sx + u * hw * R, sy + v * R + (1 - u * u) * R * 0.1]); } p.tryStroke({ brush: 'round', color: '#3e200c', width: 4, opacity: 0.3, points: pts }); }   // two grooves round it, faint
  snowOn(sx - R * 0.1, sy - R * 0.84, R * 1.2, 4);                                                                                    // snow lies on the top of it
}

// ---------------------------------------------------------------- her helmet: it sits low between the shoulders
{ const [hx, hy] = P(0.03, 1.82), R = 0.152 * U;
  orb(p, [[hx, hy, R]], lit('#7a2016', '#c25a40', '#2c0c08')(hx, hy, R), { width: 5.5, reach: R * 0.7 });
  mark([[0.045, 1.96], [0.062, 1.83], [0.055, 1.7]], '#3c100c', 5, { opacity: 0.6 });                                                 // the ridge down the back of it
  // the edge of the visor, at the right: a thin line of green light
  glow(p, ...P(0.176, 1.82), 14, '#58ffa8', 0.12, 6);
  mark([[0.172, 1.87], [0.184, 1.82], [0.172, 1.77]], '#8cf4bc', 4.6, { opacity: 0.9 });
  snowOn(hx - R * 0.2, hy - R * 0.86, R, 2); }
{ const [x, y] = P(0, 1.75); snowOn(x - 4, y, 30, 2); }                                                                              // and a little on the top of the pack

p.save();
