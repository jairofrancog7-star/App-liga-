/* V758 — Restauración de accesos de Más.
   Repara únicamente navegación/render de Siguiendo, Equipos y Comparar jugadores.
   No cambia el diseño de esas pantallas. */
(function(){
'use strict';
if(window.__LJR_V758_SECTION_ROUTE_RECOVERY__)return;
window.__LJR_V758_SECTION_ROUTE_RECOVERY__=true;

const TARGETS={
  'siguiendo':'following',
  'equipos':'teams',
  'comparar jugadores':'playerCompare',
  'comparar equipos':'teams'
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/\s+/g,' ').trim();
}
function route(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||
    String(document.body?.dataset?.appRoute||'home');
}
function go(next){
  try{
    if(window.LJR_MAIN_ROUTE?.go){window.LJR_MAIN_ROUTE.go(next);return}
  }catch(_){}
  location.hash='#/'+next;
}
function expected(r){
  const screen=document.querySelector('#screen');
  if(!screen)return false;
  if(r==='following')return !!screen.querySelector('[data-v28-following]');
  if(r==='teams')return !!screen.querySelector('.v27-teams-page[data-v27-reference="teams"]');
  if(r==='playerCompare')return !!screen.querySelector('[data-v123-player-compare]');
  return true;
}
function force(r){
  if(route()!==r)return;
  try{
    if(r==='following'){
      window.LJR_FOLLOWING_API?.schedule?.();
      if(!expected(r))window.LJR_FOLLOWING_API?.render?.();
      return;
    }
    if(r==='teams'){
      window.LJR_TEAMS_API?.schedule?.();
      if(!expected(r))window.LJR_TEAMS_API?.forceRender?.();
      return;
    }
    if(r==='playerCompare'){
      window.LJR_PLAYER_COMPARE_API?.render?.();
    }
  }catch(err){
    console.warn('[V758] recuperación de sección',r,err);
  }
}
function recover(r){
  [0,70,220,650,1400].forEach(ms=>setTimeout(()=>force(r),ms));
}

document.addEventListener('click',function(e){
  if(route()!=='more'||!(e.target instanceof Element))return;
  const row=e.target.closest('.v19-more-item');
  if(!row)return;
  const label=norm(row.textContent);
  const next=TARGETS[label];
  if(!next)return;

  /* Evita que una capa antigua capture estas cuatro filas antes del router. */
  e.preventDefault();
  e.stopPropagation();
  if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();

  if(label==='comparar equipos'){
    try{sessionStorage.setItem('lj-v758-team-compare-entry','1')}catch(_){}
  }
  go(next);
  recover(next);
},true);

window.addEventListener('hashchange',()=>recover(route()));
window.addEventListener('popstate',()=>recover(route()));
document.addEventListener('DOMContentLoaded',()=>recover(route()),{once:true});
if(document.readyState!=='loading')recover(route());

window.LJR_SECTION_ROUTE_RECOVERY={go,recover,expected};
})();