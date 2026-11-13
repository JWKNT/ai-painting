// The Fort-class: the largest of them, sixty metres high. A body in three parts carried far
// above the ground on ten long legs that end in points, and under it a tail as long as the
// whole creature, with a hooked sting. It stands over the field with the glare behind its
// legs and the fires lighting it from below, its tail drawn forward to strike.
'use strict';
const { studio, open, LIGHT, FORT, veil } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('fort');
const r = p.rng;
const ember = () => mix('#ff8a3a', '#ffd088', r());
const HIDE = { shadow: '#120d1a', half: '#2c2032', lit: '#a05c48', rim: '#ffb070', bounce: '#1a1830' };
const tones = (far) => { const t = {}; for (const k of Object.keys(HIDE)) t[k] = k === 'rim' ? HIDE[k] : veil(HIDE[k], FORT.x, FORT.y, far); return t; };
const o = { light: LIGHT, turn: 0.4, width: 6, length: 30, vary: 0.06, dash: 26, gap: 12, edgeOpacity: 0.8 };

// Smoke and dull fire behind it, so that it stands dark against something.
for (const [x, y, w, op, color] of [[1150, 300, 260, 0.3, '#b8402c'], [1270, 240, 220, 0.22, '#a8382a'], [1030, 390, 200, 0.28, '#d0562e'], [1390, 330, 200, 0.18, '#a8382a'], [1100, 420, 150, 0.2, '#f07a38']]) {
  p.stroke({ brush: 'soft', color, width: w, opacity: op, points: [[x - w * 1.02, y + 16], [x, y], [x + w * 1.02, y - 12]] });
}

// A leg: up from the body to a knee high above it, then a long way down to a point in the
// ground, with one more joint near the foot.
function leg(hip, knee, foot, far, thick = 1) {
  const t = tones(far), out = knee[0] < hip[0] ? -1 : 1;
  const ankle = [foot[0] + (knee[0] - foot[0]) * 0.24 + out * 16, foot[1] + (knee[1] - foot[1]) * 0.26];
  const part = (pts, extra) => solid(p, pts.map(([x, y, rad]) => [x, y, rad * thick]), t, { ...o, ...extra });
  // the upper leg bows upward on its way out to the knee
  part([[hip[0], hip[1], 17], [(hip[0] + knee[0]) / 2 + out * 6, (hip[1] + knee[1]) / 2 - 22, 15], [knee[0], knee[1], 12.5]], { length: 32 });
  part([[knee[0] - 2, knee[1] - 4, 15], [knee[0] + out * 4, knee[1] + 4, 15]], { length: 16, edge: false });        // the knuckle of the knee
  part([[knee[0] + out * 2, knee[1] + 4, 12], [(knee[0] + ankle[0]) / 2 + out * 9, (knee[1] + ankle[1]) / 2, 10.5], [ankle[0], ankle[1], 9]], { length: 42 });
  part([[ankle[0], ankle[1], 9], [(ankle[0] + foot[0]) / 2, (ankle[1] + foot[1]) / 2, 7], [foot[0], foot[1], 4.4]], { length: 30 });
  for (let k = 0; k < 3; k++) p.tryStroke({ brush: 'soft', color: mix('#5a2a2a', '#d0703c', r()), width: r.range(24, 40), opacity: r.range(0.1, 0.18), taper: [0.1, 0.6], points: [[foot[0], foot[1] + 4], [foot[0] + r.range(-30, 30), foot[1] - r.range(14, 30)], [foot[0] + r.range(-50, 50), foot[1] - r.range(36, 70)]] });   // dust where it comes down
}

// The legs of its far side first, behind the body and a little lost in the smoke.
for (const [hip, knee, foot] of [
  [[1080, 340], [1012, 236], [948, 668]], [[1150, 330], [1130, 196], [1104, 684]], [[1230, 326], [1270, 190], [1296, 688]], [[1290, 330], [1396, 238], [1452, 676]],
]) leg(hip, knee, foot, 0.26, 0.82);

// The body: the great hind part, the middle, and the low head in front.
const body = tones(0.1);
solid(p, [[1176, 304, 64], [1252, 290, 82], [1326, 302, 60]], body, { ...o, turn: 0.2, length: 46, width: 8 });
solid(p, [[1056, 350, 46], [1106, 330, 60], [1164, 314, 60]], body, { ...o, turn: 0.2, length: 40, width: 8 });
solid(p, [[1000, 400, 27], [1032, 370, 36]], body, { ...o, turn: 0.2, length: 28 });
// the folds between its parts and across its back
for (const [x0, y0, x1, y1, x2, y2] of [[1168, 262, 1180, 314, 1172, 366], [1214, 226, 1232, 292, 1222, 362], [1284, 226, 1302, 296, 1290, 356], [1096, 282, 1104, 334, 1094, 382], [1040, 344, 1046, 372, 1036, 398]]) {
  p.tryStroke({ brush: 'bristle', color: veil('#08060e', FORT.x, FORT.y, 0.1), width: 7, opacity: 0.5, mix: 0.2, dry: 0.1, rag: 0.2, taper: [0.3, 0.3], points: [[x0, y0], [x1, y1], [x2, y2]] });
}
// the fire on its underside
for (const pts of [[[986, 420], [1040, 414], [1100, 398]], [[1110, 388], [1190, 378], [1270, 378]], [[1280, 376], [1340, 358], [1378, 326]], [[980, 396], [990, 372], [1012, 350]]]) glint(p, pts, ember, { width: 5.5, dash: 34, gap: 12, opacity: 0.7, rng: r });

// The tail: from under the hind part, down and forward in a long curve, to the sting.
solid(p, [[1268, 356, 15], [1196, 452, 13.5], [1074, 522, 12.5], [944, 524, 11.5], [824, 474, 10], [744, 434, 8.5]], tones(0.06), { ...o, length: 44 });
solid(p, [[744, 434, 8], [712, 426, 7], [692, 444, 5.5], [696, 470, 4.4]], tones(0.04), { ...o, length: 24 });                    // the hook of the sting
for (const [dx, len] of [[0, 20], [-4, 15], [5, 13]]) p.tryStroke({ color: mix('#b8d86a', '#f0f8b0', r()), width: 4, opacity: 0.6, taper: [0, 0.7], points: [[696 + dx, 474 + Math.abs(dx) * 3], [697 + dx, 474 + Math.abs(dx) * 3 + len]] });   // what drips from it

// The legs of its near side, in front of everything else of it.
for (const [hip, knee, foot] of [
  [[1050, 372], [962, 214], [886, 716]], [[1110, 362], [1068, 168], [1030, 764]], [[1180, 352], [1196, 150], [1208, 796]], [[1250, 350], [1340, 172], [1392, 776]], [[1310, 346], [1452, 222], [1532, 728]],
]) leg(hip, knee, foot, 0.04);

p.save();
