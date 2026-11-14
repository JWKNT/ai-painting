// The two of them. Shinpei stands near us, at the left, with his back to us: black hair,
// a white shirt with short sleeves, dark trousers. His arms hang; his right hand is a
// little open, toward her. Ushio stands at the edge of the water, in the path of the sun,
// with her back to us too: the white top and the dark collar and skirt of her school, and
// her fair hair, which comes down to her waist and streams to the left in the wind. The
// sun is in front of them, so each is dark, with a line of gold down the side that is
// toward it; her hair lets the light through. Their long shades come toward us over the
// wet sand.
'use strict';
const { studio, open, cam, HORIZON, SUN, SHINPEI, USHIO } = require('./scene');
const { mix, solid, shape, glint, glow } = studio;

const p = open('figures');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const LIGHT = [0.8, -0.45];
const o = { light: LIGHT, turn: 0.55, width: 5.5, length: 18, vary: 0.05, mix: 0.05, edge: false };
function who(c) {
  const U = cam.unit(c.Z), P = (X, Y) => cam.at(c.X + X, Y, c.Z);
  const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
  const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
  const rim = (pts, op = 0.85, w = 4) => glint(p, pts.map(([X, Y]) => P(X, Y)), () => mix('#ffc468', '#fff6cc', r()), { width: w, dash: 24, gap: 7, opacity: op, rng: r });
  // its shade on the wet sand: long, straight away from the place under the sun
  const shadow = (w0, w1, reach) => { const [fx, fy] = P(0, 0), dx = fx - SUN.x, dy = fy - HORIZON, l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l, len = (1000 - fy) / uy * reach;
    for (const [k, op] of [[1, 0.34], [0.7, 0.3], [0.4, 0.26]]) p.stroke({ brush: 'soft', color: '#251d3e', width: Math.min((w0 + (w1 - w0) * k) * U, len * k / 2.1), opacity: op, taper: [0, 0.5], points: [[fx, fy], [fx + ux * len * k * 0.5, fy + uy * len * k * 0.5], [fx + ux * len * k, fy + uy * len * k]] }); };
  return { U, P, chain, mark, rim, shadow };
}
const white = { shadow: '#514c6c', half: '#7d789a', lit: '#c4aca8', rim: '#ffe6a8', bounce: '#8c7494' };
const navy = { shadow: '#100f24', half: '#1f2146', lit: '#40447a', rim: '#ffcf8c', bounce: '#3c3058' };
const skin = { shadow: '#503a3c', half: '#7a5850', lit: '#b47e68', rim: '#ffc888', bounce: '#7c5868' };

