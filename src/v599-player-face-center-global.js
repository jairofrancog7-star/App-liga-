/* V603 — MOTOR FACIAL DE CREDENCIALES EN TODA LA APP.
   Copia el método usado por v480-credential-red-exact.js:
   FaceDetector nativo -> MediaPipe BlazeFace -> fallback de retrato.
   Después aplica el mismo faceCrop() a cada foto circular de jugador.

   Objetivo: que se vea la CARA COMPLETA (cabello/frente, ojos, nariz,
   boca y mentón), aunque para lograrlo haya que alejar la fotografía. */
(function(){
'use strict';
if(window.__LJR_V603_CREDENTIAL_FACE_GLOBAL__)return;
window.__LJR_V603_CREDENTIAL_FACE_GLOBAL__=true;

const FACE_IMAGES=[
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
  '.v538-person.has-photo>img'
].join(',');

const profileCache=new Map();
const queued=new WeakSet();
const queue=[];
let running=false;
let mediaPipeFacePromise=null;

function imageSize(img){
  return {
    w:Number(img?.naturalWidth||img?.videoWidth||img?.width||1),
    h:Number(img?.naturalHeight||img?.videoHeight||img?.height||1)
  };
}
function detectorCanvas(img){
  const {w,h}=imageSize(img),maxSide=640,scale=Math.min(1,maxSide/Math.max(w,h));
  const cw=Math.max(1,Math.round(w*scale)),ch=Math.max(1,Math.round(h*scale));
  const cv=document.createElement('canvas');cv.width=cw;cv.height=ch;
  const q=cv.getContext('2d',{alpha:false});
  q.drawImage(img,0,0,cw,ch);
  return {cv,scaleX:w/cw,scaleY:h/ch};
}
function faceArea(b){
  return Math.max(0,Number(b?.width||0))*Math.max(0,Number(b?.height||0));
}
function pickFace(candidates,iw,ih){
  const list=(candidates||[]).filter(x=>x?.box&&faceArea(x.box)>64);
  if(!list.length)return null;
  const cx=iw/2,cy=ih*.42,diag=Math.hypot(iw,ih)||1;
  list.sort((a,b)=>{
    const acx=a.box.x+a.box.width/2,acy=a.box.y+a.box.height/2;
    const bcx=b.box.x+b.box.width/2,bcy=b.box.y+b.box.height/2;
    const ad=Math.hypot(acx-cx,acy-cy)/diag,bd=Math.hypot(bcx-cx,bcy-cy)/diag;
    const as=(a.score||.5)*1.4+(faceArea(a.box)/(iw*ih))*3-ad*.35;
    const bs=(b.score||.5)*1.4+(faceArea(b.box)/(iw*ih))*3-bd*.35;
    return bs-as;
  });
  return list[0];
}
function avgPoint(points){
  const p=(points||[]).filter(v=>Number.isFinite(v?.x)&&Number.isFinite(v?.y));
  if(!p.length)return null;
  return {
    x:p.reduce((s,v)=>s+v.x,0)/p.length,
    y:p.reduce((s,v)=>s+v.y,0)/p.length
  };
}
async function nativeFaceProfile(img){
  if(typeof window.FaceDetector!=='function')return null;
  try{
    const {w:iw,h:ih}=imageSize(img);
    const {cv,scaleX,scaleY}=detectorCanvas(img);
    const detector=new window.FaceDetector({fastMode:false,maxDetectedFaces:5});
    const faces=await detector.detect(cv);
    const profiles=(faces||[]).map(f=>{
      const z=f?.boundingBox;if(!z)return null;
      const box={
        x:z.x*scaleX,y:z.y*scaleY,
        width:z.width*scaleX,height:z.height*scaleY
      };
      const eyePts=[];
      for(const lm of (f.landmarks||[])){
        const type=String(lm?.type||'').toLowerCase();
        if(type.includes('eye')){
          for(const p of (lm.locations||[])){
            eyePts.push({x:p.x*scaleX,y:p.y*scaleY});
          }
        }
      }
      return {box,eyes:avgPoint(eyePts),score:1,source:'native'};
    });
    return pickFace(profiles,iw,ih);
  }catch(_){
    return null;
  }
}
async function mediaPipeFaceDetector(){
  if(mediaPipeFacePromise)return mediaPipeFacePromise;
  mediaPipeFacePromise=(async()=>{
    const mod=await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm');
    const vision=await mod.FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm'
    );
    return await mod.FaceDetector.createFromOptions(vision,{
      baseOptions:{
        modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite'
      },
      runningMode:'IMAGE',
      minDetectionConfidence:.35,
      minSuppressionThreshold:.30
    });
  })().catch(err=>{
    console.warn('[V603 global face detector]',err);
    return null;
  });
  return mediaPipeFacePromise;
}
async function mediaPipeFaceProfile(img){
  try{
    const detector=await mediaPipeFaceDetector();if(!detector)return null;
    const {w:iw,h:ih}=imageSize(img);
    const {cv,scaleX,scaleY}=detectorCanvas(img);
    const result=detector.detect(cv);
    const profiles=(result?.detections||[]).map(d=>{
      const z=d?.boundingBox;if(!z)return null;
      const box={
        x:Number(z.originX||0)*scaleX,
        y:Number(z.originY||0)*scaleY,
        width:Number(z.width||0)*scaleX,
        height:Number(z.height||0)*scaleY
      };
      const kp=(d.keypoints||[]).map(p=>({
        x:Number(p.x||0)*cv.width*scaleX,
        y:Number(p.y||0)*cv.height*scaleY
      }));
      const eyes=kp.length>=2?avgPoint([kp[0],kp[1]]):null;
      const score=Number(d.categories?.[0]?.score||d.score||.5);
      return {box,eyes,keypoints:kp,score,source:'mediapipe'};
    });
    return pickFace(profiles,iw,ih);
  }catch(err){
    console.warn('[V603 global face detection]',err);
    return null;
  }
}
function sourceKey(img){
  const {w,h}=imageSize(img);
  return String(img.currentSrc||img.src||'')+'|'+w+'x'+h;
}
async function playerFaceProfile(img){
  if(!img)return null;
  const key=sourceKey(img);
  if(profileCache.has(key))return await profileCache.get(key);
  const job=(async()=>{
    const native=await nativeFaceProfile(img);
    if(native?.eyes)return native;
    const mp=await mediaPipeFaceProfile(img);
    return mp||native||null;
  })();
  profileCache.set(key,job);
  return await job;
}

/* MISMA FUNCIÓN faceCrop DE CREDENCIALES.
   El margen 2.12 / 2.03 hace que la cara no llene todo el círculo y deja
   espacio para cabello/frente y para que boca/mentón no queden cortados. */
function faceCrop(img,destW,destH,profile){
  const {w:iw,h:ih}=imageSize(img),aspect=destW/destH||1;
  let sw,sh,sx,sy;

  if(profile?.box&&profile.box.width>8&&profile.box.height>8){
    const b=profile.box;
    const side=Math.max(b.width*2.12,b.height*2.03);
    sw=Math.min(iw,side);
    sh=sw/aspect;
    if(sh>ih){sh=ih;sw=sh*aspect}
    if(sw>iw){sw=iw;sh=sw/aspect}

    const anchorX=profile.eyes?.x ?? (b.x+b.width*.50);
    const anchorY=profile.eyes?.y ?? (b.y+b.height*.39);

    sx=anchorX-sw*.50;
    sy=anchorY-sh*.40;

    const desiredTop=b.y-b.height*.34;
    if(sy>desiredTop)sy=desiredTop;
  }else{
    if(iw/ih>aspect){
      sh=ih;sw=sh*aspect;sx=(iw-sw)/2;sy=0;
    }else{
      sw=iw;sh=sw/aspect;sx=0;
      const spare=Math.max(0,ih-sh);
      sy=spare*(ih>iw*1.08?.15:.45);
    }
  }

  sx=Math.max(0,Math.min(Math.max(0,iw-sw),Number.isFinite(sx)?sx:0));
  sy=Math.max(0,Math.min(Math.max(0,ih-sh),Number.isFinite(sy)?sy:0));
  return {sx,sy,sw,sh};
}

function frameElement(img){
  return img?.parentElement||null;
}
function frameSize(img){
  const p=frameElement(img);
  const r=p?.getBoundingClientRect?.();
  const w=Math.max(1,Number(r?.width)||Number(p?.clientWidth)||1);
  const h=Math.max(1,Number(r?.height)||Number(p?.clientHeight)||w);
  return {w,h};
}
function applyCrop(img,profile){
  if(!(img instanceof HTMLImageElement)||!img.matches(FACE_IMAGES))return;
  const parent=frameElement(img);if(!parent)return;

  if(parent.classList.contains('v12-avatar'))parent.classList.add('v576-face-photo');

  const {w:dw,h:dh}=frameSize(img);
  const c=faceCrop(img,dw,dh,profile);
  const {w:iw,h:ih}=imageSize(img);
  if(!(c.sw>0&&c.sh>0&&iw>0&&ih>0))return;

  /* Emula ctx.drawImage(img,sx,sy,sw,sh,0,0,dw,dh) con CSS.
     Así el resultado visual es el mismo que en la credencial. */
  const widthPct=(iw/c.sw)*100;
  const heightPct=(ih/c.sh)*100;
  const leftPct=-(c.sx/c.sw)*100;
  const topPct=-(c.sy/c.sh)*100;

  img.dataset.ljrCredentialFaceCrop='1';
  img.dataset.ljrFaceDetector=profile?.source||'fallback';
  img.style.setProperty('--ljr-face-width',widthPct.toFixed(4)+'%');
  img.style.setProperty('--ljr-face-height',heightPct.toFixed(4)+'%');
  img.style.setProperty('--ljr-face-left',leftPct.toFixed(4)+'%');
  img.style.setProperty('--ljr-face-top',topPct.toFixed(4)+'%');
}
async function process(img){
  if(!(img instanceof HTMLImageElement)||!img.matches(FACE_IMAGES))return;
  if(!img.complete||!img.naturalWidth||!img.naturalHeight){
    if(img.dataset.ljrV603Load!=='1'){
      img.dataset.ljrV603Load='1';
      img.addEventListener('load',()=>enqueue(img),{once:true});
    }
    return;
  }

  /* Igual que la credencial: foto visible de inmediato con fallback. */
  applyCrop(img,null);

  /* Después detector real; cuando termina, recoloca automáticamente la cara. */
  const profile=await playerFaceProfile(img);
  if(profile)applyCrop(img,profile);
}
function enqueue(img){
  if(!(img instanceof HTMLImageElement)||!img.matches(FACE_IMAGES)||queued.has(img))return;
  queued.add(img);queue.push(img);pump();
}
async function pump(){
  if(running)return;
  running=true;
  while(queue.length){
    const img=queue.shift();
    queued.delete(img);
    try{await process(img)}catch(err){console.warn('[V603 face crop]',err)}
    await new Promise(r=>setTimeout(r,0));
  }
  running=false;
}
function scan(root=document){
  if(root instanceof HTMLImageElement)enqueue(root);
  root.querySelectorAll?.(FACE_IMAGES).forEach(enqueue);
}
let scanTimer=0;
function schedule(root=document){
  clearTimeout(scanTimer);
  scanTimer=setTimeout(()=>scan(root),45);
}

document.addEventListener('DOMContentLoaded',()=>scan(document),{once:true});
window.addEventListener('load',()=>scan(document));
window.addEventListener('hashchange',()=>schedule(document));
window.addEventListener('ljr:official-data',()=>schedule(document));

const host=document.querySelector('#screen')||document.documentElement;
new MutationObserver(mutations=>{
  for(const m of mutations){
    if(m.type==='attributes'&&m.target instanceof HTMLImageElement){
      enqueue(m.target);continue;
    }
    m.addedNodes.forEach(n=>{
      if(n instanceof HTMLImageElement)enqueue(n);
      else if(n instanceof Element)schedule(n);
    });
  }
}).observe(host,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});

scan(document);
setTimeout(()=>scan(document),500);
setTimeout(()=>scan(document),1800);

window.LJR_FACE_FRAME={
  engine:'credential-v494-v495',
  scan:()=>scan(document),
  faceCrop,
  profile:playerFaceProfile,
  reset(){
    profileCache.clear();
    document.querySelectorAll(FACE_IMAGES).forEach(img=>{
      delete img.dataset.ljrCredentialFaceCrop;
      enqueue(img);
    });
  }
};
})();
