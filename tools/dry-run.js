#!/usr/bin/env node
// Run a pass script without saving it, and list every stroke that breaks a rule instead of
// stopping at the first one.
//
//   node tools/dry-run.js paintings/<name>/<pass>.js
'use strict';
const path = require('path');
const studio = require('../lib/studio');

const file = path.resolve(process.argv[2] || '');
if (!process.argv[2]) {
  console.error('usage: node tools/dry-run.js <pass script>');
  process.exit(1);
}
const open = studio.open;
let broken = 0, painted = 0;
studio.open = (...args) => {
  const p = open(...args);
  const stroke = p.stroke.bind(p);
  p.stroke = (s) => {
    try {
      painted++;
      return stroke(s);
    } catch (err) {
      if (err.name !== 'RuleError') throw err;
      broken++;
      const at = (new Error().stack.split('\n').find((l) => l.includes(file)) || '').replace(/^.*?(\d+):\d+\)?$/, 'line $1');
      console.log(`${err.message.replace(/^stroke \d+: /, '')} (${at})`);
      return p;
    }
  };
  p.save = () => {
    console.log(broken ? `${broken} of ${painted} strokes break a rule` : `${painted} strokes, none breaks a rule`);
    return p;
  };
  return p;
};
require(file);
