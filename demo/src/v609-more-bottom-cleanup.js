/* V609 — cleanup fallback for stale async panels below Más. */
(function(){
'use strict';
if(window.__LJR_V609_MORE_BOTTOM_CLEANUP__)return;
window.__LJR_V609_MORE_BOTTOM_CLEANUP__=true;
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
function clean(){
  if(route()!=='more')return;
  const screen=document.querySelector('#screen');
  if(!screen)return;
  screen.querySelectorAll('#v411-lower-experience,#v412-lower-sections,#safeMore,[data-v411-owner="more"],[data-v411-zone="more"],#v105-bottom[data-v105-route="more"]').forEach(x=>x.remove());
  const main=screen.querySelector(':scope > .v19-more-page');
  Array.from(screen.children).forEach(el=>{
    if(el===main)return;
    const t=(el.textContent||'').replace(/\s+/g,' ').trim().toLowerCase();
    if(t.includes('quiniela de la liga')||(/^quiniela\b/.test(t)&&t.length<500))el.remove();
  });
}
let timer=0;
function schedule(){clearTimeout(timer);timer=setTimeout(clean,40)}
window.addEventListener('hashchange',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
schedule();setTimeout(clean,500);setTimeout(clean,1600);
})();