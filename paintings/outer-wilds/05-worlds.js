// The other worlds: the Hourglass Twins crossing the sun with their thread of sand, Giant's Deep,
// the Attlerock, Brittle Hollow with its burning moon, and the Interloper trailing ice.
'use strict';
const { studio, open, SUN, GIANTS_DEEP, ATTLEROCK, BRITTLE, LANTERN, BRAMBLE, nB, nC, clamp, smooth, loopDisc, rimArcs } = require('./scene');
const { arc, mix } = studio;

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

// Lay in a sphere with rings of short arcs, each arc the color of the spot it covers.
function layIn(c, colorAt, ring) {
  let rad = c.r - ring / 2;
  for (; rad >= ring + 0.5; rad -= ring * 0.68) {
    const at = rad;
    rimArcs(p, c.x, c.y, at + ring / 2, ring, (a) => colorAt(c.x + Math.cos(a) * at, c.y + Math.sin(a) * at), { seg: 0.42 });
  }
  const bare = rad + ring * 0.68 - ring / 2;
  const h = Math.max(ring + 0.4, bare), a0 = r() * 3.14;
  for (let k = 0; k < 4; k++) {
    const a = a0 + k * Math.PI / 4;
    p.line(c.x - Math.cos(a) * h, c.y - Math.sin(a) * h, c.x + Math.cos(a) * h, c.y + Math.sin(a) * h, { color: colorAt(c.x, c.y), width: ring });
  }
}

const inside = (c, margin) => (x, y) => Math.hypot(x - c.x, y - c.y) < c.r - margin;
const boxOf = (c) => [c.x - c.r, c.y - c.r, c.x + c.r, c.y + c.r];
const toSun = (c) => Math.atan2(SUN.y - c.y, SUN.x - c.x);

