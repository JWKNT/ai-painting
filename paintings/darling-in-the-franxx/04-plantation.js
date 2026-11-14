// The Plantation. It is far off, three kilometres wide: one low dome of pale steel plates,
// with the lines where the plates meet, a dark band round its foot, and on its top the
// small dome of glass that is the Birdcage. The last light is on its right side, rose and
// gold; its left side and its top are in the blue of the evening. It has small lamps,
// low down and round the Birdcage, and a great round mark of orange on its side. At its
// foot stand tanks like balls of gold, and the dust that it raises lies all round it.
'use strict';
const { studio, open, DOME, CAGE, glare, far, domeTop, domeAt, domeBack, nB, hash } = require('./scene');
const { mix, clamp, smooth, orb, glow, inPoly } = studio;

const p = open('plantation');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.12, dry: 0.02, rag: 0.1, cap: 'round' };
const AIR = 0.22;                                                          // how much of the evening air is between us and it
const D = DOME;

// ---------------------------------------------------------------- the dome
// The steel at a place on it. A plate has its own tone. The light is on what is turned to the right; the sky is on what is turned up.
function steel(x, y) {
  const { v, phi } = domeBack(x, y), plate = hash(Math.floor((phi + 2) * 5 + Math.floor(v * 6) * 1.7), Math.floor(v * 6));
  const toSun = clamp(Math.sin(phi) * (1 - v * 0.5) + 0.1 * v, -1, 1), up = smooth(0.45, 1, v);
  let c = mix('#5a6282', '#7a8098', plate * 0.6 + 0.2);                                              // in the shade it is a blue-violet grey
  c = mix(c, '#6c98a4', up * 0.5);                                                                    // the blue-green of the sky, on its top
  c = mix(c, '#f6a480', smooth(-0.25, 0.7, toSun) * (0.92 - 0.3 * up));                               // the rose of the last light, on its right side
  c = mix(c, '#ffe2b0', smooth(0.5, 0.95, toSun) * smooth(0.75, 0.05, v) * 0.9);                      // and gold where that light strikes it full
  c = mix(c, '#3e4468', smooth(0.1, -0.9, toSun) * 0.45);                                             // its left side is deep in the shade
  c = mix(c, '#3c3c58', smooth(0.07, 0, v) * 0.6);                                                    // the dark band round its foot
  return far(mix(c, '#2c2c44', (nB(x / 26, y / 9) - 0.5) * 0.18), x, y, AIR);
}
p.fill({ inside: (x, y) => y > domeTop(x) && y < D.base + 3, bounds: [D.x - D.rx, D.base - D.ry, D.x + D.rx, D.base + 3], width: 9, length: 80, spacing: 0.5, overlap: 0.6, angle: (x, y) => (x - D.x) / D.rx * 0.5 * (1 - domeBack(x, y).v), color: steel, stroke: { ...line, opacity: 0.97 } });
p.fill({ inside: (x, y) => y > domeTop(x) + 2 && y < D.base + 3, bounds: [D.x - D.rx, D.base - D.ry, D.x + D.rx, D.base + 3], width: 5.5, length: 44, spacing: 0.9, overlap: 0.7, angle: (x, y) => (x - D.x) / D.rx * 0.5 * (1 - domeBack(x, y).v), color: (x, y) => steel(x + r.range(-4, 4), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.82 } });
// The lines where the plates meet: some go round it, some go up it, and no line goes all the way.
const seam = (pts, x, y) => { const { phi } = domeBack(x, y), lit = Math.sin(phi) > 0.2; p.tryStroke({ brush: 'round', color: far(lit ? '#b47c6c' : '#3a405c', x, y, AIR), width: 4, opacity: lit ? 0.34 : 0.38, points: pts }); };
for (const v of [0.1, 0.24, 0.4, 0.56, 0.72, 0.86]) for (let a = -1.5; a < 1.5;) { const span = r.range(0.25, 0.8), b = Math.min(1.5, a + span); if (r() < 0.8 && b - a > 0.12) { const pts = []; for (let k = 0; k <= 6; k++) pts.push(domeAt(a + (b - a) * k / 6, v)); seam(pts, ...domeAt((a + b) / 2, v)); } a = b + r.range(0.02, 0.12); }
for (let k = 0; k < 44; k++) { const phi = r.range(-1.45, 1.45), bands = [0.1, 0.24, 0.4, 0.56, 0.72, 0.86, 0.96], i = Math.floor(r() * 6), v0 = bands[i], v1 = bands[i + 1], pts = [domeAt(phi, v0), domeAt(phi, (v0 + v1) / 2), domeAt(phi, v1)]; if (Math.hypot(pts[2][0] - pts[0][0], pts[2][1] - pts[0][1]) > 13) seam(pts, ...pts[1]); }
// Small dark openings in the plates, and the lamps: low down, in rows, warm.
for (let k = 0; k < 26; k++) { const [x, y] = domeAt(r.range(-1.4, 1.4), r.range(0.12, 0.8)); p.tryStroke({ brush: 'round', color: far('#2c3048', x, y, AIR), width: 4, opacity: 0.2, taper: [0.3, 0.3], points: [[x - 6.2, y], [x + 6.2, y]] }); }
for (const v of [0.035, 0.085]) for (let a = -1.45; a < 1.45; a += r.range(0.05, 0.12)) { if (r() < 0.3) continue; const [x, y] = domeAt(a, v); p.tryStroke({ brush: 'round', color: mix('#ffd88c', '#fff4d0', r()), width: 4, opacity: r.range(0.5, 0.95), points: [[x - 6.2, y], [x + 6.2, y]] }); }
// The great round mark on its side: orange, and it gives a little light.
{ const [mx, my] = domeAt(0.72, 0.46), pts = (k) => { const out = []; for (let i = 0; i <= 10; i++) { const a = i / 10 * Math.PI * 2; out.push([mx + Math.cos(a) * 40 * k * 0.72, my + Math.sin(a) * 23 * k]); } return out; };
  glow(p, mx, my, 60, '#ff9c4c', 0.08, 4, 0.6);
  p.fill({ inside: inPoly(pts(1)), bounds: [mx - 34, my - 26, mx + 34, my + 26], width: 6, length: 30, spacing: 0.5, angle: () => 0.2, color: () => mix('#f0a058', '#ffcf8c', r()), stroke: { ...line, opacity: 0.95 } });
  p.tryStroke({ brush: 'round', color: '#fff0c8', width: 4, opacity: 0.6, points: pts(0.6).slice(5, 9) }); }
