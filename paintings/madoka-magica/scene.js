// Shared layout, palette and brush habits for the Madoka Magica painting.
//
// The scene: Walpurgisnacht. She is the greatest of the witches, and she does not need to
// hide. She comes over the city of Mitakihara as a storm: a thing like a doll in a wide blue
// dress, as high as the tallest towers, that hangs head down in the sky under a great wheel
// with teeth, and laughs. The storm turns round her. Pieces of the city go up into the air
// about her, and the city burns under her.
// One girl stands on a broken roof and looks up at her: Homura Akemi, with her long black
// hair and the round shield on her arm. She has come back to this night more times than she
// can count, to save one friend, and she has lost every time.
//
// The light is the pale cold light that is round the witch, and under it the fires of the
// city, which are warm. So what is near us is dark, with a cold edge above and a warm one below.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, clamp, smooth } = studio;

const W = 1600, H = 1000;
const WITCH = { x: 1010, y: 300, waist: 330 };   // the middle of her light, and the height of her waist
const SKYLINE = 760;                       // the foot of the far towers
const HOMURA = { x: 340, y: 966, s: 2.25 };   // between her feet, and how many units of the picture a centimetre of her is
const roofEdge = (x) => 850 + 155 * x / 760;   // the far edge of the roof that she stands on

const nA = noise2(701), nB = noise2(719), nC = noise2(733);

// How strongly the light of the witch reaches a place.
const aura = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - WITCH.x, (y - WITCH.y) * 1.1) / reach, 2));
// How strongly the fires of the city light the air at a place: most of all low down.
const fire = (x, y) => clamp(smooth(600, 830, y) * (0.5 + 0.5 * nA(x / 300, 5)), 0, 1);

// The sky: the dark of the storm, pale and green-grey round the witch, and red-brown low down, over the fires.
function skyColor(x, y) {
  let c = mix('#111a26', '#2c4350', smooth(0.1, 0.9, nA(x / 420, y / 300)) * 0.7 + 0.15);
  c = mix(c, '#7c9c98', aura(x, y, 520) * 0.85);
  c = mix(c, '#d8ecd8', aura(x, y, 230) * 0.8);
  return mix(c, mix('#5c3430', '#c8682c', smooth(690, 830, y)), fire(x, y) * 0.7);
}
// What the storm does to a thing at a distance: d is 0 close to us and 1 very far off.
const far = (color, x, y, d) => mix(color, skyColor(x, y), clamp(d, 0, 1) * 0.8);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, WITCH, SKYLINE, HOMURA, roofEdge, nA, nB, nC, aura, fire, skyColor, far };
