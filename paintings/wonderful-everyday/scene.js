// Shared layout, palette and brush habits for the Wonderful Everyday painting.
//
// The scene: the hill of sunflowers. Wonderful Everyday is a dark story for most of its
// length, and it is about how to live happily in spite of that. One of its ends comes back
// to a hill in the country, in summer, where the sunflowers are in bloom under a great blue
// sky. Two girls in the uniform of their school stand at the top of the path, hand in hand:
// Hasaki, with her brown hair tied up and her rabbit doll in her other hand, and Yuki, with
// her long dark hair. The wind is on the hill and takes their hair and the petals with it.
//
// The sun is behind us, high and to the left. So this picture is in full light: the flowers
// face us, the clouds are white, and the shade of each thing is on its right and under it.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp } = studio;

const W = 1600, H = 1000;
const SUNWARD = [-0.62, -0.7];             // toward the sun
const nA = noise2(1009), nB = noise2(1021), nC = noise2(1039);

// The top of the hill, against the sky.
const crestLine = through([[0, 668], [300, 646], [620, 598], [900, 556], [1200, 528], [1600, 506]]);
const crest = (x) => crestLine(x) + 5 * (nB(x / 80, 3) - 0.5);
// How near a place on the hill is: 0 at the top of it, 1 at the bottom of the picture.
const near = (x, y) => clamp((y - crest(x)) / (H - crest(x)), 0, 1);
// The path up the hill: the middle of it, and half its width, at a height.
const pathMid = through([[566, 906], [620, 870], [690, 800], [780, 700], [900, 600], [1010, 540]]);
const pathHalf = through([[566, 11], [620, 17], [690, 28], [780, 46], [900, 84], [1010, 150]]);
const onPath = (x, y, m = 0) => y > crest(x) - 2 && Math.abs(x - pathMid(y)) < pathHalf(y) + m;
const HASAKI = { x: 862, s: 1.5 }, YUKI = { x: 954, s: 1.62 };          // where each stands, and how many units of the picture a centimetre of her is
const FEET = 572;                                                       // the height in the picture of the ground under their feet

// The sky of summer: a deep blue overhead, paler down the sky.
const skyRamp = grad([[0, '#1456c8'], [0.35, '#2f7fe0'], [0.7, '#74b6f2'], [1, '#c6e6fb']]);
const skyColor = (x, y) => skyRamp(clamp(y / 600 + (nA(x / 380, y / 200) - 0.5) * 0.06, 0, 1));
// What the bright air does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, d) => mix(color, '#cfe6d0', clamp(d, 0, 1) * 0.75);

