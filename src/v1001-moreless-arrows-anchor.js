/* V1001 — Flechas curvas ancladas a las palabras MÁS / O / MENOS.
   Corrige las variantes de pantalla sin usar porcentajes fijos.
   No modifica el título, el estadio, botones ni eventos de juego. */
(function(){
  'use strict';
  if (window.__LJR_V1001_ARROWS_NEAR_TEXT__) return;
  window.__LJR_V1001_ARROWS_NEAR_TEXT__=true;

  let raf=0;
  let watchedScreen=null, contentObserver=null;
  let watchedTitle=null, resizeObserver=null;

  const isMoreLess=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]==='moreLess';
  const clamp=(x,min,max)=>Math.max(min,Math.min(max,x));

  // Un span de título puede ocupar toda la fila; la selección de texto
  // proporciona el límite REAL de las letras, incluso con cursiva y skew.
  function letters(el){
    if(!el)return null;
    try{
      const range=document.createRange();
      range.selectNodeContents(el);
      const rect=range.getBoundingClientRect();
      if(rect.width>0&&rect.height>0)return rect;
    }catch(_){}
    return el.getBoundingClientRect();
  }

  function move(arrow,x,y,rotation){
    arrow.style.setProperty('left',Math.round(x)+'px','important');
    arrow.style.setProperty('right','auto','important');
    arrow.style.setProperty('top',Math.round(y)+'px','important');
    arrow.style.setProperty('transform',rotation,'important');
  }

  function bindChanges(root,title){
    const screen=document.querySelector('#screen');
    if(screen!==watchedScreen){
      contentObserver?.disconnect();
      watchedScreen=screen;
      if(screen){
        contentObserver=new MutationObserver(schedule);
        contentObserver.observe(screen,{subtree:true,childList:true});
      }
    }
    if(root&&title&&title!==watchedTitle&&typeof ResizeObserver!=='undefined'){
      resizeObserver?.disconnect();
      watchedTitle=title;
      resizeObserver=new ResizeObserver(schedule);
      resizeObserver.observe(root);
      resizeObserver.observe(title);
    }
  }

  function place(){
    raf=0;
    if(!isMoreLess())return;
    const root=document.querySelector('#screen > [data-v12-moreless]');
    const title=root?.querySelector('.v12-ml-title')||null;
    // Observar #screen incluso antes de que se inserte la escena asíncrona.
    bindChanges(root,title);
    if(!root)return;
    const curve=root.querySelector('.v12-ml-curves');
    const up=curve?.querySelector('.up .v12-curve-arrow');
    const down=curve?.querySelector('.down .v12-curve-arrow');
    const spans=title?.querySelectorAll(':scope > span');
    if(!title||!curve||!up||!down||spans?.length<2)return;

    const first=letters(spans[0]);
    const second=letters(spans[spans.length-1]);
    const connector=letters(title.querySelector('small'));
    const frame=curve.getBoundingClientRect();
    const green=up.getBoundingClientRect(),red=down.getBoundingClientRect();
    if(!first||!second||!frame.width||!green.width||!red.width)return;

    // 6–12 px de aire entre trazos coloreados y caracteres blancos.
    const spacing=clamp(frame.width*.018,6,12);
    // SVG verde: trazo visible empieza en 25% de la anchura.
    const greenLeft=first.right+spacing-green.width*.25-frame.left;
    const greenTop=first.top-green.height*.52-frame.top+18; // V1005: flecha verde 18 px más abajo

    // SVG rojo girado: trazo termina aproximadamente en 75% del ancho.
    // Respeta también la O situada a la izquierda de MENOS.
    const textLeft=Math.min(second.left,connector?.left??second.left);
    const redLeft=textLeft-spacing-red.width*.78-frame.left;
    const redTop=second.top+second.height*.04-frame.top;

    // Un mínimo margen evita recortes en pantallas muy estrechas.
    move(up,clamp(greenLeft,2,frame.width-green.width-2),greenTop,'none');
    move(down,clamp(redLeft,2,frame.width-red.width-2),redTop,'rotate(180deg)');
    root.dataset.v1001ArrowsAnchored='1';
  }

  function schedule(){
    if(raf)return;
    raf=requestAnimationFrame(place);
  }
  function refresh(){
    schedule();
    setTimeout(schedule,110);
    setTimeout(schedule,420);
  }
  ['hashchange','popstate','resize','pageshow','load'].forEach(name=>{
    window.addEventListener(name,refresh,{passive:true});
  });
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',refresh,{once:true});
  }else refresh();
  if(document.fonts?.ready)document.fonts.ready.then(schedule).catch(()=>{});
})();
