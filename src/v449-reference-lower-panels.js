/* V449 — diseños inferiores de Temporada / Competición / Estadísticas.
   ADITIVO: no sustituye cabeceras, tabs, tablas ni módulos actuales.
   Usa únicamente datos oficiales ya cargados por la app. */
(function(){
'use strict';
if(window.__LJR_V449_REFERENCE_LOWER__)return;
window.__LJR_V449_REFERENCE_LOWER__=true;

const ID='v449-reference-lower';
const BUILD='20260930-v453-controls-hard-fix-b';
const DATA='./public/data/official-live.json?v='+BUILD;
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const CAT_ORDER=['3','5','4','2','1'];
const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

const LOGO_PATHS={
 'san jose fc':'assets/official-logos/san-jose-fc.png','juventus':'assets/official-logos/juventus.png',
 'hermanos':'assets/official-logos/hermanos.png','linces':'assets/official-logos/linces.png','napoli':'assets/official-logos/napoli.png',
 'franco fc':'assets/official-logos/franco-fc.png','herreras fc':'assets/official-logos/herreras-fc.png',
 'abejas':'assets/official-logos/abejas.png','lobos cdg':'assets/official-logos/lobos-cdg.png',
 'terricolas':'assets/official-logos/terricolas.png','galacticos':'assets/teams/galacticos-pozos.webp',
 'manchester':'assets/official-logos/manchester.png','dynamo':'assets/official-logos/dynamo.png',
 'boavista':'assets/official-logos/boavista.png','boca jrs':'assets/official-logos/boca-jrs.png',
 'toros de cuenda':'assets/official-logos/toros-cuenda.png','la esperanza':'assets/official-logos/la-esperanza.png',
 'dep maravillas':'assets/official-logos/dep-maravillas.png','atletico galeana':'assets/official-logos/atletico-galeana.png',
 'atl galeana':'assets/official-logos/atletico-galeana.png','la canchita deportes':'assets/official-logos/la-canchita-deportes.png',
 'malvinas':'assets/official-logos/malvinas.png','capibaras':'assets/official-logos/capibaras.png',
 'san antonio jrs':'assets/official-logos/san-antonio-jrs.png','la huerta':'assets/official-logos/la-huerta.png',
 'promesas fc':'assets/official-logos/promesas-fc.png','mazacotes fc':'assets/official-logos/mazacotes-fc.png',
 'la cuadrilla':'assets/official-logos/la-cuadrilla.png','osasuna':'assets/official-logos/osasuna.png',
 'populares':'assets/official-logos/populares.png','tapatio':'assets/official-logos/tapatio.png',
 'pachangas fc':'assets/official-logos/pachangas-fc.png','tavera fc':'assets/official-logos/tavera-fc.png',
 'san julian':'assets/official-logos/san-julian.png','san juan fc':'assets/official-logos/san-juan-fc.png',
 'san jose jrs':'assets/official-logos/san-jose-jrs.png','dep la luz':'assets/official-logos/dep-la-luz.png',
 'celticos':'assets/official-logos/celticos.png','barza':'assets/official-logos/barza.png',
 'dep zapata':'assets/official-logos/dep-zapata.png','san antonio fc':'assets/official-logos/san-antonio-fc.png',
 'dep nopalero':'assets/official-logos/dep-nopalero.png'
};

let cached=null,loading=null,timer=0,seasonMode='matches',tableMode='compact',statsView='players',rankingMode='goals',roundOffset=0,teamFilter='all';

function dbNow(){
 try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||cached||null}catch(_){return cached||null}
}
async function loadData(){
 const d=dbNow();if(d)return d;
 if(loading)return loading;
 loading=fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null).then(d=>{if(d)cached=d;return d}).finally(()=>loading=null);
 return loading;
}
function logoFor(name,data){
 try{
  const x=window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||'';
  if(x)return x;
 }catch(_){}
 const p=LOGO_PATHS[norm(name)];if(p)return RAW+p;
 for(const c of Object.values(data?.categories||{})){
  const x=(c?.dashboard?.logo_candidates||[]).find(z=>norm(z?.near_text)===norm(name)&&z?.source);
  if(x?.source)return x.source;
 }
 return '';
}
function crest(name,data,cls=''){
 const src=logoFor(name,data);
 const ini=String(name||'JR').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
 return '<span class="v449-crest '+cls+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<b>'+esc(ini)+'</b>')+'</span>';
}
function playerPhoto(name,team){
 try{
  const pub=window.LJR_PLAYER_PHOTOS;
  if(pub){
   if(typeof pub.get==='function'){const x=pub.get(name,team);if(x)return String(x)}
   const x=pub[norm(name)+'|'+norm(team)]||pub[norm(name)]||pub[name];
   if(x)return String(x);
  }
 }catch(_){}
 return '';
}
function playerPic(name,team,data,cls=''){
 const photo=playerPhoto(name,team);
 if(photo)return '<span class="v449-player-pic '+cls+'"><img src="'+esc(photo)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
 const ini=String(name||'J').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
 return '<span class="v449-player-pic '+cls+' is-fallback">'+crest(team,data,'mini')+'<b>'+esc(ini)+'</b></span>';
}
function catId(){
 const id=String(localStorage.getItem('v62-category')||'3');
 return CAT_ORDER.includes(id)?id:'3';
}
function cat(data,id=catId()){return data?.categories?.[id]||null}
function catName(data,id=catId()){return cat(data,id)?.name||CAT_NAMES[id]||'Liga Municipal'}
function standings(data,id=catId()){
 return (cat(data,id)?.standings?.[0]?.rows||[]).filter(r=>r?.[1]).map((r,i)=>({
  pos:String(r?.[0]??i+1),team:String(r?.[1]||''),pj:String(r?.[2]??'—'),pg:String(r?.[3]??'—'),
  pe:String(r?.[4]??'—'),pp:String(r?.[5]??'—'),gf:String(r?.[6]??'—'),gc:String(r?.[7]??'—'),
  dg:String(r?.[8]??'—'),pts:String(r?.[9]??'—')
 }));
}
function scorers(data,id=catId()){
 return (cat(data,id)?.scorers?.[0]?.rows||[]).filter(r=>r?.[1]&&r?.[2]).map((r,i)=>({
  pos:String(r?.[0]??i+1),name:String(r?.[1]||''),team:String(r?.[2]||''),goals:Number(r?.[3])||0
 })).sort((a,b)=>b.goals-a.goals);
}
function fixtures(data,id=catId()){
 const out=[];
 (cat(data,id)?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
  if(!r?.[2]||!r?.[6])return;
  out.push({key:id+':'+gi+':'+ri,round:String(r?.[1]||''),home:String(r?.[2]||''),hg:String(r?.[3]||''),
   away:String(r?.[6]||''),ag:String(r?.[5]||''),field:String(r?.[7]||''),date:String(r?.[8]||''),status:String(r?.[10]||'')});
 }));
 return out;
}
function roundValue(rows){
 const nums=rows.map(x=>Number(x.round)).filter(Number.isFinite);
 return nums.length?String(Math.max(...nums)):'—';
}
function rowsForCurrentRound(data,id=catId()){
 const all=fixtures(data,id),r=roundValue(all);
 const hit=all.filter(x=>x.round===r);
 return (hit.length?hit:all.slice(-8)).slice(0,8);
}
function scoreText(x){
 const a=/^\d+$/.test(x.hg)?x.hg:'',b=/^\d+$/.test(x.ag)?x.ag:'';
 return a&&b?a+' – '+b:(/\bGANA\b/i.test(x.status)?x.status:(String(x.date).match(/\b\d{1,2}:\d{2}\b/)||[])[0]||'VS');
}
function shortDate(v){
 const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
 if(!m)return String(v||'Por confirmar').split(' ')[0];
 const month=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'][Math.max(0,Number(m[2])-1)]||'';
 return Number(m[1])+' '+month;
}
function fixtureStamp(v){
 const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 if(!m)return 0;
 return new Date(Number(m[3]),Number(m[2])-1,Number(m[1]),Number(m[4]||0),Number(m[5]||0)).getTime();
}
function teamForm(data,team,id=catId()){
 const games=fixtures(data,id).filter(x=>{
  if(!(norm(x.home)===norm(team)||norm(x.away)===norm(team)))return false;
  return /^\d+$/.test(x.hg)&&/^\d+$/.test(x.ag);
 }).sort((a,b)=>fixtureStamp(b.date)-fixtureStamp(a.date)).slice(0,4);
 return games.map(x=>{
  const home=norm(x.home)===norm(team),gf=Number(home?x.hg:x.ag),ga=Number(home?x.ag:x.hg);
  return gf>ga?'V':gf<ga?'P':'E';
 });
}
function formDots(data,team){
 const f=teamForm(data,team);
 if(!f.length)return '<span class="v449-no-form">—</span>';
 return f.map(x=>'<i class="'+(x==='V'?'win':x==='P'?'loss':'draw')+'">'+x+'</i>').join('');
}
function categoryOptions(data){
 return CAT_ORDER.filter(id=>data?.categories?.[id]).map(id=>'<option value="'+id+'" '+(id===catId()?'selected':'')+'>'+esc(catName(data,id))+'</option>').join('');
}
function teamsForCat(data,id=catId()){
 return standings(data,id).map(x=>x.team);
}
function roundList(data,id=catId()){
 return [...new Set(fixtures(data,id).map(x=>Number(x.round)).filter(Number.isFinite))].sort((a,b)=>a-b);
}
function selectedRound(data,id=catId()){
 const rounds=roundList(data,id);
 if(!rounds.length)return null;
 const ix=Math.max(0,Math.min(rounds.length-1,(rounds.length-1)+roundOffset));
 return rounds[ix];
}
function navStrip(active){
 return '<div class="v449-ref-tabs">'+
  '<button type="button" data-v449-jump="fixtures" class="'+(active==='fixtures'?'active':'')+'">Calendario</button>'+
  '<button type="button" data-v449-jump="standings" class="'+(active==='standings'?'active':'')+'">Clasificación</button>'+
  '<button type="button" data-v449-route="scorers" class="'+(active==='ranking'?'active':'')+'">Ranking</button>'+
 '</div>';
}
function fixtureCard(x,data){
 return '<article class="v449-fixture-card">'+
  '<div class="v449-fixture-date">'+esc(shortDate(x.date))+'</div>'+
  '<div class="v449-fixture-grid">'+
   '<div class="v449-fixture-team">'+crest(x.home,data)+'<b>'+esc(x.home)+'</b></div>'+
   '<div class="v449-fixture-score"><small>'+(/\bGANA\b/i.test(x.status)?'OFICIAL':'PARTIDO')+'</small><strong>'+esc(scoreText(x))+'</strong><button type="button" data-v449-route="competition">RESUMEN</button></div>'+
   '<div class="v449-fixture-team">'+crest(x.away,data)+'<b>'+esc(x.away)+'</b></div>'+
  '</div>'+
  '<div class="v449-fixture-field">'+esc(x.field||'Campo por confirmar')+'</div>'+
 '</article>';
}
function competitionFixtures(data){
 const all=fixtures(data),round=selectedRound(data),rows=(round==null?all:all.filter(x=>Number(x.round)===round)).slice(0,4);
 const rounds=roundList(data),ix=round==null?-1:rounds.indexOf(round);
 const prev=ix>0?rounds[ix-1]:null,next=ix>=0&&ix<rounds.length-1?rounds[ix+1]:null;
 return '<section class="v449-block v449-competition-fixtures">'+
  navStrip('fixtures')+
  '<div class="v449-round-row">'+
    '<button type="button" '+(prev!=null?'data-v449-round-dir="-1"':'disabled')+'>'+(prev!=null?'Jornada '+esc(prev):'—')+'</button>'+
    '<button class="active" type="button">Jornada '+esc(round??'—')+'</button>'+
    '<button type="button" '+(next!=null?'data-v449-round-dir="1"':'disabled')+'>'+(next!=null?'Jornada '+esc(next):'—')+'</button>'+
  '</div>'+
  '<div class="v449-fixture-stack">'+(rows.length?rows.map(x=>fixtureCard(x,data)).join(''):'<div class="v449-empty">No hay partidos oficiales publicados en esta jornada.</div>')+'</div>'+
 '</section>';
}
function compactStandingRow(x,i,data,form=false){
 return '<div class="v449-table-row">'+
  '<span class="v449-pos"><i></i>'+esc(x.pos)+'</span>'+
  '<span class="v449-team">'+crest(x.team,data,'small')+'<b>'+esc(x.team)+'</b></span>'+
  (form?'<span class="v449-form">'+formDots(data,x.team)+'</span>':
   '<span>'+esc(x.pj)+'</span><span>'+esc(x.pg)+'</span><span>'+esc(x.pe)+'</span><span>'+esc(x.pp)+'</span><span>'+esc(x.gf)+'</span><span>'+esc(x.gc)+'</span><strong>'+esc(x.pts)+'</strong>')+
 '</div>';
}
function competitionStandings(data){
 const rows=standings(data).slice(0,12);
 return '<section class="v449-block v449-competition-table">'+
  '<div class="v449-kicker">CLASIFICACIÓN OFICIAL · '+esc(catName(data))+'</div>'+navStrip('standings')+
  '<div class="v449-table-head"><span>POS.</span><span>EQUIPO</span><span>PJ</span><span>PG</span><span>PE</span><span>PP</span><span>GF</span><span>GC</span><span>PTS</span></div>'+
  '<div class="v449-table-body">'+(rows.length?rows.map((x,i)=>compactStandingRow(x,i,data,false)).join(''):'<div class="v449-empty">Sin clasificación publicada.</div>')+'</div>'+
 '</section>';
}
function seasonMatches(data){
 const round=selectedRound(data);
 const all=fixtures(data);
 let rows=(round==null?all:all.filter(x=>Number(x.round)===round));
 if(teamFilter!=='all')rows=rows.filter(x=>norm(x.home)===norm(teamFilter)||norm(x.away)===norm(teamFilter));
 rows=rows.slice(0,6);
 const teams=teamsForCat(data);
 return '<div class="v449-season-panel v449-season-matches-ref">'+
  '<div class="v449-season-controls">'+
    '<label><select data-v449-category>'+categoryOptions(data)+'</select></label>'+
    '<label><select data-v449-round-select>'+roundList(data).map(r=>'<option value="'+r+'" '+(Number(r)===Number(round)?'selected':'')+'>Fecha '+r+'</option>').join('')+'</select></label>'+
    '<label><select data-v449-team-filter><option value="all">Todos los equipos</option>'+teams.map(t=>'<option value="'+esc(t)+'" '+(teamFilter===t?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label>'+
  '</div>'+
  '<div class="v449-season-date"><button type="button" data-v449-round-dir="-1">‹</button><div><b>Fecha '+esc(round??'—')+'</b><small>Rol oficial de '+esc(catName(data))+'</small></div><button type="button" data-v449-round-dir="1">›</button></div>'+
  '<div class="v449-season-match-list">'+(rows.length?rows.map(x=>
   '<div class="v449-season-match"><span>'+esc(x.home)+'</span>'+crest(x.home,data,'season')+'<b>'+esc(scoreText(x))+'</b>'+crest(x.away,data,'season')+'<span>'+esc(x.away)+'</span></div>'
  ).join(''):'<div class="v449-empty">Sin partidos para este filtro.</div>')+'</div>'+
 '</div>';
}
function seasonTable(data){
 const rows=standings(data).slice(0,12),form=tableMode==='form',finished=tableMode==='finished';
 return '<div class="v449-season-panel v449-season-table-ref">'+
  '<div class="v449-season-controls v449-table-filters">'+
    '<label><select data-v449-category>'+categoryOptions(data)+'</select></label>'+
    '<button type="button" data-v449-noop="venue">Local y visitante⌄</button>'+
    '<button type="button" data-v449-reset>Restablecer</button>'+
  '</div>'+
  '<div class="v449-table-modes">'+
    '<button class="'+(tableMode==='compact'?'active':'')+'" data-v449-table-mode="compact">Compacto</button>'+
    '<button class="'+(finished?'active':'')+'" data-v449-table-mode="finished">Terminado</button>'+
    '<button class="'+(form?'active':'')+'" data-v449-table-mode="form">Forma</button>'+
  '</div>'+
  '<div class="v449-season-table '+(form?'is-form':finished?'is-finished':'')+'">'+
   '<div class="v449-season-table-head"><span>Pos</span><span>Equipo</span>'+
     (form?'<span>Forma</span>':finished?'<span>PJ</span><span>V</span><span>E</span><span>D</span><span>Pts</span>':'<span>PJ</span><span>V</span><span>DG</span><span>Pts</span>')+
   '</div>'+
   rows.map(x=>form?
    '<div class="v449-season-table-row"><span>'+esc(x.pos)+'</span><span>'+crest(x.team,data,'tiny')+'<b>'+esc(x.team)+'</b></span><span class="v449-form">'+formDots(data,x.team)+'</span></div>':
    finished?
    '<div class="v449-season-table-row"><span>'+esc(x.pos)+'</span><span>'+crest(x.team,data,'tiny')+'<b>'+esc(x.team)+'</b></span><span>'+esc(x.pj)+'</span><span>'+esc(x.pg)+'</span><span>'+esc(x.pe)+'</span><span>'+esc(x.pp)+'</span><strong>'+esc(x.pts)+'</strong></div>':
    '<div class="v449-season-table-row"><span>'+esc(x.pos)+'</span><span>'+crest(x.team,data,'tiny')+'<b>'+esc(x.team)+'</b></span><span>'+esc(x.pj)+'</span><span>'+esc(x.pg)+'</span><span>'+esc(x.dg)+'</span><strong>'+esc(x.pts)+'</strong></div>'
   ).join('')+
  '</div>'+
 '</div>';
}
function scorerRow(p,i,data){
 return '<div class="v449-scorer-row"><span>'+String(i+1)+'º</span>'+playerPic(p.name,p.team,data)+
  '<div><b>'+esc(p.name)+'</b><small>'+crest(p.team,data,'micro')+esc(p.team)+'</small></div><strong>'+esc(p.goals)+'</strong></div>';
}
function seasonStats(data){
 const rows=scorers(data).slice(0,6);
 const teams=standings(data).slice(0,6);
 const playerPanel='<article class="v449-stat-card"><h4>Goles <span>›</span></h4>'+(
   rows.length?rows.slice(0,3).map((p,i)=>scorerRow(p,i,data)).join(''):'<div class="v449-empty">Sin goleadores oficiales publicados.</div>'
  )+'</article>'+
  '<article class="v449-stat-card small"><h4>Asistencias <span>›</span></h4><div class="v449-stat-unavailable"><b>Dato no publicado</b><small>La fuente oficial de la Liga no publica asistencias individuales.</small></div></article>';
 const teamPanel='<article class="v449-stat-card"><h4>Goles a favor <span>›</span></h4>'+
  teams.slice().sort((a,b)=>Number(b.gf)-Number(a.gf)).slice(0,3).map((t,i)=>
   '<div class="v449-team-stat-row"><span>'+String(i+1)+'</span>'+crest(t.team,data,'statteam')+'<div><b>'+esc(t.team)+'</b><small>'+esc(catName(data))+'</small></div><strong>'+esc(t.gf)+'</strong></div>'
  ).join('')+'</article>'+
  '<article class="v449-stat-card small"><h4>Goles recibidos <span>›</span></h4>'+
  teams.slice().sort((a,b)=>Number(a.gc)-Number(b.gc)).slice(0,3).map((t,i)=>
   '<div class="v449-team-stat-row"><span>'+String(i+1)+'</span>'+crest(t.team,data,'statteam')+'<div><b>'+esc(t.team)+'</b><small>'+esc(catName(data))+'</small></div><strong>'+esc(t.gc)+'</strong></div>'
  ).join('')+'</article>';
 return '<div class="v449-season-panel v449-season-stats-ref">'+
  '<div class="v449-stat-toggle"><div><button class="'+(statsView==='players'?'active':'')+'" data-v449-stats-view="players">Jugadores</button><button class="'+(statsView==='teams'?'active':'')+'" data-v449-stats-view="teams">Equipo</button></div><button type="button" class="v449-compare-btn" data-v449-route="playerCompare"><span>♙</span>Comparar</button></div>'+
  '<div class="v449-stat-heading"><h3>Estadísticas principales</h3><button type="button" data-v449-route="scorers">Todas las<br>estadísticas</button></div>'+
  (statsView==='players'?playerPanel:teamPanel)+
 '</div>';
}
function seasonBlock(data){
 return '<section class="v449-block v449-season">'+
  '<header class="v449-season-head"><div><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>Temporada</h2><b>2026/27</b></div><img src="'+RAW+'assets/liga-logo.webp" alt="Liga Juventino Rosas"></header>'+
  '<nav class="v449-season-tabs">'+
   '<button type="button" class="'+(seasonMode==='matches'?'active':'')+'" data-v449-season="matches">Partidos</button>'+
   '<button type="button" class="'+(seasonMode==='table'?'active':'')+'" data-v449-season="table">Tabla</button>'+
   '<button type="button" class="'+(seasonMode==='stats'?'active':'')+'" data-v449-season="stats">Estadísticas</button>'+
  '</nav>'+
  (seasonMode==='matches'?seasonMatches(data):seasonMode==='table'?seasonTable(data):seasonStats(data))+
 '</section>';
}
function rankingBlock(data){
 const rows=scorers(data).slice(0,5),top=rows[0],available=rankingMode==='goals';
 return '<section class="v449-block v449-ranking v449-ranking-ref">'+
  '<div class="v449-ranking-title">RANKING DE JUGADORES</div>'+
  '<div class="v449-ranking-tabs">'+
   '<button class="'+(rankingMode==='goals'?'active':'')+'" data-v449-ranking-mode="goals">Goles</button>'+
   '<button class="'+(rankingMode==='shots'?'active':'')+'" data-v449-ranking-mode="shots">Remates</button>'+
   '<button class="'+(rankingMode==='passes'?'active':'')+'" data-v449-ranking-mode="passes">Pases</button>'+
  '</div>'+
  (available&&top?'<article class="v449-ranking-feature">'+
    '<div class="v449-ranking-feature-top">'+playerPic(top.name,top.team,data,'feature')+'<div><span>1º</span><h3>'+esc(top.name)+'</h3><small>'+crest(top.team,data,'micro')+esc(top.team)+'</small></div><strong>'+top.goals+'<small>GOLES</small></strong></div>'+
    '<div class="v449-ranking-list">'+rows.slice(1,4).map((p,i)=>scorerRow(p,i+1,data)).join('')+'</div>'+
   '</article>':
   '<div class="v449-ranking-unavailable"><b>'+esc(rankingMode==='shots'?'Remates':'Pases')+'</b><span>Esta estadística no está publicada en la fuente oficial.</span></div>')+
  '<button type="button" class="v449-ranking-more" data-v449-route="scorers">VER RANKING <span>›</span></button>'+
 '</section>';
}
function competitionMode(){
 const active=$('[data-comp-tab].active');
 return active?.dataset?.compTab||'fixtures';
}
function signature(data){
 const r=route(),c=catId();
 if(r==='competition')return r+'|'+competitionMode()+'|'+c+'|'+tableMode+'|'+statsView+'|'+rankingMode+'|'+roundOffset+'|'+teamFilter;
 if(['leagueData','safe-data'].includes(r))return r+'|'+seasonMode+'|'+tableMode+'|'+statsView+'|'+rankingMode+'|'+c+'|'+roundOffset+'|'+teamFilter;
 return r+'|'+c+'|'+tableMode+'|'+statsView+'|'+rankingMode+'|'+roundOffset+'|'+teamFilter;
}
function supported(r){return ['competition','leagueData','safe-data','stats','v38Stats','scorers','rankings'].includes(r)}
function markup(r,data){
 if(r==='competition'){
  const m=competitionMode();
  if(m==='fixtures')return competitionFixtures(data)+seasonMatches(data);
  if(m==='standings')return competitionStandings(data)+seasonTable(data)+rankingBlock(data);
  return rankingBlock(data)+seasonStats(data);
 }
 if(r==='leagueData'||r==='safe-data')return seasonBlock(data);
 if(r==='stats'||r==='v38Stats')return seasonStats(data)+seasonTable(data)+rankingBlock(data);
 if(r==='scorers'||r==='rankings')return rankingBlock(data)+seasonStats(data);
 return '';
}
function host(){
 const screen=$('#screen');if(!screen)return null;
 let h=$('#'+ID,screen);if(h)return h;
 h=document.createElement('div');h.id=ID;h.className='v449-reference-lower';
 const r=route();
 if(r==='stats'){
   const page=screen.querySelector('[data-v33-data]');
   if(page){page.appendChild(h);return h}
 }
 if(r==='v38Stats'){
   const page=screen.querySelector('.v399-stats-page,.v60-tool-page');
   if(page){page.appendChild(h);return h}
 }
 const bottom=$('#v105-bottom',screen);
 if(bottom)screen.insertBefore(h,bottom);else screen.appendChild(h);
 return h;
}
function bind(root,data){
 root.onclick=e=>{
   const t=e.target instanceof Element?e.target.closest('button,[data-v449-route],[data-v449-jump]'):null;
   if(!t||!root.contains(t))return;

   const routeTarget=t.dataset.v449Route;
   if(routeTarget){
     e.preventDefault();e.stopPropagation();
     if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go(routeTarget);
     else location.hash='#/'+routeTarget;
     return;
   }

   if(t.dataset.v449Jump){
     e.preventDefault();e.stopPropagation();
     const mode=t.dataset.v449Jump;
     const tab=document.querySelector('[data-comp-tab="'+mode+'"]');
     if(tab){tab.click();return}
     if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go('competition');
     else location.hash='#/competition';
     return;
   }

   if(t.dataset.v449Season){
     e.preventDefault();e.stopPropagation();
     seasonMode=t.dataset.v449Season||'matches';
     paint(data,true);
     return;
   }

   if(t.dataset.v449TableMode){
     e.preventDefault();e.stopPropagation();
     tableMode=t.dataset.v449TableMode||'compact';
     paint(data,true);
     return;
   }

   if(t.dataset.v449StatsView){
     e.preventDefault();e.stopPropagation();
     statsView=t.dataset.v449StatsView||'players';
     paint(data,true);
     return;
   }

   if(t.dataset.v449RankingMode){
     e.preventDefault();e.stopPropagation();
     rankingMode=t.dataset.v449RankingMode||'goals';
     paint(data,true);
     return;
   }

   if(t.dataset.v449RoundDir){
     e.preventDefault();e.stopPropagation();
     const rounds=roundList(data);if(!rounds.length)return;
     roundOffset=Math.max(-(rounds.length-1),Math.min(0,roundOffset+Number(t.dataset.v449RoundDir||0)));
     paint(data,true);
     return;
   }

   if(t.hasAttribute('data-v449-reset')){
     e.preventDefault();e.stopPropagation();
     tableMode='compact';roundOffset=0;teamFilter='all';
     paint(data,true);
     return;
   }

   if(t.dataset.v449Noop==='venue'){
     e.preventDefault();e.stopPropagation();
     const labels=['Local y visitante⌄','Todos los partidos⌄'];
     const next=t.dataset.v449VenueState==='all'?'combined':'all';
     t.dataset.v449VenueState=next;
     t.textContent=next==='all'?labels[1]:labels[0];
     return;
   }
 };

 root.onchange=e=>{
   const s=e.target;
   if(!(s instanceof HTMLSelectElement)||!root.contains(s))return;

   if(s.hasAttribute('data-v449-round-select')){
     const rounds=roundList(data),i=rounds.indexOf(Number(s.value));
     if(i>=0){roundOffset=i-(rounds.length-1);paint(data,true)}
     return;
   }

   if(s.hasAttribute('data-v449-category')){
     const id=String(s.value||'3');
     if(CAT_ORDER.includes(id)){
       localStorage.setItem('v62-category',id);
       roundOffset=0;teamFilter='all';
       paint(data,true);
     }
     return;
   }

   if(s.hasAttribute('data-v449-team-filter')){
     teamFilter=s.value||'all';
     paint(data,true);
   }
 };
}
function paint(data,force=false){
 const r=route(),screen=$('#screen');if(!screen)return;
 const old=$('#'+ID,screen);
 if(!supported(r)){old?.remove();return}
 const h=host();if(!h)return;
 const sig=signature(data);
 if(!force&&h.dataset.signature===sig&&h.children.length)return;
 h.dataset.signature=sig;
 h.innerHTML=markup(r,data||{});
 bind(h,data||{});
}
async function ensure(){
 const r=route(),screen=$('#screen');if(!screen)return;
 if(!supported(r)){screen.querySelector('#'+ID)?.remove();return}
 const d=dbNow();if(d)paint(d);
 const fresh=await loadData();if(fresh&&route()===r)paint(fresh,true);
}
function schedule(ms=90){clearTimeout(timer);timer=setTimeout(ensure,ms)}
window.addEventListener('hashchange',()=>schedule(110));
window.addEventListener('load',()=>schedule(220));
document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
document.addEventListener('click',e=>{if(e.target instanceof Element&&e.target.closest('[data-comp-tab]'))schedule(140)},true);

/* V453 hard-control layer: runs in capture phase so older global click handlers
   cannot steal taps from the new Temporada/Estadísticas controls. */
window.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target.closest('#v449-reference-lower button'):null;
 if(!t)return;
 const root=t.closest('#v449-reference-lower');if(!root)return;
 const data=dbNow()||cached||{};
 const rerender=()=>paint(data,true);

 if(t.dataset.v449Route){
   e.preventDefault();e.stopImmediatePropagation();
   const r=t.dataset.v449Route;
   if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go(r);else location.hash='#/'+r;
   return;
 }
 if(t.dataset.v449Jump){
   e.preventDefault();e.stopImmediatePropagation();
   const tab=document.querySelector('[data-comp-tab="'+t.dataset.v449Jump+'"]');
   if(tab){tab.click();return}
   if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go('competition');else location.hash='#/competition';
   return;
 }
 if(t.dataset.v449Season){
   e.preventDefault();e.stopImmediatePropagation();seasonMode=t.dataset.v449Season||'matches';rerender();return;
 }
 if(t.dataset.v449TableMode){
   e.preventDefault();e.stopImmediatePropagation();tableMode=t.dataset.v449TableMode||'compact';rerender();return;
 }
 if(t.dataset.v449StatsView){
   e.preventDefault();e.stopImmediatePropagation();statsView=t.dataset.v449StatsView||'players';rerender();return;
 }
 if(t.dataset.v449RankingMode){
   e.preventDefault();e.stopImmediatePropagation();rankingMode=t.dataset.v449RankingMode||'goals';rerender();return;
 }
 if(t.dataset.v449RoundDir){
   e.preventDefault();e.stopImmediatePropagation();
   const rounds=roundList(data);if(!rounds.length)return;
   roundOffset=Math.max(-(rounds.length-1),Math.min(0,roundOffset+Number(t.dataset.v449RoundDir||0)));
   rerender();return;
 }
 if(t.hasAttribute('data-v449-reset')){
   e.preventDefault();e.stopImmediatePropagation();tableMode='compact';roundOffset=0;teamFilter='all';rerender();return;
 }
 if(t.dataset.v449Noop==='venue'){
   e.preventDefault();e.stopImmediatePropagation();
   const next=t.dataset.v449VenueState==='all'?'combined':'all';
   t.dataset.v449VenueState=next;
   t.textContent=next==='all'?'Todos los partidos⌄':'Local y visitante⌄';
 }
},true);

window.addEventListener('change',e=>{
 const s=e.target;
 if(!(s instanceof HTMLSelectElement)||!s.closest('#v449-reference-lower'))return;
 const data=dbNow()||cached||{};
 if(s.hasAttribute('data-v449-round-select')){
   e.stopImmediatePropagation();
   const rounds=roundList(data),i=rounds.indexOf(Number(s.value));
   if(i>=0){roundOffset=i-(rounds.length-1);paint(data,true)}
   return;
 }
 if(s.hasAttribute('data-v449-category')){
   e.stopImmediatePropagation();
   const id=String(s.value||'3');
   if(CAT_ORDER.includes(id)){localStorage.setItem('v62-category',id);roundOffset=0;teamFilter='all';paint(data,true)}
   return;
 }
 if(s.hasAttribute('data-v449-team-filter')){
   e.stopImmediatePropagation();teamFilter=s.value||'all';paint(data,true);
 }
},true);

const screen=$('#screen');
if(screen)new MutationObserver(()=>schedule(90)).observe(screen,{childList:true,subtree:true});
schedule(150);setTimeout(()=>schedule(0),1200);setTimeout(()=>schedule(0),3000);
window.LJR_V449={ensure,paint};
})();