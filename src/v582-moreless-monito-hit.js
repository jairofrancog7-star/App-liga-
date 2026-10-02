(()=>{
  if(window.__LJR_V582_MORELESS_MONITO_HIT__)return;
  window.__LJR_V582_MORELESS_MONITO_HIT__=true;

  const STYLE_ID='v582-moreless-monito-hit-style';
  function route(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
  }
  function ensureStyle(){
    if(document.getElementById(STYLE_ID))return;
    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=`
      body[data-app-route="moreLess"] #screen [data-v12-moreless]{
        position:relative!important;
      }
      body[data-app-route="moreLess"] #screen [data-v12-moreless] .v582-monito-hit{
        position:absolute!important;
        z-index:2147483000!important;
        top:37.2%!important;
        width:38.5%!important;
        height:22.5%!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:50%!important;
        background:transparent!important;
        opacity:.001!important;
        pointer-events:auto!important;
        touch-action:manipulation!important;
        -webkit-tap-highlight-color:transparent!important;
        cursor:pointer!important;
      }
      body[data-app-route="moreLess"] #screen [data-v12-moreless] .v582-monito-hit.left{
        left:5.5%!important;
      }
      body[data-app-route="moreLess"] #screen [data-v12-moreless] .v582-monito-hit.right{
        right:5.5%!important;
      }
      @media(max-height:740px){
        body[data-app-route="moreLess"] #screen [data-v12-moreless] .v582-monito-hit{
          top:36.0%!important;
          height:23.5%!important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function galleryVisible(){
    const portal=document.querySelector('#v543-moreless-portal');
    return !!(portal && !portal.hidden && getComputedStyle(portal).display!=='none');
  }

  function openMore(){
    try{
      const api=window.LJR_V541_GAMES_API;
      if(api&&typeof api.openMorePages==='function'){
        api.openMorePages();
        setTimeout(()=>{
          if(!galleryVisible()){
            if(window.LJR_MAIN_ROUTE&&typeof window.LJR_MAIN_ROUTE.go==='function'){
              window.LJR_MAIN_ROUTE.go('moreLessGallery');
            }else{
              location.hash='#/moreLessGallery';
            }
          }
        },160);
        return;
      }
    }catch(_){}
    if(window.LJR_MAIN_ROUTE&&typeof window.LJR_MAIN_ROUTE.go==='function'){
      window.LJR_MAIN_ROUTE.go('moreLessGallery');
    }else{
      location.hash='#/moreLessGallery';
    }
  }

  function bindButton(btn){
    if(btn.dataset.v582Bound==='1')return;
    btn.dataset.v582Bound='1';
    const go=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
      openMore();
    };
    btn.addEventListener('pointerup',go,true);
    btn.addEventListener('click',go,true);
    btn.addEventListener('touchend',go,{capture:true,passive:false});
  }

  function mount(){
    ensureStyle();
    if(route()!=='moreLess')return;
    const root=document.querySelector('#screen [data-v12-moreless]');
    if(!root)return;
    let left=root.querySelector('.v582-monito-hit.left');
    let right=root.querySelector('.v582-monito-hit.right');
    if(!left){
      left=document.createElement('button');
      left.type='button';
      left.className='v582-monito-hit left';
      left.setAttribute('aria-label','Abrir Más o Menos');
      root.appendChild(left);
    }
    if(!right){
      right=document.createElement('button');
      right.type='button';
      right.className='v582-monito-hit right';
      right.setAttribute('aria-label','Abrir Más o Menos');
      root.appendChild(right);
    }
    bindButton(left);
    bindButton(right);
  }

  let timer=0;
  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      mount();
      setTimeout(mount,120);
      setTimeout(mount,500);
    },20);
  }

  window.addEventListener('hashchange',schedule);
  window.addEventListener('load',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  schedule();
})();