// The still water under the city. It shows what is over it: the haze, the gold of the shafts
// in long bright places, and everything that stands in it, upside down and dark.
'use strict';
const { studio, open, W, H, WATER, shaft, haze, ledge, nA, nB } = require('./scene');
const { mix, clamp } = studio;

const p = open('water');
const r = p.rng;

function water(x, y) {
  const depth = clamp((y - WATER) / 200, 0, 1);
  let c = mix(haze(x, 2 * WATER - y - 40), '#0c2c34', 0.4 + 0.3 * depth);
  const s = shaft(x, WATER - 60) * (0.5 + 0.9 * nB(x / 40, y / 6));
  return mix(c, '#f0dc94', clamp(s * (0.75 - 0.35 * depth), 0, 1));
}
const on = (x, y) => y > WATER - 2 && y < ledge(x) + 14;
for (const [w, o] of [[20, 0.96], [10, 0.85]]) {
  p.fill({ inside: on, bounds: [-20, WATER - 2, W + 20, H], width: w, length: w * 9, spacing: 0.5, overlap: 0.55, angle: (x, y) => (nA(x / 200, y / 40) - 0.5) * 0.06, color: (x, y) => water(x + r.range(-10, 10), y), stroke: { brush: 'bristle', opacity: o, mix: 0.15, dry: 0.05 } });
}

// What stands in it, upside down: the towers, the piers of the bridge, the mound.
const shade = (x, w, len, o) => p.tryStroke({ brush: 'bristle', color: '#0c2a30', width: w, opacity: o, mix: 0.3, dry: 0.1, rag: 0.4, taper: [0, 0.6], points: [[x, WATER + 6], [x + r.range(-3, 3), WATER + 6 + len * 0.5], [x + r.range(-5, 5), WATER + 6 + len]] });
for (const [x, w, len] of [[330, 36, 120], [1404, 42, 140], [1474, 36, 170], [1330, 30, 90]]) shade(x, w, len, 0.55);
for (const x of [420, 560, 700, 840, 980]) shade(x, 26, 90, 0.5);
for (let k = 0; k < 9; k++) shade(900 + k * 48, 50, 110 + 50 * Math.sin(k / 8 * Math.PI), 0.35);
for (let k = 0; k < 10; k++) {                                          // and its lights
  const x = 900 + k * 42 + r.range(-8, 8), y = WATER + r.range(30, 90);
  p.tryStroke({ color: '#ffcf7a', width: 4, opacity: r.range(0.2, 0.4), points: [[x - 7, y], [x + 7, y + r.range(-0.5, 0.5)]] });
}

// Light on the water: thin bright lines where the shafts strike it.
for (let k = 0; k < 150; k++) {
  const x = r.range(0, W), y = WATER + 6 + Math.pow(r(), 1.4) * 190;
  if (!on(x, y) || r() > shaft(x, WATER - 60) * 1.3) continue;
  const len = r.range(14, 50) * (0.6 + (y - WATER) / 200);
  p.tryStroke({ color: mix('#f6e6a8', '#fffbe0', r()), width: 4, opacity: r.range(0.4, 0.85), points: [[x - len / 2, y], [x + len / 2, y + r.range(-0.6, 0.6)]] });
}

p.save();
