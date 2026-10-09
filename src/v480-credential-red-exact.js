/* V485 — credencial roja oficial hard override.
   Usa la imagen original de la Liga y elimina solo el fondo negro,
   preservando completa la bruja, sombrero, ropa, luna, escoba y letras. */
(function(){
'use strict';
if(window.__LJR_V480_CREDENTIAL__)return;
window.__LJR_V480_CREDENTIAL__=true;

const BUILD='20261001-v513-nopalero-center-preserved';
const LEAGUE_LOGO='data:image/png;base64,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';
const $=(s,r=document)=>r.querySelector(s);
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
/* V496: conserva en memoria la foto elegida aunque otros módulos reconstruyan
   el formulario después de seleccionar el archivo. */
let selectedPlayerFile=null;
const uploadedLogos={league:null,team:null};

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
  if(uploadedLogos.league)return loadImage(uploadedLogos.league);
  if(leagueLogoCache)return leagueLogoCache;
  if(leagueLogoPromise)return leagueLogoPromise;
  leagueLogoPromise=loadImage('./assets/league-credential-hd.png').then(img=>img||loadImage(LEAGUE_LOGO)).then(img=>{
    leagueLogoCache=img||null;
    return leagueLogoCache;
  }).catch(err=>{
    console.warn('[V497 credential logo]',err);
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
async function playerFaceProfileFast(img,file){
  if(!img||!file)return null;
  const job=playerFaceProfile(img,file);
  let timer=0;
  const quick=await Promise.race([
    job,
    new Promise(resolve=>{timer=setTimeout(()=>resolve(null),420)})
  ]);
  if(timer)clearTimeout(timer);
  if(!quick){
    /* No dejamos el círculo en FOTO mientras MediaPipe termina de cargar.
       Mostramos la fotografía de inmediato y, cuando llega la detección,
       volvemos a encuadrarla automáticamente. */
    job.then(profile=>{
      if(profile&&route()==='credentialBuilder')schedule();
    }).catch(()=>{});
  }
  return quick;
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
  const live=$('[data-v64-photo]')?.files?.[0]||null;
  if(live)selectedPlayerFile=live;
  /* Si el formulario fue repintado, input.files puede quedar vacío. En ese
     caso usamos la File que el usuario ya eligió en esta misma sesión. */
  return live||selectedPlayerFile||null;
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
  const wanted=norm(team);
  if(wanted==='dep nopalero'||wanted==='deportivo nopalero')return './assets/nopalero-credential-hd.png';
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
const teamImageCache=new Map();
async function transparentTeam(src,ignoreCustomTeam=false){
  if(uploadedLogos.team&&!ignoreCustomTeam)return loadImage(uploadedLogos.team);
  if(!teamImageCache.has(src))teamImageCache.set(src,prepareTeam(src));
  return teamImageCache.get(src);
}
async function prepareTeam(src){
  const im=await loadImage(src);if(!im)return null;
  if(String(src).includes('nopalero-credential-hd.png'))return im;
  if(/^data:image\/webp;base64,/i.test(String(src))){
    /* V512 — Deportivo Nopalero:
       quitar ÚNICAMENTE el fondo negro exterior.
       NO usar flood-fill por negro porque el contorno negro del escudo está
       conectado visualmente con detalles internos y terminaba borrando
       balón, nopales, letras, banderas y la parte central.
       Estrategia:
       1) detectar todos los píxeles visibles que NO son fondo negro neutro;
       2) conservar cualquier negro que quede dentro del cuerpo real del logo
          (encerrado por contenido en su misma fila y columna);
       3) conservar además un borde negro de hasta 4 px junto al contenido;
       4) volver transparente solamente el negro exterior restante. */
    const iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
    const max=2048,sc=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*sc)),h=Math.max(1,Math.round(ih*sc));
    const cv=document.createElement('canvas');cv.width=w;cv.height=h;
    const q=cv.getContext('2d',{willReadFrequently:true});
    q.clearRect(0,0,w,h);q.drawImage(im,0,0,w,h);

    let data;try{data=q.getImageData(0,0,w,h)}catch(_){return im}
    const d=data.data,n=w*h;
    const seed=new Uint8Array(n),near=new Uint8Array(n);
    const rowMin=new Int32Array(h),rowMax=new Int32Array(h),colMin=new Int32Array(w),colMax=new Int32Array(w);
    rowMin.fill(w);rowMax.fill(-1);colMin.fill(h);colMax.fill(-1);

    const isOuterBlack=p=>{
      const k=p*4;
      if(d[k+3]===0)return true;
      const r=d[k],g=d[k+1],b=d[k+2],hi=Math.max(r,g,b),lo=Math.min(r,g,b);
      return hi<=62 && (hi-lo)<=24;
    };

    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const p=y*w+x,k=p*4;
      if(d[k+3]===0||isOuterBlack(p))continue;
      seed[p]=1;near[p]=1;
      if(x<rowMin[y])rowMin[y]=x;if(x>rowMax[y])rowMax[y]=x;
      if(y<colMin[x])colMin[x]=y;if(y>colMax[x])colMax[x]=y;
    }

    /* Expande SOLO cuatro píxeles alrededor del contenido para conservar
       el contorno negro original sin fabricar un rectángulo/halo negro. */
    for(let pass=0;pass<4;pass++){
      const prev=new Uint8Array(near);
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        const p=y*w+x;if(prev[p])continue;
        let hit=false;
        for(let oy=-1;oy<=1&&!hit;oy++)for(let ox=-1;ox<=1;ox++){
          if(!ox&&!oy)continue;
          const nx=x+ox,ny=y+oy;
          if(nx>=0&&nx<w&&ny>=0&&ny<h&&prev[ny*w+nx]){hit=true;break}
        }
        if(hit)near[p]=1;
      }
    }

    for(let y=0;y<h;y++)for(let x=0;x<w;x++){
      const p=y*w+x;
      if(!isOuterBlack(p))continue;
      const insideRow=rowMax[y]>=0&&x>=rowMin[y]&&x<=rowMax[y];
      const insideCol=colMax[x]>=0&&y>=colMin[x]&&y<=colMax[x];
      const belongsToLogo=near[p]||(insideRow&&insideCol);
      if(!belongsToLogo)d[p*4+3]=0;
    }

    q.putImageData(data,0,0);
    
    return cv;
  }
  const iw=im.naturalWidth||im.width||1,ih=im.naturalHeight||im.height||1;
  const max=2048,s=Math.min(1,max/Math.max(iw,ih)),w=Math.max(1,Math.round(iw*s)),h=Math.max(1,Math.round(ih*s));
  const cv=document.createElement('canvas');cv.width=w;cv.height=h;
  const q=cv.getContext('2d',{willReadFrequently:true});
  q.clearRect(0,0,w,h);q.drawImage(im,0,0,w,h);

  let id;try{id=q.getImageData(0,0,w,h)}catch(_){return im}
  const d=id.data,n=w*h;

  /* V498: fondo PNG de escudos.
     Toma muchas muestras del borde para reconocer fondos con textura,
     pero SOLO elimina la región conectada al borde. Así conserva letras,
     contornos negros y detalles internos del escudo. */
  const samples=[];
  const take=(xx,yy)=>{const k=(yy*w+xx)*4;if(d[k+3]>20)samples.push([d[k],d[k+1],d[k+2]])};
  const step=Math.max(1,Math.floor(Math.min(w,h)/90));
  for(let xx=0;xx<w;xx+=step){take(xx,0);take(xx,h-1)}
  for(let yy=0;yy<h;yy+=step){take(0,yy);take(w-1,yy)}
  if(!samples.length)return cv;

  const median=arr=>{const a=arr.slice().sort((x,y)=>x-y);return a[(a.length/2)|0]};
  const br=median(samples.map(p=>p[0])),bg=median(samples.map(p=>p[1])),bb=median(samples.map(p=>p[2]));
  const spread=Math.sqrt(samples.reduce((sum,p)=>{
    const dr=p[0]-br,dg=p[1]-bg,db=p[2]-bb;return sum+dr*dr+dg*dg+db*db;
  },0)/samples.length);

  const special=/nopalero/i.test(String(src));
  const tol=Math.max(special?118:72,Math.min(special?150:118,58+spread*3.25));
  const tol2=tol*tol;
  const lumBg=.2126*br+.7152*bg+.0722*bb;

  const seen=new Uint8Array(n),queue=new Int32Array(n);let head=0,tail=0;
  const near=i=>{
    const k=i*4;if(d[k+3]===0)return true;
    const r=d[k],g=d[k+1],b=d[k+2],dr=r-br,dg=g-bg,db=b-bb;
    const dist=dr*dr+dg*dg+db*db;
    const lum=.2126*r+.7152*g+.0722*b;
    return dist<=tol2 && lum<=Math.max(178,lumBg+108);
  };
  const push=i=>{if(i<0||i>=n||seen[i]||!near(i))return;seen[i]=1;queue[tail++]=i};
  for(let xx=0;xx<w;xx++){push(xx);push((h-1)*w+xx)}
  for(let yy=0;yy<h;yy++){push(yy*w);push(yy*w+w-1)}
  while(head<tail){
    const i=queue[head++],xx=i%w,yy=(i/w)|0;
    if(xx>0)push(i-1);if(xx<w-1)push(i+1);if(yy>0)push(i-w);if(yy<h-1)push(i+w);
    if(xx>0&&yy>0)push(i-w-1);if(xx<w-1&&yy>0)push(i-w+1);
    if(xx>0&&yy<h-1)push(i+w-1);if(xx<w-1&&yy<h-1)push(i+w+1);
  }

  for(let i=0;i<n;i++)if(seen[i])d[i*4+3]=0;

  /* Quita el halo residual de 1 px del fondo sin comerse el borde del escudo. */
  const copy=new Uint8Array(seen);
  const fringeTol=tol*1.20,fringeTol2=fringeTol*fringeTol;
  for(let i=0;i<n;i++){
    if(copy[i])continue;
    const xx=i%w,yy=(i/w)|0;
    let touches=false;
    for(let oy=-1;oy<=1&&!touches;oy++)for(let ox=-1;ox<=1;ox++){
      if(!ox&&!oy)continue;const nx=xx+ox,ny=yy+oy;
      if(nx>=0&&nx<w&&ny>=0&&ny<h&&copy[ny*w+nx]){touches=true;break}
    }
    if(!touches)continue;
    const k=i*4,dr=d[k]-br,dg=d[k+1]-bg,db=d[k+2]-bb;
    const dist=dr*dr+dg*dg+db*db;
    if(dist<=fringeTol2)d[k+3]=Math.min(d[k+3],dist<=tol2?18:92);
  }

  q.putImageData(id,0,0);
  return cv;
}

async function makeCanvas(scale=1,record=null){
  const cv=document.createElement('canvas');
  cv.width=1011*scale;cv.height=638*scale;
  const x=cv.getContext('2d'),W=1011,H=638;
  x.scale(scale,scale);

  const name=String(record?.name??$('[data-v64-cred-name]')?.value??'JUGADOR').trim().toUpperCase();
  const team=String(record?.team??$('[data-v64-cred-team]')?.value??'EQUIPO').trim().toUpperCase();
  const teamSel=$('[data-v64-cred-team]');
  const cat=String(record?.category??teamSel?.selectedOptions?.[0]?.dataset?.category??$('[data-v64-cred-cat]')?.value??'Por confirmar').replace(/^Categoria:?\s*/i,'');
  const curp=String(record?.curp??$('[data-v64-cred-curp]')?.value??'POR CAPTURAR').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18)||'POR CAPTURAR';

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

  const teamSrc=teamLogoUrl(team);
  const tlogo=await transparentTeam(teamSrc,!!record);
  if(tlogo)contained(x,tlogo,826,116,165,165);

  const photoFile=record?record.photoFile:playerFile();
  const photo=await playerImage(photoFile);
  const face=photo?(record?await Promise.race([playerFaceProfile(photo,photoFile).catch(()=>null),new Promise(ok=>setTimeout(()=>ok(null),450))]):await playerFaceProfileFast(photo,photoFile)):null;
  const cx=205,cy=365,r=131;
  x.save();x.beginPath();x.arc(cx,cy,r,0,Math.PI*2);x.clip();
  x.fillStyle='#93a4ad';x.fillRect(cx-r,cy-r,r*2,r*2);
  if(photo)drawFaceCenteredCover(x,photo,cx-r,cy-r,r*2,r*2,face);
  else{x.fillStyle='#fff';x.textAlign='center';x.font='900 28px Arial';x.fillText('FOTO',cx,cy+10)}
  x.restore();x.textAlign='left';
  x.beginPath();x.arc(cx,cy,r+5,0,Math.PI*2);x.strokeStyle='#075a37';x.lineWidth=9;x.stroke();
  x.beginPath();x.arc(cx,cy,r+11,0,Math.PI*2);x.strokeStyle='#222';x.lineWidth=3;x.stroke();
  if(record)try{photo?.close?.()}catch(_){}

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
  target.dataset.v480Painted='1';
  const photoFile=playerFile();
  const photo=photoFile?await playerImage(photoFile):null;
  const detected=photo?await playerFaceProfileFast(photo,photoFile):null;
  target.dataset.faceDetected=detected?'1':'0';
  target.dataset.faceDetector=detected?.source||'fallback';
  const h=$('[data-v196-classic-preview] .v196-preview-head b');
  if(h&&h.textContent!=='Vista previa · credencial roja oficial de la Liga')h.textContent='Vista previa · credencial roja oficial de la Liga';
  exportControls();
  const finalPreview=$('[data-v560-final-credential]');
  if(finalPreview){finalPreview.width=cv.width;finalPreview.height=cv.height;finalPreview.getContext('2d').drawImage(cv,0,0)}
  const s=$('[data-v100-credential-style]');
  if(s){s.value='red';s.disabled=true}
}
render.seq=0;

