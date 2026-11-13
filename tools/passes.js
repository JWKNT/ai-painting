#!/usr/bin/env node
// Count the strokes of each pass of a painting, and what part of the whole each pass is.
// Use it to see where the work went: the subject of a picture must not be a small part of it.
//
//   node tools/passes.js paintings/<name>
'use strict';
const studio = require('../lib/studio');

const target = process.argv[2];
if (!target) {
  console.error('usage: node tools/passes.js <painting folder or .json>');
  process.exit(1);
}
const data = studio.load(target), total = data.strokes.length;
data.passes.forEach((pass, i) => {
  const n = (data.passes[i + 1] ? data.passes[i + 1].start : total) - pass.start;
  console.log(`${String(n).padStart(7)}  ${String(Math.round(n / total * 100)).padStart(3)}%  ${pass.name}`);
});
console.log(`${String(total).padStart(7)}        total`);
