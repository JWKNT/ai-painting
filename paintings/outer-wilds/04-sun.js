// The sun, swollen into a red giant: a halo, a base of circling strokes, churning surface
// strokes over it, bright granules, a rim, and flares lifting off the limb.
'use strict';
const { studio, open, SUN, grad, nB, nC, aroundSun, clamp, rimArcs } = require('./scene');
const { arc, mix } = studio;

const p = open('sun');
const r = p.rng;
const { x: sx, y: sy, r: R } = SUN;

// Halo.
for (const [rad, width, color, opacity] of [
  [R + 190, 240, '#c8433a', 0.2], [R + 120, 200, '#e8622f', 0.24], [R + 60, 150, '#fa8a38', 0.3], [R + 22, 90, '#ffab4e', 0.38],
]) {
  const a0 = r() * 6.283;
  p.stroke({ brush: 'soft', color, width, opacity, points: arc(sx, sy, rad, a0, a0 + 6.283, 40) });
}

const radial = grad([[0, '#ffc75f'], [0.45, '#fc9b35'], [0.74, '#ef6c25'], [0.9, '#d4461f'], [1, '#a92c1c']]);
function surface(x, y) {
  const rho = Math.hypot(x - sx, y - sy) / R;
  let c = radial(rho);
  const g = nC(x / 36, y / 36) * 0.65 + nB(x / 110, y / 110) * 0.35;
  if (g > 0.56) c = mix(c, '#ffe59c', clamp((g - 0.56) * 2.2, 0, 0.7));
  else if (g < 0.42) c = mix(c, '#9a2a1a', clamp((0.42 - g) * 2.4, 0, 0.75));
  return c;
}

// Base: rings from the rim to the middle so nothing of the sky shows through.
for (let rad = R - 20; rad >= 42; rad -= 26) {
  const n = Math.max(3, Math.round(rad / 45));
  for (let k = 0; k < n; k++) {
    const a = (k + r()) / n * 6.283, seg = 6.283 / n * 1.15;
    p.stroke({ brush: 'bristle', color: radial(rad / R), width: 40, mix: 0.1, points: arc(sx, sy, rad, a, a + seg, 12) });
  }
}
p.line(sx - 44, sy - 8, sx + 44, sy + 8, { brush: 'bristle', color: radial(0), width: 40 });
p.line(sx - 8, sy + 44, sx + 8, sy - 44, { brush: 'bristle', color: radial(0), width: 40 });

// The surface churns: strokes that mostly circle but wander.
const churn = (x, y) => aroundSun(x, y) + (nB(x / 85, y / 85) - 0.5) * 2.6;
const within = (m) => (x, y) => Math.hypot(x - sx, y - sy) < R - m;
const box = [sx - R, sy - R, sx + R, sy + R];
p.fill({ inside: within(14), bounds: box, width: 26, length: 110, spacing: 0.6, angle: churn, color: surface, stroke: { brush: 'bristle', opacity: 0.92, mix: 0.2 } });
p.fill({ inside: within(8), bounds: box, width: 13, length: 62, spacing: 0.8, overlap: 0.7, angle: churn, color: surface, stroke: { brush: 'bristle', opacity: 0.8, mix: 0.15 } });

// Bright granules where the surface is hottest.
p.fill({
  inside: (x, y) => Math.hypot(x - sx, y - sy) < R * 0.86 && nC(x / 36, y / 36) * 0.65 + nB(x / 110, y / 110) * 0.35 > 0.6,
  bounds: box, width: 8, length: 52, spacing: 1.9, overlap: 1, angle: churn,
  color: () => r.pick(['#ffe9a8', '#fff0bc', '#ffd98a']), stroke: { brush: 'bristle', opacity: 0.42, mix: 0.3 },
});

// Dark filaments near the limb.
p.fill({
  inside: (x, y) => { const rho = Math.hypot(x - sx, y - sy) / R; return rho > 0.6 && rho < 0.97 && nC(x / 36, y / 36) < 0.36; },
  bounds: box, width: 9, length: 56, spacing: 2, overlap: 1, angle: churn,
  color: () => r.pick(['#8a2318', '#7a1f1c', '#a02c1a']), stroke: { brush: 'bristle', opacity: 0.4, mix: 0.3 },
});