function imageData(image){
  if(!image)return '';
  if(image.src?.startsWith('data:image/svg+xml'))return image.src;
  const c=document.createElement('canvas');c.width=image.naturalWidth||image.width;c.height=image.naturalHeight||image.height;
  c.getContext('2d').drawImage(image,0,0);return c.toDataURL('image/png');
}
async function svg(){
  const xml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const name=($('[data-v64-cred-name]')?.value||'JUGADOR').trim().toUpperCase();
  const team=($('[data-v64-cred-team]')?.value||'EQUIPO').trim().toUpperCase();
  const cat=($('[data-v64-cred-team]')?.selectedOptions?.[0]?.dataset.category||$('[data-v64-cred-cat]')?.value||'Por confirmar').replace(/^Categoria:?\s*/i,'');
  const curp=String($('[data-v64-cred-curp]')?.value||'POR CAPTURAR').toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,18);
  const [league,club]=await Promise.all([transparentLeagueLogo(),transparentTeam(teamLogoUrl(team))]);
  const file=playerFile(),photo=await playerImage(file),face=photo?await playerFaceProfileFast(photo,file):null;
  const faceCanvas=document.createElement('canvas');faceCanvas.width=1048;faceCanvas.height=1048;
  const fc=faceCanvas.getContext('2d');fc.fillStyle='#93a4ad';fc.fillRect(0,0,1048,1048);
  if(photo)drawFaceCenteredCover(fc,photo,0,0,1048,1048,face);
  const q=document.createElement('canvas').getContext('2d');
  const size=fit(q,name,430,39,24);q.font='900 '+size+'px Arial,Helvetica,sans-serif';
  const names=wrap(q,name,430,2);
  const teamSize=fit(q,team,330,45,25);
  const text=(value,x,y,size,fill='#111',stroke='#fff',width=5)=>'<text x="'+x+'" y="'+y+'" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="'+size+'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+width+'" stroke-linejoin="round" paint-order="stroke fill">'+xml(value)+'</text>';
  const img=(im,x,y,w,h)=>im?'<image href="'+imageData(im)+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" preserveAspectRatio="xMidYMid meet"/>':'';
  const result='<svg xmlns="http://www.w3.org/2000/svg" width="85.60mm" height="53.98mm" viewBox="0 0 1011 638">'+
    '<title>Credencial Liga Juventino Rosas</title><desc>Texto y formas vectoriales. Fotografías y escudos incorporados en su resolución disponible.</desc>'+
    '<defs><clipPath id="card"><rect x="5" y="5" width="1001" height="628" rx="34"/></clipPath><clipPath id="face"><circle cx="205" cy="365" r="131"/></clipPath></defs>'+
    '<g clip-path="url(#card)"><rect width="1011" height="638" fill="#d83f60"/><rect width="1011" height="126" fill="#0a8049"/>'+
    '<rect x="8" y="8" width="995" height="622" rx="31" fill="none" stroke="#15171b" stroke-width="5"/><rect x="17" y="17" width="977" height="604" rx="26" fill="none" stroke="#8b203d" stroke-width="3"/>'+
    img(league,20,12,180,147)+
    '<g text-anchor="middle">'+text('LIGA MUNICIPAL DE FUTBOL JUVENTINO',580,49,31,'#fff','none',0)+text('ROSAS',580,86,31,'#fff','none',0)+'</g>'+
    img(club,826,116,165,165)+
    '<image href="'+faceCanvas.toDataURL('image/png')+'" x="74" y="234" width="262" height="262" clip-path="url(#face)"/>'+
    '<circle cx="205" cy="365" r="136" fill="none" stroke="#075a37" stroke-width="9"/><circle cx="205" cy="365" r="142" fill="none" stroke="#222" stroke-width="3"/>'+
    names.map((n,i)=>text(n,392,292+i*(size+7),size,'#111','#fff',6)).join('')+
    text('Categoría: '+cat,392,405,31)+text('CURP: '+curp,392,466,29)+text(team,45,592,teamSize,'#fff','#111',7)+'</g></svg>';
  const blob=new Blob([result],{type:'image/svg+xml;charset=utf-8'});
  download(blob,'Credencial_Liga_Juventino.svg');
  return result;
}
function exportControls(){
  if(route()!=='credentialBuilder')return;
  const pngButton=$('[data-v100-credential-png],[data-v64-download-credential-png]');
  if(!pngButton)return;
  if(pngButton.textContent!=='Descargar PNG HD')pngButton.textContent='Descargar PNG HD';
  if(!$('[data-v514-logo-inputs]')){
    const controls=document.createElement('div');controls.dataset.v514LogoInputs='';controls.style.cssText='display:grid;gap:8px;margin:12px 0;font-size:12px';
    for(const [key,label] of [['league','Logo de la liga PNG / SVG'],['team','Escudo del equipo PNG / SVG']]){
      const field=document.createElement('label');field.textContent=label+' (opcional)';const input=document.createElement('input');input.type='file';input.accept='image/png,image/webp,image/svg+xml';input.dataset.v514Logo=key;
      input.addEventListener('change',async()=>{const file=input.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{uploadedLogos[key]=reader.result;schedule()};reader.readAsDataURL(file)});
      field.appendChild(input);controls.appendChild(field);
    }
    const note=document.createElement('small');note.textContent='PNG HD: 3033 × 1914 px. SVG: texto y formas vectoriales. Los logos cargados conservan sus colores y transparencia original.';controls.appendChild(note);pngButton.parentElement.after(controls);
  }
  const logoControls=$('[data-v514-logo-inputs]');
  if(logoControls&&!$('[data-v560-final-preview]')){
    const preview=document.createElement('section');preview.dataset.v560FinalPreview='';preview.className='v560-credential-preview';
    preview.innerHTML='<header><b>Vista previa final</b><button type="button" data-v560-enlarge>Ampliar ⛶</button></header><canvas data-v560-final-credential aria-label="Vista previa de la credencial final"></canvas>';
    logoControls.append(preview);
    preview.querySelector('button').onclick=async()=>{
      const cv=await makeCanvas(2),dialog=document.createElement('dialog');dialog.className='v560-credential-dialog';
      const close=document.createElement('button');close.type='button';close.textContent='Cerrar ×';close.onclick=()=>dialog.close();
      dialog.append(close,cv);document.body.append(dialog);dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.showModal();
    };
  }
  if(!$('[data-v514-credential-svg]')){
    const button=pngButton.cloneNode(false);button.removeAttribute('data-v100-credential-png');button.removeAttribute('data-v64-download-credential-png');
    button.setAttribute('data-v514-credential-svg','');button.textContent='Descargar SVG';pngButton.after(button);
  }
}

