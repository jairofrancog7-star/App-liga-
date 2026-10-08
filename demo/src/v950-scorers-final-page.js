/* V957 — Máximo goleador: una sola cabecera global, expandida arriba
   y compacta al hacer scroll; conserva flecha y perfil de la sesión. */
(function(){
'use strict';
if(window.__LJR_V957_SCORERS_HEADER__)return;
window.__LJR_V957_SCORERS_HEADER__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
let raf=0;
let scrollNode=null;
let compact=false;

const userSvg='<svg class="v957-profile-fallback" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.5-3.7 4-5.5 7.5-5.5s6 1.8 7.5 5.5"/></svg>';

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function account(){
  try{return window.LJR_V569_AUTH?.currentAccount?.()||window.LJR_MAIN_ROUTE?.state?.user||null}
  catch(_){return null}
}

function avatarMarkup(){
  const a=account();
  if(!a)return userSvg;
  const photo=String(a.avatar||a.photoURL||a.picture||'').trim();
  if(photo)return '<img class="v957-account-photo" src="'+esc(photo)+'" alt="Mi perfil">';
  if(/^gamer:[0-8]$/.test(String(a.avatarPreset||''))&&window.LJR_CHROME?.avatar){
    try{
      const html=window.LJR_CHROME.avatar(a);
      if(html)return '<span class="v957-account-avatar">'+html+'</span>';
    }catch(_){}
  }
  return userSvg;
}

function cleanLegacy(bar,screen){
  bar?.querySelectorAll(':scope > .v944-scorers-title,:scope > .v943-scorers-back,:scope > .v943-scorers-trophy').forEach(n=>n.remove());
  screen?.querySelector(':scope > .v950-scorers-head')?.remove();
  screen?.querySelectorAll('.v775-scorers-head').forEach(n=>n.classList.remove('ljr-scroll-header'));
}

function ensureTitle(bar){
  let title=bar.querySelector(':scope > .v956-scorers-title');
  if(!title){
    title=document.createElement('span');
    title.className='v956-scorers-title';
    bar.appendChild(title);
  }
  title.textContent='Máximo goleador';
  return title;
}

function syncProfile(bar){
  const button=bar?.querySelector(':scope > .profile-button');
  if(!button)return;
  const html=avatarMarkup();
  if(button.innerHTML!==html)button.innerHTML=html;
  button.classList.toggle('v957-has-account',!!account());
  button.removeAttribute('hidden');
  button.classList.remove('is-hidden');
  button.setAttribute('aria-label','Mi perfil');
}

function applyCompact(force){
  const body=document.body;
  const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
  const screen=document.getElementById('screen');
  if(!body||!bar||route()!=='scorers')return;

  const top=Math.max(0,screen?.scrollTop||0,window.scrollY||0);
  let next=compact;
  if(force===true)next=true;
  else if(force===false)next=false;
  else if(compact)next=top>24;
  else next=top>88;

  compact=next;
  body.classList.toggle('v957-scorers-compact',compact);
  bar.classList.toggle('is-compact',compact);
  requestAnimationFrame(()=>window.LJR_SCROLL_CHROME?.refresh?.());
}

function onScroll(){
  if(raf)return;
  raf=requestAnimationFrame(()=>{raf=0;applyCompact();});
}

function watchScroll(){
  const screen=document.getElementById('screen');
  if(screen===scrollNode)return;
  scrollNode?.removeEventListener('scroll',onScroll);
  scrollNode=screen;
  scrollNode?.addEventListener('scroll',onScroll,{passive:true});
}

function sync(){
  const body=document.body;
  const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
  const screen=document.getElementById('screen');
  if(!body||!bar)return;

  if(route()!=='scorers'){
    body.classList.remove('v957-scorers-compact');
    bar.classList.remove('v956-scorers-global','is-compact');
    bar.querySelector(':scope > .v956-scorers-title')?.remove();
    return;
  }

  cleanLegacy(bar,screen);
  bar.classList.add('v956-scorers-global');
  ensureTitle(bar);
  syncProfile(bar);
  watchScroll();

  /* No reservar la cabecera antigua; la única altura válida es la de esta topbar. */
  body.style.removeProperty('--v768-head-h');
  applyCompact();
  setTimeout(()=>window.LJR_SCROLL_CHROME?.refresh?.(),40);
}

function schedule(){
  if(raf)return;
  raf=requestAnimationFrame(()=>{raf=0;sync();});
}

for(const ev of ['hashchange','popstate','load','pageshow','resize','storage','ljr:profile-updated']){
  window.addEventListener(ev,schedule,{passive:true});
}
document.addEventListener('DOMContentLoaded',schedule,{once:true});
new MutationObserver(()=>{if(route()==='scorers')schedule()}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-app-route','class']});
window.addEventListener('scroll',onScroll,{passive:true});
schedule();
setTimeout(sync,120);
setTimeout(sync,500);
setTimeout(sync,1200);
})();