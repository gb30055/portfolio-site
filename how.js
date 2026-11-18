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
    var t0=null,dur=on?1100:500;cancelAnimationFrame(n._r);
    (function st(t){t0=t0||t;var k=Math.min(1,(t-t0)/dur);k=1-Math.pow(1-k,3);
      var v=Math.round(a+(b-a)*k);n.textContent=v+(p&&k===1&&v===b&&b?'+':'');
      if(k<1)n._r=requestAnimationFrame(st)})(performance.now());}
  function set(f,on){f.classList.toggle('on',on);count(f,on)}
  if(reduce){figs.forEach(function(f){set(f,true)});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){var f=e.target;
    if(e.isIntersecting&&!f._t){var on=false,i=[].indexOf.call(figs,f);
      var tick=function(){on=!on;set(f,on);f._t=setTimeout(tick,on?4200:1600)};
      f._t=setTimeout(tick,500+i*350);}
    else if(!e.isIntersecting&&f._t){clearTimeout(f._t);f._t=null;set(f,false)}})},{threshold:.4});
  figs.forEach(function(f){io.observe(f)});
})();
/* Typed greeting */
(function(){var t=document.querySelector('.bg-type');if(!t||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var s=t.dataset.text;t.setAttribute('aria-label',s);t.textContent='';
  var io=new IntersectionObserver(function(es){if(!es[0].isIntersecting)return;io.disconnect();var i=0;
    (function step(){t.textContent=s.slice(0,++i);if(i<s.length)setTimeout(step,i===4||i===12?160:70+Math.random()*60)})()},{threshold:.1});
  io.observe(t.parentNode);})();
/* How I work: five steps as tabs, auto-advancing while in view until the visitor picks one */
(function(){var f=document.querySelector('.st-fig');if(!f)return;
  var gs=f.querySelectorAll('.st-g'),tabs=[].slice.call(document.querySelectorAll('.st-tabs [role=tab]')),
      panels=document.querySelectorAll('.st-panel'),num=f.querySelector('.st-num'),unit=f.querySelector('.st-unit');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var r=(function(s){return function(){s=(s*9301+49297)%233280;return s/233280}})(3),C={a:[125,128,46],b:[285,128,34]};
  f.querySelectorAll('.hd-dot').forEach(function(c){var g=c.classList.contains('hd-a')?C.a:C.b,a=r()*6.283,d=Math.sqrt(r())*g[2];
    c.style.setProperty('--tx',(g[0]+Math.cos(a)*d-c.getAttribute('cx')).toFixed(1)+'px');
    c.style.setProperty('--ty',(g[1]+Math.sin(a)*d-c.getAttribute('cy')).toFixed(1)+'px');c.style.transitionDelay=(.3+r()*.4).toFixed(2)+'s';});
  var cur=-1,DUR=6000,start=0,auto=!reduce,vis=false,raf;
  function go(i,focus){cur=i;
    gs.forEach(function(g){g.classList.remove('on')});void f.offsetWidth;gs[i].classList.add('on');
    tabs.forEach(function(t,k){var on=k===i;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1;t.style.setProperty('--p',auto?0:1)});
    panels.forEach(function(p,k){p.hidden=k!==i});
    num.textContent=tabs[i].dataset.n;unit.textContent=tabs[i].dataset.u;
    if(focus)tabs[i].focus();
    var row=tabs[i].parentNode;if(row.scrollWidth>row.clientWidth)row.scrollTo({left:tabs[i].offsetLeft-16,behavior:reduce?'auto':'smooth'});
    start=performance.now();}
  function tick(now){if(!auto||!vis)return;var p=(now-start)/DUR;
    if(p>=1){go((cur+1)%tabs.length);p=0}
    tabs[cur].style.setProperty('--p',p.toFixed(3));raf=requestAnimationFrame(tick)}
  function stop(){auto=false;cancelAnimationFrame(raf);tabs.forEach(function(t){t.style.setProperty('--p',1)})}
  tabs.forEach(function(t,i){t.addEventListener('click',function(){stop();go(i)});
    t.addEventListener('keydown',function(e){var k=e.key,j=k==='ArrowRight'?i+1:k==='ArrowLeft'?i-1:k==='Home'?0:k==='End'?tabs.length-1:null;
      if(j===null)return;e.preventDefault();stop();go((j+tabs.length)%tabs.length,true)})});
  go(0);
  new IntersectionObserver(function(es){vis=es[0].isIntersecting;
    if(vis&&auto){start=performance.now()-(parseFloat(tabs[cur].style.getPropertyValue('--p'))||0)*DUR;raf=requestAnimationFrame(tick)}
    else cancelAnimationFrame(raf)},{threshold:.5}).observe(f);
})();
