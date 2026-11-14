// The two wheels. Each of the two has left its trail in the air behind it: the Silver Star a
// long white line that comes down out of the upper right, across the stars, toward the
// moon; and Muramasa a line of fire and red smoke that comes round under us, over the
// clouds. Then the Silver Star itself: far off it is only a silver light.
'use strict';
const { studio, open, STAR, STAR_TRAIL, RED_TRAIL } = require('./scene');
const { mix, glow } = studio;

const p = open('trails');
const r = p.rng;
// A trail: pieces along a line, from its old end (t = 0) to its new end (t = 1). `tone(t)` gives the color, the width and the opacity
// of a piece. Each piece is long enough for its width, and lies a little over the next.
function trail(line, tone, wMax) {
  let total = 0, prev = line(0);
  for (let i = 1; i <= 200; i++) { const q = line(i / 200); total += Math.hypot(q[0] - prev[0], q[1] - prev[1]); prev = q; }
  const n = Math.max(3, Math.floor(total / (wMax * 2.5)));
  for (let i = 0; i < n; i++) {
    const t0 = i / n, t1 = Math.min(1, (i + 1.3) / n), [color, w, op, brush] = tone((t0 + t1) / 2), pts = [];
    for (let k = 0; k <= 6; k++) pts.push(line(t0 + (t1 - t0) * k / 6));
    p.tryStroke({ brush: brush || 'soft', color, width: w, opacity: op, mix: 0.2, rag: 0.3, cap: 'round', points: pts });
  }
}
// The trail of the Silver Star: a wide faint light, and in it a thin bright line that is brightest at the head.
trail(STAR_TRAIL, (t) => [mix('#6c84d0', '#c4d4ff', t), 40 - 16 * t, 0.06 + 0.16 * t * t], 40);
trail(STAR_TRAIL, (t) => [mix('#a8bcf4', '#ffffff', t), 16 - 6 * t, 0.12 + 0.4 * t * t], 16);
trail(STAR_TRAIL, (t) => [mix('#c8d8ff', '#ffffff', t), 7.5 - 2.5 * t, 0.2 + 0.75 * t * t, 'bristle'], 7.5);
// The trail of Muramasa: old red smoke, wide, that the wind has pulled about; then fire, which is brightest at the armour.
trail(RED_TRAIL, (t) => [mix(mix('#34204c', '#6c2848', t), '#b0343c', t * t), 60 - 24 * t, 0.16 + 0.2 * t], 60);
trail(RED_TRAIL, (t) => [mix('#5c2444', '#c8443c', t), 34 - 12 * t, 0.14 + 0.2 * t], 34);
trail(RED_TRAIL, (t) => [mix('#8c2c3c', '#f0682c', t), 20 - 8 * t, 0.1 + 0.4 * t * t], 20);
trail(RED_TRAIL, (t) => [mix('#c8503c', '#ffc060', t * t), 9 - 3 * t, 0.1 + 0.75 * t * t * t, 'bristle'], 9);
for (let k = 0; k < 16; k++) {                                            // sparks that have fallen out of it, near its new end
  const t = 0.72 + 0.27 * r(), [x, y] = RED_TRAIL(t), l = r.range(12.4, 18), a = r.range(0.3, 1.1), dx = r.range(-14, 14), dy = r.range(2, 24);
  p.tryStroke({ brush: 'round', color: mix('#ff8a3c', '#ffe490', r()), width: 4, opacity: 0.3 + 0.5 * r(), taper: [0, 0.6], points: [[x + dx, y + dy], [x + dx + Math.cos(a) * l, y + dy + Math.sin(a) * l]] });
}

// The Silver Star: a light with no edge, one long thin ray across it, and its bright heart.
for (const [w, op, n] of [[150, 0.06, 4], [80, 0.12, 5], [40, 0.22, 6], [20, 0.4, 6]]) glow(p, STAR.x, STAR.y, w, mix('#8ca8f4', '#ffffff', 1 - w / 160), op, n);
p.tryStroke({ brush: 'soft', color: '#e8f0ff', width: 9, opacity: 0.42, taper: [0.95, 0.95], points: [[STAR.x - 130, STAR.y + 18], [STAR.x, STAR.y], [STAR.x + 130, STAR.y - 18]] });
p.tryStroke({ brush: 'round', color: '#ffffff', width: 6, points: [[STAR.x - 8, STAR.y + 2], [STAR.x + 8, STAR.y - 2]] });
p.save();
