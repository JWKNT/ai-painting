// The rules of the medium hold, and a recording alone reproduces its painting.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const studio = require('../lib/studio');
const PE = require('../engine/paint-engine.js');

const ROOT = path.join(__dirname, '..');
const hash = (eng) => crypto.createHash('sha1').update(Buffer.from(eng.canvas.buffer)).digest('hex');
const scratch = () => fs.mkdtempSync(path.join(os.tmpdir(), 'ai-painting-'));

test('a stroke that breaks a rule is refused and leaves nothing behind', () => {
  const p = studio.open(scratch(), { pass: 'a', size: [400, 300], background: '#ffffff' });
  p.line(20, 20, 200, 60, { color: '#224466', width: 12 });
  const before = hash(p.engine);
  assert.throws(() => p.line(0, 0, 100, 0, { color: '#000', width: 3 }), /minimum is 4px/);
  assert.throws(() => p.line(0, 0, 100, 0, { brush: 'soft', color: '#000', width: 6 }), /half strength/);
  assert.throws(() => p.line(50, 50, 55, 50, { color: '#000', width: 4 }), /must travel/);
  assert.throws(() => p.line(50, 50, 80, 50, { color: '#000', width: 20 }), /must travel/);
  assert.throws(() => p.stroke({ color: '#000', width: 20, points: [[50, 50], [60, 50], [50, 50], [60, 55], [50, 50], [60, 50]] }), /must travel/);
  assert.throws(() => p.line(0, 0, 100, 0, { width: 10 }), /color is required/);
  assert.throws(() => p.line(0, 0, 100, 0, { color: 'red', width: 10 }), /hex color/);
  assert.equal(p.count, 1);
  assert.equal(hash(p.engine), before);
  assert.throws(() => studio.open(scratch(), { pass: 'a', size: [2000, 1000] }), /maximum is 1600/);
});

test('passes append, the latest pass can be repainted, and history is not edited', () => {
  const dir = scratch();
  let p = studio.open(dir, { pass: 'a', size: [400, 300], background: '#f0f0f0' });
  for (let i = 0; i < 20; i++) p.line(20 + i * 15, 30, 60 + i * 15, 260, { brush: 'bristle', color: '#305070', width: 14 });
  p.save();
  const afterA = hash(p.engine);

  p = studio.open(dir, { pass: 'b' });
  assert.equal(hash(p.engine), afterA);
  p.line(30, 150, 370, 150, { brush: 'blend', width: 40 });
  p.save();
  const afterB = hash(p.engine);

  p = studio.open(dir, { pass: 'b' });
  assert.equal(hash(p.engine), afterA, 'repainting the latest pass starts from the pass before it');
  p.line(30, 150, 370, 150, { brush: 'blend', width: 40 });
  p.save();
  assert.equal(hash(p.engine), afterB);
  assert.equal(hash(studio.render(studio.load(dir))), afterB, 'the recording alone gives the same canvas');
  assert.throws(() => studio.open(dir, { pass: 'a' }), /append-only/);
});

for (const name of fs.readdirSync(path.join(ROOT, 'paintings'))) {
  const file = path.join(ROOT, 'paintings', name, 'painting.json');
  if (!fs.existsSync(file)) continue;
  test(`every stroke of ${name} obeys the rules`, () => {
    const data = studio.load(file);
    assert.ok(Math.max(data.width, data.height) <= PE.RULES.maxSide);
    data.strokes.forEach((s, i) => {
      const rec = PE.normalize(s, i, data.brushes);
      assert.deepEqual(rec, s, `stroke ${i} is in normal form`);
      const P = PE.resolve(rec, data.brushes), m = PE.measure(rec);
      assert.ok(rec.width * (1 + P.hardness) / 2 >= PE.RULES.minWidth - 1e-9, `stroke ${i} width`);
      assert.ok(m.span >= m.required - 1e-9, `stroke ${i} travel`);
    });
  });
}
