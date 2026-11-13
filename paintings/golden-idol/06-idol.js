// The golden idol, close to us on an open crate: a squat gold figure with a crest, arms
// crossed on its chest and two red stones for eyes, throwing its own light on everything near it.
'use strict';
const { studio, open, IDOL, INK, part, ink } = require('./scene');
const { mix, arc, disc } = studio;

const p = open('idol');
const r = p.rng;
const { x: ix, y: iy, h } = IDOL;

// The crate under it: planks, a lid leaning against its side, straw.
{
  const x0 = ix - 92, x1 = ix + 92, top = iy, base = iy + 98;
  for (let k = 0; k < 6; k++) {
    const y = top + (base - top) * (k + 0.5) / 6;
    p.stroke({ brush: 'flat', color: mix('#5a3830', '#3a2630', r()), width: (base - top) / 6 + 2, rag: 0, cap: 'flat', jitter: 0.5, streak: 0.25, points: [[x0, y], [ix, y + r.range(-1, 1)], [x1, y]] });
    p.stroke({ brush: 'flat', color: mix('#8a5a3c', '#a86a40', r()), width: (base - top) / 6 + 2, opacity: 0.8, rag: 0, cap: 'flat', jitter: 0.4, points: [[ix + 30, y], [x1, y]] });   // the end the low sun reaches
  }
  p.stroke({ brush: 'flat', color: '#c9963f', width: 10, rag: 0, cap: 'flat', points: [[x0 - 3, top - 2], [ix, top - 3], [x1 + 3, top - 2]] });                                              // its top edge, gilded by the idol
  for (const x of [x0, x1]) ink(p, [[x, top - 6], [x, (top + base) / 2], [x, base + 2]], 4.6);
  ink(p, [[x0 - 4, top - 8], [ix, top - 9], [x1 + 4, top - 8]], 4.4, { opacity: 0.8 });
  for (const x of [x0 + 46, x1 - 46]) ink(p, [[x, top + 6], [x, base]], 4.2, { opacity: 0.4 });
  p.stroke({ brush: 'flat', color: '#4a3030', width: 20, rag: 0, cap: 'flat', jitter: 0.4, points: [[x0 - 16, base + 4], [x0 - 44, top + 40], [x0 - 70, top - 6]] });                         // the lid
  ink(p, [[x0 - 6, base + 2], [x0 - 34, top + 40], [x0 - 60, top - 8]], 4.4);
  for (let k = 0; k < 14; k++) {                                                // straw
    const x = r.range(x0 + 10, x1 - 10), a = r.range(-2.4, -0.7), len = r.range(16, 30);
    p.tryStroke({ color: r.pick(['#e8c060', '#c99a40', '#f4d680']), width: 4, opacity: 0.85, points: [[x, top - 3], [x + Math.cos(a) * len, top - 3 + Math.sin(a) * len]] });
  }
}

// Its light: a wide glow, a tighter one, and rays.
for (const [w, o, color] of [[330, 0.11, '#f0a030'], [210, 0.17, '#ffc040'], [120, 0.26, '#ffd860']]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[ix - w * 1.03, iy - h * 0.5 + 8], [ix, iy - h * 0.5 - 8], [ix + w * 1.03, iy - h * 0.5 + 8]] });
}
for (let k = 0; k < 14; k++) {
  const a = -Math.PI + (k + r.range(-0.25, 0.25)) / 13 * Math.PI, c = Math.cos(a), s = Math.sin(a), far = r.range(150, 250);
  p.stroke({ brush: 'soft', color: '#ffe38a', width: r.range(10, 18), opacity: r.range(0.14, 0.3), taper: [0, 0.9], points: [[ix + c * 62, iy - h * 0.55 + s * 62], [ix + c * far * 0.6, iy - h * 0.55 + s * far * 0.6], [ix + c * far, iy - h * 0.55 + s * far]] });
}

// The idol.
{
  const gold = '#f2c23e', deep = '#b47a1c', pale = '#fff2a8';
  const P = (x, y) => [ix + x, iy + y];
  part(p, [P(-38, -8), P(0, -9), P(38, -8)], 17, deep, { lit: gold });                                  // the foot it stands on
  part(p, [P(-11, -16), P(-11, -44), P(-11, -74)], 26, mix(gold, deep, 0.4), { ink: false });           // the body, in two strokes
  part(p, [P(11, -16), P(11, -44), P(11, -74)], 26, gold, { ink: false });
  for (const s of [-1, 1]) ink(p, [P(s * 24, -14), P(s * 24, -44), P(s * 24, -76)], 4.4);
  part(p, [P(-30, -64), P(-4, -52), P(22, -44)], 15, gold, { lit: pale, shade: deep });                 // arms crossed on the chest
  part(p, [P(30, -64), P(4, -52), P(-22, -44)], 15, gold, { lit: pale, shade: deep });
  disc(p, ...P(0, -92), 25, gold, 10, { brush: 'flat', rag: 0, cap: 'round', jitter: 0.2 });            // the head
  p.stroke({ color: deep, width: 6, opacity: 0.8, points: arc(ix - 3, iy - 92, 17, 1.6, 3.9, 7) });
  p.stroke({ color: pale, width: 6, opacity: 0.9, points: arc(ix + 3, iy - 94, 17, -1.3, 0.5, 7) });
  ink(p, arc(ix, iy - 92, 25.5, 0, 6.283, 20), 4.4);
  part(p, [P(-18, -112), P(0, -124), P(18, -112)], 12, gold, { lit: pale });                            // the crest
  part(p, [P(0, -112), P(0, -128), P(0, -140)], 9, gold, { lit: pale, taper: [0, 0.8] });
  for (const s of [-1, 1]) {                                                                           // eyes of red stone
    p.line(...P(s * 10 - 6.2, -95), ...P(s * 10 + 6.2, -95), { color: '#d4202e', width: 6 });
    p.line(...P(s * 10 - 6.2, -97), ...P(s * 10 + 6.2, -97.4), { color: '#ff8a7a', width: 4, opacity: 0.6 });
  }
  p.line(...P(-8, -80), ...P(8, -80), { color: INK, width: 4.2, opacity: 0.85 });                       // the mouth
  p.stroke({ color: pale, width: 5, opacity: 0.9, points: [P(12, -22), P(13, -44), P(12, -68)] });      // light down its side
}

p.save();
