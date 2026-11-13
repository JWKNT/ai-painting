// The field and the horde on it. First the burnt ground with the glare lying along it, then
// the BETA coming across it toward us and to the left: far off a crowd, nearer the
// Destroyer-class with their shells, the Grappler-class with their pale clubs, and the red
// Tank-class running between them. Shells are landing among them.
'use strict';
const { studio, open, W, H, FIRE, HORIZON, glow, groundColor, veil, nA, nB } = require('./scene');
const { destroyer, grappler, tank } = require('./beta');
const { mix, wave, clamp } = studio;

const p = open('horde');
const r = p.rng;
const far = (y) => clamp(1 - (y - HORIZON) / 200, 0, 1) * 0.5;

// The ground: level strokes of burnt earth, redder and paler toward the horizon and the glare.
for (const [w, o] of [[34, 0.97], [18, 0.85]]) {
  p.fill({ inside: (x, y) => y > HORIZON + 6, bounds: [-20, HORIZON + 6, W + 20, H + 10], width: (x, y) => Math.max(8, w * (0.35 + 0.65 * clamp((y - HORIZON) / 300, 0, 1))), length: w * 9, spacing: 0.5, overlap: 0.55,
    angle: (x, y) => (nB(x / 200, y / 60) - 0.5) * 0.14, color: (x, y) => groundColor(x + r.range(-30, 30), y), stroke: { brush: 'bristle', opacity: o, mix: 0.15, dry: 0.05 } });
}
// The glare on the ground: a path of light coming toward us from under the sun, in broken level strokes.
for (let k = 0; k < 70; k++) {
  const t = Math.pow(r(), 1.5), y = HORIZON + 10 + t * 330, x = FIRE.x + r.range(-1, 1) * (60 + 260 * t) + (y - HORIZON) * -0.12, len = r.range(30, 120) * (0.5 + t);
  p.tryStroke({ brush: 'bristle', color: mix('#c8482a', '#ffb866', r() * (1 - t * 0.6)), width: Math.max(4.6, r.range(5, 9) * (0.6 + t)), opacity: r.range(0.18, 0.45) * (1 - t * 0.5), mix: 0.3, dry: 0.15, rag: 0.4, taper: [0.5, 0.5], points: [[x - len / 2, y], [x, y + r.range(-1.5, 1.5)], [x + len / 2, y]] });
}
// Dust hanging over the field, lit from behind.
for (let k = 0; k < 16; k++) {
  const x = r.range(-80, W - 200), len = r.range(260, 560), y = HORIZON + r.range(6, 90), g = clamp(glow(x + len / 2, y, 520) * 1.3, 0, 1);
  p.stroke({ brush: 'soft', color: mix(mix('#3c1822', '#7a2c2a', r()), '#ffa858', g), width: r.range(26, 50), opacity: r.range(0.1, 0.2) + 0.08 * g, points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
}

// The crowd in the middle distance: dark backs, row behind row, a red one here and there.
for (let k = 0; k < 420; k++) {
  const t = Math.pow(r(), 1.3), y = HORIZON + 10 + t * 110, x = r.range(360, W + 10);
  if (nB(x / 90, y / 30) + nA(x / 300, 4) * 0.6 < 0.62) continue;
  const s = 0.5 + t * 1.1, red = r() < 0.14, len = r.range(13, 22) * s, tilt = r.range(-0.25, 0.1);
  p.tryStroke({ brush: 'bristle', color: veil(red ? mix('#4a0c10', '#8a1818', r()) : mix('#0d0a12', '#1c1118', r()), x, y, far(y)), width: Math.max(4.8, r.range(6, 10) * s), mix: 0, dry: 0, rag: 0.4, cap: 'round', points: [[x - len / 2, y - tilt * len / 2], [x + len / 2, y + tilt * len / 2]] });
}

// A shell landing: a fountain of earth and fire, and its light on the dust.
function blast(x, y, s) {
  p.stroke({ brush: 'soft', color: '#ff8a3a', width: 90 * s, opacity: 0.3, points: [[x - 95 * s, y + 4], [x, y - 30 * s], [x + 95 * s, y + 4]] });
  for (let k = 0; k < 16; k++) {
    const a = -Math.PI / 2 + r.range(-1.1, 1.1), d = r.range(40, 110) * s, hot = r() < 0.6;
    p.tryStroke({ brush: 'bristle', color: hot ? mix('#ff7a2a', '#fff0b0', r()) : mix('#0d0a12', '#2a1418', r()), width: Math.max(4.6, r.range(5, 11) * Math.max(0.7, s)), opacity: r.range(0.6, 0.95), mix: 0.2, dry: 0.1, rag: 0.4, taper: [0, 0.85], points: [[x + r.range(-10, 10) * s, y], [x + Math.cos(a) * d * 0.6, y + Math.sin(a) * d * 0.6], [x + Math.cos(a) * d, y + Math.sin(a) * d + d * 0.15]] });
  }
  p.stroke({ brush: 'soft', color: '#fff0c0', width: 26 * s + 8, opacity: 0.8, points: [[x - (30 * s + 10), y - 6 * s], [x + 30 * s + 10, y - 8 * s]] });
}
blast(772, 668, 0.8);
blast(1352, 690, 0.9);

// The ones near enough to tell apart, the far ones first.
const near = [
  ['g', 806, 668, 0.42], ['d', 700, 676, 0.46], ['d', 884, 690, 0.56], ['g', 1250, 694, 0.56], ['d', 1040, 708, 0.66], ['d', 1420, 716, 0.66],
  ['t', 760, 704, 0.7], ['t', 960, 716, 0.7], ['t', 1150, 722, 0.8], ['t', 1500, 728, 0.8], ['t', 830, 734, 0.9], ['t', 1320, 742, 0.9],
  ['d', 1180, 762, 0.9], ['g', 1486, 776, 0.84], ['t', 1010, 770, 1.0], ['t', 1400, 800, 1.1], ['d', 940, 806, 1.08],
];
for (const [kind, x, y, s] of near) (kind === 'd' ? destroyer : kind === 'g' ? grappler : tank)(p, x, y, s, -1, far(y));

p.save();
