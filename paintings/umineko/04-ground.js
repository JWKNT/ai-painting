// The far end of the garden and the ground of it. A long clipped hedge goes across, and the
// roses on it are small lights. In front of it lies the paving: large square flags of pale
// stone, to the place where the arbor stands, and then the wide way that comes from there to
// us. The stone holds the sky, turned over, and the gold of the beds at each side of it.
'use strict';
const { studio, open, W, H, HZ, AVENUE, BEDS, ARBOR, at, unit, groundAt, skyColor, spark, nC, nD } = require('./scene');
const { mix, smooth, noise2 } = studio;

const p = open('ground');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.2, cap: 'round' };

// ---------------------------------------------------------------- the long hedge
const fb = BEDS.far, hedgeTop = at(0, fb.h, fb.z0)[1], hedgeFoot = at(0, 0, fb.z0)[1];
{
  const leaf = (x, y) => { const t = (y - hedgeTop) / (hedgeFoot - hedgeTop); return mix(mix(mix('#0a1f12', '#1e4a22', nC(x / 12, y / 8)), '#5c7a24', smooth(0.3, 0, t) * 0.4), '#040d08', smooth(0.5, 1, t) * 0.6); };
  p.fill({ bounds: [0, hedgeTop - 1, W, hedgeFoot + 2], width: 6, length: 20, spacing: 0.5, angle: () => r.range(0, 3.14), color: leaf, stroke: { ...line, opacity: 0.95 } });
  for (let x = -10; x < W; x += r.range(30, 70)) p.tryStroke({ ...line, color: mix('#3c6a2c', '#7c9a3c', r()), width: 5, opacity: 0.6, points: [[x, hedgeTop + r.range(0, 2)], [x + r.range(26, 60), hedgeTop + r.range(0, 2)]] });   // its level top
  for (let k = 0; k < 14; k++) { const x = r.range(-100, W - 200), len = r.range(260, 520), y = r.range(hedgeTop - 8, hedgeTop + 22); p.stroke({ brush: 'soft', color: '#e8b428', width: r.range(20, 36), opacity: r.range(0.08, 0.14), points: [[x, y], [x + len / 2, y + r.range(-2, 2)], [x + len, y]] }); }   // the light of its roses, over it
  for (let k = 0; k < 420; k++) spark(p, r.range(0, W), hedgeTop + 3 + Math.pow(r(), 0.8) * (hedgeFoot - hedgeTop - 12), r.range(0.45, 1));
}