// The line of light along its right edge, where the sun strikes it full, and the dark of its left edge.
{ const pts = []; for (let v = 0.06; v <= 0.9; v += 0.06) pts.push(domeAt(1.5, v)); studio.glint(p, pts.map(([x, y]) => [x - 3, y]), () => mix('#ffd8a0', '#fff4dc', r()), { width: 5, dash: 60, gap: 8, opacity: 0.85, rng: r }); }

// ---------------------------------------------------------------- the Birdcage: a dome of glass on the top, with a net of thin bars, and a soft light inside
{
  const cx = D.x, cy = D.base - D.ry + 12, inside = (x, y) => y < cy && Math.pow((x - cx) / CAGE.rx, 2) + Math.pow((y - cy) / CAGE.ry, 2) < 1;
  for (let k = -1; k <= 1; k += 0.25) p.tryStroke({ brush: 'round', color: far('#4c5470', cx, cy, AIR), width: 4, points: [[cx + k * (CAGE.rx + 16), cy + 2], [cx + k * (CAGE.rx + 16), cy + 2 - 14 - 10 * (1 - Math.abs(k))]] });   // short masts round its foot
  p.stroke({ ...line, cap: 'flat', color: far('#8c8ca4', cx, cy, AIR), width: 9, points: [[cx - CAGE.rx - 22, cy + 3], [cx + CAGE.rx + 22, cy + 3]] });                                                                           // the ring that it stands on
  glow(p, cx, cy - 22, 120, '#bfe8c8', 0.07, 4, 0.6);
  p.fill({ inside, bounds: [cx - CAGE.rx, cy - CAGE.ry, cx + CAGE.rx, cy], width: 6, length: 34, spacing: 0.5, angle: (x, y) => Math.atan2((y - cy) / (CAGE.ry * CAGE.ry), (x - cx) / (CAGE.rx * CAGE.rx)) + Math.PI / 2, color: (x, y) => { const u = (x - cx) / CAGE.rx, v = (cy - y) / CAGE.ry; let c = mix('#5c9c94', '#bfe8c0', smooth(0.9, 0.1, v) * 0.8); c = mix(c, '#f8dca0', Math.exp(-Math.pow(Math.hypot(u * 1.2, v - 0.1) / 0.5, 2)) * 0.6); c = mix(c, '#ffb48c', smooth(0.2, 1, u) * 0.5); return far(mix(c, '#3c5c70', smooth(-0.3, -1, u) * 0.5), x, y, AIR * 0.6); }, stroke: { ...line, opacity: 0.96 } });   // the glass: green with the trees inside it, gold with their lamps, rose where the sun is on it
  for (const k of [-0.75, -0.4, 0, 0.4, 0.75]) { const pts = []; for (let i = 0; i <= 8; i++) { const v = i / 8; pts.push([cx + k * CAGE.rx * Math.sqrt(1 - v * v), cy - v * CAGE.ry]); } p.tryStroke({ brush: 'round', color: far('#46586c', cx, cy, AIR * 0.6), width: 4, opacity: 0.4, points: pts }); }
  for (const v of [0.4, 0.74]) { const pts = []; for (let i = 0; i <= 10; i++) { const u = -1 + 2 * i / 10; pts.push([cx + u * CAGE.rx * Math.sqrt(1 - v * v), cy - v * CAGE.ry + 4 * (1 - u * u)]); } p.tryStroke({ brush: 'round', color: far('#46586c', cx, cy, AIR * 0.6), width: 4, opacity: 0.5, points: pts }); }
  { const pts = []; for (let i = 0; i <= 8; i++) { const a = -0.1 - 1.2 * i / 8; pts.push([cx + Math.cos(a) * (CAGE.rx - 3), cy + Math.sin(a) * (CAGE.ry - 3)]); } p.tryStroke({ brush: 'round', color: '#ffe8c8', width: 4.4, opacity: 0.85, points: pts }); }   // the light on its right side
  p.tryStroke({ brush: 'round', color: far('#4c5470', cx, cy, AIR), width: 4, points: [[cx, cy - CAGE.ry + 2], [cx, cy - CAGE.ry - 26]] });
  p.tryStroke({ brush: 'round', color: '#ff5c4c', width: 4, points: [[cx - 6.2, cy - CAGE.ry - 26], [cx + 6.2, cy - CAGE.ry - 26]] });                                                                                              // a red lamp on its top
}

