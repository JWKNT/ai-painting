// The other worlds: the Hourglass Twins crossing the sun with their thread of sand, Giant's Deep,
// the Attlerock, Brittle Hollow with its burning moon, and the Interloper trailing ice. Each is
// a sphere painted by the sun's light. The side turned from the sun goes into the color of
// the sky behind it, so that edge is lost.
'use strict';
const scene = require('./scene');
const { studio, open, SUN, GIANTS_DEEP, ATTLEROCK, BRITTLE, LANTERN, BRAMBLE, nB, nC, clamp, smooth, skyColor, loopDisc } = scene;
const { arc, mix, glint } = studio;

const p = open('worlds');
const r = p.rng;

// Light on a sphere: 1 facing the sun, below 0 turned away. `depth` leans the light toward us.
function lightOn(c, depth) {
  let lx = SUN.x - c.x, ly = SUN.y - c.y;
  const l = Math.hypot(lx, ly), k = Math.sqrt(1 - depth * depth);
  lx = lx / l * k; ly = ly / l * k;
  return (x, y) => {
    const dx = (x - c.x) / c.r, dy = (y - c.y) / c.r;
    return dx * lx + dy * ly + Math.sqrt(Math.max(0, 1 - dx * dx - dy * dy)) * depth;
  };
}

const layIn = (c, colorAt, ring) => scene.layIn(p, c, colorAt, ring);

const inside = (c, margin) => (x, y) => Math.hypot(x - c.x, y - c.y) < c.r - margin;
const boxOf = (c) => [c.x - c.r, c.y - c.r, c.x + c.r, c.y + c.r];
const toSun = (c) => Math.atan2(SUN.y - c.y, SUN.x - c.x);

// The night side of a world: the sky's own color there, a little darker.
const night = (x, y, k = 0.45) => mix(skyColor(x, y), '#060918', k);
// A thread of light along the limb that faces the sun, broken, strongest straight toward it.
function limbLight(c, color, o = {}) {
  const a0 = toSun(c), half = o.half || 1.1, pts = [];
  for (let k = 0; k <= 24; k++) { const a = a0 - half + 2 * half * k / 24; pts.push([c.x + Math.cos(a) * (c.r - (o.inset || 2.5)), c.y + Math.sin(a) * (c.r - (o.inset || 2.5))]); }
  glint(p, pts, color, { width: o.width || 4.2, dash: o.dash || 26, gap: o.gap != null ? o.gap : 10, opacity: o.opacity || 0.7, rng: r });
}

// ---------------------------------------------------------------- the Hourglass Twins
// They cross the face of the sun, so we see their dark sides. The glare round them bleeds
// over their edges, and the sand that falls from one to the other catches the light.
{
  const ember = { x: 900, y: 548, r: 31 }, ash = { x: 984, y: 497, r: 27 };
  const dx = ash.x - ember.x, dy = ash.y - ember.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
  const a = [ash.x - ux * (ash.r - 5), ash.y - uy * (ash.r - 5)], b = [ember.x + ux * (ember.r - 5), ember.y + uy * (ember.r - 5)];
  p.line(...a, ...b, { brush: 'bristle', color: '#70341a', width: 6.5, mix: 0.15, dry: 0, rag: 0, cap: 'round' });
  p.tryStroke({ color: '#f2b066', width: 4, opacity: 0.6, points: [[a[0] + uy * 1.6, a[1] - ux * 1.6], [b[0] + uy * 1.6, b[1] - ux * 1.6]] });
  for (const [c, rock] of [[ember, ['#2a0d0b', '#40160f', '#6a2c18']], [ash, ['#33190f', '#4a2a1b', '#74482c']]]) {
    const colorAt = (x, y) => {
      const rho = Math.hypot(x - c.x, y - c.y) / c.r, g = nC(x / 13, y / 13 + c.x);
      return mix(mix(rock[0], rock[1], smooth(0.3, 0.75, g)), rock[2], smooth(0.1, 1, rho) * 0.55);   // the glare creeps round the edge
    };
    layIn(c, colorAt, 7);
    p.fill({ inside: inside(c, 4), bounds: boxOf(c), width: 6, length: 22, spacing: 0.55, angle: (x, y) => Math.atan2(y - c.y, x - c.x) + 1.571 + (nB(x / 20, y / 20) - 0.5), color: (x, y) => colorAt(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.4, dry: 0, rag: 0.1 } });
    limbLight(c, () => mix('#c8602a', '#ffb262', r()), { half: 1.0, dash: 16, gap: 12, opacity: 0.5, inset: 2.4 });
  }
}

