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
