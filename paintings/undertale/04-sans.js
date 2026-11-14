// Sans. He stands in the middle of the hall, in the light of the middle window, and he
// is small under the skulls that he has called. He is a short wide skeleton: a great
// round head, a blue jacket with a rough pale hood, a white shirt, black shorts with a
// white stripe, and pink slippers. His hands are in his pockets. His grin does not
// change. His right eye hole is empty; in his left burns a blue fire. The window is
// behind him, so he is in his own shade, with a bright edge on his head and shoulders,
// and his shade lies long on the floor toward us.
'use strict';
const { studio, open, SANS } = require('./scene');
const { mix, glow, shape, solid } = studio;

const p = open('sans');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0, rag: 0.05, cap: 'round' };
const X = SANS.x, F = SANS.feet, K = 1.16;
const P = (dx, dy) => [X + dx * K, F - dy * K];                      // a place on him: so far to the right of his middle, so far up from his feet
const up = { light: [0.15, -1], gain: 1.3, vary: 0.05 };
const BONE = { shadow: '#857aae', half: '#c9c0de', lit: '#fbf7ff', rim: '#ffffff' };
const BLUE = { shadow: '#1c2c6c', half: '#2c479c', lit: '#4c74d8', rim: '#c4dcff' };
const FUR = { shadow: '#8c84b4', half: '#c8c0dc', lit: '#f4f0fa', rim: '#ffffff' };
const DARK = '#15121f';
const sym = (pts) => pts.concat(pts.slice().reverse().map(([dx, dy]) => [-dx, dy])).map(([dx, dy]) => P(dx, dy));

// ---------------------------------------------------------------- his shade on the floor: long, toward us
// It has his shape: the wide body next to his feet, and then the round of his head.
const shade = (x, y) => { const d = y - F + 6; if (d < 0 || d > 214) return false; const half = d < 108 ? 128 - d * 0.3 : Math.sqrt(Math.max(0, 58 * 58 - Math.pow(d - 156, 2))) + (d < 118 ? 34 : 0); return Math.abs(x - X) < half; };
p.fill({ inside: shade, bounds: [X - 140, F - 6, X + 140, F + 216], width: 8, length: 60, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: () => mix('#6a2a12', '#8a3e18', r()), stroke: { ...line, cap: 'flat', opacity: 0.55 } });
p.stroke({ brush: 'soft', color: '#4c1c10', width: 30, opacity: 0.4, points: [[X - 78 * K, F + 2], [X, F + 5], [X + 78 * K, F + 2]] });

// ---------------------------------------------------------------- slippers, legs, shorts
for (const s of [-1, 1]) {
  solid(p, [[...P(s * 64, 6), 9 * K], [...P(s * 34, 5), 11 * K]], { shadow: '#a84c78', half: '#d8709c', lit: '#ffa8c8', rim: '#ffe0ec' }, { ...up, width: 5.5, length: 16 });
  p.stroke({ ...line, color: BONE.half, width: 10, points: [P(s * 33, 32), P(s * 35, 10)] });
}
shape(p, [P(-74, 66), P(74, 66), P(78, 26), P(8, 24), P(0, 38), P(-8, 24), P(-78, 26)], { shadow: '#0e0c18', half: '#1a1828', lit: '#2c2a44', rim: '#6c6890' }, { ...up, width: 6, length: 20 });
for (const s of [-1, 1]) p.stroke({ ...line, color: '#d8d2e8', width: 6, points: [P(s * 67, 60), P(s * 70, 29)] });

// ---------------------------------------------------------------- the jacket: round at the shoulders, wide at the hem; and the shirt that shows where it is open
shape(p, sym([[-40, 166], [-74, 154], [-94, 124], [-100, 84], [-92, 54], [-60, 44], [0, 42]]), BLUE, { ...up, width: 7, length: 26, rim: 0.9, edgeWidth: 4.6, round: 50 });
shape(p, [P(-18, 152), P(18, 152), P(26, 46), P(-26, 46)], { shadow: '#9088b8', half: '#c8c0de', lit: '#f0ecf8' }, { ...up, width: 6, length: 22 });
// the sleeves: each goes down from the shoulder to the pocket, where the hand is
for (const s of [-1, 1]) {
  solid(p, [[...P(s * 84, 136), 22 * K], [...P(s * 100, 98), 21 * K], [...P(s * 86, 66), 18 * K], [...P(s * 62, 60), 15 * K]], BLUE, { ...up, width: 6, length: 20, edgeWidth: 4.4, rim: 0.8 });
  p.stroke({ ...line, color: '#16245c', width: 5, points: [P(s * 19, 150), P(s * 23, 98), P(s * 27, 47)] });                           // the edge of the jacket
  p.stroke({ ...line, color: '#101a48', width: 6, points: [P(s * 42, 80), P(s * 56, 70), P(s * 70, 56)] });                           // the pocket
}
p.stroke({ ...line, color: '#16245c', width: 6, points: [P(-88, 48), P(-40, 43), P(0, 42), P(40, 43), P(88, 48)] });                  // the hem

