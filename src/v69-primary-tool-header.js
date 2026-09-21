/* V69.2 — cabecera principal sólo en las pantallas solicitadas.
   IMPORTANTE: "Ver detalles" conserva SIEMPRE su cabecera propia V28. */
(function(){
  'use strict';

  const MATCH_CENTER_FLAG='v69-match-center-entry';

  function route(){
    return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0];
  }

  function isMatchCenterEntry(){
    return sessionStorage.getItem(MATCH_CENTER_FLAG)==='1';
  }

  function shouldUseMainHeader(){
    const r=route();

    if(r==='home'||r==='competition') return false;

    /* La ruta #/match se comparte entre Match Center y "Ver detalles".
       Sólo Match Center usa la cabecera principal; Ver detalles conserva V28. */
    if(r==='match') return isMatchCenterEntry();

    if(/^(matchCenter|match-center|v4-calendar|calendar|monthlyCalendar|calendarMonthly|v4-discipline|discipline|disciplina|disciplineTool|compare|comparar|compareTeams)$/i.test(r)){
      return true;
    }

    const screen=document.querySelector('#screen');
    if(!screen) return false;

    /* Comparar vive como hoja/overlay dentro de la ficha de equipo. */
    if(screen.querySelector('.v42-compare-sheet,[data-compare],[data-team-compare]')) return true;

    const text=(screen.innerText||screen.textContent||'').replace(/\s+/g,' ').trim();

    /* No aplicar por texto dentro del detalle de partido. */
    if(screen.querySelector('[data-v28-match]')||document.body.classList.contains('v28-match-active')){
      return false;
    }

    return /Calendario mensual|Match Center|Información disciplinaria|^Disciplina\b|\bComparar\b/i.test(text);
  }

  function sync(){
    const r=route();
    const useMain=shouldUseMainHeader();
    const isMatchCenter=/^(v4-matchcenter|matchCenter|match-center)$/i.test(r) || (r==='match'&&isMatchCenterEntry());
    document.body.classList.toggle('v69-primary-tool-header',useMain);
    document.body.classList.toggle('v69-match-center-header',useMain&&isMatchCenter);
  }

  /* Distingue la tarjeta Match Center de cualquier botón "Ver detalles". */
  document.addEventListener('click',e=>{
    const target=e.target.closest?.('button,a,[data-route],[data-match]');

    if(target?.matches?.('[data-match]') || target?.closest?.('[data-match]')){
      sessionStorage.removeItem(MATCH_CENTER_FLAG);
    }else{
      const routeButton=target?.closest?.('[data-route="match"]') || (target?.dataset?.route==='match'?target:null);
      if(routeButton){
        const label=(routeButton.textContent||'').replace(/\s+/g,' ').trim();
        if(/Match Center/i.test(label)) sessionStorage.setItem(MATCH_CENTER_FLAG,'1');
        else sessionStorage.removeItem(MATCH_CENTER_FLAG);
      }
    }

    setTimeout(sync,0);
  },true);

  window.addEventListener('hashchange',()=>{
    const r=route();
    if(r!=='match') sessionStorage.removeItem(MATCH_CENTER_FLAG);
    requestAnimationFrame(sync);
  });
  window.addEventListener('popstate',()=>requestAnimationFrame(sync));

  const screen=document.querySelector('#screen');
  if(screen){
    new MutationObserver(()=>requestAnimationFrame(sync)).observe(screen,{childList:true,subtree:true,characterData:true});
  }

  /* Al recargar directamente un #/match se protege "Ver detalles":
     no se supone que sea Match Center sin una entrada explícita desde su tarjeta. */
  if(route()==='match' && !isMatchCenterEntry()) document.body.classList.remove('v69-primary-tool-header');

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
})();