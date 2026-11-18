/* Page background: spectral light streaks (like the hero lines) that drift in and out here and there, and lean towards the pointer. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cv=document.createElement('canvas');cv.className='aurora';cv.setAttribute('aria-hidden','true');
  document.body.prepend(cv);var ctx=cv.getContext('2d');
  var W,H,dpr=Math.min(devicePixelRatio||1,1.5),mobile=matchMedia('(max-width:760px)').matches;
  function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  size();addEventListener('resize',size);
  // one pre-blurred streak sprite: a curved line with Goethe edge colours and a soft white glow
  function sprite(flip){var s=document.createElement('canvas'),w=260,h=900;s.width=w;s.height=h;var c=s.getContext('2d');
    function arc(off,col,lw){c.beginPath();c.moveTo(200+off,20);c.bezierCurveTo(150+off,300,90+off,560,40+off,880);c.strokeStyle=col;c.lineWidth=lw;c.lineCap='round';c.stroke()}
    c.filter='blur(14px)';arc(-30,'rgba(255,255,255,.9)',46);
    c.filter='blur(3px)';
    var cols=flip?['#ff6a3d','#ffe551','#00e5ff','#3d5bff','#8b00ff']:['#8b00ff','#3d5bff','#00e5ff','#a8ffef','#ffffff'];
    cols.forEach(function(col,i){arc(i*4,col,i===2?5:4)});
    // fade both ends
    c.filter='none';c.globalCompositeOperation='destination-in';var g=c.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(.25,'#000');g.addColorStop(.7,'#000');g.addColorStop(1,'rgba(0,0,0,0)');c.fillStyle=g;c.fillRect(0,0,w,h);return s}
  var S=[sprite(false),sprite(true)];
  var N=mobile?3:6,streaks=[],mx=-1e4,my=-1e4,t0=performance.now();
  function spawn(st,now,first){st.x=Math.random()*W;st.y=Math.random()*H*1.1-H*.3;st.sc=.5+Math.random()*.7;st.sp=S[Math.random()<.3?1:0];
    st.born=now-(first?Math.random()*9000:0);st.life=9000+Math.random()*7000;st.ph=Math.random()*6.28;st.lean=0;st.par=.15+Math.random()*.25;return st}
  for(var i=0;i<N;i++)streaks.push(spawn({},t0,true));
  addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY},{passive:true});
  addEventListener('pointerleave',function(){mx=my=-1e4});
  var run=true;document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run)requestAnimationFrame(frame)});
  function frame(now){ctx.clearRect(0,0,W,H);var sy=scrollY;
    streaks.forEach(function(st){var a=(now-st.born)/st.life;if(a>=1){spawn(st,now);a=0}
      var alpha=Math.sin(Math.PI*a);alpha*=alpha;
      var y=((st.y-sy*st.par)%(H*1.4)+H*1.4)%(H*1.4)-H*.35,x=st.x+Math.sin(now/4000+st.ph)*24;
      var dx=mx-x,dy=my-(y+st.sc*450),d=Math.sqrt(dx*dx+dy*dy),near=Math.max(0,1-d/380);
      st.lean+=((near?dx/380*near*.35:0)-st.lean)*.06;
      ctx.save();var pg=y+st.sc*450+sy,k=Math.max(.2,Math.min(1,(pg-300)/700));ctx.globalAlpha=Math.min(1,alpha*k*(.55+near*.6));ctx.translate(x,y);ctx.transform(1,0,st.lean,1,0,0);ctx.scale(st.sc,st.sc);
      ctx.drawImage(st.sp,-130,0);ctx.restore()});
    if(run&&!reduce)requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
})();
