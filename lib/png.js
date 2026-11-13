// Minimal PNG writer (8-bit RGB), so the project needs nothing installed.
'use strict';
const zlib = require('zlib');

const CRC = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC[n] = c >>> 0;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const len = Buffer.alloc(4), crc = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function paeth(a, b, c) {
  const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

// rgb: Uint8Array or Uint8ClampedArray of width * height * 3.
function encodePNG(width, height, rgb) {
  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  const tries = [0, 1, 2, 3, 4].map(() => Buffer.alloc(stride));
  for (let y = 0; y < height; y++) {
    const row = y * stride, prev = row - stride;
    let best = 0, bestSum = Infinity;
    for (let f = 0; f < 5; f++) {
      const out = tries[f];
      let sum = 0;
      for (let x = 0; x < stride; x++) {
        const cur = rgb[row + x];
        const a = x >= 3 ? rgb[row + x - 3] : 0;
        const b = y > 0 ? rgb[prev + x] : 0;
        const c = x >= 3 && y > 0 ? rgb[prev + x - 3] : 0;
        let v;
        if (f === 0) v = cur;
        else if (f === 1) v = cur - a;
        else if (f === 2) v = cur - b;
        else if (f === 3) v = cur - ((a + b) >> 1);
        else v = cur - paeth(a, b, c);
        v &= 0xff;
        out[x] = v;
        sum += v < 128 ? v : 256 - v;
      }
      if (sum < bestSum) { bestSum = sum; best = f; }
    }
    raw[y * (stride + 1)] = best;
    tries[best].copy(raw, y * (stride + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 2;   // color type: RGB
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 7 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// Crop and/or resize an RGB buffer (box filter down, nearest up). Returns { width, height, rgb }.
function resample(width, height, rgb, crop, scale) {
  const cx = crop ? crop[0] : 0, cy = crop ? crop[1] : 0;
  const cw = crop ? crop[2] : width, ch = crop ? crop[3] : height;
  const ow = Math.max(1, Math.round(cw * scale)), oh = Math.max(1, Math.round(ch * scale));
  const out = new Uint8ClampedArray(ow * oh * 3);
  for (let y = 0; y < oh; y++) {
    const sy0 = cy + y / scale, sy1 = cy + (y + 1) / scale;
    for (let x = 0; x < ow; x++) {
      const sx0 = cx + x / scale, sx1 = cx + (x + 1) / scale;
      let r = 0, g = 0, b = 0, n = 0;
      const yEnd = Math.max(Math.floor(sy0) + 1, Math.ceil(sy1)), xEnd = Math.max(Math.floor(sx0) + 1, Math.ceil(sx1));
      for (let sy = Math.floor(sy0); sy < yEnd; sy++) {
        if (sy < 0 || sy >= height) continue;
        for (let sx = Math.floor(sx0); sx < xEnd; sx++) {
          if (sx < 0 || sx >= width) continue;
          const j = (sy * width + sx) * 3;
          r += rgb[j]; g += rgb[j + 1]; b += rgb[j + 2]; n++;
        }
      }
      const o = (y * ow + x) * 3;
      if (n) { out[o] = r / n; out[o + 1] = g / n; out[o + 2] = b / n; }
    }
  }
  return { width: ow, height: oh, rgb: out };
}

module.exports = { encodePNG, resample };
