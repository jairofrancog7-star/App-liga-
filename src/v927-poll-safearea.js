/* V927 — reserve exact height of fixed bottom navigation in Liga poll dialog. */
(function(){
 'use strict';
 if(window.__LJR_V927_POLL_SAFEAREA__)return;
 window.__LJR_V927_POLL_SAFEAREA__=true;
 let queued=false;
 function measure(){
  queued=false;
  const modal=document.querySelector('body > .v105-modal.v105-poll-modal');
  if(!modal)return;
  const nav=document.querySelector('#app > .bottom-nav');
  let clear=84;
  if(nav){
   const r=nav.getBoundingClientRect();
   if(r.width>0&&r.height>0&&r.top>=0&&r.top<innerHeight){
    clear=Math.max(0,Math.ceil(innerHeight-r.top)+7);
   }
  }
  const pixels=clear+'px';
  if(modal.style.getPropertyValue('--v927-nav-clearance')!==pixels){
   modal.style.setProperty('--v927-nav-clearance',pixels);
  }
 }
 function schedule(){
  if(queued)return;
  queued=true;
  requestAnimationFrame(measure);
 }
 // The poll modal is appended directly to <body>, so observe only direct children.
 const init=()=>{
  new MutationObserver(schedule).observe(document.body,{childList:true});
  schedule();
 };
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('orientationchange',schedule,{passive:true});
 window.visualViewport?.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',schedule,{passive:true});
})();