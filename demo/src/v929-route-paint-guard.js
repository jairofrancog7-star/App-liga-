/* V929 — Global paint stabilization for multi-module routes.
   Hide only the screen content during a real route swap. Never remove layers,
   reorder cards, change the approved artwork or interrupt form interaction. */
(function(){
 'use strict';
 if(window.__LJR_VISUAL_STABILITY_V929__)return;
 window.__LJR_VISUAL_STABILITY_V929__=true;

 const html=document.documentElement;
 const where=()=>String(location.hash||'#/home');
 let target=where(),token=0,started=0,lastChange=0,staging=false;
 let quietTimer=0,hardTimer=0;
 const MIN_MS=120,QUIET_MS=115,MAX_MS=720;

 function stop(){
  if(!staging)return;
  staging=false;
  clearTimeout(quietTimer);clearTimeout(hardTimer);
  html.classList.remove('ljr-route-staging');
 }
 function check(id){
  if(!staging||token!==id)return;
  if(where()!==target){
   begin(where());return;
  }
  const elapsed=performance.now()-started;
  if(elapsed>=MAX_MS||(
   elapsed>=MIN_MS && performance.now()-lastChange>=QUIET_MS
  )){
   stop();return;
  }
  clearTimeout(quietTimer);
  quietTimer=setTimeout(()=>check(id),Math.min(65,Math.max(15,MIN_MS-elapsed)));
 }
 function begin(next){
  const url=String(next||where());
  if(staging&&target===url)return;
  if(!staging&&target===url)return;
  target=url;
  started=lastChange=performance.now();
  staging=true;
  const id=++token;
  html.classList.add('ljr-route-staging');
  clearTimeout(quietTimer);clearTimeout(hardTimer);
  quietTimer=setTimeout(()=>check(id),MIN_MS);
  hardTimer=setTimeout(()=>{if(token===id)stop()},MAX_MS+30);
 }
 function changed(){
  if(!staging)return;
  lastChange=performance.now();
  const id=token;
  clearTimeout(quietTimer);
  quietTimer=setTimeout(()=>check(id),QUIET_MS);
 }
 function setup(){
  const screen=document.getElementById('screen');
  if(!screen)return;
  // Root swaps reveal legacy templates. Nested counters, media and animations
  // are intentionally ignored so an active view cannot be stuck hidden.
  new MutationObserver(changed).observe(screen,{childList:true});
 }
 addEventListener('hashchange',()=>begin(where()));
 addEventListener('popstate',()=>begin(where()));
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});
 else setup();
 window.LJR_VISUAL_STABILITY={begin,finish:stop};
})();