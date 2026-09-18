const V14_FANTASY_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';

function v14FantasyRoute(){return location.hash.replace('#/','')||'home'}

function v14Jersey(){
  return '<svg viewBox="0 0 120 130" aria-hidden="true">'+
    '<defs><linearGradient id="v14J" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#33d4ff"/><stop offset=".52" stop-color="#3b8dff"/><stop offset="1" stop-color="#2467e7"/></linearGradient></defs>'+
    '<path d="M36 23 49 17c3 7 18 7 22 0l13 6 22 10-12 30-16-7v55H42V56l-16 7-12-30 22-10Z" fill="url(#v14J)"/>'+
    '<path d="M49 17c4 8 18 8 22 0l8 4c-3 12-35 12-38 0Z" fill="#2f72e8" opacity=".95"/>'+
    '<path d="M58 57h4v13h13v4H62v13h-4V74H45v-4h13Z" fill="#06148d"/>'+
  '</svg>';
}

function v14Stadium(){
  return '<svg class="v14-stadium-svg" viewBox="0 0 700 260" preserveAspectRatio="none" aria-hidden="true">'+
  '<defs>'+
    '<linearGradient id="roof" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#00d9ff"/><stop offset=".5" stop-color="#245dff"/><stop offset="1" stop-color="#090974"/></linearGradient>'+
    '<linearGradient id="roof2" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3c37ff"/><stop offset=".5" stop-color="#00bfff"/><stop offset="1" stop-color="#07085b"/></linearGradient>'+
    '<linearGradient id="water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#071449"/><stop offset="1" stop-color="#01051d"/></linearGradient>'+
    '<filter id="glow"><feGaussianBlur stdDeviation="5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>'+
  '</defs>'+
  '<rect width="700" height="260" fill="transparent"/>'+
  '<g opacity=".6" stroke="#0dbbff" stroke-width="3" filter="url(#glow)">'+
    '<path d="M155 18 98 118"/><path d="M235 8 205 118"/><path d="M350 0 350 112"/><path d="M465 8 495 118"/><path d="M545 18 602 118"/>'+
  '</g>'+
  '<g fill="#061036" opacity=".98">'+
    '<path d="M0 164 0 128 16 128 16 117 24 117 24 143 38 143 38 124 53 124 53 153 68 153 68 112 84 112 84 146 101 146 101 131 118 131 118 155 137 155 137 121 155 121 155 164Z"/>'+
    '<path d="M700 164 700 128 684 128 684 117 676 117 676 143 662 143 662 124 647 124 647 153 632 153 632 112 616 112 616 146 599 146 599 131 582 131 582 155 563 155 563 121 545 121 545 164Z"/>'+
  '</g>'+
  '<path d="M112 155 C170 57 530 57 588 155 L548 166 C501 111 199 111 152 166Z" fill="url(#roof)" stroke="#37c9ff" stroke-width="3"/>'+
  '<path d="M142 154 C212 76 488 76 558 154 L523 169 C468 126 232 126 177 169Z" fill="url(#roof2)" opacity=".95"/>'+
  '<path d="M176 163 C241 126 459 126 524 163 L493 192 C425 172 275 172 207 192Z" fill="#c7efff" opacity=".78"/>'+
  '<path d="M194 167 C252 144 448 144 506 167 L484 187 C415 172 285 172 216 187Z" fill="#0b225d" opacity=".92"/>'+
  '<g fill="#d8f7ff" opacity=".88"><rect x="228" y="151" width="5" height="37"/><rect x="259" y="145" width="5" height="44"/><rect x="292" y="140" width="5" height="50"/><rect x="326" y="138" width="5" height="52"/><rect x="369" y="138" width="5" height="52"/><rect x="403" y="140" width="5" height="50"/><rect x="436" y="145" width="5" height="44"/><rect x="467" y="151" width="5" height="37"/></g>'+
  '<rect y="183" width="700" height="77" fill="url(#water)"/>'+
  '<path d="M0 201 C140 185 240 207 350 195 C470 182 560 204 700 190 V260 H0Z" fill="#020822"/>'+
  '<g stroke="#06a9ff" opacity=".28"><path d="M0 213h700"/><path d="M0 226h700"/><path d="M0 241h700"/></g>'+
  '</svg>';
}

function v14FantasyMarkup(){
  const jersey=v14Jersey();
  return '<section class="v14-fantasy-master" data-v14-fantasy>'+
    '<div class="v14-neon-shards" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'+
    '<div class="v14-fantasy-heading">'+
      '<h1>FANTASY</h1>'+
      '<p><strong>LIGA MUNICIPAL DE FÚTBOL</strong><strong>JUVENTINO ROSAS</strong><span>GUANAJUATO</span></p>'+
    '</div>'+
    '<div class="v14-sponsored"><span>Patrocinado por</span><img src="'+V14_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas"></div>'+
    '<div class="v14-fantasy-game" aria-label="Fantasy Liga Juventino">'+
      '<div class="v14-pitch-glow"></div>'+
      '<button class="v14-player-card left" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal">'+jersey+'</button>'+
      '<button class="v14-player-card center" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal">'+jersey+'</button>'+
      '<button class="v14-player-card right" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal">'+jersey+'</button>'+
      '<div class="v14-pitch"><i class="half"></i><i class="circle"></i><i class="box"></i></div>'+
    '</div>'+
    '<div class="v14-stadium">'+v14Stadium()+'</div>'+
  '</section>';
}

function patchV14Fantasy(){
  if(v14FantasyRoute()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(screen.querySelector('[data-v14-fantasy]')) return;
  screen.innerHTML=v14FantasyMarkup();
}

function scheduleV14Fantasy(){
  requestAnimationFrame(()=>{patchV14Fantasy();requestAnimationFrame(patchV14Fantasy)});
}

window.addEventListener('hashchange',scheduleV14Fantasy);
const v14Target=document.querySelector('#screen');
if(v14Target) new MutationObserver(scheduleV14Fantasy).observe(v14Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV14Fantasy,{once:true}); else scheduleV14Fantasy();
