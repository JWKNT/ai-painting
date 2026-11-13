// The grass world close to us: a ball of meadow, bright where the light is on it and deep
// green in its shadow, with flowers all over it, a tree, and a small white rabbit that has
// stopped to watch. From its side a vine has grown up toward the apples, curling as it goes.
'use strict';
const { studio, open, H, SUNWARD, HOME, wind, lambert, ball, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, solid, mass } = studio;

const p = open('home');
const r = p.rng;
const { x: cx, y: cy, r: R } = HOME;
const grass = { shadow: '#0f4a2a', half: '#2c9032', lit: '#7fd444', shine: '#c6f070', bounce: '#1c5e66' };
const on = (deg, lift = 0) => { const a = deg * Math.PI / 180; return [cx + Math.cos(a) * (R + lift), cy + Math.sin(a) * (R + lift)]; };   // a place on its outline, by its angle

// The meadow: darker and lighter where the grass is long or short, and yellow where there is clover.
const world = ball(p, [[cx, cy, R]], grass, { grain: 0.3, width: 20, flow: (x, y) => Math.atan2(y - (cy + 1.6 * R), x - cx) + Math.PI / 2 + (nC(x / 90, y / 60) - 0.5) * 0.3, tint: (c, x, y) => mix(mix(c, '#dfe45c', smooth(0.62, 0.8, nB(x / 110, y / 90)) * 0.3), '#0c4024', smooth(0.4, 0.2, nA(x / 80, y / 70)) * 0.3) });
const lightAt = (x, y) => lambert(x, y, cx, cy, R * 1.03);

// The shadow of the tree, lying over the curve of the ground.
p.stroke({ brush: 'soft', color: '#083420', width: 70, opacity: 0.45, points: [on(-112, -20), on(-98, -60), on(-86, -92)] });

// Grass: blades all over it, each standing straight out from the ground where it grows, so
// that they point every way round the ball and are longest along its edge.
for (let k = 0; k < 1700; k++) {
  const a = r.range(0, 6.283), q = Math.sqrt(r()), x = cx + Math.cos(a) * R * q, y = cy + Math.sin(a) * R * q;
  if (q < 0.4 || y > H + 10 || x < -10 || nC(x / 60, y / 60) < 0.3) continue;   // in the middle of the ball the blades point at us and do not show
  const len = Math.max(12.4, 6 + 26 * q) * r.range(0.8, 1.2), l = lightAt(x, y), lean = wind(x, y) * 0.5;
  const dx = Math.cos(a + lean * (1 - q)), dy = Math.sin(a + lean * (1 - q));
  p.tryStroke({ color: l > 0.25 && r() < 0.6 ? mix('#8cd848', '#e2f67c', r()) : world.tone(x, y), width: r.range(4, 5.5), opacity: 0.9, taper: [0, 0.7], points: [[x, y], [x + dx * len * 0.6 + 0.2 * len * Math.cos(lean), y + dy * len * 0.6], [x + dx * len + 0.3 * len, y + dy * len]] });
}
// The blades along its edge, against the sky: they lean over with the wind.
for (let deg = -178; deg < -2; deg += r.range(0.5, 1.3)) {
  const [x, y] = on(deg, -3), a = deg * Math.PI / 180, len = r.range(14, 30), l = lightAt(x - Math.cos(a) * 8, y - Math.sin(a) * 8);
  p.tryStroke({ color: l > 0.2 ? mix('#6cc83c', '#dcf47a', r()) : mix('#145a2c', '#2c8a34', r()), width: r.range(4, 5.2), taper: [0, 0.75], points: [[x, y], [x + Math.cos(a) * len * 0.6 + 4, y + Math.sin(a) * len * 0.6], [x + Math.cos(a) * len + 12, y + Math.sin(a) * len + 2]] });
}

// Flowers, in drifts: white, yellow and pink. Each is a few short strokes that cross at its
// heart. Far round the curve of the ball they are seen from the side and are narrower.
for (let k = 0; k < 240; k++) {
  const a = r.range(0, 6.283), q = Math.sqrt(r()) * 0.95, x = cx + Math.cos(a) * R * q, y = cy + Math.sin(a) * R * q;
  if (y > H || x < 0 || nB(x / 90, y / 80 + 7) < 0.5) continue;
  const flat = Math.sqrt(1 - q * q), l = lightAt(x, y), len = 12.4 + 3 * flat;
  const color = mix(r.pick(['#ffffff', '#fff06a', '#ff9cc4', '#ffffff', '#ffd24a']), '#1c5e66', clamp(0.25 - l, 0, 0.6));
  const turn = r.range(0, 3.14), petals = flat > 0.45 ? 3 : 2;
  for (let i = 0; i < petals; i++) {
    const b = turn + i * Math.PI / petals, ux = Math.cos(b), uy = Math.sin(b);
    // squash it along the line from the middle of the ball, as the ground turns away
    const rx = Math.cos(a), ry = Math.sin(a), along = ux * rx + uy * ry, sx = ux - rx * along * (1 - Math.max(0.35, flat)), sy = uy - ry * along * (1 - Math.max(0.35, flat)), sl = Math.hypot(sx, sy) || 1;
    p.tryStroke({ color, width: 4.4, opacity: 0.95, points: [[x - sx / sl * len / 2, y - sy / sl * len / 2], [x + sx / sl * len / 2, y + sy / sl * len / 2]] });
  }
}

