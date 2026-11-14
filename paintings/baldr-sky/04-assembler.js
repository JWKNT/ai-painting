// The Assembler. It has come out of the right wing of the school, and that wing is gone:
// where it was stands a wave of grey, as high as the tower, with its crest over the
// tower's roof. It is like dull silver, not like water: it has folds, it shows the lights
// that are near it, and the lance of light behind it puts a white edge on it. Arms go out
// from it, along the roof and over the snow of the square: each arm branches like frost
// on glass. Where it touches the school, the wall breaks into small grey pieces, and
// the light draws those up into the air.
'use strict';
const { studio, open, W, H, GROUND, BEAM, TOWER, lance, waveTop, tide, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, glint } = studio;

const p = open('assembler');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.02, rag: 0.15, cap: 'round' };
// the left side of the wave at a height: its crest hangs over to the left, toward the tower
const leftEdge = (y) => 786 - 128 * Math.exp(-Math.pow((y - 300) / 80, 2)) - (y - 664) * 0.1 + 14 * (nC(4, y / 30) - 0.5);
const inWave = (x, y) => y < GROUND + 30 && y > waveTop(Math.max(700, x)) + 10 * (nC(x / 30, 2) - 0.5) && x > leftEdge(y);
// The grey of it at a place. It flows down and to the left from its crest, in folds.
const silver = (x, y) => {
  const fold = nA((x + y * 0.6) / 70, (y - x * 0.3) / 180), fine = nD(x / 16, y / 30), top = smooth(60, 0, y - waveTop(Math.max(700, x))), warm = Math.exp(-Math.pow(Math.hypot(x - 700, y - 600) / 260, 2));
  let c = mix('#2a3038', '#7c8896', fold);
  c = mix(c, fine > 0.7 ? '#c8d4e2' : '#1c2028', Math.abs(fine - 0.5) * 0.5);
  c = mix(c, '#f4f8ff', top * 0.85);                                                               // the lance behind it, on its top
  c = mix(c, '#b4c8ec', lance(x, y, 160) * 0.5);
  c = mix(c, '#c88848', warm * 0.34 * fold);                                                       // the lamps and the windows, in its near side
  return mix(c, '#14181e', smooth(GROUND - 160, GROUND + 20, y) * 0.3);
};
// It is smooth, like metal that has run: long strokes that go down from its crest in wide folds.
const flow = (x, y) => Math.atan2(y - 600, x - 900) - Math.PI / 2 + (nB(x / 260, y / 260) - 0.5) * 0.5;   // it goes up its back, over its crest, and down its front, like a wave that breaks to the left
p.fill({ inside: inWave, bounds: [620, 180, W, GROUND + 30], width: 26, length: 190, spacing: 0.45, overlap: 0.6, angle: flow, color: silver, stroke: { ...line, mix: 0.3, rag: 0.03, opacity: 0.97 } });
p.fill({ inside: inWave, bounds: [620, 180, W, GROUND + 30], width: 13, length: 130, spacing: 0.9, overlap: 0.7, angle: flow, color: (x, y) => silver(x + r.range(-8, 8), y + r.range(-8, 8)), stroke: { ...line, mix: 0.3, rag: 0.03, opacity: 0.8 } });
// its white edge: along its top, and down its crest
{ const pts = []; for (let x = 720; x <= W; x += 10) pts.push([x, waveTop(x) + 4]); glint(p, pts, () => mix('#dce8fc', '#ffffff', r()), { width: 6, dash: 70, gap: 10, opacity: 0.95, rng: r });
  const side = []; for (let y = 220; y < 420; y += 10) side.push([leftEdge(y) + 3, y]); glint(p, side, () => mix('#9cb0d4', '#e8f0ff', r()), { width: 4.6, dash: 40, gap: 16, opacity: 0.7, rng: r }); }
// the shine on it, and the dark of its folds: long bands that go round with it, as on any metal that has run
for (const [rad, a0, a1, w, c, op] of [[250, 3.5, 4.5, 26, '#e4ecfa', 0.3], [330, 3.7, 4.9, 30, '#f0f6ff', 0.3], [190, 3.3, 4.2, 22, '#101418', 0.3], [290, 3.4, 4.3, 28, '#14181e', 0.26], [420, 4.3, 5.3, 34, '#e4ecfa', 0.24], [370, 4.5, 5.6, 30, '#101418', 0.24], [520, 4.9, 5.7, 36, '#dce6f6', 0.22], [150, 3.2, 4.0, 20, '#dce6f6', 0.26]]) {
  const pts = studio.arc(900, 600, rad, a0, a1, 12).filter(([x, y]) => inWave(x, y));
  if (pts.length >= 3) { p.tryStroke({ brush: 'soft', color: c, width: w, opacity: op, taper: [0.4, 0.4], points: pts }); if (c !== '#101418' && c !== '#14181e') p.tryStroke({ brush: 'soft', color: '#ffffff', width: 9, opacity: 0.4, taper: [0.5, 0.5], points: pts.map(([x, y]) => [x + 2, y - 2]) }); }
}
// the lights of the square, in its near side: each a long warm band
for (const [x0, y0, len] of [[760, 470, 150], [800, 540, 110]]) p.stroke({ brush: 'soft', color: '#e89848', width: 18, opacity: 0.24, taper: [0.4, 0.7], points: [[x0, y0], [x0 - 10, y0 + len * 0.5], [x0 - 30, y0 + len]] });

