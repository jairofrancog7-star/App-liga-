/* V311 — Abejas · Tercer lugar · Primera Fuerza · 03 nov 2019.
   Usa exactamente la fotografía aportada por el usuario (ya embebida en V308)
   como fondo real de la tarjeta de Campeones, sin alterar su estructura. */
(function(){
'use strict';
if(window.__LJR_V311_ABEJAS_2019_BG__)return;
window.__LJR_V311_ABEJAS_2019_BG__=true;

const PHOTO=window.LJR_ABEJAS_2019_PHOTO||'';
if(!PHOTO)return;

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
function isTarget(card){
  const heading=norm(card.querySelector('h3,h4')?.textContent||'');
  const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const all=norm(card.textContent||'');
  return heading.includes('abejas') && (date.includes('03 nov 2019') || all.includes('03 nov 2019'));
}
function installStyle(){
  if(document.getElementById('v311-abejas-2019-style'))return;
  const s=document.createElement('style');
  s.id='v311-abejas-2019-style';
  s.textContent=`
    .v311-abejas-2019{
      position:relative!important;
      overflow:hidden!important;
      isolation:isolate!important;
      background-color:#07105f!important;
      background-size:cover!important;
      background-repeat:no-repeat!important;
      background-position:center 50%!important;
    }
    .v311-abejas-2019>.v311-abejas-photo{
      position:absolute!important;
      inset:0!important;
      width:100%!important;
      height:100%!important;
      object-fit:cover!important;
      object-position:center 50%!important;
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      z-index:0!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      border-radius:inherit!important;
      filter:saturate(1.04) contrast(1.02) brightness(.93)!important;
      pointer-events:none!important;
    }
    .v311-abejas-2019>.v311-abejas-shade{
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      pointer-events:none!important;
      background:
        linear-gradient(180deg,rgba(1,8,45,.07) 0%,rgba(1,8,45,.16) 46%,rgba(1,8,45,.66) 100%),
        linear-gradient(90deg,rgba(1,8,45,.22) 0%,rgba(1,8,45,.06) 66%,rgba(1,8,45,.02) 100%)!important;
    }
    .v311-abejas-2019 .v35-history-moment-content,
    .v311-abejas-2019 .v35-champion-content,
    .v311-abejas-2019 .v115-card-body{
      position:relative!important;
      z-index:2!important;
      background:transparent!important;
    }
    .v311-abejas-2019 .v35-history-status,
    .v311-abejas-2019 .v35-history-meta{
      position:relative!important;
      z-index:2!important;
      background:transparent!important;
    }
    .v311-abejas-2019 .v35-history-status>span{
      background:rgba(2,10,67,.34)!important;
      border-color:rgba(77,226,244,.70)!important;
      backdrop-filter:none!important;
      -webkit-backdrop-filter:none!important;
    }
    .v311-abejas-2019 .v35-history-date,
    .v311-abejas-2019 .v35-champion-date,
    .v311-abejas-2019 .v115-date{
      background:rgba(2,8,61,.50)!important;
    }
    .v311-abejas-2019 h3,
    .v311-abejas-2019 h4,
    .v311-abejas-2019 strong,
    .v311-abejas-2019 b,
    .v311-abejas-2019 p,
    .v311-abejas-2019 small{
      position:relative!important;
      z-index:2!important;
      text-shadow:0 2px 10px rgba(0,0,0,.88)!important;
    }
  `;
  document.head.appendChild(s);
}
function apply(card){
  if(!isTarget(card))return;
  installStyle();
  card.classList.add('v311-abejas-2019','v120-has-exact-bg','v120-photo-only-card');

  card.querySelectorAll(':scope > .v311-abejas-photo,:scope > .v311-abejas-shade').forEach(n=>n.remove());
  card.querySelectorAll(':scope > .v120-exact-event-bg,:scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v311-abejas-photo';
  img.src=PHOTO;
  img.alt='Abejas · tercer lugar · Primera Fuerza · temporada 2018–2019';
  img.loading='eager';
  img.decoding='async';
  card.prepend(img);

  const shade=document.createElement('span');
  shade.className='v311-abejas-shade';
  shade.setAttribute('aria-hidden','true');
  card.insertBefore(shade,img.nextSibling);

  // Respaldo adicional: la misma foto también queda como background CSS del card.
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(1,8,45,.05),rgba(1,8,45,.48)),url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 50%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  // Si otro parche posterior intenta devolver el fondo azul, V311 lo reaplica.
  card.dataset.v311Abejas2019='1';
}
function patch(){
  if(!/(history|safe-about)/i.test(location.hash||''))return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(apply);
}
let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(patch);
}
window.addEventListener('hashchange',()=>setTimeout(schedule,20));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab]'))setTimeout(schedule,60);
},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule()).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>setTimeout(schedule,70),{once:true});
}else{
  setTimeout(schedule,70);
}
setTimeout(schedule,350);
setTimeout(schedule,1200);
})();