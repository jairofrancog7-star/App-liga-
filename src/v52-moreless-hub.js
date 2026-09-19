/* V52 — Hub Más o Menos reconstruido desde la captura del usuario. */
(function(){
  'use strict';
  const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const LEAGUE=RAW+'assets/liga-logo.webp';
  const IMAGES=[
    RAW+'media/gran-final-veteranos-35.png',
    './assets/moments/moments-original-a.png',
    './assets/moments/moments-original-b.png'
  ];
  const RANK=[
  [
    "SJO",
    "SAN JOSE FC",
    "assets/official-logos/san-jose-fc.png",
    "12"
  ],
  [
    "JVS",
    "JUVENTUS",
    "assets/official-logos/juventus.png",
    "9"
  ],
  [
    "HER",
    "HERMANOS",
    "assets/official-logos/hermanos.png",
    "7"
  ]
];

  function route(){return location.hash.replace('#/','')||'home'}
  function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function card(img){
    return '<article class="v52-game-card">'+
      '<div class="v52-card-image"><img src="'+img+'" alt="" loading="lazy" decoding="async"></div>'+
      '<div class="v52-card-copy"><h2>Más o menos</h2><p>Compara las estadísticas de dos jugadores y ponlas en el orden correcto para ganar puntos!</p>'+
      '<div class="v52-actions"><button type="button" class="primary" data-v52-login>Inicia sesión para<br>jugar</button><button type="button" class="secondary" data-v52-play>Prueba como<br>invitado</button></div></div>'+
    '</article>';
  }
  function rankCard(title,offset){
    const rows=RANK.map((r,i)=>RANK[(i+offset)%RANK.length]);
    return '<article class="v52-rank-card"><h4>'+esc(title)+'</h4>'+
      rows.map((r,i)=>'<div class="v52-rank-row"><span>'+(i+1)+'</span><img class="v52-rank-logo" src="'+RAW+r[2]+'" alt=""><span class="v52-rank-name">'+esc(r[1])+'</span><span class="v52-rank-points">undefined pts</span></div>').join('')+
    '</article>';
  }
  function markup(){
    return '<section class="v52-mol-hub" data-v52-mol-hub>'+
      '<header class="v52-mol-head"><button type="button" class="v52-back" data-v52-back aria-label="Volver"><img src="./assets/moreless-ui/back.svg" alt=""></button><h1>More or Less</h1></header>'+
      '<main class="v52-content">'+
        '<article class="v52-feature">'+
          '<div class="v52-card-image"><img src="'+IMAGES[0]+'" alt="Fútbol de la Liga Municipal" loading="eager" decoding="async"></div>'+
          '<div class="v52-card-copy"><h2>Más o menos</h2><p>Compara las estadísticas de dos jugadores y ponlas en el orden correcto para ganar puntos!</p>'+
          '<div class="v52-actions"><button type="button" class="primary" data-v52-login>Inicia sesión para<br>jugar</button><button type="button" class="secondary" data-v52-play>Prueba como<br>invitado</button></div></div>'+
        '</article>'+
        '<div class="v52-play-title"><span>PLAY GAMES</span></div>'+
        '<article class="v52-friends"><div><h3>¡Reta a tus amigos en el Quiz Arena!</h3><button type="button" data-v52-quiz>Invita a amigos</button></div>'+
          '<div class="v52-friends-badge"><img class="league" src="'+LEAGUE+'" alt="Liga Municipal"><img class="people" src="./assets/moreless-ui/friends.svg" alt=""></div></article>'+
        card(IMAGES[0])+card(IMAGES[1])+card(IMAGES[2])+
        '<h2 class="v52-section-title">Clasificaciones</h2>'+
        '<section class="v52-rank-shell"><div class="v52-rank-strip">'+rankCard('Más o menos',0)+rankCard('Más o menos',1)+'</div><button type="button" class="v52-rank-link" data-v52-rankings>Ver clasificaciones</button></section>'+
      '</main>'+
    '</section>';
  }
  function setNav(){
    const nav=document.querySelector('.bottom-nav');if(!nav)return;
    nav.style.display='grid';
    nav.querySelectorAll('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.route==='more'));
  }
  function bind(){
    document.querySelector('[data-v52-back]')?.addEventListener('click',()=>{if(history.length>1)history.back();else location.hash='#/moreLess'},{once:true});
    document.querySelectorAll('[data-v52-play]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/moreLess'},{once:true}));
    document.querySelectorAll('[data-v52-login]').forEach(b=>b.addEventListener('click',()=>{location.hash='#/profile'},{once:true}));
    document.querySelector('[data-v52-quiz]')?.addEventListener('click',()=>{location.hash='#/quizArena'},{once:true});
    document.querySelector('[data-v52-rankings]')?.addEventListener('click',()=>{location.hash='#/rankings'},{once:true});
  }
  function render(){
    const active=route()==='moreLessHub';
    document.body.classList.toggle('v52-moreless-hub-active',active);
    if(!active)return;
    const screen=document.querySelector('#screen');if(!screen)return;
    if(!screen.querySelector('[data-v52-mol-hub]'))screen.innerHTML=markup();
    setNav();bind();
    screen.scrollTop=0;
  }
  function schedule(){requestAnimationFrame(()=>requestAnimationFrame(render))}
  window.addEventListener('hashchange',schedule);
  const target=document.querySelector('#screen');
  if(target)new MutationObserver(()=>{if(route()==='moreLessHub'&&!target.querySelector('[data-v52-mol-hub]'))schedule()}).observe(target,{childList:true,subtree:false});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();
