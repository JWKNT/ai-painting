// The stadium: two tiers of seats that go round the field, full of people, with a roof over
// the upper one, towers of lamps behind and the flags of the Expo along the edge of the roof.
// It is far off, so the people are small marks, and the air makes all of it paler and bluer.
// The sun is on the people at our left and at the far end. Those at our right have it behind
// them, and the roof puts the highest rows in shade.
'use strict';
const { studio, open, W, at, unit, stand, standAt, standSun, TIERS, ROOF, MASTS, BOWL, rimLine, HAZE, far, seeHeap, nA, nB, nC } = require('./scene');
const { mix, clamp, smooth, lerp } = studio;

const p = open('stadium');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.03, rag: 0.12, cap: 'round' };
// Is a place well inside the outline of the hill of flowers? (Nothing of the stadium shows there.)
const hidden = (x, y) => y < 800 && !!seeHeap(x, y) && !!seeHeap(x + (x < 800 ? -40 : 40), y) && !!seeHeap(x, y - 30);
const haze = (Z) => clamp((Z - 30) / 250, 0, 0.66);
const PHI = 1.5;                                                         // we see the stands from -PHI to PHI
const SHADE = '#56648e';                                                 // what the shade does to a color

// Pieces of a line that goes round the stands at one height: each piece is a stroke.
function ring(d, Y, width, colorAt, o = {}) {
  let phi = -PHI;
  while (phi < PHI) {
    const step = (o.piece || 110) / (unit(stand(phi, d, Y)[2]) * Math.hypot(BOWL.a * Math.cos(phi), BOWL.b * Math.sin(phi))) * r.range(0.7, 1.3);
    const a = phi, b = Math.min(PHI, phi + step), pts = [];
    for (let i = 0; i <= 6; i++) { const q = standAt(a + (b - a) * i / 6 * 1.08, d, Y); pts.push([q[0], q[1] + (o.wob ? r.range(-o.wob, o.wob) : 0)]); }
    const m = pts[3], Z = stand((a + b) / 2, d, Y)[2];
    if (m[0] > -80 && m[0] < W + 80 && !hidden(m[0], m[1])) {
      const w = typeof width === 'function' ? width(Z) : width;
      p.tryStroke({ ...line, ...(o.stroke || {}), color: colorAt((a + b) / 2, Z, m), width: w, points: pts });
    }
    phi = b;
  }
}

// ---- the seats and the people in them

// Under the people: the dark of each tier, in rows that go round the field.
for (const t of TIERS) {
  const rows = 22;
  for (let k = 0; k <= rows; k++) {
    const s = k / rows, d = lerp(t.d0, t.d1, s), Y = lerp(t.y0, t.y1, s);
    ring(d, Y, (Z) => clamp(unit(Z) * 1.9, 6, 16), (phi, Z) => {
      const sun = standSun(phi, d, Y), c = sun > 0 ? mix('#514b56', '#7a6c66', sun * 0.6 + nB(phi * 30, k * 3) * 0.3) : mix('#3b4566', '#52608a', nB(phi * 30, k * 3));
      return far(c, haze(Z));
    }, { piece: 120, wob: 1.5 });
  }
}
// The walk between the two tiers, and the wall at the back of the lower one: a dark line.
ring(14, 9.3, (Z) => clamp(unit(Z) * 1.6, 5, 12), (phi, Z) => far(standSun(phi, 14, 9.3) > 0 ? '#3c3a4c' : '#2e3656', haze(Z)), { piece: 150 });

