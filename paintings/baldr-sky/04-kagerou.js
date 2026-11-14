// Kagerou. We see it from behind as it dives: its feet are near us and its head is far, so it
// is smaller toward its head. It is a machine: flat plates of white armour over a dark frame,
// a blue head, blue bands on its shoulders and its legs. Its two thrusters, on its back, burn
// blue-white, and so do the smaller ones at its heels. Its right hand holds a blade of light
// out before it, toward the bright place, and its left hand holds a gun.
// The bright place lights the edges of it that are turned that way; the fire of its own
// thrusters lights its back.
'use strict';
const { studio, open, VP, K, kScale } = require('./scene');
const { mix, shape, glow, disc } = studio;

const p = open('kagerou');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.06, cap: 'flat' };
const along = Math.atan2(K(1, 0)[1] - K(0, 0)[1], K(1, 0)[0] - K(0, 0)[0]);
const poly = (pts) => pts.map(([u, v]) => K(u, v));
const white = { shadow: '#4c5a82', half: '#a4b2d4', lit: '#f2f6ff', rim: '#ffffff', bounce: '#5c88c4' };
const blue = { shadow: '#0c2058', half: '#1c4cb4', lit: '#58a0f4', rim: '#d0eaff', bounce: '#18408c' };
const frame = { shadow: '#06080e', half: '#1a2130', lit: '#46566e', rim: '#a8d0f4', bounce: '#101c2c' };
const plate = (pts, tones, o = {}) => shape(p, poly(pts), tones, { light: [-0.5, -0.86], turn: -0.15, width: 5.5, length: 24, vary: 0.05, round: 14, flow: () => along + (o.across ? Math.PI / 2 : 0), dash: 40, gap: 6, edgeOpacity: 0.9, ...o });
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });
// The fire of a thruster: it starts at a place on the machine and streams back from there, toward its feet and toward us.
function fire(u, v, len, wide) {
  const [x, y] = K(u, v), [x2, y2] = K(u - len, v * 1.14), [xm, ym] = K(u - len * 0.5, v * 1.07);
  glow(p, x, y, wide * 2.6, '#3c9cff', 0.1, 5);
  for (const [w, c, k] of [[wide * 1.5, '#2c6cf0', 1], [wide, '#64c0ff', 0.8], [wide * 0.56, '#d4f4ff', 0.6], [Math.max(5, wide * 0.3), '#ffffff', 0.4]]) p.tryStroke({ ...line, cap: 'round', color: c, width: w, opacity: 0.9, mix: 0.15, rag: 0.2, taper: [0.05, 0.92], points: [[x, y], [x + (xm - x) * k, y + (ym - y) * k], [x + (x2 - x) * k, y + (y2 - y) * k]] });
}

// ---------------------------------------------------------------- what is furthest from us: the arms, the blade, the gun, the head
// the gun in its left hand: a long dark barrel, with a pale edge
plate([[1.0, -172], [1.36, -164], [1.36, -142], [1.0, -140]], frame, { round: 9 });
plate([[0.96, -186], [1.08, -184], [1.08, -134], [0.96, -132]], frame, { round: 10 });
mark([[1.02, -168], [1.34, -161]], '#7cb4e8', 4, { opacity: 0.8 });
// its arms: the upper arm goes out from the shoulder, the forearm goes forward from the elbow
for (const s of [-1, 1]) {
  plate([[0.78, s * 112], [0.9, s * 140], [0.96, s * 160], [0.9, s * 182], [0.76, s * 146]], frame, { round: 12 });
  plate([[0.9, s * 136], [1.08, s * 138], [1.08, s * 180], [0.9, s * 184]], white, { round: 15 });
  mark([[0.95, s * 142], [0.95, s * 178]], '#1c4cb4', 8, { cap: 'flat' });                                            // a blue band round the forearm
  plate([[1.07, s * 142], [1.15, s * 146], [1.15, s * 172], [1.07, s * 176]], frame, { round: 9 });                    // the hand
}
// the blade of light in its right hand: a long light that grows thin, with blue round it
{ const a = K(1.12, 160), b = K(1.34, 140), c = K(1.58, 108);
  for (const [w, col, op] of [[40, '#2c7cff', 0.14], [22, '#58b8ff', 0.3]]) p.stroke({ brush: 'soft', color: col, width: w, opacity: op, points: [a, b, c] });
  p.stroke({ ...line, cap: 'round', color: '#8cd8ff', width: 13, taper: [0, 0.85], points: [a, b, c] });
  p.stroke({ ...line, cap: 'round', color: '#f4fdff', width: 6.5, taper: [0, 0.8], points: [a, b, c] }); }
