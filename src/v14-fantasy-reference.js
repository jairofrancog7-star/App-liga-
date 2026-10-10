const V24_FANTASY_LOGO='./fantasy-logo-user-black.webp?v=20260918-user-logo2';
const V24_ACCESS_REF='./fantasy-access-reference.png?v=parts24';
let v23FantasyBgPromise=null;
let v24FantasyTransparentLogoPromise=null;
let v588AccessSlide=0;
let v588SwipeStartX=null;

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

async function v24FantasyTransparentLogo(){
  if(v24FantasyTransparentLogoPromise) return v24FantasyTransparentLogoPromise;
  v24FantasyTransparentLogoPromise=(async()=>{
    const source=new Image();
    source.decoding='async';
    const loaded=new Promise((resolve,reject)=>{
      source.onload=resolve;
      source.onerror=reject;
    });
    source.src=V24_FANTASY_LOGO;
    await loaded;

    const canvas=document.createElement('canvas');
    canvas.width=source.naturalWidth||source.width;
    canvas.height=source.naturalHeight||source.height;
    const ctx=canvas.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(source,0,0);

    const imageData=ctx.getImageData(0,0,canvas.width,canvas.height);
    const px=imageData.data;
    for(let i=0;i<px.length;i+=4){
      const white=Math.min(px[i],px[i+1],px[i+2]);
      const alpha=Math.max(0,Math.min(255,Math.round((white-25)*255/210)));
      px[i]=255;
      px[i+1]=255;
      px[i+2]=255;
      px[i+3]=alpha<18?0:alpha;
    }
    ctx.putImageData(imageData,0,0);
    return canvas.toDataURL('image/png');
  })();
  return v24FantasyTransparentLogoPromise;
}

async function v24ApplyTransparentFantasyLogo(root){
  if(!root) return;
  const targets=[...root.querySelectorAll('[data-v24-fantasy-logo]')];
  if(!targets.length) return;
  try{
    const png=await v24FantasyTransparentLogo();
    targets.forEach(img=>{
      img.src=png;
      img.classList.add('is-ready');
    });
  }catch(e){
    console.warn('Fantasy transparent logo',e);
  }
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
      '<img data-v24-fantasy-logo src="'+V24_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
    '</div>'+
    '<button class="v22-shirt-hit v22-shirt-hit-left" type="button" aria-label="Abrir Fantasy desde playera izquierda"></button>'+
    '<button class="v22-shirt-hit v22-shirt-hit-center" type="button" aria-label="Abrir Fantasy desde playera central"></button>'+
    '<button class="v22-shirt-hit v22-shirt-hit-right" type="button" aria-label="Abrir Fantasy desde playera derecha"></button>'+
  '</section>';
}

