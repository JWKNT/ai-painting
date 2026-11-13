#!/usr/bin/env node
// Render a recording to a PNG, from nothing.
//
//   node tools/render.js paintings/<name> [--upto N] [--crop x,y,w,h] [--scale 0.5] [--out file.png]
//
// --upto stops after N strokes. --crop and --scale are for looking closely or quickly.
'use strict';
const fs = require('fs');
const path = require('path');
const studio = require('../lib/studio');
const { encodePNG, resample } = require('../lib/png');

const args = process.argv.slice(2);
const target = args[0];
const opt = (name) => {
  const i = args.indexOf('--' + name);
  return i >= 0 ? args[i + 1] : null;
};
if (!target || target.startsWith('--')) {
  console.error('usage: node tools/render.js <painting folder or .json> [--upto N] [--crop x,y,w,h] [--scale s] [--out file.png]');
  process.exit(1);
}

const data = studio.load(target);
const upto = opt('upto') != null ? +opt('upto') : null;
const started = Date.now();
const eng = studio.render(data, upto);
let img = { width: data.width, height: data.height, rgb: eng.snapshot() };
const crop = opt('crop') ? opt('crop').split(',').map(Number) : null;
const scale = opt('scale') ? +opt('scale') : 1;
if (crop || scale !== 1) img = resample(img.width, img.height, img.rgb, crop, scale);

const dir = fs.statSync(target).isDirectory() ? target : path.dirname(target);
const out = opt('out') || path.join(dir, 'render.png');
fs.writeFileSync(out, encodePNG(img.width, img.height, img.rgb));
console.log(`${eng.count} strokes → ${out} (${img.width}×${img.height}) in ${((Date.now() - started) / 1000).toFixed(1)}s`);
