// The Christmas tree in the square, the present, and the snow that falls. The tree is a
// fir as high as the first storey, with snow on its boughs, strings of small warm lights
// round it, and a gold star at its top. The lance lights its right side white; its left
// side is in its own shade. In front of it, in the snow, lies a small present in red
// paper with a white ribbon, which someone let fall. The snow comes down over all of it:
// white, and grey near the grey wave.
'use strict';
const { studio, open, W, H, TREE, GROUND, lance, tide, waveTop } = require('./scene');
const { mix, clamp, glow, shape } = studio;

const p = open('tree');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.02, rag: 0.2, cap: 'round' };
const { x: TX, base: TB, h: TH } = TREE;

// ---------------------------------------------------------------- the tree
// its long blue shade on the snow, away from the lance: to the left and toward us
for (const [w, op] of [[90, 0.3], [60, 0.3]]) p.stroke({ brush: 'soft', color: '#1a2240', width: w, opacity: op, taper: [0, 0.5], points: [[TX, TB], [TX - 190, TB + 40], [TX - 420, TB + 84]] });
p.stroke({ brush: 'soft', color: '#e8a050', width: 70, opacity: 0.16, points: [[TX - 150, TB + 6], [TX, TB + 12], [TX + 150, TB + 6]] });               // the light of its lamps on the snow under it
p.tryStroke({ ...line, color: '#1c120c', width: 22, points: [[TX, TB + 4], [TX, TB - 50]] });                                                    // its stem
// the dark of the tree inside its boughs
p.fill({ inside: (x, y) => y < TB - 30 && y > TB - TH + 20 && Math.abs(x - TX) < (y - (TB - TH)) * 0.34, bounds: [TX - 170, TB - TH, TX + 170, TB - 30], width: 10, length: 40, spacing: 0.5, angle: (x) => Math.PI / 2 + (x - TX) / 300, color: () => mix('#050e0a', '#0f2418', r()), stroke: { ...line, opacity: 0.97 } });
// its boughs, in tiers from the lowest up: each tier is a row of boughs that hang down and out, with snow on them
const TIERS = 7;
for (let t = 0; t < TIERS; t++) {
  const k = t / (TIERS - 1), y = TB - 40 - (TH - 70) * k, half = (TH * 0.36) * (1 - k * 0.86) + 10, n = Math.max(3, Math.round(half / 16));
  for (let i = 0; i < n; i++) {
    const u = -1 + 2 * (i + 0.5) / n, bx = TX + u * half * 0.5, ex = TX + u * half, ey = y + 34 + 20 * (1 - Math.abs(u)), lit = clamp(0.5 + u * 0.7, 0, 1);
    p.tryStroke({ ...line, rag: 0.4, color: mix(mix('#07140e', '#143020', r()), '#3c6c64', lit * 0.5), width: r.range(14, 20), taper: [0, 0.7], points: [[bx, y - 6], [(bx + ex) / 2, (y + ey) / 2 - 4], [ex, ey]] });
    if (r() < 0.8) p.tryStroke({ ...line, rag: 0.4, color: mix(mix('#7c8cb8', '#a8b8dc', r()), '#f8fbff', lit * 0.9), width: r.range(6, 9), opacity: 0.95, taper: [0.1, 0.6], points: [[bx, y - 12], [(bx + ex) / 2, (y + ey) / 2 - 12], [ex - u * 6, ey - 8]] });   // the snow on it
  }
}
// its strings of lights: they go round it in slow turns; each lamp is a small warm light
for (let t = 0; t < 46; t++) { const k = t / 46, y = TB - 30 - (TH - 90) * k, half = (TH * 0.36) * (1 - k * 0.86) + 6, x = TX + Math.sin(k * 30) * half * 0.86, c = r.pick(['#ffd070', '#ffb050', '#ff8c5c', '#fff0b0']); glow(p, x, y + 16, 15, c, 0.16, 6); glow(p, x, y + 16, 9, '#fff4d0', 0.4, 8); }
// the star at its top
{ const sy = TB - TH - 6; for (const [w, op] of [[70, 0.1], [36, 0.2], [18, 0.4]]) glow(p, TX, sy, w, '#ffe08c', op, 8); p.tryStroke({ ...line, color: '#fff4c0', width: 9, taper: [0.5, 0.5], points: [[TX, sy - 16], [TX, sy + 16]] }); p.tryStroke({ ...line, color: '#fff4c0', width: 8, taper: [0.5, 0.5], points: [[TX - 14, sy + 2], [TX + 14, sy + 2]] }); }
// the light of the lance down its right side
for (let t = 0; t < TIERS; t++) { const k = t / (TIERS - 1), y = TB - 40 - (TH - 70) * k, half = (TH * 0.36) * (1 - k * 0.86) + 10; p.tryStroke({ brush: 'round', color: '#eef4ff', width: 4.4, opacity: 0.8, taper: [0.2, 0.5], points: [[TX + half * 0.6, y + 8], [TX + half * 0.9, y + 28], [TX + half, y + 46]] }); }

