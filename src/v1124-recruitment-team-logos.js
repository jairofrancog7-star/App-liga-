/* V1124 — Reclutamiento: selector de EQUIPOS con escudos reales.
   Se conserva el select nativo como fuente de verdad (valor y evento change).
   No inventa clubes, categorías ni modifica datos oficiales. */
(()=>{
'use strict';
if(window.__LJR_V1124_RECRUIT_TEAM_PICKER__)return;
window.__LJR_V1124_RECRUIT_TEAM_PICKER__=true;
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const SVG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2.5 20 6v6c0 5-3 8-8 9.5C7 20 4 17 4 12V6Z"/><path d="m8.5 12 2.5 2.5 4.7-5"/></svg>';
let layer=null,openedFrom=null,previousOverflow='';
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]}
function currentSelect(){return $('#screen #v190-recruitment-page [data-v190-player-team]')}
function crest(name){
 if(!name)return '';
 for(const getter of [
   ()=>window.LJR_SEASON_LOGOS?.get?.(name),
   ()=>window.LJR_OFFICIAL_API?.getLogo?.(name),
   ()=>window.LJR_TEAM_LOGOS?.get?.(name)
 ]){
   try{
     const value=getter();
     if(typeof value==='string'&&value.trim()&&!/^data:text/i.test(value))return value;
   }catch(_){}
 }
 return '';
}
function avatar(name){
 const span=document.createElement('span');
 span.className='v1124-crest'+(!name?' empty':'');
 const logo=crest(name);
 if(logo){
   const img=document.createElement('img');
   img.src=logo;img.alt='';img.loading='lazy';img.decoding='async';
   img.addEventListener('error',()=>{
     img.remove();
     if(!span.querySelector('svg'))span.insertAdjacentHTML('beforeend',SVG);
   },{once:true});
   span.append(img);
 }else span.innerHTML=SVG;
 return span;
}
function updateOpenButton(){
 const sel=currentSelect(),btn=$('[data-v1124-team-open]',sel?.closest('label'));
 if(!sel||!btn)return;
 const name=sel.value||'';
 if(btn.dataset.teamValue===name&&btn.dataset.iconReady==='1')return;
 btn.dataset.teamValue=name;btn.dataset.iconReady='1';
 const icon=avatar(name);
 const text=document.createElement('span');
 text.className='v1124-team-current';
 const b=document.createElement('b');b.textContent=name||'Sin equipo destino todavía';
 const small=document.createElement('small');small.textContent='Equipo destino';
 text.append(small,b);
 const chevron=document.createElement('span');chevron.className='v1124-chevron';chevron.setAttribute('aria-hidden','true');
 btn.replaceChildren(icon,text,chevron);
}
function close(restoreFocus=true){
 if(!layer)return;
 layer.remove();layer=null;
 document.body.classList.remove('v1124-team-picker-open');
 document.body.style.overflow=previousOverflow;
 if(restoreFocus&&openedFrom?.isConnected)openedFrom.focus({preventScroll:true});
 openedFrom=null;
}
function teamOptions(){
 const sel=currentSelect();
 return sel?$$('option',sel).map(o=>({
   name:o.value,label:(o.textContent||'').trim(),
   category:o.closest('optgroup')?.label||''
 })): [];
}
function fillOptions(search=''){
 if(!layer)return;
 const host=$('[data-v1124-options]',layer);
 const sel=currentSelect();
 if(!host)return;
 const terms=normalize(search);
 const rows=teamOptions().filter(t=>!terms||normalize([t.label,t.category].join(' ')).includes(terms));
 const fragment=document.createDocumentFragment();
 if(!rows.length){
   const empty=document.createElement('p');
   empty.className='v1124-no-results';empty.textContent='No hay equipos que coincidan con tu búsqueda.';
   fragment.append(empty);
 }
 rows.forEach(item=>{
   const button=document.createElement('button');
   button.type='button';button.className='v1124-option';
   button.dataset.v1124Value=item.name;
   const selected=(sel?.value||'')===item.name;
   button.classList.toggle('selected',selected);
   button.setAttribute('aria-pressed',selected?'true':'false');
   const mark=avatar(item.name);
   const details=document.createElement('span');details.className='v1124-team-copy';
   const b=document.createElement('b');b.textContent=item.label||item.name;
   details.append(b);
   if(item.category){
     const small=document.createElement('small');small.textContent=item.category;details.append(small);
   }
   const check=document.createElement('span');check.className='v1124-option-check';
   check.textContent=selected?'✓':'';
   button.append(mark,details,check);fragment.append(button);
 });
 host.replaceChildren(fragment);
}
function open(){
 const sel=currentSelect();if(!sel)return;
 close(false);
 openedFrom=$('[data-v1124-team-open]',sel.closest('label'));
 previousOverflow=document.body.style.overflow;
 layer=document.createElement('div');layer.className='v1124-picker-layer';
 layer.innerHTML='<button type="button" class="v1124-picker-backdrop" data-v1124-close aria-label="Cerrar selector"></button>'+
 '<section class="v1124-picker-sheet" role="dialog" aria-modal="true" aria-labelledby="v1124-picker-title">'+
 '<header><h2 id="v1124-picker-title">Seleccionar equipo</h2><button type="button" class="v1124-picker-x" data-v1124-close aria-label="Cerrar">×</button></header>'+
 '<label class="v1124-search-label"><span>Buscar equipo</span><input type="search" data-v1124-search placeholder="Escribe el nombre del equipo" autocomplete="off"></label>'+
 '<div class="v1124-team-list" data-v1124-options></div></section>';
 document.body.append(layer);
 document.body.classList.add('v1124-team-picker-open');
 document.body.style.overflow='hidden';
 fillOptions();
 const search=$('[data-v1124-search]',layer);
 search?.addEventListener('input',()=>fillOptions(search.value));
 layer.addEventListener('click',e=>{
   if(e.target.closest('[data-v1124-close]'))return close();
   const option=e.target.closest('[data-v1124-value]');
   if(!option)return;
   const selected=currentSelect();
   if(selected){
     selected.value=option.dataset.v1124Value||'';
     selected.dispatchEvent(new Event('input',{bubbles:true}));
     selected.dispatchEvent(new Event('change',{bubbles:true}));
     updateOpenButton();
   }
   close();
 });
 search?.focus({preventScroll:true});
}
document.addEventListener('keydown',e=>{
 if(!layer)return;
 if(e.key==='Escape'){e.preventDefault();close();return;}
 if(e.key==='Tab'){
  const focusable=$$('button:not([disabled]),input:not([disabled])',layer).filter(n=>n.getClientRects().length);
  if(!focusable.length)return;
  if(e.shiftKey&&document.activeElement===focusable[0]){e.preventDefault();focusable[focusable.length-1].focus()}
  else if(!e.shiftKey&&document.activeElement===focusable[focusable.length-1]){e.preventDefault();focusable[0].focus()}
 }
});
window.addEventListener('hashchange',()=>close(false));
function upgrade(){
 if(route()!=='recruitment'){close(false);return;}
 const select=currentSelect();
 if(!select)return;
 const label=select.closest('label');
 if(!label)return;
 // El select se mantiene sólo como valor del formulario: ocultarlo evita
 // el cuadro superior duplicado mientras el botón inferior continúa activo.
 select.hidden=true;
 select.tabIndex=-1;
 select.style.setProperty('display','none','important');
 if(!select.dataset.v1124TeamEnhanced){
  select.dataset.v1124TeamEnhanced='1';
  label.classList.add('v1124-team-field');
  const btn=document.createElement('button');btn.type='button';btn.className='v1124-team-open';
  btn.dataset.v1124TeamOpen='';btn.setAttribute('aria-label','Seleccionar equipo destino');
  btn.addEventListener('click',e=>{e.preventDefault();open()});
  select.insertAdjacentElement('afterend',btn);
  select.addEventListener('change',updateOpenButton);
 }
 updateOpenButton();
 if(layer&&!select.isConnected)close(false);
}
let scheduled=false;
function schedule(){
 if(scheduled)return;
 scheduled=true;
 requestAnimationFrame(()=>{scheduled=false;upgrade()});
}
function start(){
 const screen=$('#screen');
 if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
 window.addEventListener('hashchange',schedule);
 window.addEventListener('ljr:official-data',schedule);
 upgrade();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
})();