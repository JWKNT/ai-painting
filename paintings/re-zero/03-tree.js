// Flugel's Tree. It stands alone in the plain, and nothing in the world is as big: its trunk
// is as wide as a castle, and it goes up through the mist and out of the top of the picture.
// We see only the lowest of its boughs, which go out over our heads, and the under side of
// its leaves. The moon is at the right of it, so its right side is pale and its left side
// is the dark of the night. Mist lies across it in two places.
'use strict';
const { studio, open, TREE, MOONWARD, far, halo, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, shape, wave, ramp, noise2 } = studio;

const p = open('tree');
const r = p.rng;
const X = TREE.x, FOOT = TREE.foot, D = 0.3;
const line = { brush: 'bristle', mix: 0.12, dry: 0.04, rag: 0.2, cap: 'round' };
const tint = (c, x, y, k = 1) => far(c, x, y, D * k);
// Half the width of the trunk at a height: it is widest at the ground, where its roots go out.
const half = (y) => 118 + 26 * smooth(430, 60, y) + 150 * Math.pow(clamp((y - 520) / (FOOT - 520), 0, 1), 2.4);
const lean = (y) => X + 10 * Math.sin(y / 260);                          // it is not quite straight

// The leaves: great dark masses over our heads, with the moon on the edges of those at the right.
const leafTone = (t, x, y) => tint(ramp(['#050a16', '#0c1626', '#1c3040', '#4c6c84'], t), x, y, 0.6);
let seed = 0;
for (const [x0, x1, y, big] of [[-140, 420, 10, 120], [200, 820, 4, 130], [560, 1040, -10, 96], [-100, 260, 110, 70], [330, 700, 96, 74], [760, 1180, 30, 60]]) {
  const puffs = [], n = noise2(2100 + ++seed);
  for (let x = x0; x < x1; x += big * 0.5) { puffs.push([x + r.range(-14, 14), y + r.range(-big * 0.3, big * 0.4), big * r.range(0.55, 1)]); if (r() < 0.6) puffs.push([x + r.range(-30, 30), y + big * r.range(0.3, 0.7), big * r.range(0.4, 0.7)]); }
  studio.mass(p, puffs, { light: MOONWARD, tones: leafTone, bias: 0.26, contrast: 0.6, grain: 0.36, mix: 0.2, noise: n, layers: [[18, 44, 0.95, 8, 0.45], [10, 26, 0.85, 5, 0.75]] });
}

// Its boughs: each leaves the trunk high up and goes out and up into the leaves.
for (const [x0, y0, x1, y1, x2, y2, w] of [[X - 90, 150, X - 250, 60, X - 420, 10, 54], [X + 80, 170, X + 260, 96, X + 470, 40, 60], [X + 100, 120, X + 330, 30, X + 600, -20, 44], [X - 60, 100, X - 140, 20, X - 190, -40, 40], [X + 30, 90, X + 110, 10, X + 160, -50, 44]]) {
  const mid = [(x0 + x2) / 2 * 0.5 + x1 * 0.5, (y0 + y2) / 2 * 0.5 + y1 * 0.5], pts = [[x0, y0], mid, [x2, y2]], wid = [w, w * 0.72, w * 0.4];
  const edge = (k) => pts.map(([x, y], i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(2, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]); return [x - (b[1] - a[1]) / l * wid[i] * k, y + (b[0] - a[0]) / l * wid[i] * k]; });
  shape(p, [...edge(1), ...edge(-1).reverse()], { shadow: tint('#080c18', x1, y1), half: tint('#141e34', x1, y1), lit: tint('#4c5e88', x1, y1), rim: tint('#a8bcec', x1, y1, 0.5), bounce: tint('#101a30', x1, y1) }, { light: MOONWARD, turn: 0.2, width: 9, length: 44, vary: 0.08, flow: () => Math.atan2(y2 - y0, x2 - x0), dash: 40, gap: 14, edgeOpacity: 0.6 });
}

