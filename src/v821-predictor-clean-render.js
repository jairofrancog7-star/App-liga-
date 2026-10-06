/* V821 — Pronostica Seis: render limpio del master sin barras horneadas.
   Recorta la barra de estado superior y la barra inferior directamente
   desde la imagen fuente y dibuja el resto sin deformar la proporción. */
(()=>{
'use strict';
let observer=null, resizeObserver=null, mounted=null;

function route(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
}
function stop(){
  try{resizeObserver?.disconnect?.()}catch(_){}
  resizeObserver=null;
  if(mounted?.canvas?.isConnected) mounted.canvas.remove();
  if(mounted?.img){
    mounted.img.style.removeProperty('display');
    mounted.img.removeAttribute('data-v821-hidden');
  }
  mounted=null;
}
function draw(state){
  const {canvas,img,host}=state;
  if(!canvas||!img||!host||!img.naturalWidth||!img.naturalHeight)return;
  const rect=host.getBoundingClientRect();
  const cssW=Math.max(1,Math.round(rect.width));
  const cssH=Math.max(1,Math.round(rect.height));
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const outW=Math.max(2,Math.round(cssW*dpr));
  const outH=Math.max(2,Math.round(cssH*dpr));
  if(canvas.width!==outW)canvas.width=outW;
  if(canvas.height!==outH)canvas.height=outH;

  const ctx=canvas.getContext('2d',{alpha:false});
  ctx.setTransform(1,0,0,1,0,0);
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.fillStyle='#01034f';
  ctx.fillRect(0,0,outW,outH);

  const nw=img.naturalWidth, nh=img.naturalHeight;
  const topCrop=Math.round(nh*0.068);
  const bottomCrop=Math.round(nh*0.064);
  const sx=0, sy=topCrop, sw=nw, sh=Math.max(1,nh-topCrop-bottomCrop);

  // COVER proporcional: llena el espacio sin deformar.
  const scale=Math.max(outW/sw,outH/sh);
  const dw=sw*scale, dh=sh*scale;
  const dx=(outW-dw)/2;
  const dy=(outH-dh)/2;
  ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
}
function mount(){
  if(route()!=='predictor'){stop();return}
  const host=document.querySelector('.v37-predictor-reference');
  const img=host?.querySelector('.v37-predictor-reference-image');
  if(!host||!img)return;

  if(mounted?.host===host&&mounted?.img===img){
    if(img.complete&&img.naturalWidth)draw(mounted);
    return;
  }
  stop();

  const canvas=document.createElement('canvas');
  canvas.className='v821-predictor-clean-canvas';
  canvas.setAttribute('aria-hidden','true');
  host.prepend(canvas);
  img.dataset.v821Hidden='1';
  img.style.setProperty('display','none','important');

  const state={host,img,canvas};
  mounted=state;
  const ready=()=>{ if(mounted===state) draw(state) };
  if(img.complete&&img.naturalWidth)ready();
  else img.addEventListener('load',ready,{once:true});

  resizeObserver=new ResizeObserver(ready);
  resizeObserver.observe(host);
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(mount))}
addEventListener('hashchange',schedule);
addEventListener('resize',schedule,{passive:true});
document.addEventListener('DOMContentLoaded',schedule,{once:true});
if(document.readyState!=='loading')schedule();

observer=new MutationObserver(()=>{if(route()==='predictor')schedule()});
observer.observe(document.documentElement,{childList:true,subtree:true});
})();