/* V971 · Información y retratos deportivos oficiales, sin CURP.
   Usa las fichas verificadas de las cinco categorías; no inventa retratos
   ni altera las fotografías históricas, los escudos o la navegación. */
(function(){
'use strict';
if(window.__LJR_V971_PLAYER_INTEGRATION__)return;
window.__LJR_V971_PLAYER_INTEGRATION__=true;
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const teamAliases=[['toros de cuenda','cuenda'],['atletico galeana','atl galeana'],['deportivo maravillas','dep maravillas'],['deportivo la luz','dep la luz'],['deportivo zapata','dep zapata'],['deportivo nopalero','dep nopalero'],['pozos','pozos fc'],['club america veteranos','america']];
function same(a,b){
 const x=norm(a),y=norm(b);if(!x||!y)return false;
 return x===y||teamAliases.some(p=>(x===p[0]&&y===p[1])||(y===p[0]&&x===p[1]));
}
function safePhoto(src){
 const u=String(src||'').trim();
 return /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:[^"'<> ]*\/)?jugadores\/[^"'<> ]+$/i.test(u)?u:'';
}
function data(){return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}
let records=[],source=null,snapshot='',handle=0,observer=null;
function rebuild(){
 const d=data();if(!d?.categories)return records;
 if(d===source&&records.length)return records;
 source=d;records=[];
 for(const [cat,c] of Object.entries(d.categories)){
  for(const [team,players] of Object.entries(c.player_profiles||{})){
   for(const p of Array.isArray(players)?players:[]){
    if(!p?.name)continue;
    records.push({name:String(p.name).trim(),team,cat,category:String(c.name||''),
      position:String(p.position||'').trim(),dorsal:String(p.dorsal||'').trim(),
      photo:safePhoto(p.photo)});
   }
  }
 }
 snapshot=records.map(p=>p.photo?1:0).join('')+String(d.captured_at_utc||'');
 return records;
}
function find(name,team='',cat=''){
 const n=norm(name);if(!n)return null;
 let hits=rebuild().filter(p=>norm(p.name)===n);if(!hits.length)return null;
 if(team){const exact=hits.filter(p=>same(p.team,team));if(!exact.length)return null;hits=exact}
 if(cat){const sameCat=hits.filter(p=>String(p.cat)===String(cat));if(sameCat.length)hits=sameCat}
 if(hits.length===1)return hits[0];
 // El mismo nombre puede existir en distintos equipos: no asignar una cara ajena.
 const photos=[...new Set(hits.map(p=>p.photo).filter(Boolean))];
 return photos.length===1?hits.find(p=>p.photo===photos[0]):null;
}
function catStored(){
 try{return new URLSearchParams((location.hash.split('?')[1]||'')).get('cat')||localStorage.getItem('v62-category')||''}catch(_){return ''}
}
function label(p){return [p.team,p.category,p.position,p.dorsal&&p.dorsal!=='—'?'#'+p.dorsal:''].filter(Boolean).join(' · ')}
function picture(holder,p){
 if(!holder||!p?.photo)return;
 if(holder.closest('.v35-champion-card,.v35-history-moment-photo,.v115-card,.v35-final-row,.v672-modern-card,.v701-team-logo'))return;
 if(holder.dataset.v971Photo===p.photo&&holder.querySelector('img'))return;
 let img=holder.querySelector(':scope > img');
 if(!img){img=document.createElement('img');holder.replaceChildren(img)}
 if(img.getAttribute('src')!==p.photo)img.src=p.photo;
 img.alt='Foto oficial: '+p.name;
 img.loading='lazy';img.decoding='async';img.referrerPolicy='no-referrer';
 img.classList.add('v971-official-image');
 img.onerror=()=>{if(img.isConnected&&img.src===p.photo){holder.textContent=p.name.split(/\s+/).slice(0,2).map(n=>n[0]).join('').toUpperCase();holder.classList.remove('v971-has-photo');holder.removeAttribute('data-v971-photo')}};
 holder.classList.add('v971-has-photo');holder.classList.remove('v576-team-fallback','v576-photo-fallback');
 holder.dataset.v971Photo=p.photo;
}
function meta(row,p,target){
 if(!p||!row)return;
 row.title=label(p);
 if(!target)return;
 const detail=[p.position&&p.position!=='No especificada'?p.position:'',p.dorsal&&p.dorsal!=='—'?'#'+p.dorsal:''].filter(Boolean).join(' · ');
 if(!detail)return;
 // Se incorpora en la linea existente, sin aumentar la altura de los cuadros.
 const line=target.querySelector('small')||target;
 // V33 already renders the official position in its compact, fitted line.
 if(line.hasAttribute('data-v33-player-detail'))return;
 let mini=line.querySelector(':scope > .v971-player-meta');
 if(!mini){mini=document.createElement('span');mini.className='v971-player-meta';line.append(mini)}
 if(mini.textContent!==detail)mini.textContent=detail;
}
function applyRow(row,person,club,cat,selector,copySelector,showMeta){
 if(!row||!person)return;
 const p=find(person,club,cat);
 if(!p)return;
 picture(row.querySelector(selector),p);
 const copy=showMeta?row.querySelector(copySelector):null;
 meta(row,p,copy);
}
function patchRows(root){
 const rules=[
  ['.v123-player-card[data-v123-name]','data-v123-name','data-v123-team-name','data-v123-cat','.v123-avatar','.v123-player-copy',false],
  ['.v123-player-option[data-v123-pick]','data-v123-pick','data-v123-pick-team','data-v123-pick-cat','.v123-option-avatar','.v123-option-copy',false],
  ['.v391-rank-row[data-v194-player]','data-v194-player','data-v194-team','','.v576-player-avatar','.v391-rank-copy',true],
  ['.v462-rank-row[data-v194-player]','data-v194-player','data-v194-team','','.v576-player-avatar','.v462-rank-copy',true],
  ['.v194-player-row','data-v194-player','data-v194-team','','.v576-player-avatar','.v194-player-name',false],
  ['.v33-stat-row.player[data-v33-player]','data-v33-player','data-v33-player-team','','.v33-player-team-logo','.v33-row-copy',true],
  ['.v446-stat-ref-row[data-v33-player]:not(.is-team)','data-v33-player','','','.v446-stat-ref-avatar','.v446-stat-ref-copy',false],
  ['.v66-player-row[data-v66-player]','data-v66-player','data-v66-player-team','data-v66-cat-id','.v66-player-avatar','.v66-player-copy',false],
  ['.v371-player[data-v42-player]','data-v42-player','data-v66-player-team','data-v66-cat-id','.v371-player-avatar','span:nth-child(2)',false],
  ['.v42-player-row[data-v42-player]','data-v42-player','data-v66-player-team','data-v66-cat-id','.v42-avatar','.v42-player-copy',false],
  ['.v413-player-result[data-v413-player]','data-v413-player','data-v413-player-team','data-v413-player-cat','.v413-player-avatar','span',false],
  ['.v414-player-row[data-v414-player-name]','data-v414-player-name','data-v414-player-team','data-v414-player-cat','.v414-player-photo','span',false],
  ['.v379-related-card[data-v379-related]','data-v379-related','data-v379-related-team','data-v379-related-cat','.v379-related-avatar','',false],
  ['.v419-player-card','data-v419-player','data-v419-team','','.v419-player-avatar','',false]
 ];
 for(const [selector,nameAttr,teamAttr,catAttr,avatar,copy,showMeta] of rules){
  root.querySelectorAll(selector).forEach(row=>{
   const person=row.getAttribute(nameAttr)||row.querySelector('b,strong')?.textContent?.trim()||'';
   const club=row.getAttribute(teamAttr)||row.querySelector('.v446-stat-ref-copy small')?.textContent?.trim()||'';
   const cat=row.getAttribute(catAttr)||catStored();
   applyRow(row,person,club,cat,avatar,copy,showMeta);
  });
 }
 root.querySelectorAll('.v446-stat-ref-row[data-v33-player]').forEach(row=>{
  if(row.classList.contains('is-team'))return;
  const name=row.dataset.v33Player,club=row.querySelector('.v446-stat-ref-copy small')?.textContent?.trim()||'';
  applyRow(row,name,club,catStored(),'.v446-stat-ref-avatar','',false);
 });
 root.querySelectorAll('.v28-rank-row[data-v28-player]').forEach(row=>{
  const name=row.dataset.v28Player,team=row.querySelector('.v28-rank-copy b')?.textContent?.trim()||'';
  const p=find(name,team,catStored());if(!p)return;
  row.title=label(p);
  const area=row.querySelector('.v28-rank-copy');
  if(area&&p.photo){
   let image=area.querySelector(':scope > .v971-inline-official-photo');
   if(!image){image=document.createElement('img');image.className='v971-inline-official-photo';area.prepend(image)}
   if(image.getAttribute('src')!==p.photo)image.src=p.photo;
   image.alt=p.name;image.loading='lazy';image.decoding='async';image.referrerPolicy='no-referrer';
  }
 });
}
function patchStore(root){
 if(route()!=='club-store')return;
 const store=root.querySelector('[data-v431-store]');if(!store)return;
 let club='',cat='';
 try{club=sessionStorage.getItem('v431-store-team')||'';cat=sessionStorage.getItem('v431-store-cat')||''}catch(_){}
 if(!club)club=store.querySelector('.v431-head-copy>b')?.firstChild?.textContent?.trim()||'';
 for(const row of store.querySelectorAll('[data-v431-player]')){
  const p=find(row.dataset.v431Player,club,cat);if(!p)continue;
  picture(row.querySelector('.v915-store-player-avatar'),p);
  const small=row.querySelector('small');
  const detail=[p.dorsal&&p.dorsal!=='—'?'#'+p.dorsal:'',p.position&&p.position!=='No especificada'?p.position:''].filter(Boolean).join(' · ');
  if(small&&detail&&small.textContent!==detail)small.textContent=detail;
  row.title=label(p);
 }
 for(const btn of store.querySelectorAll('[data-v439-player]')){
  const p=find(btn.dataset.v439Player,club,cat);if(!p?.photo)continue;
  let img=btn.querySelector(':scope > img.v971-menu-photo');
  if(!img){img=document.createElement('img');img.className='v971-menu-photo';btn.prepend(img)}
  if(img.getAttribute('src')!==p.photo)img.src=p.photo;
  img.alt='';img.loading='lazy';img.referrerPolicy='no-referrer';
  btn.title=label(p);
 }
 const heading=store.querySelector('#jugadores .v431-section-title');
 const total=store.querySelectorAll('[data-v431-player]').length;
 if(heading&&total){heading.title=total+' jugadores de la plantilla oficial disponibles en la tienda'}
}
function patchHeroes(root){
 const scorer=root.querySelector('.v390-scorer-hero:not(.is-empty)');
 if(scorer){
  const name=scorer.querySelector('.v390-scorer-person strong')?.textContent?.trim();
  const team=scorer.querySelector('.v390-scorer-person b')?.textContent?.trim();
  const p=find(name,team,catStored());
  if(p?.photo){
   const holder=scorer.querySelector('.v390-scorer-photo');
   if(holder){
    let img=holder.querySelector(':scope > img.v576-scorer-hero-photo, :scope > img.v971-hero-image');
    if(!img){img=document.createElement('img');img.className='v971-hero-image';holder.prepend(img)}
    if(img.getAttribute('src')!==p.photo)img.src=p.photo;
    img.alt=p.name;img.loading='eager';img.decoding='async';img.referrerPolicy='no-referrer';
    holder.classList.add('v971-has-hero');
   }
  }
 }
}
function patchHistory(root){
 if(route()!=='history')return;
 const host=root.querySelector('.v35-history-page');
 if(!host)return;
 const d=data(),items=[];
 for(const [cat,c] of Object.entries(d?.categories||{})){
  for(const row of c?.scorers?.[0]?.rows||[]){
   if(!Array.isArray(row)||!row[1]||!row[2]||!/^\d+$/.test(String(row[3]||'')))continue;
   const p=find(row[1],row[2],cat);if(!p?.photo)continue;
   items.push({p,goals:Number(row[3])||0});
  }
 }
 items.sort((a,b)=>b.goals-a.goals||a.p.name.localeCompare(b.p.name,'es'));
 const unique=[],seen=new Set();
 for(const x of items){const k=norm(x.p.name)+'|'+norm(x.p.team)+'|'+x.p.cat;if(seen.has(k))continue;seen.add(k);unique.push(x);if(unique.length===4)break}
 if(!unique.length)return;
 const signature=unique.map(x=>x.p.name+x.goals+x.p.photo).join('|');
 let section=host.querySelector(':scope > .v971-history-current');
 if(section?.dataset.v971Signature===signature)return;
 if(!section){section=document.createElement('section');section.className='v971-history-current';host.append(section)}
 section.dataset.v971Signature=signature;
 section.innerHTML='<header><small>REGISTRO DE JUGADORES ACTUALES</small><h3>Goleadores oficiales · 2026</h3><p>Datos del torneo vigente; no sustituyen el historial de campeones.</p></header>'+
 '<div class="v971-history-rail">'+unique.map(({p,goals})=>'<article class="v971-history-person"><img src="'+esc(p.photo)+'" alt="'+esc(p.name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"><span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category)+'</small></span><strong>'+goals+' goles</strong></article>').join('')+'</div>';
}
function patch(){
 const root=document.getElementById('screen');if(!root||!data()?.categories)return;
 patchRows(root);patchHeroes(root);patchStore(root);patchHistory(root);
}
function schedule(){
 if(handle)return;
 handle=requestAnimationFrame(()=>{handle=0;patch()});
}
function start(){
 const root=document.getElementById('screen');if(!root)return;
 if(observer)observer.disconnect();
 observer=new MutationObserver(()=>schedule());
 observer.observe(root,{childList:true,subtree:true});
 for(const event of ['hashchange','ljr:official-data','ljr:player-updated','popstate'])window.addEventListener(event,()=>{source=null;schedule()});
 schedule();setTimeout(schedule,600);setTimeout(schedule,1600);
}
window.LJR_V971_PLAYER_INTEGRATION={find,refresh:schedule,all:()=>[...rebuild()]};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();