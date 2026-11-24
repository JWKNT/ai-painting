// The floor of the stadium: pale, wide and empty. The stands at our right put their long
// shade on it, and the hill of flowers puts its shade to the left. A way of dark polished
// stone leads to the steps: it shows, faintly and upside down, what stands at its end.
// Then the two white steps, and the two white blocks at their sides.
'use strict';
const { studio, open, W, H, CAM, at, unit, groundAt, sunOn, SUN, HAZE, far, heap, seeHeap, heapShade, standShade, friendShade, inFriend, COFFIN, STEPS, CARPET, FRIEND, white, skyColor, nA, nB, nC, nD } = require('./scene');
const { mix, clamp, smooth, lerp, inPoly, shift } = studio;

const p = open('ground');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.16, cap: 'round' };
const inCoffin = inPoly(COFFIN.outline);
const hidden = (x, y) => y < 770 && !!seeHeap(x, y) && !!seeHeap(x + (x < 800 ? -40 : 40), y) && !!seeHeap(x, y - 30);
const onWay = (x, y) => { if (y <= CAM.hz + 1) return false; const [X, Z] = groundAt(x, y); return Math.abs(X) < CARPET.half && Z < STEPS.z[0]; };

// ---- the field

const SUNLIT = ['#f2e8d0', '#e8dcc2'], SHADED = ['#a2a4cc', '#8e90bc'];
function fieldColor(x, y) {
  const [X, Z] = groundAt(x, y), n = nA(X / 3 + 40, Z / 3) * 0.6 + nB(X * 1.3, Z * 1.3) * 0.4;
  const shade = standShade(X, Z) || heapShade(X, 0, Z) || friendShade(X, 0, Z);
  let c = shade ? mix(SHADED[0], SHADED[1], n) : mix(SUNLIT[0], SUNLIT[1], n);
  c = mix(c, shade ? '#b4bcd8' : '#dfe2ea', smooth(30, 160, Z) * 0.5);                  // far off it takes the pale of the sky
  return c;
}
const fieldTop = 626;
const wideAt = (y) => clamp((y - 600) * 0.11, 5, 40);
for (const [k, len, sp, op] of [[1, 9, 0.5, 0.96], [0.55, 8, 0.8, 0.8], [0.3, 7, 1.2, 0.6]]) {
  p.fill({
    inside: (x, y) => y > fieldTop && !hidden(x, y), bounds: [0, fieldTop, W, H], width: (x, y) => Math.max(4.8, wideAt(y) * k), length: 150, spacing: sp, overlap: 0.6,
    angle: (x, y) => (nC(x / 300, y / 60) - 0.5) * 0.05, color: (x, y) => shift(fieldColor(x + r.range(-6, 6), y + r.range(-2, 2)), r.range(-2, 2), r.range(-0.02, 0.02), r.range(-0.012, 0.012)), stroke: { ...line, opacity: op },
  });
}
// The far part of it lies in a few units of the picture, so its lines of light and shade are long level strokes.
for (let y = 628; y < 668; y += 3.2) {
  for (let x = -40; x < W; ) {
    const len = r.range(70, 190), c = fieldColor(clamp(x + len / 2, 0, W), y);
    if (!hidden(x + len / 2, y)) p.tryStroke({ ...line, mix: 0.2, color: shift(c, 0, 0, r.range(-0.012, 0.012)), width: clamp(wideAt(y) * 0.8, 4.8, 8), opacity: 0.85, points: [[x, y + r.range(-1, 1)], [x + len, y + r.range(-1, 1)]] });
    x += len * 0.85;
  }
}

// The floor is laid in great sheets. Their joints are thin lines that go away from us, and a few that go across: faint, and broken.
{
  const shadeAt = (X, Z) => standShade(X, Z) || heapShade(X, 0, Z);
  const joint = (a, b, o) => { const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (hidden(m[0], m[1]) || m[0] < -30 || m[0] > W + 30 || m[1] > H + 10) return; const [X, Z] = groundAt(m[0], m[1]); p.tryStroke({ brush: 'round', color: shadeAt(X, Z) ? '#6e72a2' : '#cabea4', width: 4, opacity: o * r.range(0.6, 1), taper: [0.3, 0.3], points: [a, b] }); };
  for (const X of [-27, -19, -13, -8.4, -5, -2.7, 2.7, 5, 8.4, 13, 19, 27]) {
    let Z = 3.5;
    while (Z < 44) { const Z1 = Z * r.range(1.12, 1.3); if (r() < 0.72 && !(Math.abs(X) < 3 && Z1 > 6.9)) joint(at(X, 0, Z), at(X, 0, Z1), 0.3); Z = Z1 * 1.01; }
  }
  for (const Z of [4.6, 6.2, 11.5, 17, 26]) {
    let X = -30;
    while (X < 30) { const X1 = X + r.range(1.5, 4) * (Z / 6); if (r() < 0.6 && (Math.abs(X) > 1.5 || Z > 9) && (Math.abs(X1) > 1.5 || Z > 9) && X * X1 > 0) joint(at(X, 0, Z), at(X1, 0, Z), 0.22); X = X1 + 0.2; }
  }
}

