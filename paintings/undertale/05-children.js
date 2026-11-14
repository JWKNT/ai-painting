// The two children. We stand behind them. The human child is at the right: brown hair
// cut level at the neck, a blue jumper with two bands of rose-violet, blue trousers. It
// holds the umbrella in its left hand, out to the side, so that the monster child is
// under it too. The monster child is at the left, a little shorter: a round yellow head
// with a crest of points, a shirt in bands of yellow and brown, no arms, and a thick tail
// that lies on the rock behind it. The shining water is beyond them, so they are dark
// against it, with a thin line of its light down each side of them; the echo flowers
// behind us give their backs only enough light to show their colors.
'use strict';
const { studio, open, cam, KIDS, FRISK, KID, GLOW, GLOW_DEEP } = require('./scene');
const { mix, solid, shape, glint, glow, disc } = studio;

const p = open('children');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.06, cap: 'round' };
const U = cam.unit(KIDS);                                                  // units of the picture to the metre, where they stand
const at = (X0) => (X, Y) => cam.at(X0 + X, Y, KIDS);
const F = at(FRISK.X), K = at(KID.X);
const LOW = [-0.5, 0.86];                                                  // toward the echo flowers behind us, low at the left
const o = { light: LOW, turn: 0.1, width: 5, length: 15, vary: 0.05, mix: 0.06, edge: false };
const chain = (P, pts) => pts.map(([X, Y, R]) => [...P(X, Y), R * U]);
const mark = (P, pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([X, Y]) => P(X, Y)) });
// A line of the water's light down one side of a form: thin, broken, brighter low down.
const rim = (P, pts, op = 0.75) => glint(p, pts.map(([X, Y]) => P(X, Y)), () => mix(GLOW, '#dcfff6', r() * 0.6), { width: 4, dash: 18, gap: 10, opacity: op, rng: r });

// ---------------------------------------------------------------- their shade on the wet rock, and themselves again in it, faintly
for (const [P, w] of [[F, 0.36], [K, 0.4]]) {
  p.stroke({ brush: 'soft', color: '#03040c', width: 22, opacity: 0.5, points: [P(-w, -0.02), P(0, -0.05), P(w, -0.02)] });
  for (let k = 0; k < 5; k++) { const X = r.range(-w * 0.7, w * 0.7); p.tryStroke({ brush: 'soft', color: '#04050f', width: 12, opacity: 0.3, taper: [0.1, 0.8], points: [P(X, -0.06), P(X + r.range(-0.02, 0.02), -0.3 - r.range(0, 0.4))] }); }
}

// ---------------------------------------------------------------- the monster child
{
  const skin = { shadow: '#2c2410', half: '#6c5822', lit: '#a88e3c', bounce: '#3c5c50' }, shirt = { shadow: '#30220e', half: '#7c5e22', lit: '#b4944a', bounce: '#3c5c50' };
  for (const sx of [-1, 1]) { solid(p, chain(K, [[sx * 0.09, 0.25, 0.058], [sx * 0.095, 0.08, 0.052]]), skin, o); mark(K, [[sx * 0.1 - 0.075, 0.03], [sx * 0.1 + 0.075, 0.03]], '#4c3e18', 8.6); }   // its short legs and its feet
  solid(p, chain(K, [[0, 0.31, 0.215], [0, 0.5, 0.2], [0, 0.66, 0.165]]), shirt, { ...o, width: 5.5, length: 18, flow: () => 0 });   // its shirt: wide at the hem
  for (const [Y, w] of [[0.3, 0.2], [0.43, 0.2], [0.56, 0.185], [0.68, 0.15]]) { mark(K, [[-w, Y], [0, Y - 0.012], [w, Y]], '#2a1608', 8.4, { opacity: 0.92 }); mark(K, [[-w * 0.9, Y - 0.005], [-w * 0.3, Y - 0.014]], '#5c3c1a', 4.4, { opacity: 0.6 }); }   // the brown bands of it, a little lighter at the lower left
  // its head: one clean round, bigger than its body is wide; darker at the upper right, where no light reaches, and a little lighter low at the left
  { const [hx, hy] = K(0, 0.9), R = 0.215 * U;
    disc(p, hx, hy, R, '#7a6426', 6.4, { ...line, mix: 0 });
    p.tryStroke({ brush: 'soft', color: '#2c230d', width: 14, opacity: 0.4, points: studio.arc(hx, hy, R * 0.72, -1.9, 0.5, 8) });
    p.tryStroke({ brush: 'soft', color: '#b89c44', width: 13, opacity: 0.34, points: studio.arc(hx, hy, R * 0.6, 1.5, 3.3, 8) });
    mark(K, [[-0.16, 0.71], [0, 0.69], [0.16, 0.71]], '#2c2410', 6, { opacity: 0.7 }); }                                                // the shade under it, where the neck is
  for (const [by0, h, w] of [[1.03, 0.17, 10], [0.9, 0.17, 10.5], [0.77, 0.165, 10]]) { mark(K, [[0, by0 - 0.02], [0.004, by0 + h * 0.5], [0, by0 + h]], mix('#3a2e12', '#54441a', r()), w, { taper: [0, 0.9] }); mark(K, [[-0.03, by0 + 0.005], [-0.012, by0 + h * 0.75]], '#a48c3c', 4, { opacity: 0.5, taper: [0.1, 0.6] }); }   // the points down the back of its head: we see them one over the other
  // its tail: from the small of its back down to the rock, and out to the left, with its point turned up
  mark(K, [[-0.02, 0.3], [-0.2, 0.12], [-0.42, 0.055], [-0.6, 0.1], [-0.68, 0.2]], '#5c4a1e', 15, { taper: [0, 0.85] });
  mark(K, [[-0.06, 0.28], [-0.22, 0.14], [-0.42, 0.08], [-0.58, 0.12]], '#8c7430', 6, { taper: [0.1, 0.8], opacity: 0.8 });
  rim(K, [[-0.3, 0.03], [-0.48, 0.008], [-0.62, 0.05]], 0.4);                                                                      // the light of the water under its tail
}

