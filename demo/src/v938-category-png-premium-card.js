/* V938 — Detectar sólo el enlace de PNG por categoría visible.
   Añadir una clase de presentación; nunca reemplazar el botón ni sus listeners. */
(()=>{
  'use strict';
  if(window.__LJR_V938_PNG_CARD__)return;
  window.__LJR_V938_PNG_CARD__=true;
  const normal=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  const matches=el=>{
    const t=normal(el.textContent);
    return t.includes('generar png por categoria')&&t.includes('tablas y avisos');
  };
  let raf=0;
  function apply(){
    raf=0;
    const root=document.querySelector('#screen');
    if(!root)return;
    const candidates=[...root.querySelectorAll('button,a,[role="button"],article')].filter(matches);
    for(const el of candidates){
      // No pintar una tarjeta contenedora si dentro está el botón funcional.
      if(el.matches('article')&&el.querySelector('button,a,[role="button"]'))continue;
      el.classList.add('v938-png-category-card');
      // Ocultar únicamente la flecha tipográfica final: una nueva flecha decorativa la sustituye.
      const tail=[...el.childNodes].reverse().find(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(tail&&/[›»]\s*$/.test(tail.textContent)){
        tail.textContent=tail.textContent.replace(/\s*[›»]\s*$/,'');
      }
    }
  }
  function queue(){
    if(raf)return;
    raf=requestAnimationFrame(apply);
  }
  function boot(){
    const screen=document.querySelector('#screen');
    if(!screen)return;
    new MutationObserver(queue).observe(screen,{childList:true,subtree:true});
    window.addEventListener('hashchange',queue);
    window.addEventListener('pageshow',queue);
    queue();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
