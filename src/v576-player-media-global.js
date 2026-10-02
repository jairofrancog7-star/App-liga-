/* V576 — Fotos deportivas reales reutilizadas en toda la app.
   Fuente: player_profiles del snapshot oficial. No expone CURP, INE ni documentos. */
(function(){
'use strict';
if(window.__LJR_V576_PLAYER_MEDIA__)return;
window.__LJR_V576_PLAYER_MEDIA__=true;

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\batl\b/g,'atletico').replace(/\bdep\b/g,'deportivo').replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const same=(a,b)=>{
  const x=norm(a),y=norm(b);if(x===y)return true;
  const pairs=[
    ['atletico galeana','galeana'],['toros de cuenda','cuenda'],
    ['deportivo maravillas','dep maravillas'],['deportivo zapata','dep zapata'],
    ['deportivo nopalero','dep nopalero'],['deportivo la luz','dep la luz']
  ];
  return pairs.some(p=>(x===norm(p[0])&&y===norm(p[1]))||(x===norm(p[1])&&y===norm(p[0])));
};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let sig='',rows=[];

function data(){
  try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}catch(_){return window.LJR_OFFICIAL_DATA||null}
}
function rebuild(force=false){
  const d=data(),next=String(d?.captured_at_utc||'none');
  if(!force&&next===sig&&rows.length)return rows;
  sig=next;rows=[];
  for(const [cat,c] of Object.entries(d?.categories||{})){
    for(const [team,list] of Object.entries(c?.player_profiles||{})){
      for(const p of (Array.isArray(list)?list:[])){
        const name=String(p?.name||'').trim();if(!name)continue;
        rows.push({
          name,team:String(team),cat:String(cat),category:String(c?.name||''),
          position:String(p?.position||''),dorsal:String(p?.dorsal||''),
          photo:String(p?.photo||'')
        });
      }
    }
  }
  return rows;
}
function profile(name,team='',cat=''){
  const all=rebuild(),n=norm(name),t=norm(team),cid=String(cat||'');
  if(!n)return null;
  let hit=all.find(p=>norm(p.name)===n&&t&&same(p.team,team)&&(!cid||p.cat===cid));
  if(hit)return hit;
  hit=all.find(p=>norm(p.name)===n&&t&&same(p.team,team));
  if(hit)return hit;
  if(cid){hit=all.find(p=>norm(p.name)===n&&p.cat===cid);if(hit)return hit}
  const hits=all.filter(p=>norm(p.name)===n);
  return hits.length===1?hits[0]:(hits[0]||null);
}
function directLocal(name,team){
  const store=window.LJR_PLAYER_PHOTOS;
  if(!store||typeof store!=='object')return '';
  const a=store[norm(name)+'|'+norm(team)]||store[norm(name)]||store[name];
  return typeof a==='string'?a:'';
}
function photo(name,team='',cat=''){
  const local=directLocal(name,team);if(local)return local;
  return String(profile(name,team,cat)?.photo||'');
}
function initials(name){
  return String(name||'J').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'J';
}
function avatar(name,team='',cat='',cls='v576-player-avatar'){
  const src=photo(name,team,cat);
  return src
    ?'<span class="'+esc(cls)+' v576-has-photo"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>'
    :'<span class="'+esc(cls)+' v576-photo-fallback">'+esc(initials(name))+'</span>';
}
function setAvatar(el,name,team='',cat=''){
  if(!(el instanceof Element))return false;
  const src=photo(name,team,cat);if(!src)return false;
  const old=el.querySelector(':scope > img');
  if(old&&old.getAttribute('src')===src)return true;
  el.classList.add('v576-has-photo');
  el.innerHTML='<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
  return true;
}
function inferTeam(text){
  return String(text||'').split('·')[0].trim();
}
function enhance(root=document){
  const scope=root instanceof Element||root instanceof Document?root:document;
  scope.querySelectorAll?.('.v66-player-row[data-v66-player]').forEach(row=>{
    setAvatar(row.querySelector('.v66-player-avatar'),row.dataset.v66Player,row.dataset.v66PlayerTeam||'',row.dataset.v66CatId||'');
  });
  scope.querySelectorAll?.('.v42-player-row').forEach(row=>{
    const name=row.dataset.v42Player||row.querySelector('.v42-player-copy strong')?.textContent||'';
    const team=row.dataset.v66PlayerTeam||inferTeam(row.querySelector('.v42-player-copy small')?.textContent||'');
    setAvatar(row.querySelector('.v42-avatar'),name,team,row.dataset.v66CatId||'');
  });
  scope.querySelectorAll?.('.v446-stat-ref-row[data-v33-player]').forEach(row=>{
    const name=row.dataset.v33Player||'',team=row.querySelector('.v446-stat-ref-copy small')?.textContent||'';
    setAvatar(row.querySelector('.v446-stat-ref-avatar'),name,team);
  });
  scope.querySelectorAll?.('.v419-player-card').forEach(row=>{
    setAvatar(row.querySelector('.v419-player-avatar'),row.querySelector('div>b')?.textContent||'',row.querySelector('div>em')?.textContent||'');
  });
  scope.querySelectorAll?.('.v414-row-main[data-v414-player]').forEach(row=>{
    const name=row.querySelector('.v414-row-copy b')?.textContent||'';
    const team=inferTeam(row.querySelector('.v414-row-copy small')?.textContent||'');
    setAvatar(row.querySelector('.v414-avatar'),name,team);
  });
  scope.querySelectorAll?.('.v379-related-card').forEach(row=>{
    setAvatar(row.querySelector('.v379-related-avatar'),row.dataset.v379Related||'',row.dataset.v379RelatedTeam||'',row.dataset.v379RelatedCat||'');
  });
}
const store=(window.LJR_PLAYER_PHOTOS&&typeof window.LJR_PLAYER_PHOTOS==='object')?window.LJR_PLAYER_PHOTOS:{};
const previousGet=typeof store.get==='function'?store.get.bind(store):null;
store.get=function(name,team,cat){
  if(previousGet){
    try{const x=previousGet(name,team,cat);if(x)return x}catch(_){}
  }
  return photo(name,team,cat);
};
window.LJR_PLAYER_PHOTOS=store;
window.LJR_PLAYER_MEDIA={data,rebuild,profile,photo,avatar,setAvatar,enhance,norm,same};

let timer=0;
const schedule=()=>{clearTimeout(timer);timer=setTimeout(()=>enhance(document),80)};
window.addEventListener('ljr:official-data',()=>{rebuild(true);schedule()});
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
schedule();setTimeout(schedule,700);setTimeout(schedule,1800);
})();