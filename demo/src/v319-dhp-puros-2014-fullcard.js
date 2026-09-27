/* V319 — DHP + Puros Cuates · 22 feb 2014.
   Corrige el mismo problema de escala reducida: las fotos deben cubrir TODO el cuadro,
   sin cambiar texto, tarjeta, orden ni estructura de Historia > Campeones. */
(function(){
'use strict';
if(window.__LJR_V319_DHP_PUROS_FULLCARD__) return;
window.__LJR_V319_DHP_PUROS_FULLCARD__=true;

const ITEMS=[
  {
    title:'dhp',
    date:'22 feb 2014',
    src:'./assets/history/archive-v260/dhp-campeon-copa-segunda-22-feb-2014.webp?v=20260924-dhp-fullcard-v319',
    pos:'center 36%'
  },
  {
    title:'puros cuates',
    date:'22 feb 2014',
    src:'./assets/history/archive-v260/puros-cuates-campeon-copa-intermedia-22-feb-2014.webp?v=20260924-puros-fullcard-v319',
    pos:'center 34%'
  }
];

const norm=v=>String(v||'')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/\s+/g,' ').trim();

function getItem(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const all=norm(card.textContent||'');
  return ITEMS.find(x=>h===x.title && all.includes(x.date))||null;
}

function paint(card){
  if(!card?.isConnected) return;
  const item=getItem(card);
  if(!item) return;

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');

  let img=card.querySelector(':scope > .v120-exact-event-bg,:scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo');
  if(!img){
    img=document.createElement('img');
    img.className='v120-exact-event-bg v120-photo-only-bg v319-fullcard-photo';
    card.prepend(img);
  }else{
    img.classList.add('v120-exact-event-bg','v120-photo-only-bg','v319-fullcard-photo');
  }

  img.src=item.src;
  img.loading='eager';
  img.decoding='async';
  img.style.setProperty('position','absolute','important');
  img.style.setProperty('inset','0','important');
  img.style.setProperty('width','100%','important');
  img.style.setProperty('height','100%','important');
  img.style.setProperty('min-width','100%','important');
  img.style.setProperty('min-height','100%','important');
  img.style.setProperty('display','block','important');
  img.style.setProperty('visibility','visible','important');
  img.style.setProperty('opacity','1','important');
  img.style.setProperty('z-index','0','important');
  img.style.setProperty('object-fit','cover','important');
  img.style.setProperty('object-position',item.pos,'important');
  img.style.setProperty('transform','scale(1)','important');
  img.style.setProperty('transform-origin',item.pos,'important');
  img.style.setProperty('margin','0','important');
  img.style.setProperty('padding','0','important');
  img.style.setProperty('border','0','important');
  img.style.setProperty('border-radius','inherit','important');
  img.style.setProperty('filter','none','important');

  // Fallback CSS: aunque otro script quite/reemplace el IMG, la misma foto cubre la tarjeta.
  card.style.setProperty(
    'background-image',
    'linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.08) 36%,rgba(2,5,45,.30) 72%,rgba(2,5,45,.64) 100%),url("'+item.src+'")',
    'important'
  );
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position',item.pos,'important');
  card.style.setProperty('background-repeat','no-repeat','important');

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });

  card.classList.add('v120-has-exact-bg','v120-photo-only-card','v319-fullcard-fixed');
  card.dataset.v319Fullcard='1';
}

function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(paint);
}

let raf=0;
function schedule(ms=0){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(patch);
  },ms);
}

window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab],button,[data-route]')) schedule(70);
},true);

new MutationObserver(ms=>{
  const relevant=ms.some(m=>[...m.addedNodes].some(n=>
    n.nodeType===1 && !n.classList?.contains('v319-fullcard-photo')
  ));
  if(relevant) schedule(30);
}).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(50),{once:true});
}else{
  schedule(20);
}
setTimeout(patch,300);
setTimeout(patch,900);
setTimeout(patch,1800);
})();