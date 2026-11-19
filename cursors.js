/* Multiplayer cursors, Figma style. The visitor is "Guest". A "Genc"
   cursor hangs around near them. Rest the cursor on a screen, demo or
   number that has a note, and Genc comes over and comments on it.
   Mouse only, off for reduced motion, hidden while the lightbox is open
   (the poke cursor owns that view). */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // DRAFT notes. Genc rewrites these in their own voice.
  // [section, what the note points at, text it must contain (optional), note]
  var NOTES = {
    'fancircle': [
      ['#two-apps', '.phones', '', 'One app for both sides would have made each side worse. So: two apps.'],
      ['#songmatch', 'figure', 'tap Stop', 'The first version had a Stop button. One swipe does it all now.'],
      ['#artists', 'figure', 'three targets', 'Cost, duration and views used to be three targets. Now it\u2019s one choice.'],
      ['#creative-room', '.wavenote', '', 'Go on, drag across the waveform. That\u2019s the real feature.'],
      ['#outcome', 'p', 'did not take off', 'Honest bit: it didn\u2019t take off. The money ran out first.']
    ],
    'career-navig8r': [
      ['#problem', '.big-stat', '', '30 controls on one page. This is what I inherited.'],
      ['#setup', 'figure', 'one job at a time', 'One question per step. That\u2019s most of the trick.'],
      ['#availability', '.avail', '', 'Try it: switch a day on. The pickers only show up when needed.'],
      ['#executive', '.tier-json', '', 'Copy this into any image model and change the "subject" lines to get new icons in the same 3D style.'],
      ['#outcome', '.big-stat', '', '13 \u2192 6 min is from walkthroughs, not analytics. Just so you know.']
    ],
    'scandlearn': [
      ['#problem', '.big-stat', '', '21 steps to publish one training. I counted them.'],
      ['#research', 'strong, b', 'keep the control', 'Rivals looked nicer, we had more control. Keep the control, lose the maze.'],
      ['#search', '.gs-fig', '', 'More menus wouldn\u2019t fix findability. Search became the main road.'],
      ['#outcome', '.big-stat', '', 'They kept me on for 4 more months. Best metric I got.']
    ]
  };
  var key = Object.keys(NOTES).filter(function (k) { return location.pathname.indexOf('/' + k) > -1; })[0];
  var notes = (key ? NOTES[key] : []).map(function (n) {
    var sec = document.querySelector(n[0]); if (!sec) return null;
    var el = [].slice.call(sec.querySelectorAll(n[1])).filter(function (e) {
      return !n[2] || e.textContent.toLowerCase().indexOf(n[2].toLowerCase()) > -1;
    })[0];
    return { el: el || sec.querySelector('h2') || sec, text: n[3], done: false };
  }).filter(Boolean);

  var ARROW = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path d="M3 2.2 L19 9.4 L11.6 11.6 L9.4 19 Z" fill="currentColor" stroke="#fff" stroke-width="1.8" stroke-linejoin="round"/></svg>';
  var layer = document.createElement('div');
  layer.className = 'mp'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML =
    '<div class="mp-c mp-genc">' + ARROW + '<span class="mp-tag">Genc</span><span class="mp-chat"></span></div>' +
    '<div class="mp-c mp-guest">' + ARROW + '<span class="mp-tag">Guest</span></div>';
  document.body.appendChild(layer);
  var guest = layer.querySelector('.mp-guest'), genc = layer.querySelector('.mp-genc');
  var chat = genc.querySelector('.mp-chat');
  // A screen-reader copy of the notes, so they aren't mouse-only content.
  var live = document.createElement('p'); live.className = 'sr'; live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  var mx = -1, my = -1, seen = false;
  var gx = innerWidth + 60, gy = innerHeight * .7;   // Genc enters from the right
  var mode = 'follow', visit = null, typing = 0;

  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!seen) { seen = true; document.documentElement.classList.add('mp-on'); greet(); }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { layer.classList.add('away'); });
  document.addEventListener('mouseenter', function () { layer.classList.remove('away'); });

  // The box that counts as "hovering" a note's target. For text, the
  // actual words (padded a little), not the full-width block.
  function hoverBox(el) {
    var r = el.getBoundingClientRect();
    if (/^(P|STRONG|B|SPAN)$/.test(el.tagName)) {
      var range = document.createRange(); range.selectNodeContents(el);
      var rs = range.getClientRects(), u = null;
      for (var i = 0; i < rs.length; i++) {
        var q = rs[i];
        u = u ? { left: Math.min(u.left, q.left), top: Math.min(u.top, q.top), right: Math.max(u.right, q.right), bottom: Math.max(u.bottom, q.bottom) }
              : { left: q.left, top: q.top, right: q.right, bottom: q.bottom };
      }
      if (u) r = { left: u.left - 12, top: u.top - 12, right: u.right + 12, bottom: u.bottom + 12 };
    }
    return r;
  }
  function hovered() {
    for (var i = 0; i < notes.length; i++) {
      var r = hoverBox(notes[i].el);
      if (mx >= r.left && mx <= r.right && my >= r.top && my <= r.bottom) return notes[i];
    }
    return null;
  }
  function measure(text) {
    var c = chat.cloneNode(); c.textContent = text;
    c.style.cssText = 'visibility:hidden;opacity:0;transition:none;transform:none';
    genc.appendChild(c); var m = { w: c.offsetWidth, h: c.offsetHeight }; c.remove(); return m;
  }
  function say(text) {
    clearInterval(typing);
    chat.textContent = ''; genc.classList.add('talk');
    var i = 0;
    typing = setInterval(function () { chat.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typing); }, 26);
    live.textContent = 'Genc: ' + text;
  }
  // On entering a project, Genc flies in, says hi and explains the game.
  var GREETING = 'Hi, I\u2019m Genc. Rest your cursor on a screen and I\u2019ll tell you the story behind it.';
  var greetEnd = 0;
  function greet() {
    mode = 'greet'; visit = { text: GREETING, m: measure(GREETING) };
    setTimeout(function () { if (mode === 'greet') say(GREETING); }, 700);
    greetEnd = performance.now() + 700 + GREETING.length * 26 + 3200;
  }
  // Hover rules: rest on a target for a moment and Genc comes over to
  // your cursor and says the note. Move off it and Genc goes back to
  // hanging around. Coming back to it says it again.
  var hoverNote = null, hoverSince = 0, leftAt = 0;
  function track(now) {
    if (mode === 'greet') {
      if (now < greetEnd) return;
      mode = 'follow'; visit = null; clearInterval(typing); genc.classList.remove('talk');
    }
    var h = hovered();
    if (h !== hoverNote) { hoverNote = h; hoverSince = now; }
    if (mode === 'follow' && hoverNote && now - hoverSince > 350) {
      visit = hoverNote; visit.m = measure(visit.text); mode = 'visit'; leftAt = 0;
      var n = visit;
      setTimeout(function () { if (visit === n) say(n.text); }, 300);
    }
    if (mode === 'visit') {
      if (hoverNote === visit) leftAt = 0;
      else if (!leftAt) leftAt = now;
      else if (now - leftAt > 600) { mode = 'follow'; visit = null; clearInterval(typing); genc.classList.remove('talk'); }
    }
  }

  var last = performance.now();
  function frame(t) {
    var dt = Math.min(.05, (t - last) / 1000); last = t;
    var lb = document.documentElement.classList.contains('lb-on');
    layer.classList.toggle('off', lb || !seen);
    if (seen) {
      guest.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      track(t);
      var tx, ty, tau, flip = false;
      if ((mode === 'visit' || mode === 'greet') && visit) {
        // right next to the guest's cursor, below its label; flip near the edge
        flip = mx + 60 + visit.m.w > innerWidth - 16;
        tx = flip ? mx - 8 : mx + 34; ty = my + 42; tau = mode === 'greet' ? .3 : .18;
      } else {
        // Hang around near the guest without sitting on them, with a slow drift.
        var side = mx > innerWidth - 260 ? -1 : 1;
        tx = mx + side * (130 + 18 * Math.sin(t / 1300)); ty = my + 70 + 14 * Math.cos(t / 1700); tau = .7; flip = side < 0;
      }
      var k = 1 - Math.exp(-dt / tau);
      gx += (tx - gx) * k; gy += (ty - gy) * k;
      genc.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      genc.classList.toggle('flip', flip);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
