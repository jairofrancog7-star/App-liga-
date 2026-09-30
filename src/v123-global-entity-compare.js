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
const LEAGUE_CREST=new URL('../assets/reference/predictor-v36/liga-crest-white.webp',import.meta.url).href;
let api=null,loading=null,query='',pickerOpen=false,pickerSide='secondary',pickerAutoShown=false,pickerPosition='';

function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function norm(v){try{return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}catch{return String(v??'').toLowerCase().trim()}}
function registrationActive(){
 const r=route();
 return !!window.__LJR_REGISTRATION_TEAM_PICKER__||
   r==='credentialBuilder'||r.startsWith('credentialBuilder')||
   !!document.querySelector('#screen [data-v64-cred-team],#v124-player-registry,[data-v132-layer].open,.v126-team-panel');
}
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
 const sideLabel=side==='primary'?'Jugador A':'Jugador B';
 if(!p){
  return '<article class="v123-player-card empty '+esc(side)+'" data-v123-card-side="'+esc(side)+'" tabindex="0" role="button" aria-label="Elegir '+sideLabel+'">'+
   '<span class="v123-avatar ghost" aria-hidden="true"><svg viewBox="0 0 120 120"><circle cx="60" cy="38" r="24"/><path d="M18 104c4-29 21-43 42-43s38 14 42 43H18Z"/></svg></span><strong>Elige jugador</strong></article>';
 }
 return '<article class="v123-player-card '+esc(side)+'" data-v123-card-side="'+esc(side)+'" tabindex="0" role="button" aria-label="Cambiar '+esc(p.name)+'">'+
   '<span class="v123-player-swap" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M19 7v5h-5M5 17v-5h5M18.2 12a6.5 6.5 0 0 0-11.1-4.6L5 9M5.8 12a6.5 6.5 0 0 0 11.1 4.6L19 15"/></svg></span>'+
   '<div class="v123-avatar">'+esc(initials(p.name))+'</div>'+
   '<div class="v123-player-copy"><strong>'+esc(p.name)+'</strong><small>'+esc(p.category||'Jugador registrado')+'</small></div>'+
   '<button type="button" class="v123-team-chip" data-v123-team="'+esc(p.team)+'" aria-label="Comparar equipo '+esc(p.team)+'">'+
     '<span class="v123-team-logo">'+logo(p.team)+'</span><b>'+esc(p.team)+'</b>'+
   '</button>'+
 '</article>';
}
function comparison(primary,secondary){
 if(!secondary)return '<section class="v123-choose-empty"><div class="v123-pitch-icon" aria-hidden="true"><svg viewBox="0 0 96 72"><path d="M11 25 50 5l35 20-40 23L11 25Z"/><path d="m11 25 1 15 34 21 39-23V25M31 15l38 23M27 44l39-22M48 24c8 0 14 4 14 8s-6 8-14 8-14-4-14-8 6-8 14-8Z"/></svg></div><h2>Elige jugadores para comparar</h2><div class="v123-league-mark"><img src="'+esc(LEAGUE_CREST)+'" alt=""><span>LIGA MUNICIPAL DE FÚTBOL<br><b>JUVENTINO ROSAS</b><br>GUANAJUATO</span></div></section>';
 const a=officialGoal(primary),b=officialGoal(secondary);
 const val=v=>v==null?'—':String(v);
 return '<section class="v123-results">'+
  '<div class="v123-results-title"><small>DATOS PUBLICADOS</small><h2>Comparación</h2></div>'+
  '<div class="v123-results-head"><span></span><b>'+esc(primary.name)+'</b><b>'+esc(secondary.name)+'</b></div>'+
  '<div class="v123-result-row"><span>Equipo</span><b>'+esc(primary.team)+'</b><b>'+esc(secondary.team)+'</b></div>'+
  '<div class="v123-result-row"><span>Categoría</span><b>'+esc(primary.category||'—')+'</b><b>'+esc(secondary.category||'—')+'</b></div>'+
  '<div class="v123-result-row"><span>Goles oficiales</span><b>'+val(a)+'</b><b>'+val(b)+'</b></div>'+
  '<p>Solo se muestran estadísticas publicadas oficialmente. Los datos no disponibles aparecen como “—”.</p>'+
  '<button type="button" class="v123-change-player" data-v123-open-picker="secondary">Cambiar jugador B</button>'+
 '</section>';
}
function playerPositionKey(p){
 const raw=norm(p?.position||p?.pos||p?.role||p?.positionName||'');
 if(!raw)return 'unknown';
 if(raw.includes('portero')||raw.includes('goalkeeper')||raw==='gk')return 'goalkeepers';
 if(raw.includes('defensa')||raw.includes('defender')||raw.includes('central')||raw.includes('lateral')||raw==='df')return 'defenders';
 if(raw.includes('medio')||raw.includes('mediocamp')||raw.includes('centrocamp')||raw.includes('volante')||raw==='mf'||raw==='cm')return 'midfielders';
 if(raw.includes('delanter')||raw.includes('atacante')||raw.includes('forward')||raw.includes('extremo')||raw==='fw'||raw==='st')return 'forwards';
 return 'unknown';
}
const POSITION_GROUPS=[
 ['forwards','Delanteros','FW','todos los delanteros'],
 ['midfielders','Centrocampistas','MF','todos los centrocampistas'],
 ['defenders','Defensas','DF','todos los defensas'],
 ['goalkeepers','Porteros','GK','todos los porteros']
];
function playerOptionMarkup(p,current){
 return '<button type="button" class="v123-player-option v205-player-option v206-player-option '+(current&&playerKey(p)===playerKey(current)?'active':'')+'" data-v123-pick="'+esc(p.name)+'" data-v123-pick-team="'+esc(p.team)+'" data-v123-pick-cat="'+esc(p.cat)+'">'+
   '<span class="v123-option-avatar v205-option-avatar v206-option-avatar">'+esc(initials(p.name))+'</span>'+
   '<span class="v123-option-copy v205-option-copy v206-option-copy"><b>'+esc(p.name)+'</b><small><i class="v123-option-logo v205-option-logo v206-option-logo">'+logo(p.team)+'</i><span>'+esc(p.team)+'</span></small></span>'+
   '<i class="v123-option-radio v205-option-radio v206-option-radio" aria-hidden="true"></i>'+
 '</button>';
}
function positionPickerMarkup(candidates,current){
 const groups=POSITION_GROUPS.map(([key,label,abbr])=>{
  const rows=candidates.filter(p=>playerPositionKey(p)===key);
  const open=pickerPosition===key;
  return '<section class="v208-position-group '+(open?'open':'')+'">'+
   '<button type="button" class="v208-position-head" data-v208-position="'+key+'" aria-expanded="'+(open?'true':'false')+'">'+
    '<span><b>'+esc(label)+'</b>'+(rows.length?'<small>'+rows.length+' jugador'+(rows.length===1?'':'es')+'</small>':'')+'</span>'+
    '<i class="v208-position-chevron" aria-hidden="true"></i>'+
   '</button>'+
   (open?'<div class="v208-position-players">'+
     (rows.length?rows.slice(0,100).map(p=>playerOptionMarkup(p,current)).join(''):'<div class="v208-position-empty">No hay jugadores con posición '+esc(label.toLowerCase())+' publicada todavía.</div>')+
   '</div>':'')+
  '</section>';
 }).join('');
 const unknown=candidates.filter(p=>playerPositionKey(p)==='unknown');
 const unknownOpen=pickerPosition==='unknown';
 const other=unknown.length?'<section class="v208-position-group v208-position-unknown '+(unknownOpen?'open':'')+'">'+
  '<button type="button" class="v208-position-head" data-v208-position="unknown" aria-expanded="'+(unknownOpen?'true':'false')+'">'+
   '<span><b>Sin posición publicada</b><small>'+unknown.length+' jugador'+(unknown.length===1?'':'es')+'</small></span><i class="v208-position-chevron" aria-hidden="true"></i>'+
  '</button>'+
  (unknownOpen?'<div class="v208-position-players">'+unknown.slice(0,100).map(p=>playerOptionMarkup(p,current)).join('')+'</div>':'')+
 '</section>':'';
 return '<div class="v208-position-list" aria-label="Jugadores clasificados por posición">'+groups+other+'</div>';
}
function listMarkup(primary,secondary,list){
 if(!pickerOpen)return '';
 const current=pickerSide==='primary'?primary:secondary;
 const other=pickerSide==='primary'?secondary:primary;
 const q=norm(query);
 let candidates=list.filter(p=>!other||playerKey(p)!==playerKey(other));
 candidates.sort((a,b)=>{
  const ref=other||primary;
  const sameA=ref&&String(a.cat)===String(ref.cat)?0:1,sameB=ref&&String(b.cat)===String(ref.cat)?0:1;
  return sameA-sameB||a.name.localeCompare(b.name,'es');
 });
 if(q)candidates=candidates.filter(p=>norm(p.name).includes(q)||norm(p.team).includes(q)||norm(p.category).includes(q)||norm(p.position||'').includes(q));

 const selectedPosition=POSITION_GROUPS.find(x=>x[0]===pickerPosition);
 const categoryLabel=selectedPosition?selectedPosition[3]:(primary?.category||'categoría actual');
 const body=q
  ?'<div class="v208-search-results"><div class="v208-results-head"><h2>Resultados</h2><span>'+candidates.length+'</span></div>'+
    (candidates.length?candidates.slice(0,100).map(p=>playerOptionMarkup(p,current)).join(''):'<div class="v205-empty-search v206-empty-search">No se encontraron jugadores registrados.</div>')+
   '</div>'
  :positionPickerMarkup(candidates,current);

 return '<section class="v123-picker-overlay v205-picker v206-picker v208-picker" role="dialog" aria-modal="true" aria-label="Elegir jugador para comparar">'+
   '<div class="v123-picker-shell v205-picker-shell v206-picker-shell v208-picker-shell">'+
    '<button type="button" class="v123-picker-close v206-picker-close" data-v123-close-picker aria-label="Cerrar">×</button>'+
    '<label class="v123-search v205-search v206-search"><span class="v206-search-icon" aria-hidden="true"></span><input data-v123-search type="search" autocomplete="off" placeholder="Buscar jugadores" value="'+esc(query)+'"></label>'+
    '<div class="v205-average-list v206-average-list" aria-label="Promedios disponibles">'+
      '<div class="v205-average-row v206-average-row"><span class="v205-average-avatar v206-average-avatar">'+esc(selectedPosition?.[2]||'FW')+'</span><span class="v205-average-copy v206-average-copy"><b>Promedio: '+esc(categoryLabel)+'</b><small>Promedio de estadísticas por partido de '+(selectedPosition?'esta posición':'esta categoría')+'</small></span></div>'+
      '<div class="v205-average-row v206-average-row"><span class="v205-average-avatar v206-average-avatar">AP</span><span class="v205-average-copy v206-average-copy"><b>Promedio: todos los jugadores</b><small>Promedio de estadísticas por partido de todos los jugadores</small></span></div>'+
    '</div>'+
    body+
   '</div>'+
  '</section>';
}

