/* How I work: a one-minute game in five rounds. Fix a broken sign-up the way Genc would. */
(function(){
  var box=document.querySelector('.pg-box');if(!box)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,el){return (el||box).querySelector(s)},$$=function(s,el){return [].slice.call((el||box).querySelectorAll(s))};
  var navs=$$('.pg-r'),views=$$('[data-show]'),ask=$('.pg-ask'),fb=$('.pg-fb'),take=$('.pg-take'),next=$('.pg-next'),skip=$('.pg-skip');
  var R=[
    {t:'Spot the pain',ask:'20 people are trying to sign up. Watch them, then tap the spot where they get stuck.',
     take:'Watch where people stall before deciding what to fix.'},
    {t:'Understand it',ask:'This is what they told you. Drag each quote into a theme, or tap a quote and then a theme.',
     take:'Group what people say into a few themes. Fix the theme, not the loudest quote.'},
    {t:'Map the steps',ask:'The sign-up has 9 steps. Tap the ones that don’t earn their place.',
     take:'Cut steps on paper first. A step you remove is a step nobody can fail.'},
    {t:'Design each step',ask:'Same password field, two designs. Which one would you ship?',
     take:'Design each step for the moment someone gets it wrong.'},
    {t:'Deliver',ask:'The new sign-up is ready. Ship it and watch the same 20 people.',
     take:'Ship it, then measure. That’s how I work.'}
  ];
  var cur=0,done=[];
  function say(t,cls){fb.textContent=t||'';fb.className='pg-fb'+(cls?' '+cls:'')}
  function finish(msg){done[cur]=1;navs[cur].classList.add('done');say(msg,'good');take.textContent=R[cur].take;take.hidden=false;
    next.hidden=false;next.textContent=cur===4?'Play again ↺':'Next round →';skip.hidden=true;}
  function show(i){cur=i;sim.stop();
    navs.forEach(function(n,k){if(k===i)n.setAttribute('aria-current','step');else n.removeAttribute('aria-current')});
    views.forEach(function(v){v.hidden=v.dataset.show.split(' ').indexOf(String(i))<0});
    $('.pg-i').textContent=i+1;$('.pg-t').textContent=R[i].t;ask.textContent=R[i].ask;say('');take.hidden=true;next.hidden=true;skip.hidden=false;
    skip.textContent=i===4?'Ship it':'Skip';
    ({0:r1,1:r2,2:r3,3:r4,4:r5})[i]();}
  navs.forEach(function(n,i){n.addEventListener('click',function(){show(i)})});
  next.addEventListener('click',function(){if(cur===4){done=[];navs.forEach(function(n){n.classList.remove('done')});show(0)}else show(cur+1)});
  skip.addEventListener('click',function(){if(cur===4)ship();else show(cur+1)});

  /* ---- simulated users on the sign-up screen ---- */
  var scr=$('.scr'),layer=$('.scr-dots'),cnt=$('.sc-n');
  var sim=(function(){var dots=[],raf=0,timer=0,mode='before',fin=0,onEnd=null,running=false;
    function zoneY(z){var e=$('[data-zone="'+z+'"]',scr);return [e.offsetTop,e.offsetTop+e.offsetHeight]}
    function start(m,cb){stop();mode=m;onEnd=cb;fin=0;cnt.textContent='0';running=true;layer.innerHTML='';dots=[];
      var W=scr.clientWidth,ck=zoneY('checks'),fl=zoneY('fields'),bt=zoneY('button'),n=20;
      var stuck=m==='before'?pick(n,13):[],drop=m==='after'?pick(n,2):[];
      for(var i=0;i<n;i++){var el=document.createElement('i');layer.appendChild(el);
        var d={el:el,x:24+Math.random()*(W-48),y:-10,v:(m==='after'?1.6:1.3)+Math.random()*.5,t0:i*(reduce?0:(m==='after'?110:200)),
          stop:stuck.indexOf(i)>=0?ck[0]+8+Math.random()*(ck[1]-ck[0]-16):drop.indexOf(i)>=0?fl[0]+Math.random()*(fl[1]-fl[0]):null,
          gone:drop.indexOf(i)>=0,end:bt[1]+6,st:0};
        dots.push(d)}
      var t0=performance.now();
      (function f(now){var all=true;
        dots.forEach(function(d){if(now-t0<d.t0){all=false;return}
          if(d.st===0){d.y+=reduce?999:d.v*2;
            if(d.stop!==null&&d.y>=d.stop){d.y=d.stop;d.st=d.gone?3:1;d.el.className=d.gone?'gone':'stuck'}
            else if(d.y>=d.end){d.y=d.end;d.st=2;d.el.className='fin';fin++;cnt.textContent=fin}
            else all=false}
          var jx=d.st===1&&!reduce?Math.sin(now/90+d.x)*2:0;
          d.el.style.transform='translate('+(d.x+jx).toFixed(1)+'px,'+d.y.toFixed(1)+'px)'});
        if(all&&running){running=false;if(onEnd)onEnd(fin);if(mode==='before'&&!reduce)timer=setTimeout(function(){if(cur===0&&!done[0])start('before')},2600)}
        if(dots.some(function(d){return d.st===1})||!all)raf=requestAnimationFrame(f)})(t0)}
    function pick(n,k){var a=[];while(a.length<k){var r=Math.floor(Math.random()*n);if(a.indexOf(r)<0)a.push(r)}return a}
    function stop(){cancelAnimationFrame(raf);clearTimeout(timer);running=false}
    return {start:start,stop:stop}})();

  function r1(){scr.classList.remove('clean');$('.pg-scr').classList.remove('found');
    var io=new IntersectionObserver(function(es){if(es[0].isIntersecting){io.disconnect();if(cur===0)sim.start('before')}},{threshold:.4});io.observe(scr);}
  scr.addEventListener('click',function(e){if(cur!==0||done[0])return;var z=e.target.closest('[data-zone]');z=z&&z.dataset.zone;
    if(z==='checks'){$('.pg-scr').classList.add('found');finish('Right. Three checkboxes nobody understands, right before the button.')}
    else say('They get past that part. Watch where the dots pile up.','bad')});

  /* ---- round 2: sort quotes ---- */
  var sel=null,chips=$$('.q-chip'),pool=$('.q-pool'),bins=$$('.q-bin');
  function r2(){chips.forEach(function(c){pool.appendChild(c);c.disabled=false;c.className='q-chip';c.style.transform=''});sel=null}
  function place(c,b){if(c.dataset.t===b.dataset.t){$('div',b).appendChild(c);c.disabled=true;c.classList.remove('sel');c.classList.add('in');sel=null;
      if(!pool.querySelector('.q-chip'))finish('Two themes: it takes too long, and people don’t trust it with their data.');else say('')}
    else{c.classList.remove('shake');void c.offsetWidth;c.classList.add('shake');say('Not quite. Read it again: is it about time or about trust?','bad')}}
  chips.forEach(function(c){var sx,sy,drag=false;
    c.addEventListener('pointerdown',function(e){if(c.disabled)return;sx=e.clientX;sy=e.clientY;drag=false;c.setPointerCapture(e.pointerId)});
    c.addEventListener('pointermove',function(e){if(sx===undefined||c.disabled)return;var dx=e.clientX-sx,dy=e.clientY-sy;
      if(!drag&&Math.abs(dx)+Math.abs(dy)>6){drag=true;c.classList.add('drag')}
      if(drag){c.style.transform='translate('+dx+'px,'+dy+'px)';bins.forEach(function(b){var r=b.getBoundingClientRect();b.classList.toggle('over',e.clientX>r.left&&e.clientX<r.right&&e.clientY>r.top&&e.clientY<r.bottom)})}});
    c.addEventListener('pointerup',function(e){if(sx===undefined)return;sx=undefined;
      if(drag){c.classList.remove('drag');c.style.transform='';var hit=bins.filter(function(b){return b.classList.contains('over')})[0];bins.forEach(function(b){b.classList.remove('over')});if(hit)place(c,hit);c._skip=true}});
    c.addEventListener('click',function(){if(c._skip){c._skip=false;return}if(c.disabled)return;
      chips.forEach(function(o){if(o!==c)o.classList.remove('sel')});c.classList.toggle('sel');sel=c.classList.contains('sel')?c:null;
      if(sel)say('Now tap a theme.')})});
  bins.forEach(function(b){b.addEventListener('click',function(e){if(sel)place(sel,b)})});

  /* ---- round 3: cut steps ---- */
  var steps=$$('.f-step'),ft=$('.f-t'),fm=$('.f-meter em');
  function upd(){var n=steps.filter(function(s){return s.classList.contains('cut')}).length,sec=270-n*38;
    ft.textContent=Math.floor(sec/60)+':'+('0'+sec%60).slice(-2);fm.style.width=(sec/270*100)+'%';return n}
  function r3(){steps.forEach(function(s){s.classList.remove('cut','keep');s.disabled=false});upd()}
  steps.forEach(function(s){s.addEventListener('click',function(){if(done[2])return;
    if(s.dataset.cut==='1'){s.classList.add('cut');s.disabled=true;var n=upd();
      if(n===5)finish('Down to 4 steps. Phone, SMS and the survey questions can come later, or never.');else say(5-n+' more to cut.')}
    else{s.classList.remove('keep');void s.offsetWidth;s.classList.add('keep');say('Keep that one. Sign-up can’t work without it.','bad')}})});

  /* ---- round 4: pick a design ---- */
  var opts=$$('.v-opt');
  function r4(){opts.forEach(function(o){o.classList.remove('pick','win','lose');o.disabled=false})}
  opts.forEach(function(o){o.addEventListener('click',function(){opts.forEach(function(x){x.disabled=true;x.classList.add(x.dataset.ok==='1'?'win':'lose')});o.classList.add('pick');
    finish(o.dataset.ok==='1'?'Yes. B shows the rules before anyone fails them.':'Most people trip on A: it only explains the rules after they fail. B shows them up front.')})});

  /* ---- round 5: ship ---- */
  function r5(){scr.classList.add('clean');$('.pg-scr').classList.remove('found');layer.innerHTML='';cnt.textContent='0'}
  function ship(){skip.hidden=true;say('Shipping…');sim.start('after',function(n){finish('Before: 7 of 20 finished. After: '+n+' of 20. (Simulated people, real habit.)')})}

  show(0);
})();
