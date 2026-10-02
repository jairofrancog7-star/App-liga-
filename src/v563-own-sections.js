/* V563 — apartados propios de disciplina: Tarjetas y Castigados. */
(function(){
'use strict';
if(window.__LJR_V563_OWN_SECTIONS__)return;
window.__LJR_V563_OWN_SECTIONS__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
function current(){const v=localStorage.getItem('v563-discipline-view')||'all';return ['all','cards','suspensions'].includes(v)?v:'all'}
function apply(){
 if(!/^(discipline|disciplina|disciplineTool|v4-discipline)$/i.test(route()))return;
 const page=$('.v94-discipline-page');if(!page)return;
 let tabs=$('.v563-discipline-tabs',page);
 if(!tabs){
  const lead=$('.v94-lead',page);
  tabs=document.createElement('div');tabs.className='v563-discipline-tabs';
  tabs.innerHTML='<button type="button" data-v563-disc="all">Todo</button><button type="button" data-v563-disc="cards">Tarjetas</button><button type="button" data-v563-disc="suspensions">Castigados</button>';
  (lead||page.firstElementChild)?.insertAdjacentElement('afterend',tabs);
  tabs.addEventListener('click',e=>{const b=e.target.closest('[data-v563-disc]');if(!b)return;localStorage.setItem('v563-discipline-view',b.dataset.v563Disc);apply()});
 }
 const view=current();
 $$('[data-v563-disc]',tabs).forEach(b=>b.classList.toggle('active',b.dataset.v563Disc===view));
 let shown=0;
 $$('.v94-discipline-row',page).forEach(row=>{
  const hasCards=!!row.querySelector('.v94-yellow,.v94-red');
  const hasSusp=!!row.querySelector('.v94-sanction')||/pend\./i.test(row.querySelector('.v94-total small')?.textContent||'');
  const show=view==='all'||(view==='cards'&&hasCards)||(view==='suspensions'&&hasSusp);
  row.hidden=!show;if(show)shown++;
 });
 let empty=$('.v563-discipline-empty',page);
 if(!shown){
  if(!empty){empty=document.createElement('div');empty.className='v563-discipline-empty';page.appendChild(empty)}
  empty.textContent=view==='cards'?'No hay tarjetas publicadas para mostrar.':view==='suspensions'?'No hay castigados publicados para mostrar.':'No hay registros de disciplina.';
 }else empty?.remove();
 const h=$('h1',page),lead=$('.v94-lead',page);
 if(view==='cards'){if(h)h.textContent='Tarjetas';if(lead)lead.textContent='Tarjetas amarillas y rojas registradas en la Liga.'}
 else if(view==='suspensions'){if(h)h.textContent='Castigados';if(lead)lead.textContent='Jugadores con sanciones o partidos pendientes de cumplir.'}
 else {if(h)h.textContent='Disciplina';if(lead)lead.textContent='Tarjetas amarillas, tarjetas rojas y castigos de todas las categorías.'}
}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(apply,80)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();setTimeout(schedule,800);
})();