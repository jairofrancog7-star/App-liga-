/* V944 — Comparator for legacy Datos > Comparador routes.
   Official league players only. Full names, accessible searchable selectors,
   real goals and unpublished stats marked with an em dash. */
(function(){
'use strict';
if(window.__LJR_COMPARE_V944__)return;
window.__LJR_COMPARE_V944__=true;
const routes=new Set(['compare','comparar','v4-compare']);
const keyA='ljr-v944-compare-left',keyB='ljr-v944-compare-right';
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const identity=p=>norm(p.name)+'|'+norm(p.team)+'|'+String(p.cat||'');
const read=k=>{try{return localStorage.getItem(k)||''}catch(_){return ''}};
const store=(k,v)=>{try{localStorage.setItem(k,v)}catch(_){}};
let players=[],scorers=new Map(),selected=['',''],activeSide=0,loading=false,loaded=false,overlay=null;
let bootVersion=0;
function officialLogo(team,api){
 try{return api?.logoFor?.(team)||window.LJR_TEAM_LOGOS?.get?.(team)||window.LJR_SEASON_LOGOS?.get?.(team)||''}catch(_){return ''}
}
function logo(p){
 const src=p?.logo;
 return '<span class="v944-crest">'+(src?'<img src="'+esc(src)+'" alt="" loading="lazy" decoding="async">':'<span aria-hidden="true">⚽</span>')+'</span>';
}
function icon(name){
 const shape={
  chevron:'<path d="m6 9 6 6 6-6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  swap:'<path d="M4 7h16l-4-4m4 4-4 4M20 17H4l4 4m-4-4 4-4"/>',
  person:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  close:'<path d="M5 5l14 14M19 5 5 19"/>'
 }[name]||'';
 return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+shape+'</svg>';
}
function record(p){return players.find(x=>x.key===p)||null}
function value(p,field){
 if(!p)return '—';
 if(field!=='Goles')return '—';
 const n=scorers.get(p.key);
 return n===undefined?'—':String(n);
}
function pickerButton(side){
 const p=record(selected[side]),n=side?'Jugador B':'Jugador A';
 return '<button type="button" class="v944-select" data-v944-open="'+side+'" aria-haspopup="dialog" aria-label="Seleccionar '+n+'">'+
   '<span class="v944-select-icon">'+icon('person')+'</span>'+
   '<span class="v944-select-copy"><small>'+n+'</small><strong>'+esc(p?.name||'Elegir jugador')+'</strong>'+
   '<em>'+esc(p?(p.team+' · '+(p.category||'Liga')):'Toca para buscar por nombre')+'</em></span>'+
   '<span class="v944-chevron">'+icon('chevron')+'</span>'+
 '</button>';
}
function playerCard(side){
 const p=record(selected[side]);
 return '<button type="button" class="v944-player" data-v944-open="'+side+'" aria-label="Cambiar '+(side?'jugador B':'jugador A')+'">'+
  '<span class="v944-player-top">'+logo(p)+'<span class="v944-player-tag">'+(side?'B':'A')+'</span></span>'+
  '<span class="v944-player-name">'+esc(p?.name||'Elige jugador')+'</span>'+
  '<span class="v944-player-team">'+esc(p?.team||'Sin seleccionar')+'</span>'+
  '<span class="v944-player-change">Cambiar '+icon('chevron')+'</span>'+
 '</button>';
}
function statistics(){
 return '<section class="v944-stats" aria-label="Comparación de estadísticas">'+
  '<header><span>Jugador A</span><b>Estadística</b><span>Jugador B</span></header>'+
  ['Goles','Asistencias','Minutos','Tarjetas','Fantasy pts'].map((field,i)=>{
   const a=record(selected[0]),b=record(selected[1]);const x=value(a,field),y=value(b,field);
   return '<div class="v944-stat-row"><strong class="'+(x!=='—'&&Number(x)>Number(y)?'leader':'')+'">'+x+'</strong>'+
    '<span>'+esc(field)+'</span><strong class="'+(y!=='—'&&Number(y)>Number(x)?'leader':'')+'">'+y+'</strong></div>';
  }).join('')+
 '</section><p class="v944-note">— significa que la Liga aún no ha publicado ese dato. No se muestran estadísticas inventadas.</p>';
}
function render(){
 if(!routes.has(route()))return;
 const screen=document.getElementById('screen');if(!screen)return;
 const y=screen.scrollTop;
 screen.innerHTML='<section class="v944-compare" data-v944-compare>'+
  '<header class="v944-heading"><small>DATOS OFICIALES · JUGADORES</small><h1>Comparador</h1><p>Selecciona dos jugadores y compara sus estadísticas.</p></header>'+
  '<div class="v944-selector-row">'+pickerButton(0)+'<div class="v944-vs" aria-hidden="true">VS</div>'+pickerButton(1)+'</div>'+
  '<div class="v944-cards">'+playerCard(0)+playerCard(1)+'</div>'+
  statistics()+'</section>';
 screen.scrollTop=y;
}
function menuRows(q){
 const other=selected[1-activeSide];
 const n=norm(q).replace(/\s+/g,' ');
 const matches=players.filter(p=>!n||norm(p.name+' '+p.team+' '+p.category).includes(n));
 return matches.slice(0,160).map(p=>{
  const active=selected[activeSide]===p.key,same=other===p.key;
  return '<button type="button" data-v944-pick="'+esc(p.key)+'" '+(same?'disabled aria-disabled="true"':'')+' class="v944-option'+(active?' selected':'')+'">'+
   logo(p)+'<span><strong>'+esc(p.name)+'</strong><small>'+esc(p.team)+(p.category?' · '+esc(p.category):'')+'</small></span>'+
   '<span class="v944-mark">'+(same?'En uso':active?'✓':'›')+'</span></button>';
 }).join('')+(matches.length>160?'<p class="v944-results-hint">Escribe un nombre para filtrar más resultados.</p>':'')||
 '<p class="v944-results-hint">No se encontraron jugadores con ese nombre.</p>';
}
function closeMenu(){
 if(!overlay)return;overlay.remove();overlay=null;
}
function openMenu(side){
 if(!routes.has(route()))return;
 activeSide=Number(side)===1?1:0;
 closeMenu();
 overlay=document.createElement('div');
 overlay.className='v944-overlay';
 overlay.setAttribute('data-v944-overlay','');
 overlay.innerHTML='<button type="button" data-v944-close class="v944-backdrop" aria-label="Cerrar selector"></button>'+
 '<section class="v944-sheet" role="dialog" aria-modal="true" aria-label="Seleccionar jugador '+(activeSide?'B':'A')+'">'+
  '<header><div><small>COMPARADOR · '+(activeSide?'JUGADOR B':'JUGADOR A')+'</small><h2>Seleccionar jugador</h2></div><button type="button" class="v944-close" data-v944-close aria-label="Cerrar">'+icon('close')+'</button></header>'+
  '<label class="v944-search">'+icon('search')+'<input type="search" data-v944-search placeholder="Buscar nombre o equipo" autocomplete="off" aria-label="Buscar jugador"></label>'+
  '<div class="v944-options" data-v944-options>'+menuRows('')+'</div>'+
 '</section>';
 document.body.appendChild(overlay);
 overlay.querySelector('[data-v944-search]')?.focus({preventScroll:true});
}
function choose(key){
 const p=record(key);if(!p||selected[1-activeSide]===key)return;
 selected[activeSide]=key;
 store(activeSide?keyB:keyA,key);
 closeMenu();render();
 document.querySelector('[data-v944-open="'+activeSide+'"]')?.focus({preventScroll:true});
}
function initializePlayers(api){
 const map=new Map(),goals=new Map();
 for(const p of api.playerList?.()||[]){
  const rec={name:String(p.name||'').trim(),team:String(p.team||'').trim(),
   cat:String(p.cat||''),category:String(p.category||''),logo:''};
  if(!rec.name||!rec.team)continue;
  rec.key=identity(rec);if(!map.has(rec.key))map.set(rec.key,rec);
 }
 for(const s of api.officialScorers?.()||[]){
  const rec={name:String(s.player||s.name||'').trim(),team:String(s.team||'').trim(),
   cat:String(s.cat||''),category:String(s.category||''),logo:''};
  if(!rec.name||!rec.team)continue;
  rec.key=identity(rec);
  if(!map.has(rec.key))map.set(rec.key,rec);
  const n=Number(s.goals);
  if(s.goals!==null&&s.goals!==''&&Number.isFinite(n))goals.set(rec.key,n);
 }
 players=[...map.values()].map(p=>({...p,logo:officialLogo(p.team,api)}));
 players.sort((a,b)=>(goals.get(b.key)??-1)-(goals.get(a.key)??-1)||a.name.localeCompare(b.name,'es'));
 scorers=goals;
 selected=[read(keyA),read(keyB)];
 if(!record(selected[0]))selected[0]=players[0]?.key||'';
 if(!record(selected[1])||selected[1]===selected[0])selected[1]=players.find(x=>x.key!==selected[0])?.key||'';
}
async function boot(){
 if(!routes.has(route())||loading)return;
 const screen=document.getElementById('screen');if(!screen)return;
 if(loaded&&players.length){if(!screen.querySelector('[data-v944-compare]'))render();return}
 loading=true;
 const id=++bootVersion;
 if(!screen.querySelector('[data-v944-compare]')){
  screen.innerHTML='<section class="v944-compare v944-loading"><h1>Comparador</h1><p>Cargando jugadores oficiales…</p></section>';
 }
 try{
  let api=null;
  for(let i=0;i<35;i++){
   api=window.V66_OFFICIAL_DIRECTORY;
   if(api?.playerList&&api?.load)break;
   await new Promise(resolve=>setTimeout(resolve,120));
  }
  if(!api?.playerList||!api?.load)throw new Error('No está disponible el directorio de jugadores.');
  await api.load();
  if(id!==bootVersion||!routes.has(route()))return;
  initializePlayers(api);loaded=true;
  if(players.length)render();
  else screen.innerHTML='<section class="v944-compare v944-loading"><h1>Comparador</h1><p>Todavía no hay jugadores oficiales disponibles para comparar.</p><button type="button" data-v944-retry>Actualizar jugadores</button></section>';
 }catch(e){
  if(routes.has(route()))screen.innerHTML='<section class="v944-compare v944-loading"><h1>Comparador</h1><p>No se pudo cargar el directorio oficial. Intenta nuevamente.</p><button type="button" data-v944-retry>Reintentar</button></section>';
 }finally{loading=false}
}
document.addEventListener('click',e=>{
 const target=e.target instanceof Element?e.target:null;
 if(!target)return;
 const trigger=target.closest('[data-v944-open]');
 if(trigger&&routes.has(route())){e.preventDefault();openMenu(trigger.dataset.v944Open);return}
 if(target.closest('[data-v944-retry]')){loaded=false;players=[];boot();return}
 if(!overlay)return;
 if(target.closest('[data-v944-close]')){e.preventDefault();closeMenu();return}
 const pick=target.closest('[data-v944-pick]');
 if(pick){e.preventDefault();choose(pick.dataset.v944Pick);return}
});
document.addEventListener('input',e=>{
 if(!overlay||!e.target.matches?.('[data-v944-search]'))return;
 const list=overlay.querySelector('[data-v944-options]');
 if(list)list.innerHTML=menuRows(e.target.value);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay){e.preventDefault();closeMenu()}});
function onRoute(){
 if(!routes.has(route())){++bootVersion;closeMenu();return}
 boot();
}
window.addEventListener('hashchange',onRoute);
window.addEventListener('pageshow',onRoute);
const watch=()=>{
 const screen=document.getElementById('screen');
 if(!screen)return;
 new MutationObserver(()=>{
  if(routes.has(route())&&!screen.querySelector('[data-v944-compare]')&&!loading)boot();
 }).observe(screen,{childList:true,subtree:false});
 onRoute();
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch,{once:true});
else watch();
})();