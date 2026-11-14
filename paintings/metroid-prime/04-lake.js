// The lake. It is still and dark. Far off it shows the grey of the sky; near us, where we
// look down into it, it is nearly black. Under the far shore lies the dark of the rock,
// and under the tower and each lamp their light comes down the water in a broken line.
// Thin sheets of new ice lie on it. Flat stones stand in it, one beyond another toward
// the temple, each with a round cap of snow; and at the right two great posts of rock
// stand up out of it, with snow on their heads.
'use strict';
const { studio, open, W, H, cam, WATER, SHORE, TOWER, onLedge, veil, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('lake');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.16, dry: 0.03, rag: 0.2, cap: 'round' };
const away = (y) => cam.f * (cam.eye - WATER) / Math.max(0.5, y - cam.hz);                       // how far off a place of the lake is, in metres

// ---------------------------------------------------------------- the water
const water = (x, y) => {
  const t = clamp((y - SHORE) / (H - SHORE), 0, 1);
  let c = mix('#74848c', '#161f25', Math.pow(t, 0.5));                                            // the grey of the sky far off; the dark of the deep near us
  c = mix(c, '#1e262c', smooth(SHORE + 46, SHORE, y) * 0.8);                                      // the dark of the far shore, under it
  c = mix(c, '#5a6870', Math.exp(-Math.pow((x - TOWER.x) / 70, 2)) * smooth(SHORE + 150, SHORE + 20, y) * 0.5);   // the pale of the tower
  return mix(c, '#0e1418', (nA(x / 300, y / 16) - 0.5) * 0.3);
};
const inLake = (x, y) => y > SHORE - 4 && !onLedge(x, y);
for (const [y0, y1, w, len] of [[SHORE - 4, 600, 5.5, 60], [592, 720, 8, 100], [712, H + 4, 12, 150]]) p.fill({ inside: inLake, bounds: [0, y0, W, y1], width: w, length: len, spacing: 0.5, overlap: 0.6, angle: () => r.range(-0.012, 0.012), color: water, stroke: { ...line, opacity: 0.96 } });
p.fill({ inside: inLake, bounds: [0, SHORE, W, H], width: 5.5, length: 50, spacing: 1.2, overlap: 0.7, angle: () => r.range(-0.012, 0.012), color: (x, y) => water(x + r.range(-10, 10), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.75 } });
// The lamps, down the water: each a broken line of warm light under its lamp.
for (const [x, n, len] of [[TOWER.x - 4, 9, 120], [868, 8, 100]]) for (let k = 0; k < n; k++) { const y = SHORE + 6 + k * len / n + r.range(-3, 3), w = r.range(14, 34) * (1 - k / n * 0.5); p.tryStroke({ brush: 'round', color: mix('#ff9a3c', '#ffd88c', r()), width: 4.4, opacity: 0.7 * (1 - k / n * 0.8), taper: [0.4, 0.4], points: [[x - w / 2 + r.range(-4, 4), y], [x + w / 2 + r.range(-4, 4), y]] }); }
// Level lines of light on it, where the air moves it a little; more of them far off.
for (let k = 0; k < 130; k++) { const y = SHORE + 10 + Math.pow(r(), 1.7) * (H - SHORE - 20), x = r.range(-20, W), len = r.range(30, 160) * (0.5 + (y - SHORE) / 400); if (onLedge(x, y) || onLedge(x + len, y)) continue; p.tryStroke({ brush: 'round', color: mix('#7c8c94', '#b4c0c6', r()), width: 4, opacity: r.range(0.12, 0.34), taper: [0.5, 0.5], points: [[x, y], [x + len, y + r.range(-1, 1)]] }); }
// Thin sheets of new ice: pale flat places, each with a paler edge.
for (const [x, y, w, h] of [[1310, 520, 240, 9], [760, 532, 200, 8], [1480, 566, 220, 12], [980, 612, 180, 10], [640, 600, 150, 9], [1250, 700, 300, 18], [900, 760, 260, 20]]) {
  for (let k = 0; k < 3; k++) p.tryStroke({ brush: 'soft', color: '#aebcc4', width: Math.max(9, h * (1 - k * 0.2)), opacity: 0.17, taper: [0.5, 0.5], points: [[x - w / 2 + k * 14, y + k * h * 0.2], [x, y + r.range(-1, 1)], [x + w / 2 - k * 20, y + k * h * 0.2]] });
  p.tryStroke({ brush: 'round', color: '#dce4e8', width: 4, opacity: 0.4, taper: [0.5, 0.5], points: [[x - w * 0.4, y - h * 0.4], [x, y - h * 0.5], [x + w * 0.36, y - h * 0.4]] });
}

