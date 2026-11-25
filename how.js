/* How I work diagrams (index-v2 mockup) */
(function(){
  var figs=document.querySelectorAll('.hd');if(!figs.length)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function rnd(s){return function(){s=(s*9301+49297)%233280;return s/233280}}
  // listen: precompute cluster targets
  var L=document.querySelector('.hd-listen');
  if(L){var r=rnd(3),C={a:[120,130,46],b:[285,130,34]};
    L.querySelectorAll('.hd-dot').forEach(function(c){var g=c.classList.contains('hd-a')?C.a:C.b,
      a=r()*6.283,d=Math.sqrt(r())*g[2],x=+c.getAttribute('cx'),y=+c.getAttribute('cy');
      c.style.setProperty('--tx',(g[0]+Math.cos(a)*d-x).toFixed(1)+'px');
      c.style.setProperty('--ty',(g[1]+Math.sin(a)*d-y).toFixed(1)+'px');
      c.style.transitionDelay=(r()*.35).toFixed(2)+'s';});}
  var K=document.querySelector('.hd-cut');
  if(K){var j=0;K.querySelectorAll('.hd-seg').forEach(function(s){var i=+s.dataset.i;
      if(s.classList.contains('hd-keep')){s.style.setProperty('--tx',((j-i)*26.5+ (13-6)*26.5/2).toFixed(1)+'px');j++;}});}
  function count(f,on){var n=f.querySelector('.hd-num');if(!n)return;var u=f.querySelector('.hd-unit[data-on]');if(u)u.textContent=on?u.dataset.on:u.dataset.off;
    var a=+n.dataset.from,b=+n.dataset.to,p=n.dataset.plus;if(!on){var t=a;a=b;b=t;}
    if(reduce){n.textContent=b+(p&&b?'+':'');return}
    var t0=null,dur=on?600:400;cancelAnimationFrame(n._r);
    (function st(t){t0=t0||t;var k=Math.min(1,(t-t0)/dur);k=1-Math.pow(1-k,3);
      var v=Math.round(a+(b-a)*k);n.textContent=v+(p&&k===1&&v===b&&b?'+':'');
      if(k<1)n._r=requestAnimationFrame(st)})(performance.now());}
  function set(f,on){f.classList.toggle('on',on);count(f,on)}
  if(reduce){figs.forEach(function(f){set(f,true)});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var f=e.target;
    if(e.isIntersecting&&!f._done){f._done=1;io.unobserve(f);var i=[].indexOf.call(figs,f);
      setTimeout(function(){set(f,true)},250+i*200);}})},{threshold:.4});
  figs.forEach(function(f){io.observe(f)});
})();
/* Typed greeting */
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelectorAll('.bg-type').forEach(function(t){
  var s=t.dataset.text;t.setAttribute('aria-label',s);t.textContent='';
  var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();var i=0;
    (function step(){t.textContent=s.slice(0,++i);if(i<s.length)setTimeout(step,i===4||i===12?160:70+Math.random()*60)})()},{threshold:.1});
  io.observe(t.parentNode);});
// Meet section parallax: --py runs from 1 (section entering at the bottom) to -1 (leaving at the top)
(function(){var m=document.getElementById('meet');if(!m||matchMedia('(prefers-reduced-motion: reduce)').matches)return;var raf=0;
  function f(){raf=0;var r=m.getBoundingClientRect(),c=r.top+Math.min(r.height,innerHeight*1.4)/2,p=(c-innerHeight/2)/innerHeight;m.style.setProperty('--py',Math.max(-1,Math.min(1,p)).toFixed(3))}
  addEventListener('scroll',function(){if(!raf)raf=requestAnimationFrame(f)},{passive:true});addEventListener('resize',f);f();})();
