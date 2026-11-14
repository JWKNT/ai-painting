// What is near us: the rise of rock that we look from. It goes across the foot of the
// picture, high at the left and low in the middle. Its rock lies in beds; dry brush grows
// on it; and each stone and each stem has a thin line of rose on the side that is turned
// to the bright sky. Then the corners of the picture, a tone darker.
'use strict';
const { studio, open, W, H, nA, nC } = require('./scene');
const { mix, clamp, smooth, through, solid, glint } = studio;

const p = open('near');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.03, rag: 0.2, cap: 'round' };
const top = through([[0, 842], [130, 826], [290, 848], [450, 892], [600, 938], [770, 970], [990, 984], [1210, 978], [1410, 956], [1600, 926]]);
const cool = (x) => smooth(700, 1250, x);                                       // at the right the rise is in the shade of the great klaxosaur
// the rise: dark rock, in beds that lie nearly level
p.fill({ inside: (x, y) => y > top(x) + 5 * (nC(x / 20, 3) - 0.5), bounds: [0, 800, W, H], width: 11, length: 90, spacing: 0.5, angle: (x) => 0.1 - 0.16 * smooth(900, 1600, x) + r.range(-0.05, 0.05), color: (x, y) => mix(mix(mix('#170d16', '#2c1a24', nA(x / 60, y / 14)), '#131226', cool(x) * 0.6), '#06040a', clamp((y - top(x)) / 150, 0, 1) * 0.65), stroke: { ...line, opacity: 0.97 } });
// the lines between the beds
for (let k = 0; k < 26; k++) { const x = r.range(-20, W), y = top(x) + r.range(12, 90), len = r.range(60, 200); if (y < H - 6) p.tryStroke({ brush: 'round', color: '#05030a', width: 4, opacity: 0.5, taper: [0.3, 0.3], points: [[x, y], [x + len / 2, y + len * 0.05 + r.range(-2, 2)], [x + len, y + len * 0.1]] }); }
// the light of the sky along its edge: rose at the left, where the bright sky is open to it, and a faint blue at the right
{ const pts = []; for (let x = 0; x <= W; x += 24) pts.push([x, top(x) + 3]); glint(p, pts.filter(([x]) => x < 900), () => mix('#c8705a', '#f0a880', r()), { width: 4.8, dash: 46, gap: 30, opacity: 0.6, rng: r }); glint(p, pts.filter(([x]) => x > 860), () => mix('#3c4474', '#5a6494', r()), { width: 4.6, dash: 50, gap: 30, opacity: 0.45, rng: r }); }
// rocks that stand on it
const rock = (x) => ({ shadow: '#0b070d', half: mix('#1f1420', '#16152a', cool(x)), lit: mix('#5a323a', '#252a48', cool(x)), rim: mix('#f0a070', '#3c4674', cool(x)), bounce: '#161828' });
const rocks = [[[60, 846, 44], [128, 816, 58], [204, 842, 42]], [[322, 884, 28], [366, 870, 36], [408, 894, 24]], [[1452, 950, 34], [1512, 930, 48], [1580, 946, 36]], [[1196, 984, 22], [1236, 976, 26]], [[-20, 900, 40], [30, 880, 30]]];
for (const chain of rocks) solid(p, chain, rock(chain[1][0]), { light: [0.9, -0.42], turn: 0.42, width: 7, length: 30, vary: 0.1, flow: () => 0.15, dash: 26, gap: 10, edgeOpacity: 0.8 });
// cracks in the rocks: thin dark lines down them
for (const chain of rocks) for (let k = 0; k < 3; k++) { const [cx, cy, rad] = r.pick(chain), x = cx + r.range(-0.5, 0.5) * rad, y = cy - rad * r.range(0.2, 0.7), l = Math.max(14, rad * r.range(0.5, 0.9)); p.tryStroke({ brush: 'round', color: '#06040a', width: 4, opacity: 0.55, taper: [0.1, 0.6], points: [[x, y], [x + r.range(-5, 5), y + l * 0.5], [x + r.range(-9, 9), y + l]] }); }
// dry brush: tufts of thin stems that lean with the wind, to the left. A stem is dark; some have the light on one side.
function tuft(x, y, size, n) {
  for (let k = 0; k < n; k++) {
    const h = size * r.range(0.5, 1.1), lean = -0.34 + r.gauss() * 0.34, bx = x + r.range(-0.3, 0.3) * size, tip = [bx + lean * h + r.range(-3, 3), y - h], mid = [bx + lean * h * 0.3, y - h * 0.55];
    p.tryStroke({ ...line, rag: 0.05, color: mix('#090509', '#1e1218', r()), width: r.range(4.8, 5.6), taper: [0, 0.85], points: [[bx, y + 5], mid, tip] });
    if (r() < 0.42) p.tryStroke({ brush: 'round', color: mix(mix('#c87858', '#f4b488', r()), '#3e4a78', cool(x)), width: 4, opacity: 0.55 - 0.2 * cool(x), taper: [0.1, 0.8], points: [[bx + 2.4, y + 2], [mid[0] + 2.4, mid[1]], [tip[0] + 1.6, tip[1] + 2]] });
  }
}
for (let k = 0; k < 44; k++) { const x = r.range(-10, W + 10), s = r.range(24, 60) * (x < 700 ? 1 : 0.75); tuft(x, top(x) + r.range(0, 16), s, 4 + Math.floor(r() * 5)); }
for (const [x, y, s, n] of [[250, 846, 76, 10], [470, 900, 64, 9], [20, 842, 70, 9], [640, 950, 56, 8], [1330, 966, 52, 8]]) tuft(x, y, s, n);
// the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, H + 50, 560, H + 60, 150, 0.36], [W + 60, H + 50, 1040, H + 60, 150, 0.3], [-60, -40, 460, -70, 190, 0.28], [W + 60, -40, 1140, -70, 190, 0.2]]) p.stroke({ brush: 'soft', color: '#08050c', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
