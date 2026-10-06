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
      const scale=Math.min(1,820/Math.max(nw,nh));
      const w=Math.max(2,Math.round(nw*scale)),h=Math.max(2,Math.round(nh*scale));
      const canvas=document.createElement('canvas');
      canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d',{willReadFrequently:true});
      ctx.clearRect(0,0,w,h);
      ctx.drawImage(img,0,0,w,h);
      const image=ctx.getImageData(0,0,w,h),d=image.data;

      // Always clean the outside. Even PNG/WebP files that already have alpha
      // can carry white/black matte residue around the shirt edge.
      let sr=0,sg=0,sb=0,n=0;
      const sample=(x,y)=>{
        const i=(y*w+x)*4,a=d[i+3];
        if(a<18)return;
        sr+=d[i];sg+=d[i+1];sb+=d[i+2];n++;
      };
      const step=Math.max(1,Math.floor(Math.min(w,h)/48));
      for(let x=0;x<w;x+=step){sample(x,0);sample(x,h-1)}
      for(let y=0;y<h;y+=step){sample(0,y);sample(w-1,y)}

      if(n){
        const br=sr/n,bg=sg/n,bb=sb/n;
        const seen=new Uint8Array(w*h);
        const qx=new Int32Array(w*h),qy=new Int32Array(w*h);
        let head=0,tail=0;
        const matchesBg=(x,y)=>{
          const p=y*w+x,i=p*4,a=d[i+3];
          if(a<24)return true;
          const r=d[i],g=d[i+1],b=d[i+2];
          const dist=Math.hypot(r-br,g-bg,b-bb);
          const lum=(r+g+b)/3,baseLum=(br+bg+bb)/3;
          const chroma=Math.max(r,g,b)-Math.min(r,g,b);
          const baseChroma=Math.max(br,bg,bb)-Math.min(br,bg,bb);
          return dist<72 || (Math.abs(lum-baseLum)<38 && Math.abs(chroma-baseChroma)<38);
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
          d[(y*w+x)*4+3]=0;
          push(x+1,y);push(x-1,y);push(x,y+1);push(x,y-1);
        }
      }

      // Remove faint matte/halo only at the OUTER alpha edge.
      const alphaCopy=new Uint8ClampedArray(w*h);
      for(let p=0;p<w*h;p++)alphaCopy[p]=d[p*4+3];
      for(let y=1;y<h-1;y++)for(let x=1;x<w-1;x++){
        const p=y*w+x,i=p*4,a=alphaCopy[p];
        if(a===0)continue;
        let clear=0,soft=0;
        for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
          const na=alphaCopy[(y+dy)*w+(x+dx)];
          if(na<12)clear++;
          if(na<80)soft++;
        }
        if(clear>=3)d[i+3]=Math.min(d[i+3],180);
        else if(soft>=4)d[i+3]=Math.min(d[i+3],220);
      }

      if(!silhouetteOk(d,w,h)){
        badTransparentSources.add(src);
        return '';
      }

      // Trim empty transparent margins so the shirt itself fills the slot,
      // while preserving a small transparent safety pad.
      let minX=w,minY=h,maxX=-1,maxY=-1;
      for(let y=0;y<h;y++)for(let x=0;x<w;x++){
        if(d[(y*w+x)*4+3]<18)continue;
        if(x<minX)minX=x;if(x>maxX)maxX=x;
        if(y<minY)minY=y;if(y>maxY)maxY=y;
      }
      if(maxX<0||maxY<0){badTransparentSources.add(src);return ''}

      ctx.putImageData(image,0,0);
      const bw=maxX-minX+1,bh=maxY-minY+1;
      const pad=Math.max(4,Math.round(Math.max(bw,bh)*.045));
      const out=document.createElement('canvas');
      out.width=bw+pad*2;out.height=bh+pad*2;
      const ox=out.getContext('2d');
      ox.clearRect(0,0,out.width,out.height);
      ox.drawImage(canvas,minX,minY,bw,bh,pad,pad,bw,bh);
      return out.toDataURL('image/png');
    }catch(_){
      badTransparentSources.add(src);
      return '';
    }
  })();
  transparentCache.set(src,task);
  return task;
}

