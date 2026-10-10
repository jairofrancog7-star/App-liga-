/* V563 — Liga Control propio.
   Usa como referencia de funciones a otras apps, pero todo vive dentro de Liga Juventino. */
(function(){
'use strict';
if(window.__LJR_V563_LIGA_CONTROL__)return;
window.__LJR_V563_LIGA_CONTROL__=true;

const BUILD='v563-liga-control-own-app';
const ACTIONS='https://github.com/jairofrancog7-star/App-liga-/actions/workflows/android-debug.yml';
const APK='https://github.com/jairofrancog7-star/App-liga-/releases/download/android-latest/Liga-Juventino.apk';
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const go=r=>{const gate=window.LJR_ADMIN_ROUTE;if(gate?.routes?.has?.(r)&&typeof gate.open==='function'){gate.open(r);return}location.hash='#/'+r};
const toast=msg=>{let n=$('.v562-toast');if(n)n.remove();n=document.createElement('div');n.className='v562-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),2300)};
function countRows(blocks){return Array.isArray(blocks)?blocks.reduce((n,b)=>n+(Array.isArray(b?.rows)?b.rows.length:0),0):0}
function countRoster(c){let players=0,teams=0;for(const raw of Object.values(c?.rosters||{})){teams++;if(Array.isArray(raw))players+=raw.length;else if(raw&&typeof raw==='object')players+=(raw.players||raw.rows||[]).length}return {players,teams}}
function allSummary(){
 const db=window.LJR_OFFICIAL_DATA||{},out={players:0,teams:0,standings:0,scorers:0,cards:0,suspensions:0,cats:0};
 for(const c of Object.values(db.categories||{})){out.cats++;const x=countRoster(c);out.players+=x.players;out.teams+=x.teams;out.standings+=countRows(c.standings);out.scorers+=countRows(c.scorers);out.cards+=countRows(c.cards);out.suspensions+=countRows(c.suspensions)}
 return out;
}
/* Iconos lineales homogéneos; los accesos de instalación admiten sus glifos originales. */
const V563_ICON_PATHS={
  positions:'<path d="M4 20V11h4v9M10 20V5h4v15M16 20v-7h4v7"/>',
  goal:'<circle cx="12" cy="12" r="9"/><path d="m12 6 4 3-1.5 5H9.5L8 9zM4.8 8l3.2 1m-1.5 8 3-3m8 3-3-3"/>',
  yellow:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M10 7h4"/>',
  ban:'<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-13 5 2 2 5-5"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  register:'<circle cx="9" cy="8" r="3"/><path d="M3.5 20v-2a5.5 5.5 0 0 1 11 0v2M18 8v8m-4-4h8"/>',
  id:'<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M5 16c.4-2 5.6-2 6 0m4-6h4m-4 4h4"/>',
  matchday:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m5 5 2 2 4-4"/>',
  referee:'<path d="M5 9a7 7 0 1 1 14 0v6a7 7 0 0 1-14 0V9Z"/><path d="M9 4v5l6 2m-8 5 3 3m4-1 3-3"/>',
  document:'<path d="M6 2h9l4 4v16H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v5h5M8 12h7m-7 4h7"/>',
  team:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2m3-13a3 3 0 0 1 0 6m-1 2a5 5 0 0 1 4 5"/>',
  player:'<circle cx="12" cy="7.5" r="3.5"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/>',
  report:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2h6v2m-7 6h8m-8 4h8m-8 4h5"/>',
  book:'<path d="M4 4.5A3.5 3.5 0 0 1 7.5 3H20v17H7.5A3.5 3.5 0 0 0 4 21V4.5Z"/><path d="M4 17.5A3.5 3.5 0 0 1 7.5 14H20M9 7h7"/>',
  publish:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>',
  weather:'<path d="M6 18h12a4 4 0 0 0 0-8 6 6 0 0 0-11-1 4.5 4.5 0 0 0-1 9Z"/><path d="M12 2v2m-8 3-1.5-1"/>',
  account:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  permission:'<path d="M12 2 20 6v6c0 5-3.2 8-8 10-4.8-2-8-5-8-10V6Z"/><path d="m8.5 12 2.5 2.5 5-5"/>',
  notice:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/>',
  reschedule:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-11 4-3 3 3 3m-3-3h10"/>',
  sponsor:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18m-15 5h5m5 0h2"/>',
  meeting:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m5 5h3m3 0h5"/>',
  delegate:'<circle cx="8" cy="8" r="3"/><path d="M2 21v-2a6 6 0 0 1 12 0v2M17 8h5m-5 4h5m-5 4h5"/>',
  officials:'<path d="M12 3 20 7v5c0 5-3 8-8 9-5-1-8-4-8-9V7Z"/><path d="m9 12 2 2 4-4"/>',
  incidents:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3v.2"/>',
  backup:'<path d="M12 3v11m-4-4 4 4 4-4M4 17v4h16v-4"/>',
  audit:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 8h7M8 12h7M8 16h4"/><path d="m15 16 2 2 3-4"/>',
  import:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',
  poll:'<path d="M5 20v-8m7 8V5m7 15v-11"/>',
  calendarExport:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-3 4v4m-2-2h4"/>'
};
function v563Icon(icon){
 const path=V563_ICON_PATHS[icon];
 return path?'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>':esc(icon);
}
function card(icon,title,sub,attrs=''){
 return '<button type="button" class="v562-card" '+attrs+' aria-label="'+esc(title)+': '+esc(sub)+'"><span class="v562-icon" aria-hidden="true">'+v563Icon(icon)+'</span><span class="v562-card-copy"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span><i aria-hidden="true">›</i></button>';
}
function controlMarkup(){
 const s=allSummary();
 return '<section class="v562-page" data-v563-control>'+
  '<header class="v562-hero"><small>LIGA JUVENTINO · CONTROL</small><h1>Mi app de la Liga</h1><p>Consulta y gestiona los apartados de la Liga desde una sola pantalla.</p></header>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>RESUMEN</small><h2>Datos de la Liga</h2></span></div>'+
   '<div class="v562-sync-grid"><article><b>'+s.players+'</b><span>Jugadores</span></article><article><b>'+s.teams+'</b><span>Equipos</span></article><article><b>'+s.standings+'</b><span>Posiciones</span></article><article><b>'+s.scorers+'</b><span>Goleo</span></article><article><b>'+s.cards+'</b><span>Tarjetas</span></article><article><b>'+s.suspensions+'</b><span>Castigados</span></article></div>'+
  '</section>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>COMPETICIÓN</small><h2>Apartados propios</h2></span></div><div class="v562-list">'+
   card('positions','Posiciones','Tabla por categoría','data-v563-action="positions"')+
   card('goal','Goleo','Máximos goleadores','data-v563-route="scorers"')+
   card('yellow','Tarjetas','Amarillas y rojas','data-v563-action="cards"')+
   card('ban','Castigados','Sanciones y suspensiones','data-v563-action="suspensions"')+
   card('calendar','Jornadas y resultados','Calendario y partidos','data-v563-action="fixtures"')+
   card('target','Quiniela','Pronósticos de la Liga','data-v563-route="quiniela"')+
  '</div></section>'+
  '<section class="v562-panel v563-management"><div class="v562-title"><span><small>GESTIÓN</small><h2>Registro y administración</h2></span></div>'+
   '<p class="v563-section-help">Accesos directos, sin submenús. Toca una herramienta para abrirla.</p>'+
   '<div class="v562-list">'+
   card('register','Registro de jugadores','Altas, equipos y datos del jugador','data-v563-route="recruitment"')+
   card('id','Credenciales','Foto y escudo en la credencial','data-v563-route="credentialBuilder"')+
   card('sponsor','Patrocinadores','Acuerdos, vigencias y contactos · local','data-v563-tool="sponsors"')+
   card('matchday','Centro de jornada','Organizar partidos y cierre','data-v563-route="matchday"')+
   card('calendarExport','Calendarios oficiales','Preparar y descargar PDF o imagen','data-v563-tool="calendar-generator"')+
   card('meeting','Juntas y acuerdos','Registro de reuniones y pendientes','data-v563-tool="meeting"')+
   card('referee','Modo árbitro offline','Mis partidos y cédulas sin señal','data-v563-route="refereeOffline"')+
   card('document','Cédulas arbitrales','Plantillas y exportación PDF','data-v563-route="cedulaBuilder"')+
   card('officials','Árbitros y oficiales','Directorio operativo local','data-v563-tool="officials"')+
   card('incidents','Incidencias','Anotar hechos y dar seguimiento','data-v563-tool="incidents"')+
   card('team','Equipos','Directorio y consulta de clubes','data-v563-route="teams"')+
   card('delegate','Delegados / encargados','Directorio de representantes','data-v563-tool="delegates"')+
   card('player','Jugadores','Plantillas de los equipos','data-v563-route="players"')+
   card('report','Reportes','Resumen semanal y pendientes','data-v563-route="v38Weekly"')+
   card('book','Reglamento','Consultar el reglamento oficial','data-v563-route="rulebook"')+
   card('publish','Publicaciones','Tablas, jornadas y comunicados','data-v563-route="publicationCenter"')+
   card('poll','Encuestas','Participación y opinión de la Liga','data-v563-tool="poll"')+
   card('weather','Campos y clima','Estado y pronóstico de canchas','data-v563-route="weatherFields"')+
   card('account','Mi cuenta','Perfil y configuración','data-v563-route="profile"')+
   card('import','Importar CSV','Leer archivo y revisar vista previa','data-v563-tool="csv-import"')+
   card('backup','Respaldo local','Descargar copia de herramientas','data-v563-tool="backup-export"')+
   card('audit','Auditoría local','Ver actividades guardadas','data-v563-tool="audit"')+
   '</div>'+
   '<div class="v563-admin-direct" data-v563-admin-direct hidden>'+
    '<div class="v563-admin-direct-title"><small>SOLO ADMINISTRACIÓN</small><b>Modificar la Liga</b></div>'+
    '<div class="v562-list">'+
    card('permission','Permisos y autorizaciones','Crear documentos oficiales','data-v563-route="permissionBuilder"')+
    card('notice','Avisos programados','Notificaciones y comunicados','data-v563-route="v38Alerts"')+
    card('reschedule','Cambios de jornada','Cambiar fechas y partidos','data-v563-route="scheduleChanges"')+
    '</div></div>'+
   '</section>'+
 '</section>';
}
function installMarkup(){
 return '<section class="v562-page" data-v563-install-page>'+
  '<header class="v562-hero"><small>INSTALACIÓN OFICIAL</small><h1>Instalar Liga Juventino</h1><p>Elige la opción para tu teléfono. Puedes instalar desde el navegador o descargar el APK de Android.</p></header>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>ANDROID</small><h2>APK propia</h2></span></div>'+
   '<div class="v562-app-badge"><span>⚽</span><div><b>Liga Juventino</b><small>Paquete Android generado desde este repositorio</small></div></div>'+
   '<div class="v562-main-actions"><button type="button" data-v563-apk>Descargar APK</button><button type="button" class="alt" data-v563-install>Instalar acceso directo</button></div>'+
   '<p class="v562-note">El flujo Android compila esta misma interfaz azul con Capacitor y genera el archivo app-debug.apk.</p>'+
  '</section>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>ACCESO DIRECTO</small><h2>Como app en el teléfono</h2></span></div><div class="v562-list">'+
   card('➕','Instalar en Android','Chrome → Instalar aplicación','data-v563-install')+
   card('🍎','Agregar en iPhone / iPad','Abrir acceso móvil de Liga Juventino','data-v563-ios')+
   card('🔵','Abrir versión web','Acceder a Liga Juventino desde el navegador','data-v563-appmode')+
  '</div></section>'+
 '</section>';
}
function clickCompetitionTab(tab){
 [120,320,700].forEach(ms=>setTimeout(()=>document.querySelector('[data-comp-tab="'+tab+'"]')?.click(),ms));
}
function openPositions(){go('competition');clickCompetitionTab('standings')}
function openFixtures(){go('competition');clickCompetitionTab('fixtures')}
function openDiscipline(kind){
 try{localStorage.setItem('v563-discipline-view',kind)}catch(_){}
 go('discipline');
}
async function install(){
 if(window.LJR_V100?.installApp){window.LJR_V100.installApp();return}
 alert(/iphone|ipad|ipod/i.test(navigator.userAgent||'')?'Safari → Compartir → Añadir a pantalla de inicio.':'Chrome → menú → Instalar aplicación / Añadir a pantalla de inicio.');
}
async function share(){
 const href=location.origin+location.pathname+'?mode=apk#/home';
 try{if(navigator.share){await navigator.share({title:'Liga Juventino',text:'App de la Liga Municipal de Fútbol Juventino Rosas',url:href});return}await navigator.clipboard.writeText(href);toast('Enlace copiado')}catch(_){}
}
function bind(root){
 function syncAdmin(){const section=$('[data-v563-admin-direct]',root);if(section)section.hidden=!Boolean(window.LJR_MEDIA?.admin)}
 syncAdmin();window.addEventListener('liga:admin',syncAdmin,{signal:root.v563Controller?.signal});
 $('[data-v563-route]',root).forEach(b=>b.addEventListener('click',()=>go(b.dataset.v563Route)));
 const privateTools=new Set(['sponsors','meeting','delegates','officials','incidents','csv-import','backup-export','audit']);
 const openTool=name=>{
   if(typeof window.LJR_V105_OPEN_TOOL==='function'&&window.LJR_V105_OPEN_TOOL(name))return;
   toast('La herramienta no pudo abrirse. Actualiza la página e inténtalo de nuevo.');
 };
 $('[data-v563-tool]',root).forEach(b=>b.addEventListener('click',()=>{
   const name=b.dataset.v563Tool;
   if(!name)return;
   if(privateTools.has(name)&&!window.LJR_MEDIA?.admin){
     const login=window.LJR_MEDIA?.login;
     if(typeof login==='function'){
       login(()=>{if(window.LJR_MEDIA?.admin)openTool(name);else toast('Se requiere acceso de administración')});
     }else toast('Inicia sesión como administrador para abrir esta herramienta');
     return;
   }
   openTool(name);
 }));
 $$('[data-v563-action]',root).forEach(b=>b.addEventListener('click',()=>{const a=b.dataset.v563Action;if(a==='positions')openPositions();else if(a==='fixtures')openFixtures();else if(a==='cards')openDiscipline('cards');else if(a==='suspensions')openDiscipline('suspensions')}));
 $$('[data-v563-install]',root).forEach(b=>b.addEventListener('click',install));
 $('[data-v563-share]',root)?.addEventListener('click',share);
 $('[data-v563-builds]',root)?.addEventListener('click',()=>window.open(ACTIONS,'_blank','noopener,noreferrer'));
 $('[data-v563-apk]',root)?.addEventListener('click',()=>window.open(APK,'_blank','noopener,noreferrer'));
 $('[data-v563-ios]',root)?.addEventListener('click',async()=>{try{if(window.LJR_V100?.installIosShortcut){await window.LJR_V100.installIosShortcut();return}const url=location.origin+location.pathname+'?source=ios-home#/home';if(navigator.share){await navigator.share({title:'Liga Juventino',text:'Liga Juventino',url});return}location.href=url}catch(_){}});
 $('[data-v563-appmode]',root)?.addEventListener('click',()=>{location.href=location.origin+location.pathname+'?mode=apk#/home'});
}
function mount(){
 const r=route();
 if(r==='jrControl'){go('ligaControl');return}
 if(r==='positions'){openPositions();return}
 if(r==='cards'){openDiscipline('cards');return}
 if(r==='suspensions'){openDiscipline('suspensions');return}
 if(!['ligaControl','adminFut','appInstall'].includes(r))return;
 const screen=$('#screen');if(!screen)return;
 const placeholder=$('[data-v562-adminfut-mount],[data-v563-control-mount],[data-v563-app-install-mount]',screen);
 if(placeholder)placeholder.outerHTML=r==='appInstall'?installMarkup():controlMarkup();
 const root=$('[data-v563-control],[data-v563-install-page]',screen);if(!root||root.dataset.v563Bound)return;
 root.dataset.v563Bound='1';root.v563Controller=new AbortController();bind(root);
}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(mount,50)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
schedule();setTimeout(schedule,600);
window.LJR_V563={build:BUILD,mount};
})();