(()=>{
'use strict';
const PHOTO='./assets/history/archive-v271/real-dhp-campeon-copa-intermedia-31-dic-2017.webp?v=20260923-real-dhp-bg-hardfix-v271';
const RAW='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v271/real-dhp-campeon-copa-intermedia-31-dic-2017.webp?v=20260923-real-dhp-bg-hardfix-v271';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function target(card){
  const h=norm(card.querySelector('h3,h4')?.textContent||'');
  const d=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  const a=norm(card.textContent||'');
  return h.includes('real dhp')&&(d.includes('31 dic 2017')||a.includes('31 dic 2017'));
}
function apply(card){
  card.dataset.v271Dhp='1';
  card.classList.add('v120-has-exact-bg','v120-photo-only-card','v35-history-moment-photo','v271-real-dhp-card');
  card.style.setProperty('position','relative','important');
  card.style.setProperty('overflow','hidden','important');
  card.style.setProperty('isolation','isolate','important');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,5,45,.05),rgba(2,5,45,.28) 50%,rgba(2,5,45,.78) 100%),url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 48%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  card.querySelectorAll('.v35-history-bg-photo,.v35-champion-bg-photo,.v120-exact-event-bg,.v269-real-dhp-bg,.v271-real-dhp-bg').forEach(n=>n.remove());
  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v271-real-dhp-bg';
  img.src=PHOTO;
  img.alt='Real DHP · Campeón de Copa · Fuerza Intermedia · 31 dic 2017';
  img.loading='eager'; img.decoding='async';
  img.onerror=()=>{ if(img.src!==RAW) img.src=RAW; };
  [
    ['position','absolute'],['inset','0'],['width','100%'],['height','100%'],
    ['min-width','100%'],['min-height','100%'],['max-width','none'],['max-height','none'],
    ['z-index','0'],['object-fit','cover'],['object-position','center 48%'],
    ['transform','none'],['opacity','1'],['display','block'],['visibility','visible'],
    ['filter','brightness(.82) saturate(1.02) contrast(1.03)'],['pointer-events','none']
  ].forEach(([k,v])=>img.style.setProperty(k,v,'important'));
  card.prepend(img);

  let shade=card.querySelector(':scope > .v271-real-dhp-shade');
  if(!shade){
    shade=document.createElement('span');
    shade.className='v271-real-dhp-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
  }
  shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.08) 0%,rgba(2,5,45,.20) 38%,rgba(2,5,45,.78) 100%),linear-gradient(90deg,rgba(2,5,45,.28),rgba(2,5,45,.03) 78%)!important;';
  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{
    n.style.setProperty('position','relative','important');
    n.style.setProperty('z-index','2','important');
    n.style.setProperty('background','transparent','important');
  });
  card.querySelectorAll('h3,h4,p,b,strong,small,.v35-history-date,.v35-champion-date,.v35-history-kind').forEach(n=>{
    n.style.setProperty('text-shadow','0 2px 10px rgba(0,0,0,.96)','important');
  });
}
function patch(){
  if(!/history|safe-about/.test(location.hash||'')) return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(c=>{if(target(c))apply(c)});
}
let t=0;
const schedule=(ms=0)=>{clearTimeout(t);t=setTimeout(patch,ms)};
window.addEventListener('hashchange',()=>schedule(50));
document.addEventListener('click',()=>schedule(100),true);
new MutationObserver(()=>schedule(30)).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(70),{once:true});else schedule(50);
setTimeout(patch,250);setTimeout(patch,700);setTimeout(patch,1500);setTimeout(patch,3000);
})();