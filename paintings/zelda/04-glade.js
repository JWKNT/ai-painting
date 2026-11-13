// The floor of the glade: moss and grass, dark under the trees and bright green where the
// shafts come down; a pool of still water; stepping stones; and in the middle the platform
// of three stone steps that the sword stands on.
'use strict';
const { studio, open, W, H, GROUND, shaft, far, sun, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, glint } = studio;

const p = open('glade');
const r = p.rng;
const edge = (x) => GROUND + 44 * (nA(x / 130, 3) - 0.5) + 14 * (nB(x / 40, 5) - 0.5) + 16 * Math.pow(Math.abs(x - 800) / 800, 2);   // where the floor begins, at the foot of the tree: it rises and falls
const near = (y) => clamp((y - GROUND) / 310, 0, 1);                    // 0 far off, 1 at our feet

function moss(x, y) {
  const n = near(y);
  let c = mix(mix('#2c5a30', '#3f7438', nA(x / 70, y / 26)), mix('#12281a', '#1c3a22', nA(x / 50, y / 30)), smooth(0.15, 1, n) * 0.85);
  c = sun(c, x, y, 0.85 - 0.25 * n);                                     // the shafts lie on it in bright places
  return far(c, x, y, (1 - n) * 0.34);
}
const lie = (x, y) => (nB(x / 120, y / 50) - 0.5) * 0.3;
p.fill({ inside: (x, y) => y > edge(x) + 8, bounds: [-20, GROUND - 10, W + 20, H + 10], width: (x, y) => 12 + 22 * near(y), length: 110, spacing: 0.5, angle: lie, color: moss, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.05 } });
p.fill({ inside: (x, y) => y > edge(x) + 4, bounds: [-20, GROUND - 10, W + 20, H + 10], width: (x, y) => 7 + 10 * near(y), length: 60, spacing: 0.8, overlap: 0.7, angle: lie, color: (x, y) => moss(x + r.range(-10, 10), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.12 } });

// The pool, at the right: dark water that holds a little of the light.
{
  const cx = 1210, cy = 838;
  for (let k = 0; k < 9; k++) {
    const y = cy - 30 + k * 7.5, half = 150 * Math.sqrt(Math.max(0.05, 1 - Math.pow((y - cy) / 36, 2)));
    p.tryStroke({ brush: 'bristle', color: mix(mix('#0c2420', '#1c443c', r()), '#cfe6b8', clamp(shaft(cx, y) * 0.5 + (k < 3 ? 0.18 : 0), 0, 1)), width: 10, mix: 0.25, dry: 0, rag: 0.15, cap: 'round', points: [[cx - half, y], [cx, y + r.range(-1, 1)], [cx + half, y]] });
  }
  for (let k = 0; k < 7; k++) { const x = cx + r.range(-110, 110), y = cy + r.range(-22, 22), len = r.range(16, 50); p.tryStroke({ color: '#e8f2cc', width: 4, opacity: r.range(0.3, 0.6), points: [[x - len / 2, y], [x + len / 2, y]] }); }
  glint(p, [[cx - 150, cy - 2], [cx - 70, cy - 34], [cx + 70, cy - 34], [cx + 150, cy - 2]], () => mix('#16301e', '#2c5630', r()), { width: 8, dash: 40, gap: 6, opacity: 0.9, rng: r });   // its far bank
}

// Stepping stones, from our feet to the platform.
for (const [x, y, w] of [[760, 968, 120], [866, 916, 100], [770, 872, 86], [840, 836, 72]]) {
  const h = w * 0.2;
  p.tryStroke({ brush: 'bristle', color: mix('#1c2c26', '#2c3e34', r()), width: h * 1.5, mix: 0.1, dry: 0.03, rag: 0.15, cap: 'round', points: [[x - w / 2, y + h * 0.4], [x, y + h * 0.5], [x + w / 2, y + h * 0.4]] });
  p.tryStroke({ brush: 'bristle', color: sun(mix('#5c6e60', '#7c8c78', r()), x, y, 0.7), width: h * 1.2, mix: 0.15, dry: 0.03, rag: 0.15, cap: 'round', points: [[x - w / 2 + 4, y - h * 0.1], [x, y], [x + w / 2 - 4, y - h * 0.1]] });
}

