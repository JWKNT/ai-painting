// The arbor. It stands on three round steps: six columns of white stone in a ring, a low
// rail between them except at the front, a round band of stone on their heads, and on that a
// roof that is a cage of dark ironwork, open to the sky, with leaves of iron on it and a
// point at its top. Inside, a small table is laid for tea, and no one sits at it. At each
// side of the steps a stone urn holds golden roses.
// The gold of the beds is the light: it comes from low down, most of it from the left. So
// each column is warm at its left, violet in its middle and a little warm again at its right.
'use strict';
const { studio, open, ARBOR, at, unit, rose, spark, skyColor } = require('./scene');
const { mix, clamp, smooth, shape, solid, disc } = studio;

const p = open('arbor');
const r = p.rng;
const A = ARBOR, TAU = Math.PI * 2, S = unit(A.Z), CX = at(A.X, 0, A.Z)[0];
const line = { brush: 'bristle', mix: 0.08, dry: 0, rag: 0.08, cap: 'round' };
const thin = (w) => (w < 4.8 ? { brush: 'round' } : {});
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: pts });
// A place on a ring round the middle of the arbor: so far out, so high, at the angle phi (0 is to the right; a quarter turn is away from us).
const ring = (rho, Y, phi) => at(A.X + rho * Math.cos(phi), Y, A.Z + rho * Math.sin(phi));
const arcOf = (rho, Y, p0, p1, n = 14) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(ring(rho, Y, p0 + (p1 - p0) * i / n)); return pts; };
const inPoly = (poly) => (x, y) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
// How much of the gold of the beds falls on a face that looks out at the angle phi. The beds at the left are nearer, so the left is the bright side.
const warmAt = (phi) => clamp(0.1 + 0.8 * Math.max(0, -Math.cos(phi)) + 0.34 * Math.max(0, Math.cos(phi)) + 0.26 * Math.max(0, -Math.sin(phi)), 0, 1);
const stone = (w) => mix(mix('#463e64', '#8e85a8', clamp(w * 1.6, 0, 1)), '#ffe9b0', smooth(0.34, 1, w));   // from violet shade to warm light
// A band of the ring between two heights, from the angle p0 to p1 (all on the near half, or all on the far half): filled with strokes that go along it.
function band(rho, Y0, Y1, p0, p1, colorAt, o = {}) {
  const rhoTop = o.rhoTop || rho, lo = arcOf(rho, Y0, p0, p1, 28), hi = arcOf(rhoTop, Y1, p0, p1, 28), poly = [...hi, ...lo.slice().reverse()];
  const xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]), far = Math.sin((p0 + p1) / 2) > 0;
  const phiOf = (x) => { const c = Math.acos(clamp((x - CX) / (rho * S), -1, 1)); return far ? c : TAU - c; };
  const slope = (x) => { const phi = phiOf(x), a = ring(rho, (Y0 + Y1) / 2, phi - 0.03), b = ring(rho, (Y0 + Y1) / 2, phi + 0.03); return Math.atan2(b[1] - a[1], b[0] - a[0]); };
  const tOf = (x, y) => { const phi = phiOf(x), a = ring(rho, Y0, phi)[1], b = ring(rhoTop, Y1, phi)[1]; return clamp((y - a) / (b - a || 1), 0, 1); };
  p.fill({ inside: inPoly(poly), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: o.width || 5.5, length: o.length || 30, spacing: 0.5, overlap: 0.6, angle: slope, color: (x, y) => colorAt(phiOf(x), tOf(x, y), x, y), stroke: { ...line, opacity: 0.97 } });
}
const block = (x0, y0, x1, y1, tones, o = {}) => shape(p, [[x0, y0], [x1, y0], [x1, y1], [x0, y1]], tones, { light: [-1, 0.2], turn: 0.1, width: 5, length: 16, vary: 0.04, round: Math.abs(x1 - x0) * 0.55, flow: () => 0, edge: false, ...o });