// ---------------------------------------------------------------- the Hourglass Twins
{
  const ember = { x: 900, y: 548, r: 31 }, ash = { x: 984, y: 497, r: 27 };
  const dx = ash.x - ember.x, dy = ash.y - ember.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
  // the column of sand falling from Ash Twin to Ember Twin
  p.line(ash.x - ux * (ash.r - 4), ash.y - uy * (ash.r - 4), ember.x + ux * (ember.r - 4), ember.y + uy * (ember.r - 4), { brush: 'flat', color: '#5a2414', width: 6, rag: 0 });
  loopDisc(p, ember.x, ember.y, ember.r, '#401611', 12);
  loopDisc(p, ash.x, ash.y, ash.r, '#4a2c22', 10);
  // the sun's light just catching the edge of each twin
  p.stroke({ color: '#8a3a1c', width: 4, opacity: 0.55, points: arc(ember.x, ember.y, ember.r - 3.5, 0.9, 2.7, 7) });
  p.stroke({ color: '#8f5234', width: 4, opacity: 0.55, points: arc(ash.x, ash.y, ash.r - 3.5, 0.7, 2.5, 7) });
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
    const lit = smooth(-0.18, 0.55, light(x, y));
    return mix(mix('#07191d', '#0e3a38', smooth(0, 0.35, lit)), sea(x, y), smooth(0.2, 1, lit));
  };
  const flow = (x, y) => { const [u, v] = uv(x, y); return tilt - 0.55 * u * v + (nC(x / 50, y / 50) - 0.5) * 1.2; };

  layIn(c, colorAt, 20);
  p.fill({ inside: inside(c, 11), bounds: boxOf(c), width: 18, length: 84, spacing: 0.55, angle: flow, color: colorAt, stroke: { brush: 'bristle', opacity: 0.92, mix: 0.25, rag: 0.1 } });
  p.fill({ inside: inside(c, 6), bounds: boxOf(c), width: 9, length: 52, spacing: 0.9, overlap: 0.8, angle: flow, color: (x, y) => colorAt(x + r.range(-6, 6), y + r.range(-6, 6)), stroke: { brush: 'bristle', opacity: 0.8, mix: 0.2, rag: 0.1 } });

  // cloud bands: long pale streaks drawn out along the winds
  p.fill({
    inside: (x, y) => inside(c, 8)(x, y) && light(x, y) > 0.05 && nB(uv(x, y)[0] * 0.5 + 3, uv(x, y)[1] * 4.2) > 0.52,
    bounds: boxOf(c), width: 7, length: 110, spacing: 1.5, overlap: 0.9, angle: (x, y) => { const [u, v] = uv(x, y); return tilt - 0.55 * u * v + (nC(x / 90, y / 90) - 0.5) * 0.5; },
    color: (x, y) => mix('#2c8a6e', '#b8e8cf', smooth(0, 0.7, light(x, y)) * r.range(0.6, 1)),
    stroke: { brush: 'bristle', opacity: 0.5, mix: 0.3, rag: 0.2 },
  });

  // cyclones: great storms turning in the cloud, a dark eye wound round with pale arms
  for (const [u, v, size, spin] of [[0.36, 0.2, 27, 1], [-0.02, 0.56, 17, -1], [0.6, -0.3, 15, 1], [0.02, -0.2, 19, -1]]) {
    const x = c.x + (u * Math.cos(tilt) - v * Math.sin(tilt)) * c.r, y = c.y + (u * Math.sin(tilt) + v * Math.cos(tilt)) * c.r;
    const lit = smooth(-0.1, 0.5, light(x, y));
    const a0 = r() * 6.283, ca = Math.cos(tilt), sa = Math.sin(tilt);
    const spiral = (phase, from, to, turns) => {
      const pts = [];
      for (let k = 0; k <= 16; k++) {
        const f = k / 16, rad = from + (to - from) * f, a = a0 + phase + spin * f * turns;
        const ex = Math.cos(a) * rad * 1.35, ey = Math.sin(a) * rad * 0.8;   // drawn out along the winds
        pts.push([x + ex * ca - ey * sa, y + ex * sa + ey * ca]);
      }
      return pts;
    };
    for (const phase of [0, 2.1, 4.2]) {
      p.stroke({ brush: 'bristle', color: mix('#0e3a38', r.pick(['#c2ecd4', '#9fdcc0', '#d8f4e2']), lit), width: Math.max(5, size * 0.3), opacity: 0.6, taper: [0.5, 0.2], rag: 0.1, mix: 0.25, points: spiral(phase, size, size * 0.28, 3.4) });
    }
    const ew = Math.max(5, size * 0.24), eh = Math.max(6.3, ew + 0.3);
    p.line(x - ca * eh, y - sa * eh, x + ca * eh, y + sa * eh, { color: mix('#07191d', '#12453f', lit), width: ew, opacity: 0.8 });
  }

  // limb: a thin bright line of atmosphere where the planet faces the sun, then a soft glow outside it
  const sunward = toSun(c);
  rimArcs(p, c.x, c.y, c.r, 6, (a) => {
    const lit = smooth(-0.1, 0.4, light(c.x + Math.cos(a) * (c.r - 3), c.y + Math.sin(a) * (c.r - 3)));
    const facing = Math.max(0, Math.cos(a - sunward));
    return mix(mix('#061519', '#2f8f72', lit), '#a6ecca', lit * facing * facing);
  }, { seg: 0.3 });
  p.stroke({ brush: 'soft', color: '#4fc79c', width: 24, opacity: 0.3, points: arc(c.x, c.y, c.r + 7, sunward - 1.2, sunward + 1.2, 30) });
  p.stroke({ brush: 'soft', color: '#3aa6a0', width: 60, opacity: 0.13, points: arc(c.x, c.y, c.r + 20, sunward - 2.0, sunward + 2.0, 30) });
}

// ---------------------------------------------------------------- the Attlerock
{
  const c = ATTLEROCK, light = lightOn(c, -0.05);
  const colorAt = (x, y) => {
    const lit = smooth(-0.05, 0.45, light(x, y));
    const rock = mix('#9a938f', '#d2cac0', nC(x / 15, y / 15) * 0.6 + nB(x / 40, y / 40) * 0.4);
    return mix('#1a1938', rock, lit);
  };
  layIn(c, colorAt, 10);
  p.fill({ inside: inside(c, 5), bounds: boxOf(c), width: 7, length: 30, spacing: 0.6, angle: (x, y) => toSun(c) + 1.571 + (nB(x / 25, y / 25) - 0.5) * 0.5, color: colorAt, stroke: { brush: 'round', opacity: 0.9 } });
  // a few darker seas on the lit face
  for (const [x0, y0, x1, y1, w] of [[2, 22, 16, 30, 7], [20, 6, 31, 14, 5.5], [-12, 30, 0, 37, 5]]) {
    p.line(c.x + x0, c.y + y0, c.x + x1, c.y + y1, { color: '#7d7880', width: w, opacity: 0.55 * smooth(-0.05, 0.45, light(c.x + (x0 + x1) / 2, c.y + (y0 + y1) / 2)) + 0.05 });
  }
  rimArcs(p, c.x, c.y, c.r, 5, (a) => {
    const lit = smooth(-0.05, 0.45, light(c.x + Math.cos(a) * (c.r - 3), c.y + Math.sin(a) * (c.r - 3)));
    return mix('#1a1938', '#e2dbd0', lit);
  }, { seg: 0.3 });
}

