// Shared layout, palette and brush habits for the Wonderful Everyday painting.
//
// The scene: the roof of the school, in July, after rain. The story comes back to this roof
// again and again, and to the sky over it. We sit low on the wet floor and look across it.
// The sun is high in front of us, in a deep blue sky with torn clouds near it and one great
// heaped cloud of summer at the right. At the left is the hut of the stairs, with its door,
// its ladder and the water tank on top of it. A wire fence goes down the right side of the
// roof and across its far edge, and the town is below it. Yuki stands in the middle of the
// roof with her back to us and looks up. The water on the floor holds the sky.
//
// All of it is drawn from one place: an eye 0.85 m over the floor, looking level along the
// roof. `at` puts a place of the roof (metres to the right, metres up, metres away) into
// the picture, so each thing has its true size at its distance.
'use strict';
const studio = require('../../lib/studio');
const { mix, ramp, noise2, grad, clamp, smooth, rng } = studio;

const W = 1600, H = 1000;
const HZ = 770, VX = 640, F = 1100, EYE = 0.85;          // the line of the eye, the point that the lines of the roof go to, and the lens
const SUN = { x: 520, y: 168 };
const ROOF = { left: -9, right: 5, far: 22, curb: 0.25, fence: 2.05 };   // its edges, the low wall round it, and the top of the fence on that wall
const HUT = { x0: -6.5, x1: -3, z0: 10, z1: 14, h: 3 };                  // the hut of the stairs
const TANK = { x: -4.75, z: 12, r: 1, h0: 3.3, h1: 5.3 };                // the water tank on it
const YUKI = { X: 0.35, Z: 9 };

const at = (X, Y, Z) => [VX + F * X / Z, HZ - F * (Y - EYE) / Z];
const floorAt = (x, y) => { const Z = F * EYE / Math.max(0.5, y - HZ); return [(x - VX) * Z / F, Z]; };   // the place of the floor that we see at a place of the picture
const unit = (Z) => F / Z;                                                                               // units of the picture to the metre, at a distance

// Where the sun is, as a direction along the floor and a height: for shadows.
const SUNDIR = (() => { const dx = SUN.x - VX, l = Math.hypot(dx, F); return { x: dx / l, z: F / l, tan: (HZ - SUN.y) / l }; })();
// Is a place of the floor in the shade of the hut or of the tank?
function shaded(X, Z) {
  for (let s = 0.15; s < TANK.h1 / SUNDIR.tan; s += 0.15) {
    const x = X + s * SUNDIR.x, z = Z + s * SUNDIR.z, h = s * SUNDIR.tan;
    if (h < HUT.h && x > HUT.x0 && x < HUT.x1 && z > HUT.z0 && z < HUT.z1) return true;
    if (h > HUT.h && h < TANK.h1 && Math.hypot(x - TANK.x, z - TANK.z) < TANK.r) return true;
  }
  return false;
}

const nA = noise2(2203), nB = noise2(2207), nC = noise2(2213), nW = noise2(2311);

// The light of the sun in the air round it.
const glare = (x, y, reach) => Math.exp(-Math.pow(Math.hypot(x - SUN.x, y - SUN.y) / reach, 2));
// The sky: deep blue overhead, paler down to the edge of the world, and white round the sun.
const skyRamp = grad([[0, '#0c3288'], [0.22, '#1848a4'], [0.5, '#3270c4'], [0.74, '#6aa4dc'], [0.92, '#a8d0ee'], [1, '#cfe6f6']]);
function skyColor(x, y) {
  let c = skyRamp(clamp(y / HZ + (nA(x / 420, y / 240) - 0.5) * 0.05, 0, 1));
  c = mix(c, '#08246c', 0.3 * smooth(700, 1300, Math.hypot(x - SUN.x, y - SUN.y)) * smooth(500, 0, y));   // deepest far from the sun, high up
  c = mix(c, '#7cb4ec', 0.5 * glare(x, y, 620));
  c = mix(c, '#d8ecff', 0.75 * glare(x, y, 290));
  return mix(c, '#ffffff', 0.97 * glare(x, y, 120));
}

