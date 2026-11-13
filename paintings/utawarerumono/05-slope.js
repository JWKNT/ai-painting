// The slope close to us. It is in shadow, deep blue at our feet, except for a strip where
// the first sun comes through the trees behind us and lies on the snow, cream in the middle
// and rose at its edges. The travelers' tracks come up out of the corner along that strip.
'use strict';
const { studio, open, W, H, KUON, HAKU, near, sunlit, nA, nB } = require('./scene');
const { mix, clamp, smooth, bezier } = studio;

const p = open('slope');
const r = p.rng;

function snow(x, y) {
  const depth = clamp((y - near(x)) / 240, 0, 1);
  let c = mix(mix('#8b9cd4', '#7888c8', nA(x / 80, y / 30)), mix('#5464a8', '#44529a', nA(x / 60, y / 36)), smooth(0.05, 1, depth));
  const l = sunlit(x, y);
  if (l > 0) c = mix(c, mix(mix('#ffd6c2', '#fff2e2', nB(x / 30, y / 14)), '#f4b4b0', smooth(0.6, 0.05, l) * 0.6), smooth(0, 0.4, l));
  return c;
}
const slope = (x) => Math.atan2(near(x + 14) - near(x - 14), 28);
const lie = (x, y) => slope(x) * clamp(1 - (y - near(x)) / 260, 0.3, 1) + (nB(x / 90, y / 50) - 0.5) * 0.22;
const box = [-20, 680, W + 20, H + 10];
p.fill({ inside: (x, y) => y > near(x) + 16, bounds: box, width: 38, length: 200, spacing: 0.5, angle: lie, color: snow, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.12, dry: 0.05 } });
p.fill({ inside: (x, y) => y > near(x) + 8, bounds: box, width: 18, length: 110, spacing: 0.7, overlap: 0.7, angle: lie, color: (x, y) => snow(x + r.range(-10, 10), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.12 } });
for (let x = -30; x < W + 10; x += 120) {                              // its edge against the valley
  const pts = [];
  for (let k = 0; k <= 7; k++) pts.push([x + k * 19, near(x + k * 19) + 7]);
  p.stroke({ brush: 'bristle', color: snow(x + 66, near(x + 66) + 10), width: 14, mix: 0.05, dry: 0, rag: 0.05, points: pts });
}
// The sunlit strip again with a smaller brush, so the edges of the light are firm.
p.fill({ inside: (x, y) => y > near(x) + 8 && sunlit(x, y) > 0.45, bounds: [-20, 720, 1060, 920], width: 9, length: 54, spacing: 0.55, angle: lie, color: (x, y) => mix(mix('#ffdccc', '#fff6ea', r()), '#f8c0b8', smooth(0.75, 0.45, sunlit(x, y)) * 0.7), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.15, dry: 0.05 } });

// Drifts: long low crests the wind has made, a little paler above and darker beneath.
for (let k = 0; k < 14; k++) {
  const x = r.range(-60, W - 200), y = near(x) + r.range(40, 280), len = r.range(200, 420), a = lie(x + len / 2, y);
  if (sunlit(x + len / 2, y) > 0.2) continue;
  const at = (t, d) => [x + len * t, y + Math.tan(a) * len * t + d + 8 * Math.sin(t * 3 + k)];
  p.stroke({ brush: 'bristle', color: '#9eaee2', width: 9, opacity: 0.4, mix: 0.3, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: [at(0, 0), at(0.5, 0), at(1, 0)] });
  p.stroke({ brush: 'bristle', color: '#3c4a90', width: 10, opacity: 0.35, mix: 0.3, dry: 0.1, rag: 0.3, taper: [0.5, 0.5], points: [at(0.04, 9), at(0.5, 9), at(0.96, 9)] });
}

// Their tracks: one trodden line of prints from the corner to where they stand.
{
  const trail = bezier([10, 1012], [230, 944], [420, 902], [HAKU.x, HAKU.y + 2], 40).concat(bezier([HAKU.x, HAKU.y + 2], [620, 862], [670, 852], [KUON.x, KUON.y + 2], 14).slice(1));
  let acc = 0, side = 1;
  for (let i = 1; i < trail.length; i++) {
    const [x0, y0] = trail[i - 1], [x1, y1] = trail[i], d = Math.hypot(x1 - x0, y1 - y0), s = clamp(1.7 - x1 / 700, 0.85, 1.7);
    acc += d;
    if (acc < 20 * s) continue;
    acc = 0; side = -side;
    const ux = (x1 - x0) / d, uy = (y1 - y0) / d, x = x1 - uy * side * 6 * s, y = y1 + ux * side * 6 * s, len = Math.max(13, 15 * s), lit = sunlit(x, y);
    p.tryStroke({ brush: 'bristle', color: mix(mix('#36448c', '#44529a', r()), '#7484c8', lit * 0.7), width: Math.max(5, 7.5 * s), opacity: 0.8, mix: 0.15, dry: 0, rag: 0.2, cap: 'round', points: [[x - ux * len / 2, y - uy * len / 2], [x + ux * len / 2, y + uy * len / 2]] });
    if (lit > 0.4) p.tryStroke({ color: '#fff6ea', width: 4, opacity: 0.7, points: [[x - ux * 6.3 + 4.5 * s, y - uy * 6.3 + 1.5 * s], [x + ux * 6.3 + 4.5 * s, y + uy * 6.3 + 1.5 * s]] });   // the far lip of the print, in the sun
  }
}

// Dead stems standing out of the snow.
for (const [bx, by, n, h] of [[258, 968, 6, 54], [900, 944, 5, 40], [1128, 972, 6, 50], [470, 990, 4, 36]]) {
  for (let k = 0; k < n; k++) {
    const a = -Math.PI / 2 + r.range(-0.6, 0.6), len = h * r.range(0.6, 1.1);
    p.tryStroke({ color: mix('#1a1a30', '#2a2844', r()), width: 4, opacity: 0.85, taper: [0, 0.6], points: [[bx + r.range(-6, 6), by], [bx + Math.cos(a) * len * 0.5, by + Math.sin(a) * len * 0.5], [bx + Math.cos(a + 0.2) * len, by + Math.sin(a + 0.2) * len]] });
  }
}

p.save();
