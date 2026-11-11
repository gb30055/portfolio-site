// Case study extras: rise-in motion, and the scroll story on pages with body.scroll-story
(function(){
  var v=document.body.className;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Gentle rise-in for phone rows and big moments (A and C)
  if('IntersectionObserver' in window&&!reduce){
    var els=document.querySelectorAll('.phones figure, .cs-body h2, .big-stat, ul.decisions li');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=(el.matches('.phones figure')?(Array.prototype.indexOf.call(el.parentNode.children,el)*80):0)+'ms';io.observe(el);});
  }
  // Turn the last phone row of the first coloured section into a sticky story
  if(/scroll-story/.test(v)){
    var sec=document.querySelector('.cs-body section.band');if(!sec)return;
    var rows=sec.querySelectorAll('.phones'),row=rows[rows.length-1];
    var story=document.createElement('div');story.className='story';
    var steps=document.createElement('ol');steps.className='story-steps';
    var ph=document.createElement('div');ph.className='story-phones';
    Array.prototype.forEach.call(row.querySelectorAll('figure'),function(f,i){
      var li=document.createElement('li');li.textContent=f.querySelector('figcaption').textContent;steps.appendChild(li);ph.appendChild(f);f.dataset.i=i;
    });
    story.appendChild(steps);story.appendChild(ph);row.replaceWith(story);
    var lis=steps.children;lis[0].classList.add('on');
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){Array.prototype.forEach.call(lis,function(l){l.classList.remove('on')});lis[e.target.dataset.i].classList.add('on');}})},{rootMargin:'-45% 0px -45% 0px'});
    ph.querySelectorAll('figure').forEach(function(f){io2.observe(f)});
  }
})();
// Chapter nav: highlight the section in view (v2)
(function(){
  var nav=document.querySelector('.chapters');if(!nav||!('IntersectionObserver' in window))return;
  var links={};nav.querySelectorAll('a').forEach(function(a){links[a.getAttribute('href').slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){nav.querySelectorAll('a').forEach(function(a){a.classList.remove('on')});var a=links[e.target.id];if(a){a.classList.add('on');var d=a.parentNode;if(a.offsetLeft<d.scrollLeft||a.offsetLeft+a.offsetWidth>d.scrollLeft+d.clientWidth)d.scrollTo({left:a.offsetLeft-16,behavior:'smooth'});}}})},{rootMargin:'-30% 0px -60% 0px'});
  Object.keys(links).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
})();
