/* V850 — limpieza de la restauración anterior.
   El ranking debe tener UNA sola foto circular por jugador. */
(function(){
  'use strict';
  if(window.__LJR_V850_SCORER_SINGLE_PHOTO__)return;
  window.__LJR_V850_SCORER_SINGLE_PHOTO__=true;

  function clean(){
    document.querySelectorAll('.v462-rank-row').forEach(row=>{
      const pair=row.querySelector(':scope > .v849-player-pair');
      if(pair){
        const avatar=pair.querySelector(':scope > .v576-player-avatar');
        if(avatar)row.insertBefore(avatar,pair);
        pair.remove();
      }
      row.querySelectorAll(':scope > .v849-square-photo').forEach(n=>n.remove());
      const avatars=[...row.querySelectorAll(':scope > .v576-player-avatar')];
      avatars.slice(1).forEach(n=>n.remove());
      row.querySelectorAll('.v462-rank-copy > .v576-inline-player-photo').forEach(n=>n.remove());
    });
  }
  let raf=0;
  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{raf=0;clean()});
  }
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  window.addEventListener('load',schedule);
  window.addEventListener('hashchange',schedule);
  new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
  schedule();
})();
