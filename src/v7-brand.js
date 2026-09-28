const V10_ASSETS = {
  splash: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/a2eeef18-c5f1-4870-9124-6026558b2612.png'
};
const STARTUP_MS = 2350;
const STARTUP_FADE_MS = 420;

const ROOT_ROUTES = new Set(['home','competition','video','fantasy','more']);
const HEADER_TITLES = {
  competition:'Competición',
  more:'Más',
  profile:'Perfil'
};

function routeFromLocation(){
  const route=location.hash.replace('#/','') || 'home';
  return route==='quiz' ? 'quizArena' : route;
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

  document.body.dataset.appRoute=route;
  document.body.classList.toggle('v10-home-route',route==='home');
  document.body.classList.toggle('v10-root-route',ROOT_ROUTES.has(route));
  document.body.classList.toggle('v10-detail-route',!ROOT_ROUTES.has(route));

  topbar.dataset.title=HEADER_TITLES[route]||'';
  topbar.classList.toggle('has-route-title',Boolean(HEADER_TITLES[route]));

  // Home: stories begin directly below the branded banner. This is based on
  // the route, not on the current rendered text, so later modules cannot make
  // the removed title flash back into view.
  screen.classList.toggle('v10-home-stories-first',route==='home');

  const back=document.querySelector('#backButton');
  if(back){
    const showBack=!ROOT_ROUTES.has(route);
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
