/* V959 — Refuerza el degradado cuando la interfaz móvil reordena estilos.
   Sólo toca fondos de #/teams. No mueve/oculta letras, logos o controles. */
(function(){
  'use strict';
  if(window.__LJR_V959_TEAMS_GRADIENT__)return;
  window.__LJR_V959_TEAMS_GRADIENT__=true;
  var PAGE='linear-gradient(to bottom,#1938b5 0px,#1938b5 440px,#122a97 760px,#080765 1460px)';
  var HEADER='linear-gradient(to bottom,#07065f 0%,#0a1075 20%,#10228e 39%,#1732a9 58%,#1938b5 77%,#1938b5 100%)';
  function active(){
    return String(location.hash||'').replace(/^#\\?\/?/,'').split('?')[0]==='teams' ||
           document.body && document.body.dataset.appRoute==='teams';
  }
  function set(el,name,value){
    if(el && el.style.getPropertyValue(name)!==value)el.style.setProperty(name,value,'important');
  }
  function apply(){
    if(!active())return;
    var page=document.querySelector('#screen .v27-teams-page');
    var header=page&&page.querySelector(':scope > .v27-teams-head');
    if(!header)return;
    set(page,'background',PAGE);
    set(header,'background',HEADER);
    set(header,'background-color','#1938b5');
    set(header,'border-bottom','0');
    set(header,'box-shadow','none');
  }
  var pending=false;
  function queue(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(function(){pending=false;apply();});
  }
  window.addEventListener('hashchange',queue);
  document.addEventListener('DOMContentLoaded',queue,{once:true});
  var screen=document.getElementById('screen');
  if(screen)new MutationObserver(queue).observe(screen,{childList:true,subtree:false});
  queue();
})();
