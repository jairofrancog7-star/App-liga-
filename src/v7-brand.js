const V7_ASSETS = {
  splash: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/da28b6de-d381-46c3-b1e4-23d76c826123.png',
  final: 'https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/edbc7dc5-fc86-470d-8080-650f74c960b2.png'
};
const STARTUP_FIRST_MS = 1450;
const STARTUP_SECOND_MS = 1850;
const STARTUP_FADE_MS = 450;

function installBrandHeader(){
  const wordmark=document.querySelector('.topbar .wordmark');
  const profile=document.querySelector('.topbar .profile-button');
  if(wordmark){wordmark.setAttribute('aria-label','Inicio - Liga Municipal de Fútbol Juventino Rosas');wordmark.textContent='';}
  if(profile){profile.setAttribute('aria-label','Mi cuenta');profile.textContent='';}
}

function createStartup(){
  if(document.getElementById('v7Startup')) return;
  document.body.classList.add('v7-startup-lock');
  const splash=document.createElement('div');
  splash.id='v7Startup';splash.className='v7-startup';splash.setAttribute('role','status');splash.setAttribute('aria-live','polite');splash.setAttribute('aria-label','Iniciando Liga Juventino');
  splash.innerHTML=`<div class="v7-startup-stage v7-startup-stage--first is-active" data-startup-stage="first"><img src="${V7_ASSETS.splash}" alt="Liga Municipal de Fútbol Juventino Rosas" draggable="false"></div><div class="v7-startup-stage v7-startup-stage--final" data-startup-stage="final"><img src="${V7_ASSETS.final}" alt="" aria-hidden="true" draggable="false"><div class="v7-updating">Actualizando datos</div></div>`;
  document.body.appendChild(splash);
  const first=splash.querySelector('[data-startup-stage="first"]');
  const final=splash.querySelector('[data-startup-stage="final"]');
  window.setTimeout(()=>{first?.classList.remove('is-active');final?.classList.add('is-active');splash.setAttribute('aria-label','Actualizando datos');},STARTUP_FIRST_MS);
  window.setTimeout(()=>{splash.classList.add('is-leaving');document.body.classList.remove('v7-startup-lock');window.setTimeout(()=>splash.remove(),STARTUP_FADE_MS+80);},STARTUP_FIRST_MS+STARTUP_SECOND_MS);
}
function bootV7Brand(){installBrandHeader();createStartup();}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bootV7Brand,{once:true}); else bootV7Brand();
