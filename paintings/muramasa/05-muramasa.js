// Muramasa. It flies to the left and a little up, toward the Silver Star, and we see it from
// the side: the helmet with its two tall horns of gold and its neck guard of dark plates;
// the great shoulder guard, in rows of dark plates with gold studs; the crimson body; the
// red drum of the thruster on its back, with a fan of long red blades round it and fire out
// of its mouth; the legs, which trail; and the long sword held low under it, point back,
// with lightning on it. It is a suit of armour: there is no face, only the dark of the mask.
// The moon lights its upper edges, cold; the last red of the day is on its under side.
'use strict';
const { studio, open, M, ALONG, AX, MOONWARD } = require('./scene');
const { mix, shape, glow, disc } = studio;

const p = open('muramasa');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.06, cap: 'flat' };
const poly = (pts) => pts.map(([u, v]) => M(u, v));
const red = { shadow: '#2c0812', half: '#8c1a22', lit: '#e04a36', rim: '#ffd8cc', bounce: '#70183a' };
const redDim = { shadow: '#1c060e', half: '#5c121c', lit: '#9c2c2c', bounce: '#4c1230' };
const navy = { shadow: '#05050c', half: '#161a30', lit: '#3e4874', rim: '#c4d0f8', bounce: '#3c1230' };
const gold = { shadow: '#5c3a12', half: '#b48a38', lit: '#f4d88c', rim: '#fff6d0', bounce: '#8c4c2c' };
const plate = (pts, tones, o = {}) => shape(p, poly(pts), tones, { light: MOONWARD, turn: -0.1, width: 5.5, length: 24, vary: 0.05, round: 12, flow: () => ALONG + (o.across ? Math.PI / 2 : 0), dash: 40, gap: 6, edgeOpacity: 0.85, ...o });
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: poly(pts) });
// Plates in rows, with gold studs: `rows` lines along u divide the plate, and studs stand in each row.
function lamellar(u0, u1, v0, v1, rows, o = {}) {
  plate([[u0, v0], [u1, v0], [u1, v1], [u0, v1]], navy, { round: 9, ...o });
  for (let k = 1; k < rows; k++) { const v = v0 + (v1 - v0) * k / rows; mark([[u0 + 3, v], [u1 - 3, v]], '#020208', 4.4, { opacity: 0.85 }); }
  for (let k = 0; k < rows; k++) { const v = v0 + (v1 - v0) * (k + 0.5) / rows; for (let u = u0 + 12; u < u1 - 16; u += 22) mark([[u, v], [u + 12.6, v]], k % 2 ? '#c89438' : '#f0cc6c', 4, { opacity: 0.9 }); }
  mark([[u0, v1], [u1, v1]], '#a8203c', 5, { cap: 'round' });                                                         // a red cord along its upper edge
}
// Fire: it starts at a place on the armour and streams back from there.
function fire(u, v, len, wide) {
  const [x, y] = M(u, v), bx = -AX[0], by = -AX[1];
  glow(p, x + bx * len * 0.2, y + by * len * 0.2, wide * 2.6, '#ff7a2c', 0.1, 5);
  for (const [w, c, k] of [[wide * 1.5, '#d8381c', 1], [wide, '#ff8a2c', 0.8], [wide * 0.58, '#ffd45c', 0.6], [Math.max(5, wide * 0.3), '#fffbe4', 0.42]]) p.tryStroke({ ...line, cap: 'round', color: c, width: w, opacity: 0.92, mix: 0.15, rag: 0.2, taper: [0.05, 0.92], points: [[x, y], [x + bx * len * k * 0.5, y + by * len * k * 0.5 + 3 * k], [x + bx * len * k, y + by * len * k + 9 * k]] });
}

// ---------------------------------------------------------------- what is on its far side
plate([[204, 34], [224, 30], [246, 84], [252, 150], [228, 100]], { shadow: '#4c3010', half: '#8c6828', lit: '#c8a450', bounce: '#6c3c20' }, { round: 7, edge: false, across: true });   // the far horn
plate([[-20, 6], [-118, -2], [-120, 28], [-22, 38]], redDim, { edge: false });                                                             // the far leg
plate([[-116, 0], [-222, 14], [-224, 36], [-118, 30]], redDim, { edge: false });
plate([[-220, 12], [-268, 22], [-262, 34], [-222, 36]], navy, { edge: false, round: 6 });
// the far blades of the fan round its thruster
for (const [du, dv] of [[-150, 150], [-190, 96]]) plate([[30, 62], [52, 70], [du + 10, dv + 8], [du - 12, dv - 6]], redDim, { round: 7, edge: false });

