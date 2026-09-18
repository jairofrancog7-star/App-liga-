const V18_FANTASY_LOGO='./fantasy-logo-ref.webp?v=parts18';
let v18FantasyBgPromise=null;

function v18Route(){return location.hash.replace('#/','')||'home'}

async function v18FantasyBg(){
  if(v18FantasyBgPromise) return v18FantasyBgPromise;
  v18FantasyBgPromise=(async()=>{
    const [a,b]=await Promise.all([
      fetch('./fantasy-master-bg.b64.0?v=parts18').then(r=>r.text()),
      fetch('./fantasy-master-bg.b64.1?v=parts18').then(r=>r.text())
    ]);
    const raw=atob((a+b).replace(/\s+/g,''));
    const bytes=new Uint8Array(raw.length);
    for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes],{type:'image/webp'}));
  })();
  return v18FantasyBgPromise;
}

function v18Markup(){
  return '<section class="v18-fantasy-master" data-v18-fantasy>'+
    '<img class="v18-fantasy-bg" alt="" aria-hidden="true">'+
    '<div class="v18-card-cover" aria-hidden="true"></div>'+
    '<img class="v18-card-stretch" alt="" aria-hidden="true">'+
    '<img class="v18-title-art" src="./fantasy-title-master.webp?v=parts18" alt="Fantasy">'+
    '<div class="v18-league">'+
      '<strong>LIGA MUNICIPAL DE FÚTBOL</strong>'+
      '<strong>JUVENTINO ROSAS</strong>'+
      '<span>GUANAJUATO</span>'+
    '</div>'+
    '<div class="v18-sponsor">'+
      '<span>Patrocinado por</span>'+
      '<img src="'+V18_FANTASY_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas">'+
    '</div>'+
    '<button class="v18-card-hotspot" data-route="fantasyTeam" aria-label="Abrir Mi 7 Ideal"></button>'+
  '</section>';
}

async function patchV18Fantasy(){
  if(v18Route()!=='fantasy') return;
  const screen=document.querySelector('#screen');
  if(!screen) return;

  if(!screen.querySelector('[data-v18-fantasy]')){
    screen.innerHTML=v18Markup();
  }

  const bg=screen.querySelector('.v18-fantasy-bg');
  const stretch=screen.querySelector('.v18-card-stretch');

  if((bg&&!bg.src)||(stretch&&!stretch.src)){
    try{
      const url=await v18FantasyBg();
      if(bg&&!bg.src) bg.src=url;
      if(stretch&&!stretch.src) stretch.src=url;
    }catch(e){
      console.warn('Fantasy background',e);
    }
  }
}

function scheduleV18Fantasy(){
  requestAnimationFrame(()=>{
    patchV18Fantasy();
    requestAnimationFrame(patchV18Fantasy);
  });
}

window.addEventListener('hashchange',scheduleV18Fantasy);
const v18Target=document.querySelector('#screen');
if(v18Target){
  new MutationObserver(scheduleV18Fantasy).observe(v18Target,{childList:true,subtree:false});
}
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',scheduleV18Fantasy,{once:true});
}else{
  scheduleV18Fantasy();
}
