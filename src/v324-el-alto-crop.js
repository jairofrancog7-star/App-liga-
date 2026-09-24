/* V324 — El Alto · 19 ene 2020.
   Conserva la foto original; solo recorta visualmente el encabezado y pie de Facebook.
   No borra ni reemplaza ningún fondo histórico. */
(function(){
'use strict';
if(window.__LJR_V324_EL_ALTO_CROP__) return;
window.__LJR_V324_EL_ALTO_CROP__=true;

const PHOTO='./assets/history/archive-v134/el-alto-campeon-copa-intermedia-2020.jpg?v=20260924-elalto-crop-v324';
const norm=v=>String(v||'')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/\s+/g,' ').trim();

function target(card){
  const title=norm(card.querySelector('h3,h4')?.textContent||'');
  const all=norm(card.textContent||'');
  return title==='el alto' && all.includes('19 ene 2020');
}

function stylePhoto(img){
  img.src=PHOTO;
  img.loading='eager';
  img.decoding='async';
  img.style.setProperty('position','absolute','important');
  img.style.setProperty('left','50%','important');
  img.style.setProperty('top','-42%','important');
  img.style.setProperty('width','auto','important');
  img.style.setProperty('height','183%','important');
  img.style.setProperty('min-width','0','important');
  img.style.setProperty('min-height','0','important');
  img.style.setProperty('max-width','none','important');
  img.style.setProperty('max-height','none','important');
  img.style.setProperty('object-fit','fill','important');
  img.style.setProperty('object-position','center center','important');
  img.style.setProperty('transform','translateX(-50%)','important');
  img.style.setProperty('transform-origin','center center','important');
  img.style.setProperty('filter','none','important');
  img.style.setProperty('opacity','1','important');
  img.style.setProperty('display','block','important');
  img.style.setProperty('visibility','visible','important');
  img.style.setProperty('z-index','0','important');
  img.style.setProperty('margin','0','important');
  img.style.setProperty('padding','0','important');
  img.style.setProperty('border','0','important');
  img.style.setProperty('border-radius','0','important');
}

function apply(card){
  if(!card?.isConnected || !target(card)) return;

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-color','#07105f','important');
  // Do not use the full uncropped screenshot as CSS background.
  card.style.setProperty('background-image','none','important');

  let img=card.querySelector(
    ':scope > .v120-exact-event-bg,'+
    ':scope > .v35-history-bg-photo,'+
    ':scope > .v35-champion-bg-photo,'+
    ':scope > img'
  );
  if(!img){
    img=document.createElement('img');
    img.className='v35-history-bg-photo v120-exact-event-bg v324-elalto-photo';
    img.alt='El Alto · Campeón de Copa · Fuerza Intermedia · 19 ene 2020';
    card.prepend(img);
  }
  img.classList.add('v324-elalto-photo');
  stylePhoto(img);

  // Hide only decorative shades. The photograph and text stay intact.
  card.querySelectorAll(
    ':scope > .v35-history-moment-shade,'+
    ':scope > .v35-champion-shade,'+
    ':scope > .v120-exact-shade,'+
    ':scope > [class*="overlay"],'+
    ':scope > [class*="shade"]'
  ).forEach(n=>{
    n.style.setProperty('display','none','important');
    n.style.setProperty('opacity','0','important');
  });

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });

  card.dataset.v324ElAltoCrop='1';
}

function patch(){
  if(!/history|safe-about/i.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    if(target(card)) apply(card);
  });
}

let timer=0;
function schedule(ms=0){
  clearTimeout(timer);
  timer=setTimeout(patch,ms);
}
window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab],button,[data-route]')) schedule(70);
},true);
new MutationObserver(()=>schedule(40))
  .observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
}else schedule(20);

setTimeout(patch,300);
setTimeout(patch,900);
setTimeout(patch,1800);
})();