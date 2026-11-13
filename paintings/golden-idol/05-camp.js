// The camp on the cliff top: palms behind, a ridge tent with a lamp inside, crates, a spade
// and a pick, a lantern. Everything is a dark shape against the sky, turned by the low sun
// on its right side and by lamplight from within.
'use strict';
const { studio, open, SUNLIGHT, cliffTop, beside } = require('./scene');
const { mix, clamp, form, glint } = studio;

const p = open('camp');
const r = p.rng;
const G = (x) => cliffTop(x) + 4;                                              // the ground under x
const RIM = () => mix('#e8774a', '#ffb868', r());

// Palms: a leaning trunk, and fronds that arch out and hang, each with its leaflets.
function palm(x, top, lean) {
  const base = G(x), cx = x + lean, cy = top;
  form(p, [[x, base + 4], [x + lean * 0.35, base - (base - top) * 0.4], [x + lean * 0.8, base - (base - top) * 0.8], [cx, cy]], 19, { dark: '#1c1528', mid: '#2e2036', light: RIM, toward: SUNLIGHT, taper: [0, 0.5], lightOpacity: 0.6 });
  for (let k = 0; k < 12; k++) {
    const a = -Math.PI + (k + r.range(-0.3, 0.3)) / 11 * Math.PI, len = r.range(100, 165), droop = len * r.range(0.4, 0.7);
    const at = (f) => [cx + Math.cos(a) * len * f, cy + Math.sin(a) * len * 0.5 * Math.sin(f * 1.7) + droop * f * f];
    const rib = [at(0), at(0.35), at(0.7), at(1)];
    p.stroke({ brush: 'bristle', color: r.pick(['#1a162c', '#211a33', '#171226']), width: r.range(9, 13), taper: [0, 0.9], mix: 0, dry: 0, rag: 0.2, streak: 0.3, jitter: 0.3, points: rib });
    for (let q = 0; q < 7; q++) {                                               // leaflets hanging from the rib
      const f = r.range(0.2, 1), [lx, ly] = at(f), l = r.range(18, 34) * (1.1 - f * 0.5);
      p.tryStroke({ brush: 'bristle', color: r.pick(['#1a162c', '#231c36', '#151022']), width: r.range(5, 7.5), taper: [0, 0.8], mix: 0, dry: 0, rag: 0.3, points: [[lx, ly], [lx + Math.cos(a) * l * 0.2, ly + l * 0.6], [lx + Math.cos(a) * l * 0.3, ly + l]] });
    }
    if (Math.cos(a) > -0.3) glint(p, rib.map(([px, py]) => [px + 1, py - 5]), RIM, { width: 4.2, opacity: 0.6, dash: 30, gap: 26 });
  }
}
palm(44, 262, 40);
palm(170, 330, -34);

// Undergrowth at the foot of the palms.
for (let k = 0; k < 30; k++) {
  const x = r.range(-10, 250), base = G(x) + r.range(0, 8), h = r.range(40, 110), bend = r.range(-0.6, 0.6) * h;
  p.tryStroke({ brush: 'bristle', color: r.pick(['#1b1630', '#221a34', '#1a2334', '#15101f']), width: r.range(9, 16), taper: [0, 0.85], mix: 0, dry: 0, rag: 0.2, points: [[x, base], [x + bend * 0.3, base - h * 0.6], [x + bend, base - h]] });
}

