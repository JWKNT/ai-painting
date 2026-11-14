// The MP4 file that the player writes: its boxes, its index and where its samples are.
'use strict';
const test = require('node:test');
const assert = require('node:assert');
globalThis.PaintEngine = require('../engine/paint-engine.js');
require('../player/player.js');
const { mp4 } = globalThis.PaintPlayer;

function boxes(bytes, from = 0, to = bytes.length) {
  const out = [];
  for (let at = from; at < to;) {
    const size = (bytes[at] << 24 | bytes[at + 1] << 16 | bytes[at + 2] << 8 | bytes[at + 3]) >>> 0;
    if (size < 8 || at + size > to) break;
    out.push({ type: String.fromCharCode(...bytes.slice(at + 4, at + 8)), at, size });
    at += size;
  }
  return out;
}
const u32 = (b, at) => (b[at] << 24 | b[at + 1] << 16 | b[at + 2] << 8 | b[at + 3]) >>> 0;
const find = (b, path) => {
  let list = boxes(b), box = null;
  path.forEach((type, i) => {
    box = list.find((x) => x.type === type);
    assert.ok(box, path.join('/'));
    if (i < path.length - 1) list = boxes(b, box.at + 8 + (type === 'stsd' ? 8 : 0), box.at + box.size);
  });
  return box;
};

test('an MP4 file has the file type, the index and the samples, and the index finds each sample', () => {
  const samples = [0, 1, 2, 3, 4].map((i) => ({ bytes: new Uint8Array(10 + i).fill(i + 1), time: Math.round(i * 1e6 / 30), key: i === 0 }));
  const avcC = new Uint8Array([1, 100, 0, 40, 255, 225, 0, 0, 1, 0, 0]);
  const parts = mp4(samples, avcC, 1600, 1000);
  const bytes = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let at = 0;
  for (const p of parts) { bytes.set(p, at); at += p.length; }

  assert.deepEqual(boxes(bytes).map((b) => b.type), ['ftyp', 'moov', 'mdat']);
  const stco = find(bytes, ['moov', 'trak', 'mdia', 'minf', 'stbl', 'stco']);
  const first = u32(bytes, stco.at + 16);
  assert.deepEqual(Array.from(bytes.slice(first, first + 10)), new Array(10).fill(1), 'the offset points at the first sample');
  const stsz = find(bytes, ['moov', 'trak', 'mdia', 'minf', 'stbl', 'stsz']);
  assert.equal(u32(bytes, stsz.at + 16), 5);
  assert.deepEqual([0, 1, 2, 3, 4].map((i) => u32(bytes, stsz.at + 20 + 4 * i)), [10, 11, 12, 13, 14]);
  const stss = find(bytes, ['moov', 'trak', 'mdia', 'minf', 'stbl', 'stss']);
  assert.deepEqual([u32(bytes, stss.at + 12), u32(bytes, stss.at + 16)], [1, 1], 'only the first sample is a key frame');
  const avc1 = find(bytes, ['moov', 'trak', 'mdia', 'minf', 'stbl', 'stsd', 'avc1']);
  assert.deepEqual([bytes[avc1.at + 32] << 8 | bytes[avc1.at + 33], bytes[avc1.at + 34] << 8 | bytes[avc1.at + 35]], [1600, 1000]);
  const mdhd = find(bytes, ['moov', 'trak', 'mdia', 'mdhd']);
  assert.equal(u32(bytes, mdhd.at + 24) / u32(bytes, mdhd.at + 20), 5 / 30, 'five frames at 30 a second');
  assert.ok(!boxes(bytes, find(bytes, ['moov', 'trak']).at + 8).some((b) => b.type === 'edts'), 'no edit list without B-frames');
});

test('with B-frames, the file holds the decoding order and shows the first frame at once', () => {
  // Decoding order 0, 3, 1, 2: the encoder sends a later frame first.
  const order = [0, 3, 1, 2];
  const samples = order.map((i) => ({ bytes: new Uint8Array([i]), time: Math.round(i * 1e6 / 30), key: i === 0 }));
  const parts = mp4(samples, new Uint8Array([1, 100, 0, 40, 255]), 64, 64);
  const bytes = Uint8Array.from(parts.flatMap((p) => Array.from(p)));
  const ctts = find(bytes, ['moov', 'trak', 'mdia', 'minf', 'stbl', 'ctts']);
  assert.ok(ctts.size > 16);
  const elst = find(bytes, ['moov', 'trak', 'edts', 'elst']);
  assert.ok(u32(bytes, elst.at + 20) > 0, 'the edit list skips the delay of the decoder');
});