// its head: a blue helmet; a white ridge along the top of it; two thin yellow feelers
plate([[0.84, -24], [0.9, -27], [0.955, -17], [0.965, 0], [0.955, 17], [0.9, 27], [0.84, 24]], blue, { round: 13 });
mark([[0.855, 0], [0.91, 0], [0.985, 0]], '#e8f0ff', 6, { taper: [0, 0.6] });
for (const s of [-1, 1]) mark([[0.9, s * 16], [0.96, s * 30], [1.03, s * 40]], '#e8c83c', 4.2, { taper: [0, 0.5] });
mark([[0.845, -18], [0.845, 18]], '#04060a', 5);                                                                    // the dark of its neck

// ---------------------------------------------------------------- its shoulders and its back
for (const s of [-1, 1]) {
  plate([[0.64, s * 58], [0.86, s * 62], [0.89, s * 112], [0.82, s * 152], [0.66, s * 146]], white, { round: 24 });   // the great plate of the shoulder
  plate([[0.69, s * 100], [0.85, s * 108], [0.83, s * 134], [0.7, s * 128]], blue, { round: 11 });                    // the blue band on it
  mark([[0.655, s * 62], [0.67, s * 142]], '#0c1220', 5, { opacity: 0.8 });                                           // the shade at its back edge
}
plate([[0.52, -52], [0.8, -64], [0.83, -30], [0.83, 30], [0.8, 64], [0.52, 52]], white, { round: 22 });              // the back
plate([[0.56, -12], [0.8, -14], [0.8, 14], [0.56, 12]], frame, { round: 8 });                                        // the spine: a dark bar
for (const s of [-1, 1]) {
  plate([[0.5, s * 18], [0.7, s * 20], [0.7, s * 50], [0.5, s * 46]], blue, { round: 12 });                          // a thruster: a blue block on the back
  for (const u of [0.6, 0.65]) mark([[u, s * 24], [u, s * 46]], '#071434', 4.6, { opacity: 0.8 });                    // its vents
  plate([[0.48, s * 20], [0.53, s * 20], [0.53, s * 46], [0.48, s * 46]], frame, { round: 6, across: true });         // and the mouth of it
}
mark([[0.74, -40], [0.78, -40]], '#b8f048', 5, { cap: 'round' }); mark([[0.74, 40], [0.78, 40]], '#b8f048', 5, { cap: 'round' });   // two small green lights

// ---------------------------------------------------------------- its hips and its legs
plate([[0.44, -44], [0.54, -50], [0.54, 50], [0.44, 44]], frame, { round: 12 });
for (const s of [-1, 1]) plate([[0.4, s * 48], [0.54, s * 52], [0.54, s * 80], [0.42, s * 78]], white, { round: 11 });   // the plates at the sides of the hips
for (const [s, du] of [[-1, -0.04], [1, 0]]) {
  const v0 = s * 56;
  plate([[0.46 + du, v0 - 22], [0.46 + du, v0 + 22], [0.3 + du, v0 + 26], [0.3 + du, v0 - 26]], white, { round: 14 });   // the thigh
  plate([[0.33 + du, v0 - 30], [0.33 + du, v0 + 30], [0.26 + du, v0 + 30], [0.26 + du, v0 - 30]], blue, { round: 10, across: true });   // the knee
  plate([[0.28 + du, v0 - 28], [0.28 + du, v0 + 28], [0.08 + du, v0 + 25], [0.08 + du, v0 - 25]], white, { round: 15 });   // the shin
  mark([[0.26 + du, v0], [0.1 + du, v0]], '#163c98', 9, { cap: 'flat' });                                              // the blue band down the back of it
  mark([[0.26 + du, v0 - 15], [0.1 + du, v0 - 14]], '#0c1220', 4, { opacity: 0.5 });
  plate([[0.09 + du, v0 - 27], [0.09 + du, v0 + 27], [0.0 + du, v0 + 31], [0.0 + du, v0 - 31]], frame, { round: 12 });   // the foot: we see the under side of it
  mark([[0.03 + du, v0 - 22], [0.03 + du, v0 + 22]], '#3a465c', 6);
}

// ---------------------------------------------------------------- the fire of its thrusters
for (const s of [-1, 1]) fire(0.5, s * 30, 0.27, 19);
for (const [s, du] of [[-1, -0.04], [1, 0]]) fire(0.0 + du, s * 56, 0.15, 15);
// and the light of that fire on the plates near it
for (const [u, v, w] of [[0.42, 0, 60], [0.06, -56, 40], [0.06, 56, 40]]) glow(p, ...K(u, v), w, '#58b0ff', 0.07, 4);

p.save();
