/*
V914 — Realistic Football Jersey 3D · exact transparent Liga/category crests
Only the jersey model/rendering is changed in this revision.
The primary mesh is the MIT-licensed classic shirt GLB from Mini Jersey 3D Studio
(Francesco Castaldi). It keeps its original normal/occlusion detail while the
Liga texture is projected on a separate UV channel. See THIRD_PARTY_NOTICES.md.
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const INSTANCES=new WeakMap();
const COMPACT_3D=window.matchMedia?.('(pointer: coarse)')?.matches||window.innerWidth<=600;
const FRAME_INTERVAL=1000/(COMPACT_3D?30:45);
const RENDER_DPR=Math.min(window.devicePixelRatio||1,COMPACT_3D?1.4:1.75);
const fabricKey=c=>JSON.stringify([c.name,c.number,c.color,c.accentColor,c.pattern,c.logo,c.categoryLogo,c.category,c.leagueLogo]);
// V1009 — mismo PNG de las cédulas, azul oficial arriba y abajo;
// estampado en textura, sin alterar los colores de la camiseta ni del equipo.
const LEAGUE_LOGO='./assets/branding/escudo-liga-camisetas-unificado-v1122.png?v=v1122-mismo-escudo-camisetas';

function makeFabricBump(){
  const c=document.createElement('canvas');
  c.width=c.height=512;
  const x=c.getContext('2d');
  x.fillStyle='#7f7f7f';x.fillRect(0,0,512,512);
  x.globalAlpha=.28;
  for(let y=0;y<512;y+=4){
    x.fillStyle=(y/4)%2?'#a5a5a5':'#5e5e5e';
    x.fillRect(0,y,512,1);
  }
  for(let xx=0;xx<512;xx+=4){
    x.fillStyle=(xx/4)%2?'#929292':'#6d6d6d';
    x.fillRect(xx,0,1,512);
  }
  x.globalAlpha=.2;
  for(let y=2;y<512;y+=8)for(let xx=2;xx<512;xx+=8){
    x.fillStyle=((xx+y)/8)%2?'#bcbcbc':'#4e4e4e';
    x.beginPath();x.arc(xx,y,1.15,0,Math.PI*2);x.fill();
  }
  x.globalAlpha=1;
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(16,10);
  t.anisotropy=8;
  t.colorSpace=THREE.NoColorSpace;
  t.needsUpdate=true;
  return t;
}

function cleanKitColor(value){
  const v=String(value||'').trim();
  return /^#[0-9a-f]{6}$/i.test(v)?v:'#0b4bd8';
}

let DOT_TILE;
function fabricDotTile(){
  if(DOT_TILE)return DOT_TILE;
  const tile=document.createElement('canvas');
  tile.width=tile.height=18;
  const c=tile.getContext('2d');
  for(const [x,y,shade] of [[4,4,'#fff'],[13,4,'#000'],[4,13,'#000'],[13,13,'#fff']]){
    c.fillStyle=shade;c.beginPath();c.arc(x,y,.68,0,Math.PI*2);c.fill();
  }
  DOT_TILE=tile;
  return tile;
}

function drawKitHalf(ctx,left,base,accent=base,pattern='plain'){
  const w=1024,h=1024,color=cleanKitColor(base),accentColor=cleanKitColor(accent||base);
  ctx.fillStyle=color;ctx.fillRect(left,0,w,h);

  // V916 — optional club design. Profile shirts that do not pass a pattern remain plain.
  ctx.save();
  const p=String(pattern||'plain').toLowerCase();
  if(accentColor!==color){
    ctx.fillStyle=accentColor;
    if(p==='stripes'){
      for(let xx=left+92;xx<left+w;xx+=170)ctx.fillRect(xx,0,72,h);
    }else if(p==='halves'){
      ctx.fillRect(left+w/2,0,w/2,h);
    }else if(p==='center'){
      ctx.fillRect(left+w*.405,0,w*.19,h);
    }else if(p==='chest'){
      ctx.fillRect(left,245,w,155);
    }else if(p==='shoulders'){
      ctx.beginPath();ctx.moveTo(left,0);ctx.lineTo(left+w,0);ctx.lineTo(left+w*.82,260);ctx.lineTo(left+w*.18,260);ctx.closePath();ctx.fill();
    }else if(p==='sleeves'){
      ctx.fillRect(left,0,205,h);ctx.fillRect(left+w-205,0,205,h);
    }else if(p==='diag'){
      ctx.translate(left+w*.5,h*.45);ctx.rotate(-.42);ctx.fillRect(-w*.65,-75,w*1.3,150);
    }
  }
  ctx.restore();

  // Light and shade are transparent overlays, so every chosen color keeps its own hue.
  const light=ctx.createLinearGradient(left,0,left+w,0);
  light.addColorStop(0,'rgba(0,0,0,.24)');
  light.addColorStop(.22,'rgba(255,255,255,.035)');
  light.addColorStop(.52,'rgba(255,255,255,.12)');
  light.addColorStop(.78,'rgba(255,255,255,.025)');
  light.addColorStop(1,'rgba(0,0,0,.28)');
  ctx.fillStyle=light;ctx.fillRect(left,0,w,h);

  const vertical=ctx.createLinearGradient(0,0,0,h);
  vertical.addColorStop(0,'rgba(255,255,255,.12)');
  vertical.addColorStop(.30,'rgba(255,255,255,.015)');
  vertical.addColorStop(.72,'rgba(0,0,0,.08)');
  vertical.addColorStop(1,'rgba(0,0,0,.25)');
  ctx.fillStyle=vertical;ctx.fillRect(left,0,w,h);

  // Match-shirt side panels and shoulders.
  const side=ctx.createLinearGradient(left,0,left+205,0);
  side.addColorStop(0,'rgba(0,0,0,.30)');
  side.addColorStop(.7,'rgba(0,0,0,.07)');
  side.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=side;ctx.fillRect(left,0,215,h);
  const sideR=ctx.createLinearGradient(left+w,0,left+w-205,0);
  sideR.addColorStop(0,'rgba(0,0,0,.30)');
  sideR.addColorStop(.7,'rgba(0,0,0,.07)');
  sideR.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=sideR;ctx.fillRect(left+w-215,0,215,h);

  const shoulder=ctx.createLinearGradient(0,0,0,280);
  shoulder.addColorStop(0,'rgba(0,0,0,.18)');
  shoulder.addColorStop(1,'rgba(0,0,0,0)');
  ctx.fillStyle=shoulder;ctx.fillRect(left,0,w,290);

  // V1013: misma trama textil, dibujada mediante un mosaico repetible.
  // Antes se calculaban ~26 000 arcos por textura en el hilo de la interfaz;
  // el patrón de 18 px evita pausas al abrir la tienda o cambiar el dorsal.
  ctx.save();
  ctx.globalAlpha=.10;
  ctx.fillStyle=ctx.createPattern(fabricDotTile(),'repeat');
  ctx.fillRect(left,0,w,h);
  ctx.restore();
  ctx.save();ctx.globalAlpha=.045;
  for(let xx=left+22;xx<left+w;xx+=30){
    ctx.fillStyle='#ffffff';ctx.fillRect(xx,0,1,h);
  }
  ctx.restore();
}

function removeConnectedLogoBackground(canvas,ctx,rect){
  let image;
  try{image=ctx.getImageData(0,0,canvas.width,canvas.height)}catch(_){return}
  const d=image.data,w=canvas.width,h=canvas.height;
  const x0=Math.max(0,Math.floor(rect?.x||0)),y0=Math.max(0,Math.floor(rect?.y||0));
  const x1=Math.min(w-1,Math.ceil((rect?.x||0)+(rect?.w||w))-1);
  const y1=Math.min(h-1,Math.ceil((rect?.y||0)+(rect?.h||h))-1);
  if(x1<=x0||y1<=y0)return;
  const px=(x,y)=>{const i=(y*w+x)*4;return [d[i],d[i+1],d[i+2],d[i+3]]};
  const corners=[px(x0,y0),px(x1,y0),px(x0,y1),px(x1,y1)];
  const opaqueCorners=corners.filter(p=>p[3]>220);
  // PNG/WebP ya transparente: no tocar sus colores internos.
  if(opaqueCorners.length<3)return;
  const palette=[
    px(x0,y0),px(x1,y0),px(x0,y1),px(x1,y1),
    px((x0+x1)>>1,y0),px((x0+x1)>>1,y1),
    px(x0,(y0+y1)>>1),px(x1,(y0+y1)>>1)
  ].filter(p=>p[3]>180);
  if(!palette.length)return;
  const close=i=>{
    if(d[i+3]<=20)return false;
    for(const p of palette){
      const dr=d[i]-p[0],dg=d[i+1]-p[1],db=d[i+2]-p[2];
      if(dr*dr+dg*dg+db*db<82*82)return true;
    }
    return false;
  };
  const seen=new Uint8Array(w*h),q=[];
  const push=(x,y)=>{
    if(x<x0||y<y0||x>x1||y>y1)return;
    const n=y*w+x;if(seen[n])return;
    const i=n*4;if(!close(i))return;
    seen[n]=1;q.push(n);
  };
  for(let x=x0;x<=x1;x++){push(x,y0);push(x,y1)}
  for(let y=y0;y<=y1;y++){push(x0,y);push(x1,y)}
  for(let k=0;k<q.length;k++){
    const n=q[k],x=n%w,y=(n/w)|0,i=n*4;
    d[i+3]=0;
    push(x-1,y);push(x+1,y);push(x,y-1);push(x,y+1);
  }
  ctx.putImageData(image,0,0);
}
function drawLogoIntoFabric(ctx,img,x,y,maxW,maxH){
  // V913: usar el archivo transparente EXACTO tal como fue entregado.
  // No quitar fondos, no recolorear, no aplicar grano, máscaras ni filtros:
  // eso podía borrar el escudo/figura central de logos que ya traen alpha correcto.
  const ratio=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight);
  const w=Math.max(1,img.naturalWidth*ratio),h=Math.max(1,img.naturalHeight*ratio);
  const dx=x+(maxW-w)/2,dy=y+(maxH-h)/2;
  ctx.save();
  ctx.globalAlpha=1;
  ctx.imageSmoothingEnabled=true;
  ctx.imageSmoothingQuality='high';
  ctx.drawImage(img,dx,dy,w,h);
  ctx.restore();
}

function bakeLogo(ctx,url,texture,x,y,w,h){
  if(!url)return;
  const img=new Image();
  try{img.crossOrigin='anonymous'}catch(_){}
  img.decoding='async';
  img.onload=()=>{
    drawLogoIntoFabric(ctx,img,x,y,w,h);
    texture.needsUpdate=true;
    // Cuando termina un escudo asíncrono, actualizar el fotograma detenido.
    texture._ljrWake?.();
  };
  img.onerror=()=>{};
  img.src=String(url);
}
function bakeLeagueLogo(ctx,texture,source=LEAGUE_LOGO){
  // Frente, pecho derecho del jugador (izquierda para quien mira).
  bakeLogo(ctx,source,texture,245,205,205,205);
}
function bakeTeamLogo(ctx,url,texture){
  // Frente, pecho izquierdo del jugador (derecha para quien mira).
  bakeLogo(ctx,url,texture,620,215,190,190);
}
function bakeCategoryLogo(ctx,url,texture){
  // Espalda: escudo de categoría grande, centrado y separado del número.
  bakeLogo(ctx,url,texture,1326,700,420,300);
}

function fabricTexture(name='JAIRO',number='7',base='#0b4bd8',logoUrl='',category='',categoryLogoUrl='',accentColor='',pattern='plain',leagueLogo=LEAGUE_LOGO){
  const c=document.createElement('canvas');
  c.width=2048;c.height=1024;
  const x=c.getContext('2d');
  const color=cleanKitColor(base),accent=cleanKitColor(accentColor||color);

  drawKitHalf(x,0,color,accent,pattern);
  drawKitHalf(x,1024,color,accent,pattern);

  x.textAlign='center';x.textBaseline='middle';

  // Back: player name + number; the category uses its official crest below.
  const cleanName=String(name||'').trim().toUpperCase().slice(0,18)||'JUGADOR';
  const cleanNumber=String(number??'').replace(/\D/g,'').slice(0,2)||'0';
  x.fillStyle='#fff';
  x.shadowColor='rgba(0,0,0,.30)';x.shadowBlur=7;x.shadowOffsetY=4;
  let nameSize=106;
  do{
    x.font='900 '+nameSize+'px Arial Black,Impact,sans-serif';
    if(x.measureText(cleanName).width<790)break;
    nameSize-=6;
  }while(nameSize>54);
  x.fillText(cleanName,1536,205);
  x.font='900 330px Arial Black,Impact,sans-serif';
  x.fillText(cleanNumber,1536,485);

  // No texto de categoría: el escudo oficial ocupa esta zona.
  x.shadowColor='transparent';

  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=8;
  t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
  t.channel=0;
  t.needsUpdate=true;
  bakeLeagueLogo(x,t,leagueLogo);
  bakeTeamLogo(x,logoUrl,t);
  bakeCategoryLogo(x,categoryLogoUrl,t);
  return t;
}

/* Lightweight fallback shown only while the real GLB is being decoded. */
function fallbackTorsoGeometry(){
  const rings=30,segs=48,pos=[],uv=[],idx=[];
  for(let r=0;r<=rings;r++){
    const t=r/rings,y=1.07-t*2.14;
    let rx=t<.22?THREE.MathUtils.lerp(.46,.70,t/.22):THREE.MathUtils.lerp(.70,.61,(t-.22)/.78);
    const rz=THREE.MathUtils.lerp(.29,.34,Math.min(1,t/.5));
    for(let s=0;s<=segs;s++){
      const a=s/segs*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
      const px=ca*rx,pz=sa*rz;
      pos.push(px,y,pz);
      const nx=THREE.MathUtils.clamp((px+.76)/1.52,0,1);
      uv.push(pz>=0?nx*.5:.5+(1-nx)*.5,1-t);
    }
  }
  for(let r=0;r<rings;r++)for(let s=0;s<segs;s++){
    const a=r*(segs+1)+s,b=a+1,c=(r+1)*(segs+1)+s,d=c+1;
    idx.push(a,c,b,b,c,d);
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();
  return g;
}
function fallbackSleeve(side,mat){
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(.20,.30,.68,32,6,true),mat);
  mesh.position.set(side*.69,.78,0);
  mesh.rotation.z=side*.9;
  mesh.rotation.x=-.08;
  mesh.castShadow=mesh.receiveShadow=true;
  return mesh;
}
function buildFallback(texture){
  const group=new THREE.Group();
  const bump=makeFabricBump();
  const material=new THREE.MeshPhysicalMaterial({
    map:texture,bumpMap:bump,bumpScale:.012,roughness:.8,metalness:0,
    clearcoat:.01,clearcoatRoughness:1,side:THREE.DoubleSide
  });
  const torso=new THREE.Mesh(fallbackTorsoGeometry(),material);
  torso.castShadow=torso.receiveShadow=true;group.add(torso);
  group.add(fallbackSleeve(-1,material),fallbackSleeve(1,material));
  const collar=new THREE.Mesh(
    new THREE.TorusGeometry(.33,.045,14,56),
    new THREE.MeshStandardMaterial({color:0x60dcff,roughness:.72})
  );
  collar.rotation.x=Math.PI/2;collar.position.y=1.04;group.add(collar);
  group.scale.setScalar(1.18);
  return {group,materials:[material],texture,bump,uvChannel:0,real:false};
}

