/* V105 — Lleva los cuadros/funciones de Liga_Futbol (verde) a App-liga (azul).
   Principio estricto: TODO se anexa al FINAL de la pantalla correspondiente.
   Nunca inserta arriba ni en medio; no sustituye contenido existente. */
(function(){
'use strict';
if(window.__LJR_V105_GREEN_BOTTOM__)return;
window.__LJR_V105_GREEN_BOTTOM__=true;

const BUILD='20261001-teams-button-fix-v190';
const GREEN='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const MOTION=GREEN+'assets/motion/';
const MEDIA=GREEN+'media/';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9+]+/g,' ').trim();
const route=()=>location.hash.replace(/^#\//,'').split('?')[0]||'home';
const read=(k,d)=>{try{const x=JSON.parse(localStorage.getItem(k));return x??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const reduced=matchMedia?.('(prefers-reduced-motion: reduce)')?.matches||false;
const saveData=!!(navigator.connection&&navigator.connection.saveData);

function icon(name){
 const p={
  home:'<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',
  match:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  table:'<path d="M4 5h16v14H4zM4 10h16M9 5v14M15 5v14"/>',
  stats:'<path d="M5 19V9m7 10V5m7 14v-7"/>',
  team:'<path d="M7 21v-2a5 5 0 0 1 10 0v2M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"/>',
  users:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2"/><path d="M3 20a6 6 0 0 1 12 0m1-5a4 4 0 0 1 5 4"/>',
  trophy:'<path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6V4Zm0 2H4v2c0 2 1 4 4 4m8-6h4v2c0 2-1 4-4 4m-4 2v4m-4 3h8"/>',
  video:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m10 9 5 3-5 3Z"/>',
  history:'<path d="M4 12a8 8 0 1 0 2-5.5L4 8m0-5v5h5"/><path d="M12 8v5l3 2"/>',
  bell:'<path d="M6 16h12l-1.5-2V9a4.5 4.5 0 0 0-9 0v5L6 16Zm4 3h4"/>',
  fire:'<path d="M12 22c4 0 7-3 7-7 0-5-4-8-5-12-3 2-2 6-5 8-1-2-2-3-2-5-2 2-3 5-3 8 0 5 3 8 8 8Z"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  card:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M12 9h6M12 12h6M6 16h12"/>',
  timer:'<circle cx="12" cy="13" r="8"/><path d="M9 2h6m-3 3v3m0 5 3-2"/>',
  admin:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
  tactics:'<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M12 4v16"/><circle cx="12" cy="12" r="3"/><path d="M7 8h2m6 8h2"/>',
  sim:'<path d="M4 19h16M6 16l3-4 3 2 5-8"/><path d="M15 6h3v3"/>',
  news:'<path d="M4 5h14v14H4zM7 8h8M7 12h8M7 16h5"/><path d="M18 8h2v11h-2"/>',
  rule:'<path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4"/>',
  shield:'<path d="M12 3 20 6v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-4"/>',
  upload:'<path d="M12 16V4m-4 4 4-4 4 4"/><path d="M5 15v5h14v-5"/>',
  download:'<path d="M12 4v12m-4-4 4 4 4-4"/><path d="M5 19h14"/>',
  ref:'<path d="M8 3h8l2 4-6 14L6 7l2-4Z"/><path d="M8 7h10"/>',
  field:'<rect x="3" y="5" width="18" height="14"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3"/>',
  poll:'<path d="M5 19V9m7 10V5m7 14v-6"/>',
  sponsor:'<path d="M4 7h16v10H4zM7 10h10m-8 4h6"/>',
  save:'<path d="M5 3h12l4 4v14H3V3h2Zm2 0v7h10V3M7 21v-8h10v8"/>',
  copy:'<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  clear:'<path d="M4 7h16M9 7V4h6v3m3 0-1 14H7L6 7m4 4v6m4-6v6"/>',
  edit:'<path d="M12 20h9M4 20l4.2-1 11-11a2.8 2.8 0 0 0-4-4l-11 11L4 20Z"/>',
  alert:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
  share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>'
 };
 return window.LJR_ICONS?.decorate('<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.home)+'</svg>',name) || '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.home)+'</svg>';
}
function card(c){
 const nav=c.route?'data-v105-route="'+esc(c.route)+'"':'data-v105-action="'+esc(c.action)+'"';
 const tab=c.tab?' data-v105-history-tab="'+esc(c.tab)+'"':'';
 return '<button type="button" class="v105-card" '+nav+tab+'>'+
   '<span class="v105-icon">'+icon(c.icon)+'</span><span class="v105-copy"><b>'+esc(c.title)+'</b><small>'+esc(c.sub)+'</small></span><span class="v105-arrow">›</span></button>';
}
function head(k,t,d){return '<header class="v105-head"><small>'+esc(k)+'</small><h2>'+esc(t)+'</h2><p>'+esc(d)+'</p></header>'}
function motion(asset,k,t,d){
 return '<div class="v105-motion">'+(!reduced&&!saveData?'<video src="'+MOTION+asset+'" muted loop playsinline preload="metadata" data-v105-motion></video>':'')+
   '<div class="v105-motion-copy"><small>'+esc(k)+'</small><b>'+esc(t)+'</b><span>'+esc(d)+'</span></div></div>';
}
function log(action){
 const list=read('v105-activity',[]);list.unshift({action,at:new Date().toISOString()});write('v105-activity',list.slice(0,50));
}
function openCompetitionFixtures(){
 const screen=document.querySelector('#screen');
 if(!screen)return;
 const tabs=screen.querySelector(':scope > .tabs')||screen.querySelector('.tabs');
 const btn=tabs?[...tabs.querySelectorAll('.tab')].find(x=>/Partidos/i.test(x.textContent||''))||tabs.querySelector('.tab'):null;
 if(btn&&!btn.classList.contains('active'))btn.click();
 setTimeout(()=>{
   const target=screen.querySelector('[data-v12-fixtures]')||tabs||screen;
   target?.scrollIntoView({behavior:'smooth',block:'start'});
 },140);
}
function openCompetitionStandings(){
 try{
   localStorage.setItem('competitionTab','standings');
   localStorage.setItem('v40-competition-tab','standings');
 }catch(_){}
 if(window.LJR_MAIN_ROUTE?.state)window.LJR_MAIN_ROUTE.state.competitionTab='standings';
 const fire=()=>{
   const tabs=document.querySelector('#screen > .tabs')||document.querySelector('#screen .tabs');
   const btn=tabs?[...tabs.querySelectorAll('.tab,[data-comp-tab]')].find(x=>
     x.dataset?.compTab==='standings'||/Clasificaci|Posiciones/i.test(x.textContent||'')
   ):null;
   if(btn){
     btn.click();
     setTimeout(()=>{
       const target=document.querySelector('#screen [data-v40-standings],#screen [data-v12-standings],#screen .v40-standings')||tabs;
       target?.scrollIntoView({behavior:'smooth',block:'start'});
     },120);
     return true;
   }
   return false;
 };
 if(route()!=='competition'){
   location.hash='#/competition';
   [120,320,700].forEach(ms=>setTimeout(fire,ms));
   return;
 }
 if(!fire()){
   [120,320,700].forEach(ms=>setTimeout(fire,ms));
 }
}
function openBracketBuilder(){
 const screen=document.querySelector('#screen');
 if(!screen)return;
 const host=screen.querySelector('.v60-tool-page.v64-page')||screen.querySelector('[data-v64-place]')?.closest('.v60-tool-page')||screen;
 const first=host.querySelector('[data-v64-place]');
 try{host.scrollIntoView({behavior:'smooth',block:'start'})}catch(_){window.scrollTo({top:0,behavior:'smooth'})}
 setTimeout(()=>{
   try{first?.focus({preventScroll:true})}catch(_){first?.focus?.()}
   host.classList.add('v105-bracket-target');
   setTimeout(()=>host.classList.remove('v105-bracket-target'),900);
 },180);
}
function openTeamsDirectory(){
 const screen=document.querySelector('#screen');
 if(!screen)return false;
 const page=screen.querySelector('[data-v27-reference="teams"]')||
            screen.querySelector('[data-v41-teams]')||
            screen.querySelector('[data-v27-teams-mount]')||
            screen;
 try{page.scrollIntoView({behavior:'smooth',block:'start'})}
 catch(_){try{window.scrollTo({top:0,behavior:'smooth'})}catch(__){window.scrollTo(0,0)}}
 const search=screen.querySelector('#v27TeamSearch,#v41TeamSearch,[data-v66-team-search]');
 if(search){
   setTimeout(()=>{try{search.focus({preventScroll:true})}catch(_){search.focus?.()}},220);
 }
 return true;
}
function openHistoryTab(tab){
 const fire=()=>{
   if(route()!=='history')return false;
   const wanted=norm(tab);
   const btn=[...document.querySelectorAll('[data-v35-tab],[data-history-tab]')].find(x=>norm(x.textContent).includes(wanted));
   try{
     if(window.LJR_HISTORY_FAST_TAB){window.LJR_HISTORY_FAST_TAB(tab);return true}
   }catch(_){}
   if(btn){btn.click();return true}
   return false;
 };
 try{sessionStorage.setItem('v105-history-tab',tab)}catch(_){}
 if(route()!=='history')location.hash='#/history';
 requestAnimationFrame(()=>requestAnimationFrame(()=>{if(fire())try{sessionStorage.removeItem('v105-history-tab')}catch(_){}}));
 setTimeout(()=>{if(fire())try{sessionStorage.removeItem('v105-history-tab')}catch(_){}},160);
 setTimeout(()=>{if(fire())try{sessionStorage.removeItem('v105-history-tab')}catch(_){}},420);
}
function go(r){
 if(!r)return;
 log('Abrir '+r);

 /* V190 — Equipos / Directorio de clubes responde también si ya estamos en #/teams. */
 if(r==='teams'){
   const current=route();
   if(current==='teams'){
     if(!openTeamsDirectory()){
       try{window.dispatchEvent(new Event('hashchange'))}catch(_){}
       setTimeout(openTeamsDirectory,160);
     }
     return;
   }
 }

 if(r==='bracketBuilder'){
   const current=route();
   if(current==='bracketBuilder'){
     openBracketBuilder();
     return;
   }
   try{sessionStorage.setItem('v105-open-bracket-builder','1')}catch(_){}
 }

 if(r==='competition'){
   const current=route();
   try{sessionStorage.setItem('v105-open-competition-fixtures','1')}catch(_){}
   if(current==='competition'){
     openCompetitionFixtures();
     try{sessionStorage.removeItem('v105-open-competition-fixtures')}catch(_){}
     return;
   }
 }

 // V128: el botón Goleadores debe llevar al ranking de jugadores, incluso
 // cuando ya estamos dentro de #/scorers y el hash no cambia.
 if(r==='scorers'){
   const current=route();
   if(current==='scorers'){
     const target=document.querySelector('[data-v28-scorers] .v28-ranking')||
                  document.querySelector('[data-v28-scorers]');
     if(target){
       target.scrollIntoView({behavior:'smooth',block:'start'});
       return;
     }
   }
   try{sessionStorage.setItem('v105-open-official-scorers','1')}catch(_){}
 }

 location.hash='#/'+r;
}
function officialTeams(){
 try{const l=window.V66_OFFICIAL_DIRECTORY?.teamList?.();if(Array.isArray(l)&&l.length)return l.map(x=>({name:x.name,category:x.category||'',cat:String(x.cat||'')}))}catch(_){}
 const out=[],db=window.LJR_OFFICIAL_DATA||{};
 Object.entries(db.categories||{}).forEach(([id,c])=>{
   const names=new Set();(c.standings||[]).forEach(b=>(b.rows||[]).forEach(r=>r?.[1]&&names.add(String(r[1]).trim())));Object.keys(c.rosters||{}).forEach(n=>names.add(n));
   names.forEach(n=>out.push({name:n,category:c.name||'',cat:id}));
 });
 return out;
}
function officialPlayers(){
 try{const l=window.V66_OFFICIAL_DIRECTORY?.playerList?.();if(Array.isArray(l)&&l.length)return l}catch(_){}
 const out=[],db=window.LJR_OFFICIAL_DATA||{};Object.entries(db.categories||{}).forEach(([id,c])=>Object.entries(c.rosters||{}).forEach(([team,names])=>(names||[]).forEach(name=>out.push({name,team,cat:id,category:c.name||''}))));return out;
}
function modal(title,desc,body){
 let old=$('.v105-modal');if(old)old.remove();
 const m=document.createElement('div');m.className='v105-modal';
 if(['Calendarios oficiales','Auditoría de herramientas','Importar CSV','Incidencias del partido','Árbitros y oficiales','Delegados','Juntas y acuerdos','Encuesta'].includes(title))m.classList.add('v1107-admin-modal');
 m.innerHTML='<section class="v105-dialog" role="dialog" aria-modal="true"><button class="v105-close" aria-label="Cerrar">×</button><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p>'+body+'</section>';document.body.appendChild(m);
 $('.v105-close',m).onclick=()=>m.remove();m.onclick=e=>{if(e.target===m)m.remove()};return m;
}
function dl(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}
function toast(msg){const t=document.createElement('div');t.className='v100-toast';t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),1900)}

/* ===== Bloques por pantalla ===== */
const HOME_CARDS=[
 {icon:'field',title:'Clima inteligente del partido',sub:'Clima, terreno y decisión oficial',route:'weatherFields'},
 {icon:'bell',title:'Registrarse y recibir avisos',sub:'Categoría y equipo favorito',action:'register-alerts'},
 {icon:'calendar',title:'Programar partido',sub:'Borrador local · fecha, hora y cancha',action:'schedule-match'},
 {icon:'shield',title:'Nueva sanción',sub:'Borrador disciplinario local',action:'new-sanction'},
 {icon:'admin',title:'Herramientas de la Liga',sub:'Credenciales, jornadas, cédulas y control',route:'leagueTools'},
 {icon:'video',title:'Modo TV',sub:'Partido, tabla y datos oficiales en pantalla',route:'televisados'},
 {icon:'match',title:'Partidos de hoy',sub:'Jornada y resultados',route:'competition'},
 {icon:'table',title:'Tabla · Primera Fuerza',sub:'Clasificación oficial',route:'leagueData'},
 {icon:'stats',title:'Top goleadores',sub:'Goleo y rendimiento',route:'scorers'},
 {icon:'news',title:'Lo importante de la semana',sub:'Avisos y novedades',route:'v38Weekly'},
 {icon:'alert',title:'Cambios de horario y sedes',sub:'Reprograma y crea aviso para compartir',route:'scheduleChanges'},
 {icon:'calendar',title:'Junta semanal de liga · martes',sub:'Todos los martes · asistencia, orden del día y acuerdos',action:'meeting'},
 {icon:'video',title:'Semifinales, finales y momentos',sub:'Galería recuperada',route:'moments'},
 {icon:'history',title:'Historia',sub:'Temporadas, campeones, finales y archivo histórico',route:'history'},
 {icon:'match',title:'Match Center real',sub:'Partido oficial, marcador y contexto',route:'v4-matchcenter'},
 {icon:'tactics',title:'Tácticas 2D / 3D',sub:'Pizarra azul interactiva',route:'tactics'},
 {icon:'trophy',title:'Copa + escenarios',sub:'Liguilla y simulación',route:'bracketBuilder'},
 {icon:'fire',title:'Pulso de afición',sub:'1 reacción por visitante o perfil',action:'fanzone'},
 {icon:'poll',title:'Pronóstico y encuesta',sub:'Participa con tu liga',action:'poll'}
];
const COMP_CARDS=[
 {icon:'match',title:'Partidos y jornadas',sub:'Todos, próximos y resultados',route:'competition'},
 {icon:'calendar',title:'Calendario mensual',sub:'Jornadas por fecha',route:'v4-calendar'},
 {icon:'table',title:'Tabla de posiciones',sub:'Datos oficiales',action:'open-standings'},
 {icon:'stats',title:'Goleo y rendimiento',sub:'Estadísticas de Liga',route:'stats'},
 {icon:'stats',title:'Goleadores',sub:'Ranking oficial',route:'scorers'},
 {icon:'trophy',title:'Bracket eliminatorio',sub:'Cuartos, semifinal y final',route:'bracketBuilder'},
 {icon:'sim',title:'Simular jornada',sub:'Escenario hipotético local',route:'simulator'},
 {icon:'calendar',title:'Calendarios oficiales',sub:'Cruces reales · PDF / imagen',action:'calendar-generator'},
 {icon:'download',title:'Descargar tabla / PNG',sub:'Exportación para compartir',route:'tableExport'},
 {icon:'share',title:'Publicaciones de jornada',sub:'Texto e imagen para compartir',route:'publications'},
 {icon:'field',title:'Campos y sedes',sub:'Ubicación y clima',route:'venues'},
 {icon:'alert',title:'Disciplina y sanciones',sub:'Tarjetas y castigados oficiales',route:'discipline'}
];
const TEAM_CARDS=[
 {icon:'team',title:'Equipos',sub:'Directorio de clubes',route:'teams'},
 {icon:'users',title:'Jugadores',sub:'Plantillas registradas',route:'players'},
 {icon:'tactics',title:'Alineaciones',sub:'Pizarra y formación',route:'tactics'},
 {icon:'card',title:'Credencial digital',sub:'Jugador y OCR local',route:'credentialBuilder'},
 {icon:'stats',title:'Jugador destacado',sub:'Goleadores registrados',route:'scorers'},
 {icon:'team',title:'Delegados / encargados',sub:'Directorio local privado',action:'delegates'}
];
const MATCH_CARDS=[
 {icon:'match',title:'Timeline',sub:'Cronología verificable del partido',route:'match'},
 {icon:'tactics',title:'Alineaciones',sub:'Preparar formación',route:'tactics'},
 {icon:'team',title:'Jugador del partido',sub:'Selección local, no oficial',action:'motm'},
 {icon:'timer',title:'Operador móvil',sub:'Checklist de partido',route:'matchday'},
 {icon:'rule',title:'Acta arbitral digital',sub:'Cédula / PDF',route:'cedulas'},
 {icon:'alert',title:'Incidencias',sub:'Bitácora local de partido',action:'incidents'},
 {icon:'field',title:'Clima y campo',sub:'Pronóstico y sede',route:'weatherFields'},
 {icon:'shield',title:'Estados especiales',sub:'Suspensión / borrador',route:'suspensionTool'}
];
const MORE_CARDS=[
 {icon:'field',title:'Clima inteligente del partido',sub:'Pronóstico, campo y decisión oficial',route:'weatherFields'},
 {icon:'bell',title:'Registrarse y recibir avisos',sub:'Categoría y equipo favorito',action:'register-alerts'},
 {icon:'calendar',title:'Programar partido',sub:'Borrador local con fecha, hora y cancha',action:'schedule-match'},
 {icon:'shield',title:'Nueva sanción',sub:'Borrador disciplinario local',action:'new-sanction'},
 {icon:'video',title:'Modo TV',sub:'Resumen oficial para pantalla',route:'televisados'},
 {icon:'team',title:'Equipos',sub:'Ver equipos registrados',route:'teams'},
 {icon:'users',title:'Jugadores',sub:'Ver jugadores registrados',route:'players'},
 {icon:'trophy',title:'Liguilla',sub:'Cuadro eliminatorio',route:'bracketBuilder'},
 {icon:'news',title:'Avisos',sub:'Noticias y comunicados',route:'news'},
 {icon:'video',title:'Videos',sub:'Momentos y archivo',route:'moments'},
 {icon:'history',title:'Historia',sub:'Temporadas, campeones y finales',route:'history'},
 {icon:'match',title:'Match Center real',sub:'Partido oficial, marcador y contexto',route:'v4-matchcenter'},
 {icon:'admin',title:'JR Control',sub:'Centro operativo',route:'jrControl'},
 {icon:'card',title:'Alta rápida',sub:'Registro y credencial de jugador',route:'credentialBuilder'},
 {icon:'history',title:'Actividad reciente',sub:'Bitácora local de herramientas',action:'audit'},
 {icon:'calendar',title:'Calendario y resultados',sub:'Partidos y jornadas oficiales',route:'competition'},
 {icon:'stats',title:'Goleo',sub:'Ranking de anotadores',route:'scorers'},
 {icon:'timer',title:'Centro de jornada',sub:'Checklist operativo',route:'matchday'},
 {icon:'timer',title:'Barra de jornada',sub:'Accesos rápidos de operación',route:'matchday'},
 {icon:'fire',title:'Fan Zone',sub:'Reacciones locales',action:'fanzone'},
 {icon:'card',title:'Credencial',sub:'OCR y credencial digital',route:'credentialBuilder'},
 {icon:'timer',title:'JR Matchday+',sub:'Centro de jornada',route:'matchday'},
 {icon:'bell',title:'Notificaciones',sub:'Preferencias y avisos',route:'notifications'},
 {icon:'rule',title:'Reglamento',sub:'Documento oficial',route:'rulebook'},
 {icon:'shield',title:'Sanciones',sub:'Disciplina oficial',route:'discipline'},
 {icon:'upload',title:'Importar / exportar',sub:'Herramientas de respaldo local',action:'backup-export'},
 {icon:'upload',title:'Importar CSV',sub:'Vista previa local, sin tocar oficiales',action:'csv-import'},
 {icon:'download',title:'Exportar respaldo',sub:'Datos locales de herramientas',action:'backup-export'},
 {icon:'ref',title:'Árbitros y oficiales',sub:'Directorio operativo local',action:'officials'},
 {icon:'alert',title:'Disciplina automática',sub:'Abrir tarjetas y castigados',route:'discipline'},
 {icon:'admin',title:'Auditoría de administradores',sub:'Actividad local de herramientas',action:'audit'},
 {icon:'field',title:'Campos y conflictos',sub:'Sedes, clima y agenda',route:'agendaBuilder'},
 {icon:'timer',title:'Operador móvil de partido',sub:'Control rápido de jornada',route:'matchday'},
 {icon:'rule',title:'Acta arbitral digital',sub:'Cédula e impresión PDF',route:'cedulas'},
 {icon:'shield',title:'Estados especiales de partido',sub:'Borrador de suspensión y avisos',route:'suspensionTool'},
 {icon:'alert',title:'Incidencias',sub:'Bitácora operativa local',action:'incidents'},
 {icon:'rule',title:'Reportes y jornadas',sub:'Cédulas y operación',route:'cedulaBuilder'},
 {icon:'calendar',title:'Calendarios oficiales',sub:'Cruces ya hechos · PDF / imagen',action:'calendar-generator'},
 {icon:'sponsor',title:'Patrocinadores',sub:'Acuerdos, vigencias, espacios y contactos',action:'sponsors'},
 {icon:'poll',title:'Encuesta',sub:'Participación local',action:'poll'}
];

function finalVideo(){
 return '<article class="v105-final" id="v105-final-video"><video controls playsinline preload="metadata" poster="'+MEDIA+'gran-final-veteranos-35.png"><source src="'+MEDIA+'gran-final-veteranos-35.mp4" type="video/mp4"></video><div class="v105-final-copy"><small>MOMENTOS DE LA LIGA</small><b>Video promocional de la Gran Final</b><p>Revive partidos, finales y recuerdos que forman parte de la historia de la Liga Juventino Rosas.</p></div></article>';
}
function gallery(){
 const vids=[
  ['Cuartos de final · Boavista / Cuenda','cuartos-boavista-cuenda.mp4'],
  ['Cuartos de final · Pozos / PSV','cuartos-pozos-psv.mp4'],
  ['Semifinal · Boavista / Cerrito','semifinal-boavista-cerrito.mp4'],
  ['Semifinal · Juventus / Pozos','semifinal-juventus-pozos.mp4'],
  ['Gran Final · Veteranos 35+','gran-final-veteranos-35.mp4']
 ];
 return '<div class="v105-video-grid">'+vids.map(v=>'<article class="v105-video-card"><video controls playsinline preload="metadata" src="'+MEDIA+v[1]+'"></video><b>'+esc(v[0])+'</b><small>Archivo de Liga_Futbol</small></article>').join('')+'</div>';
}
function block(r){
 let html='',cards=[],k='EXPLORA MÁS',title='',desc='',asset='v38-soccer-hero.mp4';
 if(r==='home'){k='TODO EN UN SOLO LUGAR';title='VIVE LA LIGA A TU MANERA';desc='Partidos, historia, herramientas, videos y accesos para seguir todo lo que pasa en la Liga Juventino Rosas.';cards=HOME_CARDS;asset='v38-soccer-hero.mp4';html+=finalVideo()}
 else if(r==='competition'||r==='v4-calendar'||r==='calendar'||r==='monthlyCalendar'||r==='calendarMonthly'||r==='leagueData'||r==='bracketBuilder'||r==='tableExport'){title='Competición · herramientas completas';desc='Calendario, tabla, goleadores, liguilla, simulación, exportación y campos.';cards=COMP_CARDS;asset='v38-soccer-matchday.mp4'}
 else if(r==='teams'||r==='players'||r==='teamDetail'){title='Equipos y jugadores · herramientas';desc='Plantillas, alineaciones, credenciales y encargados, siempre debajo del contenido existente.';cards=TEAM_CARDS;asset='v38-soccer-teams.mp4'}
 else if(r==='match'){title='Match Center · herramientas del partido';desc='Timeline, alineaciones, acta, incidencias, clima y operación.';cards=MATCH_CARDS;asset='v38-soccer-matchday.mp4'}
 else if(r==='stats'||r==='scorers'||r==='rankings'||r==='v38Stats'){title='Datos y rendimiento';desc='Tabla, goleadores, exportación y lectura de temporada.';cards=[...COMP_CARDS.filter(x=>['leagueData','stats','scorers','tableExport'].includes(x.route)),{icon:'sim',title:'Escenarios',sub:'Simulación local',route:'simulator'}];asset='v38-soccer-stats.mp4'}
 else if(r==='moments'){k='MOMENTOS DE LA LIGA';title='Videos y momentos';desc='Cuartos, semifinales, finales y archivo audiovisual de la Liga.';cards=[{icon:'video',title:'Momentos',sub:'Contenido de la Liga',route:'moments'},{icon:'history',title:'Historial',sub:'Temporadas y archivo',route:'historyLog'},{icon:'share',title:'Compartir jornada',sub:'Publicaciones',route:'publications'}];asset='v38-soccer-liguilla.mp4';html+=gallery()}
 else if(r==='video'){k='LIGA JUVENTINO TV';title='Videos y momentos';desc='Archivo audiovisual de la Liga.';cards=[{icon:'video',title:'Televisados',sub:'Partidos transmitidos y en directo',route:'televisados'},{icon:'video',title:'Momentos',sub:'Contenido de la Liga',route:'moments'},{icon:'history',title:'Historia',sub:'Temporadas y archivo',route:'history'},{icon:'share',title:'Compartir jornada',sub:'Publicaciones',route:'publications'}];asset='v38-soccer-liguilla.mp4';html+=gallery()}
 else if(r==='history'){title='Historia · temporadas y palmarés';desc='Accesos directos al archivo histórico.';cards=[{icon:'history',title:'Temporada actual',sub:'Información vigente',route:'leagueData'},{icon:'trophy',title:'Palmarés',sub:'Campeones e historia',route:'history',tab:'Campeones'},{icon:'history',title:'Históricos',sub:'Equipos y temporadas anteriores',route:'history',tab:'Temporadas'},{icon:'video',title:'Finales y momentos',sub:'Finales del archivo',route:'history',tab:'Finales'}];asset='v38-soccer-liguilla.mp4'}
 else if(r==='tactics'){title='Táctica 3D · versión azul';desc='Tablero táctil inspirado en la función de Liga_Futbol; se agrega al final y guarda sólo en este dispositivo.';cards=[];asset='v38-fix10-tactics-motion.mp4';html+=tacticsBoard()}
 else if(r==='matchday'){k='CENTRO DE JORNADA';title='Partido y operación';desc='Accesos complementarios debajo del centro de jornada, sin mover el contenido principal.';cards=[
   {icon:'match',title:'Match Center real',sub:'Abrir partido oficial',route:'v4-matchcenter'},
   {icon:'calendar',title:'Calendario y resultados',sub:'Jornadas oficiales',route:'competition'},
   {icon:'field',title:'Clima y campos',sub:'Sede y condiciones',route:'weatherFields'},
   {icon:'rule',title:'Cédulas',sub:'Acta y PDF del partido',route:'cedulas'},
   {icon:'history',title:'Historia',sub:'Temporadas y archivo',route:'history'}
 ];asset='v38-soccer-matchday.mp4'}

 else if(r==='jrControl'){title='Explora la Liga · herramientas de control';desc='Accesos operativos complementarios de JR Control.';cards=MORE_CARDS;asset='v38-soccer-teams.mp4'}
 else if(r==='news'||r==='v38Weekly'){title='Noticias, avisos y juntas';desc='Comunicación y operación semanal de la Liga.';cards=[{icon:'news',title:'Avisos',sub:'Comunicados y cambios de la Liga',route:'notices'},{icon:'calendar',title:'Junta semanal',sub:'Agenda y acuerdos locales',action:'meeting'},{icon:'alert',title:'Cambios de horario y sedes',sub:'Notificaciones',route:'notifications'},{icon:'video',title:'Semifinales, finales y momentos',sub:'Videos',route:'moments'}];asset='v38-soccer-matchday.mp4'}
 else if(r==='notifications'){title='Notificaciones y participación';desc='Preferencias, encuesta y pulso de afición.';cards=[{icon:'bell',title:'Notificaciones',sub:'Preferencias actuales',route:'notifications'},{icon:'fire',title:'Fan Zone',sub:'Reacciones locales',action:'fanzone'},{icon:'poll',title:'Encuesta',sub:'Voto local',action:'poll'}];asset='v38-soccer-hero.mp4'}
 else return '';
 if(r==='moments'){
   return '<section class="v105-bottom" id="v105-bottom" data-v105-route="'+esc(r)+'">'+
     head(k,title,desc)+
     motion(asset,'LIGA JUVENTINO · MOMENTOS','FÚTBOL QUE SE MUEVE','Videos, finales y recuerdos de la Liga integrados al mismo diseño de Momentos.')+
     html+
     (cards.length?'<div class="v105-grid">'+cards.map(card).join('')+'</div>':'')+
   '</section>';
 }
 if(r==='video'){
   return '<section class="v105-bottom v105-video-integrated" id="v105-bottom" data-v105-route="'+esc(r)+'">'+
     head(k,title,desc)+
     motion(asset,'LIGA JUVENTINO · TV','FÚTBOL QUE SE MUEVE','Finales, jugadas y archivo audiovisual integrado al mismo diseño de Liga Juventino TV.')+
     html+
     (cards.length?'<div class="v105-grid">'+cards.map(card).join('')+'</div>':'')+
   '</section>';
 }
 if(r==='notifications'){
   return '<section class="v105-bottom" id="v105-bottom" data-v105-route="'+esc(r)+'">'+
     head(k,title,desc)+
     '<div class="v105-grid">'+cards.map(card).join('')+'</div>'+
     '<p class="v105-footnote">Estas funciones complementan las preferencias de arriba y no cambian datos oficiales.</p>'+
     motion(asset,'LIGA JUVENTINO · AZUL','FÚTBOL QUE SE MUEVE','Animaciones de la app verde adaptadas visualmente al diseño azul y colocadas al final.')+
   '</section>';
 }
 return '<section class="v105-bottom" id="v105-bottom" data-v105-route="'+esc(r)+'">'+head(k,title,desc)+motion(asset,'LIGA JUVENTINO · AZUL','FÚTBOL QUE SE MUEVE','Partidos, historias y momentos de la Liga.')+html+(cards.length?'<div class="v105-grid">'+cards.map(card).join('')+'</div>':'')+'</section>';
}

/* ===== Táctica 3D inferior ===== */
const A=[[50,94],[15,78],[38,80],[62,80],[85,78],[15,60],[38,62],[62,62],[85,60],[36,42],[64,42]];
const B=A.map(p=>[100-p[0],100-p[1]]);
function tacticsBoard(){
 const s=read('v105-tactics',{view3d:true,posA:A,posB:B});
 const tokens=[...(s.posA||A).map((p,i)=>({p,i,side:'a'})),...(s.posB||B).map((p,i)=>({p,i,side:'b'}))];
 return '<div class="v105-tactics" data-v105-tactics><div class="v105-tac-toolbar"><button class="'+(s.view3d?'active':'')+'" data-v105-3d>Vista 3D</button><button data-v105-tac-save>Guardar</button><button data-v105-tac-reset>Reiniciar</button><button data-v105-tac-json>JSON</button></div><div class="v105-pitch '+(s.view3d?'is3d':'')+'" data-v105-pitch><i class="v105-ball"></i>'+tokens.map(t=>'<button class="v105-player '+t.side+'" style="left:'+t.p[0]+'%;top:'+t.p[1]+'%" data-side="'+t.side+'" data-i="'+t.i+'">'+(t.i+1)+'</button>').join('')+'</div></div>';
}
function bindTactics(root){
 const host=$('[data-v105-tactics]',root);if(!host)return;
 const pitch=$('[data-v105-pitch]',host);if(!pitch)return;
 $$('[data-i]',pitch).forEach(p=>p.addEventListener('pointerdown',e=>{e.preventDefault();p.setPointerCapture?.(e.pointerId);const move=ev=>{const r=pitch.getBoundingClientRect();let x=(ev.clientX-r.left)/r.width*100,y=(ev.clientY-r.top)/r.height*100;p.style.left=Math.max(4,Math.min(96,x))+'%';p.style.top=Math.max(4,Math.min(96,y))+'%'};const up=()=>{p.removeEventListener('pointermove',move);saveTac(host)};p.addEventListener('pointermove',move);p.addEventListener('pointerup',up,{once:true});p.addEventListener('pointercancel',up,{once:true})}));
 $('[data-v105-3d]',host).onclick=e=>{pitch.classList.toggle('is3d');e.currentTarget.classList.toggle('active',pitch.classList.contains('is3d'));saveTac(host)};
 $('[data-v105-tac-save]',host).onclick=()=>{saveTac(host);toast('Táctica guardada localmente')};
 $('[data-v105-tac-reset]',host).onclick=()=>{write('v105-tactics',{view3d:true,posA:A,posB:B});const sec=root;sec.remove();mount()};
 $('[data-v105-tac-json]',host).onclick=()=>{saveTac(host);dl(new Blob([JSON.stringify(read('v105-tactics',{}),null,2)],{type:'application/json'}),'Tactica_3D_Liga_Juventino.json')};
}
function saveTac(host){const pitch=$('[data-v105-pitch]',host),pa=[],pb=[];$$('[data-i]',pitch).forEach(p=>{const arr=p.dataset.side==='a'?pa:pb;arr[Number(p.dataset.i)]=[parseFloat(p.style.left),parseFloat(p.style.top)]});write('v105-tactics',{view3d:pitch.classList.contains('is3d'),posA:pa,posB:pb})}

/* ===== Acciones locales ===== */
function v105TuesdayDate(base=new Date()){
  const d=new Date(base.getFullYear(),base.getMonth(),base.getDate(),12,0,0);
  const delta=(2-d.getDay()+7)%7;
  d.setDate(d.getDate()+delta);
  return d;
}
function v105DateInput(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}
function v105SpanishLongDate(d){
  try{return new Intl.DateTimeFormat('es-MX',{weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(d)}
  catch(_){return d.toLocaleDateString('es-MX')}
}
function v105IsTuesday(value){
  if(!value)return false;
  const m=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return false;
  return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12,0,0).getDay()===2;
}
function meeting(){
 const next=v105TuesdayDate();
 const nextValue=v105DateInput(next);
 const defaultAgenda='Revisión de jornada · sanciones · programación · campos · arbitraje · asuntos generales';
 const old=read('v105-meeting',{date:'',agenda:'',agreements:'',attendance:''});
 const savedDate=v105IsTuesday(old.date)?old.date:nextValue;
 const agenda=old.agenda||defaultAgenda;
 const m=modal(
   'Junta semanal de liga · martes',
   'Las juntas ordinarias de la Liga se realizan los martes.',
   '<div class="v105-meeting-notice"><b>Próxima junta: '+esc(v105SpanishLongDate(next))+'.</b><span>Aquí se puede llevar asistencia, orden del día y acuerdos.</span></div>'+
   '<div class="v105-form v105-meeting-form">'+
     '<label><span>Fecha de junta · martes</span><input type="date" data-x="date" value="'+esc(savedDate)+'"></label>'+
     '<label><span>Asistencia</span><input data-x="attendance" value="'+esc(old.attendance)+'" placeholder="Delegados presentes"></label>'+
     '<label style="grid-column:1/-1"><span>Orden del día</span><textarea data-x="agenda">'+esc(agenda)+'</textarea></label>'+
     '<label style="grid-column:1/-1"><span>Acuerdos / minuta</span><textarea data-x="agreements">'+esc(old.agreements)+'</textarea></label>'+
   '</div>'+
   '<div class="v105-actions"><button class="v105-btn" data-save>Guardar junta</button><button class="v105-btn alt" data-pdf>Imprimir minuta</button></div>'
 );
 const date=$('[data-x="date"]',m);
 date?.addEventListener('change',()=>{
   if(!date.value)return;
   if(!v105IsTuesday(date.value)){
     date.value=nextValue;
     toast('Las juntas ordinarias de la Liga son los martes');
   }
 });
 $('[data-save]',m).onclick=()=>{
   const o={};$$('[data-x]',m).forEach(x=>o[x.dataset.x]=x.value);
   if(!v105IsTuesday(o.date))return toast('La junta debe registrarse en martes');
   write('v105-meeting',o);
   log('Guardar junta semanal · martes');
   toast('Junta del martes guardada localmente');
 };
 $('[data-pdf]',m).onclick=()=>window.print();
}

window.LJR_OPEN_MEETING=meeting;

function poll(){
 const choices=[
  ['organizacion','shield','Organización y avisos','Juntas, comunicados y cambios de última hora'],
  ['campos','field','Campos y sedes','Condiciones físicas, suspensión y mantenimiento'],
  ['arbitraje','ref','Arbitraje y disciplina','Árbitros, tarjetas, incidencias y sanciones'],
  ['horarios','calendar','Horarios y jornadas','Programación, reprogramaciones y puntualidad'],
  ['estadisticas','stats','Resultados y estadísticas','Tablas, goleo, cédulas y datos oficiales'],
  ['app','video','App y transmisiones','Match Center, videos, notificaciones y contenido'],
  ['todo','shield','Todo va bien','Mantener el funcionamiento actual'],
  ['revisar','calendar','Revisar después','Responder en otro momento']
 ];
 const empty=Object.fromEntries(choices.map(x=>[x[0],0]));
 const p=read('v105-poll-v2',{choice:'',counts:empty});
 p.counts={...empty,...(p.counts||{})};
 const total=()=>Object.values(p.counts).reduce((a,b)=>a+(Number(b)||0),0);
 const cards=()=>choices.map(x=>
   '<button class="v105-card '+(p.choice===x[0]?'is-selected':'')+'" data-v105-poll-choice="'+x[0]+'" aria-pressed="'+(p.choice===x[0]?'true':'false')+'">'+
     '<span class="v105-icon">'+icon(x[1])+'</span>'+
     '<span class="v105-copy"><b>'+esc(x[2])+'</b><small>'+esc(x[3])+' · <span data-v105-poll-count="'+x[0]+'">'+Number(p.counts[x[0]]||0)+'</span> respuestas</small></span>'+
     '<span class="v105-arrow">›</span>'+
   '</button>'
 ).join('');
 const m=modal(
   'Encuesta de la Liga',
   'Participación local en este dispositivo; no es una votación oficial.',
   '<div class="v105-poll-intro">'+
     '<small>PULSO DE LA LIGA</small>'+
     '<b>¿Qué área debería mejorar primero la Liga?</b>'+
     '<p>Elige una prioridad. Puedes cambiar tu respuesta después sin duplicar el voto.</p>'+
     '<div class="v105-poll-meta"><span>Temas: organización · campos · arbitraje · horarios · estadísticas · app</span><strong data-v105-poll-total>'+total()+' respuestas locales</strong></div>'+
   '</div>'+
   '<div class="v105-grid v105-poll-grid">'+cards()+'</div>'+
   '<p class="v105-poll-status" data-v105-poll-status>'+(p.choice?'Tu prioridad guardada: '+esc((choices.find(x=>x[0]===p.choice)||[])[2]||''):'Aún no has elegido una prioridad.')+'</p>'
 );
 m.classList.add('v105-poll-modal');
 const render=()=>{
   $$('[data-v105-poll-choice]',m).forEach(b=>{
     const key=b.dataset.v105PollChoice;
     b.classList.toggle('is-selected',p.choice===key);
     b.setAttribute('aria-pressed',p.choice===key?'true':'false');
     const n=$('[data-v105-poll-count="'+key+'"]',b);
     if(n)n.textContent=Number(p.counts[key]||0);
   });
   const t=$('[data-v105-poll-total]',m);if(t)t.textContent=total()+' respuestas locales';
   const s=$('[data-v105-poll-status]',m);
   if(s){
     const item=choices.find(x=>x[0]===p.choice);
     s.textContent=item?'Tu prioridad guardada: '+item[2]:'Aún no has elegido una prioridad.';
   }
 };
 $$('[data-v105-poll-choice]',m).forEach(b=>b.onclick=()=>{
   const next=b.dataset.v105PollChoice;
   if(p.choice===next)return toast('Esa prioridad ya está guardada');
   if(p.choice&&p.counts[p.choice]>0)p.counts[p.choice]-=1;
   p.choice=next;
   p.counts[next]=(Number(p.counts[next])||0)+1;
   write('v105-poll-v2',p);
   log('Encuesta prioridad '+next);
   render();
   toast(next==='revisar'?'Guardado para revisar después':'Prioridad guardada');
 });
}
function fanzone(){
 const api=window.LJR_FAN_ZONE_ONE_VOTE;
 if(!api)return toast('Fan Zone todavía está cargando');
 const map={gol:'goal',liga:'heart',aplauso:'clap',fuego:'fire'};
 const choices=[
  {id:'gol',title:'Gol',emoji:'⚽',subtitle:'¡Qué golazo!',icon:'<circle cx="24" cy="24" r="17"/><path d="m24 14 9 7-3.5 11h-11L15 21zM15 21l-7-2M18.5 32l-3 7m14-7 4 7m-.5-18 7-2M24 14V7"/>'},
  {id:'liga',title:'Liga',emoji:'💙',subtitle:'Orgullo azul',icon:'<path d="M24 42 8.5 27.7C-2 18.2 12 2 24 15.3 36 2 50 18.2 39.5 27.7Z"/><path d="m17 25 5 5 10-11"/>'},
  {id:'aplauso',title:'Aplauso',emoji:'👏',subtitle:'¡Bien jugado!',icon:'<path d="m11 23 7-13c1-2 4-1 3 2l-4 10 8-15c1-3 5-1 4 2l-7 15 8-12c2-3 5 0 3 3l-6 11 6-6c3-3 6 1 3 4L27 37c-4 6-12 7-18 1l-5-6c-3-4 2-7 5-4l5 3"/><path d="m36 11 5-5M39 18l6-2M5 13 1 9"/>'},
  {id:'fuego',title:'Fuego',emoji:'🔥',subtitle:'¡Pura pasión!',icon:'<path d="M25 44C13 44 8 35 10 26c2-7 8-12 9-20 6 5 6 11 6 14 5-3 7-8 8-13 7 8 11 17 9 24-2 8-8 13-17 13Z"/><path d="M25 42c-5 0-8-4-7-9 1-4 5-7 6-11 4 4 3 7 3 9 2-1 4-3 5-5 4 8 1 16-7 16Z"/>'}
 ];
 const picture=paths=>'<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false">'+paths+'</svg>';
 const snap=api.snapshot();
 const m=modal(
  'Fan Zone',
  'Tu pasión mueve la Liga. Elige tu reacción favorita y cámbiala cuando quieras.',
  '<div class="v926-fan-status"><span class="v926-fan-status-symbol" aria-hidden="true">✓</span><p class="v105-fan-rule" data-fan-status aria-live="polite"></p></div>'+
  '<div class="v105-grid v926-fan-grid">'+choices.map(x=>
   '<button type="button" class="v105-card v926-fan-card" data-r="'+x.id+'" data-v926-tone="'+x.id+'" aria-pressed="false" aria-label="Reaccionar con '+x.title+'">'+
    '<span class="v105-icon v926-fan-icon">'+picture(x.icon)+'</span>'+
    '<span class="v105-copy v926-fan-copy"><b>'+x.title+' <span aria-hidden="true">'+x.emoji+'</span></b><small>'+Number(snap.counts[map[x.id]]||0)+' reacciones</small><em>'+x.subtitle+'</em></span>'+
    '<span class="v926-fan-selected-mark" aria-hidden="true">✓</span>'+
   '</button>'
  ).join('')+'</div>'+
  '<div class="v926-fan-bottom"><span><i class="v926-fan-dot" aria-hidden="true"></i> Participación de la afición</span><strong data-fan-total>0 reacciones</strong></div>'
 );
 m.classList.add('v926-fanzone-modal');
 const heading=$('.v105-dialog h3',m);
 heading?.insertAdjacentHTML('beforebegin','<div class="v926-fan-eyebrow"><span class="v926-fan-kicker">LIGA JUVENTINO ROSAS</span><span class="v926-fan-badge">FAN ZONE <span aria-hidden="true">✦</span></span></div>');
 const render=()=>{
  const z=api.snapshot();
  const total=Object.values(z.counts||{}).reduce((sum,n)=>sum+(Number(n)||0),0);
  $$('[data-r]',m).forEach(b=>{
   const key=map[b.dataset.r],count=Number(z.counts[key]||0),selected=z.choice===key;
   const small=b.querySelector('.v926-fan-copy small');
   if(small)small.textContent=count===1?'1 reacción':count+' reacciones';
   b.classList.toggle('is-selected',selected);
   b.setAttribute('aria-pressed',String(selected));
   b.setAttribute('aria-label',(selected?'Tu reacción seleccionada: ':'Reaccionar con ')+b.querySelector('.v926-fan-copy b')?.firstChild?.textContent?.trim());
   b.style.setProperty('--v926-share',(total?Math.round(count/total*100):0)+'%');
  });
  const status=$('[data-fan-status]',m);
  if(status)status.textContent=z.choice
   ?'¡Reacción registrada! Puedes cambiar tu elección sin duplicar el voto.'
   :(z.profile?'Perfil registrado · elige una sola reacción.':'Visitante · puedes elegir una reacción por dispositivo.');
  const totalElement=$('[data-fan-total]',m);
  if(totalElement)totalElement.textContent=total===1?'1 reacción':total+' reacciones';
 };
 $$('[data-r]',m).forEach(b=>b.onclick=()=>{
  const result=api.vote(map[b.dataset.r]);render();
  toast(result.same?'Ya elegiste esa reacción':(result.previous?'Reacción actualizada · conservas un solo voto':'¡Gracias por participar! Tu reacción quedó registrada'));
 });
 render();
}

function delegates(){
 const key='v105-delegates';
 let list=read(key,[]);
 if(!Array.isArray(list))list=[];
 let modified=false;
 const makeId=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,10);
 list.forEach(item=>{if(!item.id){item.id=makeId();modified=true}});
 if(modified)write(key,list);
 const roleNames=['Delegado titular','Subdelegado','Entrenador','Encargado de equipo','Presidente','Representante','Otro'];
 const categoryNames=['Primera','Intermedia','Segunda','Veteranos 35+','Veteranos 50+'];
 try{v160Categories().forEach(c=>{if(c.name&&!categoryNames.includes(c.name))categoryNames.push(c.name)})}catch(_){}
 const teamNames=()=>{try{return v160Teams()}catch(_){return []}};
 const opts=(values,selected)=>values.map(v=>'<option value="'+esc(v)+'"'+(String(v)===String(selected)?' selected':'')+'>'+esc(v)+'</option>').join('');
 const phoneDigits=s=>String(s||'').replace(/[^\d]/g,'');
 const whatsappPhone=s=>{const d=phoneDigits(s);return d.length===10?'52'+d:(d.length>=11&&d.length<=15?d:'')};
 const clean=s=>String(s||'').trim();
 const download=(txt,filename,type)=>dl(new Blob([txt],{type}),filename);
 const csvCell=value=>{let s=String(value??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
 const csvLine=cells=>cells.map(csvCell).join(',');
 const header='<div class="v1126-metrics" data-d-stats></div>'+
 '<div class="v1126-toolbar"><input type="search" data-d-search placeholder="Buscar nombre, equipo o teléfono…" aria-label="Buscar delegados">'+
 '<select data-d-category-filter aria-label="Filtrar categoría"><option value="">Todas las categorías</option>'+opts(categoryNames,'')+'</select>'+
 '<select data-d-role-filter aria-label="Filtrar cargo"><option value="">Todos los cargos</option>'+opts(roleNames,'')+'</select></div>'+
 '<div class="v1126-tools"><button type="button" class="v105-btn" data-d-new>+ Nuevo contacto</button>'+
 '<button type="button" class="v105-btn alt" data-d-csv>Exportar CSV</button>'+
 '<button type="button" class="v105-btn alt" data-d-vcf>Contactos VCF</button></div>'+
 '<details class="v1126-editor" data-d-editor>'+
 '<summary><span data-d-edit-title>Agregar representante</span><small>Nombre, equipo, categoría y contacto</small></summary>'+
 '<div class="v105-form v1126-form">'+
 '<label><span>Nombre completo *</span><input data-d-name autocomplete="name" maxlength="100" placeholder="Nombre del delegado"></label>'+
 '<label><span>Categoría</span><select data-d-category><option value="">Sin categoría</option>'+opts(categoryNames,'')+'</select></label>'+
 '<label><span>Equipo *</span><input data-d-team list="v1126-team-list" maxlength="100" placeholder="Escribe o elige equipo"></label>'+
 '<label><span>Cargo</span><select data-d-role>'+opts(roleNames,'Delegado titular')+'</select></label>'+
 '<label><span>Teléfono *</span><input data-d-phone type="tel" inputmode="tel" autocomplete="tel" maxlength="24" placeholder="10 dígitos o +52…"></label>'+
 '<label><span>Correo (opcional)</span><input data-d-email type="email" autocomplete="email" maxlength="150" placeholder="correo@ejemplo.com"></label>'+
 '<label class="v1126-wide"><span>Notas internas (opcionales)</span><textarea data-d-notes rows="2" maxlength="500" placeholder="Horario, suplente o indicaciones…"></textarea></label>'+
 '<label class="v1126-consent v1126-wide"><input type="checkbox" data-d-consent><span>Autorizó recibir avisos por WhatsApp</span></label></div>'+
 '<datalist id="v1126-team-list">'+teamNames().map(t=>'<option value="'+esc(t)+'"></option>').join('')+'</datalist>'+
 '<div class="v105-actions v1126-save"><button type="button" class="v105-btn" data-d-save>Guardar contacto</button>'+
 '<button type="button" class="v105-btn alt" data-d-cancel>Cancelar</button></div></details>'+
 '<div class="v1126-directory-title"><b>Representantes registrados</b><span data-d-count></span></div>'+
 '<div class="v105-list v1126-directory" data-d-list></div>'+
 '<details class="v1126-extra"><summary>Preparar avisos y juntas</summary>'+
 '<label class="v1126-small-label">Tipo de aviso<select data-d-notice-type><option value="jornada">Próxima jornada</option><option value="junta">Junta de delegados</option><option value="sede">Cambio de cancha u horario</option><option value="suspension">Suspensión</option><option value="general">Comunicado general</option></select></label>'+
 '<label class="v1126-small-label">Mensaje para revisar<textarea data-d-notice rows="3" maxlength="1200"></textarea></label>'+
 '<div class="v1126-tools"><button type="button" class="v105-btn alt" data-d-copy>Abrir para copiar aviso</button></div>'+
 '<label class="v1126-small-label">Fecha y hora de junta (opcional)<input type="datetime-local" data-d-meeting-date></label>'+
 '<div class="v1126-tools"><button type="button" class="v105-btn alt" data-d-calendar>Crear en Google Calendar</button></div>'+
 '<small>Los mensajes se abren individualmente en WhatsApp para revisarlos y enviarlos manualmente. No se envían automáticamente.</small></details>'+
 '<details class="v1126-extra"><summary>Importar y respaldo privado</summary>'+
 '<p>Archivo local CSV, JSON o VCF. Comprueba los datos antes de confirmar la importación. No se suben a GitHub.</p>'+
 '<div class="v1126-tools"><button type="button" class="v105-btn alt" data-d-import>Importar archivo</button>'+
 '<button type="button" class="v105-btn alt" data-d-json>Descargar respaldo JSON</button></div>'+
 '<input type="file" data-d-file accept=".csv,.json,.vcf,text/csv,application/json,text/vcard" hidden>'+
 '<small>Estos contactos permanecen en este navegador. El respaldo contiene datos personales: guárdalo en un lugar privado.</small></details>';
 const m=modal('Delegados / encargados','Directorio privado en este dispositivo. Llama, edita o prepara avisos sin publicar teléfonos.',header);
 m.classList.add('v1107-admin-modal','v1126-delegate-modal');
 let editingId=null;
 const q=s=>$(s,m);
 const persist=action=>{write(key,list);log(action)};
 const reset=()=>{
  editingId=null;
  ['name','team','phone','email','notes'].forEach(k=>q('[data-d-'+k+']').value='');
  q('[data-d-category]').value='';
  q('[data-d-role]').value='Delegado titular';
  q('[data-d-consent]').checked=false;
  q('[data-d-edit-title]').textContent='Agregar representante';
  q('[data-d-save]').textContent='Guardar contacto';
 };
 const template={
  jornada:'Hola {nombre}, la Liga Juventino Rosas informa sobre la próxima jornada de {equipo}. Consulta los horarios y campos oficiales antes de asistir.',
  junta:'Hola {nombre}, se prepara una junta de delegados de la Liga Juventino Rosas. Por favor confirma tu asistencia cuando recibas la convocatoria oficial.',
  sede:'Hola {nombre}, hay información sobre un posible cambio de cancha u horario para {equipo}. Verifica el aviso oficial antes de trasladarte.',
  suspension:'Hola {nombre}, hay información de una posible suspensión. Confirma el estado oficial del partido de {equipo} antes de asistir.',
  general:'Hola {nombre}, este es un comunicado de la Liga Juventino Rosas para {equipo}. Consulta la información oficial.'
 };
 const personalized=(text,item)=>String(text||'').replace(/\{nombre\}/gi,item.name||'delegado').replace(/\{equipo\}/gi,item.team||'tu equipo');
 const noticeText=()=>clean(q('[data-d-notice]').value);
 q('[data-d-notice]').value=template.jornada;
 q('[data-d-notice-type]').onchange=()=>{q('[data-d-notice]').value=template[q('[data-d-notice-type]').value]||template.general};
 const render=()=>{
  const term=norm(q('[data-d-search]').value),cat=q('[data-d-category-filter]').value,role=q('[data-d-role-filter]').value;
  const uniqueTeams=new Set(list.map(x=>norm(x.team)).filter(Boolean));
  const consented=list.filter(x=>x.consent===true).length;
  q('[data-d-stats]').innerHTML='<span><b>'+list.length+'</b><small>Contactos</small></span><span><b>'+uniqueTeams.size+'</b><small>Equipos</small></span><span><b>'+consented+'</b><small>Avisos autorizados</small></span>';
  const filtered=list.filter(x=>(!cat||x.category===cat)&&(!role||(x.role||'Delegado titular')===role)&&(!term||norm([x.name,x.team,x.phone,x.role,x.category].join(' ')).includes(term)));
  q('[data-d-count]').textContent=filtered.length+' de '+list.length;
  q('[data-d-list]').innerHTML=filtered.length?filtered.map(x=>{
    const id=esc(x.id),number=phoneDigits(x.phone),wa=whatsappPhone(x.phone),enabled=!!wa;
    const roleText=x.role||'Delegado titular';
    const approved=x.consent===true;
    const safePhone=number?'<a class="v1126-link" href="tel:+'+number+'">'+esc(x.phone)+'</a>':esc(x.phone);
    return '<article class="v1126-card"><div class="v1126-card-head"><span class="v1126-avatar" aria-hidden="true">'+esc((x.name||'?').slice(0,1).toUpperCase())+'</span><div><b>'+esc(x.name||'Sin nombre')+'</b><small>'+esc(x.team||'Sin equipo')+' · '+esc(roleText)+(x.category?' · '+esc(x.category):'')+'</small><small>'+safePhone+'</small></div></div>'+
    '<div class="v1126-badges"><span>'+(approved?'✓ Avisos autorizados':'Avisos sin autorización registrada')+'</span>'+(x.email?'<span>'+esc(x.email)+'</span>':'')+'</div>'+
    (x.notes?'<p class="v1126-notes">'+esc(x.notes)+'</p>':'')+
    '<div class="v1126-card-actions">'+
    '<a href="tel:+'+number+'"'+(number?'':' aria-disabled="true"')+' class="v1126-action">☎ Llamar</a>'+
    (enabled?'<a data-d-whatsapp="'+id+'" href="https://wa.me/'+wa+'" target="_blank" rel="noopener noreferrer" class="v1126-action">WhatsApp</a>':'<span class="v1126-action is-disabled">WhatsApp</span>')+
    '<button type="button" data-d-edit="'+id+'">Editar</button>'+
    '<button type="button" data-d-contact-vcf="'+id+'">VCF</button>'+
    '<button type="button" class="v1126-delete" data-d-delete="'+id+'">Quitar</button></div></article>';
  }).join(''):'<p class="v105-footnote">'+(list.length?'No hay contactos con estos filtros.':'Todavía no hay delegados guardados. Agrega el primero arriba.')+'</p>';
  $$('[data-d-whatsapp]',m).forEach(a=>{
    const item=list.find(x=>x.id===a.dataset.dWhatsapp);
    if(!item)return;
    a.href='https://wa.me/'+whatsappPhone(item.phone)+'?text='+encodeURIComponent(personalized(noticeText(),item));
    a.title=item.consent===true?'Abrir conversación':'Revisa primero si tienes autorización para enviar avisos';
    a.onclick=e=>{if(item.consent!==true&&!confirm('No hay autorización para enviar avisos registrada. ¿Quieres abrir WhatsApp sin enviar nada automáticamente?'))e.preventDefault()};
  });
  $$('[data-d-edit]',m).forEach(btn=>btn.onclick=()=>{
    const x=list.find(d=>d.id===btn.dataset.dEdit);if(!x)return;
    editingId=x.id;
    ['name','team','phone','email','notes'].forEach(k=>{q('[data-d-'+k+']').value=x[k]||''});
    const category=q('[data-d-category]');
    if(x.category&&!Array.from(category.options).some(o=>o.value===x.category))category.add(new Option(x.category,x.category));
    category.value=x.category||'';
    const role=q('[data-d-role]');
    if(x.role&&!Array.from(role.options).some(o=>o.value===x.role))role.add(new Option(x.role,x.role));
    role.value=x.role||'Delegado titular';
    q('[data-d-consent]').checked=x.consent===true;
    q('[data-d-edit-title]').textContent='Editar representante';
    q('[data-d-save]').textContent='Guardar cambios';
    q('[data-d-editor]').open=true;
    q('[data-d-editor]').scrollIntoView({behavior:'smooth',block:'nearest'});
  });
  $$('[data-d-delete]',m).forEach(btn=>btn.onclick=()=>{
    const i=list.findIndex(d=>d.id===btn.dataset.dDelete);if(i<0)return;
    if(!confirm('¿Quitar a '+list[i].name+' del directorio de este dispositivo?'))return;
    if(editingId===list[i].id){reset();q('[data-d-editor]').open=false}
    list.splice(i,1);persist('Eliminar delegado local');render();
  });
  $$('[data-d-contact-vcf]',m).forEach(btn=>btn.onclick=()=>{
    const item=list.find(x=>x.id===btn.dataset.dContactVcf);if(!item)return;
    download(vcard(item),'Delegado_'+(item.name||'contacto').replace(/[^\w-]+/g,'_')+'.vcf','text/vcard;charset=utf-8');
  });
 };
 const vcard=(item)=>{
  const escapeV=v=>String(v||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[;,]/g,c=>'\\'+c);
  const rows=['BEGIN:VCARD','VERSION:3.0','FN:'+escapeV(item.name),'ORG:'+escapeV(item.team)];
  if(item.phone)rows.push('TEL;TYPE=CELL:'+escapeV(item.phone));
  if(item.email)rows.push('EMAIL:'+escapeV(item.email));
  if(item.notes)rows.push('NOTE:'+escapeV(item.notes));
  rows.push('END:VCARD');return rows.join('\r\n')+'\r\n';
 };
 q('[data-d-new]').onclick=()=>{reset();q('[data-d-editor]').open=true;q('[data-d-editor]').scrollIntoView({behavior:'smooth',block:'nearest'})};
 q('[data-d-cancel]').onclick=()=>{reset();q('[data-d-editor]').open=false};
 q('[data-d-search]').oninput=render;
 q('[data-d-category-filter]').onchange=render;
 q('[data-d-role-filter]').onchange=render;
 q('[data-d-save]').onclick=()=>{
  const name=clean(q('[data-d-name]').value),team=clean(q('[data-d-team]').value),phone=clean(q('[data-d-phone]').value),digits=phoneDigits(phone);
  if(!name||!team||!phone)return toast('Completa nombre, equipo y teléfono');
  if(digits.length<10||digits.length>15)return toast('Revisa el teléfono: entre 10 y 15 dígitos');
  const email=clean(q('[data-d-email]').value);
  if(email&&!q('[data-d-email]').checkValidity())return toast('Revisa el correo electrónico');
  const duplicate=list.find(x=>x.id!==editingId&&phoneDigits(x.phone)===digits);
  if(duplicate&&!confirm('El teléfono ya está registrado para '+duplicate.name+' ('+(duplicate.team||'sin equipo')+'). ¿Guardar otro contacto con el mismo número?'))return;
  const old=list.find(x=>x.id===editingId)||{};
  const item={...old,id:old.id||makeId(),name,team,phone,
   role:q('[data-d-role]').value,category:q('[data-d-category]').value,
   email,notes:clean(q('[data-d-notes]').value),consent:q('[data-d-consent]').checked,
   updatedAt:new Date().toISOString()};
  const idx=list.findIndex(x=>x.id===editingId);
  if(idx>=0)list[idx]=item;else list.push(item);
  persist(idx>=0?'Editar delegado local':'Agregar delegado local');
  reset();q('[data-d-editor]').open=false;render();toast(idx>=0?'Cambios guardados':'Contacto guardado');
 };
 q('[data-d-csv]').onclick=()=>{
  if(!list.length)return toast('No hay contactos para exportar');
  if(!confirm('El CSV contiene teléfonos y datos personales. ¿Descargarlo a este dispositivo?'))return;
  const cols=['nombre','equipo','categoria','cargo','telefono','correo','notas','avisos_autorizados'];
  const text='\ufeff'+csvLine(cols)+'\r\n'+list.map(x=>csvLine([x.name,x.team,x.category,x.role,x.phone,x.email,x.notes,x.consent?'si':'no'])).join('\r\n');
  download(text,'Delegados_Liga_Juventino_Rosas.csv','text/csv;charset=utf-8');
 };
 q('[data-d-vcf]').onclick=()=>{
  if(!list.length)return toast('No hay contactos para exportar');
  if(!confirm('Se exportarán nombres y teléfonos privados. ¿Descargar el archivo VCF?'))return;
  download(list.map(vcard).join(''),'Delegados_Liga_Juventino_Rosas.vcf','text/vcard;charset=utf-8');
 };
 q('[data-d-json]').onclick=()=>{
  if(!list.length)return toast('No hay contactos para respaldar');
  if(!confirm('El respaldo JSON contiene teléfonos y notas privadas. ¿Descargarlo?'))return;
  download(JSON.stringify({version:1,app:'Liga Juventino Rosas',contacts:list,exportedAt:new Date().toISOString()},null,2),'Respaldo_privado_delegados.json','application/json;charset=utf-8');
 };
 q('[data-d-copy]').onclick=async()=>{
  const t=noticeText();
  if(!t)return toast('Escribe un mensaje primero');
  try{await navigator.clipboard.writeText(t);toast('Borrador copiado; revisa antes de enviar')}
  catch(_){q('[data-d-notice]').select();toast('Selecciona y copia el aviso')}
 };
 q('[data-d-calendar]').onclick=()=>{
  const value=q('[data-d-meeting-date]').value;
  if(!value)return toast('Elige primero la fecha y hora');
  const start=new Date(value);
  if(Number.isNaN(start.getTime()))return toast('Revisa la fecha');
  const end=new Date(start.getTime()+60*60*1000);
  const stamp=d=>d.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
  const url='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent('Junta de delegados · Liga Juventino Rosas')+'&dates='+stamp(start)+'/'+stamp(end)+'&details='+encodeURIComponent('Convocatoria en preparación. Confirmar sede, horario y acuerdos con la Liga.');
  window.open(url,'_blank','noopener,noreferrer');
 };
 const parseCSV=input=>{
  const txt=input.replace(/^\ufeff/,'');
  const firstLine=txt.split(/\r?\n/,1)[0]||'';
  const delimiter=firstLine.includes(';')&&!firstLine.includes(',')?';':',';
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<txt.length;i++){
   const ch=txt[i];
   if(ch==='"'){if(quoted&&txt[i+1]==='"'){cell+='"';i++}else quoted=!quoted}
   else if(!quoted&&ch===delimiter){row.push(cell);cell=''}
   else if(!quoted&&(ch==='\n'||ch==='\r')){if(ch==='\r'&&txt[i+1]==='\n')i++;row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell=''}
   else cell+=ch;
  }
  row.push(cell);if(row.some(Boolean))rows.push(row);
  if(!rows.length)return [];
  const normal=s=>norm(s).replace(/\s+/g,'');
  const aliases={name:['nombre','name','nombrecompleto'],team:['equipo','team','club'],phone:['telefono','tel','celular','phone','movil'],role:['cargo','role','funcion'],category:['categoria','category'],email:['correo','email'],notes:['notas','notes'],consent:['avisosautorizados','autorizacion','consent']};
  const names=rows.shift().map(normal);
  const index=field=>names.findIndex(x=>aliases[field].includes(x));
  if(index('name')<0||index('phone')<0)throw Error('El CSV necesita las columnas nombre y telefono.');
  return rows.map(row=>{
   const value=field=>{const j=index(field);return j>=0?row[j]||'':''};
   return {name:value('name'),team:value('team'),phone:value('phone'),role:value('role'),category:value('category'),email:value('email'),notes:value('notes'),consent:/^(si|sí|true|1)$/i.test(value('consent'))};
  });
 };
 const parseVcf=txt=>{
  const cards=txt.replace(/\r?\n[ \t]/g,'').split(/BEGIN:VCARD/i).slice(1);
  return cards.map(card=>{
   const get=k=>{const line=card.split(/\r?\n/).find(x=>x.split(':')[0].split(';')[0].toUpperCase()===k);return line?line.slice(line.indexOf(':')+1).replace(/\\n/gi,'\n').replace(/\\([,;\\])/g,'$1'):''};
   return {name:get('FN'),team:get('ORG'),phone:get('TEL'),email:get('EMAIL'),notes:get('NOTE')};
  });
 };
 q('[data-d-import]').onclick=()=>q('[data-d-file]').click();
 q('[data-d-file]').onchange=async()=>{
  const input=q('[data-d-file]'),file=input.files&&input.files[0];
  if(!file)return;
  try{
   if(file.size>2000000)throw Error('El archivo supera 2 MB.');
   const txt=await file.text(),name=file.name.toLowerCase();
   let items;
   if(name.endsWith('.json')){const doc=JSON.parse(txt);items=Array.isArray(doc)?doc:doc.contacts}
   else if(name.endsWith('.vcf'))items=parseVcf(txt);
   else if(name.endsWith('.csv'))items=parseCSV(txt);
   else throw Error('Usa un archivo CSV, JSON o VCF.');
   if(!Array.isArray(items)||items.length>5000)throw Error('Archivo inválido o demasiado grande.');
   const existing=new Set(list.map(x=>phoneDigits(x.phone)+'|'+norm(x.team)+'|'+norm(x.name)));
   const valid=[];
   items.forEach(item=>{
    if(!item||typeof item!=='object')return;
    const name=clean(item.name).slice(0,100),phone=clean(item.phone).slice(0,24),team=clean(item.team).slice(0,100),digits=phoneDigits(phone);
    if(!name||digits.length<10||digits.length>15)return;
    const tag=digits+'|'+norm(team)+'|'+norm(name);if(existing.has(tag))return;
    existing.add(tag);
    valid.push({id:makeId(),name,phone,team,category:clean(item.category).slice(0,90),
     role:clean(item.role).slice(0,90)||'Delegado titular',email:clean(item.email).slice(0,150),
     notes:clean(item.notes).slice(0,500),consent:item.consent===true,
     updatedAt:new Date().toISOString()});
   });
   if(!valid.length)return toast('No hay contactos nuevos válidos');
   if(!confirm('Se agregarán '+valid.length+' contactos privados en este dispositivo. Los existentes se conservarán. ¿Continuar?'))return;
   list.push(...valid);persist('Importar delegados privados');render();toast(valid.length+' contactos importados');
  }catch(err){toast(err.message||'No se pudo leer el archivo')}
  finally{input.value=''}
 };
 q('[data-d-editor]').open=!list.length;
 render();
}
function officials(){
 const roles=['Árbitro','Árbitro central','Árbitro asistente','Cuarto árbitro','Asistente','Responsable de campo','Delegado','Supervisor'];
 const cats=['Todas','Primera','Intermedia','Segunda','Veteranos 35+','Veteranos 50+'];
 const fields=['Por definir','UDS Campo 1','UDS Campo 2','UDS Campo 3','Campo 4','Fraccionamiento','Romerillo','San Julián','Franco Tavera','Cuenda','Otro'];
 const avails=['Sin definir','Sábado','Domingo','Ambos','No disponible'];
 const readList=(key)=>{const value=read(key,[]);return Array.isArray(value)?value:[]};
 const list=readList('v105-officials');
 const assignments=readList('v1125-official-assignments');
 const makeId=()=>String(Date.now())+'-'+Math.random().toString(36).slice(2,10);
 const options=(values,current)=>values.map(x=>'<option value="'+esc(x)+'"'+(x===current?' selected':'')+'>'+esc(x)+'</option>').join('');
 const persist=()=>{write('v105-officials',list);log('Actualizar directorio local de oficiales')};
 const persistAssignments=()=>{write('v1125-official-assignments',assignments);log('Actualizar designaciones arbitrales locales')};
 let migrated=false;
 list.forEach(o=>{if(!o.id){o.id=makeId();migrated=true}});
 if(migrated)write('v105-officials',list);
 let editing=-1,activeTab='directory';
 const m=modal('Árbitros y oficiales','Directorio y designaciones privadas de este dispositivo. No se publican ni se sincronizan automáticamente.',
  '<div class="v1125-wrap">'+
   '<div class="v1125-stats" data-o-stats></div>'+
   '<div class="v1125-tabs" role="tablist" aria-label="Herramientas arbitrales">'+
    '<button type="button" data-o-tab="directory" class="is-active" role="tab" aria-selected="true">Directorio</button>'+
    '<button type="button" data-o-tab="assignments" role="tab" aria-selected="false">Designaciones</button>'+
   '</div>'+
   '<section data-o-panel="directory" role="tabpanel">'+
    '<div class="v1125-toolbar"><input type="search" data-o-search aria-label="Buscar oficial" placeholder="Buscar nombre o teléfono…" />'+
      '<select data-o-filter aria-label="Filtrar por función">'+options(['Todas las funciones',...roles],'Todas las funciones')+'</select></div>'+
    '<div class="v1125-header"><strong>Personal registrado</strong><div class="v1125-mini-actions"><button type="button" data-o-action="new">+ Nuevo</button><button type="button" data-o-action="csv">CSV</button></div></div>'+
    '<section data-o-editor class="v1125-editor"><div class="v1125-form-title" data-o-form-title>Agregar oficial</div>'+
     '<div class="v105-form v1125-form">'+
      '<label><span>Nombre *</span><input data-o-name autocomplete="name" maxlength="100" placeholder="Nombre completo"></label>'+
      '<label><span>Función</span><select data-o-role>'+options(roles,'Árbitro')+'</select></label>'+
      '<label><span>Teléfono (privado)</span><input data-o-phone type="tel" autocomplete="tel" inputmode="tel" maxlength="22" placeholder="10 dígitos"></label>'+
      '<label><span>Categoría</span><select data-o-cat>'+options(cats,'Todas')+'</select></label>'+
      '<label><span>Disponibilidad</span><select data-o-avail>'+options(avails,'Sin definir')+'</select></label>'+
      '<label><span>Campo habitual</span><select data-o-field>'+options(fields,'Por definir')+'</select></label>'+
      '<label><span>Estado</span><select data-o-status><option>Activo</option><option>Inactivo</option></select></label>'+
      '<label class="v1125-wide"><span>Observaciones privadas</span><textarea data-o-notes maxlength="500" placeholder="Experiencia, observaciones o restricciones…"></textarea></label>'+
     '</div><div class="v105-actions v1125-form-actions"><button type="button" class="v105-btn" data-o-action="save">Guardar oficial</button><button type="button" class="v105-btn alt" data-o-action="cancel">Cancelar</button></div>'+
    '</section><div class="v105-list v1125-list" data-o-list aria-live="polite"></div>'+
   '</section>'+
   '<section data-o-panel="assignments" role="tabpanel" hidden>'+
    '<p class="v1125-hint">Designaciones internas. No modifican el calendario ni las cédulas oficiales.</p>'+
    '<div class="v1125-header"><strong>Nombramientos de jornada</strong><button type="button" data-o-action="new-assignment">+ Designar</button></div>'+
    '<section data-o-assignment-editor class="v1125-editor" hidden><div class="v1125-form-title">Preparar designación</div>'+
     '<div class="v105-form v1125-form">'+
      '<label class="v1125-wide"><span>Oficial *</span><select data-o-assignee></select></label>'+
      '<label class="v1125-wide"><span>Partido *</span><input data-o-game maxlength="140" placeholder="Escribe los equipos del partido"></label>'+
      '<label><span>Fecha *</span><input type="date" data-o-date></label>'+
      '<label><span>Hora *</span><input type="time" data-o-time></label>'+
      '<label><span>Categoría</span><select data-o-game-cat>'+options(cats.filter(x=>x!=='Todas'),'Primera')+'</select></label>'+
      '<label><span>Cancha</span><select data-o-game-field>'+options(fields,'Por definir')+'</select></label>'+
     '</div><div class="v105-actions v1125-form-actions"><button type="button" class="v105-btn" data-o-action="save-assignment">Guardar pendiente</button><button type="button" class="v105-btn alt" data-o-action="cancel-assignment">Cancelar</button></div>'+
    '</section><div class="v105-list v1125-list" data-o-assignments aria-live="polite"></div>'+
   '</section>'+
   '<p class="v1125-privacy">Solo guardado en este navegador. Las llamadas, mensajes y exportaciones se realizan únicamente cuando tú pulsas el botón correspondiente.</p>'+
  '</div>');
 m.classList.add('v1125-officials-modal');
 const q=selector=>$(selector,m);
 const nameOf=id=>list.find(o=>o.id===id);
 const cleanPhone=value=>{
  let d=String(value||'').replace(/\D/g,'');
  if(d.length===10)d='52'+d; // México; WhatsApp normal con prefijo internacional
  else if(d.length===13&&d.startsWith('521'))d='52'+d.slice(3);
  return d.length>=11&&d.length<=15?d:'';
 };
 const whatsapp=(phone,message)=>{
  const n=cleanPhone(phone);
  if(!n){toast('Agrega un teléfono con código de país o 10 dígitos de México');return}
  window.open('https://wa.me/'+n+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 };
 const csvCell=value=>{
  const s=String(value??'').replace(/^[\s]*([=+\-@])/,"'$1");
  return '"'+s.replace(/"/g,'""')+'"';
 };
 const download=(name,body,mime)=>{
  const blob=new Blob([body],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 };
 const stats=()=>{
  const live=list.filter(o=>(o.status||'Activo')==='Activo');
  q('[data-o-stats]').innerHTML=
   '<span><b>'+list.length+'</b><small>Registrados</small></span>'+
   '<span><b>'+live.length+'</b><small>Activos</small></span>'+
   '<span><b>'+assignments.filter(a=>a.status==='Pendiente').length+'</b><small>Por confirmar</small></span>';
 };
 const renderDirectory=()=>{
  const query=norm(q('[data-o-search]').value),filter=q('[data-o-filter]').value;
  const filtered=list.map((o,i)=>({...o,_index:i})).filter(o=>{
   const matches=!query||norm([o.name,o.phone,o.role,o.category,o.field].join(' ')).includes(query);
   return matches&&(filter==='Todas las funciones'||o.role===filter);
  });
  q('[data-o-list]').innerHTML=filtered.length?filtered.map(o=>{
   const status=o.status||'Activo',avail=o.availability||'Sin definir';
   return '<article class="v1125-entry">'+
    '<div class="v1125-entry-heading"><div><b>'+esc(o.name||'Sin nombre')+'</b><small>'+esc(o.role||'Árbitro')+' · '+esc(o.category||'Todas')+'</small></div>'+
      '<span class="v1125-state '+(status==='Activo'?'good':'muted')+'">'+esc(status)+'</span></div>'+
    '<div class="v1125-tags"><span>◷ '+esc(avail)+'</span><span>⌖ '+esc(o.field||'Por definir')+'</span></div>'+
    (o.phone?'<small>Tel. '+esc(o.phone)+'</small>':'')+
    (o.notes?'<small>'+esc(o.notes)+'</small>':'')+
    '<div class="v1125-entry-actions"><button type="button" data-o-action="edit" data-index="'+o._index+'">Editar</button>'+
     (cleanPhone(o.phone)?'<button type="button" data-o-action="whatsapp" data-index="'+o._index+'">WhatsApp</button>':'')+
     '<button type="button" class="v1125-danger" data-o-action="remove" data-index="'+o._index+'">Eliminar</button></div>'+
   '</article>';
  }).join(''):'<p class="v105-footnote">'+(list.length?'No se encontraron oficiales con ese filtro.':'Todavía no hay oficiales. Pulsa «+ Nuevo» para registrar el primero.')+'</p>';
  stats();updateAssigneeOptions();
 };
 const updateAssigneeOptions=()=>{
  const sel=q('[data-o-assignee]');if(!sel)return;
  const old=sel.value;
  sel.innerHTML='<option value="">Elegir oficial</option>'+list.filter(o=>(o.status||'Activo')==='Activo').map(o=>'<option value="'+esc(o.id)+'">'+esc(o.name)+' · '+esc(o.role||'Árbitro')+'</option>').join('');
  sel.value=Array.from(sel.options).some(o=>o.value===old)?old:'';
 };
 const renderAssignments=()=>{
  const sorted=assignments.map((a,i)=>({...a,_index:i})).sort((a,b)=>(b.date+' '+b.time).localeCompare(a.date+' '+a.time));
  q('[data-o-assignments]').innerHTML=sorted.length?sorted.map(a=>{
   const official=nameOf(a.officialId);
   return '<article class="v1125-entry"><div class="v1125-entry-heading"><div><b>'+esc(a.game||'Partido')+'</b>'+
     '<small>'+esc(a.date)+' · '+esc(a.time)+' · '+esc(a.category)+'</small></div>'+
     '<span class="v1125-state '+(a.status==='Confirmado'?'good':'muted')+'">'+esc(a.status||'Pendiente')+'</span></div>'+
     '<div class="v1125-tags"><span>♙ '+esc(official?.name||a.officialName||'Oficial no disponible')+'</span><span>⌖ '+esc(a.field||'Por definir')+'</span></div>'+
     '<div class="v1125-entry-actions">'+
      (a.status!=='Confirmado'?'<button type="button" data-o-action="confirm" data-index="'+a._index+'">Confirmar</button>':'')+
      (official&&cleanPhone(official.phone)?'<button type="button" data-o-action="notify" data-index="'+a._index+'">WhatsApp</button>':'')+
      '<button type="button" data-o-action="ics" data-index="'+a._index+'">Calendario</button>'+
      '<button type="button" class="v1125-danger" data-o-action="remove-assignment" data-index="'+a._index+'">Quitar</button></div></article>';
  }).join(''):'<p class="v105-footnote">Sin designaciones. Registra oficiales y prepara el primer nombramiento.</p>';
  stats();
 };
 const editorVisible=show=>{q('[data-o-editor]').hidden=!show};
 const resetEditor=()=>{
  editing=-1;
  ['name','phone','notes'].forEach(k=>q('[data-o-'+k+']').value='');
  q('[data-o-role]').value='Árbitro';q('[data-o-cat]').value='Todas';q('[data-o-avail]').value='Sin definir';
  q('[data-o-field]').value='Por definir';q('[data-o-status]').value='Activo';
  q('[data-o-form-title]').textContent='Agregar oficial';q('[data-o-action="save"]').textContent='Guardar oficial';
 };
 const switchTab=tab=>{
  activeTab=tab;
  $$('[data-o-tab]',m).forEach(b=>{const selected=b.dataset.oTab===tab;b.classList.toggle('is-active',selected);b.setAttribute('aria-selected',String(selected))});
  $$('[data-o-panel]',m).forEach(p=>{p.hidden=p.dataset.oPanel!==tab});
  if(tab==='assignments'){updateAssigneeOptions();renderAssignments()}else renderDirectory();
 };
 const onDateTime=(date,time)=>new Date(date+'T'+time+':00');
 m.addEventListener('input',e=>{if(e.target.matches('[data-o-search]'))renderDirectory()});
 m.addEventListener('change',e=>{if(e.target.matches('[data-o-filter]'))renderDirectory()});
 m.addEventListener('click',e=>{
  const tab=e.target.closest('[data-o-tab]');if(tab){switchTab(tab.dataset.oTab);return}
  const btn=e.target.closest('[data-o-action]');if(!btn||!m.contains(btn))return;
  const action=btn.dataset.oAction,index=Number(btn.dataset.index);
  if(action==='new'){resetEditor();editorVisible(true);q('[data-o-name]').focus();return}
  if(action==='cancel'){resetEditor();editorVisible(false);return}
  if(action==='edit'){
   const o=list[index];if(!o)return;editing=index;
   q('[data-o-name]').value=o.name||'';q('[data-o-phone]').value=o.phone||'';q('[data-o-notes]').value=o.notes||'';
   q('[data-o-role]').value=roles.includes(o.role)?o.role:'Árbitro';
   q('[data-o-cat]').value=cats.includes(o.category)?o.category:'Todas';
   q('[data-o-avail]').value=avails.includes(o.availability)?o.availability:'Sin definir';
   q('[data-o-field]').value=fields.includes(o.field)?o.field:'Por definir';
   q('[data-o-status]').value=o.status==='Inactivo'?'Inactivo':'Activo';
   q('[data-o-form-title]').textContent='Editar oficial';q('[data-o-action="save"]').textContent='Guardar cambios';
   editorVisible(true);q('[data-o-name]').focus();return;
  }
  if(action==='save'){
   const name=q('[data-o-name]').value.trim(),phone=q('[data-o-phone]').value.trim();
   if(!name){toast('Escribe el nombre del oficial');q('[data-o-name]').focus();return}
   if(phone){const digits=phone.replace(/\D/g,'');if(digits.length<7||digits.length>15){toast('Revisa el número de teléfono');return}}
   if(list.some((o,i)=>i!==editing&&norm(o.name)===norm(name)&&(!phone||o.phone===phone))){toast('Este oficial ya está registrado');return}
   const o={id:editing>=0?list[editing].id:makeId(),name,phone,role:q('[data-o-role]').value,category:q('[data-o-cat]').value,
    availability:q('[data-o-avail]').value,field:q('[data-o-field]').value,status:q('[data-o-status]').value,notes:q('[data-o-notes]').value.trim()};
   if(editing>=0)list[editing]={...list[editing],...o};else list.push(o);
   persist();resetEditor();editorVisible(false);renderDirectory();toast('Oficial guardado en este dispositivo');return;
  }
  if(action==='remove'){
   const o=list[index];if(!o||!confirm('¿Eliminar a '+o.name+' del directorio local? Las designaciones guardadas conservarán su nombre.'))return;
   list.splice(index,1);persist();renderDirectory();renderAssignments();toast('Oficial eliminado');return;
  }
  if(action==='whatsapp'){
   const o=list[index];if(o)whatsapp(o.phone,'Hola '+o.name+', te contactamos de la Liga Juventino Rosas para consultar tu disponibilidad como '+(o.role||'árbitro')+'. ¿Nos puedes confirmar?');
   return;
  }
  if(action==='csv'){
   if(!list.length){toast('No hay registros para exportar');return}
   const cols=['Nombre','Función','Teléfono','Categoría','Disponibilidad','Campo habitual','Estado','Notas'];
   const rows=list.map(o=>[o.name,o.role,o.phone,o.category,o.availability,o.field,o.status,o.notes]);
   download('arbitros-privado-'+new Date().toISOString().slice(0,10)+'.csv','\uFEFF'+[cols,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n'),'text/csv;charset=utf-8');toast('Archivo privado descargado');return;
  }
  if(action==='new-assignment'){
   updateAssigneeOptions();if(!list.some(o=>(o.status||'Activo')==='Activo')){toast('Primero registra un oficial activo');return}
   q('[data-o-assignment-editor]').hidden=false;return;
  }
  if(action==='cancel-assignment'){q('[data-o-assignment-editor]').hidden=true;return}
  if(action==='save-assignment'){
   const id=q('[data-o-assignee]').value,off=nameOf(id),game=q('[data-o-game]').value.trim(),date=q('[data-o-date]').value,time=q('[data-o-time]').value;
   if(!off||!game||!date||!time){toast('Selecciona oficial, partido, fecha y hora');return}
   if(off.availability==='No disponible'||(off.availability==='Sábado'&&onDateTime(date,time).getDay()!==6)||
      (off.availability==='Domingo'&&onDateTime(date,time).getDay()!==0)){
    toast('El oficial figura sin disponibilidad en ese día');return;
   }
   const when=onDateTime(date,time);
   if(Number.isNaN(+when)){toast('Fecha y hora inválidas');return}
   if(assignments.some(a=>a.officialId===id&&a.date===date&&a.status!=='Rechazado'&&Math.abs((onDateTime(a.date,a.time)-when)/60000)<120)){
    toast('Conflicto: este oficial ya tiene otro partido cercano (±2 h)');return;
   }
   assignments.push({id:makeId(),officialId:id,officialName:off.name,game,date,time,category:q('[data-o-game-cat]').value,field:q('[data-o-game-field]').value,status:'Pendiente'});
   persistAssignments();q('[data-o-assignment-editor]').hidden=true;
   q('[data-o-game]').value='';q('[data-o-date]').value='';q('[data-o-time]').value='';
   renderAssignments();toast('Designación pendiente guardada localmente');return;
  }
  const a=assignments[index];if(!a)return;
  if(action==='confirm'){a.status='Confirmado';persistAssignments();renderAssignments();toast('Marcado como confirmado en este dispositivo');return}
  if(action==='remove-assignment'){
   if(confirm('¿Quitar esta designación local?')){assignments.splice(index,1);persistAssignments();renderAssignments()}return;
  }
  if(action==='notify'){
   const o=nameOf(a.officialId);if(o)whatsapp(o.phone,'Hola '+o.name+', la Liga Juventino Rosas preparó tu designación para '+a.game+' ('+a.category+'), el '+a.date+' a las '+a.time+' en '+a.field+'. ¿Puedes confirmar? Este mensaje no representa una publicación oficial.');return;
  }
  if(action==='ics'){
   const start=onDateTime(a.date,a.time),end=new Date(start.getTime()+120*60000);
   const stamp=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';
   const safeText=t=>String(t||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/,/g,'\\,').replace(/;/g,'\\;');
   const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Designacion local//ES','BEGIN:VEVENT',
    'UID:ljr-'+a.id.replace(/[^a-zA-Z0-9-]/g,'')+'@local','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''),
    'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+safeText('Designación arbitral · '+a.game),
    'LOCATION:'+safeText(a.field),'DESCRIPTION:'+safeText('Oficial: '+(nameOf(a.officialId)?.name||a.officialName)+' · '+a.category+' · Designación local'), 'END:VEVENT','END:VCALENDAR'];
   download('designacion-'+a.date+'.ics',lines.join('\r\n')+'\r\n','text/calendar;charset=utf-8');
   toast('Evento listo para importar en el calendario');return;
  }
 });
 resetEditor();editorVisible(list.length===0);switchTab('directory');
}
function incidents(){
 // V1111: nuevo registro visual; este formulario anterior queda como respaldo.
 if(window.LJR_INCIDENTS_PRO?.open){window.LJR_INCIDENTS_PRO.open();return}
 const list=read('v105-incidents',[]);
 const m=modal('Incidencias del partido','Bitácora local. No modifica la cédula ni el resultado oficial.','<div class="v105-form"><label><span>Minuto</span><input type="number" min="0" max="200" data-min></label><label><span>Tipo</span><select data-type><option>Gol</option><option>Tarjeta amarilla</option><option>Segunda amarilla</option><option>Tarjeta roja</option><option>Sustitución</option><option>Lesión</option><option>Penal marcado</option><option>Penal fallado</option><option>Gol anulado</option><option>Fuera de juego</option><option>Suspensión por lluvia</option><option>Interrupción</option><option>Reanudación</option><option>Inicio de tiempo</option><option>Final de tiempo</option><option>Observación</option></select></label><label style="grid-column:1/-1"><span>Detalle</span><textarea data-note></textarea></label></div><div class="v105-actions"><button class="v105-btn" data-add>Agregar incidencia</button></div><div class="v105-list" data-list></div>');
 const render=()=>{$('[data-list]',m).innerHTML=list.length?list.map(x=>'<article><b>'+esc(x.min||'—')+'\' · '+esc(x.type)+'</b><small>'+esc(x.note)+'</small></article>').join(''):'<p class="v105-footnote">Sin incidencias locales.</p>'};render();$('[data-add]',m).onclick=()=>{list.push({min:$('[data-min]',m).value,type:$('[data-type]',m).value,note:$('[data-note]',m).value.trim(),at:new Date().toISOString()});write('v105-incidents',list);log('Agregar incidencia local');render()};
}
function motm(){
 const ps=officialPlayers().slice(0,1200);const teams=[...new Set(ps.map(x=>x.team).filter(Boolean))];
 const m=modal('Jugador del partido','Selección local, no oficial. Usa únicamente jugadores registrados disponibles en los datos públicos.','<div class="v105-form"><label><span>Equipo</span><select data-team>'+teams.map(t=>'<option>'+esc(t)+'</option>').join('')+'</select></label><label><span>Jugador</span><select data-player></select></label></div><div class="v105-actions"><button class="v105-btn" data-save>Guardar selección local</button></div><div class="v105-output" data-out></div>');
 const fill=()=>{const t=$('[data-team]',m).value;$('[data-player]',m).innerHTML=ps.filter(p=>p.team===t).map(p=>'<option>'+esc(p.name)+'</option>').join('')};fill();$('[data-team]',m).onchange=fill;$('[data-save]',m).onclick=()=>{const x={team:$('[data-team]',m).value,player:$('[data-player]',m).value,at:new Date().toISOString()};write('v105-motm',x);log('Jugador del partido local');$('[data-out]',m).textContent=x.player+' · '+x.team+' · selección local no oficial'};
}
function calendarGenerator(){
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
 const cats=Object.entries(db.categories||{}).map(([id,c])=>({
   id:String(id),name:c?.name||('Categoría '+id),season:c?.season_id??'',rows:(c?.fixtures||[]).flatMap(b=>Array.isArray(b?.rows)?b.rows:[])
 })).filter(c=>c.name);
 if(!cats.length)return toast('Todavía no cargan los calendarios oficiales');
 const officialUrl=c=>'https://www.juventinorosasliga.com/reportes/jornadas/completo/'+(c?.season!==''?'?temporada='+encodeURIComponent(c.season):'');
 const safeName=s=>String(s||'Liga').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/gi,'_').replace(/^_+|_+$/g,'');
 const labelRow=r=>{
   const j=r?.[1]||'—',home=r?.[2]||'—',away=r?.[6]||'—',venue=r?.[7]||'Por confirmar',when=r?.[8]||'Fecha por confirmar';
   const gh=String(r?.[3]??'').trim(),ga=String(r?.[5]??'').trim(),score=/^\d+$/.test(gh)&&/^\d+$/.test(ga)?' · '+gh+'-'+ga:'';
   return 'J'+j+' · '+when+' · '+home+' vs '+away+score+' · '+venue;
 };
 const m=modal('Calendarios oficiales','Los cruces ya están hechos en Liga Juventino Rosas. Aquí se consultan y se descargan; no se generan partidos nuevos.','<div class="v105-form"><label><span>Categoría</span><select data-cat>'+cats.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('')+'</select></label></div><div class="v105-actions"><button class="v105-btn" data-open>Abrir oficial</button><button class="v105-btn alt" data-pdf>Descargar PDF</button><button class="v105-btn alt" data-img>Descargar imagen</button></div><div class="v105-output" data-out></div>');
 const current=()=>cats.find(c=>c.id===$('[data-cat]',m).value)||cats[0];
 const render=()=>{
   const c=current(),rows=c.rows||[],out=$('[data-out]',m);
   const rowCard=r=>{
     const home=esc(r?.[2]||'—'),away=esc(r?.[6]||'—'),round=esc(r?.[1]||'—');
     const when=esc(r?.[8]||'Fecha por confirmar'),field=esc(r?.[7]||'Campo por confirmar');
     const gh=String(r?.[3]??'').trim(),ga=String(r?.[5]??'').trim();
     const score=/^\d+$/.test(gh)&&/^\d+$/.test(ga)?esc(gh+' - '+ga):'VS';
     return '<article class="v1107-fixture">'+
       '<div class="v1107-fixture-top"><strong>J'+round+'</strong><span>'+when+'</span></div>'+
       '<div class="v1107-fixture-teams"><b>'+home+'</b><em>'+score+'</em><b>'+away+'</b></div>'+
       '<small class="v1107-fixture-field">'+field+'</small></article>';
   };
   out.classList.add('v1107-calendar-output');
   out.innerHTML=rows.length?'<div class="v1107-fixtures">'+rows.map(rowCard).join('')+'</div>':
      '<p class="v1107-empty">No hay cruces oficiales cargados para esta categoría.</p>';
   $('[data-pdf]',m).disabled=!rows.length;
   $('[data-img]',m).disabled=!rows.length;
 };
 const loadJsPDF=()=>new Promise((resolve,reject)=>{
   if(window.jspdf?.jsPDF)return resolve(window.jspdf.jsPDF);
   const old=document.querySelector('script[data-v105-jspdf]');
   if(old){
     old.addEventListener('load',()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('jsPDF no disponible')),{once:true});
     old.addEventListener('error',reject,{once:true});
     return;
   }
   const s=document.createElement('script');
   s.src='https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
   s.async=true;s.dataset.v105Jspdf='1';
   s.onload=()=>window.jspdf?.jsPDF?resolve(window.jspdf.jsPDF):reject(new Error('jsPDF no disponible'));
   s.onerror=reject;document.head.appendChild(s);
 });
 $('[data-cat]',m).onchange=render;
 $('[data-open]',m).onclick=()=>{const c=current();log('Abrir calendario oficial '+c.name);window.open(officialUrl(c),'_blank','noopener,noreferrer')};
 $('[data-pdf]',m).onclick=async()=>{
   const c=current(),rows=c.rows||[];if(!rows.length)return toast('No hay partidos para descargar');
   try{
     const jsPDF=await loadJsPDF(),doc=new jsPDF({orientation:'portrait',unit:'pt',format:'a4'});
     const pageW=doc.internal.pageSize.getWidth(),pageH=doc.internal.pageSize.getHeight(),margin=42,maxW=pageW-margin*2;
     let y=52;
     const header=()=>{
       doc.setFont('helvetica','bold');doc.setFontSize(18);doc.text('Liga Municipal de Futbol Juventino Rosas',margin,y);y+=24;
       doc.setFontSize(14);doc.text('Calendario oficial - '+c.name,margin,y);y+=20;
       doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text('LIGA JUVENTINO ROSAS',margin,y,{maxWidth:maxW});y+=22;
     };
     header();doc.setFontSize(9);
     for(const r of rows){
       const lines=doc.splitTextToSize(labelRow(r),maxW);
       const need=lines.length*12+8;
       if(y+need>pageH-40){doc.addPage();y=52;header();doc.setFontSize(9)}
       doc.text(lines,margin,y);y+=lines.length*12+8;
     }
     doc.save('Calendario_oficial_'+safeName(c.name)+'.pdf');log('Descargar calendario oficial PDF '+c.name);
   }catch(_){
     toast('No se pudo crear el PDF aquí; se abrirá el reporte oficial');
     window.open(officialUrl(c),'_blank','noopener,noreferrer');
   }
 };
 $('[data-img]',m).onclick=()=>{
   const c=current(),rows=c.rows||[];if(!rows.length)return toast('No hay partidos para descargar');
   const width=1080,rowH=54,pad=58,headH=190,height=Math.max(900,headH+pad+rows.length*rowH);
   const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;const ctx=canvas.getContext('2d');
   const g=ctx.createLinearGradient(0,0,width,height);g.addColorStop(0,'#08147f');g.addColorStop(.58,'#07106a');g.addColorStop(1,'#02043f');ctx.fillStyle=g;ctx.fillRect(0,0,width,height);
   ctx.fillStyle='#42dff5';ctx.fillRect(0,0,width,10);
   ctx.fillStyle='#fff';ctx.font='700 42px Arial';ctx.fillText('LIGA JUVENTINO ROSAS',pad,72);
   ctx.font='700 32px Arial';ctx.fillText('CALENDARIO OFICIAL · '+c.name.toUpperCase(),pad,122);
   ctx.fillStyle='#b9c7ff';ctx.font='22px Arial';ctx.fillText('Cruces oficiales publicados en Liga Juventino Rosas',pad,160);
   let y=headH;
   rows.forEach((r,i)=>{
     if(i%2===0){ctx.fillStyle='rgba(255,255,255,.045)';ctx.fillRect(pad-18,y-30,width-pad*2+36,rowH-2)}
     ctx.fillStyle='#48e6f5';ctx.font='700 20px Arial';ctx.fillText('J'+(r?.[1]||'—'),pad,y);
     ctx.fillStyle='#fff';ctx.font='700 22px Arial';ctx.fillText(String(r?.[2]||'—')+'  vs  '+String(r?.[6]||'—'),pad+72,y);
     ctx.fillStyle='#b9c7ff';ctx.font='18px Arial';ctx.textAlign='right';ctx.fillText(String(r?.[8]||'Fecha por confirmar')+' · '+String(r?.[7]||'Por confirmar'),width-pad,y);ctx.textAlign='left';
     y+=rowH;
   });
   canvas.toBlob(b=>{if(!b)return toast('No se pudo crear la imagen');dl(b,'Calendario_oficial_'+safeName(c.name)+'.png');log('Descargar calendario oficial imagen '+c.name)},'image/png');
 };
 render();
}
function csvImport(){
 const m=modal('Importar CSV','Sólo muestra una vista previa local. No escribe equipos, jugadores ni resultados oficiales.','<div class="v105-form"><label style="grid-column:1/-1"><span>Archivo CSV</span><input type="file" accept=".csv,text/csv" data-file></label></div><div class="v105-actions"><button class="v105-btn" data-read>Leer vista previa</button></div><div class="v105-output" data-out></div>');
 $('[data-read]',m).onclick=async()=>{const f=$('[data-file]',m).files?.[0];if(!f)return toast('Selecciona un CSV');const txt=await f.text();write('v105-csv-preview',{name:f.name,text:txt.slice(0,20000),at:new Date().toISOString()});$('[data-out]',m).textContent=txt.slice(0,2500);log('Vista previa CSV local')};
}
function backupExport(){
 const data={generatedAt:new Date().toISOString(),note:'Respaldo local de herramientas; no contiene datos oficiales descargados.',items:{}};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(/^(v105-|v100-|v64-|v60-|ljr-)/.test(k))data.items[k]=localStorage.getItem(k)}dl(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),'Respaldo_local_Liga_Juventino.json');log('Exportar respaldo local');
}
function audit(){
 const list=read('v105-activity',[]);modal('Auditoría de herramientas','Registro local de acciones de V105; no sustituye una auditoría administrativa con backend.','<div class="v105-list">'+(list.length?list.map(x=>{
   const labels={'sponsors':'Patrocinadores','meeting':'Juntas y acuerdos','delegates':'Delegados','officials':'Árbitros y oficiales','incidents':'Incidencias','calendar-generator':'Calendarios oficiales','csv-import':'Importar CSV','backup-export':'Respaldo local','audit':'Auditoría','poll':'Encuestas'};
   const original=String(x.action||''),match=original.match(/^Herramienta de Liga Control:\s*(.+)$/);
   const name=match?'Abrir · '+(labels[match[1]]||match[1]):original;
   return '<article><b>'+esc(name)+'</b><small>'+esc(new Date(x.at).toLocaleString('es-MX'))+'</small></article>';
  }).join(''):'<p class="v105-footnote">Sin actividad registrada.</p>')+'</div>');
}
function sponsors(){
 const legacy=read('v105-sponsors','');
 const list=read('v105-sponsors-v2',[]);
 const body=
  '<div class="v105-sponsor-hero">'+
    '<div class="v105-sponsor-badge">'+icon('sponsor')+'</div>'+
    '<div><small>GESTIÓN COMERCIAL</small><b>Control de patrocinadores</b><span>Acuerdos, vigencias y contactos en un solo lugar.</span></div>'+
  '</div>'+
  '<div class="v105-sponsor-stats">'+
    '<span><b data-sp-total>0</b><small>registrados</small></span>'+
    '<span><b data-sp-active>0</b><small>activos</small></span>'+
    '<span><b>LOCAL</b><small>guardado privado</small></span>'+
  '</div>'+
  '<div class="v105-sponsor-card">'+
    '<div class="v105-sponsor-section-title"><b>Información del patrocinador</b><small>Completa sólo los datos que necesites.</small></div>'+
    '<div class="v105-form v105-sponsor-form">'+
      '<label class="v105-sponsor-wide"><span>Marca / negocio *</span><input data-sp-brand placeholder="Ej. Negocio local" autocomplete="organization"></label>'+
      '<label><span>Tipo</span><select data-sp-type><option>Patrocinador oficial</option><option>Patrocinador de jornada</option><option>Colaborador</option><option>Proveedor</option><option>Apoyo local</option></select></label>'+
      '<label><span>Categoría / alcance</span><select data-sp-scope><option>Toda la liga</option><option>Primera</option><option>Intermedia</option><option>Segunda</option><option>Veteranos 35+</option><option>Veteranos 50+</option><option>Evento especial</option></select></label>'+
      '<label class="v105-sponsor-wide"><span>Estado</span><select data-sp-status><option>Activo</option><option>En negociación</option><option>Pendiente</option><option>Finalizado</option></select></label>'+
      '<label><span>Vigencia desde</span><input data-sp-from type="date"></label>'+
      '<label><span>Vigencia hasta</span><input data-sp-to type="date"></label>'+
      '<label><span>Contacto responsable</span><input data-sp-contact placeholder="Nombre de contacto" autocomplete="name"></label>'+
      '<label><span>Teléfono / WhatsApp</span><input data-sp-phone type="tel" inputmode="tel" autocomplete="tel" placeholder="Opcional"></label>'+
      '<label class="v105-sponsor-wide"><span>Aportación / beneficio</span><input data-sp-deal placeholder="Ej. uniformes, premio, difusión..."></label>'+
    '</div>'+
  '</div>'+
  '<div class="v105-sponsor-card">'+
    '<div class="v105-sponsor-section-title"><b>Espacios autorizados</b><small>Marca dónde puede aparecer.</small></div>'+
    '<div class="v105-sponsor-checks">'+
      '<label><input type="checkbox" value="Playeras / uniformes" data-sp-space><span>Playeras</span></label>'+
      '<label><input type="checkbox" value="Cancha / lonas" data-sp-space><span>Cancha / lonas</span></label>'+
      '<label><input type="checkbox" value="Publicaciones" data-sp-space><span>Publicaciones</span></label>'+
      '<label><input type="checkbox" value="Transmisiones" data-sp-space><span>Transmisiones</span></label>'+
      '<label><input type="checkbox" value="Premiaciones" data-sp-space><span>Premiaciones</span></label>'+
      '<label><input type="checkbox" value="Calendarios / jornadas" data-sp-space><span>Calendarios</span></label>'+
    '</div>'+
    '<label class="v105-sponsor-notes"><span>Notas / acuerdos especiales</span><textarea data-sp-notes placeholder="Condiciones, tamaños de logo, fechas, restricciones, pendientes...">'+esc(legacy)+'</textarea></label>'+
  '</div>'+
  '<div class="v105-sponsor-actions">'+
    '<button type="button" class="v105-btn v105-sponsor-primary" data-sp-save>'+icon('save')+'<span>Guardar patrocinador</span></button>'+
    '<button type="button" class="v105-btn alt" data-sp-copy>'+icon('copy')+'<span>Copiar resumen</span></button>'+
    '<button type="button" class="v105-btn alt" data-sp-clear>'+icon('clear')+'<span>Limpiar</span></button>'+
  '</div>'+
  '<div class="v105-sponsor-saved">'+
    '<div class="v105-sponsor-section-title"><b>Patrocinadores guardados</b><small>Se conservan sólo en este dispositivo.</small></div>'+
    '<div class="v105-sponsor-list" data-sp-list></div>'+
  '</div>';

 const m=modal('Patrocinadores','Gestión privada de acuerdos. Nada se publica automáticamente.',body);
 m.classList.add('v105-sponsors-modal');

 const get=(s)=>$(s,m);
 const spaces=()=>$$('[data-sp-space]',m).filter(x=>x.checked).map(x=>x.value);
 const fields={
   brand:get('[data-sp-brand]'), type:get('[data-sp-type]'), scope:get('[data-sp-scope]'),
   status:get('[data-sp-status]'), from:get('[data-sp-from]'), to:get('[data-sp-to]'),
   contact:get('[data-sp-contact]'), phone:get('[data-sp-phone]'),
   deal:get('[data-sp-deal]'), notes:get('[data-sp-notes]')
 };

 function reset(){
   fields.brand.value='';fields.type.value='Patrocinador oficial';fields.scope.value='Toda la liga';
   fields.status.value='Activo';fields.from.value='';fields.to.value='';fields.contact.value='';
   fields.phone.value='';fields.deal.value='';fields.notes.value='';
   $$('[data-sp-space]',m).forEach(x=>x.checked=false);
   delete m.dataset.editSponsor;
 }
 function summary(x){
   const lines=[
     'PATROCINADOR · '+(x.brand||'Sin nombre'),
     (x.type||'')+' · '+(x.scope||'')+' · '+(x.status||''),
     x.from||x.to?'Vigencia: '+(x.from||'—')+' a '+(x.to||'—'):'',
     x.spaces?.length?'Espacios: '+x.spaces.join(', '):'',
     x.deal?'Aportación / beneficio: '+x.deal:'',
     x.contact?'Contacto: '+x.contact+(x.phone?' · '+x.phone:''):'',
     x.notes?'Notas: '+x.notes:''
   ].filter(Boolean);
   return lines.join('\n');
 }
 function current(){
   return {
     id:m.dataset.editSponsor||String(Date.now()),
     brand:fields.brand.value.trim(), type:fields.type.value, scope:fields.scope.value,
     status:fields.status.value, from:fields.from.value, to:fields.to.value,
     contact:fields.contact.value.trim(), phone:fields.phone.value.trim(),
     deal:fields.deal.value.trim(), spaces:spaces(), notes:fields.notes.value.trim(),
     updatedAt:new Date().toISOString()
   };
 }
 function render(){
   get('[data-sp-total]').textContent=list.length;
   get('[data-sp-active]').textContent=list.filter(x=>x.status==='Activo').length;
   const host=get('[data-sp-list]');
   host.innerHTML=list.length?list.map((x,i)=>
     '<article class="v105-sponsor-item">'+
       '<div class="v105-sponsor-item-top"><div><b>'+esc(x.brand)+'</b><small>'+esc(x.type)+' · '+esc(x.scope)+'</small></div><span class="v105-sponsor-status '+(x.status==='Activo'?'on':'')+'">'+esc(x.status)+'</span></div>'+
       '<p>'+esc(x.deal||'Sin aportación registrada')+'</p>'+
       (x.spaces?.length?'<div class="v105-sponsor-tags">'+x.spaces.map(v=>'<span>'+esc(v)+'</span>').join('')+'</div>':'')+
       '<div class="v105-sponsor-item-meta">'+
         (x.from||x.to?'<small>Vigencia: '+esc(x.from||'—')+' → '+esc(x.to||'—')+'</small>':'<small>Sin vigencia definida</small>')+
         (x.contact?'<small>'+esc(x.contact)+(x.phone?' · '+esc(x.phone):'')+'</small>':'')+
       '</div>'+
       '<div class="v105-sponsor-item-actions"><button type="button" class="v105-btn alt" data-sp-edit="'+i+'" aria-label="Editar '+esc(x.brand)+'">'+icon('edit')+'<span>Editar</span></button><button type="button" class="v105-btn alt danger" data-sp-del="'+i+'" aria-label="Eliminar '+esc(x.brand)+'">'+icon('clear')+'<span>Eliminar</span></button></div>'+
     '</article>'
   ).join(''):'<div class="v105-sponsor-empty"><b>Aún no hay patrocinadores registrados</b><small>Agrega el primero con el formulario de arriba.</small></div>';

   $$('[data-sp-del]',host).forEach(b=>b.onclick=()=>{
     const i=Number(b.dataset.spDel);list.splice(i,1);write('v105-sponsors-v2',list);render();toast('Patrocinador eliminado');
   });
   $$('[data-sp-edit]',host).forEach(b=>b.onclick=()=>{
     const x=list[Number(b.dataset.spEdit)];if(!x)return;
     m.dataset.editSponsor=x.id;
     fields.brand.value=x.brand||'';fields.type.value=x.type||'Patrocinador oficial';fields.scope.value=x.scope||'Toda la liga';
     fields.status.value=x.status||'Activo';fields.from.value=x.from||'';fields.to.value=x.to||'';
     fields.contact.value=x.contact||'';fields.phone.value=x.phone||'';fields.deal.value=x.deal||'';fields.notes.value=x.notes||'';
     $$('[data-sp-space]',m).forEach(c=>c.checked=(x.spaces||[]).includes(c.value));
     fields.brand.scrollIntoView({behavior:'smooth',block:'center'});fields.brand.focus();
   });
 }
 render();

 get('[data-sp-save]').onclick=()=>{
   const x=current();
   if(!x.brand){toast('Escribe el nombre de la marca o negocio');fields.brand.focus();return}
   const idx=list.findIndex(v=>String(v.id)===String(x.id));
   if(idx>=0)list[idx]=x;else list.unshift(x);
   write('v105-sponsors-v2',list);
   write('v105-sponsors',x.notes||'');
   log((idx>=0?'Editar':'Agregar')+' patrocinador: '+x.brand);
   render();reset();toast(idx>=0?'Patrocinador actualizado':'Patrocinador guardado');
 };
 get('[data-sp-clear]').onclick=reset;
 get('[data-sp-copy]').onclick=async()=>{
   const x=current();
   if(!x.brand){toast('Escribe una marca para generar el resumen');return}
   const txt=summary(x);
   try{await navigator.clipboard.writeText(txt);toast('Resumen copiado')}catch(_){
     const ta=document.createElement('textarea');ta.value=txt;document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();toast('Resumen copiado');
   }
 };
}
function shotmap(){
 if(window.LJR_V100_SHOTMAP_OPEN){return window.LJR_V100_SHOTMAP_OPEN()}
 const shots=read('v105-shotmap',[]);
 const m=modal('Shot Map','Toca la cancha para registrar tiros localmente.','<div class="v105-pitch" data-pitch style="transform:none"></div><div class="v105-actions"><button class="v105-btn alt" data-clear>Limpiar</button><button class="v105-btn" data-json>JSON</button></div>');
 const p=$('[data-pitch]',m),render=()=>{p.querySelectorAll('[data-shot]').forEach(x=>x.remove());shots.forEach((s,i)=>{const d=document.createElement('i');d.dataset.shot=i;d.style.cssText='position:absolute;left:'+s.x+'%;top:'+s.y+'%;width:14px;height:14px;border-radius:50%;background:#ffe463;border:2px solid #061058;transform:translate(-50%,-50%);z-index:6';p.appendChild(d)})};render();p.onclick=e=>{if(e.target.dataset.shot!==undefined)return;const r=p.getBoundingClientRect();shots.push({x:+((e.clientX-r.left)/r.width*100).toFixed(1),y:+((e.clientY-r.top)/r.height*100).toFixed(1)});write('v105-shotmap',shots);render()};$('[data-clear]',m).onclick=()=>{shots.splice(0);write('v105-shotmap',shots);render()};$('[data-json]',m).onclick=()=>dl(new Blob([JSON.stringify(shots,null,2)],{type:'application/json'}),'ShotMap_Liga.json');
}


/* V160 — funciones de la app verde adaptadas al diseño azul V105.
   Se abren con los mismos modales/tarjetas existentes y se guardan localmente;
   no cambian datos oficiales. */
function v160Categories(){
 const db=window.LJR_OFFICIAL_DATA||{},out=[];
 Object.entries(db.categories||{}).forEach(([id,x])=>out.push({id,name:x.name||('Categoría '+id),x}));
 return out;
}
function v160Teams(catId=''){
 const db=window.LJR_OFFICIAL_DATA||{},set=new Set();
 const addCat=c=>{
   Object.keys(c?.rosters||{}).forEach(n=>set.add(String(n).trim()));
   (c?.standings||[]).forEach(b=>(b.rows||[]).forEach(r=>r?.[1]&&set.add(String(r[1]).trim())));
   (c?.fixtures||[]).forEach(b=>(b.rows||[]).forEach(r=>{if(r?.[2])set.add(String(r[2]).trim());if(r?.[6])set.add(String(r[6]).trim())}));
 };
 if(catId&&db.categories?.[catId])addCat(db.categories[catId]);else Object.values(db.categories||{}).forEach(addCat);
 try{(window.V66_OFFICIAL_DIRECTORY?.teamList?.()||[]).forEach(t=>{if(!catId||String(t.cat||'')===String(catId))set.add(String(t.name||'').trim())})}catch(_){}
 return [...set].filter(Boolean).sort((a,b)=>a.localeCompare(b,'es'));
}
function v160Players(){
 const db=window.LJR_OFFICIAL_DATA||{},out=[];
 Object.entries(db.categories||{}).forEach(([cat,c])=>Object.entries(c.rosters||{}).forEach(([team,names])=>(Array.isArray(names)?names:[]).forEach(name=>out.push({name,team,cat,category:c.name||''}))));
 try{(window.V66_OFFICIAL_DIRECTORY?.playerList?.()||[]).forEach(p=>{if(p?.name&&!out.some(x=>norm(x.name)===norm(p.name)&&norm(x.team)===norm(p.team)))out.push(p)})}catch(_){}
 return out;
}
function v160FieldOptions(selected=''){
 const raw=['Campo 1 · Unidad Deportiva Sur','Campo 2 · Unidad Deportiva Sur','Campo 3 · Unidad Deportiva Sur','Campo 4 · Emiliano Zapata','Campo Fraccionamiento Comontuoso','Campo San Antonio de Romerillo','Campo de Tavera','Unidad Deportiva Santiago de Cuenda','Campo Cerrito de Gasca','Campo San José de la Montaña','Campo San Juan de la Cruz','Campo de Fútbol de Pozos','Campo Rincón de Centeno','Campo San Julián Tierra Blanca'];
 const fields=window.LJR_FIELDS?.normalizeList?.(raw)||raw;
 const current=window.LJR_FIELDS?.canonical?.(selected)||selected;
 return fields.map(x=>'<option value="'+esc(x)+'" '+(norm(x)===norm(current)?'selected':'')+'>'+esc(x)+'</option>').join('');
}
function registerAlerts(){
 const cats=v160Categories(),old=read('v160-alert-profile',{name:'',email:'',cat:cats[0]?.id||'',team:''});
 const catOptions=cats.map(x=>'<option value="'+esc(x.id)+'" '+(String(old.cat)===String(x.id)?'selected':'')+'>'+esc(x.name)+'</option>').join('');
 const glyph=(name)=>{
   const paths={
     user:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
     mail:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 8 9 6 9-6"/>',
     shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
     users:'<path d="M16 20a4 4 0 0 0-8 0"/><circle cx="12" cy="8" r="4"/><path d="M19 20h2a4 4 0 0 0-3-3.87M5 16.13A4 4 0 0 0 2 20h2"/>',
     bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
     chevron:'<path d="m6 9 6 6 6-6"/>'
   };
   return '<svg class="v920-glyph v920-glyph-'+name+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(paths[name]||'')+'</svg>';
 };
 const m=modal('Registrarse y recibir notificaciones',
   'Personaliza los avisos por categoría y equipo. Tus preferencias se guardan en este dispositivo.',
   '<div class="v105-form v920-register-form">'+
     '<label class="v920-field"><span class="v920-label">Nombre</span>'+glyph('user')+'<input data-r-name type="text" autocomplete="name" value="'+esc(old.name)+'" placeholder="Escribe tu nombre"></label>'+
     '<label class="v920-field"><span class="v920-label">Correo <small>(opcional)</small></span>'+glyph('mail')+'<input type="email" autocomplete="email" data-r-email value="'+esc(old.email)+'" placeholder="correo@ejemplo.com"></label>'+
     '<label class="v920-field"><span class="v920-label">Categoría favorita</span>'+glyph('shield')+'<select data-r-cat>'+catOptions+'</select>'+glyph('chevron')+'</label>'+
     '<label class="v920-field"><span class="v920-label">Equipo favorito</span>'+glyph('users')+'<select data-r-team></select>'+glyph('chevron')+'</label>'+
   '</div>'+
   '<div class="v105-actions v920-register-actions">'+
     '<button type="button" class="v105-btn v920-btn-primary" data-r-save>'+glyph('shield')+'<span>Guardar y activar avisos</span></button>'+
     '<button type="button" class="v105-btn alt v920-btn-secondary" data-r-notif>'+glyph('bell')+'<span data-r-notif-label>Preferencias de notificación</span></button>'+
   '</div>'+
   '<div class="v168-inline-notifications" data-r-inline-notif hidden></div>');
 m.classList.add('v168-account-modal','v920-registration-modal');
 const cat=$('[data-r-cat]',m),team=$('[data-r-team]',m);
 const fill=()=>{const list=v160Teams(cat.value);team.innerHTML=list.map(n=>'<option '+(norm(n)===norm(old.team)?'selected':'')+'>'+esc(n)+'</option>').join('')||'<option>Sin equipos publicados</option>'};fill();
 cat.onchange=()=>{old.team='';fill()};
 $('[data-r-save]',m).onclick=()=>{const v={name:$('[data-r-name]',m).value.trim(),email:$('[data-r-email]',m).value.trim(),cat:cat.value,team:team.value,enabled:true,updatedAt:new Date().toISOString()};write('v160-alert-profile',v);log('Guardar perfil de avisos');toast('Avisos personalizados activados localmente')};
 const notifBox=$('[data-r-inline-notif]',m);
 const getNotif=()=>{try{const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');return Object.assign({goal:true,kickoff:true,halftime:false,final:true,news:true,video:true,fantasy:true,predictor:true,scheduleChanges:true,venueChanges:true},s.notifications||{})}catch(_){return {goal:true,kickoff:true,halftime:false,final:true,news:true,video:true,fantasy:true,predictor:true,scheduleChanges:true,venueChanges:true}}};
 const saveNotif=p=>{let s={};try{s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}')}catch(_){}s.notifications=Object.assign({},s.notifications||{},p);localStorage.setItem('lj-store-v3',JSON.stringify(s))};
 const renderNotif=()=>{
   const p=getNotif(),rows=[
     ['goal','Goles','Avisar cuando cambie el marcador'],
     ['kickoff','Inicio de partido','Aviso al comenzar'],
     ['halftime','Medio tiempo','Aviso al descanso'],
     ['final','Final del partido','Resultado final'],
     ['scheduleChanges','Cambios de horario','Reprogramaciones de última hora'],
     ['venueChanges','Cambios de sede','Cambio de campo o cancha'],
     ['news','Noticias','Comunicados de la Liga'],
     ['video','Nuevos videos','Momentos y contenido'],
     ['fantasy','Fantasy','Novedades de tu equipo Fantasy'],
     ['predictor','Quiniela','Recordatorios del pronóstico']
   ];
   notifBox.innerHTML='<div class="v168-inline-head"><b>Avisos dentro de esta página</b><span>No te manda a otra sección.</span></div>'+
     rows.map(r=>'<label class="v168-notif-row"><span><b>'+esc(r[1])+'</b><small>'+esc(r[2])+'</small></span><input type="checkbox" data-r-pref="'+r[0]+'" '+(p[r[0]]?'checked':'')+'><i></i></label>').join('');
   $$('[data-r-pref]',notifBox).forEach(x=>x.onchange=()=>{saveNotif({[x.dataset.rPref]:x.checked});toast('Preferencia guardada')});
 };
 $('[data-r-notif]',m).onclick=()=>{
   if(notifBox.hidden){renderNotif();notifBox.hidden=false;$('[data-r-notif-label]',m).textContent='Ocultar preferencias';notifBox.scrollIntoView({behavior:'smooth',block:'nearest'})}
   else{notifBox.hidden=true;$('[data-r-notif-label]',m).textContent='Preferencias de notificación'}
 };
}
function scheduleMatch(){
 const cats=v160Categories(),old=read('v160-scheduled-match',{home:'',away:'',date:'',time:'',field:'',cat:cats[0]?.id||'3'});
 const catOptions=cats.map(x=>'<option value="'+esc(x.id)+'" '+(String(old.cat)===String(x.id)?'selected':'')+'>'+esc(x.name)+'</option>').join('');
 const m=modal('Programar partido','Borrador local de programación. No publica ni cambia el calendario oficial.',
  '<div class="v105-form">'+
   '<label><span>Categoría</span><select data-s-cat>'+catOptions+'</select></label>'+
   '<label><span>Local</span><select data-s-home></select></label>'+
   '<label><span>Visitante</span><select data-s-away></select></label>'+
   '<label><span>Fecha</span><input type="date" data-s-date value="'+esc(old.date)+'"></label>'+
   '<label><span>Hora</span><input type="time" data-s-time value="'+esc(old.time)+'"></label>'+
   '<label><span>Cancha</span><select data-s-field>'+v160FieldOptions(old.field)+'</select></label>'+
  '</div><div class="v105-actions"><button class="v105-btn" data-s-save>Programar borrador</button><button class="v105-btn alt" data-s-agenda>Abrir agenda</button></div>');
 m.classList.add('v105-schedule-modal');
 const cat=$('[data-s-cat]',m),home=$('[data-s-home]',m),away=$('[data-s-away]',m);

 const teamList=()=>{
   const seen=new Set();
   return v160Teams(cat.value).map(n=>String(n||'').trim()).filter(n=>{
     const k=norm(n);if(!k||seen.has(k))return false;seen.add(k);return true;
   });
 };
 const optionHtml=(list,selected)=>list.map(n=>'<option value="'+esc(n)+'" '+(norm(n)===norm(selected)?'selected':'')+'>'+esc(n)+'</option>').join('');
 const syncTeams=(changed='init')=>{
   const list=teamList();
   if(!list.length){
     home.innerHTML='<option value="">Sin equipos disponibles</option>';
     away.innerHTML='<option value="">Sin equipos disponibles</option>';
     home.disabled=true;away.disabled=true;return;
   }
   home.disabled=false;away.disabled=list.length<2;

   let hv=home.value||old.home||list[0];
   if(!list.some(n=>norm(n)===norm(hv)))hv=list[0];

   let av=away.value||old.away||'';
   let awayList=list.filter(n=>norm(n)!==norm(hv));
   if(!awayList.some(n=>norm(n)===norm(av)))av=awayList[0]||'';

   let homeList=list.filter(n=>!av||norm(n)!==norm(av));
   if(!homeList.some(n=>norm(n)===norm(hv)))hv=homeList[0]||'';

   awayList=list.filter(n=>norm(n)!==norm(hv));
   if(!awayList.some(n=>norm(n)===norm(av)))av=awayList[0]||'';
   homeList=list.filter(n=>!av||norm(n)!==norm(av));

   home.innerHTML=optionHtml(homeList,hv);
   away.innerHTML=awayList.length?optionHtml(awayList,av):'<option value="">Sin rival disponible</option>';
 };
 syncTeams();

 cat.onchange=()=>{old.home='';old.away='';home.value='';away.value='';syncTeams('category')};
 home.onchange=()=>syncTeams('home');
 away.onchange=()=>syncTeams('away');

 $('[data-s-save]',m).onclick=()=>{
   if(!home.value||!away.value)return toast('Selecciona dos equipos');
   if(norm(home.value)===norm(away.value))return toast('Elige equipos diferentes');
   const v={cat:cat.value,home:home.value,away:away.value,date:$('[data-s-date]',m).value,time:$('[data-s-time]',m).value,field:$('[data-s-field]',m).value,status:'Borrador local',updatedAt:new Date().toISOString()};
   write('v160-scheduled-match',v);log('Programar partido local '+v.home+' vs '+v.away);toast('Borrador de partido guardado')
 };
 $('[data-s-agenda]',m).onclick=()=>{m.remove();go('agendaBuilder')};
}
function newSanction(){
 const cats=v160Categories(),rawPlayers=v160Players(),old=read('v160-sanction-draft',{player:'',reason:'',reasonDetail:'',matches:1,cat:'',team:'',sanctionType:'matches',until:''});
 const seen=new Set();
 const players=rawPlayers.filter(p=>{
   const key=norm(p?.name)+'|'+norm(p?.team)+'|'+String(p?.cat||'');
   if(!p?.name||seen.has(key))return false;
   seen.add(key);return true;
 }).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||''),'es'));
 const reasonOptions=[
   ['yellow-accum','Acumulación de tarjetas amarillas'],
   ['double-yellow','Doble amonestación / doble amarilla'],
   ['straight-red','Tarjeta roja directa / expulsión'],
   ['serious-foul','Juego brusco grave'],
   ['violent','Conducta violenta / agresión'],
   ['fight','Riña o participación en pelea'],
   ['insults','Insultos, ofensas o lenguaje inapropiado'],
   ['threats','Amenazas o intimidación'],
   ['unsporting','Conducta antideportiva'],
   ['referee','Reclamos u ofensas al árbitro / cuerpo arbitral'],
   ['leave-field','Abandono del terreno o negativa a continuar'],
   ['ineligible','Alineación indebida / suplantación'],
   ['other','Otro motivo']
 ];
 const sanctionTypes=[
   ['yellow','Amonestación · tarjeta amarilla'],
   ['red','Expulsión · tarjeta roja'],
   ['matches','Suspensión por partidos'],
   ['until','Suspensión hasta una fecha'],
   ['indefinite','Suspensión indefinida'],
   ['lifetime','Suspensión permanente / de por vida']
 ];
 const knownReason=reasonOptions.some(x=>x[0]===old.reason)?old.reason:(old.reason?'other':'');
 const oldDetail=old.reasonDetail||(knownReason==='other'?old.reason:'');
 const catOptions='<option value="">Todas las categorías</option>'+cats.map(x=>'<option value="'+esc(x.id)+'" '+(String(old.cat||'')===String(x.id)?'selected':'')+'>'+esc(x.name)+'</option>').join('');
 const typeOptions=sanctionTypes.map(x=>'<option value="'+x[0]+'" '+(String(old.sanctionType||'matches')===x[0]?'selected':'')+'>'+x[1]+'</option>').join('');
 const reasonHtml='<option value="">Selecciona un motivo</option>'+reasonOptions.map(x=>'<option value="'+x[0]+'" '+(knownReason===x[0]?'selected':'')+'>'+esc(x[1])+'</option>').join('');

 const m=modal('Nueva sanción','Borrador disciplinario local. No modifica sanciones oficiales hasta que la Liga lo publique.',
  '<div class="v105-form">'+
   '<label style="grid-column:1/-1"><span>Buscar jugador</span><input type="search" data-x-search placeholder="Escribe nombre del jugador"></label>'+
   '<label><span>Categoría</span><select data-x-cat>'+catOptions+'</select></label>'+
   '<label><span>Equipo</span><select data-x-team><option value="">Todos los equipos</option></select></label>'+
   '<label style="grid-column:1/-1"><span>Jugador registrado</span><select data-x-player></select><small data-x-count style="display:block;margin-top:7px;opacity:.72"></small></label>'+
   '<label style="grid-column:1/-1"><span>Tipo de sanción</span><select data-x-type>'+typeOptions+'</select></label>'+
   '<label style="grid-column:1/-1"><span>Motivo</span><select data-x-reason>'+reasonHtml+'</select></label>'+
   '<label style="grid-column:1/-1" data-x-reason-detail-wrap hidden><span>Detalle del motivo</span><input data-x-reason-detail value="'+esc(oldDetail)+'" placeholder="Describe el motivo"></label>'+
   '<label style="grid-column:1/-1" data-x-matches-wrap><span>Partidos de suspensión</span><input type="number" min="1" max="999" inputmode="numeric" data-x-matches value="'+esc(old.matches||1)+'"></label>'+
   '<label style="grid-column:1/-1" data-x-until-wrap hidden><span>Suspensión hasta</span><input type="date" data-x-until value="'+esc(old.until||'')+'"></label>'+
  '</div><div class="v105-actions"><button class="v105-btn" data-x-save>Guardar borrador</button><button class="v105-btn alt" data-x-png>Guardar PNG</button><button class="v105-btn alt" data-x-discipline>Abrir disciplina oficial</button></div>');
 m.classList.add('v639-sanction-modal');

 const search=$('[data-x-search]',m),cat=$('[data-x-cat]',m),team=$('[data-x-team]',m),player=$('[data-x-player]',m),count=$('[data-x-count]',m);
 const type=$('[data-x-type]',m),reason=$('[data-x-reason]',m),detailWrap=$('[data-x-reason-detail-wrap]',m),detail=$('[data-x-reason-detail]',m);
 const matchesWrap=$('[data-x-matches-wrap]',m),matches=$('[data-x-matches]',m),untilWrap=$('[data-x-until-wrap]',m),until=$('[data-x-until]',m);

 const visibleByCat=()=>players.filter(p=>!cat.value||String(p.cat||'')===String(cat.value));
 const syncTeams=()=>{
   const current=team.value||old.team||'';
   const teams=[...new Set(visibleByCat().map(p=>String(p.team||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es'));
   team.innerHTML='<option value="">Todos los equipos</option>'+teams.map(n=>'<option value="'+esc(n)+'" '+(norm(n)===norm(current)?'selected':'')+'>'+esc(n)+'</option>').join('');
   if(current&&!teams.some(n=>norm(n)===norm(current)))team.value='';
 };
 const syncPlayers=()=>{
   const q=norm(search.value);
   const selected=player.value||old.player||'';
   let list=visibleByCat().filter(p=>(!team.value||norm(p.team)===norm(team.value))&&(!q||norm(p.name).includes(q)));
   player.innerHTML=list.length?list.map(p=>'<option value="'+esc(p.name)+'" data-team="'+esc(p.team||'')+'" data-cat="'+esc(p.cat||'')+'" '+(norm(p.name)===norm(selected)?'selected':'')+'>'+esc(p.name)+' · '+esc(p.team||'Sin equipo')+'</option>').join(''):'<option value="">Sin jugadores con estos filtros</option>';
   player.disabled=!list.length;
   count.textContent=list.length===1?'1 jugador encontrado':list.length+' jugadores encontrados';
 };
 const syncDuration=()=>{
   const v=type.value;
   matchesWrap.hidden=!(v==='matches'||v==='red');
   untilWrap.hidden=v!=='until';
   if(v==='yellow')matches.value='1';
 };
 const syncReason=()=>{detailWrap.hidden=reason.value!=='other'};

 const labelFor=(list,key)=>list.find(x=>x[0]===key)?.[1]||key||'—';
 const collect=()=>{
   if(!player.value){toast('Selecciona un jugador');return null}
   if(!reason.value){toast('Selecciona el motivo');return null}
   if(reason.value==='other'&&!detail.value.trim()){toast('Escribe el detalle del motivo');return null}
   if((type.value==='matches'||type.value==='red')&&(Number(matches.value)||0)<1){toast('Indica los partidos de suspensión');return null}
   if(type.value==='until'&&!until.value){toast('Selecciona la fecha final');return null}
   const selectedOption=player.options[player.selectedIndex];
   const catId=selectedOption?.dataset?.cat||cat.value||'';
   return {
     player:player.value,
     team:selectedOption?.dataset?.team||team.value||'',
     cat:catId,
     category:cats.find(x=>String(x.id)===String(catId))?.name||'Sin categoría',
     sanctionType:type.value,
     sanctionLabel:labelFor(sanctionTypes,type.value),
     reason:reason.value,
     reasonLabel:reason.value==='other'?detail.value.trim():labelFor(reasonOptions,reason.value),
     reasonDetail:reason.value==='other'?detail.value.trim():'',
     matches:(type.value==='matches'||type.value==='red')?(Number(matches.value)||1):0,
     until:type.value==='until'?until.value:'',
     status:'Borrador local',
     updatedAt:new Date().toISOString()
   };
 };

 const wrapCanvas=(ctx,text,x,y,maxWidth,lineHeight,maxLines=4)=>{
   const words=String(text||'—').split(/\s+/);let line='',lines=[];
   words.forEach(word=>{
     const test=line?line+' '+word:word;
     if(ctx.measureText(test).width>maxWidth&&line){lines.push(line);line=word}
     else line=test;
   });
   if(line)lines.push(line);
   lines=lines.slice(0,maxLines);
   lines.forEach((ln,i)=>ctx.fillText(ln,x,y+i*lineHeight));
   return y+lines.length*lineHeight;
 };
 const savePng=v=>{
   const canvas=document.createElement('canvas');canvas.width=1080;canvas.height=1350;
   const ctx=canvas.getContext('2d');
   const bg=ctx.createLinearGradient(0,0,0,1350);bg.addColorStop(0,'#0b23a8');bg.addColorStop(.5,'#07106f');bg.addColorStop(1,'#03083f');
   ctx.fillStyle=bg;ctx.fillRect(0,0,1080,1350);
   ctx.strokeStyle='#49e8f2';ctx.lineWidth=4;ctx.strokeRect(42,42,996,1266);
   ctx.fillStyle='#42e6f0';ctx.fillRect(42,42,996,12);
   ctx.fillStyle='#fff';ctx.font='800 36px Arial';ctx.fillText('LIGA JUVENTINO ROSAS',72,115);
   ctx.fillStyle='#45e6f1';ctx.font='900 66px Arial';ctx.fillText('NUEVA SANCIÓN',72,205);
   ctx.fillStyle='#b8c7ea';ctx.font='28px Arial';ctx.fillText('Borrador disciplinario local',72,252);

   const box=(label,value,y)=>{
     ctx.fillStyle='rgba(255,255,255,.055)';ctx.strokeStyle='rgba(106,227,247,.30)';ctx.lineWidth=2;
     ctx.beginPath();ctx.roundRect(72,y,936,150,24);ctx.fill();ctx.stroke();
     ctx.fillStyle='#8fa9df';ctx.font='700 23px Arial';ctx.fillText(label.toUpperCase(),102,y+42);
     ctx.fillStyle='#fff';ctx.font='700 34px Arial';
     wrapCanvas(ctx,value,102,y+90,870,40,2);
   };
   box('Jugador',v.player,310);
   box('Equipo',v.team||'Sin equipo',485);
   box('Categoría',v.category,660);
   box('Tipo de sanción',v.sanctionLabel,835);
   box('Motivo',v.reasonLabel,1010);

   let duration='Sin suspensión por partidos';
   if(v.matches)duration=v.matches+' partido'+(v.matches===1?'':'s')+' de suspensión';
   if(v.until)duration='Hasta '+v.until;
   if(v.sanctionType==='indefinite')duration='Suspensión indefinida';
   if(v.sanctionType==='lifetime')duration='Suspensión permanente / de por vida';
   if(v.sanctionType==='yellow')duration='Amonestación';
   ctx.fillStyle='#45e6f1';ctx.font='800 28px Arial';ctx.fillText(duration,72,1225);
   ctx.fillStyle='#9fb0dc';ctx.font='22px Arial';
   ctx.fillText('Generado '+new Date().toLocaleString('es-MX')+' · Documento local',72,1280);

   canvas.toBlob(blob=>{
     if(!blob)return toast('No se pudo generar el PNG');
     const name='sancion-'+norm(v.player).replace(/\s+/g,'-')+'.png';
     dl(blob,name);toast('PNG guardado');
   },'image/png',1);
 };

 syncTeams();syncPlayers();syncDuration();syncReason();
 cat.onchange=()=>{old.player='';old.team='';syncTeams();syncPlayers()};
 team.onchange=()=>{old.player='';syncPlayers()};
 search.oninput=()=>syncPlayers();
 type.onchange=syncDuration;
 reason.onchange=syncReason;

 $('[data-x-save]',m).onclick=()=>{
   const v=collect();if(!v)return;
   write('v160-sanction-draft',v);
   log('Guardar borrador de sanción '+v.player+' · '+v.sanctionType);
   toast('Borrador de sanción guardado');
 };
 $('[data-x-png]',m).onclick=()=>{const v=collect();if(v)savePng(v)};
 $('[data-x-discipline]',m).onclick=()=>{m.remove();go('discipline')};
}
function tvPanel(){
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{};
 const cats=(db&&typeof db==='object'&&db.categories&&typeof db.categories==='object')?db.categories:{};
 const cat=cats?.['3']||{};
 const rowArray=v=>Array.isArray(v)?v:[];
 const stand=rowArray(cat?.standings?.[0]?.rows);
 const fix=rowArray(cat?.fixtures?.[0]?.rows);
 const now=Date.now(),parse=v=>{const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():NaN};
 const list=fix.map(r=>({r,t:parse(r?.[8])})).filter(x=>Number.isFinite(x.t)).sort((a,b)=>a.t-b.t);
 const live=list.find(x=>now>=x.t&&now<x.t+120*60000);
 const current=live||list.find(x=>x.t>now)||list[list.length-1]||{r:[],t:NaN};
 const next=list.find(x=>Number.isFinite(current.t)&&x.t>current.t)||null;
 const r=current.r||[],elapsed=Number.isFinite(current.t)?Math.max(0,(now-current.t)/60000):0;
 const phase=live?(elapsed<45?'1T · '+Math.max(1,Math.floor(elapsed)+1)+"'":elapsed<60?'DESCANSO':elapsed<105?'2T · '+Math.min(90,45+Math.floor(elapsed-60)+1)+"'":"2T · 90+'"):'PROGRAMADO';
 const score=(/^\d+$/.test(String(r?.[3]||''))&&/^\d+$/.test(String(r?.[5]||'')))?String(r[3])+' – '+String(r[5]):'VS';
 const top=stand.slice(0,3);
 const scorers=Object.values(cats).flatMap(c=>rowArray(c?.scorers?.[0]?.rows).filter(x=>x?.[1]&&x?.[2]&&/^\d+$/.test(String(x?.[3]||''))).map(x=>({name:x[1],team:x[2],goals:Number(x[3])||0}))).sort((a,b)=>b.goals-a.goals);

 const logoFor=name=>{
   try{const u=window.LJR_OFFICIAL_API?.getLogo?.(name)||window.LJR_TEAM_LOGOS?.get?.(name)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';if(u)return u}catch(_){}
   const hit=Object.entries(db.team_logos||{}).find(([k])=>norm(k)===norm(name))?.[1];
   if(typeof hit==='string')return /^https?:/i.test(hit)?hit:GREEN+String(hit).replace(/^\.?\//,'');
   const p=hit?.local||hit?.source||hit?.url||'';
   return p?( /^https?:/i.test(p)?p:GREEN+String(p).replace(/^\.?\//,'') ):'';
 };
 const initials=name=>String(name||'JR').split(/\s+/).filter(Boolean).map(x=>x[0]).join('').slice(0,3).toUpperCase();
 const logoHtml=name=>{const u=logoFor(name);return u?'<img src="'+esc(u)+'" alt="'+esc(name)+'" loading="lazy" decoding="async">':'<span>'+esc(initials(name))+'</span>'};
 const all=[];
 Object.entries(cats).forEach(([cid,c])=>{
   rowArray(c?.fixtures).forEach(g=>rowArray(g?.rows).forEach((row,ri)=>{
     if(!row?.[2]||!row?.[6])return;
     const hs=String(row?.[3]??'').trim(),as=String(row?.[5]??'').trim(),played=/^\d+$/.test(hs)&&/^\d+$/.test(as);
     all.push({key:cid+':'+String(row?.[0]??ri),cat:cid,category:c?.name||'Liga Juventino',home:String(row[2]),away:String(row[6]),hs:played?hs:'',as:played?as:'',played,time:parse(row?.[8]),date:String(row?.[8]||''),field:String(row?.[7]||'Campo por confirmar')});
   }));
 });
 all.sort((a,b)=>(Number.isFinite(a.time)?a.time:9e15)-(Number.isFinite(b.time)?b.time:9e15));
 const playedAll=all.filter(x=>x.played).slice(-12).reverse();
 const upcomingAll=all.filter(x=>!x.played&&( !Number.isFinite(x.time)||x.time>=now-2*60*60000)).slice(0,12);
 const featured=(playedAll.length?playedAll:all).slice(0,10);
 const teams=officialTeams().slice(0,12);

 const mediaCard=(m,label,portrait=false)=>{
   const result=m.played?m.hs+' - '+m.as:'VS';
   return '<button class="'+(portrait?'v426-tv-portrait':'v426-tv-card')+'" type="button" data-tv-feed-match="'+esc(m.key)+'">'+
     '<span class="'+(portrait?'v426-tv-portrait-art':'v426-tv-art')+'">'+
       '<span class="v426-tv-logo">'+logoHtml(m.home)+'</span>'+
       '<span class="v426-tv-logo">'+logoHtml(m.away)+'</span>'+
       '<strong>'+esc(result)+'</strong><i>▶</i><em>'+esc(label)+'</em>'+
     '</span>'+
     '<span class="v426-tv-copy"><b>'+esc(m.home)+' vs '+esc(m.away)+'</b><small>'+esc(m.category)+(m.date?' · '+esc(m.date):'')+'</small></span>'+
   '</button>';
 };
 const clubCard=(t,i)=>'<button class="v426-tv-card" type="button" data-tv-feed-team="'+esc(t.name)+'">'+
   '<span class="v426-tv-art v426-tv-club-art"><span class="v426-tv-club-logo">'+logoHtml(t.name)+'</span><i>▶</i><em>CLUB</em></span>'+
   '<span class="v426-tv-copy"><b>'+esc(t.name)+'</b><small>'+esc(t.category||'Liga Juventino Rosas')+'</small></span></button>';
 const rail=(title,sub,body,more=true)=>'<section class="v426-tv-section"><header><span><h3>'+esc(title)+'</h3><p>'+esc(sub)+'</p></span>'+(more?'<button type="button" data-tv-feed-video>Ver más ›</button>':'')+'</header><div class="v426-tv-row">'+body+'</div></section>';
 const fallback='<div class="v426-tv-empty">El contenido aparecerá aquí cuando haya datos oficiales disponibles.</div>';
 const feed=
   '<div class="v426-tv-feed" aria-label="Contenido de Liga TV">'+
    rail('Ver en vivo en Liga Juventino','Partidos próximos y transmisiones de la Liga',(upcomingAll.length?upcomingAll.slice(0,7).map((m,i)=>mediaCard(m,'PRÓXIMO')).join(''):fallback))+
    rail('Liga Juventino Rosas','Partidos, resultados y mejores momentos',(featured.length?featured.slice(0,7).map(m=>mediaCard(m,m.played?'MEJORES MOMENTOS':'PARTIDO')).join(''):fallback))+
    rail('Videos oficiales de clubes','Contenido por equipo registrado',(teams.length?teams.slice(0,8).map(clubCard).join(''):fallback))+
    rail('Liga TV Videos','Videos verticales y momentos destacados','<div class="v426-tv-portrait-row">'+(featured.length?featured.slice(0,7).map(m=>mediaCard(m,'LIGA TV',true)).join(''):fallback)+'</div>',false)+
    rail('Lo más visto','Selección destacada de Liga TV',(featured.length?featured.slice().reverse().slice(0,7).map(m=>mediaCard(m,'DESTACADO')).join(''):fallback))+
    rail('Resúmenes más recientes','Últimos partidos con marcador oficial',(playedAll.length?playedAll.slice(0,7).map(m=>mediaCard(m,'RESUMEN')).join(''):fallback))+
   '</div>';

 let old=document.querySelector('.v160-tv-layer');if(old)old.remove();
 const layer=document.createElement('div');layer.className='v160-tv-layer';layer.innerHTML=
  '<header class="v408-tv-topbar" aria-label="Barra superior de Modo TV">'+
    '<button class="v408-tv-back" type="button" aria-label="Regresar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5M8 12h12"/></svg></button>'+
    '<span class="v408-tv-trophy" aria-hidden="true"></span>'+
    '<button class="v408-tv-profile" type="button" aria-label="Perfil"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6"/><circle cx="12" cy="8.1" r="2.85"/><path d="M5.35 19.15c1.55-3.35 3.76-4.9 6.65-4.9s5.1 1.55 6.65 4.9"/></svg></button>'+
  '</header>'+
  '<section class="v160-tv-board" role="dialog" aria-modal="true">'+
   '<article class="v160-tv-main-card">'+
    '<div class="v160-tv-live '+(live?'is-live':'')+'">'+(live?'● EN VIVO · '+esc(phase):'PRÓXIMO PARTIDO')+'</div>'+
    '<h2>'+esc(r?.[2]||'Por confirmar')+' <span>vs</span> '+esc(r?.[6]||'Por confirmar')+'</h2>'+
    '<div class="v160-tv-score">'+esc(score)+'</div>'+
    '<p class="v160-tv-meta">'+esc(r?.[7]||'Cancha por confirmar')+' · Jornada '+esc(r?.[1]||'—')+(r?.[8]?' · '+esc(r[8]):'')+'</p>'+
    '<button class="v160-tv-close" type="button">× Salir de TV</button>'+
   '</article>'+
   '<article class="v160-tv-info-card v160-tv-next"><small>SIGUIENTE</small><b>'+(next?esc(next.r?.[2]||'')+' vs '+esc(next.r?.[6]||''):'Sin siguiente partido publicado')+'</b><span>'+(next?esc(next.r?.[8]||'')+' · '+esc(next.r?.[7]||'Cancha por confirmar'):'')+'</span></article>'+
   '<article class="v160-tv-info-card v160-tv-table"><small>TABLA</small>'+ (top.length?top.map((x,i)=>'<b class="'+(i===0?'is-first':'')+'">'+(i+1)+'. '+esc(x[1])+' · '+esc(x[9])+' pts</b>').join(''):'<b>Sin tabla publicada</b>') +'</article>'+
   '<article class="v160-tv-info-card v160-tv-scorer"><small>GOLEADOR</small><b>'+(scorers[0]?esc(scorers[0].name)+' · '+esc(scorers[0].goals)+' goles':'Sin goleo publicado')+'</b><span>'+(scorers[0]?esc(scorers[0].team):'')+'</span></article>'+
   '<div class="v160-tv-actions"><button data-tv-match>Match Center</button><button data-tv-video>Vídeos</button></div>'+
   feed+
  '</section>';
 document.body.appendChild(layer);
 document.body.classList.add('v160-tv-open');
 const close=()=>{layer.remove();document.body.classList.remove('v160-tv-open')};
 $('.v160-tv-close',layer).onclick=close;
 const tvBack=$('.v408-tv-back',layer);if(tvBack)tvBack.onclick=close;
 const tvProfile=$('.v408-tv-profile',layer);if(tvProfile)tvProfile.onclick=()=>{close();go('profile')};
 $('[data-tv-match]',layer).onclick=()=>{close();go('v4-matchcenter')};
 $('[data-tv-video]',layer).onclick=()=>{close();go('video')};
 $$('[data-tv-feed-video]',layer).forEach(b=>b.onclick=()=>{close();go('video')});
 $$('[data-tv-feed-match]',layer).forEach(b=>b.onclick=()=>{close();go('v4-matchcenter')});
 $$('[data-tv-feed-team]',layer).forEach(b=>b.onclick=()=>{
   const name=b.dataset.tvFeedTeam||'';
   try{localStorage.setItem('v62-team-name',name);localStorage.setItem('v27-selected-team',norm(name).replace(/\s+/g,'-'))}catch(_){}
   close();go('teamDetail');
 });
 layer.addEventListener('click',e=>{if(e.target===layer)close()});
}

function tvPanelFallback(){
 let old=document.querySelector('.v160-tv-layer');if(old)old.remove();
 const layer=document.createElement('div');
 layer.className='v160-tv-layer';
 layer.innerHTML=
  '<header class="v408-tv-topbar" aria-label="Barra superior de Modo TV">'+
    '<button class="v408-tv-back" type="button" aria-label="Regresar"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5M8 12h12"/></svg></button>'+
    '<span class="v408-tv-trophy" aria-hidden="true"></span>'+
  '</header>'+
  '<section class="v160-tv-board" role="dialog" aria-modal="true">'+
    '<article class="v160-tv-main-card">'+
      '<div class="v160-tv-live">LIGA TV</div>'+
      '<h2>Modo TV</h2>'+
      '<div class="v160-tv-score">TV</div>'+
      '<p class="v160-tv-meta">Partidos, tabla y datos oficiales en pantalla.</p>'+
      '<button class="v160-tv-close" type="button">× Salir de TV</button>'+
    '</article>'+
    '<div class="v160-tv-actions"><button data-tv-match>Match Center</button><button data-tv-video>Vídeos</button></div>'+
  '</section>';
 document.body.appendChild(layer);
 document.body.classList.add('v160-tv-open');
 const close=()=>{layer.remove();document.body.classList.remove('v160-tv-open')};
 layer.querySelector('.v160-tv-close')?.addEventListener('click',close);
 layer.querySelector('.v408-tv-back')?.addEventListener('click',close);
 layer.querySelector('[data-tv-match]')?.addEventListener('click',()=>{close();go('v4-matchcenter')});
 layer.querySelector('[data-tv-video]')?.addEventListener('click',()=>{close();go('video')});
}
function openTvSafe(){
 try{
   if(window.LJR_V440_TELEVISADOS&&typeof window.LJR_V440_TELEVISADOS.open==='function'){
     window.LJR_V440_TELEVISADOS.open();
     return;
   }
 }catch(_){}
 location.hash='#/televisados';
 setTimeout(()=>{
   if(route()!=='televisados')location.hash='#/video';
 },220);
}
function act(a){
 if(a==='meeting')meeting();else if(a==='poll')poll();else if(a==='fanzone')fanzone();else if(a==='delegates')delegates();else if(a==='officials')officials();else if(a==='incidents')incidents();else if(a==='motm')motm();else if(a==='calendar-generator')calendarGenerator();else if(a==='csv-import')csvImport();else if(a==='backup-export')backupExport();else if(a==='audit')audit();else if(a==='sponsors')sponsors();else if(a==='shotmap')shotmap();
 else if(a==='register-alerts')registerAlerts();else if(a==='schedule-match')scheduleMatch();else if(a==='new-sanction')newSanction();else if(a==='tv-panel')openTvSafe();else if(a==='open-standings')openCompetitionStandings();
}
/* Acceso directo para Liga Control: reutiliza exactamente las herramientas existentes.
   Lista explícita: no publica datos oficiales ni concede privilegios. */
const V1104_CONTROL_TOOLS=new Set(['sponsors','meeting','delegates','officials','incidents','calendar-generator','csv-import','backup-export','audit','poll','schedule-match','new-sanction','motm','register-alerts']);
window.LJR_V105_OPEN_TOOL=function(name){
 if(!V1104_CONTROL_TOOLS.has(name))return false;
 try{log('Herramienta de Liga Control: '+name);act(name);return true}
 catch(error){console.error('[Liga Control] No se pudo abrir '+name,error);return false}
};
function bind(root){
 $$('[data-v105-route]',root).forEach(b=>b.onclick=e=>{
   e?.preventDefault?.();
   e?.stopPropagation?.();
   const tab=b.dataset.v105HistoryTab||'';
   if(tab){openHistoryTab(tab);return}
   go(b.dataset.v105Route);
 });
 $$('[data-v105-action]',root).forEach(b=>b.onclick=()=>{log('Herramienta '+b.dataset.v105Action);act(b.dataset.v105Action)});
 bindTactics(root);
 root.querySelectorAll('[data-v105-motion]').forEach(v=>{
   v.muted=true;v.loop=true;v.playsInline=true;
   const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!document.hidden){v.play().catch(()=>{})}else v.pause()}),{threshold:.08}):null;
   if(io)io.observe(v);else v.play().catch(()=>{});
 });
}
function supported(r){
 if(r==='competition'&&window.CompetitionController)return false;
 return ['home','more','competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly','leagueData','bracketBuilder','tableExport','teams','players','teamDetail','match','matchday','stats','scorers','rankings','v38Stats','video','moments','history','historyLog','tactics','jrControl','news','v38Weekly','notifications'].includes(r);
}
let timer=0;
function mount(){
 const screen=$('#screen');if(!screen)return;
 const r=route(),existing=$('#v105-bottom',screen);
 const isWeekly=(r==='news'||r==='v38Weekly');

 if(r==='bracketBuilder'){
   let shouldOpen=false;
   try{shouldOpen=sessionStorage.getItem('v105-open-bracket-builder')==='1'}catch(_){}
   if(shouldOpen){
     try{sessionStorage.removeItem('v105-open-bracket-builder')}catch(_){}
     setTimeout(openBracketBuilder,220);
   }
 }
 if(r==='competition'){
   let shouldOpen=false;
   try{shouldOpen=sessionStorage.getItem('v105-open-competition-fixtures')==='1'}catch(_){}
   if(shouldOpen){
     try{sessionStorage.removeItem('v105-open-competition-fixtures')}catch(_){}
     setTimeout(openCompetitionFixtures,170);
   }
 }
 if(!supported(r)){if(existing)existing.remove();return}
 if(existing&&existing.dataset.v105Route!==r)existing.remove();
 let sec=$('#v105-bottom',screen);

 if(r==='moments'){
   const host=$('.v26-moments-page',screen)||$('.v26-moments-original',screen);
   if(!host)return;
   if(!sec){
     const html=block(r);if(!html)return;
     const wrap=document.createElement('div');wrap.innerHTML=html;
     sec=wrap.firstElementChild;if(!sec)return;
     host.insertAdjacentElement('afterend',sec);
     bind(sec);
   }else if(sec.parentElement!==screen||sec.previousElementSibling!==host){
     host.insertAdjacentElement('afterend',sec);
   }
   return;
 }

 /* V517 — en news/v38Weekly se coloca UNA SOLA VEZ.
    Antes V105 exigía ser siempre el último hijo de #screen; al mismo tiempo
    V413 intentaba ponerse antes de V105. Sus MutationObservers se activaban
    mutuamente y el contenido cambiaba de sitio durante el desplazamiento. */
 const placeWeeklyOnce=(node)=>{
   const v413=screen.querySelector(':scope > #v413-page-design[data-v413-route="'+r+'"]')||
              screen.querySelector(':scope > #v413-page-design');
   if(v413&&v413.parentElement===screen){
     v413.insertAdjacentElement('afterend',node);
     return;
   }
   const native=screen.querySelector(':scope > .v60-tool-page.v63-page.v188-weekly-page')||
                screen.querySelector(':scope > .v60-tool-page');
   if(native&&native.parentElement===screen){
     native.insertAdjacentElement('afterend',node);
   }else{
     screen.appendChild(node);
   }
 };

 if(!sec){
   const html=block(r);if(!html)return;
   if(isWeekly){
     const wrap=document.createElement('div');wrap.innerHTML=html;
     sec=wrap.firstElementChild;if(!sec)return;
     placeWeeklyOnce(sec);
     bind(sec);
   }else{
     screen.insertAdjacentHTML('beforeend',html);sec=$('#v105-bottom',screen);bind(sec);
   }
 }else if(isWeekly){
   return; // congelar posición; no appendChild durante scroll/mutations
 }else if(screen.lastElementChild!==sec){
   screen.appendChild(sec);
 }
}
document.addEventListener('click',e=>{
 const b=e.target?.closest?.('[data-v105-action="tv-panel"],[data-v105-route="televisados"]');
 if(!b)return;
 e.preventDefault();
 e.stopImmediatePropagation();
 openTvSafe();
},true);
function schedule(ms=80){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(100));
window.addEventListener('load',()=>schedule(200));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)$$('[data-v105-motion]').forEach(v=>v.play().catch(()=>{}))});
const screen=$('#screen');if(screen)new MutationObserver(()=>schedule(90)).observe(screen,{childList:true,subtree:false});
schedule(150);setTimeout(()=>schedule(0),1200);setTimeout(()=>schedule(0),3500);
window.LJR_V105={build:BUILD,mount,officialTeams,officialPlayers,openTv:openTvSafe,registerAlerts,scheduleMatch,newSanction};
})();