/* V820 — final Fantasy hardfix.
   Removes the old "Jerseys" header control and paints the 50-design 3/4 pool directly in filled lineup slots. */
(function(){
'use strict';
if(window.__LJR_V820_FANTASY_LINEUP_HARDLOCK__)return;
window.__LJR_V820_FANTASY_LINEUP_HARDLOCK__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const FALLBACK_LOGO=RAW+'assets/liga-logo.webp';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const hash=value=>{let h=2166136261,s=String(value||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const transparentCache=new Map();
const badTransparentSources=new Set();
let renderGeneration=0;

function loadImage(src,timeout=6000){
  return new Promise(resolve=>{
    const img=new Image();
    let done=false;
    const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok?img:null)};
    const timer=setTimeout(()=>finish(false),timeout);
    img.crossOrigin='anonymous';
    img.decoding='async';
    img.onload=()=>finish(true);
    img.onerror=()=>finish(false);
    img.src=src;
  });
}
function silhouetteOk(data,w,h){
  let count=0,minX=w,minY=h,maxX=-1,maxY=-1;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const a=data[(y*w+x)*4+3];
      if(a<72)continue;
      count++;
      if(x<minX)minX=x;if(x>maxX)maxX=x;
      if(y<minY)minY=y;if(y>maxY)maxY=y;
    }
  }
  if(!count||maxX<0||maxY<0)return false;
  const bw=maxX-minX+1,bh=maxY-minY+1;
  const frac=count/(w*h);
  const bwf=bw/w,bhf=bh/h;
  // A usable jersey must occupy a real shirt-sized silhouette.
  if(frac<.035||frac>.78)return false;
  if(bwf<.28||bhf<.38)return false;
  // Reject images where the old rectangular background survived.
  if(bwf>.965&&bhf>.965&&frac>.58)return false;
  return true;
}

async function transparentJersey(src){
  src=String(src||'');
  if(!src)return '';
  if(transparentCache.has(src))return transparentCache.get(src);
  const task=(async()=>{
    const img=await loadImage(src);
    if(!img){badTransparentSources.add(src);return '';}
    try{
      const nw=img.naturalWidth||img.width||1,nh=img.naturalHeight||img.height||1;
      const scale=Math.min(1,720/Math.max(nw,nh));
      const w=Math.max(2,Math.round(nw*scale)),h=Math.max(2,Math.round(nh*scale));
      const canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.clearRect(0,0,w,h);
      ctx.drawImage(img,0,0,w,h);
      const image=ctx.getImageData(0,0,w,h),d=image.data;

      let transparentCorners=0;
      for(const [x,y] of [[0,0],[w-1,0],[0,h-1],[w-1,h-1]]){
        if(d[(y*w+x)*4+3]<24)transparentCorners++;
      }
      if(transparentCorners>=3){
        if(silhouetteOk(d,w,h))return src;
        badTransparentSources.add(src);
        return '';
      }

      // Estimate the real outside/background color from the image border.
      let sr=0,sg=0,sb=0,n=0;
      const sample=(x,y)=>{
        const i=(y*w+x)*4,a=d[i+3];
        if(a<24)return;
        sr+=d[i];sg+=d[i+1];sb+=d[i+2];n++;
      };
      const step=Math.max(1,Math.floor(Math.min(w,h)/40));
      for(let x=0;x<w;x+=step){sample(x,0);sample(x,h-1)}
      for(let y=0;y<h;y+=step){sample(0,y);sample(w-1,y)}
      if(!n)return src;
      const br=sr/n,bg=sg/n,bb=sb/n;

      // Flood-fill only from the OUTER BORDER. This removes white, gray,
      // black or colored photo backgrounds without erasing the jersey itself.
      const seen=new Uint8Array(w*h);
      const qx=new Int32Array(w*h),qy=new Int32Array(w*h);
      let head=0,tail=0;
      const matchesBg=(x,y)=>{
        const p=y*w+x,i=p*4,a=d[i+3];
        if(a<28)return true;
        const r=d[i],g=d[i+1],b=d[i+2];
        const dist=Math.hypot(r-br,g-bg,b-bb);
        const lum=(r+g+b)/3,baseLum=(br+bg+bb)/3;
        const chroma=Math.max(r,g,b)-Math.min(r,g,b);
        const baseChroma=Math.max(br,bg,bb)-Math.min(br,bg,bb);
        return dist<64 || (Math.abs(lum-baseLum)<34 && Math.abs(chroma-baseChroma)<34);
      };
      const push=(x,y)=>{
        if(x<0||y<0||x>=w||y>=h)return;
        const p=y*w+x;
        if(seen[p]||!matchesBg(x,y))return;
        seen[p]=1;qx[tail]=x;qy[tail]=y;tail++;
      };
      for(let x=0;x<w;x++){push(x,0);push(x,h-1)}
      for(let y=0;y<h;y++){push(0,y);push(w-1,y)}
      while(head<tail){
        const x=qx[head],y=qy[head];head++;
        const i=(y*w+x)*4;
        d[i+3]=0;
        push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1);
      }

      // Feather only the edge of the cut-out for a clean transparent PNG look.
      for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
        const p=y*w+x,i=p*4;
        if(d[i+3]===0)continue;
        let clear=0;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
          if(d[((y+dy)*w+(x+dx))*4+3]===0)clear++;
        }
        if(clear>=2)d[i+3]=Math.min(d[i+3],210);
      }
      ctx.putImageData(image,0,0);
      if(!silhouetteOk(d,w,h)){
        badTransparentSources.add(src);
        return '';
      }
      return canvas.toDataURL('image/png');
    }catch(_){
      badTransparentSources.add(src);
      return '';
    }
  })();
  transparentCache.set(src,task);
  return task;
}

