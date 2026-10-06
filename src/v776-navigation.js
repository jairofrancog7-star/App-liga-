/* Route history retains each scroll surface and current filters across async renders. */
(()=>{
 const key='ljr-navigation-v776',screen=()=>document.querySelector('#screen'),route=()=>location.hash||'#/home';
 const keys=['v62-category','v62-data-tab','v35-history-tab','v194-scorers-category','v40-category'];
 let entries=[];try{entries=JSON.parse(sessionStorage.getItem(key)||'[]')}catch{}
 const surfaces=()=>[...document.querySelectorAll('#screen,#screen [id],#screen [data-scroll-key],#screen .v35-history-body,#screen .v726-tools-body')].filter(el=>el.scrollHeight>el.clientHeight+1||el.scrollWidth>el.clientWidth+1);
 const selector=el=>el.id?'#'+CSS.escape(el.id):el.dataset.scrollKey?'[data-scroll-key="'+CSS.escape(el.dataset.scrollKey)+'"]':'.'+[...el.classList].map(CSS.escape).join('.');
 const capture=()=>({url:route(),y:screen()?.scrollTop??0,x:screen()?.scrollLeft??0,windowY:window.scrollY,windowX:window.scrollX,surfaces:surfaces().map(el=>({selector:selector(el),y:el.scrollTop,x:el.scrollLeft})),settings:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),main:window.LJR_MAIN_ROUTE?{competitionTab:window.LJR_MAIN_ROUTE.state.competitionTab,historyTab:window.LJR_MAIN_ROUTE.state.historyTab,selectedTeam:window.LJR_MAIN_ROUTE.state.selectedTeam,selectedPlayer:window.LJR_MAIN_ROUTE.state.selectedPlayer}:null});
 let current=capture(),restoring=null,pending=null,lastRoute='',direction=1,restoreUntil=0;
 const persist=()=>{try{sessionStorage.setItem(key,JSON.stringify(entries.slice(-60)))}catch{}};
 const remember=()=>{if(!restoring&&route()===current.url)current=capture()};
 function leaving(page,push=true){
  const destination='#/'+page;
  if(restoring){if(destination===restoring.url.split('?')[0])return;current=capture();restoring=null}
  if(destination===current.url.split('?')[0])return;
  if(push){entries.push(route()===current.url?capture():current);persist()}
  pending=destination;current={url:destination,y:0,x:0,windowY:0};direction=1;
 }
 function apply(entry){
  const el=screen();if(el){el.scrollTop=entry.y||0;el.scrollLeft=entry.x||0}
  for(const p of entry.surfaces||[]){const target=document.querySelector(p.selector);if(target){target.scrollTop=p.y;target.scrollLeft=p.x}}
  window.scrollTo(entry.windowX||0,entry.windowY??entry.y??0);
 }
 function back(){
  remember();document.querySelectorAll('.liga-media-modal video').forEach(v=>v.pause());
  const entry=entries.pop();persist();direction=-1;
  if(!entry){window.LJR_MAIN_ROUTE?.go('home',false);return}
  restoring=entry;restoreUntil=performance.now()+2500;pending=null;current=entry;
  for(const [k,v]of Object.entries(entry.settings||{}))if(v!==null)localStorage.setItem(k,v);
  if(entry.main&&window.LJR_MAIN_ROUTE)Object.assign(window.LJR_MAIN_ROUTE.state,entry.main);
  window.LJR_MAIN_ROUTE?.go(entry.url.replace(/^#\//,''),false);
  if(!window.LJR_MAIN_ROUTE)location.hash=entry.url;
  rendered();
 }
 function rendered(){
  const el=screen();if(!el)return;const destination=route();
  if(restoring&&destination===restoring.url){apply(restoring);return}
  if(destination!==lastRoute){
   if(pending||destination!==current.url){apply({y:0,x:0,windowY:0});pending=null}
   if(!matchMedia('(prefers-reduced-motion:reduce)').matches){el.getAnimations?.().forEach(a=>a.cancel());el.animate?.([{translate:(direction*18)+'px 0'},{translate:'0 0'}],{duration:180})}
   lastRoute=destination;
  }
  if(destination===lastRoute&&!restoring&&current.url===destination)apply(current);
  if(!restoring)current=capture();
 }
 document.addEventListener('click',e=>{
  if(!(e.target instanceof Element))return;const b=e.target.closest('button,a');if(!b)return;
  if(b.matches('[data-v589-back]'))return; // This arrow also navigates inside the predictor.
  const label=(b.getAttribute('aria-label')||b.textContent||'').trim();
  if(b.id==='backButton'||b.matches('.v35-back,.v46-back,.v27-back,.v41-back,.v26-moments-sticky-back,.v569-back,.v31-back,[data-v446-notices-back]')||/^(Volver|Regresar|Atrás)(\s|$)/i.test(label)){
   if(b.closest('[role="dialog"],.liga-media-modal,.v431-drawer'))return;
   e.preventDefault();e.stopImmediatePropagation();back();
  }else remember();
 },true);
 addEventListener('hashchange',()=>{
  if(restoring&&route()===restoring.url)return;
  if(route()!==current.url&&route().split('?')[0]!==pending){entries.push(current);persist();current={url:route(),y:0,x:0,windowY:0};pending=route();direction=1}
  requestAnimationFrame(rendered);
 });
 document.addEventListener('scroll',remember,true);
 for(const event of ['wheel','touchstart','keydown'])document.addEventListener(event,()=>{if(restoring){restoring=null;current=capture()}},{passive:true,capture:true});
 const observer=new MutationObserver(()=>{if(restoring){if(performance.now()<restoreUntil)requestAnimationFrame(()=>restoring&&apply(restoring));else{restoring=null;current=capture()}}});
 const watch=()=>{const root=screen();if(root)observer.observe(root,{childList:true,subtree:true})};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
 setInterval(()=>{if(restoring){if(performance.now()<restoreUntil&&route()===restoring.url)apply(restoring);else{restoring=null;current=capture()}}},100);
 window.LJR_NAVIGATION={leaving,rendered,back,remember};
})();
