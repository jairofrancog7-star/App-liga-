/* V444 — Diseños inferiores de referencia: Inicio + Estadísticas, adaptados al azul. */
(function(){
'use strict';
if(window.__LJR_V444_HOME_STATS_REFERENCE__)return;
window.__LJR_V444_HOME_STATS_REFERENCE__=true;

const BUILD='20260930-v444-home-stats-reference';
const DATA='./public/data/official-live.json?v='+BUILD;
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const CAT_ORDER=['3','5','4','2','1'];
const CAT_NAMES={'3':'Primera Fuerza','5':'Intermedia','4':'Segunda Fuerza','2':'Veteranos 35+','1':'Veteranos 50+'};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

const LOGO_PATHS={
 'san jose fc':'assets/official-logos/san-jose-fc.png','juventus':'assets/official-logos/juventus.png',
 'hermanos':'assets/official-logos/hermanos.png','linces':'assets/official-logos/linces.png',
 'napoli':'assets/official-logos/napoli.png','franco fc':'assets/official-logos/franco-fc.png',
 'herreras fc':'assets/official-logos/herreras-fc.png','abejas':'assets/official-logos/abejas.png',
 'lobos cdg':'assets/official-logos/lobos-cdg.png','terricolas':'assets/official-logos/terricolas.png',
 'galacticos':'assets/teams/galacticos-pozos.webp','galacticos de pozos':'assets/teams/galacticos-pozos.webp',
 'manchester':'assets/official-logos/manchester.png','dynamo':'assets/official-logos/dynamo.png',
 'la esperanza':'assets/official-logos/la-esperanza.png','boavista':'assets/official-logos/boavista.png',
 'toros de cuenda':'assets/official-logos/toros-cuenda.png','boca jrs':'assets/official-logos/boca-jrs.png',
 'tavera fc':'assets/official-logos/tavera-fc.png','san julian':'assets/official-logos/san-julian.png',
 'america':'assets/branding/america-veteranos-35-user.png','club america veteranos':'assets/branding/america-veteranos-35-user.png',
 'promesas fc':'assets/official-logos/promesas-fc.png','la huerta':'assets/official-logos/la-huerta.png',
 'atletico galeana':'assets/official-logos/atletico-galeana.png','san antonio jrs':'assets/official-logos/san-antonio-jrs.png'
};

let cached=null;
let loading=null;

function dbNow(){
 try{return window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||cached||null}catch(_){return cached||null}
}
async function loadData(){
 const live=dbNow(); if(live)return live;
 if(loading)return loading;
 loading=fetch(DATA,{cache:'no-store'}).then(r=>r.ok?r.json():null).catch(()=>null).then(d=>{if(d)cached=d;return d}).finally(()=>{loading=null});
 return loading;
}
function parseDate(v){
 const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
 return m?new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)):null;
}
function publishedScore(row){
 const a=String(row?.[3]??'').trim(),b=String(row?.[5]??'').trim();
 return (/^\d+$/.test(a)||/^\d+$/.test(b))&&(/^(?:\d+|-)$/.test(a))&&(/^(?:\d+|-)$/.test(b));
}
function score(v){const s=String(v??'').trim();return s==='-'?'0':(/^\d+$/.test(s)?s:'—')}
function logo(name,data){
 try{
   const x=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';
   if(x)return x;
 }catch(_){}
 const key=norm(name);
 const local=LOGO_PATHS[key]; if(local)return RAW+local;
 for(const c of Object.values(data?.categories||{})){
   const candidates=c?.dashboard?.logo_candidates||[];
   const exact=candidates.find(x=>norm(x?.near_text)===key&&x?.source);
   if(exact?.source)return exact.source;
 }
 return '';
}
function badge(name,data,cls='v444-badge'){
 const src=logo(name,data);
 if(src)return '<span class="'+cls+'"><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async"></span>';
 const ini=String(name||'JR').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
 return '<span class="'+cls+' is-fallback">'+esc(ini||'JR')+'</span>';
}
function allTeams(data){
 const out=[],seen=new Set();
 CAT_ORDER.forEach(id=>{
   const c=data?.categories?.[id]; if(!c)return;
   const add=n=>{n=String(n||'').trim();const k=norm(n);if(n&&!seen.has(k)){seen.add(k);out.push({name:n,cat:id,category:c.name||CAT_NAMES[id]||''})}};
   (c?.standings?.[0]?.rows||[]).forEach(r=>add(r?.[1]));
   Object.keys(c?.rosters||{}).forEach(add);
   (c?.fixtures?.[0]?.rows||[]).forEach(r=>{add(r?.[2]);add(r?.[6])});
 });
 return out;
}
function allFixtures(data){
 const out=[];
 CAT_ORDER.forEach(id=>{
  const c=data?.categories?.[id]; if(!c)return;
  (c?.fixtures||[]).forEach((g,gi)=>(g?.rows||[]).forEach((r,ri)=>{
   if(!r?.[2]||!r?.[6])return;
   out.push({key:id+':'+gi+':'+ri,cat:id,category:c.name||CAT_NAMES[id]||'',row:r,date:parseDate(r?.[8])});
  }));
 });
 return out;
}
function recentResults(data){
 return allFixtures(data).filter(x=>publishedScore(x.row))
  .sort((a,b)=>(b.date?.getTime()||0)-(a.date?.getTime()||0)).slice(0,4);
}
function topScorers(data,cat){
 const c=data?.categories?.[cat];
 return (c?.scorers?.[0]?.rows||[]).filter(r=>r?.[1]&&r?.[2]&&/^\d+$/.test(String(r?.[3]||'')))
  .map(r=>({rank:r[0],name:String(r[1]),team:String(r[2]),goals:Number(r[3])||0})).sort((a,b)=>b.goals-a.goals).slice(0,5);
}
function topStandings(data,cat){
 const c=data?.categories?.[cat];
 return (c?.standings?.[0]?.rows||[]).filter(r=>r?.[1]).slice(0,5).map(r=>({rank:r[0],team:String(r[1]),pj:r[2],dg:r[8],pts:r[9]}));
}
function homeTeamItem(t,data){
 return '<button type="button" class="v444-home-club" data-v444-team="'+esc(t.name)+'">'+
   badge(t.name,data,'v444-home-club-logo')+'<b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Juventino')+'</small></button>';
}
function specialHomeItem(kind){
 const goals=kind==='goals';
 return '<button type="button" class="v444-home-club is-special" data-v444-route="'+(goals?'scorers':'moments')+'">'+
  '<span class="v444-home-special-icon">'+(goals?'⚽':'★')+'</span><b>'+(goals?'Todos los goles':'Lo mejor de la jornada')+'</b><small>'+(goals?'Goleadores oficiales':'Momentos y videos')+'</small></button>';
}
function resultRow(x,data){
 const r=x.row;
 return '<button type="button" class="v444-home-result" data-v444-route="v4-matchcenter">'+
  '<span class="v444-result-team is-home">'+badge(r[2],data,'v444-result-logo')+'<span><b>'+esc(r[2])+'</b><small>'+esc(x.category)+'</small></span></span>'+
  '<span class="v444-result-score"><small>FINAL</small><strong>'+score(r[3])+' <i>–</i> '+score(r[5])+'</strong></span>'+
  '<span class="v444-result-team is-away"><span><b>'+esc(r[6])+'</b><small>'+esc(r?.[7]||'Liga Juventino')+'</small></span>'+badge(r[6],data,'v444-result-logo')+'</span>'+
 '</button>';
}
function homeMarkup(data){
 const teams=allTeams(data).slice(0,6),matches=recentResults(data);
 const teamBody=(teams.length?teams.map(t=>homeTeamItem(t,data)).join(''):'<div class="v444-data-empty">Cargando equipos oficiales…</div>')+specialHomeItem('goals')+specialHomeItem('moments');
 const matchBody=matches.length?matches.map(x=>resultRow(x,data)).join(''):'<div class="v444-data-empty is-wide">Los partidos oficiales aparecerán aquí al cargar el rol.</div>';
 return '<section class="v444-home-card" aria-label="Resumen de Liga Juventino">'+
  '<header class="v444-home-brand"><img src="'+RAW+'assets/liga-logo.webp" alt="Liga Juventino Rosas"><div><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>JUVENTINO ROSAS</h2><strong>GUANAJUATO</strong></div></header>'+
  '<div class="v444-home-season"><span><b>LIGA MUNICIPAL</b><small>JUVENTINO ROSAS</small></span><em>⚽</em><span class="is-season"><b>TEMPORADA 2026/27</b><small>FÚTBOL QUE NOS UNE</small></span><button type="button" data-v444-route="teams" aria-label="Equipos">⊕</button></div>'+
  '<div class="v444-home-clubs">'+teamBody+'</div>'+
  '<div class="v444-home-results-head"><h3>PARTIDOS RELEVANTES</h3><button type="button" data-v444-route="competition">Ver todos ›</button></div>'+
  '<div class="v444-home-results">'+matchBody+'</div>'+
 '</section>';
}
function playerAvatar(name){
 const ini=String(name||'').split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('').toUpperCase();
 return '<span class="v444-player-avatar">'+esc(ini||'J')+'</span>';
}
function scorerRow(p,i,data){
 return '<button type="button" class="v444-stat-row" data-v444-route="scorers">'+
  '<span class="v444-stat-rank">'+(i+1)+'</span>'+playerAvatar(p.name)+badge(p.team,data,'v444-stat-team-logo')+
  '<span class="v444-stat-person"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+'</small></span><strong>'+p.goals+'</strong></button>';
}
function teamStatRow(t,i,data){
 return '<button type="button" class="v444-stat-row is-team" data-v444-team="'+esc(t.team)+'">'+
  '<span class="v444-stat-rank">'+(i+1)+'</span>'+badge(t.team,data,'v444-stat-team-main')+
  '<span class="v444-stat-person"><b>'+esc(t.team)+'</b><small>PJ '+esc(t.pj)+' · DG '+esc(t.dg)+'</small></span><strong>'+esc(t.pts)+'</strong></button>';
}
function statsMarkup(data,view='player'){
 const cat=String(localStorage.getItem('v62-category')||'3');
 const c=data?.categories?.[cat],name=c?.name||CAT_NAMES[cat]||'Liga Juventino';
 const scorers=topScorers(data,cat),table=topStandings(data,cat),isTeam=view==='team';
 const rows=isTeam?table.slice(0,3).map((x,i)=>teamStatRow(x,i,data)).join(''):scorers.slice(0,3).map((x,i)=>scorerRow(x,i,data)).join('');
 const empty='<div class="v444-stats-empty">Sin datos oficiales publicados para '+esc(name)+'.</div>';
 return '<section class="v444-stats-card" data-v444-stats-view="'+view+'" aria-label="Estadísticas principales">'+
  '<header class="v444-stats-hero"><div><small>Liga Municipal de Fútbol</small><h2>Juventino Rosas, Guanajuato</h2><button type="button" data-v444-route="leagueData">2026/27⌄</button></div><img src="'+RAW+'assets/liga-logo.webp" alt="Liga Juventino Rosas"></header>'+
  '<nav class="v444-stats-tabs"><button type="button" data-v444-route="competition">Partidos</button><button type="button" data-v444-route="leagueData">Tabla</button><button type="button" class="is-active">Estadísticas</button></nav>'+
  '<div class="v444-stats-tools"><div class="v444-stats-seg"><button type="button" data-v444-view="player" class="'+(!isTeam?'is-active':'')+'">Jugador</button><button type="button" data-v444-view="team" class="'+(isTeam?'is-active':'')+'">Equipo</button></div><button type="button" class="v444-compare" data-v444-route="'+(isTeam?'teamCompare':'playerCompare')+'">♙ Comparar</button></div>'+
  '<div class="v444-stats-title"><div><small>'+esc(name)+'</small><h3>Estadísticas principales</h3></div><button type="button" data-v444-route="leagueData">Todas las<br>estadísticas</button></div>'+
  '<article class="v444-stat-panel"><header><h4>'+(isTeam?'Clasificación':'Goles')+' <span>›</span></h4></header>'+(rows||empty)+'</article>'+
  '<article class="v444-stat-panel is-assists"><header><h4>'+(isTeam?'Rendimiento':'Asistencias')+' <span>›</span></h4></header>'+
    (isTeam&&table[0]?'<div class="v444-assist-note"><b>'+esc(table[0].team)+'</b><span>Líder actual · '+esc(table[0].pts)+' pts</span></div>':'<div class="v444-assist-note"><b>Dato no publicado</b><span>La fuente oficial no publica asistencias individuales.</span></div>')+
  '</article>'+
 '</section>';
}
function bind(root,data){
 root.querySelectorAll('[data-v444-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+(b.dataset.v444Route||'home')});
 root.querySelectorAll('[data-v444-team]').forEach(b=>b.onclick=()=>{
   const name=b.dataset.v444Team||''; if(!name)return;
   try{localStorage.setItem('v62-team-name',name);localStorage.removeItem('v42-open-compare')}catch(_){}
   location.hash='#/teamDetail';
 });
 root.querySelectorAll('[data-v444-view]').forEach(b=>b.onclick=()=>{
   const host=b.closest('[data-v444-stats-ref]'); if(!host)return;
   const view=b.dataset.v444View||'player'; host.dataset.v444View=view;host.innerHTML=statsMarkup(data,view);bind(host,data);
 });
}
function paint(data){
 const h=document.querySelector('[data-v444-home-ref]');
 if(h){h.innerHTML=homeMarkup(data||{});bind(h,data||{})}
 const s=document.querySelector('[data-v444-stats-ref]');
 if(s){const view=s.dataset.v444View||'player';s.innerHTML=statsMarkup(data||{},view);bind(s,data||{})}
}
async function ensure(){
 const r=route();
 if(r!=='home'&&r!=='stats'&&r!=='v38Stats')return;
 const exists=(r==='home'?document.querySelector('[data-v444-home-ref]'):document.querySelector('[data-v444-stats-ref]'));
 if(!exists){
   try{window.LJR_V105?.mount?.()}catch(_){}
   return;
 }
 const data=dbNow();
 if(data)paint(data);
 const fresh=await loadData(); if(fresh)paint(fresh);
}
let timer=0;
function schedule(ms=60){clearTimeout(timer);timer=setTimeout(ensure,ms)}
window.addEventListener('hashchange',()=>schedule(100));
window.addEventListener('load',()=>schedule(180));
document.addEventListener('DOMContentLoaded',()=>schedule(80),{once:true});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule(80)).observe(screen,{childList:true,subtree:true});
schedule(120);setTimeout(()=>schedule(0),900);setTimeout(()=>schedule(0),2600);
window.LJR_V444={ensure,paint};
})();