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

// Flares: tongues of fire leaning along the limb, and two arches with both feet on it.
const tongue = (deg, reach, drift, width) => {
  const a = deg * Math.PI / 180;
  const pts = [];
  for (let k = 0; k <= 6; k++) {
    const f = k / 6, rad = R - 8 + reach * Math.pow(Math.sin(f * Math.PI / 2), 0.85), ang = a + drift / R * f * f;
    pts.push([sx + Math.cos(ang) * rad, sy + Math.sin(ang) * rad]);
  }
  const fit = (stroke, widths) => widths.some((w) => p.tryStroke({ ...stroke, width: w }));
  fit({ brush: 'soft', color: '#ff8a3a', opacity: 0.42, taper: [0, 0.8], points: pts }, [width * 2.4, width * 1.6, 10]);
  fit({ brush: 'round', hardness: 0.45, color: '#ee6f28', opacity: 0.8, taper: [0, 1], points: pts }, [width * 1.25, width * 0.8, 7]);
  fit({ brush: 'round', hardness: 0.45, color: '#ff9c40', opacity: 0.75, taper: [0, 1], points: pts.slice(0, 6) }, [width * 0.8, 7]);
  fit({ brush: 'round', hardness: 0.45, color: '#ffc46c', opacity: 0.6, taper: [0, 1], points: pts.slice(0, 4) }, [width * 0.45, 6]);
};
for (const t of [[-166, 40, 60, 20], [-141, 26, -34, 14], [-112, 34, 44, 17], [-78, 30, -40, 15], [-49, 46, 64, 21], [-24, 28, -30, 14], [-6, 36, 46, 17]]) tongue(...t);

const arch = (deg, reach, wide, width) => {
  const a = deg * Math.PI / 180, pts = [];
  for (let k = 0; k <= 8; k++) {
    const f = k / 8, rad = R - 6 + reach * Math.sin(f * Math.PI), ang = a + (f - 0.5) * wide;
    pts.push([sx + Math.cos(ang) * rad, sy + Math.sin(ang) * rad]);
  }
  p.stroke({ brush: 'soft', color: '#ff8a3a', width: width * 3.2, opacity: 0.34, points: pts });
  p.stroke({ brush: 'round', hardness: 0.4, color: '#f98232', width, opacity: 0.6, points: pts });
  p.stroke({ brush: 'round', hardness: 0.4, color: '#ffbe68', width: Math.max(6, width * 0.5), opacity: 0.45, points: pts.slice(1, 8) });
};
arch(-97, 52, 0.46, 11);
arch(-33, 32, 0.3, 9);

p.save();
