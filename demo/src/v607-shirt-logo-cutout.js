/* V607 — remove baked backgrounds from team crests used on Fantasy/Tienda shirts.
   Keeps original crest colors and only removes edge-connected background pixels. */
(function(){
'use strict';
if(window.__LJR_V607_SHIRT_LOGO_CUTOUT__)return;
window.__LJR_V607_SHIRT_LOGO_CUTOUT__=true;

const SELECTOR='.v597-team-logo,.v602-shirt-logo';
const cache=new Map();
const pending=new WeakSet();

function dist(a,b){
  const dr=a[0]-b[0],dg=a[1]-b[1],db=a[2]-b[2];
  return Math.sqrt(dr*dr+dg*dg+db*db);
}
function sample(data,w,x,y){
  const i=(y*w+x)*4;
  return [data[i],data[i+1],data[i+2],data[i+3]];
}
function borderPalette(data,w,h){
  const pts=[
    [0,0],[w-1,0],[0,h-1],[w-1,h-1],
    [Math.floor(w/2),0],[Math.floor(w/2),h-1],
    [0,Math.floor(h/2)],[w-1,Math.floor(h/2)]
  ];
  const out=[];
  pts.forEach(([x,y])=>{
    const c=sample(data,w,x,y);
    if(c[3]<10)return;
    if(!out.some(v=>dist(v,c)<22))out.push(c);
  });
  return out.slice(0,6);
}
function isBg(data,w,i,palette){
  const a=data[i+3];
  if(a<10)return true;
  const c=[data[i],data[i+1],data[i+2],a];
  let best=999;
  for(const p of palette)best=Math.min(best,dist(c,p));
  const max=Math.max(c[0],c[1],c[2]),min=Math.min(c[0],c[1],c[2]);
  const lowSat=(max-min)<18;
  const nearWhite=min>236;
  const nearBlack=max<24;
  return best<48 || (best<70 && lowSat) || nearWhite || nearBlack;
}
function cutout(src,img){
  return new Promise((resolve,reject)=>{
    const im=new Image();
    im.crossOrigin='anonymous';
    im.onload=()=>{
      try{
        const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;
        if(!w||!h)return reject(new Error('empty image'));
        const cv=document.createElement('canvas');
        cv.width=w;cv.height=h;
        const ctx=cv.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(im,0,0,w,h);
        const id=ctx.getImageData(0,0,w,h),d=id.data;
        const palette=borderPalette(d,w,h);
        if(!palette.length){resolve(src);return}
        const seen=new Uint8Array(w*h);
        const qx=new Int32Array(w*h),qy=new Int32Array(w*h);
        let qs=0,qe=0;
        const push=(x,y)=>{
          const k=y*w+x;if(seen[k])return;
          const i=k*4;if(!isBg(d,w,i,palette))return;
          seen[k]=1;qx[qe]=x;qy[qe]=y;qe++;
        };
        for(let x=0;x<w;x++){push(x,0);push(x,h-1)}
        for(let y=1;y<h-1;y++){push(0,y);push(w-1,y)}
        while(qs<qe){
          const x=qx[qs],y=qy[qs++];
          const k=y*w+x,i=k*4;
          d[i+3]=0;
          if(x>0)push(x-1,y);
          if(x+1<w)push(x+1,y);
          if(y>0)push(x,y-1);
          if(y+1<h)push(x,y+1);
        }
        ctx.putImageData(id,0,0);
        resolve(cv.toDataURL('image/png'));
      }catch(err){reject(err)}
    };
    im.onerror=()=>reject(new Error('logo load failed'));
    im.src=src;
  });
}
async function process(img){
  if(!(img instanceof HTMLImageElement)||pending.has(img)||img.dataset.v607Cutout==='1')return;
  const src=img.currentSrc||img.src;
  if(!src)return;
  pending.add(img);
  img.style.background='transparent';
  img.style.border='0';
  img.style.boxShadow='none';
  try{
    let p=cache.get(src);
    if(!p){p=cutout(src,img);cache.set(src,p)}
    const out=await p;
    if(out&&out!==src)img.src=out;
    img.dataset.v607Cutout='1';
  }catch(_){
    img.dataset.v607Cutout='fallback';
  }finally{
    pending.delete(img);
  }
}
function scan(root=document){
  root.querySelectorAll?.(SELECTOR).forEach(process);
}
scan();
new MutationObserver(muts=>{
  for(const m of muts){
    for(const n of m.addedNodes){
      if(!(n instanceof Element))continue;
      if(n.matches?.(SELECTOR))process(n);
      scan(n);
    }
  }
}).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',()=>setTimeout(scan,80));
window.addEventListener('ljr:official-data',()=>setTimeout(scan,80));
})();