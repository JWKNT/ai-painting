// The sea, and the island. The sea has the colors of the sky turned over, a tone darker,
// and a broad path of the sun's light lies on it from the edge of the world toward us: a
// thousand short level touches of gold and white, close together far off. At the left is
// the hill of Hitogashima with its two tops, dark against the sky, with the lights of the
// harbour at its foot; far off at the right lies a low island. Nearer, at the left, the
// sea wall runs out, and against it lies a heap of the concrete blocks that break the
// waves, each with four thick legs.
'use strict';
const { studio, open, W, HORIZON, SUN, WATERLINE, skyColor, glare, far, hillTop, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, glow } = studio;

const p = open('sea');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.03, rag: 0.2, cap: 'round' };
const END = WATERLINE + 40;                                               // the sea is painted down to here; the sand comes over its near edge

// ---------------------------------------------------------------- the water
const sea = (x, y) => {
  const t = clamp((y - HORIZON) / (END - HORIZON), 0, 1), up = HORIZON - 6 - (y - HORIZON) * 1.9;   // the place of the sky that shows here
  let c = mix(skyColor(x + (nB(x / 90, y / 7) - 0.5) * 60, Math.max(20, up)), '#2a2a56', 0.3 + 0.24 * t);
  c = mix(c, '#221f48', smooth(0.5, 0.62, nA(x / 260, y / (5 + 16 * t))) * (0.14 + 0.3 * t));       // the dark sides of the low waves
  return mix(c, '#ffd27c', Math.exp(-Math.pow((x - SUN.x) / (40 + (y - HORIZON) * 1.0), 2)) * (0.5 - 0.2 * t));   // the path of the sun, under all
};
for (const [y0, y1, w, len] of [[HORIZON - 2, 540, 5.5, 60], [532, 620, 8, 100], [612, END + 4, 11, 150]]) p.fill({ bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: sea, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, END], width: 5.5, length: 50, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => sea(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.78 } });
// The path of the sun: level touches of light, small and close far off, long and apart near us; a few lie far out to each side.
for (let k = 0; k < 760; k++) {
  const t = Math.pow(r(), 1.5), y = HORIZON + 3 + t * (END - HORIZON - 6), half = 22 + (y - HORIZON) * 0.95, x = SUN.x + r.gauss() * half * 0.62, len = Math.max(12.4, (8 + 60 * t) * r.range(0.6, 1.5)), b = Math.exp(-Math.pow((x - SUN.x) / half, 2));
  p.tryStroke({ brush: 'round', color: mix('#ffb85c', '#fffbe0', b * r.range(0.5, 1)), width: t > 0.5 && r() < 0.4 ? 5.5 : 4, opacity: 0.3 + 0.65 * b * r.range(0.6, 1), taper: [0.5, 0.5], points: [[x - len / 2, y], [x + len / 2, y + r.range(-0.6, 0.6)]] });
}
for (let k = 0; k < 150; k++) { const y = HORIZON + 6 + Math.pow(r(), 1.3) * (END - HORIZON - 10), x = r.range(0, W), len = r.range(14, 60) * (0.5 + (y - HORIZON) / 200); p.tryStroke({ brush: 'round', color: mix('#e89478', '#ffd8a0', glare(x, y, 600)), width: 4, opacity: r.range(0.12, 0.4), taper: [0.5, 0.5], points: [[x, y], [x + len, y + r.range(-0.8, 0.8)]] }); }
// The sun's own light, a little wider than the sun, in the water just under it.
for (const [w, op] of [[90, 0.14], [50, 0.2]]) glow(p, SUN.x, HORIZON + 8, w, '#fff2c0', op, 6, 0.3);

// ---------------------------------------------------------------- the low island far off at the right
{ const top = (x) => HORIZON - 3 - 20 * Math.exp(-Math.pow((x - 1380) / 90, 2)) - 12 * Math.exp(-Math.pow((x - 1500) / 50, 2)) + 3 * (nC(x / 20, 7) - 0.5);
  p.fill({ inside: (x, y) => x > 1240 && x < 1580 && y > top(x) && y < HORIZON + 3, bounds: [1240, 436, 1580, HORIZON + 3], width: 5.5, length: 44, spacing: 0.5, angle: () => r.range(-0.05, 0.05), color: (x, y) => far('#3a2c5c', x, y, 0.5), stroke: { ...line, opacity: 0.95 } }); }

