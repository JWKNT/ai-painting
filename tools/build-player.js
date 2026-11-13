#!/usr/bin/env node
// Rebuild a painting's playback.html from its recording, without repainting.
//
//   node tools/build-player.js paintings/<name>
'use strict';
const path = require('path');
const fs = require('fs');
const studio = require('../lib/studio');
const { buildPlayer } = require('../lib/build-player');

const target = process.argv[2];
if (!target) {
  console.error('usage: node tools/build-player.js <painting folder>');
  process.exit(1);
}
const dir = fs.statSync(target).isDirectory() ? target : path.dirname(target);
console.log(buildPlayer(dir, studio.load(dir)));
