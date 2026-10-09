/* Fotos de jugadores: rostro completo en avatares y tarjetas destacadas.
   Reutiliza el detector existente y conserva la fotografía original. */
(function(){
'use strict';
if(window.__LJR_V608_CIRCLE_FULL_FACE_HARDLOCK__)return;
window.__LJR_V608_CIRCLE_FULL_FACE_HARDLOCK__=true;

const HERO_IMAGES='.v576-scorer-hero-photo,.v576-hero-player-photo,.v971-hero-image';
const FACE_IMAGES=[
  HERO_IMAGES,
  '.v971-official-image',
  '.v971-menu-photo',
  '.v971-history-person>img',
  '.v576-player-photo',
  '.v576-pitch-photo>img',
  '.v576-bench-photo>img',
  '.v576-mini-photo>img',
  '.v576-player-avatar>img',
  '.v66-player-avatar>img',
  '.v42-avatar>img',
  '.v419-player-avatar>img',
  '.v446-stat-ref-avatar>img',
  '.v414-avatar>img',
  '.v123-avatar>img',
  '.v123-option-avatar>img',
  '.v576-table-photo>img',
  '.v124-avatar>img',
  '.v562-avatar>img',
  '.v562-avatar.photo>img',
  '.v42-avatar.v562-team-photo>img',
  '.v12-avatar>img',
  '.v33-player-team-logo.v576-player-avatar>img',
  '.v538-person.has-photo>img',
  '.v371-player-avatar>img',
  '.v371-preview-avatar>img',
  '.v371-scorer-avatar>img',
  '.v413-player-avatar>img',
  '.v414-player-photo>img',
  '.v444-player-avatar>img',
  '.v379-related-avatar>img'
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
    console.warn('[V608 circle face detector]',err);
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
    console.warn('[V608 circle face detection]',err);
    return null;
  }
}
function sourceKey(img){
  const {w,h}=imageSize(img);
  return String(img.currentSrc||img.src||'')+'|'+w+'x'+h;
}
async function playerFaceProfile(img){
  const key=sourceKey(img);if(profileCache.has(key))return await profileCache.get(key);
  const job=(async()=>{
    let probe=img;
    try{const url=new URL(img.currentSrc||img.src,location.href);if(url.origin!==location.origin){probe=new Image();probe.crossOrigin='anonymous';probe.src=url.href;await probe.decode()}}catch{return null}
    const native=await nativeFaceProfile(probe);if(native)return native;
    return await mediaPipeFaceProfile(probe);
  })().catch(()=>null);profileCache.set(key,job);return await job;
}

/* MISMA FUNCIÓN faceCrop DE CREDENCIALES.
   El margen 2.12 / 2.03 hace que la cara no llene todo el círculo y deja
   espacio para cabello/frente y para que boca/mentón no queden cortados. */
function faceCrop(img,destW,destH,profile){
  const {w:iw,h:ih}=imageSize(img),aspect=destW/destH||1;
  let sw,sh,sx,sy;

  if(profile?.box&&profile.box.width>8&&profile.box.height>8){
    const b=profile.box;

    /* V607: más alejado que la credencial.
       En un círculo las esquinas de la foto quedan ocultas, por eso damos
       bastante más aire alrededor del detector facial. Así caben cabello,
       frente, orejas, boca y mentón completos. */
    const side=Math.max(b.width*2.85,b.height*2.70);
    sw=Math.min(iw,side);
    sh=sw/aspect;
    if(sh>ih){sh=ih;sw=sh*aspect}
    if(sw>iw){sw=iw;sh=sw/aspect}

    const anchorX=profile.eyes?.x ?? (b.x+b.width*.50);
    const anchorY=profile.eyes?.y ?? (b.y+b.height*.38);

    /* Ojos aproximadamente al 38% de la altura: deja más espacio abajo
       que antes para que nunca desaparezcan boca o mentón. */
    sx=anchorX-sw*.50;
    sy=anchorY-sh*.38;

    /* Seguridad de cabeza completa: obliga a incluir margen por encima del
       detector y también bastante margen por debajo del mentón. */
    const wantedLeft=b.x-b.width*.55;
    const wantedRight=b.x+b.width*1.55;
    const wantedTop=b.y-b.height*.62;
    const wantedBottom=b.y+b.height*1.48;

    const minSx=wantedRight-sw;
    const maxSx=wantedLeft;
    if(minSx<=maxSx)sx=Math.max(minSx,Math.min(maxSx,sx));

    const minSy=wantedBottom-sh;
    const maxSy=wantedTop;
    if(minSy<=maxSy)sy=Math.max(minSy,Math.min(maxSy,sy));
  }else{
    /* Sin detector NO hacemos un recorte agresivo. Este bloque solo queda
       como respaldo matemático; la vista V607 usa object-fit:contain hasta
       que exista una detección facial real. */
    if(iw/ih>aspect){
      sh=ih;sw=sh*aspect;sx=(iw-sw)/2;sy=0;
    }else{
      sw=iw;sh=sw/aspect;sx=0;
      sy=Math.max(0,(ih-sh)/2);
    }
  }

  sx=Math.max(0,Math.min(Math.max(0,iw-sw),Number.isFinite(sx)?sx:0));
  sy=Math.max(0,Math.min(Math.max(0,ih-sh),Number.isFinite(sy)?sy:0));
  return {sx,sy,sw,sh};
}

function radiusPx(value,size){
  const v=String(value||'').trim();
  if(!v)return 0;
  if(v.includes('%'))return (parseFloat(v)||0)*size/100;
  return parseFloat(v)||0;
}
function visualCircleFrame(img){
  const p=img?.parentElement;
  if(!p)return null;
  const pr=p.getBoundingClientRect?.();
  const ir=img.getBoundingClientRect?.();
  const pw=Number(pr?.width)||0,ph=Number(pr?.height)||0;
  const iw=Number(ir?.width)||0,ih=Number(ir?.height)||0;
  if(pw<8||ph<8)return null;

  const ratio=pw/ph;
  if(ratio<.94||ratio>1.06)return false;

  const pcs=getComputedStyle(p);
  const min=Math.min(pw,ph);
  const radii=[
    radiusPx(pcs.borderTopLeftRadius,min),
    radiusPx(pcs.borderTopRightRadius,min),
    radiusPx(pcs.borderBottomRightRadius,min),
    radiusPx(pcs.borderBottomLeftRadius,min)
  ];
  const clip=String(pcs.clipPath||pcs.webkitClipPath||'');
  const parentCircle=clip.includes('circle(')||Math.min(...radii)>=min*.47;

  let imageCircle=false;
  if(iw>=8&&ih>=8&&Math.abs(iw/ih-1)<=.06){
    const ics=getComputedStyle(img);
    const imin=Math.min(iw,ih);
    const irads=[
      radiusPx(ics.borderTopLeftRadius,imin),
      radiusPx(ics.borderTopRightRadius,imin),
      radiusPx(ics.borderBottomRightRadius,imin),
      radiusPx(ics.borderBottomLeftRadius,imin)
    ];
    const iclip=String(ics.clipPath||ics.webkitClipPath||'');
    imageCircle=iclip.includes('circle(')||Math.min(...irads)>=imin*.47;
  }
  return parentCircle||imageCircle;
}

function prepareCircleFallback(img){
  const p=img?.parentElement;
  if(!p)return false;
  p.classList.add('ljr-face-circle-v606');
  const src=img.currentSrc||img.src||'';
  p.style.removeProperty('--ljr-circle-face-bg');p.style.setProperty('background-image','none','important');

  /* Show the complete original first; a detected face can be centred later. */
  delete img.dataset.ljrCredentialFaceCrop;
  delete img.dataset.ljrFaceDetector;
  img.dataset.ljrCircleFullFace='1';

  for(const prop of ['--ljr-face-width','--ljr-face-height','--ljr-face-left','--ljr-face-top']){
    img.style.removeProperty(prop);
  }
  const important={
    'position':'relative',
    'left':'auto','right':'auto','top':'auto','bottom':'auto',
    'width':'100%','height':'100%',
    'min-width':'0','min-height':'0','max-width':'100%','max-height':'100%',
    'margin':'0','padding':'0','display':'block',
    'object-fit':'contain','object-position':'center center',
    'transform':'none','clip-path':'none',
    'border-radius':'inherit','box-sizing':'border-box'
  };
  for(const [k,v] of Object.entries(important))img.style.setProperty(k,v,'important');
  return true;
}
function clearFaceCrop(img){
  if(!(img instanceof HTMLImageElement))return;
  const p=img.parentElement;
  p?.classList.remove('ljr-face-circle-v606');
  p?.style.removeProperty('--ljr-circle-face-bg');
  delete img.dataset.ljrCredentialFaceCrop;
  delete img.dataset.ljrFaceDetector;
  delete img.dataset.ljrCircleFullFace;
  for(const prop of [
    '--ljr-face-width','--ljr-face-height','--ljr-face-left','--ljr-face-top',
    'position','left','right','top','bottom','width','height','min-width','min-height',
    'max-width','max-height','margin','padding','display','object-fit','object-position',
    'transform','clip-path','border-radius','box-sizing'
  ]){
    img.style.removeProperty(prop);
  }
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
  if(!(img instanceof HTMLImageElement)||!img.matches(FACE_IMAGES)||visualCircleFrame(img)!==true||!profile?.box)return false;
  const b=profile.box,{w:iw,h:ih}=imageSize(img),side=Math.max(b.width*3.40,b.height*3.25);
  if(!(side>16&&iw>0&&ih>0))return false;
  // A virtual frame may extend beyond the photo: keep the whole head centred,
  // using empty background rather than clamping the crop to the photo edge.
  const sx=b.x+b.width/2-side/2,sy=b.y+b.height*.48-side/2;
  const parent=img.parentElement;parent.style.setProperty('position','relative','important');parent.style.setProperty('overflow','hidden','important');parent.style.setProperty('background-image','none','important');
  const styles={position:'absolute',width:(iw/side*100)+'%',height:(ih/side*100)+'%',left:(-sx/side*100)+'%',top:(-sy/side*100)+'%',right:'auto',bottom:'auto','max-width':'none','max-height':'none','object-fit':'fill','object-position':'center','transform':'none','border-radius':'0'};
  for(const [property,value]of Object.entries(styles))img.style.setProperty(property,value,'important');
  img.dataset.ljrCredentialFaceCrop='1';img.dataset.ljrFaceDetector=profile.source||'native';return true;
}

// A virtual crop can extend beyond the source edges. This keeps the whole
// head in frame even in a portrait selfie placed inside a landscape card.
function heroCrop(img,destW,destH,profile){
  const b=profile?.box;
  if(!b||!(b.width>8&&b.height>8))return null;
  const aspect=Math.max(1,destW)/Math.max(1,destH);
  const sh=Math.max(b.height*1.85,b.width*1.85/aspect);
  const sw=sh*aspect;
  return {sx:b.x+b.width*.5-sw*.5,sy:b.y+b.height*.45-sh*.5,sw,sh};
}
function prepareHeroFallback(img){
  delete img.dataset.ljrHeroFaceCrop;
  const styles={position:'absolute',inset:'0',width:'100%',height:'100%',
    'min-width':'0','min-height':'0','max-width':'100%','max-height':'100%',
    margin:'0',padding:'0','object-fit':'contain','object-position':'center',
    transform:'none','border-radius':'0'};
  for(const [k,v]of Object.entries(styles))img.style.setProperty(k,v,'important');
}
function applyHeroCrop(img,profile){
  const frame=frameSize(img),crop=heroCrop(img,frame.w,frame.h,profile);
  if(!crop)return false;
  const {w:iw,h:ih}=imageSize(img),{sx,sy,sw,sh}=crop;
  const styles={position:'absolute',inset:'auto',
    width:(iw/sw*100)+'%',height:(ih/sh*100)+'%',
    left:(-sx/sw*100)+'%',top:(-sy/sh*100)+'%',right:'auto',bottom:'auto',
    'min-width':'0','min-height':'0','max-width':'none','max-height':'none',
    'object-fit':'fill','object-position':'center',transform:'none'};
  for(const [k,v]of Object.entries(styles))img.style.setProperty(k,v,'important');
  img.dataset.ljrHeroFaceCrop='1';
  return true;
}
async function processHero(img){
  const frame=frameSize(img),key=sourceKey(img)+'|'+frame.w+'x'+frame.h;
  if(img.dataset.ljrHeroFaceKey===key)return;
  prepareHeroFallback(img);
  if(!img.complete||!img.naturalWidth||!img.naturalHeight){
    if(img.dataset.ljrV606Load!=='1'){
      img.dataset.ljrV606Load='1';
      img.addEventListener('load',()=>{delete img.dataset.ljrV606Load;enqueue(img)},{once:true});
    }
    return;
  }
  img.dataset.ljrHeroFaceKey=key;
  const original=sourceKey(img),profile=await playerFaceProfile(img);
  if(img.isConnected&&sourceKey(img)===original&&profile)applyHeroCrop(img,profile);
}

async function process(img){
  if(!(img instanceof HTMLImageElement)||!img.matches(FACE_IMAGES))return;
  if(img.matches(HERO_IMAGES)){await processHero(img);return}
  /* V652: las fotos rectangulares del registro público deben mostrarse completas.
     No ejecutar ningún recorte facial automático sobre ellas. */
  if(img.closest('.v562-avatar.photo,.v42-avatar.v562-team-photo')){
    clearFaceCrop(img);
    const styles={
      'position':'static','inset':'auto','width':'100%','height':'100%',
      'min-width':'0','min-height':'0','max-width':'100%','max-height':'100%',
      'margin':'0','padding':'0','display':'block',
      'object-fit':'contain','object-position':'center center',
      'transform':'none','clip-path':'none','border-radius':'inherit'
    };
    for(const [k,v] of Object.entries(styles))img.style.setProperty(k,v,'important');
    return;
  }
  /* V1007: los avatares del registro se dibujan con su propio estilo.
     Evita imponer contain/reconocimiento facial a cada tarjeta al hacer scroll. */
  if(img.closest('.v124-avatar') && (document.body?.dataset?.appRoute==='credentialBuilder'||location.hash.startsWith('#/credentialBuilder'))){
    clearFaceCrop(img);
    return;
  }
  /* V650: Disciplina controla sus retratos con object-fit:cover para llenar
     el círculo. No aplicar aquí el hard-lock global de foto completa/contain. */
  if(img.closest('.v576-discipline-photo')){
    clearFaceCrop(img);
    return;
  }
  if(!img.complete||!img.naturalWidth||!img.naturalHeight){
    if(img.dataset.ljrV606Load!=='1'){
      img.dataset.ljrV606Load='1';
      img.addEventListener('load',()=>enqueue(img),{once:true});
    }
    return;
  }

  const circle=visualCircleFrame(img);
  if(circle===null){
    setTimeout(()=>enqueue(img),90);
    return;
  }
  if(circle!==true){
    clearFaceCrop(img);
    return;
  }

  prepareCircleFallback(img);const key=sourceKey(img);const profile=await playerFaceProfile(img);if(img.isConnected&&sourceKey(img)===key&&profile)applyCrop(img,profile);
}
function enqueue(img){
  if(!(img instanceof HTMLImageElement)||!img.matches(FACE_IMAGES)||queued.has(img))return;
  // Apply the complete-photo view immediately, even while another image's
  // detector is loading. Every card is readable from its first paint.
  if(img.matches(HERO_IMAGES)&&!String(img.dataset.ljrHeroFaceKey||'').startsWith(sourceKey(img)+'|'))prepareHeroFallback(img);
  queued.add(img);queue.push(img);pump();
}
async function pump(){
  if(running)return;
  running=true;
  while(queue.length){
    const img=queue.shift();
    queued.delete(img);
    try{await process(img)}catch(err){console.warn('[V608 circle full face]',err)}
    await new Promise(r=>setTimeout(r,0));
  }
  running=false;
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
window.addEventListener('resize',()=>schedule(document));
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
  engine:'full-face-cards-and-avatars',
  heroCrop,
  scan:()=>scan(document),
  faceCrop,
  profile:playerFaceProfile,
  reset(){
    profileCache.clear();
    document.querySelectorAll(FACE_IMAGES).forEach(img=>{
      clearFaceCrop(img);
      delete img.dataset.ljrHeroFaceKey;
      enqueue(img);
    });
  }
};
})();
