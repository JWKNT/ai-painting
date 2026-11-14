// Muramasa, in the shape of the spider. It hangs head down on its threads, with its back
// to us, in front of the moon. Its round body is above: crimson, in bands like the bowl of
// a helmet, with a small knob of gold at its top. Its fore part is below, smaller and
// darker, with two yellow eyes that look down at the man and two short fangs. Its eight
// legs go out from the fore part, four at each side. Each leg is plates of crimson with
// black joints and gold at the joints, and ends in a long point. The two fore legs come
// down toward the man. The fires light its under sides; the moon is a pale line on top.
'use strict';
const { studio, open, W, HEAD, BELLY, MOON, MAN, fire } = require('./scene');
const { mix, clamp, smooth, solid, orb, glow, glint, disc } = studio;

const p = open('spider');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.05, dry: 0, rag: 0.05, cap: 'round' };
const UP = [0, 1];                                                         // the fires are below it: the light on its plates comes from under
const steel = { shadow: '#1c040a', half: '#6c101c', lit: '#e84c34', bounce: '#3a1830' };
const dark = { shadow: '#050308', half: '#16101a', lit: '#5c2c30', bounce: '#1c1c34' };
const o = { light: UP, turn: 0.1, width: 5.5, length: 18, vary: 0.05, mix: 0.05, edge: false };
const cold = () => mix('#93a8e0', '#eef2ff', r());

// ---------------------------------------------------------------- its threads: thin lines of steel from it out to the trees and up out of the picture. The moon is on them in pieces.
for (const [x, y] of [[-20, 250], [-20, 520], [W + 20, 230], [W + 20, 540], [520, -20], [1100, -20], [800, -20], [240, -20], [1380, -20]]) {
  const a = [HEAD.x + (x - HEAD.x) * 0.06, BELLY.y + (y - BELLY.y) * 0.06], pts = [a, [(a[0] + x) / 2, (a[1] + y) / 2 + 14], [x, y]];
  p.tryStroke({ brush: 'round', color: '#8c9cd0', width: 4, opacity: 0.5, points: pts });
  glint(p, pts, cold, { width: 4, dash: 60, gap: 140, opacity: 0.7, rng: r });
}

// ---------------------------------------------------------------- a leg: three lengths, each thinner than the last, with a joint between each two
function leg(pts) {                                                        // pts: where it leaves the body, its two joints, and its point
  const [a, b, c, d] = pts, radii = [[19, 15], [14, 10], [9, 3.2]];
  [[a, b], [b, c], [c, d]].forEach(([s, e], i) => {
    solid(p, [[s[0], s[1], radii[i][0]], [e[0], e[1], radii[i][1]]], steel, o);
    const n = Math.max(1, Math.round(Math.hypot(e[0] - s[0], e[1] - s[1]) / 30));                 // the plates of it: dark lines across
    for (let k = 1; k < n; k++) { const t = k / n, x = s[0] + (e[0] - s[0]) * t, y = s[1] + (e[1] - s[1]) * t, w = radii[i][0] + (radii[i][1] - radii[i][0]) * t, nx = -(e[1] - s[1]), ny = e[0] - s[0], l = Math.hypot(nx, ny); if (w * 2 >= 12.5) p.tryStroke({ brush: 'round', color: '#1c040a', width: 4, opacity: 0.6, points: [[x - nx / l * w, y - ny / l * w], [x + nx / l * w, y + ny / l * w]] }); }
    glint(p, [[s[0], s[1] - radii[i][0] + 2], [(s[0] + e[0]) / 2, (s[1] + e[1]) / 2 - (radii[i][0] + radii[i][1]) / 2 + 2], [e[0], e[1] - radii[i][1] + 2]].map(([x, y]) => [x, y]), cold, { width: 4, dash: 26, gap: 14, opacity: 0.6 * smooth(-0.4, 0.4, Math.abs(e[0] - s[0]) / (Math.hypot(e[0] - s[0], e[1] - s[1]) || 1)), rng: r });   // the moon along its upper side, where it lies level enough to have one
  });
  for (const [j, rad] of [[b, 13], [c, 9]]) { disc(p, j[0], j[1], Math.max(8, rad), '#0c0810', 6.2, { ...line, mix: 0 }); p.tryStroke({ brush: 'round', color: '#d8a43c', width: 4.4, opacity: 0.9, points: [[j[0] - 6.4, j[1] + rad * 0.5], [j[0] + 6.4, j[1] + rad * 0.5]] }); }   // the joints: black, with a touch of gold under
}
const at = (a, l, from = [HEAD.x, HEAD.y]) => [from[0] + Math.cos(a) * l, from[1] + Math.sin(a) * l];
// The eight legs: for each side, from the hind pair (which goes up beside the round body) to the fore pair (which comes down toward the man).
const LEGS = [[-1.25, 150, -1.0, 150, -0.5, 150], [-0.62, 170, -0.3, 160, 0.3, 150], [0.02, 170, 0.36, 150, 0.9, 140], [0.74, 130, 1.12, 120, 1.5, 150]];
for (const side of [-1, 1]) for (const [a1, l1, a2, l2, a3, l3] of LEGS) {
  const m = (a) => (side > 0 ? a : Math.PI - a), root = at(m(a1), 46), k1 = at(m(a1), l1 + 46), k2 = at(m(a2), l2, k1), tip = at(m(a3), l3, k2);
  leg([root, k1, k2, tip]);
}

