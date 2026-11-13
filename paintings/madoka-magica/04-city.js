// Mitakihara, under her. It is a city of tall towers of glass, and the storm has broken it:
// some of the towers lean, some have lost their tops, and the streets are full of water and
// fire. We see it dark against the fires, row behind row. Smoke goes up from it, and the
// storm takes the smoke round.
'use strict';
const { studio, open, W, H, WITCH, SKYLINE, far, aura, nA, nB } = require('./scene');
const { mix, clamp, wave } = studio;

const p = open('city');
const r = p.rng;
const flat = { brush: 'bristle', mix: 0.1, dry: 0.03, rag: 0.12, cap: 'flat' };

// The glow of the fires, behind the towers.
for (const [x, y, w, c] of [[200, 780, 150, '#e8742c'], [520, 800, 180, '#f08a34'], [860, 790, 150, '#e8742c'], [1180, 800, 190, '#f09038'], [1480, 780, 150, '#e06c2c'], [700, 760, 110, '#ffb050'], [1320, 770, 110, '#ffb050']]) {
  p.stroke({ brush: 'soft', color: c, width: w, opacity: 0.3, points: [[x - w * 1.02, y + 14], [x, y], [x + w * 1.02, y + 14]] });
}

// A fire: a wide soft glow, and in it tongues of flame of all sizes that lean with the wind, redder at their ends and yellow at their feet. No two fires are the same shape.
function blaze(x, y, s) {
  p.tryStroke({ brush: 'soft', color: '#ff8a34', width: 60 * s, opacity: 0.26, points: [[x - 64 * s, y + 4], [x, y - 12 * s], [x + 64 * s, y + 4]] });
  const n = 5 + Math.floor(r() * 6), lean = r.range(0.2, 0.7);
  for (let k = 0; k < n; k++) {
    const dx = r.gauss() * 20 * s, fh = r.range(16, 60) * s * (1 - Math.min(0.7, Math.abs(dx) / (50 * s))), w = Math.max(4.8, r.range(6, 13) * s);
    p.tryStroke({ brush: 'bristle', color: mix('#e8481c', '#ff9c2c', r()), width: w, opacity: 0.9, mix: 0.3, dry: 0.05, rag: 0.4, cap: 'round', taper: [0.1, 0.9], points: [[x + dx, y + 4], [x + dx + lean * fh * 0.4 + r.range(-4, 4), y - fh * 0.5], [x + dx + lean * fh + r.range(-6, 6), y - Math.max(13, fh)]] });
  }
  for (let k = 0; k < 3; k++) { const dx = r.gauss() * 10 * s, fh = r.range(13, 26) * s; p.tryStroke({ brush: 'bristle', color: mix('#ffc040', '#fff0a0', r()), width: Math.max(4.8, 6 * s), opacity: 0.9, mix: 0.3, dry: 0.05, rag: 0.3, cap: 'round', taper: [0.1, 0.8], points: [[x + dx, y + 4], [x + dx + lean * fh, y - Math.max(13, fh)]] }); }
}