// The people. Far off, one mark is two or three of them. Most are in black, for the funeral; some shirts and faces take the sun.
const DARK = ['#20222c', '#2a2934', '#34303c', '#262c40'], MID = ['#6c5f62', '#7e706a', '#565e78', '#8a7a70'], PALE = ['#f6ecd4', '#ecd6b8', '#fff8e4', '#e2c8a8'], BRIGHT = ['#a8423a', '#3c5c9c', '#d2b250', '#5c8a5c', '#c86c48'];
function person(phi, d, Y) {
  const P = stand(phi, d, Y), [x, y] = at(...P), Z = P[2];
  if (x < -20 || x > W + 20 || hidden(x, y)) return;
  const sun = standSun(phi, d, Y), q = r(), u = unit(Z);
  let c = q < 0.5 ? r.pick(DARK) : q < 0.7 ? r.pick(MID) : q < 0.94 ? r.pick(PALE) : r.pick(BRIGHT);
  if (sun > 0) c = mix(c, '#ffe9b8', 0.12 * sun + (q >= 0.7 && q < 0.94 ? 0.1 : 0)); else c = mix(mix(c, SHADE, 0.5), '#1c2440', 0.12);
  const h = Math.max(12.4, u * r.range(1.2, 1.7)), w = clamp(u * r.range(0.45, 0.62), 4, 7), lean = r.range(-0.22, 0.22) * h;
  p.tryStroke({ brush: w < 4.8 ? 'round' : 'bristle', mix: 0.04, dry: 0, rag: 0.1, cap: 'round', color: far(c, haze(Z) * (sun > 0 ? 1 : 1.15)), width: w, opacity: r.range(0.75, 1), points: [[x - lean / 2, y - h * 0.62], [x + lean / 2, y + h * 0.38]] });
}
for (const t of TIERS) {
  const n = t === TIERS[0] ? 3000 : 4200;
  const list = [];
  for (let k = 0; k < n; k++) {
    const phi = r.range(-PHI, PHI);
    if (r() > Math.hypot(BOWL.a * Math.cos(phi), BOWL.b * Math.sin(phi)) / BOWL.b) continue;            // even along the stands, not along the angle
    const s = r();
    list.push([phi, lerp(t.d0, t.d1, s), lerp(t.y0, t.y1, s)]);
  }
  list.sort((a, b) => b[1] - a[1]);                                                                     // the high rows first
  for (const q of list) person(...q);
}

// ---- the wall round the field

ring(0.25, 0.85, (Z) => clamp(unit(Z) * 1.75, 8, 22), (phi, Z) => far(standSun(phi, 0.25, 0.85) > 0 ? mix('#f2e8d2', '#fff6e2', r()) : mix('#9ea8c8', '#b0b8d2', r()), haze(Z) * 0.8), { piece: 170, stroke: { rag: 0.04 } });
// its top edge, and the dark where it meets the field
ring(0.25, 1.75, 4.6, (phi, Z) => far(standSun(phi, 0.25, 1.7) > 0 ? '#fffaf0' : '#c4cce0', haze(Z) * 0.7), { piece: 90, stroke: { brush: 'round', opacity: 0.7 } });
ring(-0.2, 0.05, 5, (phi, Z) => far(standSun(phi, 0, 0) > 0 ? '#9c927e' : '#5c6688', haze(Z) * 0.7), { piece: 110, stroke: { brush: 'round', opacity: 0.55 } });

// ---- the roof

// Its under side, which we see from below: pale where the light of the field comes up to it.
{
  const lanes = 9;
  for (let k = 0; k <= lanes; k++) {
    const s = k / lanes, d = lerp(ROOF.d1, ROOF.d0, s), Y = lerp(ROOF.y1, ROOF.y0, s);
    ring(d, Y, (Z) => clamp(unit(Z) * 3.3, 6, 30), (phi, Z) => {
      const sun = standSun(phi, 12, 9);
      return far(mix(mix('#6c7898', '#a4b0ca', s), sun > 0 ? '#c8c0b4' : '#8c98bc', 0.4 + 0.2 * nA(phi * 9, s * 4)), haze(Z));
    }, { piece: 160 });
  }
  // the beams under it
  for (let phi = -PHI; phi < PHI; phi += 0.052) {
    const a = standAt(phi, ROOF.d1, ROOF.y1), b = standAt(phi, ROOF.d0 + 0.8, ROOF.y0 - 0.2), Z = stand(phi, 20, 26)[2];
    if (hidden(a[0], a[1]) || a[0] < -40 || a[0] > W + 40) continue;
    p.tryStroke({ brush: 'round', color: far('#56628a', haze(Z)), width: clamp(unit(Z) * 0.5, 4, 6), opacity: 0.45, points: [a, b] });
  }
  // its front edge: a line of light
  ring(ROOF.d0, ROOF.y0 - 0.5, (Z) => clamp(unit(Z) * 1.2, 5, 13), (phi, Z) => far(standSun(phi, 12, 9) > 0 ? mix('#fff6e0', '#f0e4cc', r()) : mix('#dfe6f2', '#c8d2e6', r()), haze(Z) * 0.7), { piece: 150, stroke: { rag: 0.03 } });
  ring(ROOF.d0 + 0.6, ROOF.y0 - 1.2, 4.4, (phi, Z) => far('#4a5680', haze(Z)), { piece: 120, stroke: { brush: 'round', opacity: 0.5 } });
}

// ---- the towers of lamps, behind the roof

