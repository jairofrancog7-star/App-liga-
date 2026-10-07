/* V837 — one cached complete raster for each club, shared by Fantasy and Store.
   Alpha belongs to the downloaded silhouette. Never infer background from fabric. */
(function(){
'use strict';
const images=new Map(),art=new Map(),complete=new Map(),pending=new WeakMap();
const assets=()=>window.LJR_JERSEY_ASSETS;
function image(src){
 if(images.has(src))return images.get(src);
 const p=new Promise(resolve=>{
  const im=new Image();im.decoding='async';const timer=setTimeout(()=>resolve(null),6000);
  im.onload=()=>{clearTimeout(timer);resolve(im)};im.onerror=()=>{clearTimeout(timer);resolve(null)};im.src=src;
 });images.set(src,p);return p;
}
function normalize(im,item){
 const canvas=document.createElement('canvas');canvas.width=512;canvas.height=576;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 const [left,top,right,bottom]=item.bounds;
 const scale=Math.min(496/(right-left),560/(bottom-top));
 const w=(right-left)*scale,h=(bottom-top)*scale,x=(512-w)/2,y=576-h;
 ctx.drawImage(im,left,top,right-left,bottom-top,x,y,w,h);
 return {canvas,ctx,scale,x,y,left,top};
}
function printCrest(surface,logo,item){
 const {canvas,ctx,scale,x,y,left,top}=surface;
 const cx=x+(item.width*item.badgeX-left)*scale,cy=y+(item.height*item.badgeY-top)*scale;
 // Per-shirt measurements take precedence; a large minimum made flat cloth patches.
 const bw=(item.badgeWidth||88)*scale,bh=(item.badgeHeight||110)*scale;
 // Erase every original club mark, including extra national badges.
 function erase(cx,cy,bw,bh,direction='vertical'){
  const data=ctx.getImageData(0,0,512,576),original=new Uint8ClampedArray(data.data);
  const px=Math.round(cx-bw/2),py=Math.round(cy-bh/2),pw=Math.ceil(bw),ph=Math.ceil(bh);
  for(let dy=0;dy<ph;dy++)for(let dx=0;dx<pw;dx++){
   const tx=px+dx,ty=py+dy;if(tx<0||tx>=512||ty<0||ty>=576)continue;
   const i=(ty*512+tx)*4;
   // Sample cloth below the badge, away from collars, stars and club lettering.
   // Preserve the downloaded garment's alpha; never make opaque shirt pixels transparent.
   const below=(Math.min(575,py+ph+6)*512+tx)*4;
   const above=(Math.max(0,py-6)*512+tx)*4;
   const nearLeft=(ty*512+Math.max(0,px-6))*4,nearRight=(ty*512+Math.min(511,px+pw+6))*4;
   if(original[i+3]<100)continue;
   const horizontal=direction==='horizontal';
   let a=horizontal?nearLeft:above,b=horizontal?nearRight:below;
   if(original[a+3]<200)a=b;if(original[b+3]<200)b=a;
   if(original[a+3]<200||original[b+3]<200)continue;
   const f=horizontal?dx/Math.max(1,pw-1):dy/Math.max(1,ph-1);
   const edge=Math.min(dx,dy,pw-1-dx,ph-1-dy),blend=Math.min(1,edge/6);
   for(let c=0;c<3;c++)data.data[i+c]=Math.round(original[i+c]*(1-blend)+(original[a+c]*(1-f)+original[b+c]*f)*blend);
  }
  ctx.putImageData(data,0,0);
 }
 for(const area of item.eraseAreas||[])erase(x+(item.width*area.x-left)*scale,y+(item.height*area.y-top)*scale,area.width*scale,area.height*scale,area.direction);
 erase(cx,cy,bw,bh,item.fabricDirection);
 const fabric=ctx.getImageData(0,0,512,576).data;
 const crest=document.createElement('canvas');crest.width=512;crest.height=576;
 const cc=crest.getContext('2d',{willReadFrequently:true}),size=(item.badgeSize||68)*scale;
 const ratio=Math.min(size/logo.naturalWidth,size/logo.naturalHeight),lw=logo.naturalWidth*ratio,lh=logo.naturalHeight*ratio;
 // Follow the left chest plane, then use the fabric light map inside the raster.
 cc.setTransform(.94,-.045,-.07,1,cx,cy);cc.drawImage(logo,-lw/2,-lh/2,lw,lh);cc.setTransform(1,0,0,1,0,0);
 const stamp=cc.getImageData(0,0,512,576);
 for(let i=0;i<stamp.data.length;i+=4){
  if(!stamp.data[i+3])continue;
  const light=(fabric[i]*.2126+fabric[i+1]*.7152+fabric[i+2]*.0722)/255,shade=.83+.16*light;
  for(let c=0;c<3;c++)stamp.data[i+c]=Math.round(stamp.data[i+c]*shade);
  stamp.data[i+3]=Math.round(stamp.data[i+3]*fabric[i+3]/255);
 }
 cc.putImageData(stamp,0,0);ctx.drawImage(crest,0,0);return canvas.toDataURL('image/png');
}
async function kitFor(team){
 const item=assets()?.itemFor(team);if(!item)return null;
 if(art.has(item.team))return art.get(item.team);
 const task=(async()=>{
  const [shirt,logo]=await Promise.all([image(item.url),image(item.logo)]);if(!shirt||(!logo&&!item.keepCrest))return null;
  const surface=normalize(shirt,item),src=logo&&!item.keepCrest?printCrest(surface,logo,item):surface.canvas.toDataURL('image/png');
  const finished={...item,storeSrc:src,src};complete.set(item.team,finished);return finished;
 })();art.set(item.team,task);task.then(result=>{if(!result)art.delete(item.team)});return task;
}
function squad(){try{return JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]')}catch(_){return []}}
async function applySlot(slot,player){
 const wrap=slot.querySelector('.v590-kit-wrap');if(!wrap)return;
 const team=assets()?.teamFor(player?.team);if(!team)return;
 const stamp=team.name+'|'+team.kitId;
 if(wrap.dataset.v837Kit===stamp||pending.get(wrap)===stamp)return;
 pending.set(wrap,stamp);const item=await kitFor(team.name);
 if(pending.get(wrap)!==stamp)return;pending.delete(wrap);
 if(!item||!wrap.isConnected)return;
 const current=squad().find(p=>String(p.slot)===String(slot.dataset.v576Slot));
 if(assets()?.teamFor(current?.team)?.name!==team.name)return;
 const remove=wrap.querySelector('[data-v576-remove]'),kit=document.createElement('span');kit.className='v820-lineup-kit';
 const im=document.createElement('img');im.className='v820-lineup-jersey';im.src=item.src;im.alt='Playera de '+team.name;im.draggable=false;
 await im.decode().catch(()=>{});if(!wrap.isConnected||pending.get(wrap))return;kit.appendChild(im);wrap.replaceChildren(kit);if(remove)wrap.appendChild(remove);wrap.dataset.v837Kit=stamp;
}
async function applyStore(){
 const store=document.querySelector('[data-v431-store]');if(!store)return;
 const team=sessionStorage.getItem('v431-store-team')||localStorage.getItem('v62-team-name')||'';
 const item=await kitFor(team);if(!item||!store.isConnected)return;
 const now=sessionStorage.getItem('v431-store-team')||localStorage.getItem('v62-team-name')||'';
 if(assets()?.teamFor(now)?.name!==item.team)return;
 store.querySelectorAll('.v602-store-real-shirt').forEach(shirt=>{
  if(shirt.dataset.v837Kit===item.id)return;
  let im=shirt.querySelector(':scope>.v814-store-kit-image');
  if(!im){im=document.createElement('img');im.className='v814-store-kit-image';shirt.prepend(im)}
  im.src=item.src;im.alt='Playera de '+item.team;im.draggable=false;
  shirt.classList.add('v814-store-library-kit');shirt.dataset.v837Kit=item.id;shirt.dataset.v814StoreKit=item.id;
 });
}
function decorate(){
 if(!assets())return;document.body.classList.add('v837-jerseys');
 const players=new Map(squad().map(p=>[String(p.slot),p]));
 document.querySelectorAll('.v576-slot.filled[data-v576-slot]').forEach(slot=>applySlot(slot,players.get(slot.dataset.v576Slot)).catch(()=>{}));
 applyStore().catch(()=>{});
}
let queued=false;
function schedule(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;decorate()})}
function boot(){
 document.body.classList.add('v837-jerseys');
 for(const p of squad())kitFor(p.team).catch(()=>{});
 const screen=document.getElementById('screen');
 if(screen)new MutationObserver(m=>{if(m.some(x=>[...x.addedNodes,...x.removedNodes].some(n=>n.nodeType===1)))schedule()}).observe(screen,{childList:true,subtree:true});
 window.addEventListener('hashchange',schedule);window.addEventListener('ljr:jersey-library-ready',schedule);schedule();
}
window.LJR_JERSEY_ART={kitFor,decorate,applyStore,normalize,printCrest,cached:team=>complete.get(assets()?.teamFor(team)?.name)};
document.body.classList.add('v837-jerseys');
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
