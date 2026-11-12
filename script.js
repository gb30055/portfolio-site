// Prewritten answers for the "Ask me something" panel.
const answers = {
  who: "I'm a product designer from Prishtina, Kosovo. Over 8 years I've designed products for startups in 10 countries: a music app in Germany, a mentoring platform in Ireland, an aviation training system in Sweden, and healthcare tools in the US. Most of my work starts at the idea stage and ends at launch.",
  best: "Fancircle. I joined at the idea stage, helped decide what the product should be, and led design to v1.0 on iOS and Android: a fan app and an artist app, 700+ screens. The product didn't take off, and what I learned from that is in the case study too.",
  how: "I start with the people and the problem, usually through interviews and by mapping the flow that hurts. Then I turn that into a few clear decisions, test them early, and stay close to the developers so the details survive the build. I try to measure the result, and say honestly when I couldn't.",
  build: "Yes. I studied computer science and worked for years as a front-end and full-stack developer before focusing on design. I still prototype in code when a Figma file isn't enough to make a decision.",
  when: "Yes. I'm looking for a full-time product designer role, remote, with EU or US teams. I'm on CET. The fastest way to reach me is gencberisha3@gmail.com."
};

const thread = document.getElementById("thread");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".chips button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const q = document.createElement("p");
    q.className = "bubble you";
    q.textContent = btn.textContent;

    const a = document.createElement("p");
    a.className = "bubble me";
    a.textContent = answers[btn.dataset.q];

    // Keep the panel short: show only the latest question and answer.
    thread.replaceChildren(q, a);
    if (!reduceMotion) {
      q.classList.add("enter");
      a.classList.add("enter", "late");
    }
    document.querySelectorAll(".chips button").forEach((b) => b.setAttribute("aria-pressed", b === btn));
  });
});

// Top lines image grows in place as the page scrolls.
const band = document.querySelector(".hero-band");
if (band && !reduceMotion) {
  let ticking = false;
  const grow = () => {
    const y = Math.min(window.scrollY, 1000);
    band.style.setProperty("--grow", (1 + (y / 1000) * 1.2).toFixed(3));
    band.style.setProperty("--follow", (y * 0.45).toFixed(1) + "px");
    ticking = false;
  };
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(grow); } }, { passive: true });
  grow();
}

// Looping card videos: stay on the poster frame for people who prefer reduced motion.
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll("video.loop").forEach((v) => { v.removeAttribute("autoplay"); v.pause(); });
}

// Project cards: glowing dust, and stats that count up when a card comes into view
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var cards = [].slice.call(document.querySelectorAll(".xcard"));
  if (!cards.length) return;
  function countUp(dd) {
    var txt = dd.textContent, parts = txt.split(/(\d+)/), t0 = null, dur = 1400;
    if (reduce || txt.indexOf("→") > -1) return;
    function step(t) {
      if (!t0) t0 = t; var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      dd.textContent = parts.map(function (p) { return /^\d+$/.test(p) ? String(Math.round(+p * e)) : p; }).join("");
      if (k < 1) requestAnimationFrame(step); else dd.textContent = txt;
    }
    requestAnimationFrame(step);
  }
  cards.forEach(function (card) {
    var cv = card.querySelector(".x-dust"), ctx = cv && cv.getContext("2d"), cs = getComputedStyle(card);
    var cols = [cs.getPropertyValue("--c2").trim() || "#45E6FF", cs.getPropertyValue("--c3").trim() || "#fff", "#ffffff"];
    var dots = [], W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), on = false, raf = 0;
    function size() { W = card.clientWidth; H = card.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    function seed() { dots = []; var n = Math.round(W * H / 9000); for (var i = 0; i < n; i++) dots.push({ x: Math.random() * W, y: Math.random() * H, r: .6 + Math.random() * 1.8, v: .15 + Math.random() * .45, p: Math.random() * 6.3, c: cols[i % 3] }); }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i]; d.y -= d.v; d.x += Math.sin(t / 1800 + d.p) * .25; if (d.y < -6) { d.y = H + 6; d.x = Math.random() * W; }
        var a = .35 + .45 * Math.sin(t / 700 + d.p);
        ctx.globalAlpha = Math.max(0, a); ctx.fillStyle = d.c; ctx.shadowColor = d.c; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, 6.283); ctx.fill();
      }
      if (on) raf = requestAnimationFrame(draw);
    }
    if (ctx && !reduce) { size(); seed(); window.addEventListener("resize", function () { size(); seed(); }); }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && !card.classList.contains("lit")) { card.classList.add("lit"); card.querySelectorAll(".x-stats dd").forEach(countUp); }
        if (!ctx || reduce) return;
        if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(draw); }
        else if (!e.isIntersecting && on) { on = false; cancelAnimationFrame(raf); }
      });
    }, { threshold: .15 });
    io.observe(card);
  });
})();