// ---------------------------------------------------------------- the human child
{
  const blue = { shadow: '#0e1436', half: '#22327c', lit: '#3c62a8', bounce: '#1c4c58' }, trousers = { shadow: '#0a0e26', half: '#182252', lit: '#2c447c', bounce: '#1c4c58' }, hair = { shadow: '#120b09', half: '#2e1c14', lit: '#553824', bounce: '#24443c' };
  for (const sx of [-1, 1]) { solid(p, chain(F, [[sx * 0.085, 0.44, 0.07], [sx * 0.09, 0.1, 0.06]]), trousers, o); mark(F, [[sx * 0.1 - 0.075, 0.035], [sx * 0.1 + 0.075, 0.035]], '#24160f', 8.8); }   // its legs and its shoes
  solid(p, chain(F, [[0, 0.5, 0.2], [0, 0.7, 0.195], [0, 0.83, 0.18]]), blue, { ...o, width: 5.5, length: 18, flow: () => 0 });       // its jumper
  solid(p, chain(F, [[0.215, 0.8, 0.058], [0.245, 0.62, 0.054], [0.25, 0.47, 0.05]]), blue, o);                                       // its right arm, at its side
  mark(F, [[0.25, 0.42], [0.25, 0.42 - 13 / U]], '#6c5038', 9);                                                                    // and that hand
  solid(p, chain(F, [[-0.2, 0.82, 0.058], [-0.31, 0.72, 0.054], [-0.305, 0.9, 0.05]]), blue, o);                                      // its left arm: out, and then up to the stick of the umbrella
  // the two bands of rose-violet round the jumper and round each sleeve
  for (const Y of [0.56, 0.71]) { mark(F, [[-0.195, Y], [0, Y - 0.012], [0.195, Y]], '#6c2a62', 9.4, { opacity: 0.94 }); mark(F, [[-0.18, Y - 0.004], [-0.05, Y - 0.014]], '#a04c8c', 4.6, { opacity: 0.7 }); mark(F, [[0.2, Y + 0.01], [0.3, Y + 0.004]], '#6c2a62', 7, { opacity: 0.94 }); }
  mark(F, [[-0.36, 0.76], [-0.26, 0.7]], '#6c2a62', 6.6, { opacity: 0.94 });
  // its hair: one round mass, cut level at the neck, a little wider low down
  solid(p, chain(F, [[-0.075, 0.955, 0.15], [0.075, 0.955, 0.15]]), hair, { ...o, flow: () => Math.PI / 2 });
  solid(p, chain(F, [[-0.012, 1.07, 0.186], [0.012, 1.07, 0.186]]), hair, { ...o, width: 5.5, length: 18, flow: (x, y) => Math.PI / 2 + (x - F(0, 0)[0]) / (0.19 * U) * 0.5 });
  for (const X of [-0.12, -0.04, 0.05, 0.13]) mark(F, [[X, 1.14 - Math.abs(X) * 0.3], [X * 1.1, 1.0], [X * 1.16, 0.86]], '#0c0706', 4, { opacity: 0.5, taper: [0.2, 0.2] });   // the fall of it
  mark(F, [[-0.2, 0.84], [0, 0.825], [0.2, 0.84]], '#0e0907', 5, { opacity: 0.8 });                                                  // its level lower edge
  mark(F, [[-0.14, 1.0], [-0.1, 0.9]], '#6c5038', 4.4, { opacity: 0.5 });                                                           // a little of the echo flowers' light in it
}

