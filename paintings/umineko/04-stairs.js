// The stairs: stone steps with a red carpet down the middle, rails on turned posts at either
// side. The witch's light is on every riser, strongest where she stands; the carpet burns
// orange there. The lightning touches the left rail.
'use strict';
const { studio, open, FLOOR, LAND, nA, gold, lit, STEPS, stairLeft, stairRight, bar, post } = require('./scene');
const { mix, clamp, glint } = studio;

const p = open('stairs');
const r = p.rng;

const stone = (x, y) => lit(mix('#262034', '#3a3248', nA(x / 40, y / 6)), x, y, 0.95, 0.75);
const carpet = (x, y) => mix(lit(mix('#3c0a12', '#5c1018', nA(x / 30, y / 6)), x, y, 0.3, 0.5), '#ff8a30', clamp(gold(x, y, 280) * 0.85, 0, 1));
const far = (y) => (FLOOR - y) / (FLOOR - LAND);                       // 0 at the foot of the stairs, 1 at their top
const edgeL = (y) => 650 + 40 * far(y), edgeR = (y) => 950 - 40 * far(y);   // the carpet

bar(p, 560, 1040, LAND - 3, 9, (x, y) => lit('#161019', x, y, 0.9, 0.6));   // the landing
for (let k = STEPS.length - 1; k >= 0; k--) {                           // the farthest step first
  const { foot, nose, back } = STEPS[k], yt = (back + nose) / 2, yr = (nose + foot) / 2, wt = Math.max(4.6, nose - back + 2), wr = foot - nose + 2;
  const xl = stairLeft(yr), xr = stairRight(yr), cl = edgeL(yr), cr = edgeR(yr);
  bar(p, xl, xr, yt, wt, (x, y) => lit('#120e1a', x, y, 0.55, 0.55));                              // the tread, seen from just above
  bar(p, cl, cr, yt, wt, (x, y) => mix('#22060a', '#c8501c', clamp(gold(x, y, 280) * 0.6, 0, 1)));
  bar(p, xl, cl, yr, wr, stone);                                                                   // the riser
  bar(p, cl, cr, yr, wr, carpet);
  bar(p, cr, xr, yr, wr, stone);
  bar(p, xl, xr, nose + 1, 4, (x, y) => mix('#4a3e4c', '#ffe6a0', clamp(gold(x, y, 340) * 1.25, 0, 1)), { seg: 50, stroke: { opacity: 0.75 } });   // light along its edge
}

// The rails. Each is a newel at the foot, turned posts up the side of the steps, and the handrail on them.
for (const side of [-1, 1]) {
  const X = (x) => 800 + side * (x - 800);                              // the right one is the left one mirrored
  const foot = (t) => [X(480 + 80 * t), 770 - 214 * t], top = (t) => [X(480 + 80 * t), 678 - 186 * t];
  const dark = (x, y) => lit('#170c0d', x, y, 1.0, 1.0);
  for (let i = 12; i >= 1; i--) {
    const t = i / 13, [bx, by] = foot(t), [, ty] = top(t);
    p.tryStroke({ brush: 'bristle', color: dark(bx, (by + ty) / 2), width: Math.max(4.6, 5.8 - 1.2 * t), mix: 0, dry: 0, rag: 0.1, cap: 'flat', points: [[bx, by], [bx, ty]] });
  }
  for (let i = 0; i < 3; i++) {                                         // the handrail, in three lengths
    const a = top(i / 3), b = top((i + 1) / 3);
    p.stroke({ brush: 'bristle', color: lit('#2c1812', (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 1.1, 1.1), width: 10 - 2 * i, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [a, b] });
  }
  glint(p, [0, 0.33, 0.66, 1].map((t) => { const [x, y] = top(t); return [x - side * 3, y - 2]; }), () => (side < 0 ? '#c8d4ff' : mix('#ffc060', '#fff0b0', r())), { width: 4, dash: 34, gap: 12, opacity: 0.75, rng: r });
  post(p, X(476), 662, 774, 18, dark);                                  // the newel at the foot
  bar(p, X(476) - 13, X(476) + 13, 660, 10, (x, y) => lit('#2c1812', x, y, 1.1, 1.1));
  post(p, X(476) - side * 6, 668, 770, 4.4, () => (side < 0 ? '#aebcf0' : '#ffd070'), { seg: 40, stroke: { opacity: 0.6 } });
}

p.save();
