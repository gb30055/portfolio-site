/* Poke cursor: our own take on the telescopic hand-pointer trend.
   A hand on a metal telescopic stick held from below the screen, so
   you "poke" the screens from your couch: each click taps the glass with
   a tick and a ripple.
   Case study pages only, mouse only, off for reduced motion. The
   fingertip is the hotspot. */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var L = 1100; // stick length, runs off screen
  var NS = 'http://www.w3.org/2000/svg';
  var layer = document.createElement('div');
  layer.className = 'poke';
  layer.setAttribute('aria-hidden', 'true');
  // Local coords: fingertip at (0,0), hand points up, stick runs down (+y).
  // Strokes are drawn under the fills, so overlapping parts read as one hand.
  var hand =
    '<rect x="-6.5" y="0" width="13" height="40" rx="6.5"/>' +              // index finger
    '<rect x="-9" y="27" width="35" height="29" rx="11"/>' +                // fist
    '<rect x="-17" y="35" width="17" height="11" rx="5.5" transform="rotate(-24 -8 40)"/>'; // thumb
  layer.innerHTML =
    '<svg class="poke-svg" width="80" height="' + (L + 80) + '" viewBox="-30 -10 80 ' + (L + 80) + '" style="overflow:visible">' +
      '<defs>' +
        '<linearGradient id="pk-metal" x1="0" x2="1">' +
          '<stop offset="0" stop-color="#6d7380"/><stop offset=".35" stop-color="#f4f6fa"/><stop offset=".6" stop-color="#b9bfca"/><stop offset="1" stop-color="#5d6370"/>' +
        '</linearGradient>' +
        '<linearGradient id="pk-fade" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#fff"/><stop offset=".55" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<mask id="pk-mask" maskUnits="userSpaceOnUse" x="-30" y="0" width="80" height="' + (L + 80) + '"><rect x="-30" y="0" width="80" height="' + (L + 80) + '" fill="url(#pk-fade)"/></mask>' +
      '</defs>' +
      '<g class="poke-arm">' +
        // telescopic stick: three sections, each a bit thicker, with collars
        '<g mask="url(#pk-mask)">' +
          '<rect x="6.5" y="56" width="5" height="240" fill="url(#pk-metal)"/>' +
          '<rect x="5.5" y="292" width="7" height="8" rx="1.5" fill="url(#pk-metal)" stroke="#4b505b" stroke-width=".8"/>' +
          '<rect x="5.8" y="300" width="6.4" height="300" fill="url(#pk-metal)"/>' +
          '<rect x="4.8" y="596" width="8.4" height="9" rx="1.5" fill="url(#pk-metal)" stroke="#4b505b" stroke-width=".8"/>' +
          '<rect x="5" y="605" width="8" height="' + (L - 520) + '" fill="url(#pk-metal)"/>' +
        '</g>' +
        // ferrule where the hand meets the stick
        '<rect x="0" y="52" width="18" height="9" rx="2.5" fill="url(#pk-metal)" stroke="#111" stroke-width="2"/>' +
        '<g class="poke-hand">' +
          '<g fill="#111" stroke="#111" stroke-width="5" stroke-linejoin="round">' + hand + '</g>' +
          '<g fill="#fff">' + hand + '</g>' +
          // knuckle creases and nail
          '<g fill="none" stroke="#111" stroke-width="1.8" stroke-linecap="round">' +
            '<path d="M6.5 31v7M15 30v7"/>' +
            '<path d="M-3 4.5q3 -2 6 0"/>' +
          '</g>' +
        '</g>' +
      '</g>' +
    '</svg>';
  document.body.appendChild(layer);
  var svg = layer.firstChild, arm = svg.querySelector('.poke-arm');

  var mx = -999, my = -999, inside = false, gripX = 0, ready = false;
  var angle = 0, poke = 0, rings = [];
  var tap = { t: -1, level: 0, lastAt: -1, count: 0 };

  function onMove(e) {
    mx = e.clientX; my = e.clientY;
    var inZone = true;
    if (inZone !== inside) {
      inside = inZone;
      document.documentElement.classList.toggle('poke-on', inside);
      if (inside && !ready) { gripX = target(); ready = true; }
    }
  }
  function target() { return Math.min(Math.max(mx + innerWidth * .3, innerWidth * .15), innerWidth * 1.05); }

  // Tap timing (seconds): lift back along the stick, strike, settle.
  var LEVELS = [
    { lift: .06, strike: .05, settle: .18, back: 10, ring: 34 },
    { lift: .07, strike: .055, settle: .22, back: 16, ring: 48 },
    { lift: .075, strike: .06, settle: .26, back: 22, ring: 64 },
    { lift: .08, strike: .06, settle: .32, back: 28, ring: 80 }
  ];
  function onDown(e) {
    if (!inside || e.button !== 0) return;
    var now = performance.now() / 1000;
    tap.count = now - tap.lastAt < .4 ? tap.count + 1 : 1;
    tap.lastAt = now; tap.t = now;
    tap.level = Math.min(LEVELS.length - 1, tap.count - 1);
    // the hit lands with the real click, so sound and ripple stay in sync
    hit(mx, my, LEVELS[tap.level].ring, tap.level, tap.count);
  }
  function ring(x, y, size) {
    var el = document.createElement('div');
    el.className = 'poke-ring';
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.setProperty('--s', size + 'px');
    layer.appendChild(el);
    setTimeout(function () { el.remove(); }, 600);
  }

  /* Tap sound: three real taps cut from the trend clip, picked at random
     with a slight pitch wobble so repeats don't sound looped. Audio can
     only start after a click; the files are decoded up front. */
  var ac = null, bufs = [], loading = false;
  var base = (document.currentScript && document.currentScript.src) || '';
  base = base ? base.replace(/poke\.js.*$/, '') : '../';
  function load() {
    if (loading) return; loading = true;
    ['tap1', 'tap2', 'tap3'].forEach(function (n) {
      fetch(base + 'assets/sfx/' + n + '.mp3').then(function (r) { return r.arrayBuffer(); })
        .then(function (d) { return ac.decodeAudioData(d); })
        .then(function (b) { bufs.push(b); }).catch(function () {});
    });
  }
  // The context starts suspended (no sound before a click) but can decode
  // the files right away, so even the first tap is heard.
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); load(); } catch (e) {}
  function tick(level) {
    try {
      if (!ac) return;
      if (ac.state === 'suspended') ac.resume();
      var b = bufs[Math.floor(Math.random() * bufs.length)];
      if (!b) return; // first tap while the files load
      var src = ac.createBufferSource(), g = ac.createGain();
      src.buffer = b; src.playbackRate.value = .95 + Math.random() * .1;
      g.gain.value = .45 + .1 * level;
      src.connect(g).connect(ac.destination); src.start();
    } catch (e) {}
  }
  function hit(x, y, size, level, count) {
    ring(x, y, size);
    tick(level);
  }

  var last = performance.now();
  function frame(t) {
    var dt = Math.min(1 / 30, (t - last) / 1000); last = t;
    layer.style.opacity = inside ? 1 : 0;
    if (ready) {
      gripX += (target() - gripX) * (1 - Math.exp(-dt / .1));
      var gy = innerHeight * 1.15;
      var a = -Math.atan2(gripX - mx, gy - my) * 180 / Math.PI;
      angle = Math.max(-80, Math.min(80, a));
      // tap: a quick jab into the glass, a small recoil back, settle
      poke = 0;
      if (tap.t >= 0) {
        var lv = LEVELS[tap.level], e = t / 1000 - tap.t, j = lv.strike, r = lv.lift + lv.settle;
        if (e < j) poke = -4 * ease(e / j);
        else if (e < j + lv.lift) poke = -4 + (lv.back * .6 + 4) * ease((e - j) / lv.lift);
        else if (e < j + r) poke = lv.back * .6 * (1 - ease((e - j - lv.lift) / lv.settle));
        else tap.t = -1;
      }
      svg.style.transform = 'translate3d(' + (mx - 30) + 'px,' + (my - 10) + 'px,0) rotate(' + angle.toFixed(2) + 'deg)';
      // move along the stick: positive = pulled back toward the holder
      arm.setAttribute('transform', 'translate(0 ' + poke.toFixed(2) + ') scale(1.5)');
    }
    requestAnimationFrame(frame);
  }
  function ease(x) { return 1 - Math.pow(1 - x, 3); }

  addEventListener('pointermove', onMove, { passive: true });
  addEventListener('pointerdown', onDown, { passive: true });
  addEventListener('scroll', function () { if (mx > -999) onMove({ clientX: mx, clientY: my }); }, { passive: true });
  document.addEventListener('mouseleave', function () { inside = false; document.documentElement.classList.remove('poke-on'); });
  requestAnimationFrame(frame);
})();