// ---- the way of polished stone

// What shows in the stone at a place of it: we look from under the floor, up along the same line, and see what is there.
const SUIT = ['#3f3b58', '#6f6a8c'];
function mirrored(x, y) {
  const dx = (x - CAM.vx) / CAM.f, dy = (y - CAM.hz) / CAM.f, Yat = (t) => -CAM.eye + dy * t;
  const v = Yat(FRIEND.Z), u = dx * FRIEND.Z;
  if (inFriend(u, v)) return v < 0.07 ? '#14131c' : mix(SUIT[0], SUIT[1], clamp(0.5 + u * 4, 0, 1));
  for (let i = 0; i < 2; i++) { const Z = STEPS.z[i], Y = Yat(Z); if (Math.abs(dx * Z) < STEPS.half && Y >= i * STEPS.rise && Y < (i + 1) * STEPS.rise) return friendShade(dx * Z, Y, Z) ? '#8f90ba' : '#efe6d6'; }
  { const t = 7.288 / (1 - 0.4187 * dy), P = at(dx * t, Yat(t), t); if (Yat(t) > 0.4 && inCoffin(P[0], P[1])) return '#1c1226'; }
  for (let t = 7.3; t < 15; t += 0.08) if (Yat(t) > 0 && heap(dx * t, Yat(t), t) < 0) { const hp = seeHeap(...at(dx * t, Yat(t), t)); return friendShade(dx * t, Yat(t), t) ? '#8a8cc0' : white(clamp(0.44 + 0.55 * (hp ? hp.sun : 0.3), 0, 1)); }
  return skyColor(x, Math.max(0, 2 * CAM.hz - y));
}
const STONE = ['#24121e', '#3a1c2a'];
const shine = (y) => lerp(0.5, 0.26, clamp((y - 820) / 180, 0, 1));         // it shows more where we see it at a flatter angle
function wayColor(x, y) {
  const [X, Z] = groundAt(x, y), base = mix(STONE[0], STONE[1], nB(X * 2 + 3, Z * 0.8) * 0.7 + 0.3 * nA(X * 9, Z * 2));
  const c = mix(friendShade(X, 0, Z) ? mix(base, '#0c0812', 0.55) : base, mirrored(x, y), shine(y) * (0.8 + 0.4 * nC(x / 30, y / 90)));
  return c;
}
// what shows in it runs down the stone in upright strokes
p.fill({ inside: onWay, bounds: [420, 812, 1180, H], width: 15, length: 76, spacing: 0.5, overlap: 0.5, angle: (x, y) => Math.PI / 2 + (x - 800) / 2600, color: (x, y) => wayColor(x + r.range(-3, 3), y + r.range(-10, 10)), stroke: { ...line, mix: 0.22, rag: 0.2, opacity: 0.97 } });
p.fill({ inside: onWay, bounds: [420, 812, 1180, H], width: 8, length: 60, spacing: 0.75, overlap: 0.6, angle: (x, y) => Math.PI / 2 + (x - 800) / 2600, color: (x, y) => shift(wayColor(x, y + r.range(-6, 6)), 0, 0, r.range(-0.02, 0.02)), stroke: { ...line, mix: 0.22, rag: 0.2, opacity: 0.85 } });
p.fill({ inside: onWay, bounds: [420, 812, 1180, H], width: 5.5, length: 44, spacing: 1.1, overlap: 0.6, angle: (x, y) => Math.PI / 2 + (x - 800) / 2600, color: (x, y) => shift(wayColor(x, y), 0, 0.02, r.range(-0.01, 0.03)), stroke: { ...line, mix: 0.2, rag: 0.2, opacity: 0.7 } });
// level touches break what shows in it: the grain of the stone, and the light of the sky on it
for (let k = 0; k < 150; k++) {
  const y = r.range(826, H - 6), [, Z] = groundAt(800, y), half = CAM.f * CARPET.half / Z - 8, x = 800 + r.range(-1, 1) * half, len = r.range(24, 90) * (0.6 + (y - 820) / 300);
  if (!onWay(x - len / 2, y) || !onWay(x + len / 2, y)) continue;
  const sky = r() < 0.6;
  p.tryStroke({ brush: 'round', color: sky ? mix('#8ea8d8', '#d8dcec', r()) : '#12080e', width: r.range(4, 5.2), opacity: sky ? r.range(0.06, 0.2) : r.range(0.12, 0.3), taper: [0.4, 0.4], points: [[x - len / 2, y], [x + len / 2, y + r.range(-0.6, 0.6)]] });
}
// the joints between its slabs, and its two edges: a kerb of pale stone that takes the sun
for (const Z of [4.8, 6.0]) { const [x0, y] = at(-CARPET.half, 0, Z), [x1] = at(CARPET.half, 0, Z); p.stroke({ brush: 'round', color: '#0e070c', width: 4, opacity: 0.5, points: [[x0 + 4, y], [(x0 + x1) / 2, y + 0.5], [x1 - 4, y]] }); }
for (const s of [-1, 1]) {
  let Z = 3.4;
  while (Z < STEPS.z[0] - 0.05) {
    const Z1 = Math.min(STEPS.z[0], Z + r.range(0.5, 1.1)), a = at(s * (CARPET.half + 0.045), 0, Z), b = at(s * (CARPET.half + 0.045), 0, Z1), w = clamp(unit((Z + Z1) / 2) * 0.09, 5, 18);
    const [gx, gz] = [s * CARPET.half, (Z + Z1) / 2], shade = friendShade(gx, 0, gz);
    p.tryStroke({ ...line, rag: 0.03, mix: 0.05, color: shade ? '#8c8eb8' : mix('#fbf4e2', '#e9dfc8', r()), width: w, points: [a, b] });
    p.tryStroke({ brush: 'round', color: '#6c6470', width: 4, opacity: 0.4, points: [[a[0] + s * w * 0.55, a[1]], [b[0] + s * w * 0.55, b[1]]] });
    Z = Z1 - 0.03;
  }
}

