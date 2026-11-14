// The swords: on the far plain, on the hill, and on the plain in front of it. There are more
// of them than can be counted. On the hill they stand thickest, and those along its top are
// against the sky. Far off each is only a mark; nearer each has its blade, its guard and its
// grip. No two stand the same way. The ground in front of the hill is open, and one sword
// stands in it by itself.
'use strict';
const { studio, open, W, HORIZON, EYE, LONE, hillTop, hillFoot, onHill, sword } = require('./scene');
const { clamp } = studio;

const p = open('field');
const r = p.rng;
const list = [];
const byLone = (x, y) => Math.abs(x - LONE.x) < 150 && y > 590 && y < LONE.y + 60;                     // nothing stands near the one that is by itself
const open2 = (x, y) => Math.abs(x - 650) < 350 + (y - 580) * 1.0;                                     // the open ground in front of the hill: few swords stand in it
// On the far plain, at each side of the hill: small, close together.
for (let k = 0; k < 150; k++) {
  const x = r.range(-20, W + 20);
  if (hillTop(clamp(x, 0, W)) < HORIZON - 3) continue;
  const y = HORIZON + 5 + Math.pow(r(), 1.7) * 18;
  list.push([x, y, (y - HORIZON) / EYE * r.range(0.75, 1.15), r() < 0.12 ? 'spear' : undefined, 0.72]);
}
// On the hill. A sword there is as long as a sword on the plain, but the hill is far, so it is small.
for (let k = 0; k < 460; k++) {
  const x = r.range(60, 1000), top = hillTop(x), foot = hillFoot(x);
  if (foot - top < 10) continue;
  const t = Math.pow(r(), 0.8), y = top + 3 + t * (foot - top - 4), kind = r() < 0.12 ? 'spear' : undefined;
  list.push([x, y, onHill(t) * r.range(0.8, 1.3) * (kind ? 1.4 : 1), kind, 0.42 - 0.2 * t]);
}
// Along the top of it, against the sky; and a few great ones at the very top.
for (let x = 130; x < 930; x += r.range(7, 20)) { const top = hillTop(x); if (top < HORIZON - 8) list.push([x, top + 3, onHill(0) * r.range(1.0, 1.9), r() < 0.2 ? 'spear' : undefined, 0.42]); }
for (const [x, h, kind, tilt] of [[508, 66, 'broad', 0.06], [540, 84, 'long', -0.1], [572, 58, 'katana', 0.22], [478, 52, 'spear', -0.2], [610, 62, 'long', 0.16], [444, 46, 'long', 0.3], [660, 48, 'broad', -0.24]]) list.push([x, hillTop(x) + 4, h, kind, 0.4, tilt]);
// On the plain in front of the hill, out to each side.
for (let k = 0; k < 330; k++) {
  const x = r.range(-20, W + 20), y = hillFoot(clamp(x, 0, W)) + 4 + Math.pow(r(), 1.5) * 150;
  if (byLone(x, y) || (open2(x, y) && r() > (x > 300 && x < 760 && y < 770 ? 0 : 0.12))) continue;      // none stand straight in front of the hill
  const kind = r() < 0.13 ? 'spear' : undefined;
  list.push([x, y, (y - HORIZON) / EYE * r.range(0.7, 1.08) * (kind ? 1.35 : 1), kind, clamp(0.3 - (y - 580) / 300, 0.04, 0.3)]);
}
list.sort((a, b) => a[1] - b[1]);
for (const [x, y, h, kind, d, tilt] of list) sword(p, x, y, h, { kind, d, tilt });

p.save();
