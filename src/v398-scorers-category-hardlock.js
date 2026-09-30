/* V398 — hard-lock visible category buttons on #/scorers.
   Independent of the scorer renderer: the category bar is always mounted first. */
(function(){
'use strict';
if(window.__LJR_V398_SCORER_CATEGORY_HARDLOCK__)return;
window.__LJR_V398_SCORER_CATEGORY_HARDLOCK__=true;

const CATS=[
  ['3','Primera'],
  ['5','Intermedia'],
  ['4','Segunda'],
  ['2','Veteranos 35+'],
  ['1','Veteranos 50+']
];
let busy=false,timer=0;

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function selected(){
  const id=String(localStorage.getItem('v62-category')||'3');
  return CATS.some(([x])=>x===id)?id:'3';
}
function html(){
  const active=selected();
  return '<section class="v398-scorer-catbar" data-v398-scorer-catbar>'+
    '<div class="v398-scorer-cat-label">CLASIFICAR POR CATEGORÍA</div>'+
    '<div class="v398-scorer-cat-scroll">'+
      CATS.map(([id,label])=>'<button type="button" data-v398-cat="'+id+'" class="'+(id===active?'active':'')+'" aria-pressed="'+(id===active?'true':'false')+'">'+label+'</button>').join('')+
    '</div>'+
  '</section>';
}
function sync(){
  const id=selected();
  document.querySelectorAll('[data-v398-cat]').forEach(b=>{
    const on=String(b.dataset.v398Cat||'')===id;
    b.classList.toggle('active',on);
    b.setAttribute('aria-pressed',on?'true':'false');
  });
}
function host(){
  return document.querySelector('[data-v28-scorers]')||document.querySelector('.v28-scorers-page');
}
function mount(){
  if(route()!=='scorers')return;
  const page=host();
  if(!page)return;
  let bar=page.querySelector(':scope > [data-v398-scorer-catbar]');
  if(!bar){
    page.insertAdjacentHTML('afterbegin',html());
    bar=page.querySelector(':scope > [data-v398-scorer-catbar]');
  }
  if(bar && page.firstElementChild!==bar) page.prepend(bar);
  sync();
}
function choose(id){
  id=String(id||'');
  if(!CATS.some(([x])=>x===id)||busy)return;
  busy=true;
  try{
    localStorage.setItem('v62-category',id);
    localStorage.setItem('v12-fixture-cat',id);
    localStorage.setItem('v194-scorer-team','all');
    try{window.LJR_OFFICIAL_API?.setCategory?.(id)}catch(_){}
    try{window.LJR_SCORERS_REFERENCE?.setCategory?.(id)}catch(_){}
    try{window.LJR_SCORERS_REFERENCE?.render?.()}catch(_){}
  }finally{
    busy=false;
  }
  requestAnimationFrame(()=>{mount();sync()});
  setTimeout(()=>{mount();sync();try{window.LJR_SCORERS_REFERENCE?.render?.()}catch(_){}},40);
  setTimeout(()=>{mount();sync()},140);
}
function click(e){
  if(route()!=='scorers'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v398-cat]');
  if(!b)return;
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  choose(b.dataset.v398Cat);
}
function schedule(ms=20){
  clearTimeout(timer);
  timer=setTimeout(mount,ms);
}

document.addEventListener('click',click,true);
window.addEventListener('hashchange',()=>schedule(15));
window.addEventListener('ljr:official-data',()=>schedule(15));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule(10)});

const screen=document.querySelector('#screen');
if(screen){
  new MutationObserver(()=>{
    if(route()==='scorers'&&!busy)schedule(10);
  }).observe(screen,{childList:true,subtree:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(10),{once:true});else schedule(10);
setTimeout(mount,100);
setTimeout(mount,300);
setTimeout(mount,700);
setTimeout(mount,1500);
})();
