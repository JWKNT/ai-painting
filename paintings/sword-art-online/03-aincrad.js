// Aincrad: the floating castle, a cone of a hundred floors with the crimson palace at its
// tip. It stands between us and the sun, so it is a great dark shape with light only along
// its edges: floor on floor of dark openings, each ledge catching a little of the sun on the
// side that faces it. Its lower floors are already gone, and it ends in a ragged break.
'use strict';
const { studio, open, AX, TOP, glow, half, FLOORS, sag, ring, breakLine, stone, nB } = require('./scene');
const { mix, glint } = studio;

const p = open('aincrad');
const r = p.rng;

// The body, in strokes that run along the floors.
const inBody = (m) => (x, y) => y > TOP + m * 0.3 && y < breakLine(x) - m * 0.3 && Math.abs(x - AX) < half(y) - m;
const along = (x, y) => Math.atan(2 * sag(y) * (x - AX) / Math.pow(half(y), 2)) + (nB(x / 60, y / 30) - 0.5) * 0.08;
const box = [AX - 250, TOP, AX + 250, 480];
p.fill({ inside: inBody(5), bounds: box, width: 12, length: 90, spacing: 0.5, overlap: 0.55, angle: along, color: stone, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.03, rag: 0.1 } });
p.fill({ inside: inBody(3), bounds: box, width: 6.5, length: 44, spacing: 0.8, overlap: 0.7, angle: along, color: (x, y) => stone(x + r.range(-6, 6), y + r.range(-3, 3)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.15, rag: 0.1 } });

// Floor by floor: its two edges against the sky, its row of openings, and the sun on its ledge.
const standing = (x, y) => y + 5 < breakLine(x);
for (let i = 0; i < FLOORS.length - 1; i++) {
  const y0 = FLOORS[i], y1 = FLOORS[i + 1], ym = (y0 + y1) / 2, h0 = half(y0), h1 = half(y1);
  for (const s of [-1, 1]) {                                          // the wall where it turns out of sight
    const xa = AX + s * (h0 - 3), xb = AX + s * (h1 - 3);
    if (standing(xb, y1)) p.tryStroke({ brush: 'bristle', color: stone(xb - s * 2, ym), width: 6, mix: 0.1, dry: 0, rag: 0, cap: 'round', points: [[xa, y0], [(xa + xb) / 2 + s, ym], [xb, Math.max(y1, y0 + 12.6)]] });
  }
  // openings: short dark marks side by side along the floor, crowding together toward the
  // edges as the wall goes round, with gaps where a tower or a blank wall stands
  const n = Math.max(3, Math.round(h0 / 9.5)), skip = r.range(0, 1);
  for (let k = 0; k < n; k++) {
    const th0 = -1.4 + 2.8 * k / n, th1 = -1.4 + 2.8 * (k + 0.72) / n;
    const xa = AX + Math.sin(th0) * (h0 - 5), xb = AX + Math.sin(th1) * (h0 - 5), xm = (xa + xb) / 2;
    if (!standing(xm, ym + 4) || nB(k * 0.37 + skip * 9, i * 0.61) < 0.3) continue;
    const need = 12.5 - (xb - xa);
    p.tryStroke({ brush: 'bristle', color: mix(stone(xm, ym), '#0c0a28', 0.5), width: 4.6, opacity: 0.35 + 0.3 * Math.cos((th0 + th1) / 2), mix: 0.15, dry: 0.05, rag: 0.1, cap: 'round', points: [[xa - Math.max(0, need) / 2, ring(ym, xa) + 1.5], [xb + Math.max(0, need) / 2, ring(ym, xb) + 1.5]] });
  }
  // the sun along the ledge, on the side that faces it
  if (i % 2 === 0) {
    const lit = [];
    for (let x = AX + h0 * 0.42; x <= AX + h0 - 3; x += 8) if (standing(x, ring(y0, x))) lit.push([x, ring(y0, x) - 0.5]);
    if (lit.length > 3) glint(p, lit, () => mix('#ff9c68', '#ffe0a8', r()), { width: 4, dash: 20, gap: 16, opacity: 0.3 + 0.4 * glow(AX + h0, y0, 420), rng: r });
  }
}

// The outline against the sky: the sun down the side that faces it, and a thread of cold
// light from the sky down the other.
const edge = (s, from, to) => { const pts = []; for (let y = from; y <= to; y += 10) { const x = AX + s * (half(y) - 2.2); if (standing(x, y)) pts.push([x, y]); } return pts; };
glint(p, edge(1, TOP + 4, 470), () => mix('#ff9a60', '#fff0c4', r()), { width: 4.4, dash: 46, gap: 9, opacity: 0.9, rng: r });
glint(p, edge(-1, TOP + 4, 470), () => mix('#6a70b8', '#9aa4e0', r()), { width: 4, dash: 30, gap: 26, opacity: 0.5, rng: r });

// Slender towers standing up from the wall here and there.
for (const [i, s, tall] of [[5, -1, 20], [9, 1, 22], [14, -1, 26], [19, 1, 28], [24, -1, 26], [27, 1, 24], [3, 1, 16]]) {
  const y = FLOORS[i], x = AX + s * (half(y) - 4);
  if (!standing(x, y + 6)) continue;
  p.stroke({ brush: 'bristle', color: mix(stone(x, y - tall / 2), '#141238', 0.35), width: 5.2, mix: 0.05, dry: 0, rag: 0, cap: 'round', taper: [0, 0.7], points: [[x, y + 5], [x, y - tall * 0.5], [x + s * 0.4, y - tall]] });
  if (s > 0) p.tryStroke({ color: mix('#ffa870', '#fff0c4', r()), width: 4, opacity: 0.6, taper: [0, 0.6], points: [[x + 2, y + 2], [x + 2.2, y - tall + 4]] });
}

// The crimson palace at the tip: a few thin spires, red where the sun finds them.
for (const [dx, top, w] of [[-10, 72, 5], [10, 70, 5], [0, 52, 6.5]]) {
  p.stroke({ brush: 'bristle', color: '#34101f', width: w, mix: 0, dry: 0, rag: 0, cap: 'round', taper: [0, 0.8], points: [[AX + dx, TOP + 6], [AX + dx, (TOP + top) / 2], [AX + dx, top]] });
}
p.tryStroke({ color: '#e8566a', width: 4, opacity: 0.8, taper: [0, 0.6], points: [[AX + 2, TOP], [AX + 2, 60]] });
p.stroke({ brush: 'soft', color: '#ff4a64', width: 18, opacity: 0.24, points: [[AX - 19, 70], [AX, 64], [AX + 19, 70]] });

// The glare of the sun lying in front of its lower side.
for (const [x, y, w, o] of [[930, 450, 150, 0.12], [900, 380, 110, 0.07], [980, 500, 120, 0.1]]) {
  p.stroke({ brush: 'soft', color: '#ffcf90', width: w, opacity: o, points: [[x - w * 1.02, y + 10], [x, y], [x + w * 1.02, y - 8]] });
}

p.save();
