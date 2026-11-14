// The sky. It is all cloud, dark and blue-green, and it turns slowly about the number, as
// if the number drew it. Near the number the cloud is lit a pale gold. Then the ring: a
// thin circle of gold light that stands round the number, far wider than the Monolith.
'use strict';
const { studio, open, W, HORIZON, NUM, RING, gold, skyColor, nB } = require('./scene');
const { mix, shift, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.3, dry: 0.04, rag: 0.3, cap: 'round' };
// the strokes go round the number, and a little in toward it
const turn = (x, y) => Math.atan2(y - NUM.y, x - NUM.x) + Math.PI / 2 + 0.2;
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 44, length: 260, spacing: 0.5, overlap: 0.55, angle: turn, color: (x, y) => shift(skyColor(x, Math.min(y, HORIZON)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.93 } });
// the great masses of the cloud: darker and lighter arms that go round with it
const arm = (x, y) => { const d = Math.hypot(x - NUM.x, (y - NUM.y) * 1.15), a = Math.atan2(y - NUM.y, x - NUM.x); return Math.sin(a * 2 + d / 150 + 1.2) * 0.5 + 0.5; };
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 24, length: 190, spacing: 0.8, overlap: 0.7, angle: turn, color: (x, y) => { const k = arm(x, y), n = nB(x / 200, y / 120); const c = mix(skyColor(x, Math.min(y, HORIZON)), k > 0.5 ? '#35676a' : '#050e15', Math.abs(k - 0.5) * 0.9 * (1 - gold(x, y, 260))); return shift(mix(c, '#08161e', (n - 0.5) * 0.3), r.range(-3, 3), r.range(-0.03, 0.03), r.range(-0.014, 0.014)); }, stroke: { ...line, opacity: 0.8 } });
p.fill({ bounds: [0, 0, W, HORIZON + 14], width: 11, length: 120, spacing: 1.5, overlap: 0.8, angle: turn, color: (x, y) => { const k = arm(x + r.range(-20, 20), y + r.range(-20, 20)); return mix(skyColor(x, Math.min(y, HORIZON)), k > 0.5 ? '#548682' : '#040c12', Math.abs(k - 0.5) * 0.8 * (1 - gold(x, y, 240))); }, stroke: { ...line, opacity: 0.6, taper: [0.4, 0.4] } });
// the edges of the cloud near the number are lit: short touches of pale gold that go round with it
for (let k = 0; k < 190; k++) { const a = r.range(0, Math.PI * 2), d = r.range(190, 470), x = NUM.x + Math.cos(a) * d * 1.15, y = NUM.y + 30 + Math.sin(a) * d * 0.9; if (y < 10 || y > HORIZON - 20 || x < 0 || x > W) continue; const g = gold(x, y, 400), l = r.range(30, 90), t = turn(x, y); if (r() < g * 1.5) p.tryStroke({ ...line, color: mix('#9c8c5c', '#f4e4b0', r()), width: r.range(6, 12), opacity: 0.18 + 0.45 * g, taper: [0.5, 0.5], points: [[x - Math.cos(t) * l / 2, y - Math.sin(t) * l / 2], [x + Math.cos(t) * l / 2, y + Math.sin(t) * l / 2]] }); }
// the light of the number in the air
for (const [w, op, n] of [[420, 0.06, 5], [260, 0.09, 6], [150, 0.12, 6]]) glow(p, NUM.x, NUM.y + 10, w, mix('#d0b470', '#fff0c4', 1 - w / 440), op, n, 0.9);

// ---------------------------------------------------------------- the ring
// It is drawn in short pieces. It is brightest low at the left, and it is broken here and there.
for (let i = 0; i < 96; i++) {
  const a0 = i / 96 * Math.PI * 2, a1 = a0 + Math.PI * 2 / 96 * 1.25, b = 0.45 + 0.55 * Math.pow(0.5 + 0.5 * Math.cos(a0 - 2.5), 1.4), pts = studio.arc(NUM.x, NUM.y, RING, a0, a1, 4);
  if (pts[1][1] > HORIZON - 6 || (i % 13 === 5)) continue;
  p.tryStroke({ brush: 'soft', color: '#e8a83c', width: 26, opacity: 0.1 * b, points: studio.arc(NUM.x, NUM.y, RING, a0 - 0.05, a1 + 0.05, 5) });
  p.tryStroke({ brush: 'soft', color: '#ffc85c', width: 11, opacity: 0.34 * b, points: studio.arc(NUM.x, NUM.y, RING, a0 - 0.02, a1 + 0.02, 5) });
  p.tryStroke({ brush: 'round', color: mix('#ffd88c', '#fffbe8', b), width: b > 0.75 ? 5.4 : 4.4, opacity: 0.5 + 0.5 * b, points: pts });
}

p.save();