// ---------------------------------------------------------------- the flat stones, far ones first
// A stone at a place of the lake (X to the right, Z away): a low dark side, a round cap of snow on it, and its dark in the water under it.
function stone(X, Z, R, high) {
  const [x, yw] = cam.at(X, WATER, Z), [, yt] = cam.at(X, WATER + high, Z), u = cam.unit(Z), rx = R * u, ry = Math.max(3, rx * (cam.eye - WATER - high) / Z), d = smooth(14, 90, Z) * 0.5, side = yw - yt;
  p.tryStroke({ brush: 'soft', color: '#0a0f12', width: Math.max(9, side * 1.4), opacity: 0.5, points: [[x - rx * 0.96, yw + side * 0.5], [x, yw + ry + side * 0.5], [x + rx * 0.96, yw + side * 0.5]] });   // its dark in the water
  for (let k = 0; k < 3; k++) { const w = Math.max(5, side * 0.6), yy = yt + ry * 0.4 + (side - w * 0.4) * k / 2; p.tryStroke({ ...line, rag: 0.35, color: veil(mix('#24292e', '#4a5054', r()), x, yy, d), width: w, points: [[x - rx * (1 - 0.03 * k), yy - ry * 0.3], [x, yy + ry * 0.7], [x + rx * (1 - 0.03 * k), yy - ry * 0.3]] }); }   // its side: we see the near half of it, which bends down in the middle
  // the cap of snow: level strokes, long in the middle and short at the far and near edges; a little blue toward us and at the right
  const n = Math.max(2, Math.round(ry * 2 / 6));
  for (let i = 0; i < n; i++) { const v = -1 + 2 * (i + 0.5) / n, hw = rx * Math.sqrt(1 - v * v) * 0.98, yy = yt + v * ry, w = Math.max(5, Math.min(ry * 2 / n * 1.5, hw / 1.1)); if (hw * 2 >= Math.max(12.4, w * 2)) p.tryStroke({ ...line, rag: 0.25, color: veil(mix(mix('#f6f8f8', '#cdd8e0', smooth(-0.2, 1, v)), '#b0bfcc', 0.2 * r()), x, yy, d), width: w, points: [[x - hw, yy], [x + r.range(-3, 3), yy + r.range(-0.6, 0.6)], [x + hw, yy]] }); }
  p.tryStroke({ brush: 'round', color: veil('#8c9ca8', x, yt, d), width: 4, opacity: 0.5, points: [[x - rx * 0.86, yt + ry * 0.62], [x, yt + ry * 1.02], [x + rx * 0.86, yt + ry * 0.62]] });   // the shade under the near edge of the snow
}
for (const [X, Z, R, high] of [[9.5, 62, 1.5, 0.3], [6.4, 46, 1.6, 0.3], [8.2, 33, 1.7, 0.32], [4.4, 24, 1.6, 0.34], [6.6, 17, 1.8, 0.36], [3.4, 12, 1.9, 0.4]]) stone(X, Z, R, high);

// ---------------------------------------------------------------- the two posts of rock, at the right
// Each is a tall crag of dark rock in thick beds, a little wider at its head. Its left side takes the light of the sky; its right
// side is nearly black. Snow lies deep on its head and thinly on a ledge or two.
function post(x, foot, w, h, seed, d) {
  const half = (y) => w * (0.42 + 0.16 * smooth(foot - h * 0.5, foot - h, y) + 0.1 * (nC(seed, y / (w * 0.34)) - 0.5) + 0.05 * (nB(seed + 3, y / 14) - 0.5));
  p.tryStroke({ brush: 'soft', color: '#090d10', width: Math.max(12, w * 0.5), opacity: 0.55, points: [[x - w * 0.7, foot + w * 0.14], [x, foot + w * 0.26], [x + w * 0.7, foot + w * 0.14]] });
  p.fill({ inside: (px, py) => py < foot + 2 && py > foot - h && Math.abs(px - x) < half(py), bounds: [x - w * 0.8, foot - h, x + w * 0.8, foot + 2], width: Math.max(6, w * 0.07), length: Math.max(20, w * 0.44), spacing: 0.5, overlap: 0.6, angle: () => 0.06 + r.range(-0.1, 0.1),
    color: (px, py) => { const k = (px - x) / half(py), bed = nA(seed * 7 + px / 300, py / (w * 0.16)); let c = mix('#22282c', '#3e464a', bed); c = mix(c, '#8e9aa0', smooth(-0.15, -1, k) * 0.7); c = mix(c, '#07090b', smooth(0.05, 1, k) * 0.85); return veil(c, px, py, d); }, stroke: { ...line, rag: 0.35, opacity: 0.97 } });
  const top = foot - h, cw = half(top + 4) * 1.06;                           // the cap of snow: thick, round at its two ends, blue under
  p.tryStroke({ ...line, rag: 0.2, color: veil('#9fb0bd', x, top, d), width: Math.max(8, w * 0.2), points: [[x - cw, top + w * 0.04], [x, top + w * 0.07], [x + cw, top + w * 0.04]] });
  p.tryStroke({ ...line, rag: 0.2, color: veil('#f4f7f8', x, top, d), width: Math.max(8, w * 0.2), points: [[x - cw * 0.98, top - w * 0.05], [x - cw * 0.2, top - w * 0.09], [x + cw * 0.9, top - w * 0.05]] });
}
post(1372, 598, 58, 84, 2.1, 0.26);
post(1500, 846, 176, 330, 5.3, 0);

p.save();
