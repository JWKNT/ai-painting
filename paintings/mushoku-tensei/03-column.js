// The citadel of Roa and the column of light. Roa stands on a low rise in the plain: a
// wall with towers, roofs inside it, and the keep of the lord at the top. The column comes
// down on it out of the cloud: a great upright light, blue at its sides and white in its
// middle, as wide as the town. At its foot the light swells out and the town is being lost
// in it: only the towers at each end of the wall still stand dark against it.
'use strict';
const { studio, open, W, HORIZON, COL, nB } = require('./scene');
const { mix, clamp, glow, through } = studio;

const p = open('column');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.1, cap: 'flat' };

// ---------------------------------------------------------------- far hills, and the town
for (const [pts, c] of [[[[-20, 580], [240, 566], [480, 584], [1040, 586], [1300, 562], [1620, 578]], '#23233a'], [[[-20, 596], [300, 588], [560, 598], [980, 598], [1280, 584], [1620, 594]], '#1a1c2c']]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => y > top(x) + 2 * (nB(x / 30, 4) - 0.5) && y < HORIZON + 10, bounds: [0, 556, W, HORIZON + 10], width: 6, length: 50, spacing: 0.5, angle: () => r.range(-0.06, 0.06), color: (x) => mix(c, '#7cb0dc', Math.exp(-Math.pow((x - COL.x) / 420, 2)) * 0.5), stroke: { ...line, cap: 'round', opacity: 0.95 } });
}
// The rise that the town stands on, the wall round it, the roofs, the towers and the keep: all dark, since the light is behind and in them.
const rise = (x) => HORIZON - 26 * Math.exp(-Math.pow((x - COL.x) / 250, 2));
p.fill({ inside: (x, y) => y > rise(x) && y < HORIZON + 12, bounds: [COL.x - 420, HORIZON - 30, COL.x + 420, HORIZON + 12], width: 6, length: 40, spacing: 0.5, angle: () => r.range(-0.05, 0.05), color: () => mix('#101220', '#1c2030', r()), stroke: { ...line, opacity: 0.96 } });
const up = (x, y0, h, w, c) => p.tryStroke({ ...line, color: c, width: w, points: [[x, y0], [x, y0 - Math.max(h, w * 2.1, 12.5)]] });
for (let x = COL.x - 300; x <= COL.x + 300; x += 12.5) up(x, rise(x) + 3, 20, 13, mix('#0c0e1a', '#181c2c', r()));                                  // the wall
for (let x = COL.x - 300; x <= COL.x + 300; x += 60) { up(x, rise(x) + 3, 44, 18, '#0a0c16'); p.tryStroke({ ...line, color: '#0a0c16', width: 6, points: [[x - 12, rise(x) - 42], [x + 12, rise(x) - 42]] }); }   // its towers, each with a wider top
for (let k = 0; k < 46; k++) { const x = COL.x + r.gauss() * 130, t = Math.exp(-Math.pow((x - COL.x) / 150, 2)); up(x, rise(x) - 14, 14 + 44 * t * r(), r.range(9, 16), mix('#0c0e1a', '#1c2032', r())); }   // roofs, higher toward the middle
up(COL.x - 8, rise(COL.x) - 40, 74, 40, '#0a0c18'); up(COL.x + 30, rise(COL.x) - 36, 54, 24, '#0c0e1a'); up(COL.x - 36, rise(COL.x) - 36, 96, 14, '#090b15');   // the keep, and its tall tower
p.tryStroke({ ...line, cap: 'round', color: '#090b15', width: 6, taper: [0, 0.9], points: [[COL.x - 36, rise(COL.x) - 130], [COL.x - 36, rise(COL.x) - 156]] });