// ---------------------------------------------------------------- the hill of the island
p.fill({ inside: (x, y) => x < 660 && y > hillTop(x) && y < HORIZON + 4, bounds: [0, 290, 660, HORIZON + 4], width: 8, length: 28, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.8, 0.8),
  color: (x, y) => { const wood = nA(x / 26, y / 20); let c = mix('#1e1a3c', '#322c58', wood); c = mix(c, '#5a4064', smooth(40, 0, y - hillTop(x)) * 0.5 * smooth(60, 520, x)); return far(c, x, y, 0.12 + 0.14 * smooth(HORIZON - 50, HORIZON, y)); }, stroke: { ...line, rag: 0.45, opacity: 0.96 } });   // it is all trees: short strokes that lie every way
{ const pts = []; for (let x = 200; x <= 640; x += 8) pts.push([x, hillTop(x) + 2]); studio.glint(p, pts, () => mix('#f08a5c', '#ffd890', r()), { width: 4.4, dash: 30, gap: 20, opacity: 0.6, rng: r }); }   // the last light along its top, on the side toward the sun
// the harbour at its foot: a few lamps, and each one again in the water
for (let k = 0; k < 22; k++) { const x = r.range(250, 640), y = HORIZON - r.range(2, 20); p.tryStroke({ brush: 'round', color: mix('#ffd890', '#fff4d8', r()), width: 4, opacity: r.range(0.35, 0.8), taper: [0.55, 0.55], points: [[x - 6.2, y], [x + 6.2, y]] }); }
for (let k = 0; k < 9; k++) { const x = r.range(260, 640), y = HORIZON + r.range(5, 16); p.tryStroke({ brush: 'round', color: '#f4c880', width: 4, opacity: 0.3, taper: [0.5, 0.5], points: [[x - 8, y], [x + 8, y]] }); }   // and a little of their light on the water, in level touches

// ---------------------------------------------------------------- the sea wall, and the heap of blocks
// The wall: a long low bar of concrete from the left, with the light along its top.
p.tryStroke({ ...line, cap: 'flat', rag: 0.1, color: '#2c2644', width: 26, points: [[-20, 548], [220, 544], [452, 540]] });
p.tryStroke({ ...line, cap: 'flat', rag: 0.1, color: '#e89868', width: 5, opacity: 0.85, points: [[-20, 535], [220, 531], [452, 527]] });
// A block: four thick short legs from one middle, of grey concrete. We see three of them. Each leg is nearly as thick as it is long,
// with a flat end; its upper side has the warm light of the sky, and the rest is in shade.
function block(x, y, s, turn) {
  p.tryStroke({ brush: 'soft', color: '#120e22', width: Math.max(12, s * 0.5), opacity: 0.5, points: [[x - s * 0.9, y + s * 0.34], [x, y + s * 0.44], [x + s * 0.9, y + s * 0.34]] });
  for (const [a, k] of [[-2.6 + turn, 0.92], [-0.55 + turn, 0.92], [-1.57 + turn * 0.6, 0.86]]) {
    const ex = x + Math.cos(a) * s * k, ey = y + Math.sin(a) * s * k * 0.8, w = s * 0.46, nx = -Math.sin(a), ny = Math.cos(a), up = ny < 0 ? 1 : -1;   // the side of the leg that is turned up
    p.tryStroke({ ...line, cap: 'flat', rag: 0.06, mix: 0.04, color: mix('#332e4c', '#474060', r()), width: w, points: [[x, y], [ex, ey]] });
    if (Math.abs(Math.sin(a)) < 0.9) p.tryStroke({ ...line, cap: 'flat', rag: 0.06, color: mix('#6c5870', '#94707c', r()), width: Math.max(5, w * 0.3), opacity: 0.8, points: [[x + nx * up * w * 0.32 + (ex - x) * 0.2, y + ny * up * w * 0.32 + (ey - y) * 0.2], [ex + nx * up * w * 0.32, ey + ny * up * w * 0.32]] });
    else p.tryStroke({ brush: 'round', color: '#e89868', width: 4, opacity: 0.6, points: [[ex - w * 0.4, ey - 2], [ex + w * 0.4, ey - 2]] });   // the flat end of the leg that stands up takes the last light
  }
}
const blocks = []; for (let k = 0; k < 17; k++) { const t = r(), x = -10 + r.range(0, 440) * (1 - 0.15 * t), y = 560 + t * 76 + r.range(-6, 6); blocks.push([x, y, 44 + t * 30 + r.range(-4, 8), r.range(-0.45, 0.45)]); }
blocks.sort((a, b) => a[1] - b[1]).forEach((b) => block(...b));

p.save();
