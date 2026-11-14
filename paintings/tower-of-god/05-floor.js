// The floor, and the boy. The floor is great squares of dark stone, worn smooth, so it
// holds the green light; the shade of every bar lies along it toward us, and between the
// shades the light lies in long bright stripes. The boy stands in the middle of the floor,
// small, with his back to us: a dark shape, with the Black March in his right hand.
'use strict';
const { studio, open, W, H, FLOOR, LIGHT, BAM, bright, barShade, nB, nC, hash } = require('./scene');
const { mix, clamp, smooth, glow, disc } = studio;

const p = open('floor');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.12, dry: 0.03, rag: 0.2, cap: 'round' };
// A place of the floor: how far off it is, and where it is across the hall. The squares get smaller far off.
const depth = (y) => 210 / (y - FLOOR + 20), across = (x, y) => (x - LIGHT.x) * depth(y) / 90;
function stone(x, y) {
  const d = depth(y), u = across(x, y), fu = u - Math.floor(u), fd = Math.log(d) * 3 - Math.floor(Math.log(d) * 3), joint = Math.min(fu, 1 - fu) < 0.035 || Math.min(fd, 1 - fd) < 0.05;
  let c = mix('#070b08', '#121a14', hash(Math.floor(u), Math.floor(Math.log(d) * 3)));
  const near = Math.exp(-(y - FLOOR) / 150) * Math.exp(-Math.pow((x - LIGHT.x) / (420 + (y - FLOOR) * 2), 2));   // the light is strongest on the floor near the bars
  c = mix(c, '#a8f080', near * (barShade(x, y) ? 0.14 : 0.85));
  c = mix(c, '#f0ffd8', Math.pow(near, 3) * (barShade(x, y) ? 0 : 0.5));
  if (joint) c = mix(c, '#020403', 0.5);
  return mix(c, '#020403', smooth(860, 1010, y) * 0.5 + (nC(x / 50, y / 10) - 0.5) * 0.1);
}
const ray = (x, y) => Math.atan2(y - LIGHT.y, x - LIGHT.x);                 // the stripes of light and of shade go this way: straight from the light
p.fill({ bounds: [0, FLOOR + 6, W, 790], width: 5.5, length: 60, spacing: 0.5, angle: ray, color: stone, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 780, W, H], width: 8, length: 120, spacing: 0.5, angle: ray, color: stone, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, FLOOR + 6, W, H], width: 5.5, length: 60, spacing: 1.0, overlap: 0.7, angle: ray, color: (x, y) => stone(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { ...line, opacity: 0.8 } });
// the light of the shinsu in the air over the floor, near the bars
for (const [w, op] of [[120, 0.1], [70, 0.14]]) p.stroke({ brush: 'soft', color: '#b8f890', width: w, opacity: op, points: [[LIGHT.x - 520, FLOOR + 10], [LIGHT.x, FLOOR + 24], [LIGHT.x + 520, FLOOR + 10]] });

// ---------------------------------------------------------------- the boy
{
  const { x, y } = BAM, s = 0.66, B = (fx, fy) => [x + fx * s, y - fy * s], dark = '#040705';
  const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, mix: 0, rag: 0.05, ...(width < 4.8 ? { brush: 'round' } : {}), color, width, ...extra, points: pts.map(([a, b]) => B(a, b)) });
  // his shade: long, on the floor, straight away from the light
  { const a = ray(x, y); for (const [w, op] of [[20, 0.4], [12, 0.5]]) p.stroke({ brush: 'soft', color: '#020403', width: w, opacity: op, taper: [0, 0.5], points: [[x, y - 2], [x + Math.cos(a) * 90, y + Math.sin(a) * 90], [x + Math.cos(a) * 200, y + Math.sin(a) * 200]] }); }
  mark([[-8, 80], [-9, 40], [-10, 2]], dark, 8.5); mark([[8, 80], [10, 42], [13, 2]], dark, 8.5);                               // his legs
  mark([[-10, 136], [-10, 106], [-9, 76]], dark, 11); mark([[9, 136], [9, 106], [9, 76]], dark, 11);                            // his coat
  mark([[-18, 138], [0, 142], [18, 138]], dark, 8);                                                                             // his shoulders
  mark([[-20, 134], [-23, 106], [-21, 82]], dark, 6.4);                                                                         // his left arm, down
  mark([[20, 134], [32, 116], [46, 104]], dark, 6.4);                                                                           // his right arm, out to the side, with the needle
  mark([[0, 142], [0, 150 + Math.max(0, 12.6 / s - 8)]], dark, 5.5);                                                            // his neck
  disc(p, ...B(0, 160), 8.6, '#060907', 6.2, { ...line, mix: 0 });                                                              // his head: we see only his hair
  for (const s2 of [-1, 1]) p.tryStroke({ brush: 'round', color: '#9ce078', width: 4, opacity: 0.6, points: [B(s2 * 17.5, 132), B(s2 * 17, 100), B(s2 * 16, 74)] });   // the green light down each side of him
  p.tryStroke({ brush: 'round', color: '#9ce078', width: 4, opacity: 0.6, points: studio.arc(...B(0, 160), 9, -2.9, -0.3, 6) });
  // the Black March: a long thin black needle, held point down and out; a small blue-white light is at its point
  const hand = B(48, 104), tip = B(112, 30);
  p.tryStroke({ brush: 'round', color: '#020403', width: 4.4, points: [B(40, 114), hand, tip] });
  p.tryStroke({ brush: 'round', color: '#c8f0ff', width: 4, opacity: 0.6, points: [[hand[0] + 2, hand[1] - 2], [tip[0] + 2, tip[1] - 2]] });
  glow(p, tip[0], tip[1], 16, '#58c8ff', 0.2, 4);
  p.tryStroke({ brush: 'round', color: '#f0fbff', width: 4, points: [[tip[0] - 6.2, tip[1]], [tip[0] + 6.2, tip[1]]] });
}

// ---------------------------------------------------------------- the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 480, -70, 200, 0.36], [W + 60, -40, 1120, -70, 200, 0.36], [-60, H + 50, 560, H + 60, 150, 0.4], [W + 60, H + 50, 1040, H + 60, 150, 0.4]]) p.stroke({ brush: 'soft', color: '#010302', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
