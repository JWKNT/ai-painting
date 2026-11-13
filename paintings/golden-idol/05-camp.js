// The camp on the cliff top: palms behind, a ridge tent with a lamp inside, crates, a spade
// and a pick, a coil of rope, a lantern on the ground.
'use strict';
const { studio, open, INK, cliffTop, ink, beside } = require('./scene');
const { mix, arc, clamp } = studio;

const p = open('camp');
const r = p.rng;
const G = (x) => cliffTop(x) + 4;                                              // the ground under x

// Palms: a leaning trunk and a crown of long fronds, dark against the sky, lit along the sunward side.
function palm(x, top, lean) {
  const base = G(x), cx = x + lean, cy = top;
  const trunk = [[x, base + 4], [x + lean * 0.35, base - (base - top) * 0.4], [x + lean * 0.8, base - (base - top) * 0.8], [cx, cy]];
  p.stroke({ brush: 'bristle', color: '#201829', width: 20, taper: [0, 0.5], mix: 0, dry: 0, rag: 0, cap: 'round', jitter: 0.4, streak: 0.25, points: trunk });
  p.tryStroke({ color: '#b0563c', width: 4.5, opacity: 0.6, points: beside(trunk, -7) });
  for (let k = 0; k < 11; k++) {
    const a = -Math.PI + (k + r.range(-0.3, 0.3)) / 10 * Math.PI, len = r.range(110, 170), droop = len * r.range(0.35, 0.6);
    const tip = [cx + Math.cos(a) * len, cy + Math.sin(a) * len * 0.55 + droop], mid = [cx + Math.cos(a) * len * 0.55, cy + Math.sin(a) * len * 0.62 - 6];
    p.stroke({ brush: 'bristle', color: r.pick(['#1c1730', '#231c36', '#191428']), width: r.range(14, 20), taper: [0, 0.9], mix: 0, dry: 0, rag: 0.35, streak: 0.3, jitter: 0.3, points: [[cx, cy], mid, tip] });
    if (Math.cos(a) > -0.2 && r() < 0.8) p.tryStroke({ color: mix('#c05a3c', '#f29a52', r()), width: 4.2, opacity: r.range(0.4, 0.75), taper: [0.1, 0.6], points: [[cx + Math.cos(a) * 14, cy + Math.sin(a) * 10 - 4], [mid[0] + 2, mid[1] - 5], [tip[0] + 3, tip[1] - 4]] });
  }
}
palm(44, 262, 40);
palm(170, 330, -34);

// Undergrowth at the foot of the palms.
for (let k = 0; k < 26; k++) {
  const x = r.range(-10, 250), base = G(x) + r.range(0, 8), h = r.range(40, 110), bend = r.range(-0.6, 0.6) * h;
  p.tryStroke({ brush: 'bristle', color: r.pick(['#1b1630', '#221a34', '#1a2334', '#15101f']), width: r.range(9, 16), taper: [0, 0.85], mix: 0, dry: 0, rag: 0.2, points: [[x, base], [x + bend * 0.3, base - h * 0.6], [x + bend, base - h]] });
}

// The tent: a shaded side panel running back to the left, and the open front turned toward the sun.
{
  const apex = [356, 524], back = [250, 540], fl = [268, G(268)], fr = [452, G(452)], bl = [176, G(176) - 4];
  const along = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  for (let k = 0; k <= 5; k++) {                                               // side panel, in shadow
    const t = k / 5, top = along(back, apex, t), bot = along(bl, fl, t);
    p.stroke({ brush: 'bristle', color: mix('#5a4a72', '#77607e', t + r.range(-0.1, 0.1)), width: 30, mix: 0.05, dry: 0, rag: 0, cap: 'round', jitter: 0.3, points: [top, along(top, bot, 0.5), bot] });
  }
  for (let k = 0; k <= 7; k++) {                                               // front, lighter toward the right
    const t = k / 7, bot = along(fl, fr, t);
    const light = clamp(t * 1.15 - 0.05, 0, 1);
    p.stroke({ brush: 'bristle', color: mix('#9a7a78', '#f2c68c', light), width: 30, mix: 0.05, dry: 0, rag: 0, cap: 'round', jitter: 0.3, points: [along(apex, bot, 0.06), along(apex, bot, 0.5), along(apex, bot, 0.96)] });
  }
  // the opening, dark, with the glow of a lamp low inside it
  const door = [356, 566], dl = [330, G(330)], dr = [392, G(392)];
  for (const t of [0.12, 0.5, 0.88]) { const bot = along(dl, dr, t); p.stroke({ brush: 'flat', color: '#241a2c', width: 26, rag: 0, cap: 'round', points: [door, along(door, bot, 0.5), [bot[0], bot[1] - 8]] }); }
  p.stroke({ brush: 'soft', color: '#ff9a3c', width: 30, opacity: 0.6, points: [[328, G(328) - 34], [362, G(362) - 20], [396, G(396) - 34]] });
  p.line(354, G(356) - 30, 366, G(356) - 12, { color: '#ffd98a', width: 7 });
  // seams, ridge and edges
  ink(p, [apex, along(apex, fl, 0.5), fl], 4.4);
  ink(p, [apex, along(apex, fr, 0.5), fr], 4.4);
  ink(p, [back, along(back, apex, 0.5), apex], 4.4);
  ink(p, [back, along(back, bl, 0.5), bl], 4.4);
  ink(p, [fl, along(fl, fr, 0.5), fr], 4.4, { opacity: 0.6 });
  p.stroke({ color: '#ffe0a8', width: 4.5, opacity: 0.85, points: [along(apex, fr, 0.06), along(apex, fr, 0.5), along(apex, fr, 0.95)].map(([x, y]) => [x - 5, y + 2]) });
  // guy ropes and a peg
  p.line(apex[0], apex[1], 500, G(500), { color: '#3a2a38', width: 4, opacity: 0.7 });
  p.line(back[0], back[1], 150, G(150) - 2, { color: '#2a2030', width: 4, opacity: 0.7 });
}