// ---------------------------------------------------------------- its legs
plate([[-6, -24], [-112, -30], [-116, 8], [-6, 24]], red, { round: 15 });                              // the thigh
lamellar(-78, -10, -30, 4, 3);                                                                         // the plates that hang from its waist over the thigh
disc(p, ...M(-116, -10), 15, '#161a30', 6.2, { ...line }); mark([[-124, -14], [-108, -14]], '#c89438', 4.4);   // the knee: a dark round, with a stud
plate([[-112, -28], [-222, -16], [-226, 10], [-116, 14]], red, { round: 14 });                         // the shin
mark([[-124, -8], [-214, 0]], '#161a30', 8);                                                           // the dark band down it
mark([[-150, -24], [-150, 10]], '#c89438', 4.4); mark([[-196, -19], [-196, 9]], '#c89438', 4.4);       // two bands of gold round it
plate([[-222, -18], [-274, -6], [-268, 8], [-226, 12]], navy, { round: 7 });                           // the foot: a dark point

// ---------------------------------------------------------------- the thruster on its back: a red drum, with its mouth to the rear, and the fan of blades round it
fire(-34, 62, 250, 30);
for (const [du, dv, k] of [[-168, 178, 1], [-206, 138, 1], [-226, 96, 0.9], [-110, 200, 0.9], [-40, 206, 0.8]]) {   // the blades: long, red, each with a dark rib and a row of studs
  plate([[36, 66], [60, 76], [du + 14, dv + 10], [du - 16, dv - 8]], red, { round: 8 });
  mark([[44, 70], [(44 + du) / 2, (70 + dv) / 2], [du, dv]], '#3c0c18', 4.4, { opacity: 0.8 });
  for (const t of [0.35, 0.55, 0.75]) { const u = 48 + (du - 48) * t, v = 72 + (dv - 72) * t; mark([[u - 6.3, v + 5], [u + 6.3, v + 5]], '#e8c060', 4, { opacity: 0.85 * k }); }
}
plate([[-34, 40], [70, 46], [78, 84], [70, 100], [-34, 92]], red, { round: 22 });                      // the drum
for (const u of [-8, 30, 62]) mark([[u, 44], [u, 96]], '#3c0c18', 4.6, { opacity: 0.7 });               // the bands round it
for (const u of [10, 46]) for (const v of [56, 70, 84]) mark([[u - 6.3, v], [u + 6.3, v]], '#e8c060', 4, { opacity: 0.85 });   // studs
plate([[-52, 46], [-32, 42], [-32, 92], [-52, 86]], navy, { round: 8, across: true });                 // its mouth: a dark ring
mark([[-44, 50], [-44, 84]], '#ffb050', 5, { opacity: 0.9 });                                          // the fire inside it

// ---------------------------------------------------------------- its body
plate([[-14, -30], [8, -34], [8, 36], [-14, 30]], navy, { round: 8, across: true });                   // the waist
plate([[4, -34], [118, -38], [150, -12], [152, 26], [112, 44], [4, 38]], red, { round: 24 });          // the cuirass
mark([[10, -30], [60, -33], [118, -34]], '#3c0c18', 4.6, { opacity: 0.6 });
mark([[40, -32], [40, 36]], '#3c0c18', 4.4, { opacity: 0.5 }); mark([[84, -34], [84, 40]], '#3c0c18', 4.4, { opacity: 0.5 });   // the joints between its plates

