import p01 from './v292-boavista-photo-01.b64?raw';
import p02 from './v292-boavista-photo-02.b64?raw';
import p03 from './v292-boavista-photo-03.b64?raw';
import p04 from './v292-boavista-photo-04.b64?raw';
import p05a from './v292-boavista-photo-05a.b64?raw';
import p05b from './v292-boavista-photo-05b.b64?raw';
import p05c from './v292-boavista-photo-05c.b64?raw';
import p06 from './v292-boavista-photo-06.b64?raw';
import p07a from './v292-boavista-photo-07a.b64?raw';
import p07b from './v292-boavista-photo-07b.b64?raw';
import p07c from './v292-boavista-photo-07c.b64?raw';
import p08a from './v292-boavista-photo-08a.b64?raw';
import p08b from './v292-boavista-photo-08b.b64?raw';
import p08c from './v292-boavista-photo-08c.b64?raw';
import p09a from './v292-boavista-photo-09a.b64?raw';

(()=>{
'use strict';
const parts=[p01,p02,p03,p04,p05a,p05b,p05c,p06,p07a,p07b,p07c,p08a,p08b,p08c,p09a];
const b64=parts.join('').replace(/\s+/g,'');
const PHOTO=(b64.length===74128&&b64.startsWith('UklGR')&&b64.endsWith('AAAAA=='))
  ? 'data:image/webp;base64,'+b64
  : '';
let raf=0;

const norm=s=>String(s||'')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g,'')
  .toLowerCase()
  .replace(/\s+/g,' ')
  .trim();

function target(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const all=norm(card.textContent||'');
  return h.includes('boavista') && all.includes('11 ene 2015');
}

function paint(card){
  if(!PHOTO || !card?.isConnected || !target(card)) return;

  const current=card.querySelector('.v295-boavista-data-bg');
  if(current?.dataset.photoReady==='1'){
    card.dataset.v295Boavista='ready';
    return;
  }

  card.querySelectorAll(
    '.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v286-boavista-2015-bg,.v295-boavista-data-bg'
  ).forEach(n=>n.remove());
  card.querySelector(':scope > .v295-boavista-data-shade')?.remove();

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v295-boavista-data-bg';
  img.dataset.photoReady='1';
  img.alt='Boavista · Campeón · Primera Fuerza · 11 ene 2015';
  img.src=PHOTO;
  img.loading='eager';
  img.decoding='async';
  img.style.cssText='position:absolute!important;inset:0!important;width:100%!important;height:100%!important;display:block!important;visibility:visible!important;opacity:1!important;z-index:0!important;object-fit:cover!important;object-position:center 43%!important;transform:none!important;filter:none!important;margin:0!important;padding:0!important;border:0!important;pointer-events:none!important;';
  card.prepend(img);

  const shade=document.createElement('span');
  shade.className='v295-boavista-data-shade';
  shade.setAttribute('aria-hidden','true');
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.05) 0%,rgba(2,5,45,.11) 38%,rgba(2,5,45,.28) 68%,rgba(2,5,45,.65) 100%),linear-gradient(90deg,rgba(2,5,45,.13),rgba(2,5,45,.02) 72%)!important;';
  card.insertBefore(shade,img.nextSibling);

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background','#060653','important');

  card.querySelectorAll('.v35-history-moment-shade,.v120-exact-shade').forEach(n=>{
    n.style.setProperty('display','none','important');
  });
  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });
  card.querySelectorAll('.v35-history-status span,.v35-history-fact,.v35-champion-fact').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','3','important');
  });

  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
  card.dataset.v295Boavista='ready';
}

function patch(){
  if(!PHOTO || !/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    if(target(card)) paint(card);
  });
}

function schedule(ms=0){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(patch);
  },ms);
}

window.addEventListener('hashchange',()=>schedule(40));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(90);
},true);

new MutationObserver(ms=>{
  const changed=ms.some(m=>[...m.addedNodes].some(n=>
    n.nodeType===1 &&
    !n.classList?.contains('v295-boavista-data-bg') &&
    !n.classList?.contains('v295-boavista-data-shade')
  ));
  if(changed) schedule(35);
}).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',()=>schedule(70),{once:true});
}else{
  schedule(30);
}
setTimeout(patch,450);
setTimeout(patch,1300);
})();