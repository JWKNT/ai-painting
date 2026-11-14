// Shared layout, palette and brush habits for the Paper Mario painting.
//
// The scene: Boggly Woods, from Paper Mario: The Thousand-Year Door. It is a wood like no
// other: the sky is gold, the trees have black trunks like tall cones and heads of white
// leaves that glitter, the paths are white, and rows of small black bushes with pointed
// tops stand along them. Far off stands the Great Tree, as big as a hill, where the
// Punies live. Mario walks toward it on the white path with Koops beside him, and Punio,
// the small Puni who came to ask for help, goes in front. We see their backs.
//
// The light is the whole gold sky, brightest low down behind the Great Tree. So each
// thing is warm on its top and on the side that is toward that brightness, and blue-grey
// in its shade; the white leaves and the white path take both. The black trunks and
// bushes stay black, with a thin gold edge.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp } = studio;

const W = 1600, H = 1000;
const HORIZON = 560;
const cam = studio.camera({ hz: HORIZON, vx: 800, f: 1000, eye: 3 });
const away = (y) => cam.f * cam.eye / Math.max(0.5, y - HORIZON);          // how far off a place of the ground is, in metres
const TREE = { X: -31.5, Z: 150 };                                         // the Great Tree
const SUN = { x: 640, y: 470 };                                            // where the sky is brightest: low, behind the Great Tree
// The path: where its middle is across the ground at a distance, and half its width.
const pathX = (Z) => TREE.X * Math.pow(clamp(Z / TREE.Z, 0, 1), 1.35) + 4.2 * Math.sin(Z / 21 + 0.5) * Math.exp(-Z / 70) + 0.2;
const PATH_HALF = 2.3;
const onPath = (x, y) => { if (y <= HORIZON + 4) return -1; const Z = away(y), X = (x - cam.vx) * Z / cam.f; return 1 - Math.abs(X - pathX(Z)) / PATH_HALF; };   // above 0 on the path: 1 at its middle, 0 at its edge

// The trees of the wood: where each stands (X to the right, Z away, in metres), how high its trunk is, and how wide its head.
// None stands in front of the Great Tree.
const TREES = [
  { X: -6.6, Z: 9, h: 4.2, R: 2.0 }, { X: 6.2, Z: 8.5, h: 4.6, R: 2.5 },
  { X: -13, Z: 22, h: 4.4, R: 2.3 }, { X: 9, Z: 20, h: 4.2, R: 2.2 }, { X: 5.5, Z: 34, h: 4, R: 2.1 }, { X: -16, Z: 36, h: 4.2, R: 2.2 },
  { X: 14, Z: 48, h: 4, R: 2 }, { X: -28, Z: 60, h: 4, R: 2 }, { X: -34, Z: 50, h: 4.2, R: 2.1 }, { X: 20, Z: 70, h: 4, R: 2 }, { X: 30, Z: 80, h: 4.2, R: 2.2 },
  { X: -40, Z: 90, h: 4, R: 2 }, { X: 24, Z: 100, h: 4, R: 2 }, { X: 44, Z: 110, h: 4.4, R: 2.2 }, { X: -52, Z: 120, h: 4, R: 2 }, { X: 60, Z: 140, h: 4.2, R: 2.1 },
  { X: -60, Z: 100, h: 4.2, R: 2.1 }, { X: -50, Z: 70, h: 4, R: 2 }, { X: 36, Z: 56, h: 4.2, R: 2.2 }, { X: 22, Z: 40, h: 4.4, R: 2.3 },
];
// The shade of a thing lies on the ground this way: to the right, and toward us. The bright sky is far off at the left.
const SHADOW = [0.42, -0.9];
// How much of the shade of the trees is on a place of the ground: 0 to 1.
function shade(X, Z) {
  let s = 0;
  for (const t of TREES) {
    const dx = X - t.X, dz = Z - t.Z, along = dx * SHADOW[0] + dz * SHADOW[1], across = Math.abs(dx * SHADOW[1] - dz * SHADOW[0]);
    if (along < -0.3 || along > t.h * 1.3 + t.R * 2.4) continue;
    const L = t.h * 1.25;
    if (along < L) { const w = 0.5 * (1 - along / L) + 0.08; s = Math.max(s, (across < w * 0.6 ? 1 : across < w ? (w - across) / (w * 0.4) : 0)); }
    const q = Math.hypot((along - L - t.R * 0.5) * 0.75, across) / t.R; s = Math.max(s, q < 0.75 ? 1 : q < 1.1 ? (1.1 - q) / 0.35 : 0);
  }
  return s;
}

const nA = noise2(4401), nB = noise2(4409), nC = noise2(4421), nD = noise2(4423);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
const glare = (x, y, reach) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.2) / reach, 2));
// The sky: deep amber overhead, gold lower down, pale gold at the edge of the world, and nearly white where it is brightest.
const amber = grad([[0, '#8a4c0a'], [0.22, '#b87414'], [0.5, '#e09c20'], [0.76, '#f8c444'], [0.92, '#ffdc78'], [1, '#ffe8a0']]);
function skyColor(x, y) {
  const c = amber(clamp(y / HORIZON + (nA(x / 520, y / 260) - 0.5) * 0.06, 0, 1));
  return mix(mix(c, '#ffe69a', glare(x, y, 520) * 0.55), '#fff6d4', glare(x, y, 200) * 0.6);
}
// What the far gold air does to a thing: d is 0 near us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 4)), clamp(d, 0, 1) * 0.85);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, cam, away, TREE, SUN, pathX, PATH_HALF, onPath, TREES, SHADOW, shade, nA, nB, nC, nD, hash, glare, skyColor, far };
