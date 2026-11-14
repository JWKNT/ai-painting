// Shared layout, palette and brush habits for the Full Metal Daemon Muramasa painting.
//
// The scene: the duel in the sky. In this story the armour of a warrior is a living thing
// of steel, a tsurugi, and it flies. Two of them fight as two wheels that touch: each goes
// round its own circle, and where the circles touch they pass and strike. Here it is
// night, high over a sea of clouds, with the great moon up and the last red of the day at
// the edge of the world behind the mountain. Near us is Muramasa: crimson armour, tall
// horns of gold on its helmet, shoulder guards of dark plates with gold studs, a red drum
// of a thruster on its back with a fan of red blades round it, and a long sword held low,
// with lightning on it. Far off, across the moon, comes the Silver Star, which is only a
// silver light with a long trail. The trails of the two are the two wheels.
//
// Two lights work on everything: the moon, cold, from the upper left; and the afterglow,
// red, low at the right.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 646;                       // the far edge of the sea of clouds
const MOON = { x: 420, y: 250, r: 150 };
const MOONWARD = [-0.56, -0.83];           // toward the moon, from the middle of the picture
const FUJI = { x: 1356, top: 520, half: 290 };
const STAR = { x: 700, y: 318 };           // the Silver Star
// Muramasa: M(u, v) is a place on it. u goes along it from its hip toward its head; v goes from its belly to its back.
const HIP = { x: 1030, y: 622 }, AX = [-0.951, -0.309], NX = [0.309, -0.951];
const M = (u, v) => [HIP.x + AX[0] * u + NX[0] * v, HIP.y + AX[1] * u + NX[1] * v];
const ALONG = Math.atan2(AX[1], AX[0]);

const nA = noise2(5101), nB = noise2(5113), nC = noise2(5119);
const glowOf = (x, y, cx, cy, reach) => Math.exp(-Math.pow(Math.hypot(x - cx, y - cy) / reach, 2));
// The red of the last of the day: strongest low at the right.
const after = (x, y) => Math.exp(-Math.pow((x - 1560) / 760, 2)) * smooth(330, HORIZON, y);
// The sky: nearly black overhead, deep blue, then violet; red and orange at the edge of the world, at the right.
const cool = grad([[0, '#05051a'], [0.4, '#0e1244'], [0.75, '#2a2a70'], [1, '#5454a0']]);
const warm = grad([[0, '#05051a'], [0.4, '#141040'], [0.68, '#4c1e60'], [0.86, '#b43450'], [0.96, '#f07a3c'], [1, '#ffc468']]);
function skyColor(x, y) {
  const t = clamp(y / HORIZON + (nA(x / 420, y / 220) - 0.5) * 0.06, 0, 1);
  let c = mix(cool(t), warm(t), Math.exp(-Math.pow((x - 1560) / 760, 2)));
  c = mix(c, '#6c78c8', 0.5 * glowOf(x, y, MOON.x, MOON.y, 430));
  return mix(c, '#c4d0f8', 0.6 * glowOf(x, y, MOON.x, MOON.y, 230));
}
// The trails of the two: each is a line through some places. `spline(pts)(t)` is a place on it, with the way that it goes there.
function spline(pts) {
  const n = pts.length - 1;
  return (t) => {
    const f = clamp(t, 0, 0.9999) * n, i = Math.floor(f), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(n, i + 2)];
    const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u);
    return [cr(0), cr(1)];
  };
}
const STAR_TRAIL = spline([[1640, 330], [1500, 170], [1260, 70], [1000, 60], [820, 130], [730, 240], [STAR.x, STAR.y]]);            // from old to new
const RED_TRAIL = spline([[-60, 800], [260, 900], [640, 950], [1000, 930], [1280, 860], [1420, 760], [1380, 690], M(-250, 0), M(-150, 30)]);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, MOON, MOONWARD, FUJI, STAR, HIP, AX, NX, M, ALONG, nA, nB, nC, glowOf, after, skyColor, STAR_TRAIL, RED_TRAIL };
