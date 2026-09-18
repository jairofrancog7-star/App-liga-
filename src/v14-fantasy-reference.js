const V23_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts23';
const V23_ACCESS_REF='./fantasy-access-reference.png?v=parts23';
let v23FantasyBgPromise=null;

function v23Route(){return location.hash.replace('#/','')||'home'}

async function v23FantasyBg(){
  if(v23FantasyBgPromise) return v23FantasyBgPromise;
  v23FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts23').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts23').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v23FantasyBgPromise;
}

function v23LandingMarkup(){
  return '<section class="v22-fantasy-master" data-v23-fantasy>'+
    '<img class="v22-fantasy-bg" alt="" aria-hidden="true">'+
    '<div class="v22-hero" aria-label="Fantasy">'+
      '<div class="v22-neon v22-neon-a" aria-hidden="true"><i></i><i></i><i></i></div>'+
      '<div class="v22-neon v22-neon-b" aria-hidden="true"><i></i><i></i></div>'+
      '<div class="v22-neon v22-neon-c" aria-hidden="true"><i></i><i></i><i></i></div>'+
      '<h1>FANTASY</h1>'+
    '</div>'+
    '<div class="v22-league">'+
      '<strong>LIGA MUNICIPAL DE FÚTBOL</strong>'+
      '<strong>JUVENTINO ROSAS</strong>'+
      '<span>GUANAJUATO</span>'+
    '</div>'+
    '<div class="v22-sponsor">'+
      '<span>Patrocinado por</span>'+
      '<img src="'+V23_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
    '</div>'+
    '<button class="v22-shirt-hit v22-shirt-hit-left" type="button" aria-label="Abrir Fantasy desde playera izquierda"></button>'+
    '<button class="v22-shirt-hit v22-shirt-hit-center" type="button" aria-label="Abrir Fantasy desde playera central"></button>'+
    '<button class="v22-shirt-hit v22-shirt-hit-right" type="button" aria-label="Abrir Fantasy desde playera derecha"></button>'+
  '</section>';
}

function v23AccessMarkup(){
  return '<section class="v23-fantasy-access" data-v23-access>'+
    '<div class="v23-ref-crop v23-access-header" aria-hidden="true"><img src="'+V23_ACCESS_REF+'" alt=""></div>'+
    '<div class="v23-ref-crop v23-access-sponsor" aria-hidden="true"><img src="'+V23_ACCESS_REF+'" alt=""></div>'+
    '<div class="v23-ref-crop v23-access-photo" role="img" aria-label="Jugadores celebrando"><img src="'+V23_ACCESS_REF+'" alt=""></div>'+
    '<div class="v23-access-copy">'+
      '<h1>Inicia sesión para jugar al<br>Fantasy</h1>'+
      '<p>Inicia sesión para guardar tu equipo, unirte a<br>ligas y recibir alertas importantes sobre plazos.</p>'+
    '</div>'+
    '<div class="v23-access-actions">'+
      '<button class="v23-access-login" type="button">Inicia sesión para jugar</button>'+
      '<button class="v23-access-later" type="button">Iniciaré sesión después</button>'+
    '</div>'+
  '</section>';
}

async function patchV23Fantasy(){
  const route=v23Route();
  if(route!=='fantasy' && route!=='fantasyAccess') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;

  if(route==='fantasyAccess'){
    if(!screen.querySelector('[data-v23-access]')) screen.innerHTML=v23AccessMarkup();
    const login=screen.querySelector('.v23-access-login');
    const later=screen.querySelector('.v23-access-later');
    if(login) login.onclick=(e)=>{e.preventDefault();e.stopPropagation();location.hash='#/profile'};
    if(later) later.onclick=(e)=>{e.preventDefault();e.stopPropagation();location.hash='#/fantasyTeam'};
    return;
  }

  if(!screen.querySelector('[data-v23-fantasy]')) screen.innerHTML=v23LandingMarkup();
  const bg=screen.querySelector('.v22-fantasy-bg');
  if(bg&&!bg.src){
    try{bg.src=await v23FantasyBg()}catch(e){console.warn('Fantasy background',e)}
  }
  screen.querySelectorAll('.v22-shirt-hit').forEach(btn=>{
    btn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      location.hash='#/fantasyAccess';
    };
  });
}

function scheduleV23Fantasy(){
  requestAnimationFrame(()=>{patchV23Fantasy();requestAnimationFrame(patchV23Fantasy)});
}

window.addEventListener('hashchange',scheduleV23Fantasy);
const v23Target=document.querySelector('#screen');
if(v23Target) new MutationObserver(scheduleV23Fantasy).observe(v23Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV23Fantasy,{once:true}); else scheduleV23Fantasy();
