// The terrace. At its far edge is a low wall of pale stone with a flat top, and piers that
// stand a little higher than the wall. The sun is beyond the wall, so the side of it that
// we see is in shade, and its top is bright. The floor is of great flat stones, warm in the
// sun, with the joints between them going away from us to one point.
'use strict';
const { studio, open, W, H, HORIZON, VP, wallTop, wallFoot, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, glint } = studio;

const p = open('terrace');
const r = p.rng;
const flat = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.15, cap: 'flat' };

// ---------------------------------------------------------------- the floor
// A place on the floor, measured on the floor itself: how far across, and how far away.
const across = (x, y) => (x - VP.x) / (y - HORIZON), away = (y) => 3000 / (y - HORIZON);
const stone = (x, y) => {
  const tone = nC(across(x, y) * 1.4 + 11, away(y) * 0.24);
  let c = mix(mix('#e4d2b2', '#f6ead0', tone), '#d6c2a2', smooth(0.6, 0.9, nA(x / 260, y / 120)) * 0.5);
  return mix(c, '#fff8e4', clamp((x - 500) / 1500, 0, 1) * 0.3);                               // more light toward the sun
};
const run = (x, y) => Math.atan2(440 - y, 5200 - x) + r.range(-0.015, 0.015);                  // the strokes lie the way the wall lies
p.fill({ inside: (x, y) => y > wallFoot(x) - 2, bounds: [0, 620, W, 800], width: 8, length: 90, spacing: 0.5, angle: run, color: stone, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.22, dry: 0.03, rag: 0.2 } });
p.fill({ inside: (x, y) => y > wallFoot(x) - 2, bounds: [0, 780, W, H], width: 13, length: 170, spacing: 0.5, angle: run, color: stone, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.22, dry: 0.03, rag: 0.2 } });
// The joints between the stones: those that go away from us, to one point, and those that lie the way the wall lies. Each has a thread of light beside it.
const joint = (pts) => { p.tryStroke({ color: '#a08c74', width: 4, opacity: 0.55, points: pts }); p.tryStroke({ color: '#fff6e0', width: 4, opacity: 0.35, points: pts.map(([x, y]) => [x + 2.5, y + 2.5]) }); };
for (let k = -9; k <= 9; k++) {
  const u = (k + 0.3) / 3.1 * 2.2, x0 = VP.x + u * (wallFoot(VP.x) - HORIZON), x1 = VP.x + u * (H - HORIZON);
  if (x1 < -400 || x1 > W + 400) continue;
  const y0 = wallFoot(clamp(x0, 0, W)) + 4, xa = VP.x + u * (y0 - HORIZON);
  joint([[xa, y0], [(xa + x1) / 2, (y0 + H + 6) / 2], [x1, H + 6]]);
}
for (const y0 of [768, 844, 966]) joint([[-10, y0], [800, y0 + (440 - y0) * 800 / 5200], [W + 10, y0 + (440 - y0) * (W + 10) / 5200]]);

// ---------------------------------------------------------------- the wall
const shade = (x, y) => { const f = (y - wallTop(x)) / (wallFoot(x) - wallTop(x)); return mix(mix('#8f97b8', '#aaa8c0', nB(x / 70, y / 14)), '#cdbcae', smooth(0.5, 1, f) * 0.55); };   // the light of the floor comes up on the foot of it
const slant = Math.atan2(wallFoot(W) - wallFoot(0), W);
p.fill({ inside: (x, y) => y > wallTop(x) && y < wallFoot(x), bounds: [0, 540, W, 720], width: 12, length: 90, spacing: 0.5, angle: () => slant * 0.8 + r.range(-0.02, 0.02), color: shade, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.18, dry: 0.03, rag: 0.2 } });
for (let k = 1; k < 3; k++) {                                            // the courses of its stones
  const pts = []; for (let x = -10; x <= W + 10; x += 40) pts.push([x, wallTop(x) + (wallFoot(x) - wallTop(x)) * (k / 3 + 0.02)]);
  glint(p, pts, () => '#737a9c', { width: 4, dash: 90, gap: 14, opacity: 0.4, rng: r });
}
for (let x = 30; x < W; x += r.range(60, 110) * (1.2 - x / W * 0.5)) { const row = Math.floor(r() * 3), h = (wallFoot(x) - wallTop(x)) / 3; p.tryStroke({ color: '#737a9c', width: 4, opacity: 0.35, points: [[x, wallTop(x) + h * row + 3], [x + 1, wallTop(x) + h * (row + 1) - 1]] }); }
// its shade on the floor, at its foot
{ const pts = []; for (let x = -20; x <= W + 20; x += 60) pts.push([x, wallFoot(x) + 6]); p.stroke({ brush: 'soft', color: '#8f8ca8', width: 22, opacity: 0.5, points: pts }); }
// its top: a flat course of stone that stands out a little past the wall. It is in the sun.
{
  const top = [], lip = []; for (let x = -20; x <= W + 20; x += 40) { top.push([x, wallTop(x) - 5]); lip.push([x, wallTop(x) + 4]); }
  p.stroke({ ...flat, color: '#6f7696', width: 7, opacity: 0.7, points: lip });
  p.stroke({ ...flat, color: '#fff7e2', width: 13, points: top });
  glint(p, top.map(([x, y]) => [x, y - 5]), () => '#ffffff', { width: 4, dash: 120, gap: 30, opacity: 0.8, rng: r });
}
// the piers: nearer and bigger at the left, further and smaller at the right
for (const [x, s] of [[70, 1.3], [450, 1.12], [760, 0.98], [1010, 0.88], [1220, 0.8], [1400, 0.73], [1550, 0.67]]) {
  const top = wallTop(x) - 44 * s, foot = wallFoot(x) + 2, w = 44 * s;
  p.stroke({ ...flat, color: shade(x, (top + foot) / 2), width: w, points: [[x, foot], [x, top]] });
  p.stroke({ ...flat, color: '#f6ead2', width: Math.max(4.8, w * 0.2), points: [[x + w * 0.4, foot], [x + w * 0.4, top]] });                 // the side of it that is toward the sun
  p.stroke({ ...flat, color: '#767c9e', width: 5, opacity: 0.6, points: [[x - w * 0.62, top + 5], [x + w * 0.62, top + 5]] });                 // the shade under its cap
  p.stroke({ ...flat, color: '#fff7e2', width: Math.max(8, 11 * s), points: [[x - w * 0.66, top - 3], [x + w * 0.66, top - 3]] });             // its cap
  p.stroke({ brush: 'soft', color: '#8f8ca8', width: Math.max(8.2, 16 * s), opacity: 0.45, points: [[x - w * 0.7, foot + 5], [x + w * 0.5, foot + 7]] });
}

p.save();