// The heaped clouds. Each is a heap of round tops on a level floor, made the same way each time, so that the water on
// the roof can hold the same clouds as the sky.
function heap(seed, x0, x1, floor, big, tall) {
  const r = rng(seed), puffs = [];
  for (let x = x0; x < x1; x += big * 0.45) {
    const hump = Math.pow(Math.sin(Math.PI * clamp((x - x0) / (x1 - x0), 0.03, 0.97)), 0.8), rad = big * r.range(0.5, 1) * (0.4 + 0.75 * hump);
    puffs.push([x + r.range(-12, 12), floor - rad * 0.7 - big * tall * hump * r.range(0.15, 1), rad]);
    puffs.push([x + r.range(-20, 20), floor - rad * 0.6 - big * tall * hump * r.range(0, 0.5), rad * r.range(0.8, 1.1)]);
  }
  return puffs.filter((q) => q[2] > 10);
}
const towerTones = ['#4a6aa8', '#7090c8', '#a2bce6', '#e6f0ff', '#ffffff'], nearTones = ['#7c9cd4', '#a6c2ec', '#d8e8ff', '#ffffff', '#ffffff'], lowTones = ['#9cbce4', '#bcd6f2', '#e2f0fc', '#ffffff'];
// From the far ones to the near ones: the top of the great cloud, its tower, its body; the cloud behind the tank; the low ones at the edge of the world.
const CLOUDS = [
  { puffs: heap(11, 1210, 1470, 300, 62, 2.2), floor: 300, big: 62, tones: towerTones, bias: 0.5, contrast: 0.7, fall: 0.1 },
  { puffs: heap(12, 1070, 1580, 540, 104, 3.0), floor: 540, big: 104, tones: towerTones, bias: 0.47, contrast: 0.72, fall: 0.2 },
  { puffs: heap(13, 890, 1780, 756, 134, 2.6), floor: 756, big: 134, tones: towerTones, bias: 0.45, contrast: 0.72, fall: 0.34 },
  { puffs: heap(14, -150, 470, 722, 100, 2.5), floor: 722, big: 100, tones: nearTones, bias: 0.5, contrast: 0.6, fall: 0.3 },
  { puffs: heap(15, 380, 1000, 760, 46, 1.0), floor: 760, big: 46, tones: lowTones, bias: 0.55, contrast: 0.5, fall: 0.2 },
];
const sunward = (x, y) => { const dx = SUN.x - x, dy = SUN.y - y, l = Math.hypot(dx, dy) || 1; return [dx / l * 0.8, dy / l * 0.8 - 0.2]; };
// The cloud at a place of the sky, or nothing: a plain form of what the sky pass paints, for the water.
function cloudAt(x, y) {
  let out = null;
  for (const c of CLOUDS) {
    if (y > c.floor) continue;
    let best = null, depth = 0;
    for (const q of c.puffs) { const d = q[2] - Math.hypot(x - q[0], y - q[1]); if (d > depth) { depth = d; best = q; } }
    if (!best) continue;
    const [lx, ly] = sunward(x, y), facing = ((x - best[0]) * lx + (y - best[1]) * ly) / best[2];
    out = ramp(c.tones, clamp(c.bias + c.contrast * facing, 0, 1));
  }
  return out;
}

// The water on the floor: 0 where the floor is dry, 1 where water lies. There is a wide sheet of it in front of Yuki.
function water(x, y) {
  const [X, Z] = floorAt(x, y);
  const w = 0.6 * nW(X / 1.15 + 7, Z / 1.8) + 0.4 * nW(X / 3.1 + 40, Z / 4.6) + 0.4 * Math.exp(-(Math.pow((X - 0.3) / 1.5, 2) + Math.pow((Z - 6.6) / 2.8, 2)));
  return smooth(0.47, 0.54, w);
}
// What the water shows at a place: the sky, turned over about the line of the eye, a little darker.
const mirror = (x, y) => { const yy = 2 * HZ - y; return mix(cloudAt(x, yy) || skyColor(x, yy), '#3c5878', 0.16); };

const open = (pass, extra) => studio.open(__dirname, { pass, rewind: true, ...extra });

module.exports = { studio, open, W, H, HZ, VX, F, EYE, SUN, ROOF, HUT, TANK, YUKI, at, floorAt, unit, SUNDIR, shaded, nA, nB, nC, glare, skyColor, CLOUDS, sunward, cloudAt, water, mirror };
