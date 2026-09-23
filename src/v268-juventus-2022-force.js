(()=>{
'use strict';

const VERSION='20260923-juventus-17abr2022-hard-v285';
const PAGE='/App-liga-/assets/history/archive-v269/juventus-campeon-liga-primera-17-abr-2022.jpg?v='+VERSION;
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v269/juventus-campeon-liga-primera-17-abr-2022.jpg?v='+VERSION;
const wanted=location.origin+PAGE;

const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function target(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const d=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const all=norm(card.textContent||'');
  return h.includes('juventus') && (d.includes('17 abr 2022') || all.includes('17 abr 2022'));
}

function force(card){
  card.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo,.v268-juventus-2022-bg').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v268-juventus-2022-bg';
  img.alt='Juventus · Campeón de Liga · Primera Fuerza · 17 abr 2022';
  img.loading='eager';
  img.decoding='async';
  img.src=wanted;
  img.onerror=()=>{ if(img.src!==RAW) img.src=RAW; };
  [
    ['position','absolute'],['inset','0'],['width','100%'],['height','100%'],
    ['display','block'],['visibility','visible'],['opacity','1'],['z-index','0'],
    ['object-fit','cover'],['object-position','center 44%'],['transform','scale(1)'],
    ['transform-origin','center 44%'],['filter','none'],['margin','0'],['padding','0'],['border','0']
  ].forEach(([k,v])=>img.style.setProperty(k,v,'important'));
  card.prepend(img);

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-color','#07075d','important');
  card.style.setProperty(
    'background-image',
    'linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.12) 42%,rgba(2,5,45,.70) 100%),url("'+wanted+'")',
    'important'
  );
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 44%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  let shade=card.querySelector(':scope > .v285-juventus-2022-shade');
  if(!shade){
    shade=document.createElement('span');
    shade.className='v285-juventus-2022-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.08) 40%,rgba(2,5,45,.38) 68%,rgba(2,5,45,.74) 100%),linear-gradient(90deg,rgba(2,5,45,.18),rgba(2,5,45,.02) 74%)!important;';

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });

  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
  card.dataset.v285Juventus2022='1';
}

function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    if(target(card)) force(card);
  });
}

let raf=0;
function schedule(delay=0){
  clearTimeout(schedule.t);
  schedule.t=setTimeout(()=>{
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(patch);
  },delay);
}

window.addEventListener('hashchange',()=>schedule(50));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(100);
},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(35)).observe(root,{childList:true,subtree:true});

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});
else schedule(60);
setTimeout(patch,450);
setTimeout(patch,1200);
})();