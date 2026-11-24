/* Multiplayer cursors, Figma style. The visitor is "Guest". "Genc's assistant"
   stays out of the way: it only shows up when the visitor rests on a screen,
   demo or number that has a note, types the note, and leaves again.
   Mouse only, off for reduced motion, hidden while the lightbox is open
   (the poke cursor owns that view). */
(function () {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // DRAFT notes, spoken by Genc's assistant (third person about Genc). Genc may rewrite them.
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
      ['#problem', '.big-stat', '', '30 controls on one page. This is what Genc inherited.'],
      ['#setup', 'figure', 'one job at a time', 'One question per step. That\u2019s most of the trick.'],
      ['#availability', '.avail', '', 'Try it: switch a day on. The pickers only show up when needed.'],
      ['#executive', '.tier-json', '', 'Copy this into any image model and change the "subject" lines to get new icons in the same 3D style.'],
      ['#outcome', '.big-stat', '', '13 \u2192 6 min is from walkthroughs, not analytics. Just so you know.']
    ],
    'scandlearn': [
      ['#problem', '.big-stat', '', '21 steps to publish one training. Genc counted them.'],
      ['#research', 'strong, b', 'keep the control', 'Rivals looked nicer, we had more control. Keep the control, lose the maze.'],
      ['#search', '.gs-fig', '', 'More menus wouldn\u2019t fix findability. Search became the main road.'],
      ['#outcome', '.big-stat', '', 'They kept Genc on for 4 more months. The best metric there is.']
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
  // Like Figma: over something clickable the cursor turns into a hand,
  // over a text field into a text beam. Same colour, same name tag.
  var HAND = '<svg class="mp-hand" width="24" height="26" viewBox="0 0 24 26" aria-hidden="true"><path d="M8.6 1.6c1.3 0 2.2 1 2.2 2.3v6.2l.4-.1c1.1-.2 2.1.4 2.4 1.4 1-.4 2.2 0 2.6 1.1 1-.3 2.2.3 2.4 1.4l.6 3.6c.5 3-.4 5.4-2.7 7-1.3.9-2.8 1.3-4.6 1.3H11c-2.3 0-4.2-1-5.4-2.9L2.3 17c-.7-1-.4-2.3.5-2.9.9-.6 2.1-.4 2.8.4l.8 1V3.9c0-1.3 1-2.3 2.2-2.3z" fill="currentColor" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/><path d="M10.8 10.4v5M13.6 11.6v4.2M16.2 12.8v3.4" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity=".85"/></svg>';
  var BEAM = '<svg class="mp-beam" width="14" height="22" viewBox="0 0 14 22" aria-hidden="true"><path d="M3 2.2c2 0 3.2.6 4 1.6.8-1 2-1.6 4-1.6M3 19.8c2 0 3.2-.6 4-1.6.8 1 2 1.6 4 1.6M7 3.8v14.4M4.6 11h4.8" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round"/><path d="M3 2.2c2 0 3.2.6 4 1.6.8-1 2-1.6 4-1.6M3 19.8c2 0 3.2-.6 4-1.6.8 1 2 1.6 4 1.6M7 3.8v14.4M4.6 11h4.8" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
  var CLICKABLE = 'a[href],button:not(:disabled),[role=button],label,select,summary,input[type=checkbox],input[type=radio],input[type=range],img.zoomable,[data-copy],[tabindex]:not([tabindex="-1"])';
  var TEXTY = 'input:not([type]),input[type=text],input[type=search],input[type=email],textarea,[contenteditable=true]';
  var layer = document.createElement('div');
  layer.className = 'mp'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML =
    '<div class="mp-c mp-genc">' + ARROW + '<span class="mp-tag">Genc\u2019s assistant</span><span class="mp-chat"></span></div>' +
    '<div class="mp-c mp-guest">' + ARROW + HAND + BEAM + '<span class="mp-tag">Guest</span></div>';
  document.body.appendChild(layer);
  var guest = layer.querySelector('.mp-guest'), genc = layer.querySelector('.mp-genc');
  var chat = genc.querySelector('.mp-chat');
  // A screen-reader copy of the notes, so they aren't mouse-only content.
  var live = document.createElement('p'); live.className = 'sr'; live.setAttribute('aria-live', 'polite');
  document.body.appendChild(live);

  var mx = -1, my = -1, seen = false, guestKind = '';
  var gx = innerWidth + 60, gy = innerHeight * .7;   // Genc enters from the right
  var mode = 'follow', visit = null, typing = 0;

  addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    var t = e.target && e.target.closest ? e.target : null;
    var kind = !t ? '' : t.closest(TEXTY) ? 'beam' : t.closest(CLICKABLE) ? 'hand' : '';
    if (kind !== guestKind) { guestKind = kind; guest.classList.toggle('is-hand', kind === 'hand'); guest.classList.toggle('is-beam', kind === 'beam'); }
    if (!seen) { seen = true; document.documentElement.classList.add('mp-on'); }
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
  // Hover rules: rest on a target for a moment and Genc comes over to
  // your cursor and says the note. Move off it and Genc goes back to
  // hanging around. Coming back to it says it again.
  var hoverNote = null, hoverSince = 0, leftAt = 0;
  function track(now) {
    var h = hovered();
    if (h !== hoverNote) { hoverNote = h; hoverSince = now; }
    if (mode === 'follow' && hoverNote && now - hoverSince > 350) {
      visit = hoverNote; visit.m = measure(visit.text); mode = 'visit'; leftAt = 0;
      // glide in from a short way off, not from across the page
      gx = mx + 90; gy = my + 110;
      genc.classList.add('here');
      var n = visit;
      setTimeout(function () { if (visit === n) say(n.text); }, 250);
    }
    if (mode === 'visit') {
      if (hoverNote === visit) leftAt = 0;
      else if (!leftAt) leftAt = now;
      else if (now - leftAt > 500) { mode = 'follow'; visit = null; clearInterval(typing); genc.classList.remove('talk', 'here'); }
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
      if (mode === 'visit' && visit) {
        // right next to the guest's cursor, below its label; flip near the edge
        flip = mx + 60 + visit.m.w > innerWidth - 16;
        tx = flip ? mx - 8 : mx + 34; ty = my + 42; tau = .18;
      } else {
        // Hidden: it stays where it faded out.
        tx = gx; ty = gy; tau = 1; flip = genc.classList.contains('flip');
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
