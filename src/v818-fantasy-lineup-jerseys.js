/* V820 — Stable transparent jerseys inside Fantasy lineup.
   Removes light/gray image backgrounds, preloads before swapping, and skips broken art. */
(function(){
'use strict';
if(window.__LJR_V820_FANTASY_LINEUP_JERSEYS__)return;
window.__LJR_V820_FANTASY_LINEUP_JERSEYS__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE_LOGO=RAW+'assets/liga-logo.webp';
const artCache=new Map();
const failed=new Set();
const pending=new Map();
let generation=0;

function hash(value){
  let h=2166136261;
  const s=String(value||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function pool(){
  const finalPool=window.LJR_V819_THREE_QUARTER_JERSEYS;
  if(Array.isArray(finalPool)&&finalPool.length)return finalPool.filter(x=>x&&x.url&&!failed.has(String(x.url)));
  const direct=window.LJR_V816_DIAGONAL_JERSEYS;
  if(Array.isArray(direct)&&direct.length)return direct.filter(x=>x&&x.url&&!failed.has(String(x.url)));
  const src=window.LJR_FANTASY_JERSEYS?.catalog;
  return Array.isArray(src)?src.filter(x=>x&&x.url&&!failed.has(String(x.url))):[];
}
function squadMap(){
  const map=new Map();
  try{
    const rows=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');
    if(Array.isArray(rows))rows.forEach(p=>map.set(String(p?.slot??''),p||{}));
  }catch(_){}
  return map;
}
function teamLogo(name){
  try{
    const v=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||LEAGUE_LOGO;
    if(/^(https?:|data:|blob:)/i.test(String(v)))return String(v);
    return String(v).startsWith('assets/')?RAW+String(v):String(v||LEAGUE_LOGO);
  }catch(_){return LEAGUE_LOGO}
}
function waitImage(src,timeout=5000){
  return new Promise(resolve=>{
    const im=new Image();
    let done=false;
    const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok?im:null)};
    const timer=setTimeout(()=>finish(false),timeout);
    im.crossOrigin='anonymous';
    im.decoding='async';
    im.onload=()=>finish(true);
    im.onerror=()=>finish(false);
    im.src=src;
  });
}
function transparentize(src){
  if(artCache.has(src))return artCache.get(src);
  const promise=(async()=>{
    const im=await waitImage(src);
    if(!im){failed.add(src);return '';}
    try{
      const nw=im.naturalWidth||im.width||1, nh=im.naturalHeight||im.height||1;
      const scale=Math.min(1,640/Math.max(nw,nh));
      const w=Math.max(2,Math.round(nw*scale)), h=Math.max(2,Math.round(nh*scale));
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const x=c.getContext('2d',{willReadFrequently:true});
      x.clearRect(0,0,w,h);x.drawImage(im,0,0,w,h);
      const img=x.getImageData(0,0,w,h),d=img.data;

      let transparentCorners=0;
      const corners=[[1,1],[w-2,1],[1,h-2],[w-2,h-2]];
      for(const [px,py] of corners){if(d[(py*w+px)*4+3]<24)transparentCorners++}
      if(transparentCorners>=3)return src;

      let sr=0,sg=0,sb=0,n=0;
      const sample=(px,py)=>{
        const j=(py*w+px)*4,a=d[j+3];
        if(a<16)return;
        sr+=d[j];sg+=d[j+1];sb+=d[j+2];n++;
      };
      const step=Math.max(1,Math.floor(Math.min(w,h)/28));
      for(let xx=0;xx<w;xx+=step){sample(xx,0);sample(xx,h-1)}
      for(let yy=0;yy<h;yy+=step){sample(0,yy);sample(w-1,yy)}
      if(!n)return src;
      const br=sr/n,bg=sg/n,bb=sb/n;
      const lum=(br+bg+bb)/3;
      const chroma=Math.max(br,bg,bb)-Math.min(br,bg,bb);
      if(lum<92||chroma>48)return src;

      const seen=new Uint8Array(w*h);
      const qx=new Int32Array(w*h),qy=new Int32Array(w*h);
      let qh=0,qt=0;
      const qualifies=(px,py)=>{
        const k=py*w+px,j=k*4,a=d[j+3];
        if(a<18)return true;
        const r=d[j],g=d[j+1],b=d[j+2];
        const dist=Math.hypot(r-br,g-bg,b-bb);
        const localChroma=Math.max(r,g,b)-Math.min(r,g,b);
        return dist<72 && localChroma<62 && ((r+g+b)/3)>78;
      };
      const push=(px,py)=>{
        if(px<0||py<0||px>=w||py>=h)return;
        const k=py*w+px;if(seen[k]||!qualifies(px,py))return;
        seen[k]=1;qx[qt]=px;qy[qt]=py;qt++;
      };
      for(let xx=0;xx<w;xx++){push(xx,0);push(xx,h-1)}
      for(let yy=0;yy<h;yy++){push(0,yy);push(w-1,yy)}
      while(qh<qt){
        const px=qx[qh],py=qy[qh];qh++;
        const j=(py*w+px)*4;d[j+3]=0;
        push(px+1,py);push(px-1,py);push(px,py+1);push(px,py-1);
      }
      x.putImageData(img,0,0);
      return c.toDataURL('image/png');
    }catch(_){return src}
  })();
  artCache.set(src,promise);
  return promise;
}
async function usable(item){
  const raw=String(item?.url||'');
  if(!raw)return '';
  return await transparentize(raw);
}
function chooseCandidates(items,team){
  if(!items.length)return [];
  const start=hash(team||'equipo')%items.length;
  const out=[];
  for(let i=0;i<Math.min(items.length,16);i++)out.push(items[(start+i)%items.length]);
  return out;
}
async function prepareSlot(slot,index,profile,items,gen){
  const wrap=slot.querySelector('.v590-kit-wrap');
  if(!wrap)return;
  const slotId=String(slot.getAttribute('data-v576-slot')||index);
  const p=profile.get(slotId)||{};
  const playerName=String(p.name||slot.querySelector(':scope>b')?.textContent||('jugador-'+index));
  const team=String(p.team||'Liga Juventino Rosas');
  const candidates=chooseCandidates(items,team);

  let item=null,src='';
  for(const candidate of candidates){
    src=await usable(candidate);
    if(src){item=candidate;break}
  }
  if(!item||!src||gen!==generation||!wrap.isConnected)return;

  const stamp=String(item.id||item.url)+'|'+team;
  if(wrap.dataset.v820Jersey===stamp&&wrap.querySelector('.v820-lineup-jersey'))return;

  const remove=wrap.querySelector('[data-v576-remove]');
  const removeId=remove?.getAttribute('data-v576-remove')||slotId;
  const logo=teamLogo(team);

  const kit=document.createElement('span');
  kit.className='v820-lineup-kit';
  kit.dataset.v820Kit=String(item.id||'');
  kit.innerHTML=
    '<img class="v820-lineup-jersey" alt="" draggable="false">'+
    '<img class="v820-lineup-team-logo" alt="" draggable="false">';
  const jersey=kit.querySelector('.v820-lineup-jersey');
  const crest=kit.querySelector('.v820-lineup-team-logo');
  jersey.src=src;
  crest.src=logo;
  crest.onerror=()=>{crest.onerror=null;crest.src=LEAGUE_LOGO};

  // Swap only after the transparent jersey is already decoded: no white flash/broken icon.
  try{await jersey.decode?.()}catch(_){}
  if(gen!==generation||!wrap.isConnected)return;

  wrap.dataset.v820Jersey=stamp;
  wrap.dataset.v820Team=team;
  wrap.setAttribute('title',team+' · '+playerName);
  wrap.replaceChildren(kit);
  const close=document.createElement('i');
  close.className='remove';
  close.dataset.v576Remove=removeId;
  close.setAttribute('aria-label','Quitar jugador');
  close.textContent='×';
  wrap.appendChild(close);
}
function decorate(){
  if(route()!=='fantasyTeam')return;
  document.querySelectorAll('[data-v813-open],.v813-jersey-layer').forEach(n=>n.remove());
  document.body.classList.remove('v813-jersey-picker-open','v813-custom-jersey');
  document.documentElement.style.removeProperty('--v813-jersey-src');

  const items=pool();
  if(!items.length)return;
  const profile=squadMap();
  const slots=[...document.querySelectorAll('.v576-slot.filled')];
  const gen=++generation;
  slots.forEach((slot,index)=>{
    const key=(slot.getAttribute('data-v576-slot')||index)+'|'+gen;
    const task=prepareSlot(slot,index,profile,items,gen).finally(()=>pending.delete(key));
    pending.set(key,task);
  });
  document.body.dataset.v820JerseyPool=String(items.length);
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(decorate);
}
const observer=new MutationObserver(muts=>{
  if(muts.some(m=>[...m.addedNodes,...m.removedNodes].some(n=>n.nodeType===1&&!n.closest?.('.v590-kit-wrap'))))schedule();
});
function boot(){
  observer.observe(document.body,{childList:true,subtree:true});
  schedule();setTimeout(schedule,140);setTimeout(schedule,650);
}
window.addEventListener('hashchange',()=>setTimeout(schedule,20));
window.addEventListener('ljr:jersey-library-ready',()=>setTimeout(schedule,30));
document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-search],[data-v576-remove]'))setTimeout(schedule,40);
},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();