// ---------------------------------------------------------------- the steps and the floor
p.stroke({ brush: 'soft', color: '#140c20', width: 30, opacity: 0.4, points: arcOf(3.95, 0, Math.PI * 1.04, Math.PI * 1.96, 12) });                          // the shade where the lowest step meets the paving
const STEPS = [[3.7, 0, 0.2], [3.25, 0.2, 0.4], [2.8, 0.4, 0.6]];
for (const [rho, y0, y1] of STEPS) {
  band(rho, y0, y1, Math.PI, TAU, (phi, t) => mix(stone(warmAt(phi)), '#2a2444', (1 - t) * 0.3));
  mark(arcOf(rho, y1, Math.PI * 1.02, Math.PI * 1.98, 26), '#e6d8ee', 4, { opacity: 0.75 });                                                                  // the edge of the step, which the sky finds
}
{ // the floor: pale stone that holds the sky and, at its left, the gold
  const poly = arcOf(2.8, 0.6, 0, TAU, 40), xs = poly.map((q) => q[0]), ys = poly.map((q) => q[1]);
  p.fill({ inside: inPoly(poly), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 5.5, length: 40, spacing: 0.5, angle: () => r.range(-0.03, 0.03), color: (x, y) => mix(mix(mix('#7c7296', '#a498b8', r()), skyColor(x, 2 * 590 - y), 0.3), '#f0cc7c', clamp((CX - x) / 220, 0, 1) * 0.4 + 0.1), stroke: { ...line, opacity: 0.96 } });
}

// ---------------------------------------------------------------- the columns
const COL = Array.from({ length: A.columns }, (_, k) => A.turn + k * TAU / A.columns);
function column(phi, dim) {
  const X = A.X + A.ring * Math.cos(phi), Z = A.Z + A.ring * Math.sin(phi), s = unit(Z), x = at(X, 0, Z)[0], yb = at(X, 0.6, Z)[1], yt = at(X, 3.9, Z)[1], hw = 0.2 * s;
  const far = (c) => mix(c, '#3a3258', dim * 0.45);
  const tones = { shadow: far('#3c3458'), half: far('#857ca2'), lit: far('#ffe9b4'), bounce: far('#b0945c') };
  if (!dim) tones.rim = '#fff8dc';
  const slab = (half, y, h) => { mark([[x - half, y], [x + half, y]], far('#8e85a8'), h); mark([[x - half, y], [x + half * 0.1, y]], far('#ffe9b4'), Math.min(h, half * 0.5)); mark([[x + half * 0.5, y], [x + half, y]].map(([a, b], i) => [a + (i ? 1 : -1) * Math.max(0, 6.3 - half * 0.25), b]), far('#3c3458'), 4, { opacity: 0.5 }); };   // a level piece of stone: light at its left, shade at its right
  slab(hw * 1.55, yb - 0.08 * s, 0.16 * s);                                                                                                                     // the square foot of it
  slab(hw * 1.25, yb - 0.22 * s, 0.13 * s);                                                                                                                     // the round moulding on that
  shape(p, [[x - hw, yb - 0.28 * s], [x - hw * 0.88, yt + 0.3 * s], [x + hw * 0.88, yt + 0.3 * s], [x + hw, yb - 0.28 * s]], tones, { light: [-1, 0.15], turn: 0.1, width: 5.2, length: 34, vary: 0.04, round: hw * 1.05, flow: () => Math.PI / 2, edge: !dim, dash: 44, gap: 6, edgeOpacity: 0.85, tint: (c, px, py) => { const t = (py - yt) / (yb - yt); return mix(mix(c, '#ffd070', smooth(0.45, 1, t) * 0.22), '#e0a8e0', smooth(0.4, 0, t) * 0.14); } });   // the shaft: more of the gold low down, a little of the sky high up
  for (const k of [-0.28, 0.3]) mark([[x + hw * k, yb - 0.34 * s], [x + hw * k * 0.9, yt + 0.36 * s]], far('#3c3458'), 4, { opacity: 0.22 });                   // the long hollows that are cut down it
  slab(hw * 1.2, yt + 0.24 * s, 0.14 * s);                                                                                                                      // its head: a round cushion
  slab(hw * 1.6, yt + 0.09 * s, 0.15 * s);                                                                                                                      // and a square slab on it
}
// The low rail between two columns: a top rail, a foot rail, and small pillars between them.
function rail(p0, p1, dim) {
  const far = (c) => mix(c, '#3a3258', dim * 0.5), n = Math.max(3, Math.round(Math.abs(ring(A.ring, 1, p1)[0] - ring(A.ring, 1, p0)[0]) / 11));
  for (let i = 1; i < n; i++) { const phi = p0 + (p1 - p0) * i / n; mark([ring(A.ring, 0.72, phi), ring(A.ring, 1.42, phi)], far(stone(warmAt(phi) * (dim ? 0.5 : 1))), 4.4, { opacity: 0.95 }); }
  mark(arcOf(A.ring, 0.68, p0, p1, 8), far(stone(warmAt((p0 + p1) / 2) * 0.7)), 5.5);
  mark(arcOf(A.ring, 1.47, p0, p1, 8), far(stone(Math.min(1, warmAt((p0 + p1) / 2) + 0.2))), 6);
  mark(arcOf(A.ring, 1.53, p0, p1, 8), far('#ece0f4'), 4, { opacity: dim ? 0.4 : 0.8 });                                                                        // the sky on the top of the rail
}
const front = (phi) => Math.sin(phi) < -0.01;
// the far half: the inside of the band of stone, the far columns, the far rails
band(A.ring - 0.05, 3.9, 4.45, 0, Math.PI, (phi, t) => mix(mix('#342c50', '#6c5c70', 0.25 + 0.3 * (1 - t)), '#c8a060', (1 - t) * 0.18));
for (const phi of COL.filter((q) => !front(q) && Math.sin(q) > 0.3)) column(phi, 1);
for (let k = 0; k < A.columns; k++) { const p0 = COL[k], p1 = p0 + TAU / A.columns, mid = (p0 + p1) / 2; if (Math.sin(mid) > 0.2) rail(p0, p1, 1); }