// The tent. Its side runs back to the left in shadow; its front is turned to the sun, so the
// canvas warms from grey-violet at the left pole to gold at the right edge.
{
  const apex = [356, 524], back = [250, 540], fl = [268, G(268)], fr = [452, G(452)], bl = [176, G(176) - 4];
  const along = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  for (let k = 0; k <= 6; k++) {                                               // side panel
    const t = k / 6, top = along(back, apex, t), bot = along(bl, fl, t);
    p.stroke({ brush: 'bristle', color: mix(mix('#2e2848', '#3d3558', t), '#262040', r() * 0.4), width: 30, mix: 0.1, dry: 0, rag: 0.05, cap: 'round', jitter: 0.5, streak: 0.25, points: [[top[0], top[1] + 14], along(top, bot, 0.5), bot] });
  }
  p.stroke({ brush: 'bristle', color: '#3d3558', width: 12, mix: 0.05, dry: 0, rag: 0, cap: 'round', points: [[back[0], back[1] + 4], along(back, apex, 0.5).map((v, i) => v + (i ? 4 : 0)), [apex[0] - 4, apex[1] + 6]] });   // the ridge
  for (let k = 0; k <= 8; k++) {                                               // front panel
    const t = k / 8, bot = along(fl, fr, t), light = clamp(t * 1.2 - 0.12, 0, 1);
    const color = light < 0.5 ? mix('#5c4a68', '#b47a70', light * 2) : mix('#b47a70', '#ffcc92', light * 2 - 1);
    p.stroke({ brush: 'bristle', color: mix(color, '#3a2c48', r() * 0.12), width: 28, mix: 0.12, dry: 0, rag: 0.05, cap: 'round', jitter: 0.5, streak: 0.25, taper: [0.25, 0], points: [along(apex, bot, 0.03), along(apex, bot, 0.5), along(apex, bot, 0.97)] });
  }
  // the opening: dark, a lamp burning low inside, its light spilling out on the ground
  const door = [356, 562], dl = [328, G(328)], dr = [394, G(394)];
  for (const t of [0.1, 0.5, 0.9]) { const bot = along(dl, dr, t); p.stroke({ brush: 'bristle', color: mix('#1e1424', '#34202a', t), width: 26, mix: 0.05, dry: 0, rag: 0, cap: 'round', points: [door, along(door, bot, 0.5), [bot[0], bot[1] - 8]] }); }
  p.stroke({ brush: 'soft', color: '#ff8f34', width: 34, opacity: 0.55, points: [[326, G(326) - 30], [362, G(362) - 18], [398, G(398) - 30]] });
  p.stroke({ brush: 'soft', color: '#ffb050', width: 20, opacity: 0.6, points: [[340, G(344) - 26], [362, G(362) - 12], [384, G(380) - 26]] });
  p.line(356, G(356) - 26, 364, G(360) - 12, { color: '#ffe6a8', width: 6 });
  p.stroke({ brush: 'soft', color: '#ff9440', width: 30, opacity: 0.3, points: [[300, G(300) + 12], [366, G(366) + 16], [440, G(440) + 12]] });
  // the folds of the canvas, the lit right edge, the ridge against the sky
  for (const t of [0.3, 0.56, 0.8]) { const bot = along(fl, fr, t); p.tryStroke({ brush: 'bristle', color: '#fff0c8', width: 6, opacity: 0.25 + 0.4 * t, mix: 0.3, taper: [0.4, 0.2], points: [along(apex, bot, 0.2), along(apex, bot, 0.6), along(apex, bot, 0.95)] }); }
  glint(p, [along(apex, fr, 0.04), along(apex, fr, 0.5), along(apex, fr, 0.97)].map(([x, y]) => [x - 3, y + 1]), '#ffe2ae', { width: 5, opacity: 0.95, dash: 60, gap: 6 });
  glint(p, [back, along(back, apex, 0.5), apex].map(([x, y]) => [x, y - 2]), RIM, { width: 4.2, opacity: 0.5, dash: 30, gap: 24 });
  p.line(apex[0], apex[1], 500, G(500), { color: '#2a2030', width: 4, opacity: 0.55 });   // guy ropes
  p.line(back[0], back[1], 150, G(150) - 2, { color: '#1c1626', width: 4, opacity: 0.55 });
}