// ---------------------------------------------------------------- Giant's Deep
{
  const c = GIANTS_DEEP, light = lightOn(c, 0.42), tilt = -0.32;
  const uv = (x, y) => {
    const dx = (x - c.x) / c.r, dy = (y - c.y) / c.r;
    return [dx * Math.cos(tilt) + dy * Math.sin(tilt), -dx * Math.sin(tilt) + dy * Math.cos(tilt)];
  };
  const sea = (x, y) => {
    const [u, v] = uv(x, y);
    const band = nB(u * 0.7 + nC(u * 2.2, v * 2.2) * 0.6, v * 3.4 + 5);
    let col = mix('#1a6456', '#4fb48b', smooth(0.25, 0.8, band));
    const cloud = nC(u * 1.3 + 9, v * 5.5);
    if (cloud > 0.6) col = mix(col, '#c4ecd2', clamp((cloud - 0.6) * 2, 0, 0.75));
    return col;
  };
  const colorAt = (x, y) => {
    const lit = smooth(-0.22, 0.6, light(x, y));
    return mix(mix(night(x, y, 0.5), '#0e3a38', smooth(0.05, 0.4, lit)), sea(x, y), smooth(0.22, 1, lit));
  };
  const wind = (x, y, wander) => { const [u, v] = uv(x, y); return tilt - 0.55 * u * v + (nC(x / 50, y / 50) - 0.5) * wander; };

  layIn(c, colorAt, 20);
  p.fill({ inside: inside(c, 11), bounds: boxOf(c), width: 18, length: 84, spacing: 0.55, angle: (x, y) => wind(x, y, 1.2), color: colorAt, stroke: { brush: 'bristle', opacity: 0.92, mix: 0.25, rag: 0.1 } });
  p.fill({ inside: inside(c, 6), bounds: boxOf(c), width: 9, length: 52, spacing: 0.9, overlap: 0.8, angle: (x, y) => wind(x, y, 1.2), color: (x, y) => colorAt(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.8, mix: 0.2, rag: 0.1 } });

  // cloud bands: long pale streaks drawn out along the winds
  p.fill({
    inside: (x, y) => inside(c, 8)(x, y) && light(x, y) > 0.05 && nB(uv(x, y)[0] * 0.5 + 3, uv(x, y)[1] * 4.2) > 0.52,
    bounds: boxOf(c), width: 7, length: 110, spacing: 1.5, overlap: 0.9, angle: (x, y) => wind(x, y, 0.5),
    color: (x, y) => mix('#2c8a6e', '#b8e8cf', smooth(0, 0.7, light(x, y)) * r.range(0.6, 1)),
    stroke: { brush: 'bristle', opacity: 0.5, mix: 0.3, rag: 0.2 },
  });

  // cyclones: great storms turning in the cloud. Each is a pale heart drawn out along the
  // winds, two arms of cloud winding into it, and a small dark eye, worked into the bands.
  for (const [u, v, size, spin] of [[0.36, 0.2, 27, 1], [-0.02, 0.56, 17, -1], [0.6, -0.3, 15, 1], [0.02, -0.2, 19, -1]]) {
    const x = c.x + (u * Math.cos(tilt) - v * Math.sin(tilt)) * c.r, y = c.y + (u * Math.sin(tilt) + v * Math.cos(tilt)) * c.r;
    const lit = smooth(-0.1, 0.5, light(x, y)), a0 = r() * 6.283, ca = Math.cos(tilt), sa = Math.sin(tilt);
    const pale = () => mix('#0e3a38', r.pick(['#b4e4cc', '#8fd2b6', '#cdf0dc']), lit);
    const arm = (phase, from, to, turns) => {
      const pts = [];
      for (let k = 0; k <= 14; k++) {
        const f = k / 14, rad = from + (to - from) * f, a = a0 + phase + spin * f * turns, ex = Math.cos(a) * rad * 1.45, ey = Math.sin(a) * rad * 0.75;   // drawn out along the winds
        pts.push([x + ex * ca - ey * sa, y + ex * sa + ey * ca]);
      }
      return pts;
    };
    const w = Math.max(5, size * 0.3);
    p.line(x - ca * size * 0.75, y - sa * size * 0.75, x + ca * size * 0.75, y + sa * size * 0.75, { brush: 'bristle', color: pale(), width: Math.max(6, size * 0.5), opacity: 0.4, mix: 0.4, dry: 0.1, rag: 0.3 });
    for (const phase of [0, 3.14]) p.tryStroke({ brush: 'bristle', color: pale(), width: w, opacity: 0.4, taper: [0.7, 0.2], rag: 0.2, mix: 0.4, dry: 0.1, points: arm(phase, size * 1.25, size * 0.3, 2.7) });
    p.tryStroke({ brush: 'blend', width: Math.max(10, size * 0.8), opacity: 0.45, points: [[x - ca * size * 1.7, y - sa * size * 1.7 - 2], [x, y], [x + ca * size * 1.7, y + sa * size * 1.7 + 2]] });
    const ew = Math.max(4.6, size * 0.2), eh = Math.max(6.3, ew + 0.3);
    p.line(x - ca * eh, y - sa * eh, x + ca * eh, y + sa * eh, { brush: 'bristle', color: mix('#07191d', '#12453f', lit), width: ew, opacity: 0.6, mix: 0.3, dry: 0, rag: 0, cap: 'round' });
  }

  // the air along the limb that faces the sun: a soft glow, and a broken thread of light
  const sunward = toSun(c);
  p.stroke({ brush: 'soft', color: '#4fc79c', width: 24, opacity: 0.3, points: arc(c.x, c.y, c.r + 5, sunward - 1.2, sunward + 1.2, 30) });
  p.stroke({ brush: 'soft', color: '#3aa6a0', width: 60, opacity: 0.13, points: arc(c.x, c.y, c.r + 18, sunward - 2.0, sunward + 2.0, 30) });
  limbLight(c, () => mix('#8fe0bc', '#d8fbe8', r()), { half: 1.15, width: 4.6, dash: 34, gap: 10, opacity: 0.7, inset: 3 });
}