// ---- the steps and the blocks at their sides

// A flat face in the picture: `quad` is its outline, `place(x, y)` the place of the stadium that shows at a place of it, `n` the way that it faces.
function face(quad, place, n, o = {}) {
  const xs = quad.map((q) => q[0]), ys = quad.map((q) => q[1]), b = [Math.min(...xs) - 2, Math.min(...ys) - 2, Math.max(...xs) + 2, Math.max(...ys) + 2];
  const sun = sunOn(n), w = o.width || 9;
  const tone = (x, y) => {
    const P = place(x, y), shade = sun <= 0 || friendShade(...P) || (o.shade && o.shade(...P));
    const c = shade ? mix('#9496c2', '#a8a8d0', nB(x / 14, y / 14)) : mix(mix('#d9d2cc', '#fff8e8', clamp(sun * 1.25, 0, 1)), '#f0e2c4', nB(x / 14, y / 14) * 0.25);
    return o.tint ? o.tint(c, x, y, P) : c;
  };
  p.fill({ inside: inPoly(quad), bounds: b, width: w, length: o.length || 60, spacing: 0.5, overlap: 0.55, angle: o.angle || 0, color: (x, y) => tone(x + r.range(-2, 2), y + r.range(-2, 2)), stroke: { ...line, rag: 0.06, mix: 0.1, opacity: 0.97 } });
  p.fill({ inside: inPoly(quad), bounds: b, width: Math.max(4.8, w * 0.55), length: (o.length || 60) * 0.7, spacing: 0.9, overlap: 0.6, angle: o.angle || 0, color: (x, y) => shift(tone(x, y), 0, 0, r.range(-0.012, 0.014)), stroke: { ...line, rag: 0.06, mix: 0.1, opacity: 0.8 } });
}
const riserPlace = (Z) => (x, y) => [(x - CAM.vx) * Z / CAM.f, CAM.eye - (y - CAM.hz) * Z / CAM.f, Z];
const levelPlace = (Y) => (x, y) => { const Z = CAM.f * (CAM.eye - Y) / Math.max(0.5, y - CAM.hz); return [(x - CAM.vx) * Z / CAM.f, Y, Z]; };
const sidePlace = (X) => (x, y) => { const Z = CAM.f * X / (x - CAM.vx); return [X, CAM.eye - (y - CAM.hz) * Z / CAM.f, Z]; };
const hf = STEPS.half, [z1, z2, z3] = STEPS.z, rise = STEPS.rise;
// the floor at the top of the steps, then each step from the top down: its top, then its front
face([at(-hf, 2 * rise, z2), at(hf, 2 * rise, z2), at(hf, 2 * rise, STEPS.back), at(-hf, 2 * rise, STEPS.back)], levelPlace(2 * rise), [0, 1, 0], { width: 6, length: 80 });
face([at(-hf, rise, z2), at(hf, rise, z2), at(hf, 2 * rise, z2), at(-hf, 2 * rise, z2)], riserPlace(z2), [0, 0, -1], { width: 9, length: 90 });
face([at(-hf, rise, z1), at(hf, rise, z1), at(hf, rise, z2), at(-hf, rise, z2)], levelPlace(rise), [0, 1, 0], { width: 5, length: 80 });
face([at(-hf, 0, z1), at(hf, 0, z1), at(hf, rise, z1), at(-hf, rise, z1)], riserPlace(z1), [0, 0, -1], { width: 9, length: 90 });
// the edge of each step: a line of light along its top, and a thin shade under its nose
for (const [Y, Z] of [[rise, z1], [2 * rise, z2]]) {
  const a = at(-hf, Y, Z), b = at(hf, Y, Z);
  for (let x = a[0]; x < b[0] - 20; ) { const len = r.range(40, 120), x1 = Math.min(b[0], x + len), X = (x + x1) / 2, P = riserPlace(Z)(X, a[1] + 2); if (!friendShade(P[0], Y, Z + 0.01)) p.tryStroke({ brush: 'round', color: '#fffdf4', width: 4.2, opacity: 0.8, points: [[x, a[1] + 1], [x1, a[1] + 1]] }); x = x1 + r.range(0, 10); }
  p.stroke({ brush: 'soft', color: '#7a7aa8', width: 8.4, opacity: 0.28, points: [[a[0], a[1] + 8], [b[0], b[1] + 8]] });
}
p.stroke({ brush: 'soft', color: '#3a3050', width: 9, opacity: 0.35, points: [at(-hf, 0, z1 - 0.02).map((v, i) => v + (i ? -1 : 0)), at(hf, 0, z1 - 0.02).map((v, i) => v + (i ? -1 : 0))] });   // where the first step meets the dark stone

