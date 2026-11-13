// The near hill. We stand on its shaded side: the grass is dark, but the sun comes low over
// the crest and catches the tips of the blades, most of all straight below it.
'use strict';
const { studio, open, W, H, SUN, hillTop, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('hill');
const r = p.rng;

const slope = (x) => Math.atan2(hillTop(x + 14) - hillTop(x - 14), 28);
const under = (x, wide = 330) => Math.exp(-Math.pow((x - SUN.x) / wide, 2));   // 1 straight below the sun
function grass(x, y) {
  const depth = clamp((y - hillTop(x)) / 280, 0, 1);                // 0 at the crest, 1 at our feet
  let c = mix(mix('#2a4c34', '#35583a', nA(x / 60, y / 26)), mix('#132a22', '#1c3628', nA(x / 50, y / 30)), smooth(0, 0.8, depth));
  c = mix(c, '#6f8a3e', 0.5 * under(x) * (1 - smooth(0, 0.5, depth)));           // light skimming the top of the hill
  return mix(c, '#0e1c1c', 0.55 * smooth(0.5, 1, depth) * (smooth(620, 0, x) + smooth(1100, 1600, x)));   // the corners are darker still
}

const on = (m) => (x, y) => y > hillTop(x) + m;
p.fill({ inside: on(20), bounds: [-20, 690, W + 20, H + 10], width: 42, length: 220, spacing: 0.5, angle: (x, y) => slope(x) * clamp(1 - (y - hillTop(x)) / 240, 0, 1) + (nB(x / 90, y / 50) - 0.5) * 0.25, color: grass, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.05 } });
p.fill({ inside: on(10), bounds: [-20, 690, W + 20, H + 10], width: 20, length: 120, spacing: 0.7, overlap: 0.7, angle: (x, y) => slope(x) * clamp(1 - (y - hillTop(x)) / 240, 0, 1) + (nB(x / 60, y / 30) - 0.5) * 0.5, color: (x, y) => grass(x + r.range(-12, 12), y + r.range(-8, 8)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.12 } });
for (let x = -30; x < W + 10; x += 120) {                            // a firm crest
  const pts = [];
  for (let k = 0; k <= 7; k++) pts.push([x + k * 19, hillTop(x + k * 19) + 7]);
  p.stroke({ brush: 'bristle', color: grass(x + 66, hillTop(x + 66) + 8), width: 14, mix: 0.05, dry: 0, rag: 0.05, points: pts });
}

// Blades of grass, leaning with the wind. Most are dark. The ones the sun reaches are lit
// through: yellow-green, nearly gold below the sun.
function blade(x, y, h, color, w, o = 1) {
  const lean = (0.18 + r.range(-0.2, 0.3)) * h;
  return p.tryStroke({ color, width: w, opacity: o, taper: [0, 0.75], points: [[x, y], [x + lean * 0.35, y - h * 0.62], [x + lean, y - h]] });
}
const lit = (x, depth = 0) => mix(mix(mix('#4f7436', '#7fa244', r()), mix('#e2d86a', '#fff2a8', r()), clamp(under(x, 280) * 1.2 - r() * 0.3, 0, 1)), '#3c6034', 0.6 * depth);
for (let x = -4; x < W + 4; x += r.range(4, 10)) {                   // the fringe along the crest, against the pale plain
  if (nB(x / 46, 21) < 0.3) { x += r.range(6, 24); continue; }
  const sun = r() < (0.15 + 0.6 * under(x)) * (0.35 + 1.1 * nA(x / 26, 9));
  blade(x, hillTop(x) + 6, r.range(12.5, 24), sun ? lit(x) : mix('#1c3a2a', '#2c5034', r()), r.range(4, 5), sun ? 0.95 : 1);
}
for (let k = 0; k < 1000; k++) {
  const x = r.range(-10, W + 10), depth = Math.pow(r(), 0.8), y = hillTop(x) + 14 + depth * (H - hillTop(x));
  if (y > H + 16 || nC(x / 70, y / 40) < 0.3) continue;
  const h = 14 + depth * 34 * r.range(0.6, 1.2), sun = r() < (0.03 + 0.42 * under(x, 380)) * Math.pow(1 - depth, 1.6);
  blade(x, y, h, sun ? lit(x, depth) : mix(grass(x, y), r() < 0.5 ? '#0f201c' : '#34583a', 0.55), 4 + depth * 3 * r(), sun ? 0.85 : 0.9);
}

p.save();
