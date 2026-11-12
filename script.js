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

// Answers that link to a case study get a small preview card under them.
const peeks = {
  best: { href: "fancircle/", img: "assets/thumb-fancircle-wall.webp", title: "Fancircle case study", sub: "Fan app + artist app, 700+ screens" }
};
let typingTimer = 0;
function ask(btn, auto) {
  const key = btn.dataset.q;
  const q = document.createElement("p");
  q.className = "bubble you";
  q.textContent = btn.textContent;
  const a = document.createElement("p");
  a.className = "bubble me";
  a.textContent = answers[key];
  const nodes = [q, a];
  if (peeks[key]) {
    const p = peeks[key], card = document.createElement("a");
    card.className = "ask-peek"; card.href = p.href;
    card.innerHTML = '<img alt="" src="' + p.img + '"><span><b></b><span></span></span>';
    card.querySelector("b").textContent = p.title + " \u2192"; card.querySelector("span span").textContent = p.sub;
    nodes.push(card);
  }
  document.querySelectorAll(".chips button").forEach((b) => b.setAttribute("aria-pressed", b === btn));
  clearTimeout(typingTimer);
  if (reduceMotion) { thread.replaceChildren(...nodes); return; }
  // Show the question, a short typing indicator, then the answer.
  const dots = document.createElement("p");
  dots.className = "bubble me typing"; dots.setAttribute("aria-label", "Typing");
  dots.innerHTML = "<i></i><i></i><i></i>";
  q.classList.add("enter"); dots.classList.add("enter", "late");
  thread.replaceChildren(q, dots);
  typingTimer = setTimeout(() => {
    nodes.slice(1).forEach((n) => n.classList.add("enter"));
    thread.replaceChildren(...nodes);
  }, auto ? 1100 : 650);
}
document.querySelectorAll(".chips button").forEach((btn) => btn.addEventListener("click", () => ask(btn)));
// Open with the question recruiters ask first, already answered.
const first = document.querySelector('.chips button[data-q="best"]');
if (first) setTimeout(() => ask(first, true), reduceMotion ? 0 : 500);

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


// Live clock in the hero: "Working remotely - 3:11 PM CET", plus the visitor's time when it differs.
(function () {
  const el = document.getElementById("clock"); if (!el) return;
  const TZ = "Europe/Belgrade"; // same zone as Prishtina
  const me = el.querySelector("[data-me]"), youWrap = el.querySelector(".ck-you"), you = el.querySelector("[data-you]");
  const fmt = (tz) => new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz });
  const myTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  function tick() {
    const d = new Date();
    const zone = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, timeZoneName: "short" }).formatToParts(d).find((p) => p.type === "timeZoneName");
    me.textContent = fmt(TZ).format(d) + " " + (zone ? zone.value : "CET");
    const mine = fmt(TZ).format(d), theirs = myTZ ? fmt(myTZ).format(d) : mine;
    if (theirs !== mine) { you.textContent = theirs; youWrap.hidden = false; } else youWrap.hidden = true;
  }
  tick(); setInterval(tick, 15000);
})();
