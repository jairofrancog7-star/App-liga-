/* V323 — Preserve background photos in Historia > Campeones.
   Non-destructive: never removes an existing background image.
   Restores Boca/Linces/Huerta/Tavera if a previous patch hides or loses the photo. */
(function(){
'use strict';
if(window.__LJR_V323_PRESERVE_HISTORY_BACKGROUNDS__) return;
window.__LJR_V323_PRESERVE_HISTORY_BACKGROUNDS__=true;

const ITEMS=[
  {title:'linces',date:'04 mar 2024',src:'./assets/history/archive-v202/linces-campeon-copa-04-mar-2024.webp?v=20260924-preserve-bg-v323',pos:'center 46%'},
  {title:'boca jrs',date:'04 may 2024',src:'./assets/history/archive-v202/boca-jrs-campeon-liga-v50-04-may-2024.webp?v=20260924-preserve-bg-v323',pos:'center 48%'},
  {title:'la huerta de cuenda',date:'29 jun 2025',src:'./assets/history/archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg?v=20260924-preserve-bg-v323',pos:'center 43%'},
  {title:'tavera fc',date:'29 jun 2025',src:'./assets/history/archive-v119/tavera-finalista-2025.jpg?v=20260924-preserve-bg-v323',pos:'center 43%'}
];

const norm=v=>String(v||'')
  .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
  .toLowerCase().replace(/\s+/g,' ').trim();

function target(card){
  const title=norm(card.querySelector('h3,h4')?.textContent||'');
  const all=norm(card.textContent||'');
  return ITEMS.find(x=>{
    const titleOk=x.title==='boca jrs'
      ? title.startsWith('boca jrs')
      : title===x.title;
    return titleOk && all.includes(x.date);
  })||null;
}

function styleExistingImage(img,item){
  if(!img) return;
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
  img.style.setProperty('transform','none','important');
  img.style.setProperty('filter','none','important');
  img.style.setProperty('image-rendering','auto','important');
  img.style.setProperty('mix-blend-mode','normal','important');
  img.style.setProperty('margin','0','important');
  img.style.setProperty('padding','0','important');
  img.style.setProperty('border','0','important');
}

function ensurePhoto(card,item){
  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-image','url("'+item.src+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position',item.pos,'important');
  card.style.setProperty('background-repeat','no-repeat','important');

  // Preserve the existing photo. If one exists, keep that node and only make sure it
  // points to the exact same event image. If none exists, add one without deleting anything.
  let img=card.querySelector(':scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo,:scope > .v120-exact-event-bg,:scope > img');
  if(!img){
    img=document.createElement('img');
    img.className='v35-history-bg-photo v120-exact-event-bg v323-preserved-photo';
    img.alt=(card.querySelector('h3,h4')?.textContent||'')+' · fotografía de fondo';
    img.loading='eager';
    img.decoding='async';
    card.prepend(img);
  }
  const current=img.getAttribute('src')||'';
  if(!current || !current.includes(item.src.split('?')[0])) img.src=item.src;
  styleExistingImage(img,item);

  // Do not delete any other image nodes. If another old photo layer exists, leave it untouched
  // but keep the exact current-event image visible on top of background layers at z-index 0.
  card.querySelectorAll(':scope > img').forEach(other=>styleExistingImage(other,item));

  card.querySelectorAll(
    ':scope > .v35-history-moment-shade,'+
    ':scope > .v35-champion-shade,'+
    ':scope > .v120-exact-shade,'+
    ':scope > [class*="overlay"],'+
    ':scope > [class*="shade"]'
  ).forEach(n=>{
    n.style.setProperty('background','none','important');
    n.style.setProperty('background-image','none','important');
    n.style.setProperty('backdrop-filter','none','important');
    n.style.setProperty('-webkit-backdrop-filter','none','important');
    n.style.setProperty('opacity','0','important');
    n.style.setProperty('pointer-events','none','important');
  });

  card.querySelectorAll('.v35-history-status,.v35-history-status span,.v35-champion-status,.v35-champion-status span,.v35-history-fact,.v35-champion-fact').forEach(n=>{
    n.style.setProperty('background','transparent','important');
    n.style.setProperty('background-image','none','important');
    n.style.setProperty('backdrop-filter','none','important');
    n.style.setProperty('-webkit-backdrop-filter','none','important');
    n.style.setProperty('filter','none','important');
  });

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });

  card.dataset.v323PreservedBackground='1';
}

function patch(){
  if(!/history|safe-about/i.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    const item=target(card);
    if(item) ensurePhoto(card,item);
  });
}

let t=0;
function schedule(ms=0){
  clearTimeout(t);
  t=setTimeout(patch,ms);
}
window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab],button,[data-route]')) schedule(60);
},true);
new MutationObserver(()=>schedule(35)).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
else schedule(20);
setTimeout(patch,300);
setTimeout(patch,900);
setTimeout(patch,1800);
})();