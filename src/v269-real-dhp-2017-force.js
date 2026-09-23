(()=>{
'use strict';
const PHOTO=window.LJR_REAL_DHP_2017_PHOTO||''; if(!PHOTO)return;
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
function target(card){const h=norm(card.querySelector('h3,h4')?.textContent||'');const d=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');const a=norm(card.textContent||'');return h.includes('real dhp')&&(d.includes('31 dic 2017')||a.includes('31 dic 2017'));}
function apply(card){
  if(card.dataset.v269Dhp==='1')return;
  card.dataset.v269Dhp='1';
  card.classList.add('v120-has-exact-bg','v120-photo-only-card','v35-history-moment-photo','v269-real-dhp-card');
  card.style.setProperty('position','relative','important');card.style.setProperty('overflow','hidden','important');card.style.setProperty('isolation','isolate','important');
  card.querySelectorAll('.v35-history-bg-photo,.v35-champion-bg-photo,.v120-exact-event-bg').forEach(n=>n.remove());
  const img=document.createElement('img'); img.className='v120-exact-event-bg v120-photo-only-bg v269-real-dhp-bg'; img.src=PHOTO; img.alt='Real DHP · Campeón de Copa · Fuerza Intermedia · 31 dic 2017'; img.loading='eager'; img.decoding='async';
  [['position','absolute'],['inset','0'],['width','100%'],['height','100%'],['z-index','0'],['object-fit','cover'],['object-position','center 48%'],['transform','scale(1)'],['opacity','1'],['display','block'],['visibility','visible'],['filter','saturate(1.02) contrast(1.02) brightness(.88)']].forEach(([k,v])=>img.style.setProperty(k,v,'important')); card.prepend(img);
  const shade=document.createElement('span'); shade.className='v269-real-dhp-shade'; shade.setAttribute('aria-hidden','true'); shade.style.cssText='position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;background:linear-gradient(180deg,rgba(2,5,45,.14) 0%,rgba(2,5,45,.28) 42%,rgba(2,5,45,.88) 100%),linear-gradient(90deg,rgba(2,5,45,.28),rgba(2,5,45,.04) 76%,rgba(2,5,45,.02))!important;'; card.insertBefore(shade,img.nextSibling);
  card.querySelectorAll('.v35-history-moment-content,.v35-champion-content,.v115-card-body').forEach(n=>{n.style.setProperty('position','relative','important');n.style.setProperty('z-index','2','important');n.style.setProperty('background','transparent','important');});
  card.querySelectorAll('h3,h4,p,b,strong,small,.v35-history-date,.v35-champion-date').forEach(n=>n.style.setProperty('text-shadow','0 2px 10px rgba(0,0,0,.96)','important'));
}
function patch(){if(!/history|safe-about/.test(location.hash||''))return;document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(c=>{if(target(c))apply(c)});}
let t=0;const schedule=(ms=0)=>{clearTimeout(t);t=setTimeout(patch,ms)};window.addEventListener('hashchange',()=>schedule(60));document.addEventListener('click',()=>schedule(120),true);new MutationObserver(()=>schedule(40)).observe(document.querySelector('#screen')||document.body,{childList:true,subtree:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(100),{once:true});else schedule(80);setTimeout(patch,500);setTimeout(patch,1300);
})();