// The hut of the stairs, at the left: a box of concrete, stained by many rains, with a steel
// door, a red box for the fire hose, a pipe, and iron rungs that go up to its roof. On the
// roof is the round water tank, and beside it the mast of an aerial. The sun is behind all
// of it, so the walls are in blue shade, the edge of the roof is a line of light, and the
// tank has light down its right side, where the sun is.
'use strict';
const { studio, open, HZ, F, EYE, HUT, TANK, at, nA, nB, nC } = require('./scene');
const { mix, smooth } = studio;

const p = open('hut');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.12, cap: 'flat' };
const thin = (w) => (w < 4.8 ? { brush: 'round' } : {});
const Z0 = HUT.z0, front = (X, Y) => at(X, Y, Z0), s0 = F / Z0;                                   // a place on the wall that faces us; units of the picture to the metre on it
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: pts });
const A = front(HUT.x0, 0), B = front(HUT.x1, 0), C = front(HUT.x1, HUT.h), LIP = 0.18, top = front(0, HUT.h + LIP)[1];
const B2 = at(HUT.x1, 0, HUT.z1), C2 = at(HUT.x1, HUT.h, HUT.z1), top2 = at(HUT.x1, HUT.h + LIP, HUT.z1)[1];

// ---------------------------------------------------------------- the water tank, behind the edge of the roof
{
  const cx = at(TANK.x, 0, TANK.z)[0], R = F * TANK.r / TANK.z, ySide = (h) => HZ - F * (h - EYE) / TANK.z, bulge = (h) => F * (h - EYE) * (1 / (TANK.z - TANK.r) - 1 / TANK.z);
  const yAt = (h, u) => ySide(h) - bulge(h) * Math.sqrt(Math.max(0, 1 - u * u));                  // a ring round the tank at a height: we see it from below, so it bends up in the middle
  const inside = (x, y) => { const u = (x - cx) / R; return Math.abs(u) < 1 && y > yAt(TANK.h1, u) && y < top + 4; };
  const steel = (x, y) => {
    const u = (x - cx) / R, n = nA(x / 26, y / 90);
    let c = mix('#5a6e9c', '#7a90bc', n);
    c = mix(c, '#34446c', smooth(-0.3, -1, u) * 0.75);                                           // dark at its left edge
    c = mix(c, '#b4c8ea', Math.exp(-Math.pow((u - 0.38) / 0.2, 2)) * 0.6);                        // the great cloud, in its side
    c = mix(c, '#2c3a5c', Math.exp(-Math.pow((u - 0.72) / 0.1, 2)) * 0.45);                       // a dark line before the light
    c = mix(c, '#ffffff', smooth(0.84, 0.99, u) * 0.95);                                         // the sun down its right edge
    return mix(c, '#8ca8d8', smooth(top - 60, top, y) * 0.2);                                    // light from the roof under it
  };
  p.fill({ inside, bounds: [cx - R, yAt(TANK.h1, 0) - 2, cx + R, top + 4], width: 8, length: 60, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: steel, stroke: { ...line, opacity: 0.97 } });
  p.fill({ inside, bounds: [cx - R, yAt(TANK.h1, 0) - 2, cx + R, top + 4], width: 5.5, length: 34, spacing: 0.9, overlap: 0.7, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: (x, y) => steel(x + r.range(-3, 3), y), stroke: { ...line, opacity: 0.85 } });
  const ring = (h, u0, u1) => { const pts = []; for (let u = u0; u <= u1 + 0.001; u += 0.08) pts.push([cx + u * R, yAt(h, u)]); return pts; };
  for (const h of [3.75, 4.27, 4.79]) { mark(ring(h, -0.97, 0.8), '#2c3a5c', 5, { opacity: 0.6, cap: 'round' }); mark(ring(h + 0.045, -0.9, 0.8), '#a8bcdc', 4, { opacity: 0.45 }); }   // the bands round it
  mark(ring(TANK.h1 - 0.02, -0.98, 0.98), '#dce8fa', 6, { cap: 'round' });                        // its top edge, in the sun
  mark(ring(TANK.h1 - 0.02, 0.3, 0.98), '#ffffff', 5, { cap: 'round' });
  for (const u of [-0.56, -0.4]) mark([[cx + u * R, top + 2], [cx + u * R, yAt(TANK.h1, u) - 16]], '#26324e', 4.4, { cap: 'round' });           // the ladder on its side
  for (let h = 3.5; h < TANK.h1 + 0.1; h += 0.3) mark([[cx - 0.58 * R, yAt(h, -0.48)], [cx - 0.38 * R, yAt(h, -0.48) - 1]], '#26324e', 4, { opacity: 0.9 });
  mark([[cx - 0.56 * R, yAt(TANK.h1, -0.56) - 16], [cx - 0.48 * R, yAt(TANK.h1, -0.48) - 24], [cx - 0.4 * R, yAt(TANK.h1, -0.4) - 16]], '#26324e', 4.4, { cap: 'round' });
}