// ---------------------------------------------------------------- the Attlerock
{
  const c = ATTLEROCK, light = lightOn(c, 0.1);
  const colorAt = (x, y) => {
    const lit = smooth(-0.22, 0.55, light(x, y));
    const rock = mix('#8c8480', '#d6cdc0', nC(x / 15, y / 15) * 0.6 + nB(x / 40, y / 40) * 0.4);
    return mix(night(x, y, 0.35), mix(rock, '#f0d8b8', smooth(0.6, 1, lit) * 0.5), lit);
  };
  layIn(c, colorAt, 10);
  p.fill({ inside: inside(c, 5), bounds: boxOf(c), width: 7, length: 30, spacing: 0.6, angle: (x, y) => toSun(c) + 1.571 + (nB(x / 25, y / 25) - 0.5) * 0.9, color: (x, y) => colorAt(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { brush: 'bristle', opacity: 0.9, mix: 0.3, dry: 0, rag: 0.1 } });
  // craters and seas: darker hollows on the lit face, each with a paler lip toward the sun
  for (const [dx, dy, w, len, a] of [[4, 24, 7, 15, 0.4], [22, 8, 5.5, 13, 0.7], [-12, 30, 5, 13, 0.3], [-20, 12, 5, 12.5, 1.1], [14, 34, 4.6, 12.5, 0.2]]) {
    const x = c.x + dx, y = c.y + dy, l = smooth(-0.22, 0.55, light(x, y)), ca = Math.cos(a), sa = Math.sin(a), ts = toSun(c);
    p.line(x - ca * len / 2, y - sa * len / 2, x + ca * len / 2, y + sa * len / 2, { brush: 'bristle', color: '#6e6a74', width: w, opacity: 0.5 * l + 0.04, mix: 0.3, dry: 0, rag: 0, cap: 'round' });
    p.tryStroke({ color: '#f4eadc', width: 4, opacity: 0.4 * l, points: [[x - ca * 6.3 + Math.cos(ts) * w * 0.6, y - sa * 6.3 + Math.sin(ts) * w * 0.6], [x + ca * 6.3 + Math.cos(ts) * w * 0.6, y + sa * 6.3 + Math.sin(ts) * w * 0.6]] });
  }
  limbLight(c, () => mix('#f4e4cc', '#ffffff', r()), { half: 0.95, dash: 22, gap: 9, opacity: 0.7 });
}

// ---------------------------------------------------------------- Brittle Hollow and Hollow's Lantern
{
  const c = BRITTLE, light = lightOn(c, 0.36);
  const colorAt = (x, y) => {
    const dy = (y - c.y) / c.r;
    let crust = mix('#676696', '#98a0c4', nC(x / 16, y / 16));
    if (dy < -0.42 + (nB(x / 20, 3) - 0.5) * 0.3) crust = mix('#c9d4ec', '#eef3fb', nC(x / 9, y / 9));   // the frozen pole
    const lit = smooth(-0.2, 0.55, light(x, y));
    return mix(night(x, y, 0.4), crust, lit);
  };
  layIn(c, colorAt, 10);
  p.fill({ inside: inside(c, 5), bounds: boxOf(c), width: 8, length: 34, spacing: 0.8, angle: (x, y) => nB(x / 30, y / 30) * 6.283, color: (x, y) => colorAt(x + r.range(-3, 3), y + r.range(-3, 3)), stroke: { brush: 'bristle', opacity: 0.85, mix: 0.25, dry: 0, rag: 0.1 } });
  // fractures in the crust: thin shadows that wander, and the dark of the hollow showing through one of them
  for (const pts of [
    [[-38, -6], [-26, 1], [-12, 0], [2, 8], [10, 20]], [[14, -24], [21, -10], [20, 4], [30, 14]], [[-22, 30], [-14, 22], [-10, 12]], [[-4, -30], [-10, -18], [-6, -6]],
  ]) {
    const q = pts.map(([dx, dy]) => [c.x + dx, c.y + dy]);
    const lit = smooth(-0.2, 0.55, light(q[1][0], q[1][1]));
    p.tryStroke({ brush: 'bristle', color: mix('#0c0d28', '#34325e', lit), width: 4.4, opacity: 0.3 + 0.3 * lit, mix: 0.3, dry: 0.1, rag: 0.2, taper: [0.4, 0.4], points: q });
  }
  p.line(c.x - 5, c.y + 6, c.x + 9, c.y + 12, { brush: 'bristle', color: '#141032', width: 6.5, opacity: 0.7, mix: 0.2, dry: 0, rag: 0, cap: 'round' });
  limbLight(c, () => mix('#c4cdea', '#f2f6ff', r()), { half: 1.0, dash: 22, gap: 9, opacity: 0.65 });

  // Hollow's Lantern: a moon of molten rock, the brightest thing in that part of the sky
  const m = LANTERN;
  p.stroke({ brush: 'soft', color: '#ff5a1c', width: 34, opacity: 0.26, points: arc(m.x, m.y, 36, 0.4, 0.4 + 6.283, 16) });
  p.stroke({ brush: 'soft', color: '#ff7a2c', width: 20, opacity: 0.42, points: arc(m.x, m.y, 22, 1.4, 1.4 + 6.283, 16) });
  loopDisc(p, m.x, m.y, m.r, '#b83a18', 8);
  p.line(m.x - 6.6, m.y + 2.5, m.x + 6.2, m.y - 2.5, { brush: 'bristle', color: '#ff9a3c', width: 6, mix: 0.2, dry: 0, rag: 0, cap: 'round' });      // seams of lava across it
  p.line(m.x - 4, m.y - 5, m.x + 8.4, m.y - 5.6, { color: '#ffd27a', width: 4, opacity: 0.8 });
  // a lava bomb on its way down to Brittle Hollow
  p.stroke({ brush: 'soft', color: '#ff8a3a', width: 9, opacity: 0.5, points: [[m.x - 24, m.y + 12.6], [m.x - 44, m.y + 25.6]] });
  p.line(m.x - 30, m.y + 16.5, m.x - 41.5, m.y + 24, { color: '#ffc468', width: 4.5, opacity: 0.95 });
}

// ---------------------------------------------------------------- Dark Bramble, far out
// A knot of dark vines round a heart of frozen fog. The fog glows; the vines are seen against it.
{
  const c = BRAMBLE;
  p.stroke({ brush: 'soft', color: '#8fa8c0', width: 44, opacity: 0.2, points: arc(c.x, c.y, 47, 1, 1 + 6.283, 18) });
  p.stroke({ brush: 'soft', color: '#cfe0ec', width: 28, opacity: 0.42, points: [[c.x - 30, c.y + 3], [c.x, c.y - 3], [c.x + 30, c.y + 3]] });
  for (let k = 0; k < 10; k++) {
    const a = (k + r.range(-0.3, 0.3)) / 10 * 6.283, len = r.range(26, 50), bend = r.range(0.5, 1.4) * (r() < 0.5 ? -1 : 1);
    const at = (f) => [c.x + Math.cos(a + bend * f) * (5 + len * f), c.y + Math.sin(a + bend * f) * (5 + len * f)];
    const color = mix('#1a242c', '#32424e', r());
    p.stroke({ brush: 'bristle', color, width: Math.min(r.range(6, 8.5), len / 2.3), opacity: 0.9, taper: [0, 1], mix: 0.05, dry: 0, rag: 0, cap: 'round', points: [at(0), at(0.3), at(0.65), at(1)] });
    if (len > 34) {                                                  // a thorn
      const [tx, ty] = at(0.55), out = a + bend * 0.55 + (bend > 0 ? -1 : 1) * r.range(0.8, 1.2);
      p.line(tx, ty, tx + Math.cos(out) * 12.6, ty + Math.sin(out) * 12.6, { color, width: 4, opacity: 0.8 });
    }
  }
  p.stroke({ brush: 'soft', color: '#e8f4fa', width: 8.2, opacity: 0.6, points: arc(c.x, c.y, 8.6, 0.6, 0.6 + 6.283, 14) });    // the fog at its heart, round
  for (const a of [0.2, 1.25, 2.3]) p.stroke({ brush: 'soft', color: '#ffffff', width: 8.4, opacity: 0.75, points: [[c.x - Math.cos(a) * 8.7, c.y - Math.sin(a) * 8.7], [c.x + Math.cos(a) * 8.7, c.y + Math.sin(a) * 8.7]] });
}

// ---------------------------------------------------------------- the Interloper
{
  const head = [1290, 420];
  const l = Math.hypot(head[0] - SUN.x, head[1] - SUN.y), ux = (head[0] - SUN.x) / l, uy = (head[1] - SUN.y) / l;
  const along = (d, side = 0) => [head[0] + ux * d - uy * side, head[1] + uy * d + ux * side];
  p.stroke({ brush: 'soft', color: '#6fa8f0', width: 46, opacity: 0.2, taper: [0, 0.9], points: [along(-8), along(110), along(225)] });
  p.stroke({ brush: 'soft', color: '#cfe0ff', width: 34, opacity: 0.16, taper: [0, 0.9], points: [along(0), along(80, 14), along(165, 44)] });   // dust, curling behind
  p.stroke({ brush: 'soft', color: '#a9d2ff', width: 20, opacity: 0.4, taper: [0, 0.9], points: [along(-4), along(95), along(190)] });
  p.stroke({ color: '#e8f5ff', width: 6, opacity: 0.85, taper: [0, 1], points: [along(0), along(60), along(128)] });
  p.stroke({ brush: 'soft', color: '#bfe2ff', width: 18, opacity: 0.55, points: [along(-18), along(20)] });
  p.line(...along(-9), ...along(7), { color: '#f6fcff', width: 7.5 });
}

p.save();
