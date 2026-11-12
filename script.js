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
