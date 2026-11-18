/* Page background: drifting blobs of liquid glass. Faint slanted hairlines cover the page; each glass blob
   magnifies and bends them, with Goethe edge colours splitting along its rim (warm inside, cool outside).
   Blobs drift slowly, wobble like liquid and lean towards the pointer. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,mobile=matchMedia('(max-width:760px)').matches;
  var cv=document.createElement('canvas');cv.className='glassbg';cv.setAttribute('aria-hidden','true');document.body.prepend(cv);
  var ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,1.5),W,H,thin,bold,GAP=30,SL=.42,M=240;
  function field(alpha,lw){var c=document.createElement('canvas');c.width=(W+M*2)*dpr;c.height=(H+M*2)*dpr;var x=c.getContext('2d');x.scale(dpr,dpr);
    x.strokeStyle='rgba(60,80,135,'+alpha+')';x.lineWidth=lw;var h=H+M*2;
    for(var s=-h*SL-GAP;s<W+M*2+GAP;s+=GAP){x.beginPath();x.moveTo(s+h*SL,0);x.lineTo(s,h);x.stroke()}return c}
  function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;thin=field(.07,1);bold=field(.22,1.4)}
  size();addEventListener('resize',function(){clearTimeout(size.t);size.t=setTimeout(size,150)});
  var B=[],n=mobile?1:2;
  for(var i=0;i<n;i++)B.push({r:(mobile?110:150)+Math.random()*(mobile?30:80),s:Math.random()*100,x:W*(.3+.4*i),y:H*(.35+.3*i),vx:0,vy:0,
    ax:.13+Math.random()*.08,ay:.09+Math.random()*.06});
  var mx=null,my=null;
  addEventListener('pointermove',function(e){if(e.pointerType==='mouse'){mx=e.clientX;my=e.clientY}},{passive:true});
  document.documentElement.addEventListener('pointerleave',function(){mx=my=null});
  function shape(b,t,f){var p=[],N=96;for(var k=0;k<N;k++){var a=k/N*6.2832,
      rr=b.r*f*(1+.07*Math.sin(3*a+t*.6+b.s)+.045*Math.sin(5*a-t*.9+b.s*2)+.03*Math.sin(2*a+t*.4));
      p.push(b.x+Math.cos(a)*rr,b.y+Math.sin(a)*rr*.86)}return p}
  function path(p){var L=p.length;ctx.beginPath();ctx.moveTo((p[L-2]+p[0])/2,(p[L-1]+p[1])/2);for(var k=0;k<L;k+=2){var nx=p[(k+2)%L],ny=p[(k+3)%L];ctx.quadraticCurveTo(p[k],p[k+1],(p[k]+nx)/2,(p[k+1]+ny)/2)}ctx.closePath()}
  var off=0,run=true;
  document.addEventListener('visibilitychange',function(){run=!document.hidden;if(run&&!reduce)requestAnimationFrame(frame)});
  function frame(now){var t=now/1000;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);
    off=((scrollY*.3*SL)%GAP+GAP)%GAP;
    
    B.forEach(function(b,i){
      // drift on a slow figure-eight, pulled gently towards the pointer
      var tx=W*(.5+.38*Math.sin(t*b.ax*.5+b.s)),ty=H*(.5+.32*Math.sin(t*b.ay*.5+b.s*1.7));
      if(mx!==null){var dx=mx-b.x,dy=my-b.y,d=Math.sqrt(dx*dx+dy*dy);if(d<420){var k=(1-d/420);tx+=(mx-tx)*k*.6;ty+=(my-ty)*k*.6}}
      b.vx+=(tx-b.x)*.0025;b.vy+=(ty-b.y)*.0025;b.vx*=.93;b.vy*=.93;b.x+=b.vx;b.y+=b.vy;
      var outer=shape(b,t,1);
      // refraction: nested rings, each magnifying the bold lines a little more towards the centre
      for(var r=0;r<6;r++){var f=1-r*.15,mag=1.08+r*.07;ctx.save();path(shape(b,t,f));ctx.clip();
        if(r===0){ctx.fillStyle='rgba(244,248,253,.55)';ctx.fill()}
        ctx.translate(b.x,b.y);ctx.scale(mag,mag);ctx.translate(-b.x+b.vx*6*r,-b.y);
        ctx.drawImage(bold,-(M-off),-M,W+M*2,H+M*2);ctx.restore()}
      // glass body: light from the top left
      ctx.save();path(outer);ctx.clip();var g=ctx.createRadialGradient(b.x-b.r*.35,b.y-b.r*.45,b.r*.05,b.x,b.y,b.r*1.1);
      g.addColorStop(0,'rgba(255,255,255,.55)');g.addColorStop(.5,'rgba(255,255,255,.12)');g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(b.x-b.r*1.3,b.y-b.r*1.3,b.r*2.6,b.r*2.6);ctx.restore();
      // spectral rim: colour splits only where light hits the edge (top left and bottom right). One conic-gradient stroke per band.
      [[.965,'255,60,40',.5],[.985,'255,214,60',.65],[1.015,'0,229,255',.7],[1.035,'61,91,255',.5],[1.055,'139,0,255',.32]].forEach(function(c){
        var g=ctx.createConicGradient?ctx.createConicGradient(0,b.x,b.y):null;if(!g)return;
        for(var k=0;k<=16;k++){var a=k/16*6.2832,w=Math.pow(Math.abs(Math.cos(a-3.93)),3);g.addColorStop(k/16,'rgba('+c[1]+','+(c[2]*w).toFixed(3)+')')}
        path(shape(b,t,c[0]));ctx.strokeStyle=g;ctx.lineWidth=5;ctx.globalAlpha=.35;ctx.stroke();ctx.lineWidth=2.2;ctx.globalAlpha=1;ctx.stroke()});
      // crisp white edge and a highlight
      path(outer);ctx.strokeStyle='rgba(255,255,255,.9)';ctx.lineWidth=1.4;ctx.stroke();
      ctx.save();path(shape(b,t,.9));ctx.clip();ctx.strokeStyle='rgba(255,255,255,.35)';ctx.lineWidth=14;
      ctx.beginPath();ctx.ellipse(b.x-b.r*.08,b.y-b.r*.05,b.r*.82,b.r*.7,0,3.5,4.6);ctx.stroke();ctx.restore();
      // soft shadow under the blob
      ctx.save();ctx.globalCompositeOperation='destination-over';var sg=ctx.createRadialGradient(b.x,b.y+b.r*.9,0,b.x,b.y+b.r*.9,b.r*1.2);
      sg.addColorStop(0,'rgba(40,50,90,.10)');sg.addColorStop(1,'rgba(40,50,90,0)');ctx.fillStyle=sg;ctx.fillRect(b.x-b.r*1.3,b.y-b.r*.4,b.r*2.6,b.r*2.6);ctx.restore();
    });
    if(run&&!reduce)requestAnimationFrame(frame)}
  requestAnimationFrame(frame);
})();
