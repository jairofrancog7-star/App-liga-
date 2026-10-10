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
const go=r=>{location.hash='#/'+r};
const toast=msg=>{let n=$('.v562-toast');if(n)n.remove();n=document.createElement('div');n.className='v562-toast';n.textContent=msg;document.body.appendChild(n);setTimeout(()=>n.remove(),2300)};
function countRows(blocks){return Array.isArray(blocks)?blocks.reduce((n,b)=>n+(Array.isArray(b?.rows)?b.rows.length:0),0):0}
function countRoster(c){let players=0,teams=0;for(const raw of Object.values(c?.rosters||{})){teams++;if(Array.isArray(raw))players+=raw.length;else if(raw&&typeof raw==='object')players+=(raw.players||raw.rows||[]).length}return {players,teams}}
function allSummary(){
 const db=window.LJR_OFFICIAL_DATA||{},out={players:0,teams:0,standings:0,scorers:0,cards:0,suspensions:0,cats:0};
 for(const c of Object.values(db.categories||{})){out.cats++;const x=countRoster(c);out.players+=x.players;out.teams+=x.teams;out.standings+=countRows(c.standings);out.scorers+=countRows(c.scorers);out.cards+=countRows(c.cards);out.suspensions+=countRows(c.suspensions)}
 return out;
}
function card(icon,title,sub,attrs=''){return '<button type="button" class="v562-card" '+attrs+'><span class="v562-icon">'+icon+'</span><span><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span><i>›</i></button>'}
function controlMarkup(){
 const s=allSummary();
 return '<section class="v562-page" data-v563-control>'+
  '<header class="v562-hero"><small>LIGA JUVENTINO · CONTROL</small><h1>Mi app de la Liga</h1><p>Todos los apartados funcionan dentro de la app azul. No te manda a otra aplicación de fútbol.</p></header>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>RESUMEN</small><h2>Datos de la Liga</h2></span></div>'+
   '<div class="v562-sync-grid"><article><b>'+s.players+'</b><span>Jugadores</span></article><article><b>'+s.teams+'</b><span>Equipos</span></article><article><b>'+s.standings+'</b><span>Posiciones</span></article><article><b>'+s.scorers+'</b><span>Goleo</span></article><article><b>'+s.cards+'</b><span>Tarjetas</span></article><article><b>'+s.suspensions+'</b><span>Castigados</span></article></div>'+
  '</section>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>COMPETICIÓN</small><h2>Apartados propios</h2></span></div><div class="v562-list">'+
   card('🏆','Posiciones','Tabla completa por categoría','data-v563-action="positions"')+
   card('⚽','Goleo','Ranking real de jugadores','data-v563-route="scorers"')+
   card('🟨','Tarjetas','Amarillas y rojas dentro de la app','data-v563-action="cards"')+
   card('⛔','Castigados','Sanciones y suspensiones','data-v563-action="suspensions"')+
   card('📅','Jornadas y resultados','Calendario, resultados y partidos pendientes','data-v563-action="fixtures"')+
   card('🎯','Quiniela','Pronósticos propios de Liga Juventino','data-v563-route="quiniela"')+
  '</div></section>'+
  '<section class="v562-panel"><div class="v562-title"><span><small>GESTIÓN</small><h2>Registro y administración</h2></span></div><div class="v562-list">'+
   card('📷','Registro de jugadores','Foto del jugador, documento, equipo y categoría','data-v563-route="credentialBuilder"')+
   card('🪪','Credenciales','Generar credencial con fotografía y escudo','data-v563-route="credentialBuilder"')+
   card('🛠️','JR Control','Centro administrativo de tu propia Liga','data-v563-route="jrControl"')+
   card('📋','Reportes','Reporte semanal y pendientes','data-v563-route="v38Weekly"')+
   card('📘','Reglamento','Abrir reglamento dentro de la app','data-v563-route="rulebook"')+
   card('📰','Publicaciones','PNG de tablas, jornadas, goleo y sanciones','data-v563-route="publicationCenter"')+
   card('🌦️','Campos y clima','Clima y estado de campos','data-v563-route="weatherFields"')+
   card('👤','Mi cuenta','Perfil y configuración de la app','data-v563-route="profile"')+
  '</div></section>'+

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
 $$('[data-v563-route]',root).forEach(b=>b.addEventListener('click',()=>go(b.dataset.v563Route)));
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
 if(r==='positions'){openPositions();return}
 if(r==='cards'){openDiscipline('cards');return}
 if(r==='suspensions'){openDiscipline('suspensions');return}
 if(!['ligaControl','adminFut','appInstall'].includes(r))return;
 const screen=$('#screen');if(!screen)return;
 const placeholder=$('[data-v562-adminfut-mount],[data-v563-control-mount],[data-v563-app-install-mount]',screen);
 if(placeholder)placeholder.outerHTML=r==='appInstall'?installMarkup():controlMarkup();
 const root=$('[data-v563-control],[data-v563-install-page]',screen);if(!root||root.dataset.v563Bound)return;
 root.dataset.v563Bound='1';bind(root);
}
let t=0;function schedule(){clearTimeout(t);t=setTimeout(mount,50)}
window.addEventListener('hashchange',schedule);window.addEventListener('load',schedule);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
schedule();setTimeout(schedule,600);
window.LJR_V563={build:BUILD,mount};
})();