// Shared layout, palette and brush habits for the Golden Idol painting.
//
// The scene: the island cliff at dusk, 1742. Albert Cloudsley has just pushed Oberon Geller
// over the edge. Oberon hangs in the air against the low sun, his hat and his papers flying.
// Behind them is their camp: a tent, crates, tools. Close to us, on a crate, stands the
// golden idol, glowing. Far below, the sea and their ship.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUN = { x: 1168, y: 508, r: 78 };
const SEA = 592;                                  // the horizon
const EDGE = { x: 912, y: 700 };                  // the lip of the cliff
const IDOL = { x: 318, y: 826, h: 124 };          // where it stands (on a crate close to us), and its height

const nA = noise2(411), nB = noise2(522), nC = noise2(633);

// Dusk: indigo overhead, violet, then orange and gold down at the sea.
const skyRamp = grad([[0, '#121a3c'], [0.22, '#27295c'], [0.44, '#553978'], [0.62, '#9a476f'], [0.78, '#dd6b4b'], [0.9, '#f59d4e'], [1, '#ffcf78']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / SEA + (nA(x / 420, y / 160) - 0.5) * 0.07, 0, 1));
  const d = Math.hypot(x - SUN.x, (y - SUN.y) * 1.3);
  c = mix(c, '#ffe2a0', 0.7 * Math.exp(-Math.pow(d / 250, 2)));
  return mix(c, '#f7a45a', 0.25 * Math.exp(-Math.pow(d / 620, 2)));
}

// The top of the cliff, from the left edge of the picture to its lip, and the face that
// drops from the lip to the sea.
const topLine = through([[0, 706], [220, 698], [480, 690], [700, 688], [860, 692], [EDGE.x, EDGE.y]]);
const cliffTop = (x) => topLine(x) + 4 * (nB(x / 30, 8) - 0.5);
// From the lip the edge of the cliff runs toward us, down the picture. Left of it is ground;
// right of it the rock face shows, wider the nearer it is, and beyond that the drop.
const edgeLine = through([[700, 912], [760, 908], [830, 902], [910, 886], [1000, 858]]);
const edgeX = (y) => edgeLine(y) + 6 * (nB(y / 40, 3) - 0.5);
const faceLine = through([[700, 920], [760, 952], [840, 990], [920, 1024], [1000, 1052]]);
const faceX = (y) => faceLine(y) + 12 * (nB(y / 46, 13) - 0.5) + 7 * (nC(y / 15, 1) - 0.5);
const onCliff = (x, y) => y > cliffTop(Math.min(x, EDGE.x)) && (y <= EDGE.y ? x <= EDGE.x : x < faceX(y));

// Offset a path sideways by d (to its left for d > 0), for edges and outlines.
function beside(pts, d) {
  return pts.map(([x, y], i) => {
    const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
    const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
    return [x + dy / l * d, y - dx / l * d];
  });
}
// A straight mark from a to b. If it is too short for its brush, it is lengthened about its
// middle until it travels far enough.
function dash(p, a, b, w, color, o = {}) {
  const need = Math.max(12, 2 * w) + 0.4, len = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1;
  if (len < need) {
    const k = need / len / 2, mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    a = [mx - dx * k, my - dy * k]; b = [mx + dx * k, my + dy * k];
  }
  return p.stroke({ color, width: w, ...o, points: [a, b] });
}
// A filled round spot: a ring, then a mark across its middle (two for a small brush, whose
// ring has to be wider than the brush to travel far enough).
function spot(p, x, y, w, color, o = {}) {
  const rad = Math.max(w + 0.2, 6.1), pts = [];
  for (let k = 0; k <= 10; k++) pts.push([x + Math.cos(k / 10 * 6.283) * rad, y + Math.sin(k / 10 * 6.283) * rad]);
  p.stroke({ color, width: w, ...o, points: pts });
  const reach = Math.max(6.2, w + 0.2);
  p.line(x - reach, y, x + reach, y, { color, width: w, ...o });
  if (rad - w / 2 > w / 2 + 0.5) p.line(x, y - reach, x, y + reach, { color, width: w, ...o });
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

// The sun, as a light for the forms in front of it.
const SUNLIGHT = { at: [SUN.x, SUN.y] };

module.exports = { studio, open, W, H, SUN, SUNLIGHT, SEA, EDGE, IDOL, nA, nB, nC, skyColor, cliffTop, edgeX, faceX, onCliff, beside, dash, spot };