// ---------------------------------------------------------------- the grey on the snow of the square: a flat tide with round tongues
p.fill({ inside: (x, y) => y > GROUND + 4 && tide(x, y) > 0, bounds: [640, GROUND, W, H + 4], width: 10, length: 90, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.04, 0.04), color: (x, y) => { const n = nA(x / 140, y / 20), k = lance(x, y, 300); let c = mix('#30363e', '#6c7684', n); c = mix(c, '#d4e0f4', k * 0.5 * smooth(H, GROUND, y)); return mix(c, '#12151a', smooth(GROUND + 120, H, y) * 0.5); }, stroke: { ...line, cap: 'flat', rag: 0.1, opacity: 0.97 } });
for (let y = GROUND + 10; y < H; y += r.range(9, 20)) { const x = 880 - (y - GROUND) * 0.5 + 46 * Math.sin(y / 31 + 1.3) + 26 * Math.sin(y / 13), l = r.range(16, 40); p.tryStroke({ brush: 'round', color: mix('#9cacc8', '#f0f4ff', r()), width: 4.4, opacity: 0.7, points: [[x + 3, y], [x + 3 + r.range(-4, 4), y + l]] }); }   // the edge of the tide: a pale line

// ---------------------------------------------------------------- its arms
// Thick tongues of the same grey go out from it, along the roof of the school and over the snow. Each is round, like a thing
// that pours, and ends in a round drop; smaller drops lie beyond its end. The lance lights their tops, and the lamps their near sides.
const metal = { shadow: '#14181e', half: '#4c5662', lit: '#aab6c8', bounce: '#8c6c4c' };
function tongue(pts, drops) {
  studio.solid(p, pts, metal, { light: [0.5, -0.86], turn: 0.1, width: 6.5, length: 26, vary: 0.05, mix: 0.1, edge: false });
  glint(p, pts.map(([x, y, q]) => [x, y - q + 3]), () => mix('#dce6f6', '#ffffff', r()), { width: 4.6, dash: 40, gap: 10, opacity: 0.85, rng: r });
  for (const [x, y, q] of drops) { studio.disc(p, x, y, Math.max(7, q), '#4c5662', 6.2, { ...line, mix: 0 }); p.tryStroke({ brush: 'round', color: '#eef4ff', width: 4, opacity: 0.85, taper: [0.4, 0.4], points: [[x - 6.2, y - q * 0.4], [x + 6.2, y - q * 0.4]] }); }
}
tongue([[760, 318, 30], [690, 332, 24], [630, 322, 19], [584, 338, 15]], [[556, 348, 9], [532, 340, 7]]);                      // over the roof of the tower
tongue([[780, 446, 30], [700, 440, 24], [620, 448, 18], [560, 444, 13], [512, 452, 10]], [[484, 450, 8], [458, 446, 7]]);      // along the roof of the school
tongue([[790, 560, 28], [730, 590, 22], [684, 630, 17], [660, 672, 13]], [[650, 700, 9]]);                                     // down the wall
tongue([[850, 740, 36], [770, 748, 30], [690, 770, 24], [628, 780, 18], [580, 800, 13]], [[548, 808, 10], [520, 802, 8], [496, 814, 7]]);   // over the snow of the square
tongue([[790, 900, 40], [720, 916, 32], [668, 950, 24], [640, 990, 18]], [[716, 870, 9]]);

// ---------------------------------------------------------------- the pieces of the school that break off where it touches, and go up
for (let k = 0; k < 130; k++) {
  const up = Math.pow(r(), 1.5), x = 700 + r.range(-40, 120) + up * (BEAM.x - 760) * 0.8, y = 620 - r.range(0, 200) - up * 420, s = Math.max(12.4, r.range(12, 22) * (1 - up * 0.5)), a = r.range(-0.4, 0.4);
  if (y < 20) continue;
  p.tryStroke({ ...line, cap: 'flat', rag: 0, mix: 0, color: mix(mix('#28345a', '#5c6474', r()), '#e4ecfc', lance(x, y, 200) * 0.6), width: Math.max(5, s * 0.5), opacity: clamp(1 - up * 0.6, 0.3, 1), points: [[x - Math.cos(a) * s / 2, y - Math.sin(a) * s / 2], [x + Math.cos(a) * s / 2, y + Math.sin(a) * s / 2]] });
}
void TOWER; void W;

p.save();
