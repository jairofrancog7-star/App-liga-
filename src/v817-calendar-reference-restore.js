/* V817 — Calendar route restore helper: always enter at the reference top position. */
(function(){
'use strict';
if(window.__LJR_V817_CALENDAR_RESTORE__)return;
window.__LJR_V817_CALENDAR_RESTORE__=true;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
let last=route();
function centerActiveMonth(){
  if(route()!=='v4-calendar')return;
  const strip=document.querySelector('.v415-month-strip');
  const active=strip?.querySelector('button.active');
  if(!strip||!active)return;
  const left=active.offsetLeft-(strip.clientWidth-active.offsetWidth)/2;
  strip.scrollLeft=Math.max(0,left);
}
function top(){
  if(route()!=='v4-calendar')return;
  requestAnimationFrame(()=>{
    const screen=document.getElementById('screen');
    if(screen)screen.scrollTop=0;
    try{window.scrollTo({top:0,left:0,behavior:'auto'})}catch(_){window.scrollTo(0,0)}
    requestAnimationFrame(centerActiveMonth);
  });
}
window.addEventListener('hashchange',()=>{
  const now=route();
  if(now==='v4-calendar'&&last!==now)setTimeout(top,20);
  last=now;
});
document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-safe-route="v4-calendar"],[data-route="v4-calendar"],[data-v412-route="v4-calendar"],[data-v411-route="v4-calendar"]')){
    setTimeout(top,45);
  }
},true);
const screen=document.getElementById('screen');
if(screen)new MutationObserver(()=>{
  if(route()==='v4-calendar'&&screen.querySelector('[data-v415-calendar]'))requestAnimationFrame(centerActiveMonth);
}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{if(route()==='v4-calendar')top()},{once:true});
else if(route()==='v4-calendar')top();
})();
