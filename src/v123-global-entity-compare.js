/* V123 — interacción global de equipos y jugadores.
   - Equipo: tocar escudo/nombre abre Team Detail directamente en Comparar equipos.
   - Jugador: tocar nombre/fila abre Comparar jugadores con ese jugador preseleccionado.
   Usa únicamente jugadores/equipos oficiales del directorio sincronizado. */
(function(){
'use strict';
if(window.__LJR_V123_GLOBAL_ENTITY_COMPARE__)return;
window.__LJR_V123_GLOBAL_ENTITY_COMPARE__=true;

const PRIMARY_KEY='v123-compare-player';
const SECONDARY_KEY='v123-compare-player-2';
let api=null,loading=null,query='';

function route(){return String(location.hash||'').replace(/^#\/?/,'')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function norm(v){try{return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}catch{return String(v??'').toLowerCase().trim()}}
function initials(v){return String(v||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,2).toUpperCase()||'JG'}

async function getApi(){
 if(api?.playerList)return api;
 if(loading)return loading;
 loading=(async()=>{
  for(let i=0;i<50;i++){
   const a=window.V66_OFFICIAL_DIRECTORY;
   if(a?.load&&a?.playerList&&a?.teamList){
    try{await a.load()}catch{}
    api=a;return api;
   }
   await new Promise(r=>setTimeout(r,80));
  }
  return null;
 })();
 return loading;
}
function read(key){
 try{const v=JSON.parse(localStorage.getItem(key)||'null');return v&&typeof v==='object'?v:null}catch{return null}
}
function write(key,p){try{localStorage.setItem(key,JSON.stringify(p))}catch{}}
function playerKey(p){return norm(p?.name)+'|'+norm(p?.team)+'|'+String(p?.cat||'')}
function resolvePlayer(raw,list){
 if(!raw||!Array.isArray(list)||!list.length)return null;
 const name=norm(raw.name||raw.player||''),team=norm(raw.team||''),cat=String(raw.cat||raw.categoryId||'');
 if(name&&team){
  const exact=list.find(p=>norm(p.name)===name&&norm(p.team)===team&&(cat?String(p.cat)===cat:true));
  if(exact)return exact;
  const noCat=list.find(p=>norm(p.name)===name&&norm(p.team)===team);
  if(noCat)return noCat;
 }
 if(name){
  const hits=list.filter(p=>norm(p.name)===name);
  if(hits.length===1)return hits[0];
  if(cat){const h=hits.find(p=>String(p.cat)===cat);if(h)return h}
  return hits[0]||null;
 }
 return null;
}
function officialGoal(p){
 if(!api?.officialScorers||!p)return null;
 const row=api.officialScorers().find(s=>norm(s.player)===norm(p.name)&&norm(s.team)===norm(p.team)&&(p.cat?String(s.cat)===String(p.cat):true));
 return row?Number(row.goals):null;
}
function logo(team){
 const src=api?.logoFor?.(team)||'';
 return src?'<img src="'+esc(src)+'" alt="'+esc(team)+'" loading="eager" decoding="async">':'<span>'+esc(String(team||'').slice(0,3).toUpperCase())+'</span>';
}
function playerCard(p,side){
 if(!p){
  return '<button type="button" class="v123-player-card empty" data-v123-focus-search><span class="v123-avatar ghost">+</span><strong>Elige jugador</strong><small>Toca para buscar otro jugador</small></button>';
 }
 return '<article class="v123-player-card '+esc(side||'')+'">'+
   '<div class="v123-avatar">'+esc(initials(p.name))+'</div>'+
   '<div class="v123-player-copy"><strong>'+esc(p.name)+'</strong><small>'+esc(p.category||'Jugador registrado')+'</small></div>'+
   '<button type="button" class="v123-team-chip" data-v123-team="'+esc(p.team)+'" aria-label="Comparar equipo '+esc(p.team)+'">'+
     '<span class="v123-team-logo">'+logo(p.team)+'</span><b>'+esc(p.team)+'</b>'+
   '</button>'+
 '</article>';
}
function comparison(primary,secondary){
 if(!secondary)return '<div class="v123-empty-note">Selecciona otro jugador para compararlo con <b>'+esc(primary.name)+'</b>.</div>';
 const a=officialGoal(primary),b=officialGoal(secondary);
 const val=v=>v==null?'—':String(v);
 return '<section class="v123-results">'+
  '<div class="v123-results-head"><span></span><b>'+esc(primary.name)+'</b><b>'+esc(secondary.name)+'</b></div>'+
  '<div class="v123-result-row"><span>Equipo</span><b>'+esc(primary.team)+'</b><b>'+esc(secondary.team)+'</b></div>'+
  '<div class="v123-result-row"><span>Categoría</span><b>'+esc(primary.category||'—')+'</b><b>'+esc(secondary.category||'—')+'</b></div>'+
  '<div class="v123-result-row"><span>Goles oficiales</span><b>'+val(a)+'</b><b>'+val(b)+'</b></div>'+
  '<p>Solo se comparan datos publicados oficialmente. Si un dato no está disponible aparece “—”.</p>'+
 '</section>';
}
function listMarkup(primary,secondary,list){
 const q=norm(query);
 let candidates=list.filter(p=>playerKey(p)!==playerKey(primary));
 candidates.sort((a,b)=>{
  const sameA=String(a.cat)===String(primary.cat)?0:1,sameB=String(b.cat)===String(primary.cat)?0:1;
  return sameA-sameB||a.name.localeCompare(b.name,'es');
 });
 if(q)candidates=candidates.filter(p=>norm(p.name).includes(q)||norm(p.team).includes(q)||norm(p.category).includes(q));
 return '<section class="v123-picker">'+
   '<div class="v123-picker-head"><h2>'+(secondary?'Cambiar jugador':'Elige otro jugador')+'</h2><span>'+candidates.length+' disponibles</span></div>'+
   '<label class="v123-search"><span>⌕</span><input data-v123-search type="search" autocomplete="off" placeholder="Buscar jugador o equipo" value="'+esc(query)+'"></label>'+
   '<div class="v123-player-list">'+candidates.slice(0,60).map(p=>
    '<button type="button" class="v123-player-option '+(secondary&&playerKey(p)===playerKey(secondary)?'active':'')+'" data-v123-pick="'+esc(p.name)+'" data-v123-pick-team="'+esc(p.team)+'" data-v123-pick-cat="'+esc(p.cat)+'">'+
      '<span class="v123-option-avatar">'+esc(initials(p.name))+'</span>'+
      '<span><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · '+esc(p.category||'')+'</small></span><i>›</i>'+
    '</button>'
   ).join('')+'</div>'+
 '</section>';
}
async function renderCompare(){
 if(route()!=='playerCompare')return;
 const a=await getApi();if(!a)return;
 const list=a.playerList();
 let primary=resolvePlayer(read(PRIMARY_KEY),list);
 if(!primary)primary=list[0]||null;
 if(!primary)return;
 write(PRIMARY_KEY,primary);
 let secondary=resolvePlayer(read(SECONDARY_KEY),list);
 if(secondary&&playerKey(secondary)===playerKey(primary))secondary=null;

 const screen=document.querySelector('#screen');if(!screen)return;
 document.body.classList.add('v123-player-compare-active');
 screen.innerHTML='<section class="v123-player-compare" data-v123-player-compare>'+
  '<header class="v123-head"><button type="button" class="v123-back" aria-label="Volver"><svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg></button><div><small>HERRAMIENTA DE JUGADOR</small><h1>Comparar jugadores</h1></div></header>'+
  '<div class="v123-duel">'+playerCard(primary,'primary')+'<span class="v123-vs">VS</span>'+playerCard(secondary,'secondary')+'</div>'+
  comparison(primary,secondary)+
  listMarkup(primary,secondary,list)+
 '</section>';

 bindCompare();
}
function bindCompare(){
 const input=document.querySelector('[data-v123-search]');
 if(input)input.addEventListener('input',e=>{query=e.target.value;renderCompare()});
 document.querySelector('[data-v123-focus-search]')?.addEventListener('click',()=>document.querySelector('[data-v123-search]')?.focus(),{once:true});
 document.querySelectorAll('[data-v123-pick]').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();
  write(SECONDARY_KEY,{name:b.dataset.v123Pick||'',team:b.dataset.v123PickTeam||'',cat:b.dataset.v123PickCat||''});
  query='';renderCompare();
 },{once:true}));
 document.querySelectorAll('[data-v123-team]').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();
  const name=b.dataset.v123Team||'';
  if(window.LJR_TEAM_DETAIL_API?.openCompare){window.LJR_TEAM_DETAIL_API.openCompare(name);return}
  localStorage.setItem('v62-team-name',name);localStorage.setItem('v42-open-compare','1');location.hash='#/teamDetail';
 },{once:true}));
}

