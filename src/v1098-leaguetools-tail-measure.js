/* V1098 · Corrección del espacio REAL tras la última tarjeta de Más herramientas.
   Sólo actúa cuando Facebook es el último hijo de la página; NO elimina
   controles, no altera otras rutas, no mueve la barra fija. */
(()=>{
 'use strict';
 if(window.__LJR_V1098_TOOLS_TAIL__)return;
 window.__LJR_V1098_TOOLS_TAIL__=true;
 let raf=0,observed=null,observer=null;
 function active(){
  return (document.body?.dataset.appRoute==='leagueTools'
   ||location.hash.replace(/^#\/?/,'').split('?')[0]==='leagueTools')
   &&matchMedia('(max-width:1023px)').matches;
 }
 function compact(){
  raf=0;
  if(!active())return;
  const screen=document.getElementById('screen');
  const page=screen?.querySelector(':scope > .v60-tool-page.v726-tools-page');
  const last=page?.querySelector(':scope > [data-v74-facebook-source="tools"]');
  if(!page||!last||page.lastElementChild!==last)return;
  if(getComputedStyle(last).display==='none')return;
  // Un antiguo min-height/altura forzada en la página puede dejar hasta
  // cientos de píxeles invisibles DESPUÉS de "Compartir".
  const outer=page.getBoundingClientRect(),inner=last.getBoundingClientRect();
  const target=Math.ceil(inner.bottom-outer.top+10);
  if(!Number.isFinite(target)||target<100||target>200000)return;
  const tail=outer.bottom-inner.bottom;
  page.style.setProperty('min-height','0px','important');
  page.style.setProperty('max-height','none','important');
  page.style.setProperty('margin-bottom','0px','important');
  if(tail>20||Math.abs(outer.height-target)>22){
   const old=parseFloat(page.style.getPropertyValue('height'));
   if(!Number.isFinite(old)||Math.abs(old-target)>3){
    page.style.setProperty('height',target+'px','important');
   }
  }
 }
 function schedule(){
  if(!active()||raf)return;
  raf=requestAnimationFrame(compact);
 }
 function bind(){
  const screen=document.getElementById('screen');
  if(screen&&observed!==screen){
   observer?.disconnect();
   observed=screen;
   observer=new MutationObserver(schedule);
   observer.observe(screen,{childList:true,subtree:true});
   screen.addEventListener('scroll',schedule,{passive:true});
  }
  schedule();
 }
 window.addEventListener('hashchange',()=>setTimeout(bind,60));
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('pageshow',bind);
 window.addEventListener('load',bind);
 document.addEventListener('DOMContentLoaded',bind,{once:true});
 if(document.readyState!=='loading')bind();
})();