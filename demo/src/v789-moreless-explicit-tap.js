/* V789 — Más o Menos: navegación únicamente con toque deliberado en uno de los dos botones reales. */
(()=>{
  if(window.__LJR_V789_MORELESS_EXPLICIT_TAP__)return;
  window.__LJR_V789_MORELESS_EXPLICIT_TAP__=true;

  const rootSel='#screen [data-v12-moreless]';
  const buttonSel=rootSel+' .v12-ml-choice > button';
  const legacySel=rootSel+' [data-v12-choice], '+rootSel+' .v582-monito-hit';

  const route=()=>String(location.hash||'').replace(/^#\\/?/,'').split('?')[0]||'home';
  let enteredAt=0;
  let armed=null;
  let navigating=false;

  function markRoute(){
    if(route()==='moreLess') enteredAt=performance.now();
    armed=null;
    navigating=false;
    clean();
  }

  function clean(){
    if(route()!=='moreLess')return;
    document.querySelectorAll(rootSel+' .v582-monito-hit').forEach(el=>el.remove());
    document.querySelectorAll(buttonSel).forEach(btn=>{
      btn.removeAttribute('data-route');
      btn.removeAttribute('data-v531-more-open');
      btn.setAttribute('data-v789-explicit','1');
    });
  }

  function exactButton(target){
    if(!(target instanceof Element))return null;
    return target.closest(buttonSel);
  }

  function isLegacyTarget(target){
    return target instanceof Element && !!target.closest(legacySel);
  }

  function openGallery(){
    if(navigating)return;
    navigating=true;
    try{
      if(window.LJR_MAIN_ROUTE&&typeof window.LJR_MAIN_ROUTE.go==='function'){
        window.LJR_MAIN_ROUTE.go('moreLessGallery');
      }else{
        location.hash='#/moreLessGallery';
      }
    }catch(_){
      location.hash='#/moreLessGallery';
    }
  }

  /* El pointerdown tiene que comenzar en el botón real y además la pantalla debe
     llevar visible un momento; así el toque que abrió Más o Menos no se reutiliza. */
  window.addEventListener('pointerdown',e=>{
    if(route()!=='moreLess'){armed=null;return}
    clean();
    if(performance.now()-enteredAt<650){armed=null;return}
    armed=exactButton(e.target);
  },true);

  window.addEventListener('pointerup',e=>{
    if(route()!=='moreLess')return;
    if(!isLegacyTarget(e.target))return;
    const btn=exactButton(e.target);
    const valid=!!btn && btn===armed && performance.now()-enteredAt>=650;
    armed=null;
    e.preventDefault();
    e.stopPropagation();
    if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
    if(valid)openGallery();
  },true);

  /* Bloquea el click sintético posterior; la navegación ya ocurrió en pointerup. */
  window.addEventListener('click',e=>{
    if(route()!=='moreLess')return;
    if(!isLegacyTarget(e.target))return;
    const btn=exactButton(e.target);
    const keyboard=!!btn && e.detail===0 && performance.now()-enteredAt>=650;
    e.preventDefault();
    e.stopPropagation();
    if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
    if(keyboard)openGallery();
  },true);

  window.addEventListener('touchend',e=>{
    if(route()!=='moreLess'||!isLegacyTarget(e.target))return;
    e.preventDefault();
    e.stopPropagation();
    if(typeof e.stopImmediatePropagation==='function')e.stopImmediatePropagation();
  },{capture:true,passive:false});

  let timer=0;
  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      clean();
      setTimeout(clean,80);
      setTimeout(clean,250);
      setTimeout(clean,700);
    },0);
  }

  window.addEventListener('hashchange',()=>{markRoute();schedule()});
  window.addEventListener('load',()=>{markRoute();schedule()});
  document.addEventListener('DOMContentLoaded',()=>{markRoute();schedule()},{once:true});
  const screen=document.getElementById('screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  markRoute();
  schedule();
})();
