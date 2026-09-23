(()=>{
'use strict';
const PHOTO=location.origin+'/App-liga-/assets/history/archive-v269/juventus-campeon-liga-primera-17-abr-2022.webp?v=20260923-juventus-restore-v269';
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v269/juventus-campeon-liga-primera-17-abr-2022.webp?v=20260923-juventus-restore-v269';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function target(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const d=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const all=norm(card.textContent||'');
  return h.includes('juventus') && (d.includes('17 abr 2022') || all.includes('17 abr 2022'));
}
function apply(card){
  let img=card.querySelector('.v268-juventus-2022-bg');
  if(!img){
    card.querySelectorAll('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo').forEach(n=>n.remove());
    img=document.createElement('img');
    img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v268-juventus-2022-bg';
    img.alt=''; img.setAttribute('aria-hidden','true');
    img.loading='eager'; img.decoding='async';
    img.onerror=()=>{ if(img.src!==RAW) img.src=RAW; };
    card.prepend(img);
  }
  if(img.src!==PHOTO && img.src!==RAW) img.src=PHOTO;
  [
    ['position','absolute'],['inset','0'],['width','100%'],['height','100%'],
    ['display','block'],['visibility','visible'],['opacity','1'],['z-index','0'],
    ['object-fit','cover'],['object-position','center 46%'],['transform','scale(1)'],
    ['filter','none'],['margin','0'],['padding','0']
  ].forEach(([k,v])=>img.style.setProperty(k,v,'important'));
  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,5,50,.02),rgba(3,5,50,.16) 48%,rgba(3,5,50,.62) 100%),url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 46%','important');
  card.style.setProperty('background-repeat','no-repeat','important');
  let shade=card.querySelector(':scope > .v268-juventus-2022-shade');
  if(!shade){
    shade=document.createElement('span');
    shade.className='v268-juventus-2022-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.00),rgba(2,5,45,.08) 45%,rgba(2,5,45,.62) 100%)!important;';
  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });
  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card');
  card.querySelectorAll('.v35-history-status span').forEach(n=>{
    n.style.setProperty('background','rgba(3,8,70,.58)','important');
    n.style.setProperty('backdrop-filter','blur(1.5px)','important');
    n.style.setProperty('-webkit-backdrop-filter','blur(1.5px)','important');
  });
  card.dataset.v268Juventus2022='1';
  card.dataset.v269Juventus2022='1';
}
function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{if(target(card))apply(card)});
}
let raf=0,t=0;
function schedule(ms=0){clearTimeout(t);t=setTimeout(()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(patch)},ms)}
window.addEventListener('hashchange',()=>schedule(60));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab],button,[data-route]'))schedule(120)},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(40)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});else schedule(80);
setTimeout(patch,500);setTimeout(patch,1400);
})();