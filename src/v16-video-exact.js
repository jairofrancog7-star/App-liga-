const V16_VIDEO_HERO='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485172215463936/2100485172215463937.png';
const V16_VIDEO_SHOW='https://skyagent-artifacts.skywork.ai/image/5221463659472822263/2100485077397905408/2100485077397905409.png';
const V16_VIDEO_LOGO='https://d2ol7oe51mr4n9.cloudfront.net/user_3JNvttsAwr0QjxhuX5O1uaa9bvv/720d1f82-1d59-4a7a-af69-9e7e8da0250a.png';

const V16_VIDEO_SLIDES=[
  {
    image:V16_VIDEO_HERO,
    alt:'Futbolista ficticio de Liga Juventino bajo la lluvia',
    title:'REPETICIÓN<br>DEL PARTIDO',
    desc:'Revive los 90 minutos de la Liga Municipal de Fútbol de Juventino Rosas, Guanajuato.',
    watch:'Repetición del partido',
    cta:'▶ &nbsp;Ver ahora',
    secondary:'Partido de la semana'
  },
  {
    image:V16_VIDEO_SHOW,
    alt:'Jugadores ficticios de Liga Juventino',
    title:'EL SHOW<br>DE LA LIGA',
    desc:'Resumen de la jornada, goles, jugadas y protagonistas de nuestra Liga Municipal.',
    watch:'El Show de la Liga',
    cta:'▶ &nbsp;Ver episodio',
    secondary:'Última jornada'
  },
  {
    image:V16_VIDEO_HERO,
    alt:'Acción ficticia de Liga Juventino',
    title:'GOLES DE<br>LA JORNADA',
    desc:'Mira los goles y las mejores definiciones de los partidos más recientes de la liga.',
    watch:'Goles de la jornada',
    cta:'▶ &nbsp;Ver ahora',
    secondary:'Goleadores'
  },
  {
    image:V16_VIDEO_SHOW,
    alt:'Jugadores ficticios de Liga Juventino',
    title:'GRANDES<br>ATAJADAS',
    desc:'Las mejores intervenciones de los porteros de la Liga Juventino en un solo lugar.',
    watch:'Grandes atajadas',
    cta:'▶ &nbsp;Ver ahora',
    secondary:'Momentos'
  },
  {
    image:V16_VIDEO_HERO,
    alt:'Momento ficticio de Liga Juventino',
    title:'MOMENTOS<br>DE LA LIGA',
    desc:'Revive las jugadas, festejos y acciones que marcaron la jornada.',
    watch:'Momentos de la Liga',
    cta:'▶ &nbsp;Ver ahora',
    secondary:'Ver momentos'
  }
];

let v16Slide=0;
let v16AutoTimer=null;
let v16TouchStartX=null;
let v16TouchStartY=null;
let v16LoadedOnce=false;

function v16IsVideo(){
  return (location.hash.replace('#/','')||'home')==='video';
}

function v16DotsMarkup(){
  return V16_VIDEO_SLIDES.map((_,i)=>
    '<button type="button" class="v17-tv-dot'+(i===v16Slide?' active':'')+'" data-v16-slide="'+i+'" aria-label="Ir al contenido '+(i+1)+'"></button>'
  ).join('');
}

function v16VideoMarkup(){
  const slide=V16_VIDEO_SLIDES[v16Slide];
  return `
    <section class="v17-tv" aria-label="Liga Juventino TV">
      <div class="v17-tv-hero" data-v16-carousel>
        <img class="v17-tv-heroimage" src="${slide.image}" alt="${slide.alt}">

        <div class="v17-tv-loading" aria-hidden="true"><span></span></div>

        <div class="v17-tv-brand" aria-label="Liga Juventino TV">
          <img class="v17-tv-logo" src="${V16_VIDEO_LOGO}" alt="Liga Municipal de Fútbol Juventino Rosas">
          <span class="v17-tv-brandline" aria-hidden="true"></span>
          <strong class="v17-tv-brandtext">LIGA<br>JUVENTINO <em>TV</em></strong>
        </div>

        <button class="v17-tv-profile" data-v16-route="profile" aria-label="Perfil">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>
        </button>

        <div class="v17-tv-title">
          <h1>${slide.title}</h1>
          <p>${slide.desc}</p>
        </div>

        <div class="v17-tv-actions">
          <button class="v17-tv-cta" data-v16-watch="${slide.watch}">${slide.cta}</button>
          <button class="v17-tv-cta secondary" data-v16-secondary>${slide.secondary}</button>
        </div>

        <div class="v17-tv-dots" aria-label="Carrusel de contenidos">${v16DotsMarkup()}</div>
      </div>

      <div class="v17-tv-content">
        <h2>Selección de la liga</h2>
        <article class="v17-tv-show">
          <img src="${V16_VIDEO_SHOW}" alt="Jugadores ficticios para El Show de la Liga">
          <div class="v17-tv-showcopy">EL SHOW<br>DE LA LIGA</div>
          <button class="v17-tv-login" data-v16-watch="El Show de la Liga">▶ Iniciar sesión para ver</button>
        </article>
      </div>
    </section>`;
}

