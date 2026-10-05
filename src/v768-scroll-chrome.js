/* Measure the existing header; do not rebuild the page or its artwork. */
(()=>{
  let frame=0, observedHeader=null;
  const sizes=new ResizeObserver(()=>schedule());
  const customHeaders={following:'.v46-follow-head',history:'.v620-history-top',moments:'.v26-moments-sticky',rankings:'.v32-head','club-store':'.v431-store-head',simulator:'.v501-top',hospitality:'.v774-hospitality-head'};
  const apply=()=>{
    frame=0;
    const body=document.body;
    if(!body||!matchMedia('(max-width:1023px)').matches){body?.classList.remove('v768-scroll-root');return;}
    const route=body.dataset.appRoute;
    body.dataset.mobileLayout='v774';
    const custom=document.querySelector(customHeaders[route]||'.__no_custom_header');
    body.dataset.mobileHeader=custom?'custom':'global';
    const nav=document.querySelector('.bottom-nav');
    const navHeight=nav&&getComputedStyle(nav).display!=='none'?nav.getBoundingClientRect().height:0;
    const navValue=Math.max(0,navHeight)+'px';if(body.style.getPropertyValue('--v774-nav-h')!==navValue)body.style.setProperty('--v774-nav-h',navValue);
    const header=custom||document.querySelector('#app>.topbar');
    document.querySelectorAll('.ljr-scroll-header').forEach(n=>{if(n!==custom)n.classList.remove('ljr-scroll-header')});
    if(custom&&!custom.classList.contains('ljr-scroll-header'))custom.classList.add('ljr-scroll-header');
    const visible=header&&getComputedStyle(header).display!=='none'&&header.getBoundingClientRect().height>1;
    // Every mobile route gets a scroll surface, including routes with their own header.
    body.classList.toggle('v768-scroll-root',true);
    {
      const value=(visible?header.getBoundingClientRect().height:0)+'px';
      if(body.style.getPropertyValue('--v768-head-h')!==value)body.style.setProperty('--v768-head-h',value);
    }
    if(header!==observedHeader){sizes.disconnect();if(header)sizes.observe(header);observedHeader=header;}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(apply)};
  const boot=()=>{
    new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-app-route','class']});
    const root=document.querySelector('#screen');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
    const header=document.querySelector('#app>.topbar');if(header)new ResizeObserver(schedule).observe(header);
    window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);schedule();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
