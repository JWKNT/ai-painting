// The sky. It is all snow cloud, low and dark. At the right the lance of light has come
// through it: the cloud is burned open there, the cloud round the place is lit, and the
// light comes down as a column with soft sides.
'use strict';
const { studio, open, W, GROUND, BEAM, skyColor, lance, nA, nB } = require('./scene');
const { mix, shift, glow } = studio;

const p = open('sky');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.3, dry: 0.04, rag: 0.3, cap: 'round' };
// the cloud goes round the place where the lance came through
const turn = (x, y) => { const d = Math.hypot(x - BEAM.x, (y + 40) * 1.6), k = Math.exp(-d / 500); return (Math.atan2((y + 40) * 1.6, x - BEAM.x) + Math.PI / 2) * k + (nB(x / 300, y / 140) - 0.5) * 0.4 * (1 - k); };
p.fill({ bounds: [0, 0, W, GROUND + 14], width: 44, length: 240, spacing: 0.5, overlap: 0.55, angle: turn, color: (x, y) => shift(skyColor(x, Math.min(y, GROUND)), r.range(-2, 2), r.range(-0.03, 0.03), r.range(-0.012, 0.012)), stroke: { ...line, opacity: 0.93 } });
p.fill({ bounds: [0, 0, W, GROUND + 14], width: 22, length: 170, spacing: 0.9, overlap: 0.7, angle: turn, color: (x, y) => { const heavy = nA(x / 240, y / 110); return mix(skyColor(x, Math.min(y, GROUND)), heavy > 0.5 ? '#2c3c68' : '#050814', Math.abs(heavy - 0.5) * 0.8 * (1 - lance(x, y, 200))); }, stroke: { ...line, opacity: 0.75 } });
// where the lance came through, the cloud is burned open: there is only light there, and the cloud round it is lit
for (let k = 0; k < 40; k++) { const a = r.range(0, Math.PI), d = r.range(170, 330), x = BEAM.x - Math.cos(a) * d * 1.4, y = -20 + Math.sin(a) * d * 0.7, l = r.range(60, 140), t = turn(x, y); p.tryStroke({ brush: 'soft', color: mix('#6c8cc8', '#dce8fc', r()), width: r.range(14, 30), opacity: r.range(0.08, 0.2), taper: [0.5, 0.5], points: [[x - Math.cos(t) * l / 2, y - Math.sin(t) * l / 2], [x + Math.cos(t) * l / 2, y + Math.sin(t) * l / 2]] }); }
for (const [w, op, n] of [[420, 0.1, 5], [260, 0.18, 6], [170, 0.3, 6], [100, 0.4, 6]]) glow(p, BEAM.x, 10, w, mix('#93b4f0', '#ffffff', 1 - w / 440), op, n, 0.5);
// the column of light, down to the roofs: wide and faint, then narrower and brighter, then its white middle
for (const [w, op] of [[300, 0.07], [180, 0.12], [100, 0.2], [50, 0.4]]) p.stroke({ brush: 'soft', color: mix('#93b4f0', '#ffffff', 1 - w / 320), width: w, opacity: op, points: [[BEAM.x, -40], [BEAM.x, GROUND * 0.5], [BEAM.x + 2, GROUND + 60]] });
p.stroke({ ...line, mix: 0, rag: 0.05, color: '#ffffff', width: 22, points: [[BEAM.x, -20], [BEAM.x, GROUND * 0.5], [BEAM.x + 1, GROUND + 40]] });
// far roofs of the city at the left, low, each with a few lit windows; the snow is on them
for (let x = -10; x < 520; x += r.range(40, 90)) { const w = r.range(40, 86), h = r.range(30, 100), y = GROUND - 10; p.tryStroke({ ...line, cap: 'flat', rag: 0.05, mix: 0.05, color: mix('#0a1024', '#18223e', r()), width: w, points: [[x + w / 2, y + 10], [x + w / 2, y - Math.max(h, w * 2.1)]] }); p.tryStroke({ ...line, cap: 'flat', rag: 0.3, color: '#7c8cb4', width: 5, opacity: 0.8, points: [[x + 2, y - Math.max(h, w * 2.1) + 2], [x + w - 2, y - Math.max(h, w * 2.1) + 2]] }); for (let k = 0; k < 3; k++) if (r() < 0.6) { const wx = x + r.range(8, w - 20), wy = y - r.range(16, Math.max(h, w * 2.1) - 16); p.tryStroke({ brush: 'round', color: mix('#ffc468', '#ffe8b0', r()), width: 4.4, opacity: 0.8, points: [[wx, wy], [wx + 12.4, wy]] }); } }
void W;

p.save();
