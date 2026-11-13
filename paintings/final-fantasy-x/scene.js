// Shared layout, palette and brush habits for the Final Fantasy X painting.
//
// The scene: the Sending, at the port of Kilika. Sin has come out of the sea and broken the
// village, and its dead are in the water. If they are not sent, they become fiends. So at
// sunset the summoner Yuna walks out on the water in front of everyone and dances for them:
// she turns with her staff held high, the long sleeves of her dress go out round her, the
// sea rises under her in a column, and the dead leave the water as lights and go up into
// the sky. The people of Kilika watch from what is left of their walks, and torches burn.
//
// The sun has just gone down behind her. Everything is against that light: she is dark
// with a bright edge, and the water under her is lit from within.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp } = studio;

const W = 1600, H = 1000;
const HORIZON = 600;
const SUN = { x: 800, y: 612 };            // where the sun went down: just below the edge of the sea
const GLOW = { at: [800, 560] };           // the light that everything is seen against
// Sizes. We watch from one of the walks, with our eyes 2.2 metres over the water. A thing
// that stands in the water where the water is at the height y of the picture is painted at
// (y - HORIZON) / 2.2 to the metre. Yuna is 1.6 metres tall, and the column lifts her 2.3 metres.
const YUNA = { x: 800, y: 588 };           // between her feet, on the top of the column of water
const COLUMN = { x: 800, top: 586, foot: 930 };

const nA = noise2(211), nB = noise2(223), nC = noise2(239);

// How strongly the last light of the sun reaches a place.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, (y - SUN.y) * 1.3) / reach, 2));

// The sky after sunset: violet and deep blue overhead, then rose, then red and gold at the sea.
const skyRamp = grad([[0, '#2a2a66'], [0.24, '#514288'], [0.46, '#9c5390'], [0.64, '#dd6680'], [0.8, '#f98a62'], [0.92, '#ffb85c'], [1, '#ffe08c']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.08, 0, 1));
  c = mix(c, '#ff9a54', 0.5 * glow(x, y, 520));
  return mix(c, '#fff0b0', 0.85 * glow(x, y, 200));
}

// How near a place on the water is: 0 at the horizon, 1 at the bottom of the picture.
const depthOf = (y) => clamp((y - HORIZON) / (H - HORIZON), 0, 1);
// The road of light on the water, under where the sun went down.
const sunPath = (x, y) => { const d = depthOf(y); return Math.exp(-Math.pow((x - SUN.x) / (30 + d * 260), 2)); };
// The water: it holds the sky, redder and darker, and darker still toward us.
function seaColor(x, y) {
  const d = depthOf(y);
  let c = mix(skyColor(x, HORIZON - 20 - d * 420), '#7c2c4c', 0.3 + 0.2 * d);
  return mix(c, '#2a1638', d * 0.5);
}
// A thing that stands far off in the evening air takes the color of the sky behind it.
const far = (color, x, y, d) => mix(color, skyColor(x, Math.min(y, HORIZON - 6)), clamp(d, 0, 1) * 0.7);

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, SUN, GLOW, YUNA, COLUMN, nA, nB, nC, glow, skyColor, depthOf, sunPath, seaColor, far };
