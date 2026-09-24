/* V321 — Historia > Campeones: fotos limpias a cuadro completo.
   Objetivo:
   - conservar cada tarjeta y su contenido;
   - mostrar la imagen real cubriendo todo el cuadro;
   - quitar filtros/blur/zoom artificial que pixelan;
   - quitar fondos azules transparentes que tapan la foto;
   - quitar FOTO DEL ARCHIVO;
   - ejecutarse al final para ganar a parches antiguos. */
(function(){
'use strict';
if(window.__LJR_V321_CHAMPIONS_PHOTO_CLEANUP__) return;
window.__LJR_V321_CHAMPIONS_PHOTO_CLEANUP__=true;

const norm=v=>String(v||'')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .toLowerCase()
  .replace(/\s+/g,' ')
  .trim();

function inHistory(){
  return /history|safe-about/i.test(location.hash||'');
}

function championsActive(){
  const active=document.querySelector('.v35-tab.active,[data-v35-tab].active');
  if(!active) return true;
  return norm(active.textContent||active.getAttribute('data-v35-tab')||'').includes('campeones');
}

function onlyUrl(backgroundImage){
  const s=String(backgroundImage||'');
  const matches=[...s.matchAll(/url\((['"]?)(.*?)\1\)/g)];
  if(!matches.length) return '';
  return 'url("'+matches[matches.length-1][2].replace(/"/g,'\\\"')+'")';
}

function hasPhoto(card){
  if(card.querySelector(':scope > img')) return true;
  if(card.querySelector(':scope > .v289-universidad-bg,:scope > [class*="-bg"],:scope > [class*="photo"]')) return true;
  const bg=getComputedStyle(card).backgroundImage;
  return /url\(/i.test(bg);
}

function clearBluePanels(card){
  card.querySelectorAll(
    '.v35-history-status span,.v35-champion-status span,'+
    '.v35-history-fact,.v35-champion-fact,.v115-fact,'+
    '.v35-history-status,.v35-champion-status'
  ).forEach(n=>{
    n.style.setProperty('background','transparent','important');
    n.style.setProperty('background-image','none','important');
    n.style.setProperty('backdrop-filter','none','important');
    n.style.setProperty('-webkit-backdrop-filter','none','important');
    n.style.setProperty('box-shadow','none','important');
    n.style.setProperty('filter','none','important');
  });

  card.querySelectorAll('.v35-history-status span,.v35-champion-status span,.v35-history-fact,.v35-champion-fact').forEach(n=>{
    n.style.setProperty('border-color','rgba(58,232,242,.68)','important');
  });

  card.querySelectorAll('.v35-history-date,.v35-champion-date,.v115-date,.v35-history-kind,.v35-champion-kind').forEach(n=>{
    n.style.setProperty('backdrop-filter','none','important');
    n.style.setProperty('-webkit-backdrop-filter','none','important');
    n.style.setProperty('filter','none','important');
  });
}

function clearOverlays(card){
  // Direct decorative layers only; never remove content.
  card.querySelectorAll(
    ':scope > .v35-history-moment-shade,'+
    ':scope > .v35-champion-shade,'+
    ':scope > .v120-exact-shade,'+
    ':scope > [class*="overlay"],'+
    ':scope > [class*="shade"]'
  ).forEach(n=>{
    if(n.matches('.v35-history-moment-content,.v35-champion-content,.v115-card-body')) return;
    n.style.setProperty('display','none','important');
    n.style.setProperty('background','none','important');
    n.style.setProperty('background-image','none','important');
    n.style.setProperty('backdrop-filter','none','important');
    n.style.setProperty('-webkit-backdrop-filter','none','important');
  });
}

function cleanBackgroundPhoto(card){
  // Direct <img> children in these cards are background photos; logos/trophies are nested in content.
  card.querySelectorAll(':scope > img').forEach(img=>{
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
    img.style.setProperty('transform','none','important');
    img.style.setProperty('filter','none','important');
    img.style.setProperty('image-rendering','auto','important');
    img.style.setProperty('margin','0','important');
    img.style.setProperty('padding','0','important');
    img.style.setProperty('border','0','important');
    img.style.setProperty('border-radius','inherit','important');
  });

  // Some historical cards use a div background instead of an img (e.g. Universidad).
  card.querySelectorAll(':scope > div[class*="-bg"],:scope > span[class*="-bg"]').forEach(bg=>{
    if(bg.matches('.v35-history-moment-content,.v35-champion-content,.v115-card-body')) return;
    const clean=onlyUrl(getComputedStyle(bg).backgroundImage||bg.style.backgroundImage);
    if(clean) bg.style.setProperty('background-image',clean,'important');
    bg.style.setProperty('background-size','cover','important');
    bg.style.setProperty('background-repeat','no-repeat','important');
    bg.style.setProperty('filter','none','important');
    bg.style.setProperty('transform','none','important');
    bg.style.setProperty('opacity','1','important');
  });

  // If the card itself has a gradient + photo, strip the gradient and keep the real photo only.
  const bg=onlyUrl(getComputedStyle(card).backgroundImage||card.style.backgroundImage);
  if(bg){
    card.style.setProperty('background-image',bg,'important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-repeat','no-repeat','important');
  }
}

function cleanText(card){
  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
    n.style.setProperty('background-image','none','important');
    n.style.setProperty('backdrop-filter','none','important');
    n.style.setProperty('-webkit-backdrop-filter','none','important');
  });

  card.querySelectorAll('h3,h4,strong,b,p,small,time,.v35-history-kind,.v35-champion-kind').forEach(n=>{
    n.style.setProperty('text-shadow','0 2px 8px rgba(0,0,0,.88)','important');
  });
}

function removeArchiveBadge(card){
  card.querySelectorAll('.v120-photo-proof').forEach(n=>n.remove());
  [...card.querySelectorAll('span')].forEach(n=>{
    if(norm(n.textContent)==='foto del archivo') n.remove();
  });
}

function apply(card){
  if(!card?.isConnected || !hasPhoto(card)) return;
  card.classList.add('v321-champions-photo-clean');
  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');

  cleanBackgroundPhoto(card);
  clearOverlays(card);
  clearBluePanels(card);
  cleanText(card);
  removeArchiveBadge(card);

  card.dataset.v321PhotoClean='1';
}

function patch(){
  if(!inHistory() || !championsActive()) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(apply);
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
  const changed=ms.some(m=>m.addedNodes.length||m.removedNodes.length);
  if(changed) schedule(35);
}).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(70),{once:true});
}else{
  schedule(20);
}
setTimeout(patch,300);
setTimeout(patch,900);
setTimeout(patch,1800);
setTimeout(patch,3200);
})();