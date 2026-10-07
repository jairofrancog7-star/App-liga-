/* V892 — sacar generadores/diseños de #/more.
   La función queda accesible desde "Más herramientas" -> "Generador de diseños". */
(function(){
  'use strict';
  if(window.__LJR_V892_MORE_TOOLS_RELOCATION__)return;
  window.__LJR_V892_MORE_TOOLS_RELOCATION__=true;

  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'home');
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function collapse(el){
    if(!el||el.dataset?.v892Hidden==='1')return;
    el.dataset.v892Hidden='1';
    el.hidden=true;
    el.setAttribute('aria-hidden','true');
    for(const [k,v] of [
      ['display','none'],['visibility','hidden'],['opacity','0'],['pointer-events','none'],
      ['height','0'],['min-height','0'],['max-height','0'],['margin','0'],['padding','0'],
      ['border','0'],['overflow','hidden']
    ])el.style.setProperty(k,v,'important');
  }

  function generatorSignature(el){
    const t=norm(el?.textContent);
    if(!t)return false;
    return t.includes('disenos nuevos para tu liga') ||
      (t.includes('resultados png')&&t.includes('boletines y avisos')) ||
      (t.includes('generar png por categoria')&&t.includes('tablas y avisos'));
  }

  function cleanMore(){
    if(route()!=='more')return;
    const screen=document.querySelector('#screen');
    const page=screen?.querySelector(':scope > .v19-more-page');
    if(!screen||!page)return;

    screen.querySelectorAll('[data-v161-global-center],.v161-global-center,.v668-native-global-center,.v161-wa-admin').forEach(collapse);

    /* moreView() sólo posee estos hijos; los demás son inyecciones de otros módulos. */
    [...page.children].forEach(el=>{
      if(el.matches('.v19-more-logo,.v19-more-menu,.v19-more-label,.v19-more-bottom,.v413-shell'))return;
      collapse(el);
    });

    /* Si el módulo llegó envuelto con otra clase, detectar la firma visual/textual. */
    const candidates=[...screen.querySelectorAll('section,article,div')].filter(generatorSignature);
    candidates.sort((a,b)=>a.querySelectorAll('*').length-b.querySelectorAll('*').length);
    for(const el of candidates){
      if(el===screen||el===page)continue;
      const direct=el.closest('.v19-more-page > section,.v19-more-page > article,.v19-more-page > div')||el;
      if(direct!==page&&!direct.matches('.v19-more-menu,.v19-more-label,.v413-shell'))collapse(direct);
    }

    /* No permitir que un módulo inferior reaparezca debajo de la página principal. */
    [...screen.children].forEach(el=>{if(el!==page)collapse(el)});
  }

  let queued=false;
  function queue(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>{queued=false;cleanMore()});
  }

  window.addEventListener('hashchange',queue);
  window.addEventListener('pageshow',queue);
  document.addEventListener('DOMContentLoaded',queue,{once:true});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(queue).observe(screen,{childList:true,subtree:true});
  queue();
})();
