// The trees of Boggly Woods. Each has a black trunk like a tall cone, wide at the ground
// and drawn out to a point, and on the point a head of white leaves. The leaves are small
// and close together; where the gold sky is on them they are cream, their shade is a
// blue-grey, and here and there one glitters. The far trees are small and soft with the
// gold air; two near ones stand at the sides of the picture and go out of the top of it.
'use strict';
const { studio, open, cam, TREES, glare, far, nA, nC } = require('./scene');
const { mix, clamp, smooth, ramp, mass, noise2, glow } = studio;

const p = open('trees');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.15, cap: 'round' };
const air = (Z) => smooth(18, 150, Z) * 0.8;
const LEAF = ['#5f6c8e', '#8e9bb8', '#c3cbdc', '#e9ecf2', '#fffaf0', '#ffffff'];

function tree(t, i) {
  const u = cam.unit(t.Z), [bx, by] = cam.at(t.X, 0, t.Z), top = by - t.h * u, hw = 0.5 * u, d = air(t.Z), R = t.R * u;
  const half = (y) => hw * Math.pow(clamp((y - top) / (by - top), 0, 1), 1.3) + 1.5;
  // ---- the trunk
  if (hw < 7) {
    p.tryStroke({ ...line, mix: 0, color: far('#10131c', bx, by, d), width: Math.max(4.8, hw * 1.3), taper: [0, 0.9], points: [[bx, by + 2], [bx, (by + top) / 2], [bx, top - R * 0.2]] });
  } else {
    const bark = (x, y) => { const k = (x - bx) / half(y), rib = nC(x / (4 + hw * 0.08), y / 160 + i); let c = mix('#07080e', '#1a1c2a', rib); c = mix(c, '#2c3046', smooth(0.3, 1, k) * 0.4); c = mix(c, '#5c4a22', smooth(-0.55, -1, k) * 0.7); return far(c, x, y, d); };   // black; a little blue at its right, and the gold sky down its left edge
    p.fill({ inside: (x, y) => y < by + 2 && y > top && Math.abs(x - bx) < half(y), bounds: [bx - hw - 3, top, bx + hw + 3, by + 2], width: clamp(hw * 0.2, 5.5, 14), length: clamp(t.h * u * 0.3, 30, 200), spacing: 0.5, overlap: 0.6, angle: (x) => Math.PI / 2 + (x - bx) / hw * -0.1, color: bark, stroke: { ...line, mix: 0.04, opacity: 0.97 } });
    for (let y = by - 6; y > top + 30;) { const y1 = Math.max(top + 14, y - r.range(40, 110)); p.tryStroke({ brush: 'round', color: far(mix('#c8983c', '#ffd878', r()), bx, y, d), width: hw > 24 ? 4.8 : 4, opacity: r.range(0.4, 0.75), taper: [0.3, 0.3], points: [[bx - half(y) + 2, y], [bx - half((y + y1) / 2) + 2, (y + y1) / 2], [bx - half(y1) + 2, y1]] }); y = y1 - r.range(6, 30); }
    p.tryStroke({ brush: 'soft', color: '#05060c', width: Math.max(12, hw * 0.9), opacity: 0.5, points: [[bx - hw * 1.3, by + 3], [bx, by + 6], [bx + hw * 1.6, by + 4]] });   // the dark at its foot
  }
  // ---- the head of leaves
  const cx = bx, cy = top - R * 0.34, tone = (v, x, y) => far(mix(ramp(LEAF, clamp(v, 0, 1)), '#ffe9b4', clamp(v - 0.6, 0, 0.4) * glare(x, y, 700) * 0.9), x, y, d * 0.7);
  if (R < 26) {                                                             // far off: a few soft touches, light over dark
    for (const [ox, oy, k, v] of [[0.1, 0.34, 1, 0.2], [-0.3, 0.1, 0.8, 0.5], [0.34, 0.06, 0.8, 0.4], [-0.06, -0.3, 0.9, 0.9]]) { const w = Math.max(6, R * 0.7 * k); p.tryStroke({ ...line, rag: 0.4, color: tone(v, cx, cy), width: w, points: [[cx + ox * R - Math.max(6.4, w * 1.1), cy + oy * R], [cx + ox * R, cy + oy * R - w * 0.2], [cx + ox * R + Math.max(6.4, w * 1.1), cy + oy * R]] }); }
    return;
  }
  const q = studio.rng(4600 + i), puffs = [[cx, cy, R * 0.62]];
  for (let k = 0; k < 9; k++) { const a = k / 9 * Math.PI * 2 + q.range(-0.2, 0.2), rad = R * q.range(0.34, 0.5), dist = R * q.range(0.5, 0.72); puffs.push([cx + Math.cos(a) * dist, cy + Math.sin(a) * dist * 0.72, rad]); }
  mass(p, puffs, { light: [-0.34, -0.94], tones: tone, bias: 0.52, contrast: 0.6, fall: 0.34, grain: 0.3, mix: 0.2, noise: noise2(4700 + i), stroke: { rag: 0.4, hardness: 0.55 }, flow: (x, y) => (nA(x / 30, y / 30 + i) - 0.5) * 3,
    layers: [[clamp(R * 0.1, 8, 26), clamp(R * 0.3, 20, 76), 0.96, clamp(R * 0.03, 2, 8), 0.5], [clamp(R * 0.05, 5.5, 13), clamp(R * 0.16, 14, 40), 0.85, 2, 0.8]] });
  // its leaves: small pointed touches that lie every way, over the head and a little out past its edge
  const n = Math.round(clamp(R * 1.5, 60, 520)), l = clamp(R * 0.085, 12.6, 26), w = clamp(R * 0.034, 4.8, 9);
  for (let k = 0; k < n; k++) {
    const pf = puffs[Math.floor(r() * puffs.length)], a = r.range(0, Math.PI * 2), dist = pf[2] * Math.pow(r(), 0.45) * 1.06, x = pf[0] + Math.cos(a) * dist, y = pf[1] + Math.sin(a) * dist, v = clamp(0.56 - (y - cy) / (R * 1.5) - (x - cx) / (R * 4) + r.range(-0.3, 0.3), 0, 1), b = r.range(0, Math.PI);
    p.tryStroke({ ...line, rag: 0.1, color: tone(v, x, y), width: w, opacity: 0.94, taper: [0.5, 0.5], points: [[x - Math.cos(b) * l / 2, y - Math.sin(b) * l / 2], [x + Math.cos(b) * l / 2, y + Math.sin(b) * l / 2]] });
  }
  // here and there a leaf glitters
  for (let k = 0; k < Math.round(R / 22); k++) { const pf = puffs[Math.floor(r() * puffs.length)], x = pf[0] + r.range(-0.6, 0.6) * pf[2], y = pf[1] + r.range(-0.7, 0.2) * pf[2]; glow(p, x, y, Math.max(9, R * 0.05), '#ffffff', 0.2, 6); p.tryStroke({ brush: 'round', color: '#ffffff', width: 4, taper: [0.5, 0.5], points: [[x - 6.2, y], [x + 6.2, y]] }); }
}
TREES.map((t, i) => [t, i]).sort((a, b) => b[0].Z - a[0].Z).forEach(([t, i]) => tree(t, i));

p.save();
