// The far land: a range half lost in the glare, the snow mountain with the first light on
// its left shoulder, mist, and the dark wooded hills at the edge of the plain.
'use strict';
const { studio, open, W, SUN, HORIZON, PEAK, peakLine, farLine, nearLine, glow, nA, nB, nC } = require('./scene');
const { mix, wave, clamp, smooth, glint } = studio;

const p = open('mountains');
const r = p.rng;
const slopeOf = (line) => (x) => Math.atan2(line(x + 10) - line(x - 10), 20);

// A ridge: strokes that run with its crest, a firm stroke along the crest itself.
function ridge(line, colorAt, bottom, width, x0 = -20, x1 = W + 20) {
  const slope = slopeOf(line);
  p.fill({
    inside: (x, y) => y > line(x) + width * 0.5 && y < bottom, bounds: [x0, 250, x1, bottom], width, length: width * 6, spacing: 0.5,
    angle: (x, y) => slope(x) * clamp(1 - (y - line(x)) / 120, 0.2, 1) + (nB(x / 70, y / 30) - 0.5) * 0.3, color: colorAt,
    stroke: { brush: 'bristle', opacity: 0.95, mix: 0.15, dry: 0.05 },
  });
  for (let x = x0; x < x1; x += 120) {
    const pts = [];
    for (let k = 0; k <= 7; k++) { const xx = x + k * 20; pts.push([xx, line(xx) + 6]); }
    p.stroke({ brush: 'bristle', color: colorAt(x + 70, line(x + 70) + 6), width: 12, mix: 0.1, dry: 0, rag: 0.05, points: pts });
  }
}

// The far range: violet with distance, burnt out to pale gold where the sun stands behind it.
ridge(farLine, (x, y) => mix(mix(mix('#62639c', '#7c70a6', nA(x / 70, y / 30)), '#d9a6a0', smooth(farLine(x), HORIZON + 10, y) * 0.6), '#ffdca8', clamp(glow(x, y, 300) * 1.15, 0, 0.92)), HORIZON + 14, 22);

// The snow mountain. Its strokes run down the slopes. The sun is behind its left shoulder:
// that side is rose and gold, the other still blue with night.
{
  const slope = slopeOf(peakLine);
  const side = (x) => clamp((PEAK.x - x) / 240, -1, 1);              // 1 far down the sunward side, -1 on the night side
  const rock = (x, y) => {
    const s = side(x);
    let c = mix(mix('#4e5694', '#5e62a0', nA(x / 40, y / 40)), mix('#a8789c', '#c88c98', nA(x / 50, y / 30)), clamp(0.5 + s * 0.75, 0, 1));
    c = mix(c, s > 0 ? '#f0b49c' : '#8a88b8', smooth(PEAK.y + 60, HORIZON + 10, y) * 0.8);     // haze toward its foot
    return mix(c, '#ffdca8', clamp(glow(x, y, 250) * 1.1, 0, 0.9));
  };
  const within = (m) => (x, y) => Math.abs(x - PEAK.x) < 620 && y > peakLine(x) + m && y < HORIZON + 12;
  p.fill({ inside: within(11), bounds: [PEAK.x - 620, PEAK.y, PEAK.x + 620, HORIZON + 12], width: 22, length: 130, spacing: 0.5, angle: (x, y) => slope(x) + (nB(x / 60, y / 40) - 0.5) * 0.25, color: rock, stroke: { brush: 'bristle', opacity: 0.96, mix: 0.15, dry: 0.05 } });
  for (const sgn of [-1, 1]) {                                     // the two outlines of the cone
    const pts = [];
    for (let d = 0; d <= 520; d += 26) pts.push([PEAK.x + sgn * d, peakLine(PEAK.x + sgn * d) + 6]);
    p.stroke({ brush: 'bristle', color: sgn < 0 ? '#e6a898' : '#565c9a', width: 12, mix: 0.25, dry: 0, points: pts });
  }
  // snow: from the top down, ending in tongues of different lengths
  const snowEdge = (x) => PEAK.y + 70 + 46 * nC(x / 26, 2) + Math.abs(x - PEAK.x) * 0.16;
  const snow = (x, y) => {
    const s = side(x), n = nA(x / 20, y / 20);
    return s > -0.04 ? mix(mix('#f2b4b0', '#ffd2b8', n), '#fff0d4', clamp(s * 1.3, 0, 1) * 0.8) : mix(mix('#8088c0', '#9aa0d0', n), '#b4b4dc', clamp(1 + s * 2, 0, 1) * 0.6);
  };
  p.fill({ inside: (x, y) => y > peakLine(x) + 7 && y < snowEdge(x), bounds: [PEAK.x - 300, PEAK.y, PEAK.x + 300, PEAK.y + 190], width: 14, length: 70, spacing: 0.5, angle: slope, color: snow, stroke: { brush: 'bristle', opacity: 0.97, mix: 0.1, dry: 0.1, rag: 0.3 } });
  for (let k = 0; k < 26; k++) {                                   // gullies of snow running further down
    const x = PEAK.x + r.range(-170, 170), y0 = snowEdge(x) - 14, len = r.range(30, 80), a = slope(x) + (x < PEAK.x ? Math.PI : 0);
    if (y0 < peakLine(x) + 16) continue;                           // only where the snow line is on the mountain
    p.tryStroke({ brush: 'bristle', color: snow(x, y0), width: r.range(5, 9), opacity: 0.9, taper: [0, 0.8], mix: 0.1, points: [[x, y0], [x + Math.cos(a) * len * 0.5, y0 + Math.abs(Math.sin(a)) * len * 0.5 + 4], [x + Math.cos(a) * len, y0 + Math.abs(Math.sin(a)) * len + 6]] });
  }
  // the first light, running down the sunward edge; a cold line on the other
  const edge = (sgn, to) => { const pts = []; for (let d = 0; d <= to; d += 15) pts.push([PEAK.x + sgn * d, peakLine(PEAK.x + sgn * d) + 5]); return pts; };
  p.stroke({ brush: 'bristle', color: '#fff2d6', width: 9, mix: 0.05, dry: 0, points: edge(-1, 165) });
  glint(p, edge(-1, 215).slice(11), '#ffe0b8', { width: 6, dash: 40, gap: 14, opacity: 0.85 });
  p.stroke({ brush: 'bristle', color: '#a8acd8', width: 8, mix: 0.1, dry: 0, opacity: 0.9, points: edge(1, 150) });
}