// ---------------------------------------------------------------- at its foot: the tanks, and the dust
for (const [x, rad] of [[D.x - 262, 30], [D.x - 150, 18], [D.x + 60, 15], [D.x - 208, 13]]) {
  const cy = D.base + 4 - rad * 0.55;
  orb(p, [[x, cy, rad]], (px, py) => { const k = clamp(((px - x) * 0.9 + (py - cy) * 0.3) / rad, -1, 1); return far(k > 0 ? mix('#b08a4c', '#ffdc94', k) : mix('#b08a4c', '#4c3c44', -k), px, py, AIR * 0.8); }, { width: 5.5, reach: rad * 0.8 });
}
// The dust at its foot: it lies in low heaps, rose on the right side of each and violet on the left, and it hides where the dome meets the ground.
for (let k = 0; k < 70; k++) {
  const x = D.x + r.range(-D.rx - 120, D.rx + 150), y = D.base + r.range(-6, 30), w = r.range(26, 70), warm = clamp(0.2 + (x - D.x) / (D.rx * 1.6) + glare(x, y, 700), 0, 1);
  p.stroke({ brush: 'soft', color: mix('#7c6c88', '#f4b890', warm), width: w, opacity: r.range(0.08, 0.2), points: [[x - w * 1.1, y + 6], [x, y - r.range(2, 14)], [x + w * 1.1, y + 4]] });
}
// The plain in front of it is a little darker: it is between that ground and the bright sky.
p.stroke({ brush: 'soft', color: '#20141e', width: 50, opacity: 0.22, points: [[D.x + 200, D.base + 32], [D.x - 100, D.base + 44], [D.x - 380, D.base + 48]] });

p.save();
