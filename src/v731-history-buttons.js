/* V731 — Historia: detalles funcionales y refuerzo de controles.
   No agrega botones encima de fotografías; sólo tarjetas de texto, records
   y Memoria de clubes. */
(function(){
  'use strict';
  if(window.__LJR_V731_HISTORY_DETAILS__)return;
  window.__LJR_V731_HISTORY_DETAILS__=true;

  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

  function markRecord(card){
    if(!card || card.dataset.v731DetailReady==='1')return;
    if(card.closest('.v35-history-moment-photo,.v35-champion-card-photo,.v115-card,.v35-feature-card'))return;
    if(card.querySelector('[data-v674-details],[data-v329-details],[data-v330-details],[data-v355-final-detail],[data-v358-details],.v731-history-details'))return;

    const p=card.querySelector('p');
    if(!p || !String(p.textContent||'').trim())return;

    card.dataset.v731DetailReady='1';
    card.classList.add('v731-history-card');
    p.classList.add('v731-history-detail-copy');

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='v731-history-details';
    btn.setAttribute('data-v731-history-details','');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span>Ver detalles</span><i aria-hidden="true">›</i>';
    (card.querySelector(':scope > div:last-child')||card).appendChild(btn);
  }

  function markLegacy(card){
    if(!card || card.dataset.v731DetailReady==='1')return;
    const copy=card.querySelector('.v370-legacy-copy');
    if(!copy)return;
    card.dataset.v731DetailReady='1';
    card.classList.add('v731-history-card');

    const detail=document.createElement('span');
    detail.className='v731-legacy-extra v731-history-detail-copy';
    const categories=card.querySelector('.v710-team-meta em')?.textContent?.trim()||'Categoría por precisar';
    const years=card.querySelector('.v710-team-meta b')?.textContent?.trim()||'Archivo histórico';
    const first=card.querySelector('.v717-first-seen b')?.textContent?.trim()||'Fecha inicial por precisar';
    const lineage=card.querySelector('.v706-lineage')?.textContent?.trim()||'';
    detail.textContent=[categories,years,first,lineage].filter(Boolean).join(' · ');
    copy.appendChild(detail);

    const btn=document.createElement('button');
    btn.type='button';
    btn.className='v731-history-details';
    btn.setAttribute('data-v731-history-details','');
    btn.setAttribute('aria-expanded','false');
    btn.innerHTML='<span>Ver detalles</span><i aria-hidden="true">›</i>';
    copy.appendChild(btn);
  }

  function enhance(){
    if(route()!=='history')return;
    const root=document.querySelector('.v35-history-page');
    if(!root)return;

    root.querySelectorAll('.v35-record-card,.v35-stat-card,.v35-tagged-row,.v35-timeline-list article').forEach(markRecord);
    root.querySelectorAll('.v370-legacy-team').forEach(markLegacy);

    /* Los controles nativos deben seguir siendo botones reales y táctiles. */
    root.querySelectorAll(
      '[data-v35-tab],[data-v35-tab-jump],[data-v35-season],[data-v35-era-team],'+
      '[data-v340-champion-cat],[data-v710-category],[data-v710-sort],'+
      '[data-v35-video],[data-v35-history-source],[data-v348-load-archive],'+
      '[data-v674-details],[data-v329-details],[data-v330-details],'+
      '[data-v355-final-detail],[data-v358-details]'
    ).forEach(btn=>{
      if(btn.tagName==='BUTTON')btn.type='button';
      btn.style.touchAction='manipulation';
      btn.style.pointerEvents='auto';
    });
  }

  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-v731-history-details]');
    if(!btn || route()!=='history')return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    const card=btn.closest('.v731-history-card');
    if(!card)return;
    const open=!card.classList.contains('is-v731-open');
    card.classList.toggle('is-v731-open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
    const label=btn.querySelector('span');
    const icon=btn.querySelector('i');
    if(label)label.textContent=open?'Ocultar detalles':'Ver detalles';
    if(icon)icon.textContent=open?'⌃':'›';
  },true);

  let timer=0;
  function schedule(ms=30){
    clearTimeout(timer);
    timer=setTimeout(()=>requestAnimationFrame(enhance),ms);
  }
  window.addEventListener('hashchange',()=>schedule(40));
  document.addEventListener('click',e=>{
    if(route()==='history' && e.target.closest(
      '[data-v35-tab],[data-v35-tab-jump],[data-v340-champion-cat],'+
      '[data-v710-category],[data-v710-sort],[data-v348-load-archive]'
    ))schedule(80);
  },false);

  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>schedule(20)).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(70),{once:true});
  else schedule(20);
})();