function disposeJersey(j){
  if(!j)return;
  const mats=new Set();
  j.group?.traverse?.(o=>{
    if(o.geometry?.dispose)o.geometry.dispose();
    const list=Array.isArray(o.material)?o.material:[o.material];
    list.filter(Boolean).forEach(m=>mats.add(m));
  });
  mats.forEach(m=>{
    for(const key of ['normalMap','aoMap','roughnessMap','metalnessMap','emissiveMap']){
      const t=m[key];
      if(t&&t!==j.texture&&t!==j.bump)t.dispose?.();
    }
    m.dispose?.();
  });
  j.texture?.dispose?.();
  j.bump?.dispose?.();
}

function normalizeRealModel(group){
  group.updateMatrixWorld(true);
  let box=new THREE.Box3().setFromObject(group);
  const size=box.getSize(new THREE.Vector3());
  const center=box.getCenter(new THREE.Vector3());
  const scale=2.72/Math.max(.001,size.y);
  group.scale.setScalar(scale);
  group.position.set(-center.x*scale,-center.y*scale,-center.z*scale);
  group.updateMatrixWorld(true);
  box=new THREE.Box3().setFromObject(group);
  const correctedCenter=box.getCenter(new THREE.Vector3());
  group.position.x-=correctedCenter.x;
  group.position.z-=correctedCenter.z;
  group.position.y-=correctedCenter.y;
  group.updateMatrixWorld(true);
  return new THREE.Box3().setFromObject(group);
}

