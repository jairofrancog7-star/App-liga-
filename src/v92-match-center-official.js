/* V92 — Match Center oficial.
   Sustituye el contenido demo de #/v4-matchcenter por el próximo partido real
   de Primera Fuerza publicado por la Liga. No inventa marcador, eventos ni
   estadísticas individuales. */
(function(){
'use strict';
if(window.__LJR_V92_MATCH_CENTER__)return;
window.__LJR_V92_MATCH_CENTER__=true;

const ROUTE='v4-matchcenter';
const LOCAL='./public/data/official-live.json?v=20260920-v92';
const REMOTE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/data/official-live.json?v=20260920-v92';
const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const FALLBACK={
  categories:{
    '3':{
      name:'Primera Fuerza',
      standings:[{rows:[
        ['1','SAN JOSE FC','4','4','0','0','13','3','+10','12'],
        ['2','JUVENTUS','4','3','0','1','20','6','+14','9'],
        ['3','HERMANOS','3','2','1','0','8','4','+4','7'],
        ['4','LINCES','3','2','0','1','10','7','+3','6'],
        ['5','NAPOLI','4','2','0','2','8','7','+1','6'],
        ['6','FRANCO FC','3','2','0','1','3','3','0','6'],
        ['7','HERRERAS FC','4','1','1','2','9','12','-3','4']
      ]}],
      fixtures:[{rows:[
        ['21','5','FRANCO FC','-','vs','-','HERRERAS FC','Romerillo','20/09/2026 08:00','---'],
        ['22','5','TERRICOLAS','-','vs','-','GALACTICOS','','20/09/2026 08:00','---'],
        ['23','5','LINCES','-','vs','-','JUVENTUS','Campo 3','20/09/2026 08:00','---'],
        ['24','5','HERMANOS','-','vs','-','SAN JOSE FC','Campo 3','20/09/2026 10:00','---'],
        ['25','5','LOBOS CDG','-','vs','-','NAPOLI','Cerrito de Gasca','20/09/2026 12:00','---']
      ]}],
      rosters:{
        'FRANCO FC':['Michell Ivan Rendon Rivera','Juan Diego Ramirez Rivera','Nestor Cano Acosta','Edgar Franco Gonzalez','Jese Jason Jabne Sosa Salmeron','Pedro Navarrete Soledad','Cristian Moreno Coyote','Jesus Humberto Cabello Cazares','Efrain Arturo Mosqueda Razo','Luis Antonio Mancera Garcia','Braulio Franco Sanchez'],
        'HERRERAS FC':['FRANCISCO JAVIER HERRERA PIZANO','HUGO ENRIQUE RAMIREZ PATINO','BRIAN VALDES GUERRERO','ROBERTO ARGUELLO ZAVALA','ABRAHAM ISAI RIESTRA PARRA','JESUS ADRIAN TORRE MOSQUEDA','DUVIER DIAZ BALANTA','ELEUTERIO JIMENEZ CONTRERAS','JUAN FERNANDO ARAIZA PACHECO','JUAN DAVID PEREZ GUTIERRZ','ROBERTO CARLOS DOMPABLO GONZALEZ']
      }
    }
  },
  team_logos:{
    'FRANCO FC':{local:'./assets/official-logos/franco-fc.png'},
    'HERRERAS FC':{local:'./assets/official-logos/herreras-fc.png'},
    'LINCES':{local:'./assets/official-logos/linces.png'},
    'JUVENTUS':{local:'./assets/official-logos/juventus.png'},
    'HERMANOS':{local:'./assets/official-logos/hermanos.png'},
    'SAN JOSE FC':{local:'./assets/official-logos/san-jose-fc.png'},
    'LOBOS CDG':{local:'./assets/official-logos/lobos-cdg.png'},
    'NAPOLI':{local:'./assets/official-logos/napoli.png'},
    'TERRICOLAS':{local:'./assets/official-logos/terricolas.png'},
    'GALACTICOS':{local:'./assets/teams/galacticos-pozos.webp'}
  }
};
const PRETTY={
  'FRANCO FC':'Franco FC','HERRERAS FC':'Herreras FC','LINCES':'Linces','JUVENTUS':'Juventus',
  'HERMANOS':'Hermanos','SAN JOSE FC':'San José FC','LOBOS CDG':'Lobos CDG','NAPOLI':'Napoli',
  'TERRICOLAS':'Terrícolas','GALACTICOS':'Galácticos'
};

let db=window.LJR_OFFICIAL_DATA||FALLBACK;
let activeTab='Resumen';
let timer=null;
let loading=null;
let renderGuard=false;

function route(){return location.hash.replace('#/','')||'home'}
function esc(v){return String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function pretty(n){const k=String(n||'').trim().toUpperCase();return PRETTY[k]||String(n||'').trim()}
function cat(){return db?.categories?.['3']||FALLBACK.categories['3']}
function rows(){return cat()?.fixtures?.[0]?.rows||[]}
function standings(){return cat()?.standings?.[0]?.rows||[]}
function roster(name){return Array.isArray(cat()?.rosters?.[name])?cat().rosters[name]:[]}
function mxNowStamp(now=new Date()){
  try{
    const p=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(now);
    const g=t=>Number(p.find(x=>x.type===t)?.value||0);
    return Date.UTC(g('year'),g('month')-1,g('day'),g('hour'),g('minute'),g('second'));
  }catch(_){return now.getTime()}
}
function fixtureStamp(v){
  const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);
  return m?Date.UTC(+m[3],+m[2]-1,+m[1],+m[4],+m[5],0):NaN;
}
function clock(v){return String(v||'').match(/\s(\d{1,2}:\d{2})/)?.[1]||'Por confirmar'}
function dateOnly(v){return String(v||'').match(/^(\d{1,2}\/\d{1,2}\/\d{4})/)?.[1]||''}
function liveState(start,now=mxNowStamp()){
  const e=(now-start)/60000;
  if(!Number.isFinite(e)||e<0)return {kind:'scheduled',label:'PROGRAMADO',minute:'',center:''};
  if(e<45)return {kind:'live',label:'PARTIDO EN VIVO',minute:'1T · '+Math.max(1,Math.floor(e)+1)+"'",center:'EN VIVO'};
  if(e<60)return {kind:'live',label:'PARTIDO EN VIVO',minute:'DESCANSO',center:'DESCANSO'};
  if(e<105)return {kind:'live',label:'PARTIDO EN VIVO',minute:'2T · '+Math.min(90,45+Math.floor(e-60)+1)+"'",center:'EN VIVO'};
  if(e<120)return {kind:'live',label:'PARTIDO EN VIVO',minute:"2T · 90+"+Math.max(1,Math.floor(e-105)+1)+"'",center:'EN VIVO'};
  return {kind:'ended',label:'PARTIDO FINALIZADO',minute:'Final',center:'FINAL'};
}
function selectedFixture(){
  const now=mxNowStamp();
  const list=rows().map(r=>({r,start:fixtureStamp(r?.[8])})).filter(x=>Number.isFinite(x.start)&&x.r?.[2]&&x.r?.[6]);
  const live=list.filter(x=>liveState(x.start,now).kind==='live').sort((a,b)=>a.start-b.start);
  if(live.length)return live[0];
  const future=list.filter(x=>x.start>now).sort((a,b)=>a.start-b.start);
  if(future.length)return future[0];
  return list.sort((a,b)=>b.start-a.start)[0]||{r:FALLBACK.categories['3'].fixtures[0].rows[0],start:fixtureStamp('20/09/2026 08:00')};
}
function logoUrl(name){
  const global=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name);
  if(global)return global;
  const entry=Object.entries(db?.team_logos||{}).find(([k])=>String(k).trim().toUpperCase()===String(name||'').trim().toUpperCase())?.[1];
  const p=typeof entry==='string'?entry:(entry?.local||entry?.source||'');
  if(!p)return BASE+'assets/liga-logo.webp';
  return /^https?:/i.test(p)?p:BASE+p.replace(/^\.\//,'');
}
function teamLogo(name,cls=''){return '<span class="v92-team-logo '+cls+'"><img src="'+esc(logoUrl(name))+'" alt="'+esc(pretty(name))+'" loading="eager" decoding="async"></span>'}
function standing(name){return standings().find(r=>String(r?.[1]||'').trim().toUpperCase()===String(name||'').trim().toUpperCase())||null}
function officialScore(r,state){
  const h=String(r?.[3]??''),a=String(r?.[5]??''),valid=/^\d+$/.test(h)&&/^\d+$/.test(a);
  if(valid)return h+'–'+a;
  if(state.kind==='live')return 'EN VIVO';
  return 'VS';
}
function playerCard(name,team){
  return '<div class="v92-player-card">'+teamLogo(team,'small')+'<span><b>'+esc(name||'Jugador registrado')+'</b><small>'+esc(pretty(team))+' · Jugador registrado</small></span></div>';
}
function registeredPlayers(home,away){
  const a=roster(home)[0]||'',b=roster(away)[0]||'';
  return '<section class="v92-section"><div class="v92-section-head"><h2>Jugadores registrados</h2><small>Figura oficial pendiente de publicación</small></div><div class="v92-player-grid">'+
    playerCard(a,home)+playerCard(b,away)+'</div></section>';
}
function rosterColumn(team){
  const names=roster(team).slice(0,11);
  return '<article class="v92-roster"><div class="v92-roster-title">'+teamLogo(team,'tiny')+'<span><b>'+esc(pretty(team))+'</b><small>Registro oficial · no alineación confirmada</small></span></div>'+
    (names.length?'<ol>'+names.map(n=>'<li>'+esc(n)+'</li>').join('')+'</ol>':'<p>No hay plantilla publicada.</p>')+'</article>';
}
function summaryBody(m,state){
  const r=m.r,home=r[2],away=r[6],venue=r[7]||'Campo por confirmar';
  const statusValue=state.kind==='scheduled'?clock(r[8]):state.minute;
  return '<div class="v92-summary-grid">'+
      '<div><b>'+esc(officialScore(r,state))+'</b><small>'+ (state.kind==='scheduled'?'Estado':'Marcador') +'</small></div>'+
      '<div><b>'+esc(statusValue)+'</b><small>'+(state.kind==='scheduled'?'Horario':'Minuto estimado')+'</small></div>'+
      '<div><b>'+esc(venue)+'</b><small>Sede</small></div>'+
    '</div>'+
    registeredPlayers(home,away)+
    '<section class="v92-section"><div class="v92-section-head"><h2>Acciones rápidas</h2></div><div class="v92-actions">'+
      '<button data-v92-route="competition">Partidos</button><button data-v92-route="v4-calendar">Calendario</button><button data-v92-route="stats">Estadísticas</button><button data-v92-route="v4-notifications">Alertas</button>'+
    '</div></section>';
}
function lineupsBody(m){
  const r=m.r;return '<section class="v92-section"><div class="v92-section-head"><h2>Plantillas registradas</h2><small>Las alineaciones se mostrarán solo si la Liga las publica.</small></div><div class="v92-roster-grid">'+rosterColumn(r[2])+rosterColumn(r[6])+'</div></section>';
}
function statsBody(m){
  const r=m.r,h=standing(r[2]),a=standing(r[6]);
  const row=(label,idx)=>'<div class="v92-stat-row"><b>'+esc(h?.[idx]??'—')+'</b><span>'+label+'</span><b>'+esc(a?.[idx]??'—')+'</b></div>';
  return '<section class="v92-section"><div class="v92-section-head"><h2>Datos oficiales de temporada</h2><small>No se inventan posesión, tiros ni asistencias del partido.</small></div><div class="v92-stat-head"><span>'+teamLogo(r[2],'tiny')+esc(pretty(r[2]))+'</span><span>'+teamLogo(r[6],'tiny')+esc(pretty(r[6]))+'</span></div><div class="v92-stat-table">'+
    row('Partidos',2)+row('Goles a favor',6)+row('Diferencia',8)+row('Puntos',9)+'</div></section>';
}
function timelineBody(m,state){
  const r=m.r;
  let lines='';
  if(state.kind==='scheduled'){
    lines='<div><b>'+esc(clock(r[8]))+'</b><span>Inicio programado · '+esc(dateOnly(r[8]))+'</span></div>';
  }else if(state.kind==='live'){
    lines='<div><b>'+esc(state.minute)+'</b><span>Partido en curso · minuto estimado por horario oficial</span></div><div><b>—</b><span>Sin feed oficial de goles/eventos en tiempo real.</span></div>';
  }else{
    lines='<div><b>Final</b><span>Partido finalizado según la ventana horaria.</span></div><div><b>—</b><span>Los eventos se mostrarán cuando la Liga los publique.</span></div>';
  }
  return '<section class="v92-section"><div class="v92-section-head"><h2>Cronología</h2><small>Solo información verificable.</small></div><div class="v92-timeline">'+lines+'</div></section>';
}
function bodyFor(tab,m,state){
  if(tab==='Alineaciones')return lineupsBody(m);
  if(tab==='Estadísticas')return statsBody(m);
  if(tab==='Cronología')return timelineBody(m,state);
  return summaryBody(m,state);
}
function render(){
  if(route()!==ROUTE)return;
  const screen=document.querySelector('#screen');if(!screen||renderGuard)return;
  renderGuard=true;
  const m=selectedFixture(),r=m.r,state=liveState(m.start),home=r[2],away=r[6],venue=r[7]||'Campo por confirmar';
  const center=state.kind==='scheduled'?clock(r[8]):officialScore(r,state);
  screen.innerHTML='<article class="v92-matchcenter" data-v92-matchcenter>'+
    '<header class="v92-match-head"><div class="v92-kicker">'+esc(state.label)+'</div><h1>Match Center</h1><p>'+esc(pretty(home))+' vs '+esc(pretty(away))+' · '+esc(cat()?.name||'Primera Fuerza')+' · Jornada '+esc(r[1]||'')+'</p></header>'+
    '<section class="v92-score-card">'+
      '<div class="v92-side">'+teamLogo(home)+'<b>'+esc(pretty(home))+'</b></div>'+
      '<div class="v92-center"><strong>'+esc(center)+'</strong><small>'+esc(state.kind==='scheduled'?dateOnly(r[8]):state.minute)+'</small></div>'+
      '<div class="v92-side">'+teamLogo(away)+'<b>'+esc(pretty(away))+'</b></div>'+
    '</section>'+
    '<nav class="v92-tabs" aria-label="Opciones del Match Center">'+['Resumen','Alineaciones','Estadísticas','Cronología'].map(t=>'<button type="button" class="'+(activeTab===t?'active':'')+'" data-v92-tab="'+t+'">'+t+'</button>').join('')+'</nav>'+
    '<main class="v92-body">'+bodyFor(activeTab,m,state)+'</main>'+
    '<p class="v92-source">Partido real de la programación oficial · '+esc(dateOnly(r[8]))+' · '+esc(venue)+'</p>'+
  '</article>';

  document.body.classList.add('v92-match-center-official');
  document.querySelectorAll('.bottom-nav .nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='competition'));
  screen.querySelectorAll('[data-v92-tab]').forEach(b=>b.onclick=()=>{activeTab=b.dataset.v92Tab;renderGuard=false;render()});
  screen.querySelectorAll('[data-v92-route]').forEach(b=>b.onclick=()=>{location.hash='#/'+b.dataset.v92Route});
  renderGuard=false;
}
async function load(){
  if(loading)return loading;
  loading=(async()=>{
    for(const u of [LOCAL,REMOTE]){
      try{const res=await fetch(u,{cache:'no-store'});if(res.ok){db=await res.json();break}}catch(_){}
    }
    if(route()===ROUTE)render();
    return db;
  })();
  return loading;
}
function syncRoute(){
  const on=route()===ROUTE;
  document.body.classList.toggle('v92-match-center-official',on);
  if(!on)return;
  render();
  load();
  if(!timer)timer=setInterval(()=>{if(route()===ROUTE)render()},30000);
}
window.addEventListener('hashchange',()=>requestAnimationFrame(syncRoute));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>{if(route()===ROUTE&&!screen.querySelector('[data-v92-matchcenter]'))requestAnimationFrame(render)}).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',syncRoute,{once:true});else syncRoute();
})();
