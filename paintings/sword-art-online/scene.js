// Shared layout, palette and brush habits for the Sword Art Online painting.
//
// The scene: the end of the death game. The floating castle Aincrad, a hundred floors of
// stone and iron, is breaking apart at sunset above a sea of clouds. Its lowest floors have
// already come away and are falling. Kirito and Asuna sit side by side on a floor of glass
// high in the sky and watch it go. The sun is low behind the castle, so everything near us
// is dark with bright edges, and the castle stands against the light.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const SUN = { x: 1010, y: 604, r: 44 };
const SUNLIGHT = { at: [SUN.x, SUN.y] };
const HORIZON = 640;                       // where the sea of clouds ends against the sky
const AX = 760;                            // the axis of the castle
const TOP = 88, RIM = 478;                 // the foot of the palace at its tip, and its widest floor
const KIRITO = { x: 400, y: 904 }, ASUNA = { x: 457, y: 906 };   // where they sit

const nA = noise2(41), nB = noise2(52), nC = noise2(63);

// How strongly the sun's glow reaches a place: 1 at the sun, 0 far from it.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.2) / reach, 2));
const toSun = (x, y) => { const dx = SUN.x - x, dy = SUN.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };

// Sky: night blue overhead, then violet, rose and orange down to the clouds, and the sun's
// own light spreading through all of it.
const skyRamp = grad([[0, '#172055'], [0.2, '#2b3777'], [0.4, '#564790'], [0.56, '#975795'], [0.7, '#d5677a'], [0.82, '#f2895a'], [0.92, '#fbb25a'], [1, '#ffd88a']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.09, 0, 1));
  c = mix(c, '#ff9648', 0.5 * glow(x, y, 560));
  return mix(c, '#fff0b4', 0.9 * glow(x, y, 190));
}
// The way the sky's strokes run: level far from the sun, curling round it close by.
function skyFlow(x, y) {
  const k = glow(x, y, 520);
  let a = Math.atan2(x - SUN.x, -1.5 * (y - SUN.y));
  if (a > Math.PI / 2) a -= Math.PI; else if (a < -Math.PI / 2) a += Math.PI;   // a stroke has no heading, only a slant
  return a * k + (nB(x / 300, y / 160) - 0.5) * 0.5 * (1 - k);
}

// The castle: a cone of floors, each a little smaller than the one below. `half(y)` is half
// its width at a height; FLOORS are the lines between its floors, from the top down.
const half = (y) => 18 + 216 * Math.pow(clamp((y - TOP) / (RIM - TOP), 0, 1), 0.62);
const FLOORS = [];
for (let y = TOP, i = 0; y < RIM - 5; i++) { FLOORS.push(y); y += i % 5 === 4 ? 14.5 : 12.4; }
FLOORS.push(RIM);
// Each floor sags a little toward its edges, the way a ring seen from below does.
const sag = (y) => 0.06 * half(y) * (HORIZON - y) / 540;
const ring = (y, x) => y + sag(y) * Math.pow((x - AX) / half(y), 2);

// Where the castle has broken: everything below this ragged line has come away.
const bite = (x, c, w) => Math.exp(-Math.pow((x - c) / w, 2));
const breakLine = (x) => 430 + 26 * (nB(x / 70, 3) - 0.5) - 48 * bite(x, 636, 54) - 38 * bite(x, 884, 46) + 36 * bite(x, 768, 52) + 14 * Math.abs(Math.sin(x / 9.5 + nC(x / 40, 2) * 6)) - 7;

// The color of its stone and iron at a place. We see its shaded side: violet and blue, a
// little of the sky's light on its left, the sun coming round its right edge, and all of it
// paler where the glare of the sun lies in front of it.
function stone(x, y) {
  const yy = Math.min(y, RIM), u = clamp((x - AX) / half(yy), -1.15, 1.15);
  let i = 0;
  while (i < FLOORS.length - 2 && FLOORS[i + 1] <= yy) i++;
  const f = clamp((yy - FLOORS[i]) / (FLOORS[i + 1] - FLOORS[i]), 0, 1);
  let c = mix(i % 2 ? '#24204f' : '#1b1840', '#322e64', nA(x / 30, y / 12) * 0.55);
  c = mix(c, '#151238', smooth(0.35, 0, f) * 0.35);                                 // the shadow under each ledge
  c = mix(c, '#4a4a8c', smooth(0.4, 1, -u) * 0.45);                                 // sky light on the far side
  c = mix(c, '#a85c7c', smooth(0.3, 0.8, u) * 0.5);                                 // the sun coming round
  c = mix(c, '#ffa868', smooth(0.74, 1, u) * 0.75);
  c = mix(c, '#c46c78', smooth(250, 470, yy) * smooth(-0.3, 0.9, u) * 0.3);        // and up from below on its lower floors
  const haze = clamp(0.1 + 0.6 * glow(x, y, 300) + 0.2 * smooth(250, 520, y), 0, 0.85);
  return mix(c, skyColor(x, y), haze * 0.75);
}

// The far edge of the glass floor, across the foot of the picture.
const floorEdge = (x) => 872 + 18 * x / W;

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, SUN, SUNLIGHT, HORIZON, AX, TOP, RIM, KIRITO, ASUNA, nA, nB, nC, glow, toSun, skyColor, skyFlow, half, FLOORS, sag, ring, breakLine, stone, floorEdge };
