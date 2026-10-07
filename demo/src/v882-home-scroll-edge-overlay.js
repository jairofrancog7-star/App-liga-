/* V882 — coloca la línea exactamente en el borde superior REAL de #screen. */
(()=>{
  'use strict';
  if(window.__LJR_V882_HOME_SCROLL_EDGE__)return;
  window.__LJR_V882_HOME_SCROLL_EDGE__=true;

  const ID='v882-home-scroll-edge';
  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
  const mobile=()=>matchMedia('(max-width:1023px)').matches;

  let edge=null;
  function ensure(){
    if(edge?.isConnected)return edge;
    edge=document.getElementById(ID);
    if(!edge){
      edge=document.createElement('div');
      edge.id=ID;
      edge.className='v882-home-scroll-edge';
      edge.setAttribute('aria-hidden','true');
      edge.innerHTML='<i></i>';
      document.body.appendChild(edge);
    }
    return edge;
  }

  function sync(){
    const el=ensure();
    const isHome=route()==='home'||document.body?.dataset?.appRoute==='home';
    if(!mobile()||!isHome){
      el.style.display='none';
      return;
    }
    const screen=document.getElementById('screen');
    if(!screen){
      el.style.display='none';
      return;
    }
    const y=Math.round(screen.getBoundingClientRect().top);
    el.style.display='block';
    el.style.top=y+'px';
  }

  let raf=0;
  const queue=()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(sync);
  };

  function boot(){
    queue();
    setTimeout(queue,60);
    setTimeout(queue,260);
    setTimeout(queue,850);

    addEventListener('hashchange',queue,{passive:true});
    addEventListener('resize',queue,{passive:true});
    addEventListener('orientationchange',()=>setTimeout(queue,120),{passive:true});

    const body=document.body;
    if(body)new MutationObserver(queue).observe(body,{attributes:true,attributeFilter:['data-app-route','class']});

    const screen=document.getElementById('screen');
    const top=document.querySelector('#app>.topbar,.app-shell>.topbar');
    if('ResizeObserver' in window){
      const ro=new ResizeObserver(queue);
      if(screen)ro.observe(screen);
      if(top)ro.observe(top);
    }
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
