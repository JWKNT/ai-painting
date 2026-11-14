// Shared layout, palette and brush habits for the Baldr Sky painting.
//
// The scene: Gray Christmas. Every story in Baldr Sky goes back to one night. It is
// Christmas, and it snows on the academy. In a laboratory there, a machine too small to
// see, the Assembler, which makes more of itself out of anything that it touches, gets
// out. It comes over the school as a grey tide: it stands up like a wave, it puts out
// arms that branch like frost on glass, and what it touches goes to grey dust. To stop
// it, the lance of light Gungnir is fired down from its place in the sky, and the whole
// quarter of the city burns. Here the lance has just come through the cloud. In the
// square in front of the school the Christmas tree still has its lights, and a present
// that someone let fall lies in the snow.
//
// The lights. The lance is white and cold, behind the grey wave and to the right: it
// puts a hard white edge on the wave, on the school and on the falling snow, and long
// blue shades come toward us from all that stands in the square. The lamps of the
// square, the windows of the school and the lights of the tree are small and warm. The
// grey of the Assembler is like dull silver: it shows each of these lights.
'use strict';
const studio = require('../../lib/studio');
const { mix, noise2, grad, clamp, smooth, through } = studio;

const W = 1600, H = 1000;
const GROUND = 664;                                     // where the square meets the foot of the school
const BEAM = { x: 1204 };                               // the lance of light
const TREE = { x: 372, base: 906, h: 430 };             // the Christmas tree
const TOWER = { x: 610, top: 250 };                     // the clock tower of the school

const nA = noise2(4101), nB = noise2(4111), nC = noise2(4127), nD = noise2(4133);
const hash = (a, b = 0) => { const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453; return s - Math.floor(s); };
// How much of the light of the lance is in the air at a place.
const lance = (x, y, reach = 300) => Math.exp(-Math.pow(Math.abs(x - BEAM.x) / reach, 1.6));
// The sky: heavy cloud, deep blue, lit from inside where the lance comes through.
const night = grad([[0, '#0a1024'], [0.5, '#111a38'], [1, '#1a274c']]);
function skyColor(x, y) {
  let c = night(clamp(y / GROUND + (nA(x / 420, y / 220) - 0.5) * 0.3, 0, 1));
  c = mix(c, '#5c7cb8', lance(x, y, 420) * 0.6);
  return mix(c, '#c8dcf8', lance(x, y, 150) * 0.6);
}
// The top line of the grey wave: it stands highest at the right, and its crest hangs over to the left.
const waveTop = through([[700, 640], [760, 560], [800, 440], [850, 330], [920, 250], [1010, 206], [1110, 220], [1200, 290], [1300, 250], [1420, 300], [1520, 260], [1620, 300]]);
// Its front on the ground of the square: a line with round tongues. Above 0 a place of the square is under it.
const tide = (x, y) => { const front = 880 - (y - GROUND) * 0.5 + 46 * Math.sin(y / 31 + 1.3) + 26 * Math.sin(y / 13) + 18 * (nB(3, y / 40) - 0.5); return x - front; };

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, GROUND, BEAM, TREE, TOWER, nA, nB, nC, nD, hash, lance, skyColor, waveTop, tide, smooth };
