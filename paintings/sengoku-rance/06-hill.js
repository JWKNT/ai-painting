// The near hill: sunlit grass laid in broad strokes, then blades of grass, a few flowers
// and the petals that have already come down.
'use strict';
const { studio, open, W, H, hillTop, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('hill');
const r = p.rng;

const slope = (x) => Math.atan2(hillTop(x + 14) - hillTop(x - 14), 28);
function grass(x, y) {
  const depth = clamp((y - hillTop(x)) / 280, 0, 1);                // 0 at the crest, 1 at our feet
  let c = mix(mix('#78b84a', '#96cb5a', nA(x / 60, y / 26)), mix('#3f8234', '#55993c', nA(x / 50, y / 30)), smooth(0, 0.9, depth));
  c = mix(c, '#b7dc6a', 0.4 * smooth(600, 1500, x) * (1 - depth));  // more sun toward the right, near the crest
  return mix(c, '#2c6229', 0.5 * smooth(0.55, 1, depth) * smooth(700, 0, x));   // the corner under the branches is darker
}

const on = (m) => (x, y) => y > hillTop(x) + m;
p.fill({ inside: on(20), bounds: [-20, 690, W + 20, H + 10], width: 42, length: 220, spacing: 0.5, angle: (x, y) => slope(x) * clamp(1 - (y - hillTop(x)) / 240, 0, 1) + (nB(x / 90, y / 50) - 0.5) * 0.25, color: grass, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.05 } });
p.fill({ inside: on(10), bounds: [-20, 690, W + 20, H + 10], width: 20, length: 120, spacing: 0.7, overlap: 0.7, angle: (x, y) => slope(x) * clamp(1 - (y - hillTop(x)) / 240, 0, 1) + (nB(x / 60, y / 30) - 0.5) * 0.5, color: (x, y) => grass(x + r.range(-12, 12), y + r.range(-8, 8)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.12 } });
for (let x = -30; x < W + 10; x += 120) {                            // a firm crest
  const pts = [];
  for (let k = 0; k <= 7; k++) pts.push([x + k * 19, hillTop(x + k * 19) + 7]);
  p.stroke({ brush: 'bristle', color: grass(x + 66, hillTop(x + 66) + 8), width: 14, mix: 0.05, dry: 0, rag: 0.05, points: pts });
}

// Blades of grass: small and pale along the crest, long and dark toward us, all leaning with the wind.
function blade(x, y, h, color, w, o = 1) {
  const lean = (0.18 + r.range(-0.2, 0.3)) * h;
  return p.tryStroke({ color, width: w, opacity: o, taper: [0, 0.75], points: [[x, y], [x + lean * 0.35, y - h * 0.62], [x + lean, y - h]] });
}
for (let x = -4; x < W + 4; x += r.range(4, 11)) {                   // the fringe along the crest
  if (nB(x / 46, 21) < 0.34) { x += r.range(6, 24); continue; }
  blade(x, hillTop(x) + 6, r.range(12.5, 22), mix('#5fa23c', '#a8d860', r()), r.range(4, 5));
}
for (let k = 0; k < 900; k++) {
  const x = r.range(-10, W + 10), depth = Math.pow(r(), 0.8), y = hillTop(x) + 14 + depth * (H - hillTop(x));
  if (y > H + 16 || nC(x / 70, y / 40) < 0.3) continue;
  const h = 14 + depth * 34 * r.range(0.6, 1.2), light = r();
  blade(x, y, h, light > 0.72 ? mix('#9fd05a', '#d0ea82', r()) : mix(grass(x, y), light > 0.3 ? '#2f6a2a' : '#6fb044', 0.55), 4 + depth * 3 * r(), 0.9);
}

// Small flowers in the grass, and fallen petals.
for (let k = 0; k < 44; k++) {
  const x = r.range(0, W), depth = Math.pow(r(), 0.7), y = hillTop(x) + 24 + depth * (H - hillTop(x) - 20), a = r.range(-0.8, 0.8), len = 12.4 + depth * 5;
  if (y > H - 4) continue;
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: r.pick(['#fff7d6', '#ffe36a', '#ffffff', '#ffd0df', '#f8a8c4', '#ffd0df']), width: 4 + depth * 1.5, opacity: r.range(0.5, 0.85) });
}

p.save();
