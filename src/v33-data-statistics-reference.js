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
  '<button type="button" class="'+(activeTab==='player'?'active':'')+'" data-v33-tab="player">Jugadores registrados</button>'+
 '</nav>';
}
function header(){
 return '<header class="v33-data-head" data-v33-head>'+
   '<div class="v33-head-actions"><button type="button" data-v33-back aria-label="Volver">'+backIcon()+'</button><button type="button" data-v33-share aria-label="Compartir">'+shareIcon()+'</button></div>'+
   '<div class="v33-morph-title" data-v33-morph-title><h1>Estadísticas</h1><p>Datos oficiales · Primera Fuerza</p></div>'+tabs()+
 '</header>';
}
function summaryCard(title,value,sub){
 return '<article class="v33-stat-card"><h3>'+esc(title)+'</h3><div class="v33-stat-list"><div class="v33-stat-row"><span class="v33-rank">•</span><span class="v33-row-copy"><b>'+esc(value)+'</b><small>'+esc(sub)+'</small></span></div></div></article>';
}
function standingsRows(limit=11){
 const rows=current()?.standings?.[0]?.rows||[];
 return rows.slice(0,limit).map(r=>'<div class="v33-stat-row" data-v33-team="'+esc(r[1])+'">'+
   '<span class="v33-rank">#'+esc(r[0])+'</span>'+teamLogo(r[1])+
   '<span class="v33-row-copy"><b>'+esc(r[1])+'</b><small>'+esc(r[2])+' PJ · DG '+esc(r[8])+'</small></span>'+
   '<strong>'+esc(r[9])+' pts</strong></div>').join('');
}
function generalView(){
 const c=current(),co=c?.counts||{};
 return '<main class="v33-data-content v33-general-content">'+
   '<section class="v33-general-section"><div class="v33-general-title"><h2>Datos clave</h2><button type="button" data-v33-tab="team">Ver tabla</button></div>'+
   '<div class="v33-carousel">'+
     summaryCard('Equipos',co.Equipos??0,'registrados en Primera Fuerza')+
     summaryCard('Jugadores',co.Jugadores??0,'registrados públicamente')+
     summaryCard('Partidos jugados',co['Partidos Jugados']??0,'dato oficial actual')+
     summaryCard('Partidos pendientes',co['Partidos Pendientes']??0,'dato oficial actual')+
   '</div></section>'+
   '<section class="v33-general-section"><div class="v33-general-title"><h2>Clasificación actual</h2><button type="button" data-v33-tab="team">Ver todo</button></div>'+
   '<article class="v33-stat-card"><div class="v33-stat-list">'+standingsRows(5)+'</div></article></section>'+
   '<section class="v33-general-section"><div class="v33-general-title"><h2>Goleo de Primera Fuerza</h2></div>'+
   '<article class="v33-stat-card"><div class="v33-stat-list"><div class="v33-stat-row"><span class="v33-row-copy"><b>No publicado</b><small>AdminFut indica que no hay goles registrados en esta temporada de Primera Fuerza.</small></span></div></div></article></section>'+
 '</main>';
}
function teamView(){
 return '<main class="v33-data-content v33-detailed"><section class="v33-section"><h2>Clasificación oficial · Primera Fuerza</h2>'+
   '<div class="v33-stat-grid"><article class="v33-stat-card"><div class="v33-stat-list">'+standingsRows(50)+'</div></article></div></section></main>';
}
function playerRows(){
 const c=current(),out=[];
 for(const [team,names] of Object.entries(c?.rosters||{})){
   for(const n of (Array.isArray(names)?names:[])){
     out.push('<div class="v33-stat-row" data-v33-player="'+esc(n)+'">'+teamLogo(team)+
       '<span class="v33-row-copy"><b>'+esc(n)+'</b><small>'+esc(team)+' · Jugador registrado</small></span></div>');
   }
 }
 return out.join('');
}
function playerView(){
 return '<main class="v33-data-content v33-detailed"><section class="v33-section"><h2>Jugadores registrados · Primera Fuerza</h2>'+
   '<div class="v33-stat-grid"><article class="v33-stat-card"><div class="v33-stat-list">'+playerRows()+'</div></article></div>'+
   '<p class="v33-see-all">No se muestran goles, asistencias, minutos o posiciones si AdminFut no los publica.</p></section></main>';
}
function markup(){
 return '<section class="v33-data-page" data-v33-data data-v33-mode="'+activeTab+'">'+header()+
   (activeTab==='general'?generalView():activeTab==='team'?teamView():playerView())+'</section>';
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
function applyHeaderScroll(){
 if(route()!=='safe-data')return;
 const head=document.querySelector('[data-v33-head]'),title=head?.querySelector('[data-v33-morph-title]');if(!head||!title)return;
 const y=Math.max(0,window.scrollY||document.documentElement.scrollTop||0),p=Math.min(1,y/165),vw=Math.min(window.innerWidth,520);
 const lerp=(a,b,t)=>a+(b-a)*t,eh=Math.max(184,Math.min(258,vw*.5012)),ch=Math.max(104,Math.min(142,vw*.272));
 const h=lerp(eh,ch,p),page=document.querySelector('[data-v33-data]');head.style.setProperty('--v33-collapse',p.toFixed(4));head.style.setProperty('--v33-head-h',h.toFixed(1)+'px');
 if(page)page.style.setProperty('padding-top',h.toFixed(1)+'px','important');
 title.style.left=lerp(Math.max(20,vw*.055),Math.max(92,vw*.255),p).toFixed(1)+'px';
 title.style.top=lerp(Math.max(98,vw*.274),Math.max(24,vw*.070),p).toFixed(1)+'px';
 title.querySelector('h1').style.fontSize=lerp(Math.max(32,vw*.0855),Math.max(18,vw*.048),p).toFixed(1)+'px';
 head.classList.toggle('is-collapsed',p>.82);
}
let tick=0;function onScroll(){if(tick)return;tick=requestAnimationFrame(()=>{tick=0;applyHeaderScroll()})}
window.addEventListener('scroll',onScroll,{passive:true});
async function render(){
 const active=route()==='safe-data';document.body.classList.toggle('v33-data-active',active);if(!active)return;
 await load();if(!db)return;
 const screen=document.querySelector('#screen');if(!screen)return;screen.innerHTML=markup();setBottomNav();bind();applyHeaderScroll();
}
function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
window.addEventListener('hashchange',schedule);
const target=document.querySelector('#screen');if(target)new MutationObserver(()=>{if(route()==='safe-data'&&!target.querySelector('[data-v33-data]'))schedule()}).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();