// ---------------------------------------------------------------- the ground
const FLAG = 1.2, stone = noise2(3351);
const paved = (x, y) => { const [X, Z] = groundAt(x, y); return (X >= AVENUE.left && X <= AVENUE.right) || Z >= 15; };
// How much of the gold of the roses lies on a place of the ground.
function goldOn(X, Z) {
  let g = Math.exp(-Math.max(0, fb.z0 - Z) / 3) * 0.8;                                                               // from the long hedge
  g = Math.max(g, Math.exp(-Math.max(0, X - AVENUE.left) / 1.7) * smooth(5.5, 7.5, Z) * smooth(16.5, 14.5, Z));     // from the beds at the left
  g = Math.max(g, Math.exp(-Math.max(0, AVENUE.right - X) / 1.7) * smooth(6.5, 8.5, Z) * smooth(16.5, 14.5, Z));    // and at the right
  return Math.max(g, 0.5 * Math.exp(-Math.pow(Math.hypot(X - ARBOR.X, Z - ARBOR.Z) / 5.5, 2)));                      // and from the roses that stand by the arbor
}
function paving(x, y) {
  const [X, Z] = groundAt(x, y), fx = X / FLAG - Math.floor(X / FLAG), fz = Z / FLAG - Math.floor(Z / FLAG);
  const joint = Math.max(smooth(0.05, 0, Math.min(fx, 1 - fx)), smooth(0.05, 0, Math.min(fz, 1 - fz))) * smooth(26, 12, Z);
  let c = mix('#544c66', '#7c7296', stone(Math.floor(X / FLAG + 100) * 3.7, Math.floor(Z / FLAG) * 5.3));   // each flag has its own grey
  c = mix(c, '#3a3250', (nD(X * 2.2, Z * 2.2) - 0.5) * 0.5);                                                 // old stains
  c = mix(c, skyColor(x, 2 * HZ - y), 0.38);                                                                // the sky, turned over in it
  c = mix(c, '#ecc054', goldOn(X, Z) * 0.55);                                                               // the gold
  c = mix(c, '#1e172c', joint * 0.55);
  return mix(c, '#0f0a18', smooth(900, 1060, y) * 0.3);
}
const lawn = (x, y) => { const [X, Z] = groundAt(x, y); return mix(mix(mix('#0a1a10', '#16321c', nC(x / 30, y / 6)), '#6c7a24', goldOn(X, Z) * 0.4), '#04080a', smooth(940, 1040, y) * 0.5); };
const groundColor = (x, y) => (paved(x, y) ? paving(x, y) : lawn(x, y));
const level = () => r.range(-0.02, 0.02);
p.fill({ bounds: [0, hedgeFoot, W, 770], width: 5.5, length: 44, spacing: 0.5, angle: level, color: groundColor, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 758, W, 870], width: 8, length: 84, spacing: 0.5, angle: level, color: groundColor, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 856, W, H], width: 11, length: 130, spacing: 0.5, angle: level, color: groundColor, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, hedgeFoot, W, H], width: 5.5, length: 50, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => groundColor(x + r.range(-9, 9), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });

// The joints of the flags. Those that go away from us go to one point; those that lie across are level, and closer together far off.
for (let X = -14.4 + 0.6; X <= 18; X += FLAG) {
  const inWay = X >= AVENUE.left - 0.01 && X <= AVENUE.right + 0.01, z1 = inWay ? 5.2 : 15;
  let run = [];
  const end = () => { if (run.length > 1) p.tryStroke({ brush: 'round', color: '#1e172c', width: 4, opacity: 0.42, points: run }); run = []; };
  for (let Z = fb.z0 - 0.3; Z > z1; Z -= 0.5) { const [x, y] = at(X, 0, Z); if (y < H + 20 && x > -20 && x < W + 20 && r() < 0.94) run.push([x, y]); else end(); }
  end();
}
for (let Z = 6; Z < fb.z0; Z += FLAG * (Z < 14 ? 1 : Z < 20 ? 2 : 3)) {
  const y = at(0, 0, Z)[1], x0 = Z < 15 ? at(AVENUE.left, 0, Z)[0] : -20, x1 = Z < 15 ? at(AVENUE.right, 0, Z)[0] : W + 20;
  let run = [];
  const end = () => { if (run.length > 1) p.tryStroke({ brush: 'round', color: '#1e172c', width: 4, opacity: 0.2 + 0.24 * smooth(22, 7, Z), points: run }); run = []; };
  for (let x = Math.max(-20, x0); x <= Math.min(W + 20, x1); x += 16) { if (r() < 0.95) run.push([x, y + r.range(-0.4, 0.4)]); else end(); }
  end();
}
// The edge of the way: a line of narrow stones along each side, a little lighter than the flags.
for (const X of [AVENUE.left + 0.14, AVENUE.right - 0.14]) for (let Z = 5.2; Z < 15; Z *= 1.16) {
  const Zn = Math.min(15, Z * 1.16), a = at(X, 0, Z), b = at(X, 0, Zn);
  if (a[1] < H + 30 && Math.max(a[0], b[0]) > -20 && Math.min(a[0], b[0]) < W + 20) p.tryStroke({ ...line, color: mix('#8c84a6', '#c8b070', 0.45), width: Math.max(4.8, 0.2 * unit((Z + Zn) / 2)), opacity: 0.7, points: [a, b] });
}

p.save();
