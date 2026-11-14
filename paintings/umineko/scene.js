// Shared layout, palette and brush habits for the Umineko painting.
//
// The scene: the Golden Land. It is the rose garden of Rokkenjima as the witch shows it at
// the end of her riddle: every rose is gold and gives light, the sky is purple and turns
// about one place like water that goes down a drain, and golden butterflies fly up into it.
// No one is here. A wide paved way goes between the beds of roses to the arbor, which is
// round, of white stone, with a roof of open ironwork; in it a table is laid for tea.
// Beyond are a long hedge and the dark forest of the island. Close to us, at the left, a
// rose bush stands with its great golden flowers.
//
// The roses are the light. So the hedges are lit from inside themselves, the stone of the
// arbor is warm on the side of the nearer beds and violet on the other, and the paving holds
// both the gold and the purple of the sky.
//
// All of it is drawn from one place: an eye 2.3 m over the paving (we stand on the steps of
// the guesthouse) that looks level along the garden. `at` puts a place of the garden
// (metres to the right, metres up, metres away) into the picture.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, disc, arc } = studio;

const W = 1600, H = 1000;
const HZ = 590, VX = 740, F = 1150, EYE = 2.3;            // the line of the eye, the point that the lines of the garden go to, and the lens
const VORTEX = { x: 884, y: 204, squash: 1.9 };           // the place that the sky turns about; the turning is wider than it is high
const ARBOR = { X: 2.2, Z: 21, ring: 2.3, columns: 6, turn: 0.26 };   // its middle, the ring that its columns stand on, and how the ring is turned
const AVENUE = { left: -1.8, right: 6.2 };                // the paved way to the arbor
// The beds of roses: each is a block of clipped green, so wide (x0 to x1), so deep (z0 to z1) and so high.
const BEDS = {
  far: { x0: -70, x1: 70, z0: 27.5, z1: 29, h: 1.4 },
  left2: { x0: -40, x1: AVENUE.left, z0: 11.5, z1: 14.5, h: 0.95 },
  left1: { x0: -40, x1: AVENUE.left, z0: 7, z1: 10.5, h: 0.95 },
  right: { x0: AVENUE.right, x1: 40, z0: 8, z1: 14.5, h: 0.95 },
};

const at = (X, Y, Z) => [VX + F * X / Z, HZ - F * (Y - EYE) / Z];
const unit = (Z) => F / Z;                                                                               // units of the picture to the metre, at a distance
const groundAt = (x, y) => { const Z = F * EYE / Math.max(0.5, y - HZ); return [(x - VX) * Z / F, Z]; };   // the place of the ground that we see at a place of the picture

const nA = noise2(3301), nB = noise2(3307), nC = noise2(3313), nD = noise2(3319);

// The turning of the sky. A place of the sky has a distance from the middle of the turning and an angle about it.
const swirl = (x, y) => { const u = x - VORTEX.x, v = (y - VORTEX.y) * VORTEX.squash; return { r: Math.hypot(u, v), th: Math.atan2(v, u) }; };
const WIND = 8, ARMS = 3;                                  // how tightly its arms wind in, and how many arms it has
// The way that the sky goes at a place: round the middle, and a little in toward it. Strokes that follow this are its arms.
const swirlAngle = (x, y) => { const { th } = swirl(x, y), k = ARMS / WIND; return Math.atan2((Math.cos(th) + k * Math.sin(th)) / VORTEX.squash, -Math.sin(th) + k * Math.cos(th)); };
const skyRamp = grad([[0, '#10031c'], [0.25, '#2c0b4c'], [0.5, '#66157e'], [0.72, '#ac2a9a'], [0.9, '#e25cc4'], [1, '#ff9ce2']]);
// The great arms of the turning at a place: 1 in the middle of a light arm, -1 in the middle of a dark one.
const armAt = (x, y) => { const { r, th } = swirl(x, y); return Math.sin(ARMS * th - WIND * Math.log(Math.max(24, r) / 60) + (nA(x / 300, y / 180) - 0.5) * 2.4); };
function skyColor(x, y) {
  const { r, th } = swirl(x, y), lr = Math.log(Math.max(24, r) / 60);
  const arm = armAt(x, y);
  const fine = Math.sin(2 * ARMS * th - 2 * WIND * lr + 1.7 + (nB(x / 160, y / 90) - 0.5) * 3);   // and thinner ones in them
  let c = skyRamp(clamp(0.33 + 0.31 * arm + 0.13 * fine + 0.22 * Math.exp(-Math.pow(r / 520, 2)), 0, 1));
  c = mix(c, '#0c0218', smooth(560, 1500, r) * 0.7);                                            // far from the middle it is nearly black
  c = mix(c, '#ff8ce0', Math.exp(-Math.pow(r / 210, 2)) * 0.45);                                // the middle is light
  return mix(c, '#fff0fc', Math.exp(-Math.pow(r / 74, 2)) * 0.92);
}

