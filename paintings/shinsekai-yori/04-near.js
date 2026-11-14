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
  p.tryStroke({ brush: 'round', color: mix(rayColor(angleFrom(x, y)), '#ffffff', 0.5), width: 4, opacity: clamp(k2 * 1.6, 0.15, 0.9), taper: [0.55, 0.55], points: [[x - 6.2, y], [x + 6.2, y]] });
}

// ---------------------------------------------------------------- the two near trunks
for (const [x, w, side] of [[70, 220, 1], [1546, 240, -1]]) {
  p.fill({ inside: (px) => Math.abs(px - x) < w / 2, bounds: [x - w / 2, -10, x + w / 2, H + 10], width: 16, length: 280, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: (px, py) => { const u = (px - x) / (w / 2), rib = nC(px / 9, py / 220); const k = clamp(side * u - 0.55, 0, 0.45) / 0.45 * reach(px, py, 900) * beam(px, py); return mix(mix('#010302', '#070c09', rib), rayColor(angleFrom(px, py)), clamp(k * 1.2, 0, 0.7)); }, stroke: { ...line, opacity: 0.98 } });
  for (let y = r.range(0, 80); y < H; y += r.range(120, 260)) { const ex = x + side * (w / 2 - 3), k = reach(ex, y, 900) * beam(ex, y), len = r.range(70, 200); if (k > 0.12) p.tryStroke({ brush: 'round', color: mix(rayColor(angleFrom(ex, y)), '#ffffff', 0.3), width: 4.6, opacity: clamp(k * 1.4, 0, 0.85), taper: [0.5, 0.5], points: [[ex, y], [ex, y + len]] }); }
  for (let k = 0; k < 5; k++) { const bx = x + side * r.range(-w * 0.3, w * 0.4), by = r.range(40, H - 100); p.tryStroke({ ...line, color: '#000201', width: r.range(6, 10), opacity: 0.7, taper: [0.3, 0.3], points: [[bx, by], [bx + r.range(-6, 6), by + r.range(120, 300)]] }); }   // the deep furrows of its bark
}

// ---------------------------------------------------------------- the ferns
// A fern is fronds that go out from one place and bend over. A frond is a rib with small leaves down both sides of it, close
// together, each turned toward the end of the frond and each shorter than the one before, so the frond is a feather with a
// toothed edge. It is dark; the leaves on its upper side have the color of the ray that falls on them.
function fern(x, y, s) {
  const n = 6 + Math.floor(r() * 4);
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + (k / (n - 1) - 0.5) * 2.5 + r.range(-0.12, 0.12), len = s * r.range(0.8, 1.25), bend = Math.sign(Math.cos(a) || 1) * r.range(0.7, 1.2);
    const at = (t) => [x + Math.cos(a + bend * t * 0.5) * len * t, y + Math.sin(a + bend * t * t) * len * t * 0.9], pts = []; for (let i = 0; i <= 7; i++) pts.push(at(i / 7));
    const [mx, my] = pts[4], c = rayColor(angleFrom(mx, my)), k2 = clamp(reach(mx, my, 520) * beam(mx, my) * 1.4, 0, 0.66), w = Math.max(6, s * 0.17);
    p.tryStroke({ ...line, color: '#020604', width: Math.max(5, w * 0.6), taper: [0.1, 0.9], points: pts });                     // the rib, and the dark of the frond along it
    const step = clamp(w * 0.36, 6, 10);
    for (let d = len * 0.1; d < len * 0.92; d += step) {
      const t = d / len, [px, py] = at(t), [qx, qy] = at(Math.min(1, t + 0.04)), tl = Math.hypot(qx - px, qy - py) || 1, tx = (qx - px) / tl, ty = (qy - py) / tl, L = w * 1.9 * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.62)), 0.8);
      if (L < 12.6) continue;
      for (const side of [-1, 1]) {
        const ang = Math.atan2(ty, tx) + side * 0.95, ex = px + Math.cos(ang) * L, ey = py + Math.sin(ang) * L, upper = Math.sin(ang) < Math.sin(Math.atan2(ty, tx));   // a leaf that goes up from the rib is on its upper side
        p.tryStroke({ ...line, rag: 0.15, color: upper && k2 > 0.06 ? mix('#07140b', mix(c, '#12241a', 0.25), k2 * r.range(0.5, 0.9)) : mix('#010403', '#07100a', r()), width: clamp(w * 0.3, 4.8, 7.5), opacity: 0.95, taper: [0.05, 0.8], points: [[px, py], [px + Math.cos(ang) * L * 0.55 + tx * L * 0.06, py + Math.sin(ang) * L * 0.55 + ty * L * 0.06], [ex + tx * L * 0.14, ey + ty * L * 0.14]] });
      }
    }
  }
}
const ferns = [];
for (let k = 0; k < 34; k++) ferns.push([r.range(-20, W + 20), r.range(730, 1016)]);
ferns.sort((a, b) => a[1] - b[1]);
for (const [x, y] of ferns) if (Math.hypot(x - SRC.x, (y - SRC.y - 60) * 1.4) > 190) fern(x, y, 40 + (y - 700) * 0.42);

// ---------------------------------------------------------------- the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 480, -70, 200, 0.4], [W + 60, -40, 1120, -70, 200, 0.4], [-60, H + 50, 560, H + 60, 150, 0.4], [W + 60, H + 50, 1040, H + 60, 150, 0.4]]) p.stroke({ brush: 'soft', color: '#010302', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
