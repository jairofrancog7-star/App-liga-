/* V956 — Máximo goleador usa la topbar global fija.
   Así V768 reserva su altura y nunca se tapa al hacer scroll. */
(function(){
'use strict';
if(window.__LJR_V956_SCORERS_GLOBAL_HEADER__)return;
window.__LJR_V956_SCORERS_GLOBAL_HEADER__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
let raf=0;

function ensureTitle(bar){
  let title=bar.querySelector(':scope > .v956-scorers-title');
  if(!title){
    title=document.createElement('span');
    title.className='v956-scorers-title';
    title.textContent='Máximo goleador';
    bar.appendChild(title);
  }
  return title;
}

function sync(){
  raf=0;
  const body=document.body;
  const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
  const screen=document.getElementById('screen');
  if(!body||!bar)return;

  if(route()!=='scorers'){
    bar.classList.remove('v956-scorers-global');
    bar.querySelector(':scope > .v956-scorers-title')?.remove();
    screen?.querySelector(':scope > .v950-scorers-head')?.remove();
    return;
  }

  /* El header viejo dentro del scroller causaba que se perdiera al bajar. */
  screen?.querySelector(':scope > .v950-scorers-head')?.remove();

  bar.classList.add('v956-scorers-global');
  ensureTitle(bar);

  /* Deja que V768 mida la topbar real; nunca forzar 0px aquí. */
  body.style.removeProperty('--v768-head-h');

  /* Refresca el límite superior de #screen después del layout. */
  requestAnimationFrame(()=>{
    window.LJR_SCROLL_CHROME?.refresh?.();
    setTimeout(()=>window.LJR_SCROLL_CHROME?.refresh?.(),60);
  });
}

function queue(){
  if(raf)return;
  raf=requestAnimationFrame(sync);
}

for(const ev of ['hashchange','popstate','load','pageshow','resize','ljr:profile-updated']){
  window.addEventListener(ev,queue,{passive:true});
}
document.addEventListener('DOMContentLoaded',queue,{once:true});
new MutationObserver(queue).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-app-route','class']});
queue();
setTimeout(sync,120);
setTimeout(sync,500);
setTimeout(sync,1200);
})();