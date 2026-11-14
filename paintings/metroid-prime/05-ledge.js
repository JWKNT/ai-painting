// The ledge that we stand on. It is deep in snow: pale, and blue in its hollows and
// toward us. At its right side it falls to the lake, and there we see the dark rock under
// the snow. A few stones stand up out of the snow. Her footprints come up the ledge from
// the foot of the picture to where she stands.
'use strict';
const { studio, open, H, cam, SAMUS, ledgeEdge, onLedge, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, solid, inPoly } = studio;

const p = open('ledge');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.03, rag: 0.2, cap: 'round' };

// ---------------------------------------------------------------- the dark rock of its right side, down to the water
{ const a = [], b = []; for (let x = 596; x <= 852; x += 16) { a.push([x, ledgeEdge(x) - 2]); b.push([x + 12 + (x - 596) * 0.3, ledgeEdge(x) + 10 + (x - 596) * 0.1]); }
  const poly = [...a, [852, 1010], [960, 1010], ...b.reverse()];
  p.fill({ inside: inPoly(poly), bounds: [590, 730, 970, H + 6], width: 10, length: 60, spacing: 0.5, overlap: 0.6, angle: () => 1.25 + r.range(-0.2, 0.2), color: (x, y) => mix(mix('#1e2327', '#444b50', nA(x / 16, y / 60)), '#aebcc6', smooth(0.66, 0.76, nD(x / 30, y / 40)) * 0.6), stroke: { ...line, rag: 0.4, opacity: 0.97 } }); }

// ---------------------------------------------------------------- the snow
const snow = (x, y) => {
  const t = clamp((y - 712) / 290, 0, 1), drift = nA(x / 260, y / 70), fine = nC(x / 40, y / 14);
  let c = mix('#e6ecef', '#b9c8d4', smooth(0.1, 1, t) * 0.75);                                    // pale far off; bluer toward us, where we look down on it
  c = mix(c, drift > 0.5 ? '#f6f8f8' : '#9fb2c2', Math.abs(drift - 0.5) * 0.7);                   // long low drifts: light on their tops, blue in the hollows between them
  c = mix(c, '#fafbfb', smooth(18, 0, y - ledgeEdge(x)) * 0.6);                                   // its far edge takes the light
  return mix(c, '#a8b8c6', (fine - 0.5) * 0.16);
};
for (const [y0, y1, w, len] of [[700, 800, 8, 90], [792, 900, 11, 130], [892, H + 4, 14, 170]]) p.fill({ inside: onLedge, bounds: [0, y0, 860, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: (x, y) => -0.03 + (nB(x / 300, y / 120) - 0.5) * 0.24, color: snow, stroke: { ...line, opacity: 0.97 } });
p.fill({ inside: (x, y) => onLedge(x, y - 3), bounds: [0, 705, 860, H + 4], width: 6, length: 60, spacing: 1.1, overlap: 0.7, angle: (x, y) => -0.03 + (nB(x / 300, y / 120) - 0.5) * 0.24, color: (x, y) => snow(x + r.range(-10, 10), y + r.range(-4, 4)), stroke: { ...line, opacity: 0.8 } });
// Stones that stand up out of the snow: dark, each with snow on its top and blue shade at its right.
for (const [x, y, s] of [[94, 760, 30], [716, 940, 34], [40, 944, 26]]) {
  p.tryStroke({ brush: 'soft', color: '#8094a8', width: Math.max(12, s * 0.7), opacity: 0.4, points: [[x - s * 0.4, y + s * 0.3], [x + s * 0.8, y + s * 0.42], [x + s * 1.9, y + s * 0.5]] });
  solid(p, [[x - s * 0.5, y, s * 0.5], [x + s * 0.5, y + s * 0.04, s * 0.42]], { shadow: '#181c20', half: '#363c42', lit: '#727c84', bounce: '#5c6c7c' }, { light: [-0.5, -0.86], turn: 0.1, width: 6, length: Math.max(14, s * 0.5), vary: 0.1, flow: () => 0.1, edge: false });
  p.tryStroke({ ...line, rag: 0.3, color: '#f4f7f8', width: Math.max(6, s * 0.3), points: [[x - s * 0.8, y - s * 0.34], [x - s * 0.1, y - s * 0.46], [x + s * 0.6, y - s * 0.3]] });
}
// Her footprints: two lines of them, from the foot of the picture up to her. Each is a small blue hollow; they are bigger near us.
{ const [fx, fy] = cam.at(SAMUS.X, 0, SAMUS.Z), start = [300, 1010];
  for (let i = 0; i < 13; i++) { const t = i / 13, x = start[0] + (fx - start[0]) * t + (i % 2 ? 1 : -1) * (26 - 12 * t) + 18 * Math.sin(t * 3.1), y = start[1] + (fy + 8 - start[1]) * Math.pow(t, 0.8), s = 30 - 15 * t;
    p.tryStroke({ ...line, rag: 0.2, color: '#7088a2', width: Math.max(6, s * 0.42), opacity: 0.8, points: [[x - s * 0.46, y + s * 0.1], [x, y], [x + s * 0.46, y - s * 0.14]] });
    p.tryStroke({ brush: 'round', color: '#f8fafa', width: 4, opacity: 0.6, taper: [0.3, 0.3], points: [[x - s * 0.4, y + s * 0.34], [x + s * 0.46, y + s * 0.14]] }); } }   // the light on the near lip of each
// A little snow has blown over the edge at the right.
for (let x = 600; x < 850; x += r.range(20, 50)) p.tryStroke({ ...line, rag: 0.4, color: mix('#e4eaee', '#fafbfb', r()), width: r.range(6, 10), points: [[x - 12, ledgeEdge(x - 12) + 1], [x + 4, ledgeEdge(x + 4) + 3], [x + 20, ledgeEdge(x + 20) + 6]] });

p.save();
