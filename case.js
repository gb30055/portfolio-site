// Copy the email address from any [data-copy] button (footer, nav, hero)
document.querySelectorAll('[data-copy]').forEach(function(b){b.addEventListener('click',function(){var t=b.dataset.copy,tip=b.querySelector('.cta-tip');(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){var i=document.createElement('input');i.value=t;document.body.appendChild(i);i.select();document.execCommand('copy');i.remove()}).finally(function(){b.classList.add('done');if(tip)tip.textContent='Email copied';clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('done');if(tip)tip.textContent=''},1800)})})});
// Case study extras: rise-in motion, and the scroll story on pages with body.scroll-story
(function(){
  var v=document.body.className;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Gentle rise-in for phone rows and big moments (A and C)
  if('IntersectionObserver' in window&&!reduce){
    // Phones: screens in sideways strips never animate (rising as they slide in looked like a vertical drag).
    var els=document.querySelectorAll(matchMedia('(max-width:767px)').matches?'.cs-body h2, .big-stat, ul.decisions li':'.phones figure, .cs-body h2, .big-stat, ul.decisions li');
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
      var li=document.createElement('li'),t=f.querySelector('figcaption').textContent,m=t.match(/^(\d+)\.\s*(.*)$/);
      li.innerHTML='<span class="sn">'+('0'+(m?m[1]:i+1)).slice(-2)+'</span><span class="st"></span>';li.querySelector('.st').textContent=m?m[2]:t;
      steps.appendChild(li);ph.appendChild(f);f.dataset.i=i;
    });
    var dev=document.createElement('div');dev.className='story-device';while(ph.firstChild)dev.appendChild(ph.firstChild);ph.appendChild(dev);
    // entry style per screen: push like app navigation, fade for state changes on the same screen, sheet for the bottom sheet
    var T=['push','push','fade','fade','sheet','push'];
    Array.prototype.forEach.call(dev.children,function(f,k){f.dataset.t=T[k]||'push';var nx=dev.children[k+1];f.dataset.out=nx?(T[k+1]||'push'):'push'});
    story.appendChild(steps);story.appendChild(ph);row.replaceWith(story);
    var lis=steps.children,figs=ph.querySelectorAll('figure');
    function on(i){Array.prototype.forEach.call(lis,function(l,k){l.classList.toggle('on',k===i);l.classList.toggle('done',k<i)});figs.forEach(function(f,k){f.classList.toggle('on',k===i);f.classList.toggle('prev',k===i-1);f.classList.toggle('gone',k<i-1)});steps.style.setProperty('--p',lis.length>1?i/(lis.length-1):0)}
    on(0);
    var mq=matchMedia('(min-width:900px)'),raf=0;
    var lock=0;function pos(){raf=0;if(Date.now()<lock)return;var r=story.getBoundingClientRect(),h=r.height-innerHeight;if(h<=0)return;var p=Math.max(0,Math.min(.999,-r.top/h));on(Math.floor(p*lis.length))}
    function mode(){story.classList.toggle('pin',mq.matches);story.style.setProperty('--n',lis.length);if(mq.matches)pos()}
    mode();(mq.addEventListener?mq.addEventListener('change',mode):mq.addListener(mode));
    addEventListener('scroll',function(){if(mq.matches&&!raf)raf=requestAnimationFrame(pos)},{passive:true});
    // Tap a step: show its screen right away, then glide the page to that step's spot
    Array.prototype.forEach.call(lis,function(l,k){l.tabIndex=0;l.setAttribute('role','button');
      function go(){if(!mq.matches)return;on(k);var r=story.getBoundingClientRect(),h=r.height-innerHeight;lock=Date.now()+1200;scrollTo({top:r.top+scrollY+h*(k+.5)/lis.length,behavior:'smooth'})}
      l.addEventListener('click',go);l.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
    addEventListener('scrollend',function(){if(lock&&Date.now()<lock){lock=0}});
    var io2=new IntersectionObserver(function(es){if(mq.matches)return;es.forEach(function(e){if(e.isIntersecting)on(+e.target.dataset.i)})},{rootMargin:'-45% 0px -45% 0px'});
    ph.querySelectorAll('figure').forEach(function(f){io2.observe(f)});
  }
})();
// Chapter nav: highlight the section in view, and the one you tap (v2)
(function(){
  var nav=document.querySelector('.chapters');if(!nav)return;
  var as=[].slice.call(nav.querySelectorAll('.ch-tabs a, nav.chapters > div > a:not(.ch-home)')),secs=as.map(function(a){return document.getElementById(a.getAttribute('href').slice(1))});
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
  var PK=(w.dataset.peaks||'').split(',').map(Number).filter(function(v){return !isNaN(v)});
  for(var i=0;i<N;i++){var b=document.createElement('i'),h;if(PK.length){var a0=Math.floor(i/N*PK.length),a1=Math.max(a0+1,Math.floor((i+1)/N*PK.length)),m=0;for(var j=a0;j<a1;j++)m=Math.max(m,PK[j]);h=Math.max(6,m)}else{var x=i/N,env=.35+.65*Math.abs(Math.sin(x*9.4))*(.6+.4*Math.sin(x*3.1+1));h=Math.max(8,Math.round((.25+.75*rnd())*env*100))}b.style.height=h+'%';bars.appendChild(b)}
  // Real audio: play button, playhead, and selecting a part plays that part.
  // Web Audio (decoded up front) so seeking works on any server, even without range requests.
  var ph=w.querySelector('.wn-ph'),pb=w.querySelector('.wn-play'),ac=null,buf=null,srcN=null,t0=0,off=0,stopAt=L,raf=0,want=null;
  var au=w.dataset.src?{paused:true,get currentTime(){return this.paused?off:Math.min(L,off+(ac.currentTime-t0))}}:null;
  if(au){fetch(w.dataset.src).then(function(r){return r.arrayBuffer()}).then(function(d){ac=ac||new (window.AudioContext||window.webkitAudioContext)();return ac.decodeAudioData(d)}).then(function(b){buf=b;if(want){playRange(want[0],want[1])}}).catch(function(){})}
  function stop(keep){if(srcN){srcN.onended=null;try{srcN.stop()}catch(e){}srcN=null}if(au&&!au.paused){off=au.currentTime;au.paused=true}cancelAnimationFrame(raf);w.classList.remove('playing');pb&&pb.setAttribute('aria-label','Play the track');if(!keep)paint()}
  function tick(){if(!au||au.paused)return;var t=au.currentTime;ph.hidden=false;ph.style.left=t/L*100+'%';paint();if(t>=stopAt-.02){stop();if(stopAt>=L-.05){off=0;ph.hidden=true;paint()}return}raf=requestAnimationFrame(tick)}
  function playRange(a,b){if(!au)return;if(!ac){try{ac=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}}if(ac.state==='suspended')ac.resume();if(!buf){want=[a,b];return}want=null;stop(true);
    srcN=ac.createBufferSource();srcN.buffer=buf;srcN.connect(ac.destination);off=a;stopAt=b;t0=ac.currentTime;srcN.start(0,a,Math.max(.05,b-a));au.paused=false;
    w.classList.add('playing');pb&&pb.setAttribute('aria-label','Pause');raf=requestAnimationFrame(tick)}
  if(pb)pb.onclick=function(){if(!au)return;if(!au.paused){stop();return}var from=off>=L-.1?0:off;playRange(from,L)};
  var B=bars.children,notes=[{a:6,b:12.5,who:'AG',name:'Alex Garcia',text:'I think this part could be a little slower.'}],cur=null;
  function fmt(t){t=Math.round(t);return ('0'+Math.floor(t/60)).slice(-2)+':'+('0'+t%60).slice(-2)}
  function paint(){for(var i=0;i<N;i++){var t=(i+.5)/N*L,c='';notes.forEach(function(n){if(t>=n.a&&t<=n.b)c=n.mine?'m':'c'});if(cur&&t>=cur.a&&t<=cur.b)c='s';if(!c&&au&&!ph.hidden&&t<=au.currentTime)c='p';B[i].className=c}}
  function pin(n,k){var p=document.createElement('button');p.type='button';p.className='wn-pin'+(n.mine?' mine':'');p.style.left=Math.min(88,Math.max(12,(n.a+n.b)/2/L*100))+'%';
    p.innerHTML='<i>'+n.who+'</i><span></span>';p.querySelector('span').textContent=n.text;p.setAttribute('aria-label',n.name+' at '+fmt(n.a)+' to '+fmt(n.b)+': '+n.text);
    p.onclick=function(){[].forEach.call(list.children,function(li,j){li.classList.toggle('on',j===k)});playRange(n.a,n.b)};pins.appendChild(p);
    var li=document.createElement('li');li.className=n.mine?'mine':'';li.innerHTML='<i>'+n.who+'</i><b>'+n.name+'<small>'+fmt(n.a)+' – '+fmt(n.b)+'</small></b><span></span>';li.querySelector('span').textContent=n.text;list.appendChild(li)}
  function render(){pins.innerHTML='';list.innerHTML='';notes.forEach(pin);paint();var ps=[].slice.call(pins.children),rows=[[],[],[]],stack=0;ps.forEach(function(p){var r={left:p.offsetLeft-p.offsetWidth/2,right:p.offsetLeft+p.offsetWidth/2};for(var k=0;k<3;k++){if(!rows[k].some(function(q){return r.left<q.right+6&&r.right>q.left-6})){rows[k].push(r);p.style.bottom=(6+k*34)+'px';stack=Math.max(stack,k);break}}});w.querySelector('.wn-stage').style.paddingTop=(56+stack*34)+'px';pins.style.height=(52+stack*34)+'px'}
  function tAt(e){var r=wave.getBoundingClientRect();return Math.max(0,Math.min(L,(e.clientX-r.left)/r.width*L))}
  function show(){if(!cur){sel.hidden=true;form.hidden=true;paint();return}sel.hidden=false;sel.style.left=cur.a/L*100+'%';sel.style.width=(cur.b-cur.a)/L*100+'%';sel.querySelector('span').textContent=fmt(cur.a)+' – '+fmt(cur.b);at.textContent=fmt(cur.a)+' – '+fmt(cur.b);wave.setAttribute('aria-valuenow',Math.round(cur.a));paint()}
  var start=null;
  wave.addEventListener('pointerdown',function(e){wave.setPointerCapture(e.pointerId);start=tAt(e);cur={a:start,b:start};show()});
  wave.addEventListener('pointermove',function(e){if(start===null)return;var t=tAt(e);cur={a:Math.min(start,t),b:Math.max(start,t)};show()});
  wave.addEventListener('pointerup',function(){if(start===null)return;start=null;if(cur.b-cur.a<1){var m=(cur.a+cur.b)/2;cur={a:Math.max(0,m-2.5),b:Math.min(L,m+2.5)}}show();playRange(cur.a,cur.b);form.hidden=false;hint.textContent='Now write your note';input.focus({preventScroll:true})});
  wave.addEventListener('keydown',function(e){if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft'&&e.key!=='Enter')return;e.preventDefault();if(!cur)cur={a:0,b:15};if(e.key==='Enter'){form.hidden=false;input.focus();return}var d=e.key==='ArrowRight'?5:-5;var len=cur.b-cur.a;cur.a=Math.max(0,Math.min(L-len,cur.a+d));cur.b=cur.a+len;show()});
  form.querySelector('.wn-cancel').onclick=function(){cur=null;show();hint.textContent='Drag across the track'};
  form.addEventListener('submit',function(e){e.preventDefault();if(!cur)return;var t=input.value.trim()||'This part could be tighter.';notes.push({a:cur.a,b:cur.b,who:'You',name:'You',text:t,mine:true});input.value='';cur=null;show();render();hint.textContent='Pinned. Try another part'});
  render();
})();
// Closing footer: copy email, and the lines settle as you arrive
(function(){
  var l=document.querySelector('.close-lines');if(!l)return;
  if(!('IntersectionObserver' in window)){l.classList.add('on');return}
  var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){l.classList.add('on');io.disconnect()}},{threshold:.2});io.observe(l.parentNode);
})();
// Career Navig8r availability demo: slots per day (no overlaps), add/remove, apply to selected days
(function(){
  var a=document.querySelector('.avail');if(!a)return;
  var lis=[].slice.call(a.querySelectorAll('.av-days li')),n=a.querySelector('.av-n'),toast=a.querySelector('.av-toast'),rs=a.querySelector('.av-reset'),tt;
  var H=[];for(var h=6;h<=22;h++)H.push((h<10?'0':'')+h+':00');var L=H.length-1;
  var ic={add:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    copy:'<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="3" y="7" width="10" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7 4.5h7.5A2 2 0 0 1 16.5 6.5V13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
    del:'<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'};
  function sel(v,lbl){return '<select aria-label="'+lbl+'">'+H.map(function(t,i){return '<option value="'+i+'"'+(i===v?' selected':'')+'>'+t+'</option>'}).join('')+'</select>'}
  function row(day,f,t){var d=document.createElement('div');d.className='av-slot';
    d.innerHTML='<span class="av-l">from</span>'+sel(f,day+' from')+'<span class="av-l">to</span>'+sel(t,day+' to')+
    '<button type="button" class="av-ib av-plus" aria-label="Add a time slot">'+ic.add+'</button>'+
    '<button type="button" class="av-ib av-apply" aria-label="Apply to your selected days">'+ic.copy+'<span class="av-tip" aria-hidden="true">Apply to your selected days</span></button>'+
    '<button type="button" class="av-ib av-del" aria-label="Remove this time slot">'+ic.del+'</button>';return d}
  function rows(li){return [].slice.call(li.querySelectorAll('.av-slot'))}
  function iv(r){var s=r.querySelectorAll('select');return [+s[0].value,+s[1].value]}
  function slots(li){return rows(li).map(iv)}
  function others(li,r){return rows(li).filter(function(o){return o!==r}).map(iv)}
  // Grey out hours already taken by the day's other slots
  function refresh(li){rows(li).forEach(function(r){var o=others(li,r),s=r.querySelectorAll('select'),f=+s[0].value;
    [].forEach.call(s[0].options,function(op,i){op.disabled=i>=L||o.some(function(x){return x[0]<=i&&i<x[1]})});
    [].forEach.call(s[1].options,function(op,j){op.disabled=j<=f||o.some(function(x){return x[0]<j&&x[1]>f})});})}
  function sortRows(li){var box=li.querySelector('.av-slots');rows(li).sort(function(p,q){return iv(p)[0]-iv(q)[0]}).forEach(function(r){box.appendChild(r)})}
  function gaps(list){var g=[],c=0;list.slice().sort(function(p,q){return p[0]-q[0]}).forEach(function(x){if(x[0]>c)g.push([c,x[0]]);c=Math.max(c,x[1])});if(c<L)g.push([c,L]);return g}
  function say(msg,bad){clearTimeout(tt);toast.innerHTML=msg;toast.className='av-toast'+(bad?' bad':'');toast.hidden=false;tt=setTimeout(function(){toast.hidden=true},4200)}
  function upd(){var c=1;lis.forEach(function(li){var on=li.querySelector('.av-sw').checked;li.classList.toggle('on',on);li.querySelector('.av-slots').hidden=!on;c+=1+(on?rows(li).length*5:0);refresh(li)});n.textContent=c;rs.disabled=!a.querySelector('.av-slot')}
  function fill(li,list){var box=li.querySelector('.av-slots');box.innerHTML='';list.forEach(function(s){box.appendChild(row(li.dataset.day,s[0],s[1]))})}
  rs.addEventListener('click',function(){lis.forEach(function(li){li.querySelector('.av-sw').checked=false;li.querySelector('.av-slots').innerHTML=''});toast.hidden=true;upd()});
  lis.forEach(function(li){
    var sw=li.querySelector('.av-sw'),box=li.querySelector('.av-slots');
    sw.addEventListener('change',function(){if(sw.checked&&!box.children.length)fill(li,[[3,11]]);upd()});
    box.addEventListener('change',function(e){var r=e.target.closest('.av-slot');if(!r)return;var s=r.querySelectorAll('select'),f=+s[0].value,t=+s[1].value,o=others(li,r);
      if(e.target===s[0]){var lim=L;o.forEach(function(x){if(x[0]>f&&x[0]<lim)lim=x[0]});var keep=t-(+s[0].dataset.prev||f);
        if(t<=f||t>lim)s[1].value=Math.min(lim,f+Math.max(1,keep>0?keep:1))}
      s[0].dataset.prev=s[0].value;sortRows(li);upd()});
    box.addEventListener('focusin',function(e){if(e.target.tagName==='SELECT')e.target.dataset.prev=e.target.value});
    box.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var r=b.closest('.av-slot');
      if(b.classList.contains('av-plus')){var end=iv(r)[1],g=gaps(slots(li)),pick=g.filter(function(x){return x[0]>=end})[0]||g[0];
        if(!pick){say('<b>'+li.dataset.day+' is fully booked</b><span>There\'s no free hour left to add another slot.</span>',true);return}
        box.appendChild(row(li.dataset.day,pick[0],Math.min(pick[0]+3,pick[1])));sortRows(li);upd()}
      else if(b.classList.contains('av-del')){r.remove();if(!box.children.length){sw.checked=false}upd()}
      else if(b.classList.contains('av-apply')){
        var to=lis.filter(function(o){return o!==li&&o.querySelector('.av-sw').checked});
        if(!to.length){say('<b>Please select more days to apply this timeslot</b><span>Switch on other days first, then apply.</span>',true);return}
        // Copy only this slot; skip days where it would overlap an existing one
        var s=iv(r),lbl=H[s[0]]+' to '+H[s[1]],done=[],has=[],clash=[];
        to.forEach(function(o){var ex=slots(o);
          if(ex.some(function(x){return x[0]===s[0]&&x[1]===s[1]})){has.push(o.dataset.day);return}
          if(ex.some(function(x){return x[0]<s[1]&&x[1]>s[0]})){clash.push(o.dataset.day);return}
          o.querySelector('.av-slots').appendChild(row(o.dataset.day,s[0],s[1]));sortRows(o);done.push(o.dataset.day);
          o.classList.remove('flash');void o.offsetWidth;o.classList.add('flash')});
        upd();
        var msg=done.length?'<b>Applied '+lbl+' to '+done.join(', ')+'</b>':'<b>Nothing to apply</b>';
        if(has.length)msg+='<span>Already set on '+has.join(', ')+'.</span>';
        if(clash.length)msg+='<span>Skipped '+clash.join(', ')+': it overlaps a slot there.</span>';
        say(msg,!done.length)}
    });
  });upd();
})();

