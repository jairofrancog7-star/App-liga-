/* V610 — stable Más cleanup: hide stale lower cards before paint, never remove/reinject.
   Fixes the brief flashing card seen while scrolling. */
(function(){
'use strict';
if(window.__LJR_V610_MORE_STABLE__)return;
window.__LJR_V610_MORE_STABLE__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const BAD_TEXT=[
  'generar png por categoría',
  'generar png por categoria',
  'tablas y avisos',
  'quiniela de la liga'
];

function hide(el){
  if(!el||el.dataset?.v610Hidden==='1')return;
  el.dataset.v610Hidden='1';
  el.hidden=true;
  el.setAttribute('aria-hidden','true');
  el.style.setProperty('display','none','important');
  el.style.setProperty('visibility','hidden','important');
  el.style.setProperty('opacity','0','important');
  el.style.setProperty('height','0','important');
  el.style.setProperty('min-height','0','important');
  el.style.setProperty('max-height','0','important');
  el.style.setProperty('margin','0','important');
  el.style.setProperty('padding','0','important');
  el.style.setProperty('border','0','important');
  el.style.setProperty('overflow','hidden','important');
}

function text(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}

function clean(root=document){
  const r=route();
  if(r!=='more'&&r!=='leagueTools')return;
  const screen=document.querySelector('#screen');if(!screen)return;

  // Legacy lower modules: keep hidden in DOM so their own observers do not recreate them.
  screen.querySelectorAll(
    '#v411-lower-experience,#v412-lower-sections,#safeMore,'+
    '[data-v411-owner="more"],[data-v411-zone="more"],#v105-bottom[data-v105-route="more"]'
  ).forEach(hide);

  // Exact unwanted card from the video: "Generar PNG por categoría · Tablas y avisos ›".
  const scope=root instanceof Element||root instanceof Document?root:screen;
  const candidates=[];
  if(scope instanceof Element)candidates.push(scope);
  scope.querySelectorAll?.('button,a,article,section,div').forEach(el=>candidates.push(el));
  candidates.forEach(el=>{
    const t=text(el.textContent);
    if(!t)return;
    if(BAD_TEXT.some(x=>t.includes(text(x)))){
      // Prefer the clickable/card container, not the whole Más page.
      const card=el.closest('button,a,[role="button"],article')||el;
      if(card!==screen&&!card.classList.contains('v19-more-page'))hide(card);
    }
  });
}

clean();
const screen=document.querySelector('#screen');
if(screen){
  new MutationObserver(muts=>{
    const r=route();if(r!=='more'&&r!=='leagueTools')return;
    for(const m of muts){
      for(const n of m.addedNodes){
        if(n.nodeType===1)clean(n);
      }
    }
  }).observe(screen,{childList:true,subtree:true});
}
window.addEventListener('hashchange',()=>requestAnimationFrame(clean));
window.addEventListener('pageshow',()=>requestAnimationFrame(clean));
})();