// ---------------------------------------------------------------- the mast of the aerial, at the far corner of the roof of the hut
{
  const [mx, my] = at(-3.1, HUT.h + LIP, 13.5), tall = (h) => at(-3.1, h, 13.5)[1], c = '#26324e';
  mark([[mx, my + 2], [mx, tall(5.75)]], c, 4.6, { cap: 'round' });
  for (const [h, half, n] of [[5.55, 40, 6], [4.75, 26, 4]]) {
    const y = tall(h); mark([[mx - half, y + 2], [mx + half, y - 2]], c, 4.2);
    for (let k = 0; k < n; k++) { const x = mx - half + (2 * half) * (k + 0.3) / n, yy = y + 2 - 4 * (x - mx + half) / (2 * half), len = 13 + 5 * (1 - k / n); mark([[x - 2, yy - len / 2], [x + 2, yy + len / 2]], c, 4, { opacity: 0.9 }); }
  }
}

// ---------------------------------------------------------------- the side wall, that goes away from us
{
  const inside = (x, y) => { const t = (x - B[0]) / (B2[0] - B[0]); return t > 0 && t < 1 && y > C[1] + (C2[1] - C[1]) * t && y < B[1] + (B2[1] - B[1]) * t; };
  const wall = (x, y) => { const t = (x - B[0]) / (B2[0] - B[0]), c = mix(mix('#4c5e86', '#5c7098', nB(x / 30, y / 70)), '#7c94bc', t * 0.3); return mix(mix(c, '#34446a', (nC(x / 6, y / 160) > 0.62 ? 0.3 : 0)), '#8ca4cc', smooth(B[1] - 90, B[1], y) * 0.25); };
  p.fill({ inside, bounds: [B[0], C[1], B2[0], B[1]], width: 7, length: 60, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: wall, stroke: { ...line, opacity: 0.97 } });
  for (const h of [1.9, 2.05, 2.2]) mark([at(HUT.x1, h, 11.2), at(HUT.x1, h, 12.6)], '#2c3a5c', 4.4, { opacity: 0.7 });                        // a grille for air
  mark([at(HUT.x1, 0.02, Z0), at(HUT.x1, 0.02, HUT.z1)], '#222c44', 5, { opacity: 0.8 });                                                      // the dark where it meets the floor
}

