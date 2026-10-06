/* V814 — Reuse the 50 transparent Fantasy jersey library inside the club Store.
   Only active 2026 Liga teams receive a jersey skin. The current Liga crest is
   placed over the source-club badge so the shirt belongs visually to that team. */
(function(){
'use strict';
if(window.__LJR_V814_STORE_JERSEY_LIBRARY__)return;
window.__LJR_V814_STORE_JERSEY_LIBRARY__=true;

const FALLBACK_ACTIVE=[
  'BOAVISTA','FRANCO-TAVERA-JR','HURACAN','CUENDA','AMERICA','AGUILARES','JUVENTUS','LEYENDAS FC','PSV','LA TRINIDAD',
  'La Esperanza','Dynamo','Boca Jrs','Toros de Cuenda','Manchester',
  'San José FC','Linces','Napoli','Hermanos','Franco FC','Herreras FC','Abejas','Terrícolas','Lobos CDG','Galácticos',
  'La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio Jrs','Populares','Promesas FC','La Huerta',
  'Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José Jrs','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'
];

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\batl\b/g,'atletico').replace(/\bdep\b/g,'deportivo').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function activeNames(){
  const src=Array.isArray(window.LJR_V812_ACTIVE_STORE_TEAMS)&&window.LJR_V812_ACTIVE_STORE_TEAMS.length
    ? window.LJR_V812_ACTIVE_STORE_TEAMS : FALLBACK_ACTIVE;
  const out=[];
  src.forEach(name=>{if(!out.some(x=>norm(x)===norm(name)))out.push(name)});
  return out;
}
function catalog(){
  const all=window.LJR_FANTASY_JERSEYS?.catalog;
  if(!Array.isArray(all))return [];
  /* Celtic needs runtime background removal; Store uses the 50 already-transparent
     kit-pics PNGs so every tile stays fast and transparent. */
  return all.filter(x=>x&&x.url&&!x.removeBg&&/^kit-\d+-/i.test(String(x.id||''))).slice(0,50);
}
function isActive(team){
  if(typeof window.LJR_V812_IS_ACTIVE_STORE_TEAM==='function'){
    try{return !!window.LJR_V812_IS_ACTIVE_STORE_TEAM(team)}catch(_){}
  }
  return activeNames().some(n=>norm(n)===norm(team));
}
function kitFor(team){
  const kits=catalog();if(!kits.length)return null;
  const names=activeNames();
  let i=names.findIndex(n=>norm(n)===norm(team));
  if(i<0){
    /* Stable fallback for a current-season alias. */
    let h=0;for(const ch of norm(team))h=((h*31)+ch.charCodeAt(0))>>>0;
    i=h%kits.length;
  }
  return kits[i%kits.length]||kits[0];
}
function addLayer(shirt,item){
  if(!shirt||!item)return;
  shirt.classList.add('v814-store-library-kit');
  shirt.dataset.v814StoreKit=item.id||'';
  let img=shirt.querySelector(':scope > .v814-store-kit-image');
  if(!img){
    img=document.createElement('img');
    img.className='v814-store-kit-image';
    img.alt='';
    img.loading='lazy';
    img.decoding='async';
    shirt.insertBefore(img,shirt.firstChild);
  }
  if(img.src!==item.url)img.src=item.url;

  let cover=shirt.querySelector(':scope > .v814-source-badge-cover');
  if(!cover){
    cover=document.createElement('span');
    cover.className='v814-source-badge-cover';
    cover.setAttribute('aria-hidden','true');
    const logo=shirt.querySelector(':scope > .v602-shirt-logo');
    shirt.insertBefore(cover,logo||shirt.lastChild);
  }
}
function decorate(){
  if(route()!=='club-store')return;
  const store=document.querySelector('[data-v431-store]');
  if(!store)return;
  const team=sessionStorage.getItem('v431-store-team')||localStorage.getItem('v62-team-name')||'';
  if(!team||!isActive(team))return;
  const item=kitFor(team);if(!item)return;
  store.dataset.v814Team=team;
  store.dataset.v814Kit=item.id||'';
  store.querySelectorAll('.v602-store-real-shirt').forEach(shirt=>addLayer(shirt,item));
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>{decorate();setTimeout(decorate,90);setTimeout(decorate,360)});
}
function boot(){
  schedule();
  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  window.addEventListener('ljr:jersey-library-ready',schedule);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  setTimeout(schedule,700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.LJR_V814_STORE_JERSEYS={decorate,kitFor,activeNames,catalog};
})();