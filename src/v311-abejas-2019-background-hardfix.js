/* V311 — Abejas · Tercer lugar · Primera Fuerza · 03 nov 2019.
   Usa exactamente la fotografía aportada por el usuario (ya embebida en V308)
   como fondo real de la tarjeta de Campeones, sin alterar su estructura. */
(function(){
'use strict';
if(window.__LJR_V311_ABEJAS_2019_BG__)return;
window.__LJR_V311_ABEJAS_2019_BG__=true;

function photo(){
  if(window.LJR_ABEJAS_2019_PHOTO)return window.LJR_ABEJAS_2019_PHOTO;
  const parts=window.LJR_ABEJAS_2019_V308_PARTS;
  if(Array.isArray(parts) && parts.length>=6){
    window.LJR_ABEJAS_2019_PHOTO='data:image/webp;base64,'+parts.join('');
    return window.LJR_ABEJAS_2019_PHOTO;
  }
  return '';
}

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
function isTarget(card){
  const all=norm(card?.textContent||'');
  return all.includes('abejas') &&
    all.includes('03 nov 2019') &&
    all.includes('tercer lugar') &&
    (all.includes('2018-2019') || all.includes('2018–2019'));
}

function findTargets(){
  const found=new Set();
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,[data-history-card]').forEach(card=>{
    if(isTarget(card))found.add(card);
  });

  // Fallback fuerte: localiza el texto visible de Abejas y sube hasta el cuadro
  // aunque su clase cambie por otro parche o por el render móvil.
  document.querySelectorAll('h1,h2,h3,h4,strong,b,span,div,p').forEach(node=>{
    const t=norm(node.textContent||'');
    if(t!=='abejas' && !t.startsWith('abejas '))return;
    let p=node;
    for(let i=0;i<9 && p;i++,p=p.parentElement){
      if(isTarget(p)){
        const txt=norm(p.textContent||'');
        if(txt.length<1600){
          found.add(p);
          break;
        }
      }
    }
  });
  return [...found];
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
  const PHOTO=photo();
  if(!PHOTO)return false;
  installStyle();

  // Idempotente: evita ciclos del MutationObserver. Solo reconstruye si otro parche quitó el fondo.
  const currentPhoto=card.querySelector(':scope > .v311-abejas-photo');
  const currentShade=card.querySelector(':scope > .v311-abejas-shade');
  if(card.dataset.v311Abejas2019==='1' && currentPhoto && currentShade && currentPhoto.src===PHOTO){
    card.classList.add('v311-abejas-2019','v120-has-exact-bg','v120-photo-only-card');
    return;
  }

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
  findTargets().forEach(apply);
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
setTimeout(schedule,2500);
setTimeout(schedule,5000);
})();