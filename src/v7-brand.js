const V10_ASSETS = {
  splash: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/a2eeef18-c5f1-4870-9124-6026558b2612.png'
};
const STARTUP_MS = 2350;
const STARTUP_FADE_MS = 420;

const STANDARD_HEADER_ROUTES = new Set([
  'home','competition','video','more'
]);
const FULLSCREEN_HEADER_ROUTES = new Set([
  'fantasy','fantasyTeam','fantasyLeagues','fantasyAccess',
  'history','teams','teamDetail','rankings','following',
  'predictor','predictorSix','quizArena','moreLess','moreLessHub','hospitality',
  'match'
]);
const HEADER_TITLES = {
  competition:'Competición',
  video:'Vídeo',
  more:'Más',
  moments:'Momentos',
  players:'Jugadores',
  playerDetail:'Jugador',
  playerCompare:'Comparar jugadores',
  scorers:'Máximo goleador',
  stats:'Estadísticas',
  profile:'Perfil',
  notifications:'Notificaciones',
  search:'Buscar',
  news:'Noticias',
  newsDetail:'Noticia',
  transfers:'Transferencias',
  favorites:'Favoritos',
  vote:'MVP',
  leagueTools:'Más herramientas',
  rulebook:'Reglamento',
  matchday:'Match Day',
  matchCenter:'Match Center',
  'match-center':'Match Center',
  'v4-matchcenter':'Match Center',
  weatherFields:'Clima y campos',
  venues:'Campos y sedes',
  discipline:'Disciplina',
  disciplina:'Disciplina',
  disciplineTool:'Disciplina',
  tableExport:'Tabla completa',
  bracketBuilder:'Liguilla',
  credentialBuilder:'Credenciales',
  cedulaBuilder:'Cédula',
  cedulas:'Cédulas',
  cedulaDetail:'Cédula',
  credential:'Credencial',
  agendaBuilder:'Agenda',
  publications:'Publicaciones',
  tactics:'Tácticas',
  simulator:'Simulador',
  jrControl:'JR Control',
  ligaQR:'QR de la Liga',
  'club-store':'Tienda',
  v38Stats:'Estadísticas',
  v38Weekly:'Resumen semanal',
  v38Weather:'Clima',
  v38Alerts:'Alertas',
  motionHub:'Contenido',
  suspensionTool:'Sanciones',
  scheduleChanges:'Avisos',
  historyLog:'Historial'
};

function routeFromLocation(){
  const route=(location.hash.replace(/^#\/?/,'') || 'home').split('?')[0];
  return route==='quiz' ? 'quizArena' : route;
}
function headerModeFor(route){
  if(FULLSCREEN_HEADER_ROUTES.has(route)) return 'fullscreen';
  if(STANDARD_HEADER_ROUTES.has(route)) return 'standard';
  return 'detail';
}

function installBrandHeader(){
  document.documentElement.dataset.brandVersion='v10';
  const topbar=document.querySelector('.topbar');
  const wordmark=document.querySelector('.topbar .wordmark');
  const profile=document.querySelector('.topbar .profile-button');
  if(wordmark){wordmark.setAttribute('aria-label','Inicio - Liga Municipal de Fútbol Juventino Rosas');wordmark.textContent='';}
  if(profile){profile.setAttribute('aria-label','Mi cuenta');}
  topbar?.querySelectorAll('.notification-button,.bell-button,[data-route="notifications"],[aria-label*="Notific"],[aria-label*="notific"]').forEach(el=>el.remove());
}

function syncRouteLayout(){
  const route=routeFromLocation();
  const screen=document.querySelector('#screen');
  const topbar=document.querySelector('.topbar');
  if(!screen||!topbar) return;

  const mode=headerModeFor(route);
  document.body.dataset.appRoute=route;
  document.body.dataset.headerMode=mode;
  document.body.classList.toggle('v10-home-route',route==='home');
  document.body.classList.toggle('v10-root-route',mode==='standard');
  document.body.classList.toggle('v10-detail-route',mode==='detail');
  document.body.classList.toggle('v10-standard-header',mode==='standard');
  document.body.classList.toggle('v10-detail-header',mode==='detail');
  document.body.classList.toggle('v10-fullscreen-route',mode==='fullscreen');

  topbar.dataset.title=HEADER_TITLES[route]||'';
  topbar.dataset.headerMode=mode;
  topbar.classList.toggle('has-route-title',Boolean(HEADER_TITLES[route]));

  // Home: stories begin directly below the branded banner. This is based on
  // the route, not on the current rendered text, so later modules cannot make
  // the removed title flash back into view.
  screen.classList.toggle('v10-home-stories-first',route==='home');

  const back=document.querySelector('#backButton');
  if(back){
    const showBack=mode==='detail';
    back.classList.toggle('is-hidden',!showBack);
  }
}

function watchRouteLayout(){
  const screen=document.querySelector('#screen');
  syncRouteLayout();
  window.addEventListener('hashchange',()=>window.requestAnimationFrame(syncRouteLayout));
  if(screen){
    const observer=new MutationObserver(()=>window.requestAnimationFrame(syncRouteLayout));
    observer.observe(screen,{childList:true,subtree:false});
  }
}

function createStartup(){
  if(document.getElementById('v7Startup')) return;
  document.body.classList.add('v7-startup-lock');
  const splash=document.createElement('div');
  splash.id='v7Startup';
  splash.className='v7-startup';
  splash.setAttribute('role','status');
  splash.setAttribute('aria-live','polite');
  splash.setAttribute('aria-label','Iniciando Liga Juventino');
  splash.innerHTML=`<div class="v7-startup-stage is-active"><img src="${V10_ASSETS.splash}" alt="Liga Municipal de Fútbol Juventino Rosas" draggable="false"></div>`;
  document.body.appendChild(splash);
  window.setTimeout(()=>{
    splash.classList.add('is-leaving');
    document.body.classList.remove('v7-startup-lock');
    window.setTimeout(()=>splash.remove(),STARTUP_FADE_MS+80);
  },STARTUP_MS);
}

function bootV10Brand(){
  installBrandHeader();
  watchRouteLayout();
  createStartup();
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV10Brand,{once:true}); else bootV10Brand();
