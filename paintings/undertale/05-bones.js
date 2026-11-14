// The things nearest to us. You: a small red heart, in the light of the middle window,
// which the beam has just missed. Rows of bones that come up from the floor, as high as
// a wave; some of them are blue. At the far left, the yellow star where a traveller may
// rest. And at each side a great black pillar, close to us, with the light behind it.
'use strict';
const { studio, open, W, H, HEART, nA } = require('./scene');
const { mix, glow, solid, inPoly } = studio;

const p = open('bones');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.05, cap: 'round' };
const up = { light: [0.2, -1], gain: 1.3, vary: 0.05 };
const BONE = { shadow: '#857aae', half: '#cbc2e0', lit: '#fbf7ff', rim: '#ffffff' };
const CYAN = { shadow: '#1478c0', half: '#2cb0f0', lit: '#9ceaff', rim: '#ffffff' };

// ---------------------------------------------------------------- the star where a traveller may rest: four long points and four short ones
{ const x = 196, y = 742;
  for (const [w, op] of [[80, 0.1], [44, 0.2]]) glow(p, x, y, w, '#ffe040', op, 8);
  for (const [a, l, w] of [[0, 44, 13], [Math.PI / 2, 44, 13], [Math.PI / 4, 22, 9], [-Math.PI / 4, 22, 9]]) p.stroke({ ...line, mix: 0, color: '#ffe028', width: w, taper: [0.9, 0.9], points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x, y], [x + Math.cos(a) * l, y + Math.sin(a) * l]] });
  for (const a of [0, Math.PI / 2]) p.stroke({ brush: 'round', color: '#fffbd0', width: 5, taper: [0.8, 0.8], points: [[x - Math.cos(a) * 14, y - Math.sin(a) * 14], [x + Math.cos(a) * 14, y + Math.sin(a) * 14]] });
  p.stroke({ brush: 'soft', color: '#7c3418', width: 16, opacity: 0.3, points: [[x - 22, y + 46], [x + 22, y + 46]] });
}

// ---------------------------------------------------------------- the bones
function bone(x, top, w, tones, lean = 0) {
  const k = w / 2;
  p.stroke({ brush: 'soft', color: '#5c2412', width: Math.max(10, w), opacity: 0.25, points: [[x + lean * 0.3 + w * 0.9, H + 4], [x + lean + w * 0.9, top + (H - top) * 0.4]] });        // a little shade beside it
  solid(p, [[x, H + 12, k], [x + lean, top + k, k]], tones, { ...up, width: 5.5, length: 26, edgeWidth: 4.4, rim: 0.85 });
  solid(p, [[x + lean - k * 0.95, top, k * 1.02], [x + lean + k * 0.95, top, k * 1.02]], tones, { ...up, width: 5.5, length: 16, edge: false });
}
// the wave of them at the right
const wave = [];
for (let x = 884, i = 0; x < 1500; x += 36, i++) wave.push([x + r.range(-3, 3), 912 - 96 * Math.pow(Math.sin((x - 884) / 616 * Math.PI), 1.2) + r.range(-6, 6), i]);
for (const [x, top, i] of wave) { const blue = [5, 6, 12].includes(i); if (blue) for (const [w, op] of [[60, 0.08], [34, 0.14]]) glow(p, x, top + 30, w, '#40c8ff', op, 6, 2.2); bone(x, top, 17, blue ? CYAN : BONE, r.range(-3, 3)); }
// and a low row at the left
for (let x = 126, i = 0; x < 420; x += 36, i++) bone(x + r.range(-3, 3), 950 - 34 * Math.sin((x - 126) / 294 * Math.PI) + r.range(-5, 5), 16, i === 4 ? CYAN : BONE, r.range(-3, 3));

// ---------------------------------------------------------------- the heart
{ const { x, y } = HEART, s = 34;
  for (const [g, op] of [[110, 0.12], [64, 0.2]]) glow(p, x, y, g, '#fffaf0', op, 8);
  p.stroke({ brush: 'soft', color: '#5c2412', width: 24, opacity: 0.4, points: [[x - 30, y + 74], [x + 30, y + 74]] });                 // its shade on the floor: it is in the air
  const pts = []; for (let i = 0; i <= 48; i++) { const t = i / 48 * Math.PI * 2, hx = 16 * Math.pow(Math.sin(t), 3), hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)); pts.push([x + hx * s / 16, y + hy * s / 16]); }
  // its two halves are laid in with strokes that go down toward its point, so its edges are clean
  p.fill({ inside: inPoly(pts), bounds: [x - s - 4, y - s - 4, x + s + 4, y + s + 8], width: 6, length: 24, spacing: 0.4, overlap: 0.6, angle: (px) => (px < x ? Math.PI / 4 : Math.PI * 3 / 4), color: (px, py) => mix(mix('#ff3838', '#e00c1c', (py - y + s) / (2 * s)), '#b40818', Math.max(0, (px - x) / s) * 0.5), stroke: { ...line, rag: 0.02, opacity: 0.98 } });
  p.stroke({ ...line, mix: 0, rag: 0.02, color: '#d80c1c', width: 6, points: pts });
  p.tryStroke({ brush: 'round', color: '#ffb8b0', width: 5.4, opacity: 0.95, points: [[x - 20, y - 15], [x - 13, y - 22], [x - 4, y - 20]] });
}

// ---------------------------------------------------------------- the two black pillars close to us
for (const [x0, x1] of [[-40, 78], [1522, W + 40]]) {
  const mid = (x0 + x1) / 2, hw = (x1 - x0) / 2, inside = (x, y) => Math.abs(x - mid) < hw + (y < 70 ? (70 - y) * 0.5 : 0) + (y > H - 60 ? (y - H + 60) * 0.5 : 0);
  for (let x = x0 + 16; x < x1; x += 22) p.stroke({ ...line, cap: 'flat', mix: 0, color: '#1c0c0c', width: 36, points: [[x, -10], [x, H / 2], [x, H + 10]] });                 // one coat, so that no gold shows through
  p.fill({ inside, bounds: [x0 - 40, 0, x1 + 40, H], width: 12, length: 160, spacing: 0.4, overlap: 0.6, angle: () => Math.PI / 2 + r.range(-0.01, 0.01), color: (x, y) => mix('#1c0c0c', '#2a120e', nA(x / 30, y / 200)), stroke: { ...line, cap: 'flat', rag: 0.02, opacity: 0.98 } });
  for (const s of [-1, 1]) { const ex = mid + s * hw; if (ex < 0 || ex > W) continue; p.stroke({ ...line, cap: 'flat', color: '#b85a1c', width: 6, points: [[ex - s * 5, 76], [ex - s * 5, H - 66]] }); p.stroke({ brush: 'round', color: '#ffb050', width: 4, opacity: 0.8, points: [[ex - s * 1, 80], [ex - s * 1, H - 70]] }); }
  for (const y of [70, H - 62]) p.stroke({ ...line, cap: 'flat', color: '#8c3c14', width: 9, points: [[x0 - 36, y], [x1 + 36, y]] });
}

p.save();
