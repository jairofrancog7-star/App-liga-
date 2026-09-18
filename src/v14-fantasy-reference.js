const V15_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts17';
let v15FantasyBgPromise=null;

function v15Route(){return location.hash.replace('#/','')||'home'}

async function v15FantasyBg(){
  if(v15FantasyBgPromise) return v15FantasyBgPromise;
  v15FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts17').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts17').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v15FantasyBgPromise;
}

function v15Markup(){
  return '<section class="v15-fantasy-master" data-v15-fantasy>'+
    '<img class="v15-fantasy-bg" alt="" aria-hidden="true">'+
    '<img class="v17-title-art" src="./fantasy-title-master.webp?v=parts17" alt="Fantasy">'+
    '<div class="v17-league"><strong>LIGA MUNICIPAL DE FÚTBOL</strong><strong>JUVENTINO ROSAS</strong><span>GUANAJUATO</span></div>'+
    '<div class="v15-sponsor"><span>Patrocinado por</span><img src="'+V15_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas"></div>'+
    '<button class="v15-card-hotspot" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal"></button>'+
  '</section>';
}

async function patchV15Fantasy(){
  if(v15Route()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('[data-v15-fantasy]')) screen.innerHTML=v15Markup();
  const bg=screen.querySelector('.v15-fantasy-bg');
  if(bg&&!bg.src){
    try{bg.src=await v15FantasyBg()}catch(e){console.warn('Fantasy master background',e)}
  }
}

function scheduleV15(){
  requestAnimationFrame(()=>{patchV15Fantasy();requestAnimationFrame(patchV15Fantasy)});
}

window.addEventListener('hashchange',scheduleV15);
const target=document.querySelector('#screen');
if(target) new MutationObserver(scheduleV15).observe(target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV15,{once:true}); else scheduleV15();
