/* V645 — Competición: conservar el trofeo exactamente en la misma posición
   al cambiar entre Partidos, Clasificación y Cuadro. */
(function(){
  'use strict';
  let baseline=null;

  function route(){
    return String(document.body?.dataset?.appRoute||location.hash.replace(/^#\/?/,'').split('?')[0]||'');
  }
  function topbar(){
    return document.querySelector('#app > .topbar, .app-shell > .topbar');
  }
  function isStandings(){
    return document.body.classList.contains('v40-standings-master');
  }
  function px(v){ return (v==null||v==='')?'auto':String(v); }

  function capture(){
    if(route()!=='competition' || isStandings()) return;
    const bar=topbar();
    if(!bar) return;
    const cs=getComputedStyle(bar,'::before');
    baseline={
      left:px(cs.left),
      right:px(cs.right),
      top:px(cs.top),
      bottom:px(cs.bottom),
      width:px(cs.width),
      height:px(cs.height),
      transform:cs.transform||'none'
    };
    apply();
  }

  function apply(){
    const bar=topbar();
    if(!bar || !baseline) return;
    bar.style.setProperty('--v645-trophy-left',baseline.left);
    bar.style.setProperty('--v645-trophy-right',baseline.right);
    bar.style.setProperty('--v645-trophy-top',baseline.top);
    bar.style.setProperty('--v645-trophy-bottom',baseline.bottom);
    bar.style.setProperty('--v645-trophy-width',baseline.width);
    bar.style.setProperty('--v645-trophy-height',baseline.height);
    bar.style.setProperty('--v645-trophy-transform',baseline.transform);
  }

  function sync(){
    if(route()!=='competition') return;
    if(!isStandings()) capture();
    else apply();
  }

  document.addEventListener('click',e=>{
    if(route()!=='competition') return;
    const tab=e.target.closest('#screen>.tabs .tab');
    if(!tab) return;
    /* Captura ANTES de que Clasificación añada v40-standings-master. */
    if(!isStandings()) capture();
    requestAnimationFrame(sync);
    setTimeout(sync,30);
  },true);

  const mo=new MutationObserver(sync);
  function start(){
    mo.observe(document.body,{attributes:true,attributeFilter:['class','data-app-route']});
    const screen=document.querySelector('#screen');
    if(screen) mo.observe(screen,{childList:true,subtree:false});
    sync();
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();
  window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
})();