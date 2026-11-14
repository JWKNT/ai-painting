// The shore. Far off at the right is the hill of Hitogashima: green, with two tops, a
// small red gate of the shrine on its side and a white lighthouse on its point. The sea
// is deep blue far off and green near the sand, with long white lines of foam and the
// sun in it as a thousand small lights. The sand is nearly white, and darker where it is
// wet. At the far left lies a heap of the concrete blocks that break the waves.
'use strict';
const { studio, open, W, H, HORIZON, SHORE, edge, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, solid } = studio;

const p = open('shore');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.18, dry: 0.03, rag: 0.2, cap: 'round' };

// ---------------------------------------------------------------- the sea
const sea = (x, y) => {
  const t = clamp((y - HORIZON) / (SHORE + 30 - HORIZON), 0, 1);
  let c = mix(mix('#1458a8', '#1f86c4', smooth(0, 0.5, t)), '#58cfd0', smooth(0.45, 1, t));       // deep blue, then blue-green, then the pale green of the shallows
  c = mix(c, '#0e4c94', smooth(0.5, 0.62, nA(x / 260, y / (4 + 12 * t))) * (0.3 - 0.16 * t));     // the darker sides of the low waves
  return mix(c, '#bff0ec', smooth(0.9, 1, t) * 0.5);
};
for (const [y0, y1, w, len] of [[HORIZON - 2, 600, 5.5, 60], [592, 660, 8, 100], [652, 730, 10, 130]]) p.fill({ bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: sea, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, 720], width: 5.5, length: 50, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => sea(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.78 } });
// the sun in the water: small level lights, many of them, most at the left
for (let k = 0; k < 420; k++) { const t = Math.pow(r(), 1.3), y = HORIZON + 4 + t * (SHORE - HORIZON - 20), x = 520 + r.gauss() * 420, len = Math.max(12.4, (8 + 30 * t) * r.range(0.6, 1.5)); if (x < 0 || x > W) continue; p.tryStroke({ brush: 'round', color: '#ffffff', width: 4, opacity: r.range(0.3, 0.9), taper: [0.5, 0.5], points: [[x - len / 2, y], [x + len / 2, y + r.range(-0.6, 0.6)]] }); }
// lines of foam: long and thin far off, wider near the sand
for (const [y, n, w] of [[606, 9, 4.6], [626, 8, 5.5], [646, 7, 7]]) for (let k = 0; k < n; k++) { const x = r.range(-40, W), len = r.range(120, 360), yy = y + (x - 800) * -0.012 + r.range(-4, 4); p.tryStroke({ ...line, rag: 0.5, color: '#f8fdfd', width: w, opacity: r.range(0.6, 0.9), taper: [0.4, 0.4], points: [[x, yy], [x + len / 2, yy + r.range(-3, 3)], [x + len, yy + r.range(-2, 2)]] }); }

// ---------------------------------------------------------------- the hill of the island, far off at the right
{ const top = (x) => HORIZON - 3 - 96 * Math.exp(-Math.pow((x - 1290) / 100, 2)) - 124 * Math.exp(-Math.pow((x - 1490) / 110, 2)) - 22 * Math.exp(-Math.pow((x - 1140) / 60, 2)) + 6 * (nC(x / 22, 2) - 0.5);
  p.fill({ inside: (x, y) => x > 1040 && y > top(x) && y < HORIZON + 3, bounds: [1040, 400, W, HORIZON + 3], width: 7.5, length: 26, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.8, 0.8), color: (x, y) => { const wood = nA(x / 24, y / 18), sun = smooth(40, 0, y - top(x)); return mix(mix(mix('#1f6a3c', '#3c9648', wood), '#9cd45c', sun * 0.5), '#7cb4d8', 0.24); }, stroke: { ...line, rag: 0.45, opacity: 0.96 } });
  p.tryStroke({ ...line, cap: 'flat', rag: 0.03, color: '#f4f4ee', width: 7, points: [[1066, HORIZON - 6], [1066, HORIZON - 34]] }); p.tryStroke({ ...line, cap: 'flat', color: '#c84c3c', width: 9, points: [[1059.6, HORIZON - 37], [1072.4, HORIZON - 37]] });   // the lighthouse, white, with a red top
  for (const s of [-1, 1]) p.tryStroke({ brush: 'round', color: '#d83c2c', width: 4.4, points: [[1388 + s * 9, 486], [1388 + s * 9, 470]] }); p.tryStroke({ ...line, cap: 'flat', color: '#d83c2c', width: 5, points: [[1373, 469], [1403, 469]] });   // the red gate of the shrine
  for (let x = 1050; x < W; x += r.range(30, 80)) p.tryStroke({ ...line, rag: 0.5, color: '#f4fbfb', width: 4.8, opacity: 0.8, points: [[x, HORIZON + 2], [x + r.range(14, 40), HORIZON + 2]] }); }   // the foam at its foot

