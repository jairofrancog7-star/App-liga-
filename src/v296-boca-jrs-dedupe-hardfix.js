/* V296 — Boca Jrs. 04 may 2024: remove duplicate card in Historia > Campeones.
   Keeps the upper/main card (prefer the one identified as Boca Jrs. · Cuenda) and removes later duplicates. */
(function(){
  'use strict';
  if(window.__LJR_V296_BOCA_DEDUPE__) return;
  window.__LJR_V296_BOCA_DEDUPE__=true;

  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function isChampions(){
    return norm(document.querySelector('.v35-tab.active')?.textContent).includes('campeones');
  }

  function isBoca2024(card){
    const t=norm(card?.textContent);
    return t.includes('boca jrs') && t.includes('04 may 2024') && t.includes('campeon');
  }

  function dedupe(){
    if((location.hash||'').indexOf('history')<0) return;
    if(!isChampions()) return;

    document.querySelectorAll('.v35-history-archive-compact .v35-history-moments').forEach(container=>{
      const cards=[...container.children].filter(el=>el.matches('.v35-history-moment,.v35-champion-card,.v115-card') && isBoca2024(el));
      if(cards.length<2) return;

      const preferred=cards.find(card=>norm(card.querySelector('h3')?.textContent).includes('cuenda')) || cards[0];
      cards.forEach(card=>{
        if(card!==preferred) card.remove();
      });
    });
  }

  let timer=0;
  function schedule(ms=0){
    clearTimeout(timer);
    timer=setTimeout(()=>{dedupe();setTimeout(dedupe,100);setTimeout(dedupe,350);setTimeout(dedupe,800);},ms);
  }

  window.addEventListener('hashchange',()=>schedule(30));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(80);
  },true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(40)).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
  }else{
    schedule(60);
  }
})();