// ---------------------------------------------------------------- the column
// Its light in the air on each side of it; then the column: blue at its sides, white in its middle; then the white lines that run up it.
const foot = HORIZON - 16;
for (const [w, op] of [[420, 0.07], [300, 0.1]]) p.stroke({ brush: 'soft', color: '#4c9ce0', width: w, opacity: op, points: [[COL.x, HORIZON + 200], [COL.x, 420], [COL.x, -260]] });
// The body of it: upright strokes, as wide as the town. A place in it is white in the middle and blue toward each side, and its two sides are soft.
{ const body = (x) => { const k = Math.abs(x - COL.x) / COL.half; return mix(mix('#ffffff', '#9cd8ff', clamp(k * 1.5, 0, 1)), '#3c8ce0', clamp((k - 0.6) * 2.4, 0, 1)); };
  p.fill({ inside: (x, y) => Math.abs(x - COL.x) < COL.half && y > COL.top - 30 && y < foot + 20, bounds: [COL.x - COL.half, COL.top - 30, COL.x + COL.half, foot + 20], width: 9, length: 150, spacing: 0.5, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.01, 0.01), color: (x) => body(x + r.range(-4, 4)), stroke: { brush: 'bristle', mix: 0.3, rag: 0.3, dry: 0.03, cap: 'round', opacity: 0.9 } });
  for (const s of [-1, 1]) for (const [w, op, d] of [[70, 0.3, 1.0], [40, 0.4, 0.92]]) p.stroke({ brush: 'soft', color: '#4c9ce8', width: w, opacity: op, points: [[COL.x + s * COL.half * d, foot + 20], [COL.x + s * COL.half * d, 400], [COL.x + s * COL.half * d, COL.top - 40]] });   // its soft sides
  for (const [w, op] of [[90, 0.5], [50, 0.7]]) p.stroke({ brush: 'soft', color: '#ffffff', width: w, opacity: op, points: [[COL.x, foot + 20], [COL.x, 400], [COL.x, COL.top - 60]] });   // its white middle
}
for (let k = 0; k < 40; k++) { const x = COL.x + r.gauss() * COL.half * 0.45, y0 = r.range(COL.top - 10, foot - 60), len = r.range(60, 190); p.tryStroke({ brush: 'bristle', color: mix('#c8ecff', '#ffffff', r()), width: r.range(4.8, 7), opacity: r.range(0.2, 0.5), mix: 0.2, rag: 0.3, cap: 'round', taper: [0.4, 0.6], points: [[x, y0 + len], [x + r.range(-2, 2), y0]] }); }
// Where it meets the cloud, the light spreads out under the cloud, flat.
for (const [w, op, n] of [[380, 0.1, 5], [260, 0.16, 6], [160, 0.24, 6], [90, 0.3, 6]]) glow(p, COL.x, COL.top - 4, w, '#dcf2ff', op, n, 0.36);
// At its foot the light swells out over the town, and lies along the ground on each side.
for (const [w, op, n] of [[330, 0.1, 5], [230, 0.18, 6], [150, 0.3, 6], [90, 0.5, 6]]) glow(p, COL.x, HORIZON - 30, w, mix('#8cd0ff', '#ffffff', 1 - w / 340), op, n, 0.62);
for (const [w, op, reach] of [[70, 0.14, 560], [40, 0.24, 420], [20, 0.4, 300]]) p.stroke({ brush: 'soft', color: '#e4f6ff', width: w, opacity: op, taper: [0.8, 0.8], points: [[COL.x - reach, HORIZON - 6], [COL.x, HORIZON - 12], [COL.x + reach, HORIZON - 6]] });
// The towers at each end of the wall, again, over the light: these are still there.
for (const s of [-1, 1]) for (const d of [240, 300]) { const x = COL.x + s * d; up(x, rise(x) + 3, 44, 16, '#080a14'); p.tryStroke({ brush: 'round', color: '#bfe6ff', width: 4, opacity: 0.8, points: [[x - s * 8.6, rise(x) + 2], [x - s * 8.6, rise(x) - 42]] }); }
p.save();
