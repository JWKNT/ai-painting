// The fence. A low wall of concrete goes round the roof, and on it stands a wire fence as
// tall as a person: steel posts, a rail along the top, and a net of wire between them. It
// goes down the right side of the roof, from close to us to the far corner, and across the
// far edge. We see the great cloud and the town through it. Against the light the posts are
// dark; the net is only a thin grey with its wires showing where they are near us.
'use strict';
const { studio, open, W, H, VX, F, ROOF, HUT, at, water, nA, nB } = require('./scene');
const { mix, clamp, solid } = studio;

const p = open('fence');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.08, dry: 0.03, rag: 0.12, cap: 'flat' };
const thin = (w) => (w < 4.8 ? { brush: 'round' } : {});
const mark = (pts, color, width, extra = {}) => p.tryStroke({ ...line, ...thin(width), color, width, ...extra, points: pts });
const FAR = ROOF.far, RX = ROOF.right, CURB = ROOF.curb, TOP = ROOF.fence, MID = RX + 0.1;      // the posts stand in the middle of the low wall
const hutEnd = at(HUT.x1, 0, HUT.z1)[0];                                                        // the far fence shows from here to the right
const steel = '#2a3650', wire = '#3c4a68';

// ---------------------------------------------------------------- the far fence, across the end of the roof
{
  const x0 = hutEnd - 4, x1 = at(RX, 0, FAR)[0], yc = at(0, CURB, FAR)[1], yf = at(0, 0, FAR)[1], yt = at(0, TOP, FAR)[1];
  for (let x = x0; x < x1; x += 40) mark([[x, (yc + yf) / 2 + 1], [Math.min(x1, x + 44), (yc + yf) / 2 + 1]], mix('#56647f', '#66748f', nA(x / 40, 3)), yf - yc + 3);     // the low wall: its face toward us is in shade
  mark([[x0, yc - 1], [x1, yc - 1]], '#f4f8ff', 4.4, { cap: 'round' });                                                                                               // the sun on its top
  for (let x = x0 + 4; x < x1; x += 7) { mark([[x, yc - 2], [x + (yc - yt) * 0.55, yt + 2]], wire, 4, { opacity: 0.13 }); mark([[x, yc - 2], [x - (yc - yt) * 0.55, yt + 2]], wire, 4, { opacity: 0.13 }); }   // the net: far off it is a thin grey
  for (let X = -8; X <= 4; X += 2) { const x = at(X, 0, FAR)[0]; if (x > x0 + 6) mark([[x, yc], [x, yt - 2]], steel, 4.6, { cap: 'round' }); }                         // the posts
  mark([[x0, yt], [x1 + 2, yt]], steel, 4.6, { cap: 'round' });                                                                                                        // the rail along the top
  mark([[x0, yc - 7], [x1, yc - 7]], steel, 4, { opacity: 0.6 });
  for (let x = x0 + 6; x < x1; x += r.range(8, 22)) { if (water(x, yf + 6) > 0.6) mark([[x, yf + 2], [x + r.range(-1, 1), yf + 2 + r.range(13, 20)]], '#44547a', 4, { opacity: 0.3 }); }   // all of it again in the water at its foot, faint
}

