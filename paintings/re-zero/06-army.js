// The army. Some hundreds of riders wait on the plain under the tree, on ground dragons, in
// ranks, with their lamps lit: they came here to kill the whale. We stand behind them, a
// little above the grass, so each of them is a dark back with the moon on one shoulder.
// Far off they are only upright marks with small warm lights among them. More of them come
// up the road at the right. One rider near us has no armour and no lance: a boy in a track
// suit, on a black dragon. All of them look up.
'use strict';
const { studio, open, HORIZON, MOONWARD, far } = require('./scene');
const { mix, clamp, solid, shape, wave, disc, arc, noise2 } = studio;
const lit = noise2(1361);

const p = open('army');
const r = p.rng;
const EYE = 3.2;                                   // how high we stand over the plain, in metres
const S = (y) => (y - HORIZON) / EYE;              // so a thing that stands on the ground at y is this many units of the picture to the metre
const line = { brush: 'bristle', mix: 0, dry: 0.02, rag: 0.12, cap: 'round' };
const thin = (w) => (w < 4.8 ? { brush: 'round' } : {});
const mist = (y) => clamp(1 - (y - HORIZON) / 150, 0, 1) * 0.5;
const coats = ['#0c1220', '#161a28', '#1c1c26', '#101c24', '#1a1620'];
const cloaks = ['#141c3c', '#1c1834', '#0e1a30', '#261a2c', '#1a2638', '#102028'];

// A lamp. Far off it is only a soft round light with a bright middle; near us there is a short touch of flame in it.
function lamp(x, y, s, k = 1) {
  const R = Math.max(9, 0.9 * s) * k, w = Math.max(8.4, R * 0.8), l = Math.max(R * 1.3, w * 1.05), turn = r() * 3;
  for (let i = 0; i < 8; i++) { const a = turn + i * Math.PI / 8 + r.range(-0.15, 0.15); p.stroke({ brush: 'soft', color: mix('#ff8c2c', '#ffbc5c', r()), width: w, opacity: 0.12, points: [[x - Math.cos(a) * l, y - Math.sin(a) * l], [x + Math.cos(a) * l, y + Math.sin(a) * l]] }); }
  const cw = clamp(0.3 * s, 8.4, 14), cl = cw * 1.06;
  for (let i = 0; i < 8; i++) { const a = turn + 0.2 + i * Math.PI / 8 + r.range(-0.15, 0.15); p.stroke({ brush: 'soft', color: mix('#ffd884', '#fff0c0', r()), width: cw, opacity: 0.2, points: [[x - Math.cos(a) * cl, y - Math.sin(a) * cl], [x + Math.cos(a) * cl, y + Math.sin(a) * cl]] }); }
  if (s > 30) { const fw = clamp(0.1 * s, 4.2, 7); p.stroke({ brush: 'round', color: '#fff6d4', width: fw, points: [[x, y + 7], [x + r.range(-1, 1), y - 7]] }); }
}
// The light of a lamp on the grass under it.
const pool = (x, y, s, k = 1) => { const w = Math.max(8.4, 0.9 * s * k); p.stroke({ brush: 'soft', color: '#b06c2c', width: w, opacity: 0.16, points: [[x - w * 1.6, y], [x, y + 1], [x + w * 1.6, y]] }); };
// A lance: a thin pale line that stands up from the hand of a rider. Some have a small flag under the point.
function lance(x, y, s, tilt, flag) {
  const d = mist(y), x0 = x + 0.34 * s, y0 = y - 2.0 * s, x1 = x0 + tilt * s, y1 = y - 4.4 * s;
  p.tryStroke({ brush: 'round', color: far('#6c7cac', x, y, d), width: clamp(0.07 * s, 4, 5), opacity: clamp(0.14 + s / 60, 0.3, 0.95), points: [[x0, y0], [x1, y1]] });
  if (flag && s > 13) { const fl = Math.max(13, 0.9 * s); p.tryStroke({ ...line, ...thin(Math.max(4.4, 0.3 * s)), color: far(flag, x, y, d), width: Math.max(4.4, 0.3 * s), opacity: 0.9, taper: [0, 0.8], points: [[x1 + 1, y1 + 0.5 * s], [x1 - fl * 0.5, y1 + 0.5 * s + r.range(-2, 2)], [x1 - fl, y1 + 0.56 * s + r.range(-3, 3)]] }); }
}