const PLAYER_SELECTOR=[
 '[data-v66-player]','[data-v33-player]','[data-v42-player]','[data-v28-player]','[data-v66-scorer]','[data-player]',
 '.v66-player-row','.v42-player-row','.player-row','.v33-stat-row.player','.v28-rank-row','.v92-player-card'
].join(',');

function playerFromElement(el,list){
 if(!(el instanceof Element))return null;
 const d=el.dataset||{};
 const rawName=d.v66Player||d.v33Player||d.v42Player||d.v28Player||d.v66Scorer||'';
 const rawTeam=d.v66PlayerTeam||'';
 const rawCat=d.v66CatId||'';
 let p=resolvePlayer({name:rawName,team:rawTeam,cat:rawCat},list);
 if(p)return p;

 const text=norm(el.textContent||'');
 if(!text)return null;
 const matches=list.filter(x=>text.includes(norm(x.name)));
 if(matches.length===1)return matches[0];
 if(matches.length>1){
  const withTeam=matches.find(x=>text.includes(norm(x.team)));
  if(withTeam)return withTeam;
 }
 return null;
}
function exactPlayerFromTarget(target,list){
 if(!(target instanceof Element))return null;
 if(!/^(B|STRONG|SPAN|SMALL|P|H1|H2|H3|H4)$/i.test(target.tagName))return null;
 const t=norm(target.textContent||'');if(!t)return null;
 const hits=list.filter(p=>norm(p.name)===t);
 if(hits.length===1)return hits[0];
 if(hits.length>1){
  const parent=norm(target.closest('button,article,li,tr,.card,.row')?.textContent||'');
  return hits.find(p=>parent.includes(norm(p.team)))||hits[0];
 }
 return null;
}

