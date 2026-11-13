#!/usr/bin/env node
// Check a recording against the rules, stroke by stroke, without trusting how it was made.
//
//   node tools/validate.js paintings/<name>
'use strict';
const studio = require('../lib/studio');
const PE = require('../engine/paint-engine.js');

const target = process.argv[2];
if (!target) {
  console.error('usage: node tools/validate.js <painting folder or .json>');
  process.exit(1);
}

const data = studio.load(target);
const R = PE.RULES;
const problems = [];
const byBrush = {};
let thinnest = Infinity, tightest = Infinity, travelled = 0;

if (Math.max(data.width, data.height) > R.maxSide) problems.push(`canvas is ${data.width}×${data.height}; long side limit is ${R.maxSide}px`);

data.strokes.forEach((s, i) => {
  try {
    const rec = PE.normalize(s, i, data.brushes);   // re-checks width at half strength, opacity, points
    if (JSON.stringify(rec) !== JSON.stringify(s)) problems.push(`stroke ${i}: record is not in normal form`);
    const P = PE.resolve(rec, data.brushes);
    const m = PE.measure(rec);
    if (m.span < m.required - 1e-9) problems.push(`stroke ${i}: spans ${m.span.toFixed(2)}px, needs ${m.required}px for a ${rec.width}px brush`);
    thinnest = Math.min(thinnest, rec.width * (1 + P.hardness) / 2);
    tightest = Math.min(tightest, m.span / m.required);
    travelled += m.length;
    byBrush[rec.brush] = (byBrush[rec.brush] || 0) + 1;
  } catch (err) {
    problems.push(err.message);
  }
});

console.log(`${data.title} — ${data.width}×${data.height}, ${data.strokes.length} strokes in ${data.passes.length} passes`);
console.log(`rules: width ≥ ${R.minWidth}px at half strength; travel ≥ max(${R.minTravel}px, ${R.travelPerWidth} × width)`);
if (data.strokes.length) {
  console.log(`thinnest brush used: ${thinnest.toFixed(2)}px · shortest stroke: ${tightest.toFixed(2)}× its required travel · total travel: ${Math.round(travelled).toLocaleString()}px`);
  console.log('brushes: ' + Object.entries(byBrush).map(([k, v]) => `${k} ${v}`).join(', '));
}
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.log('  ' + p);
  process.exit(1);
}
console.log('every stroke obeys the rules');
