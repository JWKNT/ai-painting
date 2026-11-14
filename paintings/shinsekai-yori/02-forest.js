// The forest: old cedars, close together, whose trunks go straight up out of the picture.
// Between them is mist, and the light goes through the mist in rays, each of its own color.
// The far trunks are thin and pale in the mist; nearer ones are dark, and each has the
// color of the ray that falls on it along the side that is toward the creature. The floor
// is moss and old needles, and takes the colors too.
'use strict';
const { studio, open, W, H, SRC, GROUND, nA, nB, nC, hash, rayColor, angleFrom, dist, beam, reach, dark, lit } = require('./scene');
const { mix, clamp, smooth, through } = studio;

const p = open('forest');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.2, dry: 0.03, rag: 0.25, cap: 'round' };
const outward = (x, y) => angleFrom(x, y);

// The mist between the trees, with the rays in it: every stroke goes straight out from the creature.
p.fill({ bounds: [0, 0, W, H], width: 34, length: 260, spacing: 0.5, overlap: 0.55, angle: outward, color: (x, y) => lit(x + r.range(-10, 10), y + r.range(-10, 10), 0.75), stroke: { ...line, opacity: 0.92 } });
p.fill({ bounds: [0, 0, W, H], width: 14, length: 200, spacing: 1.0, overlap: 0.7, angle: outward, color: (x, y) => lit(x + r.range(-8, 8), y + r.range(-8, 8), 0.9), stroke: { ...line, opacity: 0.7, taper: [0.3, 0.5] } });

// The floor of the forest: it rises a little to each side, and it is darker near us.
const floor = through([[0, 660], [300, 684], [700, 702], [1100, 700], [1400, 676], [1600, 650]]);
const moss = (x, y) => { let c = mix(mix('#06100a', '#122216', nC(x / 60, y / 14)), '#020504', smooth(760, 1000, y) * 0.6); return mix(c, rayColor(angleFrom(x, y)), clamp(reach(x, y, 420) * beam(x, y) * 0.8, 0, 0.75) * (0.6 + 0.4 * nB(x / 30, y / 8))); };
p.fill({ inside: (x, y) => y > floor(x), bounds: [0, 640, W, H], width: 8, length: 70, spacing: 0.5, angle: (x, y) => { const a = outward(x, y); return Math.atan2(Math.sin(a) * 0.3, Math.cos(a)); }, color: moss, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: (x, y) => y > floor(x) + 4, bounds: [0, 640, W, H], width: 5.5, length: 40, spacing: 1.0, overlap: 0.7, angle: (x, y) => { const a = outward(x, y); return Math.atan2(Math.sin(a) * 0.3, Math.cos(a)); }, color: (x, y) => moss(x + r.range(-6, 6), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.8 } });

// A trunk: it stands at x on the floor, so wide, and goes up out of the picture. `far` is 1 for one deep in the mist and 0 for one near us.
function trunk(x, w, far) {
  const foot = floor(clamp(x, 0, W)) + 14 + (1 - far) * 60, side = x < SRC.x ? 1 : -1;
  const bark = (px, py) => { const u = (px - x) / (w / 2), rib = nC(px / 7, py / 180); let c = mix('#030605', '#0e1612', rib); c = mix(c, dark(px, py), far * 0.75); const k = clamp(side * u * 0.8 + 0.2, 0, 1) * reach(px, py, 620) * beam(px, py); return mix(c, rayColor(angleFrom(px, py)), clamp(k * (1.1 - far * 0.5), 0, 0.85)); };
  p.fill({ inside: (px, py) => Math.abs(px - x) < w / 2 + (py > foot - 40 ? (py - foot + 40) * 0.3 : 0) && py < foot, bounds: [x - w / 2 - 20, -10, x + w / 2 + 20, foot], width: clamp(w * 0.16, 5.5, 14), length: clamp(w * 2.4, 60, 260), spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: bark, stroke: { ...line, mix: 0.1, opacity: 0.97 } });
  if (w > 40) for (let y = r.range(0, 60); y < foot - 60; y += r.range(140, 300)) { const a = angleFrom(x + side * w * 0.44, y), k = reach(x, y, 620) * beam(x + side * w * 0.44, y), len = r.range(60, 190); if (k > 0.2) p.tryStroke({ brush: 'round', color: mix(rayColor(a), '#ffffff', 0.25), width: 4.4, opacity: clamp(k * 0.9, 0, 0.6), taper: [0.5, 0.5], points: [[x + side * (w / 2 - 2), y], [x + side * (w / 2 - 2), Math.min(foot - 20, y + len)]] }); }   // the brightest of the light, here and there along its edge
}
const trunks = [];
for (let k = 0; k < 26; k++) trunks.push([r.range(-20, W + 20), r.range(14, 30), 1]);
for (let k = 0; k < 15; k++) { const x = r.range(-20, W + 20); if (Math.abs(x - SRC.x) > 70) trunks.push([x, r.range(34, 60), 0.55]); }
for (const x of [150, 420, 610, 1260, 1470]) trunks.push([x + r.range(-20, 20), r.range(70, 104), 0.2]);
trunks.sort((a, b) => b[2] - a[2]);
for (const [x, w, far] of trunks) trunk(x, w, far);
// Mist that lies low among the far trunks.
for (let k = 0; k < 16; k++) { const x = r.range(-100, W - 200), len = r.range(300, 600), y = r.range(560, 690); p.stroke({ brush: 'soft', color: mix('#3c5c58', rayColor(angleFrom(x + len / 2, y)), 0.5 * reach(x + len / 2, y, 500)), width: r.range(24, 46), opacity: r.range(0.08, 0.16), points: [[x, y], [x + len / 2, y + r.range(-5, 5)], [x + len, y]] }); }

p.save();
