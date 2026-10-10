/* V1102 — fondo suave del retrato original al cambiar categoría o imagen. */
(function(){
  'use strict';
  if(window.__LJR_V1102_SCORER_FACES__)return;
  window.__LJR_V1102_SCORER_FACES__=true;
  const frames='.v391-feature-photo,.v390-scorer-photo';
  const images=':scope > img.v576-scorer-hero-photo,:scope > img.v576-hero-player-photo,:scope > img.v971-hero-image';
  const route=()=>{
    const hash=String(location.hash||'');
    const path=hash.startsWith('#/')?hash.slice(2):hash.startsWith('#')?hash.slice(1):hash;
    return path.split('?')[0]||String(document.body?.dataset?.appRoute||'');
  };
  let pending=false;
  function scan(){
    pending=false;
    if(route()!=='scorers')return;
    document.querySelectorAll('#screen '+frames.split(',').join(',#screen ')).forEach(frame=>{
      const img=frame.querySelector(images);
      const src=img?.currentSrc||img?.src||'';
      if(frame.dataset.v1102ScorerSrc===src)return;
      frame.dataset.v1102ScorerSrc=src;
      if(src){
        frame.style.setProperty('--v1102-scorer-image','url('+JSON.stringify(src)+')');
      }else{
        frame.style.removeProperty('--v1102-scorer-image');
      }
    });
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(scan);
  }
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  document.addEventListener('load',event=>{
    if(event.target instanceof HTMLImageElement&&event.target.matches(images.replaceAll(':scope > ','')))schedule();
  },true);
  window.addEventListener('hashchange',schedule);
  window.addEventListener('ljr:official-data',schedule);
  const root=document.querySelector('#screen')||document.documentElement;
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  schedule();
})();