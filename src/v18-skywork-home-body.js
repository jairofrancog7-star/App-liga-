const V18_HOME_HERO='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485083778945024/2100485083778945025.png';
const V18_HOME_SAVE='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485078242082816/2100485078242082817.png';
const V18_HOME_GOAL='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485089806159872/2100485089806159873.png';
const V18_LOGO_HUERTA='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/la-huerta-cuenda.webp';
const V18_LOGO_PROMESAS='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/promesas-fc-pozos.webp';
const V18_LOGO_FRANCO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/franco-fc.webp';
const V18_LOGO_GALEANA='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/atletico-galeana.webp';

function v18IsHome(){return (location.hash.replace('#/','')||'home')==='home';}

function v18HomeMarkup(){
  return `
  <div class="v18-home-body" aria-label="Inicio Liga Juventino">
    <div class="v18-stories" aria-label="Accesos rápidos">
      <button class="v18-story" data-route="moments">
        <span class="v18-story-ring v18-moment">⚽<br>MOMENTOS</span>
        <span class="v18-story-label">Momentos<br>de la Liga ✦</span>
      </button>
      <button class="v18-story" data-route="teams">
        <span class="v18-story-ring"><img src="${V18_LOGO_HUERTA}" alt="La Huerta"></span>
        <span class="v18-story-label">La Huerta 📸</span>
      </button>
      <button class="v18-story" data-route="teams">
        <span class="v18-story-ring"><img src="${V18_LOGO_PROMESAS}" alt="Promesas FC"></span>
        <span class="v18-story-label">Promesas FC 📸</span>
      </button>
      <button class="v18-story" data-route="teams">
        <span class="v18-story-ring"><img src="${V18_LOGO_FRANCO}" alt="Franco FC"></span>
        <span class="v18-story-label">Franco FC</span>
      </button>
      <button class="v18-story" data-route="teams">
        <span class="v18-story-ring"><img src="${V18_LOGO_GALEANA}" alt="Atlético Galeana"></span>
        <span class="v18-story-label">Atlético<br>Galeana</span>
      </button>
    </div>

    <article class="v18-home-feature" data-route="video">
      <img src="${V18_HOME_HERO}" alt="Futbolistas ficticios en partido nocturno de Liga Juventino">
      <div class="v18-home-feature-copy">
        <h1>Mira todos los goles de la Jornada 1</h1>
        <p>La pasión del fútbol local en un solo lugar</p>
      </div>
    </article>

    <div class="v18-home-section-head">
      <h2>Momentos</h2>
      <button data-route="moments">Ver todo</button>
    </div>

    <div class="v18-moment-grid">
      <button class="v18-moment-card" data-route="moments">
        <img src="${V18_HOME_SAVE}" alt="Portero ficticio haciendo una atajada">
        <span class="v18-new">NEW</span>
        <span class="v18-moment-copy"><b>Club América Vet. ⚽</b>Gran atajada en la Jornada 1</span>
      </button>
      <button class="v18-moment-card" data-route="moments">
        <img src="${V18_HOME_GOAL}" alt="Jugador ficticio realizando un disparo">
        <span class="v18-new">NEW</span>
        <span class="v18-moment-copy"><b>La Huerta ⚽</b>Golazo desde fuera del área</span>
      </button>
    </div>
  </div>`;
}

function v18MountHome(){
  if(!v18IsHome()) return;
  const screen=document.querySelector('#screen');
  if(!screen || screen.querySelector('.v18-home-body')) return;

  const direct=[...screen.children];
  const keepFrom=direct.findIndex(el=>/Próximos\s+partidos/i.test(el.textContent||''));

  if(keepFrom>=0){
    direct.slice(0,keepFrom).forEach(el=>el.remove());
  }else{
    // Fallback: elimina únicamente los bloques superiores conocidos del Inicio original.
    const oldTop=[...screen.querySelectorAll(':scope > .eyebrow,:scope > .screen-title,:scope > .stories,:scope > .hero')];
    oldTop.forEach(el=>el.remove());
    const firstMoment=[...screen.children].find(el=>/Momentos/i.test(el.textContent||'') && !/Próximos/i.test(el.textContent||''));
    if(firstMoment) firstMoment.remove();
  }

  screen.insertAdjacentHTML('afterbegin',v18HomeMarkup());
}

function v18WatchHome(){
  const screen=document.querySelector('#screen');
  if(!screen) return;
  v18MountHome();
  window.addEventListener('hashchange',()=>requestAnimationFrame(v18MountHome));
  const observer=new MutationObserver(()=>{
    if(v18IsHome() && !screen.querySelector('.v18-home-body')) requestAnimationFrame(v18MountHome);
  });
  observer.observe(screen,{childList:true});
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',v18WatchHome,{once:true});
else v18WatchHome();