document.addEventListener('click',e=>{
 if(route()==='playerCompare')return;
 if(e.defaultPrevented)return;
 if(!(e.target instanceof Element))return;
 const target=e.target;
 if(target.closest('.bottom-nav,input,select,textarea,.modal,.v105-modal,[data-v42-reference="teamDetail"] .v42-overlay'))return;

 const row=target.closest(PLAYER_SELECTOR);
 let immediatePlayer=null;

 // Si el directorio ya está listo, también reconoce un toque directo al nombre
 // aunque el diseño concreto de esa página no tenga data-* especial.
 if(api?.playerList){
  const teams=api.teamList();
  const exactTeamText=norm(target.textContent||'');
  const teamHit=(target.matches('img')&&target.alt?teams.find(t=>norm(t.name)===norm(target.alt)):null)||
                (exactTeamText?teams.find(t=>norm(t.name)===exactTeamText):null);
  if(teamHit)return;
  immediatePlayer=exactPlayerFromTarget(target,api.playerList());
 }

 // Las filas de jugador conocidas se detienen ANTES de que sus handlers antiguos
 // puedan mandar a Credencial/Detalle. Así el toque siempre termina en comparar.
 if(!row&&!immediatePlayer)return;

 // Dentro de una fila de jugador, tocar explícitamente el escudo del equipo sigue
 // perteneciendo al comparador de equipos.
 if(target.matches('img')&&target.alt)return;
 if(row?.dataset?.v66PlayerTeam&&norm(target.textContent||'')===norm(row.dataset.v66PlayerTeam))return;

 e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();

 (async()=>{
  const a=await getApi();if(!a)return;
  const players=a.playerList(),teams=a.teamList();
  const exactTeamText=norm(target.textContent||'');
  const teamHit=(target.matches('img')&&target.alt?teams.find(t=>norm(t.name)===norm(target.alt)):null)||
                (exactTeamText?teams.find(t=>norm(t.name)===exactTeamText):null);
  if(teamHit){
   if(window.LJR_TEAM_DETAIL_API?.openCompare)window.LJR_TEAM_DETAIL_API.openCompare(teamHit.name);
   return;
  }

  let p=immediatePlayer||exactPlayerFromTarget(target,players);
  if(!p&&row)p=playerFromElement(row,players);
  if(!p)return;
  write(PRIMARY_KEY,p);
  localStorage.removeItem(SECONDARY_KEY);
  query='';
  location.hash='#/playerCompare';
 })();
},true);

window.LJR_PLAYER_COMPARE_API={
 open(player){
  getApi().then(a=>{
   if(!a)return;
   const p=resolvePlayer(player,a.playerList());if(!p)return;
   write(PRIMARY_KEY,p);localStorage.removeItem(SECONDARY_KEY);query='';location.hash='#/playerCompare';
  });
 },
 render:renderCompare
};

function schedule(){
 if(route()==='playerCompare')requestAnimationFrame(()=>requestAnimationFrame(renderCompare));
 else document.body.classList.remove('v123-player-compare-active');
}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('DOMContentLoaded',()=>{getApi();schedule()},{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='playerCompare'&&!screen.querySelector('[data-v123-player-compare]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState!=='loading'){getApi();schedule()}
})();