// ---------------------------------------------------------------- the hood: rough and pale, round his neck
solid(p, [[...P(-76, 154), 17 * K], [...P(-44, 140), 21 * K], [...P(0, 134), 22 * K], [...P(44, 140), 21 * K], [...P(76, 154), 17 * K]], FUR, { ...up, width: 6, length: 16, flow: () => r.range(0, Math.PI), rag: 0.3 });
for (let k = 0; k < 44; k++) { const t = r.range(-1, 1), [x, y] = P(t * 92, 140 + Math.abs(t) * 16 - r.range(-14, 22)); const a = r.range(-0.5, 0.5); p.tryStroke({ ...line, rag: 0.3, color: mix(FUR.shadow, FUR.lit, 0.3 + 0.7 * r()), width: 6.5, taper: [0, 0.8], points: [[x, y - 7], [x + Math.sin(a) * 15, y + 9]] }); }

// ---------------------------------------------------------------- the head
shape(p, sym([[0, 262], [-34, 258], [-54, 242], [-63, 216], [-61, 190], [-49, 170], [-26, 160], [0, 158]]), BONE, { ...up, width: 7, length: 26, rim: 0.95, edgeWidth: 5, round: 52, mix: 0.4, vary: 0.03 });
// the eye holes
for (const s of [-1, 1]) { const [cx, cy] = P(s * 26, 213); p.fill({ inside: (x, y) => Math.pow((x - cx) / (16 * K), 2) + Math.pow((y - cy) / (18 * K), 2) < 1, bounds: [cx - 22, cy - 24, cx + 22, cy + 24], width: 6, length: 18, spacing: 0.45, overlap: 0.6, angle: () => r.range(0, Math.PI), color: () => mix(DARK, '#241c38', r() * 0.4), stroke: { ...line, opacity: 0.98 } }); }
// the nose: a small dark point
for (const s of [-1, 1]) p.stroke({ brush: 'round', color: DARK, width: 4.6, points: [P(s * 5.5, 180), P(0, 193)] });
// the grin: wide, with its ends up, and the lines of the teeth across it
p.stroke({ ...line, mix: 0, color: DARK, width: 5.4, points: [P(-45, 177), P(-30, 169), P(0, 165), P(30, 169), P(45, 177)] });
for (const s of [-1, 1]) p.stroke({ brush: 'round', color: DARK, width: 4.4, points: [P(s * 44, 176), P(s * 51, 187)] });
for (const dx of [-27, -13.5, 0, 13.5, 27]) p.stroke({ brush: 'round', color: DARK, width: 4.2, opacity: 0.85, points: [P(dx, 172.5 + Math.abs(dx) * 0.13), P(dx, 159 + Math.abs(dx) * 0.13)] });

// ---------------------------------------------------------------- the blue fire in his left eye: it is small in the dark of the hole, and thin points of it go up
{ const [ex, ey] = P(26, 212);
  glow(p, ex, ey, 34, '#30d8ff', 0.1, 8);
  for (const [dx, dy, w, c] of [[16, -50, 10, '#28c8ff'], [30, -34, 8, '#58e0ff'], [4, -42, 8, '#58e0ff']]) p.tryStroke({ ...line, mix: 0, color: c, width: w, opacity: 0.9, taper: [0, 0.9], points: [[ex, ey], [ex + dx * 0.4, ey + dy * 0.55], [ex + dx, ey + dy]] });
  glow(p, ex, ey, 13, '#34dcff', 0.95, 8); glow(p, ex, ey, 8.4, '#ffffb0', 0.95, 8);
}

p.save();
