// The column of water that lifts her. It turns as it rises: narrow in the middle, wide where
// it leaves the sea, and it spreads again under her feet. The last of the sun is behind it,
// so it is full of light in the middle and dark at its two edges, like glass. Round its foot
// the sea is white, and rings go out from it.
'use strict';
const { studio, open, COLUMN, HORIZON, glow, skyColor, sunPath, nA, nB } = require('./scene');
const { mix, clamp, smooth, glint } = studio;

const p = open('column');
const r = p.rng;
const { x: cx, top, foot } = COLUMN;
const half = (y) => { const t = clamp((y - top) / (foot - top), 0, 1); return 38 + 36 * t * t + 60 * smooth(0.86, 1, t) + 30 * smooth(0.1, 0, t); };
const inside = (x, y, m = 0) => y > top - 2 && y < foot + 8 && Math.abs(x - cx) < half(y) - m;
// The strokes wind round it: they lean most in the middle of it and stand upright at its edges.
const wind = (x, y) => { const u = clamp((x - cx) / half(y), -1, 1); return -Math.PI / 2 + 0.85 * Math.sqrt(1 - u * u) + (nB(x / 40, y / 40) - 0.5) * 0.3; };
// How much light is behind a place on it: most where the sky is brightest, at the edge of the sea.
const behind = (y) => clamp(0.35 + 0.75 * glow(cx, Math.min(y, HORIZON + 40), 300) - 0.3 * smooth(HORIZON, foot, y), 0, 1);
// It is water, so it is cold in color against the fire of the sky: violet at its edges, where
// we look through the most of it, and nearly white in the middle, where the light comes through.
function water(x, y) {
  const u = clamp(Math.abs(x - cx) / half(y), 0, 1), thin = Math.pow(1 - u * u, 0.7), streak = nA(x / 9 + y / 16, y / 60);
  let c = mix(mix('#34286c', '#6c5cb4', behind(y)), mix('#a8c4f0', '#f4fbff', behind(y)), thin * (0.5 + 0.5 * behind(y)));
  c = mix(c, streak > 0.5 ? '#ffffff' : '#4a3c8c', Math.abs(streak - 0.5) * 0.7);              // the turns of it: bands of foam and bands of clear water
  c = mix(c, '#ffc890', smooth(0.8, 1, u) * 0.5);                                              // the fire of the sky comes round its edges
  return mix(c, y < HORIZON ? skyColor(x, y) : mix('#ffb070', '#fff0b0', sunPath(x, y)), 0.22 * thin);   // and we see a little of what is behind it
}

// Its shade on the sea, toward us, and the dark of the sea close round its foot, so that the white of it is seen.
p.stroke({ brush: 'soft', color: '#3a1c48', width: 150, opacity: 0.34, points: [[cx - 200, foot + 26], [cx, foot + 40], [cx + 200, foot + 26]] });
p.stroke({ brush: 'soft', color: '#3a1c48', width: 70, opacity: 0.3, taper: [0, 0.4], points: [[cx, foot - 30], [cx + 6, foot + 50], [cx + 14, foot + 130]] });
// The light that comes through it, round it.
for (const [w, o] of [[150, 0.1], [100, 0.14]]) p.stroke({ brush: 'soft', color: '#ffd89c', width: w, opacity: o, points: [[cx, top - 40], [cx, (top + foot) / 2], [cx, foot + 20]] });

p.fill({ inside: (x, y) => inside(x, y), bounds: [cx - 150, top - 4, cx + 150, foot + 10], width: 12, length: 60, spacing: 0.5, angle: wind, color: water, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.03, rag: 0.2, cap: 'round' } });
p.fill({ inside: (x, y) => inside(x, y, 3), bounds: [cx - 150, top - 4, cx + 150, foot + 10], width: 6.5, length: 36, spacing: 0.9, overlap: 0.7, angle: wind, color: (x, y) => water(x + r.range(-4, 4), y + r.range(-8, 8)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.2, dry: 0.03, rag: 0.25, cap: 'round' } });
// Threads of foam that go up round it.
for (let k = 0; k < 46; k++) {
  const y = r.range(top + 14, foot - 10), x = cx + r.range(-0.8, 0.8) * half(y), a = wind(x, y), len = r.range(26, 64);
  p.tryStroke({ brush: 'bristle', color: mix('#ffe2c0', '#ffffff', r()), width: r.range(4.8, 6.5), opacity: r.range(0.4, 0.85) * (0.5 + 0.5 * behind(y)), mix: 0.15, dry: 0.08, rag: 0.4, taper: [0.3, 0.5], points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + Math.cos(a + 0.2) * len / 2, y + Math.sin(a + 0.2) * len / 2]] });
}
// The fire of the sky down its two edges.
for (const s of [-1, 1]) { const pts = []; for (let y = top + 6; y <= foot - 30; y += 10) pts.push([cx + s * (half(y) - 2.4), y]); glint(p, pts, () => mix('#ff9c58', '#ffe6a8', r()), { width: 4.6, dash: 44, gap: 12, opacity: 0.85, rng: r }); glint(p, pts.map(([x, y]) => [x - s * 7, y]), () => '#2c2060', { width: 5, dash: 60, gap: 20, opacity: 0.4, rng: r }); }

