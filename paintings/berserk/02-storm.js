// The storm. It has no ground and no sky: it is a great funnel that turns about the black
// sun, and its walls are faces. Near the sun they are far from us, small, and lost in the
// fire. Toward the edges of the picture they are near, as big as a house, and nearly black,
// with the light on one cheek. Every one has hollow eyes and an open mouth.
'use strict';
const { studio, open, W, H, SUN, polar, glare, swirlAngle, fire, airColor, inHand, face, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, shift } = studio;

const p = open('storm');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.3, dry: 0.04, rag: 0.3, cap: 'round' };

// ---- the air of it, which turns: long strokes round the sun

p.fill({ bounds: [0, 0, W, H], width: 40, length: 300, spacing: 0.5, overlap: 0.55, angle: swirlAngle, color: (x, y) => shift(airColor(x, y), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.94 } });
p.fill({ bounds: [0, 0, W, H], width: 18, length: 220, spacing: 0.9, overlap: 0.7, angle: swirlAngle, color: (x, y) => shift(airColor(x + r.range(-12, 12), y + r.range(-8, 8)), r.range(-4, 4), r.range(-0.02, 0.04), r.range(-0.016, 0.018)), stroke: { ...line, opacity: 0.75 } });
p.fill({ inside: (x, y) => polar(x, y).r < 360, bounds: [SUN.x - 360, 0, SUN.x + 360, SUN.y + 360], width: 9, length: 120, spacing: 0.9, overlap: 0.7, angle: swirlAngle, color: (x, y) => shift(airColor(x + r.range(-6, 6), y + r.range(-4, 4)), r.range(-3, 3), 0, r.range(-0.012, 0.016)), stroke: { ...line, opacity: 0.8, taper: [0.3, 0.3] } });

// ---- the faces, ring after ring out from the sun: the far ones first, so that each lies over those behind it

{
  const list = [];
  let rad = 96, ring = 0;
  while (rad < 1300) {
    const size = 9 + 0.118 * rad, n = Math.max(8, Math.floor(2 * Math.PI * rad / (size * 0.8))), off = (ring % 2) * 0.5 + r();
    for (let i = 0; i < n; i++) {
      const th = (i + off + r.range(-0.18, 0.18)) / n * Math.PI * 2 + rad * 0.0012, rr = rad * (1 + r.range(-0.04, 0.04));
      const x = SUN.x + Math.cos(th) * rr, y = SUN.y + Math.sin(th) * rr;
      if (x < -size || x > W + size || y < -size || y > H + size) continue;
      list.push({ x, y, s: size * r.range(0.9, 1.2), th, rad: rr });
    }
    rad += size * 0.93;
    ring++;
  }
  for (const f of list) {
    if (inHand(f.x, f.y) && inHand(f.x - f.s * 0.4, f.y) && inHand(f.x + f.s * 0.4, f.y) && inHand(f.x, f.y - f.s * 0.5) && inHand(f.x, f.y + f.s * 0.5)) continue;   // behind the hand
    if (f.rad < 135 && r() < 0.4) continue;                                                         // nearest the sun they are thin in the fire
    { const arm = Math.sin(3 * f.th - 5.2 * Math.log(f.rad / 60) + (nA(f.x / 300, f.y / 300) - 0.5) * 2); if (f.rad > 210 && arm < -0.72 && r() < 0.85) continue; }   // the storm has arms: between them is the dark, with no faces
    // the top of each is toward the sun, turned a little the way that the storm goes
    const rot = f.th + Math.PI + 0.3 + r.range(-0.4, 0.4);
    const k = glare(f.x, f.y), far = Math.exp(-f.rad / 230);
    face(p, f.x, f.y, f.s, rot, { k: clamp(k * (0.85 + 0.3 * r()), 0, 1), dim: clamp(0.34 * smooth(420, 1050, f.rad) + 0.12 * r(), 0, 0.62) });
    // the fire of the sun in the air in front of the far ones
    if (far > 0.25 && r() < 0.5) p.tryStroke({ brush: 'soft', color: '#ff9c40', width: Math.max(8.4, f.s * 0.9), opacity: 0.1 * far, points: [[f.x - f.s * 0.9, f.y], [f.x + f.s * 0.9, f.y]] });
  }
}

p.save();