for (const m of MASTS) {
  const foot = standAt(m.phi, m.d, 27), top = standAt(m.phi, m.d, m.top), Z = stand(m.phi, m.d, 30)[2], u = unit(Z), tone = (c) => far(c, haze(Z) + 0.12);
  const side = m.phi < 0 ? 1 : -1;                                       // the side of it that the sun is on... the sun is at the right for both
  // its two legs come together toward the top, with bars between them
  for (const s of [-1, 1]) p.stroke({ ...line, color: tone(s > 0 ? '#aab2c6' : '#6c7898'), width: Math.max(4.8, u * 0.75), points: [[foot[0] + s * u * 3.2, foot[1]], [top[0] + s * u * 1.3, top[1] + u * 4]] });
  for (let k = 0; k < 7; k++) { const t0 = k / 7, t1 = (k + 1) / 7, ya = lerp(foot[1], top[1] + u * 4, t0), yb = lerp(foot[1], top[1] + u * 4, t1), ha = lerp(3.2, 1.3, t0) * u, hb = lerp(3.2, 1.3, t1) * u, s = k % 2 ? 1 : -1; p.tryStroke({ brush: 'round', color: tone('#7c88a8'), width: 4, opacity: 0.6, points: [[foot[0] + s * ha, ya], [foot[0] - s * hb, yb]] }); }
  // the bank of lamps: rows of pale glass in a dark frame
  const bw = u * 13, bh = u * 8, bx = top[0], by = top[1] + bh / 2, rows = 4;
  for (let k = 0; k < 5; k++) p.stroke({ ...line, rag: 0.02, color: tone('#3e4868'), width: bh / 4.2, points: [[bx - bw / 2, by - bh / 2 + (k + 0.5) * bh / 5], [bx + bw / 2, by - bh / 2 + (k + 0.5) * bh / 5]] });
  for (let k = 0; k < rows; k++) {
    const y = by - bh / 2 + (k + 0.5) * bh / rows, lw = clamp(bh / rows * 0.5, 4.4, 6.2), ll = Math.max(12.6, lw * 2.1);
    for (let x = bx - bw / 2 + lw; x < bx + bw / 2 - ll - lw * 0.5; x += ll + lw + r.range(1.5, 4)) p.stroke({ brush: 'round', color: tone(mix('#c0d0ea', '#f6f2e6', r() * (x > bx ? 1 : 0.45))), width: lw, opacity: 0.92, points: [[x, y], [x + ll, y]] });
  }
  p.tryStroke({ brush: 'round', color: tone('#fffaf0'), width: 4.2, opacity: 0.7, points: [[bx + bw / 2 - 1, by - bh / 2 + 3], [bx + bw / 2 - 1, by + bh / 2 - 3]] });   // the sun on its right edge
}

// ---- the flags of the Expo, on staffs along the edge of the roof. The wind is from our right.

{
  const colors = ['#c8303a', '#f4f0e8', '#2c5cb0', '#e8c43c', '#2c8c54', '#e87830', '#f4f0e8', '#c8303a', '#1c2c6c'];
  for (let phi = -PHI; phi < PHI; phi += r.range(0.05, 0.085)) {
    const P = stand(phi, ROOF.d0 + 0.5, ROOF.y0), Z = P[2], u = unit(Z), [x, y] = at(...P);
    if (x < -30 || x > W + 30 || hidden(x, y - u * 6)) continue;
    const tall = u * r.range(6.5, 9), len = Math.max(13, u * r.range(3.4, 4.6)), w = clamp(u * 2.1, 4.8, 13), hz = haze(Z) + 0.1;
    p.tryStroke({ brush: 'round', color: far('#8a94b0', hz), width: 4, opacity: 0.6, points: [[x, y - 2], [x, y - tall]] });
    const droop = r.range(0.06, 0.3), c1 = r.pick(colors), yf = y - tall + w * 0.5 + 1;
    p.tryStroke({ ...line, rag: 0.15, color: far(mix(c1, '#ffe9b8', 0.1), hz), width: w, opacity: 0.95, points: [[x - 1, yf], [x - len * 0.55, yf + len * droop * 0.3], [x - len, yf + len * droop]] });
    if (len > 26 && r() < 0.7) p.tryStroke({ ...line, rag: 0.1, color: far(r.pick(colors), hz), width: Math.max(4.8, w * 0.45), opacity: 0.9, points: [[x - 2, yf + w * 0.2], [x - len * 0.5, yf + w * 0.2 + len * droop * 0.3], [x - len * 0.92, yf + w * 0.2 + len * droop]] });
  }
}

// ---- the air of the place: a pale veil over the far end, low down

for (let k = 0; k < 10; k++) {
  const x0 = r.range(-100, W - 400), len = r.range(400, 800), y = r.range(560, 624);
  p.stroke({ brush: 'soft', color: mix(HAZE, '#f0e6d2', r() * 0.5), width: r.range(26, 52), opacity: r.range(0.05, 0.1), points: [[x0, y], [x0 + len / 2, y + r.range(-4, 4)], [x0 + len, y]] });
}

p.save();
