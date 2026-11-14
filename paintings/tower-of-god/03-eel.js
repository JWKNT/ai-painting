// The White Steel Eel and the ball. The eel goes across the whole space in one long bend,
// from its head, low at the left, up over the middle and away out of the picture at the
// upper right. It is white, with patches of red on it, as a carp has; its head is black,
// long and pointed; thin red fins like ribbons trail from it. The green light is under
// it, so its under side is bright and its back is in green shade. The ball hangs in the
// shinsu under the bend of it: a great black ball.
'use strict';
const { studio, open, EEL, BALL, LIGHT, nA, nB } = require('./scene');
const { mix, clamp, smooth, solid, shape, glow, orb } = studio;

const p = open('eel');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.02, rag: 0.12, cap: 'round' };
// A place on its middle line, and the way that the line goes there: t is 0 at its head and 1 at the end of its tail.
function along(t) {
  const n = EEL.length - 1, f = clamp(t, 0, 0.9999) * n, i = Math.floor(f), u = f - i, a = EEL[Math.max(0, i - 1)], b = EEL[i], c = EEL[i + 1], d = EEL[Math.min(n, i + 2)];
  const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u);
  const dr = (k) => 0.5 * ((-a[k] + c[k]) + 2 * (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u + 3 * (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u);
  return { x: cr(0), y: cr(1), rad: cr(2), way: Math.atan2(dr(1), dr(0)) };
}
const off = (q, v) => [q.x - Math.sin(q.way) * v, q.y + Math.cos(q.way) * v];        // a place beside the line: v more than 0 is its under side

// ---------------------------------------------------------------- its fins: long thin ribbons, red, that trail behind the head and along its back
function ribbon(t0, side, len, wide, bend) {
  const q = along(t0), [x0, y0] = off(q, side * q.rad * 0.7), a = q.way + side * 0.5, pts = [];
  for (let i = 0; i <= 8; i++) { const s = i / 8; pts.push([x0 + Math.cos(a + bend * s) * len * s, y0 + Math.sin(a + bend * s) * len * s + 14 * Math.sin(s * 5)]); }
  p.tryStroke({ ...line, color: mix('#a81c24', '#e8483c', r()), width: wide, opacity: 0.9, taper: [0.1, 0.9], points: pts });
  p.tryStroke({ brush: 'round', color: '#ffc8b8', width: 4, opacity: 0.6, taper: [0.2, 0.8], points: pts.slice(1, 7).map(([x, y]) => [x, y + wide * 0.3]) });
}
ribbon(0.07, 1, 250, 16, 0.5); ribbon(0.09, 1, 180, 12, 0.9); ribbon(0.08, -1, 220, 14, -0.4); ribbon(0.3, -1, 170, 12, -0.5); ribbon(0.5, -1, 150, 11, -0.4); ribbon(0.66, 1, 130, 10, 0.6);

// ---------------------------------------------------------------- its body
const chain = []; for (let i = 0; i <= 44; i++) { const q = along(0.05 + 0.95 * i / 44); chain.push([q.x, q.y, q.rad]); }
solid(p, chain, { shadow: '#2c6c48', half: '#a8d8b0', lit: '#f6fff0', rim: '#ffffff', bounce: '#5ca470' }, { light: { at: [LIGHT.x, LIGHT.y + 200] }, turn: -0.1, width: 7, length: 34, vary: 0.05, dash: 40, gap: 8, edgeOpacity: 0.9 });
// the red on it: patches, as on a carp. Each is some strokes that lie along the body.
for (let k = 0; k < 1100; k++) {
  const t = r.range(0.07, 0.97), q = along(t), v = r.range(-0.8, 0.8) * q.rad;
  if (nA(t * 7, v / 90 + 3) + 0.25 * nB(t * 40, v / 20) < 0.66) continue;
  const w = clamp(q.rad * r.range(0.24, 0.44), 5, 20), [x, y] = off(q, v), l = Math.max(w * 2.1, r.range(16, 36)), shade = v < 0 ? 0.5 : 0;
  p.tryStroke({ ...line, color: mix(mix('#c8242c', '#e84838', r()), '#3c2428', shade), width: w, opacity: 0.92, points: [[x - Math.cos(q.way) * l / 2, y - Math.sin(q.way) * l / 2], [x + Math.cos(q.way) * l / 2, y + Math.sin(q.way) * l / 2]] });
}
// the lines between the plates of its hide, across it
for (let i = 3; i < 60; i++) { const q = along(0.08 + 0.9 * i / 60); if (q.rad < 14) continue; p.tryStroke({ brush: 'round', color: '#3c7c58', width: 4, opacity: 0.4, points: [off(q, -q.rad * 0.8), off(along(0.08 + 0.9 * i / 60 + 0.004), 0), off(q, q.rad * 0.8)] }); }
// the bright under side of it, where the light of the shinsu is strongest
{ const pts = []; for (let i = 0; i <= 30; i++) { const q = along(0.08 + 0.7 * i / 30); pts.push(off(q, q.rad * 0.8)); } studio.glint(p, pts, () => mix('#e8ffd0', '#ffffff', r()), { width: 5.5, dash: 60, gap: 14, opacity: 0.8, rng: r }); }

// ---------------------------------------------------------------- its head: black, long, with a pointed snout
{
  const q = along(0.0), h = (u, v) => [q.x - Math.cos(q.way) * u - Math.sin(q.way) * v, q.y - Math.sin(q.way) * u + Math.cos(q.way) * v];   // u: forward from the back of its head; v: toward its under side
  const dark = { shadow: '#020403', half: '#0a100c', lit: '#24382c', rim: '#a8e890', bounce: '#0c1c12' };
  shape(p, [h(-50, -48), h(10, -50), h(70, -38), h(130, -18), h(176, 4), h(132, 14), h(70, 12), h(10, 8), h(-50, 2)], dark, { light: { at: [LIGHT.x, LIGHT.y + 100] }, turn: 0.3, width: 6, length: 26, round: 22, flow: () => q.way + Math.PI, dash: 30, gap: 10, edgeOpacity: 0.6 });                // its upper jaw and the top of its head
  shape(p, [h(-50, 4), h(10, 10), h(70, 18), h(128, 24), h(156, 30), h(112, 40), h(40, 46), h(-50, 46)], dark, { light: { at: [LIGHT.x, LIGHT.y + 100] }, turn: 0.1, width: 6, length: 26, round: 16, flow: () => q.way + Math.PI, dash: 30, gap: 8, edgeOpacity: 0.8 });   // its lower jaw, which hangs a little open
  for (let u = 40; u < 150; u += 14) { const top = 9 + (u > 70 ? (u - 70) * 0.06 : 0), len = 12.6; p.tryStroke({ brush: 'round', color: '#e8f8d8', width: 4, opacity: 0.9, points: [h(u, top), h(u - 3, top + len)] }); }   // its teeth: thin and close, like the teeth of a comb
  glow(p, ...h(46, -22), 20, '#ff2c1c', 0.16, 4);
  p.tryStroke({ brush: 'round', color: '#ff5c3c', width: 5, points: [h(38, -22), h(52, -20)] });                                                            // its eye: small, red
  for (const [u0, v0, len] of [[-30, -52, 70], [0, -54, 56], [30, -50, 44]]) p.tryStroke({ ...line, color: '#e8f4e0', width: 6, taper: [0, 0.9], points: [h(u0, v0 + 6), h(u0 - len * 0.5, v0 - len * 0.5), h(u0 - len, v0 - len * 0.7)] });   // white spines that stand back from the top of its head
}

// ---------------------------------------------------------------- the ball
glow(p, BALL.x, BALL.y, BALL.r * 2.2, '#041008', 0.12, 4);
orb(p, [[BALL.x, BALL.y, BALL.r]], (x, y) => { const k = clamp(((x - BALL.x) * (LIGHT.x - BALL.x) + (y - BALL.y) * (LIGHT.y - BALL.y)) / (BALL.r * Math.hypot(LIGHT.x - BALL.x, LIGHT.y - BALL.y)), -1, 1); return k > 0.55 ? mix('#0a120c', '#6cb460', (k - 0.55) / 0.45) : '#050806'; }, { width: 6.5, reach: 30 });
p.tryStroke({ brush: 'round', color: '#d8ffc0', width: 4, opacity: 0.8, points: studio.arc(BALL.x, BALL.y, BALL.r - 2, 1.5, 2.6, 7) });

p.save();
