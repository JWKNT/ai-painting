// The three on the path. Punio goes in front: a Puni, a small round creature the color of
// a dove, with one feeler that ends in a ball. Mario comes after him: the red cap, brown
// hair under it at the back, a red shirt, blue overalls with their two straps, white
// gloves. Koops walks at his right: a Koopa, with a green shell that has a pale rim, a
// blue hood on his shoulders, and a yellow head. We see their backs. The bright sky is
// in front of them, so each is in its own shade, with a line of gold along its top and its
// left side; the white path gives light back to them from below, and their shades lie on
// it toward us.
'use strict';
const { studio, open, cam, SHADOW } = require('./scene');
const { mix, solid, shape, glint, disc } = studio;

const p = open('travellers');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const LIGHT = [-0.5, -0.86];
const o = { light: LIGHT, turn: 0.35, width: 5, length: 15, vary: 0.05, mix: 0.05, edge: false };
function who(X0, Z0) {
  const U = cam.unit(Z0), P = (X, Y) => cam.at(X0 + X, Y, Z0);
  const chain = (pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
  const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
  const rim = (pts, op = 0.8) => glint(p, pts.map(([X, Y]) => P(X, Y)), () => mix('#ffd070', '#fff4c8', r()), { width: 4, dash: 16, gap: 7, opacity: op, rng: r });
  // its shade on the path: from its feet toward us and to the right, darkest at the feet
  const shadow = (h, w) => {
    const a = P(0, 0), b = cam.at(X0 + SHADOW[0] * h * 0.9, 0, Z0 + SHADOW[1] * h * 0.9), c = cam.at(X0 + SHADOW[0] * h * 1.9, 0, Z0 + SHADOW[1] * h * 1.9), len = Math.hypot(c[0] - a[0], c[1] - a[1]), half = Math.hypot(b[0] - a[0], b[1] - a[1]);
    p.stroke({ brush: 'soft', color: '#7480ac', width: Math.min(w * U, len / 2.1), opacity: 0.5, taper: [0, 0.5], points: [a, b, c] });
    p.stroke({ brush: 'soft', color: '#58648f', width: Math.min(w * U * 0.7, half / 2.1), opacity: 0.45, taper: [0, 0.8], points: [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b] });
  };
  return { U, P, chain, mark, rim, shadow };
}

// ---------------------------------------------------------------- Punio
{
  const { U, P, chain, mark, rim, shadow } = who(1.4, 9.4);
  shadow(0.5, 0.36);
  for (const sx of [-1, 1]) mark([[sx * 0.1 - 0.075, 0.025], [sx * 0.1 + 0.075, 0.025]], '#4a4668', 6);                             // its two small feet
  solid(p, chain([[-0.02, 0.215, 0.2], [0.02, 0.215, 0.2]]), { shadow: '#5a5878', half: '#8a86a8', lit: '#c4c0d8', bounce: '#b0aec8' }, { ...o, width: 5, length: 14, flow: () => 0 });   // its round body
  mark([[0, 0.4], [0.012, 0.5], [0.02, 0.58]], '#5a5878', 4.4);                                                                        // its feeler
  disc(p, ...P(0.02, 0.63), 6.7, '#8a86a8', 6.2, { ...line, mix: 0 }); mark([[0.02 - 6.3 / U - 0.02, 0.655], [0.02 + 6.3 / U - 0.02, 0.665]], '#c4c0d8', 4, { opacity: 0.7 });   // and the ball at the end of it
  rim([[-0.19, 0.24], [-0.16, 0.34], [-0.07, 0.405], [0.04, 0.415]], 0.75);
}

// ---------------------------------------------------------------- Mario
{
  const { U, P, chain, mark, rim, shadow } = who(2.1, 8.2);
  const red = { shadow: '#5a1210', half: '#a01c18', lit: '#d83a26', bounce: '#b46c5c' }, blue = { shadow: '#141a4c', half: '#26348c', lit: '#3c52b8', bounce: '#6c78b0' }, hair = { shadow: '#160c06', half: '#3a2010', lit: '#5e3a1a', bounce: '#5c4c44' };
  shadow(1.15, 0.5);
  mark([[-0.22, 0.07], [-0.03, 0.07]], '#4c2a12', 9); mark([[0.03, 0.045], [0.22, 0.045]], '#3c200e', 9);                             // his shoes: he walks, and his left foot is forward
  solid(p, chain([[-0.1, 0.34, 0.09], [-0.11, 0.13, 0.078]]), blue, o); solid(p, chain([[0.1, 0.34, 0.09], [0.11, 0.11, 0.078]]), blue, o);   // his legs
  solid(p, chain([[0.215, 0.68, 0.068], [0.285, 0.56, 0.062]]), red, o); disc(p, ...P(0.305, 0.485), 0.082 * U, '#a4aac4', 6.2, { ...line, mix: 0 });   // his right arm, forward, and its glove
  solid(p, chain([[0, 0.4, 0.215], [0, 0.56, 0.205]]), blue, { ...o, width: 5.5, length: 18, flow: () => 0 });                              // his overalls
  solid(p, chain([[-0.03, 0.67, 0.19], [0.03, 0.67, 0.19]]), red, { ...o, width: 5.5, length: 17, flow: () => 0 });                         // his shirt
  for (const sx of [-1, 1]) mark([[sx * 0.125, 0.56], [sx * 0.105, 0.68], [sx * 0.085, 0.79]], '#26348c', 8.6);                             // the two straps
  mark([[-0.13, 0.55], [0, 0.535], [0.13, 0.55]], '#1a2466', 4.6, { opacity: 0.7 });                                                    // the top edge of the overalls at the back
  solid(p, chain([[-0.215, 0.68, 0.068], [-0.3, 0.53, 0.062]]), red, o); disc(p, ...P(-0.325, 0.445), 0.082 * U, '#b4bad0', 6.2, { ...line, mix: 0 }); mark([[-0.325 - 6.3 / U, 0.475], [-0.325 + 6.3 / U, 0.49]], '#fbf8f0', 4.4, { opacity: 0.9 });   // his left arm, back, and its glove
  // his head: brown hair low at the back, an ear at each side, and the cap over all of it
  solid(p, chain([[-0.03, 0.9, 0.2], [0.03, 0.9, 0.2]]), hair, { ...o, flow: () => Math.PI / 2 });
  for (const sx of [-1, 1]) mark([[sx * 0.225, 0.86], [sx * 0.235, 0.98]], sx < 0 ? '#d49870' : '#a86c4c', 6);
  for (const X of [-0.12, -0.04, 0.04, 0.12]) mark([[X, 0.9], [X * 1.1, 0.74]], '#140a05', 4, { opacity: 0.5, taper: [0.2, 0.5] });       // the locks of his hair
  shape(p, [[-0.25, 0.95], [-0.245, 1.04], [-0.18, 1.13], [0, 1.175], [0.18, 1.13], [0.245, 1.04], [0.25, 0.95], [0.13, 0.905], [0, 0.89], [-0.13, 0.905]].map(([X, Y]) => P(X, Y)), red, { light: LIGHT, turn: 0.3, width: 5.5, length: 18, round: 0.12 * U, vary: 0.05, mix: 0.05, flow: () => 0, edge: false });
  mark([[-0.25, 0.945], [-0.13, 0.9], [0, 0.885], [0.13, 0.9], [0.25, 0.945]], '#4a0e0c', 4.6, { opacity: 0.8 });                          // the edge of the cap
  // the gold of the sky along his top and his left side
  rim([[-0.25, 0.98], [-0.235, 1.06], [-0.17, 1.14], [-0.04, 1.18], [0.08, 1.17]]); rim([[-0.2, 0.78], [-0.27, 0.68], [-0.33, 0.56]], 0.7); rim([[-0.2, 0.42], [-0.19, 0.3], [-0.18, 0.16]], 0.5);
  void P;
}

// ---------------------------------------------------------------- Koops
{
  const { U, P, chain, mark, rim, shadow } = who(3.15, 7.7);
  const skin = { shadow: '#7a5a14', half: '#c89a2a', lit: '#f0c850', bounce: '#d4b888' }, hood = { shadow: '#122650', half: '#22489c', lit: '#3c6cc8', bounce: '#6c84b4' };
  shadow(1.02, 0.52);
  mark([[-0.21, 0.065], [-0.03, 0.065]], '#22487c', 9); mark([[0.03, 0.045], [0.21, 0.045]], '#1c3c6c', 9);                               // his shoes
  solid(p, chain([[-0.1, 0.22, 0.062], [-0.11, 0.12, 0.056]]), skin, o); solid(p, chain([[0.1, 0.22, 0.062], [0.11, 0.1, 0.056]]), skin, o);   // his legs
  for (const sx of [-1, 1]) { solid(p, chain([[sx * 0.245, 0.66, 0.064], [sx * 0.315, 0.5, 0.058]]), hood, o); mark([[sx * 0.325, 0.47], [sx * 0.335, 0.47 - 13 / U]], sx < 0 ? '#e0b440' : '#b08a24', 7.4); }   // his arms, in blue sleeves, and his hands
  // his shell: a green oval with a pale rim; the plates of it meet in dark lines
  const cx = 0, cy = 0.47, rx = 0.255, ry = 0.275, oval = []; for (let i = 0; i < 20; i++) { const a = i / 20 * Math.PI * 2; oval.push(P(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry)); }
  shape(p, oval, { shadow: '#0e3418', half: '#1e7030', lit: '#46ac52', bounce: '#5c9c78' }, { light: LIGHT, turn: 0.3, width: 5.5, length: 20, round: 0.14 * U, vary: 0.05, mix: 0.05, flow: () => 0, edge: false });
  for (let i = 0; i < 12; i++) { const a0 = i / 12 * Math.PI * 2, a1 = a0 + Math.PI / 6 * 1.15, am = (a0 + a1) / 2, lit = Math.cos(am) * LIGHT[0] - Math.sin(am) * LIGHT[1] > 0.2, q = (a) => P(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); p.tryStroke({ ...line, color: lit ? '#f4f0dc' : '#aab0c4', width: 6.4, points: [q(a0), q(am), q(a1)] }); }   // its rim
  { const hex = []; for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6; hex.push([cx + Math.cos(a) * 0.105, cy + Math.sin(a) * 0.115]); }
    for (let i = 0; i < 6; i++) { mark([hex[i], hex[i + 1]], '#0c2c14', 4, { opacity: 0.75 }); const a = i / 6 * Math.PI * 2 + Math.PI / 6; mark([hex[i], [cx + Math.cos(a) * rx * 0.86, cy + Math.sin(a) * ry * 0.86]], '#0c2c14', 4, { opacity: 0.7 }); }
    mark([[cx - 0.07, cy + 0.03], [cx - 0.02, cy + 0.07]], '#7cd47c', 4, { opacity: 0.6 }); }                                             // a little light on the middle plate
  solid(p, chain([[-0.13, 0.755, 0.082], [0.13, 0.755, 0.082]]), hood, { ...o, flow: () => 0 });                                          // the hood, on his shoulders
  solid(p, chain([[-0.02, 0.89, 0.15], [0.02, 0.89, 0.15]]), skin, { ...o, width: 5.5, length: 16, flow: () => Math.PI / 2 });              // his head
  rim([[-0.16, 0.9], [-0.13, 0.99], [-0.04, 1.04], [0.06, 1.035]]); rim([[-0.2, 0.78], [-0.29, 0.66], [-0.36, 0.52]], 0.7);
  void P; void U;
}

p.save();
