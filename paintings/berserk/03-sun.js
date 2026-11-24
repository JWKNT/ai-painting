// The black sun. It is a round of black in the middle of the fire: the fire is a thin ring of
// pale gold at its edge, tongues that go out from the ring and bend the way that the storm
// turns, and a light with no edge that fills the middle of the funnel.
'use strict';
const { studio, open, SUN, swirlAngle } = require('./scene');
const { mix, disc, arc, clamp } = studio;

const p = open('sun');
const r = p.rng;

// the light round it: wide soft strokes that cross at its middle
for (const [w, o, n, c] of [[330, 0.07, 6, '#ff7a30'], [230, 0.1, 6, '#ff9840'], [150, 0.14, 6, '#ffb458'], [100, 0.2, 6, '#ffd488'], [70, 0.24, 6, '#fff0c0']]) for (let i = 0; i < n; i++) {
  const a = i * Math.PI / n + r() * 0.3, l = w * 1.06;
  p.stroke({ brush: 'soft', color: c, width: w, opacity: o, points: [[SUN.x - Math.cos(a) * l, SUN.y - Math.sin(a) * l], [SUN.x, SUN.y], [SUN.x + Math.cos(a) * l, SUN.y + Math.sin(a) * l]] });
}
// the fire of the ring: fine tongues, most of them short, thick in some places and thin in others, that lean a little the way that the storm goes
for (let k = 0; k < 64; k++) {
  const a = r() * 6.283;
  if (Math.sin(a * 2.3 + 1) < -0.35 && r() < 0.7) continue;                // not even all the way round
  const long = r() < 0.14, len = long ? r.range(110, 230) : r.range(20, 64), w = long ? r.range(5, 8) : clamp(len * r.range(0.12, 0.22), 4.8, 11), pts = [];
  let x = SUN.x + Math.cos(a) * (SUN.r - 2), y = SUN.y + Math.sin(a) * (SUN.r - 2), dir = a;
  for (let i = 0; i <= 8; i++) {
    pts.push([x, y]);
    const t = i / 8, sw = swirlAngle(x, y) + Math.PI;
    dir = a + (((sw - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI) * 0.22 * t;
    x += Math.cos(dir) * len / 8; y += Math.sin(dir) * len / 8;
  }
  p.tryStroke({ brush: 'bristle', mix: 0.2, dry: 0, rag: 0, cap: 'round', streak: 0.2, jitter: 0.2, color: mix('#ffb450', '#fff4cc', r() * (long ? 0.5 : 1)), width: w, opacity: long ? r.range(0.25, 0.45) : r.range(0.45, 0.85), taper: [0.05, 0.9], points: pts });
}
// the black round of it
disc(p, SUN.x, SUN.y, SUN.r, '#0a0410', 20, { brush: 'bristle', mix: 0, dry: 0, rag: 0, streak: 0.1, jitter: 0.2, cap: 'round' });
for (let k = 0; k < 10; k++) { const a = r() * 6.283, rr = r.range(10, SUN.r - 16); p.tryStroke({ brush: 'bristle', mix: 0.1, dry: 0, rag: 0, cap: 'round', color: mix('#0a0410', '#1e0a1c', r()), width: 12, opacity: 0.7, points: arc(SUN.x, SUN.y, rr, a, a + r.range(0.9, 1.8)) }); }
// the ring: pale gold round the edge, in lengths that lie over each other, and a white line in it
for (const [rad, w, c, o, n] of [[SUN.r + 3, 10, '#ffd070', 0.9, 8], [SUN.r + 1.5, 6.5, '#fff6d8', 0.95, 9], [SUN.r + 0.5, 4.4, '#ffffff', 0.9, 11]]) {
  const a0 = r() * 6.283;
  for (let k = 0; k < n; k++) { const a = a0 + k * 6.283 / n; p.stroke({ brush: 'round', color: c, width: Math.max(4.2, w * r.range(0.88, 1.15)), opacity: o, points: arc(SUN.x, SUN.y, rad, a - 0.07, a + 6.283 / n + 0.07, 9) }); }
}
// the edge of the black is clean
for (let k = 0; k < 12; k++) { const a = k * 6.283 / 12; p.stroke({ brush: 'round', color: '#0a0410', width: 8, points: arc(SUN.x, SUN.y, SUN.r - 5.5, a - 0.05, a + 6.283 / 12 + 0.05, 7) }); }

p.save();
