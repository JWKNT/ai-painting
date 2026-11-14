// Shared layout, palette and brush habits for the Undertale painting.
//
// The scene: the last corridor. At the end of the land of the monsters, before the room
// of the king, is a long hall of gold: tall pointed windows, pillars, a floor of orange
// squares. In each window is the sign of the kingdom, a ring with wings. Here Sans waits.
// He is a short skeleton in a blue jacket and pink slippers, with a grin that does not
// change, and he is the one who judges what you did. If you did the worst, he fights.
// Then one of his eyes burns blue, and the things that he calls come out of the air:
// great skulls like the skulls of dragons, with horns and split jaws. They open their
// jaws and each fires a beam of white light as wide as itself. Rows of bones come up from
// the floor. And you are only a small red heart, which must not be touched.
//
// The light. It comes through the windows behind everything, and it is gold. So the wall
// and the floor are gold and orange, and each window lays a long bright shape of itself
// on the floor toward us. The skulls, the bones and Sans have the light behind them: they
// are a pale violet grey, with a bright edge. The beam is the one pure white. The heart
// is the one red.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, clamp, smooth } = studio;

const W = 1600, H = 1000;
const BASE = 640;                                        // where the wall meets the floor
const VP = { x: 800, y: 420 };                           // the point that the lines of the floor go to: our eye is as high as the middle of a window
const F = 1200;                                          // how far our eye is from the picture, in its own measure
const STEP = 100;                                        // the side of one square of the floor, as it is at the wall
const WINDOWS = [330, 800, 1270];                        // the middle of each window
const WIN = { half: 150, sill: 548, spring: 300, c: 69.2, R: 219.2 };   // a pointed window: its arcs have their middles a little past the other side
const COLS = [565, 1035, 95, 1505];                      // the pillars of the wall, between the windows
const SANS = { x: 800, feet: 772 };
const HEART = { x: 672, y: 820 };                        // the red heart: in the light of the middle window, just clear of the beam
// Blasters: where each is, its size (half its height), the way that it points, how far its jaws are open, and if it fires.
const BLASTERS = [
  { x: 330, y: 250, s: 165, aim: [622, 1010], open: 0.55, fire: true },
  { x: 1290, y: 262, s: 150, aim: [672, 820], open: 0.42, fire: false },
];

const nA = noise2(2011), nB = noise2(2017), nC = noise2(2027), nD = noise2(2029);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };

// Is a place inside the shape of a window? dx is from the middle of the window; grow makes the shape bigger (for its frame).
function inArch(dx, y, grow = 0) {
  const a = Math.abs(dx);
  if (y > WIN.sill + grow) return false;
  if (y >= WIN.spring) return a <= WIN.half + grow;
  return Math.hypot(a + WIN.c, y - WIN.spring) <= WIN.R + grow;
}
const windowAt = (x, y, grow = 0) => { for (let i = 0; i < WINDOWS.length; i++) if (inArch(x - WINDOWS[i], y, grow)) return i; return -1; };

// The floor. A place on it has a depth t (1 at the wall, more toward us) and a place u along the wall.
const floorAt = (x, y) => { const t = (y - VP.y) / (BASE - VP.y); return { t, u: VP.x + (x - VP.x) / t }; };
const onFloor = (u, t) => [VP.x + (u - VP.x) * t, VP.y + (BASE - VP.y) * t];
// The rows of squares: the depth t of the line that is k squares out from the wall.
const rowT = (k) => 1 / (1 - STEP * k / F);
const rowOf = (t) => Math.floor((1 - 1 / t) * F / STEP);
// The bright shape that a window lays on the floor: 0 to 1. The light comes down toward us, so the top of a window lands
// furthest from the wall, and the shape on the floor is the window upside down.
function pool(x, y) {
  if (y <= BASE) return 0;
  const { t, u } = floorAt(x, y), yw = BASE - F * (1 - 1 / t) / 1.1;      // the height in the window that this place of the floor is lit from
  if (yw > WIN.sill) return 0;
  let best = 0;
  for (const cx of WINDOWS) { const dx = u - cx + (nB(x / 60, y / 30) - 0.5) * 5; if (inArch(dx, yw, -8)) best = 1; else if (inArch(dx, yw, 6)) best = Math.max(best, 0.5); }
  return best;
}
const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, BASE, VP, F, STEP, rowT, rowOf, WINDOWS, WIN, COLS, SANS, HEART, BLASTERS, nA, nB, nC, nD, hash, inArch, windowAt, floorAt, onFloor, pool, mix, clamp, smooth };
