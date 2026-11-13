// The sky: long level strokes over the underpainting, the sun in its haze, and clouds built
// from rounded strokes, bright where the sun reaches them and blue beneath.
'use strict';
const { studio, open, W, SUN, HORIZON, skyColor, nB, nC } = require('./scene');
const { shift, arc, mix, wave, disc, clamp } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 160) - 0.5) * 0.7;

p.fill({
  bounds: [0, 0, W, HORIZON + 10], width: 46, length: 300, spacing: 0.55, overlap: 0.55, angle: level,
  color: (x, y) => shift(skyColor(x, y), r.range(-4, 4), r.range(-0.03, 0.05), r.range(-0.012, 0.016)),
  stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3 },
});
p.fill({
  bounds: [0, 0, W, HORIZON], width: 24, length: 170, spacing: 0.9, overlap: 0.7, angle: level,
  color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-20, 20)), r.range(-8, 8), r.range(-0.02, 0.07), r.range(-0.015, 0.025)),
  stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 },
});

// A clean brush drawn across the bands, so the blue grades smoothly.
for (let k = 0; k < 9; k++) {
  const y = 40 + k * 56 + r.range(-10, 10);
  p.stroke({ brush: 'blend', width: 80, opacity: 0.45, points: wave(-40, y, W + 40, y + r.range(-20, 20), 16, 2.5, 14) });
}

// The sun: haze, a ring of glow, the disc.
for (const [w, color, o] of [[300, '#fff0cc', 0.2], [190, '#fff4d8', 0.3], [110, '#fff8e4', 0.42]]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: o, points: [[SUN.x - w * 1.05, SUN.y + 8], [SUN.x, SUN.y - 6], [SUN.x + w * 1.05, SUN.y + 8]] });
}
p.stroke({ brush: 'soft', color: '#fffbe9', width: 60, opacity: 0.6, points: arc(SUN.x, SUN.y, 60, 1, 1 + 6.283, 22) });
disc(p, SUN.x, SUN.y, SUN.r, '#fffdf2', 12, { hardness: 0.6 });
p.stroke({ brush: 'soft', color: '#ffffff', width: 30, opacity: 0.7, points: arc(SUN.x, SUN.y, 30, 2, 2 + 6.283, 16) });

// A cloud is a heap of puffs with a flat floor. It is filled with short strokes, white
// where a puff faces the sun, blue-grey low down and on the far side. Then each crown gets a bright edge, and the floor is softened.
function cloud(puffs, base) {
  const xs = puffs.map(([cx, , rad]) => [cx - rad, cx + rad]).flat(), top = Math.min(...puffs.map(([, cy, rad]) => cy - rad));
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const deepest = (x, y) => {
    let best = null, depth = -Infinity;
    for (const q of puffs) { const d = q[2] - Math.hypot(x - q[0], y - q[1]); if (d > depth) { depth = d; best = q; } }
    return [best, depth];
  };
  const inside = (m) => (x, y) => y < base - m * 0.4 && deepest(x, y)[1] > m;
  const sl = Math.hypot(SUN.x - (x0 + x1) / 2, SUN.y - top), lx = (SUN.x - (x0 + x1) / 2) / sl, ly = (SUN.y - top) / sl;
  const shade = (x, y) => {
    const [[cx, cy, rad]] = deepest(x, y);
    const facing = ((x - cx) * lx + (y - cy) * ly) / rad, low = clamp((y - top) / (base - top), 0, 1);
    const light = clamp(0.62 + 0.55 * facing - 0.75 * low * low + (nC(x / 40, y / 40) - 0.5) * 0.25, 0, 1);
    return mix(mix('#8fa8cf', '#c3d2e8', smooth01(light * 2)), mix('#eef3fa', '#fffdf6', smooth01(light * 2 - 1)), smooth01(light * 1.6 - 0.3));
  };
  // strokes lie in broad arcs over the whole heap, not in rings around each puff
  const turn = (x, y) => Math.atan2(y - (base + (base - top) * 1.3), x - (x0 + x1) / 2) + Math.PI / 2 + (nB(x / 50, y / 50) - 0.5) * 0.9;
  const box = [x0, top, x1, base];
  p.fill({ inside: inside(13), bounds: box, width: 28, length: 84, spacing: 0.42, overlap: 0.5, angle: turn, color: shade, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.25, rag: 0.2, dry: 0.04 } });
  p.fill({ inside: inside(8), bounds: box, width: 15, length: 52, spacing: 0.7, overlap: 0.7, angle: turn, color: (x, y) => shade(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.3, rag: 0.2 } });
  // crowns: the part of each puff's rim that is the outline of the cloud and faces the sun
  for (const [cx, cy, rad] of puffs) {
    let runPts = [];
    const flush = () => { if (runPts.length >= 3) p.tryStroke({ brush: 'bristle', color: '#ffffff', width: Math.max(10, Math.min(20, rad * 0.26)), opacity: 0.7, mix: 0.35, rag: 0.25, dry: 0.1, points: runPts }); runPts = []; };
    for (let a = -Math.PI; a <= 0.2; a += 0.12) {
      const x = cx + Math.cos(a) * (rad - 6), y = cy + Math.sin(a) * (rad - 6);
      const outer = !puffs.some((q) => q[0] !== cx && Math.hypot(x - q[0], y - q[1]) < q[2] - 9);
      if (outer && y < base - 10 && Math.cos(a) * lx + Math.sin(a) * ly > -0.15) runPts.push([x, y]); else flush();
    }
    flush();
  }
  p.stroke({ brush: 'blend', width: 44, opacity: 0.55, points: wave(x0 + 10, base - 4, x1 - 10, base - 2, 4, 2, 10) });
  p.stroke({ brush: 'soft', color: '#8ea8d0', width: 38, opacity: 0.3, points: wave(x0 + 30, base + 8, x1 - 30, base + 8, 3, 1.5, 8) });
}
const smooth01 = (t) => { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };

cloud([[150, 236, 62], [250, 196, 86], [372, 150, 112], [498, 190, 92], [600, 232, 64], [330, 232, 84], [450, 240, 70]], 268);
cloud([[1420, 356, 50], [1486, 326, 66], [1560, 352, 52], [1610, 372, 40]], 388);
cloud([[736, 322, 34], [786, 306, 44], [842, 324, 32]], 342);

// Thin streaks of cloud low in the sky.
for (let k = 0; k < 12; k++) {
  const x = r.range(-60, W - 200), y = r.range(400, 486), len = r.range(220, 460);
  p.stroke({ brush: 'soft', color: mix('#ffffff', '#fff3dc', r()), width: r.range(16, 30), opacity: r.range(0.18, 0.4), taper: [0.4, 0.4], points: wave(x, y, x + len, y + r.range(-6, 6), 3, 1, 7) });
}

p.save();
