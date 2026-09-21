/* V33 — Datos / Estadísticas con fuente oficial AdminFut.
   Conserva el diseño V33 y elimina métricas/nombres ficticios. */
(function(){
'use strict';
const LOCAL='./public/data/official-live.json?v=20260919-official-integrity1';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260919-official-integrity1';
const SRC='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
let db=window.LJR_OFFICIAL_DATA||null;
let loading=null;
let activeTab=localStorage.getItem('v33-data-tab')||'general';

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
   '</div><button type="button" class="v33-see-all" data-v33-tab="team">Ver todos los equipos <span>›</span></button></article>';
}
function rosterEntries(){
 const out=[];
 for(const [team,names] of Object.entries(current()?.rosters||{})){
   for(const name of (Array.isArray(names)?names:[]))out.push({team,name});
 }
 return out;
}
function playerRow(p,index){
 return '<button type="button" class="v33-stat-row player" data-v33-player="'+esc(p.name)+'">'+
   '<span class="v33-rank">'+(index+1)+'</span>'+teamLogo(p.team,'v33-player-team-logo')+
   '<span class="v33-row-copy"><b>'+esc(p.name)+'</b><small>'+esc(p.team)+' · Jugador registrado</small></span>'+
   '<strong>✓</strong>'+
 '</button>';
}
function playerStatCard(title,players){
 return '<article class="v33-stat-card"><h3>'+esc(title)+'</h3><div class="v33-stat-list">'+
   players.slice(0,5).map((p,i)=>playerRow(p,i)).join('')+
   '</div><button type="button" class="v33-see-all" data-v33-tab="player">Ver todos los jugadores <span>›</span></button></article>';
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
 return '<main class="v33-data-content v33-detailed">'+teamSections().map(section=>
   '<section class="v33-section"><h2>'+esc(section[0])+'</h2><div class="v33-stat-grid">'+
     teamStatCard(section[1][0][0],section[1][0][1],section[1][0][2])+
     teamStatCard(section[1][1][0],section[1][1][1],section[1][1][2])+
   '</div></section>'
 ).join('')+'</main>';
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
 const sections=playerSections();
 if(!sections.length){
   return '<main class="v33-data-content v33-detailed"><section class="v33-section"><h2>Jugadores registrados</h2><div class="v33-stat-grid"><article class="v33-stat-card"><div class="v33-stat-list"><div class="v33-stat-row"><span class="v33-row-copy"><b>No hay jugadores publicados</b><small>AdminFut no expone una plantilla pública para esta categoría.</small></span></div></div></article></div></section></main>';
 }
 return '<main class="v33-data-content v33-detailed">'+sections.map(section=>
   '<section class="v33-section"><h2>'+esc(section[0])+'</h2><div class="v33-stat-grid">'+
     section[1].map(g=>playerStatCard(g.team,g.players)).join('')+
   '</div></section>'
 ).join('')+'</main>';
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
function markup(){
 return '<section class="v33-data-page" data-v33-data data-v33-mode="'+activeTab+'">'+header()+
   (activeTab==='general'?generalView():activeTab==='team'?teamDetailedView():playerDetailedView())+'</section>';
}
function toast(msg){const old=document.querySelector('.v33-toast');if(old)old.remove();const n=document.createElement('div');n.className='v33-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),1500)}
function setBottomNav(){const nav=document.querySelector('.bottom-nav');if(nav)nav.querySelectorAll('.nav-item').forEach(i=>i.classList.toggle('active',i.dataset.route==='more'))}
function share(){const p={title:'Estadísticas Liga Juventino',text:'Datos oficiales de la Liga Municipal de Fútbol Juventino Rosas',url:location.href};if(navigator.share)navigator.share(p).catch(()=>{});else navigator.clipboard?.writeText(location.href).then(()=>toast('Enlace copiado')).catch(()=>{})}
function bind(){
 document.querySelectorAll('[data-v33-tab]').forEach(b=>b.onclick=()=>{activeTab=b.dataset.v33Tab;localStorage.setItem('v33-data-tab',activeTab);render();window.scrollTo(0,0)});
 document.querySelectorAll('[data-v33-back]').forEach(b=>b.onclick=()=>location.hash='#/more');
 document.querySelectorAll('[data-v33-share]').forEach(b=>b.onclick=share);
 document.querySelectorAll('[data-v33-team]').forEach(b=>b.onclick=()=>{if(window.LJR_OFFICIAL_API?.openTeam)window.LJR_OFFICIAL_API.openTeam(b.dataset.v33Team);else toast(b.dataset.v33Team)});
 document.querySelectorAll('[data-v33-player]').forEach(b=>b.onclick=()=>toast(b.dataset.v33Player+' · jugador registrado'));
}
function isDataRoute(){const r=route();return r==='safe-data'||r==='leagueData'}
function applyHeaderScroll(){
 if(!isDataRoute())return;
 const head=document.querySelector('[data-v33-head]'),title=head?.querySelector('[data-v33-morph-title]');if(!head||!title)return;
 const y=Math.max(0,window.scrollY||document.documentElement.scrollTop||0),p=Math.min(1,y/165),vw=Math.min(window.innerWidth,520);
 const lerp=(a,b,t)=>a+(b-a)*t,eh=Math.max(184,Math.min(258,vw*.5012)),ch=Math.max(104,Math.min(142,vw*.272));
 const h=lerp(eh,ch,p);head.style.setProperty('--v33-collapse',p.toFixed(4));head.style.setProperty('--v33-head-h',h.toFixed(1)+'px');
 title.style.left=lerp(Math.max(20,vw*.055),Math.max(92,vw*.255),p).toFixed(1)+'px';
 title.style.top=lerp(Math.max(98,vw*.274),Math.max(24,vw*.070),p).toFixed(1)+'px';
 title.querySelector('h1').style.fontSize=lerp(Math.max(32,vw*.0855),Math.max(18,vw*.048),p).toFixed(1)+'px';
 head.classList.toggle('is-collapsed',p>.82);
}
let tick=0;function onScroll(){if(tick)return;tick=requestAnimationFrame(()=>{tick=0;applyHeaderScroll()})}
window.addEventListener('scroll',onScroll,{passive:true});
async function render(){
 const active=isDataRoute();document.body.classList.toggle('v33-data-active',active);if(!active)return;
 await load();if(!db)return;
 const screen=document.querySelector('#screen');if(!screen)return;screen.innerHTML=markup();setBottomNav();bind();applyHeaderScroll();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');if(target)new MutationObserver(()=>{if(isDataRoute()&&!target.querySelector('[data-v33-data]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();