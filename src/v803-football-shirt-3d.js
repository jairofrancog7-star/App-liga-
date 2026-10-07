/*
V803 — Football Shirt 3D Configurator
Own integration for Liga Juventino, built with Three.js.
Geometry/UV approach informed by the MIT-licensed Mini Jersey 3D Studio:
https://github.com/FrancescoCastaldi/mini-jersey-studio
See THIRD_PARTY_NOTICES.md.
*/
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const INSTANCES=new WeakMap();

function makeFabricBump(){
  const c=document.createElement('canvas');
  c.width=c.height=512;
  const x=c.getContext('2d');
  x.fillStyle='#7f7f7f';x.fillRect(0,0,c.width,c.height);
  for(let y=0;y<c.height;y+=4){
    x.fillStyle=(y/4)%2?'#9b9b9b':'#666';
    x.fillRect(0,y,c.width,1);
  }
  for(let xx=0;xx<c.width;xx+=4){
    x.fillStyle=(xx/4)%2?'#8d8d8d':'#727272';
    x.fillRect(xx,0,1,c.height);
  }
  x.globalAlpha=.35;
  for(let y=2;y<c.height;y+=8)for(let xx=2;xx<c.width;xx+=8){
    x.fillStyle=((xx+y)/8)%2?'#b1b1b1':'#555';
    x.fillRect(xx,y,2,2);
  }
  x.globalAlpha=1;
  const t=new THREE.CanvasTexture(c);
  t.wrapS=t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(18,11);
  t.anisotropy=8;
  t.colorSpace=THREE.NoColorSpace;
  t.needsUpdate=true;
  return t;
}

function fabricTexture(name='JAIRO',number='7',base='#0b49de'){
  const c=document.createElement('canvas');
  c.width=2048;c.height=1024;
  const x=c.getContext('2d');
  const grad=x.createLinearGradient(0,0,0,c.height);
  grad.addColorStop(0,'#1558ff');grad.addColorStop(.48,base);grad.addColorStop(1,'#062a9a');
  x.fillStyle=grad;x.fillRect(0,0,c.width,c.height);

  // Subtle woven fabric in HD.
  x.globalAlpha=.12;
  for(let y=0;y<c.height;y+=6){
    x.fillStyle=(y/6)%2?'#ffffff':'#001c73';
    x.fillRect(0,y,c.width,1);
  }
  for(let xx=0;xx<c.width;xx+=8){
    x.fillStyle='#7db7ff';x.fillRect(xx,0,1,c.height);
  }
  x.globalAlpha=1;

  // Front half: small Liga mark.
  x.textAlign='center';x.textBaseline='middle';
  x.fillStyle='rgba(255,255,255,.94)';
  x.font='900 76px Arial Black, Impact, sans-serif';
  x.fillText('LJR',512,300);

  // Back half: name and number are baked into the material itself.
  const cleanName=String(name||'').trim().toUpperCase().slice(0,18)||'JUGADOR';
  const cleanNumber=String(number??'').replace(/\D/g,'').slice(0,2)||'0';
  x.fillStyle='#ffffff';
  x.shadowColor='rgba(0,0,0,.34)';x.shadowBlur=10;x.shadowOffsetY=8;
  let nameSize=112;
  do{
    x.font='900 '+nameSize+'px Arial Black, Impact, sans-serif';
    if(x.measureText(cleanName).width<820)break;
    nameSize-=6;
  }while(nameSize>56);
  x.fillText(cleanName,1536,270);
  x.font='900 410px Arial Black, Impact, sans-serif';
  x.fillText(cleanNumber,1536,610);
  x.shadowColor='transparent';

  const t=new THREE.CanvasTexture(c);
  t.colorSpace=THREE.SRGBColorSpace;
  t.anisotropy=8;
  t.wrapS=t.wrapT=THREE.ClampToEdgeWrapping;
  t.needsUpdate=true;
  return t;
}

