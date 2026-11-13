// Shared layout, palette and brush habits for the Pokémon Mystery Dungeon painting.
//
// The scene: the beach near Treasure Town, from Explorers of Sky, at the end of the day. When
// the sun goes down, the Krabby come out on the rocks and blow bubbles, and the bubbles go
// out over the sea with the light of the sunset in them. The two partners of the story
// stand on the wet sand and watch: here they are a Piplup and a Chimchar. This is where one
// of them found the other, and where the story comes back to at its end. Far off at the
// right is Sharpedo Bluff, the cliff in the shape of a shark's head.
//
// The sun is low in front of us, a little to the right. Everything near us is against its
// light, so it is dark with a bright edge, and the sky is rose and violet.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, through, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 540;
const SUN = { x: 1040, y: 500, r: 36 };
const SUNLIGHT = { at: [SUN.x, SUN.y] };
const PIPLUP = { x: 916, y: 812 }, CHIMCHAR = { x: 1074, y: 818 };       // between the feet of each

const nA = noise2(131), nB = noise2(149), nC = noise2(167);

// How strongly the glow of the sun reaches a place: 1 at the sun, 0 far from it.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.2) / reach, 2));

// The sky: violet overhead, then rose, then gold where the sun is.
const skyRamp = grad([[0, '#7b70c2'], [0.3, '#a683cc'], [0.56, '#e98fbb'], [0.78, '#ffab98'], [0.92, '#ffd08c'], [1, '#ffe9a0']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.07, 0, 1));
  c = mix(c, '#f4a4ac', smooth(0.78, 1, y / HORIZON) * (1 - clamp(glow(x, y, 760) * 1.3, 0, 1)) * 0.7);   // far from the sun the foot of the sky is rose, not gold
  c = mix(c, '#ffb070', 0.45 * glow(x, y, 520));
  return mix(c, '#fff6c4', 0.9 * glow(x, y, 170));
}

// The edge of the water, across the picture; and below it the edge of the sand that the last wave left wet.
const shoreLine = through([[0, 704], [300, 728], [700, 750], [1100, 744], [1400, 724], [1600, 700]]);
const shore = (x) => shoreLine(x) + 5 * (nB(x / 70, 3) - 0.5);
const wetEnd = (x) => shoreLine(x) + 84 + 16 * (nA(x / 120, 9) - 0.5);

// How near a place on the sea is: 0 at the horizon, 1 at the edge of the water.
const depthOf = (x, y) => clamp((y - HORIZON) / (shoreLine(x) - HORIZON), 0, 1);
// The road of light that the sun lays on the water and on the wet sand.
const sunPath = (x, y) => { const d = clamp((y - HORIZON) / 300, 0, 1.2); return Math.exp(-Math.pow((x - SUN.x) / (16 + d * 170), 2)); };

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, SUN, SUNLIGHT, PIPLUP, CHIMCHAR, nA, nB, nC, glow, skyColor, shore, shoreLine, wetEnd, depthOf, sunPath };