// ---------------------------------------------------------------- Brittle Hollow and Hollow's Lantern
{
  const c = BRITTLE, light = lightOn(c, 0.36);
  const colorAt = (x, y) => {
    const dy = (y - c.y) / c.r, dx = (x - c.x) / c.r;
    let crust = mix('#6b6a9c', '#98a0c4', nC(x / 16, y / 16));
    if (dy < -0.42 + (nB(x / 20, 3) - 0.5) * 0.3) crust = mix('#c9d4ec', '#eef3fb', nC(x / 9, y / 9));   // the frozen pole
    const lit = smooth(-0.15, 0.5, light(x, y));
    return mix('#12143a', crust, lit);
  };
  layIn(c, colorAt, 10);
  p.fill({ inside: inside(c, 5), bounds: boxOf(c), width: 8, length: 34, spacing: 0.8, angle: (x, y) => nB(x / 30, y / 30) * 6.283, color: colorAt, stroke: { brush: 'flat', opacity: 0.85, rag: 0.05 } });
  // fractures in the crust, and the dark of the hollow showing through one of them
  for (const pts of [
    [[-38, -6], [-24, 4], [-12, -2], [2, 8], [10, 20]], [[14, -24], [22, -10], [18, 4], [30, 14]], [[-22, 30], [-12, 22], [-10, 12]],
  ]) {
    const q = pts.map(([dx, dy]) => [c.x + dx, c.y + dy]);
    const lit = smooth(-0.15, 0.5, light(q[1][0], q[1][1]));
    p.stroke({ color: mix('#0c0d28', '#2b2850', lit), width: 4, opacity: 0.7, smooth: false, points: q });
  }
  p.line(c.x - 4, c.y + 6, c.x + 9, c.y + 12, { color: '#141032', width: 7, opacity: 0.85 });
  rimArcs(p, c.x, c.y, c.r, 5, (a) => {
    const lit = smooth(-0.15, 0.5, light(c.x + Math.cos(a) * (c.r - 3), c.y + Math.sin(a) * (c.r - 3)));
    return mix('#0e1030', '#c4cdea', lit);
  }, { seg: 0.3 });

  const m = LANTERN;
  p.stroke({ brush: 'soft', color: '#ff6a24', width: 22, opacity: 0.4, points: arc(m.x, m.y, 22, 0.4, 0.4 + 6.283, 16) });
  loopDisc(p, m.x, m.y, m.r, '#c9431c', 8);
  p.stroke({ color: '#ffb44e', width: 4, points: arc(m.x + 1, m.y + 2, 6.8, 3.15, 5.95, 7) });
  // a lava bomb on its way down to Brittle Hollow
  p.line(m.x - 30, m.y + 16.5, m.x - 41.5, m.y + 24, { color: '#ffc468', width: 4.5, opacity: 0.95 });
}

// ---------------------------------------------------------------- Dark Bramble, far out
{
  const c = BRAMBLE;
  p.stroke({ brush: 'soft', color: '#9fb8c8', width: 36, opacity: 0.2, points: arc(c.x, c.y, 37, 1, 1 + 6.283, 16) });
  // thorned vines bristling out of the fog in every direction, each with a thorn of its own
  for (let k = 0; k < 14; k++) {
    const a = (k + r.range(-0.3, 0.3)) / 14 * 6.283, len = r.range(18, 44), bend = r.range(-0.7, 0.7);
    const at = (f) => [c.x + Math.cos(a + bend * f) * (8 + len * f), c.y + Math.sin(a + bend * f) * (8 + len * f)];
    const color = mix('#3f4d58', '#66788a', r());
    p.stroke({ color, width: Math.min(r.range(7.5, 10), len / 2.3), opacity: 0.92, taper: [0, 1], points: [at(0), at(0.3), at(0.65), at(1)] });
    if (len > 26) {
      const [tx, ty] = at(0.5), out = a + bend * 0.5 + (bend > 0 ? -1 : 1) * r.range(0.7, 1.1);
      p.line(tx, ty, tx + Math.cos(out) * 12.6, ty + Math.sin(out) * 12.6, { color, width: 4, opacity: 0.85 });
    }
  }
  // the frozen fog at its heart
  loopDisc(p, c.x, c.y, 15, '#a9bcc6', 8);
  p.line(c.x - 15, c.y, c.x + 15, c.y - 2, { brush: 'soft', color: '#f2fafc', width: 14, opacity: 0.7 });
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