// A crate: planks across the front, a lighter top, dark edges.
function crate(x0, x1, top, wood = '#7a4c34') {
  const base = G((x0 + x1) / 2), rows = Math.max(2, Math.round((base - top) / 15)), h = (base - top) / rows;
  for (let k = 0; k < rows; k++) {
    const y = top + h * (k + 0.5);
    p.stroke({ brush: 'flat', color: mix(wood, '#4a2c2c', r() * 0.5), width: h + 2, rag: 0, cap: 'flat', jitter: 0.5, streak: 0.25, points: [[x0, y], [(x0 + x1) / 2, y + r.range(-0.8, 0.8)], [x1, y]] });
    p.tryStroke({ brush: 'flat', color: mix('#c07a44', '#f0a858', r()), width: h + 2, opacity: 0.85, rag: 0, cap: 'flat', jitter: 0.4, points: [[x0 + (x1 - x0) * 0.62, y], [x1, y]] });   // the end toward the sun
  }
  p.stroke({ brush: 'flat', color: '#c98a52', width: 8, rag: 0, cap: 'flat', points: [[x0 - 2, top - 2], [(x0 + x1) / 2, top - 3], [x1 + 2, top - 2]] });
  ink(p, [[x0, top - 6], [x0, (top + base) / 2], [x0, base]]);
  ink(p, [[x1, top - 6], [x1, (top + base) / 2], [x1, base]]);
  ink(p, [[x0, base], [(x0 + x1) / 2, base + 1], [x1, base]], 4.2, { opacity: 0.7 });
  ink(p, [[x0 - 3, top - 7], [(x0 + x1) / 2, top - 8], [x1 + 3, top - 7]], 4.2, { opacity: 0.8 });
}
const BOX = { x: 566, top: G(566) - 44 };
crate(BOX.x - 52, BOX.x + 52, BOX.top);
crate(644, 706, G(676) - 34, '#6a4034');

// Spade and pick leaning on the crate, a coil of rope, a lantern.
{
  const x = BOX.x - 60;
  p.line(x - 46, G(x - 46) + 2, x - 6, BOX.top - 50, { color: '#5a3a2a', width: 6 });                   // spade
  p.line(x - 55, G(x - 50) + 2, x - 40, G(x - 50) - 28, { brush: 'flat', color: '#8a8c9c', width: 15, rag: 0, cap: 'round' });
  p.line(x - 78, G(x - 78) + 2, x - 20, BOX.top - 34, { color: '#4a2e24', width: 6 });                  // pick
  p.stroke({ color: '#7a7c8e', width: 6.5, taper: [0.6, 0.6], points: [[x - 44, BOX.top - 50], [x - 20, BOX.top - 38], [x + 2, BOX.top - 14]] });
  for (const rad of [17, 11]) p.stroke({ color: '#8a6a44', width: 5.5, opacity: 0.95, points: arc(478, G(478) - 9, rad, 0.3, 0.3 + 6.283, 12).map(([px, py]) => [px, G(478) - 9 + (py - (G(478) - 9)) * 0.45]) });
  const lx = 676, ly = G(676) - 34;                                           // the lantern, on the small crate
  p.stroke({ brush: 'soft', color: '#ffa040', width: 40, opacity: 0.4, points: [[lx - 42, ly - 14], [lx, ly - 22], [lx + 42, ly - 14]] });
  p.line(lx, ly - 6, lx, ly - 24, { brush: 'flat', color: '#ffd27a', width: 9, rag: 0, cap: 'round' });
  p.line(lx - 8, ly - 4, lx + 8, ly - 4, { color: INK, width: 4.4 });
  p.line(lx - 7, ly - 29, lx + 7, ly - 29, { color: INK, width: 4.4 });
  p.stroke({ color: INK, width: 4, points: arc(lx, ly - 34, 6.4, Math.PI, 2 * Math.PI, 6) });
}

p.save();
