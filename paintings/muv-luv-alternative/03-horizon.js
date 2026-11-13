// The far field: the monument of the Hive standing on the horizon, smoke going up from the
// fires, shells coming in from our side, and the lasers of the Laser-class reaching up from
// the ground to meet them. Then the horde itself where it is farthest off: a dark fringe
// along the whole horizon, with dust under it.
'use strict';
const { studio, open, W, HORIZON, glow, toFire, skyColor, veil, nA, nB } = require('./scene');
const { mix, wave, clamp, glint, arc, mass } = studio;

const p = open('horizon');
const r = p.rng;
const ember = () => mix('#ff8a3a', '#ffd088', r());

// ---------------------------------------------------------------- the Hive
// A monument: a crag of the BETA's own building, taller than any mountain near it, with
// lesser spires round its foot. It is far off, so the smoke between has taken its darks.
{
  const bx = 270, by = HORIZON + 8, rock = (x, y) => veil(mix('#120c1c', '#22142a', nA(x / 20, y / 30)), x, y, 0.42);
  const spire = (dx, h, w, lean = 0) => {
    for (let k = 0; k < 3; k++) {
      const off = (k - 1) * w * 0.28, hh = h * (1 - 0.16 * Math.abs(k - 1)) * r.range(0.94, 1.04), x = bx + dx + off;
      p.stroke({ brush: 'bristle', color: rock(x, by - hh / 2), width: Math.min(w * (k === 1 ? 0.62 : 0.5), hh / 2.3), mix: 0, dry: 0, rag: 0.25, cap: 'flat', taper: [0, 0.92], streak: 0.3, jitter: 0.4, points: [[x, by], [x + lean * hh * 0.4 + r.range(-3, 3), by - hh * 0.55], [x + lean * hh + r.range(-3, 3), by - hh]] });
    }
  };
  for (const [dx, h, w, lean] of [[-150, 70, 60, 0.05], [-96, 150, 64, 0.03], [128, 96, 70, -0.05], [84, 176, 66, -0.03], [-40, 232, 74, 0.01], [26, 268, 92, -0.012], [182, 54, 60, -0.1]]) spire(dx, h, w, lean);
  // its strata: thin level shadows up the whole height of it
  for (let k = 0; k < 90; k++) {
    const y = by - r.range(8, 250), half = 20 + (by - y) * -0.0 + (250 - (by - y)) * 0.42, x = bx + r.range(-1, 1) * half * 0.9, len = r.range(12.6, 30);
    if (Math.abs(x - bx) > half * 0.86) continue;
    p.tryStroke({ brush: 'bristle', color: mix(rock(x, y), '#07050e', 0.5), width: 4.4, opacity: r.range(0.25, 0.5), mix: 0.1, dry: 0.05, rag: 0.2, points: [[x - len / 2, y], [x + len / 2, y + r.range(-1, 1)]] });
  }
  // the glare on the side toward it
  for (const [dx, h] of [[26, 268], [84, 176], [128, 96], [-40, 232]]) {
    glint(p, [[bx + dx + 26, by - 10], [bx + dx + 18, by - h * 0.5], [bx + dx + 5, by - h * 0.92]], ember, { width: 4, dash: 26, gap: 22, opacity: 0.4, rng: r });
  }
  for (let k = 0; k < 4; k++) p.stroke({ brush: 'soft', color: mix('#3a1626', '#8a2c2c', r()), width: r.range(40, 70), opacity: r.range(0.14, 0.24), points: wave(bx - 260 + k * 30, by - r.range(10, 70), bx + 300, by - r.range(10, 60), 6, 1.2, 9) });   // smoke lying across its foot
}

// ---------------------------------------------------------------- smoke from the fires on the field
// A column of smoke: billows one above another, growing as they rise and leaning with the
// wind. It is black, and red low down where the fire under it lights it.
function column(x0, h, lean, w0) {
  const puffs = [], path = (t) => [x0 + lean * h * t * t + Math.sin(t * 6 + x0) * 12 * t, HORIZON + 4 - h * t];
  for (let t = 0; t <= 1; t += 0.07) {
    const [x, y] = path(t), rad = w0 * (0.45 + 1.5 * t);
    puffs.push([x + r.range(-0.3, 0.3) * rad, y, rad * r.range(0.8, 1.1)]);
    if (t > 0.25) puffs.push([x + r.range(-0.9, 0.9) * rad, y + r.range(-0.4, 0.4) * rad, rad * r.range(0.5, 0.75)]);
  }
  const tones = (t, x, y) => {
    const up = clamp((HORIZON - y) / h, 0, 1), low = clamp(1 - up * 2, 0, 1);
    const c = mix(mix('#0d0a14', '#2a1826', t), mix('#7a2424', '#f0702c', t), low * (0.25 + 0.6 * t));
    return mix(c, skyColor(x, y), 0.22 + 0.4 * up);                     // it thins into the sky as it rises
  };
  mass(p, puffs, { light: (x, y) => { const [lx, ly] = toFire(x, y); return [lx * 0.6, ly * 0.6 + 0.6]; }, tones, bias: 0.4, contrast: 0.6, grain: 0.25, mix: 0.3, seed: Math.round(x0), stroke: { rag: 0.4, hardness: 0.7 },
    flow: (x, y) => -1.2 + lean * 0.8 + (nB(x / 40, y / 40) - 0.5) * 1.2,
    layers: [[Math.max(8, w0 * 0.42), w0 * 1.8, 0.92, Math.max(3.5, w0 * 0.16), 0.45], [Math.max(6, w0 * 0.24), w0, 0.8, Math.max(2.5, w0 * 0.1), 0.75]] });
}
column(1010, 300, 0.42, 26);
column(1432, 230, 0.36, 22);
column(120, 150, 0.6, 18);