// ---------------------------------------------------------------- the umbrella
{
  const HUB = [FRISK.X - 0.4, 1.7], RIM_Y = 1.45, RAD = 0.66, [tx, ty] = cam.at(HUB[0], HUB[1], KIDS), [cx, cy] = cam.at(HUB[0], RIM_Y, KIDS), rx = RAD * U, ry = rx * Math.sin(Math.atan((cam.eye - RIM_Y) / KIDS));
  const rimAt = (a) => [cx + Math.cos(a) * rx, cy + Math.sin(a) * ry];      // a place on its rim: a = 0 at the right, a quarter turn is the part nearest to us
  // the stick, from the hand up into the cloth, and its crook under the hand
  { const hand = F(-0.305, 0.94); p.tryStroke({ brush: 'round', color: '#0c0a10', width: 4.6, points: [[hand[0] + 2, hand[1] + 26], [hand[0], hand[1]], [cx + 2, cy + ry + 2]] }); p.tryStroke({ brush: 'round', color: '#3c8c8c', width: 4, opacity: 0.5, points: [[hand[0] + 3, hand[1] - 2], [cx + 4, cy + ry + 4]] });
    p.tryStroke({ brush: 'round', color: '#0c0a10', width: 4.6, taper: [0, 0.3], points: [[hand[0] + 2, hand[1] + 24], [hand[0] + 7, hand[1] + 36], [hand[0] + 15, hand[1] + 30]] }); mark(F, [[-0.33, 0.95], [-0.28, 0.93]], '#6c5038', 8.6); }
  // the cloth: the part of the round of it that is toward us, from its point down to its rim. It is rose, dark at the far
  // left and right where it turns away, lighter toward us and low down, where the echo flowers reach it.
  const outline = []; for (let i = 0; i <= 20; i++) { const a = Math.PI - Math.PI * i / 20; outline.push([cx + Math.cos(a) * rx, cy - Math.sin(a) * (cy - ty + 3)]); } for (let i = 1; i < 20; i++) outline.push(rimAt(Math.PI * i / 20));
  shape(p, outline, { shadow: '#3a1424', half: '#7c2e46', lit: '#b4506a', bounce: '#2c4c58' }, { light: [-0.3, 0.95], turn: 0.25, width: 5.5, length: 20, round: 20, vary: 0.05, mix: 0.06, flow: (x, y) => Math.atan2(y - ty, x - tx), edge: false });
  // its ribs: from the point to the rim, each a dark line with wet light beside it; and the rim between them, which hangs in shallow curves
  for (const a of [0.02, 0.62, 1.2, 1.94, 2.52, 3.12]) { const [ex, ey] = rimAt(a), mx = (tx + ex) / 2 + (ex - tx) * 0.08, my = (ty + ey) / 2 - (cy - ty) * 0.22; p.tryStroke({ brush: 'round', color: '#2a0e1a', width: 4, opacity: 0.7, points: [[tx, ty + 2], [mx, my], [ex, ey]] }); p.tryStroke({ brush: 'round', color: '#e89aa8', width: 4, opacity: 0.4, taper: [0.5, 0.2], points: [[mx - 3, my + 1], [ex - 3, ey - 2]] }); }
  { const run = []; for (let i = 0; i <= 30; i++) { const a = Math.PI * i / 30; const [x, y] = rimAt(a); run.push([x, y + 2.5 * Math.abs(Math.sin(a * 5.2))]); } glint(p, run, () => mix(GLOW_DEEP, GLOW, 0.4 + 0.6 * r()), { width: 4, dash: 22, gap: 20, opacity: 0.45, rng: r }); }
  p.tryStroke({ brush: 'round', color: '#1c0a12', width: 5, points: [[tx, ty + 3], [tx, ty - 10]] });                                   // the small point on its top
  // drops fall from its rim
  for (const a of [0.12, 1.36, 2.92]) { const [x, y] = rimAt(a + r.range(-0.1, 0.1)); p.tryStroke({ brush: 'round', color: '#a8d4e4', width: 4, opacity: r.range(0.3, 0.5), taper: [0.2, 0.7], points: [[x, y + 5], [x, y + 5 + r.range(14, 26)]] }); }
  glow(p, cx, cy + 10, 120, GLOW_DEEP, 0.05, 5, 0.5);
}

p.save();
