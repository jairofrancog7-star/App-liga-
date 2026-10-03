/* V563 — apartados propios de disciplina: Tarjetas y Castigados. */
(function(){
'use strict';
if(window.__LJR_V563_OWN_SECTIONS__)return;
window.__LJR_V563_OWN_SECTIONS__=true;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
function current(){const v=localStorage.getItem('v563-discipline-view')||'all';return ['all','cards','suspensions'].includes(v)?v:'all'}
function currentCat(){return localStorage.getItem('v563-discipline-category')||'all'}
function shortCat(name,id){
 const n=String(name||'');
 if(String(id)==='3'||/PRIMERA/i.test(n))return 'Primera';
 if(String(id)==='5'||/INTERMEDIA/i.test(n))return 'Intermedia';
 if(String(id)==='4'||/SEGUNDA/i.test(n))return 'Segunda';
 if(String(id)==='2'||/35/.test(n))return '35+';
 if(String(id)==='1'||/50/.test(n))return '50+';
 return n||('Cat. '+id);
}
function apply(){
 if(!/^(discipline|disciplina|disciplineTool|v4-discipline)$/i.test(route()))return;
 const page=$('.v94-discipline-page');if(!page)return;
 if(page.querySelector('.v655-discipline-controls'))return;
 let tabs=$('.v563-discipline-tabs',page);
 if(!tabs){
  const lead=$('.v94-lead',page);
  tabs=document.createElement('div');tabs.className='v563-discipline-tabs';
  tabs.innerHTML='<button type="button" data-v563-disc="all">Todo</button><button type="button" data-v563-disc="cards">Tarjetas</button><button type="button" data-v563-disc="suspensions">Castigados</button>';
  (lead||page.firstElementChild)?.insertAdjacentElement('afterend',tabs);
  tabs.addEventListener('click',e=>{const b=e.target.closest('[data-v563-disc]');if(!b)return;e.preventDefault();e.stopPropagation();localStorage.setItem('v563-discipline-view',b.dataset.v563Disc);apply()});
 }

 let cats=$('.v652-discipline-cats',page);
 const rows=$$('.v94-discipline-row',page);
 const officialCats=[
  ['all','Todas'],
  ['3','Primera Fuerza'],
  ['5','Intermedia'],
  ['4','Segunda Fuerza'],
  ['2','Veteranos 35+'],
  ['1','Veteranos 50+']
 ];
 if(!cats){
  cats=document.createElement('div');cats.className='v652-discipline-cats';
  tabs.insertAdjacentElement('afterend',cats);
 }
 cats.innerHTML='<div class="v652-cat-head"><b>Ver por categoría</b><small>Filtra tarjetas y castigados</small></div>'+
  '<div class="v652-cat-rail" role="tablist" aria-label="Filtrar disciplina por categoría">'+
  officialCats.map(([id,name])=>'<button type="button" data-v563-cat="'+id+'" title="'+name+'">'+name+'</button>').join('')+
  '</div>';
 if(!cats.dataset.v563Bound){
  cats.dataset.v563Bound='1';
  cats.addEventListener('click',e=>{
   const b=e.target.closest('[data-v563-cat]');if(!b)return;
   e.preventDefault();
   e.stopPropagation();
   localStorage.setItem('v563-discipline-category',b.dataset.v563Cat||'all');
   apply();
  });
 }
 const view=current();let cat=currentCat();if(!['all','3','5','4','2','1'].includes(String(cat))){cat='all';localStorage.setItem('v563-discipline-category','all')}
 $$('[data-v563-disc]',tabs).forEach(b=>b.classList.toggle('active',b.dataset.v563Disc===view));
 $$('[data-v563-cat]',cats).forEach(b=>b.classList.toggle('active',String(b.dataset.v563Cat)===String(cat)));
 let shown=0;
 rows.forEach(row=>{
  const hasCards=!!row.querySelector('.v94-yellow,.v94-red');
  const hasSusp=!!row.querySelector('.v94-sanction')||/pend\./i.test(row.querySelector('.v94-total small')?.textContent||'');
  const typeOk=view==='all'||(view==='cards'&&hasCards)||(view==='suspensions'&&hasSusp);
  const catOk=cat==='all'||String(row.dataset.v94Cat||'')===String(cat);
  const show=typeOk&&catOk;
  row.hidden=!show;if(show)shown++;
 });
 let empty=$('.v563-discipline-empty',page);
 if(!shown){
  if(!empty){empty=document.createElement('div');empty.className='v563-discipline-empty';($('.v650-discipline-export',page)||page.lastElementChild)?.insertAdjacentElement?.('beforebegin',empty)||page.appendChild(empty)}
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