/* V206 — lock de geometría del selector previo a comparar.
   Se inyecta al final de <head> para ganar a los CSS globales cargados después de V123. */
function v206EnsurePickerStyle(){
 let style=document.getElementById('v206-player-picker-exact');
 if(!style){
  style=document.createElement('style');
  style.id='v206-player-picker-exact';
  style.textContent=`
.v206-picker{position:fixed!important;z-index:2147483500!important;inset:0!important;display:flex!important;justify-content:center!important;overflow:hidden!important;background:#05075f!important;font-family:Inter,Roboto,Arial,sans-serif!important}
.v206-picker,.v206-picker *{box-sizing:border-box!important}
.v206-picker-shell{position:relative!important;width:min(100vw,520px)!important;max-width:520px!important;height:100dvh!important;margin:0 auto!important;padding:0!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;background:radial-gradient(105% 88% at 75% 54%,rgba(15,45,209,.27),transparent 62%),linear-gradient(180deg,#060a68 0%,#081080 46%,#060760 100%)!important;color:#fff!important}
.v206-picker-close{all:unset!important;position:absolute!important;top:36px!important;right:16px!important;width:37px!important;height:37px!important;display:grid!important;place-items:center!important;border-radius:50%!important;background:#111a86!important;color:#fff!important;font:300 34px/32px Arial,sans-serif!important;text-align:center!important;cursor:pointer!important;z-index:4!important}
.v206-search{position:absolute!important;top:88px!important;left:18px!important;right:18px!important;width:auto!important;height:43px!important;margin:0!important;padding:0 15px!important;display:grid!important;grid-template-columns:40px minmax(0,1fr)!important;align-items:center!important;gap:4px!important;border:0!important;border-radius:13px!important;background:linear-gradient(180deg,#17269d,#121d88)!important;z-index:3!important}
.v206-search-icon{position:relative!important;width:29px!important;height:29px!important;display:block!important;color:#a8afd8!important;background:transparent!important;border:0!important;border-radius:0!important}
.v206-search-icon:before{content:""!important;position:absolute!important;left:2px!important;top:2px!important;width:17px!important;height:17px!important;border:2px solid currentColor!important;border-radius:50%!important}
.v206-search-icon:after{content:""!important;position:absolute!important;left:20px!important;top:20px!important;width:10px!important;height:2px!important;background:currentColor!important;border-radius:2px!important;transform:rotate(45deg)!important;transform-origin:left center!important}
.v206-search input{all:unset!important;width:100%!important;height:43px!important;color:#fff!important;font:700 17px/43px Inter,Roboto,Arial,sans-serif!important}
.v206-search input::placeholder{color:#aeb4d8!important;opacity:1!important}
.v206-average-list{position:absolute!important;top:148px!important;left:0!important;right:0!important;margin:0!important;padding:0!important;display:block!important;border-top:1px solid rgba(3,6,70,.78)!important;border-bottom:1px solid rgba(3,6,70,.78)!important;background:transparent!important}
.v206-average-row{position:relative!important;width:100%!important;height:82px!important;min-height:82px!important;margin:0!important;padding:0 20px 0 18px!important;display:grid!important;grid-template-columns:50px minmax(0,1fr)!important;gap:13px!important;align-items:center!important;background:linear-gradient(90deg,rgba(10,24,137,.70),rgba(8,20,126,.52))!important;border:0!important;border-bottom:1px solid rgba(3,6,70,.64)!important}
.v206-average-row:last-child{border-bottom:0!important}
.v206-average-avatar{width:49px!important;height:49px!important;display:grid!important;place-items:center!important;border-radius:50%!important;background:linear-gradient(145deg,#858ab7,#5c67aa)!important;color:#fff!important;font:500 18px/1 Inter,Roboto,Arial,sans-serif!important}
.v206-average-copy{min-width:0!important;display:grid!important;gap:3px!important;align-content:center!important}
.v206-average-copy b{display:block!important;margin:0!important;color:#fff!important;font:800 17px/1.08 Inter,Roboto,Arial,sans-serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.v206-average-copy small{display:block!important;margin:0!important;color:#aeb4d7!important;font:450 14px/1.18 Inter,Roboto,Arial,sans-serif!important;white-space:normal!important}
.v206-section-head{position:absolute!important;top:312px!important;left:0!important;right:0!important;height:65px!important;margin:0!important;padding:0 21px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;background:transparent!important}
.v206-section-head h2{all:unset!important;color:#fff!important;font:800 25px/1 Inter,Roboto,Arial,sans-serif!important}
.v206-chevron{position:relative!important;width:25px!important;height:25px!important;display:block!important;background:transparent!important}
.v206-chevron:before{content:""!important;position:absolute!important;width:12px!important;height:12px!important;left:6px!important;top:8px!important;border-left:3px solid #fff!important;border-top:3px solid #fff!important;transform:rotate(45deg)!important;border-radius:1px!important}
.v206-player-list{position:relative!important;margin:377px 0 0!important;padding:0 18px!important;display:block!important;background:transparent!important}
.v206-player-option{all:unset!important;position:relative!important;width:100%!important;height:67px!important;display:grid!important;grid-template-columns:50px minmax(0,1fr) 31px!important;column-gap:13px!important;align-items:center!important;color:#fff!important;cursor:pointer!important;font-family:Inter,Roboto,Arial,sans-serif!important}
.v206-option-avatar{width:49px!important;height:49px!important;display:grid!important;place-items:center!important;border-radius:50%!important;background:linear-gradient(145deg,#f1f4fb,#a4b3dd)!important;color:#08145f!important;font:900 13px/1 Inter,Roboto,Arial,sans-serif!important;box-shadow:none!important}
.v206-option-copy{min-width:0!important;display:grid!important;gap:4px!important;align-content:center!important}
.v206-option-copy>b{display:block!important;margin:0!important;color:#fff!important;font:780 17px/1.04 Inter,Roboto,Arial,sans-serif!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}
.v206-option-copy>small{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important;margin:0!important;color:#aab1d5!important;font:450 13px/1 Inter,Roboto,Arial,sans-serif!important;white-space:nowrap!important;overflow:hidden!important}
.v206-option-copy>small>span{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}
.v206-option-logo{width:17px!important;height:17px!important;flex:0 0 17px!important;display:grid!important;place-items:center!important;overflow:hidden!important;border-radius:50%!important;background:transparent!important;color:#fff!important}
.v206-option-logo img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important}
.v206-option-radio{width:30px!important;height:30px!important;display:block!important;justify-self:end!important;border:2px solid rgba(145,155,207,.58)!important;border-radius:50%!important;background:transparent!important}
.v206-player-option.active .v206-option-radio{border:8px solid #27e2ef!important}
.v206-player-option.active .v206-option-avatar{box-shadow:0 0 0 2px #27e2ef!important}
.v206-empty-search{margin:18px!important;color:#aab1d5!important;font:500 13px/1.3 Inter,Roboto,Arial,sans-serif!important;text-align:center!important}
@media(max-width:360px){
 .v206-picker-close{right:14px!important}
 .v206-search{left:15px!important;right:15px!important}
 .v206-average-row{padding-left:15px!important;padding-right:15px!important;grid-template-columns:47px minmax(0,1fr)!important;gap:11px!important}
 .v206-average-avatar{width:46px!important;height:46px!important;font-size:17px!important}
 .v206-average-copy b{font-size:15.5px!important}
 .v206-average-copy small{font-size:12.5px!important}
 .v206-section-head{padding-left:18px!important;padding-right:18px!important}
 .v206-section-head h2{font-size:23px!important}
 .v206-player-list{padding-left:15px!important;padding-right:15px!important}
 .v206-player-option{grid-template-columns:48px minmax(0,1fr) 29px!important;column-gap:11px!important}
 .v206-option-avatar{width:47px!important;height:47px!important}
 .v206-option-copy>b{font-size:15.5px!important}
 .v206-option-copy>small{font-size:12px!important}
 .v206-option-radio{width:28px!important;height:28px!important}
}
`;
  document.head.appendChild(style);
 }else{
  document.head.appendChild(style);
 }
}

