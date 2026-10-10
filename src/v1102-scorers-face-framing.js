/* V1111 — Mantiene los retratos originales centrados aunque cambie la categoría. */
(function(){
  'use strict';
  if(window.__LJR_V1111_SCORER_FACE_LOCK__)return;
  window.__LJR_V1111_SCORER_FACE_LOCK__=true;
  const selector='#screen .v391-feature-photo,#screen .v390-scorer-photo';
  const photoSelector=':scope > img.v576-scorer-hero-photo,:scope > img.v576-hero-player-photo,:scope > img.v971-hero-image';
  const lastPhoto=new WeakMap();
  let pending=false;
  function scan(){
    pending=false;
    document.querySelectorAll(selector).forEach(frame=>{
      const img=frame.querySelector(photoSelector);
      const src=img?.currentSrc||img?.getAttribute('src')||'';
      if(lastPhoto.get(frame)===src)return;
      lastPhoto.set(frame,src);
      if(src)frame.style.setProperty('--v1102-scorer-image','url('+JSON.stringify(src)+')');
      else frame.style.removeProperty('--v1102-scorer-image');
    });
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(scan);
  }
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  document.addEventListener('load',e=>{
    if(e.target instanceof HTMLImageElement && e.target.closest(selector))schedule();
  },true);
  window.addEventListener('hashchange',schedule);
  window.addEventListener('ljr:official-data',schedule);
  document.addEventListener('click',e=>{
    if(e.target instanceof Element && e.target.closest('[data-v934-category],[data-v934-stat],[data-v194-category]'))
      schedule();
  },true);
  const host=document.querySelector('#screen')||document.documentElement;
  new MutationObserver(schedule).observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['src']});
  schedule();
})();