// ---------------------------------------------------------------- the table
{
  const [tx, ty] = at(A.X, 1.36, A.Z), half = 0.52 * S, hem = at(A.X, 0.74, A.Z)[1];
  const cloth = { shadow: '#6c6490', half: '#b0a8cc', lit: '#fff4dc', rim: '#ffffff', bounce: '#9c8cb4' };
  shape(p, [[tx - half, ty], [tx + half, ty], [tx + half * 1.12, hem - 3], [tx + half * 0.6, hem + 2], [tx, hem - 2], [tx - half * 0.6, hem + 2], [tx - half * 1.12, hem - 3]], cloth, { light: [-1, 0.2], turn: 0, width: 5, length: 20, round: half * 0.8, flow: () => Math.PI / 2, dash: 20, gap: 6, edgeOpacity: 0.7 });   // the cloth, which hangs in folds
  for (const k of [-0.5, 0.05, 0.56]) mark([[tx + half * k, ty + 5], [tx + half * k * 1.12, hem - 4]], '#7c74a0', 4, { opacity: 0.45 });
  mark([[tx - half, ty], [tx + half, ty]], '#fffaf0', 5.2);                                                                                                     // the top of the table
  // on it: a pot, two cups, and a stand of cakes
  mark([[tx - 15, ty - 6.4], [tx - 2.4, ty - 6.4]], '#f4ecf8', 7.2); mark([[tx - 2, ty - 8], [tx + 5, ty - 12]].map(([x, y], i) => [x + (i ? 3 : -3), y]), '#f4ecf8', 4);   // the pot and its spout
  mark([[tx - 14, ty - 11], [tx - 3, ty - 11]].map(([x, y], i) => [x + (i ? 0.8 : -0.8), y]), '#e8b83c', 4, { opacity: 0.9 });                                      // a band of gold round the pot
  mark([[tx + 13, ty - 16], [tx + 13, ty - 2]], '#d8c070', 4);                                                                                                  // the stand
  for (const dy of [-5, -13]) mark([[tx + 5.6, ty + dy], [tx + 20.4, ty + dy]], dy < -8 ? '#fff4e0' : '#f4d8e8', 4.2);
  mark([[tx - 26, ty - 3.4], [tx - 13.4, ty - 3.4]], '#ffffff', 4.2, { opacity: 0.9 });                                                                          // a cup
}

