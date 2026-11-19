/* Multiplayer cursors, Figma style. The visitor is "Guest". A "Genc"
   cursor hangs around near them, and when a section with a note comes
   into view it drifts over to it and leaves a short message, once.
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
  var mode = 'follow', visit = null, visitUntil = 0, nextAllowed = 0, typing = 0;

  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!seen) { seen = true; document.documentElement.classList.add('mp-on'); }
  }, { passive: true });
  document.addEventListener('mouseleave', function () { layer.classList.add('away'); });
  document.addEventListener('mouseenter', function () { layer.classList.remove('away'); });

  // Where Genc's cursor goes for a note: right at the thing it talks
  // about, with the bubble in the nearest free space. Tries the right
  // side, then the left, then above. Returns the cursor tip and side.
  function anchorPoint(el, w, h) {
    var r = el.getBoundingClientRect();
    if (el.classList.contains('big-stat')) {
      // Big numbers sit right under the section heading with text beside
      // them, so the note goes after the heading's last word instead.
      var sec = el.closest('section'), hd = sec && sec.querySelector('h2');
      if (hd) {
        var hr = document.createRange(); hr.selectNodeContents(hd);
        var hs = hr.getClientRects(), q = hs.length ? hs[hs.length - 1] : hd.getBoundingClientRect();
        if (q.right + 20 + 16 + w + 16 < innerWidth) return { x: q.right + 20, y: Math.min(q.top - 12, q.bottom - 22 - h), flip: false };
      }
    }
    if (/^(P|STRONG|B|SPAN)$/.test(el.tagName)) {
      // text: use the actual words, not the full-width block
      var range = document.createRange(); range.selectNodeContents(el);
      var rs = range.getClientRects(); if (rs.length) r = el.classList.contains('big-stat') ? rs[0] : rs[rs.length - 1];
    }
    var gap = 14, edge = 16;
    if (r.right + gap + 16 + w + edge < innerWidth && !el.classList.contains('big-stat'))
      return { x: r.right + gap, y: r.top - 6, flip: false };
    if (r.left - gap - w - 6 > edge)
      return { x: r.left - gap, y: r.top - 6, flip: true };
    // screens and demos: point inside the top-right corner, like a Figma comment
    if (!/^(P|STRONG|B|SPAN)$/.test(el.tagName) && r.width > w + 80)
      return { x: r.right - w - 40, y: r.top + 58, flip: false };
    return { x: Math.max(edge, Math.min(r.left + 24, innerWidth - w - 40)), y: r.top - 26 - h, flip: false };
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
  function pickNote(now) {
    if (now < nextAllowed || !seen || mode !== 'follow') return;
    var vh = innerHeight;
    for (var i = 0; i < notes.length; i++) {
      var n = notes[i]; if (n.done) continue;
      var r = n.el.getBoundingClientRect();
      if (r.top > vh * .18 && r.top < vh * .6) {
        n.done = true; n.m = measure(n.text); n.start = now; visit = n; mode = 'visit';
        visitUntil = now + 1100 + n.text.length * 26 + 3200;
        setTimeout(function () { if (visit === n) say(n.text); }, 650);
        return;
      }
    }
  }

  var last = performance.now();
  function frame(t) {
    var dt = Math.min(.05, (t - last) / 1000); last = t;
    var lb = document.documentElement.classList.contains('lb-on');
    layer.classList.toggle('off', lb || !seen);
    if (seen) {
      guest.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      pickNote(t);
      var tx, ty, tau, flip = false;
      if (mode === 'visit' && visit) {
        var p = anchorPoint(visit.el, visit.m.w, visit.m.h); tx = p.x; ty = p.y; tau = .35; flip = p.flip;
        var vr = visit.el.getBoundingClientRect();
        if (vr.bottom < 60 || vr.top > innerHeight) {
          // scrolled away before it could be read: end it, and allow it again later
          if (t < visit.start + 2500) visit.done = false;
          visitUntil = 0;
        }
        if (t > visitUntil) { mode = 'follow'; visit = null; genc.classList.remove('talk'); nextAllowed = t + 2500; }
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