function v588Samples(){
  const rows=window.LJR_V576_FANTASY?.samplePlayers?.()||[];
  const fallback=[
    {name:'Jugador 1',team:'Liga Juventino Rosas',photo:''},
    {name:'Jugador 2',team:'Liga Juventino Rosas',photo:''},
    {name:'Jugador 3',team:'Liga Juventino Rosas',photo:''}
  ];
  return [0,1,2].map(i=>rows[i]||fallback[i]);
}
function v588Card(player,pts,klass){
  const p=player||{};
  const logo=window.LJR_V576_FANTASY?.teamLogo?.(p.team)||'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
  const photo=String(p.photo||'').trim();
  return '<article class="v588-fantasy-card '+klass+'">'+
    '<div class="v588-card-face">'+
      (photo?'<img class="v588-card-player" src="'+photo+'" alt="" loading="lazy">':'<img class="v588-card-player fallback" src="'+logo+'" alt="" loading="lazy">')+
      '<span class="v588-card-glow"></span>'+
      '<img class="v588-card-crest" src="'+logo+'" alt="" loading="lazy">'+
    '</div>'+
    '<b>'+String(p.name||'Jugador')+'</b><small>'+pts+' pts</small>'+
  '</article>';
}
function v23AccessMarkup(){
  return '<section class="v23-fantasy-access v588-fantasy-access" data-v23-access data-v588-slide="'+v588AccessSlide+'">'+
    '<div class="v23-ref-crop v23-access-header" aria-hidden="true"><img src="'+V24_ACCESS_REF+'" alt=""></div>'+

    '<div class="v588-access-viewport">'+
      '<section class="v588-access-slide v588-slide-login" data-v588-slide-panel="0">'+
        '<button class="v588-side-arrow prev" type="button" data-v588-prev aria-label="Anterior">‹</button>'+
        '<div class="v23-ref-crop v23-access-photo" role="img" aria-label="Jugadores"><img src="'+V24_ACCESS_REF+'" alt=""></div>'+
        '<div class="v23-access-copy"><h1>Inicia sesión para jugar al Fantasy</h1>'+
          '<p>Inicia sesión para guardar tu equipo, unirte a ligas y recibir alertas importantes sobre plazos.</p></div>'+
        '<div class="v23-access-actions">'+
          '<button class="v23-access-login" type="button" data-v588-login>Inicia sesión para jugar</button>'+
          '<button class="v23-access-later" type="button" data-v588-next>Iniciaré sesión después</button>'+
        '</div>'+
        '<button class="v588-side-arrow next" type="button" data-v588-next aria-label="Siguiente">›</button>'+
      '</section>'+
      '<section class="v588-access-slide v588-slide-team" data-v588-slide-panel="1">'+
        '<button class="v588-side-arrow prev" type="button" data-v588-prev aria-label="Anterior">‹</button>'+
        '<div class="v588-card-stage" aria-label="Ejemplo de equipo Fantasy">'+
          (()=>{const p=v588Samples();return v588Card(p[0],'9','left')+v588Card(p[1],'12','main')+v588Card(p[2],'8','right')})()+
        '</div>'+
        '<div class="v588-team-copy"><h1>Elige tu equipo</h1>'+
          '<p>Gasta $100 M MXN en 15 jugadores y suma puntos según su rendimiento real. ¿Quiénes forman tu equipo ideal de la Liga Juventino Rosas?</p>'+
          '<div class="v588-dots"><i class="active"></i><i></i></div></div>'+
        '<div class="v23-access-actions v588-team-actions">'+
          '<button class="v23-access-login" type="button" data-v588-login>Inicia sesión para jugar</button>'+
          '<button class="v23-access-later" type="button" data-v588-guest>Prueba como invitado</button>'+
        '</div>'+
        '<button class="v588-side-arrow next" type="button" data-v588-next aria-label="Siguiente">›</button>'+
      '</section>'+
    '</div>'+
  '</section>';
}

function v588ResetAccessScroll(root){
  try{
    const screen=document.querySelector('#screen');
    if(screen)screen.scrollTop=0;
    if(root){
      root.scrollTop=0;
      root.querySelector('.v588-access-viewport')?.scrollTo?.({top:0,left:0,behavior:'instant'});
      root.querySelectorAll('[data-v588-slide-panel]').forEach(p=>{p.scrollTop=0});
    }
    const se=document.scrollingElement;
    if(se)se.scrollTop=0;
    window.scrollTo?.(0,0);
  }catch(_){}
}
function v588SetSlide(n){
  v588AccessSlide=Math.max(0,Math.min(1,Number(n)||0));
  const root=document.querySelector('[data-v23-access]');
  if(!root)return;
  root.dataset.v588Slide=String(v588AccessSlide);
  root.querySelectorAll('[data-v588-slide-panel]').forEach(p=>{
    p.classList.toggle('is-active',Number(p.dataset.v588SlidePanel)===v588AccessSlide);
  });
  v588ResetAccessScroll(root);
  requestAnimationFrame(()=>v588ResetAccessScroll(root));
}
function v588LoggedIn(){
  try{
    const s=JSON.parse(localStorage.getItem('lj-store-v3')||'{}');
    const a=JSON.parse(localStorage.getItem('ljr-auth-v569')||'{}');
    return !!(s?.user||a?.currentId);
  }catch(_){return false}
}
function v588Login(){
  if(v588LoggedIn()){location.hash='#/fantasyTeam';return}
  try{localStorage.setItem('ljr-auth-return-v569','fantasyTeam')}catch(_){}
  location.hash='#/accountLogin';
}
function v588Guest(){
  if(v588LoggedIn()){location.hash='#/fantasyTeam';return}
  if(window.LJR_V576_FANTASY?.guest){window.LJR_V576_FANTASY.guest();return}
  window.dispatchEvent(new CustomEvent('ljr:fantasy-guest'));
}

