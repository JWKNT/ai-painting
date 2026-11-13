// Playback. Replays the recorded strokes through the same brush engine that painted them,
// moving the brush along each stroke so you watch the painting being made. It can also
// record that playback, at the chosen length, into a video file.
//
//   PaintPlayer.mount(element, { data | src, autoplay, keys, name })
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
  const VIDEO_TYPES = ['video/mp4;codecs=avc1.640028', 'video/mp4;codecs=avc1.4d0028', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];

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
    let rec = null;         // a video recording in progress

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
      if (!data || rec) return;
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
      try { localStorage.setItem('ai-painting-length', speedEl.options[speedEl.selectedIndex].textContent); } catch (e) { /* storage unavailable */ }
    });

    seekEl.addEventListener('input', () => {
      if (!data || rec) return;
      leavePoster();
      pendingSeek = seekEl.value / 1000 * T;
    });
    seekEl.addEventListener('pointerdown', () => { scrubbing = true; });
    for (const type of ['pointerup', 'pointercancel', 'change', 'blur']) seekEl.addEventListener(type, () => { scrubbing = false; });

    if (opts.keys) {
      document.addEventListener('keydown', (ev) => {
        if (!data || rec || ev.metaKey || ev.ctrlKey || ev.altKey) return;
        if (ev.target instanceof Element && ev.target.closest('select, input, button, a')) return;
        const at = pendingSeek != null ? pendingSeek : poster ? T : clock;
        if (ev.key === ' ' || ev.key === 'k') toggle();
        else if (ev.key === 'ArrowRight') { leavePoster(); pendingSeek = Math.min(T, at + T / 40); }
        else if (ev.key === 'ArrowLeft') { leavePoster(); pendingSeek = Math.max(0, at - T / 40); }
        else if (ev.key === 'Home') { leavePoster(); pendingSeek = 0; }
        else if (ev.key === 'End') { leavePoster(); pendingSeek = T; }
        else return;
        ev.preventDefault();
      });
    }

    // ---- video: play the painting from the start at the chosen length and record the canvas
    function videoType() {
      if (typeof MediaRecorder === 'undefined' || !HTMLCanvasElement.prototype.captureStream) return null;
      return VIDEO_TYPES.find((t) => MediaRecorder.isTypeSupported(t)) || null;
    }

    function startRecording() {
      const type = videoType();
      if (!type) { say('This browser cannot record video.'); return; }
      leavePoster();
      ensureEngine();

      // The recording has its own canvas: the painting, plus the ring of the brush.
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      canvas.setAttribute('aria-hidden', 'true');
      canvas.style.cssText = 'position:absolute;left:0;top:0;width:2px;height:2px;opacity:0;pointer-events:none';
      frameEl.appendChild(canvas);
      const stream = canvas.captureStream(30);
      let recorder;
      try {
        recorder = new MediaRecorder(stream, { mimeType: type, videoBitsPerSecond: 12000000 });
      } catch (e) {
        canvas.remove();
        say('This browser cannot record video.');
        return;
      }
      const length = speedEl.options[speedEl.selectedIndex].textContent;
      const file = (opts.name || 'painting') + '-' + length.toLowerCase().replace(/\s+/g, '-') + (type.startsWith('video/mp4') ? '.mp4' : '.webm');
      const chunks = [];
      recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) chunks.push(ev.data); };
      recorder.onerror = () => { if (rec) { rec.failed = true; stopRecording(); } };
      recorder.onstop = () => {
        const r = rec;
        rec = null;
        stream.getTracks().forEach((t) => t.stop());
        canvas.remove();
        playing = false;
        saveEl.textContent = saveLabel;
        lock(false);
        if (r.failed) { say('The recording stopped because of an error.'); return; }
        if (r.cancelled) { say(''); return; }
        const blob = new Blob(chunks, { type: type.split(';')[0] });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 60000);
        say('Saved ' + file + '.');
      };

      rec = { canvas, ctx: canvas.getContext('2d'), recorder, phase: 'lead', until: performance.now() + 400, cancelled: false, failed: false };
      pendingSeek = 0;
      playing = false;
      saveEl.textContent = 'Cancel';
      lock(true);
      say('The recording takes ' + spanText(+speedEl.value) + '. Keep this page open.');
      rec.ctx.fillStyle = data.background;
      rec.ctx.fillRect(0, 0, W, H);
      recorder.start();
    }

    function stopRecording() {
      if (rec && rec.recorder.state !== 'inactive') rec.recorder.stop();
    }

    // Hold on the blank canvas for a moment, play through, hold on the finished painting, stop.
    function stepRecording(now) {
      if (rec.phase === 'lead' && now >= rec.until) { rec.phase = 'run'; playing = true; }
      else if (rec.phase === 'run' && !playing && idx >= N) { rec.phase = 'tail'; rec.until = now + 1500; }
      else if (rec.phase === 'tail' && now >= rec.until) { rec.phase = 'stop'; stopRecording(); }
    }

    function recordFrame() {
      const c = rec.ctx;
      c.drawImage(view, 0, 0);
      if (run && !run.finished) {
        const tip = run.tip(), r = Math.max(3, tip.r);
        c.beginPath();
        c.arc(tip.x, tip.y, r, 0, 6.2832);
        c.lineWidth = 4;
        c.strokeStyle = 'rgba(0, 0, 0, .45)';
        c.stroke();
        c.lineWidth = 2;
        c.strokeStyle = 'rgba(255, 255, 255, .92)';
        c.stroke();
      }
    }

    if (saveEl) {
      saveEl.addEventListener('click', () => {
        if (!data) return;
        if (rec) { rec.cancelled = true; stopRecording(); } else startRecording();
      });
      // A hidden page gets no frames, so the recording waits until the page is back in view.
      document.addEventListener('visibilitychange', () => {
        if (!rec) return;
        if (document.hidden && rec.recorder.state === 'recording') rec.recorder.pause();
        else if (!document.hidden && rec.recorder.state === 'paused') rec.recorder.resume();
      });
    }

    // ---- what the controls show
    let scale = 1;
    const measure = () => { scale = W ? frameEl.clientWidth / W : 1; };
    new ResizeObserver(measure).observe(frameEl);

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
      const dt = Math.min(0.1, (now - prev) / 1000);
      prev = now;
      if (data) {
        if (pendingSeek != null) {
          ensureEngine();
          seekNow(pendingSeek);
          pendingSeek = null;
        }
        if (rec) stepRecording(now);
        if (eng) {
          if (playing && !seeking && !scrubbing) clock = Math.min(T, clock + dt * rate);
          // When frames come slowly anyway, each one can afford to paint for longer.
          const behind = work(seeking ? 28 : Math.max(12, Math.min(48, dt * 500)));
          if (!behind) seeking = false;
          else if (!seeking) clock = Math.min(clock, position());   // can't keep up: slow down rather than queue
          if (playing && clock >= T && idx >= N) playing = false;
          flush();
          if (rec) recordFrame();
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
  }

  return { mount, timeline };
});
