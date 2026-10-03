/* V657 — auditor global de huecos entre cuadros.
   Corre en todas las rutas móviles de la app azul y sólo recorta espacios
   anormalmente grandes producidos por margin/padding heredados.
   No cambia tamaños internos de tarjetas, cabeceras sticky ni overlays. */
(function(){
'use strict';
if(window.__LJR_V657_GLOBAL_GAP_AUDIT__)return;
window.__LJR_V657_GLOBAL_GAP_AUDIT__=true;

const MAX_GAP=44;
const TIGHT=8;
const PAD_TAIL_LIMIT=48;
let timer=0;
let observer=null;

function mobile(){
  return !window.matchMedia || window.matchMedia('(max-width:1023px)').matches;
}
function visible(el){
  if(!(el instanceof HTMLElement))return false;
  const s=getComputedStyle(el);
  if(s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)return false;
  const r=el.getBoundingClientRect();
  return r.width>0&&r.height>0;
}
function chrome(el){
  return el.matches(
    '.tabs,.topbar,.bottom-nav,nav,[role="dialog"],'+
    '.v571-sheet-layer,.v566-sheet-layer,.v105-modal,.v501-sheet,'+
    '[data-overlay],[data-modal]'
  );
}
function flowPosition(el){
  const p=getComputedStyle(el).position;
  return p!=='fixed'&&p!=='absolute'&&p!=='sticky';
}
function px(v){
  const n=parseFloat(v);
  return Number.isFinite(n)?n:0;
}
function directContent(screen){
  return [...screen.children].filter(el=>
    visible(el)&&!chrome(el)&&!['SCRIPT','STYLE','LINK','TEMPLATE'].includes(el.tagName)
  );
}
function maxFlowChildBottom(el){
  const er=el.getBoundingClientRect();
  let max=er.top;
  for(const c of el.children){
    if(!(c instanceof HTMLElement)||!visible(c)||!flowPosition(c))continue;
    const r=c.getBoundingClientRect();
    if(r.bottom>max)max=r.bottom;
  }
  return max;
}
function tightenMargins(prev,next){
  const pr=prev.getBoundingClientRect();
  const nr=next.getBoundingClientRect();
  const gap=nr.top-pr.bottom;
  if(gap<=MAX_GAP)return false;

  const ps=getComputedStyle(prev),ns=getComputedStyle(next);
  const mb=px(ps.marginBottom),mt=px(ns.marginTop);
  let changed=false;

  if(mb>24){
    prev.style.setProperty('margin-bottom',TIGHT+'px','important');
    prev.dataset.v657GapFix='margin-bottom';
    changed=true;
  }
  if(mt>24){
    next.style.setProperty('margin-top',TIGHT+'px','important');
    next.dataset.v657GapFix='margin-top';
    changed=true;
  }
  return changed;
}
function tightenInternalTail(prev,next,screen){
  if(!next)return false;
  const ps=getComputedStyle(prev),ss=getComputedStyle(screen);
  const pb=px(ps.paddingBottom),screenPb=px(ss.paddingBottom);
  if(pb<=PAD_TAIL_LIMIT||screenPb<55)return false;

  const pr=prev.getBoundingClientRect();
  const lastBottom=maxFlowChildBottom(prev);
  const tail=pr.bottom-lastBottom;
  if(tail<=40)return false;

  // La barra inferior ya tiene su reserva única en #screen.
  prev.style.setProperty('padding-bottom','12px','important');
  prev.dataset.v657GapFix=(prev.dataset.v657GapFix?prev.dataset.v657GapFix+',':'')+'padding-bottom';
  return true;
}
function audit(){
  if(!mobile())return;
  const screen=document.getElementById('screen');
  if(!screen)return;

  const blocks=directContent(screen);
  if(!blocks.length)return;

  for(let i=0;i<blocks.length-1;i++){
    const prev=blocks[i],next=blocks[i+1];
    if(!flowPosition(prev)||!flowPosition(next))continue;
    tightenMargins(prev,next);
    tightenInternalTail(prev,next,screen);
  }

  // El último bloque no debe volver a reservar 90–180px si #screen ya
  // reserva la altura de la navegación inferior.
  const last=blocks[blocks.length-1];
  if(last&&flowPosition(last)){
    const ls=getComputedStyle(last);
    if(px(ls.marginBottom)>32&&px(getComputedStyle(screen).paddingBottom)>=55){
      last.style.setProperty('margin-bottom','0px','important');
      last.dataset.v657GapFix=(last.dataset.v657GapFix?last.dataset.v657GapFix+',':'')+'last-margin';
    }
  }
}
function schedule(){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    requestAnimationFrame(()=>requestAnimationFrame(audit));
  },35);
}
function bind(){
  const screen=document.getElementById('screen');
  if(!screen)return;
  observer?.disconnect();
  observer=new MutationObserver(schedule);
  observer.observe(screen,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','hidden']});
  schedule();
  setTimeout(audit,250);
  setTimeout(audit,900);
}
window.addEventListener('hashchange',schedule);
window.addEventListener('resize',schedule);
window.addEventListener('load',bind,{once:true});
document.addEventListener('DOMContentLoaded',bind,{once:true});
document.addEventListener('ljr:official-data',schedule);
if(document.readyState!=='loading')bind();

window.LJR_GLOBAL_GAP_AUDIT={run:audit,schedule};
})();