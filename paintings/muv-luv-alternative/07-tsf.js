// The Tactical Surface Fighter: a machine in the shape of a man, eighteen metres high, flying
// low on the two jump units at its hips. We see it from behind and a little to its left as
// it goes in: leaning into its flight, legs trailing, the long blade raised in its far hand
// and the gun in its near hand firing. The glare ahead of it edges its front; the fire of
// its own engines lights its back.
'use strict';
const { studio, open, LIGHT, TSF } = require('./scene');
const { mix, solid, glint } = studio;

const p = open('tsf');
const r = p.rng;
const T = (x, y, rad) => (rad == null ? [TSF.x + x, TSF.y + y] : [TSF.x + x, TSF.y + y, rad]);

// Armor: dark blue-grey. The far edge of each part takes the blue of the engine fire, the
// near edge the glare of the field.
const armor = { shadow: '#090c17', half: '#182036', lit: '#394a72', rim: '#ffb070', bounce: '#2e6488' };
const dim = { ...armor, rim: undefined };                               // for parts the glare cannot reach
const steel = { shadow: '#0a0b12', half: '#1c2030', lit: '#56607c', rim: '#ffd9a0', bounce: '#3a6c8c' };
const o = { light: LIGHT, turn: 0.45, width: 5.5, length: 28, vary: 0.06, bounce: 0.75, dash: 22, gap: 10, edgeOpacity: 0.85 };
const part = (pts, tones = armor, extra = {}) => solid(p, pts.map((q) => T(...q)), tones, { ...o, ...extra });
const cold = () => mix('#7cc8f0', '#e0f6ff', r());
const hot = () => mix('#ff9a58', '#ffe2a8', r());

// Engine fire: a long plume from a nozzle, white at the heart, then blue, then thinning to violet.
function plume(x, y, dx, dy, len, w) {
  const at = (t, side = 0) => [x + dx * len * t - dy * side, y + dy * len * t + dx * side];
  p.stroke({ brush: 'soft', color: '#3a6cff', width: w * 3.4, opacity: 0.16, taper: [0, 0.6], points: [at(-0.05), at(0.5), at(1.1)] });
  p.stroke({ brush: 'soft', color: '#7c5cff', width: w * 2.2, opacity: 0.22, taper: [0, 0.7], points: [at(0), at(0.5), at(1)] });
  for (let k = 0; k < 9; k++) {
    const side = r.range(-0.5, 0.5) * w, reach = r.range(0.5, 1) * (1 - Math.abs(side) / w * 0.6);
    p.tryStroke({ brush: 'bristle', color: mix(mix('#4a7cff', '#9ad0ff', r()), '#c8a0ff', r() * 0.3), width: Math.max(5, w * r.range(0.3, 0.5)), opacity: r.range(0.5, 0.85), mix: 0.25, dry: 0.1, rag: 0.4, taper: [0, 0.9], points: [at(0.02, side), at(reach * 0.5, side * 0.7), at(reach, side * 0.3)] });
  }
  p.stroke({ brush: 'bristle', color: '#d8f0ff', width: Math.max(6, w * 0.6), opacity: 0.95, mix: 0.1, dry: 0, rag: 0.2, taper: [0, 0.9], points: [at(0), at(0.28), at(0.56)] });
  p.stroke({ brush: 'bristle', color: '#ffffff', width: Math.max(5, w * 0.34), opacity: 0.95, mix: 0, dry: 0, rag: 0.1, taper: [0, 0.9], points: [at(0), at(0.18), at(0.36)] });
  for (const t of [0.2, 0.36, 0.5]) p.tryStroke({ color: '#ffffff', width: 4.4, opacity: 0.7 - t, points: [at(t, -w * 0.3), at(t, w * 0.3)].map(([px, py]) => [px, py]) });   // the knots of fire in it
}

// Its shadow and the light of its engines on the ground under it.
p.stroke({ brush: 'soft', color: '#050408', width: 80, opacity: 0.5, points: [T(-170, 244), T(-50, 238), T(80, 228)] });
for (const [x, y, w, op] of [[-230, 300, 170, 0.16], [-180, 282, 100, 0.22]]) p.stroke({ brush: 'soft', color: '#6aa8ff', width: w, opacity: op, points: [T(x - w, y + 8), T(x, y), T(x + w, y - 6)] });

