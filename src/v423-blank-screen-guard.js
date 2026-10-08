/* V423 — guardia de navegación: evita pantalla negra por clases/estilos
   que pueden quedar activos al salir de pantallas de pantalla completa. */
(function(){
'use strict';
if(window.__LJR_V423_BLANK_SCREEN_GUARD__)return;
window.__LJR_V423_BLANK_SCREEN_GUARD__=true;

const ROOT=new Set(['home','video','fantasy','more']);
const STALE_ON_ROOT=[
  'v414-favorites-active','v41-teams-active','v46-account-active','v46-notifications-active',
  'v46-following-active','v33-data-active','v379-player-profile-active','v421-watch-active',
  'v92-match-center-official','v94-discipline-official','v357-history-champions-active',
  'v70-calendar-active','v103-calendar-active','v415-calendar-active','v123-player-compare-active',
  'v42-team-active','v391-following-active'
];

function route(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||
    String(document.body?.dataset?.appRoute||'home');
}
function clearInline(el,props){
  if(!el)return;
  props.forEach(p=>el.style.removeProperty(p));
}
function cleanTransient(){
  const r=route(),body=document.body;
  if(!body)return;
  if(body.dataset.appRoute!==r)body.dataset.appRoute=r;
  if(ROOT.has(r)){
    STALE_ON_ROOT.forEach(c=>body.classList.remove(c));
    if(!document.querySelector('.v369-compare-layer,.v369-compare'))body.classList.remove('v369-compare-open');
    if(!document.querySelector('.v132-team-picker.open,.v132-picker.open'))body.classList.remove('v132-picker-open');
    if(!document.querySelector('.v159-layer,.v159-sheet'))body.classList.remove('v159-open');
    if(!document.querySelector('.v100-modal,.v105-modal,.v160-tv-layer'))body.classList.remove('v410-overlay-open','v404-tool-overlay-open','v160-tv-open');

    const top=document.querySelector('#app > .topbar,.app-shell > .topbar');
    const nav=document.querySelector('#app > .bottom-nav,.app-shell > .bottom-nav,nav.bottom-nav');
    clearInline(top,['display','visibility','opacity','pointer-events','height','min-height','max-height','margin','padding','overflow']);
    clearInline(nav,['display','visibility','opacity','pointer-events','height','min-height','max-height','transform','bottom']);

    if(r==='competition'){
      top?.classList.remove('v402-tool-topbar-compact','v397-tool-topbar-exact','v403-reference-topbar','v404-missing-pages-topbar');
    }
  }
}
function visibleContent(screen){
  if(!screen)return false;
  return [...screen.children].some(el=>{
    const s=getComputedStyle(el);
    if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
    const rect=el.getBoundingClientRect();
    return rect.height>8||rect.width>8;
  });
}
let nudged=false;
function recoverIfBlank(){
  // V929: hidden transition frames are deliberate, not a blank-screen crash.
  // Do not re-dispatch hashchange or click Inicio while the new screen mounts.
  if(document.documentElement.classList.contains('ljr-route-staging')||
     document.documentElement.classList.contains('ljr-preboot'))return;
  cleanTransient();
  const r=route(),screen=document.querySelector('#screen');
  if(!ROOT.has(r)||!screen||visibleContent(screen))return;
  if(nudged)return;
  nudged=true;
  try{window.dispatchEvent(new HashChangeEvent('hashchange'))}
  catch(_){window.dispatchEvent(new Event('hashchange'))}
  setTimeout(()=>{
    cleanTransient();
    if(!visibleContent(screen)){
      const btn=document.querySelector('[data-route="'+r+'"]');
      try{btn?.click()}catch(_){}
    }
  },180);
  setTimeout(()=>{nudged=false;cleanTransient()},900);
}
function burst(){
  cleanTransient();
  requestAnimationFrame(cleanTransient);
  setTimeout(recoverIfBlank,120);
  setTimeout(recoverIfBlank,650);
  setTimeout(recoverIfBlank,1500);
}
window.addEventListener('hashchange',burst,true);
window.addEventListener('pageshow',burst);
window.addEventListener('load',burst);
document.addEventListener('DOMContentLoaded',burst,{once:true});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)burst()});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>setTimeout(cleanTransient,0)).observe(screen,{childList:true,subtree:false});
burst();
})();