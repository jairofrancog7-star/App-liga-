/* V962 — Retirar los fondos inline de versiones V959-V961.
   El CSS V962 es la única fuente del degradado. Sólo ruta Equipos. */
(function(){
  'use strict';
  if(window.__LJR_V962_TEAMS_GRADIENT__)return;
  window.__LJR_V962_TEAMS_GRADIENT__=true;

  function routeIsTeams(){
    var hash=String(location.hash||'');
    var route=(hash.indexOf('#/')===0?hash.slice(2):hash.replace(/^#/,'')).split('?')[0];
    return route==='teams' || (document.body && document.body.dataset.appRoute==='teams');
  }
  function releaseBackground(el){
    if(!el)return;
    ['background','background-color','background-image','background-attachment',
     'background-position','background-size','background-repeat'].forEach(function(prop){
      if(el.style.getPropertyValue(prop))el.style.removeProperty(prop);
    });
  }
  function apply(){
    if(!routeIsTeams())return;
    var page=document.querySelector('#screen .v27-teams-page');
    if(!page)return;
    releaseBackground(page);
    releaseBackground(page.querySelector(':scope > .v27-teams-head'));
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
