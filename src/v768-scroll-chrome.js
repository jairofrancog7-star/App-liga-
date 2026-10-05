/* Measure the existing header; do not rebuild the page or its artwork. */
(()=>{
  let frame=0, observedHeader=null, observedNav=null;
  const sizes=new ResizeObserver(()=>schedule());
  // These are page controls, not card titles or headers inside a modal.
  const customHeaders={fantasy:['.v22-fantasy-master'],quizArena:['.ljr-quiz-head'],stats:['.v33-data-head','.v520-stats-topbar'],compareTeams:['.v369-compare-topbar'],following:['.v46-follow-head','.v28-head'],history:['.v620-history-top'],moments:['.v26-moments-sticky'],rankings:['.v32-head'],scorers:['.v775-scorers-head'],'club-store':['.v431-store-head','.v510-store-head'],simulator:['.v501-top'],hospitality:['.v774-hospitality-head'],favorites:['.v414-ref-head'],'v4-calendar':['.v415-reference-topbar'],teams:['.v41-head','.v27-teams-head'],'safe-about':['.v33-about-tools'],'safe-data':['.v33-data-head','.v62-data-head'],leagueData:['.v33-data-head','.v62-data-head']};
  const overlay=node=>node?.matches('.v22-fantasy-master,.v33-about-tools');
  const overlayRoutes=new Set(['safe-performance']);
  const visible=node=>node&&!node.hidden&&getComputedStyle(node).display!=='none'&&getComputedStyle(node).visibility!=='hidden'&&node.getBoundingClientRect().height>1;
  const clearHeaders=()=>document.querySelectorAll('.ljr-scroll-header').forEach(node=>node.classList.remove('ljr-scroll-header'));
  const apply=()=>{
    frame=0;
    const body=document.body;
    if(!body||!matchMedia('(max-width:1023px)').matches){body?.classList.remove('v768-scroll-root');if(body){delete body.dataset.mobileLayout;delete body.dataset.mobileHeader;}clearHeaders();sizes.disconnect();observedHeader=observedNav=null;return;}
    const route=body.dataset.appRoute;
    body.dataset.mobileLayout='v775';
    const screen=document.querySelector('#screen');
    const custom=(customHeaders[route]||[]).map(selector=>screen?.querySelector(selector)).find(visible);
    const routeOverlay=overlayRoutes.has(route);
    body.dataset.mobileHeader=routeOverlay||overlay(custom)?'overlay':custom?'custom':'global';
    const nav=document.querySelector('.bottom-nav');
    const navHeight=visible(nav)?nav.getBoundingClientRect().height:0;
    const navValue=Math.max(0,navHeight)+'px';if(body.style.getPropertyValue('--v774-nav-h')!==navValue)body.style.setProperty('--v774-nav-h',navValue);
    const header=routeOverlay?null:(custom||document.querySelector('#app>.topbar'));
    window.LJR_CHROME?.sync?.(header,!!custom);
    document.querySelectorAll('.ljr-scroll-header').forEach(n=>{if(n!==custom||overlay(n))n.classList.remove('ljr-scroll-header')});
    if(custom&&!overlay(custom)&&!custom.classList.contains('ljr-scroll-header'))custom.classList.add('ljr-scroll-header');
    // Every mobile route gets a scroll surface, including routes with their own header.
    body.classList.toggle('v768-scroll-root',true);
    {
      const value=(routeOverlay?0:(!overlay(header)&&visible(header)?header.getBoundingClientRect().height:0))+'px';
      if(body.style.getPropertyValue('--v768-head-h')!==value)body.style.setProperty('--v768-head-h',value);
    }
    if(header!==observedHeader||nav!==observedNav){sizes.disconnect();if(header)sizes.observe(header);if(nav)sizes.observe(nav);observedHeader=header;observedNav=nav;}
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(apply)};
  window.LJR_SCROLL_CHROME={refresh:schedule};
  const boot=()=>{
    new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-app-route','class']});
    const root=document.querySelector('#screen');if(root)new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
    const header=document.querySelector('#app>.topbar');if(header)new ResizeObserver(schedule).observe(header);
    window.addEventListener('resize',schedule);window.addEventListener('hashchange',schedule);schedule();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
