// Exploration behaviour, only loaded by the fancircle-a/b/c pages
(function(){
  var v=document.body.className;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Gentle rise-in for phone rows and big moments (A and C)
  if(/v-a|v-c/.test(v)&&'IntersectionObserver' in window&&!reduce){
    var els=document.querySelectorAll('.phones figure, .cs-body h2, .big-stat, ul.decisions li');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el,i){el.classList.add('reveal');el.style.transitionDelay=(el.matches('.phones figure')?(Array.prototype.indexOf.call(el.parentNode.children,el)*80):0)+'ms';io.observe(el);});
  }
  // B: wrap the top of the page in a dark stage
  if(/v-b/.test(v)){
    var main=document.querySelector('main.wrap'),stage=document.createElement('div');stage.className='stage';
    var stop=main.querySelector('.cs-body');
    while(main.firstChild&&main.firstChild!==stop){stage.appendChild(main.firstChild);}
    main.insertBefore(stage,stop);
  }
  // C: turn the final SongMatch fan flow into a sticky story
  if(/v-c/.test(v)){
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
