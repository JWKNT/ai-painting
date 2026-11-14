// The sea of clouds under us: low round heads of cloud, in rows, small far off and great
// near us, as far as the edge of the world. The moon is on the tops of them, cold; their
// hollows are deep blue; and at the right the red of the day is in their sides.
'use strict';
const { studio, open, W, H, HORIZON, MOON, after, skyColor, nA } = require('./scene');
const { mix, ramp, noise2, clamp } = studio;

const p = open('clouds');
const r = p.rng;
const toMoon = (x, y) => { const dx = MOON.x - x, dy = MOON.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l * 0.55, dy / l * 0.55 - 0.45]; };
let seed = 0;
for (const [floor, big, far] of [[664, 13, 0.85], [684, 20, 0.7], [712, 30, 0.55], [752, 46, 0.4], [806, 66, 0.26], [880, 94, 0.14], [976, 130, 0.05], [1090, 170, 0]]) {
  const puffs = [];
  for (let x = -big; x < W + big; x += big * 0.8) { const rad = big * r.range(0.6, 1.15); puffs.push([x + r.range(-big, big) * 0.3, floor - rad * r.range(0.3, 0.75), rad]); if (r() < 0.5) puffs.push([x + r.range(-big, big) * 0.5, floor - rad * 0.2, rad * r.range(0.6, 0.9)]); }
  const tones = (t, x, y) => {
    const g = Math.exp(-Math.pow((x - 1560) / 760, 2));
    let c = ramp(['#0a0a26', '#1c1c4c', '#3c3c7c', '#8088c4', '#d4dcfc'], t);
    c = mix(c, '#d04860', g * (1 - t) * 0.5 + g * 0.12);                                     // the red of the day, in their sides at the right
    return mix(c, skyColor(x, HORIZON - 4), far * 0.7);                                      // far off they go into the air
  };
  studio.mass(p, puffs, { light: toMoon, tones, base: floor + big * 0.4, bias: 0.4, contrast: 0.62, fall: 0.3, grain: 0.14, mix: 0.3, noise: noise2(5200 + ++seed), stroke: { rag: 0.35, hardness: 0.5 }, flow: (x, y) => (nA(x / 120, y / 40) - 0.5) * 0.5, layers: [[Math.max(8, big * 0.3), Math.max(26, big * 1.1), 0.95, Math.max(2, big * 0.06), 0.5], [Math.max(6, big * 0.16), Math.max(18, big * 0.6), 0.8, Math.max(2, big * 0.04), 0.9]] });
  // short lights on the tops that the moon finds
  for (const [x, y, rad] of puffs) if (rad > 20 && r() < 0.3) { const len = rad * r.range(0.6, 1.0); p.tryStroke({ brush: 'soft', color: '#dce4ff', width: clamp(rad * 0.3, 9, 30), opacity: 0.1 + 0.06 * (1 - far), taper: [0.5, 0.5], points: [[x - len * 0.7, y - rad * 0.66], [x - len * 0.2, y - rad * 0.69], [x + len * 0.3, y - rad * 0.66]] }); }   // each lies nearly level: a bent one is an eyebrow
}
// The moon's light lies on the clouds under it, in a long pale path.
for (const [w, op] of [[190, 0.07], [120, 0.09]]) p.stroke({ brush: 'soft', color: '#b0bcf4', width: w, opacity: op, points: [[MOON.x - 30, HORIZON - 20], [MOON.x + 40, 800], [MOON.x + 120, H + 40]] });
for (let x = 560; x < W; x += 220) p.stroke({ brush: 'soft', color: '#e06050', width: 30, opacity: 0.16 * after(x + 110, HORIZON), points: [[x, HORIZON + 14], [x + 110, HORIZON + 16], [x + 230, HORIZON + 14]] });

p.save();
