/* V950 — cabecera estable de Máximo goleador dentro de #screen. */
(function(){
'use strict';
if(window.__LJR_V950_SCORERS_FINAL_PAGE__)return;
window.__LJR_V950_SCORERS_FINAL_PAGE__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
let queued=false;

const backSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
const profileSvg='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4.5 20.5c1.5-3.7 4-5.5 7.5-5.5s6 1.8 7.5 5.5"/></svg>';

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
  head.className='v950-scorers-head';
  head.setAttribute('aria-label','Cabecera de Máximo goleador');
  head.innerHTML=
    '<button type="button" class="v950-scorers-back" aria-label="Regresar">'+backSvg+'</button>'+
    '<div class="v950-scorers-title">Máximo goleador</div>'+
    '<button type="button" class="v950-scorers-profile" aria-label="Perfil">'+profileSvg+'</button>';
  head.querySelector('.v950-scorers-back').addEventListener('click',goBack);
  head.querySelector('.v950-scorers-profile').addEventListener('click',goProfile);
  return head;
}

function sync(){
  queued=false;
  const screen=document.getElementById('screen');
  if(!screen)return;

  if(route()!=='scorers'){
    screen.querySelector(':scope > .v950-scorers-head')?.remove();
    return;
  }

  let head=screen.querySelector(':scope > .v950-scorers-head');
  if(!head){
    head=build();
    screen.prepend(head);
  }else if(screen.firstElementChild!==head){
    screen.prepend(head);
  }
}

function queue(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(sync);
}

window.addEventListener('hashchange',queue);
window.addEventListener('popstate',queue);
window.addEventListener('load',queue);
document.addEventListener('DOMContentLoaded',queue,{once:true});
const screen=document.getElementById('screen');
if(screen)new MutationObserver(queue).observe(screen,{childList:true,subtree:false});
queue();
setTimeout(sync,120);
setTimeout(sync,450);
setTimeout(sync,1200);
})();