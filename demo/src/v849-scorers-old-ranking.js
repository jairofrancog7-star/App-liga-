/* V849 — restaura en #/scorers el par de foto circular + cuadro redondeado
   del ranking anterior. No modifica datos ni las tarjetas grandes superiores. */
(function(){
  'use strict';
  if(window.__LJR_V849_SCORERS_OLD_RANKING__)return;
  window.__LJR_V849_SCORERS_OLD_RANKING__=true;

  function isScorers(){
    const route=String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
    return route==='scorers'||document.body?.dataset?.appRoute==='scorers';
  }

  function syncSquare(pair){
    if(!pair)return;
    const avatar=pair.querySelector(':scope > .v576-player-avatar');
    const square=pair.querySelector(':scope > .v849-square-photo');
    if(!avatar||!square)return;
    const html=avatar.innerHTML;
    if(square.innerHTML!==html)square.innerHTML=html;
    square.classList.toggle('v849-has-photo',!!square.querySelector('img'));
  }

  function enhanceRow(row){
    if(!(row instanceof Element))return;
    let pair=row.querySelector(':scope > .v849-player-pair');
    if(!pair){
      const avatar=row.querySelector(':scope > .v576-player-avatar');
      if(!avatar)return;
      pair=document.createElement('span');
      pair.className='v849-player-pair';
      const square=document.createElement('span');
      square.className='v849-square-photo';
      row.insertBefore(pair,avatar);
      pair.appendChild(avatar);
      pair.appendChild(square);
    }
    row.classList.add('v849-old-row');
    syncSquare(pair);
  }

  let raf=0;
  function apply(){
    raf=0;
    if(!isScorers())return;
    document.querySelectorAll('.v462-rank-row[data-v462-ranking-kind="player"],.v462-rank-row[data-v194-player]').forEach(enhanceRow);
  }
  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(apply);
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('load',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  new MutationObserver(schedule).observe(document.documentElement,{
    childList:true,subtree:true,attributes:true,attributeFilter:['src','class']
  });
  schedule();
  setTimeout(schedule,250);
  setTimeout(schedule,900);
})();
