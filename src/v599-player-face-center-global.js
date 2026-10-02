/* V602 — AUTOENCUADRE INTELIGENTE DE CARAS
   1) En círculos/miniaturas: siempre muestra la foto completa (contain).
   2) Usa la misma foto como fondo de relleno para que no aparezcan barras.
   3) En fotos grandes, FaceDetector (si existe) centra el rostro y decide
      cuándo debe alejarse para no cortar frente/mentón.
   4) Sin FaceDetector usa un modo conservador que prioriza rostro completo. */
(function(){
'use strict';
if(window.__LJR_V602_FACE_FULL_FRAME__)return;
window.__LJR_V602_FACE_FULL_FRAME__=true;

const MINI_SELECTORS=[
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
  '.v538-person.has-photo>img'
].join(',');

const LARGE_SELECTORS=[
  '.v576-inline-player-photo',
  '.v576-hero-player-photo',
  '.v576-scorer-hero-photo',
  '.v576-v28-feature-photo',
  'body.v379-player-profile-active .v379-player-photo'
].join(',');

const ALL=MINI_SELECTORS+','+LARGE_SELECTORS;
const cache=new Map();
let detector=null;
try{
  if('FaceDetector' in window)detector=new FaceDetector({fastMode:true,maxDetectedFaces:3});
}catch(_){detector=null}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const cssUrl=src=>'url("'+String(src||'').replace(/["\\]/g,'\\$&')+'")';

function markMini(img){
  const parent=img.parentElement;
  if(!parent)return;
  if(parent.classList.contains('v12-avatar'))parent.classList.add('v576-face-photo');
  const src=img.currentSrc||img.src||'';
  if(src)parent.style.setProperty('--ljr-face-bg',cssUrl(src));
  parent.dataset.ljrFaceContainer='1';
  img.dataset.ljrFaceFit='contain';
  img.style.setProperty('--ljr-face-fit','contain');
  img.style.setProperty('--ljr-face-x','50%');
  img.style.setProperty('--ljr-face-y','50%');
}

function fallbackLarge(img){
  const w=Number(img.naturalWidth)||1,h=Number(img.naturalHeight)||1;
  const ratio=h/w;
  /* Retratos altos: alejarlos. Cuadrados/horizontales: cover moderado. */
  if(ratio>=1.35)return {fit:'contain',x:50,y:50};
  if(ratio<=0.70)return {fit:'contain',x:50,y:50};
  return {fit:'cover',x:50,y:44};
}

function largestFace(faces){
  let best=null,area=-1;
  for(const f of (faces||[])){
    const b=f&&f.boundingBox;
    if(!b)continue;
    const a=(Number(b.width)||0)*(Number(b.height)||0);
    if(a>area){area=a;best=b}
  }
  return best;
}

function frameFromFace(img,b){
  const w=img.naturalWidth,h=img.naturalHeight;
  const bw=Number(b.width)||0,bh=Number(b.height)||0;
  const bx=Number(b.x)||0,by=Number(b.y)||0;
  if(!bw||!bh)return fallbackLarge(img);

  const cx=bx+bw/2,cy=by+bh/2;
  const faceShare=Math.max(bw/w,bh/h);

  /* Si la cara ocupa demasiado o está cerca de un borde, aleja la imagen. */
  const marginX=Math.min(bx,w-(bx+bw))/w;
  const marginY=Math.min(by,h-(by+bh))/h;
  if(faceShare>=0.58 || marginX<0.045 || marginY<0.045){
    return {fit:'contain',x:50,y:50};
  }

  let x=50,y=50;
  if(w>h){
    const movable=w-h;
    if(movable>1)x=clamp(((cx-h/2)/movable)*100,0,100);
  }else if(h>w){
    const movable=h-w;
    if(movable>1)y=clamp(((cy-w/2)/movable)*100,0,100);
  }
  return {fit:'cover',x,y};
}

function applyLarge(img,frame){
  const fit=frame.fit==='contain'?'contain':'cover';
  img.dataset.ljrFaceFit=fit;
  img.style.setProperty('--ljr-face-fit',fit);
  img.style.setProperty('--ljr-face-x',(Number(frame.x)||50).toFixed(2)+'%');
  img.style.setProperty('--ljr-face-y',(Number(frame.y)||44).toFixed(2)+'%');
  const src=img.currentSrc||img.src||'';
  if(src)img.style.setProperty('--ljr-face-bg',cssUrl(src));
}

async function process(img){
  if(!(img instanceof HTMLImageElement)||!img.matches(ALL))return;
  if(!img.complete||!img.naturalWidth||!img.naturalHeight){
    if(img.dataset.ljrFaceLoadBound!=='1'){
      img.dataset.ljrFaceLoadBound='1';
      img.addEventListener('load',()=>process(img),{once:true});
    }
    return;
  }

  if(img.matches(MINI_SELECTORS)){
    markMini(img);
    return;
  }

  const key=(img.currentSrc||img.src||'')+'|'+img.naturalWidth+'x'+img.naturalHeight;
  if(cache.has(key)){applyLarge(img,cache.get(key));return}

  let frame=fallbackLarge(img);
  if(detector){
    try{
      const faces=await detector.detect(img);
      const face=largestFace(faces);
      if(face)frame=frameFromFace(img,face);
    }catch(_){}
  }
  cache.set(key,frame);
  applyLarge(img,frame);
}

function dedupeScorerRows(root=document){
  const scope=(root instanceof Element||root instanceof Document)?root:document;
  scope.querySelectorAll?.('.v391-rank-copy,.v462-rank-copy,.v194-player-name,.v28-rank-copy').forEach(copy=>{
    copy.querySelectorAll(':scope > img').forEach(img=>img.remove());
    copy.classList.remove('v576-has-inline-photo');
    copy.style.removeProperty('padding-left');
    copy.style.removeProperty('min-height');
  });
  scope.querySelectorAll?.('.v391-rank-row,.v462-rank-row,.v194-player-row').forEach(row=>{
    const avatars=[...row.querySelectorAll(':scope > .v576-player-avatar')];
    avatars.slice(1).forEach(el=>el.remove());
  });
}

function scan(root=document){
  dedupeScorerRows(root);
  if(root instanceof HTMLImageElement)process(root);
  root.querySelectorAll?.(ALL).forEach(process);
}
let timer=0;
function schedule(root=document){
  clearTimeout(timer);
  timer=setTimeout(()=>scan(root),35);
}

document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});
window.addEventListener('load',()=>scan(document));
window.addEventListener('hashchange',()=>schedule(document));
window.addEventListener('ljr:official-data',()=>schedule(document));

const host=document.querySelector('#screen')||document.documentElement;
new MutationObserver(mutations=>{
  for(const m of mutations){
    if(m.type==='attributes'&&m.target instanceof HTMLImageElement){process(m.target);continue}
    m.addedNodes.forEach(n=>{
      if(n instanceof HTMLImageElement)process(n);
      else if(n instanceof Element)schedule(n);
    });
  }
}).observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});

scan(document);
setTimeout(()=>scan(document),450);
setTimeout(()=>scan(document),1500);

window.LJR_FACE_FRAME={
  scan:()=>scan(document),
  reset(){cache.clear();scan(document)}
};
})();