// The far jump unit and its fire, behind everything else.
part([[14, 44, 17], [-14, 88, 22], [-38, 126, 19]], dim, { length: 34 });
plume(TSF.x - 46, TSF.y + 136, -0.55, 0.835, 210, 24);

// The far arm, raised, and the blade in its hand: as long as the machine is tall.
part([[106, -156, 7.5], [72, -242, 9.5], [36, -336, 8], [18, -380, 4.8]], steel, { length: 44, turn: 0.3 });
part([[114, -116, 5.5], [106, -152, 6]], dim);                                                              // the grip
part([[72, -78, 13], [98, -112, 12.5], [104, -150, 12]]);
// The far leg, drawn up under it.
part([[16, 28, 19], [26, 66, 18], [30, 102, 15.5]], dim, { length: 32 });
part([[30, 102, 17], [18, 134, 16], [2, 160, 12]], armor, { length: 32 });
part([[0, 164, 11], [-22, 188, 8.5]]);
part([[30, 102, 8.5], [56, 116, 5.5]], steel);                                                              // the blade of its knee

// The hips, the back, the far shoulder.
part([[-10, 10, 26], [18, 16, 26]], dim);
part([[4, -6, 30], [22, -44, 37], [40, -82, 38]], armor, { length: 36, width: 6.5 });
part([[66, -72, 21], [86, -82, 20]]);
// The mount on its back where the blade was carried.
part([[10, -92, 10], [-14, -116, 8.5]], dim);

// The head: small, with a crest forward and an aerial back.
part([[52, -108, 12], [58, -116, 13]], dim);                                                                // the neck

// The near leg, trailing: thick in the thigh, armored below the knee.
part([[-14, 24, 20], [-34, 60, 19], [-48, 90, 16]], dim, { length: 32 });
part([[-48, 90, 18], [-62, 126, 17], [-74, 158, 12.5]], armor, { length: 32 });
part([[-76, 162, 11.5], [-98, 188, 9]]);
part([[-48, 88, 9], [-22, 104, 6]], steel);
part([[-26, 20, 13], [-38, 54, 11]], dim);                                                                  // the plate of armor over the hip

// The near shoulder: a heavy block of armor. Then the near arm thrust forward with the gun.
part([[-22, -52, 25], [8, -72, 27]], armor, { length: 26, width: 6 });
part([[-4, -46, 13], [24, -14, 12.5]], dim);
part([[24, -14, 14], [70, -6, 13]]);
part([[60, 0, 11], [124, -12, 10], [182, -22, 7]], steel, { length: 38 });                                  // the gun
part([[92, 6, 9], [116, 4, 9]], steel);

// The near jump unit, close to us, and its fire.
part([[-32, 28, 19], [-70, 74, 25], [-104, 116, 22]], armor, { length: 36, width: 6 });
part([[-58, 42, 7], [-94, 36, 6]], steel);                                                                  // its fin
plume(TSF.x - 112, TSF.y + 126, -0.6, 0.8, 250, 28);

// ---------------------------------------------------------------- its armor
// A plate of armor: a flat piece with four corners, laid in with straight strokes from the
// edge a-d to the edge b-c. It is darker toward one side, so that it reads as a flat face.
function plate(a, b, c, d, tone, turn = 0.5) {
  const across = Math.hypot(d[0] - a[0], d[1] - a[1]), n = Math.max(2, Math.round(across / 7));
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n, p0 = [a[0] + (d[0] - a[0]) * f, a[1] + (d[1] - a[1]) * f], p1 = [b[0] + (c[0] - b[0]) * f, b[1] + (c[1] - b[1]) * f];
    p.tryStroke({ brush: 'bristle', color: mix(tone, f < 0.5 ? '#40527c' : '#06080f', Math.abs(f - 0.5) * turn + r() * 0.06), width: Math.max(4.8, across / n * 1.6), mix: 0.05, dry: 0, rag: 0.05, cap: 'flat', points: [T(...p0), T(...p1)] });
  }
}
const seam = (a, b, color = '#05060c', opacity = 0.8) => p.tryStroke({ color, width: 4, opacity, points: [T(...a), T(...b)] });
const edge = (pts, color, opacity = 0.8) => glint(p, pts.map((q) => T(...q)), color, { width: 4.2, dash: 30, gap: 6, opacity, rng: r });

