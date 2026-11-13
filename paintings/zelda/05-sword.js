// The Master Sword, standing in its stone: the long blade, bright where the shaft of light
// strikes it, the winged guard of blue-violet with a gold stone at its heart, the wrapped
// grip. Round it the air is a little brighter than anywhere else in the glade.
'use strict';
const { studio, open, SWORD, SLANT } = require('./scene');
const { mix, glint } = studio;

const p = open('sword');
const r = p.rng;
const { x, top, foot } = SWORD, guard = top + 60;                        // the guard is a little under the grip
const steel = { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'flat', streak: 0.1, jitter: 0.2 };

// The light on it: the shaft, gathered, and a soft brightness round the blade.
p.stroke({ brush: 'soft', color: '#f6f6c4', width: 150, opacity: 0.16, points: [[x - 200 * SLANT - 60, top - 200], [x - 30, top + 60], [x + 60, foot + 60]] });
for (const [w, o] of [[110, 0.14], [56, 0.22], [28, 0.3]]) p.stroke({ brush: 'soft', color: '#eef6ff', width: w, opacity: o, points: [[x, top - w * 0.6], [x, (top + foot) / 2], [x, foot + w * 0.5]] });

// The blade: its lit side, its shaded side, the line down its middle.
p.stroke({ ...steel, color: '#f6faff', width: 9, points: [[x - 4.2, guard + 4], [x - 4.2, foot]] });
p.stroke({ ...steel, color: '#8e9cb8', width: 9, points: [[x + 4.2, guard + 4], [x + 4.2, foot]] });
p.stroke({ ...steel, color: '#c4cee0', width: 4.4, opacity: 0.9, points: [[x, guard + 30], [x, foot - 4]] });
p.stroke({ ...steel, cap: 'round', color: '#f6faff', width: 13, points: [[x - 2, guard + 2], [x - 2, guard + 30]] });   // it is broader under the guard
p.stroke({ ...steel, cap: 'round', color: '#8e9cb8', width: 8, points: [[x + 5, guard + 2], [x + 5, guard + 30]] });
glint(p, [[x - 8.4, guard + 10], [x - 8.4, (guard + foot) / 2], [x - 8.4, foot - 6]], () => '#ffffff', { width: 4, dash: 44, gap: 10, opacity: 0.95, rng: r });

// The guard: two wings that sweep out and up, blue-violet, and the gold stone between them.
const violet = (lit) => (lit ? mix('#6c5cd8', '#9c8cf4', r()) : mix('#2e2a8c', '#4038a8', r()));
for (const s of [-1, 1]) {
  p.stroke({ ...steel, cap: 'round', color: violet(s < 0), width: 11, taper: [0, 0.6], points: [[x + s * 4, guard + 2], [x + s * 26, guard], [x + s * 44, guard - 14], [x + s * 52, guard - 34]] });
  p.stroke({ ...steel, cap: 'round', color: violet(s < 0), width: 8, taper: [0, 0.6], points: [[x + s * 6, guard + 8], [x + s * 24, guard + 12], [x + s * 36, guard + 6]] });
}
p.stroke({ ...steel, cap: 'round', color: '#3a3498', width: 15, points: [[x, guard - 16], [x, guard + 15]] });
p.stroke({ ...steel, cap: 'round', color: '#f6d040', width: 7, points: [[x, guard - 7], [x, guard + 7]] });            // the stone
p.tryStroke({ color: '#fff6c0', width: 4, opacity: 0.9, points: [[x - 1.6, guard - 6.4], [x - 1.6, guard + 6.4]] });

// The grip, wrapped, and the pommel.
p.stroke({ ...steel, cap: 'round', color: '#2a6a58', width: 9.5, points: [[x, guard - 14], [x, top + 10]] });
for (let y = guard - 22; y > top + 12; y -= 10) p.tryStroke({ color: '#1c5040', width: 4, opacity: 0.4, points: [[x - 6.4, y + 1.5], [x + 6.4, y - 1.5]] });   // the wrapping
p.tryStroke({ color: '#7cc8a8', width: 4, opacity: 0.6, points: [[x - 3, guard - 18], [x - 3, top + 14]] });
p.stroke({ ...steel, cap: 'round', color: '#4a40b0', width: 9, points: [[x - 9.6, top + 6], [x, top + 2], [x + 9.6, top + 6]] });
p.stroke({ ...steel, cap: 'round', color: '#8a7ae8', width: 5, points: [[x - 7, top + 2], [x, top - 1.5], [x + 6, top + 1]] });

p.save();