// ---------------------------------------------------------------- its round body
{ const { x, y, r: R } = BELLY;
  for (const [w, op] of [[R * 2.4, 0.06], [R * 1.6, 0.08]]) glow(p, x, y + R * 0.4, w, '#ff5c2c', op, 5);
  orb(p, [[x, y, R]], (px, py) => { const v = (py - y) / R, u = (px - x) / R, f = fire(px, py + 300, 900), band = Math.sin(Math.atan2(u, Math.sqrt(Math.max(0.02, 1 - u * u - v * v * 0.3))) * 7) > 0.86 ? 0.5 : 0; let c = mix('#5c0c18', '#f0562e', smooth(-0.3, 1, v) * (0.6 + 0.4 * f)); c = mix(c, '#22040c', smooth(0.1, -1, v) * 0.7); c = mix(c, '#14040a', band); return mix(c, '#93a8e0', smooth(-0.8, -1, v) * 0.5); }, { width: 6.5, reach: R * 0.6, flow: (px, py) => Math.atan2(py - y, px - x) + Math.PI / 2 });
  // the bands of it: lines from its top to its foot, which bend with it
  for (const k of [-0.84, -0.5, 0, 0.5, 0.84]) { const pts = []; for (let i = 0; i <= 10; i++) { const v = -0.94 + 1.88 * i / 10; pts.push([x + k * R * Math.sqrt(Math.max(0, 1 - v * v)), y + v * R]); } p.tryStroke({ brush: 'round', color: '#22040c', width: 4.6, opacity: 0.7, points: pts }); p.tryStroke({ brush: 'round', color: '#ff8c58', width: 4, opacity: 0.4, points: pts.slice(6).map(([px, py]) => [px + 4, py]) }); }
  for (const v of [-0.4, 0.3]) { const pts = []; for (let i = 0; i <= 10; i++) { const u = -0.98 + 1.96 * i / 10, hw = Math.sqrt(1 - v * v); pts.push([x + u * hw * R, y + v * R + (1 - u * u) * R * 0.12]); } p.tryStroke({ brush: 'round', color: '#d8a43c', width: 4.6, opacity: 0.7, points: pts }); }   // two rings of gold round it
  p.tryStroke({ ...line, color: '#d8a43c', width: 12, points: [[x, y - R - 2], [x, y - R - 24]] }); p.tryStroke({ ...line, color: '#f8e08c', width: 16, points: [[x - 7, y - R - 26], [x + 7, y - R - 26]] });   // the knob at its top
  glint(p, studio.arc(x, y, R - 2, Math.PI * 1.15, Math.PI * 1.85, 10), cold, { width: 4.6, dash: 50, gap: 8, opacity: 0.8, rng: r }); }   // the moon on its top

// ---------------------------------------------------------------- the narrow part between, and its fore part with the eyes and the fangs
solid(p, [[BELLY.x, BELLY.y + BELLY.r - 10, 34], [HEAD.x, HEAD.y - HEAD.r + 10, 30]], dark, o);
{ const { x, y, r: R } = HEAD;
  orb(p, [[x, y, R], [x, y + R * 0.5, R * 0.8]], (px, py) => { const v = (py - y) / R; let c = mix('#3c0810', '#c83c28', smooth(-0.2, 1.2, v) * (0.5 + 0.5 * fire(px, py + 280, 900))); c = mix(c, '#12040a', smooth(0.2, -1, v) * 0.7); return c; }, { width: 6, reach: R * 0.6 });
  for (const s of [-1, 1]) { p.tryStroke({ ...line, color: '#0c0810', width: 12, taper: [0, 0.7], points: [[x + s * 20, y + R * 1.1], [x + s * 26, y + R * 1.5], [x + s * 12, y + R * 1.86]] }); p.tryStroke({ brush: 'round', color: '#ff8c58', width: 4, opacity: 0.6, taper: [0, 0.7], points: [[x + s * 23, y + R * 1.2], [x + s * 28, y + R * 1.5]] }); }   // the fangs
  p.tryStroke({ ...line, mix: 0, color: '#0a060c', width: 22, points: [[x - 34, y + R * 0.74], [x, y + R * 0.86], [x + 34, y + R * 0.74]] });     // the dark plate of its face
  for (const s of [-1, 1]) { const ex = x + s * 22, ey = y + R * 0.76; for (const [w, op] of [[40, 0.12], [20, 0.3]]) glow(p, ex, ey, w, '#ffc83c', op, 6); p.tryStroke({ ...line, mix: 0, color: '#fff0a0', width: 8, points: [[ex - 6.4, ey - s * 2], [ex + 6.4, ey + s * 2]] }); }   // its two eyes
  glint(p, studio.arc(x, y, R - 2, Math.PI * 1.2, Math.PI * 1.8, 8), cold, { width: 4.4, dash: 40, gap: 8, opacity: 0.7, rng: r }); }
void MOON; void MAN; void mix; void clamp;

p.save();