function canvasBlob(cv){return new Promise(r=>cv.toBlob(r,'image/png',1))}
function download(b,n){
  const a=document.createElement('a');
  a.href=URL.createObjectURL(b);a.download=n;
  document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800);
}
async function png(){
  const b=await canvasBlob(await makeCanvas(3));
  if(b)download(b,'Credencial_Liga_Juventino.png');
}
async function share(){
  const b=await canvasBlob(await makeCanvas(3));if(!b)return;
  try{
    const f=new File([b],'Credencial_Liga_Juventino.png',{type:'image/png'});
    if(navigator.canShare?.({files:[f]})){await navigator.share({title:'Credencial Liga Juventino',files:[f]});return}
  }catch(_){}
  download(b,'Credencial_Liga_Juventino.png');
}
async function pdf(){
  /* V1013: pdf-lib integrado y alojado en GitHub Pages; nunca enviar credenciales a un CDN. */
  try{
    const exporter=window.LJR_LOCAL_PDF;
    if(!exporter?.single)throw Error('El motor PDF local todavía no está listo. Recarga esta sección.');
    await exporter.single(()=>makeCanvas(2));
  }catch(error){
    console.warn('[credencial PDF local]',error?.name||'Error');
    alert(error?.message||'No se pudo generar la credencial PDF local.');
  }
}

