/* V160 — acciones auxiliares del nuevo diseño de Tácticas. */
(function(){
'use strict';
if(window.__LJR_V160_TACTICS_BLUE__)return;
window.__LJR_V160_TACTICS_BLUE__=true;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const bind=()=>{
  if(route()!=='tactics')return;
  const b=document.querySelector('[data-v160-scroll-board]');
  if(b&&!b.dataset.v160Bound){
    b.dataset.v160Bound='1';
    b.addEventListener('click',()=>{
      (document.querySelector('[data-v160-main-board]')||document.querySelector('#v100-tactics-extra'))?.scrollIntoView({behavior:'smooth',block:'start'});
    });
  }
  const adv=document.querySelector('#v100-tactics-extra');
  if(adv&&!adv.dataset.v160Label){
    adv.dataset.v160Label='1';
    const head=adv.querySelector('.v100-head');
    if(head&&!head.querySelector('.v160-advanced-chip')){
      const chip=document.createElement('div');chip.className='v160-advanced-chip';chip.textContent='TABLERO AVANZADO · ARRASTRA / GUARDA / PNG / JSON';
      head.insertAdjacentElement('afterend',chip);
    }
  }
  if(adv&&!adv.querySelector('.v160-advanced-source-label')){
    const label=document.createElement('div');
    label.className='v160-advanced-source-label';
    label.textContent='PARTIDO / TÁCTICA 3D';
    const controls=adv.querySelector('.v100-tactic-controls');
    if(controls)controls.insertAdjacentElement('beforebegin',label);
  }
  document.querySelectorAll('[data-v160-scroll-advanced]').forEach(btn=>{
    if(btn.dataset.v160AdvancedBound)return;
    btn.dataset.v160AdvancedBound='1';
    btn.addEventListener('click',()=>adv?.scrollIntoView({behavior:'smooth',block:'start'}));
  });
};
let t=0;const schedule=()=>{clearTimeout(t);t=setTimeout(bind,80)};
window.addEventListener('hashchange',schedule);
const screen=document.querySelector('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
setTimeout(schedule,600);
})();