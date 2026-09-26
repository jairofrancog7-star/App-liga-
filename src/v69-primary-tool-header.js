/* V69 — Match Center shell bridge.
   Generic/detail header ownership is centralized in v7-brand.js. No screen-text
   heuristics and no second header authority remain here. */
(function(){
'use strict';

const MATCH_CENTER_FLAG='v69-match-center-entry';
const MATCH_CENTER_ROUTES=new Set(['v4-matchcenter','matchCenter','match-center']);

function route(){
  return (location.hash.replace(/^#\/?/,'')||'home').split('?')[0];
}
function isMatchCenterEntry(){
  return sessionStorage.getItem(MATCH_CENTER_FLAG)==='1';
}
function sync(){
  const r=route();
  const isMatchCenter=MATCH_CENTER_ROUTES.has(r)||(r==='match'&&isMatchCenterEntry());

  /* Legacy primary-header mode pasted a complete Home banner over tool routes.
     It is deliberately retired; the single global topbar now owns those routes. */
  document.body.classList.remove('v69-primary-tool-header');
  document.body.classList.toggle('v69-match-center-header',isMatchCenter);
}

document.addEventListener('click',e=>{
  const target=e.target.closest?.('button,a,[data-route],[data-match]');
  if(target?.matches?.('[data-match]')||target?.closest?.('[data-match]')){
    sessionStorage.removeItem(MATCH_CENTER_FLAG);
  }else{
    const routeButton=target?.closest?.('[data-route="match"]')||(target?.dataset?.route==='match'?target:null);
    if(routeButton){
      const label=(routeButton.textContent||'').replace(/\s+/g,' ').trim();
      if(/Match Center/i.test(label))sessionStorage.setItem(MATCH_CENTER_FLAG,'1');
      else sessionStorage.removeItem(MATCH_CENTER_FLAG);
    }
  }
  requestAnimationFrame(sync);
},true);

window.addEventListener('hashchange',()=>{
  if(route()!=='match')sessionStorage.removeItem(MATCH_CENTER_FLAG);
  requestAnimationFrame(sync);
});
window.addEventListener('popstate',()=>requestAnimationFrame(sync));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',sync,{once:true});else sync();
})();