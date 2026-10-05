/* V788 — Más o Menos: abrir la galería solo tras un toque real en uno de los dos monitos.
   Evita el salto automático provocado por un pointerup heredado del toque que abrió esta pantalla. */
(()=>{
  if(window.__LJR_V788_MORELESS_TAP_GUARD__)return;
  window.__LJR_V788_MORELESS_TAP_GUARD__=true;

  const route=()=>String(location.hash||'').replace(/^#\\/?/,'').split('?')[0]||'home';
  const outerSelector='#screen [data-v12-moreless] .v12-ml-choice > button';
  const choiceSelector='#screen [data-v12-moreless] [data-v12-choice], #screen [data-v12-moreless] .v582-monito-hit';

  let armedButton=null;
  let allowClickButton=null;
  let allowClickUntil=0;

  function cleanLegacyHits(){
    if(route()!=='moreLess')return;
    document.querySelectorAll('#screen [data-v12-moreless] .v582-monito-hit').forEach(el=>el.remove());
    document.querySelectorAll(outerSelector).forEach(btn=>{
      /* La navegación queda controlada por el toque real, no por el delegado global data-route. */
      btn.removeAttribute('data-route');
      btn.setAttribute('data-v788-direct-touch','1');
    });
  }

  window.addEventListener('pointerdown',e=>{
    if(route()!=='moreLess'){armedButton=null;return}
    const target=e.target instanceof Element?e.target.closest(outerSelector):null;
    armedButton=target||null;
  },true);

  window.addEventListener('pointerup',e=>{
    if(route()!=='moreLess')return;
    const el=e.target instanceof Element?e.target.closest(choiceSelector):null;
    if(!el)return;
    const outer=e.target instanceof Element?e.target.closest(outerSelector):null;
    if(outer&&armedButton===outer){
      allowClickButton=outer;
      allowClickUntil=performance.now()+700;
      armedButton=null;
      return; // deja que V531 haga la navegación normal
    }
    armedButton=null;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },true);

  window.addEventListener('touchend',e=>{
    if(route()!=='moreLess')return;
    const el=e.target instanceof Element?e.target.closest(choiceSelector):null;
    if(!el)return;
    const outer=e.target instanceof Element?e.target.closest(outerSelector):null;
    if(outer&&allowClickButton===outer&&performance.now()<=allowClickUntil)return;
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },{capture:true,passive:false});

  window.addEventListener('click',e=>{
    if(route()!=='moreLess')return;
    const el=e.target instanceof Element?e.target.closest(choiceSelector):null;
    if(!el)return;
    const outer=e.target instanceof Element?e.target.closest(outerSelector):null;
    if(outer&&(
      (allowClickButton===outer&&performance.now()<=allowClickUntil) ||
      e.detail===0
    )){
      allowClickButton=null;
      allowClickUntil=0;
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  },true);

  let timer=0;
  const schedule=()=>{
    clearTimeout(timer);
    timer=setTimeout(()=>{
      cleanLegacyHits();
      setTimeout(cleanLegacyHits,80);
      setTimeout(cleanLegacyHits,300);
    },0);
  };

  window.addEventListener('hashchange',()=>{armedButton=null;allowClickButton=null;allowClickUntil=0;schedule()});
  window.addEventListener('load',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  const screen=document.getElementById('screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  schedule();
})();
