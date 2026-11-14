// Sora and Shiro. They stand at the edge of the cliff with their backs to us, hand in
// hand. Sora is the taller: dark red-brown hair that will not lie flat, a yellow shirt,
// dark trousers. His right hand is up over his eyes, against the sun, and he looks out
// at the pieces at the edge of the world. Shiro is a child of eleven: her hair is pale,
// nearly white, with a little blue and rose in it, and it comes down almost to her
// ankles; the wind carries it to the right. The sun is high at the left, so each of them
// is light on the left and violet on the right, and their shades lie on the grass.
'use strict';
const { studio, open } = require('./scene');
const { mix, solid, shape, glint } = studio;

const p = open('pair');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const U = 116, X0 = 1150, Y0 = 868;                                         // units of the picture to the metre; where Sora's feet are
const P = (X, Y) => [X0 + X * U, Y0 - Y * U];
const LIGHT = [-0.62, -0.78];
const o = { light: LIGHT, turn: 0, width: 5.5, length: 18, vary: 0.05, mix: 0.05, edge: false };
const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
const skin = { shadow: '#9a6a78', half: '#e0aa94', lit: '#ffdcc0', bounce: '#b89aa8' };

// ---------------------------------------------------------------- their shades on the grass, to the right
for (const [X, w, l] of [[0, 0.3, 1.5], [-0.62, 0.3, 1.1]]) p.stroke({ brush: 'soft', color: '#274a7c', width: w * U, opacity: 0.4, taper: [0, 0.6], points: [P(X, 0.0), P(X + l * 0.5, -0.08), P(X + l, -0.12)] });

// ---------------------------------------------------------------- Sora
{
  const jeans = { shadow: '#141a3c', half: '#28346c', lit: '#4c64a8', bounce: '#3c6a5c' }, shirt = { shadow: '#a0703c', half: '#eac23e', lit: '#fff29a', bounce: '#c8b470' }, hair = { shadow: '#2e1216', half: '#5e2a26', lit: '#a45038', bounce: '#5c3c50' };
  for (const s of [-1, 1]) { mark([[s * 0.11 - 0.1, 0.04], [s * 0.11 + 0.1, 0.04]], '#1c1c30', 13); solid(p, chain([[s * 0.095, 0.84, 0.1], [s * 0.105, 0.46, 0.085], [s * 0.11, 0.1, 0.072]]), jeans, { ...o, flow: () => Math.PI / 2 }); }
  // his left arm goes down and out to her hand
  solid(p, chain([[-0.225, 1.4, 0.06], [-0.28, 1.2, 0.052]]), skin, o); solid(p, chain([[-0.285, 1.16, 0.046], [-0.33, 1.0, 0.04]]), skin, o);
  solid(p, chain([[0, 0.98, 0.16], [0, 1.2, 0.175], [0, 1.4, 0.19]]), shirt, { ...o, width: 6, length: 22, flow: () => Math.PI / 2 });   // his shirt
  mark([[-0.165, 0.86], [0, 0.84], [0.165, 0.86]], '#8a5c34', 5, { opacity: 0.7 });
  for (const [pts, op] of [[[[0.02, 1.4], [0.01, 1.16], [0.03, 0.92]], 0.4], [[[0.1, 1.44], [0.2, 1.36], [0.3, 1.42]], 0.5]]) mark(pts, '#a0703c', 4.4, { opacity: op, taper: [0.2, 0.4] });
  for (const s of [-1, 1]) solid(p, chain([[s * 0.2, 1.44, 0.068], [s * 0.245, 1.34, 0.06]]), shirt, o);                               // the short sleeves
  // his right arm: up and out, and the hand comes back to his brow
  solid(p, chain([[0.25, 1.38, 0.056], [0.4, 1.47, 0.05]]), skin, o); solid(p, chain([[0.41, 1.5, 0.045], [0.25, 1.66, 0.04]]), skin, o); mark([[0.24, 1.67], [0.24 - 13 / U, 1.69]], '#e0aa94', 7);
  solid(p, chain([[0, 1.52, 0.058], [0, 1.49, 0.06]]), skin, o);                                                                       // his neck
  solid(p, chain([[-0.012, 1.63, 0.112], [0.012, 1.63, 0.112]]), hair, { ...o, flow: () => Math.PI / 2 });                               // his head
  solid(p, chain([[-0.07, 1.69, 0.07], [0.07, 1.7, 0.07]]), hair, { ...o, flow: () => 0 });                                                // it is thick on the top of his head, and not smooth
  for (const [X, Y, dx, dy] of [[-0.12, 1.71, -0.035, 0.03], [0.0, 1.765, 0.01, 0.035], [0.12, 1.72, 0.04, 0.02]]) mark([[X - dx * 1.6, Y - dy * 1.6], [X + dx, Y + dy]], mix('#5e2a26', '#8a3c30', r()), 7, { taper: [0, 0.6] });
  for (const s of [-1, 1]) mark([[s * 0.116, 1.59], [s * 0.12, 1.59 + 13 / U]], s < 0 ? '#ffdcc0' : '#b07c80', 5);                      // his ears
  glint(p, [P(-0.2, 1.5), P(-0.21, 1.3), P(-0.19, 1.05)], () => '#fffbe0', { width: 4, dash: 18, gap: 10, opacity: 0.6, rng: r });
}