// ---------------------------------------------------------------- the present in the snow
{ const gx = 620, gy = 934, box = [[gx - 30, gy - 20], [gx + 22, gy - 26], [gx + 30, gy + 10], [gx - 24, gy + 18]];
  p.stroke({ brush: 'soft', color: '#1a2240', width: 26, opacity: 0.4, points: [[gx, gy + 12], [gx - 50, gy + 22], [gx - 110, gy + 34]] });
  shape(p, box, { shadow: '#5c0c16', half: '#a81c24', lit: '#e84c40', bounce: '#7c2c4c' }, { light: [0.7, -0.6], turn: 0, width: 5.5, length: 18, round: 8, mix: 0.05, flow: () => -0.1, edge: false });
  p.tryStroke({ ...line, color: '#f8f4f0', width: 7, points: [[gx - 28, gy - 2], [gx + 27, gy - 8]] }); p.tryStroke({ ...line, color: '#f8f4f0', width: 7, points: [[gx - 3, gy - 23], [gx + 3, gy + 14]] });   // its ribbon
  for (const s of [-1, 1]) p.tryStroke({ ...line, color: '#ffffff', width: 6, taper: [0.2, 0.5], points: [[gx, gy - 6], [gx + s * 12, gy - 20], [gx + s * 16, gy - 8]] });   // the bow of it
  p.tryStroke({ ...line, rag: 0.4, color: '#c8d8f4', width: 9, points: [[gx - 34, gy + 16], [gx - 4, gy + 21], [gx + 30, gy + 14]] }); }             // it is a little way down in the snow

// ---------------------------------------------------------------- the snow that falls
// Far flakes are small points; near ones are soft and round. In the light of the lance they are bright; near the grey wave they are grey.
for (const [n, w0, w1, op0, op1] of [[260, 9, 9, 0.08, 0.26], [70, 9, 11, 0.16, 0.36], [12, 12, 16, 0.14, 0.24]]) for (let k = 0; k < n; k++) {
  const x = r.range(0, W), y = r.range(0, H), k2 = lance(x, y, 260), ash = (x > 700 && y > waveTop(Math.max(700, x)) - 60) || (y > GROUND && tide(x, y) > -40), c = ash ? mix('#5c6474', '#9ca4b4', r()) : mix('#c8d8f4', '#ffffff', k2 + 0.3 * r());
  if (Math.hypot(x - 620, y - 934) < 60) continue;                                                 // none over the present
  glow(p, x, y, r.range(w0, w1), c, r.range(op0, op1) * (ash ? 0.8 : 1), 8);
}
// the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 200, 0.36], [-60, H + 50, 520, H + 60, 150, 0.36], [W + 60, H + 50, 1080, H + 60, 150, 0.36]]) p.stroke({ brush: 'soft', color: '#04060e', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void mix;

p.save();