// ---------------------------------------------------------------- Ushio
{
  const { U, P, chain, mark, rim, shadow } = who(USHIO);
  shadow(0.34, 0.8, 0.9);
  // the sun's light is round her
  for (const [w, op] of [[170, 0.05], [100, 0.06]]) glow(p, ...P(0.3, 0.9), w, '#ffe6a0', op, 6, 1.3);
  // her legs: she stands in the last thin water, and it shines about her ankles
  for (const s of [-1, 1]) solid(p, chain([[s * 0.075, 0.66, 0.068], [s * 0.08, 0.4, 0.056], [s * 0.085, 0.07, 0.044]]), skin, { ...o, flow: () => Math.PI / 2 });
  for (let k = 0; k < 5; k++) { const [x, y] = P(r.range(-0.3, 0.3), r.range(-0.04, 0.03)), l = r.range(16, 40); p.tryStroke({ brush: 'round', color: mix('#ffe2b0', '#ffffff', r()), width: 4, opacity: r.range(0.5, 0.9), taper: [0.5, 0.5], points: [[x - l / 2, y], [x + l / 2, y]] }); }
  // her skirt: dark, in folds; the wind takes it a little to the left
  shape(p, [[-0.13, 0.98], [0.13, 0.98], [0.2, 0.66], [0.06, 0.63], [-0.1, 0.64], [-0.27, 0.62], [-0.29, 0.68]].map(([X, Y]) => P(X, Y)), navy, { light: LIGHT, turn: 0.5, width: 5.5, length: 20, round: 0.06 * U, vary: 0.06, mix: 0.05, flow: (x) => Math.PI / 2 + (P(0, 0)[0] - x) / U * 0.9, edge: false });
  for (const X of [-0.14, -0.04, 0.07]) mark([[X * 0.6, 0.95], [X * 1.3 - 0.03, 0.66]], '#0c0b1c', 4, { opacity: 0.6 });
  // her top, and her left arm
  solid(p, chain([[0, 1.03, 0.135], [0, 1.22, 0.15], [0, 1.3, 0.15]]), white, { ...o, flow: () => 0 });
  solid(p, chain([[-0.17, 1.27, 0.052], [-0.2, 1.1, 0.046]]), white, o); solid(p, chain([[-0.205, 1.06, 0.04], [-0.22, 0.86, 0.036]]), skin, o); mark([[-0.222, 0.83], [-0.224, 0.83 - 13 / U]], '#7a5850', 7.4);
  // her right arm, toward the sun: only the sleeve and a little under it is there still
  solid(p, chain([[0.17, 1.27, 0.052], [0.2, 1.12, 0.046]]), white, o);
  // the collar of her school: a dark square on her shoulders
  shape(p, [[-0.16, 1.36], [0.16, 1.36], [0.15, 1.15], [-0.15, 1.15]].map(([X, Y]) => P(X, Y)), navy, { light: LIGHT, turn: 0.5, width: 5, length: 16, round: 0.04 * U, mix: 0.05, flow: () => 0, edge: false });
  // her hair. It comes from her head down her back, and the wind carries all its length out to the left. It is one shape, wide
  // at the head and drawn out to its ends; the light of the sun comes through it, so it is gold in its thin parts and at its edges.
  const hair = [[-0.115, 1.5], [-0.05, 1.57], [0.05, 1.57], [0.115, 1.5], [0.135, 1.32], [0.12, 1.1], [0.05, 0.94], [-0.12, 0.84], [-0.38, 0.84], [-0.6, 0.94], [-0.78, 1.1], [-0.62, 1.12], [-0.44, 1.1], [-0.3, 1.16], [-0.2, 1.28], [-0.15, 1.4]];
  const hx = (X, Y) => { const t = Math.min(1, Math.max(0, (1.45 - Y) / 0.5)), back = Math.max(0, -X - 0.1); return Math.PI / 2 + t * 0.5 + Math.min(1.2, back * 3.4); };   // the way the hair lies at a place: down at the head, out to the left low down
  shape(p, hair.map(([X, Y]) => P(X, Y)), { shadow: '#70501c', half: '#b48a34', lit: '#f0ca62', rim: '#fff2b8', bounce: '#c89850' }, { light: LIGHT, turn: 0.1, width: 5, length: 22, round: 0.06 * U, vary: 0.08, mix: 0.06, flow: (x, y) => { const X = (x - P(0, 0)[0]) / U, Y = (P(0, 0)[1] - y) / U; return hx(X, Y); }, dash: 26, gap: 8, edgeOpacity: 0.8 });
  for (const [pts, w] of [[[[-0.1, 1.2], [-0.3, 1.0], [-0.6, 1.02], [-0.78, 1.16]], 4.4], [[[-0.06, 1.1], [-0.3, 0.93], [-0.52, 0.94], [-0.66, 1.0]], 4.4], [[[0.02, 1.3], [-0.08, 1.06], [-0.3, 0.97]], 4], [[[-0.3, 0.9], [-0.5, 0.92], [-0.64, 0.9]], 4]]) mark(pts, mix('#f4d070', '#fff4c0', r()), w, { opacity: 0.8, taper: [0.1, 0.7] });   // strands of it, loose, lit through
  for (const [pts] of [[[[0.03, 1.5], [0.05, 1.3], [0.0, 1.1]]], [[[-0.05, 1.5], [-0.07, 1.3], [-0.14, 1.12]]]]) mark(pts, '#8c6424', 4, { opacity: 0.5, taper: [0.2, 0.4] });
  rim([[0.03, 1.57], [0.1, 1.53], [0.13, 1.4], [0.13, 1.28]], 0.95, 4.6); rim([[0.2, 1.3], [0.24, 1.16]], 0.9); rim([[0.14, 0.94], [0.19, 0.8], [0.2, 0.68]], 0.8); rim([[0.13, 0.6], [0.125, 0.4], [0.12, 0.2]], 0.8);
  void U;
}

