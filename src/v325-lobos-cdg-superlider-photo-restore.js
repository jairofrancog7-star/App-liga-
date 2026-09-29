
import './v328-publications-team-logos.js?v=20260929-publications-team-logos-v328';
/* V327 — Restauración final persistente: Lobos CDG · Súper líder · 03 may 2026.
   Mantiene la tarjeta existente y restaura solamente la fotografía exacta aportada por el usuario. */
const PHOTO='/App-liga-/assets/history/lobos-cdg-superlider-03-may-2026.webp?v=20260928-lobos-cdg-force-v327';

(function(){
'use strict';
if(window.__LJR_V327_LOBOS_CDG_PHOTO__)return;
window.__LJR_V327_LOBOS_CDG_PHOTO__=true;

const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function target(card){
  const t=norm(card?.textContent||'');
  return t.includes('lobos cdg') &&
    t.includes('super lider') &&
    (t.includes('03 may 2026')||t.includes('3 may 2026')||t.includes('03 de mayo de 2026')||t.includes('3 de mayo de 2026'));
}
function style(){
  if(document.getElementById('v327-lobos-cdg-style'))return;
  const s=document.createElement('style');
  s.id='v327-lobos-cdg-style';
  s.textContent=`
    .v327-lobos-cdg-photo{
      position:relative!important;
      overflow:hidden!important;
      isolation:isolate!important;
      background-color:#07075d!important;
      background-size:cover!important;
      background-position:center 47%!important;
      background-repeat:no-repeat!important;
    }
    .v327-lobos-cdg-photo>.v327-lobos-cdg-bg{
      position:absolute!important;
      inset:0!important;
      z-index:0!important;
      width:100%!important;
      height:100%!important;
      display:block!important;
      visibility:visible!important;
      opacity:1!important;
      object-fit:cover!important;
      object-position:center 47%!important;
      transform:none!important;
      filter:none!important;
      margin:0!important;
      padding:0!important;
      border:0!important;
      border-radius:inherit!important;
      pointer-events:none!important;
    }
    .v327-lobos-cdg-photo>.v327-lobos-cdg-shade{
      position:absolute!important;
      inset:0!important;
      z-index:1!important;
      display:block!important;
      pointer-events:none!important;
      background:
        linear-gradient(180deg,rgba(3,5,44,.03) 0%,rgba(3,5,44,.08) 36%,rgba(3,5,44,.50) 72%,rgba(3,5,44,.88) 100%)!important;
    }
    .v327-lobos-cdg-photo>.v35-history-moment-content,
    .v327-lobos-cdg-photo>.v35-champion-content,
    .v327-lobos-cdg-photo>.v115-card-content{
      position:relative!important;
      z-index:2!important;
      background:transparent!important;
      background-image:none!important;
    }
    .v327-lobos-cdg-photo .v35-history-status,
    .v327-lobos-cdg-photo .v35-champion-status{
      position:relative!important;
      z-index:2!important;
      background:transparent!important;
    }
    .v327-lobos-cdg-photo h3,
    .v327-lobos-cdg-photo strong,
    .v327-lobos-cdg-photo b,
    .v327-lobos-cdg-photo p,
    .v327-lobos-cdg-photo span,
    .v327-lobos-cdg-photo time{
      text-shadow:0 2px 8px rgba(0,0,0,.92)!important;
    }
  `;
  document.head.appendChild(s);
}
function apply(card){
  if(!card||!target(card))return;
  style();
  card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card','v327-lobos-cdg-photo');
  card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,5,44,.03) 0%,rgba(3,5,44,.08) 36%,rgba(3,5,44,.50) 72%,rgba(3,5,44,.88) 100%),url("'+PHOTO+'")','important');
  card.style.setProperty('background-size','cover','important');
  card.style.setProperty('background-position','center 47%','important');
  card.style.setProperty('background-repeat','no-repeat','important');

  card.querySelectorAll(':scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo,:scope > .v120-exact-event-bg,:scope > .v316-lobos-photo,:scope > .v318-lobos-photo,:scope > .v327-lobos-cdg-bg').forEach(n=>n.remove());
  card.querySelectorAll(':scope > .v316-lobos-shade,:scope > .v318-lobos-shade,:scope > .v327-lobos-cdg-shade').forEach(n=>n.remove());

  const img=document.createElement('img');
  img.className='v35-history-bg-photo v120-exact-event-bg v120-photo-only-bg v327-lobos-cdg-bg';
  img.src=PHOTO;
  img.alt='Lobos CDG · Súper líder · 03 may 2026';
  img.loading='eager';
  img.decoding='async';

  const shade=document.createElement('span');
  shade.className='v327-lobos-cdg-shade';
  shade.setAttribute('aria-hidden','true');

  card.prepend(shade);
  card.prepend(img);
  card.dataset.v327LobosCdgPhoto='restored';
}
function run(){
  if(!/history/i.test(location.hash||''))return;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,article').forEach(card=>{
    if(!target(card))return;
    const img=card.querySelector(':scope > .v327-lobos-cdg-bg');
    const src=img?.getAttribute('src')||'';
    const hidden=img && (img.style.display==='none'||img.style.visibility==='hidden'||img.style.opacity==='0');
    if(!img || !src.includes('lobos-cdg-superlider-03-may-2026.webp') || hidden){
      apply(card);
    }else{
      card.classList.add('v35-history-moment-photo','v120-has-exact-bg','v120-photo-only-card','v327-lobos-cdg-photo');
      card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,5,44,.03) 0%,rgba(3,5,44,.08) 36%,rgba(3,5,44,.50) 72%,rgba(3,5,44,.88) 100%),url("'+PHOTO+'")','important');
      img.style.setProperty('display','block','important');
      img.style.setProperty('visibility','visible','important');
      img.style.setProperty('opacity','1','important');
    }
  });
}
let timer=0;
function schedule(ms=30){
  clearTimeout(timer);
  timer=setTimeout(()=>{run();setTimeout(run,160);setTimeout(run,520);},ms);
}
window.addEventListener('hashchange',()=>schedule(30));
document.addEventListener('click',e=>{
  if(e.target.closest('[data-v35-tab],[data-history-tab],button,[data-route]'))schedule(60);
},true);
const root=document.querySelector('#screen')||document.body;
new MutationObserver(()=>schedule(45)).observe(root,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(40),{once:true});
else schedule(20);
})();