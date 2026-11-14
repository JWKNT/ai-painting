// Sora and Shiro. They fall, hand in hand, in the air over a break in the cloud: we look
// down past them at the land. Sora falls with his arms and his legs out: red-brown hair, a
// yellow shirt, dark trousers. Shiro is a child of eleven: her white hair is longer than
// she is, and the air takes it up over her. Then the light of the sun over the left of
// the picture, and the corners a tone deeper.
'use strict';
const { studio, open, W, H } = require('./scene');
const { mix, solid, shape, glow } = studio;

const p = open('fall');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const LIGHT = [-0.62, -0.78];
const o = { light: LIGHT, turn: 0, width: 5, length: 15, vary: 0.05, mix: 0.05, edge: false };
// A figure: its own middle, its size, and how it is turned in the air.
function body(X0, Y0, U, turn) {
  const c = Math.cos(turn), s = Math.sin(turn), P = (x, y) => [X0 + (x * c - y * s) * U, Y0 + (x * s + y * c) * U];
  return { P, ch: (pts) => pts.map(([x, y, q]) => [...P(x, y), q * U]), mk: (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([x, y]) => P(x, y)) }) };
}
const skin = { shadow: '#b47c80', half: '#ecbc9c', lit: '#ffe2c8', bounce: '#d8b0c0' };
// a little shade of them on the cloud below
p.stroke({ brush: 'soft', color: '#8c8cd0', width: 30, opacity: 0.16, points: [[560, 980], [640, 986], [730, 980]] });

// ---------------------------------------------------------------- Sora: he falls on his front, head toward us and to the left; we see his back
{ const { P, ch, mk } = body(640, 852, 96, -0.5);
  const jeans = { shadow: '#161c44', half: '#2c3a78', lit: '#5870b8', bounce: '#5c4c90' }, shirt = { shadow: '#b47c34', half: '#f0c838', lit: '#fff6a0', bounce: '#e8b890' }, hair = { shadow: '#34141a', half: '#662c28', lit: '#b05c3c', bounce: '#6c4460' };
  solid(p, ch([[0.12, 0.42, 0.085], [0.26, 0.82, 0.07], [0.3, 1.2, 0.056]]), jeans, o); solid(p, ch([[-0.1, 0.42, 0.085], [-0.3, 0.8, 0.07], [-0.5, 1.12, 0.056]]), jeans, o);   // his legs, apart
  mk([[0.3, 1.24], [0.33, 1.38]], '#1c1c30', 9); mk([[-0.53, 1.16], [-0.62, 1.28]], '#1c1c30', 9);
  solid(p, ch([[0, 0.34, 0.15], [0, 0.0, 0.17], [0, -0.2, 0.18]]), shirt, { ...o, width: 5.5, length: 18 });                         // his shirt
  mk([[-0.13, 0.2], [-0.3, 0.3], [-0.36, 0.44]], '#f0c838', 9, { taper: [0, 0.7] });                                               // the corner of it, which the air lifts
  solid(p, ch([[0.2, -0.22, 0.062], [0.5, -0.32, 0.05], [0.8, -0.2, 0.042]]), skin, o); solid(p, ch([[-0.2, -0.22, 0.062], [-0.5, -0.38, 0.05], [-0.78, -0.5, 0.042]]), skin, o);   // his arms, out
  for (const sgn of [-1, 1]) solid(p, ch([[sgn * 0.17, -0.24, 0.072], [sgn * 0.26, -0.26, 0.066]]), shirt, o);
  solid(p, ch([[-0.012, -0.43, 0.12], [0.012, -0.43, 0.12]]), hair, { ...o, flow: () => 0.4 });                                      // his head
  for (const [x, y, dx, dy] of [[-0.1, -0.5, -0.06, -0.07], [0.02, -0.55, 0.0, -0.08], [0.11, -0.5, 0.07, -0.06]]) mk([[x, y], [x + dx, y + dy]], '#662c28', 7, { taper: [0, 0.7] });
  void P; }

