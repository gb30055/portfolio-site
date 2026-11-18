/* Hero: a liquid glass lens that follows the pointer over the hero lines. Each pixel under the lens is
   resampled with barrel magnification, and red, green and blue bend by different amounts, so the lines
   split into edge colours towards the rim. Idle (and on touch) the lens drifts slowly on its own. */
(function(){
  var band=document.querySelector('.hero-band');if(!band||matchMedia('(max-width:760px)').matches)return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var img=new Image();img.src='assets/hero-top.webp';
  var cv=document.createElement('canvas');cv.className='h-lens';band.appendChild(cv);
  var ctx=cv.getContext('2d'),dpr=Math.min(devicePixelRatio||1,2),W,H=420,R,S,SW,SH,out,px=null,py=null,lx,ly,vis=true,raf=0,t0=performance.now();
  function setup(){if(!img.complete||!img.naturalWidth)return;
    W=band.offsetWidth;R=W<760?78:118;
    var c=document.createElement('canvas');SW=Math.round(W*dpr);SH=Math.round(H*dpr);c.width=SW;c.height=SH;var x=c.getContext('2d');
    var sc=Math.max(W/img.naturalWidth,H/img.naturalHeight),iw=img.naturalWidth*sc,ih=img.naturalHeight*sc;
    x.scale(dpr,dpr);x.drawImage(img,(W-iw)/2,0,iw,ih);S=x.getImageData(0,0,SW,SH).data;
    var D=Math.round(R*2*dpr);cv.width=cv.height=D;cv.style.width=cv.style.height=R*2+'px';out=ctx.createImageData(D,D);
    if(lx===undefined){lx=W*.72;ly=H*.38}
    draw()}
  img.onload=setup;addEventListener('resize',function(){clearTimeout(setup.t);setup.t=setTimeout(setup,150)});
  function draw(){if(!S)return;var D=cv.width,r=D/2,cx=lx*dpr,cy=ly*dpr,o=out.data;
    cv.style.transform='translate('+(lx-R)+'px,'+(ly-R)+'px)';
    for(var j=0;j<D;j++){var dy=j-r;for(var i=0;i<D;i++){var dx=i-r,q=(dx*dx+dy*dy)/(r*r),k=(j*D+i)*4;
      if(q>=1){o[k+3]=0;continue}
      var base=.55+.45*q*q, sp=.14*q*q;                       // magnify the centre, split colours near the rim
      for(var ch=0;ch<3;ch++){var f=base*(1+(ch-1)*sp),sx=Math.round(cx+dx*f),sy=Math.round(cy+dy*f);
        if(sx<0)sx=0;else if(sx>=SW)sx=SW-1;if(sy<0)sy=0;else if(sy>=SH)sy=SH-1;o[k+ch]=S[(sy*SW+sx)*4+ch]}
      var e=Math.sqrt(q);o[k+3]=e>.97?Math.round(255*(1-e)/.03):255}}
    ctx.putImageData(out,0,0)}
  addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;var b=band.getBoundingClientRect(),s=b.width/W;
    px=(e.clientX-b.left)/s;py=(e.clientY-b.top)/s;},{passive:true});
  document.documentElement.addEventListener('pointerleave',function(){px=py=null});
  function loop(now){raf=0;if(!vis||!S){return}
    var t=(now-t0)/1000,tx,ty;
    if(px!==null&&py>-R&&py<H+R*2){tx=Math.max(R*.4,Math.min(W-R*.4,px));ty=Math.max(R*.5,Math.min(H-R*.6,py))}
    else{tx=W*(.62+.26*Math.sin(t*.11));ty=H*(.36+.14*Math.sin(t*.17+1))}
    var nx=lx+(tx-lx)*.08,ny=ly+(ty-ly)*.08;
    if(Math.abs(nx-lx)>.05||Math.abs(ny-ly)>.05){lx=nx;ly=ny;draw()}
    raf=requestAnimationFrame(loop)}
  if(!reduce){new IntersectionObserver(function(es){vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(loop)}).observe(band.parentNode)}
})();
