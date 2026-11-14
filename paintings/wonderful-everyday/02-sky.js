// The sky. It is the subject of the picture: the deep blue of a summer afternoon, the sun
// high in it and white, thin high cloud drawn out by the wind, torn pieces of cloud near the
// sun with light in their edges, and at the right one great heaped cloud that goes up from
// the edge of the world past the top of everything. The sun is behind the clouds and to
// their left, so each round top is white on the side of the sun and blue in its body.
'use strict';
const { studio, open, W, HZ, SUN, glare, skyColor, CLOUDS, sunward, nB } = require('./scene');
const { mix, shift, ramp, noise2, clamp, rng } = studio;

const p = open('sky');
const r = p.rng;
const level = (x, y) => (nB(x / 300, y / 140) - 0.5) * 0.3 - 0.04;
p.fill({ bounds: [0, 0, W, HZ + 30], width: 40, length: 260, spacing: 0.5, overlap: 0.55, angle: level, color: (x, y) => shift(skyColor(x, Math.min(y, HZ)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.01, 0.01)), stroke: { brush: 'bristle', opacity: 0.92, mix: 0.3 } });
p.fill({ bounds: [0, 0, W, HZ + 30], width: 20, length: 150, spacing: 0.9, overlap: 0.7, angle: level, color: (x, y) => shift(skyColor(x + r.range(-30, 30), Math.min(y + r.range(-14, 14), HZ)), r.range(-3, 3), r.range(-0.02, 0.03), r.range(-0.012, 0.014)), stroke: { brush: 'bristle', opacity: 0.7, mix: 0.25 } });

// The thin high cloud: long wisps that the wind has drawn out and bent, each a soft stroke with a few threads in it.
function wisp(x, y, len, a, bend, k = 1) {
  const pts = []; for (let t = 0; t <= 1.001; t += 0.125) pts.push([x + len * t * Math.cos(a) - Math.sin(a) * bend * t * t, y + len * t * Math.sin(a) + Math.cos(a) * bend * t * t]);
  p.stroke({ brush: 'soft', color: '#ffffff', width: r.range(16, 30) * k, opacity: r.range(0.08, 0.16), taper: [0.4, 0.6], points: pts });
  for (let i = 0; i < 3; i++) { const o = r.range(-9, 9) * k, from = Math.floor(r.range(0, 3)), to = 9 - Math.floor(r.range(0, 3)); p.tryStroke({ brush: 'bristle', color: '#ffffff', width: r.range(5, 8), opacity: r.range(0.1, 0.22), mix: 0.3, dry: 0.3, rag: 0.5, taper: [0.6, 0.7], points: pts.slice(from, to).map(([px, py]) => [px, py + o]) }); }
}
for (let k = 0; k < 16; k++) { const x = r.range(620, 1500), y = r.range(20, 250); wisp(x, y, r.range(240, 520), -0.26 + r.range(-0.1, 0.1) - (x - 900) / 5000, r.range(-70, -20)); }
for (let k = 0; k < 6; k++) wisp(r.range(-60, 260), r.range(14, 200), r.range(180, 340), 0.2 + r.range(-0.08, 0.08), r.range(20, 50), 0.8);

// The light of the sun in the air round it.
for (const [w, o] of [[520, 0.08], [340, 0.12], [200, 0.18], [110, 0.3]]) for (let i = 0; i < 3; i++) { const a = i * Math.PI / 3 + 0.3; p.stroke({ brush: 'soft', color: '#ffffff', width: w, opacity: o, points: [[SUN.x - Math.cos(a) * w * 1.02, SUN.y - Math.sin(a) * w * 1.02], [SUN.x, SUN.y], [SUN.x + Math.cos(a) * w * 1.02, SUN.y + Math.sin(a) * w * 1.02]] }); }

// The heaped clouds, far ones first. The great cloud is bright down its whole left side,
// where the sun is, and blue on its right and under it; each top has the same light on a small scale.
CLOUDS.forEach((c, i) => {
  const great = i < 3, top = Math.min(...c.puffs.map((q) => q[1] - q[2]));
  const tones = (t, x, y) => {
    if (!great) return ramp(c.tones, t);
    const side = clamp((x - 900) / 700, 0, 1), low = clamp((y - top) / (c.floor - top), 0, 1);
    return ramp(c.tones, clamp(t * 0.62 + 0.46 * (1 - side) + 0.1 - 0.16 * low * side, 0, 1));
  };
  studio.mass(p, c.puffs, { light: sunward, tones, base: c.floor, bias: c.bias, contrast: c.contrast, fall: c.fall, grain: 0.1, mix: 0.34, noise: noise2(2400 + i), stroke: { rag: 0.35, hardness: 0.5 },
    layers: [[Math.max(12, c.big * 0.3), c.big * 0.85, 0.95, c.big * 0.09, 0.45], [Math.max(8, c.big * 0.16), c.big * 0.5, 0.8, c.big * 0.05, 0.7], [Math.max(6, c.big * 0.07), c.big * 0.26, 0.6, c.big * 0.04, 1.1]], ...(i === 2 ? {} : { crown: '#ffffff', crownOpacity: 0.8, crownSpan: 0.45 }) });   // the body of the great cloud has no line of light on its tops: over the tower behind it they would hang in the air
});
// The haze at the edge of the world, over the feet of the clouds.
for (let k = 0; k < 12; k++) { const x = r.range(-100, W - 300), y = r.range(716, 770), len = r.range(300, 700); p.stroke({ brush: 'soft', color: mix('#cfe6f6', '#ffffff', glare(x + len / 2, y, 700)), width: r.range(26, 50), opacity: r.range(0.12, 0.24), points: [[x, y], [x + len / 2, y + r.range(-4, 4)], [x + len, y]] }); }

