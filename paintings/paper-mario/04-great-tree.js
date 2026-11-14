// The Great Tree. It stands far off, as big as a hill, and the brightest part of the sky
// is behind it. Its trunk is wide and brown, with roots that go out over the ground and a
// small dark door at its foot. Its head is not leaves that we can see, but great pale
// heaps in storeys, like clouds: cream on their tops, where the gold sky is on them, and
// brown under. The gold air is between us and it, so it is soft.
'use strict';
const { studio, open, cam, TREE, HORIZON, glare, far, nA, nC } = require('./scene');
const { mix, clamp, ramp, mass, noise2, glow } = studio;

const p = open('great-tree');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.2, cap: 'round' };
const [tx, ty] = cam.at(TREE.X, 0, TREE.Z);                               // the middle of its foot
const AIR = 0.3;

// The gold air lies along the edge of the world: the far ground goes into it, with no hard line.
for (let k = 0; k < 16; k++) { const x = r.range(-200, 1500), len = r.range(300, 700), y = HORIZON + r.range(-4, 22); p.stroke({ brush: 'soft', color: mix('#e0b048', '#ffe69a', glare(x + len / 2, y, 500)), width: r.range(16, 30), opacity: r.range(0.1, 0.2), points: [[x, y], [x + len / 2, y + r.range(-2, 2)], [x + len, y]] }); }

// ---------------------------------------------------------------- its trunk: wide at the foot, narrower up to where it parts into boughs
const half = (y) => 48 + 30 * Math.pow(clamp((y - 380) / (ty - 380), 0, 1), 2.4) + 40 * Math.pow(clamp((y - (ty - 26)) / 26, 0, 1), 1.5);
const wood = (x, y) => { const u = (x - tx) / half(y), rib = nC(x / 9, y / 120); let c = mix('#3c2410', '#6c4420', rib); c = mix(c, '#22140a', (1 - Math.abs(u)) * 0.45); c = mix(c, '#d49838', Math.pow(Math.abs(u), 5) * 0.75); return far(c, x, y, AIR * 0.5 + 0.12 * glare(x, y, 240)); };   // it is dark in its middle; the bright sky comes round its two edges
p.fill({ inside: (x, y) => y > 300 && y < ty + 4 && Math.abs(x - tx) < half(y), bounds: [tx - 130, 300, tx + 130, ty + 4], width: 7, length: 70, spacing: 0.5, overlap: 0.6, angle: (x) => Math.PI / 2 + (x - tx) / 400, color: wood, stroke: { ...line, opacity: 0.96 } });
for (const [dx, lean] of [[-58, -1], [-22, -0.4], [26, 0.5], [60, 1]]) p.tryStroke({ ...line, color: far('#2c1a0c', tx, ty, AIR), width: 13, taper: [0, 0.8], points: [[tx + dx, ty - 30], [tx + dx + lean * 34, ty - 6], [tx + dx + lean * 92, ty + 4]] });   // its roots
for (const [dx, y0, y1, w] of [[-84, 360, 310, 20], [84, 356, 304, 20], [-36, 344, 300, 24], [40, 340, 296, 24]]) p.tryStroke({ ...line, color: far('#3a2410', tx, y0, AIR), width: w, taper: [0, 0.3], points: [[tx + dx * 0.4, y0 + 40], [tx + dx * 0.8, y0], [tx + dx * 1.5, y1]] });   // its boughs, up into the heaps
p.tryStroke({ ...line, color: '#150c06', width: 12, points: [[tx + 3, ty - 2], [tx + 3, ty - 26]] });                       // the door
for (const [dx, y] of [[-24, 470], [20, 430], [-6, 396]]) p.tryStroke({ brush: 'round', color: '#1c1008', width: 5, opacity: 0.7, points: [[tx + dx, y], [tx + dx, y + 13]] });   // knots, or windows

// ---------------------------------------------------------------- its head: heaps in storeys, the lowest first
const TONES = ['#553a1c', '#86663a', '#c0a26c', '#ead7a4', '#fbf0cc', '#fffbe8'];
const tone = (t, x, y) => far(ramp(TONES, clamp(t * 1.04 - 0.02, 0, 1)), x, y, AIR * 0.8);
const heap = (seed, x0, x1, floor, big, tall) => { const q = studio.rng(seed), puffs = []; for (let x = x0; x < x1; x += big * 0.5) { const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.04, 0.96)), 0.7), rad = big * q.range(0.6, 1) * (0.45 + 0.7 * hump); puffs.push([x + q.range(-8, 8), floor - rad * 0.62 - big * tall * hump * q.range(0.2, 1), rad]); } return puffs; };
[[61, tx - 300, tx - 96, 404, 64, 0.5], [62, tx + 110, tx + 320, 396, 66, 0.5], [63, tx - 250, tx + 262, 350, 84, 0.9], [64, tx - 170, tx + 180, 262, 78, 1.0], [65, tx - 90, tx + 96, 176, 60, 0.8]].forEach(([seed, x0, x1, floor, big, tall], i) => {
  mass(p, heap(seed, x0, x1, floor, big, tall), { light: [0.12, -0.99], tones: tone, base: floor, bias: 0.54, contrast: 0.66, fall: 0.5, grain: 0.14, mix: 0.3, noise: noise2(4500 + i), stroke: { rag: 0.3, hardness: 0.5 }, flow: (x, y) => (nA(x / 90, y / 40) - 0.5) * 0.7, layers: [[Math.max(12, big * 0.3), big * 0.85, 0.95, big * 0.08, 0.45], [Math.max(8, big * 0.16), big * 0.5, 0.8, big * 0.05, 0.75], [6, big * 0.3, 0.55, 3, 1.3]] });
  for (let x = x0 + 20; x < x1 - 20; x += r.range(40, 90)) p.tryStroke({ brush: 'soft', color: far('#3c2410', x, floor, AIR), width: 16, opacity: 0.3, points: [[x - 30, floor + 4], [x, floor + 6], [x + 30, floor + 4]] });   // the dark under each storey
});
// the bright sky behind it comes round it: a soft light at each side of the trunk and low under the heaps
for (const [x, y, w, op] of [[tx - 110, 470, 120, 0.1], [tx + 120, 460, 130, 0.12], [tx, 520, 200, 0.08]]) glow(p, x, y, w, '#ffe8a0', op, 6, 0.8);

p.save();
