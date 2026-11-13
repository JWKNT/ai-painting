// The sky: level strokes graded from indigo to gold, a few early stars, the low sun, and
// long clouds, violet above and burning orange underneath.
'use strict';
const { studio, open, W, SUN, SEA, skyColor, nA, nB } = require('./scene');
const { shift, mix, wave, arc, disc, clamp } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 320, y / 150) - 0.5) * 0.45;

p.fill({
  bounds: [0, 0, W, SEA + 8], width: 46, length: 320, spacing: 0.55, overlap: 0.55, angle: level,
  color: (x, y) => shift(skyColor(x, y), r.range(-5, 5), r.range(-0.03, 0.05), r.range(-0.012, 0.016)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 },
});
p.fill({
  bounds: [0, 0, W, SEA], width: 24, length: 180, spacing: 0.9, overlap: 0.7, angle: level,
  color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-16, 16)), r.range(-10, 10), r.range(-0.02, 0.08), r.range(-0.015, 0.025)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 },
});
for (let k = 0; k < 9; k++) {
  const y = 40 + k * 62 + r.range(-10, 10);
  p.stroke({ brush: 'blend', width: 80, opacity: 0.4, points: wave(-40, y, W + 40, y + r.range(-16, 16), 12, 2.5, 14) });
}

// The first stars, high up.
for (let k = 0; k < 46; k++) {
  const x = r.range(0, W), y = Math.pow(r(), 1.8) * 250 + 6, a = r.range(-0.4, 0.4), len = r.range(12.4, 15);
  p.line(x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2, x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2, { color: r.pick(['#fff6e0', '#e6e9ff', '#ffe9c8']), width: 4, opacity: r.range(0.25, 0.75) * (1 - y / 320) });
}

// The sun: a wide glow, a ring, the disc, hotter at its heart.
for (const [w, color, o] of [[330, '#f7a04e', 0.24], [220, '#ffc060', 0.34], [130, '#ffd98a', 0.45]]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 10], [SUN.x, SUN.y - 6], [SUN.x + w * 1.05, SUN.y + 10]] });
}
p.stroke({ brush: 'soft', color: '#ffe7a8', width: 100, opacity: 0.6, points: arc(SUN.x, SUN.y, 104, 1, 1 + 6.283, 30) });
disc(p, SUN.x, SUN.y, SUN.r, '#ffe9a6', 22, { hardness: 0.7 });
p.stroke({ brush: 'soft', color: '#fff8d8', width: 42, opacity: 0.75, points: arc(SUN.x - 4, SUN.y - 6, 44, 0.5, 0.5 + 6.283, 20) });
p.stroke({ brush: 'soft', color: '#fffdf0', width: 40, opacity: 0.8, points: [[SUN.x - 46, SUN.y - 4], [SUN.x - 4, SUN.y - 10], [SUN.x + 38, SUN.y - 4]] });

// Clouds: long bars drawn out by the wind. Each is a few ragged strokes of violet laid
// along one line, darker along the top, with fire along the belly where the sun reaches.
function cloud(x, y, len, thick, tilt) {
  const near = clamp(1 - Math.hypot(x + len / 2 - SUN.x, y - SUN.y) / 760, 0, 1);       // how much the sun reaches it
  const bar = (x0, x1, dy, w, color, o) => {
    const mid = (x0 + x1) / 2, bow = r.range(-0.5, 0.5) * w;
    p.tryStroke({ brush: 'bristle', color, width: w, opacity: o, taper: [0.5, 0.5], mix: 0.22, rag: 0.4, dry: 0.1, points: [[x0, y + dy + (x0 - x) * tilt], [mid, y + dy + (mid - x) * tilt + bow], [x1, y + dy + (x1 - x) * tilt]] });
  };
  const n = 3 + Math.round(len / 190);
  for (let k = 0; k < n; k++) {                                                          // the body, in overlapping pieces
    const a = x + len * r.range(0, 0.45), b = Math.min(x + len, a + len * r.range(0.4, 0.75));
    bar(a, b, r.range(-0.3, 0.3) * thick, thick * r.range(0.6, 1), mix(mix('#34285e', '#4a3170', r()), '#80406c', near), 0.92);
  }
  for (let k = 0; k < 2; k++) {                                                          // the dark crest
    const a = x + len * r.range(0.05, 0.4), b = Math.min(x + len, a + len * r.range(0.35, 0.6));
    bar(a, b, -thick * r.range(0.3, 0.5), thick * 0.5, mix('#221b47', '#48295a', near), 0.9);
  }
  for (let k = 0; k < n; k++) {                                                          // the lit belly
    const a = x + len * r.range(0, 0.5), b = Math.min(x + len, a + len * r.range(0.3, 0.6));
    bar(a, b, thick * r.range(0.3, 0.55), Math.max(6, thick * r.range(0.3, 0.45)), mix('#a84c7c', '#ff9c50', near), 0.5 + 0.45 * near);
  }
  if (near > 0.4) bar(x + len * 0.15, x + len * 0.85, thick * 0.62, Math.max(4.4, thick * 0.16), '#ffd88a', 0.85 * near);
}
for (const [x, y, len, thick, tilt] of [
  [-60, 296, 560, 40, -0.015], [330, 352, 420, 28, -0.02], [40, 424, 400, 24, -0.005], [540, 246, 520, 32, -0.03], [930, 304, 500, 36, 0.012], [1250, 236, 440, 30, 0.03],
  [730, 398, 300, 20, -0.015], [1290, 396, 360, 26, 0.02], [400, 474, 320, 17, -0.01], [1340, 470, 300, 18, 0.008], [-40, 176, 440, 30, -0.02], [1100, 150, 520, 28, 0.03], [640, 150, 360, 22, 0.01],
]) cloud(x, y, len, thick, tilt);

p.save();
