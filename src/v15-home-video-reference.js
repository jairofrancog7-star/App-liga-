const V15_TEAM_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const V15_STORIES=[
  {label:'Momentos<br>de la Liga ✦',route:'moments',type:'moments'},
  {label:'La Huerta 📸',route:'teams',logo:'assets/teams/la-huerta-cuenda.webp'},
  {label:'Promesas FC 📸',route:'teams',logo:'assets/teams/promesas-fc-pozos.webp'},
  {label:'Franco FC 📸',route:'teams',logo:'assets/teams/franco-fc.webp'},
  {label:'Lobos CDG 📸',route:'teams',logo:'assets/teams/lobos-cdg.webp'}
];

function v15Route(){return location.hash.replace('#/','')||'home'}

function v15PatchHome(){
  if(v15Route()!=='home') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;

  const stories=[...screen.querySelectorAll(':scope > .stories .story')];
  stories.forEach((story,i)=>{
    const item=V15_STORIES[i];
    if(!item||story.dataset.v15Story==='1') return;
    story.dataset.v15Story='1';
    story.dataset.route=item.route;
    const ring=story.querySelector('.story-ring');
    const label=story.querySelector('small');
    if(ring){
      if(item.type==='moments'){
        ring.innerHTML='<span class="v15-moments-mark"><i>⚽</i><b>MOMENTOS</b></span>';
      }else{
        ring.innerHTML='<span class="story-inner v15-story-inner"><img src="'+V15_TEAM_BASE+item.logo+'" alt="'+item.label.replace(/<br>|📸/g,'').trim()+'"></span>';
      }
    }
    if(label) label.innerHTML=item.label;
  });

  const hero=screen.querySelector(':scope > .section.hero');
  if(hero&&hero.dataset.v15HomeFeature!=='1'){
    hero.dataset.v15HomeFeature='1';
    hero.innerHTML='<img class="v15-home-feature-image" src="./home-feature-reference.webp?v=parts14" alt="Mira todos los goles de la Jornada 1"><button class="v15-home-feature-hit" type="button" aria-label="Ver vídeos de la Jornada 1"></button>';
  }
}

function v15PatchVideo(){
  if(v15Route()!=='video') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  const hero=screen.querySelector(':scope > .hero.video-hero');
  if(hero&&hero.dataset.v15VideoFeature!=='1'){
    hero.dataset.v15VideoFeature='1';
    hero.innerHTML='<img class="v15-video-reference-image" src="./video-hero-reference.webp?v=parts14" alt="Repetición del partido - Liga Juventino TV"><button class="v15-video-hit v15-video-hit-primary" type="button" aria-label="Ver ahora"></button><button class="v15-video-hit v15-video-hit-secondary" type="button" aria-label="Partido de la semana"></button>';
  }
}

function v15Toast(text){
  let el=document.querySelector('.v15-toast');
  if(!el){el=document.createElement('div');el.className='v15-toast';document.body.appendChild(el)}
  el.textContent=text;el.classList.add('show');clearTimeout(v15Toast.t);v15Toast.t=setTimeout(()=>el.classList.remove('show'),1500);
}

function v15Patch(){
  v15PatchHome();
  v15PatchVideo();
}

document.addEventListener('click',e=>{
  if(e.target.closest('.v15-home-feature-hit')){
    const videoNav=document.querySelector('.bottom-nav [data-route="video"]');
    if(videoNav){videoNav.click();return}
  }
  if(e.target.closest('.v15-video-hit-primary')){v15Toast('Repetición del partido');return}
  if(e.target.closest('.v15-video-hit-secondary')){v15Toast('Partido de la semana');return}
},true);

window.addEventListener('hashchange',()=>requestAnimationFrame(v15Patch));
const v15Screen=document.querySelector('#screen');
if(v15Screen)new MutationObserver(()=>requestAnimationFrame(v15Patch)).observe(v15Screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(v15Patch),{once:true});
else requestAnimationFrame(v15Patch);
