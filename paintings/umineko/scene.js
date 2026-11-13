// Shared layout, palette and brush habits for the Umineko painting.
//
// The scene: the hall of the Ushiromiya mansion on Rokkenjima, on the night of the typhoon.
// Above the stairs hangs the portrait of the Golden Witch, Beatrice. Battler stands in the
// hall with his feet apart and his arm thrown out, pointing: he will not believe in witches.
// And out of the portrait golden butterflies are pouring, and on the stairs they are making
// her shape. Lightning stands in the tall window.
//
// Two lights work on everything: the gold of the witch, on the stairs to the right, and the
// cold flash of the lightning, from the window on the left.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, clamp } = studio;

const W = 1600, H = 1000;
const VP = { x: 800, y: 520 };            // we look straight down the hall: everything runs to this point
const WITCH = { x: 905, y: 545 };         // the middle of her light
const BOLT = { x: 408, y: 330 };          // the window the lightning is in
const FLOOR = 770;                        // where the floor meets the foot of the stairs
const BACK = 664;                         // where it meets the wall, either side of them
const LAND = 556;                         // the landing at their top
const BATTLER = { x: 566, y: 955 };       // between his feet

const nA = noise2(131), nB = noise2(149), nC = noise2(167);

const gold = (x, y, reach = 300) => Math.exp(-Math.pow(Math.hypot(x - WITCH.x, (y - WITCH.y) * 1.1) / reach, 2));
const cold = (x, y, reach = 300) => Math.exp(-Math.pow(Math.hypot(x - BOLT.x, y - BOLT.y) / reach, 2));
// The color of a dark thing at a place, with both lights on it.
const lit = (base, x, y, g = 0.6, c = 0.45) => mix(mix(base, '#d49a48', clamp(gold(x, y) * g, 0, 1)), '#8fa2d8', clamp(cold(x, y) * c, 0, 1));

// The stairs: eleven steps, the nearest first. We see each riser face on and each tread from just above.
const STEPS = [];
for (let k = 0, y = FLOOR; k < 11; k++) {
  const riser = 19.2 - 0.84 * k, tread = 6.7 - 0.46 * k;
  STEPS.push({ foot: y, nose: y - riser, back: y - riser - tread });
  y -= riser + tread;
}
const stairLeft = (y) => 480 + 80 * clamp((FLOOR - y) / (FLOOR - LAND), 0, 1);
const stairRight = (y) => 1120 - 80 * clamp((FLOOR - y) / (FLOOR - LAND), 0, 1);

// The floor is squared like a chessboard. Row k lies between rowY(k) and rowY(k + 1), and the
// sides of the squares run to the vanishing point.
const rowY = (k) => VP.y + 480 / (1 + 0.184 * k);
const colX = (j, y) => VP.x + j * 0.5 * (y - VP.y);

// A level bar of paint from x0 to x1, laid in lengths, each the color of its own place.
function bar(p, x0, x1, y, w, colorAt, o = {}) {
  const seg = Math.max(w * 2.3, o.seg || 80), n = Math.max(1, Math.floor((x1 - x0) / seg));
  for (let i = 0; i < n; i++) {
    const a = x0 + (x1 - x0) * i / n, b = x0 + (x1 - x0) * (i + 1) / n;
    p.tryStroke({ brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.12, cap: 'flat', streak: 0.25, jitter: 0.4, ...(o.stroke || {}), color: colorAt((a + b) / 2, y), width: Math.max(4.4, w), points: [[a - 1, y], [b + 1, y]] });
  }
}
// An upright post of paint from y0 down to y1.
function post(p, x, y0, y1, w, colorAt, o = {}) {
  const seg = Math.max(w * 2.3, o.seg || 80), n = Math.max(1, Math.floor((y1 - y0) / seg));
  for (let i = 0; i < n; i++) {
    const a = y0 + (y1 - y0) * i / n, b = y0 + (y1 - y0) * (i + 1) / n;
    p.tryStroke({ brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.12, cap: 'flat', streak: 0.25, jitter: 0.4, ...(o.stroke || {}), color: colorAt(x, (a + b) / 2), width: Math.max(4.4, w), points: [[x, a - 1], [x + (o.lean || 0) * (b - a), b + 1]] });
  }
}

// A golden butterfly: two broad upper wings and, if it is big enough, two smaller lower ones.
// A wing is a small fan of strokes, thin at the body and round at the tip. `open` is how far
// the wings are spread, `bright` how much white is in the gold.
function butterfly(p, x, y, len, heading, o = {}) {
  const r = p.rng, spread = o.open != null ? o.open : r.range(0.3, 1), op = o.opacity || 1;
  const tone = () => mix(mix('#d88a18', '#ffcf4a', r()), '#fff4c0', (o.bright || 0) * r());
  if (o.glow !== false) p.tryStroke({ brush: 'soft', color: '#ffb030', width: Math.max(12, len * 1.3), opacity: 0.2 * op, points: [[x - len * 1.4, y], [x + len * 1.4, y]] });
  const wing = (a, l, w) => {
    for (const da of [-0.2, 0.2]) p.tryStroke({ brush: 'bristle', color: tone(), width: Math.max(4.6, w), opacity: 0.95 * op, taper: [0.35, 0], mix: 0.05, dry: 0, rag: 0.1, cap: 'round', points: [[x, y], [x + Math.cos(heading + a + da) * l, y + Math.sin(heading + a + da) * l]] });
  };
  for (const side of [-1, 1]) {
    if (len >= 20) wing(side * (Math.PI - 0.55 - 0.5 * spread), len * 0.64, len * 0.3);
    wing(side * (0.45 + 0.75 * spread), len, len * 0.44);
  }
}
// A fleck of gold: a butterfly too far off or too small to be more than that.
function fleck(p, x, y, o = 1) {
  const r = p.rng, a = r.range(0, 3.14), l = r.range(12.4, 14.5);
  p.line(x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2, x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2, { color: mix('#e8a020', '#fff0a8', r()), width: r.range(4, 5), opacity: o * r.range(0.5, 1) });
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, VP, WITCH, BOLT, FLOOR, BACK, LAND, BATTLER, nA, nB, nC, gold, cold, lit, STEPS, stairLeft, stairRight, rowY, colX, bar, post, butterfly, fleck };
