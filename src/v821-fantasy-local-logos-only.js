/* V821 — Fantasy local logos only.
   Preserves each jersey design, hides source-club crests, repairs broken shirt art,
   and shows the correct Liga team crest (or initials if the crest source fails). */
(function(){
'use strict';
if(window.__LJR_V821_LOCAL_LOGOS_ONLY__)return;
window.__LJR_V821_LOCAL_LOGOS_ONLY__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const initials=v=>{
  const p=String(v||'').trim().split(/\s+/).filter(Boolean);
  return ((p[0]?.[0]||'')+(p[1]?.[0]||p[0]?.[1]||'')).toUpperCase()||'JR';
};

function normalizeLogo(v){
  v=String(v||'').trim();
  if(!v)return '';
  if(/^(https?:|data:|blob:)/i.test(v))return v;
  if(v.startsWith('./'))v=v.slice(2);
  if(v.startsWith('/'))v=v.slice(1);
  if(v.startsWith('assets/'))return RAW+v;
  return v;
}
function data(){
  try{return window.V66_OFFICIAL_DIRECTORY?.data?.()||window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{}}catch(_){return window.LJR_OFFICIAL_DATA||{}}
}
function logoFor(team){
  let v='';
  try{v=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_OFFICIAL_API?.getLogo?.(team)||''}catch(_){}
  if(!v)try{v=window.LJR_TEAM_LOGOS?.get?.(team)||''}catch(_){}
  if(!v){
    const logos=data()?.team_logos||{};
    const hit=Object.entries(logos).find(([k])=>norm(k)===norm(team));
    if(hit)v=hit[1];
  }
  return normalizeLogo(v);
}
function squad(){
  try{
    const rows=JSON.parse(localStorage.getItem('v576-fantasy-squad')||'[]');
    return Array.isArray(rows)?rows:[];
  }catch(_){return []}
}
function fallbackJerseys(){
  const all=[
    ...(Array.isArray(window.LJR_V819_THREE_QUARTER_JERSEYS)?window.LJR_V819_THREE_QUARTER_JERSEYS:[]),
    ...(Array.isArray(window.LJR_V816_DIAGONAL_JERSEYS)?window.LJR_V816_DIAGONAL_JERSEYS:[]),
    ...(Array.isArray(window.LJR_FANTASY_JERSEYS?.catalog)?window.LJR_FANTASY_JERSEYS.catalog:[])
  ];
  const out=[],seen=new Set();
  for(const x of all){
    const u=String(x?.url||'');
    if(!u.startsWith('data:image/')||seen.has(u))continue;
    seen.add(u);out.push(u);
  }
  return out;
}
function repairJersey(img,index,fallbacks){
  if(!img||img.dataset.v821Repair)return;
  img.dataset.v821Repair='1';
  img.addEventListener('error',()=>{
    const next=fallbacks[index%Math.max(1,fallbacks.length)];
    if(next&&img.src!==next){
      img.classList.remove('v821-image-error');
      img.src=next;
      return;
    }
    img.classList.add('v821-image-error');
  });
}
function crestHtml(team,src){
  return '<span class="v821-team-crest'+(src?'':' is-fallback')+'" data-v821-team="'+esc(team)+'">'+
    (src?'<img src="'+esc(src)+'" alt="" draggable="false" decoding="async">':'')+
    '<b>'+esc(initials(team))+'</b>'+
  '</span>';
}
function bindCrest(wrapper){
  const img=wrapper?.querySelector('.v821-team-crest img');
  if(!img||img.dataset.v821Bound)return;
  img.dataset.v821Bound='1';
  img.addEventListener('error',()=>{
    img.classList.add('v821-image-error');
    wrapper.querySelector('.v821-team-crest')?.classList.add('is-fallback');
  },{once:true});
}
function decorate(){
  const slots=[...document.querySelectorAll('.v576-slot.filled[data-v576-slot]')];
  if(!slots.length)return;
  const rows=squad(),bySlot=new Map(rows.map(p=>[String(p?.slot??''),p||{}]));
  const fallbacks=fallbackJerseys();

  slots.forEach((slot,index)=>{
    const wrap=slot.querySelector('.v590-kit-wrap');
    const kit=wrap?.querySelector('.v820-lineup-kit');
    if(!wrap||!kit)return;

    const slotId=String(slot.dataset.v576Slot??index);
    const p=bySlot.get(slotId)||{};
    const team=String(p.team||'').trim();
    const logo=logoFor(team);

    const shirt=kit.querySelector('.v820-lineup-jersey');
    repairJersey(shirt,index,fallbacks);

    kit.querySelectorAll('.v821-source-eraser,.v821-team-crest').forEach(n=>n.remove());
    const generated=wrap.dataset.v829Generated==='1';
    kit.insertAdjacentHTML('beforeend',
      (generated?'':(
        '<span class="v821-source-eraser left" aria-hidden="true"></span>'+
        '<span class="v821-source-eraser right" aria-hidden="true"></span>'+
        '<span class="v821-source-eraser center" aria-hidden="true"></span>'
      ))+
      crestHtml(team,logo)
    );
    bindCrest(kit);
    wrap.dataset.v821LocalLogo='1';
  });
  document.body.dataset.v821FantasyLocalLogos='only';
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(decorate));
}
function boot(){
  const mo=new MutationObserver(schedule);
  mo.observe(document.body,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(schedule,25));
  window.addEventListener('ljr:jersey-library-ready',schedule);
  window.addEventListener('ljr:official-data',schedule);
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-remove],[data-v576-pick]'))setTimeout(schedule,40);
  },true);
  schedule();setTimeout(schedule,160);setTimeout(schedule,650);setTimeout(schedule,1400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