function projectAtlasToUv1(mesh,bounds){
  const source=mesh.geometry?.getAttribute('position');
  if(!source)return;
  const uv=new Float32Array(source.count*2);
  const v=new THREE.Vector3();
  const spanX=Math.max(.0001,bounds.max.x-bounds.min.x);
  const spanY=Math.max(.0001,bounds.max.y-bounds.min.y);
  const midZ=(bounds.min.z+bounds.max.z)*.5;
  for(let i=0;i<source.count;i++){
    v.fromBufferAttribute(source,i).applyMatrix4(mesh.matrixWorld);
    const nx=THREE.MathUtils.clamp((v.x-bounds.min.x)/spanX,0,1);
    const ny=THREE.MathUtils.clamp((v.y-bounds.min.y)/spanY,0,1);
    const u=v.z>=midZ?nx*.5:.5+(1-nx)*.5;
    uv[i*2]=u;uv[i*2+1]=ny;
  }
  mesh.geometry.setAttribute('uv1',new THREE.BufferAttribute(uv,2));
}

function materialForRealModel(source,atlas,bump){
  const m=source?.clone?.()||new THREE.MeshStandardMaterial();
  m.map=atlas;
  if(m.color)m.color.set(0xffffff);
  m.metalness=0;
  m.roughness=.82;
  m.side=THREE.DoubleSide;
  if(m.normalMap){
    m.normalMap.channel=0;
    if(m.normalScale?.set)m.normalScale.set(.72,.72);
  }
  if(m.aoMap){
    m.aoMap.channel=0;
    m.aoMapIntensity=.72;
  }
  if(m.roughnessMap)m.roughnessMap.channel=0;
  bump.channel=0;
  m.bumpMap=bump;
  m.bumpScale=.0055;
  m.needsUpdate=true;
  return m;
}

