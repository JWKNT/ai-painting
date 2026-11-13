// The houses of the street, in two rows that run away to its end: plastered walls, dark
// timber in the upper floor, steep roofs, shuttered windows. A few windows have a lamp
// behind them. The near houses are dark with wet and go up out of the picture; the far ones
// are pale with rain.
'use strict';
const { studio, open, LEFT, RIGHT, at, veil, nA } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('houses');
const r = p.rng;
const stroke = { brush: 'bristle', mix: 0.1, dry: 0.04, rag: 0.15, cap: 'flat', streak: 0.3, jitter: 0.5 };

// One house: a length of the row, from t0 (its nearer end) to t1.
//   tall   how high its wall stands against the row's own height
//   wall, roof, wood, shutter: its colors;  timber: whether its upper floor is framed
//   cols   windows in each floor;  lamps: which are lit, as "floor:col";  door: where along it
function house(S, t0, t1, o) {
  const tall = o.tall || 1, P = (t, v) => at(S, t, v, tall), far = (t0 + t1) / 2, tone = (c) => veil(c, far * 0.95);
  const height = (t) => P(t, 0)[1] - P(t, 1)[1], span = Math.abs(S.x(t1) - S.x(t0)), T = (u) => t0 + (t1 - t0) * u;
  // a stroke that runs with the street at one height up the wall; w is its width as a part of the wall's height
  const along = (v, w, color, u0 = 0, u1 = 1, extra = {}) => {
    const px = Math.abs(S.x(T(u1)) - S.x(T(u0))), n = Math.max(1, Math.floor(px / Math.max(90, w * height(T(u0)) * 2.4)));
    for (let q = 0; q < n; q++) {
      const ta = T(u0 + (u1 - u0) * q / n), tb = T(u0 + (u1 - u0) * (q + 1) / n), a = P(ta, v), b = P(tb, v);
      p.tryStroke({ ...stroke, ...extra, color: typeof color === 'function' ? color(a[0], a[1]) : color, width: Math.max(4.6, w * height(ta)), points: [[a[0], a[1], 1], [b[0], b[1], clamp(height(tb) / height(ta), 0.2, 1)]] });
    }
  };
  // a patch of the wall between two places along it and two heights, in upright strokes
  const patch = (ua, ub, v0, v1, color, extra = {}) => {
    const xa = S.x(T(ua)), xb = S.x(T(ub)), wpx = Math.abs(xb - xa), hpx = (v1 - v0) * height(T((ua + ub) / 2)), n = Math.max(1, Math.ceil(wpx / Math.max(1, hpx / 2.4)));
    for (let q = 0; q < n; q++) {
      const t = T(ua + (ub - ua) * (q + 0.5) / n);
      p.tryStroke({ ...stroke, rag: 0.08, ...extra, color: typeof color === 'function' ? color() : color, width: Math.max(4.6, wpx / n + 1), points: [P(t, v1), P(t, v0)] });
    }
    return wpx;
  };

  // the wall: lanes of plaster, dark with wet toward the road and under the eaves
  const lanes = clamp(Math.round(height(t0) / 28), 8, 30);
  for (let i = 0; i < lanes; i++) {
    const v = (i + 0.5) / lanes;
    along(v, 1 / lanes + 2.5 / height(t0), (x, y) => tone(mix(mix(mix(o.wall, '#ffffff', (nA(x / 40, y / 30) - 0.5) * 0.2), '#3b3d38', smooth(0.42, 0.78, nA(x / 230 + 7, y / 170)) * 0.36), '#2a2e2c', smooth(0.44, 0, v) * 0.62 + smooth(0.8, 1, v) * 0.42)));
  }
  // the wet on it: dark runs down the plaster from under the eaves
  for (let k = 0; k < Math.ceil(span / 34); k++) {
    const t = T(r()), v0 = r.range(0.84, 0.97), len = r.range(0.12, 0.5), w = Math.max(4.8, height(t) * r.range(0.012, 0.03));
    p.tryStroke({ ...stroke, rag: 0.3, color: tone('#30322d'), width: w, opacity: r.range(0.2, 0.4), taper: [0, 0.7], points: [P(t, v0), P(t, v0 - len / 2), P(t, v0 - len)] });
  }
  // the roof: steep and dark; where it turns up to the sky it shines a little
  for (let i = 0; i < 5; i++) along(1 + (i + 0.5) / 5, 0.07 + 1.5 / height(t0), () => tone(mix(mix(o.roof, '#1c2022', r() * 0.3), '#7c888a', smooth(0.3, 1, i / 4) * 0.4)));
  along(1.97, 0.014 + 1 / height(t0), tone('#a4aeae'), 0, 1, { opacity: 0.5 });   // the wet along its ridge
  along(0.955, 0.06, tone('#1d1f1f'), 0, 1, { opacity: 0.34 });        // the shade of the eaves on the top of the wall
  along(1, 0.016 + 1 / height(t0), tone('#17191a'));                    // the shadow under the eaves
  along(0.03, 0.05, tone(mix(o.wall, '#30322e', 0.6)));                 // the stone foot of the wall
  // the timber of the upper floor: a beam, the wall plate, posts, and braces
  const wood = tone(o.wood || '#2a2420');
  if (o.timber) {
    along(0.5, 0.02 + 1 / height(t0), wood);
    along(0.975, 0.016 + 1 / height(t0), wood);
    const bays = o.cols * 2;
    for (let k = 0; k <= bays; k++) {
      const t = T(k / bays), w = Math.max(4.6, height(t) * 0.016);
      p.tryStroke({ ...stroke, color: wood, width: w, points: [P(t, 0.5), P(t, 0.97)] });
      if (k < bays && k % 4 === 0) p.tryStroke({ ...stroke, color: wood, width: w, opacity: 0.9, points: [P(t, 0.52), P(T((k + 1) / bays), 0.95)] });
    }
  }
  // the windows: a pale frame, dark glass or a lamp behind it, shutters folded back
  for (const [floor, v0, v1] of [[0, 0.17, 0.37], [1, 0.64, 0.86]]) {
    for (let col = 0; col < o.cols; col++) {
      if (floor === 0 && o.door === col) continue;
      const uc = (col + 0.5) / o.cols, du = 0.13 / o.cols, lit = (o.lamps || []).includes(`${floor}:${col}`);
      const wpx = patch(uc - du * 1.16, uc + du * 1.16, v0 - 0.008, v1 + 0.008, tone(mix('#9a9e94', o.wall, 0.35)));
      patch(uc - du, uc + du, v0, v1, lit ? () => tone(mix('#f0aa54', '#ffd88c', r())) : () => tone(mix('#1b2125', '#333d41', r())));
      if (!lit && wpx > 10) p.tryStroke({ color: tone('#748082'), width: 4, opacity: 0.6, points: [P(T(uc - du * 0.45), v1 - (v1 - v0) * 0.1), P(T(uc - du * 0.45), v1 - (v1 - v0) * 0.6)] });   // the sky in the glass
      along(v1 - 0.014, 0.014 + 1 / height(t0), tone('#0d1113'), uc - du, uc + du, { opacity: 0.8 });                      // the glass is set back: shade along its top
      along(v0 - 0.016, 0.012 + 1 / height(t0), tone('#c6cac2'), uc - du * 1.4, uc + du * 1.4, { opacity: 0.75 });      // the wet sill
      if (wpx > 12) for (const sgn of [-1, 1]) patch(uc + sgn * du * 2.1 - du * 0.75, uc + sgn * du * 2.1 + du * 0.75, v0, v1, tone(o.shutter || '#3c4a44'));
      if (wpx > 12) for (const sgn of [-1, 1]) { const t = T(uc + sgn * du * 1.1), lenv = r.range(0.05, 0.13); p.tryStroke({ ...stroke, rag: 0.3, color: tone('#2c2e2a'), width: Math.max(4.8, height(t) * 0.014), opacity: 0.32, taper: [0, 0.7], points: [P(t, v0 - 0.02), P(t, v0 - 0.02 - lenv)] }); }   // and the stain that runs down from each end of it
      if (floor === 1 && o.flowers && wpx > 12) along(v0 - 0.035, 0.03, () => tone(mix('#8c2c34', '#c84c50', r())), uc - du * 1.3, uc + du * 1.3, { rag: 0.5 });   // geraniums in a box under it
    }
  }
  // the door
  if (o.door != null) {
    const uc = (o.door + 0.5) / o.cols, du = 0.12 / o.cols;
    patch(uc - du * 1.25, uc + du * 1.25, 0, 0.39, tone('#b8bcb2'));
    patch(uc - du, uc + du, 0, 0.37, tone(o.doorColor || '#241c18'));
  }
  // a chimney
  if (o.chimney != null) {
    const [cx, cy] = P(T(o.chimney), 1.85), ch = height(T(o.chimney)) * 0.1, w = Math.max(6, height(T(o.chimney)) * 0.035);
    if (ch >= w * 2) p.tryStroke({ ...stroke, color: tone('#3a302c'), width: w, points: [[cx, cy + ch * 0.4], [cx, cy - ch]] });
  }
}

