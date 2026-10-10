/* V1211 — Máximo goleador: fotos originales completas, sin recortes recurrentes.
   Protección exclusiva de las tarjetas grandes en las cinco categorías. */
(function(){
  'use strict';
  if(window.__LJR_V1111_SCORER_FACE_LOCK__)return;
  window.__LJR_V1111_SCORER_FACE_LOCK__=true;

  const selector='#screen .v391-feature-photo,#screen .v390-scorer-photo';
  const photoSelector=':scope > img.v576-scorer-hero-photo,:scope > img.v576-hero-player-photo,:scope > img.v971-hero-image';
  const observedImages=new WeakSet();
  const lastPhoto=new WeakMap();
  const safeStyles={
    'position':'absolute','inset':'0','left':'0','right':'0','top':'0','bottom':'0',
    'width':'100%','height':'100%',
    'min-width':'0','min-height':'0','max-width':'100%','max-height':'100%',
    'display':'block','visibility':'visible','opacity':'1',
    'object-fit':'contain','object-position':'center center',
    'transform':'none','translate':'none','scale':'1',
    'filter':'none','clip-path':'none',
    'border':'0','border-radius':'0','margin':'0','padding':'0','z-index':'1'
  };
  // Normalize CSSOM values (for example 0 becomes 0px) before comparing styles.
  // Otherwise an image's style observer could continuously rewrite the same values.
  const probe=document.createElement('img');
  for(const [prop,value] of Object.entries(safeStyles))probe.style.setProperty(prop,value,'important');
  const normalizedStyles=Object.fromEntries(Object.keys(safeStyles).map(prop=>[prop,probe.style.getPropertyValue(prop)]));
  let pending=false;

  function enforce(img){
    // Some old face-crop routines write inline !important sizing / object-fit.
    // Reapply only when a value actually differs, avoiding observer loops.
    if(img.hasAttribute('data-ljr-hero-face-crop'))img.removeAttribute('data-ljr-hero-face-crop');
    for(const [prop,value] of Object.entries(safeStyles)){
      if(img.style.getPropertyValue(prop)!==normalizedStyles[prop]||img.style.getPropertyPriority(prop)!=='important'){
        img.style.setProperty(prop,value,'important');
      }
    }
    if(!observedImages.has(img)){
      observedImages.add(img);
      new MutationObserver(schedule).observe(img,{
        attributes:true,attributeFilter:['style','src','class','data-ljr-hero-face-crop']
      });
    }
  }

  function scan(){
    pending=false;
    document.querySelectorAll(selector).forEach(frame=>{
      const img=frame.querySelector(photoSelector);
      const src=img?.currentSrc||img?.getAttribute('src')||'';
      const hasPhoto=Boolean(img&&src);
      if(frame.classList.contains('ljr-v1211-face-present')!==hasPhoto){
        frame.classList.toggle('ljr-v1211-face-present',hasPhoto);
      }
      if(lastPhoto.get(frame)!==src){
        lastPhoto.set(frame,src);
        if(src)frame.style.setProperty('--v1102-scorer-image','url('+JSON.stringify(src)+')');
        else frame.style.removeProperty('--v1102-scorer-image');
      }
      if(hasPhoto)enforce(img);
    });
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(scan);
  }

  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  document.addEventListener('load',event=>{
    if(event.target instanceof HTMLImageElement&&event.target.closest(selector))schedule();
  },true);
  window.addEventListener('hashchange',schedule);
  window.addEventListener('ljr:official-data',schedule);
  document.addEventListener('click',event=>{
    if(event.target instanceof Element&&event.target.closest(
      '[data-v934-category],[data-v934-stat],[data-v194-cat],[data-v194-category],[data-v391-category],[data-v194-team]'
    ))schedule();
  },true);
  const host=document.querySelector('#screen')||document.documentElement;
  new MutationObserver(schedule).observe(host,{
    childList:true,subtree:true,attributes:true,attributeFilter:['src']
  });
  schedule();
})();