function generatedTransparentJersey(seed=0){
  const palettes=[
    ['#0b48df','#27d7ef','#06267f'],['#d71920','#ff4650','#74030b'],
    ['#ffffff','#dfe9f5','#6f87a6'],['#101318','#39414f','#050608'],
    ['#f3c319','#ffdf58','#9d7000'],['#098f4e','#35d47c','#034d2a'],
    ['#7b21d8','#b55cff','#37106e'],['#ff6b00','#ff9a33','#9a3200'],
    ['#0f8fcf','#62d7ff','#075481'],['#ed1c78','#ff76b5','#7d0a3f']
  ];
  const p=palettes[Math.abs(Number(seed)||0)%palettes.length];
  const mode=Math.abs(Number(seed)||0)%5;
  const stripe=mode===0
    ? '<path d="M74 57h18v154H74zM108 57h18v154h-18z" fill="'+p[1]+'" opacity=".88"/>'
    : mode===1
      ? '<path d="M47 102h106v22H47zM47 145h106v18H47z" fill="'+p[1]+'" opacity=".82"/>'
      : mode===2
        ? '<path d="M52 54l92 158h-31L37 80z" fill="'+p[1]+'" opacity=".78"/>'
        : mode===3
          ? '<path d="M55 58h90v154H55z" fill="'+p[1]+'" opacity=".18"/><path d="M92 58h16v154H92z" fill="'+p[1]+'" opacity=".9"/>'
          : '<path d="M45 80l110 0v24H45z" fill="'+p[1]+'" opacity=".82"/><path d="M85 54h30v158H85z" fill="'+p[1]+'" opacity=".32"/>';
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="200" height="230" viewBox="0 0 200 230">'+
    '<defs>'+
      '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+p[1]+'"/><stop offset=".38" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[2]+'"/></linearGradient>'+
      '<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".28"/><stop offset=".35" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>'+
      '<filter id="ds" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="7" stdDeviation="6" flood-color="#00102d" flood-opacity=".36"/></filter>'+
      '<clipPath id="shirt"><path d="M71 39c7 8 17 12 29 12s22-4 29-12l29 13 28 35-28 25-17-18v120H59V94l-17 18-28-25 28-35z"/></clipPath>'+
    '</defs>'+
    '<g filter="url(#ds)">'+
      '<path d="M71 39c7 8 17 12 29 12s22-4 29-12l29 13 28 35-28 25-17-18v120H59V94l-17 18-28-25 28-35z" fill="url(#g)" stroke="'+p[2]+'" stroke-width="3"/>'+
      '<g clip-path="url(#shirt)">'+stripe+
        '<path d="M33 48c28 20 49 28 67 28s39-8 67-28v34c-28 14-50 20-67 20S61 96 33 82z" fill="#fff" opacity=".06"/>'+
        '<path d="M42 52c8 16 18 31 30 46l-13 116H42zM158 52c-8 16-18 31-30 46l13 116h17z" fill="#000" opacity=".12"/>'+
        '<rect x="14" y="39" width="172" height="175" fill="url(#s)"/>'+
      '</g>'+
      '<path d="M78 43c4 14 12 21 22 21s18-7 22-21" fill="none" stroke="'+p[1]+'" stroke-width="8" stroke-linecap="round"/>'+
      '<path d="M80 43c4 10 10 15 20 15s16-5 20-15" fill="none" stroke="'+p[2]+'" stroke-width="3" stroke-linecap="round"/>'+
      '<path d="M59 207h82" stroke="'+p[1]+'" stroke-width="3" opacity=".7"/>'+
      '<path d="M45 106l-27-22M155 106l27-22" stroke="'+p[1]+'" stroke-width="3" opacity=".78"/>'+
    '</g>'+
  '</svg>';
  return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
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
    const team=String(p.team||'Liga Juventino Rosas');
    let generated=false;
    if(!item||!transparentSrc){
      generated=true;
      idx=index;
      item={id:'generated-transparent-'+index,badgeX:58,badgeY:28,badgeW:15,badgeH:14,coverColor:'transparent',tilt:index%2?-6:6};
      transparentSrc=generatedTransparentJersey(hash(team+'|'+player+'|'+slotId));
    }
    const logo=logoFor(team);
    const stamp=String(item.id||idx)+'|'+player+'|'+team+'|transparent-v829';
    if(wrap.dataset.v820Stamp===stamp&&wrap.querySelector('.v820-lineup-jersey'))continue;

    const removeId=wrap.querySelector('[data-v576-remove]')?.getAttribute('data-v576-remove')||slotId;
    wrap.dataset.v820Stamp=stamp;
    wrap.dataset.v827Transparent='1';
    wrap.dataset.v829Generated=generated?'1':'0';
    wrap.style.setProperty('--v820-badge-x',Number(item.badgeX??57)+'%');
    wrap.style.setProperty('--v820-badge-y',Number(item.badgeY??27)+'%');
    wrap.style.setProperty('--v820-badge-w',Number(item.badgeW??16)+'%');
    wrap.style.setProperty('--v820-badge-h',Number(item.badgeH??15)+'%');
    wrap.style.setProperty('--v820-cover',String(item.coverColor||'rgba(12,24,61,.42)'));
    wrap.style.setProperty('--v820-tilt',Number(item.tilt??(index%2?-7:7))+'deg');
    wrap.innerHTML=
      '<span class="v820-lineup-kit v827-transparent-kit">'+
        '<img class="v820-lineup-jersey v827-transparent-shirt" src="'+esc(transparentSrc)+'" data-v829-fallback="'+esc(generatedTransparentJersey(hash(team+'|fallback|'+slotId)))+'" alt="" draggable="false" decoding="async">'+
        '<span class="v820-source-cover" aria-hidden="true"></span>'+
        '<img class="v820-team-logo" src="'+esc(logo)+'" alt="" draggable="false" decoding="async">'+
      '</span>'+
      '<i class="remove" data-v576-remove="'+esc(removeId)+'" aria-label="Quitar jugador">×</i>';
    const jerseyImg=wrap.querySelector('.v820-lineup-jersey');
    if(jerseyImg){
      jerseyImg.addEventListener('error',()=>{
        const fallback=jerseyImg.dataset.v829Fallback||generatedTransparentJersey(hash(team+'|error|'+slotId));
        if(jerseyImg.src!==fallback){
          jerseyImg.src=fallback;
          wrap.dataset.v829Generated='1';
        }
      },{once:true});
    }
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
