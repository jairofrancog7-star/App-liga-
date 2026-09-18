const V16_VIDEO_HERO='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485172215463936/2100485172215463937.png';
const V16_VIDEO_SHOW='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485077397905408/2100485077397905409.png';
const V16_VIDEO_LOGO='https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/720d1f82-1d59-4a7a-af69-9e7e8da0250a.png';

function v16IsVideo(){
  return (location.hash.replace('#/','')||'home')==='video';
}

function v16VideoMarkup(){
  return `
    <section class="v17-tv" aria-label="Liga Juventino TV">
      <div class="v17-tv-hero">
        <img src="${V16_VIDEO_HERO}" alt="Futbolista ficticio de Liga Juventino bajo la lluvia">

        <div class="v17-tv-brand" aria-label="Liga Juventino TV">
          <img class="v17-tv-logo" src="${V16_VIDEO_LOGO}" alt="Liga Municipal de Fútbol Juventino Rosas">
          <span class="v17-tv-brandline" aria-hidden="true"></span>
          <strong class="v17-tv-brandtext">LIGA<br>JUVENTINO <em>TV</em></strong>
        </div>

        <button class="v17-tv-profile" data-route="profile" aria-label="Perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>
        </button>

        <div class="v17-tv-title">
          <h1>REPETICIÓN<br>DEL PARTIDO</h1>
          <p>Revive los 90 minutos de la Liga Municipal de Fútbol de Juventino Rosas, Guanajuato.</p>
        </div>

        <div class="v17-tv-actions">
          <button class="v17-tv-cta" data-video="Repetición del partido">▶ &nbsp;Ver ahora</button>
          <button class="v17-tv-cta secondary" data-match="m1">Partido de la semana</button>
        </div>

        <div class="v17-tv-dots" aria-label="Carrusel 1 de 5">● ● ● ● <span class="active"></span></div>
      </div>

      <div class="v17-tv-content">
        <h2>Selección de la liga</h2>
        <article class="v17-tv-show">
          <img src="${V16_VIDEO_SHOW}" alt="Jugadores ficticios para El Show de la Liga">
          <div class="v17-tv-showcopy">EL SHOW<br>DE LA LIGA</div>
          <button class="v17-tv-login" data-video="El Show de la Liga">▶ Iniciar sesión para ver</button>
        </article>
      </div>
    </section>`;
}

function v16PatchVideo(){
  if(!v16IsVideo()) return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('.v17-tv')) screen.innerHTML=v16VideoMarkup();
}

function v16Schedule(){
  requestAnimationFrame(()=>{v16PatchVideo();requestAnimationFrame(v16PatchVideo)});
}

window.addEventListener('hashchange',v16Schedule);
const v16Target=document.querySelector('#screen');
if(v16Target){
  new MutationObserver(()=>{
    if(v16IsVideo()&&!v16Target.querySelector('.v17-tv')) v16Schedule();
  }).observe(v16Target,{childList:true,subtree:false});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',v16Schedule,{once:true});
else v16Schedule();
