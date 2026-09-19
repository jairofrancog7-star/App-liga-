/* V69 — activa la cabecera principal únicamente en las herramientas solicitadas. */
(function(){
  'use strict';

  function route(){
    return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0];
  }

  function shouldUseMainHeader(){
    const r=route();
    if(r==='home'||r==='competition') return false;

    /* Rutas conocidas y aliases para versiones/cachés anteriores. */
    if(/^(match|matchCenter|match-center|v4-calendar|calendar|monthlyCalendar|calendarMonthly|discipline|disciplina|disciplineTool|compare|comparar|compareTeams)$/i.test(r)){
      return true;
    }

    const screen=document.querySelector('#screen');
    if(!screen) return false;

    /* Comparar vive como hoja/overlay dentro de la ficha de equipo. */
    if(screen.querySelector('.v42-compare-sheet,[data-compare],[data-team-compare]')) return true;

    /* Si una versión anterior abre estas herramientas con otro hash,
       el título visible sigue activando la misma cabecera sin tocar Competición. */
    const text=(screen.innerText||screen.textContent||'').replace(/\s+/g,' ').trim();
    return /Calendario mensual|Match Center|Información disciplinaria|^Disciplina\b|\bComparar\b/i.test(text);
  }

  function sync(){
    document.body.classList.toggle('v69-primary-tool-header',shouldUseMainHeader());
  }

  window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
  window.addEventListener('popstate',()=>requestAnimationFrame(sync));
  document.addEventListener('click',()=>setTimeout(sync,0),true);

  const screen=document.querySelector('#screen');
  if(screen){
    new MutationObserver(()=>requestAnimationFrame(sync)).observe(screen,{childList:true,subtree:true,characterData:true});
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',sync,{once:true});
  else sync();
})();