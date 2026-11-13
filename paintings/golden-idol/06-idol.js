// The golden idol, close to us on an open crate: a small gold figure with a fan of rays on
// its head, arms folded, two red stones for eyes. It is the one thing here that makes its
// own light, and that light lies on the crate, the straw and the ground around it.
'use strict';
const { studio, open, IDOL, SUNLIGHT } = require('./scene');
const { mix, form, solid } = studio;

const p = open('idol');
const r = p.rng;
const { x: ix, y: iy, h } = IDOL;

// The crate under it: dark wood, its top gilded by the idol, the end toward the sun warm.
{
  const x0 = ix - 92, x1 = ix + 92, top = iy, base = iy + 98;
  for (let k = 0; k < 6; k++) {
    const y = top + (base - top) * (k + 0.5) / 6, lit = 1 - k / 6;
    p.stroke({ brush: 'bristle', color: mix(mix('#221824', '#3a2a2c', r()), '#6a4a26', lit * 0.45), width: (base - top) / 6 + 3, mix: 0.05, dry: 0, rag: 0.05, cap: 'flat', jitter: 0.6, streak: 0.3, points: [[x0, y], [ix, y + r.range(-1, 1)], [x1, y]] });
    p.tryStroke({ brush: 'bristle', color: mix('#8a4c34', '#c8743e', r()), width: (base - top) / 6 + 3, opacity: 0.7, mix: 0.2, dry: 0.1, rag: 0.1, cap: 'flat', jitter: 0.5, points: [[ix + 44, y], [x1, y]] });
  }
  for (const x of [x0 + 48, x1 - 48]) p.tryStroke({ color: '#17101c', width: 4.2, opacity: 0.5, points: [[x, top + 6], [x + r.range(-1, 1), (top + base) / 2], [x, base]] });   // the joints between planks
  p.stroke({ brush: 'bristle', color: '#b8842c', width: 11, mix: 0.1, dry: 0, rag: 0.05, points: [[x0 - 2, top - 2], [ix, top - 3], [x1 + 2, top - 2]] });        // the top, in the idol's light
  p.stroke({ brush: 'bristle', color: '#ffd45a', width: 8, opacity: 0.9, mix: 0.2, dry: 0, taper: [0.5, 0.5], points: [[ix - 62, top - 3], [ix, top - 4], [ix + 62, top - 3]] });
  form(p, [[x0 - 16, base + 4], [x0 - 44, top + 40], [x0 - 70, top - 6]], 19, { dark: '#22182a', mid: '#4a3430', light: () => mix('#c9902e', '#ffd45a', r()), toward: [1, -0.3], cap: 'flat', rag: 0.05 });   // the lid, leaning
  for (let k = 0; k < 9; k++) {                                                 // straw, spilling over the top
    const x = r.range(x0 + 8, x1 - 8), a = r.range(-2.3, -0.8), len = r.range(13, 22);
    p.tryStroke({ brush: 'bristle', color: r.pick(['#d9a63c', '#b8842c', '#e8bc52']), width: 4.4, opacity: r.range(0.4, 0.7), mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0, 0.5], points: [[x, top - 2], [x + Math.cos(a) * len, top - 2 + Math.sin(a) * len]] });
  }
}

// Its light: a wide haze of gold, tighter and brighter toward the figure, and a few faint rays.
for (const [w, o, color] of [[360, 0.1, '#e89428'], [240, 0.15, '#f7b436'], [150, 0.2, '#ffcc4a'], [84, 0.3, '#ffe070']]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[ix - w * 1.03, iy - h * 0.5 + 8], [ix, iy - h * 0.5 - 8], [ix + w * 1.03, iy - h * 0.5 + 8]] });
}
for (let k = 0; k < 9; k++) {
  const a = -Math.PI + (k + r.range(-0.3, 0.3)) / 8 * Math.PI, c = Math.cos(a), s = Math.sin(a), far = r.range(170, 280);
  p.stroke({ brush: 'soft', color: '#ffe59a', width: r.range(14, 26), opacity: r.range(0.07, 0.15), taper: [0, 0.9], points: [[ix + c * 50, iy - h * 0.55 + s * 50], [ix + c * far * 0.6, iy - h * 0.55 + s * far * 0.6], [ix + c * far, iy - h * 0.55 + s * far]] });
}

// The idol: a squat gold figure, arms folded on its belly, a heavy round head under a fan
// of rays. Deep amber where it turns away, bright gold toward the sun, points of white.
{
  const gold = { shadow: '#5a3408', half: '#a8701a', lit: '#f6c640', rim: '#fff6c4', bounce: '#c48a2a' };
  const o = { light: [0.75, -0.5], turn: -0.15, width: 5, length: 20, vary: 0.14 };
  const P = (x, y, rad) => [ix + x, iy + y, rad];
  solid(p, [P(-30, -8, 8), P(30, -8, 8)], { ...gold, shadow: '#4a2a06' }, o);                                  // the foot it stands on
  solid(p, [P(0, -22, 23), P(0, -46, 22), P(0, -66, 18)], gold, o);                                            // the body
  solid(p, [[P(-21, -66, 7.5), P(-22, -50, 7.5), P(-4, -41, 7)], [P(21, -66, 7.5), P(22, -50, 7.5), P(4, -43, 7)]], { ...gold, shadow: '#6e440c' }, { ...o, turn: -0.3 });   // the arms, folded
  for (const [a, len] of [[-2.25, 19], [-1.92, 25], [-1.57, 29], [-1.22, 25], [-0.9, 19]]) {                   // the fan of rays on its head
    const c = Math.cos(a), s = Math.sin(a);
    form(p, [[ix + c * 14, iy - 95 + s * 14], [ix + c * (14 + len / 2), iy - 95 + s * (14 + len / 2)], [ix + c * (14 + len), iy - 95 + s * (14 + len)]], 8.5,
      { dark: '#7a4c10', mid: '#d09a2a', light: () => mix('#ffe27a', '#fff6c4', r()), toward: [0.75, -0.5], rag: 0, taper: [0, 0.55], lightOpacity: 0.8, gap: 8 });
  }
  solid(p, [P(0, -97, 18), P(0, -90, 19)], gold, { ...o, length: 16 });                                        // the head
  p.stroke({ brush: 'bristle', color: '#6a400c', width: 6, opacity: 0.7, mix: 0.2, dry: 0, rag: 0, cap: 'round', taper: [0.3, 0.3], points: [[ix - 14, iy - 99], [ix, iy - 101], [ix + 14, iy - 99]] });   // the brow, heavy over the eyes
  for (const s of [-1, 1]) p.line(ix + s * 7.5, iy - 97, ix + s * 8, iy - 84.5, { brush: 'bristle', color: s < 0 ? '#b01422' : '#ff4a40', width: 4.8, mix: 0, dry: 0, rag: 0, cap: 'round' });           // eyes of red stone
  p.stroke({ brush: 'bristle', color: '#5a3408', width: 4.4, opacity: 0.6, mix: 0.2, dry: 0, rag: 0, cap: 'round', points: [[ix - 8, iy - 79], [ix, iy - 77.5], [ix + 8, iy - 79]] });                    // the mouth
  p.stroke({ brush: 'soft', color: '#fff0a0', width: 24, opacity: 0.22, points: [[ix - 28, iy - 60], [ix, iy - 72], [ix + 28, iy - 60]] });                                                              // a bloom over the figure itself
}

p.save();
