/* PC web restore guard — keeps the historical desktop layout isolated from mobile/APK patches. */
(function(){
'use strict';
if(window.__LJR_PC_WEB_RESTORE_GUARD_V876__) return;
window.__LJR_PC_WEB_RESTORE_GUARD_V876__=true;

const params=()=>new URLSearchParams(location.search);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const enabled=()=>{
  const mode=params().get('mode')||'';
  return mode==='desktop'||(!['mobile','apk'].includes(mode)&&window.innerWidth>=1024);
};
const host=()=>document.getElementById('screen');
const hasDesktop=()=>{
  const h=host();
  return !!(h&&h.querySelector(':scope > [data-desktop-shell="1"], :scope > [data-ds-page="1"]'));
};

let repairing=false;
let timer=0;
function restore(){
  if(!enabled()||repairing||hasDesktop()) return;
  repairing=true;
  document.body.classList.add('lj-desktop');
  try{
    window.LJR_DESKTOP_SHELL?.render?.();
    if(route()!=='home'){
      setTimeout(()=>window.LJR_DESKTOP_SECTIONS?.render?.(),0);
    }
  }finally{
    setTimeout(()=>{repairing=false},40);
  }
}
function schedule(){
  clearTimeout(timer);
  timer=setTimeout(restore,24);
}
function watch(){
  if(!enabled()) return;
  document.body.classList.add('lj-desktop');
  restore();
  const h=host();
  if(!h) return;
  new MutationObserver(()=>{
    if(enabled()&&!hasDesktop()) schedule();
  }).observe(h,{childList:true,subtree:false});
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',watch,{once:true});
else watch();
window.addEventListener('hashchange',()=>setTimeout(restore,35));
window.addEventListener('resize',()=>{if(enabled()) schedule();});
setTimeout(restore,120);
setTimeout(restore,450);
setTimeout(restore,1000);
})();