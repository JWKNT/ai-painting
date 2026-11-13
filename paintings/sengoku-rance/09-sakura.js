// Cherry branches hanging into the picture from the top corners, heavy with blossom, and
// petals carried across the whole scene by the wind.
'use strict';
const { studio, open, W, H } = require('./scene');
const { mix, clamp } = studio;

const p = open('sakura');
const r = p.rng;

// A limb: dark bark, tapering, with light along its upper side.
function limb(pts, width) {
  p.stroke({ brush: 'bristle', color: '#3b2520', width, taper: [0, 0.9], mix: 0, dry: 0, rag: 0, cap: 'round', jitter: 0.4, streak: 0.2, points: pts });
  if (width >= 9) p.tryStroke({ color: '#7a5644', width: Math.max(4, width * 0.25), opacity: 0.7, taper: [0, 0.9], points: pts.map(([x, y]) => [x + 1, y - width * 0.3]) });
}
// A spray of blossom: dabs of pink, deep in the middle of the spray and nearly white at its sunlit edge.
function spray(x, y, size) {
  const dabs = [];
  for (let k = 0; k < Math.round(8 + size * 0.42); k++) { const a = r() * 6.283, d = Math.sqrt(r()) * size; dabs.push([x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8]); }
  dabs.sort((a, b) => (a[0] - a[1]) - (b[0] - b[1]));
  for (const [dx, dy] of dabs) {
    const light = clamp(0.5 + ((dx - x) - (dy - y)) / (size * 2.4) + r.range(-0.2, 0.2), 0, 1);
    const color = light < 0.35 ? mix('#d6658f', '#ee92b4', light / 0.35) : light < 0.75 ? mix('#ee92b4', '#fdc6d8', (light - 0.35) / 0.4) : mix('#fdc6d8', '#fff4f7', (light - 0.75) / 0.25);
    const w = r.range(9, 17), a = r.range(0, 3.14), len = w * 2.12 + 1;
    p.tryStroke({ brush: 'bristle', color, width: w, opacity: 0.96, mix: 0.08, dry: 0, rag: 0.25, streak: 0.12, points: [[dx - Math.cos(a) * len / 2, dy - Math.sin(a) * len / 2], [dx + r.range(-1.5, 1.5), dy + r.range(-1.5, 1.5)], [dx + Math.cos(a) * len / 2, dy + Math.sin(a) * len / 2]] });
  }
  for (let k = 0; k < Math.round(size / 9); k++) {                 // the dark hearts of a few flowers
    const a = r() * 6.283, d = r() * size * 0.7, fx = x + Math.cos(a) * d, fy = y + Math.sin(a) * d * 0.8, t = r() * 3.14;
    p.line(fx - Math.cos(t) * 6.2, fy - Math.sin(t) * 6.2, fx + Math.cos(t) * 6.2, fy + Math.sin(t) * 6.2, { color: '#c44a78', width: 4, opacity: 0.6 });
  }
}

// The left corner.
limb([[-30, 40], [110, 90], [250, 80], [390, 116], [520, 100], [620, 124]], 24);
limb([[110, 90], [170, 150], [236, 186], [300, 190]], 13);
limb([[250, 80], [320, 34], [400, 14], [470, 22]], 12);
limb([[390, 116], [436, 168], [470, 210]], 10);
limb([[-30, 236], [70, 254], [160, 232], [250, 250], [320, 240]], 15);
limb([[160, 232], [200, 290], [236, 322]], 9);
limb([[520, 100], [560, 60], [610, 44]], 8);
for (const [x, y, size] of [
  [40, 36, 44], [150, 62, 50], [96, 128, 40], [228, 62, 44], [300, 104, 46], [190, 168, 42], [286, 196, 40], [336, 24, 40], [430, 14, 38], [486, 30, 30],
  [372, 96, 38], [452, 136, 40], [476, 208, 34], [540, 92, 36], [610, 50, 30], [628, 128, 30], [30, 230, 42], [104, 262, 40], [196, 240, 40], [262, 262, 36], [330, 238, 32], [226, 316, 34], [8, 132, 38],
]) spray(x, y, size);

// The right corner.
limb([[1640, 30], [1540, 74], [1450, 56], [1372, 86]], 18);
limb([[1540, 74], [1508, 136], [1462, 166]], 10);
limb([[1640, 190], [1570, 204], [1516, 236]], 10);
for (const [x, y, size] of [[1596, 36, 42], [1520, 56, 40], [1446, 48, 38], [1378, 84, 32], [1500, 140, 36], [1458, 172, 30], [1590, 196, 38], [1522, 240, 30], [1572, 104, 34]]) spray(x, y, size);

// Petals on the wind: small and sharp far off, larger and soft close to us.
for (let k = 0; k < 150; k++) {
  const near = Math.pow(r(), 1.7), x = r.range(-20, W + 20), y = r.range(-10, H + 10);
  const gust = Math.sin((x * 0.55 - y) / 190) * 0.5 + 0.5;          // they come in bands
  if (r() > 0.3 + 0.7 * gust) continue;
  const a = 0.45 + r.range(-0.9, 0.9), color = r.pick(['#ffd7e3', '#ffe9f0', '#f9b4cb', '#ffffff', '#fcc3d6']);
  if (near > 0.55) {
    const w = 8 + (near - 0.55) * 14, len = w * 2.1 + 1;
    p.tryStroke({ brush: 'soft', hardness: 0.35, color, width: Math.max(6, w), opacity: r.range(0.6, 0.9), points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + 2, y - 2], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
  } else {
    const w = 4 + near * 5, len = Math.max(12.4, w * 2.1 + 1);
    p.tryStroke({ color, width: w, opacity: r.range(0.7, 1), points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + 1.5, y - 1.5], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
  }
}

p.save();
