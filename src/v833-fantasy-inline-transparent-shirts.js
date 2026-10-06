/* V833 — Fantasy: playeras inline SVG 100% transparentes.
   Hard final pass: no external jersey image can disappear or leave a matte.
   The shirt is drawn locally as SVG and the real team crest stays above it. */
(()=>{
'use strict';
if(window.__LJR_V833_INLINE_TRANSPARENT_SHIRTS__)return;
window.__LJR_V833_INLINE_TRANSPARENT_SHIRTS__=true;

const hash=value=>{let h=2166136261,s=String(value||'');for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const palettes=[
  ['#0a49dd','#30d7ef','#052376'],
  ['#c71927','#ef4050','#65030a'],
  ['#f3f7fb','#dce7f4','#6c809d'],
  ['#171a20','#4a5361','#050608'],
  ['#f2c11c','#ffe067','#946900'],
  ['#07894c','#41d87e','#034823'],
  ['#7024c7','#b566ff','#351065'],
  ['#f06a08','#ffad48','#8f3300'],
  ['#138aca','#68d9ff','#074f78'],
  ['#e91f77','#ff78b6','#780b3d']
];

function norm(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function playerTeam(slot){
  const id=String(slot?.dataset?.v576Slot??'');
  try{
    const rows=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');
    const hit=Array.isArray(rows)?rows.find(p=>String(p?.slot??'')===id):null;
    return String(hit?.team||'Liga Juventino Rosas');
  }catch(_){return 'Liga Juventino Rosas'}
}
function playerName(slot){
  const id=String(slot?.dataset?.v576Slot??'');
  try{
    const rows=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');
    const hit=Array.isArray(rows)?rows.find(p=>String(p?.slot??'')===id):null;
    return String(hit?.name||slot?.querySelector(':scope>b')?.textContent||id||'Jugador');
  }catch(_){return String(slot?.querySelector(':scope>b')?.textContent||id||'Jugador')}
}
function logoFor(team){
  let v='';
  try{v=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_OFFICIAL_API?.getLogo?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_TEAM_LOGOS?.get?.(team)||''}catch(_){}
  v=String(v||'');
  if(!v)return './assets/liga-logo.webp';
  if(/^(https?:|data:|blob:|\/)/i.test(v))return v;
  if(v.startsWith('assets/'))return './'+v;
  return v;
}
function svgMarkup(seed){
  const p=palettes[seed%palettes.length],mode=seed%6;
  const stripe=mode===0
    ? '<path d="M66 58h20v151H66zm48 0h20v151h-20z" fill="'+p[1]+'" opacity=".9"/>'
    : mode===1
      ? '<path d="M47 92h106v25H47zm0 43h106v19H47z" fill="'+p[1]+'" opacity=".84"/>'
      : mode===2
        ? '<path d="M42 62l92 148h-31L31 91z" fill="'+p[1]+'" opacity=".82"/>'
        : mode===3
          ? '<path d="M91 55h18v158H91z" fill="'+p[1]+'" opacity=".92"/><path d="M58 55h15v158H58zm69 0h15v158h-15z" fill="'+p[1]+'" opacity=".35"/>'
          : mode===4
            ? '<path d="M45 80h110v27H45z" fill="'+p[1]+'" opacity=".88"/><path d="M83 54h34v159H83z" fill="'+p[1]+'" opacity=".30"/>'
            : '<path d="M35 65l130 82v31L35 96z" fill="'+p[1]+'" opacity=".74"/>';
  return '<svg class="v833-shirt-svg" viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<defs>'+
      '<linearGradient id="v833g'+seed+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+p[1]+'"/><stop offset=".38" stop-color="'+p[0]+'"/><stop offset="1" stop-color="'+p[2]+'"/></linearGradient>'+
      '<linearGradient id="v833s'+seed+'" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".22"/><stop offset=".42" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>'+
      '<clipPath id="v833c'+seed+'"><path d="M70 40c7 8 18 12 30 12s23-4 30-12l29 13 27 34-28 25-17-18v119H59V94l-17 18-28-25 27-34z"/></clipPath>'+
      '<filter id="v833d'+seed+'" x="-35%" y="-35%" width="170%" height="175%"><feDropShadow dx="0" dy="7" stdDeviation="5" flood-color="#00102d" flood-opacity=".36"/></filter>'+
    '</defs>'+
    '<g filter="url(#v833d'+seed+')">'+
      '<path d="M70 40c7 8 18 12 30 12s23-4 30-12l29 13 27 34-28 25-17-18v119H59V94l-17 18-28-25 27-34z" fill="url(#v833g'+seed+')" stroke="'+p[2]+'" stroke-width="3"/>'+
      '<g clip-path="url(#v833c'+seed+')">'+stripe+
        '<path d="M30 49c30 22 51 30 70 30s40-8 70-30v35c-29 15-51 21-70 21S59 99 30 84z" fill="#fff" opacity=".055"/>'+
        '<path d="M13 39h174v176H13z" fill="url(#v833s'+seed+')"/>'+
      '</g>'+
      '<path d="M79 43c4 14 11 21 21 21s17-7 21-21" fill="none" stroke="'+p[1]+'" stroke-width="8" stroke-linecap="round"/>'+
      '<path d="M81 43c4 10 9 15 19 15s15-5 19-15" fill="none" stroke="'+p[2]+'" stroke-width="3" stroke-linecap="round"/>'+
      '<path d="M59 207h82M44 105L18 84m138 21 26-21" stroke="'+p[1]+'" stroke-width="3" opacity=".72"/>'+
    '</g>'+
  '</svg>';
}
function decorate(){
  if(!/fantasyTeam/i.test(String(location.hash||''))&&!document.body.classList.contains('v587-fantasy-team-open'))return;
  const slots=[...document.querySelectorAll('.v576-slot.filled[data-v576-slot]')];
  slots.forEach((slot,index)=>{
    const wrap=slot.querySelector('.v590-kit-wrap');
    const kit=wrap?.querySelector('.v820-lineup-kit');
    if(!wrap||!kit)return;
    const team=playerTeam(slot),name=playerName(slot),seed=hash(team+'|'+name+'|'+index)%10000;
    let layer=kit.querySelector('.v833-transparent-shirt');
    if(!layer){
      layer=document.createElement('span');
      layer.className='v833-transparent-shirt';
      kit.prepend(layer);
    }
    const stamp=String(seed);
    if(layer.dataset.seed!==stamp){
      layer.dataset.seed=stamp;
      layer.innerHTML=svgMarkup(seed);
    }

    // Hide every old jersey source image. The inline SVG is the only shirt.
    kit.querySelectorAll('.v820-lineup-jersey,.v827-transparent-shirt').forEach(img=>{
      img.style.setProperty('display','none','important');
      img.style.setProperty('visibility','hidden','important');
      img.style.setProperty('opacity','0','important');
    });
    kit.querySelectorAll('.v820-source-cover,.v821-source-eraser').forEach(n=>n.remove());

    // Keep exactly one real crest over the locally-rendered shirt.
    const oldCrests=[...kit.querySelectorAll('.v821-team-crest')];
    oldCrests.slice(1).forEach(n=>n.remove());
    let crest=oldCrests[0];
    if(!crest){
      crest=document.createElement('span');
      crest.className='v821-team-crest v833-crest';
      crest.innerHTML='<img alt="" draggable="false"><b></b>';
      kit.appendChild(crest);
    }
    const img=crest.querySelector('img'),fallback=crest.querySelector('b');
    const src=logoFor(team);
    if(img){
      if(img.getAttribute('src')!==src)img.setAttribute('src',src);
      img.style.removeProperty('display');
      img.onerror=()=>{img.style.setProperty('display','none','important');if(fallback){fallback.textContent=String(team||'?').trim().slice(0,1).toUpperCase();fallback.style.setProperty('display','grid','important')}};
    }
    wrap.dataset.v833Transparent='1';
  });
  document.body.dataset.v833FantasyTransparent='inline-svg';
}
let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>requestAnimationFrame(decorate))}
function boot(){
  const mo=new MutationObserver(schedule);
  mo.observe(document.body,{childList:true,subtree:true});
  addEventListener('hashchange',()=>setTimeout(schedule,20));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-remove],[data-v576-pick]'))setTimeout(schedule,30)},true);
  schedule();setTimeout(schedule,80);setTimeout(schedule,300);setTimeout(schedule,900);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();