/* Lightbox: click any screen in the article to see it large (full page when one exists) */
(function () {
  var imgs = [].slice.call(document.querySelectorAll('main figure img, .cs section figure img'))
    .filter(function (im, i, a) { return a.indexOf(im) === i && !im.closest('.next, .close, .cover-desk, .cover-phones'); });
  if (!imgs.length) return;
  var box = document.createElement('div');
  box.className = 'lb'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Image viewer'); box.hidden = true;
  box.innerHTML = '<div class="lb-scroll"><img class="lb-img" alt=""></div>' +
    '<button type="button" class="lb-btn lb-close" aria-label="Close">✕</button>' +
    '<button type="button" class="lb-btn lb-prev" aria-label="Previous image">←</button>' +
    '<button type="button" class="lb-btn lb-next" aria-label="Next image">→</button>' +
    '<p class="lb-cap"><span class="lb-n"></span><span class="lb-t"></span></p>';
  document.body.appendChild(box);
  var big = box.querySelector('.lb-img'), sc = box.querySelector('.lb-scroll'), cur = 0, last = null;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    var im = imgs[cur], fc = im.closest('figure') && im.closest('figure').querySelector('figcaption');
    big.src = im.getAttribute('data-full') ? im.getAttribute('data-full') : im.currentSrc || im.src;
    big.alt = im.alt;
    big.classList.toggle('tall', !!im.getAttribute('data-full'));
    box.querySelector('.lb-n').textContent = (cur + 1) + ' / ' + imgs.length;
    box.querySelector('.lb-t').textContent = fc ? fc.textContent : '';
    sc.scrollTop = 0;
  }
  function open(i) { last = document.activeElement; show(i); box.hidden = false; document.documentElement.classList.add('lb-on'); box.querySelector('.lb-close').focus(); }
  function close() { box.hidden = true; document.documentElement.classList.remove('lb-on'); big.removeAttribute('src'); if (last) last.focus(); }
  imgs.forEach(function (im, i) {
    im.classList.add('zoomable'); im.tabIndex = 0; im.setAttribute('role', 'button');
    im.addEventListener('click', function () { open(i); });
    im.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); } });
  });
  box.querySelector('.lb-close').onclick = close;
  box.querySelector('.lb-prev').onclick = function () { show(cur - 1); };
  box.querySelector('.lb-next').onclick = function () { show(cur + 1); };
  sc.addEventListener('click', function (e) { if (e.target === sc) close(); });
  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(cur + 1);
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'Tab') { // keep focus inside
      var f = [].slice.call(box.querySelectorAll('button')), k = f.indexOf(document.activeElement);
      e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  var x0 = null, y0 = null;
  sc.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  sc.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) show(cur + (dx < 0 ? 1 : -1));
    x0 = null;
  });
})();