// A crate: dark planks, the end toward the sun warm, the top catching the sky.
function crate(x0, x1, top) {
  const base = G((x0 + x1) / 2), rows = Math.max(2, Math.round((base - top) / 15)), h = (base - top) / rows;
  for (let k = 0; k < rows; k++) {
    const y = top + h * (k + 0.5);
    p.stroke({ brush: 'bristle', color: mix('#2e2030', '#3c2a32', r()), width: h + 3, mix: 0.05, dry: 0, rag: 0.05, cap: 'flat', jitter: 0.6, streak: 0.3, points: [[x0, y], [(x0 + x1) / 2, y + r.range(-0.8, 0.8)], [x1, y]] });
    p.tryStroke({ brush: 'bristle', color: mix('#a8603c', '#e08a4c', r()), width: h + 3, opacity: 0.8, mix: 0.2, dry: 0, rag: 0.1, cap: 'flat', jitter: 0.5, points: [[x0 + (x1 - x0) * 0.7, y], [x1, y]] });
  }
  p.stroke({ brush: 'bristle', color: '#6a5670', width: 7, opacity: 0.9, mix: 0.1, dry: 0, rag: 0.05, points: [[x0 - 1, top - 1], [(x0 + x1) / 2, top - 2], [x1 + 1, top - 1]] });
  glint(p, [[x0 + (x1 - x0) * 0.5, top - 3], [x1, top - 3]], '#ffc27a', { width: 4.2, opacity: 0.9, dash: 40, gap: 4 });
}
const BOX = { x: 566, top: G(566) - 44 };
crate(BOX.x - 52, BOX.x + 52, BOX.top);
crate(644, 706, G(676) - 34);

// A spade and a pick against the big crate, and a lantern burning on the small one.
{
  const x = BOX.x - 60;
  form(p, [[x - 46, G(x - 46) + 2], [x - 26, G(x) - 46], [x - 6, BOX.top - 50]], 6, { dark: '#241a24', light: RIM, toward: SUNLIGHT, lightOpacity: 0.7 });
  p.line(x - 55, G(x - 50) + 2, x - 40, G(x - 50) - 28, { brush: 'bristle', color: '#4a4a5e', width: 15, mix: 0, dry: 0, rag: 0, cap: 'round' });
  p.line(x - 44, G(x - 50) - 2, x - 37, G(x - 50) - 24, { color: '#b8b4c8', width: 4.2, opacity: 0.8 });
  form(p, [[x - 78, G(x - 78) + 2], [x - 50, G(x) - 46], [x - 20, BOX.top - 34]], 6, { dark: '#20161f', light: RIM, toward: SUNLIGHT, lightOpacity: 0.6 });
  p.stroke({ brush: 'bristle', color: '#3c3c50', width: 7, taper: [0.6, 0.6], mix: 0, dry: 0, rag: 0, points: [[x - 44, BOX.top - 50], [x - 20, BOX.top - 38], [x + 2, BOX.top - 14]] });
  const lx = 676, ly = G(676) - 34;
  p.stroke({ brush: 'soft', color: '#ff9a3a', width: 70, opacity: 0.3, points: [[lx - 74, ly - 12], [lx, ly - 22], [lx + 74, ly - 12]] });
  p.stroke({ brush: 'soft', color: '#ffb450', width: 34, opacity: 0.5, points: [[lx - 36, ly - 14], [lx, ly - 20], [lx + 36, ly - 14]] });
  p.line(lx, ly - 1, lx, ly - 28, { brush: 'bristle', color: '#1a121c', width: 13, mix: 0, dry: 0, rag: 0, cap: 'round' });          // its dark frame
  p.line(lx, ly - 8, lx, ly - 21, { brush: 'bristle', color: '#ffdc98', width: 6.5, mix: 0, dry: 0, rag: 0, cap: 'round' });          // the flame behind glass
  p.stroke({ color: '#1a121c', width: 4, opacity: 0.8, points: [[lx - 6, ly - 28], [lx - 4, ly - 36], [lx + 4, ly - 36], [lx + 6, ly - 28]] });   // the handle
  p.stroke({ brush: 'soft', color: '#ffd080', width: 20, opacity: 0.4, points: [[lx - 21, ly - 13], [lx, ly - 16], [lx + 21, ly - 13]] });
}

p.save();
