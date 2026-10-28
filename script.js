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
