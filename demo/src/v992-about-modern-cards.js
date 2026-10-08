/* V992 — Sólo Sobre la Liga (#/safe-about).
   Realza cuadros y habilita detalles sin tocar Historia, datos ni rutas. */
(function(){
  'use strict';
  if(window.__LJR_V992_ABOUT_CARDS__)return;
  window.__LJR_V992_ABOUT_CARDS__=true;

  const expanded=new Set();
  let cardSeq=0,queued=false;

  function isAbout(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]==='safe-about';
  }
  // Solo conservar los logos que estaban en el contenido original.
  // No colocar el logo de Liga en cada fecha, cargo, categoria o tarjeta.
  function markOriginalCrest(card){
    const image=card.querySelector(':scope > img');
    if(image)image.classList.add('v992-original-crest');
  }

  function ensureDetails(card,detail){
    if(!detail||!detail.textContent.trim()||card.querySelector('[data-v992-details]'))return;
    const title=card.querySelector('h3,h4,b')?.textContent?.trim()||'Registro';
    const id='v992-about-detail-'+(++cardSeq);
    const key=title+'|'+detail.textContent.trim().slice(0,100);
    card.dataset.v992Key=key;
    detail.id=id;
    detail.classList.add('v992-detail');
    const open=expanded.has(key);
    card.classList.toggle('v992-open',open);
    const button=document.createElement('button');
    button.type='button';
    button.className='v992-more';
    button.dataset.v992Details='';
    button.setAttribute('aria-controls',id);
    button.setAttribute('aria-expanded',String(open));
    button.innerHTML='<span>'+(open?'Ocultar detalles':'Ver más detalles')+'</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
    // En cronologías el botón pertenece al bloque de texto, no a la columna de fecha.
    const host=card.matches('.v33-about-timeline article')?card.querySelector(':scope > div'):card;
    (host||card).appendChild(button);
  }

  function enhance(){
    queued=false;
    if(!isAbout())return;
    const root=document.querySelector('.v33-about[data-v33-about]');
    if(!root)return;
    root.querySelectorAll('.v33-about-history-grid article').forEach(card=>{
      if(card.dataset.v992Card==='record')return;
      card.dataset.v992Card='record';
      card.classList.add('v992-card','v992-record');
      markOriginalCrest(card);
      ensureDetails(card,card.querySelector(':scope > p'));
    });
    root.querySelectorAll('.v33-about-timeline article').forEach(card=>{
      if(card.dataset.v992Card==='timeline')return;
      card.dataset.v992Card='timeline';
      card.classList.add('v992-card','v992-timeline');

      ensureDetails(card,card.querySelector(':scope > div > p'));
    });
    root.querySelectorAll('.v33-about-format-grid article').forEach(card=>{
      if(card.dataset.v992Card==='format')return;
      card.dataset.v992Card='format';
      card.classList.add('v992-card','v992-format');

      ensureDetails(card,card.querySelector(':scope > p'));
    });
    root.querySelectorAll('.v33-about-board article').forEach(card=>{
      if(card.dataset.v992Card==='board')return;
      card.dataset.v992Card='board';
      card.classList.add('v992-card','v992-board');

    });
    root.querySelectorAll('.v33-about-history-facts > div').forEach(card=>{
      if(card.dataset.v992Card==='fact')return;
      card.dataset.v992Card='fact';
      card.classList.add('v992-card','v992-fact');
      ensureDetails(card,card.querySelector(':scope > span'));
    });
  }
  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(enhance);
  }
  document.addEventListener('click',function(e){
    const btn=e.target.closest('[data-v992-details]');
    if(!btn||!isAbout())return;
    e.preventDefault();
    const card=btn.closest('.v992-card');
    if(!card)return;
    const next=!card.classList.contains('v992-open');
    card.classList.toggle('v992-open',next);
    if(next)expanded.add(card.dataset.v992Key);
    else expanded.delete(card.dataset.v992Key);
    btn.setAttribute('aria-expanded',String(next));
    btn.querySelector('span').textContent=next?'Ocultar detalles':'Ver más detalles';
  },true);
  function init(){
    const screen=document.querySelector('#screen');
    if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
    schedule();
  }
  window.addEventListener('hashchange',schedule);
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();