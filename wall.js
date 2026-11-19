/* Proximity image wall: plain-JS port of Genc's ProximityImageWallLite
   Framer component. Infinite hex wall, tiles grow toward the centre,
   drag + momentum, wheel/touch scroll rule (down at the page end moves
   the wall, up scrolls the page), glass rim lens, tap to enlarge. */
(function () {
  var root = document.querySelector('[data-wall]');
  if (!root) return;

  var CFG = {
    minimumScale: 0.42, centerScale: 1, gap: 18, randomness: 0, rotation: 0,
    lens: true, lensWidth: 220, lensStrength: 0.7, colorSplit: false,
    frameRadius: 0, cornerRadius: 30, tileWidth: 190, tileHeight: 190,
    buttonLabel: 'View project'
  };
  var src = root.querySelector('script[type="application/json"]');
  var items = [];
  try { items = JSON.parse(src.textContent); } catch (e) {}
  // { thumb, full, alt, link }
  var IM = items.filter(function (i) { return i && (i.thumb || i.full); });
  IM = IM.slice(0, 20); // up to 20 images; they repeat across the endless wall
  if (!IM.length) return;
  IM.forEach(function (i) { i.thumb = i.thumb || i.full; i.full = i.full || i.thumb; });

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function hashGrid(x, y) {
    var h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return (h ^ (h >>> 16)) >>> 0;
  }
  function drand(seed) { return ((Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296; }
  function coprime(n, p) {
    if (n <= 1) return 1;
    var s = Math.max(1, p % n);
    for (var i = 0; i < n; i++) { var c = (s + i) % n || 1; if (gcd(c, n) === 1) return c; }
    return 1;
  }

  /* ---- image placement (same lattice as the Framer version) ---- */
  var N = IM.length;
  var smallSeq = [];
  if (N <= 3) {
    var seed = 2463534242;
    for (var q = 0; q < 97; q++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      var nx = seed % N;
      if (smallSeq.length && nx === smallSeq[smallSeq.length - 1]) nx = (nx + 1) % N;
      if (smallSeq.length > 1 && nx === smallSeq[smallSeq.length - 2]) nx = (nx + 1) % N;
      smallSeq.push(nx);
    }
  }
  var LA = 1, LB = 1;
  (function () {
    if (N < 2) return;
    if (N > 64) { LA = coprime(N, Math.max(2, Math.round(N * .382))); LB = coprime(N, Math.max(3, Math.round(N * .618))); if (LB === LA || (LA + LB) % N === 0) LB = coprime(N, LB + 1); return; }
    var R = Math.ceil(Math.sqrt(N)) + 1, cps = [], best = -1;
    for (var v = 1; v < N; v++) if (gcd(v, N) === 1) cps.push(v);
    cps.forEach(function (a) {
      cps.forEach(function (b) {
        if ((a + b) % N === 0) return;
        var m = Infinity;
        for (var dy = -R; dy <= R; dy++) for (var dx = -R; dx <= R; dx++) {
          if (!dx && !dy) continue;
          if ((((a * dx + b * dy) % N) + N) % N === 0) { var d2 = dx * dx + dy * dy; if (d2 < m) m = d2; }
        }
        if (m > best) { best = m; LA = a; LB = b; }
      });
    });
  })();
  var perm = [];
  (function () {
    for (var i = 0; i < N; i++) perm.push(i);
    var s = ((Math.max(0, Math.round(CFG.randomness)) + 1) * 2654435761) >>> 0;
    for (var j = N - 1; j > 0; j--) {
      s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
      var k = Math.floor(s / 4294967296 * (j + 1)), t = perm[j]; perm[j] = perm[k]; perm[k] = t;
    }
  })();
  function imgIndex(ix, iy) {
    if (N === 1) return 0;
    var h = hashGrid(ix, iy);
    if (N <= 3) return smallSeq[h % smallSeq.length];
    var block = Math.max(4, N);
    var off = (hashGrid(Math.floor(ix / block), Math.floor(iy / block)) + Math.round(CFG.randomness)) % N;
    return perm[(((LA * ix + LB * iy + off) % N) + N) % N];
  }

  /* ---- ratios ---- */
  var fallbackRatio = CFG.tileWidth / CFG.tileHeight;
  var ratios = IM.map(function () { return fallbackRatio; });
  var maxRatio = fallbackRatio;
  IM.forEach(function (it, i) {
    var p = new Image();
    p.onload = function () {
      if (p.naturalWidth && p.naturalHeight) { ratios[i] = p.naturalWidth / p.naturalHeight; maxRatio = Math.max.apply(null, ratios); dirty = true; }
    };
    p.src = it.thumb;
  });

  // Few, big, spread-out tiles (Genc's Framer reference): each image fits a
  // square slot about a quarter of the wall wide; slots sit far apart in
  // offset rows. Wide images keep their ratio inside the slot.
  function layout() {
    var minS = clamp(CFG.minimumScale, 0, 1), cS = Math.max(.2, CFG.centerScale);
    var S = clamp(W * .235, 130, 340);
    return { minS: minS, cS: cS, S: S, cellW: S * 1.72, rowStep: Math.min(S * 1.72 * .75, Math.max(S * 1.15, H * .43)) };
  }
  function tileW(i, L) { var r = Math.max(.4, ratios[i]); return r >= 1 ? L.S : L.S * r; }
  function tileH(i, L) { var r = Math.max(.4, ratios[i]); return r >= 1 ? L.S / r : L.S; }

  /* ---- lens ---- */
  // Lens on the left, right and bottom edges: the wall is full-bleed, so there
  // are no corners to round (the Framer soft-min version curved them).
  function lensField(px, py, w, h, band) {
    var dx = w * .5 - Math.abs(px - w * .5), db = h - py;
    // Left, right and bottom edges bend; the top stays calm (it fades into the page).
    if (db < dx) return { d: db, nx: 0, ny: 1 };
    return { d: dx, nx: px >= w * .5 ? 1 : -1, ny: 0 };
  }
  function frameLens(px, py, w, h, band, st) {
    var f = lensField(px, py, w, h, band), B = Math.max(1, band);
    if (f.d <= 0 || f.d >= B) return { x: px, y: py, sn: 1, angle: 0 };
    var t = f.d / B, A = .15 + .8 * clamp(st, 0, 1);
    var shift = A * B * t * (1 - t) * (1 - t);
    return { x: px + f.nx * shift, y: py + f.ny * shift, sn: clamp(1 - A * (1 - t) * (1 - 3 * t), .12, 1.4), angle: Math.atan2(f.ny, f.nx) * 180 / Math.PI };
  }
  function lensMap(w, h, band) {
    var cw = Math.max(2, Math.round(w)), ch = Math.max(2, Math.round(h));
    var c = document.createElement('canvas'); c.width = cw; c.height = ch;
    var ctx = c.getContext('2d'); if (!ctx) return '';
    var im = ctx.createImageData(cw, ch), d = im.data, B = Math.max(1, band);
    for (var y = 0; y < ch; y++) for (var x = 0; x < cw; x++) {
      var i = (y * cw + x) * 4, mx = 0, my = 0;
      // Only the rim band matters; skip the maths in the calm middle.
      if (x < B || y < B || x > cw - B || y > ch - B) {
        // Side and bottom bends are added, not switched, so the corners blend
        // smoothly instead of showing a diagonal seam.
        var px = x + .5, py = y + .5, ds = cw * .5 - Math.abs(px - cw * .5), db = ch - py;
        if (ds > 0 && ds < B) { var ts = ds / B; mx = -(px >= cw * .5 ? 1 : -1) * (1 - ts) * (1 - ts); }
        if (db > 0 && db < B) { var tb = db / B; my = -(1 - tb) * (1 - tb); }
      }
      d[i] = 127.5 + 127.5 * mx; d[i + 1] = 127.5 + 127.5 * my; d[i + 2] = 128; d[i + 3] = 255;
    }
    ctx.putImageData(im, 0, 0);
    return c.toDataURL('image/png');
  }
  var ua = navigator.userAgent;
  var webKitOnly = /iP(hone|ad|od)/.test(ua) || (/AppleWebKit/.test(ua) && !/Chrome|Chromium|Edg|Android/.test(ua));
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var svgLens = CFG.lens && !webKitOnly;

  /* ---- DOM ---- */
  root.classList.add('wall-on');
  root.style.setProperty('--wall-r', CFG.frameRadius + 'px');
  root.style.setProperty('--tile-r', CFG.cornerRadius + 'px');
  var layer = document.createElement('div'); layer.className = 'wall-layer';
  root.appendChild(layer);
  var NS = 'http://www.w3.org/2000/svg', feImg = null, fid = 'wall-lens';
  if (svgLens) {
    var st = clamp(CFG.lensStrength, 0, 1), shift = CFG.lensWidth * (.15 + .55 * st), disp = .06 + .1 * st;
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', 0); svg.setAttribute('height', 0); svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.innerHTML = '<defs><filter id="' + fid + '" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">' +
      '<feImage x="0" y="0" preserveAspectRatio="none" result="map"/>' +
      '<feDisplacementMap in="SourceGraphic" in2="map" scale="' + 2 * shift + '" xChannelSelector="R" yChannelSelector="G" result="dBase"/>' +
      (CFG.colorSplit ? '<feColorMatrix in="dBase" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0" result="gb"/><feDisplacementMap in="SourceGraphic" in2="map" scale="' + 2 * shift * (1 + disp) + '" xChannelSelector="R" yChannelSelector="G" result="dRed"/><feColorMatrix in="dRed" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/><feBlend in="r" in2="gb" mode="screen"/>' : '') +
      '</filter></defs>';
    root.insertBefore(svg, layer);
    feImg = svg.querySelector('feImage');
  }
  if (CFG.lens) {
    var rim = document.createElement('div'); rim.className = 'wall-rim';
    var s2 = clamp(CFG.lensStrength, 0, 1), a = function (v) { return (v * s2).toFixed(3); };
    var reach = Math.max(2, Math.round(CFG.lensWidth * .1)), soft = Math.max(6, Math.round(CFG.lensWidth * .4));
    rim.style.boxShadow = ['inset 0 0 0 1px rgba(255,255,255,' + a(.38) + ')', 'inset 0 2px 1px rgba(255,255,255,' + a(.5) + ')', 'inset 0 -2px 1px rgba(255,255,255,' + a(.16) + ')',
      'inset ' + reach + 'px ' + reach + 'px ' + soft + 'px -' + reach + 'px rgba(255,90,70,' + a(.6) + ')',
      'inset -' + reach + 'px -' + reach + 'px ' + soft + 'px -' + reach + 'px rgba(70,130,255,' + a(.65) + ')',
      'inset 0 0 ' + Math.round(CFG.lensWidth * .5) + 'px rgba(255,255,255,' + a(.06) + ')'].join(',');
    root.appendChild(rim);
  }

  var W = 1, H = 1;
  function measure() {
    W = Math.max(1, root.clientWidth); H = Math.max(1, root.clientHeight);
    if (svgLens && feImg) {
      var url = lensMap(W, H, CFG.lensWidth);
      feImg.setAttribute('width', W); feImg.setAttribute('height', H);
      feImg.setAttribute('href', url); feImg.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', url);
      layer.style.filter = url ? 'url(#' + fid + ')' : '';
    }
    dirty = true;
  }

  var pool = new Map();   // key -> element
  var off = { x: 0, y: 0 }, target = { x: 0, y: 0 }, mom = { x: 0, y: 0 };
  var dirty = true, visible = true, dragging = false, selectedKey = null;
  var tileInfo = new Map(); // key -> {i, rect}

  function render() {
    var L = layout(), cw = L.cellW, rs = L.rowStep;
    var colOff = Math.floor(off.x / cw), rowOff = Math.floor(off.y / rs);
    var wx = ((off.x % cw) + cw) % cw, wy = ((off.y % rs) + rs) % rs;
    var cols = Math.ceil(W / cw) + 4, rows = Math.ceil(H / rs) + 4;
    var maxD = Math.hypot(W * .5, H * .5) || 1, seen = new Set();
    tileInfo.clear();
    for (var y = -2; y < rows - 2; y++) {
      for (var x = -2; x < cols - 2; x++) {
        var gx = x + colOff, gy = y + rowOff, key = gx + ':' + gy;
        var i = imgIndex(gx, gy), tw = tileW(i, L), th = tileH(i, L);
        var shiftRow = Math.abs(gy % 2) === 1 ? cw * .5 : 0;
        var tx = x * cw - wx + shiftRow + (cw - tw) * .5, ty = y * rs - wy + (L.S - th) * .5;
        var cx = tx + tw * .5, cy = ty + th * .5;
        var t = Math.min(1, Math.hypot(cx - W * .5, cy - H * .5) / maxD);
        var sc = L.cS + (L.minS - L.cS) * t;
        var deg = (drand(hashGrid(gx * 7 + 3, gy * 13 + 5)) * 2 - 1) * CFG.rotation;
        var rcx = cx, rcy = cy, sq = '';
        if (CFG.lens && !svgLens) {
          var l = frameLens(cx, cy, W, H, CFG.lensWidth, CFG.lensStrength);
          rcx = l.x; rcy = l.y;
          if (l.sn < .999 || l.sn > 1.001) sq = 'rotate(' + l.angle.toFixed(2) + 'deg) scale(' + l.sn.toFixed(4) + ',1) rotate(' + (-l.angle).toFixed(2) + 'deg) ';
        }
        var el = pool.get(key);
        if (!el) {
          el = document.createElement('div'); el.className = 'wall-tile';
          var im = document.createElement('img'); im.src = IM[i].thumb; im.alt = ''; im.draggable = false; im.decoding = 'async';
          el.appendChild(im); layer.appendChild(el); pool.set(key, el);
        }
        el.style.width = tw + 'px'; el.style.height = th + 'px';
        el.style.transform = 'translate3d(' + rcx.toFixed(2) + 'px,' + rcy.toFixed(2) + 'px,0) translate(-50%,-50%) ' + sq + 'rotate(' + deg.toFixed(2) + 'deg) scale(' + sc.toFixed(4) + ')';
        el.style.opacity = key === selectedKey ? 0 : 1;
        seen.add(key);
        tileInfo.set(key, { i: i, x: tx, y: ty, w: tw, h: th, rect: { left: rcx - tw * sc / 2, top: rcy - th * sc / 2, width: tw * sc, height: th * sc } });
      }
    }
    pool.forEach(function (el, k) { if (!seen.has(k)) { el.remove(); pool.delete(k); } });
  }

  var last = performance.now();
  function tick(now) {
    var dt = Math.min(64, now - last); last = now;
    if (!dragging && (Math.abs(mom.x) > .01 || Math.abs(mom.y) > .01)) {
      target.x += mom.x * dt; target.y += mom.y * dt;
      var f = Math.pow(.95, dt / 16.67); mom.x *= f; mom.y *= f;
    }
    var k = dragging ? 1 : (reduce ? 1 : .2);
    var nx = off.x + (target.x - off.x) * k, ny = off.y + (target.y - off.y) * k;
    if (Math.abs(nx - off.x) > .05 || Math.abs(ny - off.y) > .05) { off.x = nx; off.y = ny; dirty = true; }
    else { off.x = target.x; off.y = target.y; }
    if (dirty) { dirty = false; render(); }
    if (visible) requestAnimationFrame(tick); else running = false;
  }
  var running = false;
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(tick); } }

  new ResizeObserver(measure).observe(root);
  new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) start(); }, { rootMargin: '200px' }).observe(root);
  measure(); start();

  /* ---- scroll rule ---- */
  function atPageEnd() {
    var vh = innerHeight || document.documentElement.clientHeight;
    if (root.getBoundingClientRect().bottom <= vh + 2) return true;
    var p = document.scrollingElement || document.documentElement;
    return p.scrollTop + vh >= p.scrollHeight - 2;
  }
  root.addEventListener('wheel', function (e) {
    if (selectedKey) return;
    var u = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 800 : 1;
    var dx = e.deltaX * u, dy = e.deltaY * u, vert = Math.abs(dy) >= Math.abs(dx);
    if (vert && (dy <= 0 || !atPageEnd())) return;
    e.preventDefault(); mom.x = mom.y = 0;
    if (vert) target.y += dy * .9; else target.x += dx * .9;
    start();
  }, { passive: false });

  var touchStart = null, touchOwner = null;
  root.addEventListener('touchstart', function (e) {
    var t = e.touches[0]; touchStart = e.touches.length === 1 && t ? { x: t.clientX, y: t.clientY } : null; touchOwner = null;
  }, { passive: true });
  root.addEventListener('touchmove', function (e) {
    if (selectedKey || !touchStart) return;
    if (!touchOwner) {
      var t = e.touches[0]; if (!t) return;
      var dx = t.clientX - touchStart.x, dy = t.clientY - touchStart.y, vert = Math.abs(dy) >= Math.abs(dx);
      touchOwner = !vert || (dy < 0 && atPageEnd()) ? 'wall' : 'page';
    }
    if (touchOwner === 'wall' && e.cancelable) e.preventDefault();
  }, { passive: false });
  function touchEnd() { touchStart = null; touchOwner = null; }
  root.addEventListener('touchend', touchEnd); root.addEventListener('touchcancel', touchEnd);

  /* ---- drag ---- */
  var ptr = null, down = null, didDrag = false, samples = [], pending = null;
  root.addEventListener('pointerdown', function (e) {
    if (selectedKey || ptr !== null) return;
    if (e.button !== undefined && e.button !== 0) return;
    root.setPointerCapture(e.pointerId);
    ptr = e.pointerId; down = { x: e.clientX, y: e.clientY, lx: e.clientX, ly: e.clientY };
    didDrag = Math.hypot(mom.x, mom.y) > .15 || Math.hypot(target.x - off.x, target.y - off.y) > 4;
    pending = null; mom.x = mom.y = 0; target.x = off.x; target.y = off.y; samples = []; dragging = true;
    root.classList.add('is-drag'); start();
  });
  root.addEventListener('pointermove', function (e) {
    if (e.pointerId !== ptr || !down) return;
    if (Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) didDrag = true;
    var dx = down.lx - e.clientX, dy = down.ly - e.clientY; down.lx = e.clientX; down.ly = e.clientY;
    if (e.pointerType === 'touch' && touchOwner !== 'wall') return;
    off.x += dx; off.y += dy; target.x = off.x; target.y = off.y; dirty = true;
    var now = performance.now(); samples.push({ t: now, x: off.x, y: off.y });
    while (samples.length > 2 && now - samples[0].t > 100) samples.shift();
  });
  function endPtr(e) {
    if (e.pointerId !== ptr) return;
    var now = performance.now(), a = samples[0], b = samples[samples.length - 1];
    if (e.type === 'pointerup' && a && b && now - b.t < 80 && b.t - a.t > 0) {
      var span = b.t - a.t; mom.x = clamp((b.x - a.x) / span, -4, 4); mom.y = clamp((b.y - a.y) / span, -4, 4);
    }
    if (e.type === 'pointerup' && !didDrag) {
      var r = root.getBoundingClientRect(); pending = pick(e.clientX - r.left, e.clientY - r.top);
    }
    ptr = null; down = null; dragging = false; samples = []; root.classList.remove('is-drag');
  }
  root.addEventListener('pointerup', endPtr); root.addEventListener('pointercancel', endPtr);
  root.addEventListener('click', function () { var k = pending; pending = null; if (k) open(k); });

  function pick(lx, ly) {
    var hit = null;
    tileInfo.forEach(function (t, k) { var r = t.rect; if (lx >= r.left && lx <= r.left + r.width && ly >= r.top && ly <= r.top + r.height) hit = k; });
    return hit;
  }

  /* ---- enlarge ---- */
  var ov = null;
  function open(key) {
    var info = tileInfo.get(key); if (!info) return;
    var it = IM[info.i], ratio = ratios[info.i];
    selectedKey = key; dirty = true;
    var vw = innerWidth, vh = innerHeight, fw = Math.min(vw * .86, vh * .86 * ratio), fh = fw / ratio;
    var fin = { left: (vw - fw) / 2, top: (vh - fh) / 2, width: fw, height: fh };
    var box = root.getBoundingClientRect();
    function pose() {
      var r = (tileInfo.get(key) || info).rect;
      var s = { left: box.left + r.left, top: box.top + r.top, width: r.width, height: r.height };
      var k = Math.max(s.width / fin.width, s.height / fin.height);
      var dx = s.left + s.width / 2 - (fin.left + fin.width / 2), dy = s.top + s.height / 2 - (fin.top + fin.height / 2);
      var ix = Math.max(0, (fin.width - s.width / k) / 2), iy = Math.max(0, (fin.height - s.height / k) / 2);
      return { t: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')', c: 'inset(' + iy + 'px ' + ix + 'px ' + iy + 'px ' + ix + 'px round ' + (CFG.cornerRadius / k) + 'px)' };
    }
    ov = document.createElement('div');
    ov.className = 'wall-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', it.alt || 'Image');
    ov.innerHTML = '<div class="wall-ov-bg"></div><div class="wall-ov-frame"><img alt=""></div>' +
      '<button type="button" class="wall-ov-x" aria-label="Close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg></button>' +
      (it.link ? '<a class="wall-ov-go"></a>' : '');
    var fr = ov.querySelector('.wall-ov-frame'), img = fr.querySelector('img');
    img.src = it.thumb; img.alt = it.alt || '';
    if (it.full !== it.thumb) { var hi = new Image(); hi.onload = function () { img.src = it.full; }; hi.src = it.full; }
    fr.style.cssText = 'left:' + fin.left + 'px;top:' + fin.top + 'px;width:' + fin.width + 'px;height:' + fin.height + 'px';
    var p = pose(); fr.style.transform = p.t; fr.style.clipPath = fr.style.webkitClipPath = p.c;
    var x = ov.querySelector('.wall-ov-x'); x.style.top = (fin.top + 16) + 'px'; x.style.left = (fin.left + fin.width - 64) + 'px';
    var go = ov.querySelector('.wall-ov-go');
    if (go) {
      go.href = it.link; go.textContent = CFG.buttonLabel;
      go.insertAdjacentHTML('beforeend', '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>');
      go.style.left = (fin.left + fin.width / 2) + 'px'; go.style.top = (fin.top + fin.height - 16) + 'px';
    }
    document.body.appendChild(ov);
    var block = function (e) { e.preventDefault(); };
    ov.addEventListener('wheel', block, { passive: false }); ov.addEventListener('touchmove', block, { passive: false });
    ov.querySelector('.wall-ov-bg').addEventListener('click', close);
    fr.addEventListener('click', close);
    x.addEventListener('click', close);
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      ov.classList.add('open'); fr.style.transform = 'none';
      fr.style.clipPath = fr.style.webkitClipPath = 'inset(0px 0px 0px 0px round 18px)';
      x.focus({ preventScroll: true });
    }); });
    function close() {
      if (!ov) return;
      var o = ov; ov = null; o.classList.remove('open'); o.style.pointerEvents = 'none';
      var q = pose(); fr.style.transform = q.t; fr.style.clipPath = fr.style.webkitClipPath = q.c;
      document.removeEventListener('keydown', esc);
      setTimeout(function () { o.remove(); selectedKey = null; dirty = true; start(); }, 420);
    }
    function esc(e) { if (e.key === 'Escape') close(); }
    document.addEventListener('keydown', esc);
  }
})();
