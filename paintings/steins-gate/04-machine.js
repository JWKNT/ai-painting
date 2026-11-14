// The machine in the roof. It is a great drum of grey metal in steps: a wide lower part with
// bands round it, a narrower upper part with upright ribs, a small pale dome, and a cap. Two
// flat panels in a frame stand out from it at the upper left, at an angle. It has come down
// through the edge of the roof and stands in the top storey: the roof edge and the tops of
// the boards are broken away round it, we see the dark of the room behind them, and the
// foot of the machine is hidden behind what is left of the wall. We look up at it, so each
// band round it bends up in the middle.
'use strict';
const { studio, open, ROOF, BOARDS, SAT, S, SUNWARD, nA, nB, nC, hash } = require('./scene');
const { mix, smooth, clamp, shape, inPoly, through } = studio;

const p = open('machine');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.1, cap: 'flat' };
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts });

// ---------------------------------------------------------------- the break in the roof
// What is left of the wall in front of the machine ends at a ragged line: the wall is whole below it. The break has a left
// edge and a right edge, which come down from the roof to that line.
const lip0 = through([[452, 328], [522, 340], [580, 346], [640, 352], [700, 368], [753, 386], [800, 384], [856, 356]]);
const lip = (x) => lip0(x) + 9 * (nC(x / 13, 2.2) - 0.5) + 7 * (hash(Math.floor(x / 21), 5) - 0.5);
const left = (y) => 462 + (y - ROOF) * 0.42 + 7 * (nC(3.1, y / 9) - 0.5), right = (y) => 852 - (y - ROOF) * 0.22 + 7 * (nC(8.4, y / 9) - 0.5);
const broken = (x, y) => y > ROOF - 4 && y < lip(x) && x > left(y) && x < right(y);
// The room behind: dark, a little lighter high up, where the sun comes in through the roof.
p.fill({ inside: broken, bounds: [440, ROOF - 4, 870, 400], width: 7, length: 34, spacing: 0.5, angle: () => r.range(-0.2, 0.2), color: (x, y) => mix(mix('#34322f', '#0d0e13', smooth(ROOF, 372, y)), '#4a4640', nB(x / 9, y / 9) > 0.74 ? 0.4 : 0), stroke: { ...line, opacity: 0.97 } });
// We look at the break from the right. So we see into the thick of the wall along its left edge: raw concrete, with the sun on it.
for (let y = ROOF + 2; y < 338; y += 15) { const y1 = Math.min(340, y + 20), x0 = left(y) + 7, x1 = left(y1) + 7; mark([[x0, y], [(x0 + x1) / 2 + r.range(-1.5, 1.5), (y + y1) / 2], [x1, y1]], mix('#d8d0bc', '#f4eede', r()), r.range(9, 13), { rag: 0.4, opacity: 0.96 }); }
for (let k = 0; k < 5; k++) { const y = r.range(ROOF + 6, 334), x = left(y) + r.range(4, 11); mark([[x - 6.4, y], [x + 6.4, y + r.range(-2, 2)]], '#8c8474', 4, { opacity: 0.55 }); }   // stones in the concrete
mark([[left(ROOF + 4) + 15, ROOF + 4], [left(320) + 15, 320], [left(338) + 14, 338]], '#08090c', 5, { opacity: 0.7, cap: 'round' });                                                // and the dark behind it
// A beam of the roof has come down inside, at the left, and lies against the machine. Thin iron bars stick out of the broken
// concrete, each bent its own way, and two wires hang down inside at the right.
mark([[484, 312], [512, 330], [540, 346]], '#6c6860', 11, { rag: 0.3 }); mark([[486, 307], [514, 325], [541, 340]], '#b8b2a2', 4.4, { opacity: 0.9 });
for (const [x, y, a, l, bend] of [[478, 318, -0.5, 30, 0.9], [470, 304, -1.2, 24, -0.8], [846, 318, -2.4, 28, 0.8], [838, 340, -2.9, 22, -0.7], [500, 338, -0.9, 20, 0.6]]) mark([[x, y], [x + Math.cos(a) * l * 0.55, y + Math.sin(a) * l * 0.55], [x + Math.cos(a + bend) * l, y + Math.sin(a + bend) * l]], '#4a3c34', 4, { opacity: 0.9 });
mark([[800, 318], [826, 336], [848, 356]], '#5c5850', 9, { rag: 0.3 }); mark([[802, 313], [828, 331], [849, 350]], '#a09a8c', 4.2, { opacity: 0.8 });   // a second piece of the roof, at the right
for (const [x, l, sway] of [[822, 54, -9], [806, 38, 6]]) mark([[x, ROOF + 6], [x + sway * 0.7, ROOF + 6 + l * 0.6], [x + sway, ROOF + 6 + l]], '#a8a498', 4, { opacity: 0.6 });

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
  const poly = inPoly(outline), seen = (x, y) => poly(x, y) && y < lip(x) - 1;                                                    // its foot is behind what is left of the wall
  p.fill({ inside: seen, bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 7, length: 50, spacing: 0.5, angle: () => SAT.tilt - Math.PI / 2 + r.range(-0.02, 0.02), color: metal, stroke: { ...line, opacity: 0.97 } });
  p.fill({ inside: seen, bounds: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], width: 5.5, length: 30, spacing: 1.0, overlap: 0.7, angle: () => SAT.tilt - Math.PI / 2 + r.range(-0.02, 0.02), color: (x, y) => metal(x + r.range(-3, 3), y), stroke: { ...line, opacity: 0.8 } });
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
// ---------------------------------------------------------------- the break, in front of the machine
// The machine is in the shade of the wall where it goes down behind it.
for (let x = 530; x < 760; x += 46) p.tryStroke({ brush: 'soft', color: '#0c0d12', width: 20, opacity: 0.42, points: [[x - 6, lip0(x - 6) - 9], [x + 22, lip0(x + 22) - 9], [x + 52, lip0(x + 52) - 9]] });
// The broken top of the wall: a ragged pale edge, in short pieces that go up and down, and under it the raw grey of the break.
for (let x = 456; x < 852;) {
  const l = r.range(13, 24), x1 = Math.min(854, x + l);
  if (x1 - x >= 12.5) { mark([[x, lip(x) + 5], [x1, lip(x1) + 5]], mix('#8c867a', '#b0aa9c', r()), r.range(7, 10), { rag: 0.5, opacity: 0.9 }); mark([[x, lip(x) + 1], [x1, lip(x1) + 1]], mix('#e8e2d2', '#fffaf0', r()), 4.4, { opacity: 0.9, cap: 'round' }); }
  x = x1 - 1;
}
// Cracks in the wall under the break: short, thin, in straight pieces that turn. They are in the boards and in the wall
// under the boards, and they do not cross the glass.
function crack(x, y, a, n, wide) {
  for (let i = 0; i < n; i++) {
    const turn = i % 2 ? (r() < 0.5 ? -1 : 1) * r.range(0.5, 0.9) : r.range(-0.25, 0.25), l = r.range(16, 34), x1 = x + Math.cos(a + turn) * l, y1 = y + Math.sin(a + turn) * l;
    if (y1 > BOARDS.y1 + 42) return;
    mark([[x, y], [x1, y1]], '#4a443e', i === 0 ? wide : 4, { cap: 'round', opacity: 0.56 - 0.12 * i });
    if (i === 1 && r() < 0.5) crack(x1, y1, a + (r() < 0.5 ? -0.8 : 0.8), 2, 4);
    x = x1; y = y1;
  }
}
for (const [x, a, n, wide] of [[474, 2.4, 3, 4.4], [540, 1.9, 3, 4.6], [612, 1.5, 4, 4.6], [700, 1.7, 3, 4.4], [778, 1.2, 4, 4.6], [840, 0.7, 2, 4.4]]) crack(x, lip(x) + 9, a, n, wide);
// The glass of two windows under the break is broken. The lower part of each pane is gone, and the room behind it is dark;
// what is left of the glass hangs from the top of the frame, and its edge is toothed. The edge has no line of its own.
for (const [x0, x1, seed] of [[624, 670, 1], [682, 728, 2]]) {
  const y0 = BOARDS.y1 + 47, y1 = BOARDS.y1 + 97, teeth = []; for (let i = 0; i <= 5; i++) teeth.push([x0 + 4 + (x1 - x0 - 8) * i / 5, y0 + (i % 2 ? r.range(6, 13) : r.range(17, 28)) + (seed === 2 ? 5 : 0)]);
  const hole = [...teeth, [x1 - 4, y1 - 3], [x0 + 4, y1 - 3]];
  p.fill({ inside: inPoly(hole), bounds: [x0, y0, x1, y1], width: 5.5, length: 14, spacing: 0.45, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.25, 0.25), color: (x, y) => mix(mix('#0e1218', '#1a2028', r()), '#28323c', clamp((y - y0) / (y1 - y0) - 0.55, 0, 0.45)), stroke: { ...line, cap: 'round', opacity: 0.97 } });
}
// Dust and dirt have run down the wall from the break.
for (let k = 0; k < 9; k++) { const x = r.range(480, 830), w = r.range(18, 40), l = Math.max(w * 2.3, r.range(60, 150)); p.stroke({ brush: 'soft', color: mix('#6c665c', '#8c8478', r()), width: w, opacity: r.range(0.05, 0.11), taper: [0.2, 0.9], points: [[x, lip0(x) + 8], [x + r.range(-4, 4), lip0(x) + 8 + l * 0.5], [x + r.range(-8, 8), lip0(x) + 8 + l]] }); }
// Pieces of concrete lie on the rail under the boards and on the sill of the windows.
for (const [x, y] of [[556, BOARDS.y1 - 3], [612, BOARDS.y1 - 3], [704, BOARDS.y1 - 3], [770, BOARDS.y1 - 3], [596, BOARDS.y1 + 95], [742, BOARDS.y1 + 95], [650, BOARDS.y1 + 95]]) {
  const l = r.range(13, 22), h = r.range(5.5, 9), a = r.range(-0.2, 0.2);
  mark([[x - l / 2, y - h / 2], [x + l / 2, y - h / 2 + Math.sin(a) * l]], mix('#a8a294', '#d8d2c2', r()), h, { rag: 0.5 });
  mark([[x - l / 2, y - h + 1], [x + l / 2 - 1, y - h + 1 + Math.sin(a) * l]], '#f4eee0', 4, { opacity: 0.7 });
}
// The shade of the machine and of its panels lies on the front of the building, down and to the left; and a little dust still hangs about the break.
for (const [a, b, c, w, op] of [[[540, 352], [470, 430], [404, 520], 90, 0.13], [[500, 372], [440, 452], [380, 546], 60, 0.1], [[420, 330], [352, 400], [300, 470], 70, 0.08]]) p.stroke({ brush: 'soft', color: '#28303c', width: w, opacity: op, taper: [0.2, 0.7], points: [a, b, c] });
for (let k = 0; k < 7; k++) { const x = r.range(460, 850), y = r.range(ROOF - 30, 372), w = r.range(40, 76); p.stroke({ brush: 'soft', color: '#dcd8cc', width: w, opacity: r.range(0.04, 0.09), points: [[x - w * 1.1, y + 10], [x, y - 8], [x + w * 1.1, y - 24]] }); }

p.save();
