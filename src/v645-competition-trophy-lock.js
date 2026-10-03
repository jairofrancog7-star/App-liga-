/* V646 — Competición: Partidos/Clasificación/Cuadro comparten EXACTAMENTE
   la misma cabecera. Se toma Partidos y resultados como referencia real del
   navegador y se congela toda su geometría/arte para las otras pestañas. */
(function(){
  'use strict';

  const STYLE_ID='v646-competition-header-snapshot';
  const LOCK_CLASS='v646-header-snapshot';
  let capturing=false;

  const elementProps=[
    'display','visibility','position','left','right','top','bottom',
    'width','height','min-width','min-height','max-width','max-height',
    'margin','margin-left','margin-right','margin-top','margin-bottom',
    'padding','padding-left','padding-right','padding-top','padding-bottom',
    'overflow','overflow-x','overflow-y','isolation',
    'border','border-radius','box-shadow',
    'background','background-color','background-image','background-position',
    'background-size','background-repeat',
    'color','font-family','font-size','font-weight','line-height',
    'letter-spacing','text-align','white-space','text-shadow',
    'opacity','transform','filter','z-index','pointer-events'
  ];

  const pseudoProps=[
    'content','display','visibility','position','left','right','top','bottom',
    'width','height','min-width','min-height','max-width','max-height',
    'margin','padding','overflow',
    'border','border-radius','box-shadow',
    'background','background-color','background-image','background-position',
    'background-size','background-repeat',
    'color','font-family','font-size','font-weight','line-height',
    'letter-spacing','text-align','white-space','text-shadow',
    'opacity','transform','filter','z-index','pointer-events',
    '-webkit-mask-image','mask-image'
  ];

  const parts=[
    {sel:'.topbar', pseudo:null, props:elementProps},
    {sel:'.topbar', pseudo:'::before', props:pseudoProps},
    {sel:'.topbar', pseudo:'::after', props:pseudoProps},
    {sel:'.topbar .wordmark', pseudo:null, props:elementProps},
    {sel:'.topbar .wordmark', pseudo:'::before', props:pseudoProps},
    {sel:'.topbar .wordmark', pseudo:'::after', props:pseudoProps},
    {sel:'.topbar .back-button', pseudo:null, props:elementProps},
    {sel:'.topbar .back-button', pseudo:'::before', props:pseudoProps},
    {sel:'.topbar .back-button', pseudo:'::after', props:pseudoProps},
    {sel:'.topbar .profile-button', pseudo:null, props:elementProps},
    {sel:'.topbar .profile-button', pseudo:'::before', props:pseudoProps},
    {sel:'.topbar .profile-button', pseudo:'::after', props:pseudoProps}
  ];

  function route(){
    return String(document.body?.dataset?.appRoute || location.hash.replace(/^#\/?/,'').split('?')[0] || '');
  }
  function tabs(){
    return document.querySelector('#screen>.tabs');
  }
  function isResults(){
    const a=tabs()?.querySelector('.tab.active');
    return !!a && /Partidos|resultados/i.test(a.textContent||'');
  }
  function cssValue(cs,prop){
    const v=cs.getPropertyValue(prop);
    return String(v||'').trim();
  }
  function declsFor(el,pseudo,props){
    const cs=getComputedStyle(el,pseudo||null);
    const out=[];
    for(const prop of props){
      const val=cssValue(cs,prop);
      if(!val) continue;
      out.push(prop+':'+val+'!important');
    }
    return out.join(';');
  }

  function capture(){
    if(capturing || route()!=='competition' || !isResults()) return false;
    capturing=true;
    const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!bar){capturing=false;return false;}

    /* Quitar temporalmente el lock anterior para medir únicamente Partidos. */
    document.body.classList.remove(LOCK_CLASS);
    document.getElementById(STYLE_ID)?.remove();

    const rules=[];
    for(const part of parts){
      const el=bar.matches(part.sel) ? bar : document.querySelector(part.sel);
      if(!el) continue;
      const decl=declsFor(el,part.pseudo,part.props);
      if(!decl) continue;
      const selector='html body.'+LOCK_CLASS+'[data-app-route="competition"] '+part.sel+(part.pseudo||'');
      rules.push(selector+'{'+decl+';}');
    }

    /* Asegura que Clasificación no pueda ocultar/reemplazar las piezas capturadas. */
    rules.push('html body.'+LOCK_CLASS+'[data-app-route="competition"] .topbar{display:block!important;visibility:visible!important;opacity:1!important;}');

    const style=document.createElement('style');
    style.id=STYLE_ID;
    style.textContent=rules.join('\n');
    document.head.appendChild(style);
    document.body.classList.add(LOCK_CLASS);
    capturing=false;
    return true;
  }

  function ensure(){
    if(route()!=='competition'){
      document.body.classList.remove(LOCK_CLASS);
      return;
    }
    if(isResults()){
      if(!document.getElementById(STYLE_ID) || !document.body.classList.contains(LOCK_CLASS)) capture();
      return;
    }
    if(document.getElementById(STYLE_ID)){
      document.body.classList.add(LOCK_CLASS);
    }
  }

  /* Captura ANTES de que el click de Clasificación/Cuadro cambie clases del body. */
  document.addEventListener('pointerdown',e=>{
    if(route()!=='competition' || !isResults()) return;
    const tab=e.target instanceof Element ? e.target.closest('#screen>.tabs .tab') : null;
    if(tab) capture();
  },true);
  document.addEventListener('touchstart',e=>{
    if(route()!=='competition' || !isResults()) return;
    const tab=e.target instanceof Element ? e.target.closest('#screen>.tabs .tab') : null;
    if(tab) capture();
  },{capture:true,passive:true});
  document.addEventListener('click',e=>{
    if(route()!=='competition') return;
    const tab=e.target instanceof Element ? e.target.closest('#screen>.tabs .tab') : null;
    if(!tab) return;
    if(isResults()) capture();
    requestAnimationFrame(ensure);
    setTimeout(ensure,25);
  },true);

  const mo=new MutationObserver(()=>requestAnimationFrame(ensure));
  function start(){
    mo.observe(document.body,{attributes:true,attributeFilter:['class','data-app-route']});
    const screen=document.querySelector('#screen');
    if(screen) mo.observe(screen,{childList:true,subtree:false});
    requestAnimationFrame(ensure);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start,{once:true});
  else start();

  window.addEventListener('hashchange',()=>requestAnimationFrame(ensure));
  window.addEventListener('resize',()=>{
    if(route()==='competition' && isResults()) requestAnimationFrame(capture);
  },{passive:true});
})();