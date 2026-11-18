/* Page background: faint aurora curtains. Each curtain is a wavy band of vertical light rays that ripple,
   shimmer and slowly fade in and out at random places; rays brighten a little near the pointer.
   Drawn on a low-res canvas and scaled up, so it stays soft and cheap. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=matchMedia('(max-width:760px)').matches;
  var cv=document.createElement('canvas');cv.className='aurora';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
  var ctx=cv.getContext('2d'),K=.33,W,H,w,h;
  function size(){W=innerWidth;H=innerHeight;w=Math.ceil(W*K);h=Math.ceil(H*K);cv.width=w;cv.height=h}
  size();addEventListener('resize',size);
  // one ray sprite per palette: bright foot, colour body, fading top (Goethe edge colours)
  function ray(stops){var c=document.createElement('canvas');c.width=1;c.height=128;var x=c.getContext('2d'),g=x.createLinearGradient(0,128,0,0);
    stops.forEach(function(s){g.addColorStop(s[0],s[1])});x.fillStyle=g;x.fillRect(0,0,1,128);return c}
  var P=[ray([[0,'rgba(0,229,255,0)'],[.06,'rgba(120,255,240,.9)'],[.3,'rgba(61,91,255,.55)'],[.7,'rgba(139,0,255,.25)'],[1,'rgba(139,0,255,0)']]),
         ray([[0,'rgba(255,229,81,0)'],[.06,'rgba(255,229,81,.8)'],[.3,'rgba(255,106,61,.4)'],[.7,'rgba(139,0,255,.2)'],[1,'rgba(139,0,255,0)']]),
         ray([[0,'rgba(61,91,255,0)'],[.06,'rgba(0,229,255,.85)'],[.4,'rgba(61,91,255,.4)'],[1,'rgba(61,91,255,0)']])];
  var N=mobile?2:3,cs=[],mx=-1e4,my=-1e4;
  function spawn(c,now,first){c.cx=Math.random()*w;c.cy=h*(.25+Math.random()*.6);c.len=w*(.35+Math.random()*.35);
    c.ht=h*(.18+Math.random()*.22);c.ang=-.35+Math.random()*.25;c.pal=P[Math.random()<.2?1:Math.random()<.5?2:0];
    c.t0=now-(first?Math.random()*14000:0);c.life=16000+Math.random()*10000;c.s=Math.random()*100;c.par=.08+Math.random()*.12;return c}
  var now0=performance.now();for(var i=0;i<N;i++)cs.push(spawn({},now0,true));
  addEventListener('pointermove',function(e){mx=e.clientX*K;my=e.clientY*K},{passive:true});
  document.documentElement.addEventListener('pointerleave',function(){mx=my=-1e4});
  var run=true;document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run&&!reduce)requestAnimationFrame(frame)});
  function frame(now){ctx.clearRect(0,0,w,h);var t=now/1000,sy=scrollY*K;ctx.globalCompositeOperation='lighter';
    cs.forEach(function(c){var a=(now-c.t0)/c.life;if(a>=1){spawn(c,now);a=0}
      var life=Math.pow(Math.sin(Math.PI*a),1.6);
      var oy=((c.cy-sy*c.par)%(h*1.5)+h*1.5)%(h*1.5)-h*.25, ca=Math.cos(c.ang),sa=Math.sin(c.ang),step=mobile?2:1.5,n=c.len/step;
      for(var k=0;k<n;k++){var u=k/n,s=(u-.5)*c.len;
        var wave=Math.sin(u*6.3+t*.35+c.s)*c.ht*.35+Math.sin(u*17+t*.9+c.s*2)*c.ht*.08;
        var x=c.cx+s*ca-wave*sa*.2, y=oy+s*sa+wave;
        var env=Math.pow(Math.sin(Math.PI*u),1.5);
        var shim=.45+.35*Math.sin(u*40-t*1.6+c.s)+.2*Math.sin(u*93+t*2.7);
        var dx=x-mx,dy=y-my,near=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/(70*K*3));
        var al=life*env*Math.max(0,shim)*(1+near*.8)*.5;if(al<.01)continue;
        var rh=c.ht*(.7+.3*Math.sin(u*11+t*.5+c.s));
        ctx.globalAlpha=Math.min(1,al);ctx.drawImage(c.pal,x,y-rh,step*1.2,rh+2)}});
    ctx.globalAlpha=1;
    if(run&&!reduce)requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
})();