// The torn clouds near the sun: thin pieces with ragged edges. The light comes through them, so a piece is white at its
// edges and where it is thin, and blue grey where it is thick.
function shred(cx, cy, len, thick, tilt, seed) {
  const rr = rng(seed), n = noise2(seed + 100), puffs = [];
  for (let t = -0.5; t <= 0.5; t += thick * 0.5 / len) { const k = 1 - Math.pow(Math.abs(t) * 2, 2.2), rad = thick * (0.35 + 0.65 * k) * rr.range(0.6, 1.1); puffs.push([cx + t * len * Math.cos(tilt) + rr.range(-8, 8), cy + t * len * Math.sin(tilt) + rr.range(-thick, thick) * 0.35, rad]); }
  const depth = (x, y) => { let d = -1e9; for (const q of puffs) d = Math.max(d, q[2] - Math.hypot(x - q[0], y - q[1])); return d; };
  const color = (x, y) => { const d = clamp(depth(x, y) / (thick * 0.7), 0, 1), g = glare(x, y, 420); return mix(mix('#ffffff', '#7c9cd8', d * (1 - 0.65 * g)), '#ffffff', 0.25 * g); };
  const bounds = [cx - len * 0.6 - thick, cy - len * 0.6 * Math.abs(Math.sin(tilt)) - thick * 2, cx + len * 0.6 + thick, cy + len * 0.6 * Math.abs(Math.sin(tilt)) + thick * 2];
  p.fill({ inside: (x, y) => depth(x, y) + (n(x / 16, y / 9) - 0.5) * thick > 2, bounds, width: 8, length: 46, spacing: 0.5, overlap: 0.6, angle: () => tilt + r.range(-0.15, 0.15), color, stroke: { brush: 'bristle', opacity: 0.85, mix: 0.35, rag: 0.5, dry: 0.1 } });
  p.fill({ inside: (x, y) => depth(x, y) + (n(x / 16, y / 9) - 0.5) * thick > 5, bounds, width: 5.5, length: 26, spacing: 0.9, overlap: 0.6, angle: () => tilt + r.range(-0.3, 0.3), color: (x, y) => color(x + r.range(-5, 5), y + r.range(-5, 5)), stroke: { brush: 'bristle', opacity: 0.8, mix: 0.3, rag: 0.5, dry: 0.1 } });
  for (let k = 0; k < 3; k++) { const t0 = r.range(-0.55, -0.4), t1 = r.range(0.4, 0.55); p.stroke({ brush: 'soft', color: '#ffffff', width: Math.min(thick * r.range(1.1, 1.8), len * 0.36), opacity: 0.1 + 0.14 * glare(cx, cy, 420), points: [[cx + t0 * len * Math.cos(tilt), cy + t0 * len * Math.sin(tilt)], [cx, cy + r.range(-4, 4)], [cx + t1 * len * Math.cos(tilt), cy + t1 * len * Math.sin(tilt)]] }); }   // the light in it
}
[[330, 262, 250, 34, -0.1], [735, 118, 230, 30, -0.2], [760, 300, 190, 26, -0.12], [215, 96, 190, 26, 0.12], [930, 214, 220, 28, -0.24], [640, 418, 170, 20, -0.06], [420, 46, 170, 20, 0.02]].forEach(([cx, cy, len, thick, tilt], i) => shred(cx, cy, len, thick, tilt, 2500 + i));

// The sun itself: too bright to have an edge.
for (const [w, o, n] of [[60, 0.4, 6], [34, 0.7, 6]]) for (let i = 0; i < n; i++) { const a = i * Math.PI / n + 0.1; p.stroke({ brush: 'soft', color: '#ffffff', width: w, opacity: o, points: [[SUN.x - Math.cos(a) * w * 1.04, SUN.y - Math.sin(a) * w * 1.04], [SUN.x, SUN.y], [SUN.x + Math.cos(a) * w * 1.04, SUN.y + Math.sin(a) * w * 1.04]] }); }

p.save();
