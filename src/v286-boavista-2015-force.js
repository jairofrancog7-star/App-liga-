(()=>{
'use strict';
const VERSION='20260923-boavista-real-v315';
const PAGE='/App-liga-/assets/history/archive-v315/boavista-campeon-primera-11-ene-2015.webp?v=20260923-boavista-real-v315';
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v315/boavista-campeon-primera-11-ene-2015.webp?v='+VERSION;
const wanted=location.origin+PAGE;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function isTarget(card){
  const all=norm(card.textContent||'');
  return all.includes('boavista') && all.includes('11 ene 2015') && all.includes('primera fuerza');
}

function apply(card){
  card.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v286-boavista-2015-bg,.v315-boavista-bg').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v315-boavista-bg';
  img.alt='Boavista · Campeón · Primera Fuerza · 11 ene 2015';
  img.loading='eager';
  img.decoding='async';
  img.src=wanted;
  img.onerror=()=>{ if(img.src!==RAW) img.src=RAW; };
  img.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;visibility:visible!important;opacity:1!important;z-index:0!important;object-fit:cover!important;object-position:center 44%!important;transform:none!important;filter:none!important;margin:0!important;padding:0!important;border:0!important;';
  card.prepend(img);

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-color','#05054f','important');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,5,40,.04) 0%,rgba(3,5,40,.10) 38%,rgba(3,5,40,.58) 100%),url("'+wanted+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 44%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  let shade=card.querySelector(':scope > .v315-boavista-shade');
  if(!shade){
    shade=document.createElement('span');
    shade.className='v315-boavista-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(3,5,40,.05) 0%,rgba(3,5,40,.10) 38%,rgba(3,5,40,.35) 66%,rgba(3,5,40,.74) 100%),linear-gradient(90deg,rgba(3,5,40,.20),rgba(3,5,40,.02) 70%)!important;';

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });

  card.querySelectorAll('.v35-history-status span,.v35-history-fact,.v35-champion-fact').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','3','important');
    n.style.setProperty('background','rgba(3,8,70,.42)','important');
    n.style.setProperty('backdrop-filter','blur(1px)','important');
    n.style.setProperty('-webkit-backdrop-filter','blur(1px)','important');
  });

  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
  card.dataset.v315Boavista='1';
}

function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,[data-history-card]').forEach(card=>{
    if(isTarget(card)) apply(card);
  });
}
let timer=0;
const schedule=(ms=0)=>{clearTimeout(timer);timer=setTimeout(()=>requestAnimationFrame(patch),ms);};
window.addEventListener('hashchange',()=>schedule(60));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(100);},true);
new MutationObserver(()=>schedule(35)).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true}); else schedule(60);
setTimeout(patch,350);
setTimeout(patch,900);
setTimeout(patch,1800);
})();