// A sunflower that faces us. (x, y) is the middle of its head, R the reach of its petals.
// It has a stalk, big leaves, two rings of petals, and a brown heart.
function sunflower(p, x, y, R, o = {}) {
  const r = p.rng, d = o.d || 0, squash = o.squash || r.range(0.78, 1), turn = r.range(0, 6.283), stalk = o.stalk != null ? o.stalk : R * r.range(2.4, 3.8);
  const bristle = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.15, cap: 'round' };
  if (R < 13) {                                                          // far off it is a dab of yellow
    p.tryStroke({ ...bristle, color: far(mix('#f4b414', '#ffe050', r()), d), width: Math.max(4.8, R * 0.95), rag: 0.3, points: [[x - 6.3, y + r.range(-1.5, 1.5)], [x + 6.3, y + r.range(-1.5, 1.5)]] });
    return;
  }
  // its stalk and its leaves
  const sx = x + r.range(-0.3, 0.3) * R, foot = [sx + r.range(-0.4, 0.4) * R, y + stalk];
  p.tryStroke({ ...bristle, color: far(mix('#3a7a2a', '#5a9a32', r()), d), width: Math.max(4.8, R * 0.15), points: [[x, y + R * 0.3], [sx, y + stalk * 0.5], foot] });
  for (let k = 0; k < (R >= 30 ? 3 : 2); k++) {
    const t = 0.26 + 0.26 * k + r.range(-0.1, 0.1), lx = x + (foot[0] - x) * t, ly = y + stalk * t, s = r() < 0.5 ? 1 : -1, len = Math.max(13, R * r.range(0.8, 1.7)), lw = Math.max(4.8, Math.min(len / 2.1, R * r.range(0.34, 0.56)));
    const tip = [lx + s * len * r.range(0.7, 0.95), ly + len * r.range(-0.3, 0.5)], mid = [lx + s * len * 0.5, ly - len * r.range(0, 0.25)];
    p.tryStroke({ ...bristle, color: far(mix('#1f5c22', '#2f7a2a', r()), d), width: lw, taper: [0.2, 0.75], points: [[lx, ly], mid, tip] });
    p.tryStroke({ ...bristle, color: far(mix('#5aa832', '#9cd048', r()), d), width: Math.max(4.8, lw * 0.5), opacity: 0.9, taper: [0.2, 0.75], points: [[lx - 1, ly - lw * 0.2], [mid[0] - 2, mid[1] - lw * 0.22], [tip[0] - 2, tip[1] - 1]] });   // the light on the top of it
  }
  // its petals: a ring of darker ones behind, and a ring of bright ones in front, between them
  const n = clamp(Math.round(R * 0.5), 9, 20), len = Math.max(12.6, R * 0.62), w = Math.max(4.8, Math.min(len / 2.1, R * 0.26)), inner = R - len;
  for (const ring of [0, 1]) {
    for (let i = 0; i < n; i++) {
      const a = turn + (i + ring * 0.5) / n * 6.283 + r.range(-0.06, 0.06), ca = Math.cos(a) * squash, sa = Math.sin(a), k = r.range(0.88, 1.06);
      const shade = clamp(ca * 0.5 + sa * 0.5, 0, 1);                    // the petals at the right and below are a little in shade
      p.tryStroke({ ...bristle, color: far(mix(ring ? mix('#ffd21c', '#ffec60', r()) : mix('#e2940c', '#f2b012', r()), '#c8780c', shade * 0.4), d), width: w, taper: [0.1, 0.55], points: [[x + ca * inner, y + sa * inner], [x + ca * (inner + len * k), y + sa * (inner + len * k)]] });
    }
  }
  // its heart
  const hr = R * 0.45;
  if (hr >= 13) {
    studio.disc(p, x, y, hr, far('#5a3412', d), Math.max(6, hr * 0.42), { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.1, cap: 'round' });
    p.tryStroke({ ...bristle, color: far('#a8701c', d), width: Math.max(4.8, hr * 0.22), opacity: 0.9, points: studio.arc(x - hr * 0.08, y - hr * 0.08, hr * 0.62, 2.4, 5.4, 10) });   // the light on the side of it that is toward the sun
    { const L = Math.max(12.6, hr * 0.72), cw = Math.min(L / 2.1, Math.max(4.8, hr * 0.3)); for (const a of [0.5, 2.07]) p.tryStroke({ ...bristle, color: far('#2c1808', d), width: cw, points: [[x + hr * 0.06 - Math.cos(a) * L / 2, y + hr * 0.06 - Math.sin(a) * L / 2], [x + hr * 0.06 + Math.cos(a) * L / 2, y + hr * 0.06 + Math.sin(a) * L / 2]] }); }   // the dark middle of it
  } else {
    const hw = Math.max(4.8, Math.min(hr * 1.1, 6.2));
    for (const a of [0.4, 1.97]) p.tryStroke({ ...bristle, color: far(mix('#4a2a10', '#6c4216', r()), d), width: hw, points: [[x - Math.cos(a) * 6.3, y - Math.sin(a) * 6.3], [x + Math.cos(a) * 6.3, y + Math.sin(a) * 6.3]] });
  }
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUNWARD, nA, nB, nC, crest, near, pathMid, pathHalf, onPath, HASAKI, YUKI, FEET, skyColor, far, sunflower };
