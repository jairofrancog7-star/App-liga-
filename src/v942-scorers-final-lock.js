/* V942 — lock final de controles de goleadores.
   Repara los 5 botones aunque otro render viejo reemplace el bloque. */
(function(){
'use strict';
if(window.__LJR_V942_SCORERS_FINAL_LOCK__)return;
window.__LJR_V942_SCORERS_FINAL_LOCK__=true;

const CATS=[['3','Primera Fuerza'],['5','Intermedia'],['4','Segunda Fuerza'],['2','Veteranos 35+'],['1','Veteranos 50+']];
const CAT_LOGOS={
  '3':'./assets/branding/primera-fuerza-hd.png',
  '5':'./assets/categories/intermedia.webp',
  '4':'./assets/categories/segunda-fuerza.webp',
  '2':'./assets/categories/veteranos-35-user.png',
  '1':'./assets/categories/veteranos-50.webp'
};
const STATS=[['goals','Goles','goals'],['shots','Remates','shots'],['passes','Pases','passes']];
let timer=0,working=false,lastReset='';

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function cat(){
  try{
    const api=String(window.LJR_SCORERS_REFERENCE?.getCategory?.()||'');
    if(CATS.some(x=>x[0]===api))return api;
  }catch(_){}
  const v=String(localStorage.getItem('v62-category')||'3');
  return CATS.some(x=>x[0]===v)?v:'3';
}
function stat(){
  try{
    const api=String(window.LJR_SCORERS_REFERENCE?.getStat?.()||'');
    if(STATS.some(x=>x[0]===api))return api;
  }catch(_){}
  const v=String(localStorage.getItem('v504-scorer-ranking-stat')||'goals');
  return STATS.some(x=>x[0]===v)?v:'goals';
}
function categoryLogo(id,label){
 const src=CAT_LOGOS[String(id)]||'./assets/liga-logo.webp';
 return '<span class="v945-cat-logo"><img src="'+esc(src)+'" alt="'+esc(label)+'" loading="eager" decoding="async"></span>';
}
function icon(name){
 const p={
  category:'<path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z"/><path d="M8 10h8M8 14h5"/>',
  goals:'<circle cx="12" cy="12" r="8"/><path d="m12 4 2.1 4.1 4.5.7-3.3 3.2.8 4.5L12 14.4 7.9 16.5l.8-4.5-3.3-3.2 4.5-.7L12 4Z"/>',
  shots:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  passes:'<path d="M4 8h12"/><path d="m13 5 3 3-3 3"/><path d="M20 16H8"/><path d="m11 13-3 3 3 3"/>'
 };
 return window.LJR_ICONS?.decorate('<span class="v931-filter-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.category)+'</svg></span>',name) || '<span class="v931-filter-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.category)+'</svg></span>';
}
function build(){
  const active=cat(),s=stat(),wrap=document.createElement('section');
  wrap.className='v391-category-wrap v472-unified-controls v942-controls';
  wrap.setAttribute('aria-label','Filtros del ranking');
  wrap.innerHTML=
    '<span class="v391-category-label">CLASIFICAR POR CATEGORÍA</span>'+
    '<div class="v391-category-strip v942-category-grid">'+CATS.map(([id,label])=>
      '<button type="button" class="v942-cat '+(id===active?'active':'')+'" data-v194-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+categoryLogo(id,label)+'<b>'+esc(label)+'</b></button>'
    ).join('')+'</div>'+
    '<div class="v391-stat-strip v942-stat-grid" aria-label="Estadística del ranking">'+STATS.map(([id,label,ico])=>
      '<button type="button" class="v942-stat '+(id===s?'active':'')+'" data-v462-stat="'+id+'" aria-pressed="'+(id===s?'true':'false')+'">'+icon(ico)+'<b>'+esc(label)+'</b></button>'
    ).join('')+'</div>';
  return wrap;
}
function bind(wrap){
  wrap.querySelectorAll('.v942-cat').forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      const id=String(btn.dataset.v194Cat||'3');
      try{localStorage.setItem('v62-category',id)}catch(_){}
      if(typeof window.LJR_SCORERS_REFERENCE?.setCategory==='function')window.LJR_SCORERS_REFERENCE.setCategory(id);
      else{
        const u=new URL(location.href);u.hash='#/scorers?cat='+encodeURIComponent(id);location.hash=u.hash;
      }
      setTimeout(ensure,30);
    };
  });
  wrap.querySelectorAll('.v942-stat').forEach(btn=>{
    btn.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      const id=String(btn.dataset.v462Stat||'goals');
      try{localStorage.setItem('v504-scorer-ranking-stat',id)}catch(_){}
      window.LJR_SCORERS_REFERENCE?.setStat?.(id);
      setTimeout(ensure,30);
    };
  });
}
function resetForRefresh(){
  if(route()!=='scorers')return;
  let token='';
  try{token=new URL(location.href).searchParams.get('refresh')||''}catch(_){}
  if(!/^v942/i.test(token)||token===lastReset)return;
  const key='v942-scorers-reset:'+token;
  try{if(sessionStorage.getItem(key)==='1'){lastReset=token;return}sessionStorage.setItem(key,'1')}catch(_){}
  lastReset=token;
  requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'})));
}
function ensure(){
  if(working||route()!=='scorers')return;
  const ref=document.querySelector('#screen [data-v28-scorers] .v391-reference');
  if(!ref)return;
  const old=ref.querySelector(':scope > .v391-category-wrap');
  const count=old?.querySelectorAll('[data-v194-cat]').length||0;
  const labels=old?[...old.querySelectorAll('[data-v194-cat]')].map(x=>String(x.textContent||'').trim()):[];
  const complete=count===5&&CATS.every((x,i)=>labels[i]?.includes(x[1]));
  if(old?.classList.contains('v942-controls')&&complete){bind(old);resetForRefresh();return}
  working=true;
  try{
    const next=build();
    if(old)old.replaceWith(next);else ref.insertAdjacentElement('afterbegin',next);
    bind(next);
    resetForRefresh();
  }finally{working=false}
}
function schedule(ms=25){clearTimeout(timer);timer=setTimeout(ensure,ms)}
window.addEventListener('hashchange',()=>schedule(40));
window.addEventListener('load',()=>{schedule(0);setTimeout(ensure,120);setTimeout(ensure,500);setTimeout(ensure,1200)});
window.addEventListener('ljr:official-data',()=>schedule(40));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(20)});
const screen=document.getElementById('screen');
if(screen)new MutationObserver(()=>{if(route()==='scorers')schedule(20)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='complete'){schedule(0);setTimeout(ensure,250)}else{
  document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});
}
setTimeout(ensure,300);setTimeout(ensure,900);setTimeout(ensure,1800);setTimeout(ensure,3200);
})();