// A rider far off, from behind: the head is the top of a short upright stroke, the cloak covers the rest of that stroke, and
// the dragon is a wider upright mark under it. Nearer, we see more of it: its hips and its two legs, its tail that hangs to
// one side, and its neck and head past the shoulder of the rider.
function rider(x, y, o = {}) {
  const s = S(y), d = mist(y), side = o.side || (r() < 0.5 ? -1 : 1), big = s > 17;
  const coat = far(o.coat || r.pick(coats), x, y, d), cloak = far(o.cloak || r.pick(cloaks), x, y, d), moon = far('#9cb4e8', x, y, d * 0.7), dark = mix(coat, '#02040a', 0.4);
  const lean = r.range(-0.06, 0.06) * s, tall = r.range(0.95, 1.06);
  const wH = clamp(0.25 * s, 4.8, 9), top = y - 2.78 * s * tall;
  p.stroke({ ...line, color: far(o.hair || r.pick(['#0a0e1c', '#141826', '#1c2030']), x, y, d), width: wH, points: [[x + lean, top], [x + lean, top + Math.max(12.5, 2 * wH + 1)]] });                              // the head, or the helmet on it
  if (r() < 0.5) {                                                                                                                                                                                        // the neck and head of the dragon, past the rider
    p.tryStroke({ ...line, color: dark, width: Math.max(4.8, 0.24 * s), taper: [0, 0.3], points: [[x - side * 0.3 * s, y - 1.35 * s], [x - side * 0.58 * s, y - 1.95 * s], [x - side * 0.74 * s, y - 2.45 * s]] });
    p.tryStroke({ ...line, color: dark, width: Math.max(4.8, 0.2 * s), taper: [0, 0.5], points: [[x - side * 0.66 * s, y - 2.5 * s], [x - side * 1.14 * s, y - 2.4 * s]] });
  }
  if (big) {
    for (const k of [-1, 1]) p.tryStroke({ ...line, color: dark, width: Math.max(4.8, 0.2 * s), points: [[x + k * 0.26 * s, y - 1.0 * s], [x + k * 0.34 * s, y - 0.5 * s], [x + k * 0.27 * s, y]] });                 // the legs of the dragon
    p.tryStroke({ ...line, color: mix(coat, '#02040a', 0.25), width: Math.max(4.8, 0.46 * s), taper: [0, 0.9], points: [[x, y - 1.2 * s], [x + side * 0.06 * s, y - 0.6 * s], [x + side * 0.3 * s, y - 0.12 * s], [x + side * 0.72 * s, y - 0.02 * s]] });   // its tail: thick, toward us, down to the grass between its legs
    p.tryStroke({ ...line, color: coat, width: 0.34 * s, points: [[x - 0.35 * s, y - 1.02 * s], [x + 0.35 * s, y - 1.02 * s]] });                                                                                // its hips
  }
  const wM = Math.max(5, (big ? 0.6 : 0.84) * s * r.range(0.9, 1.04)), foot = big ? 0.5 * s : 0.08 * s, hM = Math.max(1.78 * s, 2 * wM + 1 + foot);
  p.stroke({ ...line, color: coat, width: wM, points: [[x + lean * 0.4, y - hM], [x, y - foot]] });                                                                                                           // its back, from behind
  const wC = Math.max(4.8, 0.5 * s), hC = Math.max(1.02 * s, 2 * wC + 1, 12.5), cy = y - 2.5 * s * tall;
  p.stroke({ ...line, color: cloak, width: wC, points: [[x + lean, cy], [x + lean * 0.6, cy + hC]] });                                                                                                      // the cloak
  if (big) {
    p.tryStroke({ ...line, color: cloak, width: 0.3 * s, points: [[x + lean - 0.31 * s, cy + 0.16 * s], [x + lean + 0.31 * s, cy + 0.16 * s]] });                                                           // the shoulders
    p.tryStroke({ ...line, color: mix(cloak, '#02040a', 0.5), width: 4.8, opacity: 0.8, points: [[x + lean - 0.06 * s, cy + 0.3 * s], [x + lean * 0.6 - 0.1 * s, cy + hC]] });                            // a fold in the cloak
    p.tryStroke({ brush: 'round', color: moon, width: 4, opacity: 0.55, points: [[x + lean + wC * 0.5, cy + 0.12 * s], [x + lean * 0.6 + wC * 0.46, cy + hC * 0.8]] });                                 // the moon on the right side of the cloak
    p.tryStroke({ brush: 'round', color: moon, width: 4, opacity: 0.4, points: [[x + 0.42 * s, y - 1.3 * s], [x + 0.46 * s, y - 0.7 * s]] });                                                           // and of the dragon
    p.tryStroke({ brush: 'round', color: moon, width: 4, opacity: 0.65, points: arc(x + lean, top + wH * 0.5, wH * 0.5 + 0.5, -1.5, 0.4, 5) });                                                         // and on the helmet
  } else if (r() < 0.6) p.tryStroke({ brush: 'round', color: moon, width: 4, opacity: 0.35, points: [[x + lean + wC * 0.5, cy + 2], [x + wM * 0.45, cy + 2 + Math.max(12.5, hC)]] });
  if (o.lance !== false && r() < (o.lance || 0.3)) lance(x, y, s, r.range(-0.2, 0.3), r() < 0.35 ? r.pick(['#1c4c4c', '#24406c', '#6c2434']) : null);
  if (o.lamp) { pool(x - side * 0.7 * s, y - 0.1 * s, s); lamp(x - side * 0.62 * s, y - r.range(1.7, 2.5) * s, s); }
}

