/* V1152: Fondo transparente exclusivo de escudos en Barra de jornada.
   Respeta el catálogo oficial, no modifica equipos, logos originales ni resultados.
   Los JPG/WebP con fondo plano blanco/negro se limpian en memoria (canvas).
   Imágenes ya transparentes se muestran sin procesar. */
(()=>{
 'use strict';
 if(window.__LJR_V1152_MATCHDAY_CLEAR__)return;
 window.__LJR_V1152_MATCHDAY_CLEAR__=true;
 const selector='body[data-app-route="matchday"] #v160-matchday-extra .md1132-crest img';
 const cache=new Map();
 const norm=v=>String(v||'');
 function sourceToTransparent(src){
  if(cache.has(src))return cache.get(src);
  const job=new Promise(resolve=>{
   const photo=new Image();
   photo.crossOrigin='anonymous';
   photo.onload=()=>{
    try{
     const ratio=Math.min(1,384/Math.max(photo.naturalWidth,photo.naturalHeight));
     const width=Math.max(1,Math.round(photo.naturalWidth*ratio)),height=Math.max(1,Math.round(photo.naturalHeight*ratio));
     if(width<8||height<8)return resolve(null);
     const cv=document.createElement('canvas');cv.width=width;cv.height=height;
     const ctx=cv.getContext('2d',{willReadFrequently:true});
     if(!ctx)return resolve(null);
     ctx.clearRect(0,0,width,height);
     ctx.drawImage(photo,0,0,width,height);
     const im=ctx.getImageData(0,0,width,height),px=im.data;
     const pos=[(2*width+2)*4,(2*width+width-3)*4,((height-3)*width+2)*4,((height-3)*width+width-3)*4];
     if(pos.some(p=>px[p+3]<245))return resolve(null); // ya conserva transparencia
     const rgb=[0,1,2].map(k=>Math.round(pos.reduce((sum,p)=>sum+px[p+k],0)/pos.length));
     const spread=pos.reduce((max,p)=>Math.max(max,Math.abs(px[p]-rgb[0]),Math.abs(px[p+1]-rgb[1]),Math.abs(px[p+2]-rgb[2])),0);
     const light=rgb.every(k=>k>=210),dark=rgb.every(k=>k<=70);
     if(spread>24||!(light||dark))return resolve(null); // nunca borrar un logo con fondo complejo
     const close=p=>Math.max(Math.abs(px[p]-rgb[0]),Math.abs(px[p+1]-rgb[1]),Math.abs(px[p+2]-rgb[2]));
     const count=width*height,seen=new Uint8Array(count),queue=new Int32Array(count);
     let head=0,tail=0,removed=0;
     const push=n=>{
      if(seen[n])return;
      seen[n]=1;
      const p=n*4;
      if(px[p+3]>=245&&close(p)<=62)queue[tail++]=n;
     };
     for(let x=0;x<width;x++){push(x);push((height-1)*width+x);}
     for(let y=0;y<height;y++){push(y*width);push(y*width+width-1);}
     while(head<tail){
      const n=queue[head++],p=n*4,d=close(p);
      px[p+3]=d<=24?0:Math.round(Math.min(255,(d-24)*255/38));
      removed++;
      const x=n%width,y=(n-x)/width;
      if(x>0)push(n-1);
      if(x+1<width)push(n+1);
      if(y>0)push(n-width);
      if(y+1<height)push(n+width);
     }
     if(removed<count*.012||removed>count*.985)return resolve(null);
     ctx.putImageData(im,0,0);
     resolve(cv.toDataURL('image/png'));
    }catch(error){
     // Fuentes remotas sin CORS o navegador sin canvas seguro: conservar el escudo original.
     resolve(null);
    }
   };
   photo.onerror=()=>resolve(null);
   photo.src=src;
  });
  cache.set(src,job);
  return job;
 }
 function process(img){
  const src=norm(img.getAttribute('src'));
  if(!src||/^data:|^blob:/i.test(src)||img.dataset.v1152Processed===src)return;
  img.dataset.v1152Processed=src;
  img.style.backgroundColor='transparent';
  img.style.backgroundImage='none';
  sourceToTransparent(src).then(out=>{
   if(!out||!img.isConnected||img.getAttribute('src')!==src)return;
   img.src=out;
   img.dataset.v1152Processed='alpha';
  });
 }
 let scheduled=false;
 function scan(){
  scheduled=false;
  if(!document.body||document.body.dataset.appRoute!=='matchday')return;
  document.querySelectorAll(selector).forEach(process);
 }
 function schedule(){
  if(scheduled)return;
  scheduled=true;
  // Se agrupan las mutaciones que produce el renderizador de la jornada.
  setTimeout(scan,0);
 }
 function start(){
  schedule();
  const screen=document.querySelector('#screen')||document.body;
  if(screen&&typeof MutationObserver!=='undefined')new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('ljr:official-data',schedule);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();