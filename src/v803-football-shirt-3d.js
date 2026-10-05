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
  const rings=28,segs=48,pos=[],uv=[],idx=[];
  for(let r=0;r<=rings;r++){
    const t=r/rings;
    const y=1.08-t*2.15;
    let rx,rz;
    if(t<.20){const p=t/.20;rx=THREE.MathUtils.lerp(.43,.72,p);rz=THREE.MathUtils.lerp(.27,.39,p)}
    else if(t<.68){const p=(t-.20)/.48;rx=THREE.MathUtils.lerp(.72,.59,p);rz=THREE.MathUtils.lerp(.39,.33,p)}
    else{const p=(t-.68)/.32;rx=THREE.MathUtils.lerp(.59,.64,p);rz=THREE.MathUtils.lerp(.33,.36,p)}
    for(let s=0;s<=segs;s++){
      const a=s/segs*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a);
      const px=ca*rx;
      let pz=sa*rz;
      if(sa>0&&t>.16&&t<.56)pz+=.035*Math.sin((t-.16)/.40*Math.PI);
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
  const geo=new THREE.CylinderGeometry(.23,.30,.74,32,8,true);
  const mesh=new THREE.Mesh(geo,mat);
  mesh.castShadow=mesh.receiveShadow=true;
  group.add(mesh);
  const cuff=new THREE.Mesh(new THREE.CylinderGeometry(.232,.232,.055,32),cuffMat);
  cuff.position.y=-.37;group.add(cuff);
  group.position.set(side*.68,.77,0);
  group.rotation.z=side*.88;
  group.rotation.x=-.05;
  return group;
}

function buildJersey(texture){
  const g=new THREE.Group();
  const fabric=new THREE.MeshPhysicalMaterial({
    map:texture,roughness:.68,metalness:.02,clearcoat:.08,clearcoatRoughness:.8,
    side:THREE.DoubleSide
  });
  const solid=new THREE.MeshPhysicalMaterial({
    color:0x0b49de,roughness:.66,metalness:.02,clearcoat:.07,side:THREE.DoubleSide
  });
  const trim=new THREE.MeshStandardMaterial({color:0x44d8ff,roughness:.48,metalness:.05});

  const torso=new THREE.Mesh(torsoGeometry(),fabric);
  torso.castShadow=torso.receiveShadow=true;torso.name='FootballJerseyTorso';g.add(torso);
  g.add(sleeve(-1,solid,trim),sleeve(1,solid,trim));

  const collar=new THREE.Mesh(new THREE.TorusGeometry(.34,.055,18,64),trim);
  collar.rotation.x=Math.PI/2;collar.position.y=1.05;collar.position.z=.01;g.add(collar);

  const hem=new THREE.Mesh(new THREE.TorusGeometry(.60,.022,10,64),trim);
  hem.rotation.x=Math.PI/2;hem.scale.z=.55;hem.position.y=-1.05;g.add(hem);

  // Shoulder piping for a more realistic football-kit finish.
  const seamMat=new THREE.MeshStandardMaterial({color:0x2ac5ff,roughness:.5});
  for(const side of [-1,1]){
    const curve=new THREE.CatmullRomCurve3([
      new THREE.Vector3(side*.34,1.02,.31),
      new THREE.Vector3(side*.53,.93,.33),
      new THREE.Vector3(side*.67,.73,.26)
    ]);
    const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,24,.012,8,false),seamMat);
    g.add(tube);
  }
  g.scale.setScalar(1.18);
  return {group:g,fabric,solid,texture};
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
  const camera=new THREE.PerspectiveCamera(35,width/height,.1,100);
  camera.position.set(0,.02,4.7);
  const controls=new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;controls.dampingFactor=.07;controls.enablePan=false;
  controls.minDistance=3.0;controls.maxDistance=6.4;
  controls.target.set(0,0,0);controls.autoRotate=false;controls.autoRotateSpeed=2.0;

  scene.add(new THREE.HemisphereLight(0xdde9ff,0x06143f,2.3));
  const key=new THREE.DirectionalLight(0xffffff,3.5);key.position.set(3.5,4.5,5);key.castShadow=true;scene.add(key);
  const rim=new THREE.DirectionalLight(0x3bcaff,2.4);rim.position.set(-4,1,-4);scene.add(rim);
  const fill=new THREE.DirectionalLight(0x5377ff,1.8);fill.position.set(-2,-1,4);scene.add(fill);

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
    front(){controls.reset();camera.position.set(0,.02,4.7);controls.target.set(0,0,0);controls.update()},
    back(){controls.reset();camera.position.set(0,.02,-4.7);controls.target.set(0,0,0);controls.update()},
    toggleSpin(){controls.autoRotate=!controls.autoRotate;return controls.autoRotate},
    snapshot(){
      renderer.render(scene,camera);
      const a=document.createElement('a');a.download='camiseta-3d.png';a.href=renderer.domElement.toDataURL('image/png');a.click();
    },
    destroy(){
      alive=false;cancelAnimationFrame(raf);ro.disconnect();controls.dispose();
      jersey.texture?.dispose();renderer.dispose();host.replaceChildren();INSTANCES.delete(host);
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
