// Shared layout, palette and brush habits for the Baldr Sky painting.
//
// The scene: the dive. In Baldr Sky people fight in the virtual world, in machines that are
// called simulacrums, against each other and against viruses, which are machines with no
// one in them. Kou's simulacrum is Kagerou: white armour, a blue head, blue bands. Here it
// goes down a great shaft of the virtual world, head first, with its back to us and its
// thrusters lit. The wall of the shaft is steel, in rings, with a net of six-sided lines of
// light on it. Far down is the bright place that the shaft leads to, and out of it a swarm
// of viruses comes up. Kagerou has a blade in one hand and fires with the other.
//
// We look straight down the shaft, so everything runs to one point: the bright place. A
// thing on the wall at the distance r from that point in the picture is so much nearer to
// us as r is greater. The light is the bright place itself, and the fire of the thrusters.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const VP = { x: 590, y: 530 };            // the bright place far down: everything runs to it
// Kagerou: P(u, v) is a place on it. u goes along it from its feet (0), which are near us, to its head (1); v goes across it
// (more than 0 is its right side, which is the upper side in the picture). It is smaller toward its head, which is further off.
const KAGE = { bx: 1300, by: 668, len: 470 };
const KA = (() => { const dx = VP.x - KAGE.bx, dy = VP.y - 40 - KAGE.by, l = Math.hypot(dx, dy); return { ax: dx / l, ay: dy / l }; })();
const kScale = (u) => 1 - 0.36 * u;
const K = (u, v) => [KAGE.bx + KA.ax * KAGE.len * u - KA.ay * v * kScale(u), KAGE.by + KA.ay * KAGE.len * u + KA.ax * v * kScale(u)];

const nA = noise2(4101), nB = noise2(4111), nC = noise2(4127);
const polar = (x, y) => ({ r: Math.hypot(x - VP.x, y - VP.y), th: Math.atan2(y - VP.y, x - VP.x) });
const toVP = (x, y) => Math.atan2(y - VP.y, x - VP.x);                     // the way of a line through a place that runs to the bright place
// The rings of the shaft: each is at a distance from the point, and each is so much wider as it is nearer to us.
const RINGS = [64, 104, 170, 278, 455, 745, 1220];
const onRing = (r) => RINGS.some((q) => r > q * 0.95 && r < q * 1.05);
const hash = (a, b) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The light of the bright place in the air of the shaft.
const core = (r, reach) => Math.exp(-Math.pow(r / reach, 2));
// The wall of the shaft at a place of the picture: plates of steel, each with its own tone; some of them are windows with green
// or blue light in them. The air of the shaft makes the far part pale and blue.
function wall(x, y) {
  const { r, th } = polar(x, y), u = Math.log(Math.max(8, r) / 20), cu = Math.floor(u * 7), n = 60, ct = Math.floor((th / (Math.PI * 2) + 0.5) * n + (cu % 2) * 0.5), h = hash(cu, ct), h2 = hash(ct, cu + 9);
  let c = mix('#0c1422', '#28384e', h * 0.8 + nA(x / 200, y / 200) * 0.2);
  if (h2 > 0.9) c = mix(c, h > 0.5 ? '#38c894' : '#3ca8e0', 0.6);            // a window with light in it
  else if (h2 < 0.012) c = mix(c, '#f08c2c', 0.7);                          // a lamp of warning
  c = mix(c, '#06080e', smooth(700, 1250, r) * 0.6);                        // near us the wall goes by in the dark
  c = mix(c, '#5c9cd8', core(r, 330) * 0.6);
  return mix(c, '#e4f6ff', core(r, 110) * 0.95);
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, VP, KAGE, K, kScale, nA, nB, nC, polar, toVP, RINGS, onRing, hash, core, wall };
