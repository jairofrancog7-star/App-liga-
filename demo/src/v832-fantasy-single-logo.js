/* V832 — Fantasy: remove source club badge and keep ONE Liga team logo per shirt. */
(function(){
'use strict';
if(window.__LJR_V832_SINGLE_TEAM_LOGO__)return;
window.__LJR_V832_SINGLE_TEAM_LOGO__=true;

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=v=>{const p=String(v||'').trim().split(/\s+/).filter(Boolean);return ((p[0]?.[0]||'')+(p[1]?.[0]||p[0]?.[1]||'')).toUpperCase()||'JR'};
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const cleanCache=new Map();

function squad(){
  try{const x=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');return Array.isArray(x)?x:[]}catch(_){return []}
}
function db(){
  try{return window.V66_OFFICIAL_DIRECTORY?.data?.()||window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return {}}
}
function logoFor(team){
  let v='';
  try{v=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_OFFICIAL_API?.getLogo?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_TEAM_LOGOS?.get?.(team)||''}catch(_){}
  if(!v){
    const hit=Object.entries(db()?.team_logos||{}).find(([k])=>norm(k)===norm(team));
    if(hit)v=hit[1];
  }
  v=String(v||'').trim();
  if(!v)return '';
  if(/^(https?:|data:|blob:)/i.test(v))return v;
  try{return new URL(v.replace(/^\.\//,''),document.baseURI).href}catch(_){return v}
}
function pool(){
  return [
    ...(Array.isArray(window.LJR_V819_THREE_QUARTER_JERSEYS)?window.LJR_V819_THREE_QUARTER_JERSEYS:[]),
    ...(Array.isArray(window.LJR_V816_DIAGONAL_JERSEYS)?window.LJR_V816_DIAGONAL_JERSEYS:[])
  ];
}
function metaFor(src){
  const raw=String(src||'');
  return pool().find(x=>String(x?.url||'')===raw)||null;
}
function load(src){
  return new Promise(resolve=>{
    const im=new Image();im.decoding='async';
    im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;
  });
}
async function removeSourceBadge(src,meta){
  const key=src+'|'+String(meta?.badgeX??59)+'|'+String(meta?.badgeY??27);
  if(cleanCache.has(key))return cleanCache.get(key);
  const task=(async()=>{
    if(!src||src.startsWith('blob:'))return src;
    const im=await load(src);if(!im)return src;
    try{
      const w=im.naturalWidth||im.width,h=im.naturalHeight||im.height;
      if(!w||!h)return src;
      const c=document.createElement('canvas');c.width=w;c.height=h;
      const x=c.getContext('2d');x.drawImage(im,0,0,w,h);
      const cx=Math.round(w*((meta?.badgeX??59)/100));
      const cy=Math.round(h*((meta?.badgeY??27)/100));
      const rw=Math.max(8,Math.round(w*.115));
      const rh=Math.max(8,Math.round(h*.105));
      const sx=Math.max(0,Math.min(w-rw,cx-Math.round(rw/2)));
      const sy=Math.max(0,Math.min(h-rh,cy-Math.round(rh/2)));
      // Clone fabric from immediately below the badge so the old club crest disappears
      // without adding a gray/white patch.
      const fromY=Math.max(0,Math.min(h-rh,sy+Math.round(rh*1.15)));
      x.save();
      x.beginPath();
      x.rect(sx,sy,rw,rh);
      x.clip();
      x.drawImage(c,sx,fromY,rw,rh,sx,sy,rw,rh);
      x.restore();
      return c.toDataURL('image/png');
    }catch(_){return src}
  })();
  cleanCache.set(key,task);return task;
}
async function decorate(){
  if(route()!=='fantasyTeam')return;
  const rows=squad(),bySlot=new Map(rows.map(p=>[String(p?.slot??''),p||{}]));
  const slots=[...document.querySelectorAll('.v576-slot.filled[data-v576-slot]')];
  for(let index=0;index<slots.length;index++){
    const slot=slots[index],wrap=slot.querySelector('.v590-kit-wrap'),kit=wrap?.querySelector('.v820-lineup-kit');
    if(!wrap||!kit)continue;
    const slotId=String(slot.dataset.v576Slot??index);
    const p=bySlot.get(slotId)||{},team=String(p.team||'').trim();
    const logo=logoFor(team);
    const shirt=kit.querySelector('.v820-lineup-jersey');
    if(shirt && !shirt.dataset.v832Clean){
      const raw=String(shirt.getAttribute('src')||shirt.src||'');
      const meta=metaFor(raw);
      const cleaned=await removeSourceBadge(raw,meta);
      if(cleaned && shirt.isConnected)shirt.src=cleaned;
      shirt.dataset.v832Clean='1';
    }

    // Remove every older overlay/eraser so only one Liga crest remains.
    kit.querySelectorAll('.v820-team-logo,.v821-team-crest,.v821-source-eraser,.v824-team-crest,.v824-source-cover,.v832-team-crest').forEach(n=>n.remove());

    const crest=document.createElement('span');
    crest.className='v832-team-crest'+(logo?'':' is-fallback');
    crest.innerHTML=(logo?'<img src="'+esc(logo)+'" alt="" draggable="false" decoding="async">':'')+'<b>'+esc(initials(team))+'</b>';
    kit.appendChild(crest);
    const ci=crest.querySelector('img');
    if(ci)ci.addEventListener('error',()=>crest.classList.add('is-fallback'),{once:true});
    wrap.dataset.v832SingleLogo='1';
  }
  document.body.dataset.v832FantasySingleLogo='1';
}
let raf=0,t=0;
function schedule(){
  clearTimeout(t);cancelAnimationFrame(raf);
  t=setTimeout(()=>{raf=requestAnimationFrame(()=>decorate().catch(()=>{}))},35);
}
function boot(){
  new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('ljr:official-data',schedule);
  window.addEventListener('ljr:jersey-library-ready',schedule);
  schedule();setTimeout(schedule,250);setTimeout(schedule,900);setTimeout(schedule,1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();