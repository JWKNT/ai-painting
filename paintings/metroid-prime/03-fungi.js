// The great mushrooms of the mine. Each has a thick stem that gives a pale blue-green
// light, and on it a cap like a wide bowl turned over. We look up at the caps from below:
// so we see the under side of each, a bright ring of gills, and over it the dark dome of
// the cap, with bands of light that run down it from its top to its edge. Small ones grow
// in groups about the feet of the great ones. Their light lies on the floor under them.
'use strict';
const { studio, open, FUNGI, floorY, nA, nC, hash } = require('./scene');
const { mix, clamp, smooth, glow, inPoly } = studio;

const p = open('fungi');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.15, cap: 'round' };
const HAZE = '#0c1c34';

function fungus(f, i) {
  const { x, base, h, cap: R, d } = f, top = base - h, dim = (c) => mix(c, HAZE, d * 0.8), sw = R * 0.2, lean = (hash(i, 3) - 0.5) * 0.12;
  const mid = (y) => x + lean * (base - y) + R * 0.05 * Math.sin((base - y) / (h * 0.3) + i), half = (y) => sw * (0.62 + 0.5 * Math.pow(clamp((y - top) / h, 0, 1), 2.4));
  const cx = mid(top), cy = top, ry = R * 0.24, dome = R * 0.62;            // the middle of the under side of the cap; how deep we see into it; how high the dome is
  // its light in the air, and on the floor under it
  for (const [k, op] of [[3.0, 0.05], [1.9, 0.08]]) glow(p, cx, cy + R * 0.2, R * k, dim('#2ac8e0'), op * (1 - d * 0.5), 5, 0.8);
  p.stroke({ brush: 'soft', color: dim('#2ac8e0'), width: Math.max(14, R * 0.34), opacity: 0.2 * (1 - d * 0.6), points: [[x - R * 1.1, base + 6], [x, base + 10], [x + R * 1.1, base + 6]] });
  // the stem: bright down its middle, bluer at its sides, with faint rings round it
  p.fill({ inside: (px, py) => py > top && py < base + 6 && Math.abs(px - mid(py)) < half(py), bounds: [x - R, top, x + R, base + 6], width: clamp(sw * 0.34, 5.5, 14), length: clamp(h * 0.3, 30, 150), spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + lean,
    color: (px, py) => { const k = Math.abs(px - mid(py)) / half(py), ring = nA(i * 7, py / (sw * 0.9)); let c = mix('#e2fdff', '#2f9ccc', Math.pow(k, 1.4)); c = mix(c, '#1a6ca0', (ring - 0.5) * 0.36); return dim(mix(c, '#0e3a64', smooth(top + h * 0.5, base, py) * 0.4)); }, stroke: { ...line, opacity: 0.96 } });
  // the under side of the cap: gills that go out from the stem to the edge, bright near the stem
  const under = (px, py) => Math.pow((px - cx) / R, 2) + Math.pow((py - cy) / ry, 2) < 1;
  p.fill({ inside: under, bounds: [cx - R, cy - ry, cx + R, cy + ry], width: clamp(R * 0.045, 5, 10), length: clamp(R * 0.3, 16, 70), spacing: 0.5, overlap: 0.6, angle: (px, py) => Math.atan2((py - cy) / ry * 2.2, (px - cx) / R),
    color: (px, py) => { const k = Math.hypot((px - cx) / R, (py - cy) / ry), gill = hash(Math.floor(Math.atan2((py - cy) / ry, (px - cx) / R) * 14), i); return dim(mix(mix('#f0ffff', '#3fd4ec', Math.pow(k, 0.8)), '#12709c', (gill - 0.5) * 0.5 + smooth(0.8, 1, k) * 0.3)); }, stroke: { ...line, rag: 0.08, opacity: 0.97 } });
  // the dome of the cap, over it: dark, with bands of light from its top to its edge
  const inDome = (px, py) => { const u = (px - cx) / R; if (Math.abs(u) >= 1) return false; const edge = cy - ry * Math.sqrt(1 - u * u) * 0.0 , topLine = cy - dome * Math.sqrt(1 - u * u), low = cy - ry * Math.sqrt(1 - u * u); return py > topLine && py < low + 2; };
  p.fill({ inside: inDome, bounds: [cx - R, cy - dome - 2, cx + R, cy + 2], width: clamp(R * 0.05, 5.5, 12), length: clamp(R * 0.34, 18, 80), spacing: 0.5, overlap: 0.6, angle: (px, py) => Math.atan2(py - (cy + dome * 0.2), px - cx),
    color: (px, py) => { const u = (px - cx) / R, v = clamp((cy - py) / dome, 0, 1), a = Math.atan2(u, 1.2 - v), band = smooth(0.52, 0.8, Math.sin(a * 11 + i) * 0.5 + 0.5); let c = mix('#081a3e', '#12386c', nC(px / 20, py / 20)); c = mix(c, '#4fe0f4', band * (0.35 + 0.5 * (1 - v))); c = mix(c, '#04091c', smooth(0.6, 1, v) * 0.5); return dim(mix(c, '#9cf4ff', smooth(0.14, 0, v) * 0.5)); }, stroke: { ...line, opacity: 0.97 } });
  // the edge of the cap: a bright line along its near side
  { const pts = []; for (let k = 0; k <= 24; k++) { const a = Math.PI * k / 24; pts.push([cx - Math.cos(a) * R, cy + Math.sin(a) * ry]); } studio.glint(p, pts, () => dim(mix('#8cf0ff', '#f4ffff', r())), { width: R > 100 ? 5.5 : 4.4, dash: 60, gap: 6, opacity: 0.9, rng: r }); }
  // spots of light on the dome
  for (let k = 0; k < Math.round(R / 14); k++) { const u = r.range(-0.8, 0.8), v = r.range(0.15, 0.8) * Math.sqrt(1 - u * u), px = cx + u * R, py = cy - v * dome; glow(p, px, py, Math.max(9, R * 0.06), dim('#58e4f8'), 0.14, 6); p.tryStroke({ brush: 'round', color: dim('#d8fcff'), width: 4, opacity: 0.7, taper: [0.5, 0.5], points: [[px - 6.2, py], [px + 6.2, py]] }); }
}
// A small mushroom: a short stem and a round cap, all light.
function small(x, y, s, d) {
  const dim = (c) => mix(c, HAZE, d * 0.8);
  glow(p, x, y - s, s * 1.5, dim('#2ac8e0'), 0.1, 5);
  p.tryStroke({ ...line, color: dim('#bff4fc'), width: Math.max(5, s * 0.22), points: [[x, y + 2], [x + s * 0.06, y - s * 0.5], [x, y - s]] });
  p.tryStroke({ ...line, color: dim('#0e3464'), width: Math.max(6, s * 0.5), points: [[x - Math.max(6.4, s * 0.55), y - s * 1.06], [x, y - s * 1.3], [x + Math.max(6.4, s * 0.55), y - s * 1.06]] });
  p.tryStroke({ ...line, rag: 0.05, color: dim('#7cecfc'), width: Math.max(4.8, s * 0.18), points: [[x - Math.max(6.4, s * 0.6), y - s * 0.94], [x, y - s * 0.86], [x + Math.max(6.4, s * 0.6), y - s * 0.94]] });
}
// the far ones first
FUNGI.map((f, i) => [f, i]).sort((a, b) => b[0].d - a[0].d).forEach(([f, i]) => {
  fungus(f, i);
  for (let k = 0; k < 7; k++) { const sx = f.x + r.range(-1.3, 1.3) * f.cap, s = r.range(20, 54) * (1 - f.d * 0.5); small(sx, Math.max(f.base, floorY(sx) + 4) + r.range(-4, 8), s, f.d); }
});
for (const [x, s] of [[930, 26], [990, 40], [1150, 30], [690, 34], [450, 30], [1230, 50]]) small(x, floorY(x) + 8, s, 0.2);
void inPoly;

p.save();
