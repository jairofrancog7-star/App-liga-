/* V935 — fuerza controles completos de goleadores después de renders viejos. */
(function(){
'use strict';
if(window.__LJR_V935_SCORER_CONTROLS__)return;
window.__LJR_V935_SCORER_CONTROLS__=true;
const CATS=[['3','Primera Fuerza'],['5','Intermedia'],['4','Segunda Fuerza'],['2','Veteranos 35+'],['1','Veteranos 50+']];
const STATS=[['goals','Goles','goals'],['shots','Remates','shots'],['passes','Pases','passes']];
let busy=false,timer=0;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function icon(name){
 const p={
  category:'<path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z"/><path d="M8 10h8M8 14h5"/>',
  goals:'<circle cx="12" cy="12" r="8"/><path d="m12 4 2.1 4.1 4.5.7-3.3 3.2.8 4.5L12 14.4 7.9 16.5l.8-4.5-3.3-3.2 4.5-.7L12 4Z"/>',
  shots:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 1v4m0 14v4M1 12h4m14 0h4"/>',
  passes:'<path d="M4 8h12"/><path d="m13 5 3 3-3 3"/><path d="M20 16H8"/><path d="m11 13-3 3 3 3"/>'
 };
 return window.LJR_ICONS?.decorate('<span class="v931-filter-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.category)+'</svg></span>',name) || '<span class="v931-filter-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.category)+'</svg></span>';
}
function cat(){const v=String(localStorage.getItem('v62-category')||'3');return CATS.some(x=>x[0]===v)?v:'3'}
function stat(){const v=String(localStorage.getItem('v504-scorer-ranking-stat')||'goals');return STATS.some(x=>x[0]===v)?v:'goals'}
function build(){
 const active=cat(),s=stat();
 const wrap=document.createElement('section');
 wrap.className='v391-category-wrap v472-unified-controls v935-controls';
 wrap.setAttribute('aria-label','Filtros del ranking');
 wrap.innerHTML=
  '<span class="v391-category-label">CLASIFICAR POR CATEGORÍA</span>'+
  '<div class="v391-category-strip v935-category-grid">'+CATS.map(([id,label])=>
   '<button type="button" class="v935-cat '+(id===active?'active':'')+'" data-v194-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+icon('category')+'<b>'+esc(label)+'</b></button>'
  ).join('')+'</div>'+
  '<div class="v391-stat-strip v935-stat-grid" aria-label="Estadística del ranking">'+STATS.map(([id,label,ico])=>
   '<button type="button" class="v935-stat '+(id===s?'active':'')+'" data-v462-stat="'+id+'" aria-pressed="'+(id===s?'true':'false')+'">'+icon(ico)+'<b>'+esc(label)+'</b></button>'
  ).join('')+'</div>';
 return wrap;
}
function bind(root){
 root.querySelectorAll('[data-v194-cat]').forEach(b=>{
  b.onclick=e=>{e.preventDefault();e.stopPropagation();window.LJR_SCORERS_REFERENCE?.setCategory?.(b.dataset.v194Cat)};
 });
 root.querySelectorAll('[data-v462-stat]').forEach(b=>{
  b.onclick=e=>{e.preventDefault();e.stopPropagation();window.LJR_SCORERS_REFERENCE?.setStat?.(b.dataset.v462Stat)};
 });
}
function ensure(){
 if(busy||route()!=='scorers')return;
 const ref=document.querySelector('[data-v28-scorers] .v391-reference');
 if(!ref)return;
 const old=ref.querySelector('.v391-category-wrap');
 const cats=old?.querySelectorAll('[data-v194-cat]').length||0;
 const good=old?.classList.contains('v935-controls')&&cats===5;
 if(good){bind(old);return}
 busy=true;
 try{
  const next=build();
  if(old)old.replaceWith(next);else ref.insertAdjacentElement('afterbegin',next);
  bind(next);
 }finally{busy=false}
}
function schedule(delay=20){clearTimeout(timer);timer=setTimeout(ensure,delay)}
document.addEventListener('click',e=>{
 if(route()!=='scorers'||!(e.target instanceof Element))return;
 const c=e.target.closest('.v935-cat,.v935-stat');
 if(!c)return;
 requestAnimationFrame(()=>schedule(0));
},true);
window.addEventListener('hashchange',()=>schedule(40));
window.addEventListener('ljr:official-data',()=>schedule(40));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='scorers')schedule(25)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});else schedule(60);
setTimeout(ensure,250);setTimeout(ensure,800);setTimeout(ensure,1600);
})();