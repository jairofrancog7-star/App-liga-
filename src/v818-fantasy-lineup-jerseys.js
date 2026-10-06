/* V818 — Use 50 distinct real jersey designs as the Fantasy lineup skin pool.
   Visible filled positions are kept unique per render and replace the old CSS mock shirts. */
(function(){
'use strict';
if(window.__LJR_V818_FANTASY_LINEUP_JERSEYS__)return;
window.__LJR_V818_FANTASY_LINEUP_JERSEYS__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function hash(value){
  let h=2166136261;
  const s=String(value||'');
  for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}
  return h>>>0;
}
function pool(){
  const src=window.LJR_FANTASY_JERSEYS?.catalog;
  if(!Array.isArray(src))return [];
  const seen=new Set(),out=[];
  for(const item of src){
    const id=String(item?.id||'');
    const url=String(item?.url||'');
    if(!id||!url||seen.has(id))continue;
    seen.add(id);out.push(item);
    if(out.length===50)break;
  }
  return out;
}
function playerKey(slot,index){
  const name=slot.querySelector(':scope>b')?.textContent?.trim()||'jugador-'+index;
  const slotId=slot.getAttribute('data-v576-slot')||String(index+1);
  return name+'|'+slotId;
}
function chooseUnique(items,key,used){
  if(!items.length)return null;
  let idx=hash(key)%items.length;
  for(let step=0;step<items.length;step++){
    const probe=(idx+step)%items.length;
    if(!used.has(probe)){used.add(probe);return items[probe]}
  }
  return items[idx];
}
function decorate(){
  if(route()!=='fantasyTeam')return;
  const items=pool();
  if(items.length<50)return;

  const slots=[...document.querySelectorAll('.v576-slot.filled')];
  const used=new Set();
  slots.forEach((slot,index)=>{
    const wrap=slot.querySelector('.v590-kit-wrap');
    if(!wrap)return;
    const item=chooseUnique(items,playerKey(slot,index),used);
    if(!item)return;
    if(wrap.dataset.v818Jersey===item.id&&wrap.querySelector('.v818-lineup-jersey'))return;

    const remove=wrap.querySelector('[data-v576-remove]');
    const removeId=remove?.getAttribute('data-v576-remove')||slot.getAttribute('data-v576-slot')||'';
    wrap.dataset.v818Jersey=item.id;
    wrap.setAttribute('title',item.label||item.club||'Jersey Fantasy');
    wrap.innerHTML=
      '<span class="v818-lineup-kit" data-v818-kit="'+esc(item.id)+'">'+
        '<img class="v818-lineup-jersey" src="'+esc(item.url)+'" alt="" loading="eager" decoding="async" draggable="false">'+
      '</span>'+
      '<i class="remove" data-v576-remove="'+esc(removeId)+'" aria-label="Quitar jugador">×</i>';
  });
  document.body.dataset.v818JerseyPool='50';
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
  setTimeout(schedule,120);
  setTimeout(schedule,600);
}
window.addEventListener('hashchange',()=>setTimeout(schedule,20));
window.addEventListener('ljr:jersey-library-ready',schedule);
document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-v576-auto],[data-v576-slot],[data-v576-search],[data-v576-remove]'))setTimeout(schedule,30);
},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();
