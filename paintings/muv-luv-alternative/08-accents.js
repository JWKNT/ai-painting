// Last touches: the gun's fire going out to the Fort-class and striking it, two more fighters
// far off, sparks drifting over the field, the glare of the sun, and the corners brought down.
'use strict';
const { studio, open, W, H, FIRE, TSF, glow } = require('./scene');
const { mix, clamp } = studio;

const p = open('accents');
const r = p.rng;

// The gun: fire at the muzzle, and the rounds on their way, each a short bright mark.
const muzzle = [TSF.x + 190, TSF.y - 23], target = [1012, 392];
{
  const [mx, my] = muzzle, dx = target[0] - mx, dy = target[1] - my, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  p.stroke({ brush: 'soft', color: '#ffb450', width: 44, opacity: 0.4, points: [[mx - 30, my + 6], [mx + 16, my - 6], [mx + 62, my - 22]] });
  for (const [a, d, w] of [[0, 46, 9], [0.5, 26, 7], [-0.5, 26, 7], [1.1, 16, 6], [-1.1, 16, 6]]) {
    const c = Math.cos(a) * ux - Math.sin(a) * uy, s = Math.sin(a) * ux + Math.cos(a) * uy;
    p.tryStroke({ brush: 'bristle', color: mix('#ffd070', '#fffbe0', r()), width: w, opacity: 0.95, mix: 0, dry: 0, rag: 0.2, taper: [0, 0.9], points: [[mx, my], [mx + c * d * 0.5, my + s * d * 0.5], [mx + c * d, my + s * d]] });
  }
  for (let t = 70; t < len - 20; t += r.range(34, 60)) {
    const x = mx + ux * t, y = my + uy * t, l = r.range(16, 26);
    p.tryStroke({ brush: 'soft', color: '#ffb040', width: 9, opacity: 0.35, points: [[x - ux * 10, y - uy * 10], [x + ux * (l + 10), y + uy * (l + 10)]] });
    p.line(x, y, x + ux * l, y + uy * l, { color: mix('#ffe08a', '#fffbe8', r()), width: 4.2, opacity: 0.95 });
  }
  // where they strike: sparks off the hide, and a little of its blood
  p.stroke({ brush: 'soft', color: '#ffb450', width: 34, opacity: 0.35, points: [[target[0] - 36, target[1] + 4], [target[0], target[1] - 4], [target[0] + 36, target[1] + 2]] });
  for (let k = 0; k < 14; k++) {
    const a = Math.atan2(-uy, -ux) + r.range(-1.2, 1.2), d = r.range(14, 40), hot = r() < 0.7;
    p.tryStroke({ brush: 'bristle', color: hot ? mix('#ffb040', '#fff4c0', r()) : mix('#5a1a5c', '#9a3a8a', r()), width: r.range(4.6, 6.5), opacity: r.range(0.6, 0.95), mix: 0.1, dry: 0.05, rag: 0.2, taper: [0, 0.9], points: [[target[0] + r.range(-10, 10), target[1] + r.range(-10, 10)], [target[0] + Math.cos(a) * d * 0.6, target[1] + Math.sin(a) * d * 0.6], [target[0] + Math.cos(a) * d, target[1] + Math.sin(a) * d + d * 0.12]] });
  }
}

// Two more fighters far off: each a dark mark with the blue of its engines behind it, firing.
function wingman(x, y, s, dir) {
  p.stroke({ brush: 'soft', color: '#5a90ff', width: 14 * s + 4, opacity: 0.4, taper: [0, 0.7], points: [[x - dir * 6 * s, y + 10 * s], [x - dir * 30 * s, y + 24 * s], [x - dir * 62 * s, y + 42 * s]] });
  p.tryStroke({ brush: 'bristle', color: '#d0ecff', width: 5, opacity: 0.9, mix: 0, dry: 0, rag: 0.1, taper: [0, 0.9], points: [[x - dir * 8 * s, y + 12 * s], [x - dir * 22 * s, y + 20 * s], [x - dir * 36 * s, y + 28 * s]] });
  p.stroke({ brush: 'bristle', color: '#0a0c16', width: 9 * s, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[x - dir * 10 * s, y + 18 * s], [x, y], [x + dir * 8 * s, y - 16 * s]] });          // body and legs
  p.tryStroke({ brush: 'bristle', color: '#0a0c16', width: 6 * s, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[x + dir * 2 * s, y - 8 * s], [x + dir * 22 * s, y - 2 * s]] });                        // its gun arm
  p.tryStroke({ brush: 'bristle', color: '#0a0c16', width: 6 * s, mix: 0, dry: 0, rag: 0.1, cap: 'round', points: [[x - dir * 2 * s, y + 2 * s], [x - dir * 20 * s, y + 14 * s]] });                       // a jump unit
  for (let k = 1; k <= 3; k++) p.tryStroke({ color: '#ffe8a0', width: 4, opacity: 0.8, points: [[x + dir * (22 + k * 24) * s, y - 2 * s + k * 5 * s], [x + dir * (22 + k * 24) * s + dir * 12.6, y - 2 * s + k * 5 * s + 2.6]] });   // its fire
}
wingman(1470, 496, 1.5, -1);
wingman(214, 548, 1.2, 1);

// Sparks drifting over the field.
for (let k = 0; k < 130; k++) {
  const x = r.range(0, W), y = r.range(330, 800), a = -0.9 + r.range(-0.7, 0.7), len = r.range(12.4, 16), near = clamp(glow(x, y, 520), 0, 1);
  if (r() > near * 0.8) continue;                                       // most of them close to the fires
  p.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, { color: mix('#ff7a2a', '#ffd88a', r()), width: 4, opacity: r.range(0.25, 0.65) });
}

// The glare of the sun, over everything near it.
for (const [w, o] of [[340, 0.1], [190, 0.14], [100, 0.2]]) {
  p.stroke({ brush: 'soft', color: '#ffe0a0', width: w, opacity: o, points: [[FIRE.x - w * 1.05, FIRE.y - 6], [FIRE.x, FIRE.y - 22], [FIRE.x + w * 1.05, FIRE.y - 6]] });
}

// The corners, a tone darker, so the eye stays with the fight.
for (const [x0, y0, x1, y1, w, o] of [
  [-80, H + 40, 700, H + 60, 200, 0.32], [W + 80, H + 40, 900, H + 60, 200, 0.32], [-90, -50, 520, -80, 220, 0.26], [W + 90, -50, 1080, -80, 220, 0.26],
]) {
  p.stroke({ brush: 'soft', color: '#05040a', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
