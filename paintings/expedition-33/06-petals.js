// The Gommage. The people who are of the number go to petals: red and white, they go up
// from the roofs and from the houses that hang in the air, in long streams that the wind
// takes over the water toward the number. Near us each petal is plain; far off they are
// only points. Then the corners of the picture, a tone darker.
'use strict';
const { studio, open, W, H, NUM } = require('./scene');
const { mix, clamp, glow } = studio;

const p = open('petals');
const r = p.rng;
const red = (lit) => (lit ? mix('#c8242c', '#ff6048', r()) : mix('#6c0c16', '#a81c24', r())), white = (lit) => (lit ? mix('#f6e8dc', '#ffffff', r()) : mix('#9c9cac', '#c8c4cc', r()));
// A stream of petals along a line through some places. s0 and s1 are the size of a petal at its two ends; `spread` is how wide the stream is there.
function stream(pts, n, s0, s1, spread) {
  const m = pts.length - 1, at = (t) => { const f = clamp(t, 0, 0.9999) * m, i = Math.floor(f), u = f - i, a = pts[Math.max(0, i - 1)], b = pts[i], c = pts[i + 1], d = pts[Math.min(m, i + 2)]; const cr = (k) => 0.5 * (2 * b[k] + (-a[k] + c[k]) * u + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * u * u + (-a[k] + 3 * b[k] - 3 * c[k] + d[k]) * u * u * u); return [cr(0), cr(1)]; };
  for (let k = 0; k < 7; k++) { const t = k / 7, [x, y] = at(t), [x1, y1] = at(Math.min(1, t + 0.18)), w = spread[0] + (spread[1] - spread[0]) * t; if (Math.hypot(x1 - x, y1 - y) > Math.max(20, w * 1.3)) p.tryStroke({ brush: 'soft', color: '#c8b0a0', width: Math.max(9, w * 0.6), opacity: 0.05 * (1 - t * 0.5), points: [[x, y], [(x + x1) / 2, (y + y1) / 2], [x1, y1]] }); }   // the dust that goes with them
  for (let k = 0; k < n; k++) {
    const t = Math.pow(r(), 1.5), [x0, y0] = at(t), w = spread[0] + (spread[1] - spread[0]) * t, x = x0 + r.gauss() * w * 0.5, y = y0 + r.gauss() * w * 0.4, s = (s0 + (s1 - s0) * t) * r.range(0.6, 1.5), l = Math.max(12.4, s * r.range(1.6, 2.4)), a = r.range(0, Math.PI), lit = r() < 0.6, bend = r.range(-0.3, 0.3) * l;
    if (s > 7 && r() < 0.1) glow(p, x, y, s * 2, '#ffb890', 0.06, 5);
    p.tryStroke({ brush: s > 6 ? 'bristle' : 'round', mix: 0.05, rag: 0.1, cap: 'round', color: r() < 0.62 ? red(lit) : white(lit), width: clamp(s, s > 6 ? 4.8 : 4, 12), opacity: clamp(0.96 - t * 0.5, 0.35, 0.96), taper: [0.7, 0.7], points: [[x - Math.cos(a) * l / 2, y - Math.sin(a) * l / 2], [x - Math.sin(a) * bend * 0.3, y + Math.cos(a) * bend * 0.3], [x + Math.cos(a) * l / 2, y + Math.sin(a) * l / 2]] });
  }
}
stream([[1010, 936], [980, 850], [930, 740], [880, 640], [860, 520]], 150, 9, 4.4, [60, 70]);
stream([[560, 950], [600, 860], [660, 770], [740, 690], [800, 600]], 130, 9, 4.4, [56, 60]);
stream([[1290, 470], [1200, 420], [1100, 380], [1010, 330], [950, 280]], 90, 7, 4.4, [50, 40]);
stream([[1470, 720], [1380, 660], [1280, 620], [1160, 560], [1040, 480]], 90, 8, 4.4, [50, 50]);
stream([[1360, 946], [1330, 880], [1280, 820], [1200, 760]], 60, 10, 6, [50, 60]);
stream([[250, 860], [330, 790], [440, 730], [560, 690]], 70, 8, 4.6, [40, 50]);
// a few near us, large, out of the foot of the picture
for (const [x, y, s, a] of [[700, 968, 15, 0.5], [1180, 980, 17, -0.7], [900, 990, 13, 1.2], [470, 986, 14, -0.3], [1450, 972, 16, 0.9]]) p.tryStroke({ brush: 'bristle', mix: 0.05, rag: 0.1, cap: 'round', color: r() < 0.6 ? red(true) : white(true), width: s, taper: [0.7, 0.7], points: [[x - Math.cos(a) * s * 1.2, y - Math.sin(a) * s * 1.2], [x, y - 3], [x + Math.cos(a) * s * 1.2, y + Math.sin(a) * s * 1.2]] });
// the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 460, -70, 200, 0.4], [W + 60, -40, 1140, -70, 200, 0.4], [-60, H + 50, 520, H + 60, 150, 0.34], [W + 60, H + 50, 1080, H + 60, 150, 0.34]]) p.stroke({ brush: 'soft', color: '#04080c', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });
void NUM; void H;

p.save();