function torsoGeometry(){
  const rings=42,segs=72,pos=[],uv=[],idx=[];
  for(let r=0;r<=rings;r++){
    const t=r/rings;
    const y=1.08-t*2.15;
    let rx,rz;
    if(t<.20){const p=t/.20;rx=THREE.MathUtils.lerp(.43,.72,p);rz=THREE.MathUtils.lerp(.27,.39,p)}
    else if(t<.68){const p=(t-.20)/.48;rx=THREE.MathUtils.lerp(.72,.59,p);rz=THREE.MathUtils.lerp(.39,.33,p)}
    else{const p=(t-.68)/.32;rx=THREE.MathUtils.lerp(.59,.64,p);rz=THREE.MathUtils.lerp(.33,.36,p)}
    for(let s=0;s<=segs;s++){
      const a=s/segs*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
      const lower=t>.44?(t-.44)/.56:0;
      const wrinkle=(.003+.014*lower)*Math.sin(t*39+a*4.4)+(.002+.007*lower)*Math.sin(t*21-a*6.2);
      const px=ca*(rx+wrinkle);
      let pz=sa*(rz+wrinkle*.45);
      if(sa>0&&t>.16&&t<.56)pz+=.038*Math.sin((t-.16)/.40*Math.PI);
      pos.push(px,y,pz);
      const nx=THREE.MathUtils.clamp((px+.78)/1.56,0,1);
      const v=THREE.MathUtils.clamp(1-t,0,1);
      // Front uses left half of texture; back uses right half and mirrors X.
      const u=pz>=0 ? nx*.5 : .5+(1-nx)*.5;
      uv.push(u,v);
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

function sleeve(side,mat,cuffMat){
  const group=new THREE.Group();
  const geo=new THREE.CylinderGeometry(.21,.31,.70,44,10,true);
  const mesh=new THREE.Mesh(geo,mat);
  mesh.castShadow=mesh.receiveShadow=true;
  group.add(mesh);
  const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.218,.218,.052,44),cuffMat);
  cuff.position.y=-.35;group.add(cuff);
  group.position.set(side*.69,.78,-.005);
  group.rotation.z=side*.89;
  group.rotation.x=-.08;
  group.rotation.y=side*.05;
  return group;
}

function buildJersey(texture){
  const g=new THREE.Group();
  const bump=makeFabricBump();
  const fabric=new THREE.MeshPhysicalMaterial({
    map:texture,bumpMap:bump,bumpScale:.018,
    roughness:.76,metalness:0,clearcoat:.025,clearcoatRoughness:.9,
    sheen:.38,sheenColor:new THREE.Color(0x75a9ff),sheenRoughness:.82,
    side:THREE.DoubleSide
  });
  const solid=new THREE.MeshPhysicalMaterial({
    color:0x0b49de,bumpMap:bump,bumpScale:.016,
    roughness:.78,metalness:0,clearcoat:.02,clearcoatRoughness:.92,
    sheen:.34,sheenColor:new THREE.Color(0x6aa0ff),sheenRoughness:.84,
    side:THREE.DoubleSide
  });
  const trim=new THREE.MeshPhysicalMaterial({color:0x52dcff,roughness:.48,metalness:.01,clearcoat:.08,clearcoatRoughness:.55});

  const torso=new THREE.Mesh(torsoGeometry(),fabric);
  torso.castShadow=torso.receiveShadow=true;torso.name='FootballJerseyTorso';g.add(torso);
  g.add(sleeve(-1,solid,trim),sleeve(1,solid,trim));

  const collar=new THREE.Mesh(new THREE.TorusGeometry(.34,.055,18,64),trim);
  collar.rotation.x=Math.PI/2;collar.position.y=1.05;collar.position.z=.01;g.add(collar);

  const hem=new THREE.Mesh(new THREE.TorusGeometry(.60,.022,10,64),trim);
  hem.rotation.x=Math.PI/2;hem.scale.z=.55;hem.position.y=-1.05;g.add(hem);

  // Shoulder + side stitching for a more realistic football-kit finish.
  const seamMat=new THREE.MeshStandardMaterial({color:0x59c7ff,roughness:.62,metalness:0});
  for(const side of [-1,1]){
    const shoulder=new THREE.CatmullRomCurve3([
      new THREE.Vector3(side*.34,1.02,.31),
      new THREE.Vector3(side*.53,.93,.33),
      new THREE.Vector3(side*.68,.73,.265)
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(shoulder,28,.010,8,false),seamMat));
    const sideSeam=new THREE.CatmullRomCurve3([
      new THREE.Vector3(side*.63,.62,.02),
      new THREE.Vector3(side*.59,.08,.015),
      new THREE.Vector3(side*.60,-.54,.012),
      new THREE.Vector3(side*.63,-1.04,.01)
    ]);
    g.add(new THREE.Mesh(new THREE.TubeGeometry(sideSeam,32,.006,8,false),seamMat));
  }
  g.scale.setScalar(1.19);
  g.rotation.x=.015;
  return {group:g,fabric,solid,texture,bump};
}

function createInstance(host,opts={}){
  const width=Math.max(280,host.clientWidth||360);
  const height=Math.max(390,host.clientHeight||460);
  const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
  renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
  renderer.setSize(width,height,false);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure=1.08;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  host.replaceChildren(renderer.domElement);

  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(31,width/height,.1,100);
  camera.position.set(0,.02,4.55);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;
  controls.minDistance=3.0;controls.maxDistance=6.4;
  controls.target.set(0,0,0);controls.autoRotate=false;controls.autoRotateSpeed=2.0;

  scene.add(new THREE.HemisphereLight(0xe9f2ff,0x06103a,1.75));
  const key=new THREE.DirectionalLight(0xffffff,3.2);key.position.set(3.2,4.8,4.6);key.castShadow=true;scene.add(key);
  const rim=new THREE.DirectionalLight(0x35dfff,2.35);rim.position.set(-3.4,1,-4.1);scene.add(rim);
  const fill=new THREE.DirectionalLight(0x9ac7ff,1.55);fill.position.set(-3.8,2.4,4.2);scene.add(fill);
  const backLight=new THREE.DirectionalLight(0x264cff,1.1);backLight.position.set(2,.1,-4.4);scene.add(backLight);

  let current={name:opts.name||'JAIRO',number:opts.number||'7'};
  let tex=fabricTexture(current.name,current.number);
  let jersey=buildJersey(tex);scene.add(jersey.group);

  const floor=new THREE.Mesh(
    new THREE.CircleGeometry(1.8,64),
    new THREE.ShadowMaterial({color:0x000000,opacity:.22})
  );
  floor.rotation.x=-Math.PI/2;floor.position.y=-1.35;floor.receiveShadow=true;scene.add(floor);

  let alive=true,raf=0;
  const render=()=>{if(!alive)return;controls.update();renderer.render(scene,camera);raf=requestAnimationFrame(render)};
  render();

  const resize=()=>{
    const w=Math.max(280,host.clientWidth||360),h=Math.max(390,host.clientHeight||460);
    camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h,false);
  };
  const ro=new ResizeObserver(resize);ro.observe(host);

  const api={
    update(data={}){
      current={...current,...data};
      const next=fabricTexture(current.name,current.number);
      jersey.fabric.map?.dispose();jersey.fabric.map=next;jersey.fabric.needsUpdate=true;
      jersey.texture=next;
    },
    front(){controls.reset();camera.position.set(0,.02,4.55);controls.target.set(0,0,0);controls.update()},
    back(){controls.reset();camera.position.set(0,.02,-4.55);controls.target.set(0,0,0);controls.update()},
    toggleSpin(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate},
    snapshot(){
      renderer.render(scene,camera);
      const a=document.createElement('a');a.download='camiseta-3d-liga-juventino.png';a.href=renderer.domElement.toDataURL('image/png');a.click();
    },
    destroy(){
      alive=false;cancelAnimationFrame(raf);ro.disconnect();controls.dispose();
      jersey.texture?.dispose();jersey.bump?.dispose();renderer.dispose();host.replaceChildren();INSTANCES.delete(host);
    }
  };
  INSTANCES.set(host,api);return api;
}

function mount(host,opts={}){
  if(!host)return null;
  INSTANCES.get(host)?.destroy?.();
  return createInstance(host,opts);
}
function apiFor(host){return INSTANCES.get(host)||null}
function update(host,data){apiFor(host)?.update(data)}
window.LJR_FOOTBALL_SHIRT_3D={mount,update,apiFor};
