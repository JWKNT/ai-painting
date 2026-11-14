// Shared layout, palette and brush habits for the Tower of God painting.
//
// The scene: the first test. At the foot of the Tower a boy, Bam, must break a ball. The
// ball hangs in a great space that is full of shinsu, which is like water and like light,
// behind a wall of iron bars as high as a cliff; and in that space lives the White Steel
// Eel, which is as long as a street: white, with red on it like a carp, with a black head
// and long thin fins. We stand far back on the stone floor. The shinsu is green and gives
// all the light there is, brightest low down; the bars are black against it, and each
// throws its shade along the floor toward us. The boy is one small dark shape in front of
// the bars, with the Black March in his hand: a black needle as long as his arm.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const FLOOR = 694;                          // where the bars meet the floor
const LIGHT = { x: 800, y: 650 };           // the brightest of the shinsu, low behind the bars
const BARS = { step: 50, rail1: 566, rail2: 236 };
const BALL = { x: 934, y: 468, r: 42 };
const BAM = { x: 736, y: 852 };             // between his feet
// The eel: its middle line, from its head to the end of its tail, and how thick it is at each place.
const EEL = [[416, 486, 46], [452, 380, 44], [540, 286, 50], [690, 228, 58], [860, 246, 58], [990, 326, 52], [1110, 384, 44], [1244, 348, 34], [1340, 244, 24], [1408, 126, 15], [1500, 30, 8]];

const nA = noise2(9101), nB = noise2(9109), nC = noise2(9127);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// The light of the shinsu at a place: 1 at its brightest, 0 in the dark.
const bright = (x, y) => Math.exp(-Math.pow(Math.hypot((x - LIGHT.x) * 0.62, y - LIGHT.y) / 400, 2));
const shinsuRamp = grad([[0, '#020806'], [0.25, '#083420'], [0.5, '#1c7c40'], [0.72, '#6ccc6c'], [0.88, '#ccf8a0'], [1, '#fbffec']]);
const shinsu = (x, y) => shinsuRamp(clamp(bright(x, y) * 1.04 + (nA(x / 260, y / 200) - 0.5) * 0.16, 0, 1));
// A place on the floor is in the shade of a bar if the line from the light through it meets the foot of a bar.
const barShade = (x, y) => { const xb = LIGHT.x + (x - LIGHT.x) * (FLOOR - LIGHT.y) / Math.max(1, y - LIGHT.y), f = xb / BARS.step - Math.round(xb / BARS.step); return Math.abs(f) < 0.13 ? 1 : 0; };

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, FLOOR, LIGHT, BARS, BALL, BAM, EEL, nA, nB, nC, hash, bright, shinsu, barShade };
