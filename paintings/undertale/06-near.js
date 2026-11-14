// What is near us. Echo flowers grow at each end of the ledge: each is a tall thin stem
// with one head of six blue petals, and the head is a lamp. It lights the grass and the
// wet rock round it. Small ones stand far off along the edge, dark against the water with
// only their heads bright. Then the rain: thin pale lines that fall straight down, at
// three distances; and the corners of the picture, a tone darker.
'use strict';
const { studio, open, W, H, cam, edgeY, GLOW, GLOW_DEEP } = require('./scene');
const { mix, clamp, glow } = studio;

const p = open('near');
const r = p.rng;
const line = { brush: 'bristle', mix: 0.06, dry: 0.02, rag: 0.12, cap: 'round' };

// A blade of the grass of the cavern: dark, thin, bent; `lit` puts the light of a flower on one side of it.
function blade(x, y, h, lean, lit, toRight) {
  const tip = [x + lean * h, y - h], mid = [x + lean * h * 0.3, y - h * 0.6];
  p.tryStroke({ ...line, color: mix('#04070f', '#0a1420', r()), width: r.range(4.8, 6.4), taper: [0, 0.85], points: [[x, y + 4], mid, tip] });
  if (lit > 0.1) p.tryStroke({ brush: 'round', color: mix(GLOW_DEEP, GLOW, lit), width: 4, opacity: 0.25 + 0.5 * lit, taper: [0.1, 0.8], points: [[x + (toRight ? 2.2 : -2.2), y], [mid[0] + (toRight ? 2.2 : -2.2), mid[1]], [tip[0] + (toRight ? 1.4 : -1.4), tip[1] + 3]] });
}
// An echo flower at a place of the ledge (X to the right, Z away), so tall, with its head turned a little.
function echo(X, Z, h, lean, turn) {
  const u = cam.unit(Z), [bx, by] = cam.at(X, 0, Z), [hx, hy] = cam.at(X + lean, h, Z), R = 0.16 * u;
  // its light on the rock under it, and in the air round its head
  p.stroke({ brush: 'soft', color: GLOW, width: Math.max(12, R * 1.4), opacity: 0.12, points: [[bx - R * 3.4, by + R * 0.2], [bx, by + R * 0.4], [bx + R * 3.4, by + R * 0.2]] });
  for (const [k, op] of [[4.6, 0.045], [2.8, 0.08], [1.7, 0.13]]) glow(p, hx, hy, R * k, GLOW, op, 6);
  // the grass at its foot takes the light on the side that is toward it
  for (let k = 0; k < 9; k++) { const gx = bx + r.range(-2.6, 2.6) * R; blade(gx, by + r.range(-2, 8), R * r.range(1.0, 2.4), r.range(-0.4, 0.4), clamp(1 - Math.abs(gx - bx) / (R * 3), 0, 1) * 0.8, gx < bx); }
  // its stem, and the small curled leaf half way up it
  const mid = [(bx + hx) / 2 + lean * u * 0.12, (by + hy) / 2];
  p.tryStroke({ ...line, color: '#06262c', width: Math.max(4.8, R * 0.16), points: [[bx, by + 3], mid, [hx, hy + R * 0.5]] });
  p.tryStroke({ brush: 'round', color: mix(GLOW_DEEP, GLOW, 0.6), width: 4, opacity: 0.6, taper: [0.5, 0], points: [[mid[0] + 2, mid[1]], [hx + 2, hy + R * 0.6]] });
  if (R > 13) { const s = lean > 0 ? -1 : 1; p.tryStroke({ ...line, color: '#0a3a40', width: Math.max(4.8, R * 0.2), taper: [0, 0.8], points: [mid, [mid[0] + s * R * 0.7, mid[1] - R * 0.3], [mid[0] + s * R * 0.95, mid[1] + R * 0.25]] }); }
  if (R < 13) { p.tryStroke({ brush: 'round', color: mix(GLOW, '#e8fffa', 0.6), width: Math.max(4, R * 0.6), taper: [0.4, 0.4], points: [[hx - Math.max(6.3, R), hy], [hx + Math.max(6.3, R), hy]] }); return; }   // far off: its head is one bright touch
  // its head: six petals round a pale heart. Each petal is two strokes that leave the heart and part a little, so it is broad;
  // it is pale near the heart and a deep bright blue at its end.
  for (let i = 0; i < 6; i++) {
    const a = turn + i * Math.PI / 3 + r.range(-0.08, 0.08), sq = 0.8;                             // the head is turned from us a little, so it is less high than wide
    for (const da of [-0.2, 0.2]) { const ex = hx + Math.cos(a + da) * R, ey = hy + Math.sin(a + da) * R * sq; p.tryStroke({ ...line, rag: 0.1, color: mix('#1898c8', '#40d4f0', r()), width: Math.max(4.8, R * 0.4), taper: [0.25, 0.35], points: [[hx + Math.cos(a) * R * 0.12, hy + Math.sin(a) * R * 0.12 * sq], [(hx + ex) / 2, (hy + ey) / 2], [ex, ey]] }); }
    const tx = hx + Math.cos(a) * R * 0.7, ty = hy + Math.sin(a) * R * 0.7 * sq; p.tryStroke({ brush: 'round', color: mix('#9cf0f8', '#f0fffc', r()), width: Math.max(4, R * 0.2), opacity: 0.85, taper: [0.1, 0.7], points: [[hx + Math.cos(a) * R * 0.14, hy + Math.sin(a) * R * 0.14 * sq], [tx, ty]] });   // the pale middle of the petal
  }
  glow(p, hx, hy, Math.max(9, R * 0.5), '#f4fffc', 0.4, 8);                                         // its heart
}

