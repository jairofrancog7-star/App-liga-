/* V959 — único controlador de cabecera para Máximo goleador. */
(function(){
'use strict';
if(window.__LJR_V959_SCORERS_HEADER__)return;
window.__LJR_V959_SCORERS_HEADER__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let screen=null,compact=false,raf=0,mutating=false;

const backSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
const profileSvg='<svg class="v959-profile-fallback" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.5-3.7 4-5.5 7.5-5.5s6 1.8 7.5 5.5"/></svg>';

function account(){
  try{return window.LJR_V569_AUTH?.currentAccount?.()||window.LJR_MAIN_ROUTE?.state?.user||null}
  catch(_){return null}
}

function avatarMarkup(){
  const a=account();
  if(!a)return profileSvg;
  const photo=String(a.avatar||a.photoURL||a.picture||'').trim();
  if(photo)return '<img class="v959-account-photo" src="'+esc(photo)+'" alt="Mi perfil">';
  if(/^gamer:[0-8]$/.test(String(a.avatarPreset||''))&&window.LJR_CHROME?.avatar){
    try{
      const html=window.LJR_CHROME.avatar(a);
      if(html)return '<span class="v959-account-avatar">'+html+'</span>';
    }catch(_){}
  }
  return profileSvg;
}

function goBack(){
  const native=document.querySelector('#app > .topbar #backButton, .app-shell > .topbar #backButton');
  if(native){try{native.click();return}catch(_){}}
  if(typeof window.LJR_MAIN_ROUTE?.back==='function'){try{window.LJR_MAIN_ROUTE.back();return}catch(_){}}
  if(history.length>1)history.back();else location.hash='#/more';
}

function goProfile(){
  const native=document.querySelector('#app > .topbar .profile-button, .app-shell > .topbar .profile-button');
  if(native){try{native.click();return}catch(_){}}
  if(typeof window.LJR_MAIN_ROUTE?.go==='function'){try{window.LJR_MAIN_ROUTE.go('profile');return}catch(_){}}
  location.hash='#/profile';
}

function removeLegacy(bar){
  bar.querySelectorAll(':scope > .v943-scorers-back,:scope > .v944-scorers-title,:scope > .v943-scorers-trophy,:scope > .v956-scorers-title,:scope > .v958-scorers-profile').forEach(n=>n.remove());
  document.querySelectorAll('#screen > .v950-scorers-head,#screen .v775-scorers-head').forEach(n=>n.remove());
}

function ensure(bar){
  mutating=true;
  try{
    removeLegacy(bar);

    let back=bar.querySelector(':scope > .v959-back');
    if(!back){
      back=document.createElement('button');
      back.type='button';
      back.className='v959-back';
      back.setAttribute('aria-label','Regresar');
      back.innerHTML=backSvg;
      back.addEventListener('click',goBack);
      bar.appendChild(back);
    }

    let title=bar.querySelector(':scope > .v959-title');
    if(!title){
      title=document.createElement('span');
      title.className='v959-title';
      title.textContent='Máximo goleador';
      bar.appendChild(title);
    }

    let profile=bar.querySelector(':scope > .v959-profile');
    if(!profile){
      profile=document.createElement('button');
      profile.type='button';
      profile.className='v959-profile';
      profile.setAttribute('aria-label','Mi perfil');
      profile.addEventListener('click',goProfile);
      bar.appendChild(profile);
    }
    const html=avatarMarkup();
    if(profile.innerHTML!==html)profile.innerHTML=html;
  }finally{
    mutating=false;
  }
}

function applyCompact(){
  if(route()!=='scorers')return;
  const top=Math.max(0,screen?.scrollTop||0,window.scrollY||0);
  compact=compact ? top>24 : top>86;
  document.body.classList.toggle('v959-compact',compact);
  requestAnimationFrame(()=>window.LJR_SCROLL_CHROME?.refresh?.());
}

function onScroll(){
  if(raf)return;
  raf=requestAnimationFrame(()=>{raf=0;applyCompact();});
}

function bindScreen(){
  const next=document.getElementById('screen');
  if(next===screen)return;
  screen?.removeEventListener('scroll',onScroll);
  screen=next;
  screen?.addEventListener('scroll',onScroll,{passive:true});
}

function sync(){
  if(route()!=='scorers'){
    document.body?.classList.remove('v959-compact');
    const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    bar?.querySelectorAll(':scope > .v959-back,:scope > .v959-title,:scope > .v959-profile').forEach(n=>n.remove());
    return;
  }
  const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
  if(!bar)return;
  bindScreen();
  ensure(bar);
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
window.addEventListener('scroll',onScroll,{passive:true});

const obs=new MutationObserver(()=>{
  if(mutating||route()!=='scorers')return;
  schedule();
});
obs.observe(document.documentElement,{subtree:true,childList:true});

schedule();
setTimeout(sync,120);
setTimeout(sync,500);
setTimeout(sync,1200);
})();