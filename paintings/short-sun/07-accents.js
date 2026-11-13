// Last touches: the inhumi, coming. They cross from Green when the two worlds are near, and
// here is a line of them, small against the planet and larger as they come on, the nearest
// almost over the boat. Then the corners of the picture are brought down.
'use strict';
const { studio, open, W, H, GREEN, MAST } = require('./scene');
const { mix } = studio;

const p = open('accents');
const r = p.rng;

// An inhumu on the wing: a thin body, a small head on a long neck, legs trailing, and two wide
// wings of skin. Each wing is a bent arm with the web hanging from it in three folds, so its
// lower edge is scalloped. `s` is its size, `bank` its tilt, `beat` how far the wings are raised.
function inhumu(x, y, s, bank, beat) {
  const c = Math.cos(bank), q = Math.sin(bank), P = (u, v) => [x + (u * c - v * q) * s, y + (u * q + v * c) * s];
  const st = { brush: 'bristle', color: '#07070e', mix: 0, dry: 0, rag: 0.05, cap: 'round' }, up = beat * 14;
  for (const sgn of [-1, 1]) {
    const wrist = [sgn * 30, -20 - up], tip = [sgn * 60, -6 - up * 0.3];
    p.tryStroke({ ...st, width: Math.max(4.6, 5.5 * s), taper: [0, 0.4], points: [P(sgn * 3, -8), P(...wrist), P(...tip)] });                       // the arm
    for (const [a, b, w] of [[[wrist[0] * 0.95, wrist[1] + 4], [sgn * 50, 8 - up * 0.2], 13], [[sgn * 19, -13 - up * 0.6], [sgn * 36, 16], 14], [[sgn * 8, -5], [sgn * 19, 19], 13]]) {
      p.tryStroke({ ...st, width: Math.max(4.6, w * s), taper: [0.05, 0.45], points: [P(...a), P((a[0] + b[0]) / 2, (a[1] + b[1]) / 2), P(...b)] });   // a fold of the web
    }
    if (s > 0.8) p.tryStroke({ color: mix('#ff9c50', '#ffd494', r()), width: 4, opacity: sgn > 0 ? 0.6 : 0.3, points: [P(wrist[0] + 3, wrist[1] - 3), P(tip[0] + 2, tip[1] - 3)] });   // the last of the sun along it
  }
  p.tryStroke({ ...st, width: Math.max(4.6, 8 * s), points: [P(0, -11), P(0, 16)] });                                                              // the body
  p.tryStroke({ ...st, width: Math.max(4.6, 5 * s), taper: [0, 0.6], points: [P(0, 14), P(-2, 30), P(-1, 46)] });                                  // the legs, together
  p.tryStroke({ ...st, width: Math.max(4.6, 6.5 * s), points: [P(0, -24), P(0, -11)] });                                                           // the head, on its neck
}
// From Green toward the sloop: small where they are far, and larger as they come on.
inhumu(GREEN.x + 172, GREEN.y + 52, 0.26, 0.5, -0.3);
inhumu(GREEN.x + 214, GREEN.y + 84, 0.36, 0.5, 0.3);
inhumu(GREEN.x + 262, GREEN.y + 120, 0.52, 0.4, -0.5);
inhumu(GREEN.x + 334, GREEN.y + 150, 0.74, 0.48, 0.7);
inhumu(MAST.x + 156, MAST.top - 104, 1.1, 0.36, 0.1);

// The corners, a tone darker.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.32], [W + 80, H + 40, 900, H + 60, 200, 0.3], [-90, -50, 520, -80, 220, 0.26], [W + 90, -50, 1080, -80, 220, 0.22],
]) {
  p.stroke({ brush: 'soft', color: '#04060f', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
