// Green: the sister world, at its nearest. A great ball in the dusk, lit on the side that
// faces the sun and dark on the other, though not so dark that the whole round of it cannot
// be seen. It is a world of jungle and swamp under bands of cloud. Its air glows a little
// along the lit edge.
'use strict';
const { studio, open, GREEN, TO_SUN, nA, nB, nC } = require('./scene');
const { mix, smooth, orb, disc, arc, glint, wave } = studio;

const p = open('green');
const r = p.rng;
const { x: cx, y: cy, r: R } = GREEN, TILT = 0.34;

// How a place on it faces the sun: above 0 it is day there.
const day = (x, y) => { const nx = (x - cx) / R, ny = (y - cy) / R, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny)); return nx * TO_SUN[0] + ny * TO_SUN[1] + nz * TO_SUN[2]; };
const turned = (x, y) => { const u = (x - cx) / R, v = (y - cy) / R; return [u * Math.cos(TILT) + v * Math.sin(TILT), -u * Math.sin(TILT) + v * Math.cos(TILT)]; };   // a place on it, measured along and across its bands of cloud
function surface(x, y) {
  const [u, v] = turned(x, y);
  let c = mix('#0e5a2e', '#55c85c', smooth(0.3, 0.75, nC(u * 2.2 + 3, v * 2.2)));                       // jungle, dark and bright
  c = mix(c, '#0b464c', smooth(0.6, 0.78, nB(u * 1.4 + 9, v * 1.4)) * 0.85);                            // swamp and sea
  const cloud = smooth(0.6, 0.8, nA(u * 1.1 + nB(u * 2, v * 2) * 0.5, v * 3.4 + 7));
  return mix(c, '#e4f8d6', cloud * 0.8);                                                               // cloud, in bands
}
function color(x, y) {
  const l = day(x, y), lit = smooth(-0.1, 0.42, l), rho = Math.hypot(x - cx, y - cy) / R, s = surface(x, y);
  let c = mix(mix('#06150f', '#0c3220', 0.35 + 0.65 * (nC(x / 40, y / 40))), mix(s, '#0a2a1e', 0.86), 0.5);   // night: only a darker green
  c = mix(c, s, lit);
  c = mix(c, '#fbffd8', smooth(0.75, 1, l) * 0.2);                                                      // where the sun is highest
  return mix(c, lit > 0.3 ? '#b4f0a4' : '#0f3c2c', smooth(0.84, 1, rho) * 0.4);                          // its air, thick toward the edge
}

// The glow of its air, outside the lit edge: painted first, so that the edge is firm over it.
const sunward = Math.atan2(TO_SUN[1], TO_SUN[0]);
for (const [w, o, lift] of [[90, 0.1, 30], [44, 0.18, 12], [22, 0.26, 4]]) p.stroke({ brush: 'soft', color: '#58d488', width: w, opacity: o, points: arc(cx, cy, R + lift, sunward - 1.5, sunward + 1.5, 30) });
p.stroke({ brush: 'soft', color: '#1e6c4a', width: 60, opacity: 0.14, points: arc(cx, cy, R + 18, sunward + 1.7, sunward + 4.6, 30) });

disc(p, cx, cy, R - 2, '#0b2c1e', 24, { brush: 'bristle', mix: 0, dry: 0, rag: 0, cap: 'round' });   // a dark ground under it, so that no sky shows through
orb(p, [[cx, cy, R]], color, { width: 15, flow: (x, y) => { const [u, v] = turned(x, y); return TILT - 0.6 * u * v + (nC(x / 60, y / 60) - 0.5) * 0.5; } });

// Storms in its cloud: a few long pale strokes drawn out along the bands, on the day side.
for (let k = 0; k < 30; k++) {
  const a = r.range(0, 6.283), q = Math.sqrt(r()) * 0.86, x = cx + Math.cos(a) * R * q, y = cy + Math.sin(a) * R * q;
  if (day(x, y) < 0.15) continue;
  const [u, v] = turned(x, y), ang = TILT - 0.6 * u * v, len = r.range(30, 90) * (1 - q * 0.5);
  p.tryStroke({ brush: 'bristle', color: mix('#c4ecc0', '#f6ffe6', r()), width: r.range(5, 8), opacity: r.range(0.3, 0.6) * smooth(0.1, 0.5, day(x, y)), mix: 0.3, dry: 0.1, rag: 0.4, taper: [0.5, 0.5], points: wave(x - Math.cos(ang) * len / 2, y - Math.sin(ang) * len / 2, x + Math.cos(ang) * len / 2, y + Math.sin(ang) * len / 2, 2, 1, 5) });
}
// The bright line of its air along the lit edge.
glint(p, arc(cx, cy, R - 2.4, sunward - 1.2, sunward + 1.2, 40), () => mix('#b8f6b0', '#f6ffe0', r()), { width: 4.6, dash: 60, gap: 8, opacity: 0.8, rng: r });

p.save();