// ---------------------------------------------------------------- Shiro: she holds his left hand; her hair goes up over her like a flag
{ const { P, ch, mk } = body(770, 800, 80, 0.4);
  const purple = { shadow: '#2c1c58', half: '#583e98', lit: '#9c7cd8', bounce: '#6c5ca0' }, black = { shadow: '#0e0c1a', half: '#201c38', lit: '#48406c', bounce: '#3c3460' }, pale = { shadow: '#a89cdc', half: '#dcd4f6', lit: '#ffffff', bounce: '#c8d8f4' };
  // her hair first: it goes up and back from her head, wide, and its ends have a little blue and rose
  shape(p, [[-0.1, -0.42], [0.1, -0.42], [0.2, -0.8], [0.36, -1.3], [0.2, -1.74], [-0.06, -1.5], [-0.2, -1.84], [-0.4, -1.4], [-0.3, -0.84]].map(([x, y]) => P(x, y)), pale, { light: LIGHT, turn: -0.1, width: 5, length: 22, round: 0.07 * 80, vary: 0.06, mix: 0.06, flow: (x, y) => Math.atan2(P(0, -1.4)[1] - P(0, -0.4)[1], P(0, -1.4)[0] - P(0, -0.4)[0]), edge: false });
  for (const [pts, col] of [[[[0.0, -0.5], [0.1, -1.0], [0.22, -1.5]], '#b0a4dc'], [[[-0.06, -0.5], [-0.16, -1.0], [-0.2, -1.6]], '#b0a4dc'], [[[0.08, -0.6], [0.24, -1.1], [0.3, -1.4]], '#a4d2f4'], [[[-0.12, -0.7], [-0.3, -1.1], [-0.36, -1.4]], '#f4b0d6']]) mk(pts, col, 4.4, { opacity: 0.75, taper: [0.1, 0.6] });
  solid(p, ch([[0.08, 0.34, 0.06], [0.14, 0.62, 0.05], [0.14, 0.9, 0.042]]), black, o); solid(p, ch([[-0.08, 0.34, 0.06], [-0.2, 0.6, 0.05], [-0.34, 0.82, 0.042]]), black, o);   // her legs, in black stockings
  shape(p, [[-0.14, 0.06], [0.14, 0.06], [0.24, 0.4], [0, 0.44], [-0.24, 0.4]].map(([x, y]) => P(x, y)), purple, { light: LIGHT, turn: 0, width: 5, length: 16, round: 4, mix: 0.05, flow: () => 0.4 + Math.PI / 2, edge: false });   // her skirt
  solid(p, ch([[0, 0.08, 0.115], [0, -0.16, 0.125]]), purple, o);                                                                   // her top
  solid(p, ch([[-0.13, -0.2, 0.046], [-0.5, -0.02, 0.04], [-0.9, 0.2, 0.036]]), purple, o);                                          // her arm, out to his hand
  solid(p, ch([[0.13, -0.2, 0.046], [0.4, -0.36, 0.04]]), purple, o);
  solid(p, ch([[-0.012, -0.36, 0.115], [0.012, -0.36, 0.115]]), pale, { ...o, flow: () => 1.2 });                                    // her head
  void P; }
// their two hands, which hold
p.tryStroke({ ...line, color: '#ffe2c8', width: 8, points: [[708, 812], [722, 818]] });

// ---------------------------------------------------------------- the light of the sun, and the corners
for (const [w, op] of [[560, 0.06], [360, 0.07]]) glow(p, 40, 60, w, '#fff6e8', op, 5);
for (const [x0, y0, x1, y1, w, op] of [[W + 60, -40, 1140, -70, 190, 0.2], [W + 60, H + 50, 1080, H + 60, 150, 0.16], [-60, H + 50, 520, H + 60, 150, 0.14]]) p.stroke({ brush: 'soft', color: '#3a2a8c', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void mix; void r;

p.save();