function removePicker(){
  document.querySelectorAll('[data-v813-open],.v813-open,.v813-jersey-layer').forEach(n=>n.remove());
  document.body.classList.remove('v813-jersey-picker-open','v813-custom-jersey');
  document.documentElement.style.removeProperty('--v813-jersey-src');
}
function pool(){
  const sources=[];
  if(Array.isArray(window.LJR_V819_THREE_QUARTER_JERSEYS))sources.push(...window.LJR_V819_THREE_QUARTER_JERSEYS);
  if(Array.isArray(window.LJR_V816_DIAGONAL_JERSEYS))sources.push(...window.LJR_V816_DIAGONAL_JERSEYS);
  if(Array.isArray(window.LJR_FANTASY_JERSEYS?.catalog))sources.push(...window.LJR_FANTASY_JERSEYS.catalog);
  const out=[],seen=new Set();
  for(const x of sources){
    const url=String(x?.url||'');
    if(!url||seen.has(url))continue;
    seen.add(url);out.push(x);
    if(out.length===50)break;
  }
  return out;
}
function squad(){
  try{
    const rows=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');
    return Array.isArray(rows)?rows:[];
  }catch(_){return []}
}
function logoFor(team){
  try{
    let v=window.LJR_OFFICIAL_API?.getLogo?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||FALLBACK_LOGO;
    v=String(v||FALLBACK_LOGO);
    if(/^(https?:|data:|blob:)/i.test(v))return v;
    if(v.startsWith('assets/'))return RAW+v;
    return v||FALLBACK_LOGO;
  }catch(_){return FALLBACK_LOGO}
}
async function decorate(){
  removePicker();
  const gen=++renderGeneration;
  const slots=[...document.querySelectorAll('.v576-slot.filled[data-v576-slot]')];
  if(!slots.length)return;
  const items=pool();
  if(items.length<15){setTimeout(schedule,120);return}
  const rows=squad();
  const bySlot=new Map(rows.map(p=>[String(p?.slot??''),p||{}]));
  const used=new Set();

  for(let index=0;index<slots.length;index++){
    const slot=slots[index];
    const wrap=slot.querySelector('.v590-kit-wrap');
    if(!wrap)continue;
    const slotId=String(slot.dataset.v576Slot??index);
    const p=bySlot.get(slotId)||{};
    const player=String(p.name||slot.querySelector(':scope>b')?.textContent||('Jugador '+(index+1)));
    const start=hash(player+'|'+slotId)%items.length;
    let idx=-1,item=null,transparentSrc='';
    for(let n=0;n<items.length;n++){
      const q=(start+n)%items.length;
      if(used.has(q))continue;
      const candidate=items[q];
      const raw=String(candidate?.url||'');
      if(!raw||badTransparentSources.has(raw))continue;
      const processed=await transparentJersey(raw);
      if(gen!==renderGeneration||!wrap.isConnected)break;
      if(!processed)continue;
      idx=q;item=candidate;transparentSrc=processed;used.add(q);break;
    }
    if(gen!==renderGeneration||!wrap.isConnected)continue;
    if(!item||!transparentSrc)continue;
    const team=String(p.team||'Liga Juventino Rosas');
    const logo=logoFor(team);
    const stamp=String(item.id||idx)+'|'+player+'|'+team+'|transparent-v828';
    if(wrap.dataset.v820Stamp===stamp&&wrap.querySelector('.v820-lineup-jersey'))continue;

    const removeId=wrap.querySelector('[data-v576-remove]')?.getAttribute('data-v576-remove')||slotId;
    wrap.dataset.v820Stamp=stamp;
    wrap.dataset.v827Transparent='1';
    wrap.style.setProperty('--v820-badge-x',Number(item.badgeX??57)+'%');
    wrap.style.setProperty('--v820-badge-y',Number(item.badgeY??27)+'%');
    wrap.style.setProperty('--v820-badge-w',Number(item.badgeW??16)+'%');
    wrap.style.setProperty('--v820-badge-h',Number(item.badgeH??15)+'%');
    wrap.style.setProperty('--v820-cover',String(item.coverColor||'rgba(12,24,61,.42)'));
    wrap.style.setProperty('--v820-tilt',Number(item.tilt??(index%2?-7:7))+'deg');
    wrap.innerHTML=
      '<span class="v820-lineup-kit v827-transparent-kit">'+
        '<img class="v820-lineup-jersey v827-transparent-shirt" src="'+esc(transparentSrc)+'" alt="" draggable="false" decoding="async">'+
        '<span class="v820-source-cover" aria-hidden="true"></span>'+
        '<img class="v820-team-logo" src="'+esc(logo)+'" alt="" draggable="false" decoding="async">'+
      '</span>'+
      '<i class="remove" data-v576-remove="'+esc(removeId)+'" aria-label="Quitar jugador">×</i>';
  }
  document.body.dataset.v820FantasyLineup='active';
  document.body.dataset.v820FantasyJerseyPool=String(Math.min(items.length,50));
  document.body.dataset.v828RejectedJerseys=String(badTransparentSources.size);
}

let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(()=>{decorate().catch(()=>{})}));
}
function boot(){
  removePicker();
  const mo=new MutationObserver(schedule);
  mo.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(schedule,20));
  window.addEventListener('ljr:jersey-library-ready',schedule);
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-remove],[data-v576-pick]'))setTimeout(schedule,35);
  },true);
  schedule();
  setTimeout(schedule,100);
  setTimeout(schedule,450);
  setTimeout(schedule,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
