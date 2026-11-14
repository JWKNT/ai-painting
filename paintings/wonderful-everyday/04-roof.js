// The floor of the roof: flat grey squares of concrete, wet. Water lies on it in wide thin
// sheets, and we look across it from so low that the water is a mirror: it holds the sky,
// the foot of the great cloud, and the dark of the hut. Where the floor is dry it is pale in
// the sun and blue grey in the shade of the hut, which comes toward us. Under the sun there
// is a path of small lights on the water.
'use strict';
const { studio, open, W, H, HZ, SUN, ROOF, HUT, at, floorAt, shaded, water, mirror, nA, nB, nC } = require('./scene');
const { mix, smooth } = studio;

const p = open('roof');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.15, dry: 0.03, rag: 0.2, cap: 'round' };
const edge = at(0, 0, ROOF.far)[1];                                                      // the far edge of the floor, in the picture
const onRoof = (x, y) => { if (y < edge) return false; const [X] = floorAt(x, y); return X > ROOF.left && X < ROOF.right; };
const path = (x, y) => Math.exp(-Math.pow((x - SUN.x) / (70 + (y - HZ) * 1.1), 2));     // the path of the sun on the floor: it is wider near us
const hutBase = at(HUT.x1, 0, HUT.z0), hutBack = at(HUT.x1, 0, HUT.z1);
const underHut = (x, y) => (x < hutBase[0] ? y > hutBase[1] : x < hutBack[0] && y > hutBase[1] + (hutBack[1] - hutBase[1]) * (x - hutBase[0]) / (hutBack[0] - hutBase[0]));   // where the water shows the hut, turned over
// The color of a place of the floor.
function floor(x, y) {
  const [X, Z] = floorAt(x, y), w = water(x, y), shade = shaded(X, Z), sun = path(x, y);
  // dry concrete: squares of 2 m, each a little different, with dark joints
  const jx = Math.abs(X / 2 - Math.round(X / 2)) * 2, jz = Math.abs(Z / 2 - Math.round(Z / 2)) * 2, joint = Math.max(smooth(0.06, 0, jx), smooth(0.05 + Z * 0.004, 0, jz));
  let dry = mix(mix('#8c929e', '#a8acb4', nB(Math.floor(X / 2 + 50) * 7.3, Math.floor(Z / 2) * 3.7)), '#70767e', (nC(X * 3, Z * 3) - 0.5) * 0.4);
  dry = mix(dry, '#fbfcff', sun * 0.6);
  if (shade) dry = mix(dry, '#33435f', 0.72);
  dry = mix(dry, shade ? '#1f2a3f' : '#565c68', joint * 0.6);
  // water: the sky turned over; the hut, where it stands over the water; the sun's light on it
  let wet = underHut(x, y) ? mix('#2f3e5c', '#46587c', nA(x / 60, y / 14)) : mirror(x, y);
  wet = mix(wet, '#ffffff', sun * 0.5);
  const damp = mix(dry, shade ? '#1c2638' : '#4c545f', smooth(0, 0.5, w) * 0.55);         // the floor is dark where it is only wet
  return mix(damp, wet, smooth(0.5, 0.9, w));
}
const level = () => r.range(-0.02, 0.02);
p.fill({ inside: onRoof, bounds: [0, edge, W, edge + 60], width: 5.5, length: 50, spacing: 0.5, angle: level, color: floor, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: onRoof, bounds: [0, edge + 50, W, edge + 120], width: 7, length: 80, spacing: 0.5, angle: level, color: floor, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: onRoof, bounds: [0, edge + 108, W, H], width: 10, length: 120, spacing: 0.5, angle: level, color: floor, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: onRoof, bounds: [0, edge, W, H], width: 5.5, length: 44, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => floor(x + r.range(-8, 8), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });

// The joints of the squares that go away from us: thin dark lines to the point that all of them go to. The water breaks them.
for (let X = -8; X <= 4; X += 2) {
  let run = [];
  const end = () => { if (run.length > 1) p.tryStroke({ brush: 'round', color: '#4c5460', width: 4, opacity: 0.5, points: run }); run = []; };
  for (let Z = ROOF.far; Z > 4.2; Z -= 0.4) { const [x, y] = at(X, 0, Z); if (y < H + 10 && water(x, y) < 0.5 && r() < 0.96) run.push([x, y]); else end(); }
  end();
}
// The joints that lie across: level lines, closer together far off.
for (let Z = 6; Z <= ROOF.far; Z += 2) {
  const y = at(0, 0, Z)[1], x0 = at(ROOF.left, 0, Z)[0], x1 = at(ROOF.right, 0, Z)[0];
  let run = [];
  const end = () => { if (run.length > 1) p.tryStroke({ brush: 'round', color: '#4c5460', width: 4, opacity: 0.42, points: run }); run = []; };
  for (let x = Math.max(-10, x0); x < Math.min(W + 10, x1); x += 14) { if (water(x, y) < 0.5 && r() < 0.95) run.push([x, y + r.range(-0.4, 0.4)]); else end(); }
  end();
}
// The edges of the water: a thin light where a sheet of water ends, on the side away from us.
for (let k = 0; k < 520; k++) {
  const x = r.range(0, W), y = r.range(edge + 4, H - 4);
  if (!onRoof(x, y) || underHut(x, y)) continue;
  const here = water(x, y), up = water(x, y - 7);
  if (here > 0.7 && up < 0.4) { const len = r.range(14, 40) * (0.5 + (y - HZ) / 200); p.tryStroke({ brush: 'round', color: '#f4f9ff', width: 4, opacity: r.range(0.35, 0.7), points: [[x - len / 2, y - 4], [x + len / 2, y - 4 + r.range(-1, 1)]] }); }
}
// Small waves that the wind makes on the water: level touches, lighter or darker than the water under them.
for (let k = 0; k < 420; k++) {
  const x = r.range(0, W), y = r.range(edge + 6, H - 4);
  if (!onRoof(x, y) || water(x, y) < 0.8) continue;
  const len = r.range(16, 60) * (0.4 + (y - HZ) / 160), c = floor(x, y);
  p.tryStroke({ ...line, color: mix(c, r() < 0.55 ? '#ffffff' : '#34486c', r.range(0.12, 0.3)), width: r.range(4.8, 6.5), opacity: 0.7, taper: [0.5, 0.5], points: [[x - len / 2, y], [x + len / 2, y + r.range(-1, 1)]] });
}
// The path of the sun on the water: many small lights, more of them and wider near us.
for (let k = 0; k < 700; k++) {
  const y = edge + 4 + Math.pow(r(), 0.8) * (H - edge - 8), x = SUN.x + r.gauss() * (60 + (y - HZ) * 1.0);
  if (!onRoof(x, y) || water(x, y) < 0.6 || r() > path(x, y) + 0.1) continue;
  const len = r.range(12.4, 16) + (y - HZ) * r.range(0, 0.12);
  p.tryStroke({ brush: 'round', color: '#ffffff', width: r.range(4, 4.8), opacity: r.range(0.5, 1), points: [[x - len / 2, y], [x + len / 2, y]] });
}
for (const dx of [-50, 0, 50]) p.stroke({ brush: 'soft', color: '#ffffff', width: 96, opacity: 0.1, points: [[SUN.x + dx * 0.4, edge + 6], [SUN.x + dx * 0.7, 900], [SUN.x + dx, H + 20]] });   // and the glow of that path

p.save();
