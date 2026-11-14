/* Behaviour shared by the pages under /work and /insights. */
(() => {
const D=document, B=D.body, $=(s,r=D)=>r.querySelector(s), $$=(s,r=D)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const isCase=B.classList.contains('case');

/* tell the homepage it can skip its intro, and which story to return to */
try{ sessionStorage.setItem('elora-seen','1'); if(B.dataset.slug) sessionStorage.setItem('elora-last',B.dataset.slug); }catch(e){}

/* ── entry ── */
const fonts=D.fonts?Promise.race([D.fonts.ready,new Promise(r=>setTimeout(r,900))]):Promise.resolve();
fonts.then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>B.classList.add('ready'))));

/* ── scroll reveals ── */
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.1,rootMargin:'0px 0px -6% 0px'});
$$('.rv').forEach(el=>io.observe(el));

/* ── the same slow wheel scroll as the homepage (case studies only; articles scroll natively) ── */
let target=scrollY, cur=scrollY;
const maxS=()=>D.documentElement.scrollHeight-innerHeight;
const smooth=isCase&&!reduce;
if(smooth) addEventListener('wheel',e=>{
  if(e.ctrlKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)) return;
  e.preventDefault(); const d=e.deltaMode===1?e.deltaY*32:e.deltaY; target=clamp(target+d*.85,0,maxS());
},{passive:false});
const scrollToY=y=>{ y=clamp(y,0,maxS()); if(smooth) target=y; else scrollTo({top:y,behavior:reduce?'auto':'smooth'}); };

/* ── case hero: parallax as the stage scrolls away ── */
const hero=$('.c-hero'), bd=hero&&$('.bd',hero), ti=hero&&$('.ptitle',hero), me=hero&&$('.pmeta',hero), card=hero&&$('.pcard',hero), cv=card&&$('video',card);
let lastY=-1;
function frame(){
  if(smooth){ const d=target-cur; if(Math.abs(scrollY-cur)>2&&Math.abs(d)<1) cur=target=scrollY; else if(Math.abs(d)>.3){ cur+=d*.075; scrollTo(0,cur); } else cur=target; }
  const y=scrollY;
  if(hero&&y!==lastY&&!reduce&&innerWidth>860){ const p=clamp(y/innerHeight,0,1.2);
    bd.style.transform=`translate3d(0,${p*6}%,0) scale(${1.04+p*.04})`;
    ti.style.transform=`translate3d(${p*-5}vw,${p*-12}vh,0)`;
    me.style.transform=`translate3d(0,${p*-22}vh,0)`; me.style.opacity=1-p*1.3;
    card.style.transform=`translate3d(0,${p*-34}vh,0) rotateX(${p*-18}deg) rotate(${p*9}deg) scale(${1-p*.06})`;
  }
  lastY=y; requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* cover film plays only while the hero is on screen */
if(cv&&!reduce) new IntersectionObserver(([e])=>{
  if(e.isIntersecting){ if(!cv.src) cv.src=cv.dataset.src; cv.play().then(()=>card.classList.add('on')).catch(()=>{}); } else cv.pause();
},{threshold:.2}).observe(hero);

/* ── film rails: play in place, arrows, drag ── */
function stopFilms(except){ $$('.vc.play').forEach(c=>{ if(c===except) return; const v=$('video',c); v.pause(); v.hidden=true; c.classList.remove('play'); }); }
D.addEventListener('click',e=>{ const p=e.target.closest('.vc .pl'); if(!p) return; const c=p.parentElement; stopFilms(c);
  let v=$('video',c); if(!v){ v=D.createElement('video'); v.playsInline=true; v.controls=true; v.preload='auto'; v.src=c.dataset.src; c.append(v); }
  v.hidden=false; c.classList.add('play'); if(cv) cv.pause(); v.play().catch(()=>{}); v.focus({preventScroll:true}); });
$$('.rail').forEach(rail=>{
  const nav=$('.rail-nav',rail.closest('.ch')||D), [prev,next]=nav?$$('button',nav):[];
  const step=()=>{ const c=$('.vc',rail); return c?c.offsetWidth+16:320; };
  const sync=()=>{ if(!nav) return; const mx=rail.scrollWidth-rail.clientWidth; nav.hidden=mx<4; prev.disabled=rail.scrollLeft<4; next.disabled=rail.scrollLeft>mx-4; };
  if(nav){ prev.addEventListener('click',()=>rail.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'})); next.addEventListener('click',()=>rail.scrollBy({left:step(),behavior:reduce?'auto':'smooth'}));
    rail.addEventListener('scroll',sync,{passive:true}); addEventListener('resize',sync); addEventListener('load',sync); sync(); }
  /* mouse drag */
  let down=false, sx=0, sl=0, moved=false;
  rail.addEventListener('pointerdown',e=>{ if(e.pointerType!=='mouse'||e.button||e.target.closest('video')) return; down=true; moved=false; sx=e.clientX; sl=rail.scrollLeft; });
  addEventListener('pointermove',e=>{ if(!down) return; const dx=e.clientX-sx; if(!moved&&Math.abs(dx)>6){ moved=true; rail.classList.add('drag'); } if(moved) rail.scrollLeft=sl-dx; });
  addEventListener('pointerup',()=>{ if(!down) return; down=false; if(moved) setTimeout(()=>rail.classList.remove('drag'),0); });
});

/* ── links: in-page anchors glide, page links fade out first ── */
D.addEventListener('click',e=>{ const a=e.target.closest('a[href]'); if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target) return;
  const href=a.getAttribute('href');
  if(href[0]==='#'){ const el=D.getElementById(href.slice(1)); if(!el) return; e.preventDefault(); scrollToY(el.getBoundingClientRect().top+scrollY-(el.classList.contains('ch')?0:70)); history.replaceState(null,'',href); return; }
  if(href[0]!=='/'||reduce) return;
  e.preventDefault(); stopFilms(); B.classList.add('leaving'); setTimeout(()=>{ location.href=href; },380); });
addEventListener('pageshow',e=>{ if(e.persisted){ B.classList.remove('leaving'); B.classList.add('ready'); } });
addEventListener('keydown',e=>{ if(e.key==='Escape'&&!e.defaultPrevented){ const x=$('.x'); if(x) x.click(); } });
})();
