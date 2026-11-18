/* How I work: an AI-drafted contact form, fixed by the "Genc" cursor. It ends as a working contact form.
   Autoplays once when scrolled into view; visitors can replay, hunt the problems themselves, toggle
   AI Draft / Genc's Cut, or skip straight to the message form. */
(function(){
  var ag=document.querySelector('.ag');if(!ag)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $=function(s,el){return (el||ag).querySelector(s)},$$=function(s,el){return [].slice.call((el||ag).querySelectorAll(s))};
  var card=$('.ag-card'),form=$('.ai'),gc=$('.gc'),say=$('.gc-say'),hud=$('.ag-hud'),pt=$('.ag-pt'),bin=$('.ag-bin'),
      togs=$$('.ag-v'),hunt=$('.ag-hunt'),replay=$('.ag-replay'),skip=$('.ag-skip'),ht=$('.ai-ht'),bt=$('.ai-bt');
  var sub=$('.ai-s'),nm=$('.ai-f .ai-l'),AI_S=sub.textContent,AI_N=nm.textContent,G_S='It goes straight to my inbox.',AI_H=ht.textContent,AI_B=bt.textContent,G_H='Tell me what you’re building.',G_B='Send message →';
  var PROMPT='Make a contact form for my portfolio';
  /* the eight fixes, in play order; hot = which marked parts of the draft belong to each problem */
  var F=[
    {hot:'3',say:'Five social buttons. Nobody came here to follow me.',run:function(){gone($$('[data-hot="3"]'))}},
    {hot:'4',say:'Say something real.',run:function(){form.classList.add('f4');typeTo(ht,G_H);sub.textContent=G_S}},
    {hot:'5',say:'Grey on white fails contrast.',run:function(){form.classList.add('f5')}},
    {hot:'1',say:'Labels, not placeholders.',run:function(){form.classList.add('f1')}},
    {hot:'2',say:'Cut 7 fields AI invented.',run:function(){var c=$$('[data-cut]');c.forEach(function(e){e.classList.add('lift')});
      bin.classList.add('on');setTimeout(function(){c.forEach(function(e){e.classList.remove('lift')});gone(c);nm.textContent='Name';bin.classList.add('bump');
      setTimeout(function(){bin.classList.remove('bump','on')},500)},reduce?0:420)}},
    {hot:'6',say:'Pre-ticked newsletter? Never.',run:function(){gone($$('[data-hot="6"]'))}},
    {hot:'7',say:'Give the message room.',run:function(){form.classList.add('f7')}},
    {hot:'8',say:'One clear action.',run:function(){form.classList.add('f8');bt.textContent=G_B}}
  ];
  var done={},timers=[],mode='idle',found=0;
  function later(fn,ms){var t=setTimeout(fn,reduce?0:ms);timers.push(t);return t}
  function stop(){timers.forEach(clearTimeout);timers=[];gc.classList.remove('on');say.classList.remove('on');$$('.hint').forEach(function(e){e.classList.remove('hint')})}
  function gone(els){els.forEach(function(e){e.classList.add('gone')})}
  function typeTo(el,txt){if(reduce){el.textContent=txt;return}var i=0;el.textContent='';(function s(){el.textContent=txt.slice(0,++i);if(i<txt.length)later(s,28)})()}
  function setTog(v){togs.forEach(function(b){b.setAttribute('aria-pressed',b.dataset.v===v)})}
  function inputs(on){$$('input,textarea,button.ai-b',form).forEach(function(e){if(on){e.removeAttribute('readonly');e.removeAttribute('tabindex')}else{e.setAttribute('tabindex','-1');if(e.tagName!=='BUTTON')e.setAttribute('readonly','')}})}
  function hudSay(t,good){hud.textContent=t;hud.className='ag-hud'+(good?' good':'')}

  function draft(){stop();mode='idle';done={};found=0;card.classList.remove('hunt');
    form.className='ai';ht.textContent=AI_H;sub.textContent=AI_S;nm.textContent=AI_N;bt.textContent=AI_B;
    $$('.gone,.found,.lift').forEach(function(e){e.classList.remove('gone','found','lift')});
    inputs(false);setTog('ai');hudSay('');$('.ai-done').hidden=true}
  function final(msg){stop();mode='done';card.classList.remove('hunt');
    F.forEach(function(f,i){done[i]=1});$$('.lift').forEach(function(e){e.classList.remove('lift')});
    $$('.found').forEach(function(e){e.classList.toggle('found',false)});
    ht.textContent=G_H;sub.textContent=G_S;nm.textContent='Name';bt.textContent=G_B;form.classList.add('f1','f4','f5','f7','f8','clean');gone($$('[data-cut],[data-hot="3"],[data-hot="6"]'));
    bin.classList.remove('on');inputs(true);setTog('genc');hudSay(msg||'Genc’s Cut. It’s a real form now: send me a message.',true)}

  /* cursor helpers: positions are relative to the card */
  function point(el,dx,dy){var a=card.getBoundingClientRect(),b=el.getBoundingClientRect(),x=b.left-a.left+(dx==null?b.width*.7:dx);
    gc.classList.toggle('flip',x>a.width-190);
    gc.style.transform='translate('+x+'px,'+(b.top-a.top+(dy==null?b.height*.45:dy))+'px)';gc.classList.add('on')}
  function beat(i,cb){var f=F[i],el=$('[data-hot="'+f.hot+'"]:not(.gone)')||form;
    say.classList.remove('on');point(el);
    later(function(){say.textContent=f.say;say.classList.add('on');f.run();done[i]=1;
      later(cb||function(){},1150)},560)}

  /* autoplay: prompt types, the draft appears, then Genc fixes it beat by beat */
  function play(){draft();mode='play';card.classList.add('pre');pt.textContent='';hudSay('');
    var i=0;(function t(){pt.textContent=PROMPT.slice(0,++i);if(i<PROMPT.length)later(t,32);else later(gen,350)})()}
  function gen(){card.classList.remove('pre');hudSay('Looks done. Is it?');
    later(function(){hudSay('');gc.style.transform='translate(110%,-30px)';gc.classList.add('on');var k=0;
      (function next(){if(k<F.length)beat(k++,next);else later(function(){form.classList.add('clean');final()},400)})()},1300)}

  /* hunt: visitors click the problems; each catch is fixed by the cursor */
  function startHunt(){draft();mode='hunt';card.classList.add('hunt');hudSay('Find what’s wrong. Click anything that bothers you. 0 of 8 found.');
    later(hint,15000)}
  function hint(){if(mode!=='hunt')return;var i=F.findIndex(function(f,k){return !done[k]});if(i<0)return;
    var el=$('[data-hot="'+F[i].hot+'"]:not(.gone)');if(el){el.classList.remove('hint');void el.offsetWidth;el.classList.add('hint')}later(hint,9000)}
  form.addEventListener('click',function(e){if(mode!=='hunt')return;e.preventDefault();
    var h=e.target.closest('[data-hot]');var i=h?F.findIndex(function(f){return f.hot===h.dataset.hot}):-1;
    if(i<0||done[i]){hudSay(i<0?'Nothing wrong there. Keep looking.':'Already fixed. Keep looking.');return}
    found++;h.classList.add('found');beat(i,function(){if(found>=F.length){form.classList.add('clean');final('You found all 8. That’s the job. Now send me a message.')}});
    hudSay('Found '+found+' of 8.',true)});

  /* the finished form sends a message: opens the visitor's email app, prefilled */
  form.addEventListener('submit',function(e){e.preventDefault();if(mode!=='done')return;
    var n=form.name.value.trim(),m=form.email.value.trim(),t=form.message.value.trim(),out=$('.ai-done');
    if(!n||!/.+@.+\..+/.test(m)||!t){out.hidden=false;out.style.color='#d4471c';out.textContent='Add your name, a valid email and a message.';return}
    var body=t+'\n\n'+n+' ('+m+')';
    location.href='mailto:gencberisha3@gmail.com?subject='+encodeURIComponent('Portfolio message from '+n)+'&body='+encodeURIComponent(body);
    out.hidden=false;out.style.color='';out.textContent='Opening your email app… Thanks, '+n+'!'});

  togs.forEach(function(b){b.addEventListener('click',function(){if(b.dataset.v==='ai'){draft();form.classList.remove('clean')}else final()})});
  replay.addEventListener('click',play);
  hunt.addEventListener('click',startHunt);
  skip.addEventListener('click',function(){final()});

  draft();
  if(reduce){final();return}
  var io=new IntersectionObserver(function(es){if(es[0].isIntersecting&&mode==='idle'){io.disconnect();play()}},{threshold:.45});
  io.observe(card);
})();
