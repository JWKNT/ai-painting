// The Lifaus plain, at night: grass, level, as far as we can see, with low hills at the edge
// of it and the mist lying on it in bands. The road comes across it from the right and goes
// past the tree. Where the moon finds the grass it is a cold grey green.
'use strict';
const { studio, open, W, H, HORIZON, MOON, TREE, far, ground, halo, nA, nB, nC } = require('./scene');
const { mix, clamp, through, wave } = studio;

const p = open('plain');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.15, dry: 0.04, rag: 0.25, cap: 'round' };

// Low hills at the far edge of it.
for (const [pts, d] of [[[[500, 716], [680, 696], [860, 706], [1040, 690], [1240, 704], [1420, 688], [1600, 700]], 0.7], [[[560, 720], [760, 708], [980, 716], [1180, 706], [1400, 714], [1600, 708]], 0.5]]) {
  const top = through(pts);
  p.fill({ inside: (x, y) => x > pts[0][0] && y > top(x) + 3 * (nB(x / 30, d * 9) - 0.5) && y < HORIZON + 8, bounds: [480, 680, W, HORIZON + 8], width: 7, length: 50, spacing: 0.5, angle: () => r.range(-0.1, 0.1), color: (x, y) => far(mix('#0c1626', '#24385c', nA(x / 90, y / 20)), x, y, d), stroke: { ...line, opacity: 0.9 } });
}

// The grass. Its strokes lie level; far off they are short and the mist is in them, and near us they are long and dark.
const road = through([[444, 742], [640, 756], [900, 792], [1160, 852], [1380, 930], [1560, 1010]]);
const roadHalf = (x) => 5 + 46 * Math.pow(clamp((x - 440) / 1100, 0, 1), 1.5);
const onRoad = (x, y) => x > 440 && Math.abs(y - road(x)) < roadHalf(x);
const grass = (x, y) => {
  const d = clamp((y - HORIZON) / (H - HORIZON), 0, 1), moon = Math.exp(-Math.pow((x - (MOON.x - (y - HORIZON) * 1.4)) / (240 + d * 500), 2)), blade = nC(x / (30 + 100 * d), y / (4 + 14 * d));
  let c = ground(x, y);
  c = mix(c, blade > 0.5 ? '#3c5c6c' : '#04080c', Math.abs(blade - 0.5) * (0.6 + 0.3 * d));
  c = mix(c, '#7c9cac', moon * (0.4 - 0.2 * d) * (blade > 0.42 ? 1 : 0.3));                       // the moon on it
  return c;
};
const level = () => r.range(-0.03, 0.03);
p.fill({ bounds: [0, HORIZON - 4, W, HORIZON + 110], width: 6.5, length: 70, spacing: 0.5, angle: level, color: grass, stroke: { ...line, opacity: 0.95 } });
p.fill({ bounds: [0, HORIZON + 96, W, H], width: 12, length: 130, spacing: 0.5, angle: level, color: grass, stroke: { ...line, opacity: 0.95 } });
// The road: bare earth, pale under the moon. Its strokes go the way it goes; it is worn in two ruts, and grass stands along its edges.
{
  const way = (x) => Math.atan2(road(x + 20) - road(x - 20), 40);
  const earth = (x, y) => {
    const t = (y - road(x)) / roadHalf(x), moon = Math.exp(-Math.pow((x - (MOON.x - (y - HORIZON) * 1.4)) / 700, 2)), d = clamp((y - HORIZON) / (H - HORIZON), 0, 1);
    let c = mix(mix('#3c4a64', '#56667c', nB(x / 60, y / 9)), '#8494ac', moon * 0.5);
    c = mix(c, '#1c2834', Math.pow(Math.abs(t), 3) * 0.7 + (Math.abs(Math.abs(t) - 0.5) < 0.14 ? 0.28 : 0));                       // darker at its edges and in its ruts
    return mix(c, '#0c141c', d * 0.35 + (nC(x / 20, y / 5) - 0.5) * 0.2);
  };
  p.fill({ inside: (x, y) => onRoad(x, y) && x < 960, bounds: [440, 730, 960, 840], width: 5.5, length: 44, spacing: 0.5, angle: (x) => way(x) + r.range(-0.03, 0.03), color: earth, stroke: { ...line, opacity: 0.95 } });
  p.fill({ inside: (x, y) => onRoad(x, y) && x >= 930, bounds: [930, 780, W, H], width: 8.5, length: 70, spacing: 0.5, angle: (x) => way(x) + r.range(-0.03, 0.03), color: earth, stroke: { ...line, opacity: 0.95 } });
  for (const side of [-1, 1]) for (let x = 470; x < W + 10; x += r.range(7, 16)) {                                                // the grass at its edges
    const hw = roadHalf(x), y = road(x) + side * (hw + r.range(-2, 4)), h = Math.max(12.5, hw * r.range(0.3, 0.6));
    p.tryStroke({ ...line, color: mix(grass(x, y + side * 6), '#04080c', r() * 0.4), width: clamp(hw * 0.2, 4.8, 9), opacity: 0.85, taper: [0, 0.7], points: [[x, y + 3], [x + r.range(2, 7), y + 3 - h]] });
  }
}
// Blades that stand up near us, bent by the wind. Far off the grass is only its level strokes.
p.fill({ inside: (x, y) => !onRoad(x, y) && r() < (y - 850) / 110, bounds: [0, 850, W, H], width: 5.5, length: 20, spacing: 1.9, overlap: 0.7, angle: () => -Math.PI / 2 + 0.3 + r.range(-0.5, 0.4), color: (x, y) => mix(grass(x, y), r() < 0.3 ? '#56747c' : '#04080c', r() * 0.35), stroke: { ...line, opacity: 0.5, taper: [0, 0.7] } });

// The mist on the plain: long level bands, thick far off and thin near us.
for (let k = 0; k < 22; k++) {
  const y = HORIZON + Math.pow(r(), 1.8) * 200 - 6, x = r.range(-200, W - 200), len = r.range(300, 700);
  p.stroke({ brush: 'soft', color: mix('#4c64a0', '#a8bce8', halo(x + len / 2, y - 300, 900)), width: r.range(20, 44), opacity: r.range(0.1, 0.22), points: wave(x, y, x + len, y + r.range(-5, 5), 3, 1, 7) });
}
// The dark of the tree's shade on the grass, away from the moon.
p.stroke({ brush: 'soft', color: '#04070c', width: 110, opacity: 0.4, points: [[TREE.x + 60, TREE.foot + 30], [TREE.x - 140, TREE.foot + 90], [TREE.x - 420, TREE.foot + 150]] });

p.save();
