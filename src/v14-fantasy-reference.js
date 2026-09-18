const V20_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts20';
let v20FantasyBgPromise=null;

function v20Route(){return location.hash.replace('#/','')||'home'}

async function v20FantasyBg(){
  if(v20FantasyBgPromise) return v20FantasyBgPromise;
  v20FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts20').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts20').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v20FantasyBgPromise;
}

function v20Markup(){
  return '<section class="v20-fantasy-master" data-v20-fantasy>'+
    '<img class="v20-fantasy-bg" alt="" aria-hidden="true">'+
    '<img class="v20-title-art" src="./fantasy-title-master.webp?v=parts20" alt="Fantasy">'+
    '<div class="v20-league"><strong>LIGA MUNICIPAL DE FÚTBOL</strong><strong>JUVENTINO ROSAS</strong><span>GUANAJUATO</span></div>'+
    '<div class="v20-sponsor"><span>Patrocinado por</span><img src="'+V20_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas"></div>'+
    '<button class="v20-card-hotspot" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal"></button>'+
  '</section>';
}

async function patchV20Fantasy(){
  if(v20Route()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;
  if(!screen.querySelector('[data-v20-fantasy]')) screen.innerHTML=v20Markup();
  const bg=screen.querySelector('.v20-fantasy-bg');
  if(bg&&!bg.src){
    try{bg.src=await v20FantasyBg()}catch(e){console.warn('Fantasy background',e)}
  }
}

function scheduleV20Fantasy(){
  requestAnimationFrame(()=>{patchV20Fantasy();requestAnimationFrame(patchV20Fantasy)});
}

window.addEventListener('hashchange',scheduleV20Fantasy);
const v20Target=document.querySelector('#screen');
if(v20Target) new MutationObserver(scheduleV20Fantasy).observe(v20Target,{childList:true,subtree:false});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scheduleV20Fantasy,{once:true}); else scheduleV20Fantasy();
