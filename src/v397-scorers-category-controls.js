/* V397 — controles de categoría robustos para #/scorers. */
(function(){
'use strict';
if(window.__LJR_V397_SCORER_CATS__)return;
window.__LJR_V397_SCORER_CATS__=true;

const CATS=[
  ['3','Primera'],
  ['5','Intermedia'],
  ['4','Segunda'],
  ['2','Veteranos 35+'],
  ['1','Veteranos 50+']
];
let timer=0;
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function current(){
  const id=String(localStorage.getItem('v62-category')||'3');
  return CATS.some(x=>x[0]===id)?id:'3';
}
function buttonsMarkup(){
  const active=current();
  return '<section class="v397-category-controls" data-v397-category-controls aria-label="Clasificar goleadores por categoría">'+
    '<span class="v397-category-title">CLASIFICAR POR CATEGORÍA</span>'+
    '<div class="v397-category-rail">'+CATS.map(([id,label])=>
      '<button type="button" class="'+(id===active?'active':'')+'" data-v397-cat="'+id+'" aria-pressed="'+(id===active?'true':'false')+'">'+label+'</button>'
    ).join('')+'</div>'+
  '</section>';
}
function sync(){
  if(route()!=='scorers')return;
  const id=current();
  document.querySelectorAll('[data-v397-cat],[data-v194-cat]').forEach(b=>{
    const bid=String(b.dataset.v397Cat||b.dataset.v194Cat||'');
    const on=bid===id;
    b.classList.toggle('active',on);
    b.setAttribute('aria-pressed',on?'true':'false');
  });
}
function ensure(){
  if(route()!=='scorers')return;
  const page=document.querySelector('[data-v28-scorers]');
  if(!page)return;
  const native=page.querySelector('.v391-category-wrap');
  if(native){
    native.classList.add('v397-enhanced-category-wrap');
    native.querySelectorAll('[data-v194-cat]').forEach(b=>{
      b.dataset.v397Enhanced='1';
      b.setAttribute('aria-label','Mostrar goleadores de '+b.textContent.trim());
    });
    page.querySelector('[data-v397-category-controls]')?.remove();
  }else if(!page.querySelector('[data-v397-category-controls]')){
    page.insertAdjacentHTML('afterbegin',buttonsMarkup());
  }
  sync();
}
function choose(id){
  id=String(id||'');
  if(!CATS.some(x=>x[0]===id))return;
  localStorage.setItem('v62-category',id);
  localStorage.setItem('v12-fixture-cat',id);
  localStorage.setItem('v194-scorer-team','all');
  if(window.LJR_SCORERS_REFERENCE?.setCategory){
    window.LJR_SCORERS_REFERENCE.setCategory(id);
  }else{
    try{window.LJR_OFFICIAL_API?.setCategory?.(id)}catch(_){}
    window.dispatchEvent(new CustomEvent('ljr:scorers-category',{detail:{id}}));
  }
  requestAnimationFrame(()=>{ensure();sync()});
  setTimeout(()=>{try{window.LJR_SCORERS_REFERENCE?.render?.()}catch(_){}ensure();},40);
}
function click(e){
  if(route()!=='scorers'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v397-cat],[data-v194-cat]');
  if(!b)return;
  const id=b.dataset.v397Cat||b.dataset.v194Cat;
  if(!id)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  choose(id);
}
function schedule(delay=30){
  clearTimeout(timer);
  timer=setTimeout(ensure,delay);
}
document.addEventListener('click',click,true);
window.addEventListener('hashchange',()=>schedule(20));
window.addEventListener('ljr:official-data',()=>schedule(20));
window.addEventListener('ljr:scorers-category',()=>schedule(10));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='scorers')schedule(20)}).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});else schedule(20);
setTimeout(ensure,250);
setTimeout(ensure,800);
})();
