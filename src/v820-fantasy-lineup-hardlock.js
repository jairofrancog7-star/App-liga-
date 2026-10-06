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
function decorate(){
  removePicker();
  const slots=[...document.querySelectorAll('.v576-slot.filled[data-v576-slot]')];
  if(!slots.length)return;
  const items=pool();
  if(items.length<15){setTimeout(schedule,120);return}
  const rows=squad();
  const bySlot=new Map(rows.map(p=>[String(p?.slot??''),p||{}]));
  const used=new Set();

  slots.forEach((slot,index)=>{
    const wrap=slot.querySelector('.v590-kit-wrap');
    if(!wrap)return;
    const slotId=String(slot.dataset.v576Slot??index);
    const p=bySlot.get(slotId)||{};
    const player=String(p.name||slot.querySelector(':scope>b')?.textContent||('Jugador '+(index+1)));
    let idx=hash(player+'|'+slotId)%items.length;
    for(let n=0;n<items.length;n++){
      const q=(idx+n)%items.length;
      if(!used.has(q)){idx=q;used.add(q);break}
    }
    const item=items[idx]||items[index%items.length];
    if(!item)return;
    const team=String(p.team||'Liga Juventino Rosas');
    const logo=logoFor(team);
    const stamp=String(item.id||idx)+'|'+player+'|'+team;
    if(wrap.dataset.v820Stamp===stamp&&wrap.querySelector('.v820-lineup-jersey'))return;

    const removeId=wrap.querySelector('[data-v576-remove]')?.getAttribute('data-v576-remove')||slotId;
    wrap.dataset.v820Stamp=stamp;
    wrap.style.setProperty('--v820-badge-x',Number(item.badgeX??57)+'%');
    wrap.style.setProperty('--v820-badge-y',Number(item.badgeY??27)+'%');
    wrap.style.setProperty('--v820-badge-w',Number(item.badgeW??16)+'%');
    wrap.style.setProperty('--v820-badge-h',Number(item.badgeH??15)+'%');
    wrap.style.setProperty('--v820-cover',String(item.coverColor||'rgba(12,24,61,.42)'));
    wrap.style.setProperty('--v820-tilt',Number(item.tilt??(index%2?-7:7))+'deg');
    wrap.innerHTML=
      '<span class="v820-lineup-kit">'+
        '<img class="v820-lineup-jersey" src="'+esc(item.url)+'" alt="" draggable="false" decoding="async">'+
        '<span class="v820-source-cover" aria-hidden="true"></span>'+
        '<img class="v820-team-logo" src="'+esc(logo)+'" alt="" draggable="false" decoding="async">'+
      '</span>'+
      '<i class="remove" data-v576-remove="'+esc(removeId)+'" aria-label="Quitar jugador">×</i>';
  });
  document.body.dataset.v820FantasyLineup='active';
  document.body.dataset.v820FantasyJerseyPool=String(Math.min(items.length,50));
}

let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(decorate));
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
