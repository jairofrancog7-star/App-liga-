/* V961 — Un solo azul uniforme en Equipos; elimina el degradado anterior.
   Sólo toca fondos de #/teams. No mueve/oculta letras, logos o controles. */
(function(){
  'use strict';
  if(window.__LJR_V959_TEAMS_GRADIENT__)return;
  window.__LJR_V959_TEAMS_GRADIENT__=true;
  var PAGE='#1938b5';
  var HEADER='#1938b5';
  function active(){
    var hash=String(location.hash||'');
    var current=(hash.indexOf('#/')===0?hash.slice(2):hash.replace(/^#/,'' )).split('?')[0];
    return current==='teams' || (document.body && document.body.dataset.appRoute==='teams');
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