// The weapon on its back mount: a gun as long as its arm, carried muzzle up.
plate([-8, -84], [-50, -176], [-40, -180], [4, -90], '#141926', 0.3);
plate([-30, -120], [-44, -150], [-30, -156], [-17, -126], '#1c2438', 0.3);
edge([[-6, -86], [-48, -176]], cold, 0.5);
// The plates of its back, either side of the spine.
plate([-10, -14], [20, -86], [38, -80], [10, -6], '#1a2238', 0.7);
plate([12, -4], [40, -78], [58, -68], [32, 2], '#222c46', 0.6);
seam([4, -10], [30, -82]);
seam([-2, -44], [34, -30]);
edge([[32, 2], [58, -68]], hot, 0.75);
// The near shoulder: a block with a flat top, a side toward us and an end toward the glare.
plate([-44, -88], [10, -104], [20, -56], [-36, -40], '#1b2439', 0.75);
plate([-44, -88], [10, -104], [14, -112], [-38, -96], '#34446a', 0.2);                                       // its top
seam([-40, -64], [16, -80]);
edge([[-44, -90], [10, -106]], cold, 0.6);
edge([[12, -104], [21, -56]], hot, 0.9);
p.tryStroke({ color: '#d6dcea', width: 4, opacity: 0.55, points: [T(-28, -52), T(-12, -57)] });                // a mark of its unit
// The far shoulder, beyond the head.
plate([62, -102], [102, -108], [106, -72], [66, -64], '#202a44', 0.6);
edge([[103, -108], [107, -72]], hot, 0.9);
// The head: a helmet that comes forward to a point, a face plate that takes the glare, an
// eye, and two aerials that go up and back from it.
plate([44, -122], [84, -136], [96, -118], [52, -104], '#161d30', 0.6);
plate([78, -134], [98, -126], [96, -116], [80, -118], '#3c4a70', 0.2);
edge([[86, -136], [99, -122]], hot, 0.9);
p.stroke({ brush: 'bristle', color: '#0b0e1a', width: 6.5, mix: 0, dry: 0, rag: 0, cap: 'round', taper: [0, 0.7], points: [T(58, -132), T(46, -156), T(30, -178)] });
p.stroke({ brush: 'bristle', color: '#0b0e1a', width: 5.4, mix: 0, dry: 0, rag: 0, cap: 'round', taper: [0, 0.7], points: [T(68, -136), T(62, -156), T(52, -172)] });
edge([[60, -133], [48, -156], [33, -177]], cold, 0.5);
p.tryStroke({ color: '#ffd24a', width: 4.4, opacity: 0.95, points: [T(82, -126), T(94.6, -122)] });           // its eye, turned toward the enemy
p.tryStroke({ brush: 'soft', color: '#ffb040', width: 8.4, opacity: 0.4, points: [T(78, -127), T(98, -121)] });
// Plates on the near arm, the near leg and the near jump unit.
plate([20, -26], [70, -18], [72, 4], [24, -2], '#1c2540', 0.6);
edge([[22, -27], [70, -19]], cold, 0.5);
plate([-58, 88], [-82, 152], [-66, 158], [-40, 94], '#1e2742', 0.6);
edge([[-40, 94], [-66, 158]], hot, 0.6);
plate([-44, 22], [-112, 104], [-92, 122], [-24, 40], '#182035', 0.7);
seam([-60, 60], [-42, 78]);
seam([-84, 88], [-66, 106]);
edge([[-23, 40], [-91, 122]], hot, 0.5);

// The blue of the engine fire on the parts of it that face the fire.
for (const pts of [[T(-124, 110), T(-90, 68), T(-50, 22)], [T(-86, 154), T(-76, 124), T(-64, 92)], [T(-12, 160), T(4, 132), T(14, 104)], [T(-28, -2), T(-14, -44), T(2, -84)], [T(-44, -46), T(-36, -66), T(-16, -84)]]) {
  glint(p, pts, cold, { width: 4.4, dash: 22, gap: 12, opacity: 0.65, rng: r });
}
// The glare along the blade.
glint(p, [T(112, -156), T(79, -240), T(42, -334), T(22, -378)], hot, { width: 4.2, dash: 44, gap: 8, opacity: 0.9, rng: r });

p.save();
