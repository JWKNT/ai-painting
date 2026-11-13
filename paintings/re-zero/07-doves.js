// The doves. Something has put them up from the wall of the terrace, and they go up past the
// two of them into the sky, toward the sun. They are white. The sun is on their backs and on
// the wing that is toward us, and the far wing and the under side of each are in blue shade.
'use strict';
const { studio, open, wallTop } = require('./scene');
const { mix } = studio;

const p = open('doves');
const r = p.rng;
const feather = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.12, cap: 'round' };

// One dove in flight: where it is, how big, which way it goes (1: to the right), how it
// climbs, and where its wings are in the beat: 1 is up, -1 is down.
function dove(x, y, s, face, climb, beat) {
  const c = Math.cos(climb), sn = Math.sin(climb);
  const P = (ax, up) => [x + face * (c * ax - sn * up) * s, y - (sn * ax + c * up) * s];       // so far along its body, and so far up from its back
  const lit = () => mix('#ffffff', '#fff6e4', r() * 0.6), shade = () => mix('#8f9fd4', '#aab6e0', r());
  // A wing is one shape: long strokes that all leave the shoulder and come together again at
  // the tip. The front one is the edge of the wing; those behind it are the long feathers, each shorter than the last.
  const wing = (root, bend, tip, color) => {
    const w = (k) => Math.max(4.8, k * s);
    p.tryStroke({ ...feather, color: color(), width: w(11), taper: [0.1, 0.9], points: [P(root[0] - 11, root[1]), P(bend[0] * 0.7 + root[0] * 0.3 - 13, bend[1] * 0.72), P(bend[0] * 0.5 + tip[0] * 0.5 - 7, bend[1] * 0.5 + tip[1] * 0.5 - (tip[1] - bend[1]) * 0.12)] });
    p.tryStroke({ ...feather, color: color(), width: w(12), taper: [0.1, 0.9], points: [P(root[0] - 5, root[1]), P(bend[0] - 8, bend[1]), P(tip[0] * 0.86 + bend[0] * 0.14 - 3, tip[1] * 0.86 + bend[1] * 0.14)] });
    p.tryStroke({ ...feather, color: color(), width: w(8.5), taper: [0, 0.75], points: [P(...root), P(...bend), P(...tip)] });
  };
  const up = beat > 0, h = 0.7 + 0.3 * Math.abs(beat);
  if (up) wing([5, 2], [10, 19 * h], [8, 42 * h], shade); else wing([5, -1], [13, -14 * h], [11, -34 * h], shade);          // the far wing
  for (const dy of [3, -3.5]) p.tryStroke({ ...feather, color: mix('#ffffff', '#c4cce6', 0.3), width: Math.max(4.8, 6.5 * s), taper: [0, 0.3], points: [P(-8, 0), P(-17, dy * 0.5), P(-27, dy)] });   // its tail: it opens like a fan
  p.tryStroke({ ...feather, color: shade(), width: Math.max(4.8, 10 * s), points: [P(-11, -2.5), P(1, -3.5), P(13, -1)] });                   // the under side of its body
  p.tryStroke({ ...feather, color: lit(), width: Math.max(4.8, 9.5 * s), points: [P(-10, 1.5), P(2, 2), P(15, 3)] });                         // its back, and its head
  if (up) wing([2, 2], [-2, 21 * h], [-15, 46 * h], lit); else wing([2, -1], [3, -17 * h], [-8, -38 * h], lit);              // the near wing
}

// Those that are far off, small; then nearer and bigger. They go up to the right, most of them where the sky is clear.
const flock = [
  [330, 470, 1.0, 1, 0.5, 0.8], [448, 400, 1.05, 1, 0.6, -0.7], [250, 330, 1.2, 1, 0.5, 0.5],
  [960, 150, 1.25, 1, 0.5, 0.9], [1090, 90, 1.3, 1, 0.3, -0.8], [760, 70, 1.4, 1, 0.6, 0.6], [1250, 40, 1.2, 1, 0.3, 0.3],
  [560, 150, 1.6, 1, 0.55, -0.9], [388, 90, 1.7, 1, 0.45, 0.9], [1010, 300, 1.2, 1, 0.5, -0.5],
  [150, 150, 2.1, 1, 0.5, 0.7], [1420, 110, 1.9, 1, 0.3, -0.6], [1330, 470, 1.5, 1, 0.5, 0.9], [1500, 300, 1.7, 1, 0.35, 0.4],
];
for (const d of flock) dove(...d);

// Three that have not gone up yet: they sit on the top of the wall.
for (const [x, s, face] of [[176, 1.1, 1], [236, 1, -1], [1150, 0.8, 1]]) {
  const y = wallTop(x) - 12;
  p.tryStroke({ ...feather, color: '#b4bede', width: 12 * s, points: [[x - face * 14 * s, y - 2 * s], [x + face * 4 * s, y - 6 * s]] });
  p.tryStroke({ ...feather, color: '#ffffff', width: 9 * s, points: [[x - face * 12 * s, y - 6 * s], [x + face * 5 * s, y - 10 * s]] });
  p.tryStroke({ ...feather, color: '#ffffff', width: 7 * s, points: [[x + face * 6 * s, y - 10 * s], [x + face * 9 * s, y - 22 * s]] });   // its neck and its head
  p.tryStroke({ ...feather, color: '#d8ddf0', width: 6 * s, taper: [0, 0.5], points: [[x - face * 12 * s, y - 4 * s], [x - face * 26 * s, y + 1 * s]] });   // its tail
}

p.save();
