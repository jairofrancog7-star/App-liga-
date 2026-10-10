/* V33 — Datos / Estadísticas con fuente oficial AdminFut.
   Conserva el diseño V33 y elimina métricas/nombres ficticios. */
(function(){
'use strict';
const LOCAL='./data/official-live.json?v=20261001-v491-v35-all-pages';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20261001-v491-v35-all-pages';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
let activeTab=localStorage.getItem('v33-data-tab')||'general';
try{
  if(localStorage.getItem('v542-stats-layout-restored')!=='1'){
    activeTab='general';
    localStorage.setItem('v33-data-tab','general');
    localStorage.setItem('v542-stats-layout-restored','1');
  }
}catch(_){activeTab='general'}

function route(){return location.hash.replace('#/','')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c]))}
function norm(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}
function same(a,b){return norm(a)===norm(b)}
async function load(){
  if(db)return db;
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{const r=await fetch(u,{cache:'no-store'});if(r.ok){db=await r.json();break}}catch(e){}
    }
    return db;
  })();
  return loading;
}
function current(){return db?.categories?.['3']||null}
function logoFor(name){
  const v=Object.entries(db?.team_logos||{}).find(([k])=>same(k,name))?.[1];
  if(v?.local)return SRC+String(v.local).replace(/^\.\//,'');
  if(v?.source)return v.source;
  if(norm(name)==='galacticos')return SRC+'assets/teams/galacticos-pozos.webp';
  return '';
}
function initials(name){return String(name||'').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase()}
function teamLogo(name,cls=''){
  const src=logoFor(name);
  return '<span class="v33-team-logo '+cls+'">'+(src?'<img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span class="v33-fallback">'+esc(initials(name))+'</span>')+'</span>';
}
function playerAvatar(name,team,cls='v33-player-avatar'){
  let src='';
  /* V579: la foto oficial del registro manda sobre cualquier caché local.
     Evita que un escudo guardado por error sustituya la cara del jugador. */
  const entry=Object.entries(current()?.player_profiles||{}).find(([t])=>same(t,team));
  const p=(Array.isArray(entry?.[1])?entry[1]:[]).find(x=>same(x?.name,name));
  src=String(p?.photo||'').trim();
  if(!src){
    try{src=window.LJR_PLAYER_MEDIA?.photo?.(name,team,'3')||window.LJR_PLAYER_PHOTOS?.get?.(name,team,'3')||''}catch(_){}
  }
  return src
    ?'<span class="'+cls+' v576-has-photo" data-v579-player-photo><img src="'+esc(src)+'" alt="'+esc(name)+'" loading="lazy" decoding="async" referrerpolicy="no-referrer"></span>'
    :'<span class="'+cls+' v576-photo-fallback">'+esc(initials(name).slice(0,2))+'</span>';
}
function backIcon(){return '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>'}
function shareIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="18" cy="5" r="2.25"/><circle cx="6" cy="12" r="2.25"/><circle cx="18" cy="19" r="2.25"/><path d="m8.1 10.9 7.6-4.5M8.1 13.1l7.6 4.5"/></svg>'}
function tabs(){
 return '<nav class="v33-tabs" aria-label="Tipos de estadísticas">'+
  '<button type="button" class="'+(activeTab==='general'?'active':'')+'" data-v33-tab="general">General</button>'+
  '<button type="button" class="'+(activeTab==='team'?'active':'')+'" data-v33-tab="team">Estadísticas de equipo</button>'+
  '<button type="button" class="'+(activeTab==='player'?'active':'')+'" data-v33-tab="player">Estadísticas de jugadores</button>'+
 '</nav>';
}
function header(){
 return '<header class="v33-data-head" data-v33-head>'+
   '<div class="v33-head-actions"><button type="button" data-v33-back aria-label="Volver">'+backIcon()+'</button><button type="button" data-v33-share aria-label="Compartir">'+shareIcon()+'</button></div>'+
   '<div class="v33-morph-title" data-v33-morph-title><h1>Estadísticas</h1><p>Fase final</p></div>'+tabs()+
 '</header>';
}
function standings(){
 return current()?.standings?.[0]?.rows||[];
}
function num(v){
 const n=Number(String(v??'').replace('+',''));
 return Number.isFinite(n)?n:0;
}
function metricRows(index,order='desc',limit=5){
 const rows=standings().slice();
 rows.sort((a,b)=>{
   const av=num(a[index]),bv=num(b[index]);
   return order==='asc'?av-bv:bv-av;
 });
 return rows.slice(0,limit);
}
function metricLabel(index,value){
 const v=String(value??'');
 if(index===8&&num(v)>0)return '+'+num(v);
 return v;
}
function teamMetricRow(r,index,metricIndex){
 return '<button type="button" class="v33-stat-row" data-v33-team="'+esc(r[1])+'">'+
   '<span class="v33-rank">'+(index+1)+'</span>'+teamLogo(r[1])+
   '<span class="v33-row-copy"><b>'+esc(r[1])+'</b><small>Primera Fuerza</small></span>'+
   '<strong>'+esc(metricLabel(metricIndex,r[metricIndex]))+'</strong>'+
 '</button>';
}
function teamStatCard(title,metricIndex,order='desc',limit=5){
 const rs=metricRows(metricIndex,order,limit);
 return '<article class="v33-stat-card"><h3>'+esc(title)+'</h3><div class="v33-stat-list">'+
   rs.map((r,i)=>teamMetricRow(r,i,metricIndex)).join('')+
   '</div><button type="button" class="v33-see-all" data-v33-expand-team="'+metricIndex+'" data-v33-order="'+order+'" aria-expanded="false">Ver todos los equipos <span>›</span></button></article>';
}
function rosterEntries(){
 const out=[];
 for(const [team,names] of Object.entries(current()?.rosters||{})){
   for(const name of (Array.isArray(names)?names:[]))out.push({team,name});
 }
 return out;
}
function playerRow(p,index){
 return '<button type="button" class="v33-stat-row player" data-v33-player="'+esc(p.name)+'" data-v33-player-team="'+esc(p.team)+'">'+
   '<span class="v33-rank">'+(index+1)+'</span>'+playerAvatar(p.name,p.team,'v33-player-team-logo v576-player-avatar')+
   '<span class="v33-row-copy"><b>'+esc(p.name)+'</b><small>'+teamLogo(p.team,'v33-inline-team-logo')+esc(p.team)+' · Jugador registrado</small></span>'+
   '<strong>✓</strong>'+
 '</button>';
}
function playerStatCard(title,players){
 return '<article class="v33-stat-card"><h3>'+esc(title)+'</h3><div class="v33-stat-list">'+
   players.slice(0,5).map((p,i)=>playerRow(p,i)).join('')+
   '</div><button type="button" class="v33-see-all" data-v33-expand-player="'+esc(title)+'" aria-expanded="false">Ver todos los jugadores <span>›</span></button></article>';
}
function teamSections(){
 return [
   ['Datos clave',[
     ['Partidos disputados',2,'desc'],
     ['Ganados',3,'desc']
   ]],
   ['Goles',[
     ['Goles a favor',6,'desc'],
     ['Goles en contra',7,'asc']
   ]],
   ['Resultados',[
     ['Empates',4,'desc'],
     ['Perdidos',5,'asc']
   ]],
   ['Clasificación',[
     ['Diferencia de goles',8,'desc'],
     ['Puntos',9,'desc']
   ]]
 ];
}
function teamDetailedView(){
 /* V593: Estadísticas de equipo usa el mismo carrusel horizontal de General.
    Todas las tablas quedan a un costado, no apiladas hacia abajo. */
 const cards=teamSections().flatMap(section=>section[1]).map(item=>
   teamStatCard(item[0],item[1],item[2])
 ).join('');
 return '<main class="v33-data-content v33-detailed v593-detail-horizontal">'+
   '<section class="v33-general-section v593-detail-section">'+
     '<div class="v33-general-title"><h2>Datos clave</h2></div>'+
     '<div class="v33-carousel v593-detail-carousel">'+cards+'</div>'+
   '</section>'+
 '</main>';
}
function playerSections(){
 const groups=Object.entries(current()?.rosters||{}).map(([team,names])=>({
   team,
   players:(Array.isArray(names)?names:[]).map(name=>({team,name}))
 })).filter(g=>g.players.length);
 const sections=[];
 for(let i=0;i<groups.length;i+=2){
   const a=groups[i],b=groups[i+1];
   sections.push([
     i===0?'Jugadores registrados':'Plantillas oficiales',
     [a,b].filter(Boolean)
   ]);
 }
 return sections;
}
function playerDetailedView(){
 const groups=Object.entries(current()?.rosters||{}).map(([team,names])=>({
   team,
   players:(Array.isArray(names)?names:[]).map(name=>({team,name}))
 })).filter(g=>g.players.length);
 if(!groups.length){
   return '<main class="v33-data-content v33-detailed v593-detail-horizontal"><section class="v33-general-section v593-detail-section"><div class="v33-general-title"><h2>Jugadores registrados</h2></div><div class="v33-carousel v593-detail-carousel"><article class="v33-stat-card"><div class="v33-stat-list"><div class="v33-stat-row"><span class="v33-row-copy"><b>No hay jugadores publicados</b><small>Liga Juventino Rosas no expone una plantilla pública para esta categoría.</small></span></div></div></article></div></section></main>';
 }
 /* V593: las plantillas también comparten el mismo carrusel/tamaño de General. */
 return '<main class="v33-data-content v33-detailed v593-detail-horizontal">'+
   '<section class="v33-general-section v593-detail-section">'+
     '<div class="v33-general-title"><h2>Jugadores registrados</h2></div>'+
     '<div class="v33-carousel v593-detail-carousel">'+
       groups.map(g=>playerStatCard(g.team,g.players)).join('')+
     '</div>'+
   '</section>'+
 '</main>';
}
function generalView(){
 const entries=rosterEntries();
 const firstTeams=Object.entries(current()?.rosters||{}).slice(0,3).map(([team,names])=>({
   team,players:(Array.isArray(names)?names:[]).map(name=>({team,name}))
 }));
 return '<main class="v33-data-content v33-general-content">'+
   '<section class="v33-general-section">'+
     '<div class="v33-general-title"><h2>Estadísticas de equipo</h2><button type="button" data-v33-tab="team">Ver todo</button></div>'+
     '<div class="v33-carousel">'+
       teamStatCard('Goles',6,'desc')+
       teamStatCard('Partidos ganados',3,'desc')+
       teamStatCard('Puntos',9,'desc')+
     '</div>'+
   '</section>'+
   '<section class="v33-general-section">'+
     '<div class="v33-general-title"><h2>Estadísticas de jugadores</h2><button type="button" data-v33-tab="player">Ver todo</button></div>'+
     '<div class="v33-carousel">'+
       firstTeams.map(g=>playerStatCard(g.team,g.players)).join('')+
       (!firstTeams.length?playerStatCard('Jugadores registrados',entries):'')+
     '</div>'+
   '</section>'+
 '</main>';
}
function referenceStatsBlock(){
 const scorers=(current()?.scorers?.[0]?.rows||[]).filter(r=>r?.[1]&&r?.[2]&&/^\d+$/.test(String(r?.[3]||''))).slice(0,3);
 const table=standings().slice(0,12);
 const top=table.slice(0,3);
 const scorerRows=scorers.length?scorers.map((r,i)=>
   '<button type="button" class="v446-stat-ref-row" data-v33-player="'+esc(r[1])+'">'+
     '<span class="v446-stat-ref-rank">'+(i+1)+'</span>'+
     playerAvatar(r[1],r[2],'v446-stat-ref-avatar')+
     teamLogo(r[2],'v446-stat-ref-logo')+
     '<span class="v446-stat-ref-copy"><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small></span>'+
     '<strong>'+esc(r[3])+'</strong>'+
   '</button>'
 ).join(''):'<div class="v446-stat-ref-empty">Sin goleadores oficiales publicados.</div>';
 const teamRows=top.length?top.map((r,i)=>
   '<button type="button" class="v446-stat-ref-row is-team" data-v33-team="'+esc(r[1])+'">'+
     '<span class="v446-stat-ref-rank">'+(i+1)+'</span>'+
     teamLogo(r[1],'v446-stat-ref-mainlogo')+
     '<span class="v446-stat-ref-copy"><b>'+esc(r[1])+'</b><small>PJ '+esc(r[2])+' · DG '+esc(r[8])+'</small></span>'+
     '<strong>'+esc(r[9])+'</strong>'+
   '</button>'
 ).join(''):'<div class="v446-stat-ref-empty">Sin clasificación oficial publicada.</div>';
 const standingsRows=table.length?table.map((r,i)=>
   '<button type="button" class="v509-unified-row" data-v33-team="'+esc(r[1])+'">'+
     '<span class="v509-unified-pos">'+(i+1)+'</span>'+
     '<span class="v509-unified-team">'+teamLogo(r[1],'v509-unified-logo')+'<b>'+esc(r[1])+'</b></span>'+
     '<span>'+esc(r[2])+'</span>'+
     '<span class="'+(num(r[8])>0?'is-positive':num(r[8])<0?'is-negative':'')+'">'+esc(metricLabel(8,r[8]))+'</span>'+
     '<strong>'+esc(r[9])+'</strong>'+
   '</button>'
 ).join(''):'<div class="v446-stat-ref-empty">Sin tabla oficial publicada.</div>';
 return '<section class="v446-stats-reference v509-unified-stats" data-v446-stats-reference>'+
   '<header class="v446-stats-ref-hero v509-unified-hero"><span><small>LIGA MUNICIPAL DE FÚTBOL</small><h2>Temporada 2026/27</h2><b>Primera Fuerza · datos oficiales</b></span><img src="'+SRC+'assets/liga-logo.webp" alt="Liga Juventino Rosas"></header>'+
   '<nav class="v446-stats-ref-tabs v509-unified-tabs"><button type="button" data-v33-route="competition">Partidos</button><button type="button" data-v33-jump-table>Tabla</button><button type="button" class="active">Estadísticas</button></nav>'+
   '<div class="v509-unified-body">'+
     '<div class="v446-stats-ref-tools"><div><button type="button" class="active" data-v33-ref-view="player">Jugador</button><button type="button" data-v33-ref-view="team">Equipo</button></div><button type="button" class="v446-stats-ref-compare" data-v33-route="playerCompare" data-v33-ref-compare>♙ Comparar</button></div>'+
     '<div class="v446-stats-ref-title"><span><small>PRIMERA FUERZA</small><h3>Estadísticas principales</h3></span><button type="button" data-v33-tab="general">Todas las<br>estadísticas</button></div>'+
     '<div data-v33-ref-panel="player">'+
       '<article class="v446-stats-ref-panel"><h4>Goles <span>›</span></h4>'+scorerRows+'</article>'+
       '<article class="v446-stats-ref-panel"><h4>Asistencias <span>›</span></h4><div class="v446-stat-ref-note"><b>Dato no publicado</b><span>La fuente oficial no publica asistencias individuales.</span></div></article>'+
     '</div>'+
     '<div data-v33-ref-panel="team" hidden>'+
       '<article class="v446-stats-ref-panel"><h4>Clasificación <span>›</span></h4>'+teamRows+'</article>'+
       '<article class="v446-stats-ref-panel"><h4>Rendimiento <span>›</span></h4><div class="v446-stat-ref-note"><b>Datos oficiales</b><span>Partidos, diferencia de goles y puntos.</span></div></article>'+
     '</div>'+
     '<section class="v509-unified-table" data-v33-unified-table>'+
       '<div class="v509-unified-table-title"><span><small>TABLA OFICIAL</small><h3>Clasificación</h3></span><b>2026/27</b></div>'+
       '<div class="v509-unified-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>PTS</span></div>'+
       '<div class="v509-unified-list">'+standingsRows+'</div>'+
     '</section>'+
   '</div>'+
 '</section>';
}

function markup(){
 /* V872 — leagueData/Estadísticas vuelve al diseño histórico V33.
    El bloque V446/V509 se había quedado sin su CSS histórico y provocaba
    el logo gigante, fondo negro y botones grises de la captura. */
 return '<section class="v33-data-page" data-v33-data data-v33-mode="'+activeTab+'">'+header()+
   (activeTab==='general'?generalView():activeTab==='team'?teamDetailedView():playerDetailedView())+'</section>';
}
function toast(msg){const old=document.querySelector('.v33-toast');if(old)old.remove();const n=document.createElement('div');n.className='v33-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),1500)}
function setBottomNav(){/* Global nav active state is owned by V34. */}
function share(){const p={title:'Estadísticas Liga Juventino',text:'Datos oficiales de la Liga Municipal de Fútbol Juventino Rosas',url:location.href};if(navigator.share)navigator.share(p).catch(()=>{});else navigator.clipboard?.writeText(location.href).then(()=>toast('Enlace copiado')).catch(()=>{})}
function setTab(tab){
 const next=['general','team','player'].includes(tab)?tab:'general';
 if(activeTab===next){
   (document.body.classList.contains('v768-scroll-root')?document.querySelector('#screen'):window)?.scrollTo({top:0,behavior:'auto'});
   return render();
 }
 activeTab=next;
 localStorage.setItem('v33-data-tab',activeTab);
 const out=render();
 (document.body.classList.contains('v768-scroll-root')?document.querySelector('#screen'):window)?.scrollTo({top:0,behavior:'auto'});
 return out;
}
function setRefView(mode){
 const next=mode==='team'?'team':'player';
 document.querySelectorAll('[data-v33-ref-view]').forEach(x=>x.classList.toggle('active',(x.dataset.v33RefView||'player')===next));
 document.querySelectorAll('[data-v33-ref-panel]').forEach(p=>p.hidden=p.dataset.v33RefPanel!==next);
 const cmp=document.querySelector('[data-v33-ref-compare]');
 if(cmp)cmp.dataset.v33Route=next==='team'?'teams':'playerCompare';
}
function goRoute(r){
 const next=r||'leagueData';
 if(window.LJR_APP_ROUTER?.go)window.LJR_APP_ROUTER.go(next);
 else location.hash='#/'+next;
}
function bind(){
 document.querySelectorAll('[data-v33-expand-team],[data-v33-expand-player]').forEach(b=>b.onclick=()=>{
   const expanded=b.getAttribute('aria-expanded')!=='true';
   const list=b.closest('.v33-stat-card').querySelector('.v33-stat-list');
   if(b.hasAttribute('data-v33-expand-team')){
     const metric=Number(b.dataset.v33ExpandTeam);
     list.innerHTML=metricRows(metric,b.dataset.v33Order,expanded?Infinity:5).map((r,i)=>teamMetricRow(r,i,metric)).join('');
   }else{
     const title=b.dataset.v33ExpandPlayer;
     const players=rosterEntries().filter(p=>!current()?.rosters?.[title]||p.team===title);
     list.innerHTML=players.slice(0,expanded?Infinity:5).map(playerRow).join('');
   }
   b.setAttribute('aria-expanded',String(expanded));
   b.textContent=expanded?'Ver menos':'Ver todos';
   bind();
 });

 document.querySelectorAll('[data-v33-tab]').forEach(b=>b.onclick=e=>{e.preventDefault();setTab(b.dataset.v33Tab)});
 document.querySelectorAll('[data-v33-back]').forEach(b=>b.onclick=e=>{e.preventDefault();if(window.LJR_APP_BACK)window.LJR_APP_BACK();else goRoute('more')});
 document.querySelectorAll('[data-v33-share]').forEach(b=>b.onclick=e=>{e.preventDefault();share()});
 document.querySelectorAll('[data-v33-team]').forEach(b=>b.onclick=()=>{if(window.LJR_OFFICIAL_API?.openTeam)window.LJR_OFFICIAL_API.openTeam(b.dataset.v33Team);else toast(b.dataset.v33Team)});
 document.querySelectorAll('[data-v33-player]').forEach(b=>b.onclick=()=>{if(window.LJR_PLAYER_PROFILE_API?.open)window.LJR_PLAYER_PROFILE_API.open({name:b.dataset.v33Player,cat:'3'});else goRoute('players')});
 document.querySelectorAll('[data-v33-route]').forEach(b=>b.onclick=e=>{e.preventDefault();goRoute(b.dataset.v33Route||'leagueData')});
 document.querySelectorAll('[data-v33-ref-view]').forEach(b=>b.onclick=e=>{e.preventDefault();setRefView(b.dataset.v33RefView||'player')});
 document.querySelectorAll('[data-v33-jump-table]').forEach(b=>b.onclick=e=>{e.preventDefault();document.querySelector('[data-v33-unified-table]')?.scrollIntoView({behavior:'smooth',block:'start'})});
}
function isDataRoute(){const r=route();return r==='stats'||r==='safe-data'||r==='leagueData'}
function applyHeaderScroll(){
 if(!isDataRoute())return;
 const head=document.querySelector('[data-v33-head]');
 const title=head?.querySelector('[data-v33-morph-title]');
 if(!head||!title)return;

 /* Restauración de la animación histórica V36/V37:
    el mismo título sube y se reduce; Fase final se desvanece;
    las tablas siguen desplazándose por debajo de la cabecera. */
 const screenScroller=document.querySelector('#screen');
 const y=Math.max(
   0,
   screenScroller?.scrollTop||0,
   window.scrollY||0,
   document.documentElement.scrollTop||0,
   document.body.scrollTop||0
 );
 const p=Math.min(1,y/165);
 const vw=Math.min(window.innerWidth,520);

 const expandedH=Math.max(184,Math.min(258,vw*0.5012));
 const collapsedH=Math.max(104,Math.min(142,vw*0.2720));
 const expandedLeft=Math.max(20,Math.min(32,vw*0.055));
 const compactLeft=Math.max(92,Math.min(132,vw*0.255));
 const expandedTop=Math.max(98,Math.min(142,vw*0.274));
 const compactTop=Math.max(24,Math.min(36,vw*0.070));
 const expandedSize=Math.max(32,Math.min(44,vw*0.0855));
 const compactSize=Math.max(18,Math.min(25,vw*0.048));
 const lerp=(a,b,t)=>a+(b-a)*t;

 head.style.setProperty('--v33-collapse',p.toFixed(4));
 const actualHeaderHeight=lerp(expandedH,collapsedH,p).toFixed(1)+'px';
 head.style.setProperty('--v33-head-h',actualHeaderHeight);
 // Mantener el inicio del contenido unido al borde inferior real de la cabecera.
 // Antes el padding de página siempre retenía 184–258 px aun tras compactarse.
 head.closest('.v33-data-page')?.style.setProperty('--v33-actual-head-h',actualHeaderHeight);
 head.style.setProperty('--v33-tabs-opacity','1');

 title.style.left=lerp(expandedLeft,compactLeft,p).toFixed(1)+'px';
 title.style.top=lerp(expandedTop,compactTop,p).toFixed(1)+'px';
 const h1=title.querySelector('h1');
 if(h1)h1.style.fontSize=lerp(expandedSize,compactSize,p).toFixed(1)+'px';

 const phase=title.querySelector('p');
 if(phase){
   phase.style.display='';
   phase.style.visibility='';
   phase.style.opacity=Math.max(0,1-(p*1.55)).toFixed(3);
   phase.style.transform='translateY('+(-10*p).toFixed(1)+'px)';
 }

 head.classList.toggle('is-collapsed',p>.82);
}
let tick=0;function onScroll(){if(tick)return;tick=requestAnimationFrame(()=>{tick=0;applyHeaderScroll()})}
window.addEventListener('scroll',onScroll,{passive:true});
document.addEventListener('scroll',onScroll,{passive:true,capture:true});
async function render(){
 const active=isDataRoute();document.body.classList.toggle('v33-data-active',active);if(!active)return;
 await load();if(!db||!isDataRoute())return;
 const screen=document.querySelector('#screen');if(!screen)return;screen.innerHTML=markup();setBottomNav();bind();applyHeaderScroll();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');
if(target){
 target.addEventListener('scroll',onScroll,{passive:true});
 new MutationObserver(()=>{if(isDataRoute()&&!target.querySelector('[data-v33-data]'))schedule()}).observe(target,{childList:true,subtree:false});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
window.LJR_V33_STATS={setTab,setRefView,goRoute,share,render};
})();