// Gold: from deep amber, through the yellow of a rose, to nearly white.
const gold = grad([[0, '#7a3a06'], [0.22, '#c8780e'], [0.45, '#f2b21c'], [0.66, '#ffd544'], [0.84, '#ffec94'], [1, '#fffce4']]);

// A rose far off: a short level touch of gold in a soft glow. `k` is how bright it is.
function spark(p, x, y, k = 1) {
  const r = p.rng;
  if (r() < 0.6) p.tryStroke({ brush: 'soft', color: '#ffc428', width: 9, opacity: 0.1 + 0.16 * k * r(), points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: gold(r.range(0.55, 1)), width: r.range(4, 4.8), opacity: clamp(k * r.range(0.6, 1), 0, 1), points: [[x - 6.2, y], [x + 6.2, y + r.range(-0.8, 0.8)]] });
}

// A golden rose that faces us, of the radius R. It gives its own light, so it is brightest at the rims of its petals and
// deepest in the folds between them. Far off it is a spark; nearer it is a round head of gold; close to us it is
// rings of petals round a heart. `dim` (0 to 1) takes it down for one that is in shade or behind leaves.
function rose(p, x, y, R, o = {}) {
  const r = p.rng, dim = o.dim || 0, tone = (t) => mix(gold(clamp(t, 0, 1)), '#3c2408', dim * 0.6), line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.08, cap: 'round' };
  if (R < 6.5) { spark(p, x, y, 1 - dim * 0.5); return; }
  // its light in the air round it
  if (o.glow !== false) { const w = Math.max(9, R * (R < 13 ? 2 : 1.5)), n = R < 13 ? 2 : R < 30 ? 4 : 6, turn = r() * 3; for (let i = 0; i < n; i++) { const a = turn + i * Math.PI / n; p.tryStroke({ brush: 'soft', color: '#ffc022', width: w, opacity: (R < 13 ? 0.16 : 0.13) * (1 - dim * 0.6), points: [[x - Math.cos(a) * w * 1.06, y - Math.sin(a) * w * 1.06], [x, y], [x + Math.cos(a) * w * 1.06, y + Math.sin(a) * w * 1.06]] }); } }
  if (R < 13) {                                                          // a small one: a round head of gold, with its light in the middle of it
    const R2 = Math.max(7, R);
    disc(p, x, y, R2, tone(r.range(0.38, 0.6)), 6.2, { ...line });
    if (R2 >= 8.6) p.tryStroke({ brush: 'round', color: tone(r.range(0.82, 1)), width: R2 > 10.5 ? 5 : 4.2, opacity: 0.85, points: [[x - 6.3, y - R2 * 0.14], [x + 6.3, y - R2 * 0.2]] });
    return;
  }
  // A petal is a piece of a ring. `around` gives the points of such a piece: it comes in a little toward its end, as the petals of a rose do.
  const around = (rad, a0, span, inward = 0.12, n = 7) => { const pts = []; for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + span * t, rr = rad * (1 - inward * t); pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr * (o.squash || 0.94)]); } return pts; };
  const spanFor = (rad, w, want) => Math.max(want, 2 * Math.asin(Math.min(1, Math.max(12.8, 2.1 * w) / (2 * rad))));
  const big = R >= 30, rings = big ? [[0.8, 6, 0.36], [0.56, 5, 0.27], [0.33, 4, 0.2]] : [[0.74, 5, 0.42], [0.38, 3, 0.3]];
  // the deep gold that is under all of it, and between the petals
  if (R >= 14) disc(p, x, y, R * 0.78, tone(0.2), Math.min(6.2, R * 0.44), { ...line }); else p.tryStroke({ ...line, color: tone(0.2), width: R, points: [[x - R * 0.7, y], [x + R * 0.7, y]] });
  const turn0 = r() * 6.283;
  rings.forEach(([k, n, wk], ri) => {
    const rad = R * k, w = Math.max(4.8, R * wk), turn = turn0 + ri * 0.9 + r.range(-0.2, 0.2);
    for (let i = 0; i < n; i++) {
      const a0 = turn + i * 6.283 / n + r.range(-0.12, 0.12), span = spanFor(rad, w, 6.283 / n * (ri === 0 ? 1.06 : 1.14)), up = -Math.sin(a0 + span / 2);   // up: how much this petal is on the upper side
      p.tryStroke({ ...line, color: tone(0.5 + 0.1 * ri + 0.1 * up + r.range(-0.04, 0.06)), width: w, taper: [0.25, 0.45], points: around(rad, a0, span) });               // the petal
      if (R >= 20) p.tryStroke({ brush: 'round', color: tone(0.16 + 0.05 * ri), width: 4, opacity: 0.75, taper: [0.2, 0.5], points: around(rad - w * 0.46, a0 + span * 0.08, span * 0.9, 0.16) });   // the fold under its edge
      if (R >= 16 && (big || i % 2 === 0)) p.tryStroke({ brush: 'round', color: tone(0.9 + 0.1 * r()), width: big ? 4.6 : 4, opacity: 0.6 + 0.3 * Math.max(0, up), taper: [0.3, 0.6], points: around(rad + w * 0.34, a0 + span * 0.12, span * 0.7, 0.1) });   // the light on its rim
    }
  });
  // its heart: a small tight turn of petals, and the dark in the middle of it
  const hr = Math.max(6.6, R * 0.17), hw = Math.max(4.8, Math.min(R * 0.12, hr / 1.1));
  p.tryStroke({ ...line, color: tone(0.84), width: hw, points: around(hr, turn0, 4.4, 0.3, 9) });
  p.tryStroke({ brush: 'round', color: tone(0.12), width: 4, opacity: 0.8, points: [[x - 6.2, y + 1], [x + 6.2, y - 1]] });
  if (big) p.tryStroke({ brush: 'round', color: tone(1), width: 4, opacity: 0.9, points: around(hr * 1.5, turn0 + 3.4, 1.9, 0.1, 6) });
}

