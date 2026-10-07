/*
V893 — Realistic Football Jersey 3D
Only the jersey model/rendering is changed in this revision.
The primary mesh is the MIT-licensed classic shirt GLB from Mini Jersey 3D Studio
(Francesco Castaldi). It keeps its original normal/occlusion detail while the
Liga texture is projected on a separate UV channel. See THIRD_PARTY_NOTICES.md.
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const INSTANCES=new WeakMap();
const LEAGUE_LOGO='./assets/liga-logo.webp';

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

function drawKitHalf(ctx,left,base){
  const w=1024,h=1024,color=cleanKitColor(base);
  ctx.fillStyle=color;ctx.fillRect(left,0,w,h);

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

  // Fine breathable fabric texture across the entire shirt.
  ctx.save();
  ctx.globalAlpha=.10;
  for(let y=4;y<h;y+=9){
    for(let xx=left+4;xx<left+w;xx+=9){
      ctx.fillStyle=((xx+y)/9)%2<1?'#ffffff':'#000000';
      ctx.beginPath();ctx.arc(xx,y,.68,0,Math.PI*2);ctx.fill();
    }
  }
  ctx.restore();
  ctx.save();ctx.globalAlpha=.045;
  for(let xx=left+22;xx<left+w;xx+=30){
    ctx.fillStyle='#ffffff';ctx.fillRect(xx,0,1,h);
  }
  ctx.restore();
}

function drawLogoIntoFabric(ctx,img,x,y,maxW,maxH){
  const ratio=Math.min(maxW/img.naturalWidth,maxH/img.naturalHeight);
  const w=Math.max(1,img.naturalWidth*ratio),h=Math.max(1,img.naturalHeight*ratio);
  const badge=document.createElement('canvas');
  badge.width=Math.ceil(maxW);badge.height=Math.ceil(maxH);
  const b=badge.getContext('2d');
  const bx=(badge.width-w)/2,by=(badge.height-h)/2;
  b.drawImage(img,bx,by,w,h);

  // Put the textile grain inside the crest alpha itself so it reads as sublimated/printed,
  // not as a flat DOM image hovering over the jersey.
  b.globalCompositeOperation='source-atop';
  b.globalAlpha=.10;
  for(let yy=1;yy<badge.height;yy+=7){
    b.fillStyle=yy%14?'#ffffff':'#000000';
    b.fillRect(0,yy,badge.width,1);
  }
  b.globalAlpha=.055;
  for(let xx=2;xx<badge.width;xx+=8){
    b.fillStyle='#000000';b.fillRect(xx,0,1,badge.height);
  }
  b.globalAlpha=1;b.globalCompositeOperation='source-over';

  ctx.save();
  ctx.globalAlpha=.97;
  ctx.shadowColor='rgba(0,0,0,.18)';
  ctx.shadowBlur=2;ctx.shadowOffsetY=1;
  ctx.drawImage(badge,x,y,maxW,maxH);
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
  };
  img.onerror=()=>{};
  img.src=String(url);
}
function bakeTeamLogo(ctx,url,texture){
  // Escudo del equipo: pecho izquierdo del jugador (derecha para quien mira).
  bakeLogo(ctx,url,texture,620,224,165,165);
}
function bakeLeagueLogo(ctx,texture){
  // Logo oficial de la Liga: pecho derecho del jugador (izquierda para quien mira).
  bakeLogo(ctx,LEAGUE_LOGO,texture,250,222,170,170);
}

function fabricTexture(name='JAIRO',number='7',base='#0b4bd8',logoUrl='',category=''){
  const c=document.createElement('canvas');
  c.width=2048;c.height=1024;
  const x=c.getContext('2d');
  const color=cleanKitColor(base);

  drawKitHalf(x,0,color);
  drawKitHalf(x,1024,color);

  x.textAlign='center';x.textBaseline='middle';

  // Back: player name + number + categoría, sublimated into the cloth.
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
  x.fillText(cleanName,1536,270);
  x.font='900 390px Arial Black,Impact,sans-serif';
  x.fillText(cleanNumber,1536,610);

  const cleanCategory=String(category||'').trim().toUpperCase().slice(0,28);
  if(cleanCategory){
    x.font='900 58px Arial Black,Impact,sans-serif';
    let categorySize=58;
    do{
      x.font='900 '+categorySize+'px Arial Black,Impact,sans-serif';
      if(x.measureText(cleanCategory).width<760)break;
      categorySize-=4;
    }while(categorySize>34);
    x.fillText(cleanCategory,1536,900);
  }
  x.shadowColor='transparent';

  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=8;
  t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
  t.channel=0;
  t.needsUpdate=true;
  bakeTeamLogo(x,logoUrl,t);
  bakeLeagueLogo(x,t);
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
  const texture=fabricTexture(current.name,current.number,current.color,current.logo,current.category);
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

function updateJerseyTexture(jersey,current){
  if(!jersey)return;
  const next=fabricTexture(current.name,current.number,current.color,current.logo,current.category);
  next.channel=jersey.uvChannel||0;
  jersey.materials.forEach(m=>{m.map=next;m.needsUpdate=true});
  jersey.texture?.dispose?.();
  jersey.texture=next;
}

function createInstance(host,opts={}){
  const width=Math.max(280,host.clientWidth||360);
  const height=Math.max(390,host.clientHeight||460);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true,powerPreference:'high-performance'});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
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

  let current={name:opts.name||'JAIRO',number:opts.number||'7',color:cleanKitColor(opts.color||'#0b4bd8'),team:opts.team||'',logo:opts.logo||'',category:opts.category||''};
  let jersey=buildFallback(fabricTexture(current.name,current.number,current.color,current.logo,current.category));
  scene.add(jersey.group);

  const floor=new THREE.Mesh(
    new THREE.CircleGeometry(1.65,64),
    new THREE.ShadowMaterial({color:0x000000,opacity:.20})
  );
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.39;floor.receiveShadow=true;scene.add(floor);

  let alive=true,raf=0;
  const render=()=>{if(!alive)return;controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(render)};
  render();

  // Decode the local high-detail GLB and replace only the jersey mesh.
  buildRealJersey(current).then(real=>{
    if(!alive){disposeJersey(real);return}
    const old=jersey;
    scene.remove(old.group);
    jersey=real;
    scene.add(real.group);
    // If the user changed color/team while the GLB was decoding, apply the latest choice.
    updateJerseyTexture(real,current);
    disposeJersey(old);
  }).catch(err=>console.warn('Jersey 3D realista: se conserva el respaldo local.',err));

  const resize=()=>{
    const w=Math.max(280,host.clientWidth||360),h=Math.max(390,host.clientHeight||460);
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  };
  const ro=new ResizeObserver(resize);ro.observe(host);

  const api={
    update(data={}){
      current={...current,...data,color:cleanKitColor(data.color??current.color)};
      updateJerseyTexture(jersey,current);
    },
    front(){
      controls.autoRotate=false;controls.reset();
      camera.position.set(0,.02,4.62);controls.target.set(0,0,0);controls.update();
    },
    back(){
      controls.autoRotate=false;controls.reset();
      camera.position.set(0,.02,-4.62);controls.target.set(0,0,0);controls.update();
    },
    toggleSpin(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate},
    snapshot(){
      renderer.render(scene,camera);
      const a=document.createElement('a');
      a.download='camiseta-3d-liga-juventino.png';
      a.href=renderer.domElement.toDataURL('image/png');
      a.click();
    },
    destroy(){
      alive=false;cancelAnimationFrame(raf);ro.disconnect();controls.dispose();
      disposeJersey(jersey);
      floor.geometry.dispose();floor.material.dispose();
      renderer.dispose();host.replaceChildren();INSTANCES.delete(host);
    }
  };
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
