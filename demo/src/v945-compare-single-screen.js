/* V945 — Size the comparator to the actual space between app header and bottom nav.
   Do not resize app chrome, player crests or statistics; only measure available space. */
(function(){
 'use strict';
 if(window.__LJR_COMPARE_SINGLE_SCREEN_V945__)return;
 window.__LJR_COMPARE_SINGLE_SCREEN_V945__=true;
 const ROUTES=new Set(['compare','comparar','v4-compare']);
 const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
 let pending=false,obs=null;
 function update(){
  pending=false;
  if(!ROUTES.has(route()))return;
  const screen=document.querySelector('#screen');
  const page=screen?.querySelector(':scope > .v944-compare');
  if(!page)return;
  const nav=document.querySelector('#app .bottom-nav');
  const screenTop=screen.getBoundingClientRect().top;
  const navTop=nav&&getComputedStyle(nav).display!=='none'
   ?nav.getBoundingClientRect().top
   :(window.visualViewport?.height||window.innerHeight);
  const viewportBottom=window.visualViewport?.height||window.innerHeight;
  const bottom=Math.min(navTop,viewportBottom);
  const available=Math.floor(bottom-screenTop-4);
  if(available<=0)return;
  const value=available+'px';
  if(page.style.getPropertyValue('--v945-available')!==value)
   page.style.setProperty('--v945-available',value);
  // This is a fixed, one-page dashboard; the user never has to scroll the
  // containing screen. The player search sheet retains its own scrolling.
  if(screen.scrollTop!==0)screen.scrollTop=0;
 }
 function schedule(){
  if(!pending){pending=true;requestAnimationFrame(update)}
 }
 function init(){
  const screen=document.querySelector('#screen');
  if(!screen)return;
  obs=new MutationObserver(schedule);
  obs.observe(screen,{childList:true,subtree:false});
  if(typeof ResizeObserver!=='undefined'){
   const resize=new ResizeObserver(schedule);
   resize.observe(screen);
   const nav=document.querySelector('#app .bottom-nav');
   if(nav)resize.observe(nav);
  }
  addEventListener('resize',schedule,{passive:true});
  addEventListener('orientationchange',schedule,{passive:true});
  window.visualViewport?.addEventListener('resize',schedule,{passive:true});
  addEventListener('hashchange',schedule);
  addEventListener('pageshow',schedule);
  schedule();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
 else init();
})();