// A golden butterfly: two broad upper wings and, if it is big enough, two smaller lower ones. A wing is one stroke, thin where
// it joins the body and broad toward its tip. We see the creature at an angle, so the wings of one side are shorter.
// `open` is how far the wings are spread, `bright` how much white is in the gold.
function butterfly(p, x, y, len, heading, o = {}) {
  const r = p.rng, spread = o.open != null ? o.open : r.range(0.3, 1), op = o.opacity || 1;
  const tone = () => mix(gold(r.range(0.36, 0.7)), '#fff4c0', (o.bright || 0) * r());
  if (o.glow !== false) p.tryStroke({ brush: 'soft', color: '#ffb030', width: Math.max(12, len * 1.3), opacity: 0.2 * op, points: [[x - len * 1.4, y], [x + len * 1.4, y]] });
  const wing = (a, l, w) => {
    const s = a < 0 ? -1 : 1;
    p.tryStroke({ brush: 'bristle', color: tone(), width: Math.max(4.8, Math.min(w, l / 2.05)), opacity: 0.95 * op, taper: [0.7, 0.12], mix: 0.05, dry: 0, rag: 0.1, cap: 'round', points: [[x, y], [x + Math.cos(heading + a) * l * 0.55, y + Math.sin(heading + a) * l * 0.55], [x + Math.cos(heading + a + 0.14 * s) * l, y + Math.sin(heading + a + 0.14 * s) * l]] });
  };
  const short = r.range(0.5, 0.95), bigSide = r() < 0.5 ? 1 : -1;
  for (const side of [-1, 1]) {
    const k = side === bigSide ? 1 : short;
    wing(side * (0.5 + 0.7 * spread), len * k, len * 0.46 * k);                                   // the fore wing
    if (len >= 18) wing(side * (Math.PI - 0.7 - 0.4 * spread), len * 0.62 * k, len * 0.34 * k);   // the hind wing
  }
}
// A fleck of gold: a butterfly too far off to be more than that.
function fleck(p, x, y, o = 1) {
  const r = p.rng, a = r.range(0, 3.14), l = r.range(12.4, 14.5);
  p.tryStroke({ brush: 'round', color: gold(r.range(0.5, 0.95)), width: r.range(4, 4.8), opacity: o * r.range(0.5, 1), points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] });
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HZ, VX, F, EYE, VORTEX, ARBOR, AVENUE, BEDS, at, unit, groundAt, nA, nB, nC, nD, swirl, swirlAngle, armAt, skyColor, gold, spark, rose, butterfly, fleck, arc };
