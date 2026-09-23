(function(){
'use strict';

const PHOTO='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v232/universidad-campeon-veteranos-09-mar-2013.webp?v=20260923-universidad-hard-v263';

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}

function addStyle(){
  if(document.getElementById('v263-universidad-style')) return;
  const s=document.createElement('style');
  s.id='v263-universidad-style';
  s.textContent=`
    [data-v263-universidad]{
      position:relative!important;
      overflow:hidden!important;
      isolation:isolate!important;
      background:#07106f!important;
      background-image:none!important;
    }
    [data-v263-universidad]::before,
    [data-v263-universidad]::after{display:none!important}
    [data-v263-universidad]>.v263-universidad-photo{
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      min-width:100%!important;
      min-height:100%!important;
      max-width:none!important;
      max-height:none!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      border-radius:inherit!important;
      object-fit:cover!important;
      object-position:center 46%!important;
      filter:none!important;
      transform:none!important;
      z-index:0!important;
      pointer-events:none!important;
    }
    [data-v263-universidad]>.v263-universidad-shade{
      display:block!important;
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      border-radius:inherit!important;
      pointer-events:none!important;
      background:
        linear-gradient(180deg,rgba(2,7,55,.05) 0%,rgba(2,7,55,.18) 34%,rgba(2,7,55,.70) 72%,rgba(2,7,55,.92) 100%),
        linear-gradient(90deg,rgba(2,7,55,.48),rgba(2,7,55,.06))!important;
    }
    [data-v263-universidad]>.v35-history-bg-photo,
    [data-v263-universidad]>.v120-exact-event-bg,
    [data-v263-universidad]>.v35-champion-bg-photo,
    [data-v263-universidad]>.v35-history-moment-shade,
    [data-v263-universidad]>.v35-champion-shade{display:none!important}
    [data-v263-universidad] .v35-history-moment-content,
    [data-v263-universidad] .v35-champion-content,
    [data-v263-universidad] .v115-card-body{
      position:relative!important;
      z-index:2!important;
      background:transparent!important;
      background-image:none!important;
    }
    [data-v263-universidad] h3,
    [data-v263-universidad] h4,
    [data-v263-universidad] strong,
    [data-v263-universidad] p,
    [data-v263-universidad] span{
      position:relative;
    }
  `;
  document.head.appendChild(s);
}

function isTarget(card){
  const t=norm(card.textContent);
  return t.includes('universidad') && t.includes('09 mar 2013') &&
         (t.includes('campeon') || t.includes('veteranos'));
}

function patch(card){
  if(!isTarget(card)) return;
  addStyle();
  card.setAttribute('data-v263-universidad','1');

  card.querySelectorAll(':scope > .v263-universidad-photo,:scope > .v263-universidad-shade').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v263-universidad-photo';
  img.src=PHOTO;
  img.alt='Universidad · Campeón de Veteranos · 09 mar 2013';
  img.loading='eager';
  img.decoding='async';
  img.fetchPriority='high';

  const shade=document.createElement('span');
  shade.className='v263-universidad-shade';
  shade.setAttribute('aria-hidden','true');

  card.prepend(shade);
  card.prepend(img);

  card.style.setProperty('background-color','#07106f','important');
  card.style.setProperty('background-image','url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 46%','important');
  card.style.setProperty('background-repeat','no-repeat','important');
}

function run(){
  if(!String(location.hash||'').toLowerCase().includes('history')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,[data-v261-universidad-2013]').forEach(patch);
}

let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>{
    run();
    setTimeout(run,80);
    setTimeout(run,260);
  });
}

window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('click',()=>setTimeout(schedule,50),true);

const screen=document.querySelector('#screen')||document.body;
new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>setTimeout(schedule,80),{once:true});
}else{
  setTimeout(schedule,80);
}
setTimeout(schedule,600);
setTimeout(schedule,1600);
})();