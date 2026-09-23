(()=>{
'use strict';
const PAGE='/App-liga-/assets/history/archive-v256/la-esperanza-campeon-liga-veteranos-25-sep-2021.webp?v=20260923-esperanza-2021-hard-v262';
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v256/la-esperanza-campeon-liga-veteranos-25-sep-2021.webp?v=20260923-esperanza-2021-hard-v262';
const wanted=location.origin+PAGE;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function isTarget(card){
  const heading=norm(card.querySelector('h3,h4')?.textContent||'');
  const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const all=norm(card.textContent||'');
  return heading.includes('la esperanza') && (date.includes('25 sep 2021') || all.includes('25 sep 2021'));
}

function force(card){
  card.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo').forEach(n=>{
    if(!n.classList.contains('v262-esperanza2021-bg')) n.remove();
  });

  let img=card.querySelector('.v262-esperanza2021-bg');
  if(!img){
    img=document.createElement('img');
    img.className='v120-exact-event-bg v120-photo-only-bg v262-esperanza2021-bg';
    img.alt='La Esperanza · Campeón de Liga · Veteranos · 25 sep 2021';
    img.loading='eager';
    img.decoding='async';
    img.onerror=()=>{
      if(img.src!==RAW) img.src=RAW;
    };
    card.prepend(img);
  }
  if(img.src!==wanted && img.src!==RAW) img.src=wanted;

  [
    ['position','absolute'],['inset','0'],['width','100%'],['height','100%'],
    ['display','block'],['visibility','visible'],['opacity','1'],['z-index','0'],
    ['object-fit','cover'],['object-position','center 44%'],['transform','scale(1)'],
    ['transform-origin','center 44%'],['filter','none'],['margin','0'],['padding','0']
  ].forEach(([k,v])=>img.style.setProperty(k,v,'important'));

  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-color','#060653','important');
  card.style.setProperty(
    'background-image',
    'linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.10) 40%,rgba(2,5,45,.58) 100%),url("'+wanted+'")',
    'important'
  );
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 44%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  let shade=card.querySelector(':scope > .v120-exact-shade');
  if(!shade){
    shade=document.createElement('span');
    shade.className='v120-exact-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.setProperty('position','absolute','important');
  shade.style.setProperty('inset','0','important');
  shade.style.setProperty('z-index','1','important');
  shade.style.setProperty('pointer-events','none','important');
  shade.style.setProperty(
    'background',
    'linear-gradient(180deg,rgba(2,5,45,.00) 0%,rgba(2,5,45,.05) 42%,rgba(2,5,45,.55) 100%)',
    'important'
  );

  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(content=>{
    content.style.setProperty('position','relative','important');
    content.style.setProperty('z-index','2','important');
    content.style.setProperty('background','transparent','important');
  });

  card.classList.add('v120-has-exact-bg','v120-photo-only-card','v35-history-moment-photo');
  card.dataset.v262Esperanza2021='1';
}

function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    if(isTarget(card)) force(card);
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
window.addEventListener('hashchange',()=>schedule(60));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(120);
},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(40)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>schedule(120),{once:true});
else schedule(80);
setTimeout(patch,500);
setTimeout(patch,1400);
})();