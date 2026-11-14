// What is near us: two great trunks, one at each side, black, with the colors along their
// inner edges; ferns on the forest floor, dark, each frond with the color of its ray on its
// upper side; and small things in the air, seeds or dust, which the light finds.
'use strict';
const { studio, open, W, H, SRC, rayColor, angleFrom, reach, beam, nC } = require('./scene');
const { mix, clamp } = studio;

const p = open('near');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.03, rag: 0.2, cap: 'round' };

// ---------------------------------------------------------------- dust in the light
for (let k = 0; k < 64; k++) {
  const a = r.range(0, Math.PI * 2), d = r.range(60, 620), x = SRC.x + Math.cos(a) * d, y = SRC.y + Math.sin(a) * d * 0.8;
  if (x < 0 || x > W || y < 0 || y > H) continue;
  const k2 = reach(x, y, 560) * beam(x, y);
  if (k2 < 0.1) continue;
  p.tryStroke({ brush: 'round', color: mix(rayColor(angleFrom(x, y)), '#ffffff', 0.5), width: 4, opacity: clamp(k2 * 1.6, 0.15, 0.9), points: [[x - 6.2, y], [x + 6.2, y]] });
}

// ---------------------------------------------------------------- the two near trunks
for (const [x, w, side] of [[70, 220, 1], [1546, 240, -1]]) {
  p.fill({ inside: (px) => Math.abs(px - x) < w / 2, bounds: [x - w / 2, -10, x + w / 2, H + 10], width: 16, length: 280, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: (px, py) => { const u = (px - x) / (w / 2), rib = nC(px / 9, py / 220); const k = clamp(side * u - 0.55, 0, 0.45) / 0.45 * reach(px, py, 900) * beam(px, py); return mix(mix('#010302', '#070c09', rib), rayColor(angleFrom(px, py)), clamp(k * 1.2, 0, 0.7)); }, stroke: { ...line, opacity: 0.98 } });
  for (let y = r.range(0, 80); y < H; y += r.range(120, 260)) { const ex = x + side * (w / 2 - 3), k = reach(ex, y, 900) * beam(ex, y), len = r.range(70, 200); if (k > 0.12) p.tryStroke({ brush: 'round', color: mix(rayColor(angleFrom(ex, y)), '#ffffff', 0.3), width: 4.6, opacity: clamp(k * 1.4, 0, 0.85), taper: [0.5, 0.5], points: [[ex, y], [ex, y + len]] }); }
  for (let k = 0; k < 5; k++) { const bx = x + side * r.range(-w * 0.3, w * 0.4), by = r.range(40, H - 100); p.tryStroke({ ...line, color: '#000201', width: r.range(6, 10), opacity: 0.7, taper: [0.3, 0.3], points: [[bx, by], [bx + r.range(-6, 6), by + r.range(120, 300)]] }); }   // the deep furrows of its bark
}

// ---------------------------------------------------------------- the ferns
// A fern is fronds that go out from one place and bend over. Each frond is one long leaf, wide in its middle and thin at its end;
// it is dark, and the upper side of it has the color of the ray that falls on it.
function fern(x, y, s) {
  const n = 6 + Math.floor(r() * 4);
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (k / (n - 1) - 0.5) * 2.5 + r.range(-0.12, 0.12), len = s * r.range(0.8, 1.25), bend = Math.sign(Math.cos(a) || 1) * r.range(0.7, 1.2), pts = [];
    for (let i = 0; i <= 7; i++) { const t = i / 7, aa = a + bend * t * t; pts.push([x + Math.cos(a + bend * t * 0.5) * len * t, y + Math.sin(aa) * len * t * 0.9, 0.5 + 0.5 * Math.sin(Math.PI * Math.pow(t, 0.7))]); }
    const [mx, my] = pts[4], c = rayColor(angleFrom(mx, my)), k2 = clamp(reach(mx, my, 520) * beam(mx, my) * 1.6, 0, 0.85), w = Math.max(6, s * 0.17);
    p.tryStroke({ ...line, color: '#020604', width: w, taper: [0.2, 0.9], points: pts.map(([px, py]) => [px, py]) });
    if (k2 > 0.08) p.tryStroke({ ...line, color: mix('#0a1a0e', c, k2), width: Math.max(4.8, w * 0.5), opacity: 0.9, taper: [0.3, 0.9], points: pts.slice(1).map(([px, py]) => [px, py - w * 0.22]) });
  }
}
const ferns = [];
for (let k = 0; k < 34; k++) ferns.push([r.range(-20, W + 20), r.range(730, 1016)]);
ferns.sort((a, b) => a[1] - b[1]);
for (const [x, y] of ferns) if (Math.hypot(x - SRC.x, (y - SRC.y - 60) * 1.4) > 190) fern(x, y, 40 + (y - 700) * 0.42);

// ---------------------------------------------------------------- the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 480, -70, 200, 0.4], [W + 60, -40, 1120, -70, 200, 0.4], [-60, H + 50, 560, H + 60, 150, 0.4], [W + 60, H + 50, 1040, H + 60, 150, 0.4]]) p.stroke({ brush: 'soft', color: '#010302', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
