/* V821 — The club Store uses the exact same Fantasy jersey assigned to each Liga team.
   Same team => same 3/4 jersey in Fantasy and Store. Backgrounds are kept transparent. */
(function(){
'use strict';
if(window.__LJR_V821_STORE_JERSEYS__)return;
window.__LJR_V821_STORE_JERSEYS__=true;

const FALLBACK_ACTIVE=[
  'BOAVISTA','FRANCO-TAVERA-JR','HURACAN','CUENDA','AMERICA','AGUILARES','JUVENTUS','LEYENDAS FC','PSV','LA TRINIDAD',
  'La Esperanza','Dynamo','Boca Jrs','Toros de Cuenda','Manchester',
  'San José FC','Linces','Napoli','Hermanos','Franco FC','Herreras FC','Abejas','Terrícolas','Lobos CDG','Galácticos',
  'La Canchita Deportes','Galeana','Aldama FC','Malvinas','Capibaras','La Cuadrilla','Mazacotes FC','Dep. Maravillas','Osasuna','San Antonio Jrs','Populares','Promesas FC','La Huerta',
  'Tavera FC','Pachangas FC','San Juan FC','Tapatío','Dep. La Luz','San Julián','Barza','San José Jrs','San Antonio FC','Célticos FC','Dep. Nopalero','Dep. Zapata'
];

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\batl\b/g,'atletico').replace(/\bdep\b/g,'deportivo').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const processed=new Map();
const failed=new Set();

function hash(value){
  let h=2166136261;
  const s=String(value||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function activeNames(){
  const src=Array.isArray(window.LJR_V812_ACTIVE_STORE_TEAMS)&&window.LJR_V812_ACTIVE_STORE_TEAMS.length
    ? window.LJR_V812_ACTIVE_STORE_TEAMS : FALLBACK_ACTIVE;
  const out=[];
  src.forEach(name=>{if(!out.some(x=>norm(x)===norm(name)))out.push(name)});
  return out;
}
function catalog(){
  const finalPool=window.LJR_V819_THREE_QUARTER_JERSEYS;
  if(Array.isArray(finalPool)&&finalPool.length)return finalPool.filter(x=>x&&x.url&&!failed.has(String(x.url)));
  const downloaded=window.LJR_V816_DIAGONAL_JERSEYS;
  if(Array.isArray(downloaded)&&downloaded.length)return downloaded.filter(x=>x&&x.url&&!failed.has(String(x.url)));
  const all=window.LJR_FANTASY_JERSEYS?.catalog;
  return Array.isArray(all)?all.filter(x=>x&&x.url&&!failed.has(String(x.url))):[];
}
function isActive(team){
  if(typeof window.LJR_V812_IS_ACTIVE_STORE_TEAM==='function'){
    try{return !!window.LJR_V812_IS_ACTIVE_STORE_TEAM(team)}catch(_){}
  }
  return activeNames().some(n=>norm(n)===norm(team));
}
function candidateKits(team){
  const kits=catalog();
  if(!kits.length)return [];
  const start=hash(team||'equipo')%kits.length;
  const out=[];
  for(let i=0;i<Math.min(kits.length,16);i++)out.push(kits[(start+i)%kits.length]);
  return out;
}
function transparentSource(url){
  if(processed.has(url))return processed.get(url);
  const promise=new Promise(resolve=>{
    const im=new Image();
    im.crossOrigin='anonymous';
    im.onload=()=>{
      try{
        const nw=im.naturalWidth||1,nh=im.naturalHeight||1;
        const scale=Math.min(1,720/Math.max(nw,nh));
        const w=Math.max(2,Math.round(nw*scale)),h=Math.max(2,Math.round(nh*scale));
        const c=document.createElement('canvas');c.width=w;c.height=h;
        const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,w,h);
        const img=x.getImageData(0,0,w,h),d=img.data;
        let tc=0;for(const [px,py] of [[1,1],[w-2,1],[1,h-2],[w-2,h-2]])if(d[(py*w+px)*4+3]<24)tc++;
        if(tc>=3){resolve(url);return}

        let sr=0,sg=0,sb=0,n=0;
        const sample=(px,py)=>{const j=(py*w+px)*4;if(d[j+3]<16)return;sr+=d[j];sg+=d[j+1];sb+=d[j+2];n++};
        const step=Math.max(1,Math.floor(Math.min(w,h)/28));
        for(let xx=0;xx<w;xx+=step){sample(xx,0);sample(xx,h-1)}
        for(let yy=0;yy<h;yy+=step){sample(0,yy);sample(w-1,yy)}
        if(!n){resolve(url);return}
        const br=sr/n,bg=sg/n,bb=sb/n,lum=(br+bg+bb)/3,chroma=Math.max(br,bg,bb)-Math.min(br,bg,bb);
        if(lum<92||chroma>48){resolve(url);return}

        const seen=new Uint8Array(w*h),qx=new Int32Array(w*h),qy=new Int32Array(w*h);
        let qh=0,qt=0;
        const qualifies=(px,py)=>{
          const k=py*w+px,j=k*4,a=d[j+3];if(a<18)return true;
          const r=d[j],g=d[j+1],b=d[j+2];
          return Math.hypot(r-br,g-bg,b-bb)<72 && (Math.max(r,g,b)-Math.min(r,g,b))<62 && ((r+g+b)/3)>78;
        };
        const push=(px,py)=>{
          if(px<0||py<0||px>=w||py>=h)return;
          const k=py*w+px;if(seen[k]||!qualifies(px,py))return;
          seen[k]=1;qx[qt]=px;qy[qt]=py;qt++;
        };
        for(let xx=0;xx<w;xx++){push(xx,0);push(xx,h-1)}
        for(let yy=0;yy<h;yy++){push(0,yy);push(w-1,yy)}
        while(qh<qt){
          const px=qx[qh],py=qy[qh++];d[(py*w+px)*4+3]=0;
          push(px+1,py);push(px-1,py);push(px,py+1);push(px,py-1);
        }
        x.putImageData(img,0,0);resolve(c.toDataURL('image/png'));
      }catch(_){resolve(url)}
    };
    im.onerror=()=>{failed.add(url);resolve('')};
    im.src=url;
  });
  processed.set(url,promise);
  return promise;
}
async function kitFor(team){
  for(const item of candidateKits(team)){
    const src=await transparentSource(String(item.url||''));
    if(src)return {...item,storeSrc:src};
  }
  return null;
}
async function addLayer(shirt,item,team){
  if(!shirt||!item?.storeSrc)return;
  let img=shirt.querySelector(':scope > .v814-store-kit-image');
  if(!img){
    img=document.createElement('img');
    img.className='v814-store-kit-image';
    img.alt='';img.loading='eager';img.decoding='async';img.draggable=false;
  }
  const preload=new Image();preload.src=item.storeSrc;
  try{await preload.decode?.()}catch(_){}
  if(!shirt.isConnected)return;

  shirt.classList.add('v814-store-library-kit','v821-store-fantasy-kit');
  shirt.dataset.v814StoreKit=item.id||'';
  shirt.dataset.v821FantasyTeam=team;
  img.src=item.storeSrc;
  if(!img.isConnected)shirt.insertBefore(img,shirt.firstChild);

  let cover=shirt.querySelector(':scope > .v814-source-badge-cover');
  if(!cover){
    cover=document.createElement('span');
    cover.className='v814-source-badge-cover';
    cover.setAttribute('aria-hidden','true');
    const logo=shirt.querySelector(':scope > .v602-shirt-logo');
    shirt.insertBefore(cover,logo||shirt.lastChild);
  }
}
let pass=0;
async function decorate(){
  if(route()!=='club-store')return;
  const store=document.querySelector('[data-v431-store]');
  if(!store)return;
  const team=sessionStorage.getItem('v431-store-team')||localStorage.getItem('v62-team-name')||'';
  if(!team||!isActive(team))return;

  const my=++pass;
  const item=await kitFor(team);
  if(!item||my!==pass||!store.isConnected)return;

  store.dataset.v814Team=team;
  store.dataset.v814Kit=item.id||'';
  store.dataset.v821FantasyKit='true';
  await Promise.all([...store.querySelectorAll('.v602-store-real-shirt')].map(shirt=>addLayer(shirt,item,team)));
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(decorate);
}
function boot(){
  schedule();
  window.addEventListener('hashchange',()=>setTimeout(schedule,30));
  window.addEventListener('pageshow',schedule);
  window.addEventListener('ljr:jersey-library-ready',()=>setTimeout(schedule,40));
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(m=>{if(m.some(x=>x.addedNodes.length||x.removedNodes.length))schedule()}).observe(screen,{childList:true,subtree:true});
  setTimeout(schedule,600);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
window.LJR_V814_STORE_JERSEYS={decorate,kitFor,activeNames,catalog,candidateKits};
})();