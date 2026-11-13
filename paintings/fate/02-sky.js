// The sky: dark red overhead and gold at the edge of the plain; the great wheels that turn
// in it, each with teeth round it and spokes, dim in the smoke; and the smoke itself, in long
// dark bars with fire along their under sides.
'use strict';
const { studio, open, W, HORIZON, GLOW, skyColor, glow, far, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, arc } = studio;

const p = open('sky');
const r = p.rng;
const flow = (x, y) => { const k = glow(x, y, 460); let a = Math.atan2(x - GLOW.x, -1.4 * (y - GLOW.y)); if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI; return a * k * 0.7 + (nB(x / 300, y / 140) - 0.5) * 0.3 * (1 - k); };
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: flow, color: (x, y) => shift(skyColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => shift(skyColor(x + r.range(-30, 30), y + r.range(-14, 14)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.014, 0.016)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The glare at the edge of the plain.
for (const [w, o] of [[460, 0.14], [260, 0.2], [130, 0.3]]) p.stroke({ brush: 'soft', color: '#fff0a8', width: w, opacity: o, points: [[GLOW.x - w * 1.4, GLOW.y], [GLOW.x, GLOW.y - 14], [GLOW.x + w * 1.4, GLOW.y]] });

// A wheel: a ring with teeth on the outside of it, spokes, and a hub. It is of dark iron. The
// part of it that is toward the glare, which is below it, is a little lighter.
function wheel(cx, cy, R, d, teeth, turn) {
  const iron = (a) => far(mix(mix('#1c0e0c', '#3a1c14', r()), '#a04c1c', clamp(Math.sin(a) * 0.5 + 0.1, 0, 0.5)), cx + Math.cos(a) * R, cy + Math.sin(a) * R, d);
  const stroke = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.15, cap: 'flat' };
  const w = Math.max(8, R * 0.06);
  for (let rr = R * 0.8; rr <= R * 0.965; rr += w * 0.75) {              // the ring, in arcs laid end to end
    const piece = Math.max(0.3, 2.4 * w / rr);
    for (let a = turn; a < turn + 6.283; a += piece * 0.92) p.tryStroke({ ...stroke, color: iron(a + piece / 2), width: w, points: arc(cx, cy, rr, a, a + piece, 6) });
  }
  const tw = 6.283 * R / teeth * 0.5, th = Math.max(6, tw / 2.15);
  for (let k = 0; k < teeth; k++) {                                      // the teeth: each is two short strokes, one outside the other
    const a = turn + k / teeth * 6.283;
    for (const rr of [R * 0.97 + th * 0.5, R * 0.97 + th * 1.4]) p.tryStroke({ ...stroke, color: iron(a), width: th, points: [[cx + Math.cos(a) * rr - Math.sin(a) * -tw / 2, cy + Math.sin(a) * rr + Math.cos(a) * -tw / 2], [cx + Math.cos(a) * rr - Math.sin(a) * tw / 2, cy + Math.sin(a) * rr + Math.cos(a) * tw / 2]] });
  }
  for (let k = 0; k < 6; k++) {                                          // the spokes
    const a = turn + 0.3 + k / 6 * 6.283;
    p.tryStroke({ ...stroke, color: iron(a), width: Math.max(8, R * 0.085), points: [[cx + Math.cos(a) * R * 0.14, cy + Math.sin(a) * R * 0.14], [cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5], [cx + Math.cos(a) * R * 0.82, cy + Math.sin(a) * R * 0.82]] });
  }
  studio.disc(p, cx, cy, R * 0.2, iron(1.5), Math.max(8, R * 0.07), { brush: 'bristle', mix: 0.1, dry: 0, rag: 0.1, cap: 'round' });   // the hub
  p.tryStroke({ ...stroke, cap: 'round', color: far('#120808', cx, cy, d), width: Math.max(6, R * 0.05), points: arc(cx, cy, Math.max(R * 0.07, 7), 0, 6.283, 10) });   // and the hole in it
  // the glare on the under edge of the ring
  for (let a = 0.5; a < 2.6; a += 0.34) p.tryStroke({ color: far('#ffb050', cx, cy + R, d * 0.6), width: 4.4, opacity: 0.6, points: arc(cx, cy, R * 0.79, a, a + 0.24, 5) });
}
// The far ones first.
wheel(860, 60, 150, 0.74, 20, 0.3);
wheel(1130, 250, 96, 0.8, 16, 1.1);
wheel(520, 230, 80, 0.82, 14, 0.7);
wheel(250, 120, 270, 0.56, 26, 0.2);
wheel(1420, 90, 310, 0.5, 28, 0.9);

// The smoke: long level bars, dark above, with the fire of the glare along their under sides. It hides parts of the wheels.
const smoke = (t, x, y) => { const k = clamp(glow(x, y, 760) * 1.3, 0, 1); return ramp([mix('#160a0a', '#3c140e', k), mix('#30140e', '#7c2c12', k), mix('#6c2c14', '#d86c1c', k), mix('#b85c20', '#ffc058', k)], t); };
const under = (x, y) => { const dx = GLOW.x - x, dy = GLOW.y + 140 - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };
let seed = 0;
for (const [x0, x1, y, big] of [[-80, 640, 220, 54], [420, 1100, 150, 40], [900, 1700, 300, 60], [-60, 420, 400, 38], [1140, 1660, 440, 36], [300, 800, 330, 28], [840, 1320, 400, 26], [-80, 300, 500, 24], [1300, 1700, 520, 24], [480, 760, 470, 15], [880, 1120, 490, 14], [-100, 500, 60, 50], [1000, 1700, 40, 46]]) {
  const puffs = [], n = noise2(1100 + ++seed);
  for (let x = x0; x < x1; x += big * 0.8) { const hump = Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)); puffs.push([x + r.range(-8, 8), y + r.range(-big * 0.25, big * 0.25), big * r.range(0.6, 1.05) * (0.45 + 0.7 * hump)]); }
  studio.mass(p, puffs.filter((q) => q[2] > 7), { light: under, tones: smoke, bias: 0.38, contrast: 0.8, grain: 0.22, mix: 0.3, noise: n, stroke: { rag: 0.5, hardness: 0.5, taper: [0.45, 0.45], cap: 'round' }, flow: (x, yy) => (n(x / 70, yy / 30) - 0.5) * 0.3, layers: [[Math.max(9, big * 0.5), big * 3.4, 0.9, big * 0.14, 0.4], [Math.max(6, big * 0.28), big * 2.2, 0.8, big * 0.08, 0.7]] });
}

p.save();