/* V204 — Player Compare: cancha/isotipo de Liga y escudos en la geometría de la referencia. */
function v204PitchSvg(){
 return '<svg class="v204-pitch-svg" viewBox="0 0 120 88" aria-hidden="true">'+
   '<path class="v204-pitch-shadow" d="M18 47 57 70 104 44 65 22Z"/>'+
   '<path class="v204-pitch-left" d="M18 36 57 59 57 70 18 47Z"/>'+
   '<path class="v204-pitch-right" d="M57 59 104 33 104 44 57 70Z"/>'+
   '<path class="v204-pitch-top" d="M18 36 65 11 104 33 57 59Z"/>'+
   '<path class="v204-pitch-boundary" d="M23 36 65 14 99 33 57 55 23 36Z"/>'+
   '<path class="v204-pitch-mark" d="M44 25 79 45"/>'+
   '<ellipse class="v204-pitch-mark" cx="61.5" cy="35" rx="8.5" ry="5.3" transform="rotate(29 61.5 35)"/>'+
   '<path class="v204-pitch-mark" d="M24 35 33 30 43 36 34 41M98 33 89 28 79 34 88 39"/>'+
   '<path class="v204-pitch-mark" d="M18 39 13 42 19 46M104 36 109 39 103 43"/>'+
  '</svg>';
}
function v204ApplyReferenceDecor(){
 document.querySelectorAll('.v123-team-chip').forEach(chip=>{
  const teamName=chip.querySelector('b');
  if(teamName)teamName.classList.add('v204-team-name-sr');
  if(!chip.querySelector('.v204-league-mini')){
   const badge=document.createElement('span');
   badge.className='v204-league-mini';
   badge.setAttribute('aria-hidden','true');
   const img=document.createElement('img');
   img.src=LEAGUE_CREST;
   img.alt='';
   img.loading='eager';
   img.decoding='async';
   badge.appendChild(img);
   chip.appendChild(badge);
  }
 });
 const pitch=document.querySelector('.v123-pitch-icon');
 if(pitch&&!pitch.dataset.v204Exact){
  pitch.dataset.v204Exact='1';
  pitch.innerHTML=v204PitchSvg();
 }
}

