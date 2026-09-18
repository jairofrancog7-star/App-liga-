const V21_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts21';
let v21FantasyBgPromise=null;

function v21Route(){return location.hash.replace('#/','')||'home'}

async function v21FantasyBg(){
  if(v21FantasyBgPromise) return v21FantasyBgPromise;
  v21FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts21').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts21').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v21FantasyBgPromise;
}

function v21Markup(){
  return '<section class="v21-fantasy-master" data-v21-fantasy>'+
    '<img class="v21-fantasy-bg" alt="" aria-hidden="true">'+
    '<div class="v21-hero" aria-label="Fantasy">'+
      '<div class="v21-neon v21-neon-a" aria-hidden="true"><i></i><i></i><i></i></div>'+
      '<div class="v21-neon v21-neon-b" aria-hidden="true"><i></i><i></i></div>'+
      '<div class="v21-neon v21-neon-c" aria-hidden="true"><i></i><i></i><i></i></div>'+
      '<h1>FANTASY</h1>'+
    '</div>'+
    '<div class="v21-league">'+
      '<strong>LIGA MUNICIPAL DE FÚTBOL</strong>'+
      '<strong>JUVENTINO ROSAS</strong>'+
      '<span>GUANAJUATO</span>'+
    '</div>'+
    '<div class="v21-sponsor">'+
      '<span>Patrocinado por</span>'+
      '<img src="'+V21_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
    '</div>'+
    '<button class="v21-card-hotspot" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal"></button>'+
  '</section>';
}

async function patchV21Fantasy(){
  if(v21Route()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('[data-v21-fantasy]')) screen.innerHTML=v21Markup();
  const bg=screen.querySelector('.v21-fantasy-bg');
  if(bg&&!bg.src){
    try{bg.src=await v21FantasyBg()}catch(e){console.warn('Fantasy background',e)}
  }
}

function scheduleV21Fantasy(){
  requestAnimationFrame(()=>{patchV21Fantasy();requestAnimationFrame(patchV21Fantasy)});
}

window.addEventListener('hashchange',scheduleV21Fantasy);
const v21Target=document.querySelector('#screen');
if(v21Target) new MutationObserver(scheduleV21Fantasy).observe(v21Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV21Fantasy,{once:true}); else scheduleV21Fantasy();
