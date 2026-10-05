/* One navigation history, including the scroll surface and page selections. */
(()=>{
 const key='ljr-navigation-v776',screen=()=>document.querySelector('#screen');
 let entries=[];try{entries=JSON.parse(sessionStorage.getItem(key)||'[]')}catch{}
 const route=()=>location.hash||'#/home';
 const capture=()=>({url:route(),y:screen()?.scrollTop||window.scrollY,x:screen()?.scrollLeft||0,settings:Object.fromEntries(['v62-category','v62-data-tab','v35-history-tab','v194-scorers-category','v40-category'].map(k=>[k,localStorage.getItem(k)])),main:window.LJR_MAIN_ROUTE?{competitionTab:window.LJR_MAIN_ROUTE.state.competitionTab,historyTab:window.LJR_MAIN_ROUTE.state.historyTab,selectedTeam:window.LJR_MAIN_ROUTE.state.selectedTeam,selectedPlayer:window.LJR_MAIN_ROUTE.state.selectedPlayer}:null});
 let current=capture(),restoring=null,direction=1,lastAnimationRoute='';
 const persist=()=>{try{sessionStorage.setItem(key,JSON.stringify(entries.slice(-60)))}catch{}};
 function leaving(page,push=true){if(restoring)return;if(page!==current.url.replace(/^#\//,'').split('?')[0]&&push){entries.push(capture());persist();direction=1;current={...capture(),url:'#/'+page,y:0,x:0}}}
 function back(){
  document.querySelectorAll('.liga-media-modal video').forEach(v=>v.pause());
  const entry=entries.pop();persist();direction=-1;
  if(!entry){window.LJR_MAIN_ROUTE?.go('home',false);return}
  restoring=entry;
  for(const [k,v]of Object.entries(entry.settings||{}))if(v!==null)localStorage.setItem(k,v);
  if(entry.main&&window.LJR_MAIN_ROUTE)Object.assign(window.LJR_MAIN_ROUTE.state,entry.main);
  window.LJR_MAIN_ROUTE?.go(entry.url.replace(/^#\//,''),false);
  if(!window.LJR_MAIN_ROUTE)location.hash=entry.url;
  rendered();
 }
 function rendered(){
  const el=screen();if(!el)return;
  if(!restoring){el.scrollTop=0;window.scrollTo(0,0);current=capture()}
  const destination=route();
  if(destination!==lastAnimationRoute&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
   el.getAnimations().forEach(a=>a.cancel());
   el.animate([{translate:(direction*18)+'px 0'},{translate:'0 0'}],{duration:180,easing:'cubic-bezier(.2,.8,.2,1)'});
   lastAnimationRoute=destination;
  }
  if(restoring){const entry=restoring;let attempts=0;const restore=()=>{if(route()!==entry.url)return;el.scrollTop=entry.y;el.scrollLeft=entry.x;window.scrollTo(0,entry.y);if(++attempts<12)setTimeout(restore,90);else{current=capture();restoring=null}};requestAnimationFrame(restore)}
 }
 document.addEventListener('click',e=>{
  if(!(e.target instanceof Element))return;
  const b=e.target.closest('button,a');if(!b)return;
  const label=(b.getAttribute('aria-label')||b.textContent||'').trim();
  if(b.id==='backButton'||b.matches('.v35-back,.v46-back,.v27-back,.v41-back,.v26-moments-sticky-back,.v569-back,.v31-back,[data-v446-notices-back]')||/^(Volver|Regresar|Atrás)(\s|$)/i.test(label)){
   if(b.closest('[role="dialog"],.liga-media-modal,.v431-drawer'))return;
   e.preventDefault();e.stopImmediatePropagation();back();
  }
 },true);
 addEventListener('hashchange',()=>{if(restoring)return;if(route()!==current.url){entries.push(current);persist();current={...capture(),y:0,x:0};direction=1}requestAnimationFrame(rendered)});
 document.addEventListener('scroll',()=>{if(!restoring)current=capture()},true);
 window.LJR_NAVIGATION={leaving,rendered,back};
})();