/* Stretch the end glass behind the Next case study panel too */
(function(){
  var n=document.querySelector('.dark-end .next'),c=document.querySelector('.dark-end .close');if(!n||!c)return;
  function s(){c.style.setProperty('--nh',n.offsetHeight+'px')}
  s();addEventListener('resize',s);addEventListener('load',s);
})();

// Copy the icon JSON prompt
(function(){document.querySelectorAll('.tj-copy').forEach(function(b){b.addEventListener('click',function(){var t=b.closest('.tier-json').querySelector('code').textContent;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).catch(function(){var i=document.createElement('textarea');i.value=t;document.body.appendChild(i);i.select();document.execCommand('copy');i.remove()}).finally(function(){b.classList.add('done');b.textContent='Copied';clearTimeout(b._t);b._t=setTimeout(function(){b.classList.remove('done');b.textContent='Copy JSON'},1800)})})})})();

/* Frosted glows: drifting colour fields in coloured sections that have no interactive demo */
(function(){
  var spots=[["--c1","22%","30%","70vw","8vw","6vh","26s"],["--c2","80%","25%","62vw","-10vw","8vh","31s"],["--c3","65%","80%","75vw","7vw","-6vh","23s"],["--c4","95%","60%","48vw","-6vw","10vh","35s"],["--c5","8%","85%","55vw","10vw","-8vh","29s"]];
  document.querySelectorAll(".cs-body section.band").forEach(function(s){
    if(s.querySelector(".wavenote,.avail,button,input"))return;
    var g=document.createElement("div");g.className="glow";g.setAttribute("aria-hidden","true");
    spots.forEach(function(p,i){var e=document.createElement("i");e.style.cssText="--c:var("+p[0]+");--x:"+p[1]+";--y:"+p[2]+";--s:"+p[3]+";--mx:"+p[4]+";--my:"+p[5]+";--d:"+p[6]+";--dl:-"+(i*4)+"s";g.appendChild(e);});
    g.appendChild(document.createElement("b"));
    s.classList.add("has-glow");s.prepend(g);
  });
})();
/* Scandlearn flow analysis: walk a dot through each old flow so the problem plays out (2026-11-17) */
(function(){
  var cards=document.querySelectorAll('.fa-card[data-seq]'); if(!cards.length) return;
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  cards.forEach(function(c){
    var seq; try{seq=JSON.parse(c.getAttribute('data-seq'))}catch(e){return}
    var flow=c.querySelector('.fa-flow'), tag=c.querySelector('.fa-step'), start=tag?tag.textContent:'';
    if(reduce||!flow) return;
    var dot=document.createElement('span'); dot.className='fa-dot'; flow.appendChild(dot);
    c.classList.add('anim');
    var i=0, timer=null, visible=false;
    function go(){
      var s=seq[i];
      if(i===0){c.classList.remove('bub-on');c.classList.add('reset');setTimeout(function(){c.classList.remove('reset')},40)}
      dot.style.left=s[0]+'%'; dot.style.top=s[1]+'%';
      if(tag&&s[2]) tag.textContent=s[2];
      if(s[4]==='b') c.classList.add('bub-on');
      var hold=s[3]||900; i=(i+1)%seq.length;
      if(i===0) setTimeout(function(){c.classList.add('bub-on')},0);
      timer=setTimeout(function(){ if(visible) go(); else timer=null; }, hold);
    }
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){es.forEach(function(e){visible=e.isIntersecting; if(visible&&!timer) go();})},{threshold:.35}).observe(c);
    } else { visible=true; go(); }
  });
})();
/* Scandlearn: interactive global search demo */
(function(){
  var root=document.querySelector('.gs[data-gs]'); if(!root) return;
  var D=JSON.parse(root.getAttribute('data-gs'));
  var TY={t:['Trainings','cap'],m:['Modules','puzzle'],u:['Users','users'],x:['Materials','book']};
  var all=[];['t','m','u','x'].forEach(function(k){D[k].forEach(function(n,i){all.push({k:k,n:n,i:i})})});
  var inp=root.querySelector('input'),tag=root.querySelector('.gs-tag'),list=root.querySelector('.gs-list'),h=root.querySelector('.gs-h'),
      chips=[].slice.call(root.querySelectorAll('.gs-chips button')),kbd=root.querySelector('.gs-kbd'),toast=root.querySelector('.gs-toast');
  var filt=null,act=0,rows=[],recent=['Aviation Security - Cabin','test-image.jpg','Meteorology'],manual=false,visible=false,run=0;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s){return s.replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function hl(n,q){if(!q) return esc(n);var i=n.toLowerCase().indexOf(q.toLowerCase());if(i<0) return esc(n);
    return esc(n.slice(0,i))+'<mark>'+esc(n.slice(i,i+q.length))+'</mark>'+esc(n.slice(i+q.length))}
  function thumb(r){if(r.k==='t') return '<span class="gs-th" style="--n:'+r.i+'"></span>';
    if(r.k==='u') return '<span class="gs-th u">'+r.n.split(' ').map(function(w){return w[0]}).join('')+'</span>';
    return '<span class="gs-th"><span class="ic ic-'+TY[r.k][1]+'"></span></span>'}
  function render(){
    var q=inp.value.trim(),html='';act=0;
    if(!q&&!filt){h.textContent='Recent searches';rows=recent.map(function(n){return {r:true,n:n}});
      html=rows.map(function(r,i){return '<li class="recent" role="option" style="--i:'+i+'"><span class="gs-th"><span class="ic ic-search"></span></span><span class="gs-tt">'+esc(r.n)+'</span><span class="gs-x" aria-hidden="true">×</span></li>'}).join('')}
    else{
      rows=all.filter(function(r){return (!filt||r.k===filt)&&(!q||r.n.toLowerCase().indexOf(q.toLowerCase())>-1)}).slice(0,9);
      h.textContent=q?(rows.length+(rows.length===1?' result':' results')+(filt?' in '+TY[filt][0].toLowerCase():'')):('All '+TY[filt][0].toLowerCase());
      html=rows.length?rows.map(function(r,i){return '<li role="option" style="--i:'+i+'">'+thumb(r)+'<span class="gs-tt">'+hl(r.n,q)+'</span><span class="ic ic-'+TY[r.k][1]+' gs-ty"></span></li>'}).join('')
        :'<li class="gs-empty" style="--i:0;border:0;background:none;cursor:default">Nothing found. Try another word or remove the filter.</li>'}
    list.innerHTML=html;mark();caret()}
  function mark(){[].forEach.call(list.children,function(li,i){li.classList.toggle('act',i===act&&!!rows[i])});
    var a=list.children[act];if(a&&a.scrollIntoView&&a.offsetTop!==undefined){var p=list.parentNode;if(a.offsetTop<p.scrollTop||a.offsetTop+a.offsetHeight>p.scrollTop+p.clientHeight)p.scrollTop=a.offsetTop-40}}
  function setFilt(k){filt=k;chips.forEach(function(c){c.classList.toggle('on',c.dataset.t===k)});
    tag.hidden=!k;if(k){tag.querySelector('b').textContent=TY[k][0];tag.querySelector('.ic').className='ic ic-'+TY[k][1];tag.style.animation='none';tag.offsetWidth;tag.style.animation=''}
    inp.placeholder=k?'Type to search for '+TY[k][0].toLowerCase():'Search everything';render()}
  function open(r){if(!r) return;var n=r.n;if(r.r){inp.value=n;render();return}
    recent=[n].concat(recent.filter(function(x){return x!==n})).slice(0,3);
    toast.textContent='Opening '+n;toast.classList.add('on');clearTimeout(open.t);open.t=setTimeout(function(){toast.classList.remove('on')},1800)}
  var cv=document.createElement('canvas').getContext('2d');
  function caret(){var cs=getComputedStyle(inp);cv.font=cs.fontSize+' '+cs.fontFamily;root.style.setProperty('--cx',Math.min(cv.measureText(inp.value).width+1,inp.clientWidth-2)+'px')}
  // user interaction stops the autoplay
  function takeOver(){if(manual) return;manual=true;run++;root.classList.remove('auto','typing');inp.value='';setFilt(null)}
  root.addEventListener('pointerdown',takeOver);
  inp.addEventListener('focus',function(){takeOver();root.classList.add('open')});
  inp.addEventListener('blur',function(){if(!inp.value&&!filt) root.classList.remove('open')});
  inp.addEventListener('input',render);
  inp.addEventListener('keydown',function(e){
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();var n=rows.length;if(!n) return;act=(act+(e.key==='ArrowDown'?1:n-1))%n;mark()}
    else if(e.key==='Enter'){e.preventDefault();open(rows[act])}
    else if(e.key==='Escape'){if(inp.value){inp.value='';render()}else if(filt)setFilt(null);else inp.blur()}
    else if(e.key==='Backspace'&&!inp.value&&filt){setFilt(null)}});
  chips.forEach(function(c){c.addEventListener('click',function(){takeOver();setFilt(filt===c.dataset.t?null:c.dataset.t);inp.focus({preventScroll:true})})});
  tag.querySelector('button').addEventListener('click',function(e){e.preventDefault();takeOver();setFilt(null);inp.focus({preventScroll:true})});
  list.addEventListener('click',function(e){var li=e.target.closest('li');if(!li) return;var i=[].indexOf.call(list.children,li);
    if(e.target.classList.contains('gs-x')&&rows[i]&&rows[i].r){recent=recent.filter(function(x){return x!==rows[i].n});render();return}
    act=i;mark();open(rows[i])});
  document.addEventListener('keydown',function(e){if((e.metaKey||e.ctrlKey)&&(e.key==='k'||e.key==='K')&&visible){e.preventDefault();
    kbd.classList.add('press');setTimeout(function(){kbd.classList.remove('press')},180);inp.focus({preventScroll:true})}});
  render();
  // autoplay: a scripted search that loops while in view, until the visitor takes over
  function wait(ms,id){return new Promise(function(res,rej){setTimeout(function(){(id===run&&visible&&!manual)?res():rej()},ms)})}
  function press(el,id){el.classList.add('press');return wait(220,id).then(function(){el.classList.remove('press')})}
  function type(s,id){var p=Promise.resolve();root.classList.add('typing');s.split('').forEach(function(ch){p=p.then(function(){return wait(130+Math.random()*90,id)}).then(function(){inp.value+=ch;render()})});return p}
  function erase(id){var p=Promise.resolve();inp.value.split('').forEach(function(){p=p.then(function(){return wait(60,id)}).then(function(){inp.value=inp.value.slice(0,-1);render()})});return p}
  function step(n,id){var p=Promise.resolve();for(var i=0;i<n;i++)p=p.then(function(){return wait(380,id)}).then(function(){act=(act+1)%rows.length;mark()});return p}
  function loop(){if(manual||!visible||reduce) return;var id=++run;
    root.classList.add('auto');inp.value='';setFilt(null);root.classList.remove('open');
    wait(900,id).then(function(){return press(kbd,id)}).then(function(){root.classList.add('open');return wait(900,id)})
    .then(function(){return type('cr',id)}).then(function(){return wait(1500,id)})
    .then(function(){var c=chips[0];c.classList.add('press');return wait(240,id).then(function(){c.classList.remove('press');setFilt('t')})}).then(function(){return wait(1400,id)})
    .then(function(){return erase(id)}).then(function(){return type('low',id)}).then(function(){return wait(1100,id)})
    .then(function(){root.classList.remove('typing');act=0;mark();return wait(500,id)}).then(function(){open(rows[act]);return wait(2600,id)})
    .then(function(){inp.value='';setFilt(null);return type('jack',id)}).then(function(){return wait(1300,id)})
    .then(function(){return erase(id)}).then(function(){root.classList.remove('typing');return wait(1600,id)})
    .then(loop,function(){})}
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){var was=visible;visible=es[0].isIntersecting;if(visible&&!was)loop();else if(!visible)run++},{threshold:.4}).observe(root);
})();
/* Scandlearn: redesigned flow cards light up step by step */
(function(){
  var cards=[].slice.call(document.querySelectorAll('.af-card'));if(!cards.length) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  cards.forEach(function(c){
    var parts=[].slice.call(c.querySelector('.af').children),nodes=parts.filter(function(p){return p.classList.contains('af-n')}),
        pill=c.querySelector('.fa-step'),end=c.getAttribute('data-end'),t=null,on=false;
    function reset(){parts.forEach(function(p){p.classList.remove('on','cur')})}
    function go(i){if(!on) return;
      if(i>=parts.length){nodes[nodes.length-1].classList.remove('cur');pill.textContent=end;t=setTimeout(function(){reset();go(0)},2800);return}
      var p=parts[i];p.classList.add('on');
      if(p.classList.contains('af-n')){parts.forEach(function(q){q.classList.remove('cur')});p.classList.add('cur');pill.textContent='Step '+(nodes.indexOf(p)+1)+' of '+nodes.length}
      t=setTimeout(function(){go(i+1)},p.classList.contains('af-n')?650:180)}
    c.classList.add('anim');
    new IntersectionObserver(function(es){var v=es[0].isIntersecting;if(v&&!on){on=true;reset();go(0)}else if(!v&&on){on=false;clearTimeout(t);reset();pill.textContent=end}},{threshold:.35}).observe(c)});
})();
/* Scandlearn: training list row opens into the editor in place */
(function(){
  var ed=document.querySelector('.ed');if(!ed) return;
  var scr=ed.querySelector('.ed-screen'),ring=ed.querySelector('.ed-ring'),note=ed.querySelector('.ed-note'),manual=false,vis=false,run=0;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  function set(s){ed.setAttribute('data-s',s)}
  function at(x,y){scr.style.setProperty('--x',x+'%');scr.style.setProperty('--y',y+'%')}
  function say(t){note.textContent=t;note.classList.add('on');clearTimeout(say.t);say.t=setTimeout(function(){note.classList.remove('on')},2000)}
  function click(){ring.classList.remove('go');void ring.offsetWidth;ring.classList.add('go')}
  [].forEach.call(ed.querySelectorAll('.ed-ctl button'),function(b){b.addEventListener('click',function(){manual=true;run++;ed.classList.remove('auto');set(b.dataset.s)})});
  function w(ms,id){return new Promise(function(r,j){setTimeout(function(){(id===run&&vis&&!manual)?r():j()},ms)})}
  function loop(){if(manual||!vis||reduce) return;var id=++run;ed.classList.add('auto');set('list');at(72,82);
    w(900,id).then(function(){at(40,31);return w(1100,id)}).then(function(){at(94.8,31);return w(1000,id)})
    .then(function(){click();set('cur');say('Opens in the row. No page change.');return w(3000,id)})
    .then(function(){at(50.1,23.4);return w(1000,id)}).then(function(){click();set('enr');return w(2800,id)})
    .then(function(){at(93.9,23.4);return w(1000,id)}).then(function(){click();set('list');say('Saved. Back in the list.');return w(2400,id)})
    .then(loop,function(){})}
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){var was=vis;vis=es[0].isIntersecting;if(vis&&!was)loop();else if(!vis){run++;ed.classList.remove('auto')}},{threshold:.4}).observe(ed);
})();
/* Header hides on scroll down, returns on scroll up; section tabs sit under it */
(function(){var top=document.querySelector('.top'),html=document.documentElement;if(!top)return;
  var lastY=scrollY;
  function sync(){}
  function onScroll(){var y=scrollY,d=y-lastY;
    if(Math.abs(d)>6){html.classList.toggle('hdr-hide',d>0&&y>top.offsetHeight&&!top.contains(document.activeElement));lastY=y;}
    if(y<=8)html.classList.remove('hdr-hide');sync();}
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',sync);onScroll();})();
