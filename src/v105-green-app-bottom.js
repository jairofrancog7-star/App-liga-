/* V105 — Lleva los cuadros/funciones de Liga_Futbol (verde) a App-liga (azul).
   Principio estricto: TODO se anexa al FINAL de la pantalla correspondiente.
   Nunca inserta arriba ni en medio; no sustituye contenido existente. */
(function(){
'use strict';
if(window.__LJR_V105_GREEN_BOTTOM__)return;
window.__LJR_V105_GREEN_BOTTOM__=true;

const BUILD='20260922-more-history-matchcenter-v158';
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
  alert:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3h.01"/>',
  share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>'
 };
 return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.home)+'</svg>';
}
function card(c){
 return '<button type="button" class="v105-card" '+(c.route?'data-v105-route="'+esc(c.route)+'"':'data-v105-action="'+esc(c.action)+'"')+'>'+
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
function go(r){
 if(!r)return;
 log('Abrir '+r);

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
 const m=document.createElement('div');m.className='v105-modal';m.innerHTML='<section class="v105-dialog" role="dialog" aria-modal="true"><button class="v105-close" aria-label="Cerrar">×</button><h3>'+esc(title)+'</h3><p>'+esc(desc)+'</p>'+body+'</section>';document.body.appendChild(m);
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
 {icon:'video',title:'Modo TV',sub:'Partido, tabla y datos oficiales en pantalla',action:'tv-panel'},
 {icon:'match',title:'Partidos de hoy',sub:'Jornada y resultados',route:'competition'},
 {icon:'table',title:'Tabla · Primera Fuerza',sub:'Clasificación oficial',route:'leagueData'},
 {icon:'stats',title:'Top goleadores',sub:'Goleo y rendimiento',route:'scorers'},
 {icon:'news',title:'Lo importante de la semana',sub:'Avisos y novedades',route:'v38Weekly'},
 {icon:'alert',title:'Cambios de horario y sedes',sub:'Reprograma y crea aviso para compartir',route:'scheduleChanges'},
 {icon:'calendar',title:'Junta semanal de liga · martes',sub:'Todos los martes · asistencia, orden del día y acuerdos',action:'meeting'},
 {icon:'video',title:'Semifinales, finales y momentos',sub:'Galería recuperada',route:'moments'},
 {icon:'history',title:'Historial',sub:'Temporadas, palmarés y archivo',route:'history'},
 {icon:'match',title:'Match Center real',sub:'Partido oficial, marcador y contexto',route:'v4-matchcenter'},
 {icon:'tactics',title:'Tácticas 2D / 3D',sub:'Pizarra azul interactiva',route:'tactics'},
 {icon:'trophy',title:'Copa + escenarios',sub:'Liguilla y simulación',route:'bracketBuilder'},
 {icon:'fire',title:'Pulso de afición',sub:'1 reacción por visitante o perfil',action:'fanzone'},
 {icon:'poll',title:'Pronóstico y encuesta',sub:'Participa con tu liga',action:'poll'}
];
const COMP_CARDS=[
 {icon:'match',title:'Partidos y jornadas',sub:'Todos, próximos y resultados',route:'competition'},
 {icon:'calendar',title:'Calendario mensual',sub:'Jornadas por fecha',route:'v4-calendar'},
 {icon:'table',title:'Tabla de posiciones',sub:'Datos oficiales',route:'leagueData'},
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
 {icon:'video',title:'Modo TV',sub:'Resumen oficial para pantalla',action:'tv-panel'},
 {icon:'team',title:'Equipos',sub:'Ver equipos registrados',route:'teams'},
 {icon:'users',title:'Jugadores',sub:'Ver jugadores registrados',route:'players'},
 {icon:'trophy',title:'Liguilla',sub:'Cuadro eliminatorio',route:'bracketBuilder'},
 {icon:'news',title:'Avisos',sub:'Noticias y comunicados',route:'news'},
 {icon:'video',title:'Videos',sub:'Momentos y archivo',route:'moments'},
 {icon:'history',title:'Historial',sub:'Temporadas, palmarés e históricos',route:'history'},
 {icon:'match',title:'Match Center real',sub:'Partido oficial, marcador y contexto',route:'v4-matchcenter'},
 {icon:'admin',title:'JR Control',sub:'Centro operativo',route:'jrControl'},
 {icon:'card',title:'Alta rápida',sub:'Registro y credencial de jugador',route:'credentialBuilder'},
 {icon:'history',title:'Actividad reciente',sub:'Bitácora local de herramientas',action:'audit'},
 {icon:'calendar',title:'Calendario y resultados',sub:'Partidos y jornadas oficiales',route:'competition'},
 {icon:'stats',title:'Goleo',sub:'Ranking de anotadores',route:'scorers'},
 {icon:'timer',title:'Centro de jornada',sub:'Checklist operativo',route:'matchday'},
 {icon:'timer',title:'Barra de jornada',sub:'Accesos rápidos de operación',route:'matchday'},
 {icon:'fire',title:'Fan Zone',sub:'Reacciones locales',action:'fanzone'},
 {icon:'target',title:'Shot Map',sub:'Mapa local de tiros',action:'shotmap'},
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
 {icon:'sponsor',title:'Patrocinadores',sub:'Notas locales de patrocinio',action:'sponsors'},
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
 else if(r==='moments'){k='MOMENTOS DE LA LIGA';title='Videos y momentos';desc='Cuartos, semifinales, finales y archivo audiovisual de la Liga.';cards=[{icon:'video',title:'Momentos',sub:'Contenido de la Liga',route:'moments'},{icon:'history',title:'Historial',sub:'Temporadas y archivo',route:'history'},{icon:'share',title:'Compartir jornada',sub:'Publicaciones',route:'publications'}];asset='v38-soccer-liguilla.mp4';html+=gallery()}
 else if(r==='video'){k='LIGA JUVENTINO TV';title='Videos y momentos';desc='Archivo audiovisual de la Liga.';cards=[{icon:'video',title:'Momentos',sub:'Contenido de la Liga',route:'moments'},{icon:'history',title:'Historial',sub:'Temporadas y archivo',route:'history'},{icon:'share',title:'Compartir jornada',sub:'Publicaciones',route:'publications'}];asset='v38-soccer-liguilla.mp4';html+=gallery()}
 else if(r==='history'){title='Historial · temporadas y palmarés';desc='Accesos de la app verde agrupados debajo del historial actual.';cards=[{icon:'history',title:'Temporada actual',sub:'Información vigente',route:'leagueData'},{icon:'trophy',title:'Palmarés',sub:'Campeones e historia',route:'history'},{icon:'history',title:'Históricos',sub:'Equipos y temporadas anteriores',route:'history'},{icon:'video',title:'Finales y momentos',sub:'Archivo audiovisual',route:'moments'}];asset='v38-soccer-liguilla.mp4'}
 else if(r==='tactics'){title='Táctica 3D · versión azul';desc='Tablero táctil inspirado en la función de Liga_Futbol; se agrega al final y guarda sólo en este dispositivo.';cards=[];asset='v38-fix10-tactics-motion.mp4';html+=tacticsBoard()}
 else if(r==='matchday'){k='CENTRO DE JORNADA';title='Partido y operación';desc='Accesos complementarios debajo del centro de jornada, sin mover el contenido principal.';cards=[
   {icon:'match',title:'Match Center real',sub:'Abrir partido oficial',route:'v4-matchcenter'},
   {icon:'calendar',title:'Calendario y resultados',sub:'Jornadas oficiales',route:'competition'},
   {icon:'field',title:'Clima y campos',sub:'Sede y condiciones',route:'weatherFields'},
   {icon:'rule',title:'Cédulas',sub:'Acta y PDF del partido',route:'cedulas'},
   {icon:'history',title:'Historial',sub:'Temporadas y archivo',route:'history'}
 ];asset='v38-soccer-matchday.mp4'}
 else if(r==='v4-matchcenter'||r==='matchCenter'||r==='match-center'){k='MATCH CENTER';title='Más herramientas del partido';desc='Complementos del Match Center colocados al final para no alterar su pantalla principal.';cards=[
   {icon:'timer',title:'Centro de jornada',sub:'Checklist operativo',route:'matchday'},
   {icon:'tactics',title:'Alineaciones y tácticas',sub:'Preparar formación',route:'tactics'},
   {icon:'rule',title:'Acta arbitral digital',sub:'Cédula / PDF',route:'cedulas'},
   {icon:'field',title:'Clima y campo',sub:'Pronóstico y sede',route:'weatherFields'},
   {icon:'history',title:'Historial',sub:'Archivo de temporadas',route:'history'}
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
 return '<section class="v105-bottom" id="v105-bottom" data-v105-route="'+esc(r)+'">'+head(k,title,desc)+motion(asset,'LIGA JUVENTINO · AZUL','FÚTBOL QUE SE MUEVE','Animaciones de la app verde adaptadas visualmente al diseño azul y colocadas abajo.')+html+(cards.length?'<div class="v105-grid">'+cards.map(card).join('')+'</div>':'')+'<p class="v105-footnote">Estas funciones se anexan debajo de la página. Los simuladores, notas, encuestas y directorios locales no cambian datos oficiales.</p></section>';
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
 const host=$('[data-v105-tactics]',root),pitch=$('[data-v105-pitch]',host);if(!host||!pitch)return;
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

function poll(){
 const p=read('v105-poll',{si:0,no:0,despues:0});
 const m=modal('Encuesta de la Liga','Participación local en este dispositivo; no es una votación oficial.','<div class="v105-grid"><button class="v105-card" data-v="si"><span class="v105-icon">'+icon('shield')+'</span><span class="v105-copy"><b>Sí</b><small>'+p.si+' votos locales</small></span><span class="v105-arrow">›</span></button><button class="v105-card" data-v="no"><span class="v105-icon">'+icon('alert')+'</span><span class="v105-copy"><b>No</b><small>'+p.no+' votos locales</small></span><span class="v105-arrow">›</span></button><button class="v105-card" data-v="despues"><span class="v105-icon">'+icon('calendar')+'</span><span class="v105-copy"><b>Revisar después</b><small>'+p.despues+' votos locales</small></span><span class="v105-arrow">›</span></button></div>');
 $$('[data-v]',m).forEach(b=>b.onclick=()=>{p[b.dataset.v]=(p[b.dataset.v]||0)+1;write('v105-poll',p);log('Encuesta '+b.dataset.v);b.querySelector('small').textContent=p[b.dataset.v]+' votos locales'});
}
function fanzone(){
 const api=window.LJR_FAN_ZONE_ONE_VOTE;
 if(!api)return toast('Fan Zone todavía está cargando');
 const map={gol:'goal',liga:'heart',aplauso:'clap',fuego:'fire'};
 const back={goal:'gol',heart:'liga',clap:'aplauso',fire:'fuego'};
 const snap=api.snapshot(),p=snap.counts;
 const m=modal(
   'Fan Zone',
   'Una reacción por visitante o perfil registrado. Puedes cambiarla sin duplicar tu voto.',
   '<p class="v105-fan-rule" data-fan-status></p><div class="v105-grid">'+
   [['gol','Gol ⚽'],['liga','Liga 💙'],['aplauso','Aplauso 👏'],['fuego','Fuego 🔥']].map(x=>
     '<button class="v105-card" data-r="'+x[0]+'"><span class="v105-icon">'+icon('fire')+'</span><span class="v105-copy"><b>'+x[1]+'</b><small>'+Number(p[map[x[0]]]||0)+' reacciones</small></span><span class="v105-arrow">›</span></button>'
   ).join('')+'</div>'
 );
 const render=()=>{
   const z=api.snapshot();
   $$('[data-r]',m).forEach(b=>{
     const k=map[b.dataset.r],small=b.querySelector('small');
     if(small)small.textContent=Number(z.counts[k]||0)+' reacciones';
     b.classList.toggle('is-selected',z.choice===k);
     b.setAttribute('aria-pressed',z.choice===k?'true':'false');
   });
   const status=$('[data-fan-status]',m);
   if(status)status.textContent=z.choice
     ?'Tu reacción ya está registrada. Puedes cambiarla sin sumar otro voto.'
     :(z.profile?'Perfil registrado: puedes elegir una sola reacción.':'Visitante: puedes elegir una sola reacción en este dispositivo.');
 };
 $$('[data-r]',m).forEach(b=>b.onclick=()=>{
   const r=api.vote(map[b.dataset.r]);render();
   toast(r.same?'Ya registraste esa reacción':(r.previous?'Reacción cambiada · sigue contando como un solo voto':'Reacción registrada · 1 por visitante/perfil'));
 });
 render();
}
function delegates(){
 const list=read('v105-delegates',[]);
 const m=modal('Delegados / encargados','Contactos privados sólo en este dispositivo; no se publican en GitHub.','<div class="v105-form"><label><span>Nombre</span><input data-n></label><label><span>Equipo</span><input data-t></label><label><span>Teléfono</span><input data-p inputmode="tel"></label></div><div class="v105-actions"><button class="v105-btn" data-add>Agregar</button></div><div class="v105-list" data-list></div>');
 const render=()=>{const h=$('[data-list]',m);h.innerHTML=list.length?list.map((d,i)=>'<article><b>'+esc(d.name)+' · '+esc(d.team)+'</b><small>'+esc(d.phone)+'</small><button class="v105-btn alt" data-del="'+i+'">Quitar</button></article>').join(''):'<p class="v105-footnote">Todavía no hay delegados guardados.</p>';$$('[data-del]',h).forEach(b=>b.onclick=()=>{list.splice(Number(b.dataset.del),1);write('v105-delegates',list);render()})};render();
 $('[data-add]',m).onclick=()=>{const name=$('[data-n]',m).value.trim(),team=$('[data-t]',m).value.trim(),phone=$('[data-p]',m).value.trim();if(!name||!phone)return toast('Agrega nombre y teléfono');list.push({name,team,phone});write('v105-delegates',list);log('Agregar delegado local');render()};
}
function officials(){
 const list=read('v105-officials',[]);
 const m=modal('Árbitros y oficiales','Directorio operativo local. No se publica en el sitio.','<div class="v105-form"><label><span>Nombre</span><input data-n></label><label><span>Función</span><select data-role><option>Árbitro</option><option>Asistente</option><option>Responsable de campo</option><option>Delegado</option></select></label><label><span>Teléfono</span><input data-p inputmode="tel"></label></div><div class="v105-actions"><button class="v105-btn" data-add>Agregar</button></div><div class="v105-list" data-list></div>');
 const render=()=>{$('[data-list]',m).innerHTML=list.length?list.map(x=>'<article><b>'+esc(x.name)+' · '+esc(x.role)+'</b><small>'+esc(x.phone)+'</small></article>').join(''):'<p class="v105-footnote">Sin oficiales guardados.</p>'};render();$('[data-add]',m).onclick=()=>{const name=$('[data-n]',m).value.trim(),role=$('[data-role]',m).value,phone=$('[data-p]',m).value.trim();if(!name)return toast('Agrega nombre');list.push({name,role,phone});write('v105-officials',list);log('Agregar oficial local');render()};
}
function incidents(){
 const list=read('v105-incidents',[]);
 const m=modal('Incidencias del partido','Bitácora local. No modifica la cédula ni el resultado oficial.','<div class="v105-form"><label><span>Minuto</span><input type="number" min="0" max="200" data-min></label><label><span>Tipo</span><select data-type><option>Gol</option><option>Tarjeta</option><option>Cambio</option><option>Lesión</option><option>Observación</option></select></label><label style="grid-column:1/-1"><span>Detalle</span><textarea data-note></textarea></label></div><div class="v105-actions"><button class="v105-btn" data-add>Agregar incidencia</button></div><div class="v105-list" data-list></div>');
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
   const gh=r?.[3],ga=r?.[5],score=(gh!==undefined&&ga!==undefined&&(String(gh)!=='-'||String(ga)!=='-'))?' · '+String(gh)+'-'+String(ga):'';
   return 'J'+j+' · '+when+' · '+home+' vs '+away+score+' · '+venue;
 };
 const m=modal('Calendarios oficiales','Los cruces ya están hechos en AdminFut. Aquí se consultan y se descargan; no se generan partidos nuevos.','<div class="v105-form"><label><span>Categoría</span><select data-cat>'+cats.map(c=>'<option value="'+esc(c.id)+'">'+esc(c.name)+'</option>').join('')+'</select></label></div><div class="v105-actions"><button class="v105-btn" data-open>Abrir oficial</button><button class="v105-btn alt" data-pdf>Descargar PDF</button><button class="v105-btn alt" data-img>Descargar imagen</button></div><div class="v105-output" data-out></div>');
 const current=()=>cats.find(c=>c.id===$('[data-cat]',m).value)||cats[0];
 const render=()=>{
   const c=current(),rows=c.rows||[],out=$('[data-out]',m);
   out.textContent=rows.length?rows.map(labelRow).join('\n'):'No hay cruces oficiales cargados para esta categoría en los datos actuales.';
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
       doc.setFont('helvetica','normal');doc.setFontSize(9);doc.text('Fuente: AdminFut · '+officialUrl(c),margin,y,{maxWidth:maxW});y+=22;
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
   ctx.fillStyle='#b9c7ff';ctx.font='22px Arial';ctx.fillText('Cruces oficiales publicados en AdminFut',pad,160);
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
 const list=read('v105-activity',[]);modal('Auditoría de herramientas','Registro local de acciones de V105; no sustituye una auditoría administrativa con backend.','<div class="v105-list">'+(list.length?list.map(x=>'<article><b>'+esc(x.action)+'</b><small>'+esc(new Date(x.at).toLocaleString('es-MX'))+'</small></article>').join(''):'<p class="v105-footnote">Sin actividad registrada.</p>')+'</div>');
}
function sponsors(){
 const old=read('v105-sponsors','');
 const m=modal('Patrocinadores','Notas locales para preparar espacios de patrocinio. No publica marcas automáticamente.','<div class="v105-form"><label style="grid-column:1/-1"><span>Notas / nombres autorizados</span><textarea data-s>'+esc(old)+'</textarea></label></div><div class="v105-actions"><button class="v105-btn" data-save>Guardar localmente</button></div>');$('[data-save]',m).onclick=()=>{write('v105-sponsors',$('[data-s]',m).value);log('Actualizar notas de patrocinadores');toast('Notas guardadas localmente')};
}
function shotmap(){
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
 const fields=['Campo 1 (Empastado)','Campo 2','Campo 3','Campo 4','Fraccionamiento','Romerillo','Tavera','Cuenda','Cerrito de Gasca','San José de la Montaña','San Juan de la Cruz','Pozos'];
 return fields.map(x=>'<option '+(norm(x)===norm(selected)?'selected':'')+'>'+esc(x)+'</option>').join('');
}
function registerAlerts(){
 const cats=v160Categories(),old=read('v160-alert-profile',{name:'',email:'',cat:cats[0]?.id||'',team:''});
 const catOptions=cats.map(x=>'<option value="'+esc(x.id)+'" '+(String(old.cat)===String(x.id)?'selected':'')+'>'+esc(x.name)+'</option>').join('');
 const m=modal('Registrarse y recibir notificaciones','Perfil local para personalizar avisos en la app azul. No sustituye una cuenta segura cuando se conecte backend.',
   '<div class="v105-form">'+
    '<label><span>Nombre</span><input data-r-name value="'+esc(old.name)+'" placeholder="Tu nombre"></label>'+
    '<label><span>Correo (opcional)</span><input type="email" data-r-email value="'+esc(old.email)+'" placeholder="correo@ejemplo.com"></label>'+
    '<label><span>Categoría favorita</span><select data-r-cat>'+catOptions+'</select></label>'+
    '<label><span>Equipo favorito</span><select data-r-team></select></label>'+
   '</div><div class="v105-actions"><button class="v105-btn" data-r-save>Guardar y activar avisos</button><button class="v105-btn alt" data-r-notif>Preferencias de notificación</button></div>');
 const cat=$('[data-r-cat]',m),team=$('[data-r-team]',m);
 const fill=()=>{const list=v160Teams(cat.value);team.innerHTML=list.map(n=>'<option '+(norm(n)===norm(old.team)?'selected':'')+'>'+esc(n)+'</option>').join('')||'<option>Sin equipos publicados</option>'};fill();
 cat.onchange=()=>{old.team='';fill()};
 $('[data-r-save]',m).onclick=()=>{const v={name:$('[data-r-name]',m).value.trim(),email:$('[data-r-email]',m).value.trim(),cat:cat.value,team:team.value,enabled:true,updatedAt:new Date().toISOString()};write('v160-alert-profile',v);log('Guardar perfil de avisos');toast('Avisos personalizados activados localmente')};
 $('[data-r-notif]',m).onclick=()=>{m.remove();go('notifications')};
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
 const cat=$('[data-s-cat]',m),home=$('[data-s-home]',m),away=$('[data-s-away]',m);
 const fill=()=>{const list=v160Teams(cat.value),opts=(sel)=>list.map(n=>'<option '+(norm(n)===norm(sel)?'selected':'')+'>'+esc(n)+'</option>').join('');home.innerHTML=opts(old.home);away.innerHTML=opts(old.away)};fill();
 cat.onchange=()=>{old.home='';old.away='';fill()};
 $('[data-s-save]',m).onclick=()=>{if(home.value===away.value)return toast('Elige equipos diferentes');const v={cat:cat.value,home:home.value,away:away.value,date:$('[data-s-date]',m).value,time:$('[data-s-time]',m).value,field:$('[data-s-field]',m).value,status:'Borrador local',updatedAt:new Date().toISOString()};write('v160-scheduled-match',v);log('Programar partido local '+v.home+' vs '+v.away);toast('Borrador de partido guardado')};
 $('[data-s-agenda]',m).onclick=()=>{m.remove();go('agendaBuilder')};
}
function newSanction(){
 const players=v160Players(),old=read('v160-sanction-draft',{player:'',reason:'',matches:1});
 const m=modal('Nueva sanción','Borrador disciplinario local. No modifica sanciones oficiales hasta que la Liga lo publique.',
  '<div class="v105-form">'+
   '<label style="grid-column:1/-1"><span>Jugador registrado</span><select data-x-player>'+players.map(p=>'<option value="'+esc(p.name)+'" '+(norm(p.name)===norm(old.player)?'selected':'')+'>'+esc(p.name)+' · '+esc(p.team||'')+'</option>').join('')+'</select></label>'+
   '<label><span>Motivo</span><input data-x-reason value="'+esc(old.reason)+'" placeholder="Motivo"></label>'+
   '<label><span>Partidos de suspensión</span><input type="number" min="1" max="99" data-x-matches value="'+esc(old.matches||1)+'"></label>'+
  '</div><div class="v105-actions"><button class="v105-btn" data-x-save>Guardar borrador</button><button class="v105-btn alt" data-x-discipline>Abrir disciplina oficial</button></div>');
 $('[data-x-save]',m).onclick=()=>{const v={player:$('[data-x-player]',m).value,reason:$('[data-x-reason]',m).value.trim(),matches:Number($('[data-x-matches]',m).value)||1,status:'Borrador local',updatedAt:new Date().toISOString()};write('v160-sanction-draft',v);log('Guardar borrador de sanción '+v.player);toast('Borrador de sanción guardado')};
 $('[data-x-discipline]',m).onclick=()=>{m.remove();go('discipline')};
}
function tvPanel(){
 const db=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||{},cat=db.categories?.['3']||{},stand=cat.standings?.[0]?.rows||[],fix=cat.fixtures?.[0]?.rows||[];
 const now=Date.now(),parse=v=>{const m=String(v||'').match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})/);return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():NaN};
 const list=fix.map(r=>({r,t:parse(r?.[8])})).filter(x=>Number.isFinite(x.t)).sort((a,b)=>a.t-b.t);
 const live=list.find(x=>now>=x.t&&now<x.t+120*60000);
 const current=live||list.find(x=>x.t>now)||list[list.length-1]||{r:[],t:NaN};
 const next=list.find(x=>Number.isFinite(current.t)&&x.t>current.t)||null;
 const r=current.r||[],elapsed=Number.isFinite(current.t)?Math.max(0,(now-current.t)/60000):0;
 const phase=live?(elapsed<45?'1T · '+Math.max(1,Math.floor(elapsed)+1)+"'":elapsed<60?'DESCANSO':elapsed<105?'2T · '+Math.min(90,45+Math.floor(elapsed-60)+1)+"'":"2T · 90+'"):'PROGRAMADO';
 const score=(/^\d+$/.test(String(r?.[3]||''))&&/^\d+$/.test(String(r?.[5]||'')))?String(r[3])+' – '+String(r[5]):'VS';
 const top=stand.slice(0,3);
 const scorers=Object.values(db.categories||{}).flatMap(c=>(c.scorers?.[0]?.rows||[]).filter(x=>x?.[1]&&x?.[2]&&/^\d+$/.test(String(x?.[3]||''))).map(x=>({name:x[1],team:x[2],goals:Number(x[3])||0}))).sort((a,b)=>b.goals-a.goals);
 let old=document.querySelector('.v160-tv-layer');if(old)old.remove();
 const layer=document.createElement('div');layer.className='v160-tv-layer';layer.innerHTML=
  '<section class="v160-tv-board" role="dialog" aria-modal="true">'+
   '<button class="v160-tv-close" type="button">× Salir de TV</button>'+
   '<div class="v160-tv-live '+(live?'is-live':'')+'">'+(live?'● EN VIVO · '+esc(phase):'PRÓXIMO PARTIDO')+'</div>'+
   '<h2>'+esc(r?.[2]||'Por confirmar')+' <span>vs</span> '+esc(r?.[6]||'Por confirmar')+'</h2>'+
   '<div class="v160-tv-score">'+esc(score)+'</div>'+
   '<p class="v160-tv-meta">'+esc(r?.[7]||'Cancha por confirmar')+' · Jornada '+esc(r?.[1]||'—')+' · '+esc(r?.[8]||'Fecha por confirmar')+'</p>'+
   '<article><small>SIGUIENTE</small><b>'+(next?esc(next.r?.[2]||'')+' vs '+esc(next.r?.[6]||''):'Sin siguiente partido publicado')+'</b><span>'+(next?esc(next.r?.[8]||'')+' · '+esc(next.r?.[7]||'Cancha por confirmar'):'')+'</span></article>'+
   '<article><small>TABLA · PRIMERA FUERZA</small>'+ (top.length?top.map((x,i)=>'<b>'+(i+1)+'. '+esc(x[1])+' · '+esc(x[9])+' pts</b>').join(''):'<b>Sin tabla publicada</b>') +'</article>'+
   '<article><small>GOLEADOR PUBLICADO</small><b>'+(scorers[0]?esc(scorers[0].name)+' · '+esc(scorers[0].goals)+' goles':'Sin goleo publicado')+'</b><span>'+(scorers[0]?esc(scorers[0].team):'')+'</span></article>'+
   '<div class="v160-tv-actions"><button data-tv-match>Match Center</button><button data-tv-video>Vídeos</button></div>'+
  '</section>';
 document.body.appendChild(layer);
 const close=()=>layer.remove();
 $('.v160-tv-close',layer).onclick=close;
 $('[data-tv-match]',layer).onclick=()=>{close();go('v4-matchcenter')};
 $('[data-tv-video]',layer).onclick=()=>{close();go('video')};
 layer.addEventListener('click',e=>{if(e.target===layer)close()});
}
function act(a){
 if(a==='meeting')meeting();else if(a==='poll')poll();else if(a==='fanzone')fanzone();else if(a==='delegates')delegates();else if(a==='officials')officials();else if(a==='incidents')incidents();else if(a==='motm')motm();else if(a==='calendar-generator')calendarGenerator();else if(a==='csv-import')csvImport();else if(a==='backup-export')backupExport();else if(a==='audit')audit();else if(a==='sponsors')sponsors();else if(a==='shotmap')shotmap();
 else if(a==='register-alerts')registerAlerts();else if(a==='schedule-match')scheduleMatch();else if(a==='new-sanction')newSanction();else if(a==='tv-panel')tvPanel();
}
function bind(root){
 $$('[data-v105-route]',root).forEach(b=>b.onclick=()=>go(b.dataset.v105Route));
 $$('[data-v105-action]',root).forEach(b=>b.onclick=()=>{log('Herramienta '+b.dataset.v105Action);act(b.dataset.v105Action)});
 bindTactics(root);
 root.querySelectorAll('[data-v105-motion]').forEach(v=>{
   v.muted=true;v.loop=true;v.playsInline=true;
   const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&!document.hidden){v.play().catch(()=>{})}else v.pause()}),{threshold:.08}):null;
   if(io)io.observe(v);else v.play().catch(()=>{});
 });
}
function supported(r){
 return ['home','more','competition','v4-calendar','calendar','monthlyCalendar','calendarMonthly','leagueData','bracketBuilder','tableExport','teams','players','teamDetail','match','v4-matchcenter','matchCenter','match-center','matchday','stats','scorers','rankings','v38Stats','moments','video','history','tactics','jrControl','news','v38Weekly','notifications'].includes(r);
}
let timer=0;
function mount(){
 const screen=$('#screen');if(!screen)return;
 const r=route(),existing=$('#v105-bottom',screen);
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
   const host=$('.v26-moments-original',screen);
   if(!host)return;
   if(!sec){
     const html=block(r);if(!html)return;
     host.insertAdjacentHTML('beforeend',html);sec=$('#v105-bottom',host);bind(sec);
   }else if(sec.parentElement!==host||host.lastElementChild!==sec){
     host.appendChild(sec);
   }
   return;
 }
 if(!sec){
   const html=block(r);if(!html)return;
   screen.insertAdjacentHTML('beforeend',html);sec=$('#v105-bottom',screen);bind(sec);
 }else if(screen.lastElementChild!==sec){
   screen.appendChild(sec);
 }
}
function schedule(ms=80){clearTimeout(timer);timer=setTimeout(mount,ms)}
window.addEventListener('hashchange',()=>schedule(100));
window.addEventListener('load',()=>schedule(200));
document.addEventListener('visibilitychange',()=>{if(!document.hidden)$$('[data-v105-motion]').forEach(v=>v.play().catch(()=>{}))});
const screen=$('#screen');if(screen)new MutationObserver(()=>schedule(90)).observe(screen,{childList:true,subtree:false});
schedule(150);setTimeout(()=>schedule(0),1200);setTimeout(()=>schedule(0),3500);
window.LJR_V105={build:BUILD,mount,officialTeams,officialPlayers,openTv:tvPanel,registerAlerts,scheduleMatch,newSanction};
})();