async function renderCompare(){
 if(route()!=='playerCompare')return;
 v206EnsurePickerStyle();
 const a=await getApi();if(!a)return;
 const list=a.playerList();
 let primary=resolvePlayer(read(PRIMARY_KEY),list);
 if(!primary)primary=list[0]||null;
 if(!primary)return;
 write(PRIMARY_KEY,primary);
 let secondary=resolvePlayer(read(SECONDARY_KEY),list);
 if(secondary&&playerKey(secondary)===playerKey(primary))secondary=null;

 if(!secondary&&!pickerOpen&&!pickerAutoShown){
  pickerSide='secondary';
  pickerOpen=true;
  pickerAutoShown=true;
  query='';
 }

 const screen=document.querySelector('#screen');if(!screen)return;
 document.body.classList.add('v123-player-compare-active');
 const cat=primary.category||'Categoría';
 screen.innerHTML='<section class="v123-player-compare" data-v123-player-compare>'+
  '<section class="v123-compare-hero">'+
   '<button type="button" class="v123-back" data-v123-back aria-label="Volver"><svg viewBox="0 0 24 24"><path d="M19 12H5m7-7-7 7 7 7"/></svg></button>'+
   '<div class="v123-duel">'+playerCard(primary,'primary')+(secondary?'<span class="v123-vs">VS</span>':'')+playerCard(secondary,'secondary')+'</div>'+
   '<div class="v123-filter-row"><span>'+esc(cat)+'</span><span><i></i>Competición</span></div>'+
  '</section>'+
  comparison(primary,secondary)+
  listMarkup(primary,secondary,list)+
 '</section>';

 v204ApplyReferenceDecor();
 bindCompare();
}
function openPicker(side){
 pickerSide=side==='primary'?'primary':'secondary';
 pickerOpen=true;
 pickerPosition='';
 query='';
 renderCompare();
}
function bindCompare(){
 document.querySelector('[data-v123-back]')?.addEventListener('click',()=>{if(history.length>1)history.back();else location.hash='#/players'},{once:true});
 document.querySelectorAll('[data-v123-card-side]').forEach(card=>{
  const open=()=>openPicker(card.dataset.v123CardSide||'secondary');
  card.addEventListener('click',e=>{if(e.target.closest('[data-v123-team]'))return;open()},{once:true});
  card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}},{once:true});
 });
 document.querySelectorAll('[data-v123-open-picker]').forEach(b=>b.addEventListener('click',()=>openPicker(b.dataset.v123OpenPicker||'secondary'),{once:true}));
 document.querySelector('[data-v123-close-picker]')?.addEventListener('click',()=>{pickerOpen=false;pickerAutoShown=true;pickerPosition='';query='';renderCompare()},{once:true});
 document.querySelectorAll('[data-v208-position]').forEach(b=>b.addEventListener('click',()=>{
  const next=b.dataset.v208Position||'';
  pickerPosition=pickerPosition===next?'':next;
  renderCompare();
 },{once:true}));
 const input=document.querySelector('[data-v123-search]');
 if(input)input.addEventListener('input',e=>{query=e.target.value;renderCompare();requestAnimationFrame(()=>{const n=document.querySelector('[data-v123-search]');if(n){n.focus();n.setSelectionRange(n.value.length,n.value.length)}})});
 document.querySelectorAll('[data-v123-pick]').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();
  const value={name:b.dataset.v123Pick||'',team:b.dataset.v123PickTeam||'',cat:b.dataset.v123PickCat||''};
  write(pickerSide==='primary'?PRIMARY_KEY:SECONDARY_KEY,value);
  pickerOpen=false;pickerAutoShown=true;query='';renderCompare();
 },{once:true}));
 document.querySelectorAll('[data-v123-team]').forEach(b=>b.addEventListener('click',e=>{
  e.preventDefault();e.stopPropagation();
  const name=b.dataset.v123Team||'';
  if(window.LJR_TEAM_DETAIL_API?.openCompare){window.LJR_TEAM_DETAIL_API.openCompare(name);return}
  localStorage.setItem('v62-team-name',name);localStorage.setItem('v42-open-compare','1');location.hash='#/teamDetail';
 },{once:true}));
}