// ---------------------------------------------------------------- the near half
for (const phi of COL.filter((q) => !front(q) && Math.sin(q) <= 0.3)) column(phi, 0.4);                                                                       // the two at the sides
for (let k = 0; k < A.columns; k++) { const p0 = COL[k], p1 = p0 + TAU / A.columns, mid = (p0 + p1) / 2; if (Math.sin(mid) <= 0.2 && Math.sin(mid) > -0.9) rail(p0, p1, 0); }   // the rails at the near sides; the front is open
for (const phi of COL.filter(front)) column(phi, 0);
// the band of stone on their heads: its plain lower part, a line of shade, and the edge at its top that stands out
band(2.5, 3.9, 4.45, Math.PI, TAU, (phi, t) => { let c = stone(warmAt(phi) * (0.75 + 0.25 * (1 - t))); if (t > 0.6 && t < 0.74) c = mix(c, '#2c2448', 0.45); if (t > 0.8) c = mix(c, '#f0dcf0', 0.4); return c; }, { rhoTop: 2.56 });
mark(arcOf(2.62, 4.47, Math.PI * 1.01, Math.PI * 1.99, 26), '#fbeefa', 5, { opacity: 0.9 });
mark(arcOf(2.5, 3.9, Math.PI * 1.02, Math.PI * 1.98, 26), '#2c2448', 4, { opacity: 0.5 });
mark(arcOf(2.5, 3.9, Math.PI * 1.04, Math.PI * 1.5, 14), '#ffe9a8', 4, { opacity: 0.55 });                                                                     // the gold from below, along its under edge at the left

// ---------------------------------------------------------------- the roof of ironwork
// A place on it: e is how far up it is (0 at the band of stone, a quarter turn at the top), phi the angle about the middle.
const dome = (e, phi) => at(A.X + 2.42 * Math.cos(e) * Math.cos(phi), 4.47 + 2.15 * Math.sin(e), A.Z + 2.42 * Math.cos(e) * Math.sin(phi));
const rib = (phi, e0 = 0, e1 = 1.5, n = 12) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(dome(e0 + (e1 - e0) * i / n, phi)); return pts; };
const hoop = (e, p0, p1, n = 20) => { const pts = []; for (let i = 0; i <= n; i++) pts.push(dome(e, p0 + (p1 - p0) * i / n)); return pts; };
const iron = '#07130f', farIron = (x, y) => mix('#122420', skyColor(x, y), 0.34);
const RIBS = Array.from({ length: 12 }, (_, j) => j * TAU / 12 + TAU / 24);
// the far side of the cage first: we see it through the near side, thinner and paler
for (const phi of RIBS.filter((q) => Math.sin(q) > 0)) { const pts = rib(phi); mark(pts, farIron(...pts[6]), 4, { opacity: 0.7 }); }
for (const e of [0.5, 1.0]) { const pts = hoop(e, 0, Math.PI); mark(pts, farIron(...pts[10]), 4, { opacity: 0.6 }); }
// the near side: the ribs, the hoops round them, and in each space a leaf of iron
for (const e of [0.5, 1.0, 1.38]) mark(hoop(e, Math.PI, TAU), iron, e > 1.2 ? 4.4 : 5);
for (const phi of RIBS.filter((q) => Math.sin(q) <= 0)) mark(rib(phi), iron, 5);
for (let j = 0; j < RIBS.length; j++) {
  const p0 = RIBS[j], p1 = p0 + TAU / 12, mid = (p0 + p1) / 2;
  if (Math.sin(mid) > 0.05) continue;
  mark([dome(0.04, p0 + 0.05), dome(0.24, p0 + 0.12), dome(0.44, mid)], iron, 4.4);                                                                           // a pointed arch of two bent bars, like a leaf
  mark([dome(0.04, p1 - 0.05), dome(0.24, p1 - 0.12), dome(0.44, mid)], iron, 4.4);
  mark([dome(0.56, mid - 0.12), dome(0.76, mid), dome(0.95, mid + 0.1)], iron, 4.2);                                                                           // and a bar that leans, in the space over it
}
// the light on the iron: the pink of the sky on the upper parts that are turned to the middle of its turning, and the gold of the roses low down
for (const phi of RIBS.filter((q) => Math.sin(q) <= 0)) {
  mark(rib(phi, 0.86, 1.46, 6).map(([x, y]) => [x + 1.6, y - 1.6]), '#f090d8', 4, { opacity: 0.5 });
  if (Math.cos(phi) < 0.3) mark(rib(phi, 0.03, 0.3, 5).map(([x, y]) => [x - 1.6, y + 0.6]), '#c8a040', 4, { opacity: 0.28 });
}
mark(hoop(1.38, Math.PI, TAU, 12).map(([x, y]) => [x, y - 2]), '#ffb0e8', 4, { opacity: 0.6 });
// the point at its top: a ball, and a spike on it
{ const [fx, fy] = dome(Math.PI / 2, 0), top = at(A.X, 7.42, A.Z)[1];
  mark([[fx, fy + 4], [fx, top]], iron, 5, { taper: [0, 0.8] });
  disc(p, fx, fy - 9, 7.4, iron, 6.2, { ...line });
  p.tryStroke({ brush: 'round', color: '#ffa8e4', width: 4, opacity: 0.8, points: studio.arc(fx, fy - 9, 6, -2.4, -0.3, 6) }); }

