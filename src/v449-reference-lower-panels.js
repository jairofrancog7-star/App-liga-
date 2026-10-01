/* V449 — diseños inferiores de Temporada / Competición / Estadísticas.
   ADITIVO: no sustituye cabeceras, tabs, tablas ni módulos actuales.
   Usa únicamente datos oficiales ya cargados por la app. */
(function(){
'use strict';
if(window.__LJR_V449_REFERENCE_LOWER__)return;
window.__LJR_V449_REFERENCE_LOWER__=true;

const ID='v449-reference-lower';
const BUILD='20261001-v482-vet35-current';
const DATA='./data/official-live.json?v='+BUILD;
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

let cached=null,loading=null,timer=0,seasonMode='matches',tableMode='compact',statsView='players',rankingMode='goals',roundOffset=0,teamFilter='all',venueFilter='all';
try{
 const savedSeason=localStorage.getItem('v449-season-mode');
 if(['matches','table','stats'].includes(savedSeason))seasonMode=savedSeason;
 teamFilter=localStorage.getItem('v449-team-filter')||'all';
}catch(_){}

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
function filteredStandings(data,venue='all',id=catId()){
 if(venue==='all')return standings(data,id);
 const map=new Map();
 const ensure=team=>{
   const key=norm(team);
   if(!map.has(key))map.set(key,{team,pj:0,pg:0,pe:0,pp:0,gf:0,gc:0,dg:0,pts:0});
   return map.get(key);
 };
 for(const g of fixtures(data,id)){
   if(!/^\d+$/.test(g.hg)||!/^\d+$/.test(g.ag))continue;
   const hg=Number(g.hg),ag=Number(g.ag);
   if(venue==='home'){
     const x=ensure(g.home);x.pj++;x.gf+=hg;x.gc+=ag;
     if(hg>ag){x.pg++;x.pts+=3}else if(hg===ag){x.pe++;x.pts++}else{x.pp++}
   }else if(venue==='away'){
     const x=ensure(g.away);x.pj++;x.gf+=ag;x.gc+=hg;
     if(ag>hg){x.pg++;x.pts+=3}else if(ag===hg){x.pe++;x.pts++}else{x.pp++}
   }
 }
 const base=standings(data,id);
 for(const row of base)ensure(row.team);
 const rows=[...map.values()].map(x=>({...x,dg:x.gf-x.gc}));
 rows.sort((a,b)=>b.pts-a.pts||b.dg-a.dg||b.gf-a.gf||a.team.localeCompare(b.team,'es'));
 return rows.map((x,i)=>({
   pos:String(i+1),team:x.team,pj:String(x.pj),pg:String(x.pg),pe:String(x.pe),pp:String(x.pp),
   gf:String(x.gf),gc:String(x.gc),dg:String(x.dg),pts:String(x.pts)
 }));
}
function cycleCategory(data){
 const available=CAT_ORDER.filter(id=>data?.categories?.[id]);
 if(!available.length)return;
 const now=catId(),i=Math.max(0,available.indexOf(now)),next=available[(i+1)%available.length];
 localStorage.setItem('v62-category',next);
 roundOffset=0;teamFilter='all';venueFilter='all';
}
function venueLabel(){
 return venueFilter==='home'?'Solo local':venueFilter==='away'?'Solo visitante':'Local y visitante';
}
function cycleVenue(){
 venueFilter=venueFilter==='all'?'home':venueFilter==='home'?'away':'all';
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
  out.push({
   key:id+':'+gi+':'+ri,
   matchCenterKey:id+':'+String(r?.[0]||ri),
   catId:String(id),
   round:String(r?.[1]||''),
   home:String(r?.[2]||''),
   hg:String(r?.[3]||''),
   away:String(r?.[6]||''),
   ag:String(r?.[5]||''),
   field:String(r?.[7]||''),
   date:String(r?.[8]||''),
   status:String(r?.[10]||'')
  });
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
function roundStoreKey(id=catId()){return 'v449-selected-round:'+String(id)}
function selectedRound(data,id=catId()){
 const rounds=roundList(data,id);
 if(!rounds.length)return null;
 let stored=null;
 try{stored=Number(localStorage.getItem(roundStoreKey(id)))}catch(_){}
 if(Number.isFinite(stored)&&rounds.includes(stored))return stored;
 return rounds[rounds.length-1];
}
function setSelectedRound(data,value,id=catId()){
 const rounds=roundList(data,id),n=Number(value);
 if(!rounds.includes(n))return false;
 try{localStorage.setItem(roundStoreKey(id),String(n))}catch(_){}
 roundOffset=n-(rounds[rounds.length-1]||n);
 return true;
}
function moveRound(data,dir,id=catId()){
 const rounds=roundList(data,id);if(!rounds.length)return false;
 const cur=selectedRound(data,id),ix=Math.max(0,rounds.indexOf(cur));
 const next=Math.max(0,Math.min(rounds.length-1,ix+Number(dir||0)));
 if(next===ix)return false;
 return setSelectedRound(data,rounds[next],id);
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
   '<strong>'+esc(x.pts)+'</strong><span>'+esc(x.pj)+'</span><span>'+esc(x.pg)+'</span><span>'+esc(x.pe)+'</span><span>'+esc(x.pp)+'</span><span>'+esc(x.gf)+'</span><span>'+esc(x.gc)+'</span>')+
 '</div>';
}
function competitionStandings(data){
 const rows=standings(data).slice(0,12);
 return '<section class="v449-block v449-competition-table v458-competition-table">'+
  navStrip('standings')+
  '<div class="v458-table-caption"><b>CLASIFICACIÓN</b><span>'+esc(catName(data))+'</span></div>'+
  '<div class="v449-table-head"><span>POS.</span><span>EQUIPO</span><span>PTS</span><span>PJ</span><span>PG</span><span>PE</span><span>PP</span><span>GF</span><span>GC</span></div>'+
  '<div class="v449-table-body">'+(rows.length?rows.map((x,i)=>compactStandingRow(x,i,data,false)).join(''):'<div class="v449-empty">Sin clasificación publicada.</div>')+'</div>'+
 '</section>';
}
function seasonMatches(data){
 const round=selectedRound(data);
 const rounds=roundList(data),roundIndex=round==null?-1:rounds.indexOf(round);
 const prev=roundIndex>0?rounds[roundIndex-1]:null;
 const next=roundIndex>=0&&roundIndex<rounds.length-1?rounds[roundIndex+1]:null;
 const all=fixtures(data);
 let rows=(round==null?all:all.filter(x=>Number(x.round)===round));
 if(teamFilter!=='all')rows=rows.filter(x=>norm(x.home)===norm(teamFilter)||norm(x.away)===norm(teamFilter));
 rows=rows.slice(0,6);
 const teams=teamsForCat(data);
 return '<div class="v449-season-panel v449-season-matches-ref">'+
  '<div class="v449-season-controls">'+
    '<label aria-label="Categoría"><select data-v449-category title="'+esc(catName(data))+'">'+categoryOptions(data)+'</select></label>'+
    '<label aria-label="Fecha"><select data-v449-round-select title="Fecha '+esc(round??'—')+'">'+roundList(data).map(r=>'<option value="'+r+'" '+(Number(r)===Number(round)?'selected':'')+'>Fecha '+r+'</option>').join('')+'</select></label>'+
    '<label aria-label="Equipo"><select data-v449-team-filter title="'+esc(teamFilter==='all'?'Todos los equipos':teamFilter)+'"><option value="all">Todos los equipos</option>'+teams.map(t=>'<option value="'+esc(t)+'" '+(teamFilter===t?'selected':'')+'>'+esc(t)+'</option>').join('')+'</select></label>'+
  '</div>'+
  '<div class="v449-season-date"><button type="button" '+(prev!=null?'data-v449-round-dir="-1"':'disabled aria-disabled="true"')+'>‹</button><div><b>Fecha '+esc(round??'—')+'</b><small>Rol oficial de '+esc(catName(data))+'</small></div><button type="button" '+(next!=null?'data-v449-round-dir="1"':'disabled aria-disabled="true"')+'>›</button></div>'+
  '<div class="v449-season-match-list">'+(rows.length?rows.map(x=>
   '<button type="button" class="v449-season-match" data-v449-open-match="'+esc(x.matchCenterKey||x.key)+'" data-v449-match-cat="'+esc(x.catId||catId())+'" data-v449-match-home="'+esc(x.home)+'" data-v449-match-away="'+esc(x.away)+'" aria-label="Abrir '+esc(x.home)+' vs '+esc(x.away)+' en Match Center"><span>'+esc(x.home)+'</span>'+crest(x.home,data,'season')+'<b>'+esc(scoreText(x))+'</b>'+crest(x.away,data,'season')+'<span>'+esc(x.away)+'</span></button>'
  ).join(''):'<div class="v449-empty">Sin partidos para este filtro.</div>')+'</div>'+
 '</div>';
}
function seasonTable(data){
 const rows=filteredStandings(data,venueFilter).slice(0,12),form=tableMode==='form',finished=tableMode==='finished';
 return '<div class="v449-season-panel v449-season-table-ref">'+
  '<div class="v449-season-controls v449-table-filters">'+
    '<button type="button" data-v449-category-cycle aria-label="Cambiar categoría">'+esc(catName(data))+'⌄</button>'+
    '<button type="button" data-v449-venue-cycle aria-label="Filtrar local o visitante">'+esc(venueLabel())+'⌄</button>'+
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
function rankingTeamStrip(data){
 const teams=standings(data).slice(0,4);
 if(!teams.length)return '';
 return '<div class="v458-team-strip">'+teams.map(t=>
  '<button type="button" class="v458-team-tile" data-v449-route="teams">'+crest(t.team,data,'rankteam')+'<span>'+esc(t.team)+'</span></button>'
 ).join('')+'</div>';
}
function rankingPlayerRow(p,i,data){
 return '<div class="v458-rank-row">'+
   '<span class="v458-rank-pos">'+String(i+1)+'º</span>'+
   playerPic(p.name,p.team,data,'rankrow')+
   '<div class="v458-rank-person"><b>'+esc(p.name)+'</b><small>'+crest(p.team,data,'micro')+'<span>'+esc(p.team)+'</span></small></div>'+
   '<strong>'+esc(p.goals)+'</strong>'+
  '</div>';
}
function rankingBlock(data){
 const rows=scorers(data).slice(0,6),top=rows[0],available=rankingMode==='goals';
 const showTeams=['stats','v38Stats','scorers','rankings'].includes(route());
 return '<section class="v449-block v449-ranking v449-ranking-ref v458-ranking">'+
  (showTeams?rankingTeamStrip(data):'')+
  '<div class="v449-ranking-title">RANKING DE JUGADORES</div>'+
  '<div class="v449-ranking-tabs">'+
   '<button type="button" class="'+(rankingMode==='goals'?'active':'')+'" data-v449-ranking-mode="goals">Goles</button>'+
   '<button type="button" class="'+(rankingMode==='shots'?'active':'')+'" data-v449-ranking-mode="shots">Remates</button>'+
   '<button type="button" class="'+(rankingMode==='passes'?'active':'')+'" data-v449-ranking-mode="passes">Pases</button>'+
  '</div>'+
  (available&&top?
   '<article class="v458-rank-card">'+
    '<div class="v458-rank-hero">'+
      '<div class="v458-hero-photo">'+playerPic(top.name,top.team,data,'feature')+'</div>'+
      '<div class="v458-hero-meta"><span>1º</span><div><h3>'+esc(top.name)+'</h3><small>'+crest(top.team,data,'micro')+esc(top.team)+'</small></div><strong>'+esc(top.goals)+'<small>GOLES</small></strong></div>'+
    '</div>'+
    '<div class="v458-rank-head"><span>POS.</span><span>JUGADOR</span><span>GOLES</span></div>'+
    '<div class="v458-rank-list">'+rows.slice(1,5).map((p,i)=>rankingPlayerRow(p,i+1,data)).join('')+'</div>'+
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
 if(r==='competition')return r+'|'+competitionMode()+'|'+c+'|'+tableMode+'|'+statsView+'|'+rankingMode+'|'+roundOffset+'|'+teamFilter+'|'+venueFilter;
 if(['leagueData','safe-data'].includes(r))return r+'|'+seasonMode+'|'+tableMode+'|'+statsView+'|'+rankingMode+'|'+c+'|'+roundOffset+'|'+teamFilter+'|'+venueFilter;
 return r+'|'+c+'|'+tableMode+'|'+statsView+'|'+rankingMode+'|'+roundOffset+'|'+teamFilter+'|'+venueFilter;
}
function supported(r){return ['competition','leagueData','safe-data','stats','v38Stats','rankings'].includes(r)}
function markup(r,data){
 if(r==='competition'){
  const m=competitionMode();
  if(m==='fixtures')return competitionFixtures(data)+seasonMatches(data);
  if(m==='standings')return competitionStandings(data)+seasonTable(data)+rankingBlock(data);
  return rankingBlock(data)+seasonStats(data);
 }
 if(r==='leagueData'||r==='safe-data')return seasonBlock(data);
 if(r==='stats'||r==='v38Stats')return seasonStats(data)+seasonTable(data)+rankingBlock(data);
 if(r==='rankings')return rankingBlock(data)+seasonStats(data);
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
 if(r==='scorers'){
   const page=screen.querySelector('[data-v28-scorers]');
   if(page){page.appendChild(h);return h}
 }
 const bottom=$('#v105-bottom',screen);
 if(bottom)screen.insertBefore(h,bottom);else screen.appendChild(h);
 return h;
}
function handleButton(t,data=dbNow()||cached||{}){
 if(!(t instanceof Element))return false;
 const latest=()=>dbNow()||data||cached||{};
 const rerender=()=>paint(latest(),true);

 if(t.dataset.v449Route){
   const r=t.dataset.v449Route;
   if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go(r);else location.hash='#/'+r;
   return true;
 }
 if(t.dataset.v449Jump){
   const tab=document.querySelector('[data-comp-tab="'+t.dataset.v449Jump+'"]');
   if(tab){tab.click();return true}
   if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go('competition');else location.hash='#/competition';
   return true;
 }
 if(t.dataset.v449Season){
   seasonMode=t.dataset.v449Season||'matches';
   try{localStorage.setItem('v449-season-mode',seasonMode)}catch(_){}
   rerender();return true;
 }
 if(t.dataset.v449TableMode){
   tableMode=t.dataset.v449TableMode||'compact';rerender();return true;
 }
 if(t.dataset.v449StatsView){
   statsView=t.dataset.v449StatsView||'players';rerender();return true;
 }
 if(t.dataset.v449RankingMode){
   rankingMode=t.dataset.v449RankingMode||'goals';rerender();return true;
 }
 if(t.dataset.v449RoundDir){
   moveRound(latest(),Number(t.dataset.v449RoundDir||0));
   rerender();return true;
 }
 if(t.dataset.v449OpenMatch){
   const key=String(t.dataset.v449OpenMatch||'');
   const cid=String(t.dataset.v449MatchCat||catId());
   try{
    localStorage.setItem('v62-category',cid);
    localStorage.setItem('v12-fixture-cat',cid);
    sessionStorage.setItem('v449-last-match',JSON.stringify({key,home:t.dataset.v449MatchHome||'',away:t.dataset.v449MatchAway||'',cat:cid}));
   }catch(_){}
   if(window.LJR_MATCH_CENTER?.open)window.LJR_MATCH_CENTER.open(key);
   else location.hash='#/v4-matchcenter';
   return true;
 }
 if(t.hasAttribute('data-v449-category-cycle')){
   cycleCategory(latest());rerender();return true;
 }
 if(t.hasAttribute('data-v449-venue-cycle')){
   cycleVenue();rerender();return true;
 }
 if(t.hasAttribute('data-v449-reset')){
   tableMode='compact';roundOffset=0;teamFilter='all';venueFilter='all';
   localStorage.setItem('v62-category','3');
   rerender();return true;
 }
 return false;
}
function handleSelect(s,data=dbNow()||cached||{}){
 if(!s||String(s.tagName||'').toUpperCase()!=='SELECT')return false;
 const latest=()=>dbNow()||data||cached||{};
 if(s.hasAttribute('data-v449-round-select')){
   const d=latest();
   if(setSelectedRound(d,Number(s.value)))paint(d,true);
   return true;
 }
 if(s.hasAttribute('data-v449-category')){
   const id=String(s.value||'3');
   if(CAT_ORDER.includes(id)){
    try{
     localStorage.setItem('v62-category',id);
     localStorage.setItem('v12-fixture-cat',id);
     localStorage.setItem('v176-table-category',id);
     localStorage.setItem('v422-results-category',id);
     localStorage.removeItem(roundStoreKey(id));
    }catch(_){}
    roundOffset=0;teamFilter='all';venueFilter='all';
    paint(latest(),true);
   }
   return true;
 }
 if(s.hasAttribute('data-v449-team-filter')){
   teamFilter=String(s.value||'all');
   try{localStorage.setItem('v449-team-filter',teamFilter)}catch(_){}
   paint(latest(),true);return true;
 }
 return false;
}
function bind(root,data){
 root.onclick=e=>{
   const t=e.target instanceof Element?e.target.closest('button,[data-v449-route],[data-v449-jump]'):null;
   if(!t||!root.contains(t))return;
   if(handleButton(t,data)){e.preventDefault();e.stopPropagation()}
 };
 root.onchange=e=>{
   const s=e.target;
   if(!s||String(s.tagName||'').toUpperCase()!=='SELECT'||!root.contains(s))return;
   if(handleSelect(s,data)){e.preventDefault();e.stopPropagation()}
 };
}
function paint(data,force=false){
 const r=route(),screen=$('#screen');if(!screen)return;
 const old=$('#'+ID,screen);
 if(!supported(r)){old?.remove();return}
 const h=host();if(!h)return;
 const sig=signature(data)+'|'+String(data?.captured_at_utc||'');
 if(!force&&h.dataset.signature===sig&&h.children.length)return;
 h.dataset.signature=sig;
 h.innerHTML=markup(r,data||{});
 bind(h,data||{});
}
async function ensure(){
 const r=route(),screen=$('#screen');if(!screen)return;
 if(!supported(r)){screen.querySelector('#'+ID)?.remove();return}
 const d=dbNow();if(d)paint(d);
 const fresh=await loadData();if(fresh&&route()===r)paint(fresh);
}
function schedule(ms=90){clearTimeout(timer);timer=setTimeout(ensure,ms)}
window.addEventListener('hashchange',()=>schedule(110));
window.addEventListener('load',()=>schedule(220));
document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
document.addEventListener('click',e=>{if(e.target instanceof Element&&e.target.closest('[data-comp-tab]'))schedule(140)},true);

/* V455 fallback control layer. The index fastlane is registered before all modules;
   this remains as a secondary path if the page is embedded differently. */
window.addEventListener('click',e=>{
 const t=e.target instanceof Element?e.target.closest('#v449-reference-lower button'):null;
 if(!t)return;
 if(handleButton(t)){e.preventDefault();e.stopPropagation()}
},true);
window.addEventListener('change',e=>{
 const s=e.target;
 if(!(s instanceof HTMLSelectElement)||!s.closest('#v449-reference-lower'))return;
 if(handleSelect(s))e.stopPropagation();
},true);

const screen=$('#screen');
if(screen)new MutationObserver(()=>{if(supported(route()))schedule(90)}).observe(screen,{childList:true,subtree:true});
window.addEventListener('ljr:official-data',()=>schedule(0));
schedule(150);setTimeout(()=>schedule(0),1200);setTimeout(()=>schedule(0),3000);
window.LJR_V449={
 ensure,paint,handleButton,handleSelect,
 nextRound(dir){const data=dbNow()||cached||{};moveRound(data,Number(dir||0));paint(data,true)},
 setRound(value){const data=dbNow()||cached||{};if(setSelectedRound(data,value))paint(data,true)},
 setCategory(id){const data=dbNow()||cached||{};const fake={tagName:'SELECT',value:String(id),hasAttribute:n=>n==='data-v449-category'};handleSelect(fake,data)},
 setTeam(name){teamFilter=String(name||'all');paint(dbNow()||cached||{},true)},
 openMatch(key){if(window.LJR_MATCH_CENTER?.open)window.LJR_MATCH_CENTER.open(String(key||''));else location.hash='#/v4-matchcenter'}
};
})();