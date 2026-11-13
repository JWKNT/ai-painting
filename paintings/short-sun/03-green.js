// Green: the sister world, at its nearest. A great ball in the dusk, lit on the side that
// faces the sun and dark on the other, though not so dark that the whole round of it cannot
// be seen. It is a world of jungle and swamp under bands of cloud. Its air glows a little
// along the lit edge.
'use strict';
const { studio, open, GREEN, TO_SUN, nA, nB, nC } = require('./scene');
const { mix, smooth, orb, disc, arc, glint } = studio;

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
  const cloud = smooth(0.58, 0.76, nA(u * 1.7 + nB(u * 2, v * 2) * 0.6, v * 2.7 + 7));
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
// The strokes run with its bands of cloud. On a ball those are not straight: each bows, more
// and more toward the edge, as the lines round a globe do. The strokes are short, so that
// the land and the sea under the cloud are broken shapes and not streaks.
const bands = (x, y) => { const [u, v] = turned(x, y); return TILT + Math.atan(-0.5 * u / Math.sqrt(Math.max(0.06, 1 - u * u - v * v))) + (nC(x / 50, y / 50) - 0.5) * 0.6; };
orb(p, [[cx, cy, R]], color, { width: 11, reach: 62, flow: bands });

// Its cloud, on the day side: heaps of it, each a few short strokes together, and two great storms that turn.
for (let k = 0; k < 34; k++) {
  const a = r.range(0, 6.283), q = Math.sqrt(r()) * 0.84, x = cx + Math.cos(a) * R * q, y = cy + Math.sin(a) * R * q;
  if (day(x, y) < 0.12 || nA(x / 46, y / 30 + 4) < 0.42) continue;
  for (let i = 0; i < 5; i++) {
    const px = x + r.gauss() * 13, py = y + r.gauss() * 7, ang = bands(px, py), len = r.range(13, 26) * (1 - q * 0.4);
    if (Math.hypot(px - cx, py - cy) > R - 12) continue;
    p.tryStroke({ brush: 'bristle', color: mix('#bfe8bc', '#f8ffea', r()), width: r.range(5, 8), opacity: r.range(0.35, 0.7) * smooth(0.08, 0.5, day(px, py)), mix: 0.25, dry: 0.08, rag: 0.4, cap: 'round', taper: [0.3, 0.3], points: [[px - Math.cos(ang) * len / 2, py - Math.sin(ang) * len / 2], [px + Math.cos(ang) * len / 2, py + Math.sin(ang) * len / 2]] });
  }
}
for (const [sx, sy, big] of [[cx + 58, cy - 46, 30], [cx + 26, cy + 70, 24]]) {
  for (let i = 0; i < 16; i++) {                                         // a storm: short strokes that go round its middle, closer together toward it
    const a = r.range(0, 6.283), rad = big * (0.25 + 0.75 * Math.pow(r(), 0.7)), px = sx + Math.cos(a) * rad, py = sy + Math.sin(a) * rad * 0.8, t = a + Math.PI / 2 + 0.35, len = r.range(13, 20);
    p.tryStroke({ brush: 'bristle', color: mix('#cdf0c8', '#fbffee', r()), width: r.range(4.8, 6.5), opacity: r.range(0.3, 0.55) * smooth(0.05, 0.4, day(sx, sy)), mix: 0.25, dry: 0.08, rag: 0.4, cap: 'round', taper: [0.3, 0.3], points: [[px - Math.cos(t) * len / 2, py - Math.sin(t) * len / 2 * 0.8], [px + Math.cos(t) * len / 2, py + Math.sin(t) * len / 2 * 0.8]] });
  }
}
// The bright line of its air along the lit edge.
glint(p, arc(cx, cy, R - 2.4, sunward - 1.2, sunward + 1.2, 40), () => mix('#b8f6b0', '#f6ffe0', r()), { width: 4.6, dash: 60, gap: 8, opacity: 0.8, rng: r });

p.save();
