/* V1065 — una sola fila funcional de filtros en la cabecera de Más herramientas. */
(function(){
  'use strict';
  if(window.__LJR_V1065_TOOLS_ONCE__)return;
  window.__LJR_V1065_TOOLS_ONCE__=true;
  function onTools(){return (document.body?.dataset?.appRoute||location.hash.replace(/^#\/?/,'').split('?')[0])==='leagueTools';}
  let raf=0;
  function sync(){
    if(!onTools())return;
    const root=document.querySelector('#screen .v726-tools-page');
    const hero=root?.querySelector('.v726-tools-hero');
    if(!root||!hero)return;
    const navs=[...root.querySelectorAll('.v1063-tools-filters')];
    if(!navs.length)return; // El filtro original se monta primero.
    const primary=navs[0];
    if(primary.parentElement!==hero)hero.appendChild(primary);
    navs.slice(1).forEach(nav=>nav.remove());
    // Una única opción por categoría aunque otro módulo clone los botones.
    const ids=new Set();
    primary.querySelectorAll('[data-v1063-filter]').forEach(button=>{
      if(ids.has(button.dataset.v1063Filter))button.remove();
      else ids.add(button.dataset.v1063Filter);
    });
    // Sustituye la antigua fila visual (no interactiva) por el filtro real.
    hero.querySelectorAll('.v726-hero-pills').forEach(old=>{
      const label=(old.textContent||'').toLowerCase();
      if(label.includes('competici')&&label.includes('jornada')&&label.includes('documentos'))old.remove();
    });
    primary.setAttribute('aria-label','Filtrar herramientas por función');
    hero.classList.add('v1065-unique-filter');
  }
  function schedule(){
    if(!onTools()||raf)return;
    raf=requestAnimationFrame(()=>{raf=0;sync();});
  }
  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  const screen=document.getElementById('screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  schedule();
  setTimeout(schedule,350);
})();
