/* How I work: fix a broken sign-up form in five steps (spot, understand, remove, redesign, hand off). */
(function(){
  var box=document.querySelector('.pg-box');if(!box)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,el){return (el||box).querySelector(s)},$$=function(s,el){return [].slice.call((el||box).querySelectorAll(s))};
  var stage=$('.fm-stage'),old=$('.fm-old'),neu=$('.fm-new'),an=$('.fa-an'),wand=$('.fa-wand'),tray=$('.qtray'),meter=$('.fmeter'),
      navs=$$('.pg-r'),ask=$('.pg-ask'),fb=$('.pg-fb'),take=$('.pg-take'),next=$('.pg-next');
  var S=[
    {t:'Spot the pain',ask:'A sign-up form like many out there. Hover the highlighted parts to see what’s wrong with each one.',
     take:'Look at the whole journey before fixing any one screen.',next:'Analyze the feedback'},
    {t:'Understand it',ask:'This is what people said. Drag each quote onto the problem it describes, or tap a quote and then the spot.',
     take:'Match what people say to where it happens. That tells you what to fix first.',next:'Remove friction'},
    {t:'Remove friction',ask:'Now cut. Click any part of the form that doesn’t earn its place. Then hit Redesign.',
     take:'Every field you remove is one nobody can get wrong.',next:'Redesign'},
    {t:'Redesign',ask:'Same goal, a fraction of the effort. Rules shown up front, one clear action.',
     take:'Design each step for the moment someone gets it wrong.',next:'Zoom into the details'},
    {t:'Hand off',ask:'Every size, gap and state is specified, so engineers build exactly what was designed.',
     take:'That’s how I work: from pain to pixels.',next:'Play again ↺'}
  ];
  var cur=0,done={};
  function say(t,c){fb.textContent=t||'';fb.className='pg-fb'+(c?' '+c:'')}
  function complete(i,msg){done[i]=1;navs[i].classList.add('done');if(msg)say(msg,'good');take.textContent=S[i].take;take.hidden=false}

  /* ---- state per step ---- */
  function resetForm(){
    $$('.gone',old).forEach(function(e){e.classList.remove('gone')});
    $$('.matched',old).forEach(function(e){e.classList.remove('matched')});
    $$('.pb q',old).forEach(function(q){q.parentNode.removeChild(q)});
    $$('.qc',tray).forEach(function(q){q.hidden=false;q.className='qc';q.style.transform='';delete q.dataset.demo});
  }
  function go(i){cur=i;
    navs.forEach(function(n,k){if(k===i)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current')});
    $('.pg-i').textContent=i+1;$('.pg-t').textContent=S[i].t;ask.textContent=S[i].ask;say('');take.hidden=true;
    next.textContent=S[i].next+(i<4?' →':'');
    if(i===0)resetForm();
    var redesigned=i>=3;old.hidden=redesigned;neu.hidden=!redesigned;
    stage.classList.toggle('on-pain',i<=1);stage.classList.toggle('on-cut',i===2);stage.classList.toggle('on-spec',i===4);
    an.hidden=i!==0;wand.hidden=i!==2;tray.hidden=i!==1;meter.hidden=i!==2;
    $$('.pp.show',old).forEach(function(p){p.classList.remove('show')});
    if(i===1)startQuotes();
    if(i===2)updMeter();
    if(i===3){neu.style.animation='none';void neu.offsetWidth;neu.style.animation=''}
    if(i===3)complete(3);if(i===4){complete(4);spec()}
    if(i===0&&!done[0])say('9 problems. Hover a few, then analyze the feedback.');
  }
  navs.forEach(function(n,i){n.addEventListener('click',function(){go(i)})});
  next.addEventListener('click',function(){
    if(cur===4){done={};navs.forEach(function(n){n.classList.remove('done')});go(0);return}
    if(cur===0)complete(0);go(cur+1)});
  an.addEventListener('click',function(){complete(0);go(1)});
  wand.addEventListener('click',function(){complete(2);go(3)});

  /* ---- step 5: redlines measured from the real redesign, so every number is true to the build ---- */
  function spec(){var sp=$('.spec',neu);sp.innerHTML='';
    var btn=$('.fn-btn',neu),pw=$('.fn-pw',neu),pwi=$('.fn-pw .fi',neu);
    function mk(cls,x,y,w,h,label){var m=document.createElement('span');m.className='sm '+cls;m.style.left=x+'px';m.style.top=y+'px';
      if(w)m.style.width=w+'px';if(h)m.style.height=h+'px';m.innerHTML='<b>'+label+'</b>';sp.appendChild(m)}
    var bx=btn.offsetLeft,by=btn.offsetTop,bw=btn.offsetWidth,bh=btn.offsetHeight;
    var iy=pw.offsetTop+pwi.offsetTop,ih=pwi.offsetHeight,gap=by-(pw.offsetTop+pw.offsetHeight);
    var r=parseFloat(getComputedStyle(btn).borderTopLeftRadius);
    mk('v',bx+bw+8,by,0,bh,bh);
    mk('v',bx+bw+8,iy,0,ih,ih);
    if(gap>4)mk('v',bx+bw/2,by-gap,0,gap,gap);
    mk('h',0,by+bh/2,bx,0,bx);
    mk('t',bx+2,by-16,0,0,'radius '+r);
    mk('t',bx+bw+8,by+bh+8,0,0,'Geist 16 / 600');
    mk('t',bx,neu.offsetHeight+8,0,0,'<i></i>#3D5BFF');
    mk('t',bx+bw-176,neu.offsetHeight+8,0,0,'Default · Hover · Pressed · Loading');
  }

  /* ---- step 1: pins and bubbles (tap on touch) ---- */
  $$('.pp',old).forEach(function(p){p.addEventListener('click',function(e){e.stopPropagation();var on=!p.classList.contains('show');
    $$('.pp.show',old).forEach(function(o){o.classList.remove('show')});p.classList.toggle('show',on)})});

  /* ---- step 2: quotes onto pain points ---- */
  var sel=null;
  function target(n){return $('[data-p="'+n+'"]',old)}
  function match(q,el){var n=q.dataset.to;
    if(el.dataset.p!==n){q.classList.remove('shake');void q.offsetWidth;q.classList.add('shake');say('That quote is about something else. Try another spot.','bad');return false}
    $$('[data-p="'+n+'"]',old).forEach(function(e){e.classList.add('matched')});
    var pb=$('.pb',target(n));if(pb&&!$('q',pb)){var z=document.createElement('q');z.textContent=q.textContent.replace(/[“”]/g,'');pb.appendChild(z)}
    q.hidden=true;q.classList.remove('sel');sel=null;
    var left=$$('.qc',tray).filter(function(x){return !x.hidden}).length;
    if(!left)complete(1,'All six matched. Three problems nobody mentioned, but they still cost people time.');
    else say(left+' to go.');
    return true}
  function fly(q,el,cb){var a=q.getBoundingClientRect(),b=el.getBoundingClientRect();q.classList.add('fly');
    q.style.transform='translate('+(b.left+b.width/2-a.left-a.width/2)+'px,'+(b.top+b.height/2-a.top-a.height/2)+'px) scale(.6)';
    setTimeout(function(){q.classList.remove('fly');q.style.transform='';cb()},reduce?0:1000)}
  function startQuotes(){var first=$$('.qc',tray).filter(function(x){return !x.hidden})[0];
    if(!first||done[1]||first.dataset.demo)return;first.dataset.demo=1;
    setTimeout(function(){if(cur!==1)return;say('Like this one:');
      fly(first,target(first.dataset.to),function(){match(first,target(first.dataset.to));say('Your turn: drag the rest.')})},reduce?0:900)}
  $$('.qc',tray).forEach(function(q){var sx,sy,drag=false,over=null;
    q.addEventListener('pointerdown',function(e){sx=e.clientX;sy=e.clientY;drag=false;q.setPointerCapture(e.pointerId)});
    q.addEventListener('pointermove',function(e){if(sx===undefined)return;var dx=e.clientX-sx,dy=e.clientY-sy;
      if(!drag&&Math.abs(dx)+Math.abs(dy)>6){drag=true;q.classList.add('drag')}
      if(!drag)return;q.style.transform='translate('+dx+'px,'+dy+'px)';
      q.style.pointerEvents='none';var t=document.elementFromPoint(e.clientX,e.clientY);q.style.pointerEvents='';
      t=t&&t.closest?t.closest('.fm-old [data-p]'):null;
      if(over&&over!==t)over.classList.remove('drop-over');over=t;if(t)t.classList.add('drop-over')});
    q.addEventListener('pointerup',function(){if(sx===undefined)return;sx=undefined;
      if(drag){q.classList.remove('drag');q.style.transform='';if(over){over.classList.remove('drop-over');match(q,over)}over=null;q._skip=true}});
    q.addEventListener('click',function(){if(q._skip){q._skip=false;return}
      $$('.qc',tray).forEach(function(o){if(o!==q)o.classList.remove('sel')});
      q.classList.toggle('sel');sel=q.classList.contains('sel')?q:null;
      if(sel)say('Now tap the spot in the form it’s about.')})});

  /* ---- step 3: remove parts of the form ---- */
  function cuts(){return $$('[data-rm].gone',old).length}
  function updMeter(){var n=cuts(),total=$$('[data-rm]',old).length,sec=Math.round(270-n*(220/total));
    $('.fm-t').textContent=Math.floor(sec/60)+':'+('0'+sec%60).slice(-2);
    $('.fmeter em').style.width=(sec/270*100)+'%';
    $('.fm-n').textContent=n+' of '+total+' parts removed';wand.disabled=n<3}
  old.addEventListener('click',function(e){
    if(cur===1){if(sel&&!e.target.closest('.pp')){var t=e.target.closest('[data-p]');if(t)match(sel,t)}return}
    if(cur!==2)return;var el=e.target.closest('[data-rm]');if(!el||el.classList.contains('gone'))return;
    if(el.dataset.p==='1')$$('[data-p="1"]',old).forEach(function(x){x.classList.add('gone')});else el.classList.add('gone');
    updMeter();var n=cuts();
    say(n<3?'Keep cutting. '+(3-n)+' more to unlock Redesign.':'Redesign is ready when you are.',n<3?'':'good');
    if(n>=3&&!done[2])complete(2)});

  go(0);
})();
