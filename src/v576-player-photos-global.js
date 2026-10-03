/* V576 — Fotos oficiales de jugadores en toda la app azul.
   Reutiliza player_profiles.photo; si un jugador no tiene foto, conserva el diseño actual. */
(function(){
'use strict';
if(window.__LJR_V576_PLAYER_PHOTOS_GLOBAL__)return;
window.__LJR_V576_PLAYER_PHOTOS_GLOBAL__=true;

const LOCAL='./data/official-live.json?v=20261002-v576-player-photos-global';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261003-v644-player-photos-all-rosters';
const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
let db=window.LJR_OFFICIAL_DATA||null,loading=null,timer=0;
let exact=new Map(),byName=new Map();

const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const key=(n,t,c)=>norm(n)+'|'+norm(t)+'|'+String(c||'');

async function fetchJson(url){
 try{const r=await fetch(url,{cache:'no-store'});return r.ok?await r.json():null}catch(_){return null}
}
function newer(a,b){
 if(!a)return b;if(!b)return a;
 return String(b.captured_at_utc||'')>String(a.captured_at_utc||'')?b:a;
}
async function load(){
 if(loading)return loading;
 loading=(async()=>{
   db=newer(db,window.LJR_OFFICIAL_DATA||null);
   db=newer(db,await fetchJson(LOCAL));
   db=newer(db,await fetchJson(REMOTE));
   build();
   return db;
 })().finally(()=>{loading=null});
 return loading;
}
function build(){
 exact=new Map();byName=new Map();
 const pub=window.LJR_PLAYER_PHOTOS&&typeof window.LJR_PLAYER_PHOTOS==='object'?window.LJR_PLAYER_PHOTOS:{};
 for(const [cid,c] of Object.entries(db?.categories||{})){
   for(const [team,rows] of Object.entries(c?.player_profiles||{})){
     for(const p of (Array.isArray(rows)?rows:[])){
       const name=String(p?.name||'').trim(),photo=String(p?.photo||'').trim();
       if(!name)continue;
       const rec={name,team,cat:String(cid),category:String(c?.name||''),photo,position:String(p?.position||''),dorsal:String(p?.dorsal||'')};
       exact.set(key(name,team,cid),rec);
       exact.set(key(name,team,''),rec);
       const nk=norm(name),arr=byName.get(nk)||[];arr.push(rec);byName.set(nk,arr);
       if(photo){
         const kt=norm(name)+'|'+norm(team),kn=norm(name);
         if(!pub[kt])pub[kt]=photo;
         if(!pub[kn])pub[kn]=photo;
       }
     }
   }
 }
 window.LJR_PLAYER_PHOTOS=pub;
}
function resolve(name,team='',cat=''){
 const n=norm(name);if(!n)return null;
 if(team&&cat&&exact.has(key(name,team,cat)))return exact.get(key(name,team,cat));
 if(team&&exact.has(key(name,team,'')))return exact.get(key(name,team,''));
 const arr=byName.get(n)||[];
 if(cat){
   const hits=arr.filter(x=>String(x.cat)===String(cat));
   if(hits.length===1)return hits[0];
   if(team){const h=hits.find(x=>norm(x.team)===norm(team));if(h)return h}
 }
 if(arr.length===1)return arr[0];
 const photos=arr.filter(x=>x.photo);
 const unique=new Set(photos.map(x=>x.photo));
 return unique.size===1?photos[0]||arr[0]:null;
}
function hasPhoto(rec){return !!String(rec?.photo||'').trim()}
function teamLogo(team){
 const wanted=norm(team);if(!wanted)return '';
 const hit=Object.entries(db?.team_logos||{}).find(([k])=>norm(k)===wanted)?.[1];
 if(typeof hit==='string')return hit;
 if(hit?.local)return ROOT+String(hit.local).replace(/^\.\//,'');
 if(hit?.source)return String(hit.source);
 try{return String(window.LJR_TEAM_LOGOS?.get?.(team)||'')}catch(_){return ''}
}
function setAvatar(el,rec,fallbackTeam=''){
 if(!el)return false;
 const real=hasPhoto(rec),team=String(rec?.team||fallbackTeam||'').trim();
 const src=real?String(rec.photo).trim():teamLogo(team);
 if(!src)return false;
 const isTeamFallback=el.dataset.v576TeamFallback==='1'||el.classList.contains('v576-team-fallback');
 if(real&&el.dataset.v576Photo==='1'&&!isTeamFallback)return false;
 const existing=el.querySelector?.('img');
 if(real&&existing&&existing.getAttribute('src')&&!isTeamFallback){
   el.dataset.v576Photo='1';
   return false;
 }
 if(existing&&String(existing.getAttribute('src')||'')===src){
   if(real){el.dataset.v576Photo='1';el.classList.remove('v576-team-fallback');el.removeAttribute('data-v576-team-fallback')}
   else{el.dataset.v576TeamFallback='1';el.classList.add('v576-team-fallback')}
   return false;
 }
 const alt=real?String(rec?.name||'Jugador'):team;
 el.innerHTML='<img class="v576-player-photo" src="'+esc(src)+'" alt="'+esc(alt)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer">';
 el.classList.remove('v576-photo-fallback');
 el.classList.add('v576-has-photo');
 if(real){
   el.classList.remove('v576-team-fallback');
   el.removeAttribute('data-v576-team-fallback');
   el.dataset.v576Photo='1';
 }else{
   el.classList.add('v576-team-fallback');
   el.dataset.v576TeamFallback='1';
   el.dataset.v576Photo='0';
 }
 return true;
}
function addInline(container,rec,cls=''){
 if(!container||!hasPhoto(rec)||container.querySelector(':scope > .v576-inline-player-photo'))return false;
 const img=document.createElement('img');
 img.className='v576-inline-player-photo '+cls;
 img.src=rec.photo;img.alt=rec.name;img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
 container.prepend(img);container.classList.add('v576-has-inline-photo');
 return true;
}
function clearInline(container){
 if(!container)return false;
 let changed=false;
 container.querySelectorAll(':scope > .v576-inline-player-photo').forEach(img=>{img.remove();changed=true});
 container.classList.remove('v576-has-inline-photo');
 return changed;
}
function addHero(container,rec){
 if(!container||!hasPhoto(rec)||container.querySelector(':scope > .v576-hero-player-photo, :scope > .v576-scorer-hero-photo'))return false;
 const img=document.createElement('img');
 img.className='v576-hero-player-photo';img.src=rec.photo;img.alt=rec.name;img.loading='eager';img.decoding='async';img.referrerPolicy='no-referrer';
 container.prepend(img);container.classList.add('v576-has-hero-photo');
 return true;
}
function txt(el,sel){return el.querySelector(sel)?.textContent?.trim()||''}
function attr(el,n){return el.getAttribute(n)||''}
function catStored(){return localStorage.getItem('v62-category')||''}
function teamStored(){return localStorage.getItem('v62-team-name')||''}

function hydrate(){
 if(!db){load().then(hydrate);return}

 document.querySelectorAll('.v66-player-row[data-v66-player]').forEach(row=>{
   const name=attr(row,'data-v66-player'),team=attr(row,'data-v66-player-team'),cat=attr(row,'data-v66-cat-id');
   setAvatar(row.querySelector('.v66-player-avatar'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v414-player-row[data-v414-player-name]').forEach(row=>{
   const name=attr(row,'data-v414-player-name'),team=attr(row,'data-v414-player-team'),cat=attr(row,'data-v414-player-cat');
   setAvatar(row.querySelector('.v414-player-photo'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v42-player-row').forEach(row=>{
   const name=attr(row,'data-v42-player')||txt(row,'.v42-player-copy strong');
   const team=attr(row,'data-v66-player-team')||teamStored();
   const cat=attr(row,'data-v66-cat-id')||catStored();
   setAvatar(row.querySelector('.v42-avatar'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v371-player').forEach(row=>{
   const name=attr(row,'data-v42-player')||txt(row,'span:nth-child(2) b');
   const team=attr(row,'data-v66-player-team')||teamStored();
   const cat=attr(row,'data-v66-cat-id')||catStored();
   setAvatar(row.querySelector('.v371-player-avatar'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v371-preview button').forEach(card=>{
   const name=txt(card,'b'),team=teamStored(),cat=catStored();
   if(name)setAvatar(card.querySelector(':scope > span'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v371-scorer-row').forEach(row=>{
   const name=txt(row,'span:nth-child(2) b'),team=txt(row,'span:nth-child(2) small')||teamStored(),cat=catStored();
   if(name)setAvatar(row.querySelector('.v371-scorer-avatar'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v562-player').forEach(card=>{
   const team=card.closest('.v562-team')?.querySelector('.v562-team-head b')?.textContent?.trim()||'';
   setAvatar(card.querySelector('.v562-avatar'),resolve(txt(card,'.v562-player-copy b'),team,''),team);
 });
 document.querySelectorAll('.v123-player-option').forEach(row=>{
   const name=attr(row,'data-v123-pick'),team=attr(row,'data-v123-pick-team'),cat=attr(row,'data-v123-pick-cat');
   setAvatar(row.querySelector('.v123-option-avatar'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v123-player-card').forEach(card=>{
   const name=attr(card,'data-v123-name')||txt(card,'.v123-player-copy strong');
   const team=attr(card,'data-v123-team-name')||txt(card,'.v123-team-chip b');
   const cat=attr(card,'data-v123-cat')||'';
   if(name&&name!=='Elige jugador')setAvatar(card.querySelector('.v123-avatar'),resolve(name,team,cat),team);
 });
 document.querySelectorAll('.v444-stat-row:not(.is-team)').forEach(row=>{
   setAvatar(row.querySelector('.v444-player-avatar'),resolve(txt(row,'.v444-stat-person b'),txt(row,'.v444-stat-person small'),catStored()));
 });
 document.querySelectorAll('.v446-stat-ref-row[data-v33-player]').forEach(row=>{
   setAvatar(row.querySelector('.v446-stat-ref-avatar'),resolve(attr(row,'data-v33-player'),txt(row,'.v446-stat-ref-copy small'),catStored()));
 });
 document.querySelectorAll('.v419-player-card').forEach(card=>{
   setAvatar(card.querySelector('.v419-player-avatar'),resolve(txt(card,'div b'),txt(card,'div em'),catStored()));
 });
 document.querySelectorAll('.v124-player-card').forEach(card=>{
   const name=txt(card,'b,strong,.v124-player-name')||attr(card,'data-v124-name');
   const team=attr(card,'data-v124-team')||teamStored();
   if(name)addInline(card.querySelector('.v124-avatar')||card,resolve(name,team,catStored()),'credential');
 });
 document.querySelectorAll('.v390-scorer-hero').forEach(hero=>{
   const person=hero.querySelector('.v390-scorer-person');if(!person)return;
   addHero(hero.querySelector('.v390-scorer-photo'),resolve(txt(person,'strong'),txt(person,'b'),catStored()));
 });
 document.querySelectorAll('.v391-feature').forEach(card=>{
   const person=card.querySelector('.v391-feature-person');if(!person)return;
   addHero(card.querySelector('.v391-feature-photo'),resolve(txt(person,'strong'),txt(person,'b'),catStored()));
 });
 document.querySelectorAll('.v391-rank-row[data-v194-player]').forEach(row=>{
   const copy=row.querySelector('.v391-rank-copy');
   const team=txt(row,'.v391-rank-copy small');
   clearInline(copy);
   setAvatar(row.querySelector('.v576-player-avatar'),resolve(attr(row,'data-v194-player'),team,catStored()));
 });
 document.querySelectorAll('.v462-rank-row[data-v194-player]').forEach(row=>{
   const copy=row.querySelector('.v462-rank-copy');
   const team=txt(row,'.v462-rank-copy small').replace(/^Equipo\s*·\s*/i,'');
   clearInline(copy);
   setAvatar(row.querySelector('.v576-player-avatar'),resolve(attr(row,'data-v194-player'),team,catStored()));
 });
 document.querySelectorAll('.v194-player-row').forEach(row=>{
   const copy=row.querySelector('.v194-player-name');
   clearInline(copy);
   setAvatar(row.querySelector('.v576-player-avatar'),resolve(txt(row,'.v194-player-name b'),txt(row,'.v194-team-cell b'),catStored()));
 });
 document.querySelectorAll('.v28-rank-row').forEach(row=>{
   const name=attr(row,'data-v66-scorer')||txt(row,'.v28-rank-copy small');
   const team=txt(row,'.v28-rank-copy b');
   addInline(row.querySelector('.v28-rank-copy'),resolve(name,team,catStored()),'ranking');
 });
}
function schedule(ms=80){clearTimeout(timer);timer=setTimeout(hydrate,ms)}

window.addEventListener('hashchange',()=>schedule(90));
window.addEventListener('load',()=>schedule(120));
window.addEventListener('ljr:official-data',()=>{db=newer(db,window.LJR_OFFICIAL_DATA||null);build();schedule(0)});
document.addEventListener('DOMContentLoaded',()=>schedule(20),{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule(60)).observe(screen,{childList:true,subtree:true});
load().then(()=>schedule(0));
setTimeout(()=>schedule(0),700);setTimeout(()=>schedule(0),2200);
window.LJR_PLAYER_MEDIA={load,resolve,hydrate,photo:(name,team,cat)=>resolve(name,team,cat)?.photo||''};
})();