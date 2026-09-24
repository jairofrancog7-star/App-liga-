(()=>{
'use strict';
const VERSION='20260924-boavista-11ene2015-valid-v291';
const PAGE='/App-liga-/assets/history/archive-v286/boavista-campeon-primera-11-ene-2015.webp?v='+VERSION;
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v286/boavista-campeon-primera-11-ene-2015.webp?v='+VERSION;
const wanted=location.origin+PAGE;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function isTarget(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const d=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const all=norm(card.textContent||'');
  return h.includes('boavista') && (d.includes('11 ene 2015') || all.includes('11 ene 2015'));
}

function apply(card){
  card.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v286-boavista-2015-bg').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v286-boavista-2015-bg';
  img.alt='Boavista · Campeón · Primera Fuerza · 11 ene 2015';
  img.loading='eager';
  img.decoding='async';
  img.src=wanted;
  img.onerror=()=>{if(img.src!==RAW) img.src=RAW;};
  img.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;visibility:visible!important;opacity:1!important;z-index:0!important;object-fit:cover!important;object-position:center 43%!important;transform:none!important;filter:none!important;margin:0!important;padding:0!important;border:0!important;';
  card.prepend(img);

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-color','#060653','important');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,5,45,.03) 0%,rgba(2,5,45,.10) 40%,rgba(2,5,45,.62) 100%),url("'+wanted+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 43%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  let shade=card.querySelector(':scope > .v286-boavista-2015-shade');
  if(!shade){
    shade=document.createElement('span');
    shade.className='v286-boavista-2015-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.05) 0%,rgba(2,5,45,.10) 38%,rgba(2,5,45,.34) 70%,rgba(2,5,45,.70) 100%),linear-gradient(90deg,rgba(2,5,45,.20),rgba(2,5,45,.02) 72%)!important;';

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
}

function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{if(isTarget(card)) apply(card);});
}
let timer=0;
const schedule=(ms=0)=>{clearTimeout(timer);timer=setTimeout(()=>requestAnimationFrame(patch),ms);};
window.addEventListener('hashchange',()=>schedule(60));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(120);},true);
new MutationObserver(()=>schedule(40)).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true}); else schedule(80);
setTimeout(patch,500);
setTimeout(patch,1300);
})();