// ---------------------------------------------------------------- the urns of roses
function urn(X, Z, side) {
  const s = unit(Z), [x, y0] = at(X, 0, Z), U = (ux, uy) => [x + ux * s, y0 - uy * s], light = [side * 0.9, 0.3];
  const tones = { shadow: '#3c3458', half: '#857ca2', lit: '#f8e8c2', rim: '#fffbea', bounce: '#6c6088' }, o = { light, turn: 0.1, width: 5, length: 16, vary: 0.05, dash: 16, gap: 6, edgeOpacity: 0.7 };
  p.tryStroke({ brush: 'soft', color: '#140c20', width: Math.max(8.4, 0.24 * s), opacity: 0.45, points: [U(-0.5, -0.03), U(0, -0.05), U(0.5, -0.03)] });
  shape(p, [U(-0.3, 0), U(0.3, 0), U(0.3, 0.36), U(-0.3, 0.36)], tones, { ...o, round: 0.28 * s, flow: () => 0 });                                             // the block that it stands on
  shape(p, [U(-0.12, 0.34), U(0.12, 0.34), U(0.2, 0.62), U(0.44, 0.92), U(0.48, 1.16), U(-0.48, 1.16), U(-0.44, 0.92), U(-0.2, 0.62)], tones, { ...o, round: 0.4 * s, flow: () => Math.PI / 2 });   // its foot and its bowl
  mark([U(-0.54, 1.18), U(0.54, 1.18)], side < 0 ? '#fbeccc' : '#b4a8c8', Math.max(5, 0.09 * s));                                                               // its rim
  for (const ux of [-0.3, 0, 0.3]) mark([U(ux * 0.5, 0.68), U(ux, 1.1)], '#3c3458', 4, { opacity: 0.3 });                                                       // the ribs of the bowl
  // the roses in it: a heap of dark leaves, and the flowers on it
  solid(p, [[...U(-0.34, 1.34), 0.24 * s], [...U(0, 1.52), 0.3 * s], [...U(0.34, 1.34), 0.24 * s]], { shadow: '#06140c', half: '#12301a', lit: '#4c6c24', bounce: '#0a1c10' }, { light: [0, -1], turn: 0.2, width: 5, length: 14, vary: 0.2 });
  for (let k = 0; k < 9; k++) { const a = r.range(0, TAU), d = Math.sqrt(r()) * 0.4; rose(p, x + Math.cos(a) * d * s * 1.2, y0 - (1.48 + Math.sin(a) * d * 0.5) * s, r.range(6.6, 8.4)); }
  for (let k = 0; k < 5; k++) spark(p, x + r.range(-0.5, 0.5) * s, y0 - r.range(1.26, 1.76) * s, 1);
}
urn(A.X - 3.3, A.Z - 2.2, -1);
urn(A.X + 3.3, A.Z - 2.2, 1);

// The gold in the air about the foot of the arbor, and a little of the light of the sky over its roof.
for (const [x, y, w, op] of [[CX - 190, 716, 60, 0.12], [CX + 196, 716, 54, 0.1], [CX, 730, 70, 0.07]]) p.stroke({ brush: 'soft', color: '#f0b830', width: w, opacity: op, points: [[x - w * 1.2, y], [x, y - 4], [x + w * 1.2, y]] });
p.stroke({ brush: 'soft', color: '#ffc8f0', width: 60, opacity: 0.1, points: [[CX - 70, 330], [CX, 316], [CX + 70, 330]] });

p.save();