// A standard of the army: a tall pole, and a long flag that the wind from the whale carries to the left.
function standard(x, y, color) {
  const s = S(y), d = mist(y), top = y - 6.2 * s, len = 2.6 * s, wd = Math.max(4.8, 0.42 * s);
  p.tryStroke({ brush: 'round', color: far('#6c7ca8', x, y, d), width: clamp(0.09 * s, 4, 6), opacity: 0.85, points: [[x, y - 1.8 * s], [x + 0.1 * s, top]] });
  for (let k = 0; k < 3; k++) { const yy = top + (0.2 + k * 0.4) * s; p.tryStroke({ ...line, color: far(mix(color, k === 0 ? '#a8c0f0' : '#04060c', k === 0 ? 0.4 : k * 0.18), x, y, d), width: wd, taper: [0, 0.5 + k * 0.15], points: [[x + 0.1 * s, yy], [x - len * 0.45, yy + r.range(0.05, 0.2) * s], [x - len * (1 - k * 0.14), yy + r.range(0.1, 0.5) * s]] }); }
}

// A rider near us, seen from behind and a little from the side, on a ground dragon: a long beast that stands on two legs,
// with its tail toward us, its neck up and its head turned to the whale. Each part is a rounded form with the moon on its
// upper edge. Places on it are in metres from the ground under its hips; `dir` is 1 if it looks to the right.
function mounted(x, y, o = {}) {
  const s = S(y), dir = o.dir || 1, F = (mx, my) => [x + mx * s * dir, y - my * s], C = (mx, my, rad) => [...F(mx, my), rad * s];
  const coat = o.coat || '#0c1220', L = dir > 0 ? MOONWARD : MOONWARD;
  const tone = (c, lit = 0.32, rim = '#c4d4fc') => { const t = { shadow: mix(c, '#010308', 0.55), half: c, lit: mix(c, '#7c94d0', lit), bounce: mix(c, o.lamp ? '#70401c' : '#141c34', 0.5) }; if (rim) t.rim = rim; return t; };
  const opt = (extra = {}) => ({ light: L, turn: 0.3, width: 5.5, length: clamp(0.3 * s, 14, 26), mix: 0.05, ...extra });
  const M = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: pts.map(([a, b]) => F(a, b)) });
  p.tryStroke({ brush: 'soft', color: '#010306', width: Math.max(8.4, 0.5 * s), opacity: 0.55, points: [F(-1.3, 0.0), F(0.1, -0.05), F(1.2, 0.05)] });           // its shade on the grass
  solid(p, [C(0.42, 1.2, 0.25), C(0.6, 0.8, 0.15), C(0.46, 0.45, 0.09), C(0.58, 0.12, 0.085), C(0.8, 0.06, 0.05)], tone(mix(coat, '#010308', 0.3), 0.12, null), opt());   // its far leg
  solid(p, [C(-0.15, 1.32, 0.34), C(-0.56, 1.04, 0.26), C(-0.9, 0.68, 0.17), C(-1.06, 0.38, 0.1), C(-1.0, 0.13, 0.055)], tone(coat), opt());                       // its tail: toward us, and down to the grass
  solid(p, [C(0, 1.4, 0.46), C(0.3, 1.55, 0.44), C(0.56, 1.66, 0.36)], tone(coat), opt());                                                                         // its body
  solid(p, [C(0.6, 1.72, 0.3), C(0.74, 2.04, 0.2), C(0.86, 2.38, 0.155)], tone(coat), opt());                                                                      // its neck
  solid(p, [C(0.9, 2.52, 0.15), C(1.16, 2.45, 0.085)], tone(coat), opt({ length: 14 }));                                                                           // its head: long, with a crest that lies back
  M([[0.9, 2.62], [0.74, 2.8], [0.64, 2.84]], mix(coat, '#7c94d0', 0.25), Math.max(4.8, 0.09 * s), { taper: [0, 0.7] });
  solid(p, [C(-0.12, 1.18, 0.3), C(0.08, 0.74, 0.17), C(-0.1, 0.4, 0.1), C(0.03, 0.1, 0.095), C(0.26, 0.05, 0.055)], tone(coat), opt());                           // its near leg
  for (const u of [-0.5, -0.74, -0.92]) M([[u + 0.1, 1.22 + (u + 0.15) * 0.7], [u - 0.02, 0.96 + (u + 0.15) * 0.85]], mix(coat, '#010308', 0.6), 4.6, { opacity: 0.6 });   // rings of scale round its tail
  M([[0.84, 2.3], [0.6, 2.14], [0.36, 2.04]], '#2c2a30', 4, { opacity: 0.8 });                                                                                     // the reins
  // the saddle and the cloth under it
  shape(p, [F(-0.08, 1.9), F(0.5, 2.0), F(0.58, 1.7), F(0.36, 1.46), F(-0.04, 1.5)], o.cloth || { shadow: '#10081c', half: '#2c1838', lit: '#5c3c6c', rim: '#b4a8dc' }, { light: L, turn: 0.2, width: 5.5, length: 16, round: 0.2 * s, flow: () => 1.3 * dir, dash: 18, gap: 6, edgeOpacity: 0.6 });
  M([[-0.08, 1.5], [0.14, 1.46], [0.36, 1.44]], '#8c98c8', 4, { opacity: 0.5 });                                                                                   // the border of the cloth
  solid(p, [C(-0.22, 1.86, 0.13), C(-0.02, 1.9, 0.13)], tone('#241c20', 0.25), opt({ length: 14 }));                                                               // the roll of a blanket behind the saddle
  return { F, C, M, tone, opt, s, dir, L };
}
// One of the riders of the army on it: a cloak, a helmet, a lance with a flag.
function soldier(x, y, o = {}) {
  const { F, C, M, tone, opt, s, L } = mounted(x, y, o), cloak = o.cloak || '#141c3c';
  solid(p, [C(0.14, 1.9, 0.12), C(0.0, 1.55, 0.1), C(0.06, 1.2, 0.08)], tone('#141620', 0.25), opt({ length: 14 }));                                               // the leg, and the boot in its stirrup
  M([[0.27, 2.66], [0.27, 2.66 - Math.max(0.2, 13 / s)]], '#2c2428', Math.max(4.8, 0.14 * s));                                                                     // the neck
  shape(p, [F(0.04, 2.5), F(0.26, 2.58), F(0.5, 2.5), F(0.6, 2.1), F(0.62, 1.8), F(0.3, 1.7), F(-0.1, 1.78), F(-0.04, 2.14)], { shadow: mix(cloak, '#010308', 0.55), half: cloak, lit: mix(cloak, '#7c94d0', 0.34), rim: '#c4d4fc', bounce: mix(cloak, o.lamp ? '#70401c' : '#141c34', 0.5) },
    { light: L, turn: 0.25, width: 5.5, length: 20, round: 0.2 * s, flow: (px, py) => Math.atan2(py - F(0.27, 3.2)[1], px - F(0.27, 3.2)[0]), dash: 20, gap: 7 });   // the cloak: it hangs from the shoulders to the saddle
  for (const u of [-0.02, 0.2, 0.42]) M([[0.12 + u * 0.5, 2.4], [u + 0.04, 1.84]], mix(cloak, '#010308', 0.6), 4.8, { opacity: 0.7, taper: [0.5, 0] });            // its folds
  const [hx, hy] = F(0.28, 2.72), R = Math.max(7, 0.13 * s);
  disc(p, hx, hy, R, '#1c2234', 6.2, { ...line });                                                                                                                 // the helmet
  p.tryStroke({ brush: 'round', color: '#c4d4fc', width: 4, opacity: 0.85, points: arc(hx, hy, R - 1, -1.9, 0.3, 7) });                                            // the moon on it
  M([[0.5, 1.96], [0.66, 4.5]], '#7c8cb8', clamp(0.06 * s, 4, 5.5));                                                                                               // the lance
  M([[0.655, 4.36], [0.675, 4.36 + Math.max(0.3, 13 / s)]], '#dce8ff', Math.max(4.8, 0.1 * s), { taper: [0.6, 0.9] });                                             // its point
  if (o.flag) shape(p, [F(0.65, 4.22), F(0.1, 4.18), F(-0.5, 4.0), F(-0.1, 3.94), F(0.2, 3.86), F(0.64, 3.84)], { shadow: mix(o.flag, '#010308', 0.5), half: o.flag, lit: mix(o.flag, '#a8c0f0', 0.4), rim: '#c4d4fc' }, { light: L, turn: 0.1, width: 5.5, length: 20, flow: () => 0.08, dash: 20, gap: 7, edgeOpacity: 0.6 });
  if (o.lamp) { const [lx, ly] = F(-0.5, 2.5); M([[-0.1, 1.84], [-0.5, 2.62]], '#3c3430', 4.4); pool(F(-0.9, 0)[0], y, s, 1.3); lamp(lx, ly, s, 0.8); M([[0.02, 2.44], [-0.06, 2.1], [-0.08, 1.82]], '#c8843c', 4.4, { opacity: 0.6 }); }   // a lamp on a short pole at the saddle, and its light on the cloak
}

