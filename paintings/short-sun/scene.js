// Shared layout, palette and brush habits for the Book of the Short Sun painting.
//
// The books have no pictures, so this scene is imagined from the text. It is evening on the
// sea of the world called Blue. Horn's sloop runs before the wind: Horn at the tiller,
// Seawrack at the bow with the wind in her gold hair, and the hus Babbie on the deck between
// them. The Short Sun, small and fierce, is almost down. Its sister world Green hangs in the
// sky, huge, lit on the side that faces the sun, and from Green the inhumi are coming across
// the gap between the worlds. High in the dusk is a light that does not move like a star:
// the Whorl, the ship that brought them all here. On a rock at the edge of the sea stands a
// broken tower of the Vanished People.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth } = studio;

const W = 1600, H = 1000;
const HORIZON = 612;
const SUN = { x: 1296, y: 596, r: 17 };
const GREEN = { x: 372, y: 252, r: 150 };
const WHORL = { x: 1136, y: 138 };
const MAST = { x: 664, foot: 742, top: 486 };   // the sloop is laid out from its mast
const TO_SUN = (() => { const v = [0.84, 0.36, 0.1], l = Math.hypot(...v); return v.map((c) => c / l); })();   // the light on Green: from the right, a little below, almost edge on

const nA = noise2(601), nB = noise2(619), nC = noise2(641);

// How strongly the sun's light reaches a place: 1 at the sun, 0 far from it. It lies along the horizon.
const glow = (x, y, reach = 420) => Math.exp(-Math.pow(Math.hypot((x - SUN.x) * 0.75, (y - SUN.y) * 1.5) / reach, 2));
const greenGlow = (x, y, reach = 330) => Math.exp(-Math.pow(Math.hypot(x - GREEN.x, y - GREEN.y) / reach, 2));

// Sky at dusk. Away from the sun it is the blue of night coming on; toward the sun it goes
// through violet and rose to gold. Round Green the air is faintly green.
const cool = grad([[0, '#090e30'], [0.4, '#152152'], [0.75, '#25416a'], [1, '#3a6478']]);
const warm = grad([[0, '#12123c'], [0.35, '#34286a'], [0.62, '#88467a'], [0.82, '#de7660'], [0.94, '#fbb468'], [1, '#ffe09a']]);
function skyColor(x, y) {
  const t = clamp(y / HORIZON + (nA(x / 380, y / 200) - 0.5) * 0.08, 0, 1);
  const k = clamp(Math.exp(-Math.pow((x - SUN.x) / 580, 2)) * 1.1, 0, 1);
  let c = mix(cool(t), warm(t), k);
  c = mix(c, '#fff0c0', 0.85 * glow(x, y, 150));
  return mix(c, '#2e8a5a', 0.22 * greenGlow(x, y));
}

// The sea. Far off it shows the sky above it; near us it is deep and dark. The sun lays a
// path of gold on it, and Green a fainter one of its own color.
const depthOf = (y) => clamp((y - HORIZON) / (H - HORIZON), 0, 1);
function sunPath(x, y) {
  const d = depthOf(y), mid = SUN.x - d * 150, half = 12 + d * 210;
  return clamp(1 - Math.abs(x - mid) / half, 0, 1) * (1 - 0.45 * d);
}
function greenPath(x, y) {
  const d = depthOf(y), mid = GREEN.x + d * 40, half = 16 + d * 150;
  return clamp(1 - Math.abs(x - mid) / half, 0, 1) * (0.5 - 0.2 * d);
}
function seaColor(x, y) {
  const d = depthOf(y);
  let c = mix(mix(skyColor(x, HORIZON - 24), '#14304a', 0.62), mix('#0a2436', '#123a4a', nA(x / 90, y / 30)), smooth(0, 0.7, d));
  c = mix(c, '#ffc878', clamp(glow(x, HORIZON, 520) * 0.5 * (1 - d), 0, 1));     // the whole sea is warmer toward the sun
  return c;
}

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HORIZON, SUN, GREEN, WHORL, MAST, TO_SUN, nA, nB, nC, glow, greenGlow, skyColor, depthOf, sunPath, greenPath, seaColor };