const TEAM_SELECTOR=[
 '[data-v62-team]','[data-v27-team]','[data-v41-team]','[data-v32-open-team]',
 '[data-v28-team]','[data-v33-team]','[data-v40-team]','[data-team]',
 '[data-v66-open-team]','[data-v42-select-name]',
 '.club-cell','.v27-team-tile','.v28-rank-row','.v66-team-card','.v42-mini-team'
].join(',');
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

 /* V144 — REGISTRO DE JUGADOR:
    elegir un equipo dentro de credentialBuilder pertenece únicamente al formulario
    de alta/credencial. Nunca debe abrir Team Detail ni “Comparar equipos”.
    El selector V132 recibe el toque, actualiza el <select> nativo y cierra su hoja. */
 if(registrationActive()||
    target.closest('[data-v132-layer],[data-v132-open],[data-v64-cred-team],.v132-team-picker,.v132-team-row,[data-v126-team-open],[data-v126-team-choice],.v126-team-custom,.v126-team-panel,.v126-team-choice')){
   return;
 }

 /* V109 — Los botones superiores de Jugadores son FILTROS.
    No deben ser capturados por el comparador global de equipos/jugadores. */
 if(route()==='players'&&target.closest('[data-v66-player-team-filter],[data-v66-player-cat],.v66-team-filter-rail,.v66-category-rail'))return;

 if(target.closest('.bottom-nav,input,select,textarea,.modal,.v105-modal,[data-v42-reference="teamDetail"] .v42-overlay'))return;

 const row=target.closest(PLAYER_SELECTOR);
 const teamEl=target.closest(TEAM_SELECTOR);
 let immediatePlayer=null;

 // EQUIPOS: un toque directo al escudo o al nombre abre de inmediato la ficha
 // con “Comparar equipos” desplegado, y bloquea el handler viejo del contenedor
 // (por ejemplo, una fila de partido completa).
 if(api?.teamList){
  const teams=api.teamList();
  const exactTeamText=norm(target.textContent||'');
  let teamHit=(target.matches('img')&&target.alt?teams.find(t=>norm(t.name)===norm(target.alt)):null)||
              (exactTeamText?teams.find(t=>norm(t.name)===exactTeamText):null);
  if(!teamHit&&teamEl){
   const d=teamEl.dataset||{};
   const raws=[d.v62Team,d.v27Team,d.v41Team,d.v32OpenTeam,d.v28Team,d.v33Team,d.v40Team,d.team,d.v66OpenTeam,d.v42SelectName].filter(Boolean);
   for(const raw of raws){
    const hit=window.LJR_TEAM_DETAIL_API?.resolveTeam?.(raw);
    if(hit){teamHit=hit;break}
   }
   if(!teamHit){
    const txt=norm(teamEl.textContent||'');
    const hits=teams.filter(t=>txt===norm(t.name)||txt.includes(norm(t.name)));
    if(hits.length===1)teamHit=hits[0];
   }
  }
  if(teamHit){
   e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
   if(window.LJR_TEAM_DETAIL_API?.openCompare)window.LJR_TEAM_DETAIL_API.openCompare(teamHit.name);
   else{localStorage.setItem('v62-team-name',teamHit.name);localStorage.setItem('v42-open-compare','1');location.hash='#/teamDetail'}
   return;
  }
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
  query='';pickerOpen=false;pickerSide='secondary';pickerAutoShown=false;pickerPosition='';
  location.hash='#/playerCompare';
 })();
},true);

