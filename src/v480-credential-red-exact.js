/* V485 — credencial roja oficial hard override.
   Usa la imagen original de la Liga y elimina solo el fondo negro,
   preservando completa la bruja, sombrero, ropa, luna, escoba y letras. */
(function(){
'use strict';
if(window.__LJR_V480_CREDENTIAL__)return;
window.__LJR_V480_CREDENTIAL__=true;

const BUILD='20261001-v495-exact-card-reference';
const LEAGUE_LOGO='./assets/credential-logo-exact-v495.png?v=20261001-v495';
const $=(s,r=document)=>r.querySelector(s);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

function loadImage(src){
  if(!src)return Promise.resolve(null);
  return new Promise(resolve=>{
    const im=new Image();
    if(/^https?:/i.test(src)) im.crossOrigin='anonymous';
    im.onload=()=>resolve(im);
    im.onerror=()=>resolve(null);
    im.src=src;
  });
}
let leagueLogoCache=null;
let leagueLogoPromise=null;
async function transparentLeagueLogo(){
  if(leagueLogoCache)return leagueLogoCache;
  if(leagueLogoPromise)return leagueLogoPromise;
  leagueLogoPromise=loadImage(LEAGUE_LOGO).then(img=>{
    leagueLogoCache=img||null;
    return leagueLogoCache;
  }).catch(err=>{
    console.warn('[V495 credential logo]',err);
    leagueLogoPromise=null;
    return null;
  });
  return leagueLogoPromise;
}

function roundRect(x,a,b,w,h,r){
  r=Math.min(r,w/2,h/2);
  x.beginPath();
  x.moveTo(a+r,b);
  x.arcTo(a+w,b,a+w,b+h,r);
  x.arcTo(a+w,b+h,a,b+h,r);
  x.arcTo(a,b+h,a,b,r);
  x.arcTo(a,b,a+w,b,r);
  x.closePath();
}
function contained(x,img,a,b,w,h){
  if(!img)return;
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const s=Math.min(w/iw,h/ih),dw=iw*s,dh=ih*s;
  x.drawImage(img,a+(w-dw)/2,b+(h-dh)/2,dw,dh);
}
function cover(x,img,a,b,w,h){
  if(!img)return;
  const iw=img.naturalWidth||img.width||1,ih=img.naturalHeight||img.height||1;
  const s=Math.max(w/iw,h/ih),sw=w/s,sh=h/s,sx=(iw-sw)/2,sy=(ih-sh)/2;
  x.drawImage(img,sx,sy,sw,sh,a,b,w,h);
}

/* V494 — encuadre facial automático para la foto de la credencial.
   1) usa FaceDetector nativo cuando Chrome/Android lo ofrece;
   2) si no existe, intenta MediaPipe Face Detector en el dispositivo;
   3) si ambos fallan, aplica un recorte de retrato con sesgo superior.
   La foto no se sube a ningún servidor: la detección y el recorte ocurren
   localmente en el navegador. */
const faceCache=new Map();
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
function faceArea(b){return Math.max(0,Number(b?.width||0))*Math.max(0,Number(b?.height||0))}
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
  return {x:p.reduce((s,v)=>s+v.x,0)/p.length,y:p.reduce((s,v)=>s+v.y,0)/p.length};
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
      const box={x:z.x*scaleX,y:z.y*scaleY,width:z.width*scaleX,height:z.height*scaleY};
      const eyePts=[];
      for(const lm of (f.landmarks||[])){
        const type=String(lm?.type||'').toLowerCase();
        if(type.includes('eye')){
          for(const p of (lm.locations||[])) eyePts.push({x:p.x*scaleX,y:p.y*scaleY});
        }
      }
      return {box,eyes:avgPoint(eyePts),score:1,source:'native'};
    });
    return pickFace(profiles,iw,ih);
  }catch(_){return null}
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
    console.warn('[V495 face detector]',err);
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
      /* BlazeFace: los dos primeros puntos son los ojos. */
      const eyes=kp.length>=2?avgPoint([kp[0],kp[1]]):null;
      const score=Number(d.categories?.[0]?.score||d.score||.5);
      return {box,eyes,keypoints:kp,score,source:'mediapipe'};
    });
    return pickFace(profiles,iw,ih);
  }catch(err){
    console.warn('[V495 face detection]',err);
    return null;
  }
}
async function playerFaceProfile(img,file){
  if(!img||!file)return null;
  const key=[file.name,file.size,file.lastModified].join('|');
  if(faceCache.has(key))return await faceCache.get(key);
  const job=(async()=>{
    /* Primero el detector nativo si existe. Si no entrega ojos, MediaPipe
       aporta puntos faciales para centrar con mayor precisión. */
    const native=await nativeFaceProfile(img);
    if(native?.eyes)return native;
    const mp=await mediaPipeFaceProfile(img);
    return mp||native||null;
  })();
  faceCache.set(key,job);
  return await job;
}
function faceCrop(img,destW,destH,profile){
  const {w:iw,h:ih}=imageSize(img),aspect=destW/destH||1;
  let sw,sh,sx,sy;

  if(profile?.box&&profile.box.width>8&&profile.box.height>8){
    const b=profile.box;
    /* Encuadre tipo credencial: el rostro ocupa aprox. 44–48% del diámetro,
       dejando cabello y hombros dentro del círculo. */
    const side=Math.max(b.width*2.12,b.height*2.03);
    sw=Math.min(iw,side);
    sh=sw/aspect;
    if(sh>ih){sh=ih;sw=sh*aspect}
    if(sw>iw){sw=iw;sh=sw/aspect}

    const anchorX=profile.eyes?.x ?? (b.x+b.width*.50);
    const anchorY=profile.eyes?.y ?? (b.y+b.height*.39);

    /* En una foto de identificación los ojos deben quedar alrededor del 40%
       de la altura del recorte y centrados horizontalmente. */
    sx=anchorX-sw*.50;
    sy=anchorY-sh*.40;

    /* Evita que la frente/cabello queden pegados al borde superior. */
    const desiredTop=b.y-b.height*.34;
    if(sy>desiredTop)sy=desiredTop;
  }else{
    /* Respaldo para retratos cuando ningún detector está disponible. */
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
function drawFaceCenteredCover(ctx,img,x,y,w,h,profile){
  if(!img)return;
  const c=faceCrop(img,w,h,profile);
  ctx.drawImage(img,c.sx,c.sy,c.sw,c.sh,x,y,w,h);
}
function outlined(x,text,a,b,fill='#111',stroke='#fff',lw=5){
  x.lineJoin='round';x.miterLimit=2;x.lineWidth=lw;x.strokeStyle=stroke;x.strokeText(text,a,b);x.fillStyle=fill;x.fillText(text,a,b);
}
function fit(x,text,maxW,max=39,min=22){
  for(let s=max;s>=min;s--){
    x.font='900 '+s+'px Arial,Helvetica,sans-serif';
    if(x.measureText(text).width<=maxW)return s;
  }
  return min;
}
function wrap(x,text,maxW,maxLines=2){
  const words=String(text||'').trim().split(/\s+/).filter(Boolean),lines=[];
  let line='';
  for(const word of words){
    const t=line?line+' '+word:word;
    if(x.measureText(t).width<=maxW||!line)line=t;
    else{
      lines.push(line);line=word;
      if(lines.length===maxLines-1)break;
    }
  }
  if(line&&lines.length<maxLines)lines.push(line);
  return lines.length?lines:['JUGADOR'];
}
function playerFile(){
  const p=$('[data-v64-photo]')?.files?.[0]||null;
  if(!p)return null;
  /* El campo "Foto del jugador" es explícito: siempre se respeta el archivo
     elegido ahí. No se descarta por el nombre del archivo ni por reglas OCR. */
  return p;
}
async function playerImage(file=playerFile()){
  const f=file;if(!f)return null;

  /* En Android algunos navegadores pueden perder el recurso al revocar un
     blob URL antes de que canvas termine de pintarlo. createImageBitmap carga
     el archivo directamente y además respeta la orientación EXIF cuando puede. */
  try{
    if(typeof createImageBitmap==='function'){
      try{return await createImageBitmap(f,{imageOrientation:'from-image'})}
      catch(_){return await createImageBitmap(f)}
    }
  }catch(_){}

  /* Fallback estable sin blob URL: FileReader -> data URL -> Image. */
  try{
    const data=await new Promise((resolve,reject)=>{
      const r=new FileReader();
      r.onload=()=>resolve(String(r.result||''));
      r.onerror=()=>reject(r.error||new Error('No se pudo leer la foto'));
      r.readAsDataURL(f);
    });
    return await loadImage(data);
  }catch(_){
    return null;
  }
}
function teamLogoUrl(team){
  try{
    const u=window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||'';
    if(u)return /^https?:/i.test(u)?u:new URL(String(u).replace(/^\.\//,''),location.href).href;
  }catch(_){}
  try{
    const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
    const hit=Object.entries(db.team_logos||{}).find(([n])=>norm(n)===norm(team));
    if(hit){
      const v=hit[1],p=typeof v==='string'?v:(v?.local||v?.source||'');
      if(p)return /^https?:/i.test(p)?p:'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/'+String(p).replace(/^\.\//,'');
    }
  }catch(_){}
  return '';
}
async function transparentTeam(src){
  const im=await loadImage(src);if(!im)return null;
  const iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
  const max=360,s=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*s)),h=Math.max(1,Math.round(ih*s));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const q=cv.getContext('2d',{willReadFrequently:true});q.drawImage(im,0,0,w,h);
  let id;try{id=q.getImageData(0,0,w,h)}catch(_){return im}
  const d=id.data,c=[[0,0],[w-1,0],[0,h-1],[w-1,h-1]];
  let r=0,g=0,b=0,a=0;
  c.forEach(([xx,yy])=>{const k=(yy*w+xx)*4;r+=d[k];g+=d[k+1];b+=d[k+2];a+=d[k+3]});
  r/=4;g/=4;b/=4;a/=4;
  if(a<20)return cv;
  const tol=50*50,seen=new Uint8Array(w*h),queue=new Int32Array(w*h);
  let head=0,tail=0;
  const near=i=>{const k=i*4,dr=d[k]-r,dg=d[k+1]-g,db=d[k+2]-b;return d[k+3]>0&&dr*dr+dg*dg+db*db<=tol};
  const push=i=>{if(i<0||i>=w*h||seen[i]||!near(i))return;seen[i]=1;queue[tail++]=i};
  for(let xx=0;xx<w;xx++){push(xx);push((h-1)*w+xx)}
  for(let yy=0;yy<h;yy++){push(yy*w);push(yy*w+w-1)}
  while(head<tail){
    const i=queue[head++],xx=i%w,yy=(i/w)|0;
    if(xx)push(i-1);if(xx<w-1)push(i+1);if(yy)push(i-w);if(yy<h-1)push(i+w);
  }
  for(let i=0;i<w*h;i++)if(seen[i])d[i*4+3]=0;
  q.putImageData(id,0,0);
  return cv;
}

async function makeCanvas(){
  const cv=document.createElement('canvas');
  cv.width=1011;cv.height=638;
  const x=cv.getContext('2d'),W=cv.width,H=cv.height;

  const name=($('[data-v64-cred-name]')?.value||'JUGADOR').trim().toUpperCase();
  const team=($('[data-v64-cred-team]')?.value||'EQUIPO').trim().toUpperCase();
  const teamSel=$('[data-v64-cred-team]');
  const cat=(teamSel?.selectedOptions?.[0]?.dataset?.category||$('[data-v64-cred-cat]')?.value||'Por confirmar').replace(/^Categoria:?\s*/i,'');
  const curp=String($('[data-v64-cred-curp]')?.value||'POR CAPTURAR').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18)||'POR CAPTURAR';

  x.clearRect(0,0,W,H);
  x.save();
  roundRect(x,5,5,W-10,H-10,34);
  x.clip();

  /* Diseño físico rojo limpio. SIN líneas blancas, SIN rayas diagonales. */
  x.fillStyle='#d83f60';x.fillRect(0,0,W,H);
  x.fillStyle='#0a8049';x.fillRect(0,0,W,126);

  x.strokeStyle='#15171b';x.lineWidth=5;roundRect(x,8,8,W-16,H-16,31);x.stroke();
  x.strokeStyle='#8b203d';x.lineWidth=3;roundRect(x,17,17,W-34,H-34,26);x.stroke();

  /* V484: imagen suministrada por el usuario, usada directamente. Sin procesamiento. */
  const league=await transparentLeagueLogo();
  if(league)x.drawImage(league,20,12,180,147);

  x.textAlign='center';x.textBaseline='alphabetic';
  x.fillStyle='#fff';x.font='900 31px Arial,Helvetica,sans-serif';
  x.fillText('LIGA MUNICIPAL DE FUTBOL JUVENTINO',580,49);
  x.fillText('ROSAS',580,86);
  x.textAlign='left';

  const tlogo=await transparentTeam(teamLogoUrl(team));
  if(tlogo)contained(x,tlogo,830,128,150,150);

  const photoFile=playerFile();
  const photo=await playerImage(photoFile),face=photo?await playerFaceProfile(photo,photoFile):null,cx=205,cy=365,r=131;
  x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();
  x.fillStyle='#93a4ad';x.fillRect(cx-r,cy-r,r*2,r*2);
  if(photo)drawFaceCenteredCover(x,photo,cx-r,cy-r,r*2,r*2,face);
  else{x.fillStyle='#fff';x.textAlign='center';x.font='900 28px Arial';x.fillText('FOTO',cx,cy+10)}
  x.restore();x.textAlign='left';
  x.beginPath();x.arc(cx,cy,r+5,0,Math.PI*2);x.strokeStyle='#075a37';x.lineWidth=9;x.stroke();
  x.beginPath();x.arc(cx,cy,r+11,0,Math.PI*2);x.strokeStyle='#222';x.lineWidth=3;x.stroke();

  const tx=392,tw=430,fs=fit(x,name,tw,39,24);
  x.font='900 '+fs+'px Arial,Helvetica,sans-serif';
  const lines=wrap(x,name,tw,2),base=292,lh=fs+7;
  lines.forEach((line,i)=>outlined(x,line,tx,base+i*lh,'#111','#fff',6));

  x.font='900 31px Arial,Helvetica,sans-serif';
  outlined(x,'Categoría: '+cat,tx,405,'#111','#fff',5);
  x.font='900 29px Arial,Helvetica,sans-serif';
  outlined(x,'CURP: '+curp,tx,466,'#111','#fff',5);

  const ts=fit(x,team,330,45,25);
  x.font='900 '+ts+'px Arial,Helvetica,sans-serif';
  outlined(x,team,45,592,'#fff','#111',7);

  x.restore();
  return cv;
}

async function render(){
  if(route()!=='credentialBuilder')return;
  const target=$('[data-v196-preview-canvas]');if(!target)return;
  const seq=++render.seq,cv=await makeCanvas();
  if(seq!==render.seq)return;
  target.width=cv.width;target.height=cv.height;
  const q=target.getContext('2d');
  q.clearRect(0,0,target.width,target.height);
  q.drawImage(cv,0,0);
  const photoFile=playerFile();
  const photo=photoFile?await playerImage(photoFile):null;
  const detected=photo?await playerFaceProfile(photo,photoFile):null;
  target.dataset.faceDetected=detected?'1':'0';
  target.dataset.faceDetector=detected?.source||'fallback';
  const h=$('[data-v196-classic-preview] .v196-preview-head b');
  if(h)h.textContent='Vista previa · credencial roja oficial de la Liga';
  const s=$('[data-v100-credential-style]');
  if(s){s.value='red';s.disabled=true}
}
render.seq=0;

function canvasBlob(cv){return new Promise(r=>cv.toBlob(r,'image/png',1))}
function download(b,n){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=n;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);
}
async function png(){
  const b=await canvasBlob(await makeCanvas());
  if(b)download(b,'Credencial_Liga_Juventino.png');
}
async function share(){
  const b=await canvasBlob(await makeCanvas());if(!b)return;
  try{
    const f=new File([b],'Credencial_Liga_Juventino.png',{type:'image/png'});
    if(navigator.canShare?.({files:[f]})){await navigator.share({title:'Credencial Liga Juventino',files:[f]});return}
  }catch(_){}
  download(b,'Credencial_Liga_Juventino.png');
}
async function pdf(){
  const cv=await makeCanvas();
  let JS=window.jspdf?.jsPDF;
  if(!JS){
    await new Promise((resolve,reject)=>{
      const s=document.createElement('script');
      s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
      s.onload=resolve;s.onerror=reject;document.head.appendChild(s);
    }).catch(()=>{});
    JS=window.jspdf?.jsPDF;
  }
  if(!JS){
    const b=await canvasBlob(cv);
    if(b)download(b,'Credencial_Liga_Juventino.png');
    return;
  }
  const p=new JS({orientation:'landscape',unit:'mm',format:[85.60,53.98]});
  p.addImage(cv.toDataURL('image/png'),'PNG',0,0,85.60,53.98,undefined,'FAST');
  p.save('Credencial_Liga_Juventino_tamano_INE.pdf');
}

function schedule(){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(render,80);
  setTimeout(render,280);
}
document.addEventListener('input',e=>{
  if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.closest('#screen'))schedule();
},false);
document.addEventListener('change',e=>{
  if(route()==='credentialBuilder'&&e.target instanceof Element&&e.target.closest('#screen'))schedule();
},false);
document.addEventListener('click',e=>{
  if(route()!=='credentialBuilder'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v100-credential-png],[data-v64-download-credential-png],[data-v100-credential-pdf],[data-v64-print-credential],[data-v100-credential-share]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(b.matches('[data-v100-credential-pdf],[data-v64-print-credential]'))pdf();
  else if(b.matches('[data-v100-credential-share]'))share();
  else png();
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
const screen=$('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
setTimeout(schedule,0);
setTimeout(schedule,900);
setTimeout(schedule,2200);

window.LJR_V480={build:BUILD,render,makeCanvas,png,pdf,share};
})();