// Builds a painting's playback.html: one self-contained file holding the brush engine,
// the player and the stroke recording, so it opens with a double-click.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function serialize(data) {
  const { strokes, ...head } = data;
  const top = JSON.stringify(head);
  return top.slice(0, -1) + ',"strokes":[\n' + strokes.map((s) => JSON.stringify(s)).join(',\n') + '\n]}\n';
}

function buildPlayer(dir, data) {
  const parts = {
    '__TITLE__': String(data.title).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
    '__NAME__': path.basename(path.resolve(dir)).replace(/[^a-z0-9-]/gi, '-'),
    '__DATA__': serialize(data).replace(/</g, '\\u003c'),
    '/*__ENGINE__*/': fs.readFileSync(path.join(ROOT, 'engine/paint-engine.js'), 'utf8'),
    '/*__PLAYER__*/': fs.readFileSync(path.join(ROOT, 'player/player.js'), 'utf8'),
  };
  const template = fs.readFileSync(path.join(ROOT, 'player/player.html'), 'utf8');
  const html = template.replace(/__TITLE__|__NAME__|__DATA__|\/\*__ENGINE__\*\/|\/\*__PLAYER__\*\//g, (m) => parts[m]);
  const out = path.join(dir, 'playback.html');
  fs.writeFileSync(out, html);
  return out;
}

module.exports = { buildPlayer, serialize };
