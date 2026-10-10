/* The selected date follows the visible fixtures, without replacing the list. */
(function(){
 'use strict';
 function mount(root){
  if(!root||root.__fixtureScroll)return;
  const days=Array.from(root.querySelectorAll('[data-v12-group]'));
  const strip=root.querySelector('.v12-date-strip');
  if(!strip||!days.length)return;
  const buttons=Array.from(strip.querySelectorAll('[data-v12-date]'));
  const screen=root.closest('#screen');
  const pane=screen&&/(auto|scroll)/.test(getComputedStyle(screen).overflowY)?screen:window;
  const abort=new AbortController();
  let frame=0,target='',active=root.dataset.v12Selected||days[0].dataset.v12Group;
  const scrollY=()=>pane===window?window.scrollY:pane.scrollTop;
  const inset=()=> (pane===window?0:pane.getBoundingClientRect().top)+(parseFloat(getComputedStyle(strip).top)||0)+strip.getBoundingClientRect().height+16;
  function select(key){
   if(!root.isConnected)return;
   active=key;root.dataset.v12Selected=key;
   localStorage.setItem('v12-fixture-date-'+root.dataset.v12CurrentCat,key);
   for(const b of buttons){
    const on=b.dataset.v12Date===key;
    if(b.classList.contains('active')!==on)b.classList.toggle('active',on);
    if(b.getAttribute('aria-pressed')!==String(on))b.setAttribute('aria-pressed',String(on));
    if(on){const left=b.offsetLeft-(strip.clientWidth-b.offsetWidth)/2;if(Math.abs(strip.scrollLeft-left)>2)strip.scrollTo({left,behavior:'auto'});}
   }
  }
  function update(){
   frame=0;
   if(!root.isConnected){destroy();return;}
   const edge=inset();
   if(target){const d=days.find(d=>d.dataset.v12Group===target);if(d&&Math.abs(d.getBoundingClientRect().top-edge)>3)return;target='';}
   let visible=days[0];
   for(const day of days){if(day.getBoundingClientRect().top<=edge+2)visible=day;else break;}
   if(active!==visible.dataset.v12Group)select(visible.dataset.v12Group);
  }
  function schedule(){if(!frame)frame=requestAnimationFrame(update);}
  function go(key,smooth){
   const day=days.find(d=>d.dataset.v12Group===key);if(!day)return;
   select(key);target=key;
   const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   pane.scrollTo({top:Math.max(0,scrollY()+day.getBoundingClientRect().top-inset()),behavior:smooth&&!reduce?'smooth':'auto'});
   if(!smooth||reduce){target='';schedule();}
  }
  function release(){target='';schedule();}
  function destroy(){abort.abort();cancelAnimationFrame(frame);delete root.__fixtureScroll;}
  pane.addEventListener('scroll',schedule,{passive:true,signal:abort.signal});
  pane.addEventListener('wheel',release,{passive:true,signal:abort.signal});
  pane.addEventListener('touchstart',release,{passive:true,signal:abort.signal});
  window.addEventListener('resize',schedule,{passive:true,signal:abort.signal});
  root.__fixtureScroll={go,destroy};
  requestAnimationFrame(()=>{if(root.isConnected)go(active,false);else destroy();});
 }
 window.LJR_FIXTURE_SCROLL={mount};
})();
