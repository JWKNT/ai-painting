// Paint the whole picture, or from a given pass on: node paintings/undertale/run.js [from]
'use strict';
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const from = +(process.argv[2] || 1);
for (const f of fs.readdirSync(__dirname).filter((n) => /^\d\d-.*\.js$/.test(n)).sort()) {
  if (+f.slice(0, 2) >= from) execFileSync('node', [path.join(__dirname, f)], { stdio: 'inherit' });
}