// ---------------------------------------------------------------- the fence down the right side
const P = (Z, h, X = MID) => at(X, h, Z);
const Z0 = F * RX / (W - VX) - 0.25;                                                            // the fence comes into the picture this far from us
{
  // the low wall: its top is in the sun; its face toward us turns a little to the sun too
  for (let Z = Z0; Z < FAR; Z *= 1.07) {
    const Zn = Math.min(FAR, Z * 1.07), a = at(RX, CURB, Z), b = at(RX, CURB, Zn), fa = at(RX, 0, Z), fb = at(RX, 0, Zn), hgt = (fa[1] - a[1] + fb[1] - b[1]) / 2;
    const steps = Math.max(1, Math.round(hgt / 9));
    for (let k = 0; k < steps; k++) { const t = (k + 0.5) / steps; mark([[a[0] + 2, a[1] + (fa[1] - a[1]) * t], [b[0] - 2, b[1] + (fb[1] - b[1]) * t]], mix(mix('#7684a0', '#8c9ab4', nB(Z * 3, k)), '#5c6a88', t * 0.5), Math.max(4.8, hgt / steps + 1.5), { cap: 'round' }); }
    const ta = at(RX + 0.2, CURB, Z), tb = at(RX + 0.2, CURB, Zn);
    mark([[(a[0] + ta[0]) / 2, a[1] - 1], [(b[0] + tb[0]) / 2, b[1] - 1]], '#f6faff', Math.max(4.8, (ta[0] - a[0]) * 0.8), { cap: 'round' });
    mark([[fa[0], fa[1] + 1], [fb[0], fb[1] + 1]], '#2c3850', 4.6, { opacity: 0.75, cap: 'round' });                                                                 // the dark where it meets the floor
  }
  // the net: two sets of wires that cross. Near us each wire shows; far off they close into a grey.
  const wires = (dir) => {
    for (let c = Z0 - 2; c < FAR;) {
      const z0 = Math.max(Z0 - 0.4, dir > 0 ? c : c - (TOP - 0.3)), z1 = Math.min(FAR, dir > 0 ? c + (TOP - 0.3) : c), hAt = (z) => (dir > 0 ? 0.3 + (z - c) : 0.3 + (c - z));
      if (z1 - z0 > 0.2) { const zm = (z0 + z1) / 2; mark([P(z0, clamp(hAt(z0), 0.3, TOP)), P(z1, clamp(hAt(z1), 0.3, TOP))], wire, 4, { opacity: clamp(2.4 / zm, 0.14, 0.4) }); }
      c += c < 9 ? 0.2 : c < 14 ? 0.3 : 0.5;
    }
  };
  wires(1); wires(-1);
  // the posts, far ones first, the rail along the top, and a thinner rail near the foot
  for (let Z = FAR; Z > Z0; Z -= 2) {
    const a = P(Z, CURB), b = P(Z, TOP + 0.03), w = Math.max(4.6, 0.07 * F / Z);
    mark([a, b], steel, w, { cap: 'round' });
    if (w > 5.5) mark([[a[0] - w * 0.3, a[1] - 4], [b[0] - w * 0.3, b[1] + 4]], '#b8c8e8', 4, { opacity: 0.55 });                                                    // the light of the sky on the side of a post
    mark([[a[0] - w, a[1]], [a[0] + w, a[1]]].map(([x, y], i) => [x + (i ? Math.max(0, 6.5 - w) : -Math.max(0, 6.5 - w)), y]), steel, 5, { opacity: 0.9 });           // its foot
  }
  for (let Z = Z0 - 0.3; Z < FAR; Z *= 1.25) { const Zn = Math.min(FAR, Z * 1.25); mark([P(Z, TOP), P(Zn, TOP)], steel, Math.max(4.6, 0.06 * F / ((Z + Zn) / 2)), { cap: 'round' }); mark([P(Z, 0.33), P(Zn, 0.33)], steel, 4.2, { opacity: 0.7 }); }
  for (let k = 0; k < 20; k++) { const Z = Z0 + Math.pow(r(), 1.6) * 9, h = r.range(0.4, 1.95), [x, y] = P(Z, h), len = Math.max(12.4, 20 / Z * 6); mark([[x - len * 0.3, y + len * 0.4], [x + len * 0.3, y - len * 0.4]], '#f4f9ff', 4, { opacity: r.range(0.25, 0.55) }); }   // wires that turn the sun to us
  // the posts again, in the water at the foot of the wall
  for (let Z = FAR; Z > Z0; Z -= 2) {
    const [x, y0] = at(RX, 0, Z), len = (TOP + 0.3) * F / Z;
    let run = [];
    const end = () => { if (run.length > 1) p.tryStroke({ brush: 'round', color: '#3c4c70', width: 4.2, opacity: 0.34, points: run }); run = []; };
    for (let y = y0 + 6; y < Math.min(H + 10, y0 + len); y += 7) { if (water(x, y) > 0.6 && r() < 0.9) run.push([x + r.range(-1.6, 1.6), y]); else end(); }
    end();
  }
}

// ---------------------------------------------------------------- two pipes that let the air out of the building, with caps
for (const [X, Z, h] of [[3.5, 16.5, 0.8], [3.1, 12.5, 0.9]]) {
  const s = F / Z, [x, y] = at(X, 0, Z), tones = { shadow: '#2c3a56', half: '#52648a', lit: '#8ca0c8', rim: '#f4f8ff' };
  p.tryStroke({ brush: 'soft', color: '#1c2638', width: Math.max(8.4, 0.2 * s), opacity: 0.4, points: [[x - 0.1 * s, y + 2], [x + 0.25 * s, y + 0.16 * s], [x + 0.5 * s, y + 0.3 * s]] });   // its shade, toward us
  solid(p, [[x, y - 2, 0.08 * s], [x, y - h * s, 0.08 * s]], tones, { light: [-0.5, -0.86], turn: 0.2, width: 5, length: 16 });
  mark([[x - 0.2 * s, y - h * s], [x + 0.2 * s, y - h * s]], '#34425e', Math.max(5, 0.12 * s), { cap: 'round' });
  mark([[x - 0.18 * s, y - h * s - 0.06 * s], [x + 0.14 * s, y - h * s - 0.06 * s]], '#f4f8ff', 4.2, { cap: 'round' });
}

p.save();
