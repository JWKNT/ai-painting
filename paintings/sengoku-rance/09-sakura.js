// Cherry branches hanging into the picture from the top corners, heavy with blossom, and
// petals carried across the whole scene by the wind. The branches are dark against the sky;
// the blossom is dusky in its depths and takes fire along the edges that face the sunrise.
'use strict';
const { studio, open, W, H, SUN, glow } = require('./scene');
const { mix, clamp, mass, glint, ramp, curve } = studio;

const p = open('sakura');
const r = p.rng;
const toSun = (x, y) => { const dx = SUN.x - x, dy = SUN.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l, dy / l]; };

// A limb: dark bark, tapering, with a thread of warm light along the side toward the sun.
// Blossom gathers along it: the limb gives back the places where it sits.
function limb(pts, width) {
  p.stroke({ brush: 'bristle', color: '#1c1218', width, taper: [0, 0.9], mix: 0, dry: 0, rag: 0, cap: 'round', jitter: 0.4, streak: 0.2, points: pts });
  if (width >= 9) glint(p, pts.map(([x, y]) => { const [lx, ly] = toSun(x, y); return [x + lx * width * 0.3, y + ly * width * 0.3]; }), () => mix('#a85c4c', '#f0a070', r()), { width: 4.2, dash: 30, gap: 16, opacity: 0.6 });
  const puffs = [], line = curve(pts, 6);
  for (let i = 2; i < line.length; i += Math.round(r.range(2, 5))) {
    if (r() < 0.3) { i += 3; continue; }                            // gaps, where the bark shows
    const along = i / line.length, rad = r.range(13, 21) * (0.75 + 0.5 * along);
    puffs.push([line[i][0] + r.range(-10, 10), line[i][1] + r.range(-12, 8), rad]);
  }
  return puffs;
}
// Blossom: sprays at the ends of the twigs and puffs along the limbs, all painted as one mass
// of short strokes.
const tones = (t) => ramp(['#44224a', '#74386a', '#b25888', '#ea90b2', '#ffd0dc'], t);
function blossom(sprays, along, seed) {
  const puffs = along.slice();
  for (const [x, y, size] of sprays) {
    puffs.push([x, y, size * 0.6]);
    for (let k = 0; k < 5; k++) { const a = r() * 6.283, d = size * r.range(0.5, 0.95); puffs.push([x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8, size * r.range(0.3, 0.46)]); }
  }
  mass(p, puffs, { light: toSun, tones, bias: 0.34, contrast: 0.75, grain: 0.36, mix: 0.2, layers: [[9, 20, 0.96, 3.5, 0.45], [6, 14, 0.9, 2.5, 0.72]], crown: '#fff0ea', crownOpacity: 0.8, crownSpan: 0.4, seed });
  for (const [x, y, size] of sprays) {                              // the dark hearts of a few flowers
    for (let k = 0; k < Math.round(size / 12); k++) {
      const a = r() * 6.283, d = r() * size * 0.6, fx = x + Math.cos(a) * d, fy = y + Math.sin(a) * d * 0.8, t = r() * 3.14;
      p.line(fx - Math.cos(t) * 6.2, fy - Math.sin(t) * 6.2, fx + Math.cos(t) * 6.2, fy + Math.sin(t) * 6.2, { color: '#3a1838', width: 4, opacity: 0.4 });
    }
  }
}

// The left corner.
const left = [
  limb([[-30, 40], [110, 90], [250, 80], [390, 116], [520, 100], [620, 124]], 24),
  limb([[110, 90], [170, 150], [236, 186], [300, 190]], 13),
  limb([[250, 80], [320, 34], [400, 14], [470, 22]], 12),
  limb([[390, 116], [436, 168], [470, 210]], 10),
  limb([[-30, 236], [70, 254], [160, 232], [250, 250], [320, 240]], 15),
  limb([[160, 232], [200, 290], [236, 322]], 9),
  limb([[520, 100], [560, 60], [610, 44]], 8),
].flat();
blossom([
  [40, 36, 44], [150, 62, 50], [96, 128, 40], [228, 62, 44], [300, 104, 46], [190, 168, 42], [286, 196, 40], [336, 24, 40], [430, 14, 38], [486, 30, 30],
  [372, 96, 38], [452, 136, 40], [476, 208, 34], [540, 92, 36], [610, 50, 30], [628, 128, 30], [30, 230, 42], [104, 262, 40], [196, 240, 40], [262, 262, 36], [330, 238, 32], [226, 316, 34], [8, 132, 38],
], left, 5);

// The right corner.
const right = [
  limb([[1640, 30], [1540, 74], [1450, 56], [1372, 86]], 18),
  limb([[1540, 74], [1508, 136], [1462, 166]], 10),
  limb([[1640, 190], [1570, 204], [1516, 236]], 10),
].flat();
blossom([[1596, 36, 42], [1520, 56, 40], [1446, 48, 38], [1378, 84, 32], [1500, 140, 36], [1458, 172, 30], [1590, 196, 38], [1522, 240, 30], [1572, 104, 34]], right, 6);

// Petals on the wind: small and sharp far off, larger and soft close to us. Those against
// the bright part of the sky are dark flecks; those against the dark take the light.
for (let k = 0; k < 170; k++) {
  const near = Math.pow(r(), 1.7), x = r.range(-20, W + 20), y = r.range(-10, H + 10);
  const gust = Math.sin((x * 0.55 - y) / 190) * 0.5 + 0.5;          // they come in bands
  if (r() > 0.3 + 0.7 * gust) continue;
  const a = 0.45 + r.range(-0.9, 0.9), bright = glow(x, y, 330) > 0.35 && y < 520;
  const color = bright ? r.pick(['#c87c98', '#b0688c', '#d894a8']) : r.pick(['#ffd7e3', '#ffe9f0', '#f9b4cb', '#fff6f2', '#fcc3d6']);
  if (near > 0.55) {
    const w = 8 + (near - 0.55) * 14, len = w * 2.1 + 1;
    p.tryStroke({ brush: 'soft', hardness: 0.35, color, width: Math.max(6, w), opacity: r.range(0.55, 0.85), points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + 2, y - 2], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
  } else {
    const w = 4 + near * 5, len = Math.max(12.4, w * 2.1 + 1);
    p.tryStroke({ color, width: w, opacity: r.range(0.6, 0.95), points: [[x - Math.cos(a) * len / 2, y - Math.sin(a) * len / 2], [x + 1.5, y - 1.5], [x + Math.cos(a) * len / 2, y + Math.sin(a) * len / 2]] });
  }
}

p.save();
