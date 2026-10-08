/* V951 — cabecera estable de Máximo goleador, con avatar real de la cuenta. */
(function(){
'use strict';
if(window.__LJR_V951_SCORERS_FINAL_PAGE__)return;
window.__LJR_V951_SCORERS_FINAL_PAGE__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
let queued=false;

const backSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
const profileSvg='<svg class="v951-profile-fallback" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.5-3.7 4-5.5 7.5-5.5s6 1.8 7.5 5.5"/></svg>';

function esc(v){
  return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function account(){
  try{
    return window.LJR_V569_AUTH?.currentAccount?.()||window.LJR_MAIN_ROUTE?.state?.user||null;
  }catch(_){return null}
}

function initials(a){
  const value=String(a?.name||a?.alias||'').trim();
  if(!value)return '';
  return value.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase();
}

function profileMarkup(){
  const a=account();
  if(!a)return profileSvg;
  const photo=String(a.avatar||a.photoURL||a.picture||'').trim();
  if(photo)return '<img class="v951-account-photo" src="'+esc(photo)+'" alt="Mi perfil">';
  if(/^gamer:[0-8]$/.test(String(a.avatarPreset||''))&&window.LJR_CHROME?.avatar){
    try{
      const html=window.LJR_CHROME.avatar(a);
      if(html)return '<span class="v951-account-avatar">'+html+'</span>';
    }catch(_){}
  }
  const ini=initials(a);
  if(ini)return '<span class="v951-account-initial">'+esc(ini)+'</span>';
  return profileSvg;
}

function goBack(){
  const native=document.querySelector('#app > .topbar #backButton');
  if(native){
    try{native.click();return}catch(_){}
  }
  if(typeof window.LJR_MAIN_ROUTE?.back==='function'){
    try{window.LJR_MAIN_ROUTE.back();return}catch(_){}
  }
  if(history.length>1)history.back();
  else location.hash='#/more';
}

function goProfile(){
  const native=document.querySelector('#app > .topbar .profile-button');
  if(native){
    try{native.click();return}catch(_){}
  }
  if(typeof window.LJR_MAIN_ROUTE?.go==='function'){
    try{window.LJR_MAIN_ROUTE.go('profile');return}catch(_){}
  }
  location.hash='#/profile';
}

function build(){
  const head=document.createElement('header');
  head.className='v950-scorers-head v951-scorers-head';
  head.setAttribute('aria-label','Cabecera de Máximo goleador');
  head.innerHTML=
    '<button type="button" class="v950-scorers-back" aria-label="Regresar">'+backSvg+'</button>'+
    '<div class="v950-scorers-title">Máximo goleador</div>'+
    '<button type="button" class="v950-scorers-profile" aria-label="Mi perfil"><span class="v951-profile-slot">'+profileMarkup()+'</span></button>';
  head.querySelector('.v950-scorers-back').addEventListener('click',goBack);
  head.querySelector('.v950-scorers-profile').addEventListener('click',goProfile);
  return head;
}

function syncProfile(head){
  const slot=head?.querySelector('.v951-profile-slot');
  if(!slot)return;
  const html=profileMarkup();
  if(slot.innerHTML!==html)slot.innerHTML=html;
}

function sync(){
  queued=false;
  const screen=document.getElementById('screen');
  if(!screen)return;

  if(route()!=='scorers'){
    screen.querySelector(':scope > .v950-scorers-head')?.remove();
    return;
  }

  /* V768 debe tratar esta pantalla como sin cabecera global reservada. */
  document.body.style.setProperty('--v768-head-h','0px');

  let head=screen.querySelector(':scope > .v950-scorers-head');
  if(!head){
    head=build();
    screen.prepend(head);
  }else if(screen.firstElementChild!==head){
    screen.prepend(head);
  }
  syncProfile(head);
}

function queue(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(sync);
}

for(const ev of ['hashchange','popstate','load','storage','pageshow','ljr:profile-updated']){
  window.addEventListener(ev,queue);
}
document.addEventListener('DOMContentLoaded',queue,{once:true});
const screen=document.getElementById('screen');
if(screen)new MutationObserver(queue).observe(screen,{childList:true,subtree:false});
queue();
setTimeout(sync,120);
setTimeout(sync,450);
setTimeout(sync,1200);
})();