// Rim: a clean edge, darker than the body, then a thin line of glow just outside it.
rimArcs(p, sx, sy, R + 1, 16, () => r.pick(['#c8401d', '#d24a20', '#bd381c']), { stroke: { brush: 'bristle', opacity: 0.5, rag: 0, cap: 'round', mix: 0.3 }, seg: 0.3 });
for (let k = 0; k < 3; k++) {
  const a0 = r() * 6.283;
  p.stroke({ brush: 'soft', color: '#ffb057', width: 26, opacity: 0.34, points: arc(sx, sy, R + 9, a0, a0 + 6.283, 60) });
}

// Corona: faint streamers leaning out from the limb all the way round.
for (let k = 0; k < 46; k++) {
  const a = -Math.PI * 1.08 + (k + r()) / 46 * Math.PI * 1.16, lean = r.range(-0.5, 0.5);
  const len = r.range(46, 120), width = r.range(12, 22);
  const at = (d, f) => [sx + Math.cos(a + lean * f * d / R) * (R + d), sy + Math.sin(a + lean * f * d / R) * (R + d)];
  p.stroke({ brush: 'soft', color: r.pick(['#ffb45c', '#ffa04a', '#ffc66e']), width, opacity: r.range(0.1, 0.2), taper: [0, 0.9], points: [at(-6, 0), at(len * 0.5, 0.6), at(len, 1)] });
}

// Prominences: fire lifting off the limb in threads. Some rise and come back down in a loop,
// some lean away along the limb and fray out. Each is a few thin strokes over a soft glow.
const thread = (pts, heat, w) => p.tryStroke({ brush: 'bristle', color: mix(mix('#d9521f', '#ff9a3c', heat), '#ffd47c', Math.max(0, heat * 2 - 1) * 0.8), width: w, opacity: 0.5 + 0.3 * heat, mix: 0.3, dry: 0.12, rag: 0.3, streak: 0.3, taper: [0.2, 0.6], points: pts });
const loop = (deg, reach, wide, n) => {
  const a = deg * Math.PI / 180, path = (k, shift) => {
    const pts = [];
    for (let i = 0; i <= 10; i++) {
      const f = i / 10, rad = R - 6 + reach * k * Math.pow(Math.sin(f * Math.PI), 0.8), ang = a + (f - 0.5) * wide * (0.75 + 0.3 * k) + shift;
      pts.push([sx + Math.cos(ang) * rad, sy + Math.sin(ang) * rad]);
    }
    return pts;
  };
  p.tryStroke({ brush: 'soft', color: '#ff8a3a', width: Math.min(34, reach * 0.8), opacity: 0.26, points: path(0.9, 0) });
  for (let j = 0; j < n; j++) thread(path(1 - j * 0.17 + r.range(-0.04, 0.04), r.range(-0.012, 0.012)), j / Math.max(1, n - 1), Math.max(4.6, 8.5 - j * 1.3));
};
const plume = (deg, reach, drift, n) => {
  const a = deg * Math.PI / 180, path = (k, shift) => {
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const f = i / 6, rad = R - 8 + reach * k * Math.pow(Math.sin(f * Math.PI / 2), 0.85), ang = a + shift + drift / R * f * f * (0.7 + 0.5 * k);
      pts.push([sx + Math.cos(ang) * rad, sy + Math.sin(ang) * rad]);
    }
    return pts;
  };
  p.tryStroke({ brush: 'soft', color: '#ff8a3a', width: Math.min(30, reach * 0.7), opacity: 0.24, taper: [0, 0.8], points: path(0.9, 0) });
  for (let j = 0; j < n; j++) thread(path(1 - j * 0.2 + r.range(-0.05, 0.05), (j - (n - 1) / 2) * 0.022 + r.range(-0.008, 0.008)), j / Math.max(1, n - 1), Math.max(4.6, 8 - j * 1.2));
};
plume(-166, 44, 60, 3);
loop(-141, 30, 0.2, 3);
plume(-112, 38, 44, 3);
loop(-97, 58, 0.46, 5);
plume(-78, 30, -40, 2);
plume(-49, 50, 64, 4);
loop(-33, 36, 0.3, 4);
plume(-24, 28, -30, 2);
plume(-6, 40, 46, 3);

p.save();