// ---------------------------------------------------------------- Shinpei
{
  const { U, P, chain, mark, rim, shadow } = who(SHINPEI);
  const dark = { shadow: '#0e0c16', half: '#1a1726', lit: '#30283a', bounce: '#2a2240' }, hair = { shadow: '#08070c', half: '#131018', lit: '#261f2a', bounce: '#1c1828' };
  const shirt = { shadow: '#3a3656', half: '#5a567a', lit: '#8a809c', bounce: '#6c5c84' };                                             // his white shirt is in his own shade: a grey violet
  shadow(0.44, 1.0, 0.98);
  for (const s of [-1, 1]) { mark([[s * 0.115 - 0.1, 0.04], [s * 0.115 + 0.1, 0.04]], '#0c0a12', 14); solid(p, chain([[s * 0.1, 0.84, 0.105], [s * 0.11, 0.46, 0.088], [s * 0.115, 0.1, 0.074]]), dark, { ...o, flow: () => Math.PI / 2 }); }   // his shoes and his legs
  // his arms hang at his sides; the right one is a little out from his side, and its hand is open toward her
  solid(p, chain([[-0.235, 1.38, 0.074], [-0.255, 1.15, 0.064]]), shirt, o); solid(p, chain([[-0.257, 1.11, 0.052], [-0.262, 0.87, 0.045]]), skin, o); solid(p, chain([[-0.263, 0.8, 0.046], [-0.263, 0.76, 0.042]]), skin, o);
  solid(p, chain([[0.235, 1.38, 0.074], [0.272, 1.16, 0.064]]), shirt, o); solid(p, chain([[0.278, 1.12, 0.052], [0.318, 0.89, 0.045]]), skin, o); solid(p, chain([[0.33, 0.82, 0.046], [0.336, 0.78, 0.042]]), skin, o);
  // his shirt: loose, a little wider at the hem, with a fold down the middle of the back
  solid(p, chain([[0, 0.96, 0.185], [0, 1.2, 0.2], [0, 1.4, 0.215]]), shirt, { ...o, width: 6, length: 24, flow: () => Math.PI / 2 });
  mark([[-0.19, 0.84], [0, 0.82], [0.19, 0.84]], '#2c2844', 6, { opacity: 0.8 });
  for (const [pts, op] of [[[[0.01, 1.42], [0.0, 1.16], [0.02, 0.9]], 0.45], [[[-0.14, 1.28], [-0.06, 1.1], [-0.08, 0.92]], 0.3], [[[0.12, 1.36], [0.1, 1.14], [0.13, 0.96]], 0.3]]) mark(pts, '#2c2844', 4.4, { opacity: op, taper: [0.2, 0.4] });
  solid(p, chain([[0, 1.5, 0.062], [0, 1.47, 0.064]]), skin, o);                                                                       // his neck
  // his head: black hair, short
  solid(p, chain([[-0.012, 1.605, 0.115], [0.012, 1.605, 0.115]]), hair, { ...o, flow: () => Math.PI / 2 });
  for (const s of [-1, 1]) mark([[s * 0.12, 1.565], [s * 0.124, 1.565 + 13 / U]], s > 0 ? '#a8745c' : '#5c4244', 5);                    // his ears
  // the gold of the sun down his right side: thin, and only at the edge
  rim([[0.04, 1.725], [0.105, 1.69], [0.13, 1.61], [0.125, 1.53]], 0.9); rim([[0.2, 1.47], [0.29, 1.38], [0.33, 1.18], [0.365, 0.98], [0.385, 0.84]], 0.85); rim([[0.205, 0.82], [0.2, 0.5], [0.192, 0.16]], 0.5);
}

p.save();