// Project cards: each screen materialises from glowing particles projected up from the beam
(function () {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(".xcard .x-media").forEach(function (m) {
    var el = m.querySelector("img, video"), src = el && (el.tagName === "VIDEO" ? el.getAttribute("poster") : el.currentSrc || el.src);
    if (!src) return;
    var card = m.closest(".xcard"), c2 = getComputedStyle(card).getPropertyValue("--c2").trim() || "#45E6FF";
    var cv = document.createElement("canvas"); cv.className = "x-mat"; cv.setAttribute("aria-hidden", "true"); m.appendChild(cv);
    var ctx = cv.getContext("2d"), pts = null, W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1), busy = false;
    var tint = (function () { var d = document.createElement("canvas").getContext("2d"); d.fillStyle = c2; d.fillRect(0, 0, 1, 1); var p = d.getImageData(0, 0, 1, 1).data; return [p[0], p[1], p[2]]; })();
    var im = new Image(); im.src = src; m.classList.add("mat"); im.onerror = function () { m.classList.remove("mat"); };
    function build() {
      W = m.clientWidth; H = m.clientHeight; if (!W || !H) return false;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var step = W < 500 ? 4 : 5, cols = Math.ceil(W / step), rows = Math.ceil(H / step);
      var off = document.createElement("canvas"); off.width = cols; off.height = rows; var o = off.getContext("2d");
      // object-fit: cover, matching the media's own crop
      var ir = im.naturalWidth / im.naturalHeight, r = cols / rows, sw, sh, sx, sy, top = getComputedStyle(el).objectPosition.indexOf("top") > -1 || /^50% 0/.test(getComputedStyle(el).objectPosition);
      if (ir > r) { sh = im.naturalHeight; sw = sh * r; sx = (im.naturalWidth - sw) / 2; sy = 0; } else { sw = im.naturalWidth; sh = sw / r; sx = 0; sy = top ? 0 : (im.naturalHeight - sh) / 2; }
      o.drawImage(im, sx, sy, sw, sh, 0, 0, cols, rows);
      var d = o.getImageData(0, 0, cols, rows).data; pts = [];
      for (var y = 0; y < rows; y++) for (var x = 0; x < cols; x++) {
        var i = (y * cols + x) * 4;
        pts.push({ tx: x * step, ty: y * step, s: step, r: d[i], g: d[i + 1], b: d[i + 2],
          sx: W * (.3 + Math.random() * .4), sy: H + 20 + Math.random() * 60,
          dl: (1 - y / rows) * 700 + Math.random() * 500 });
      }
      return true;
    }
    function play() {
      if (busy || !im.complete || !im.naturalWidth || !m.classList.contains("mat")) return;
      if (!build()) return; busy = true;
      var t0 = performance.now(), fly = 900, total = 2300;
      function frame(t) {
        var e = t - t0; ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < pts.length; i++) {
          var p = pts[i], k = Math.min(1, Math.max(0, (e - p.dl) / fly));
          if (k <= 0) continue;
          var q = 1 - Math.pow(1 - k, 3), x = p.sx + (p.tx - p.sx) * q, y = p.sy + (p.ty - p.sy) * q - Math.sin(k * Math.PI) * 30;
          var mix = 1 - q, rr = p.r + (tint[0] - p.r) * mix, gg = p.g + (tint[1] - p.g) * mix, bb = p.b + (tint[2] - p.b) * mix;
          var sz = k < 1 ? Math.max(1.2, p.s * (.35 + .65 * q)) : p.s;
          ctx.globalAlpha = .35 + .65 * q; ctx.fillStyle = "rgb(" + (rr | 0) + "," + (gg | 0) + "," + (bb | 0) + ")";
          ctx.fillRect(x, y, sz, sz);
        }
        if (e < total) requestAnimationFrame(frame);
        else { m.classList.remove("mat"); m.classList.add("mat-done"); setTimeout(function () { ctx.clearRect(0, 0, W, H); m.classList.remove("mat-done"); busy = false; }, 700); }
      }
      requestAnimationFrame(frame);
    }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { if (im.complete) play(); else im.onload = play; } }); }, { threshold: .45 });
    io.observe(m);
  });
})();