// ---------------------------------------------------------------- the sand
const sand = (x, y) => {
  const wet = smooth(70, 0, y - edge(x)), t = clamp((y - SHORE) / (H - SHORE), 0, 1), ripple = nB(x / 180, y / 12);
  let c = mix('#fbf2d6', '#ecdcb2', t * 0.7);
  c = mix(c, ripple > 0.5 ? '#fff9e6' : '#d9c79c', Math.abs(ripple - 0.5) * 0.5);                  // low ripples in it: light on one side, a little shade on the other
  c = mix(c, '#b9ae8e', wet * 0.75);                                                              // wet sand is darker
  return mix(c, '#9ed8dc', wet * wet * 0.4);                                                      // and holds a little of the sky
};
for (const [y0, y1, w, len] of [[SHORE - 40, 780, 8, 100], [772, 890, 11, 150], [882, H + 4, 14, 190]]) p.fill({ inside: (x, y) => y > edge(x), bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.02, 0.02), color: sand, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: (x, y) => y > edge(x) + 3, bounds: [0, SHORE - 40, W, H], width: 6, length: 60, spacing: 1.1, overlap: 0.7, angle: () => r.range(-0.02, 0.02), color: (x, y) => sand(x + r.range(-12, 12), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.8 } });
// the foam at the edge of the water, and the thin shade under it
for (let x = -10; x < W + 10;) { const l = r.range(22, 70), a = [x, edge(x)], b = [x + l / 2, edge(x + l / 2)], c = [x + l, edge(x + l)];
  p.tryStroke({ brush: 'soft', color: '#8c9c8c', width: 9, opacity: 0.25, points: [[a[0], a[1] + 6], [b[0], b[1] + 6], [c[0], c[1] + 6]] });
  p.tryStroke({ ...line, rag: 0.5, color: '#ffffff', width: r.range(5, 8), opacity: r.range(0.75, 0.98), points: [a, b, c] }); x += l * r.range(0.8, 1.2); }
// shells and small stones on the sand, each with its short shade
for (let k = 0; k < 40; k++) { const x = r.range(0, W), y = r.range(740, H - 6), s = 0.5 + (y - 700) / 300; p.tryStroke({ brush: 'soft', color: '#b09c74', width: 9, opacity: 0.3, points: [[x - 4 * s, y + 3 * s], [x + 12 * s, y + 5 * s]].map(([a, b], i) => [a + (i ? 4 : -4), b]) }); p.tryStroke({ ...line, color: r() < 0.5 ? '#ffffff' : '#c8b494', width: Math.max(4.8, 5 * s), opacity: 0.9, points: [[x - 6.4 * s, y], [x + 6.4 * s, y + r.range(-1, 1)]] }); }

// ---------------------------------------------------------------- the blocks at the far left: grey concrete in the sun, each with thick legs
function block(x, y, s, turn) {
  p.tryStroke({ brush: 'soft', color: '#a8946c', width: Math.max(12, s * 0.4), opacity: 0.34, points: [[x - s * 0.5, y + s * 0.42], [x + s * 0.3, y + s * 0.48], [x + s * 1.0, y + s * 0.42]] });
  for (const [a, k] of [[-2.6 + turn, 0.92], [-0.55 + turn, 0.92], [-1.57 + turn * 0.6, 0.86]]) {
    const ex = x + Math.cos(a) * s * k, ey = y + Math.sin(a) * s * k * 0.86, w = Math.min(s * 0.4, Math.hypot(ex - x, ey - y) / 2.1), nx = -Math.sin(a), ny = Math.cos(a), up = ny < 0 ? 1 : -1;
    p.tryStroke({ ...line, cap: 'flat', rag: 0.06, mix: 0.04, color: mix('#6c7884', '#8a949c', r()), width: w, points: [[x, y], [ex, ey]] });
    p.tryStroke({ ...line, cap: 'flat', rag: 0.06, color: mix('#cfd4d2', '#eceee8', r()), width: Math.max(5, w * 0.3), opacity: 0.95, points: [[x + nx * up * w * 0.33 + (ex - x) * 0.14, y + ny * up * w * 0.33 + (ey - y) * 0.14], [ex + nx * up * w * 0.33, ey + ny * up * w * 0.33]] });
  }
}
for (const b of [[40, 690, 56, 0.2], [128, 700, 50, -0.3], [-6, 742, 70, -0.1], [94, 756, 66, 0.36], [190, 744, 48, 0.1]]) block(...b);
void solid;

p.save();
