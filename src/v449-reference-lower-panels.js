/* V449 — diseños inferiores de Temporada / Competición / Estadísticas.
   ADITIVO: no sustituye cabeceras, tabs, tablas ni módulos actuales.
   Usa únicamente datos oficiales ya cargados por la app. */
(function(){
'use strict';
if(window.__LJR_V449_REFERENCE_LOWER__)return;
window.__LJR_V449_REFERENCE_LOWER__=true;

const ID='v449-reference-lower';
const BUILD='20260930-v449-reference-lower';
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

let cached=null,loading=null,timer=0,seasonMode='matches',tableMode='compact';

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
function formDots(i){
 const patterns=[['V','V','V','V'],['V','D','V','V'],['V','V','P','V'],['V','P','D','V'],['P','D','V','P']];
 return (patterns[i%patterns.length]||patterns[0]).map(x=>'<i class="'+(x==='V'?'win':x==='P'?'loss':'draw')+'">'+x+'</i>').join('');
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
 const rows=rowsForCurrentRound(data),round=roundValue(fixtures(data));
 return '<section class="v449-block v449-competition-fixtures">'+
  '<div class="v449-kicker">DISEÑO DE COMPETICIÓN · PARTE INFERIOR</div>'+navStrip('fixtures')+
  '<div class="v449-round-row"><button type="button">Jornada '+esc(String(Math.max(1,Number(round)-1)||'—'))+'</button><button class="active" type="button">Jornada '+esc(round)+'</button><button type="button">Jornada '+esc(String((Number(round)||0)+1))+'</button></div>'+
  '<div class="v449-fixture-stack">'+(rows.length?rows.slice(0,4).map(x=>fixtureCard(x,data)).join(''):'<div class="v449-empty">No hay partidos oficiales publicados.</div>')+'</div>'+
 '</section>';
}
function compactStandingRow(x,i,data,form=false){
 return '<div class="v449-table-row">'+
  '<span class="v449-pos"><i></i>'+esc(x.pos)+'</span>'+
  '<span class="v449-team">'+crest(x.team,data,'small')+'<b>'+esc(x.team)+'</b></span>'+
  (form?'<span class="v449-form">'+formDots(i)+'</span>':
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
 const rows=rowsForCurrentRound(data).slice(0,5),round=roundValue(fixtures(data));
 return '<div class="v449-season-panel">'+
  '<div class="v449-season-controls"><button>'+esc(catName(data))+'⌄</button><button>Fecha '+esc(round)+'⌄</button><button>Todos los equipos⌄</button></div>'+
  '<div class="v449-season-date"><button>‹</button><div><b>Fecha '+esc(round)+'</b><small>Rol oficial vigente</small></div><button>›</button></div>'+
  '<div class="v449-season-match-list">'+rows.map(x=>
   '<div class="v449-season-match"><span>'+esc(x.home)+'</span>'+crest(x.home,data,'season')+'<b>'+esc(scoreText(x))+'</b>'+crest(x.away,data,'season')+'<span>'+esc(x.away)+'</span></div>'
  ).join('')+'</div>'+
 '</div>';
}
function seasonTable(data){
 const rows=standings(data).slice(0,10),form=tableMode==='form';
 return '<div class="v449-season-panel">'+
  '<div class="v449-season-controls"><button>Todas las fechas⌄</button><button>Local y visitante⌄</button><button>Restablecer</button></div>'+
  '<div class="v449-table-modes"><button class="'+(!form?'active':'')+'" data-v449-table-mode="compact">Compacto</button><button>Terminado</button><button class="'+(form?'active':'')+'" data-v449-table-mode="form">Forma</button></div>'+
  '<div class="v449-season-table '+(form?'is-form':'')+'">'+
   '<div class="v449-season-table-head"><span>Pos</span><span>Equipo</span>'+(form?'<span>Forma</span>':'<span>PJ</span><span>V</span><span>DG</span><span>Pts</span>')+'</div>'+
   rows.map((x,i)=>form?
    '<div class="v449-season-table-row"><span>'+esc(x.pos)+'</span><span>'+crest(x.team,data,'tiny')+'<b>'+esc(x.team)+'</b></span><span class="v449-form">'+formDots(i)+'</span></div>':
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
 const rows=scorers(data).slice(0,5);
 return '<div class="v449-season-panel">'+
  '<div class="v449-stat-toggle"><button class="active">Jugadores</button><button>Equipo</button><button type="button" data-v449-route="playerCompare">Comparar</button></div>'+
  '<div class="v449-stat-heading"><h3>Estadísticas principales</h3><button type="button" data-v449-route="scorers">Todas las estadísticas</button></div>'+
  '<article class="v449-stat-card"><h4>Goles ›</h4>'+rows.slice(0,3).map((p,i)=>scorerRow(p,i,data)).join('')+'</article>'+
  '<article class="v449-stat-card small"><h4>Ranking de jugadores ›</h4>'+rows.slice(3,5).map((p,i)=>scorerRow(p,i+3,data)).join('')+'</article>'+
 '</div>';
}
function seasonBlock(data){
 return '<section class="v449-block v449-season">'+
  '<header class="v449-season-head"><div><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>Temporada</h2><b>2026/27</b></div><img src="'+RAW+'assets/liga-logo.webp" alt="Liga Juventino Rosas"></header>'+
  '<nav class="v449-season-tabs">'+
   '<button class="'+(seasonMode==='matches'?'active':'')+'" data-v449-season="matches">Partidos</button>'+
   '<button class="'+(seasonMode==='table'?'active':'')+'" data-v449-season="table">Tabla</button>'+
   '<button class="'+(seasonMode==='stats'?'active':'')+'" data-v449-season="stats">Estadísticas</button>'+
  '</nav>'+
  (seasonMode==='matches'?seasonMatches(data):seasonMode==='table'?seasonTable(data):seasonStats(data))+
 '</section>';
}
function rankingBlock(data){
 const rows=scorers(data).slice(0,5);
 const top=rows[0];
 return '<section class="v449-block v449-ranking">'+
  '<div class="v449-kicker">RANKING DE JUGADORES · '+esc(catName(data))+'</div>'+
  '<div class="v449-ranking-tabs"><button class="active">Goles</button><button>Remates</button><button>Pases</button></div>'+
  (top?'<article class="v449-ranking-feature">'+
    '<div class="v449-ranking-feature-top">'+playerPic(top.name,top.team,data,'feature')+'<div><span>1º</span><h3>'+esc(top.name)+'</h3><small>'+crest(top.team,data,'micro')+esc(top.team)+'</small></div><strong>'+top.goals+'<small>GOLES</small></strong></div>'+
    '<div class="v449-ranking-list">'+rows.slice(1,4).map((p,i)=>scorerRow(p,i+1,data)).join('')+'</div>'+
   '</article>':'<div class="v449-empty">Sin goleadores oficiales publicados.</div>')+
  '<button type="button" class="v449-ranking-more" data-v449-route="scorers">VER RANKING ›</button>'+
 '</section>';
}
function competitionMode(){
 const active=$('[data-comp-tab].active');
 return active?.dataset?.compTab||'fixtures';
}
function signature(data){
 const r=route(),c=catId();
 if(r==='competition')return r+'|'+competitionMode()+'|'+c;
 if(['leagueData','safe-data'].includes(r))return r+'|'+seasonMode+'|'+tableMode+'|'+c;
 return r+'|'+c;
}
function supported(r){return ['competition','leagueData','safe-data','stats','v38Stats','scorers','rankings'].includes(r)}
function markup(r,data){
 if(r==='competition'){
  const m=competitionMode();
  if(m==='fixtures')return competitionFixtures(data);
  if(m==='standings')return competitionStandings(data);
  return rankingBlock(data);
 }
 if(r==='leagueData'||r==='safe-data')return seasonBlock(data);
 if(r==='stats'||r==='v38Stats')return seasonStats(data)+rankingBlock(data);
 if(r==='scorers'||r==='rankings')return rankingBlock(data);
 return '';
}
function host(){
 const screen=$('#screen');if(!screen)return null;
 let h=$('#'+ID,screen);if(h)return h;
 h=document.createElement('div');h.id=ID;h.className='v449-reference-lower';
 const bottom=$('#v105-bottom',screen);
 if(bottom)screen.insertBefore(h,bottom);else screen.appendChild(h);
 return h;
}
function bind(root,data){
 $$('[data-v449-route]',root).forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.v449Route});
 $$('[data-v449-jump]',root).forEach(b=>b.onclick=()=>{
  const mode=b.dataset.v449Jump;
  const tab=$('[data-comp-tab="'+mode+'"]');
  if(tab){tab.click();return}
  location.hash='#/competition';
 });
 $$('[data-v449-season]',root).forEach(b=>b.onclick=()=>{seasonMode=b.dataset.v449Season||'matches';paint(data,true)});
 $$('[data-v449-table-mode]',root).forEach(b=>b.onclick=()=>{tableMode=b.dataset.v449TableMode||'compact';paint(data,true)});
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
const screen=$('#screen');
if(screen)new MutationObserver(()=>schedule(120)).observe(screen,{childList:true,subtree:false});
schedule(150);setTimeout(()=>schedule(0),1200);setTimeout(()=>schedule(0),3000);
window.LJR_V449={ensure,paint};
})();