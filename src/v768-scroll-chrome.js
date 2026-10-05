/* Measure the existing header; do not rebuild the page or its artwork. */
(()=>{
  let frame=0;
  const apply=()=>{
    frame=0;
    const body=document.body;
    if(!body||!matchMedia('(max-width:1023px)').matches){body?.classList.remove('v768-scroll-root');return;}
    const route=body.dataset.appRoute;
    const header=route==='moments'?document.querySelector('.v26-moments-sticky'):document.querySelector('#app>.topbar');
    const visible=header&&getComputedStyle(header).display!=='none'&&header.getBoundingClientRect().height>1;
    body.classList.toggle('v768-scroll-root',!!visible);
    if(visible){
      const value=header.getBoundingClientRect().height+'px';
      if(body.style.getPropertyValue('--v768-head-h')!==value)body.style.setProperty('--v768-head-h',value);
    }
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(apply)};
  const boot=()=>{
    new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-app-route','class']});
    const root=document.querySelector('#screen');if(root)new MutationObserver(schedule).observe(root,{childList:true});
    const header=document.querySelector('#app>.topbar');if(header)new ResizeObserver(schedule).observe(header);
    window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);schedule();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
