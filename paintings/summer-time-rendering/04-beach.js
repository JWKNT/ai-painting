// The beach. The last thin water of each wave runs up over the sand and leaves it wet, so
// the sand holds the sky: rose and gold far off, violet near us. The edge of the water is
// a thin line of foam, and an older line of foam lies a little higher. The path of the
// sun comes over the wet sand to our feet.
'use strict';
const { studio, open, W, H, HORIZON, SUN, WATERLINE, skyColor, glare, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('beach');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.03, rag: 0.2, cap: 'round' };
// the edge of the water on the sand: a line that runs up and back in long shallow tongues
const edge = (x) => WATERLINE + 18 * Math.sin(x / 210 + 1.2) + 9 * Math.sin(x / 83) + 5 * (nC(x / 40, 4) - 0.5) + (x - 800) * 0.012 + 36 * Math.exp(-Math.pow((x - 990) / 250, 2));   // a tongue of thin water comes up the sand to her feet
const sand = (x, y) => {
  const t = clamp((y - WATERLINE) / (H - WATERLINE), 0, 1), up = HORIZON - 10 - (y - WATERLINE) * 1.25;
  let c = mix(skyColor(x + (nB(x / 120, y / 14) - 0.5) * 50, Math.max(20, up)), '#463a58', 0.42 + 0.3 * t);   // wet sand: the sky, and the dark of the sand under it
  c = mix(c, '#2c2540', smooth(0.5, 0.7, nA(x / 300, y / 40)) * 0.3 * t);                                    // drier places, darker
  c = mix(c, '#ffcf80', Math.exp(-Math.pow((x - SUN.x + (y - WATERLINE) * 0.1) / (120 + (y - WATERLINE) * 0.7), 2)) * (0.5 - 0.3 * t));   // the path of the sun
  return mix(c, '#1c1830', smooth(0.7, 1, t) * 0.3);
};
for (const [y0, y1, w, len] of [[WATERLINE - 30, 780, 8, 100], [772, 890, 11, 150], [882, H + 4, 14, 190]]) p.fill({ inside: (x, y) => y > edge(x), bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: sand, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: (x, y) => y > edge(x) + 3, bounds: [0, WATERLINE - 30, W, H], width: 6, length: 60, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.02, 0.02), color: (x, y) => sand(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.8 } });
// The foam at the edge of the water: short pale touches along the edge, and a thin dark line of wet under them.
for (let x = -10; x < W + 10;) { const l = r.range(22, 70), a = [x, edge(x)], b = [x + l / 2, edge(x + l / 2)], c = [x + l, edge(x + l)], k = glare(x, a[1], 500);
  p.tryStroke({ brush: 'soft', color: '#2c2444', width: 9, opacity: 0.3, points: [[a[0], a[1] + 5], [b[0], b[1] + 5], [c[0], c[1] + 5]] });
  p.tryStroke({ ...line, rag: 0.5, color: mix(mix('#e0a8b0', '#fbe8dc', r()), '#fff4d0', k * 0.7), width: r.range(4.8, 7), opacity: r.range(0.6, 0.95), points: [a, b, c] }); x += l * r.range(0.8, 1.2); }
for (let x = -10; x < W + 10;) { const l = r.range(30, 90), yy = (q) => edge(q * 0.9 + 60) + 34 + 8 * Math.sin(q / 60); if (r() < 0.7) p.tryStroke({ ...line, rag: 0.6, color: mix('#c898a8', '#f0d0c8', r()), width: 4.8, opacity: r.range(0.3, 0.6), points: [[x, yy(x)], [x + l / 2, yy(x + l / 2)], [x + l, yy(x + l)]] }); x += l * r.range(0.9, 1.6); }   // the older line, higher on the sand
// Thin water still runs back over the sand: long pale lines that lie level.
for (let k = 0; k < 90; k++) { const x = r.range(-20, W), y = edge(x) + 10 + Math.pow(r(), 1.6) * 250, len = r.range(60, 260); p.tryStroke({ brush: 'round', color: mix('#c08c9c', '#ffe4b0', glare(x, y, 520)), width: 4, opacity: r.range(0.1, 0.34), taper: [0.5, 0.5], points: [[x, y], [x + len / 2, y + r.range(-1, 1)], [x + len, y + r.range(-1.5, 1.5)]] }); }
// Small things on the sand: shells and stones, each a dark touch with a point of light.
for (let k = 0; k < 36; k++) { const x = r.range(0, W), y = r.range(760, H - 6), s = 0.5 + (y - 700) / 300; p.tryStroke({ ...line, color: '#241e34', width: Math.max(4.8, 5 * s), opacity: 0.7, points: [[x - 6.4 * s, y], [x + 6.4 * s, y + r.range(-1, 1)]] }); if (r() < 0.5) p.tryStroke({ brush: 'round', color: '#ffcf90', width: 4, opacity: 0.6, taper: [0.4, 0.4], points: [[x - 6.2, y - 3 * s], [x + 6.2, y - 3 * s]] }); }

p.save();