// ---------------------------------------------------------------- the light of the lamps over the ranks, and the mist behind them
for (const [x0, x1, y] of [[420, 660, 752], [690, 1010, 758], [1040, 1290, 756]]) p.stroke({ brush: 'soft', color: '#a86430', width: 46, opacity: 0.13, points: wave(x0, y, x1, y + 6, 4, 1, 6) });
for (let k = 0; k < 6; k++) { const x = r.range(300, 1000), len = r.range(300, 600), y = r.range(722, 742); p.stroke({ brush: 'soft', color: '#8ca4dc', width: r.range(18, 30), opacity: 0.14, points: wave(x, y, x + len, y + r.range(-4, 4), 3, 1, 6) }); }

// ---------------------------------------------------------------- the ranks: three bodies of riders, each in lines, far ones first
const bodies = [[430, 650], [690, 1010], [1050, 1290]];
const flags = ['#1c4c4c', '#24406c', '#6c2434'];
for (const y of [746, 752, 759, 768, 779, 793]) {
  const s = S(y), spread = (y - 746) * 0.9;
  bodies.forEach(([a, b], bi) => {
    const mid = (a + b) / 2, half = (b - a) / 2 + spread * 0.5, step = 2.25 * s;
    for (let x = mid - half + r.range(0, step * 0.5); x < mid + half; x += step * r.range(0.82, 1.2)) {
      if (r() < 0.06) continue;                                                              // a gap in the line
      rider(x, y + r.range(-1.2, 1.2), { lamp: r() < 0.06 + 0.5 * Math.pow(lit(x / 70, y / 9), 2) });
    }
    if (y === 759) standard(mid + r.range(-30, 30), y - 2, flags[bi]);
  });
}
// A few who ride between the lines with orders.
rider(672, 806, { lamp: true, lance: false }); rider(1028, 800, { lance: 1 }); rider(872, 822, { lamp: true, lance: 1 }); rider(745, 834, { lance: false });

