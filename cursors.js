/* Multiplayer cursors, Figma style. The visitor is "Guest". A "Genc"
   cursor hangs around near them, and when a section with a note comes
   into view it drifts over to it and leaves a short message, once.
   Mouse only, off for reduced motion, hidden while the lightbox is open
   (the poke cursor owns that view). */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // DRAFT notes. Genc rewrites these in their own voice.
  var NOTES = {
    'fancircle': [
      ['#two-apps', 'One app for both sides would have made each side worse. So: two apps.'],
      ['#songmatch', 'The first version had a Stop button. One swipe does it all now.'],
      ['#artists', 'Cost, duration and views used to be three targets. Now it’s one choice.'],
      ['#creative-room', 'Go on, drag across the waveform below. That’s the real feature.'],
      ['#outcome', 'Honest bit: it didn’t take off. The money ran out first.']
    ],
    'career-navig8r': [
      ['#problem', '30 controls on one page. This is what I inherited.'],
      ['#setup', 'One question per step. That’s most of the trick.'],
      ['#availability', 'Try it: switch a day on. The pickers only show up when needed.'],
      ['#outcome', '13 → 6 min is from walkthroughs, not analytics. Just so you know.']
    ],
    'scandlearn': [
      ['#problem', '21 steps to publish one training. I counted them.'],
      ['#research', 'Rivals looked nicer, we had more control. Keep the control, lose the maze.'],
      ['#search', 'More menus wouldn’t fix findability. Search became the main road.'],
      ['#outcome', 'They kept me on for 4 more months. Best metric I got.']
    ]
  };
  var key = Object.keys(NOTES).filter(function (k) { return location.pathname.indexOf('/' + k) > -1; })[0];
  var notes = (key ? NOTES[key] : []).map(function (n) {
    var sec = document.querySelector(n[0]);
    return sec && { el: sec.querySelector('h2') || sec, text: n[1], done: false };
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

  function anchorPoint(el) {
    // Notes never sit on the text. In order: the empty gutter right of the
    // column, the space right of the heading's last word, above the heading.
    var col = el.getBoundingClientRect();
    if (innerWidth - col.right >= 370) return { x: col.right + 24, y: col.top - 12 };
    var range = document.createRange(); range.selectNodeContents(el);
    var rs = range.getClientRects(), r = rs.length ? rs[rs.length - 1] : col;
    // bubble ends level with the heading's bottom, so it never drops onto the text
    if (r.right + 370 < innerWidth) return { x: r.right + 20, y: Math.min(r.top - 12, r.bottom - 22 - (visit ? visit.h : 50)) };
    return { x: Math.min(col.left + 40, innerWidth - 330), y: col.top - 96 };
  }
  function measure(text) {
    var c = chat.cloneNode(); c.textContent = text;
    c.style.cssText = 'visibility:hidden;opacity:0;transition:none;transform:none';
    genc.appendChild(c); var h = c.offsetHeight; c.remove(); return h;
  }
  function say(text) {
    clearInterval(typing);
    chat.textContent = ''; genc.classList.add('talk');
    var i = 0;
    typing = setInterval(function () { chat.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typing); }, 26);
    live.textContent = 'Genc: ' + text;
  }
  function pickNote(now) {
    if (now < nextAllowed || !seen) return;
    var vh = innerHeight;
    for (var i = 0; i < notes.length; i++) {
      var n = notes[i]; if (n.done) continue;
      var r = n.el.getBoundingClientRect();
      if (r.top > vh * .15 && r.bottom < vh * .7) {
        n.done = true; n.h = measure(n.text); visit = n; mode = 'visit';
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
      var tx, ty, tau;
      if (mode === 'visit' && visit) {
        var p = anchorPoint(visit.el); tx = p.x; ty = p.y; tau = .35;
        if (t > visitUntil) { mode = 'follow'; visit = null; genc.classList.remove('talk'); nextAllowed = t + 2500; }
      } else {
        // Hang around near the guest without sitting on them, with a slow drift.
        var side = mx > innerWidth - 260 ? -1 : 1;
        tx = mx + side * (130 + 18 * Math.sin(t / 1300)); ty = my + 70 + 14 * Math.cos(t / 1700); tau = .7;
      }
      var k = 1 - Math.exp(-dt / tau);
      gx += (tx - gx) * k; gy += (ty - gy) * k;
      genc.style.transform = 'translate3d(' + gx.toFixed(1) + 'px,' + gy.toFixed(1) + 'px,0)';
      genc.classList.toggle('flip', gx + 310 > innerWidth);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