async function ensureRealisticModel(){
  if(window.SHIRT_GLB)return;
  // Important on Android/APK: this model is ~1.4 MB as an embedded GLB.
  // Load it only when the user actually opens the jersey editor so the whole app
  // never blocks on parsing the 3D asset during startup.
  await import('./v893-realistic-football-shirt-model.js');
  if(!window.SHIRT_GLB)throw new Error('Modelo realista no disponible');
}

async function buildRealJersey(current){
  await ensureRealisticModel();
  const gltf=await new Promise((resolve,reject)=>{
    new GLTFLoader().load(window.SHIRT_GLB,resolve,undefined,reject);
  });
  const group=gltf.scene;
  group.traverse(o=>{
    if(o.isMesh&&o.geometry)o.geometry=o.geometry.clone();
  });
  const bounds=normalizeRealModel(group);
  const texture=fabricTexture(current.name,current.number,current.color,current.logo,current.category,current.categoryLogo,current.accentColor,current.pattern,current.leagueLogo);
  texture.channel=1;
  const bump=makeFabricBump();
  const materials=[];
  group.traverse(o=>{
    if(!o.isMesh)return;
    projectAtlasToUv1(o,bounds);
    const originals=Array.isArray(o.material)?o.material:[o.material];
    const next=originals.map(src=>materialForRealModel(src,texture,bump));
    o.material=Array.isArray(o.material)?next:next[0];
    materials.push(...next);
    o.castShadow=true;o.receiveShadow=true;
  });
  group.rotation.x=-.015;
  group.position.y=.015;
  group.updateMatrixWorld(true);
  return {group,materials,texture,bump,uvChannel:1,real:true};
}

