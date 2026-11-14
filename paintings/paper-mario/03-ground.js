// The ground of the wood. It is dark, a blue-black with patches of violet and of old gold,
// like a figured cloth. The path lies on it like a strip of white paper, a hand higher
// than the ground: it winds from our feet away to the foot of the Great Tree. Far off it
// is gold with the sky; near us it is white, and a little blue. Along each side of it
// stand small black bushes with pointed tops, close together like a fence, and the shade
// of each tree lies on the ground toward us and to the right.
'use strict';
const { studio, open, W, H, HORIZON, cam, away, pathX, PATH_HALF, onPath, shade, SHADOW, glare, far, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('ground');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.16, dry: 0.03, rag: 0.2, cap: 'round' };
const G = (x, y) => { const Z = away(y); return [(x - cam.vx) * Z / cam.f, Z]; };
const air = (Z) => smooth(18, 150, Z) * 0.8;

// ---------------------------------------------------------------- the dark ground
const soil = (x, y) => {
  const [X, Z] = G(x, y), pat = nD(X / 1.5 + 7, Z / 2.6), fine = nC(X / 0.4, Z / 0.7);
  let c = mix('#101624', '#1f2a3c', nA(X / 3.4, Z / 6));
  c = mix(c, pat > 0.5 ? '#35305e' : '#3e3a18', Math.abs(pat - 0.5) * 0.95);                       // patches of violet and of old gold
  c = mix(c, fine > 0.5 ? '#4a4420' : '#0a0e18', Math.abs(fine - 0.5) * 0.3);
  c = mix(c, '#070a12', shade(X, Z) * 0.55);
  return far(c, x, y, air(Z));
};
const level = () => r.range(-0.03, 0.03);
p.fill({ bounds: [0, HORIZON - 2, W, 650], width: 5.5, length: 50, spacing: 0.5, angle: level, color: soil, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 640, W, 780], width: 8, length: 84, spacing: 0.5, angle: level, color: soil, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 770, W, H], width: 12, length: 130, spacing: 0.5, angle: level, color: soil, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, H], width: 5.5, length: 44, spacing: 1.1, overlap: 0.7, angle: level, color: (x, y) => soil(x + r.range(-8, 8), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });
// small figures in the cloth of it: short curled touches of old gold and of violet, more of them near us
for (let k = 0; k < 420; k++) {
  const y = HORIZON + 30 + Math.pow(r(), 0.7) * (H - HORIZON - 30), x = r.range(0, W), [X, Z] = G(x, y);
  if (onPath(x, y) > -0.25) continue;
  const u = cam.unit(Z), l = Math.max(12.6, u * r.range(0.16, 0.34)), a = r.range(-0.5, 0.5), bend = r.range(-0.5, 0.5) * l, c = r() < 0.6 ? mix('#6c6228', '#a89438', r()) : mix('#4c4688', '#6c64a8', r());
  p.tryStroke({ brush: 'round', color: far(mix(c, '#0a0e18', shade(X, Z) * 0.6), x, y, air(Z)), width: clamp(u * 0.05, 4, 6), opacity: r.range(0.3, 0.6), taper: [0.3, 0.5], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l * 0.2], [x, y - bend * 0.14], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l * 0.2]] });
}

