// The horde. The small klaxosaurs come on across the plain, from the foot of the great one
// toward the Plantation, in the shade. They are black, and the ground under them is dark,
// so we see their lights more than we see them: small blue lights without number, close
// together far off, each one alone near us, and a blue light from them all on the ground
// and in the dust. Here and there a greater one goes among them: it carries one long
// curved horn, like a blade, high over the dust.
'use strict';
const { studio, open, W, HORIZON, cam, nA, FOOT, front } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('horde');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.2, cap: 'round' };

// Where the horde is. Its front is far off at the left, at the foot of the Plantation, and nearer to us at the right; the
// nearest of them are half a kilometre from us. It comes on in streams, with thin places between.
const LAST = 706;                                                                // the row of the picture where the nearest are
const unit = (y) => (y - HORIZON) / cam.eye;                                     // the picture's units to the metre at a row
const thick = (x, y) => { const [X, Z] = cam.groundAt(x, y); return smooth(front(y) - 30, front(y) + 130, x) * (0.25 + 0.75 * smooth(0.3, 0.64, nA(X / 420 + 4, Z / 700 + 9))) * smooth(LAST + 6, LAST - 40, y); };

// ---------------------------------------------------------------- the blue of them on the ground and in the low dust
for (let k = 0; k < 90; k++) {
  const y = 590 + Math.pow(r(), 1.3) * (LAST - 590), x = r.range(front(y), W + 60);
  if (thick(x, y) < 0.3) continue;
  const w = clamp(unit(y) * 26, 14, 64), len = r.range(140, 340);
  p.stroke({ brush: 'soft', color: mix('#1c4ca8', '#3a80d8', r()), width: w, opacity: r.range(0.035, 0.075), points: [[x - len / 2, y - w * 0.2], [x, y - w * 0.3], [x + len / 2, y - w * 0.2]] });
}
for (let k = 0; k < 14; k++) { const x = r.range(860, W + 60), y = r.range(FOOT + 6, FOOT + 30), len = r.range(160, 420); p.stroke({ brush: 'soft', color: mix('#2458b8', '#4c8cd8', r()), width: r.range(18, 30), opacity: r.range(0.04, 0.08), points: [[x - len / 2, y], [x, y - 4], [x + len / 2, y]] }); }   // and at the foot of the dust

// ---------------------------------------------------------------- the dark of them on the plain: so many that the ground does not show between them
for (let k = 0; k < 130; k++) {
  const y = 594 + Math.pow(r(), 1.2) * (LAST - 600), x = r.range(front(y) + 20, W + 60);
  if (thick(x, y) < 0.35) continue;
  const w = clamp(unit(y) * 10, 9, 34), len = r.range(60, 200);
  p.stroke({ brush: 'soft', color: '#0b0914', width: w, opacity: r.range(0.1, 0.24), points: [[x - len / 2, y], [x, y - 2], [x + len / 2, y]] });
}