function updateJerseyTexture(jersey,current,onTextureReady){
  if(!jersey)return;
  const next=fabricTexture(current.name,current.number,current.color,current.logo,current.category,current.categoryLogo,current.accentColor,current.pattern,current.leagueLogo);
  next.channel=jersey.uvChannel||0;
  next._ljrWake=onTextureReady;
  jersey.materials.forEach(m=>{m.map=next;m.needsUpdate=true});
  jersey.texture?.dispose?.();
  jersey.texture=next;
}

function createInstance(host,opts={}){
  const width=Math.max(280,host.clientWidth||360);
  const height=Math.max(390,host.clientHeight||460);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(RENDER_DPR);
  renderer.setSize(width,height,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.04;
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.replaceChildren(renderer.domElement);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(30,width/height,.1,100);
  camera.position.set(0,.02,4.62);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;
  controls.minDistance=3.05;controls.maxDistance=6.3;
  controls.minPolarAngle=Math.PI*.27;controls.maxPolarAngle=Math.PI*.73;
  controls.target.set(0,0,0);controls.autoRotate=false;controls.autoRotateSpeed=1.75;

  // Neutral studio light so the cloth normal map reads like fabric, not plastic.
  scene.add(new THREE.HemisphereLight(0xf4f7ff,0x071334,1.45));
  const key=new THREE.DirectionalLight(0xffffff,3.0);key.position.set(3.8,4.6,4.8);key.castShadow=true;scene.add(key);
  const fill=new THREE.DirectionalLight(0xbfd9ff,1.35);fill.position.set(-4.2,2.2,4.1);scene.add(fill);
  const rim=new THREE.DirectionalLight(0x52bfff,1.9);rim.position.set(-3.5,2.5,-4.5);scene.add(rim);
  const rear=new THREE.DirectionalLight(0x3156ff,.8);rear.position.set(3,-.2,-4);scene.add(rear);

  let current={name:opts.name||'JAIRO',number:opts.number||'7',color:cleanKitColor(opts.color||'#0b4bd8'),accentColor:cleanKitColor(opts.accentColor||opts.color||'#0b4bd8'),pattern:String(opts.pattern||'plain'),team:opts.team||'',logo:opts.logo||'',category:opts.category||'',categoryLogo:opts.categoryLogo||'',leagueLogo:opts.leagueLogo||LEAGUE_LOGO};
  let jersey=buildFallback(fabricTexture(current.name,current.number,current.color,current.logo,current.category,current.categoryLogo,current.accentColor,current.pattern,current.leagueLogo));
  scene.add(jersey.group);

  const floor=new THREE.Mesh(
    new THREE.CircleGeometry(1.65,64),
    new THREE.ShadowMaterial({color:0x000000,opacity:.20})
  );
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.39;floor.receiveShadow=true;scene.add(floor);

  /* V1013: renderizar únicamente mientras el usuario gira/interactúa y en
     cambios de textura/cámara. El lienzo preserva el último fotograma. */
  let alive=true,raf=0,visible=true,lastFrame=0,settleUntil=0,dirty=2;
  let updateTimer=0;
  let paintedKey=fabricKey(current);
  let lastSize=width+'x'+height;
  const isVisible=()=>alive&&visible&&!document.hidden;
  function draw(time){
    raf=0;
    if(!alive)return;
    if(!host.isConnected){api.destroy();return}
    if(!isVisible())return;
    if(time-lastFrame>=FRAME_INTERVAL || !lastFrame){
      controls.update();
      renderer.render(scene,camera);
      lastFrame=time;
      if(dirty>0)dirty--;
    }
    if(controls.autoRotate||dirty>0||time<settleUntil)raf=requestAnimationFrame(draw);
  }
  function wake(ms=400){
    if(!isVisible())return;
    dirty=Math.max(dirty,2);
    settleUntil=Math.max(settleUntil,performance.now()+ms);
    if(!raf)raf=requestAnimationFrame(draw);
  }
  jersey.texture._ljrWake=()=>wake(450);
  const onControlsStart=()=>wake(1200);
  const onControlsChange=()=>wake(550);
  const onControlsEnd=()=>wake(750);
  controls.addEventListener('start',onControlsStart);
  controls.addEventListener('change',onControlsChange);
  controls.addEventListener('end',onControlsEnd);
  const onVisibility=()=>{
    if(document.hidden){cancelAnimationFrame(raf);raf=0}
    else wake(350);
  };
  document.addEventListener('visibilitychange',onVisibility,{passive:true});
  const io=typeof IntersectionObserver==='function'
    ?new IntersectionObserver(entries=>{
      const shown=entries.some(e=>e.isIntersecting);
      visible=shown;
      if(shown)wake(400);
      else{cancelAnimationFrame(raf);raf=0}
    },{threshold:.01,rootMargin:'100px 0px'}):null;
  io?.observe(host);
  const onRouteChange=()=>setTimeout(()=>{if(!host.isConnected)api.destroy()},300);
  window.addEventListener('hashchange',onRouteChange);

  /* GLB y textura: crear la variante real una sola vez.
     Si no cambió ningún dato mientras cargaba, no volver a hornear 2 MP. */
  const initialStyle={...current},initialKey=fabricKey(initialStyle);
  buildRealJersey(initialStyle).then(real=>{
    if(!alive){disposeJersey(real);return}
    clearTimeout(updateTimer);
    const old=jersey;
    scene.remove(old.group);
    jersey=real;scene.add(real.group);
    if(fabricKey(current)!==initialKey)updateJerseyTexture(real,current,()=>wake(450));
    else real.texture._ljrWake=()=>wake(450);
    paintedKey=fabricKey(current);
    disposeJersey(old);
    wake(600);
  }).catch(err=>console.warn('Jersey 3D realista: se conserva el respaldo local.',err));

  const resize=()=>{
    const w=Math.max(280,host.clientWidth||360),h=Math.max(390,host.clientHeight||460);
    const size=w+'x'+h;
    if(size===lastSize)return;
    lastSize=size;
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
    wake(200);
  };
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;
  ro?.observe(host);
  const api={
    update(data={}){
      const next={...current,...data,color:cleanKitColor(data.color??current.color),accentColor:cleanKitColor(data.accentColor??current.accentColor??data.color??current.color),pattern:String(data.pattern??current.pattern??'plain')};
      if(fabricKey(next)===fabricKey(current))return;
      current=next;
      clearTimeout(updateTimer);
      // Al escribir nombre/dorsal, un único horneado cuando cesa la escritura.
      updateTimer=setTimeout(()=>{
        if(!alive)return;
        updateJerseyTexture(jersey,current,()=>wake(450));
        paintedKey=fabricKey(current);
        wake(450);
      },135);
    },
    front(){
      controls.autoRotate=false;controls.reset();
      camera.position.set(0,.02,4.62);controls.target.set(0,0,0);controls.update();
      wake(800);
    },
    back(){
      controls.autoRotate=false;controls.reset();
      camera.position.set(0,.02,-4.62);controls.target.set(0,0,0);controls.update();
      wake(800);
    },
    toggleSpin(){
      controls.autoRotate=!controls.autoRotate;
      wake(400);
      return controls.autoRotate;
    },
    snapshot(){
      clearTimeout(updateTimer);
      if(paintedKey!==fabricKey(current)){
        updateJerseyTexture(jersey,current,()=>wake(450));
        paintedKey=fabricKey(current);
      }
      controls.update();renderer.render(scene,camera);
      const a=document.createElement('a');
      a.download='camiseta-3d-liga-juventino.png';
      a.href=renderer.domElement.toDataURL('image/png');
      a.click();
      wake(150);
    },
    destroy(){
      if(!alive)return;
      alive=false;
      clearTimeout(updateTimer);cancelAnimationFrame(raf);
      io?.disconnect();ro?.disconnect();
      document.removeEventListener('visibilitychange',onVisibility);
      window.removeEventListener('hashchange',onRouteChange);
      controls.removeEventListener('start',onControlsStart);
      controls.removeEventListener('change',onControlsChange);
      controls.removeEventListener('end',onControlsEnd);
      controls.dispose();
      disposeJersey(jersey);
      floor.geometry.dispose();floor.material.dispose();
      renderer.dispose();renderer.forceContextLoss?.();
      host.replaceChildren();INSTANCES.delete(host);
    }
  };
  wake(750);
  INSTANCES.set(host,api);
  return api;
}

function mount(host,opts={}){
  if(!host)return null;
  INSTANCES.get(host)?.destroy?.();
  return createInstance(host,opts);
}
function apiFor(host){return INSTANCES.get(host)||null}
function update(host,data){apiFor(host)?.update(data)}
window.LJR_FOOTBALL_SHIRT_3D={mount,update,apiFor};
