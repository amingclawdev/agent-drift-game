/* Game sounds, made in the browser with Web Audio: no sound files, so nothing to license.
   Browsers only allow sound after the player has clicked something, so nothing plays until
   unlock() is called from a click. The player's on/off choice is remembered per browser. */
(function () {
  const KEY = "drift-sound";
  let ctx = null, unlocked = false, on = true;
  try { on = localStorage.getItem(KEY) !== "off"; } catch (e) {}

  function audio() {
    if (!on || !unlocked) return null;
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // One shaped tone: quick attack, exponential decay, optional pitch slide.
  function tone(freq, dur, type, peak, slideTo, delay) {
    const c = audio(); if (!c) return;
    const t = c.currentTime + (delay || 0);
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.05);
  }
  // A short, filtered noise burst: the paper part of a rubber stamp.
  function thud(dur, peak, cutoff) {
    const c = audio(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    const s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    s.buffer = buf; f.type = "lowpass"; f.frequency.value = cutoff; g.gain.value = peak;
    s.connect(f).connect(g).connect(c.destination);
    s.start();
  }

  const SOUNDS = {
    click: () => tone(1400, 0.035, "triangle", 0.05),
    tick: () => tone(1900, 0.03, "sine", 0.05),
    stamp: () => { tone(120, 0.2, "sine", 0.4, 48); thud(0.09, 0.35, 1100); },
    count: () => { tone(660, 0.07, "triangle", 0.07); tone(990, 0.09, "triangle", 0.07, null, 0.07); },
    add: () => tone(880, 0.09, "triangle", 0.07, 1320),
    timeout: () => tone(230, 0.28, "sawtooth", 0.04, 170),
    reveal: () => [523.25, 659.25, 783.99].forEach((f, i) => tone(f, 0.4, "sine", 0.06, null, i * 0.11)),
  };

  window.DriftSfx = {
    play(name) { if (SOUNDS[name]) SOUNDS[name](); },
    unlock() { unlocked = true; audio(); },
    get on() { return on; },
    set(value) {
      on = Boolean(value);
      try { localStorage.setItem(KEY, on ? "on" : "off"); } catch (e) {}
      if (on) audio();
    },
  };
})();