function v16ApplySlide(animate=true){
  const root=document.querySelector('.v17-tv');
  if(!root) return;
  const slide=V16_VIDEO_SLIDES[v16Slide];
  const hero=root.querySelector('.v17-tv-hero');
  const image=root.querySelector('.v17-tv-heroimage');
  const title=root.querySelector('.v17-tv-title h1');
  const desc=root.querySelector('.v17-tv-title p');
  const primary=root.querySelector('.v17-tv-cta[data-v16-watch]');
  const secondary=root.querySelector('[data-v16-secondary]');
  if(!image||!title||!desc||!primary||!secondary) return;

  if(animate) hero?.classList.add('is-changing');
  window.setTimeout(()=>{
    image.src=slide.image;
    image.alt=slide.alt;
    title.innerHTML=slide.title;
    desc.textContent=slide.desc;
    primary.dataset.v16Watch=slide.watch;
    primary.innerHTML=slide.cta;
    secondary.textContent=slide.secondary;
    root.querySelectorAll('.v17-tv-dot').forEach((dot,i)=>dot.classList.toggle('active',i===v16Slide));
    if(animate) requestAnimationFrame(()=>hero?.classList.remove('is-changing'));
  },animate?120:0);
}

function v16Next(step=1){
  v16Slide=(v16Slide+step+V16_VIDEO_SLIDES.length)%V16_VIDEO_SLIDES.length;
  v16ApplySlide(true);
  v16RestartAuto();
}

function v16GoTo(index){
  const n=Number(index);
  if(!Number.isInteger(n)||n<0||n>=V16_VIDEO_SLIDES.length||n===v16Slide) return;
  v16Slide=n;
  v16ApplySlide(true);
  v16RestartAuto();
}

function v16StartAuto(){
  if(v16AutoTimer||!v16IsVideo()||document.hidden) return;
  v16AutoTimer=window.setInterval(()=>{
    if(v16IsVideo()&&!document.querySelector('.v16-player-modal')) v16Next(1);
  },4800);
}

function v16StopAuto(){
  if(v16AutoTimer){window.clearInterval(v16AutoTimer);v16AutoTimer=null}
}

function v16RestartAuto(){
  v16StopAuto();
  v16StartAuto();
}

function v16Player(title){
  if(document.querySelector('.v16-player-modal')) return;
  v16StopAuto();
  const slide=V16_VIDEO_SLIDES[v16Slide];
  const modal=document.createElement('div');
  modal.className='v16-player-modal';
  modal.innerHTML=`
    <div class="v16-player-card" role="dialog" aria-modal="true" aria-label="${title}">
      <button type="button" class="v16-player-close" data-v16-close aria-label="Cerrar">×</button>
      <div class="v16-player-stage">
        <img src="${slide.image}" alt="">
        <span class="v16-player-play">▶</span>
      </div>
      <strong>${title}</strong>
      <p>Reproductor de Liga Juventino TV preparado para el contenido oficial de la liga.</p>
      <div class="v16-player-progress"><i></i></div>
    </div>`;
  document.body.appendChild(modal);
}

function v16ClosePlayer(){
  document.querySelector('.v16-player-modal')?.remove();
  v16StartAuto();
}

function v16SecondaryAction(){
  const label=(document.querySelector('[data-v16-secondary]')?.textContent||'').trim();
  if(label==='Goleadores'){location.hash='#/scorers';return}
  if(label==='Momentos'||label==='Ver momentos'){location.hash='#/moments';return}
  location.hash='#/match';
}

function v16PatchVideo(){
  if(!v16IsVideo()){v16StopAuto();return}
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('.v17-tv')){
    screen.innerHTML=v16VideoMarkup();
    const loader=screen.querySelector('.v17-tv-loading');
    window.setTimeout(()=>{
      loader?.classList.add('done');
      window.setTimeout(()=>loader?.remove(),220);
    },v16LoadedOnce?80:360);
    v16LoadedOnce=true;
  }else{
    v16ApplySlide(false);
  }
  v16StartAuto();
}

function v16Schedule(){
  requestAnimationFrame(()=>{v16PatchVideo();requestAnimationFrame(v16PatchVideo)});
}

document.addEventListener('click',e=>{
  const slide=e.target.closest('[data-v16-slide]');
  if(slide){e.preventDefault();v16GoTo(slide.dataset.v16Slide);return}

  const watch=e.target.closest('[data-v16-watch]');
  if(watch){e.preventDefault();v16Player(watch.dataset.v16Watch||'Liga Juventino TV');return}

  const secondary=e.target.closest('[data-v16-secondary]');
  if(secondary){e.preventDefault();v16SecondaryAction();return}

  const route=e.target.closest('[data-v16-route]');
  if(route){e.preventDefault();location.hash='#/'+route.dataset.v16Route;return}

  if(e.target.closest('[data-v16-close]')||e.target.classList.contains('v16-player-modal')){
    e.preventDefault();v16ClosePlayer();
  }
},true);

document.addEventListener('touchstart',e=>{
  const hero=e.target.closest?.('[data-v16-carousel]');
  if(!hero||e.touches.length!==1) return;
  v16TouchStartX=e.touches[0].clientX;
  v16TouchStartY=e.touches[0].clientY;
},{passive:true,capture:true});

document.addEventListener('touchend',e=>{
  if(v16TouchStartX==null||v16TouchStartY==null||!v16IsVideo()) return;
  const t=e.changedTouches?.[0];
  if(!t){v16TouchStartX=v16TouchStartY=null;return}
  const dx=t.clientX-v16TouchStartX;
  const dy=t.clientY-v16TouchStartY;
  v16TouchStartX=v16TouchStartY=null;
  if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy)*1.15) v16Next(dx<0?1:-1);
},{passive:true,capture:true});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden)v16StopAuto();else v16StartAuto();
});

window.addEventListener('hashchange',v16Schedule);
const v16Target=document.querySelector('#screen');
if(v16Target){
  new MutationObserver(()=>{
    if(v16IsVideo()&&!v16Target.querySelector('.v17-tv')) v16Schedule();
    if(!v16IsVideo()) v16StopAuto();
  }).observe(v16Target,{childList:true,subtree:false});
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',v16Schedule,{once:true});
else v16Schedule();
