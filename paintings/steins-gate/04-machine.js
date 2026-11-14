// The machine in the roof. It is a great drum of grey metal in steps: a wide lower part with
// bands round it, a narrower upper part with upright ribs, a small pale dome, and a cap. Two
// flat panels in a frame stand out from it at the upper left, at an angle. It has come down
// into the edge of the roof: the boards are gone there, the concrete is broken open and
// dark, and long cracks go out from it across the front of the building. We look up at it,
// so each band round it bends up in the middle.
'use strict';
const { studio, open, H, FRONT, BOARDS, SAT, S, SUNWARD, nA, nB } = require('./scene');
const { mix, smooth, shape, inPoly } = studio;

const p = open('machine');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.1, cap: 'flat' };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts });

// ---------------------------------------------------------------- the break in the roof, and the cracks
// The dark of the hole: a notch that is broken out of the roof edge and the boards, wide at the top and ragged below.
{
  const hole = [S(-172, 2), S(172, 2), S(150, -52), S(112, -66), S(84, -112), S(30, -88), S(-10, -104), S(-64, -124), S(-104, -74), S(-146, -66)], xs = hole.map((q) => q[0]), ys = hole.map((q) => q[1]);
  p.fill({ inside: inPoly(hole), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 7, length: 40, spacing: 0.5, angle: () => SAT.tilt + r.range(-0.06, 0.06), color: (x, y) => mix(mix('#101014', '#2a2a30', nA(x / 20, y / 20)), '#4c4844', nB(x / 9, y / 9) > 0.7 ? 0.5 : 0), stroke: { ...line, opacity: 0.97 } });
  for (let i = 0; i < hole.length; i++) { const a = hole[i], b = hole[(i + 1) % hole.length]; if (i > 1) mark([a, b], '#e8e4d8', 5, { cap: 'round', opacity: 0.8 }); }   // the broken edge of the concrete, pale
}
// Broken ends of the roof edge stand up at each side of it, and bent bars of iron stick out of them.
for (const [u, v, w, h, a] of [[-188, 4, 46, 26, -0.3], [192, 6, 50, 26, 0.34]]) {
  const c = Math.cos(a), sn = Math.sin(a), q = (du, dv) => S(u + du * c - dv * sn, v + du * sn + dv * c);
  shape(p, [q(-w / 2, -h / 2), q(w / 2, -h / 2 + 4), q(w / 2 - 6, h / 2), q(-w / 2 + 4, h / 2 - 3)], { shadow: '#6c6a64', half: '#b8b4a8', lit: '#f0ece0', rim: '#ffffff', bounce: '#8c8a88' }, { light: SUNWARD, turn: 0, width: 5.5, length: 16, round: 8, flow: () => a + SAT.tilt, dash: 14, gap: 6 });
  for (let k = 0; k < 2; k++) { const [x, y] = q(r.range(-w / 3, w / 3), h / 2), l = r.range(16, 30), b = r.range(-2.4, -0.8); mark([[x, y], [x + Math.cos(b) * l * 0.6, y + Math.sin(b) * l * 0.6], [x + Math.cos(b + 0.7) * l, y + Math.sin(b + 0.7) * l]], '#3c3430', 4, { opacity: 0.9 }); }
}
// The cracks: thin dark lines in straight pieces, which turn sharply. Each starts at the break and goes out across the front of
// the building; it gets thinner, and it forks. None of them leaves the wall.
const onFront = (x, y) => x > FRONT.x0 && x < FRONT.x1 - 6 && y > BOARDS.y0 && y < H + 10;
function crack(x, y, a, len, wide) {
  let done = 0, i = 0;
  while (done < len) {
    const kink = i % 3 === 2 ? (r() < 0.5 ? -1 : 1) * r.range(0.6, 1.0) : r.range(-0.22, 0.22), l = r.range(26, 64), x1 = x + Math.cos(a + kink) * l, y1 = y + Math.sin(a + kink) * l;
    if (!onFront(x1, y1)) return;
    const w = Math.max(4, wide * (1 - done / len * 0.7));
    mark([[x, y], [x1, y1]], '#34302e', w, { cap: 'round', opacity: 0.85 - 0.5 * done / len });                // it is fainter toward its end
    if (i > 0 && r() < 0.28 && wide > 4.4) crack(x1, y1, a + (r() < 0.5 ? -1 : 1) * r.range(0.5, 0.9), (len - done) * 0.4, wide * 0.8);
    x = x1; y = y1; done += l; i++;
  }
}
for (const [u, v, a, len, wide] of [[-146, -66, 2.75, 320, 5.6], [-100, -80, 2.25, 420, 6], [-10, -104, 1.6, 360, 6], [84, -112, 1.15, 330, 5.6], [150, -52, 0.7, 150, 5], [-172, 0, 3.08, 220, 5]]) { const [x, y] = S(u, v); crack(x, y, a, len, wide); }
// Pieces of the boards and of the wall hang loose by the break.
for (const [u, v, w, h, a, c] of [[-150, -100, 44, 26, 0.5, '#ec8cac'], [128, -96, 40, 24, -0.5, '#f0d458'], [-30, -136, 34, 20, 0.2, '#d8d4c8']]) {
  const cs = Math.cos(a), sn = Math.sin(a), q = (du, dv) => S(u + du * cs - dv * sn, v + du * sn + dv * cs);
  shape(p, [q(-w / 2, -h / 2), q(w / 2, -h / 2), q(w / 2, h / 2), q(-w / 2, h / 2)], { shadow: mix(c, '#3c3c40', 0.5), half: c, lit: mix(c, '#ffffff', 0.4), bounce: mix(c, '#3c3c40', 0.3) }, { light: SUNWARD, turn: 0, width: 5.5, length: 16, round: 6, flow: () => a + SAT.tilt, edge: false });
}

