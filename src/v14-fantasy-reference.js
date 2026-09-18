const V22_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts22';
let v22FantasyBgPromise=null;

function v22Route(){return location.hash.replace('#/','')||'home'}

async function v22FantasyBg(){
  if(v22FantasyBgPromise) return v22FantasyBgPromise;
  v22FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts22').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts22').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v22FantasyBgPromise;
}

function v22Markup(){
  return '<section class="v22-fantasy-master" data-v22-fantasy>'+
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
      '<img src="'+V22_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
    '</div>'+
    '<button class="v22-shirt-hit v22-shirt-hit-left" type="button" aria-label="Abrir Fantasy desde playera izquierda"></button>'+
    '<button class="v22-shirt-hit v22-shirt-hit-center" type="button" aria-label="Abrir Fantasy desde playera central"></button>'+
    '<button class="v22-shirt-hit v22-shirt-hit-right" type="button" aria-label="Abrir Fantasy desde playera derecha"></button>'+
  '</section>';
}

async function patchV21Fantasy(){
  if(v22Route()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('[data-v22-fantasy]')) screen.innerHTML=v22Markup();
  const bg=screen.querySelector('.v22-fantasy-bg');
  if(bg&&!bg.src){
    try{bg.src=await v22FantasyBg()}catch(e){console.warn('Fantasy background',e)}
  }
  screen.querySelectorAll('.v22-shirt-hit').forEach(btn=>{
    btn.onclick=(e)=>{
      e.preventDefault();
      e.stopPropagation();
      location.hash='#/fantasyTeam';
    };
  });
}

function scheduleV21Fantasy(){
  requestAnimationFrame(()=>{patchV21Fantasy();requestAnimationFrame(patchV21Fantasy)});
}

window.addEventListener('hashchange',scheduleV21Fantasy);
const v22Target=document.querySelector('#screen');
if(v22Target) new MutationObserver(scheduleV21Fantasy).observe(v22Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV21Fantasy,{once:true}); else scheduleV21Fantasy();