// ---------------------------------------------------------------- its arm and its sword
plate([[108, -28], [142, -34], [130, -94], [96, -88]], red, { round: 12, across: true });              // the forearm: it reaches down to the hilt
mark([[100, -60], [136, -66]], '#c89438', 5);
plate([[98, -86], [124, -90], [122, -108], [98, -104]], navy, { round: 7 });                           // the hand
{ // the sword: a long blade, held low, with its point to the rear
  const a = M(150, -96), g = M(92, -98), b = M(-60, -106), c = M(-236, -118);
  p.stroke({ ...line, cap: 'round', color: '#1a1420', width: 7.5, points: [a, g] });                                   // the hilt
  for (const t of [0.2, 0.45, 0.7]) p.tryStroke({ brush: 'round', color: '#c89438', width: 4, points: [[a[0] + (g[0] - a[0]) * t - 3, a[1] + (g[1] - a[1]) * t - 6], [a[0] + (g[0] - a[0]) * t + 3, a[1] + (g[1] - a[1]) * t + 6.4]] });
  p.stroke({ ...line, color: '#e8c060', width: 6, points: [[g[0] - 3, g[1] - 13], [g[0] + 3, g[1] + 13]] });           // the guard
  for (const [w, col, op] of [[44, '#3c7cff', 0.1], [22, '#6cb4ff', 0.2]]) p.stroke({ brush: 'soft', color: col, width: w, opacity: op, points: [g, b, c] });
  p.stroke({ ...line, cap: 'round', color: '#9cb4dc', width: 9, taper: [0, 0.75], points: [g, b, c] });
  p.stroke({ brush: 'round', color: '#f8fcff', width: 4.4, taper: [0, 0.6], points: [[g[0] - 2, g[1] - 2.5], [b[0] - 2, b[1] - 2.5], [c[0], c[1] - 1]] });   // the light along its edge
  // lightning on the blade: forked lines of blue-white that leave it, each in three straight pieces that turn sharply
  for (let k = 0; k < 7; k++) {
    const t = 0.1 + 0.84 * (k + r()) / 7, side = k % 2 ? 1 : -1, base = Math.atan2(c[1] - g[1], c[0] - g[0]) + side * Math.PI / 2; let x = g[0] + (c[0] - g[0]) * t, y = g[1] + (c[1] - g[1]) * t;
    const pts = [[x, y]]; for (let i = 0; i < 3; i++) { const a0 = base + (i % 2 ? -1 : 1) * r.range(0.6, 1.0), l = r.range(15, 26); x += Math.cos(a0) * l; y += Math.sin(a0) * l; pts.push([x, y]); }
    for (let i = 0; i < 3; i++) { p.tryStroke({ brush: 'soft', color: '#58a0ff', width: 9, opacity: 0.16, points: [pts[i], pts[i + 1]] }); p.tryStroke({ brush: 'round', color: mix('#a8d8ff', '#ffffff', r()), width: 4.2, opacity: 0.95, points: [pts[i], pts[i + 1]] }); }
  }
}

// ---------------------------------------------------------------- its shoulder guard, its helmet and its horns
lamellar(58, 162, -26, 58, 5);                                                                         // the great shoulder guard
mark([[58, -26], [58, 58]], '#a8203c', 5); mark([[162, -26], [162, 58]], '#a8203c', 5);                // the red cords at its two ends
plate([[130, 50], [170, 60], [182, 26], [146, 14]], navy, { round: 9 });                               // the neck guard: dark plates behind the helmet
for (const k of [0.35, 0.7]) mark([[140 + 34 * k, 18 + 10 * k], [132 + 38 * k, 52 + 8 * k]], '#020208', 4.4, { opacity: 0.8 });
mark([[130, 50], [170, 60]], '#a8203c', 5, { cap: 'round' });
plate([[162, -10], [192, -22], [218, -8], [230, 18], [216, 44], [184, 54], [160, 36]], red, { round: 20 });   // the helmet: a round crimson bowl
mark([[176, 0], [196, 30], [204, 50]], '#3c0c18', 4.4, { opacity: 0.6 });                              // a rib of it
plate([[202, -22], [228, -8], [236, 14], [216, 14], [200, 0]], navy, { round: 7, edge: false });       // the mask: only its dark
mark([[190, 14], [214, 18], [240, 18]], '#f0cc6c', 6, { cap: 'round' });                               // the brim over it
plate([[190, 36], [212, 40], [214, 96], [186, 168], [192, 98]], gold, { round: 8, across: true });     // the near horn: tall, wide at its foot, bent back at its end
mark([[202, 48], [204, 96], [190, 154]], '#fff6d0', 4.4, { opacity: 0.85 });
mark([[184, 42], [218, 44]], '#e8c060', 7, { cap: 'round' });                                          // the gold plate on the brow that the horns stand on

// The fire of the thruster on the armour near it, and the red of the day under it.
glow(p, ...M(-60, 66), 60, '#ff8a3c', 0.08, 4);
p.stroke({ brush: 'soft', color: '#c8344c', width: 34, opacity: 0.14, points: [M(120, -44), M(0, -44), M(-200, -30)] });

p.save();
