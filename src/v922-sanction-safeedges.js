/* V922 — Ajusta la altura del modal de sanciones al borde real de la barra inferior. */
(function(){
  'use strict';
  if(window.__LJR_V922_SANCTION_SAFE_EDGES__)return;
  window.__LJR_V922_SANCTION_SAFE_EDGES__=true;
  let frame=0;
  function sync(){
    frame=0;
    const body=document.body;
    const modal=body?.querySelector(':scope > .v105-modal.v639-sanction-modal');
    if(!modal){
      body?.style.removeProperty('--v922-sanction-nav-gap');
      return;
    }
    const nav=document.querySelector('#app > .bottom-nav, .app-shell > .bottom-nav');
    let gap=0;
    if(nav){
      const r=nav.getBoundingClientRect();
      const visible=getComputedStyle(nav);
      if(visible.display!=='none' && visible.visibility!=='hidden' && r.height>0 &&
         r.top < window.innerHeight && r.bottom>0){
        gap=Math.max(0,Math.ceil(window.innerHeight-r.top));
      }
    }
    // Un píxel de seguridad asegura que ningún botón del modal invada la navegación.
    const value=Math.min(240,gap?gap+1:0)+'px';
    if(body.style.getPropertyValue('--v922-sanction-nav-gap')!==value){
      body.style.setProperty('--v922-sanction-nav-gap',value);
    }
  }
  function queue(){if(!frame)frame=requestAnimationFrame(sync);}
  function boot(){
    new MutationObserver(queue).observe(document.body,{childList:true});
    window.addEventListener('resize',queue,{passive:true});
    window.addEventListener('orientationchange',queue,{passive:true});
    window.addEventListener('hashchange',queue);
    window.visualViewport?.addEventListener('resize',queue,{passive:true});
    document.addEventListener('visibilitychange',queue);
    queue();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