// From the far end of the street toward us, so that each house stands in front of the one behind it.
const rows = [
  [LEFT, [[1.0, 0.7, { tall: 0.9, wall: '#a9aea6', roof: '#463a38', cols: 4, timber: true, lamps: ['1:2'], chimney: 0.4 }],
          [0.7, 0.5, { tall: 1.04, wall: '#b3966a', roof: '#3c3232', cols: 3, door: 1, shutter: '#3a4c44', chimney: 0.6 }],
          [0.5, 0.36, { tall: 0.94, wall: '#b8bbb2', roof: '#463c3a', cols: 3, timber: true, lamps: ['1:1'], door: 0, shutter: '#5a3a34', flowers: true }],
          [0.36, 0.22, { tall: 1.06, wall: '#a8927e', roof: '#3a3030', cols: 3, door: 2, shutter: '#34443e', chimney: 0.5 }],
          [0.22, 0.11, { tall: 0.96, wall: '#bab39f', roof: '#3e3434', cols: 2, timber: true, door: 0, shutter: '#3e4a52', flowers: true }],
          [0.11, 0, { tall: 1.0, wall: '#a39a8c', roof: '#3a3030', cols: 2, shutter: '#40403a' }]]],
  [RIGHT, [[1.0, 0.72, { tall: 0.92, wall: '#b09a72', roof: '#40383a', cols: 4, lamps: ['0:1'], chimney: 0.5 }],
           [0.72, 0.5, { tall: 1.02, wall: '#b6b9b0', roof: '#463c3a', cols: 3, timber: true, door: 1, shutter: '#5a3a34', flowers: true }],
           [0.5, 0.34, { tall: 0.95, wall: '#ac968c', roof: '#3e3434', cols: 3, door: 2, lamps: ['1:0'], shutter: '#40403a', chimney: 0.3 }],
           [0.34, 0.2, { tall: 1.05, wall: '#b4b0a0', roof: '#3a3030', cols: 3, timber: true, door: 0, shutter: '#34443e' }],
           [0.2, 0, { tall: 0.98, wall: '#a99484', roof: '#3c3232', cols: 3, door: 1, shutter: '#3e4a52', flowers: true }]]],
];
for (let i = 0; i < 6; i++) for (const [S, list] of rows) if (list[i]) house(S, list[i][0], list[i][1], list[i][2]);

// A rain pipe down the wall wherever one house ends and the next begins.
for (const [S, list] of rows) {
  for (const [t0] of list.slice(0, -1)) {
    const t = list[list.indexOf(list.find((h) => h[0] === t0))][1], a = at(S, t, 0.98), b = at(S, t, 0.02), w = Math.max(4.6, (b[1] - a[1]) * 0.012);
    p.tryStroke({ ...stroke, color: veil('#1c2022', t * 0.9), width: w, points: [a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], b] });
  }
}

// A sign on its iron arm, on one of the houses on the left.
{
  const [x, y] = at(LEFT, 0.44, 0.58, 0.94);
  p.stroke({ ...stroke, color: veil('#1a1c1c', 0.4), width: 4.6, points: [[x, y], [x + 26, y - 2], [x + 52, y]] });
  p.stroke({ ...stroke, cap: 'round', color: veil('#2a2c2a', 0.4), width: 15, points: [[x + 40, y + 12], [x + 40, y + 44]] });
  p.tryStroke({ color: veil('#a09a80', 0.3), width: 4, opacity: 0.6, points: [[x + 40, y + 20], [x + 40, y + 36]] });
}

p.save();