/* V1005: una sola vista previa por cambio, sin redibujar por cada tecla
   de búsquedas, listas u otros módulos de registro. */
function schedule(delay=200){
  if(route()!=='credentialBuilder')return;
  clearTimeout(schedule.t);
  schedule.t=setTimeout(()=>{
    if(route()==='credentialBuilder'&&!document.hidden)render();
  },delay);
}
const CREDENTIAL_INPUTS='[data-v64-cred-name],[data-v64-cred-team],[data-v64-cred-cat],[data-v64-cred-curp],[data-v64-photo],[data-v100-credential-style],[data-v514-logo]';
function isCredentialInput(e){
  return route()==='credentialBuilder'&&e.target instanceof Element&&e.target.matches(CREDENTIAL_INPUTS);
}

document.addEventListener('change',e=>{
  if(!(e.target instanceof Element)||!e.target.matches('[data-v64-photo]'))return;
  selectedPlayerFile=e.target.files?.[0]||null;
  e.target.dataset.v496PhotoCache=selectedPlayerFile?'1':'0';
  try{faceCache.clear()}catch(_){}
  schedule();
},true);
document.addEventListener('input',e=>{
  if(isCredentialInput(e))schedule(240);
},false);
document.addEventListener('change',e=>{
  if(isCredentialInput(e))schedule(130);
},false);
document.addEventListener('click',e=>{
  if(route()!=='credentialBuilder'||!(e.target instanceof Element))return;
  const b=e.target.closest('[data-v514-credential-svg],[data-v100-credential-png],[data-v64-download-credential-png],[data-v100-credential-pdf],[data-v64-print-credential],[data-v100-credential-share]');
  if(!b)return;
  e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
  if(b.matches('[data-v514-credential-svg]'))svg();
  else if(b.matches('[data-v100-credential-pdf],[data-v64-print-credential]'))pdf();
  else if(b.matches('[data-v100-credential-share]'))share();
  else png();
},true);

window.addEventListener('hashchange',()=>schedule(170));
window.addEventListener('load',()=>schedule(260));
const screen=$('#screen');
if(screen)new MutationObserver(()=>{
  if(route()!=='credentialBuilder')return;
  const preview=$('[data-v196-preview-canvas]',screen);
  if(preview&&!preview.dataset.v480Painted)schedule(180);
}).observe(screen,{childList:true,subtree:true});
setTimeout(()=>schedule(240),0);

window.LJR_V480={build:BUILD,render,makeCanvas,png,pdf,share,svg,schedulePreview:schedule,makeRecordCanvas:(record,scale=1.5)=>makeCanvas(scale,record)};
})();