// Its top, under her feet: the water spreads flat, and the turn of it throws water off its edge: a mist, and in the mist short bent dabs of white, no two alike.
for (let k = 0; k < 10; k++) { const y = top - 3 + r.range(-4, 6), halfW = r.range(38, 70); p.tryStroke({ brush: 'bristle', color: mix('#d8e4ff', '#ffffff', r()), width: r.range(5, 8), opacity: 0.9, mix: 0.15, dry: 0.05, rag: 0.4, taper: [0.3, 0.3], points: [[cx - halfW, y + 2], [cx + r.range(-8, 8), y - 2], [cx + halfW, y + 2]] }); }
for (const s of [-1, 1]) for (const [dx, w, op] of [[96, 60, 0.2], [130, 40, 0.14]]) p.stroke({ brush: 'soft', color: '#fff4ec', width: w, opacity: op, points: [[cx + s * (dx - w * 1.05), top + 6], [cx + s * dx, top + 2], [cx + s * (dx + w * 1.05), top + 14]] });
for (let k = 0; k < 30; k++) {
  const s = r() < 0.5 ? -1 : 1, out = r.range(50, 170), x = cx + s * out, y = top + r.range(-14, 10) + out * out / 600, a = (s > 0 ? 0 : Math.PI) + s * r.range(-0.3, 1.1), len = r.range(13, 20);
  p.tryStroke({ brush: 'bristle', color: mix('#ffe2c8', '#ffffff', r()), width: r.range(4.8, 6), opacity: r.range(0.3, 0.7) * (1.1 - out / 220), mix: 0.2, dry: 0.1, rag: 0.5, cap: 'round', taper: [0.2, 0.5], points: [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]] });
}

// Its foot: white water where it leaves the sea, in level strokes, thick near it and thin further out; and rings that go out from it, broken, with the gold of the sky on them.
for (let k = 0; k < 150; k++) {
  const a = r.range(0, 6.283), q = Math.pow(r(), 0.8), x = cx + Math.cos(a) * 200 * q, y = foot + 2 + Math.sin(a) * 32 * q, len = r.range(24, 60) * (1.1 - q * 0.5);
  p.tryStroke({ brush: 'bristle', color: mix(mix('#e0e8ff', '#ffffff', r()), '#d88ca0', q * 0.5), width: Math.max(4.8, r.range(5, 9) * (1.1 - q * 0.4)), opacity: 0.95 - q * 0.4, mix: 0.2, dry: 0.08, rag: 0.4, taper: [0.3, 0.3], points: [[x - len / 2, y], [x, y - r.range(0, 3)], [x + len / 2, y]] });
}
for (const [rx, ry, n, op] of [[250, 40, 9, 0.6], [330, 54, 9, 0.45], [420, 70, 8, 0.3]]) {
  for (let k = 0; k < n; k++) {
    const a = r.range(0, 6.283), span = r.range(0.2, 0.42), pts = [];
    for (let i = 0; i <= 5; i++) { const b = a + span * i / 5; pts.push([cx + Math.cos(b) * rx * r.range(0.97, 1.03), foot + 4 + Math.sin(b) * ry]); }
    if (pts.some(([x, y]) => y < foot - 30)) continue;                                           // the far half of each ring is behind the column, and small
    p.tryStroke({ brush: 'bristle', color: mix('#ff9c68', '#ffe6b0', r()), width: r.range(4.8, 6.5), opacity: op, mix: 0.2, dry: 0.08, rag: 0.4, taper: [0.3, 0.3], points: pts });
  }
}

p.save();
