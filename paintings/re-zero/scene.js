// Shared layout, palette and brush habits for the Re:Zero painting.
//
// The scene: "From Zero". Subaru has died again and again to save the people he loves, and he
// has failed each time, and now he has nothing left. On a high terrace over the capital of
// Lugunica he asks Rem to run away with him. She will not. She tells him, one thing after
// another, what she sees in him, and that she loves him. At the end he is on his feet
// again. She has his hand in both of hers and looks up at him, and he says that he will
// start again, from zero. It is a clear bright day, and white doves go up past the terrace.
//
// The sun is high and to the right, out of the picture. So the sky and the city are full of
// light. She faces it. He has his back to it, and the light is along his back and his hair.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp } = studio;

const W = 1600, H = 1000;
const HORIZON = 440;                       // the eye line: we are low, as if we sat on the stones too
const VP = { x: 980, y: HORIZON };         // the lines of the terrace go to this point
const SUNWARD = [0.72, -0.69];             // toward the sun
const FLOOR = 864;                         // the height in the picture of the stones under their feet: they stand 3.4 metres from us
const S = 3.53;                            // how many units of the picture a centimetre is, where they stand
const REM = { x: 600 }, SUBARU = { x: 806 };

const nA = noise2(401), nB = noise2(419), nC = noise2(433);

// The sky: deep blue overhead, paler down the sky, and a warm white haze along the horizon, most of all toward the sun.
const skyRamp = grad([[0, '#3f7fd6'], [0.3, '#5c9ce4'], [0.6, '#8fc2f0'], [0.84, '#cfe6f6'], [1, '#f6efe0']]);
function skyColor(x, y) {
  const t = clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.06, 0, 1), toSun = clamp((x - 300) / 1300, 0, 1) * clamp(1.2 - y / 600, 0, 1);
  return mix(skyRamp(t), '#fffbe8', toSun * 0.42);
}
// What the bright air does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, mix('#dfeaf4', '#fff6e0', clamp((x - 300) / 1300, 0, 1)), clamp(d, 0, 1) * 0.88);

// The wall at the far edge of the terrace: the height of its top and of its foot across the picture. Its left end is nearer to us than its right end.
const wallTop = (x) => 600 - 49 * x / W, wallFoot = (x) => 716 - 85 * x / W;   // the two lines meet on the eye line, far off to the right

// A place on one of the two figures, in centimetres: so far in front of the middle of the figure, the way it faces, and so far up from the stones.
const rem = (cx, cy, rad) => (rad == null ? [REM.x + cx * S, FLOOR - cy * S] : [REM.x + cx * S, FLOOR - cy * S, rad * S]);            // she faces right
const subaru = (cx, cy, rad) => (rad == null ? [SUBARU.x - cx * S, FLOOR - cy * S] : [SUBARU.x - cx * S, FLOOR - cy * S, rad * S]);   // he faces left, toward her

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, VP, SUNWARD, FLOOR, S, REM, SUBARU, nA, nB, nC, skyColor, far, wallTop, wallFoot, rem, subaru };
