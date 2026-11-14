// Playback. Replays the recorded strokes through the same brush engine that painted them,
// moving the brush along each stroke so you watch the painting being made. It can also
// make an MP4 video of that playback, at the chosen length.
//
//   const player = PaintPlayer.mount(element, { data | src, autoplay, keys, name });
//   player.destroy();
//   PaintPlayer.makeVideo(data, { seconds, signal, onProgress })   // a Promise of an MP4 Blob
//
// The element holds the parts, each marked with data-role: frame, view (a canvas), tip,
// poster (optional image of the finished painting), play, seek (a range input), ticks,
// time, pass, count, swatch, speed (a select), download, status.
(function (root, factory) {
  root.PaintPlayer = factory(root.PaintEngine);
})(typeof globalThis !== 'undefined' ? globalThis : this, function (PE) {
  'use strict';

  const ICON_PLAY = 'M4 2.5v11l9.5-5.5z', ICON_PAUSE = 'M3.5 2.5h3.2v11H3.5zM9.3 2.5h3.2v11H9.3z';
  const LENGTHS = [['5 min', 300], ['2 min', 120], ['1 min', 60], ['30 sec', 30], ['15 sec', 15]];

  // The painting's own timeline, in seconds: a hand that sweeps a big brush quickly and places
  // a small one with care, lifting between strokes.
  const handSpeed = (width) => Math.max(260, Math.min(900, 220 + 11 * width));   // px per second
  const lift = (width) => (width < 12 ? 0.22 : 0.12);                            // seconds between strokes

  function timeline(strokes) {
    const n = strokes.length, t0 = new Float64Array(n + 1), dur = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      dur[i] = PE.measure(strokes[i]).length / handSpeed(strokes[i].width);
      t0[i + 1] = t0[i] + dur[i] + lift(strokes[i].width);
    }
    return { t0, dur, T: Math.max(t0[n], 0.001) };
  }

  const clockText = (s) => {
    s = Math.max(0, Math.round(s));
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  };
  const spanText = (s) => (s >= 90 ? Math.round(s / 60) + ' min' : Math.round(s) + ' sec');

  // ---- video
  // The video is made frame by frame with the browser's H.264 encoder and written as an MP4
  // file here, so every browser gives the same kind of file, and it takes less time than the
  // playback when the computer is fast enough.
  const FPS = 30, LEAD = 0.4, TAIL = 1.5, KEY_EVERY = 4 * FPS;
  const MAX_VIDEO = 300;   // seconds
  // High, Main and Baseline profiles at level 4.0, which holds 1600 × 1200 pixels at 30 frames a second.
  const CODECS = ['avc1.640028', 'avc1.4d0028', 'avc1.420028'];

  class VideoError extends Error {}

  // A pause that lets the page and the encoder work. A message is not slowed in a hidden tab, as a timer is.
  const waiting = [];
  let channel = null;
  const pause = () => new Promise((go) => {
    if (!channel && typeof MessageChannel !== 'undefined') {
      channel = new MessageChannel();
      channel.port1.onmessage = () => { const next = waiting.shift(); if (next) next(); };
    }
    if (channel) { waiting.push(go); channel.port2.postMessage(0); } else setTimeout(go, 0);
  });

  function ring(c, tip) {
    c.beginPath();
    c.arc(tip.x, tip.y, Math.max(3, tip.r), 0, 6.2832);
    c.lineWidth = 4;
    c.strokeStyle = 'rgba(0, 0, 0, .45)';
    c.stroke();
    c.lineWidth = 2;
    c.strokeStyle = 'rgba(255, 255, 255, .92)';
    c.stroke();
  }

  async function makeVideo(data, opts = {}) {
    const seconds = opts.seconds, signal = opts.signal, progress = opts.onProgress || (() => {});
    if (typeof VideoEncoder === 'undefined' || typeof VideoFrame === 'undefined') throw new VideoError('This browser cannot make an MP4 video.');
    const W0 = data.width, H0 = data.height, W = W0 & ~1, H = H0 & ~1;
    let config = null;
    for (const codec of CODECS) {
      const c = { codec, width: W, height: H, bitrate: Math.round(W * H * FPS * 0.1), framerate: FPS, avc: { format: 'avc' } };
      try { if ((await VideoEncoder.isConfigSupported(c)).supported) { config = c; break; } } catch (e) { /* try the next profile */ }
    }
    if (!config) throw new VideoError('This browser cannot make an MP4 video.');

    const samples = [];
    let description = null, failure = null;
    const encoder = new VideoEncoder({
      output(chunk, meta) {
        const bytes = new Uint8Array(chunk.byteLength);
        chunk.copyTo(bytes);
        samples.push({ bytes, time: chunk.timestamp, key: chunk.type === 'key' });
        const d = meta && meta.decoderConfig && meta.decoderConfig.description;
        if (d && !description) description = new Uint8Array(ArrayBuffer.isView(d) ? d.buffer.slice(d.byteOffset, d.byteOffset + d.byteLength) : d.slice(0));
      },
      error(e) { failure = e; },
    });
    encoder.configure(config);

    const strokes = data.strokes, N = strokes.length, { t0, dur, T } = timeline(strokes);
    const eng = new PE.Engine(W0, H0, data.background, data.brushes);
    const base = document.createElement('canvas');
    base.width = W0;
    base.height = H0;
    const bctx = base.getContext('2d');
    const image = bctx.createImageData(W0, H0), px = image.data;
    eng.blit(px, 0, 0, W0, H0);
    bctx.putImageData(image, 0, 0);
    const out = document.createElement('canvas');
    out.width = W;
    out.height = H;
    const octx = out.getContext('2d', { alpha: false });

    let idx = 0, run = null, x0 = W0, y0 = H0, x1 = 0, y1 = 0;
    const mark = (r) => {
      if (r.x0 < x0) x0 = r.x0;
      if (r.y0 < y0) y0 = r.y0;
      if (r.x1 > x1) x1 = r.x1;
      if (r.y1 > y1) y1 = r.y1;
    };
    // Paint up to the given place on the painting's timeline.
    function paintTo(clock) {
      while (idx < N) {
        if (!run) {
          if (clock < t0[idx]) return;
          run = eng.begin(strokes[idx]);
        }
        const f = dur[idx] > 0 ? (clock - t0[idx]) / dur[idx] : 1;
        if (f < 1) {
          const rect = run.advance(f * run.total);
          if (rect) { eng.preview(run, rect, px); mark(rect); }
          return;
        }
        const box = eng.commit(run);
        if (box) { eng.blit(px, box.x0, box.y0, box.x1, box.y1); mark(box); }
        run = null;
        idx++;
      }
    }

    // A moment on the blank canvas, the playback, then a moment on the finished painting.
    const lead = Math.round(LEAD * FPS), body = Math.max(1, Math.round(seconds * FPS)), total = lead + body + Math.round(TAIL * FPS);
    let slice = performance.now();
    try {
      for (let f = 0; f < total; f++) {
        if (signal && signal.aborted) throw new DOMException('The video was cancelled.', 'AbortError');
        if (failure) throw failure;
        if (f >= lead) paintTo(Math.min(T, (f - lead + 1) / body * T));
        if (x1 > x0 && y1 > y0) {
          bctx.putImageData(image, 0, 0, x0, y0, x1 - x0, y1 - y0);
          x0 = W0; y0 = H0; x1 = 0; y1 = 0;
        }
        octx.drawImage(base, 0, 0);
        if (run && !run.finished) ring(octx, run.tip());
        const frame = new VideoFrame(out, { timestamp: Math.round(f * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
        encoder.encode(frame, { keyFrame: f % KEY_EVERY === 0 });
        frame.close();
        while (encoder.encodeQueueSize > 6 && !failure) await pause();
        if (performance.now() - slice > 30) {
          progress(f / total);
          await pause();
          slice = performance.now();
        }
      }
      await encoder.flush();
    } finally {
      if (encoder.state !== 'closed') encoder.close();
    }
    if (failure) throw failure;
    if (!description || !samples.length) throw new VideoError('This browser cannot make an MP4 video.');
    progress(1);
    return new Blob(mp4(samples, description, W, H), { type: 'video/mp4' });
  }

  // An MP4 file with one H.264 track: the file type, the index of the samples, then the samples.
  // The encoder gives the samples in decoding order, each with the time at which it shows.
  function mp4(samples, avcC, width, height) {
    const n = samples.length, unit = 1000, scale = FPS * unit;
    const shows = samples.map((s) => Math.round(s.time * FPS / 1e6) * unit);
    const order = shows.slice().sort((a, b) => a - b);
    let delay = 0;   // frames that the decoder holds back when the encoder uses B-frames
    for (let i = 0; i < n; i++) delay = Math.max(delay, order[i] - shows[i]);
    const span = order[n - 1] + unit, ms = Math.round(span / scale * 1000);

    const u16 = (v) => [(v >> 8) & 255, v & 255];
    const u32 = (v) => [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255];
    const ascii = (text) => Array.from(text, (c) => c.charCodeAt(0));
    const box = (type, ...parts) => {
      let body = [];
      for (const p of parts) body = body.concat(Array.from(p));
      return u32(body.length + 8).concat(ascii(type), body);
    };
    const matrix = [0x00010000, 0, 0, 0, 0x00010000, 0, 0, 0, 0x40000000].flatMap(u32);
    const runs = (values) => {   // [count, value] pairs of equal neighbors
      const out = [];
      for (const v of values) {
        if (out.length && out[out.length - 1][1] === v) out[out.length - 1][0]++;
        else out.push([1, v]);
      }
      return out;
    };

    const steps = order.map((t, i) => (i < n - 1 ? order[i + 1] - t : unit));
    const offsets = shows.map((t, i) => t + delay - order[i]);
    const keys = [];
    samples.forEach((s, i) => { if (s.key) keys.push(i + 1); });
    const stts = runs(steps), ctts = runs(offsets);

    function moov(offset) {
      const table = [
        box('stsd', u32(0), u32(1), box('avc1', [0, 0, 0, 0, 0, 0], u16(1), u16(0), u16(0), u32(0), u32(0), u32(0),
          u16(width), u16(height), u32(0x00480000), u32(0x00480000), u32(0), u16(1), new Array(32).fill(0), u16(0x18), u16(0xffff),
          box('avcC', avcC))),
        box('stts', u32(0), u32(stts.length), stts.flatMap(([c, v]) => u32(c).concat(u32(v)))),
      ];
      if (delay || ctts.length > 1 || ctts[0][1]) table.push(box('ctts', u32(0), u32(ctts.length), ctts.flatMap(([c, v]) => u32(c).concat(u32(v)))));
      if (keys.length < n) table.push(box('stss', u32(0), u32(keys.length), keys.flatMap(u32)));
      table.push(
        box('stsc', u32(0), u32(1), u32(1), u32(n), u32(1)),
        box('stsz', u32(0), u32(0), u32(n), samples.flatMap((s) => u32(s.bytes.length))),
        box('stco', u32(0), u32(1), u32(offset)));
      const track = [
        box('tkhd', u32(3), u32(0), u32(0), u32(1), u32(0), u32(ms), u32(0), u32(0), u16(0), u16(0), u16(0), u16(0), matrix, u32(width * 65536), u32(height * 65536)),
      ];
      // The first frame shows at once, also when the decoder holds frames back.
      if (delay) track.push(box('edts', box('elst', u32(0), u32(1), u32(ms), u32(delay), u16(1), u16(0))));
      track.push(box('mdia',
        box('mdhd', u32(0), u32(0), u32(0), u32(scale), u32(span), u16(0x55c4), u16(0)),
        box('hdlr', u32(0), u32(0), ascii('vide'), u32(0), u32(0), u32(0), ascii('VideoHandler'), [0]),
        box('minf',
          box('vmhd', u32(1), u16(0), u16(0), u16(0), u16(0)),
          box('dinf', box('dref', u32(0), u32(1), box('url ', u32(1)))),
          box('stbl', ...table))));
      return box('moov',
        box('mvhd', u32(0), u32(0), u32(0), u32(1000), u32(ms), u32(0x00010000), u16(0x0100), u16(0), u32(0), u32(0), matrix, new Array(24).fill(0), u32(2)),
        box('trak', ...track));
    }

    const ftyp = box('ftyp', ascii('isom'), u32(512), ascii('isom'), ascii('iso2'), ascii('avc1'), ascii('mp41'));
    const size = samples.reduce((sum, s) => sum + s.bytes.length, 0);
    const index = moov(ftyp.length + moov(0).length + 8);
    return [new Uint8Array(ftyp), new Uint8Array(index), new Uint8Array(u32(size + 8).concat(ascii('mdat')))].concat(samples.map((s) => s.bytes));
  }

  function download(blob, file) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
  }

  function mount(el, opts = {}) {
    const $ = (role) => el.querySelector('[data-role="' + role + '"]');
    const frameEl = $('frame'), view = $('view'), tipEl = $('tip'), posterEl = $('poster');
    const playEl = $('play'), iconEl = $('icon'), playText = $('play-text'), seekEl = $('seek'), ticksEl = $('ticks');
    const swatchEl = $('swatch'), passEl = $('pass'), countEl = $('count'), timeEl = $('time'), speedEl = $('speed');
    const saveEl = $('download'), statusEl = $('status');
    const saveLabel = saveEl ? saveEl.textContent : '';
    const ctx = view.getContext('2d');

    let data = null, strokes = [], N = 0, W = 0, H = 0, t0 = null, dur = null, T = 1;
    let eng = null, image = null, px = null;

    // ---- playback state
    let idx = 0;            // stroke being painted, or the next one
    let run = null;         // that stroke, while in progress
    let clock = 0;          // where playback should be on the timeline
    let rate = 1;           // timeline seconds per real second
    let playing = false;
    let seeking = false;    // catching up to a place the viewer jumped to
    let scrubbing = false;  // the viewer is dragging the timeline
    let pendingSeek = null;
    let poster = false;     // the finished painting is showing and nothing has been played yet
    let destroyed = false;

    // Snapshots of the canvas every so many strokes, so the timeline can be dragged backward.
    let every = 40;
    const keys = new Map();

    let dx0 = 0, dy0 = 0, dx1 = 0, dy1 = 0;
    const clean = () => { dx0 = W; dy0 = H; dx1 = 0; dy1 = 0; };
    function mark(r) {
      if (r.x0 < dx0) dx0 = r.x0;
      if (r.y0 < dy0) dy0 = r.y0;
      if (r.x1 > dx1) dx1 = r.x1;
      if (r.y1 > dy1) dy1 = r.y1;
    }
    function flush() {
      if (dx1 > dx0 && dy1 > dy0) ctx.putImageData(image, 0, 0, dx0, dy0, dx1 - dx0, dy1 - dy0);
      clean();
    }

    function ensureEngine() {
      if (eng) return;
      eng = new PE.Engine(W, H, data.background, data.brushes);
      image = ctx.createImageData(W, H);
      px = image.data;
      eng.blit(px, 0, 0, W, H);
      ctx.putImageData(image, 0, 0);
      keys.set(0, eng.snapshot());
      clean();
    }

    function leavePoster() {
      if (!poster) return;
      poster = false;
      ensureEngine();
      posterEl.hidden = true;
      clock = 0;
    }

    // Where the painting actually is on the timeline.
    function position() {
      if (run) return t0[idx] + dur[idx] * (run.done / (run.M - 1));
      return idx > 0 ? t0[idx - 1] + dur[idx - 1] : 0;
    }

    function strokeAt(t) {
      let lo = 0, hi = N;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        if (t0[mid] <= t) lo = mid; else hi = mid - 1;
      }
      return lo;
    }

    function keyBefore(i) {
      for (let k = Math.floor(i / every) * every; k > 0; k -= every) if (keys.has(k)) return k;
      return 0;
    }

    function seekNow(t) {
      const target = strokeAt(t);
      let from = -1;
      if (t < position()) from = keyBefore(target);
      else {
        const k = keyBefore(target);
        if (k > idx) from = k;
      }
      if (from >= 0) {
        eng.restore(keys.get(from), from);
        eng.blit(px, 0, 0, W, H);
        mark({ x0: 0, y0: 0, x1: W, y1: H });
        idx = from;
        run = null;
      }
      clock = t;
      seeking = true;
    }

    // Paint until the canvas has caught up with the clock, or the time budget runs out.
    function work(budget) {
      const started = performance.now();
      for (;;) {
        if (idx >= N) return false;
        if (!run) {
          if (clock < t0[idx]) return false;
          if (idx % every === 0 && !keys.has(idx)) keys.set(idx, eng.snapshot());
          run = eng.begin(strokes[idx]);
        }
        const f = dur[idx] > 0 ? (clock - t0[idx]) / dur[idx] : 1;
        if (f < 1) {
          const rect = run.advance(f * run.total);
          if (rect) { eng.preview(run, rect, px); mark(rect); }
          return false;
        }
        const box = eng.commit(run);
        if (box) { eng.blit(px, box.x0, box.y0, box.x1, box.y1); mark(box); }
        run = null;
        idx++;
        if (performance.now() - started > budget) return true;
      }
    }

    // ---- the recording arrives
    function load(d) {
      data = d;
      strokes = d.strokes;
      N = strokes.length;
      W = d.width;
      H = d.height;
      ({ t0, dur, T } = timeline(strokes));
      every = Math.max(40, Math.ceil(N / 24));
      el.style.setProperty('--ar', String(W / H));
      view.width = W;
      view.height = H;

      const lengths = [['Real time', T]].concat(LENGTHS.filter(([, secs]) => secs < T));
      speedEl.textContent = '';
      for (const [label, secs] of lengths) {
        const o = document.createElement('option');
        o.value = String(secs);
        o.textContent = label;
        speedEl.appendChild(o);
      }
      let saved = null;
      try { saved = localStorage.getItem('ai-painting-length'); } catch (e) { /* storage unavailable */ }
      const preferred = lengths.find(([label]) => label === saved) || lengths.find(([label]) => label === '1 min') || lengths[0];
      speedEl.value = String(preferred[1]);
      rate = T / +speedEl.value;
      refreshSelect();

      if (ticksEl) {
        ticksEl.textContent = '';
        for (const p of d.passes) {
          if (p.start <= 0 || p.start >= N) continue;
          const tick = document.createElement('i');
          tick.style.left = (t0[p.start] / T * 100) + '%';
          ticksEl.appendChild(tick);
        }
      }

      poster = !!posterEl && !opts.autoplay;
      if (!poster) {
        if (posterEl) posterEl.hidden = true;
        ensureEngine();
      }
      clock = poster ? T : 0;
      playing = !!opts.autoplay;
      lock(false);
      updateSave();
    }

    // The shared jehlp.net select enhancement mirrors a native select; tell it when ours changes.
    function refreshSelect() {
      if (window.JehlpUI && speedEl.hasAttribute('data-ui-select')) window.JehlpUI.enhance(speedEl);
    }

    function lock(on) {
      for (const c of [playEl, seekEl, speedEl]) if (c) c.disabled = on;
      refreshSelect();
    }

    const say = (text) => { if (statusEl) statusEl.textContent = text; };

    // ---- controls
    function toggle() {
      if (!data) return;
      if (poster) {
        leavePoster();
        pendingSeek = 0;
        playing = true;
        return;
      }
      if (!playing && clock >= T) pendingSeek = 0;
      playing = !playing;
    }
    playEl.addEventListener('click', toggle);
    frameEl.addEventListener('click', toggle);

    speedEl.addEventListener('change', () => {
      rate = T / +speedEl.value;
      updateSave();
      try { localStorage.setItem('ai-painting-length', speedEl.options[speedEl.selectedIndex].textContent); } catch (e) { /* storage unavailable */ }
    });

    seekEl.addEventListener('input', () => {
      if (!data) return;
      leavePoster();
      pendingSeek = seekEl.value / 1000 * T;
    });
    seekEl.addEventListener('pointerdown', () => { scrubbing = true; });
    for (const type of ['pointerup', 'pointercancel', 'change', 'blur']) seekEl.addEventListener(type, () => { scrubbing = false; });

    function onKey(ev) {
      if (!data || ev.metaKey || ev.ctrlKey || ev.altKey) return;
      if (ev.target instanceof Element && ev.target.closest('select, input, button, a')) return;
      const at = pendingSeek != null ? pendingSeek : poster ? T : clock;
      if (ev.key === ' ' || ev.key === 'k') toggle();
      else if (ev.key === 'ArrowRight') { leavePoster(); pendingSeek = Math.min(T, at + T / 40); }
      else if (ev.key === 'ArrowLeft') { leavePoster(); pendingSeek = Math.max(0, at - T / 40); }
      else if (ev.key === 'Home') { leavePoster(); pendingSeek = 0; }
      else if (ev.key === 'End') { leavePoster(); pendingSeek = T; }
      else return;
      ev.preventDefault();
    }
    if (opts.keys) document.addEventListener('keydown', onKey);

    // ---- video: an MP4 of the playback at the chosen length
    let making = null;   // the AbortController of a video being made
    function updateSave() {
      if (!saveEl || !data) return;
      const tooLong = +speedEl.value > MAX_VIDEO;
      saveEl.disabled = tooLong && !making;
      saveEl.title = tooLong ? 'A video can be 5 minutes at most.' : '';
    }

    if (saveEl) {
      saveEl.addEventListener('click', async () => {
        if (!data) return;
        if (making) { making.abort(); return; }
        const seconds = +speedEl.value, label = speedEl.options[speedEl.selectedIndex].textContent;
        const file = (opts.name || 'painting') + '-' + label.toLowerCase().replace(/\s+/g, '-') + '.mp4';
        making = new AbortController();
        saveEl.textContent = 'Cancel';
        speedEl.disabled = true;
        refreshSelect();
        say('Making the video: 0%');
        try {
          const blob = await makeVideo(data, { seconds, signal: making.signal, onProgress: (f) => say('Making the video: ' + Math.floor(f * 100) + '%') });
          if (destroyed) return;
          download(blob, file);
          say('Saved ' + file + '.');
        } catch (e) {
          say(e.name === 'AbortError' ? '' : e instanceof VideoError ? e.message : 'The video could not be made.');
        } finally {
          making = null;
          if (!destroyed) {
            saveEl.textContent = saveLabel;
            speedEl.disabled = false;
            refreshSelect();
            updateSave();
          }
        }
      });
    }

    // ---- what the controls show
    let scale = 1;
    const measure = () => { scale = W ? frameEl.clientWidth / W : 1; };
    const observer = new ResizeObserver(measure);
    observer.observe(frameEl);

    const shown = {};
    function show(target, key, value, apply) {
      if (!target || shown[key] === value) return;
      shown[key] = value;
      apply(target, value);
    }
    const setText = (target, v) => { target.textContent = v; };

    function paintUI() {
      const at = poster ? T : clock;
      const frac = Math.max(0, Math.min(1, at / T));
      if (!scrubbing) show(seekEl, 'seek', String(Math.round(frac * 1000)), (t, v) => { t.value = v; });
      show(seekEl, 'pos', (frac * 100).toFixed(2) + '%', (t, v) => t.style.setProperty('--pos', v));
      show(seekEl, 'valuetext', clockText(at / rate), (t, v) => t.setAttribute('aria-valuetext', v));
      show(playEl, 'label', playing ? 'Pause' : 'Play', (t, v) => { t.setAttribute('aria-label', v); if (playText) playText.textContent = v; });
      show(iconEl, 'icon', playing ? ICON_PAUSE : ICON_PLAY, (t, v) => t.setAttribute('d', v));
      show(timeEl, 'time', clockText(at / rate) + ' / ' + clockText(T / rate), setText);
      const done = poster ? N : idx;
      show(countEl, 'count', Math.min(N, done + (run ? 1 : 0)).toLocaleString() + ' / ' + N.toLocaleString(), setText);
      if (N) {
        const i = Math.min(done, N - 1);
        let pass = data.passes[0];
        for (const p of data.passes) if (p.start <= i) pass = p;
        show(passEl, 'pass', pass.name, setText);
        const s = strokes[i], smear = s.mix === 1 || (s.mix == null && data.brushes[s.brush].mix === 1);
        show(swatchEl, 'swatch', smear ? 'transparent' : s.color, (t, v) => { t.style.background = v; });
      }
      if (tipEl) {
        if (run && !run.finished) {
          const tip = run.tip(), d = Math.max(4, tip.r * 2 * scale);
          tipEl.style.width = tipEl.style.height = d + 'px';
          tipEl.style.transform = `translate(${tip.x * scale - d / 2}px, ${tip.y * scale - d / 2}px)`;
          show(tipEl, 'tip', '1', (t, v) => { t.style.opacity = v; });
        } else {
          show(tipEl, 'tip', '0', (t, v) => { t.style.opacity = v; });
        }
      }
    }

    // ---- the loop
    let prev = performance.now();
    function frame(now) {
      if (destroyed) return;
      const dt = Math.min(0.1, (now - prev) / 1000);
      prev = now;
      if (data) {
        if (pendingSeek != null) {
          ensureEngine();
          seekNow(pendingSeek);
          pendingSeek = null;
        }
        if (eng) {
          if (playing && !seeking && !scrubbing) clock = Math.min(T, clock + dt * rate);
          // When frames come slowly anyway, each one can afford to paint for longer.
          const behind = work(seeking ? 28 : Math.max(12, Math.min(48, dt * 500)));
          if (!behind) seeking = false;
          else if (!seeking) clock = Math.min(clock, position());   // can't keep up: slow down rather than queue
          if (playing && clock >= T && idx >= N) playing = false;
          flush();
        }
        paintUI();
      }
      requestAnimationFrame(frame);
    }

    lock(true);
    if (opts.data) {
      load(opts.data);
      measure();
    } else {
      fetch(opts.src).then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json();
      }).then((d) => { load(d); measure(); }, () => say('The recording of this painting did not load.'));
    }
    requestAnimationFrame(frame);

    return {
      destroy() {
        destroyed = true;
        if (making) making.abort();
        document.removeEventListener('keydown', onKey);
        observer.disconnect();
      },
    };
  }

  return { mount, timeline, makeVideo, MAX_VIDEO, mp4 };
});
