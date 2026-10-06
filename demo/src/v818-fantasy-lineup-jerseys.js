/* V819 — Put the downloaded diagonal/3D jerseys directly inside the Fantasy lineup.
   No catalog UI. Same Liga team keeps the same real jersey base and its current Liga crest. */
(function(){
'use strict';
if(window.__LJR_V819_FANTASY_LINEUP_JERSEYS__)return;
window.__LJR_V819_FANTASY_LINEUP_JERSEYS__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LEAGUE_LOGO=RAW+'assets/liga-logo.webp';

function hash(value){
  let h=2166136261;
  const s=String(value||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function pool(){
  const direct=window.LJR_V816_DIAGONAL_JERSEYS;
  if(Array.isArray(direct)&&direct.length)return direct.filter(x=>x&&x.url);
  const src=window.LJR_FANTASY_JERSEYS?.catalog;
  if(!Array.isArray(src))return [];
  return src.filter(x=>x&&x.url&&x.userDownloaded);
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
function chooseForTeam(items,team,used,assigned){
  const key=String(team||'equipo');
  if(assigned.has(key))return items[assigned.get(key)%items.length]||items[0];
  let idx=hash(key)%items.length;
  for(let step=0;step<items.length;step++){
    const probe=(idx+step)%items.length;
    if(!used.has(probe)){
      used.add(probe);assigned.set(key,probe);return items[probe];
    }
  }
  assigned.set(key,idx);
  return items[idx];
}
function decorate(){
  if(route()!=='fantasyTeam')return;
  const items=pool();
  if(!items.length)return;

  document.querySelectorAll('[data-v813-open],.v813-jersey-layer').forEach(n=>n.remove());
  document.body.classList.remove('v813-jersey-picker-open','v813-custom-jersey');
  document.documentElement.style.removeProperty('--v813-jersey-src');

  const profile=squadMap();
  const slots=[...document.querySelectorAll('.v576-slot.filled')];
  const used=new Set(),assigned=new Map();

  slots.forEach((slot,index)=>{
    const wrap=slot.querySelector('.v590-kit-wrap');
    if(!wrap)return;
    const slotId=String(slot.getAttribute('data-v576-slot')||index);
    const p=profile.get(slotId)||{};
    const playerName=String(p.name||slot.querySelector(':scope>b')?.textContent||('jugador-'+index));
    const team=String(p.team||'Liga Juventino Rosas');
    const item=chooseForTeam(items,team,used,assigned);
    if(!item)return;

    const remove=wrap.querySelector('[data-v576-remove]');
    const removeId=remove?.getAttribute('data-v576-remove')||slotId;
    const logo=teamLogo(team);
    const stamp=item.id+'|'+team;
    if(wrap.dataset.v819Jersey===stamp&&wrap.querySelector('.v819-lineup-jersey'))return;

    wrap.dataset.v819Jersey=stamp;
    wrap.dataset.v819Team=team;
    wrap.setAttribute('title',team+' · '+playerName);
    wrap.innerHTML=
      '<span class="v819-lineup-kit" data-v819-kit="'+esc(item.id)+'">'+
        '<img class="v819-lineup-jersey" src="'+esc(item.url)+'" alt="" loading="eager" decoding="async" draggable="false">'+
        '<span class="v819-source-badge-cover" aria-hidden="true"></span>'+
        '<img class="v819-lineup-team-logo" src="'+esc(logo)+'" alt="" loading="eager" decoding="async" draggable="false">'+
      '</span>'+
      '<i class="remove" data-v576-remove="'+esc(removeId)+'" aria-label="Quitar jugador">×</i>';
  });
  document.body.dataset.v819JerseyPool=String(items.length);
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(decorate);
}
const observer=new MutationObserver(schedule);
function boot(){
  observer.observe(document.body,{childList:true,subtree:true});
  schedule();
  setTimeout(schedule,100);
  setTimeout(schedule,450);
}
window.addEventListener('hashchange',()=>setTimeout(schedule,20));
window.addEventListener('ljr:jersey-library-ready',schedule);
document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-search],[data-v576-remove]'))setTimeout(schedule,30);
},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();