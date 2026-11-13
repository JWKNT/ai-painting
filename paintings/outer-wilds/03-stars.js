// Stars. A brush cannot dot, so each star is a short arc turning about the sun, like a
// long exposure: faint ones thin and brief, bright ones with a soft halo first.
'use strict';
const { studio, open, W, SUN, aroundSun, clamp } = require('./scene');
const { arc } = studio;

const p = open('stars');
const r = p.rng;

const tints = ['#ffffff', '#ffffff', '#e6edff', '#cfdcff', '#fff4dc', '#ffe3c2', '#bcd0ff', '#ffd2b0'];
const band = [[60, 470], [330, 400], [640, 300], [930, 170], [1230, 60], [1500, -10]];

function star(x, y, mag) {
  const dx = x - SUN.x, dy = y - SUN.y, d = Math.hypot(dx, dy);
  const far = clamp((d - 390) / 460, 0, 1);
  if (r() > far * far + 0.02) return;
  const a = Math.atan2(dy, dx);
  const trail = (len) => arc(SUN.x, SUN.y, d, a - len / 2 / d, a + len / 2 / d, 3);
  if (mag > 0.965) {            // the few brilliant ones
    const color = r.pick(tints);
    p.stroke({ brush: 'soft', color: r.pick(['#8fa8ff', '#b8a0ff', '#ffd9a8']), width: 16, opacity: 0.32, points: trail(36) });
    p.stroke({ brush: 'round', color, width: 5, opacity: 1, points: trail(r.range(17, 24)) });
  } else if (mag > 0.8) {
    p.stroke({ brush: 'round', color: r.pick(tints), width: 4, opacity: r.range(0.65, 0.95), points: trail(r.range(13.5, 19)) });
  } else {
    p.stroke({ brush: 'round', color: r.pick(tints), width: 4, opacity: r.range(0.22, 0.5), points: trail(r.range(12.5, 15)) });
  }
}

// Scattered evenly...
for (let k = 0; k < 1500; k++) star(r.range(0, W), r.range(0, 760), r());
// ...and gathered thicker along the band of starlight.
for (let k = 0; k < 700; k++) {
  const f = r.range(0, 1) * (band.length - 1), i = Math.min(band.length - 2, Math.floor(f)), g = f - i;
  const spread = r.gauss() * 55;
  star(band[i][0] + (band[i + 1][0] - band[i][0]) * g + spread * 0.33, band[i][1] + (band[i + 1][1] - band[i][1]) * g + spread, r() * 0.97);
}

p.save();