// ---------------------------------------------------------------- one of the small ones
// A light of a klaxosaur: a short level touch of blue. Most are dim; a few are bright.
function light(x, y, big) {
  const b = Math.pow(r(), 2.2), l = big ? r.range(12.4, 17) : r.range(12.2, 13.6);
  if (b > 0.5) p.tryStroke({ brush: 'soft', color: '#2f86e8', width: 9, opacity: 0.1 + 0.16 * b, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: mix('#3a80c8', '#bcefff', b), width: big ? 4.6 : 4, opacity: 0.4 + 0.58 * b, taper: [0.5, 0.5], points: [[x - l / 2, y + r.range(-0.6, 0.6)], [x + l / 2, y + r.range(-0.6, 0.6)]] });
}
function one(x, y) {
  const u = unit(y), L = u * r.range(10, 15);                                   // its length in the picture
  if (L < 11) { if (r() < 0.75) light(x, y, false); return; }                   // far off: only its light
  const h = L * r.range(0.5, 0.68), dark = mix('#07060d', '#110f1a', r());
  for (let k = 0; k < 2; k++) { const w = Math.max(9, L * r.range(0.5, 0.9)), dx = x + L * (0.7 + 0.6 * k), dy = y - h * (0.3 + 0.2 * k); p.tryStroke({ brush: 'soft', color: mix('#463c62', '#665474', r()), width: w, opacity: 0.15 - 0.05 * k, points: [[dx - w * 1.1, dy + 3], [dx, dy - 3], [dx + w * 1.1, dy]] }); }   // its dust, behind it
  // its body: a dark heap of no fixed shape. It is high in front, where its head is down, and low behind.
  p.tryStroke({ ...line, rag: 0.4, color: dark, width: Math.max(4.8, h * 0.62), opacity: 0.95, taper: [0.1, 0.7], points: [[x - L * 0.4, y - h * 0.3], [x - L * 0.06, y - h * 0.36], [x + L * 0.56, y - h * 0.12]] });
  p.tryStroke({ ...line, rag: 0.4, color: dark, width: Math.max(4.8, h * 0.56), opacity: 0.95, taper: [0.3, 0.5], points: [[x - L * 0.5, y - h * 0.34], [x - L * 0.3, y - h * 0.7], [x + L * 0.08, y - h * 0.62]] });
  if (h > 14) p.tryStroke({ ...line, rag: 0.4, color: dark, width: Math.max(4.8, h * 0.3), opacity: 0.95, taper: [0, 0.8], points: [[x - L * 0.3, y - h * 0.8], [x - L * 0.44, y - h * 1.04], [x - L * 0.64, y - h * 1.14]] });   // a short horn
  if (h > 11) p.tryStroke({ brush: 'round', color: '#2e3660', width: 4, opacity: 0.4, taper: [0.4, 0.4], points: [[x - L * 0.3, y - h * 0.96], [x, y - h * 0.86], [x + L * 0.3, y - h * 0.5]] });   // the sky on its back
  const b = Math.pow(r(), 1.6), lx = x - L * r.range(0.16, 0.34), ly = y - h * r.range(0.34, 0.56), l = Math.max(12.2, L * 0.3);
  p.tryStroke({ brush: 'soft', color: '#2f86e8', width: 9, opacity: 0.1 + 0.12 * b, points: [[lx - 9.6, ly], [lx + 9.6, ly]] });
  p.tryStroke({ brush: 'round', color: mix('#3a84cc', '#a8e4fc', b), width: 4, opacity: 0.5 + 0.4 * b, taper: [0.45, 0.45], points: [[lx - l / 2, ly + r.range(-1, 1)], [lx + l / 2, ly + r.range(-1, 1)]] });
}
// ---------------------------------------------------------------- one of the greater ones
// (x, y) is the ground under it, H the height of its horn in the picture, and `lean` how far the horn comes forward. `air`
// is how much of the dusty air is in front of it. The horn is like a fin: wide where it leaves the back, and it comes
// forward to a point.
function great(x, y, H, lean, air) {
  const hazy = (c) => mix(c, '#5c4a6c', air), dark = hazy('#0b0914'), tones = { shadow: hazy('#07060d'), half: dark, lit: hazy('#1a1830'), rim: hazy('#48507c'), bounce: hazy('#101c34') };
  // its body: a dark slab in the dust, longer than it is high, higher in front
  p.tryStroke({ ...line, cap: 'flat', color: dark, width: Math.max(6, H * 0.3), points: [[x - H * 0.66, y - H * 0.17], [x, y - H * 0.2], [x + H * 0.56, y - H * 0.13]] });
  p.tryStroke({ ...line, color: dark, width: Math.max(5, H * 0.22), taper: [0.1, 0.5], points: [[x - H * 0.56, y - H * 0.34], [x - H * 0.16, y - H * 0.4], [x + H * 0.3, y - H * 0.3]] });
  // its horn: two or three long strokes that come to a point
  const B0 = [x + H * 0.12, y - H * 0.3], B1 = [x + H * 0.34, y - H * 0.96], B2 = [x - H * (0.36 + lean), y - H * 1.06], at = (t) => [(1 - t) * (1 - t) * B0[0] + 2 * t * (1 - t) * B1[0] + t * t * B2[0], (1 - t) * (1 - t) * B0[1] + 2 * t * (1 - t) * B1[1] + t * t * B2[1]];
  const run = (t0, t1) => { const out = []; for (let i = 0; i <= 8; i++) out.push(at(t0 + (t1 - t0) * i / 8)); return out; };
  p.tryStroke({ ...line, rag: 0.06, color: dark, width: Math.max(6, H * 0.34), taper: [0, 0.85], points: run(0, 0.62).map(([px, py]) => [px - H * 0.08, py]) });
  p.tryStroke({ ...line, rag: 0.06, color: dark, width: Math.max(5.5, H * 0.22), taper: [0, 0.96], points: run(0, 1) });
  p.tryStroke({ brush: 'round', color: hazy('#3c4470'), width: 4, opacity: 0.5, taper: [0.2, 0.7], points: run(0.25, 0.9).map(([px, py]) => [px + H * 0.06, py - H * 0.04]) });   // the sky along its back
  // its lights: a few along its side, low down
  for (let k = 0; k < (H > 60 ? 3 : 2); k++) light(x - H * 0.5 + k * H * 0.3 + r.range(-3, 3), y - H * r.range(0.2, 0.32), H > 70);
}

// ---------------------------------------------------------------- all of them, the far ones first
const list = [];
for (let y = 580; y < LAST;) {
  const u = unit(y), dy = Math.max(3.2, u * u * 30 / (cam.f / cam.eye) * 1), step = Math.max(15, u * 30);
  for (let x = front(y) - 20 + r.range(0, step); x < W + 40; x += step * r.range(0.6, 1.5)) { const yy = y + r.range(-0.4, 0.4) * dy + (y < 600 ? r.range(-3, 3) : 0); if (r() < thick(x, yy) * (y < 600 ? 0.7 : 1)) list.push([x, yy, 0]); }
  y += dy;
}
for (const [x, y, H, bend, air] of [[1010, 616, 50, 0.1, 0.3], [1290, 636, 78, 0.0, 0.16], [1500, 626, 64, 0.2, 0.22], [1140, 668, 100, 0.12, 0.06], [1560, 690, 124, 0.2, 0.02]]) list.push([x, y, H, bend, air]);
list.sort((a, b) => a[1] - b[1]);
for (const [x, y, H, bend, air] of list) if (H) great(x, y, H, bend, air); else one(x, y);

// ---------------------------------------------------------------- the dust that they raise: low, thin, and blue from below
for (let k = 0; k < 120; k++) {
  const y = 596 + Math.pow(r(), 1.2) * (LAST - 596), x = r.range(front(y) + 30, W + 60), u = unit(y);
  if (thick(x, y) < 0.2) continue;
  const w = clamp(u * r.range(14, 30), 12, 60), len = w * r.range(2.4, 5);
  p.stroke({ brush: 'soft', color: mix(mix('#4a4270', '#7c6484', r()), '#3a6cb8', r() * 0.3), width: w, opacity: r.range(0.05, 0.12), points: [[x - len / 2, y - u * 6], [x, y - u * 10 - w * 0.2], [x + len / 2, y - u * 7]] });
}

p.save();
