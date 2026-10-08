/* V924: Restore the exact previous section, tab and scroll position on every back action. */
(()=>{
'use strict';
if(window.__LJR_NAV_V924__)return;
window.__LJR_NAV_V924__=true;
const STORE='ljr-navigation-v924';
const screen=()=>document.getElementById('screen');
const route=()=>location.hash||'#/home';
const keys=['v62-category','v62-data-tab','v35-history-tab','v194-scorers-category','v40-category'];
const read=()=>{try{return JSON.parse(sessionStorage.getItem(STORE)||'null')}catch{return null}};
const esc=s=>window.CSS&&CSS.escape?CSS.escape(s):String(s).replace(/[^a-zA-Z0-9_-]/g,'\\$&');
function pathFor(el){
 if(el.id)return '#'+esc(el.id);
 if(el.dataset.scrollKey)return '[data-scroll-key="'+esc(el.dataset.scrollKey)+'"]';
 const parts=[];let node=el;
 while(node&&node.nodeType===1&&node!==document.body&&parts.length<11){
  if(node.id){parts.unshift('#'+esc(node.id));break}
  let nth=1,s=node;while((s=s.previousElementSibling))if(s.tagName===node.tagName)nth++;
  parts.unshift(node.tagName.toLowerCase()+':nth-of-type('+nth+')');
  node=node.parentElement;
 }
 return parts.join(' > ');
}
function surfaces(){
 const root=screen();if(!root)return [];
 return [root,...root.querySelectorAll('*')].filter(el=>{
  if(el.scrollHeight<=el.clientHeight+3&&el.scrollWidth<=el.clientWidth+3)return false;
  if(el===root)return true;
  const s=getComputedStyle(el);
  return /(auto|scroll|overlay)/.test(s.overflowY+' '+s.overflowX)||el.scrollTop>0||el.scrollLeft>0;
 }).slice(0,50);
}
function capture(){
 const root=screen(),state=window.LJR_MAIN_ROUTE?.state;
 return {
  url:route(),y:root?.scrollTop||0,x:root?.scrollLeft||0,
  windowY:Math.max(0,window.scrollY||document.scrollingElement?.scrollTop||0),
  windowX:window.scrollX||0,
  surfaces:surfaces().map(el=>({selector:pathFor(el),y:el.scrollTop,x:el.scrollLeft})).filter(p=>p.selector),
  settings:Object.fromEntries(keys.map(k=>[k,localStorage.getItem(k)])),
  main:state?{competitionTab:state.competitionTab,historyTab:state.historyTab,statsTab:state.statsTab,
   newsFilter:state.newsFilter,selectedTeam:state.selectedTeam,selectedPlayer:state.selectedPlayer}:null
 };
}
const blank=url=>({url,y:0,x:0,windowY:0,windowX:0,surfaces:[]});
const old=read();
let entries=Array.isArray(old?.entries)&&old.url===route()?old.entries:[],
    future=Array.isArray(old?.future)&&old.url===route()?old.future:[],
    active=blank(route()),restoring=null,pending=null,restoreToken=0,queued=false;
function save(){try{sessionStorage.setItem(STORE,JSON.stringify({url:active.url,entries:entries.slice(-60),future:future.slice(-30)}))}catch(_){}}
try{history.scrollRestoration='manual'}catch(_){}
function remember(){if(!restoring&&route()===active.url)active=capture()}
function track(){if(queued||restoring)return;queued=true;requestAnimationFrame(()=>{queued=false;remember()})}
function apply(entry){
 if(!entry||route()!==entry.url)return;
 const el=screen();if(el){el.scrollTop=entry.y||0;el.scrollLeft=entry.x||0}
 for(const item of entry.surfaces||[]){
  let target;try{target=document.querySelector(item.selector)}catch(_){continue}
  if(target){target.scrollTop=item.y||0;target.scrollLeft=item.x||0}
 }
 window.scrollTo({top:Math.max(0,entry.windowY??entry.y??0),left:entry.windowX||0,behavior:'instant'});
}
function cancelRestore(){if(restoring){restoring=null;++restoreToken;remember()}}
function restore(entry){
 restoring={entry,until:Date.now()+3000};pending=null;
 ++restoreToken;const token=restoreToken;
 for(const [key,value] of Object.entries(entry.settings||{})){
  if(value===null||value===undefined)localStorage.removeItem(key);
  else localStorage.setItem(key,value);
 }
 if(entry.main&&window.LJR_MAIN_ROUTE?.state)Object.assign(window.LJR_MAIN_ROUTE.state,entry.main);
 const attempt=()=>{
  if(!restoring||token!==restoreToken||route()!==entry.url)return;
  apply(entry);
  if(Date.now()>=restoring.until){restoring=null;active=capture();save()}
 };
 requestAnimationFrame(attempt);
 [80,180,350,600,950,1450,2050,2650,3100].forEach(ms=>setTimeout(attempt,ms));
}
function leaving(page,push=true){
 const destination='#/'+String(page).replace(/^#?\//,'');
 if(destination===route()||destination===active.url)return;
 if(restoring)cancelRestore();
 remember();
 if(push){entries.push(active);entries=entries.slice(-60);future=[]}
 active=blank(destination);pending=destination;save();
}
function changed(url){
 if(url===active.url){if(restoring)apply(restoring.entry);return}
 if(restoring)cancelRestore();
 if(pending===url){active=blank(url);return}
 if(entries.length&&entries[entries.length-1].url===url){
  future.push(active);active=entries.pop();restore(active);
 }else if(future.length&&future[future.length-1].url===url){
  entries.push(active);active=future.pop();restore(active);
 }else{
  entries.push(active);entries=entries.slice(-60);future=[];
  active=blank(url);pending=url;
 }
 save();
}
function rendered(){
 const url=route();
 if(url!==active.url&&!pending)changed(url);
 if(restoring&&restoring.entry.url===url){apply(restoring.entry);return}
 if(pending===url){
  pending=null;
  const el=screen();if(el){el.scrollTop=0;el.scrollLeft=0}
  window.scrollTo(0,0);
  active=capture();save();
 }
}
function back(){
 remember();
 if(restoring)cancelRestore();
 const entry=entries.pop();
 if(!entry){
  if(route()!=='#/home')window.LJR_MAIN_ROUTE?.go?.('home',false);
  return;
 }
 future.push(active);active=entry;
 const oldUrl=location.href;
 // Never add a new browser history entry when pressing the app's back arrow.
 history.replaceState(history.state,'',location.pathname+location.search+entry.url);
 restore(entry);
 if(window.LJR_MAIN_ROUTE?.go)window.LJR_MAIN_ROUTE.go(entry.url.replace(/^#\//,''),false);
 else if(window.LJR_MAIN_ROUTE?.render){
  window.LJR_MAIN_ROUTE.state.route=entry.url.replace(/^#\//,'').split('?')[0];
  window.LJR_MAIN_ROUTE.render();
 }
 try{window.dispatchEvent(new HashChangeEvent('hashchange',{oldURL:oldUrl,newURL:location.href}))}
 catch(_){window.dispatchEvent(new Event('hashchange'))}
 save();
}
document.addEventListener('click',e=>{
 if(!(e.target instanceof Element))return;
 const b=e.target.closest('button,a');if(!b)return;
 if(b.matches('[data-v589-back]')||b.closest('[role="dialog"],.liga-media-modal,.v431-drawer,.modal,.v105-modal,.v28-sheet-layer'))return;
 const label=(b.getAttribute('aria-label')||b.textContent||'').trim();
 if(b.id==='backButton'||b.matches('.v35-back,.v46-back,.v27-back,.v41-back,.v26-moments-sticky-back,.v569-back,.v31-back,[data-v446-notices-back]')||/^(Volver|Regresar|Atrás)(\s|$)/i.test(label)){
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();back();
 }else remember();
},true);
window.addEventListener('hashchange',()=>{changed(route());requestAnimationFrame(rendered)});
window.addEventListener('popstate',()=>requestAnimationFrame(()=>{changed(route());rendered()}));
window.addEventListener('pageshow',()=>requestAnimationFrame(()=>{changed(route());rendered()}));
window.addEventListener('scroll',track,{passive:true,capture:true});
document.addEventListener('scroll',track,{passive:true,capture:true});
for(const kind of ['wheel','touchstart','pointerdown','keydown']){
 document.addEventListener(kind,()=>{if(restoring)cancelRestore()},{passive:true,capture:true});
}
let observerFrame=0;
const observer=new MutationObserver(()=>{
 if(restoring&&!observerFrame)observerFrame=requestAnimationFrame(()=>{
  observerFrame=0;if(restoring)apply(restoring.entry);
 });
});
const watch=()=>{if(screen())observer.observe(screen(),{childList:true,subtree:true})};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});else watch();
window.addEventListener('beforeunload',()=>{remember();save()});
window.LJR_NAVIGATION={leaving,rendered,back,remember};
})();