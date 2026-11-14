// Shared layout, palette and brush habits for the Darling in the Franxx painting.
//
// The scene: sunset over Plantation 13. People live in moving cities, each under one vast
// low dome of pale steel, three kilometres wide, with a small dome of glass on its top:
// the Birdcage, where the children live who fight for it. The land outside is red and
// dead. Out of it come the klaxosaurs: black, with lines that shine blue. Here the sun has
// just gone down at the right. The Plantation stands at the left, far off and huge, with
// the last light on its upper part. Beside it a klaxosaur of the greatest kind has come
// up out of the ground: a black wedge like the bow of a ship, as high as a mountain, with
// rock on its back and the sun behind it. Round its foot is the dust that it threw up,
// and in the shade in front of it the small klaxosaurs come on across the plain, so many
// that we see them only as a tide of blue lights. The Franxx have gone out to meet them:
// we see each only as a line of light, and the red one, Strelizia, strikes the great one
// at its point. No one is in the picture.
//
// The light. The sun is down for the ground, so the plain is in the shade of the evening:
// plum and violet, and a little warm on what is turned to the right, where the sky is
// bright. What is high is still in the sun: the clouds, the upper part of the dome, the
// tops of the dust and the rock on the back of the great one are rose and gold. The great
// one itself is between us and the sun, so it is dark, and the far air makes its dark a
// blue-violet, not a black. The other lights are the blue of the klaxosaurs, the lamps
// of the Plantation and the lines of the Franxx.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, rng } = studio;

const W = 1600, H = 1000;
const HORIZON = 566;
const SUN = { x: 1262, y: 574 };                        // where the sun went down
const SUNWARD = [0.86, 0.36];                           // toward that light, for a thing high in the air: it comes from the right and from below
const DOME = { x: 396, base: 574, rx: 330, ry: 236 };   // the Plantation: the middle of its foot, half its width, its height
const CAGE = { rx: 88, ry: 56 };                        // the glass dome on its top

const nA = noise2(1301), nB = noise2(1307), nC = noise2(1319), nD = noise2(1321);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// How much of the last light is in the air at a place.
const glare = (x, y, reach) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.25) / reach, 2));
// The sky: deep blue-green overhead, then a clear pale green, then gold and rose at the edge of the world; more rose and
// less gold far to the left, away from where the sun went down.
const warmSky = grad([[0, '#12304e'], [0.3, '#1f5c78'], [0.56, '#57a59c'], [0.74, '#cfc58c'], [0.88, '#f6b866'], [1, '#ffd89a']]);
const coolSky = grad([[0, '#12304e'], [0.3, '#1f5874'], [0.56, '#4c8e96'], [0.76, '#9c98a4'], [0.9, '#c8888c'], [1, '#d8947c']]);
function skyColor(x, y) {
  const t = clamp(y / HORIZON + (nA(x / 440, y / 240) - 0.5) * 0.05, 0, 1), k = Math.exp(-Math.pow((x - SUN.x) / 620, 2));
  let c = mix(coolSky(t), warmSky(t), k);
  c = mix(c, '#ffd27c', 0.55 * glare(x, y, 420));
  return mix(c, '#fff6d8', 0.85 * glare(x, y, 150));
}
// What the dust and the distance do to a thing: d is 0 close to us and 1 very far off. Far things take the color of the sky behind them.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 6)), clamp(d, 0, 1) * 0.88);
// The top line of the main dome at an x, and whether a place is inside the dome.
const domeTop = (x) => { const u = Math.abs(x - DOME.x) / DOME.rx; return u >= 1 ? DOME.base : DOME.base - DOME.ry * Math.pow(1 - Math.pow(u, 2.3), 0.58); };
// A place on the skin of the main dome: phi is the angle about its upright middle line (0 is the part that faces us, a quarter
// turn to the right is its right edge) and v its height (0 at its foot, 1 at its top). We look at it from a little below its
// top, so a line round it is lower in the middle, where it is nearer to us.
const SAG = 13;
const domeW = (v) => Math.pow(1 - Math.pow(clamp(v, 0, 1), 1 / 0.58), 1 / 2.3);
const domeAt = (phi, v) => [DOME.x + DOME.rx * domeW(v) * Math.sin(phi), DOME.base - DOME.ry * v + SAG * Math.cos(phi) * (1 - v)];
const domeBack = (x, y) => { const v = clamp((DOME.base - y) / DOME.ry, 0, 0.999), w = DOME.rx * domeW(v) || 1; return { v, phi: Math.asin(clamp((x - DOME.x) / w, -1, 1)) }; };
// The heaped clouds: each is a heap of round tops on a level floor, made the same way each time.
function heap(seed, x0, x1, floor, big, tall) {
  const r = rng(seed), puffs = [];
  for (let x = x0; x < x1; x += big * 0.45) {
    const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.8), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump);
    puffs.push([x + r.range(-12, 12), floor - rad * 0.7 - big * tall * hump * r.range(0.15, 1), rad]);
    puffs.push([x + r.range(-20, 20), floor - rad * 0.6 - big * tall * hump * r.range(0, 0.5), rad * r.range(0.8, 1.1)]);
  }
  return puffs.filter((q) => q[2] > 10);
}

// One eye for the ground: it is 40 metres above the plain, on a rise of rock. The foot of the dome is 8 kilometres off.
const cam = studio.camera({ hz: HORIZON, vx: 800, f: 1600, eye: 40.6 });
// How far off a place of the plain is, in metres, from where it is in the picture.
const away = (y) => cam.f * cam.eye / Math.max(0.5, y - HORIZON);

// The great klaxosaur. Its point is high at the left; its top line goes back from the point to the right and a little down,
// and carries rock; its front line goes from the point down and back to the ground.
const TIP = [884, 236];
const CORE = [932, 266];                                // its blue light, a little behind its point: here Strelizia strikes
const FOOT = 580;                                       // the ground at its foot
const deck0 = (x) => TIP[1] + (x - TIP[0]) * 0.15 + 26 * Math.pow(clamp((x - TIP[0]) / 716, 0, 1), 2);
const crag = (x) => smooth(950, 1050, x) * (7 + 30 * Math.pow(nB(x / 74, 3.3), 1.4) + 13 * nC(x / 23, 5.1) + 6 * nD(x / 9, 1.7));
const deckTop = (x) => deck0(x) - crag(x);              // its top line with the rock on it
const stemX = (y) => TIP[0] + 196 * Math.pow(clamp((y - TIP[1]) / (FOOT - TIP[1]), 0, 1), 0.92);
const inWedge = (x, y) => x >= TIP[0] && y > deckTop(x) && x > stemX(y) && y < FOOT + 34;
// A place on its side: s is how far back from the point, along its top line, and d how far below that line.
const hullAt = (s, d) => [TIP[0] + s, deck0(TIP[0] + s) + d];

// The horde: the x of its front at a row of the picture. It is far off at the left and nearer to us at the right.
const front = (y) => 724 + (y - 586) * 2.5;

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, SUN, SUNWARD, DOME, CAGE, cam, away, TIP, CORE, FOOT, deck0, deckTop, stemX, inWedge, hullAt, front, nA, nB, nC, nD, hash, glare, skyColor, far, domeTop, domeW, domeAt, domeBack, heap };