// ---------------------------------------------------------------- the small echo flowers far off, along the edge of the ledge
for (const [X, Z, h, lean] of [[-5.6, 9.1, 0.72, 0.05], [-4.3, 9.3, 0.6, -0.04], [-6.9, 8.6, 0.7, 0.02], [4.5, 9.2, 0.68, -0.05], [5.9, 8.9, 0.74, 0.04], [3.2, 9.4, 0.56, 0.03], [7.2, 8.4, 0.7, -0.03], [1.5, 9.35, 0.5, -0.02]]) echo(X, Z, h, lean, 0);

// ---------------------------------------------------------------- grass at the two ends of the ledge, dark
for (let k = 0; k < 150; k++) { const side = r() < 0.5 ? -1 : 1, x = side < 0 ? Math.pow(r(), 1.5) * 520 : W - Math.pow(r(), 1.5) * 480, y = r.range(880, H + 10), h = r.range(30, 90) * (0.6 + (y - 860) / 200); blade(x, y, h, r.range(-0.35, 0.35), 0, false); }

// ---------------------------------------------------------------- the echo flowers that are near us, the far ones first
const NEAR = [[-2.5, 5.9, 0.7, 0.05, 0.3], [-3.7, 5.6, 0.82, -0.06, 1.0], [2.95, 5.9, 0.74, -0.04, 0.6], [-3.0, 4.8, 0.78, 0.08, 0.1], [3.45, 4.9, 0.8, 0.05, 0.9], [-3.55, 4.25, 0.72, -0.05, 0.5], [2.65, 4.35, 0.7, -0.07, 0.2], [3.6, 4.05, 0.66, 0.04, 0.7], [-2.2, 4.0, 0.6, 0.06, 0.8]];
for (const f of NEAR.sort((a, b) => b[1] - a[1])) echo(...f);

// ---------------------------------------------------------------- small lights that drift near the flowers
for (const [x, y] of [[330, 800], [118, 742], [468, 866], [1300, 812], [1470, 756], [1180, 890], [240, 690], [1392, 700]]) { glow(p, x, y, 16, '#ffe890', 0.09, 6); glow(p, x, y, 9, '#fff4c0', 0.22, 8); }

// ---------------------------------------------------------------- the rain
// It falls straight down. Far off it is short and faint; near us each line is long. Where it strikes the ledge there is a small pale touch.
for (const [n, len, op, w, y0, y1] of [[120, [14, 26], 0.13, 4, 380, 760], [110, [30, 54], 0.2, 4, 300, 900], [46, [70, 130], 0.3, 4.6, 0, 940]]) for (let k = 0; k < n; k++) {
  const x = r.range(0, W), y = r.range(y0, y1), l = r.range(len[0], len[1]);
  if (x > 930 && x < 1250 && y > 230 && y < 560 && r() < 0.75) continue;                             // only a little of it over the castle
  p.tryStroke({ brush: 'round', color: mix('#7ca4c8', '#c8e4f4', r()), width: w, opacity: op * r.range(0.5, 1), taper: [0.6, 0.2], points: [[x, y], [x + r.range(-1, 1), y + l]] });
}
for (let k = 0; k < 60; k++) { const x = r.range(0, W), y = r.range(Math.max(800, edgeY(x) + 10), H - 4); p.tryStroke({ brush: 'round', color: '#a8d0e4', width: 4, opacity: r.range(0.2, 0.5), taper: [0.5, 0.5], points: [[x - 6.2, y], [x + 6.2, y]] }); }

// ---------------------------------------------------------------- the corners
for (const [x0, y0, x1, y1, w, op] of [[-60, -40, 480, -70, 200, 0.4], [W + 60, -40, 1120, -70, 200, 0.4], [-60, H + 50, 560, H + 60, 130, 0.3], [W + 60, H + 50, 1040, H + 60, 130, 0.3]]) p.stroke({ brush: 'soft', color: '#02030a', width: w, opacity: op, points: [[x0, y0], [(x0 + x1) / 2, (y0 + y1) / 2], [x1, y1]] });

p.save();
