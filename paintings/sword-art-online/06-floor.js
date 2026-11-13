// The floor of glass they sit on, high above the clouds. We see the clouds through it, a
// little darker, and on it the low sky lies in long level reflections: gold below the sun,
// rose and violet elsewhere. Its far edge is a thin bright line.
'use strict';
const { studio, open, W, H, SUN, HORIZON, KIRITO, ASUNA, skyColor, floorEdge } = require('./scene');
const { mix, clamp, glint, wave } = studio;

const p = open('floor');
const r = p.rng;
const under = (x) => Math.exp(-Math.pow((x - SUN.x) / 240, 2));       // 1 straight below the sun

// The glass darkens what lies under it.
for (let k = 0; k < 4; k++) {
  const y = 930 + k * 26;
  p.stroke({ brush: 'soft', color: '#241f52', width: 110, opacity: 0.16, points: wave(-80, y, W + 80, y + 14, 6, 1.5, 12) });
}

// The sky in the glass: each mark takes its color from the sky as far above the horizon as
// the mark is below the edge of the floor.
for (let k = 0; k < 150; k++) {
  const x = r.range(-40, W + 40), y = floorEdge(x) + 8 + Math.pow(r(), 1.4) * (H - floorEdge(x)), len = r.range(120, 420) * (0.5 + (y - 870) / 160);
  const sky = skyColor(x + r.range(-40, 40), HORIZON - 30 - (y - floorEdge(x)) * 3.2);
  p.stroke({ brush: 'bristle', color: mix(sky, '#fff0c8', under(x) * 0.35), width: Math.max(4.6, r.range(5, 10) * (0.7 + (y - 870) / 200)), opacity: r.range(0.12, 0.3) + 0.14 * under(x), mix: 0.3, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: [[x - len / 2, y + (floorEdge(x - len / 2) - floorEdge(x))], [x, y], [x + len / 2, y + (floorEdge(x + len / 2) - floorEdge(x))]] });
}
// The sun in it: a path of light coming toward us.
for (const [w, o] of [[150, 0.1], [80, 0.14]]) p.stroke({ brush: 'soft', color: '#ffe0a8', width: w, opacity: o, taper: [0, 0.4], points: [[SUN.x + 14, floorEdge(SUN.x) - 30], [SUN.x - 30, 980], [SUN.x - 90, H + 230]] });
for (let k = 0; k < 26; k++) {
  const y = floorEdge(SUN.x) + 6 + r() * 120, x = SUN.x - (y - 880) * 0.3 + r.range(-60, 60) * (0.4 + (y - 880) / 120), len = r.range(16, 54);
  p.tryStroke({ color: mix('#ffd9a0', '#fffbe8', r()), width: 4, opacity: r.range(0.35, 0.8), points: [[x - len / 2, y], [x + len / 2, y + 0.4]] });
}

// The two who sit on it, mirrored: dark shapes going down into the glass.
for (const [f, w, len] of [[KIRITO, 66, 140], [ASUNA, 58, 126]]) {
  p.stroke({ brush: 'soft', color: '#1c183c', width: w, opacity: 0.26, taper: [0, 0.5], points: [[f.x, f.y - 6], [f.x - 2, f.y + len * 0.5], [f.x - 4, f.y + len]] });
}

// Its far edge: the thickness of the glass as a dark line, and the light along its top.
const edge = [];
for (let x = -20; x <= W + 20; x += 40) edge.push([x, floorEdge(x)]);
p.stroke({ brush: 'bristle', color: '#2a2458', width: 5, opacity: 0.5, mix: 0.2, dry: 0.05, rag: 0, points: edge.map(([x, y]) => [x, y + 3.5]) });
for (let x = -20; x < W; x += 180) {
  const seg = [[x, floorEdge(x)], [x + 95, floorEdge(x + 95)], [x + 190, floorEdge(x + 190)]];
  glint(p, seg, () => mix(mix('#b8a8dc', '#f0c8d0', r()), '#fff4d0', clamp(under(x + 95) * 1.2, 0, 1)), { width: 4.2, dash: 90, gap: 12, opacity: 0.55 + 0.4 * under(x + 95), rng: r });
}

p.save();
