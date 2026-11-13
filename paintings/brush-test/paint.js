// Brush test sheet: every brush, top to bottom — round, soft, flat, bristle, dry, wash, blend —
// each making the same marks over three stripes of ground color, then two filled patches below.
'use strict';
const studio = require('../../lib/studio');
const { wave, ramp, mix, noise2 } = studio;

const p = studio.open(__dirname, { fresh: true, pass: 'ground', size: [1600, 1200], background: '#f1ebdd', title: 'Brush test' });

const names = ['round', 'soft', 'flat', 'bristle', 'dry', 'wash', 'blend'];
const colors = ['#1f3a5f', '#d9482b', '#2f6b4f', '#c98a1b', '#5b2a86', '#1c7c9c', null];
const rowY = (i) => 100 + i * 110;

// Ground: three vertical stripes that every row's long stroke will cross.
[['#1d2f4f', 470], ['#a4502a', 545], ['#f0d98a', 620]].forEach(([color, x]) => {
  p.stroke({ brush: 'flat', color, width: 46, points: [[x, 40], [x + 6, 420], [x, 815]] });
});
// Ground for the blend row: a fence of colored posts to smear through.
const posts = ['#d9482b', '#f0d98a', '#1c7c9c', '#2f6b4f', '#5b2a86', '#c98a1b'];
for (let x = 110, k = 0; x <= 1520; x += 58, k++) {
  if (x > 440 && x < 650) continue;
  p.line(x, rowY(6) - 38, x + 4, rowY(6) + 38, { brush: 'flat', color: posts[k % posts.length], width: 26 });
}

names.forEach((brush, i) => {
  p.next(brush);
  const y = rowY(i), color = colors[i];
  const hardness = studio.BRUSHES[brush].hardness;
  const thinnest = Math.ceil(800 / (1 + hardness)) / 100;   // the narrowest this brush is allowed to be

  // A long wavy stroke across the stripes.
  p.stroke({ brush, color, width: 40, points: wave(90, y, 880, y, 16, 1.5) });
  // Pressure: thin, full, thin, with tapered ends.
  p.stroke({
    brush, color, width: 34, taper: [0.25, 0.35],
    points: [[940, y + 14, 0.35], [1010, y - 10, 0.7], [1090, y - 16, 1], [1170, y - 4, 0.8], [1245, y + 16, 0.4]],
  });
  // The shortest marks the rules allow at three sizes.
  const dab = (x, width) => {
    const d = (Math.max(studio.RULES.minTravel, studio.RULES.travelPerWidth * width) + 0.3) / Math.SQRT2 / 2;
    p.line(x - d, y + d, x + d, y - d, { brush, color, width });
  };
  dab(1300, 22);
  dab(1350, Math.max(10, thinnest));
  dab(1385, thinnest);
  // The thinnest line.
  p.stroke({ brush, color, width: thinnest, points: wave(1410, y, 1530, y, 7, 1, 12) });
});

// Patch one: a field of bristle strokes following a flow, colored by a ramp.
p.next('flow patch');
const flow = noise2(7);
const sunset = ['#1b2a52', '#6a2c6e', '#c8443c', '#f08a2c', '#f6d36b'];
const box1 = (x, y) => x > 100 && x < 750 && y > 905 && y < 1135;
for (const [width, opacity] of [[30, 1], [16, 0.9]]) {
  p.fill({
    inside: box1, bounds: [100, 905, 750, 1135], width, length: width * 5,
    angle: (x, y) => (flow(x / 190, y / 190) - 0.5) * 3.2,
    color: (x, y) => ramp(sunset, (x - 100) / 650 + (flow(x / 60 + 9, y / 60) - 0.5) * 0.18),
    stroke: { brush: 'bristle', opacity },
  });
}

// Patch two: a soft gradient laid in with wide strokes, blended, then dry-brushed.
p.next('gradient patch');
const sky = ['#27406e', '#5f7fb0', '#e8b89a', '#f4dfb5'];
for (let k = 0; k < 9; k++) {
  const y = 915 + k * 26;
  p.line(870, y, 1500, y + (k % 2 ? 4 : -4), { brush: 'soft', color: ramp(sky, k / 8), width: 90, opacity: 0.85 });
}
for (let k = 0; k < 5; k++) {
  const y = 935 + k * 45;
  p.stroke({ brush: 'blend', width: 70, opacity: 0.7, points: wave(880, y, 1490, y, 10, 2) });
}
for (let k = 0; k < 4; k++) {
  const y = 1010 + k * 28;
  p.stroke({ brush: 'dry', color: mix('#fff7e6', '#f4dfb5', k / 4), width: 26, points: wave(900 + k * 30, y, 1380 + k * 30, y - 20, 8, 1.2) });
}

p.save();
