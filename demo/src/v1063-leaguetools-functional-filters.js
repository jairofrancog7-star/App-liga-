/* V1063 — filtros funcionales en Centro de herramientas.
   Convierte Todo / Competición / Jornada / Documentos / Administración en filtros reales
   sin cambiar rutas ni las acciones originales de las tarjetas. */
(function(){
'use strict';
if(window.__LJR_V1063_TOOL_FILTERS__)return;
window.__LJR_V1063_TOOL_FILTERS__=true;

const FILTERS=[
  {id:'all',label:'Todo'},
  {id:'competition',label:'Competición'},
  {id:'matchday',label:'Jornada'},
  {id:'documents',label:'Documentos'},
  {id:'admin',label:'Administración'}
];
let active='all';
let raf=0;

function route(){
  return String(document.body?.dataset?.appRoute||location.hash||'')
    .replace(/^#\/?/,'').split('?')[0];
}
function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/\s+/g,' ').trim();
}
function sectionKind(section){
  const text=norm(section?.querySelector('.v726-section-head')?.textContent||section?.textContent||'');
  if(/competicion|estadistic/.test(text))return 'competition';
  if(/partido y jornada|operacion|match day|jornada/.test(text))return 'matchday';
  if(/documentos|publicaciones/.test(text))return 'documents';
  if(/administracion de la liga|gestion|disciplina|jr control/.test(text))return 'admin';
  return 'info';
}
function markup(){
  return '<nav class="v1063-tools-filters" aria-label="Filtrar herramientas">'+
    FILTERS.map((f,i)=>'<button type="button" class="v1063-filter'+(i===0?' is-active':'')+'" data-v1063-filter="'+f.id+'" aria-pressed="'+(i===0?'true':'false')+'">'+f.label+'</button>').join('')+
  '</nav>';
}
function apply(root,requested){
  if(!root)return;
  active=FILTERS.some(x=>x.id===requested)?requested:'all';
  root.dataset.v1063Filter=active;

  root.querySelectorAll('[data-v1063-filter]').forEach(btn=>{
    const on=btn.dataset.v1063Filter===active;
    btn.classList.toggle('is-active',on);
    btn.setAttribute('aria-pressed',on?'true':'false');
  });

  const quick=root.querySelector('.v726-quick-section');
  const adminEntry=root.querySelector('.v726-admin-entry');
  if(quick)quick.hidden=active!=='all';
  if(adminEntry)adminEntry.hidden=!(active==='all'||active==='admin');

  root.querySelectorAll('.v726-tool-section').forEach(section=>{
    const kind=sectionKind(section);
    section.dataset.v1063Kind=kind;
    section.hidden=active!=='all'&&kind!==active;
  });

  root.querySelectorAll('.v175-section-bar,.v175-featured-bar').forEach(el=>{
    if(active!=='all')el.hidden=true;
    else el.hidden=false;
  });

  try{sessionStorage.setItem('ljr-league-tools-filter',active)}catch(_){}
}
function mount(){
  if(route()!=='leagueTools')return;
  const root=document.querySelector('body[data-app-route="leagueTools"] .v726-tools-page, body[data-app-route="leagueTools"] .v60-tool-page');
  if(!root)return;

  let nav=root.querySelector('.v1063-tools-filters');
  if(!nav){
    const hero=root.querySelector('.v726-tools-hero,.v60-tool-head')||root.firstElementChild;
    if(!hero)return;
    hero.insertAdjacentHTML('afterend',markup());
    nav=root.querySelector('.v1063-tools-filters');
  }

  let saved='all';
  try{saved=sessionStorage.getItem('ljr-league-tools-filter')||'all'}catch(_){}
  if(!FILTERS.some(x=>x.id===saved))saved='all';
  apply(root,saved);
}
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>setTimeout(mount,12));
}

document.addEventListener('click',e=>{
  if(route()!=='leagueTools'||!(e.target instanceof Element))return;
  const btn=e.target.closest('[data-v1063-filter]');
  if(!btn)return;
  e.preventDefault();
  e.stopPropagation();
  const root=btn.closest('.v726-tools-page,.v60-tool-page');
  apply(root,btn.dataset.v1063Filter||'all');

  // Mantiene el filtro visible y evita saltos largos.
  requestAnimationFrame(()=>{
    const nav=root?.querySelector('.v1063-tools-filters');
    if(nav){
      const top=nav.getBoundingClientRect().top;
      if(top<58||top>window.innerHeight*.72)nav.scrollIntoView({block:'start',behavior:'smooth'});
    }
  });
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();
setTimeout(schedule,250);
setTimeout(schedule,900);
})();