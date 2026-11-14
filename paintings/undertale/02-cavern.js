// The cavern. Its roof is far overhead and out of sight: we see only the crystals in it,
// hundreds of small cold lights in drifts, like the stars of a clear night. The walls are
// great dark shapes at each side, a little bluer than the dark, in beds that lean. At the
// left, far off, water comes down out of the roof in long pale falls, and where it meets
// the lake there is mist. Low over the lake the far air holds a little light.
'use strict';
const { studio, open, W, SHORE, cavern, castleGlow, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, through, glow } = studio;

const p = open('cavern');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.2, dry: 0.03, rag: 0.25, cap: 'round' };

// ---------------------------------------------------------------- the dark, and the far air
p.fill({ bounds: [0, 0, W, SHORE + 20], width: 34, length: 240, spacing: 0.5, overlap: 0.55, angle: (x, y) => (nB(x / 380, y / 200) - 0.5) * 0.3, color: (x, y) => cavern(x + r.range(-20, 20), y + r.range(-10, 10)), stroke: { ...line, opacity: 0.95 } });
p.fill({ bounds: [0, 0, W, SHORE + 20], width: 16, length: 150, spacing: 1.0, overlap: 0.7, angle: (x, y) => (nB(x / 380, y / 200) - 0.5) * 0.3, color: (x, y) => cavern(x + r.range(-30, 30), y + r.range(-14, 14)), stroke: { ...line, opacity: 0.7 } });

// ---------------------------------------------------------------- the walls of the cavern
// Each wall is a great mass of rock that stands up out of the lake and leans over. It is only a little lighter than the dark;
// its beds show as long faint lines, and the side of it that is toward the castle is a little bluer.
function wall(top, x0, x1, tone, lean, seed) {
  p.fill({ inside: (x, y) => y > top(x) + 14 * (nC(x / 46, seed) - 0.5) && y < SHORE + 16, bounds: [x0, 0, x1, SHORE + 16], width: 16, length: 130, spacing: 0.5, overlap: 0.6, angle: () => lean + r.range(-0.08, 0.08),
    color: (x, y) => { const bed = nA((x + y * lean * 2) / 300, (y - x * lean) / 36 + seed); let c = mix(tone, '#04050c', 0.45 + (bed - 0.5) * 0.5); c = mix(c, '#2c3f80', castleGlow(x, y, 520) * 0.4); return mix(c, '#04050c', smooth(SHORE - 130, SHORE + 10, y) * 0.3); }, stroke: { ...line, opacity: 0.95 } });
  for (let k = 0; k < 26; k++) { const x = r.range(x0, x1), y = r.range(top(clamp(x, x0, x1)) + 20, SHORE - 10), len = r.range(60, 220); if (y > top(x) + 16 && y < SHORE) p.tryStroke({ brush: 'round', color: mix('#1c2760', '#3c50a0', castleGlow(x, y, 600)), width: 4, opacity: r.range(0.12, 0.3), taper: [0.4, 0.4], points: [[x, y], [x + len / 2, y + len * lean * 0.5 + r.range(-3, 3)], [x + len, y + len * lean]] }); }
}
wall(through([[-20, 60], [120, 110], [240, 230], [330, 380], [400, 470], [470, 530], [560, 560]]), -20, 560, '#141a44', 0.5, 1);
wall(through([[1250, 566], [1330, 520], [1420, 430], [1500, 300], [1570, 170], [1620, 90]]), 1250, W + 20, '#131842', -0.55, 2);
wall(through([[520, 560], [640, 536], [760, 528], [860, 540], [930, 556]]), 520, 930, '#10163c', 0.1, 3);   // a low far shore, between

// ---------------------------------------------------------------- the falls of water, far off at the left
// Each comes down out of the dark as a long pale veil with no edge, wider and brighter low down, with a few bright threads in
// it; and mist stands where it meets the lake.
for (const [x, y0, w, op] of [[214, 150, 34, 0.3], [318, 290, 20, 0.24], [100, 40, 52, 0.28], [420, 392, 13, 0.18]]) {
  for (let k = 0; k < 9; k++) { const dx = r.gauss() * w * 0.3, a = y0 + r.range(0, 120), b = SHORE - r.range(0, 12), ww = Math.max(9, w * r.range(0.5, 1.1)); p.tryStroke({ brush: 'soft', color: mix('#4c5c98', '#aab8e0', r()), width: ww, opacity: op * r.range(0.25, 0.6), taper: [0.8, 0.1], points: [[x + dx, a], [x + dx * 1.2 + r.range(-3, 3), (a + b) / 2], [x + dx * 1.5 + r.range(-4, 4), b]] }); }
  for (let k = 0; k < 4; k++) { const dx = r.gauss() * w * 0.25, a = y0 + r.range(120, 260); p.tryStroke({ ...line, rag: 0.5, color: mix('#a8b8e4', '#eef2ff', r()), width: r.range(4.8, 6), opacity: op * r.range(0.6, 1), taper: [0.9, 0.3], points: [[x + dx, a], [x + dx + r.range(-2, 2), (a + SHORE) / 2], [x + dx + r.range(-3, 3), SHORE - r.range(6, 40)]] }); }
  for (const [k, o2] of [[3.4, 0.09], [2.2, 0.14], [1.2, 0.18]]) glow(p, x, SHORE - 8, Math.max(12, w * k), '#8c9cd0', o2, 6, 0.5);   // the mist at its foot
}

// ---------------------------------------------------------------- the crystals in the roof
// They lie in drifts. Most are faint. Each is a small level touch of light; the bright ones have a soft glow, and the
// brightest a second, wider glow.
for (let k = 0; k < 520; k++) {
  const x = r.range(6, W - 6), y = 24 + Math.pow(r(), 0.8) * 330;
  const drift = smooth(0.34, 0.7, nD(x / 260 + 3, y / 120)) * 0.8 + 0.12 * smooth(0.4, 0.6, nA(x / 90, y / 60 + 9));
  if (r() > drift * smooth(380, 250, y) + 0.03) continue;
  const b = Math.pow(r(), 2.4), c = mix(mix('#3c6cc8', '#7cb8f4', r()), '#e8f6ff', b);
  if (b > 0.4) p.tryStroke({ brush: 'soft', color: '#5c9cf0', width: 9, opacity: 0.08 + 0.22 * b, points: [[x - 9.6, y], [x + 9.6, y]] });
  p.tryStroke({ brush: 'round', color: c, width: b > 0.8 ? 4.6 : 4, opacity: 0.22 + 0.74 * b, taper: [0.55, 0.55], points: [[x - 6.2, y], [x + 6.2, y]] });
  if (b > 0.86) glow(p, x, y, 15, '#7cb8ff', 0.12, 6);
}

// ---------------------------------------------------------------- the light that lies low over the lake, far off
for (let k = 0; k < 22; k++) { const x = r.range(-100, W - 200), len = r.range(300, 760), y = r.range(SHORE - 40, SHORE + 8); p.stroke({ brush: 'soft', color: mix('#1c2860', '#44609c', castleGlow(x + len / 2, y, 520)), width: r.range(18, 40), opacity: r.range(0.06, 0.14), points: [[x, y], [x + len / 2, y + r.range(-3, 3)], [x + len, y]] }); }

p.save();