// ---------------------------------------------------------------- the wall that faces us
{
  const inside = (x, y) => x < B[0] && y > C[1] && y < B[1];
  const wall = (x, y) => {
    let c = mix('#33415d', '#43526f', nA(x / 90, y / 60));
    c = mix(c, '#1f2940', smooth(C[1] + 46, C[1], y) * 0.55);                                    // darker under the edge of the roof
    c = mix(c, '#232e46', nC(x / 7, y / 170) > 0.6 ? 0.34 * smooth(B[1], C[1] + 40, y) : 0);     // the marks of rain, down from the top
    c = mix(c, '#6c84b0', smooth(B[1] - 120, B[1], y) * 0.34);                                   // the light of the wet floor on its foot
    return mix(c, '#6c84b4', smooth(B[0] - 110, B[0], x) * 0.16);                                // and of the sky, round its corner
  };
  p.fill({ inside, bounds: [A[0], C[1], B[0], B[1]], width: 10, length: 90, spacing: 0.5, angle: () => Math.PI / 2 + r.range(-0.02, 0.02), color: wall, stroke: { ...line, opacity: 0.97 } });
  p.fill({ inside, bounds: [A[0], C[1], B[0], B[1]], width: 6, length: 46, spacing: 0.9, overlap: 0.7, angle: () => Math.PI / 2 + r.range(-0.03, 0.03), color: (x, y) => wall(x + r.range(-4, 4), y), stroke: { ...line, opacity: 0.85 } });
  for (const h of [1.0, 2.0]) mark([front(HUT.x0, h), front(HUT.x1, h)], '#1f2940', 4.4, { opacity: 0.35 });                                   // the lines where the concrete was poured
  mark([[0, B[1] - 2], [B[0], B[1] - 2]], '#161e30', 6, { opacity: 0.85 });                                                                    // the dark at its foot
  // the door: grey green steel, a small window of wire glass, a handle; and a lamp over it
  const d0 = -5.55, d1 = -4.65, dh = 2.02, [dx0, dyb] = front(d0, 0), [dx1, dyt] = front(d1, dh);
  const door = (x, y) => mix(mix(mix('#465e62', '#587076', nB(x / 40, y / 50)), '#7c98a0', smooth(dyb - 110, dyb, y) * 0.3), '#2c3c44', smooth(dyt + 30, dyt, y) * 0.4);
  p.fill({ inside: (x, y) => x > dx0 && x < dx1 && y > dyt && y < dyb, bounds: [dx0, dyt, dx1, dyb], width: 8, length: 70, spacing: 0.5, angle: () => Math.PI / 2, color: door, stroke: { ...line, opacity: 0.97 } });
  for (const [x, w] of [[dx0 - 2, 6], [dx1 + 2, 6]]) mark([[x, dyb], [x, dyt - 4]], '#1a2234', w);                                              // its frame
  mark([[dx0 - 5, dyt - 4], [dx1 + 5, dyt - 4]], '#1a2234', 6);
  mark([[dx0 + 3, dyb - 1.02 * s0], [dx1 - 3, dyb - 1.02 * s0]], '#34484e', 4.4, { opacity: 0.6 });                                            // the line across its middle
  { const [wx0, wy0] = front(-5.32, 1.72), [wx1, wy1] = front(-4.9, 1.34); for (let y = wy0 + 4; y < wy1; y += 6.5) mark([[wx0, y], [wx1, y]], mix('#2c4c94', '#5c84cc', (y - wy0) / (wy1 - wy0)), 7); mark([[wx0 + 6, wy0 + 6], [wx1 - 8, wy0 + 10]], '#a8c4f0', 4, { opacity: 0.6 }); for (const x of [wx0 - 1, wx1 + 1]) mark([[x, wy0 - 2], [x, wy1 + 2]], '#1a2234', 4.4); mark([[wx0 - 3, wy0 - 1], [wx1 + 3, wy0 - 1]], '#1a2234', 4.4); mark([[wx0 - 3, wy1 + 1], [wx1 + 3, wy1 + 1]], '#1a2234', 4.4); }   // its window: the deep blue of the sky behind us
  mark([front(-4.78, 1.1), front(-4.78, 0.94)], '#c4d0e4', 5, { cap: 'round' });                                                               // its handle
  mark([front(d0 - 0.1, 0.03), front(d1 + 0.1, 0.03)], '#6c7c98', 7);                                                                           // the step under it
  { const [lx, ly] = front(-5.1, 2.34); mark([[lx - 10, ly], [lx + 10, ly]], '#8c9cb8', 8); mark([[lx - 9, ly - 4], [lx + 9, ly - 4]], '#dce6f6', 4, { opacity: 0.7 }); }   // the lamp
  // a small white plate beside the door, with a red line on it
  { const [x0, y0] = front(-4.48, 1.72), [x1, y1] = front(-4.2, 1.46); for (let y = y0 + 3.5; y < y1; y += 6) mark([[x0, y], [x1, y]], '#a8b4cc', 6.5); mark([[x0 + 3, y0 + 9], [x1 - 3, y0 + 9]], '#a03040', 4, { opacity: 0.9 }); }
  // the pipe that brings the rain down from the roof
  { const x = front(-4.0, 0)[0]; mark([[x + 4, B[1] - 2], [x + 4, top + 6]], '#1f2940', 5, { opacity: 0.6 }); mark([[x, B[1] - 2], [x, top + 6]], '#5a6c90', 7); mark([[x - 2, B[1] - 2], [x - 2, top + 6]], '#8498bc', 4, { opacity: 0.6 }); for (const h of [0.5, 1.5, 2.5]) mark([[x - 7, front(0, h)[1]], [x + 7, front(0, h)[1]]], '#2c3a56', 5); }
  // the red box of the fire hose
  { const [x0, y0] = front(-3.82, 1.36), [x1, y1] = front(-3.34, 0.66);
    for (let y = y0 + 4; y < y1 + 1; y += 6) mark([[x0, y], [x1, y]], mix(mix('#8c2832', '#70202c', (y - y0) / (y1 - y0)), '#a84048', nB(y / 9, 3) * 0.3), 7.5);
    mark([[x0 - 1, y0], [x1 + 1, y0]], '#c86068', 4.4); for (const x of [x0 - 1, x1 + 1]) mark([[x, y0], [x, y1 + 2]], '#48141c', 4.4, { opacity: 0.9 }); mark([[x0 - 1, y1 + 3], [x1 + 1, y1 + 3]], '#48141c', 4.6);
    mark([[x0 + 8, y0 + 16], [x1 - 8, y0 + 16]], '#e4d8d8', 5, { opacity: 0.85 }); mark([[x1 - 9, y0 + 30], [x1 - 9, y0 + 44]], '#2c0c12', 4.4); }
  // the iron rungs that go up to the roof, past its edge
  { const [x0] = front(-3.16, 0), [x1] = front(-3.16 + 0.34, 0), yb = front(0, 0.45)[1], yt = front(0, HUT.h + 0.62)[1];
    for (const x of [x0, x1]) { mark([[x + 3, yb], [x + 3, top + 8]], '#1a2234', 4.4, { opacity: 0.5 }); mark([[x, yb], [x, yt]], '#8a9ab8', 5, { cap: 'round' }); mark([[x, top - 2], [x, yt]], '#26324e', 5, { cap: 'round' }); }
    for (let h = 0.6; h < HUT.h + 0.5; h += 0.3) { const y = front(0, h)[1]; mark([[x0, y], [x1, y]], y < top ? '#26324e' : '#8a9ab8', 4.4); }
    mark([[x0, yt], [(x0 + x1) / 2, yt - 6], [x1, yt]], '#26324e', 5, { cap: 'round' }); }
}

// ---------------------------------------------------------------- the edge of the roof of the hut: a thick slab, dark under, with the sun along its top
for (const [a, b, ya, yb] of [[A[0] - 6, B[0] + 3, top, top], [B[0] + 3, B2[0] + 2, top, top2]]) {
  mark([[a, C[1] - (C[1] - ya) * 0.4 + (a === A[0] - 6 ? 0 : 0)], [b, (a === A[0] - 6 ? C[1] : C2[1]) - ((a === A[0] - 6 ? C[1] : C2[1]) - yb) * 0.4]], a === A[0] - 6 ? '#4c5c7c' : '#62769c', a === A[0] - 6 ? (C[1] - top) * 0.95 : 10);
  mark([[a, ya + 1], [b, yb + 1]], '#f6faff', 5, { cap: 'round' });
}

p.save();