// The trunk.
{
  const inside = (x, y) => y < FOOT + 6 && Math.abs(x - lean(y)) < half(y);
  const bark = (x, y) => {
    const u = clamp((x - lean(y)) / half(y), -1, 1), ridge = nC((x - lean(y)) / 26 + nA(x / 200, y / 400) * 3, y / 260), fine = nB(x / 9, y / 90);
    const turnTo = clamp(0.5 + 0.62 * u, 0, 1);                                                  // how much a place on it is turned to the moon
    let c = turnTo < 0.5 ? mix('#060a14', '#182238', turnTo * 2) : mix('#182238', '#5c6e9c', (turnTo - 0.5) * 2);
    c = mix(c, ridge > 0.5 ? '#8c9cc8' : '#04060c', Math.abs(ridge - 0.5) * (0.5 + 0.5 * turnTo));   // its great furrows: a ridge that takes the light, a hollow that does not
    c = mix(c, fine > 0.5 ? '#aab8dc' : '#0a0e1a', Math.abs(fine - 0.5) * 0.3);
    c = mix(c, '#c8d8fc', smooth(0.86, 1, u) * 0.7);                                             // the moon down its right edge
    return tint(c, x, y, 0.4 + 0.6 * smooth(600, 200, y));                                       // it is paler higher up, in the mist
  };
  const up = (x, y) => Math.PI / 2 + ((x - lean(y)) / half(y)) * 0.34 * smooth(480, FOOT, y) + (nB(x / 60, y / 200) - 0.5) * 0.12;   // the furrows go straight up, and spread at the foot
  p.fill({ inside, bounds: [X - 300, -10, X + 300, FOOT + 8], width: 16, length: 150, spacing: 0.5, angle: up, color: bark, stroke: { ...line, opacity: 0.97 } });
  p.fill({ inside, bounds: [X - 300, -10, X + 300, FOOT + 8], width: 9, length: 90, spacing: 0.8, overlap: 0.7, angle: up, color: (x, y) => bark(x + r.range(-4, 4), y), stroke: { ...line, opacity: 0.9 } });
  for (let k = 0; k < 70; k++) {                                         // the deepest furrows, and the ridges beside them that take the moon
    const y = r.range(0, FOOT - 80), u = r.range(-0.9, 0.9), x = lean(y) + u * half(y), len = r.range(120, 320), dx = u * 0.3 * len * smooth(480, FOOT, y + len * 0.5);
    if (y + len > FOOT - 10) continue;
    p.tryStroke({ ...line, color: tint('#03050a', x, y), width: r.range(6, 11), opacity: 0.6, rag: 0.35, taper: [0.3, 0.3], points: [[x, y], [x + dx * 0.4 + r.range(-6, 6), y + len * 0.5], [x + dx, y + len]] });
    if (u > -0.2) p.tryStroke({ ...line, color: tint('#b8c8f0', x, y, 0.7), width: r.range(5, 7), opacity: 0.25 + 0.4 * (u + 0.2), rag: 0.4, taper: [0.3, 0.3], points: [[x + 9, y + 10], [x + 9 + dx * 0.4 + r.range(-4, 4), y + len * 0.5], [x + 9 + dx, y + len - 10]] });
  }
}
// Its roots: they come down off the foot of it and go out over the plain like the ridges of hills, lower and thinner as they go, till they are under the ground.
{
  const tones = { shadow: tint('#060a14', X, FOOT), half: tint('#141e34', X, FOOT), lit: tint('#5c6e9c', X, FOOT), rim: tint('#b8c8f0', X, FOOT, 0.5), bounce: tint('#0c1626', X, FOOT) };
  for (const [dx, reach, w] of [[-200, -300, 64], [-110, -210, 56], [-30, -60, 50], [90, 130, 54], [190, 260, 62], [240, 420, 50], [-240, -470, 44]]) {
    const x0 = X + dx * 0.6, x1 = X + dx + reach;
    studio.solid(p, [[x0, FOOT - 70, w], [x0 + (x1 - x0) * 0.35, FOOT - 22, w * 0.7], [x0 + (x1 - x0) * 0.7, FOOT + 4, w * 0.4], [x1, FOOT + 16, 7]], tones, { light: MOONWARD, turn: 0.1, width: 9, length: 46, vary: 0.08, dash: 36, gap: 16, edgeOpacity: 0.5 });
  }
}
// The dark between the roots, where they leave the foot of the trunk.
for (const [dx, reach] of [[-155, -250], [-70, -120], [30, 40], [140, 190], [215, 330]]) {
  const x0 = X + dx * 0.6, x1 = X + dx + reach * 0.6;
  p.tryStroke({ ...line, color: tint('#02040a', X, FOOT), width: r.range(9, 14), opacity: 0.7, rag: 0.3, taper: [0.1, 0.8], points: [[x0, FOOT - 96], [x0 + (x1 - x0) * 0.4, FOOT - 40], [x1, FOOT - 6]] });
}
// The mist that lies across it, in two places, and the mist at its foot.
for (const [y, n] of [[250, 7], [450, 6], [FOOT - 30, 8]]) for (let k = 0; k < n; k++) { const x = X + r.range(-520, 260), len = r.range(260, 520), yy = y + r.range(-26, 26); p.stroke({ brush: 'soft', color: mix('#5c74a8', '#a8bce8', halo(x + len, yy, 900)), width: r.range(26, 46), opacity: r.range(0.16, 0.3), points: wave(x, yy, x + len, yy + r.range(-8, 8), 4, 1, 6) }); }

p.save();