// ---------------------------------------------------------------- shells and lasers
// Shells come in high from behind us. A laser reaches up from the ground to each, and where
// it finds one there is a burst.
const bursts = [[660, 96], [840, 60], [760, 204], [980, 140]];
for (const [x, y] of bursts) {                                          // the trail each shell left
  p.stroke({ brush: 'bristle', color: '#8a7890', width: 5, opacity: 0.22, mix: 0.3, dry: 0.3, rag: 0.4, taper: [0.9, 0], points: [[x - 330, y - 150], [x - 150, y - 56], [x, y]] });
}
const lasers = [[1500, 628, 0], [1300, 624, 1], [1410, 630, 2], [1560, 626, 3]];
for (const [x0, y0, i] of lasers) {
  const [x1, y1] = bursts[i], strong = i < 2;
  p.stroke({ brush: 'soft', color: '#3aa8ff', width: strong ? 16 : 12, opacity: strong ? 0.26 : 0.16, points: [[x0, y0], [x1, y1]] });
  p.stroke({ color: strong ? '#eafcff' : '#bfeaff', width: 4.2, opacity: strong ? 0.9 : 0.55, points: [[x0, y0], [x1, y1]] });
  p.stroke({ brush: 'soft', color: '#8fd8ff', width: 22, opacity: 0.35, points: [[x0 + 18, y0 + 8], [x0 - 30, y0 - 38]] });   // the glow where it leaves the ground
}
for (const [x, y] of bursts) {
  for (const a of [0.3, 1.5, 2.6]) p.stroke({ brush: 'soft', color: '#ff8a3a', width: 26, opacity: 0.3, points: [[x - Math.cos(a) * 27, y - Math.sin(a) * 27], [x + Math.cos(a) * 27, y + Math.sin(a) * 27]] });
  for (let k = 0; k < 4; k++) p.tryStroke({ brush: 'bristle', color: mix('#1a1220', '#3c2030', r()), width: r.range(9, 14), opacity: 0.6, mix: 0.3, dry: 0.1, rag: 0.4, points: arc(x + r.range(-10, 18), y - r.range(2, 16), r.range(10, 16), Math.PI * 1.0, Math.PI * 2.0, 6) });   // its smoke
  for (let k = 0; k < 12; k++) {                                        // the burst: fire thrown outward
    const a = r() * 6.283, d = r.range(13, 30);
    p.tryStroke({ brush: 'bristle', color: mix('#ff9a3a', '#fff0b8', r()), width: r.range(4.6, 6.5), opacity: r.range(0.6, 0.95), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0, 0.8], points: [[x + Math.cos(a) * 2, y + Math.sin(a) * 2], [x + Math.cos(a) * d * 0.6, y + Math.sin(a) * d * 0.6], [x + Math.cos(a) * d, y + Math.sin(a) * d + d * 0.1]] });
  }
  p.stroke({ brush: 'soft', color: '#fff4d0', width: 14, opacity: 0.8, points: [[x - 15, y + 1], [x + 15, y - 1]] });
}

// ---------------------------------------------------------------- fires on the horizon
for (const [x, w] of [[600, 150], [1340, 110], [900, 90], [1560, 80]]) {
  p.stroke({ brush: 'soft', color: '#ff9a40', width: w, opacity: 0.2, points: [[x - w, HORIZON - 4], [x, HORIZON - 16], [x + w, HORIZON - 4]] });
  for (let k = 0; k < 6; k++) { const fx = x + r.range(-0.4, 0.4) * w, h = r.range(26, 56); p.tryStroke({ brush: 'bristle', color: mix('#ff8a30', '#ffe6a0', r()), width: r.range(5, 9), opacity: r.range(0.5, 0.9), mix: 0.2, dry: 0.1, rag: 0.3, taper: [0, 0.9], points: [[fx, HORIZON + 2], [fx + r.range(-3, 5), HORIZON - h * 0.5], [fx + r.range(2, 12), HORIZON - h]] }); }
}

// ---------------------------------------------------------------- the far horde
// Too far to tell one from another: a dark fringe along the horizon, taller where the big
// ones are, and the dust they raise glowing under them.
for (let k = 0; k < 12; k++) {
  const x = r.range(-80, W - 200), len = r.range(260, 520), y = HORIZON + r.range(0, 16), g = clamp(glow(x + len / 2, y, 520) * 1.3, 0, 1);
  p.stroke({ brush: 'soft', color: mix(mix('#4a1c26', '#7a2c2a', r()), '#ffb060', g), width: r.range(22, 40), opacity: r.range(0.14, 0.26) + 0.1 * g, points: wave(x, y, x + len, y + r.range(-5, 5), 4, 1, 7) });
}
for (let x = 420; x < W + 6; x += r.range(4, 9)) {
  const crowd = nB(x / 70, 3) * 0.7 + nA(x / 240, 9) * 0.5;
  if (crowd < 0.4 && r() < 0.6) continue;
  const big = r() < 0.06, h = (big ? r.range(22, 34) : r.range(12.5, 17)), y = HORIZON + r.range(2, 12);
  p.tryStroke({ brush: 'bristle', color: veil(mix('#0d0a14', '#1a1018', r()), x, y, 0.3), width: big ? r.range(8, 13) : r.range(4.6, 7), mix: 0, dry: 0, rag: 0.3, cap: 'round', taper: [0, 0.6], points: [[x, y], [x + r.range(-2, 2), y - h]] });
}

p.save();
