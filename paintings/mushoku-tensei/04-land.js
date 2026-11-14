// The plain of Fittoa: wheat fields, in patches, with hedges and roads between them, a few
// trees and farms, and a river. All of it is dark under the cloud; the cold light of the
// column lies on it, brightest near the town, and each tree and each farm throws a long
// shade straight away from the light, toward us.
'use strict';
const { studio, open, W, H, HORIZON, COL, lit, nC, hash } = require('./scene');
const { mix, clamp, smooth } = studio;

const p = open('land');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.14, dry: 0.03, rag: 0.2, cap: 'round' };
// A place of the plain: how far off it is (1 at our feet, great far off), and where it is across the plain.
const depth = (y) => 240 / (y - HORIZON + 14), across = (x, y) => (x - COL.x) * depth(y) / 60;
// The fields are patches, each sown with one thing: ripe wheat, stubble, green, or bare earth.
function field(x, y) {
  const d = depth(y), u = across(x, y), i = Math.floor(u / 2.4 + 0.4 * Math.sin(d * 1.3)), j = Math.floor(Math.log(d) * 3.2), h = hash(i, j);
  let c = h < 0.5 ? mix('#8c7430', '#b4983c', hash(j, i)) : h < 0.7 ? '#6c6038' : h < 0.88 ? mix('#3c5430', '#526c38', hash(i + 3, j)) : '#4c3c2c';
  c = mix(c, '#101410', 0.62);                                                                   // the dark of the day
  c = mix(c, '#c4e4fc', lit(x, y, 330) * 0.75);                                                  // the light of the column on it
  c = mix(c, '#f4fbff', Math.exp(-Math.pow((x - COL.x) / (60 + (y - HORIZON) * 1.5), 2)) * smooth(300, 0, y - HORIZON) * 0.55);   // and the path of that light, straight toward us
  return mix(c, '#08090a', smooth(760, 1000, y) * 0.5 + (nC(x / 60, y / 8) - 0.5) * 0.16);
}
const level = () => r.range(-0.03, 0.03);
p.fill({ bounds: [0, HORIZON, W, 680], width: 5.5, length: 50, spacing: 0.5, angle: level, color: field, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 670, W, 800], width: 8, length: 90, spacing: 0.5, angle: level, color: field, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, 790, W, H], width: 12, length: 140, spacing: 0.5, angle: level, color: field, stroke: { ...line, opacity: 0.96 } });
p.fill({ bounds: [0, HORIZON, W, H], width: 5.5, length: 44, spacing: 1.0, overlap: 0.7, angle: level, color: (x, y) => field(x + r.range(-10, 10), y + r.range(-2, 2)), stroke: { ...line, opacity: 0.8 } });

// The river, which shows the light.
{ const river = [[-20, 664], [200, 652], [400, 660], [560, 646], [640, 630], [680, 616]];
  for (let i = 0; i < river.length - 1; i++) { const [x0, y0] = river[i], [x1, y1] = river[i + 1], w = clamp((y0 - HORIZON) * 0.2, 5, 16); p.tryStroke({ ...line, color: mix('#5c7c9c', '#e8f6ff', lit((x0 + x1) / 2, y0, 380)), width: w, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2 + r.range(-2, 2)], [x1, y1]] }); } }

// Trees and farms on the plain, far ones first. Each is a dark shape with its shade, which lies straight away from the light.
const things = [];
for (let k = 0; k < 70; k++) { const y = HORIZON + 12 + Math.pow(r(), 1.6) * 150, x = r.range(-20, W + 20); if (Math.abs(x - COL.x) < 70 + (y - HORIZON) * 0.6) continue; things.push([x, y, r() < 0.16]); }
things.sort((a, b) => a[1] - b[1]);
for (const [x, y, farm] of things) {
  const s = 240 / depth(y) / 40, dx = x - COL.x, dy = (y - HORIZON + 30) * 2.2, l = Math.hypot(dx, dy), h = Math.max(13, (farm ? 5 : 8) * s), w = Math.max(7, (farm ? 8 : 6.5) * s);
  p.tryStroke({ brush: 'soft', color: '#04060a', width: Math.max(8.4, w * 1.1), opacity: 0.4, taper: [0, 0.7], points: [[x, y], [x + dx / l * h * 1.5, y + dy / l * h * 0.8], [x + dx / l * h * 3, y + dy / l * h * 1.6]] });   // its shade
  if (farm) {                                                              // a farm: a low wall and a wide dark roof
    p.tryStroke({ ...line, cap: 'flat', color: '#1c1c22', width: Math.max(5, h * 0.4), points: [[x - w, y - h * 0.2], [x + w, y - h * 0.2]] });
    p.tryStroke({ ...line, cap: 'flat', color: '#0c0c12', width: Math.max(5, h * 0.44), points: [[x - w * 1.15, y - h * 0.6], [x + w * 1.15, y - h * 0.6]] });
  } else {                                                                 // a tree: one round dark head, low on the ground; it is too far to show its trunk
    const hw = clamp(w * 1.3, 7, 15); p.tryStroke({ ...line, color: mix('#060a08', '#101812', r()), width: hw, points: [[x - hw * 1.12, y - hw * 0.36], [x, y - hw * 0.5], [x + hw * 1.12, y - hw * 0.36]] });   // a stroke must be twice as long as it is wide, so the head is a low wide one
  }
}

p.save();