// ---------------------------------------------------------------- Shiro
{
  const S = (X, Y) => P(X - 0.64, Y), ch = (pts) => pts.map(([X, Y, R]) => [...S(X, Y), R * U]), mk = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => S(X, Y)) });
  const purple = { shadow: '#2a1a50', half: '#52388c', lit: '#8c6cc8', bounce: '#4c5c8c' }, black = { shadow: '#0c0a16', half: '#1c1830', lit: '#3c3460', bounce: '#2c4a44' };
  for (const s of [-1, 1]) { mk([[s * 0.075 - 0.065, 0.03], [s * 0.075 + 0.065, 0.03]], '#141024', 9); solid(p, ch([[s * 0.065, 0.5, 0.06], [s * 0.07, 0.28, 0.05], [s * 0.075, 0.07, 0.042]]), black, { ...o, flow: () => Math.PI / 2 }); }   // her legs, in black stockings
  shape(p, [[-0.13, 0.78], [0.13, 0.78], [0.21, 0.5], [0, 0.47], [-0.21, 0.5]].map(([X, Y]) => S(X, Y)), purple, { light: LIGHT, turn: 0, width: 5.5, length: 18, round: 0.05 * U, mix: 0.05, flow: () => Math.PI / 2, edge: false });   // her skirt
  solid(p, ch([[0, 0.8, 0.11], [0, 0.98, 0.12]]), purple, { ...o, flow: () => 0 });                                                     // her top
  // her hair: from her head straight down her back, nearly to her ankles; the wind lifts its ends a little to the right. It is
  // nearly white; its shade is a pale violet, and its ends have a little blue and rose. First her head, then the long fall of it.
  const pale = { shadow: '#a89cd8', half: '#d6cef2', lit: '#ffffff', bounce: '#c4d8f0' };
  solid(p, ch([[-0.012, 1.1, 0.108], [0.012, 1.1, 0.108]]), pale, { ...o, flow: () => Math.PI / 2 });
  const hair = [[-0.11, 1.08], [0.11, 1.08], [0.135, 0.9], [0.15, 0.66], [0.19, 0.46], [0.3, 0.3], [0.4, 0.2], [0.26, 0.16], [0.1, 0.17], [-0.04, 0.2], [-0.12, 0.3], [-0.15, 0.56], [-0.145, 0.84]];
  shape(p, hair.map(([X, Y]) => S(X, Y)), pale, { light: LIGHT, turn: -0.1, width: 5, length: 20, round: 0.06 * U, vary: 0.06, mix: 0.06, flow: (x, y) => { const Y = (Y0 - y) / U; return Math.PI / 2 - Math.max(0, 0.5 - Y) * 1.3; }, edge: false });
  for (const [pts, c] of [[[[0.0, 1.06], [0.02, 0.76], [0.06, 0.46], [0.2, 0.24]], '#aea2dc'], [[[-0.07, 1.0], [-0.08, 0.7], [-0.06, 0.4], [0.02, 0.24]], '#aea2dc'], [[[0.07, 1.0], [0.1, 0.7], [0.16, 0.44], [0.32, 0.24]], '#ffffff'], [[[0.1, 0.24], [0.24, 0.19], [0.38, 0.2]], '#a4d2f4'], [[[-0.04, 0.24], [0.1, 0.19], [0.24, 0.17]], '#f4b0d6']]) mk(pts, c, 4.4, { opacity: 0.75, taper: [0.1, 0.6] });   // locks of it, and the colors in its ends
  // her arms come out from under her hair: the left one hangs; the right one goes up and out to his hand, and the two hands meet
  solid(p, ch([[0.15, 0.96, 0.046], [0.22, 0.98, 0.04]]), purple, o); mk([[0.19, 0.985], [0.345, 0.98]], '#e0aa94', 7);
  solid(p, ch([[-0.155, 0.95, 0.046], [-0.185, 0.78, 0.04]]), purple, o); mk([[-0.19, 0.74], [-0.195, 0.74 - 13 / U]], '#e0aa94', 6.4);
  glint(p, [S(-0.1, 1.16), S(-0.135, 0.98), S(-0.15, 0.78), S(-0.145, 0.56)], () => '#ffffff', { width: 4, dash: 20, gap: 8, opacity: 0.8, rng: r });
}

p.save();