// ---------------------------------------------------------------- mist over the feet of the far ranks, and across the middle of the plain
for (let k = 0; k < 9; k++) { const x = r.range(300, 1100), len = r.range(260, 520), y = r.range(770, 800); p.stroke({ brush: 'soft', color: '#7c94cc', width: r.range(14, 24), opacity: 0.1, points: wave(x, y, x + len, y + r.range(-3, 3), 3, 1, 6) }); }
for (let k = 0; k < 7; k++) { const x = r.range(100, 1100), len = r.range(360, 700), y = r.range(836, 900); p.stroke({ brush: 'soft', color: '#5c74ac', width: r.range(30, 56), opacity: 0.1, points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 6) }); }

// ---------------------------------------------------------------- those who come up the road, far ones first
rider(1000, 818, { side: 1, lamp: true, lance: 1 });
rider(1076, 836, { side: 1, lance: 1 });
soldier(1196, 868, { dir: -1, coat: '#1c1c26', cloak: '#1c1834', lamp: true });
soldier(1396, 938, { dir: -1, coat: '#161a28', cloak: '#141c3c', flag: '#1c4c4c' });

// ---------------------------------------------------------------- the boy on the black dragon
{
  const { F, C, M, tone, opt, s, L } = mounted(586, 954, { coat: '#070a14', cloth: { shadow: '#1c0c10', half: '#4c1c20', lit: '#8c4438', rim: '#d8b0a8' } });
  solid(p, [C(0.14, 1.9, 0.12), C(0.0, 1.55, 0.1), C(0.05, 1.24, 0.08)], tone('#0c0e18', 0.25), opt({ length: 14 }));                    // his leg: black, with an orange line down it
  M([[0.19, 1.86], [0.06, 1.58], [0.1, 1.34]], '#d86c1c', 4, { opacity: 0.75 });
  M([[0.0, 1.2], [0.2, 1.14]], '#b8c4e4', Math.max(4.8, 0.09 * s));                                                                      // his shoe
  M([[0.27, 2.68], [0.27, 2.68 - Math.max(0.2, 13 / s)]], '#7c6c74', Math.max(4.8, 0.13 * s));                                           // his neck
  solid(p, [C(0.22, 1.96, 0.2), C(0.25, 2.3, 0.22)], tone('#12141e', 0.3), opt({ length: 16 }));                                         // his jacket: dark below
  shape(p, [F(0.01, 2.5), F(0.14, 2.56), F(0.27, 2.58), F(0.4, 2.56), F(0.52, 2.5), F(0.53, 2.3), F(0.27, 2.24), F(0.0, 2.3)], { shadow: '#56669c', half: '#98a8d4', lit: '#e8eeff', rim: '#ffffff' }, { light: L, turn: 0.05, width: 5.5, length: 16, round: 0.12 * s, flow: () => 0.05, dash: 16, gap: 6 });   // and white over the shoulders
  solid(p, [C(0.02, 2.44, 0.1), C(-0.04, 2.14, 0.085), C(0.14, 2.0, 0.07)], { shadow: '#46568c', half: '#8898c8', lit: '#dce4fc', rim: '#ffffff' }, opt({ length: 14, turn: 0.1 }));   // his arm, white, down to the reins
    M([[-0.06, 2.4], [-0.115, 2.16]], '#e87c24', 4, { opacity: 0.85 });                                                                    // the orange line along his sleeve
  const [hx, hy] = F(0.29, 2.74), R = Math.max(7.5, 0.13 * s);
  M([[0.36, 2.66], [0.41, 2.66 + Math.max(0.17, 12.5 / s)]], '#a89088', 4.4);                                                             // the side of his face, turned up to the whale
  disc(p, hx, hy, R, '#07080e', 6.2, { ...line });                                                                                        // his black hair
  for (const a of [-2.4, -1.5, -0.7]) p.tryStroke({ ...line, color: '#07080e', width: 5, taper: [0, 0.8], points: [[hx + Math.cos(a) * (R - 3), hy + Math.sin(a) * (R - 3)], [hx + Math.cos(a) * (R + 2), hy + Math.sin(a) * (R + 2)], [hx + Math.cos(a - 0.3) * (R + 7), hy + Math.sin(a - 0.3) * (R + 7)]] });   // which stands up in points
  p.tryStroke({ brush: 'round', color: '#5c74b4', width: 4, opacity: 0.8, points: arc(hx, hy, R - 1.5, -1.7, 0.2, 7) });                  // the moon on it
}

p.save();
