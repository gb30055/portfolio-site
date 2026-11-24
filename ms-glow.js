// The Qualia Lab block: the same screen-saver light as thequalialab.com.
// A big soft disc orbits slowly around the block so only its rim drifts in from the edges.
(function () {
  var box = document.querySelector('.ms-card'), el = box && box.querySelector('.ms-glow');
  if (!el) return;
  var still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PERIOD = 120, start = performance.now() - Math.random() * PERIOD * 1000, on = false, raf = 0;
  function place(now) {
    var w = box.clientWidth, h = box.clientHeight, r = Math.max(w, h) * .75;
    el.style.width = el.style.height = (r * 2) + 'px';
    el.style.margin = (-r) + 'px 0 0 ' + (-r) + 'px';
    var t = (now - start) / 1000, a = t / PERIOD * Math.PI * 2;
    var reach = .24 + .06 * Math.sin(t / 17);
    var dx = Math.cos(a), dy = Math.sin(a), hx = w / 2, hy = h / 2;
    var edge = Math.min(hx / Math.abs(dx || 1e-6), hy / Math.abs(dy || 1e-6));
    var d = r + edge * (1 - reach * 2);
    el.style.transform = 'translate(' + (hx + dx * d) + 'px,' + (hy + dy * d) + 'px)';
    raf = (!still && on) ? requestAnimationFrame(place) : 0;
  }
  new IntersectionObserver(function (e) {
    on = e[0].isIntersecting;
    if (on && !raf) raf = requestAnimationFrame(place);
  }).observe(box);
  requestAnimationFrame(function (now) { place(now); el.classList.add('on'); });
  addEventListener('resize', function () { place(performance.now()); });
})();
