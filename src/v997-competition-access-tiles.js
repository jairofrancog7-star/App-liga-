/* V997 · Sólo marca tarjetas de acceso existentes en Competición.
   No crea enlaces nuevos, no modifica el texto ni sustituye manejadores de clic. */
(()=>{
  'use strict';
  if(window.__LJR_V997_COMPETITION_TILES__)return;
  window.__LJR_V997_COMPETITION_TILES__=true;

  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const inCompetition=()=>String(location.hash||'').replace(/^#\/?/,'').split(/[?&]/)[0]==='competition' ||
    (!location.hash && document.body?.dataset.appRoute==='competition');
  function iconFor(text){
    if(/^calendario mensual(?:\b|\s|$)/.test(text))return 'calendar';
    if(/^match center(?:\b|\s|$)/.test(text))return 'match';
    if(/^disciplina(?:\b|\s|$)/.test(text))return 'discipline';
    if(/^comparar(?:\b|\s|$)/.test(text))return 'compare';
    if(text.includes('generar png por categoria')&&text.includes('tablas y avisos'))return 'png';
    return '';
  }

  let frame=0, observed=null, observer=null;
  function apply(){
    frame=0;
    if(!inCompetition())return;
    const screen=document.querySelector('#screen');
    if(!screen)return;
    for(const element of screen.querySelectorAll('button,a,[role="button"]')){
      // Mantener los tabs, las flechas de navegación y los cuadros con iconos propios.
      if(element.classList.contains('v105-card') ||
        element.closest('nav,.tabs,[role="tablist"],.v105-modal,[role="dialog"]'))continue;
      const text=normalize(element.textContent);
      if(!text || text.length>125)continue;
      const kind=iconFor(text);
      if(!kind)continue;
      const bounds=element.getBoundingClientRect();
      if(bounds.width<Math.min(180,window.innerWidth*.52) || bounds.height<48)continue;
      if(element.dataset.v997Icon===kind && element.classList.contains('v997-competition-tile'))continue;
      element.dataset.v997Icon=kind;
      element.classList.add('v997-competition-tile');
    }
  }
  function schedule(){
    if(frame)return;
    frame=requestAnimationFrame(apply);
  }
  function connect(){
    const screen=document.querySelector('#screen');
    if(!screen)return;
    if(screen!==observed){
      observer?.disconnect();
      observed=screen;
      observer=new MutationObserver(schedule);
      observer.observe(screen,{subtree:true,childList:true});
    }
    schedule();
  }
  function onNavigate(){
    connect();
    setTimeout(connect,170);
    setTimeout(connect,600);
  }
  window.addEventListener('hashchange',onNavigate);
  window.addEventListener('pageshow',onNavigate);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',onNavigate,{once:true});
  else onNavigate();
})();