// ---------------------------------------------------------------- the path
const snow = (x, y) => {
  const [X, Z] = G(x, y), k = onPath(x, y);
  let c = mix('#fbf3de', '#dfe2ec', smooth(46, 7, Z) * 0.75);                                     // warm white far off; a little blue near us, where we look down on it
  c = mix(c, '#ffe6a0', glare(x, y, 460) * 0.6);                                                  // the bright sky on it
  c = mix(c, '#c9cede', smooth(0.3, 0, k) * 0.4 + (nB(X / 0.9, Z / 1.6) - 0.5) * 0.14);           // it is a little lower and greyer at its edges, and not all one white
  c = mix(c, '#8f98bc', shade(X, Z) * 0.8);                                                       // the shade of the trees on it
  return far(c, x, y, air(Z) * 0.55);
};
const along = (x, y) => { const Z = away(y), d = (pathX(Z + 0.5) - pathX(Z - 0.5)), sx = (d * cam.f / Z - ((x - cam.vx) / Z)) , sy = -cam.f * cam.eye / (Z * Z); return Math.atan2(sy, sx); };   // the way the path goes, in the picture
for (const [y0, y1, w, len] of [[HORIZON + 4, 640, 5, 30], [632, 720, 6.5, 48], [712, 830, 9, 76], [822, H + 4, 13, 120]]) p.fill({ inside: (x, y) => onPath(x, y) > 0, bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: (x, y) => along(x, y) + r.range(-0.06, 0.06), color: snow, stroke: { ...line, mix: 0.1, opacity: 0.97 } });
p.fill({ inside: (x, y) => onPath(x, y) > 0.04, bounds: [0, HORIZON + 4, W, H + 4], width: 5.5, length: 40, spacing: 1.2, overlap: 0.7, angle: (x, y) => along(x, y) + r.range(-0.1, 0.1), color: (x, y) => snow(x + r.range(-8, 8), y + r.range(-3, 3)), stroke: { ...line, mix: 0.1, opacity: 0.8 } });
// It is a hand higher than the ground: along its near side we see its edge as a thin dark line, and under that its shade.
for (const side of [-1, 1]) for (let Z = 6.6; Z < 70;) {
  const dZ = Math.max(0.7, Z * 0.09), a = cam.at(pathX(Z) + side * PATH_HALF, 0, Z), b = cam.at(pathX(Z + dZ) + side * PATH_HALF, 0, Z + dZ), u = cam.unit(Z);
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= 12.5 && a[0] > -60 && a[0] < W + 60) {
    if (side > 0) p.tryStroke({ ...line, color: far('#3a3f58', a[0], a[1], air(Z)), width: clamp(u * 0.09, 4.8, 12), opacity: 0.85, points: [[a[0] + 2, a[1] + clamp(u * 0.05, 2, 6)], [b[0] + 2, b[1] + clamp(u * 0.05, 2, 6)]] });
    p.tryStroke({ brush: 'round', color: far(side > 0 ? '#fffdf2' : '#aab2cc', a[0], a[1], air(Z) * 0.5), width: 4, opacity: 0.7, points: [a, b] });
  }
  Z += dZ * 0.9;
}
// White leaves have come down on it and on the ground beside it: short pale touches that lie every way.
for (let k = 0; k < 260; k++) {
  const y = HORIZON + 40 + Math.pow(r(), 0.8) * (H - HORIZON - 40), x = r.range(0, W), [X, Z] = G(x, y), k2 = onPath(x, y), u = cam.unit(Z);
  if (k2 < -1.6 || (k2 > 0 && r() < 0.55)) continue;
  const l = Math.max(12.4, u * 0.2), a = r.range(0, Math.PI), sh = shade(X, Z);
  p.tryStroke({ brush: 'round', color: far(k2 > 0 ? mix('#c6cce0', '#ffffff', r()) : mix(mix('#9aa4c4', '#e8ecf6', r()), '#3c4460', sh * 0.6), x, y, air(Z) * 0.6), width: clamp(u * 0.07, 4, 7), opacity: k2 > 0 ? 0.5 : r.range(0.4, 0.8), taper: [0.45, 0.45], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l * 0.25], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l * 0.25]] });
}

// ---------------------------------------------------------------- the black bushes along each side of the path
// Far off they are one dark line. Nearer, each is a dark point that stands up, wide at its foot; the bright sky is on its left edge.
for (const side of [-1, 1]) {
  for (let Z = 150; Z > 44;) { const dZ = Z * 0.2, a = cam.at(pathX(Z) + side * (PATH_HALF + 0.3), 0.3, Z), b = cam.at(pathX(Z - dZ) + side * (PATH_HALF + 0.3), 0.3, Z - dZ); if (Math.hypot(b[0] - a[0], b[1] - a[1]) >= 12.5) p.tryStroke({ ...line, color: far('#10131c', a[0], a[1], air(Z)), width: clamp(cam.unit(Z) * 0.7, 4.8, 12), points: [a, b] }); Z -= dZ * 0.85; }
  const list = []; for (let Z = 46; Z > 6.4; Z -= Math.max(0.24, r.range(0.3, 0.5))) list.push(Z);
  for (const Z of list) {
    const u = cam.unit(Z), X = pathX(Z) + side * (PATH_HALF + 0.34 + r.range(-0.08, 0.08)), [x, y] = cam.at(X, 0, Z), h = Math.max(13, u * r.range(0.62, 0.92)), w = Math.max(5, Math.min(h / 2.1, u * r.range(0.3, 0.42)));
    if (x < -40 || x > W + 40) continue;
    if (side < 0) p.tryStroke({ brush: 'soft', color: '#58618c', width: Math.max(8.6, w * 1.2), opacity: 0.4, taper: [0.1, 0.7], points: [[x, y], [x + SHADOW[0] * h * 0.9 * 1.1, y + h * 0.16], [x + SHADOW[0] * h * 1.9, y + h * 0.3]] });   // its shade, on the path
    p.tryStroke({ ...line, mix: 0, rag: 0.08, color: far(mix('#07090f', '#161a26', r()), x, y, air(Z)), width: w, taper: [0, 0.85], points: [[x, y + 3], [x + r.range(-1, 1), y - h * 0.5], [x + r.range(-2, 2), y - h]] });
    p.tryStroke({ ...line, mix: 0, rag: 0.08, color: far('#090b12', x, y, air(Z)), width: Math.max(4.8, w * 0.7), points: [[x - Math.max(6.4, w * 0.8), y + 2], [x + Math.max(6.4, w * 0.8), y + 2]] });
    if (u > 26 && r() < 0.6) p.tryStroke({ brush: 'round', color: far(mix('#c89c3c', '#ffdc80', r()), x, y, air(Z)), width: 4, opacity: 0.5, taper: [0.1, 0.8], points: [[x - w * 0.4, y - h * 0.1], [x - w * 0.24, y - h * 0.55], [x - 1, y - h * 0.94]] });
  }
}

p.save();
