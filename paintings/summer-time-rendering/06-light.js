// She goes. The side of her that is toward the sun comes apart into small pieces of light,
// and the wind takes them up and away to the right, over the sea: near her they are
// many, and some still have the white and the dark of her clothes; further off they are
// few and small and only gold. Then the light of the sun over the whole picture, and the
// corners a tone darker.
'use strict';
const { studio, open, W, H, cam, SUN, USHIO } = require('./scene');
const { mix, clamp, glow } = studio;

const p = open('light');
const r = p.rng;
const U = cam.unit(USHIO.Z), P = (X, Y) => cam.at(USHIO.X + X, Y, USHIO.Z);
// Where her right arm and the right edge of her skirt were, there is only light.
for (const [X, Y, w, op] of [[0.3, 1.0, 40, 0.26], [0.27, 0.76, 34, 0.2], [0.32, 1.18, 30, 0.18]]) glow(p, ...P(X, Y), w, '#fff0c0', op, 8);
// The pieces. t is how far a piece has gone: 0 at her, 1 far off.
for (let k = 0; k < 190; k++) {
  const t = Math.pow(r(), 1.5), X = 0.22 + t * 2.3 + Math.abs(r.gauss()) * (0.05 + 0.3 * t), Y = 0.45 + r() * 0.85 + t * (0.5 + r() * 1.3) + Math.sin(t * 4 + k) * 0.06, [x, y] = P(X, Y);
  if (x > W - 10 || y < 30) continue;
  const near = 1 - t, l = clamp((10 + 14 * near) * r.range(0.8, 1.3), 12.4, 26), a = -0.6 + r.range(-0.9, 0.9), own = near > 0.75 && r() < 0.35;
  const c = own ? r.pick(['#d8ccd8', '#3a3e70', '#f0d078']) : mix('#ffcf70', '#fffbe6', r());
  if (!own && r() < 0.3 + 0.3 * near) glow(p, x, y, 9 + 9 * near, '#ffe9a8', 0.1 + 0.1 * near, 6);
  p.tryStroke({ brush: 'round', color: c, width: clamp(4 + 3.4 * near * r(), 4, 7.4), opacity: clamp(0.35 + 0.6 * near + r.range(-0.1, 0.1), 0.25, 0.97), taper: [0.4, 0.4], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] });
}
// A few go the other way, out of the ends of her hair.
for (let k = 0; k < 16; k++) { const [x, y] = P(-0.5 - r() * 0.9, 0.95 + r() * 0.7), l = r.range(12.4, 16), a = r.range(-0.6, 0.6); if (r() < 0.4) glow(p, x, y, 11, '#ffe9a8', 0.1, 6); p.tryStroke({ brush: 'round', color: mix('#ffd070', '#fff6d0', r()), width: 4, opacity: r.range(0.3, 0.8), taper: [0.4, 0.4], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] }); }
// The light of the sun lies over the whole of the picture near it.
for (const [w, op] of [[520, 0.05], [320, 0.07]]) glow(p, SUN.x, SUN.y + 30, w, '#ffcf80', op, 5, 0.7);
// The corners.
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 190, 0.3], [W + 60, -40, 1140, -70, 190, 0.3], [-60, H + 50, 520, H + 60, 150, 0.34], [W + 60, H + 50, 1080, H + 60, 150, 0.34]]) p.stroke({ brush: 'soft', color: '#150f2c', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void U;

p.save();