function v807EnsureAccessButtons(screen){
  const root=screen?.querySelector('[data-v23-access]');
  if(!root)return;

  const loginActions=root.querySelector('.v588-slide-login .v23-access-actions');
  if(loginActions){
    let later=loginActions.querySelector('.v23-access-later[data-v588-next]');
    if(!later){
      later=document.createElement('button');
      later.type='button';
      later.className='v23-access-later';
      later.dataset.v588Next='';
      loginActions.append(later);
    }
    later.textContent='Iniciaré sesión después';
    later.dataset.v807Restored='1';
    later.style.setProperty('display','flex','important');
    later.style.setProperty('visibility','visible','important');
    later.style.setProperty('opacity','1','important');
    later.style.setProperty('pointer-events','auto','important');
    later.onclick=e=>{e.preventDefault();e.stopPropagation();v588SetSlide(1)};
  }

  const teamActions=root.querySelector('.v588-slide-team .v23-access-actions');
  if(teamActions){
    let guest=teamActions.querySelector('.v23-access-later[data-v588-guest]');
    if(!guest){
      guest=document.createElement('button');
      guest.type='button';
      guest.className='v23-access-later';
      guest.dataset.v588Guest='';
      teamActions.append(guest);
    }
    guest.textContent='Prueba como invitado';
    guest.dataset.v807Restored='1';
    guest.style.setProperty('display','flex','important');
    guest.style.setProperty('visibility','visible','important');
    guest.style.setProperty('opacity','1','important');
    guest.style.setProperty('pointer-events','auto','important');
    guest.onclick=e=>{e.preventDefault();e.stopPropagation();v588Guest()};
  }
}

async function patchV23Fantasy(){
  const route=v23Route();
  if(route!=='fantasy' && route!=='fantasyAccess') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;

  /* V580: restore the original Fantasy access design.
     New Fantasy modules are appended BELOW this screen by v576; they no longer replace it. */
  if(route==='fantasyAccess'){
    if(!screen.querySelector('[data-v23-access]')) screen.innerHTML=v23AccessMarkup();
    v24ApplyTransparentFantasyLogo(screen);
    v807EnsureAccessButtons(screen);
    v588SetSlide(v588AccessSlide);
    screen.querySelectorAll('[data-v588-login]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();v588Login()});
    screen.querySelectorAll('[data-v588-next]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();v588SetSlide(Math.min(1,v588AccessSlide+1))});
    screen.querySelectorAll('[data-v588-prev]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();v588SetSlide(Math.max(0,v588AccessSlide-1))});
    screen.querySelectorAll('[data-v588-guest]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();v588Guest()});
    const viewport=screen.querySelector('.v588-access-viewport');
    if(viewport&&!viewport.dataset.v588Swipe){
      viewport.dataset.v588Swipe='1';
      viewport.addEventListener('pointerdown',e=>{v588SwipeStartX=e.clientX},{passive:true});
      viewport.addEventListener('pointerup',e=>{
        if(v588SwipeStartX===null)return;
        const dx=e.clientX-v588SwipeStartX;v588SwipeStartX=null;
        if(Math.abs(dx)<45)return;
        v588SetSlide(v588AccessSlide+(dx<0?1:-1));
      },{passive:true});
    }
    return;
  }

  if(!screen.querySelector('[data-v23-fantasy]')) screen.innerHTML=v23LandingMarkup();
  v24ApplyTransparentFantasyLogo(screen);
  const bg=screen.querySelector('.v22-fantasy-bg');
  if(bg&&!bg.getAttribute('src')){
    /* Original HD del usuario: exactamente el mismo encuadre y zonas táctiles.
       Si no carga, se conserva como respaldo el WebP anterior. */
    bg.onerror=async()=>{
      bg.onerror=null;
      try{bg.src=await v23FantasyBg()}catch(e){console.warn('Fantasy background fallback',e)}
    };
    bg.src='./fantasy-original-hd.webp?v=20261010-exact-source-1688x3654';
  }
  screen.querySelectorAll('.v22-shirt-hit').forEach(btn=>{
    btn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      v588AccessSlide=0;
      location.hash='#/fantasyAccess';
    };
  });
}

function scheduleV23Fantasy(){
  requestAnimationFrame(()=>{patchV23Fantasy();requestAnimationFrame(patchV23Fantasy)});
}

window.addEventListener('hashchange',scheduleV23Fantasy);
function v588OfficialRefresh(){
  if(v23Route()!=='fantasyAccess')return;
  document.querySelector('[data-v23-access]')?.remove();
  scheduleV23Fantasy();
}
window.addEventListener('ljr:official-data',v588OfficialRefresh);
const v23Target=document.querySelector('#screen');
if(v23Target) new MutationObserver(scheduleV23Fantasy).observe(v23Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV23Fantasy,{once:true}); else scheduleV23Fantasy();
