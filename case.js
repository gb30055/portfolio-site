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
// Chapter nav: highlight the section in view, and the one you tap (v2)
(function(){
  var nav=document.querySelector('.chapters');if(!nav)return;
  var as=[].slice.call(nav.querySelectorAll('a')),secs=as.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
  var lock=0;
  function set(i){as.forEach(function(a,j){a.classList.toggle('on',j===i)});var a=as[i],d=a&&a.parentNode;if(a&&(a.offsetLeft<d.scrollLeft||a.offsetLeft+a.offsetWidth>d.scrollLeft+d.clientWidth))d.scrollTo({left:a.offsetLeft-16,behavior:'smooth'});}
  function upd(){if(Date.now()<lock)return;var y=innerHeight*.35,cur=-1;secs.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=y)cur=i});if(cur>-1&&secs[cur].getBoundingClientRect().bottom<0)cur=-1;set(cur);var art=document.querySelector('.cs-body');nav.classList.toggle('gone',!!art&&art.getBoundingClientRect().bottom<80);}
  as.forEach(function(a,i){a.addEventListener('click',function(){set(i);lock=Date.now()+900;});});
  addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});upd();
})();
// Creative Room demo: drag across the waveform to pin a note
(function(){
  var w=document.querySelector('.wavenote');if(!w)return;
  var L=+w.dataset.len,wave=w.querySelector('.wn-wave'),bars=w.querySelector('.wn-bars'),sel=w.querySelector('.wn-sel'),pins=w.querySelector('.wn-pins'),
      form=w.querySelector('.wn-form'),input=form.querySelector('input'),at=form.querySelector('.wn-at b'),list=w.querySelector('.wn-list'),hint=w.querySelector('.wn-hint');
  var N=innerWidth<600?56:90,seed=7;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
  for(var i=0;i<N;i++){var b=document.createElement('i');var x=i/N,env=.35+.65*Math.abs(Math.sin(x*9.4))*(.6+.4*Math.sin(x*3.1+1));b.style.height=Math.max(8,Math.round((.25+.75*rnd())*env*100))+'%';bars.appendChild(b)}
  var B=bars.children,notes=[{a:31,b:57,who:'AG',name:'Alex Garcia',text:'I think this part could be a little slower.'}],cur=null;
  function fmt(t){t=Math.round(t);return ('0'+Math.floor(t/60)).slice(-2)+':'+('0'+t%60).slice(-2)}
  function paint(){for(var i=0;i<N;i++){var t=(i+.5)/N*L,c='';notes.forEach(function(n){if(t>=n.a&&t<=n.b)c=n.mine?'m':'c'});if(cur&&t>=cur.a&&t<=cur.b)c='s';B[i].className=c}}
  function pin(n,k){var p=document.createElement('button');p.type='button';p.className='wn-pin'+(n.mine?' mine':'');p.style.left=Math.min(88,Math.max(12,(n.a+n.b)/2/L*100))+'%';
    p.innerHTML='<i>'+n.who+'</i><span></span>';p.querySelector('span').textContent=n.text;p.setAttribute('aria-label',n.name+' at '+fmt(n.a)+' to '+fmt(n.b)+': '+n.text);
    p.onclick=function(){[].forEach.call(list.children,function(li,j){li.classList.toggle('on',j===k)})};pins.appendChild(p);
    var li=document.createElement('li');li.className=n.mine?'mine':'';li.innerHTML='<i>'+n.who+'</i><b>'+n.name+'<small>'+fmt(n.a)+' – '+fmt(n.b)+'</small></b><span></span>';li.querySelector('span').textContent=n.text;list.appendChild(li)}
  function render(){pins.innerHTML='';list.innerHTML='';notes.forEach(pin);paint();var ps=[].slice.call(pins.children),rows=[[],[],[]],stack=0;ps.forEach(function(p){var r={left:p.offsetLeft-p.offsetWidth/2,right:p.offsetLeft+p.offsetWidth/2};for(var k=0;k<3;k++){if(!rows[k].some(function(q){return r.left<q.right+6&&r.right>q.left-6})){rows[k].push(r);p.style.bottom=(6+k*34)+'px';stack=Math.max(stack,k);break}}});w.querySelector('.wn-stage').style.paddingTop=(56+stack*34)+'px';pins.style.height=(52+stack*34)+'px'}
  function tAt(e){var r=wave.getBoundingClientRect();return Math.max(0,Math.min(L,(e.clientX-r.left)/r.width*L))}
  function show(){if(!cur){sel.hidden=true;form.hidden=true;paint();return}sel.hidden=false;sel.style.left=cur.a/L*100+'%';sel.style.width=(cur.b-cur.a)/L*100+'%';sel.querySelector('span').textContent=fmt(cur.a)+' – '+fmt(cur.b);at.textContent=fmt(cur.a)+' – '+fmt(cur.b);wave.setAttribute('aria-valuenow',Math.round(cur.a));paint()}
  var start=null;
  wave.addEventListener('pointerdown',function(e){wave.setPointerCapture(e.pointerId);start=tAt(e);cur={a:start,b:start};show()});
  wave.addEventListener('pointermove',function(e){if(start===null)return;var t=tAt(e);cur={a:Math.min(start,t),b:Math.max(start,t)};show()});
  wave.addEventListener('pointerup',function(){if(start===null)return;start=null;if(cur.b-cur.a<3){var m=(cur.a+cur.b)/2;cur={a:Math.max(0,m-8),b:Math.min(L,m+8)}}show();form.hidden=false;hint.textContent='Now write your note';input.focus({preventScroll:true})});
  wave.addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'&&e.key!=='Enter')return;e.preventDefault();if(!cur)cur={a:0,b:15};if(e.key==='Enter'){form.hidden=false;input.focus();return}var d=e.key==='ArrowRight'?5:-5;var len=cur.b-cur.a;cur.a=Math.max(0,Math.min(L-len,cur.a+d));cur.b=cur.a+len;show()});
  form.querySelector('.wn-cancel').onclick=function(){cur=null;show();hint.textContent='Drag across the track'};
  form.addEventListener('submit',function(e){e.preventDefault();if(!cur)return;var t=input.value.trim()||'This part could be tighter.';notes.push({a:cur.a,b:cur.b,who:'You',name:'You',text:t,mine:true});input.value='';cur=null;show();render();hint.textContent='Pinned. Try another part'});
  render();
})();
// Closing footer: copy email, and the lines settle as you arrive
(function(){
  var b=document.querySelector('.close [data-copy]');
  if(b)b.addEventListener('click',function(){var t=b.dataset.copy,tip=b.querySelector('.cta-tip');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){var i=document.createElement('input');i.value=t;document.body.appendChild(i);i.select();document.execCommand('copy');i.remove()}).finally(function(){b.classList.add('done');if(tip)tip.textContent='Email copied';clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('done');if(tip)tip.textContent=''},1800)})});
  var l=document.querySelector('.close-lines');if(!l)return;
  if(!('IntersectionObserver' in window)){l.classList.add('on');return}
  var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){l.classList.add('on');io.disconnect()}},{threshold:.2});io.observe(l.parentNode);
})();
// Career Navig8r availability demo: pickers only for days that are on
(function(){
  var a=document.querySelector('.avail');if(!a)return;
  var lis=a.querySelectorAll('.av-days li'),n=a.querySelector('.av-n');
  function upd(){var c=1;lis.forEach(function(li){var on=li.querySelector('.av-sw').checked;li.classList.toggle('on',on);li.querySelector('.av-slots').hidden=!on;c+=1+(on?3:0)});n.textContent=c}
  lis.forEach(function(li){li.querySelector('.av-sw').addEventListener('change',upd)});upd();
})();