// The sun's edge of fire along the range, either side of where it rises.
for (const [x0, x1] of [[SUN.x - 170, SUN.x - 46], [SUN.x + 46, SUN.x + 120]]) {
  const pts = [];
  for (let x = x0; x <= x1; x += 12) pts.push([x, Math.min(farLine(x), peakLine(x)) + 3]);
  glint(p, pts, '#fff6d8', { width: 4.6, dash: 30, gap: 10, opacity: 0.9 });
}

// Mist lying in front of the mountains: gold under the sun, lilac away from it.
for (let k = 0; k < 18; k++) {
  const x = r.range(-100, W - 200), y = r.range(HORIZON - 40, HORIZON + 8), len = r.range(260, 520);
  p.stroke({ brush: 'soft', color: mix(mix('#b8a4c4', '#d8b0b4', r()), '#ffe2b0', clamp(glow(x + len / 2, y, 420) * 1.4, 0, 1)), width: r.range(30, 56), opacity: r.range(0.16, 0.32), points: wave(x, y, x + len, y + r.range(-6, 6), 4, 1, 7) });
}

// The near hills: wooded, dark against the mist, a little of the light caught in their tops.
const wood = (x, y) => mix(mix(mix('#343c5c', '#40486a', nA(x / 50, y / 20)), '#8a7a90', smooth(nearLine(x), HORIZON + 30, y) * 0.5), '#e0a888', clamp(glow(x, y, 300), 0, 0.7));
ridge(nearLine, wood, HORIZON + 34, 18);
for (let x = -10; x < W + 10; x += r.range(4, 9)) {                  // a ragged line of treetops along them
  if (nA(x / 90, 77) < 0.22) continue;
  const h = r.range(12.5, 17) * (0.8 + 0.5 * nA(x / 40, 5)), y = nearLine(x) + r.range(4, 11), lean = r.range(-3, 3);
  p.tryStroke({ brush: 'bristle', color: mix(mix('#2a3252', '#3a4264', r()), '#c89480', clamp(glow(x, y, 280), 0, 0.6)), width: r.range(4.6, 8), taper: [0, 1], mix: 0.1, dry: 0, rag: 0.3, points: [[x, y], [x + lean * 0.5, y - h * 0.5], [x + lean, y - h]] });
}

p.save();