// The blocks at each side of the steps: white stone, with a top that goes up toward the back.
for (const s of [-1, 1]) {
  const xi = s * hf, xo = s * (hf + 0.46), zf = 7.08, zb = 8.15, hfY = 0.32, hbY = 0.78;
  // its side toward the steps, its front and its top
  face([at(xi, 0, zf), at(xi, hfY, zf), at(xi, hbY, zb), at(xi, 2 * rise, zb), at(xi, 2 * rise, z2), at(xi, rise, z2), at(xi, rise, z1), at(xi, 0, z1)], sidePlace(xi), [-s, 0, 0], { width: 6, length: 40, angle: -0.5 * s });
  face([at(xi, 0, zf), at(xo, 0, zf), at(xo, hfY, zf), at(xi, hfY, zf)], riserPlace(zf), [0, 0, -1], { width: 9, length: 40 });
  face([at(xi, hfY, zf), at(xo, hfY, zf), at(xo, hbY, zb), at(xi, hbY, zb)], (x, y) => { const t = clamp((at(0, hfY, zf)[1] - y) / (at(0, hfY, zf)[1] - at(0, hbY, zb)[1]), 0, 1), Z = lerp(zf, zb, t); return [(x - CAM.vx) * Z / CAM.f, lerp(hfY, hbY, t), Z]; }, [0, 0.92, -0.39], { width: 7, length: 50, angle: Math.atan2(at(xi, hbY, zb)[1] - at(xi, hfY, zf)[1], at(xi, hbY, zb)[0] - at(xi, hfY, zf)[0]) });
  // the line of light along its near top edge, and the dark where it stands on the floor
  { const a = at(xi, hfY, zf), b = at(xo, hfY, zf); const P = [s * (hf + 0.2), hfY, zf]; if (!friendShade(...P)) p.stroke({ brush: 'round', color: '#fffdf4', width: 4.4, opacity: 0.85, points: [[Math.min(a[0], b[0]) + 2, a[1] + 1], [Math.max(a[0], b[0]) - 2, a[1] + 1]] }); }
  { const a = at(xi, 0, zf), b = at(xo, 0, zf); p.stroke({ brush: 'soft', color: '#4a4468', width: 9, opacity: 0.3, points: [[Math.min(a[0], b[0]) - 4, a[1] + 2], [Math.max(a[0], b[0]) + 4, a[1] + 2]] }); }
}

p.save();