// A tower: so wide, so high, with a lean. Its body is laid in upright; one side of it takes the light of the fires; it has rows of windows, most of them dark; its top may be broken.
function tower(x, foot, w, h, d, o = {}) {
  const lean = o.lean || 0, top = [x + lean * h, foot - h], body = far(mix('#0c1118', '#1c2630', r()), x, foot - h / 2, d), n = Math.max(1, Math.round(w / 14)), lw = Math.max(4.8, w / n * 1.25);
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n, bx = x - w / 2 + w * f, hk = h * (o.broken ? 1 - 0.3 * nB(bx / 9, x) : 1);
    p.tryStroke({ ...flat, color: mix(body, f > 0.6 ? far('#5c3428', bx, foot, d) : '#070a0e', Math.abs(f - 0.5) * 0.7), width: lw, points: [[bx, foot], [bx + lean * hk * 0.5, foot - hk * 0.5], [bx + lean * hk, foot - hk]] });
  }
  if (w >= 30 && h >= 80) {                                               // its windows: short level marks, a few of them lit
    for (let y = foot - 16; y > foot - h + 14; y -= Math.max(13, w * 0.24)) {
      if (r() < 0.35) continue;
      const lx = x + lean * (foot - y), lit = r() < 0.16;
      p.tryStroke({ ...flat, color: far(lit ? mix('#ff9c3c', '#ffe08c', r()) : '#2c3c48', lx, y, d * (lit ? 0.4 : 1)), width: 4.8, opacity: lit ? 0.9 : 0.5, points: [[lx - w * 0.36, y], [lx - w * 0.36 + Math.max(12.6, w * r.range(0.3, 0.72)), y]] });
    }
  }
  if (o.broken && h > 90 && r() < 0.5) { const bx = top[0] + r.range(-w / 3, w / 3); p.tryStroke({ color: body, width: 4, points: [[bx, top[1] + 12], [bx + r.range(-3, 3), top[1] - r.range(4, 12)]] }); }   // a rod of iron that stands out of its broken top
  // the cold light of the witch along the side of it that is toward her
  if (h > 110 && d < 0.5) { const s = WITCH.x > x ? 1 : -1; p.tryStroke({ color: far('#a8c8c8', x, foot - h, d * 0.5), width: 4, opacity: 0.5 * aura(x, foot - h, 900), points: [[x + s * w * 0.46 + lean * h * 0.3, foot - h * 0.3], [x + s * w * 0.46 + lean * h * 0.95, foot - h * 0.95]] }); }
}
// The far rows first, pale in the smoke; then the nearer, darker and higher.
const rows = [[SKYLINE - 14, 0.62, 40, 110, 22, 46, 6], [SKYLINE + 6, 0.42, 56, 150, 28, 60, 14], [SKYLINE + 40, 0.22, 70, 200, 36, 80, 30]];
rows.forEach(([foot, d, hLo, hHi, wLo, wHi, gap], row) => {
  for (let x = -30 + r.range(0, 30); x < W + 30;) {
    const w = r.range(wLo, wHi), h = r.range(hLo, hHi) * (0.75 + 0.5 * nA(x / 260, foot)) * (1 - 0.3 * Math.exp(-Math.pow((x - WITCH.x) / 260, 2)));   // lower under her, so that all of her is seen
    if (!(d < 0.3 && x > 60 && x < 600)) tower(x + w / 2, foot, w, h, d, { lean: r() < 0.22 ? r.range(-0.16, 0.16) : 0, broken: r() < 0.4 });   // the nearest row is open where she stands
    x += w + r.range(2, gap);
  }
  for (let k = 0; k < 6; k++) { const x = r.range(-100, W - 300), len = r.range(260, 520); p.stroke({ brush: 'soft', color: mix('#c86c34', '#5c3a34', r()), width: r.range(26, 44), opacity: 0.16, points: wave(x, foot - r.range(0, 40), x + len, foot - r.range(0, 40), 4, 1, 6) }); }   // smoke between the rows
  if (row < 2) for (let k = 0; k < 5; k++) blaze(r.range(40, W - 40), foot + r.range(-4, 10), r.range(0.8, 1.6) * (0.7 + 0.3 * row));                // fires between this row and the next, half hidden by the next
});

// The water in the streets: it holds the fires.
p.fill({ bounds: [0, SKYLINE + 40, W, H], width: 9, length: 90, spacing: 0.5, angle: () => r.range(-0.03, 0.03), color: (x, y) => { const f = nB(x / 70, y / 6); return mix(mix('#0c1218', '#241c20', nA(x / 200, y / 40)), f > 0.5 ? '#f08434' : '#06090c', Math.abs(f - 0.5) * (0.9 - 0.5 * clamp((y - 800) / 200, 0, 1))); }, stroke: { brush: 'bristle', opacity: 0.95, mix: 0.2, dry: 0.04, rag: 0.25 } });

// Fires in front of the nearest towers, on the water.
for (let k = 0; k < 7; k++) { const x = r.range(620, W - 40); blaze(x, SKYLINE + r.range(36, 52), r.range(1, 1.9)); }
// Smoke that goes up from the fires and is taken round by the storm.
for (const [x, y] of [[180, 770], [560, 760], [900, 770], [1240, 764], [1500, 760]]) {
  const a = Math.atan2(y - WITCH.y, x - WITCH.x) + Math.PI / 2 + 0.5;
  p.stroke({ brush: 'soft', color: '#241c20', width: r.range(40, 60), opacity: 0.3, taper: [0.2, 0], points: [[x, y], [x + Math.cos(a) * 70 + r.range(-20, 20), y - 120], [x + Math.cos(a) * 230, y - 210 + Math.sin(a) * 60], [x + Math.cos(a) * 420, y - 250 + Math.sin(a) * 160]] });
}

p.save();