// The platform: three steps of old stone, the smallest on top, moss in their joints.
const stone = (x, y, top) => sun(mix(top ? mix('#8a9884', '#a8b49c', nC(x / 30, y / 6)) : mix('#27332e', '#3a4840', nC(x / 30, y / 8)), '#4c6c3c', smooth(0.7, 0.4, nA(x / 26, y / 9)) * 0.35), x, y, top ? 0.85 : 0.2);
function step(x0, x1, yTop, yLip, yFoot, inset) {
  const slab = (ya, yb, xa, xb, top) => {
    const n = Math.max(1, Math.round((yb - ya) / 9));
    for (let i = 0; i < n; i++) {
      const y = ya + (yb - ya) * (i + 0.5) / n, t = (y - ya) / (yb - ya), a = xa[0] + (xa[1] - xa[0]) * t, b = xb[0] + (xb[1] - xb[0]) * t, segs = Math.max(1, Math.round((b - a) / 120));
      for (let q = 0; q < segs; q++) {
        const sa = a + (b - a) * q / segs, sb = a + (b - a) * (q + 1) / segs;
        p.tryStroke({ brush: 'bristle', color: stone((sa + sb) / 2, y, top), width: Math.max(4.6, (yb - ya) / n + 1.5), mix: 0.1, dry: 0.04, rag: 0.12, cap: 'flat', streak: 0.3, jitter: 0.5, points: [[sa, y], [sb, y]] });
      }
    }
  };
  slab(yTop, yLip, [x0 + inset, x0], [x1 - inset, x1], true);            // the top of the step, in the light
  slab(yLip, yFoot, [x0, x0], [x1, x1], false);                          // its face
  glint(p, [[x0, yLip], [(x0 + x1) / 2, yLip], [x1, yLip]], () => mix('#c8d2b8', '#f2f2c8', r()), { width: 4.4, dash: 40, gap: 16, opacity: 0.4 + 0.5 * shaft((x0 + x1) / 2, yLip), rng: r });   // the worn edge
  glint(p, [[x0 + 4, yFoot + 1], [(x0 + x1) / 2, yFoot + 2], [x1 - 4, yFoot + 1]], () => mix('#2c5a2c', '#5c8a3c', r()), { width: 6, dash: 30, gap: 20, opacity: 0.8, rng: r });               // moss at its foot
  for (let k = 0; k < 3; k++) { const x = r.range(x0 + 20, x1 - 20); p.tryStroke({ brush: 'bristle', color: '#1c2620', width: 4.6, opacity: 0.5, mix: 0.1, dry: 0.05, rag: 0.2, points: [[x, yLip + 2], [x + r.range(-4, 4), yFoot - 1]] }); }   // joints
}
p.stroke({ brush: 'soft', color: '#0a1a12', width: 60, opacity: 0.4, points: [[540, 812], [800, 822], [1060, 812]] });   // its shadow on the moss
step(560, 1040, 752, 776, 808, 40);
step(622, 978, 724, 743, 768, 30);
step(690, 910, 700, 716, 738, 22);
step(766, 834, 688, 696, 712, 6);                                        // the stone the sword stands in

// Grass, in tufts: dark in the shade, bright where a shaft comes down.
for (let k = 0; k < 900; k++) {
  const y = GROUND + 20 + Math.pow(r(), 0.75) * 300, x = r.range(-10, W + 10), n = near(y);
  if (Math.abs(x - 800) < 250 - (y - 740) * 0.2 && y > 690 && y < 812) continue;   // not on the platform
  if (Math.hypot((x - 1210) / 150, (y - 838) / 34) < 1) continue;                  // nor in the pool
  if (nC(x / 80, y / 40) < 0.36) continue;
  const h = (12.5 + 30 * n) * r.range(0.7, 1.2), lean = r.range(-0.35, 0.35) * h, lit = shaft(x, y) > 0.3 && r() < 0.7;
  p.tryStroke({ color: lit ? mix('#7ca844', '#c4d870', r()) : far(mix('#12281a', '#2c5a2c', r()), x, y, (1 - n) * 0.3), width: 4 + 2 * n * r(), opacity: 0.9, taper: [0, 0.75], points: [[x, y], [x + lean * 0.35, y - h * 0.6], [x + lean, y - h]] });
}

p.save();
