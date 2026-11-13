// The wind, and what it carries. Floaty Fluffs drift across the whole sky, small far off and
// large close by. Mario hangs from the stem of one by one hand, out over the gap between the
// grass world and the apples. Star Bits fall, bright chips of every color. Then a few long
// strokes for the gusts themselves, and the corners of the picture brought down a little.
'use strict';
const { studio, open, W, H, MARIO, HOME, RED, GREEN, GOLD, wind, fluff } = require('./scene');
const { mix } = studio;

const p = open('mario');
const r = p.rng;

// The gusts: long faint strokes that go with the wind.
for (let k = 0; k < 9; k++) {
  let x = r.range(-100, 700), y = r.range(120, 760);
  const pts = [[x, y]];
  for (let i = 0; i < 8; i++) { const a = wind(x, y); x += Math.cos(a) * 90; y += Math.sin(a) * 90; pts.push([x, y]); }
  p.stroke({ brush: 'bristle', color: '#ffffff', width: r.range(5, 9), opacity: r.range(0.1, 0.2), mix: 0.4, dry: 0.3, rag: 0.6, taper: [0.5, 0.5], points: pts });
}

// Star Bits: chips of colored crystal, falling. Each has a glow, and a few leave a trail.
const BITS = ['#ffd83a', '#ff5fa8', '#52c4ff', '#7ce04c', '#b884ff', '#ff8a2c'];
const busy = (x, y) => Math.hypot(x - MARIO.x, y - MARIO.y) < 110 || Math.hypot(x - RED.x, y - RED.y) < RED.r + 24 || Math.hypot(x - GREEN.x, y - GREEN.y) < GREEN.r + 20 || Math.hypot(x - GOLD.x, y - GOLD.y) < GOLD.r + 16 || Math.hypot(x - HOME.x, y - HOME.y) < HOME.r + 30;
for (let k = 0, made = 0; k < 80 && made < 22; k++) {
  const x = r.range(40, W - 40), y = r.range(30, 760);
  if (busy(x, y)) continue;
  const color = BITS[made % BITS.length], a = 1.0 + r.range(-0.35, 0.35), len = r.range(12.6, 15), c = Math.cos(a), s = Math.sin(a);
  if (made++ < 6) p.stroke({ brush: 'bristle', color, width: 5, opacity: 0.45, mix: 0.2, dry: 0.2, rag: 0.4, taper: [0.9, 0], points: [[x - c * 100, y - s * 100], [x - c * 46, y - s * 46], [x, y]] });
  for (const b of [a, a + 1.57]) p.stroke({ brush: 'soft', color, width: 13, opacity: 0.4, points: [[x - Math.cos(b) * 14, y - Math.sin(b) * 14], [x + Math.cos(b) * 14, y + Math.sin(b) * 14]] });
  p.line(x - c * len / 2, y - s * len / 2, x + c * len / 2, y + s * len / 2, { color: mix(color, '#ffffff', 0.25), width: 5.5 });
  p.tryStroke({ color: '#ffffff', width: 4, opacity: 0.55, points: [[x - c * 6.2 - s * 1.4, y - s * 6.2 + c * 1.4], [x + c * 6.2 - s * 1.4, y + s * 6.2 + c * 1.4]] });
}

// Floaty Fluffs on the wind.
for (const [x, y, s, d, lean] of [[1180, 660, 0.5, 0.35, 0.3], [880, 214, 0.55, 0.3, 0.4], [1540, 176, 0.5, 0.38, 0.3], [524, 236, 0.8, 0.16, 0.5], [1424, 430, 0.7, 0.2, 0.4], [300, 410, 0.9, 0.1, 0.6], [1000, 740, 1.05, 0.05, 0.5], [1250, 900, 1.5, 0, 0.6], [86, 610, 0.7, 0.1, 0.5]]) {
  fluff(p, x, y, s, { far: d, lean });
}

// Mario, and the Fluff he holds. He is laid out from his raised hand downward.
{
  const { x, y } = MARIO, M = (dx, dy) => [x + dx, y + dy];
  const mark = (a, b, w, color, extra = {}) => p.stroke({ brush: 'bristle', color, width: w, mix: 0, dry: 0, rag: 0, cap: 'round', ...extra, points: [M(...a), M(...b)] });
  fluff(p, x, y - 50, 1.4, { stem: false });
  p.stroke({ color: '#b8a878', width: 4, points: [M(0, -48), M(0.6, -22), M(0, 4)] });           // its stem
  mark([3, 25], [-2, 43.4], 9, '#2850c8');                                   // the blue overalls: his body
  mark([-1, 40], [-7, 55], 6.5, '#2850c8');                                // his legs, drawn up a little
  mark([4, 40], [11, 53], 6.5, '#2850c8');
  mark([-13, 57], [-0.6, 58], 5.5, '#5c3418');                             // his shoes
  mark([6, 56], [18.4, 55], 5.5, '#5c3418');
  mark([1, 8], [3, 24], 6.5, '#e02c24');                                   // the arm that holds on, in its red sleeve
  mark([8, 25], [18, 36], 6, '#e02c24');                                   // the other arm, held out
  mark([17, 34], [26, 42.4], 5, '#ffffff');                                // its white glove
  mark([-3, -4], [0.6, 9], 6, '#ffffff');                                  // the glove on the stem
  mark([3.4, 17.5], [17.8, 19], 7, '#f2c09a');                               // his face
  mark([9, 21.5], [21.4, 22], 4.4, '#3c2414', { brush: 'round' });         // and his moustache
  mark([1, 11.5], [16.6, 12.5], 7.5, '#e02c24');                           // the red cap
  mark([12, 15], [24.4, 15.6], 4.6, '#c8201c');                            // and its peak
}

// The corners, a little deeper, so that the eye stays in the middle of the sky.
for (const [x0, y0, x1, y1, w, o] of [
  [W + 80, -50, 1080, -80, 220, 0.2], [W + 80, H + 40, 900, H + 60, 200, 0.14], [-80, H + 40, 700, H + 60, 200, 0.16],
]) {
  p.stroke({ brush: 'soft', color: '#0c2a78', width: w, opacity: o, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
}

p.save();
