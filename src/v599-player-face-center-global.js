/* V600 — AUTOENCUADRE DE ROSTRO COMPLETO
   Centra la cara y decide automáticamente si debe acercar o alejar la foto.
   Usa FaceDetector cuando el navegador lo ofrece; si no, aplica un encuadre
   conservador por proporción de la imagen para evitar frente/mentón cortados. */
(function(){
'use strict';
if(window.__LJR_V600_PLAYER_FACE_AUTOFRAME__)return;
window.__LJR_V600_PLAYER_FACE_AUTOFRAME__=true;

const SELECTORS=[
  '.v576-player-photo',
  '.v576-player-avatar>img',
  '.v66-player-avatar>img',
  '.v42-avatar>img',
  '.v419-player-avatar>img',
  '.v446-stat-ref-avatar>img',
  '.v414-avatar>img',
  '.v123-avatar>img',
  '.v123-option-avatar>img',
  '.v379-related-avatar>img',
  '.v576-table-photo>img',
  '.v124-avatar>img',
  '.v562-avatar>img',
  '.v12-avatar>img',
  '.v33-player-team-logo.v576-player-avatar>img',
  '.v416-pitch-player i.v576-pitch-photo>img',
  '.v417-bench-player i.v576-bench-photo>img',
  '.v419-mini-pitch i.v576-mini-photo>img',
  '.v538-person.has-photo>img',
  '.v576-inline-player-photo',
  '.v576-hero-player-photo',
  '.v576-scorer-hero-photo',
  '.v576-v28-feature-photo',
  'body.v379-player-profile-active .v379-player-photo'
].join(',');

const cache=new Map();
const queue=[];
const queued=new WeakSet();
let running=false;
let detector=null;
try{
  if('FaceDetector' in window)detector=new FaceDetector({fastMode:true,maxDetectedFaces:3});
}catch(_){detector=null}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const srcKey=img=>String(img.currentSrc||img.src||'')+'|'+(img.naturalWidth||0)+'x'+(img.naturalHeight||0);

function isPersonImage(img){
  return img instanceof HTMLImageElement && img.matches(SELECTORS);
}
function markParent(img){
  const p=img.closest('.v12-avatar');
  if(p)p.classList.add('v576-face-photo');
}
function setFrame(img,frame){
  if(!isPersonImage(img)||!frame)return;
  markParent(img);
  const x=clamp(Number(frame.x)||50,0,100);
  const y=clamp(Number(frame.y)||44,0,100);
  const zoom=clamp(Number(frame.zoom)||1,1,1.30);
  const fit=frame.fit==='contain'?'contain':'cover';
  img.style.setProperty('--ljr-face-x',x.toFixed(2)+'%');
  img.style.setProperty('--ljr-face-y',y.toFixed(2)+'%');
  img.style.setProperty('--ljr-face-fit',fit);
  img.style.setProperty('--ljr-face-zoom',String(zoom.toFixed(3)));
  img.dataset.ljrFaceFit=fit;
  img.dataset.ljrFaceFramed='1';
}
function fallbackFrame(img){
  const w=Number(img.naturalWidth)||1,h=Number(img.naturalHeight)||1;
  const ratio=h/w;

  /* Retratos muy verticales se alejan: mejor ver la cabeza completa que cortar cara. */
  if(ratio>=1.90)return {x:50,y:50,fit:'contain',zoom:1};
  if(ratio>=1.62)return {x:50,y:34,fit:'cover',zoom:1};
  if(ratio>=1.38)return {x:50,y:38,fit:'cover',zoom:1};
  if(ratio>=1.16)return {x:50,y:43,fit:'cover',zoom:1};
  if(ratio<=0.72)return {x:50,y:50,fit:'contain',zoom:1};
  return {x:50,y:50,fit:'cover',zoom:1};
}
function boxOf(face){
  const b=face&&face.boundingBox;
  if(!b)return null;
  return {x:Number(b.x)||0,y:Number(b.y)||0,w:Number(b.width)||0,h:Number(b.height)||0};
}
function largestFace(faces){
  let best=null,area=-1;
  for(const f of (faces||[])){
    const b=boxOf(f);if(!b||!b.w||!b.h)continue;
    const a=b.w*b.h;if(a>area){area=a;best=b}
  }
  return best;
}
function frameFromFace(img,b){
  const w=img.naturalWidth,h=img.naturalHeight;
  const cx=b.x+b.w/2,cy=b.y+b.h/2;
  const side=Math.min(w,h);

  /* Margen suficiente alrededor de frente, orejas y mentón. */
  const need=Math.max(b.w*1.34,b.h*1.46);
  if(need>side){
    return {x:50,y:50,fit:'contain',zoom:1};
  }

  let x=50,y=50;
  if(h>w && h>w+1){
    y=clamp(((cy-w/2)/(h-w))*100,0,100);
  }else if(w>h && w>h+1){
    x=clamp(((cx-h/2)/(w-h))*100,0,100);
  }

  /* Si la cara está pequeña, acerca solo hasta donde siga cabiendo COMPLETA. */
  const occ=Math.max(b.w,b.h)/side;
  const desired=occ>0 ? 0.48/occ : 1;
  const safe=side/need;
  const zoom=clamp(Math.min(desired,safe,1.30),1,1.30);

  return {x,y,fit:'cover',zoom};
}
async function detectFrame(img){
  const key=srcKey(img);
  if(cache.has(key))return cache.get(key);

  let frame=fallbackFrame(img);
  if(detector){
    try{
      const faces=await detector.detect(img);
      const b=largestFace(faces);
      if(b)frame=frameFromFace(img,b);
    }catch(_){}
  }
  cache.set(key,frame);
  return frame;
}
async function processOne(img){
  if(!isPersonImage(img))return;
  if(!img.complete||!img.naturalWidth||!img.naturalHeight){
    if(img.dataset.ljrFaceLoadBound!=='1'){
      img.dataset.ljrFaceLoadBound='1';
      img.addEventListener('load',()=>enqueue(img),{once:true});
    }
    return;
  }

  /* Aplica primero un encuadre seguro instantáneo. */
  setFrame(img,fallbackFrame(img));

  /* Después mejora con detección facial cuando esté disponible. */
  const frame=await detectFrame(img);
  setFrame(img,frame);
}
function enqueue(img){
  if(!isPersonImage(img)||queued.has(img))return;
  queued.add(img);queue.push(img);
  pump();
}
async function pump(){
  if(running)return;
  running=true;
  while(queue.length){
    const img=queue.shift();
    queued.delete(img);
    await processOne(img);
    await new Promise(r=>setTimeout(r,0));
  }
  running=false;
}
function scan(root=document){
  if(root instanceof HTMLImageElement)enqueue(root);
  root.querySelectorAll?.(SELECTORS).forEach(enqueue);
}
function schedule(root=document){
  if('requestIdleCallback' in window)requestIdleCallback(()=>scan(root),{timeout:180});
  else setTimeout(()=>scan(root),40);
}

document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});
window.addEventListener('load',()=>scan(document));
window.addEventListener('hashchange',()=>schedule(document));
window.addEventListener('ljr:official-data',()=>schedule(document));

const host=document.querySelector('#screen')||document.documentElement;
new MutationObserver(mutations=>{
  for(const m of mutations){
    if(m.type==='attributes'&&m.target instanceof HTMLImageElement){enqueue(m.target);continue}
    m.addedNodes.forEach(n=>{
      if(n instanceof HTMLImageElement)enqueue(n);
      else if(n instanceof Element)schedule(n);
    });
  }
}).observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});

scan(document);
setTimeout(()=>scan(document),500);
setTimeout(()=>scan(document),1600);

window.LJR_FACE_FRAME={
  scan:()=>scan(document),
  reset(){
    cache.clear();
    document.querySelectorAll(SELECTORS).forEach(img=>{
      delete img.dataset.ljrFaceFramed;
      enqueue(img);
    });
  }
};
})();
