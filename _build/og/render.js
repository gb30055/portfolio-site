const {chromium}=require('playwright');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1200,height:630}});
const jobs=[['og-home','k=home'],
['og-fancircle','k=case&co=Fancircle&t='+encodeURIComponent('How do new artists find their first true fans?')+'&img=thumb-fancircle.webp'],
['og-career-navig8r','k=case&co=Career Navig8r&t='+encodeURIComponent('How do we get more mentors to finish their profile?')+'&img=navig8r-home-feed.webp&pos=left%20top'],
['og-scandlearn','k=case&co=Scandlearn&t='+encodeURIComponent('How do pilots find their training in a system that feels like a maze?')+'&img=thumb-scandlearn.webp']];
for(const [n,qs] of jobs){await p.goto('http://localhost:8765/_build/og/og.html?'+qs,{waitUntil:'networkidle'});await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:'/mnt/project-files/portfolio/site/assets/'+n+'.png'});}
console.log(await p.evaluate(()=>document.fonts.check('600 20px Geist')));await b.close()})();