// The tree: a trunk leaning a little, and a round head of leaves.
{
  const foot = on(-112, -6), top = on(-114, 104), bark = { shadow: '#2a1810', half: '#5c3c22', lit: '#b08450', rim: '#f0d49c', bounce: '#2c4050' };
  solid(p, [[foot[0], foot[1], 15], [(foot[0] + top[0]) / 2 + 4, (foot[1] + top[1]) / 2, 11], [top[0], top[1], 9]], bark, { light: SUNWARD, turn: 0.1, width: 5.5, length: 26, vary: 0.06, dash: 20, gap: 12, edgeOpacity: 0.7 });
  const [tx, ty] = on(-114, 150), puffs = [[tx, ty, 54], [tx - 46, ty + 20, 36], [tx + 48, ty + 14, 38], [tx - 10, ty - 42, 36], [tx + 32, ty - 30, 32], [tx - 42, ty - 20, 32], [tx + 4, ty + 34, 34], [tx - 62, ty - 2, 24], [tx + 64, ty - 6, 24]];
  mass(p, puffs, { light: SUNWARD, tones: (t) => (t < 0.5 ? mix('#0d4a26', '#2f9234', t * 2) : mix('#2f9234', '#b4e456', t * 2 - 1)), bias: 0.42, contrast: 0.72, grain: 0.32, mix: 0.2, seed: 9, layers: [[13, 30, 0.96, 4.5, 0.45], [8, 18, 0.88, 3, 0.75]] });
  for (let k = 0; k < 60; k++) {                                         // leaves at its edge, in the light and out of it
    const a = r.range(0, 6.283), d = r.range(0.7, 1.08), q = puffs[Math.floor(r() * puffs.length)], x = q[0] + Math.cos(a) * q[2] * d, y = q[1] + Math.sin(a) * q[2] * d, lit = Math.cos(a) * SUNWARD[0] + Math.sin(a) * SUNWARD[1] > 0.1, b = r.range(0, 3.14), len = r.range(14, 22);
    p.tryStroke({ brush: 'bristle', color: lit ? mix('#9cdc4c', '#e6f884', r()) : mix('#0d4a26', '#1f6c2c', r()), width: r.range(6, 9), opacity: 0.92, taper: [0.15, 0.6], mix: 0.05, dry: 0, rag: 0.15, cap: 'round', points: [[x, y], [x + Math.cos(b) * len, y + Math.sin(b) * len]] });
  }
}

// The rabbit: white, sitting up, its ears straight. It is very small.
{
  const [bx, by] = on(-73, 0), fur = { shadow: '#8094c8', half: '#d0dcf4', lit: '#ffffff', rim: '#ffffff', bounce: '#8cb4a0' };
  solid(p, [[bx, by - 12, 14], [bx + 3, by - 22, 12]], fur, { light: SUNWARD, turn: 0, width: 5, length: 16, vary: 0.04, edge: false });      // its body
  solid(p, [[bx + 6, by - 38, 9.5], [bx + 9, by - 40, 9.5]], fur, { light: SUNWARD, turn: 0, width: 5, length: 14, vary: 0.04, edge: false });   // its head
  for (const dx of [2, 10]) p.tryStroke({ brush: 'bristle', color: dx < 5 ? '#ffffff' : '#c4d2f0', width: 6, taper: [0, 0.4], mix: 0, dry: 0, rag: 0, cap: 'round', points: [[bx + dx, by - 44], [bx + dx - 2, by - 56], [bx + dx - 3, by - 68]] });   // its ears
  p.tryStroke({ color: '#ffb0c4', width: 4, opacity: 0.8, points: [[bx + 8.6, by - 48], [bx + 6.6, by - 62]] });
}

// The vine: out of the ground at the world's side, up and across toward the red apple, with
// one loop on the way and a curl at its tip. Leaves grow from it in pairs.
{
  const path = [on(-48, -8), [562, 612], [612, 572], [668, 560], [700, 582], [692, 614], [658, 612], [650, 582], [688, 550], [748, 540], [800, 548], [836, 528], [856, 502], [870, 482], [860, 466], [844, 474], [848, 490]];
  const vine = { shadow: '#0f4a24', half: '#2c8c30', lit: '#8cd848', rim: '#e6faa4', bounce: '#1c5e66' };
  solid(p, path.map(([x, y], i) => [x, y, 11 - 6 * i / (path.length - 1)]), vine, { light: SUNWARD, turn: 0.1, width: 5, length: 26, vary: 0.06, dash: 22, gap: 10, edgeOpacity: 0.85 });
  for (const i of [1, 2, 3, 8, 9, 10, 11]) {
    const [x, y] = path[i], [nx, ny] = path[i + 1], a = Math.atan2(ny - y, nx - x);
    for (const s of [-1, 1]) {
      const b = a + s * r.range(1.0, 1.5), len = r.range(44, 62) * (1 - i / 30), tip = [x + Math.cos(b) * len, y + Math.sin(b) * len], lit = Math.cos(b) * SUNWARD[0] + Math.sin(b) * SUNWARD[1] > -0.2;
      p.tryStroke({ brush: 'bristle', color: lit ? mix('#6cc83c', '#a8e454', r()) : mix('#145a2c', '#2c8a34', r()), width: len * 0.42, taper: [0.4, 0.5], mix: 0, dry: 0, rag: 0.05, cap: 'round', points: [[x, y], [x + Math.cos(b - s * 0.3) * len * 0.55, y + Math.sin(b - s * 0.3) * len * 0.55], tip] });
      p.tryStroke({ color: lit ? '#e2f88c' : '#0c4022', width: 4, opacity: 0.6, taper: [0, 0.5], points: [[x, y], tip] });   // its rib
    }
  }
}

p.save();