window.LJR_PLAYER_COMPARE_API={
 open(player){
  getApi().then(a=>{
   if(!a)return;
   const p=resolvePlayer(player,a.playerList());if(!p)return;
   write(PRIMARY_KEY,p);localStorage.removeItem(SECONDARY_KEY);query='';pickerOpen=false;pickerSide='secondary';pickerAutoShown=false;pickerPosition='';location.hash='#/playerCompare';
  });
 },
 render:renderCompare
};

function v204SyncThemeColor(){
 const meta=document.querySelector('meta[name="theme-color"]');
 if(!meta)return;
 const active=route()==='playerCompare';
 if(active){
  if(!meta.dataset.v204Previous)meta.dataset.v204Previous=meta.getAttribute('content')||'#02065F';
  meta.setAttribute('content','#0635f5');
 }else if(meta.dataset.v204Previous){
  meta.setAttribute('content',meta.dataset.v204Previous);
  delete meta.dataset.v204Previous;
 }
}
function schedule(){
 v204SyncThemeColor();
 if(route()==='playerCompare')requestAnimationFrame(()=>requestAnimationFrame(renderCompare));
 else{
  document.body.classList.remove('v123-player-compare-active');
  pickerOpen=false;
  pickerAutoShown=false;
  pickerPosition='';
  query='';
 }
}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('DOMContentLoaded',()=>{getApi();schedule()},{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()==='playerCompare'&&!screen.querySelector('[data-v123-player-compare]'))schedule()}).observe(screen,{childList:true,subtree:false});
if(document.readyState!=='loading'){getApi();schedule()}
})();