// ---------------------------------------------------------------- the two panels, in their frame, behind the drum
function panel(a, b, c, d) {
  const quad = [a, b, c, d], xs = quad.map((q) => q[0]), ys = quad.map((q) => q[1]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  p.fill({ inside: inPoly(quad), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 6, length: 34, spacing: 0.5, angle: () => ang, color: (x, y) => mix(mix('#243444', '#3c5870', nB(x / 30, y / 30)), '#a8c8d8', smooth(0.4, 0.9, nA(x / 60 + 3, y / 60)) * 0.5), stroke: { ...line, opacity: 0.97 } });
  const at = (s, t) => [a[0] + (b[0] - a[0]) * s + (d[0] - a[0]) * t, a[1] + (b[1] - a[1]) * s + (d[1] - a[1]) * t];
  for (const s of [0.25, 0.5, 0.75]) mark([at(s, 0), at(s, 1)], '#8c9ca8', 4, { opacity: 0.8 });                                  // the lines between its cells
  for (const t of [0.33, 0.66]) mark([at(0, t), at(1, t)], '#8c9ca8', 4, { opacity: 0.8 });
  for (const [s0, t0, s1, t1] of [[0, 0, 1, 0], [1, 0, 1, 1], [1, 1, 0, 1], [0, 1, 0, 0]]) mark([at(s0, t0), at(s1, t1)], '#c8ccc8', 6, { cap: 'round' });   // its frame
  mark([at(0.02, 0.02), at(0.98, 0.02)], '#ffffff', 4, { opacity: 0.8 });
}
mark([S(-96, 110), S(-150, 150), S(-196, 196)], '#4c5058', 7, { cap: 'round' });                                                   // the arm that holds them
panel(S(-124, 118), S(-232, 150), S(-262, 256), S(-152, 220));
panel(S(-154, 228), S(-264, 264), S(-286, 366), S(-178, 330));

// ---------------------------------------------------------------- the drum
// A part of it: between two heights, so wide. Its metal is dark at the left, has the sky in its middle, a dark line, and then
// the sun down its right edge. `ribs` are upright lines on it; `bands` are lines round it, which bend up in the middle.
function part(U, v0, v1, o = {}) {
  const bend = o.bend != null ? o.bend : 14, top = (u) => v1 + bend * Math.sqrt(Math.max(0, 1 - (u / U) * (u / U))), bot = (u) => v0 + bend * Math.sqrt(Math.max(0, 1 - (u / U) * (u / U)));
  const outline = []; for (let u = -U; u <= U; u += U / 8) outline.push(S(u, top(u))); for (let u = U; u >= -U; u -= U / 8) outline.push(S(u, bot(u) - (o.low || 0)));
  const xs = outline.map((q) => q[0]), ys = outline.map((q) => q[1]), c = Math.cos(SAT.tilt), sn = Math.sin(SAT.tilt), uOf = (x, y) => (x - SAT.x) * c + (y - SAT.y) * sn;
  const metal = (x, y) => {
    const k = uOf(x, y) / U, n = nA(x / 20, y / 70);
    let m = mix(o.dark || '#4a5058', o.light || '#7c848a', n);
    m = mix(m, '#23272e', smooth(-0.2, -1, k) * 0.8);
    m = mix(m, '#a8c4d0', Math.exp(-Math.pow((k - 0.3) / 0.2, 2)) * 0.45);
    m = mix(m, '#30343a', Math.exp(-Math.pow((k - 0.7) / 0.09, 2)) * 0.5);
    m = mix(m, '#f8f6ee', smooth(0.82, 0.98, k) * 0.9);
    return mix(m, '#6c5444', (nB(x / 40, y / 26) > 0.66 ? 0.25 : 0));                                                              // rust
  };
  p.fill({ inside: inPoly(outline), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 7, length: 50, spacing: 0.5, angle: () => SAT.tilt - Math.PI / 2 + r.range(-0.02, 0.02), color: metal, stroke: { ...line, opacity: 0.97 } });
  p.fill({ inside: inPoly(outline), bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 5.5, length: 30, spacing: 1.0, overlap: 0.7, angle: () => SAT.tilt - Math.PI / 2 + r.range(-0.02, 0.02), color: (x, y) => metal(x + r.range(-3, 3), y), stroke: { ...line, opacity: 0.8 } });
  const ring = (v, k0 = -0.97, k1 = 0.97) => { const pts = []; for (let k = k0; k <= k1 + 0.001; k += 0.097) pts.push(S(k * U, v + bend * Math.sqrt(Math.max(0, 1 - k * k)))); return pts; };
  for (const v of o.bands || []) { mark(ring(v), '#1c2026', 5, { cap: 'round', opacity: 0.75 }); mark(ring(v + 5, -0.9, 0.9), '#c0c8cc', 4, { opacity: 0.4 }); }
  if (o.ribs) for (let k = -0.9; k <= 0.901; k += 1.8 / o.ribs) { const u = k * U, dk = bend * Math.sqrt(Math.max(0, 1 - k * k)); mark([S(u, v0 + dk + 4), S(u, v1 + dk - 4)], k > 0.6 ? '#f0f0ea' : '#262a30', 4, { opacity: 0.6 }); }
  mark(ring(v1 - 2), mix('#c8ccc8', '#ffffff', 0.4), 5.5, { cap: 'round' });                                                       // its top edge
  mark(ring(v1 - 2, 0.3, 0.97), '#ffffff', 4.6, { cap: 'round' });
}
part(118, -34, 96, { bands: [14, 56], low: 20 });
part(128, 96, 110, { bend: 15, dark: '#3c4048', light: '#5c646c' });                                                              // the wide ring between its two parts
part(86, 112, 190, { ribs: 14, dark: '#5a6066', light: '#8c9498' });
part(54, 192, 206, { bend: 9, dark: '#3c4048', light: '#5c646c' });
// the dome and its cap
shape(p, [S(-48, 206), S(-44, 232), S(-26, 252), S(0, 260), S(26, 252), S(44, 232), S(48, 206)], { shadow: '#5c646c', half: '#a8b0b4', lit: '#f0f2ee', rim: '#ffffff', bounce: '#7c8890' }, { light: SUNWARD, turn: -0.1, width: 5.5, length: 18, round: 26, flow: (x, y) => Math.atan2(y - S(0, 200)[1], x - S(0, 200)[0]) + Math.PI / 2, dash: 18, gap: 5 });
mark([S(0, 256), S(0, 280)], '#4c5058', 9, { cap: 'round' }); mark([S(-10, 282), S(10, 282)].map(([x, y], i) => [x + (i ? 2.4 : -2.4), y]), '#c8ccc8', 5, { cap: 'round' });
mark([S(30, 244), S(64, 300)], '#3c4048', 4.4); mark([S(64, 300), S(64, 300 + 12.6)], '#c8ccc8', 4.6);                               // a thin aerial
// its shade on the broken roof, and dust that still hangs about the break
p.stroke({ brush: 'soft', color: '#1c1c22', width: 40, opacity: 0.4, points: [S(-150, -46), S(-30, -60), S(120, -52)] });
for (let k = 0; k < 9; k++) { const [x, y] = S(r.range(-200, 200), r.range(-80, 30)), w = r.range(40, 80); p.stroke({ brush: 'soft', color: '#d8d4c8', width: w, opacity: r.range(0.05, 0.11), points: [[x - w * 1.1, y + 10], [x, y - 10], [x + w * 1.1, y - 30]] }); }

p.save();
