/* V120 — fondos históricos exactos. Solo aplica fotos del mismo campeonato/premiación.
   Si no existe una foto exacta, no reutiliza una imagen de otro evento. */
(function(){
'use strict';

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v120/';
const BASE132='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v132/';
const BASE197='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v197/';
const BASE133='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v133/';
const BASE134='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v134/';
const BASE119='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v119/';
const BASE195='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v195/';
const BASE196='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v196/';
const BASE199='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v199/';
const BASE203='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/';
const BASE204='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v204/';
const BASE205='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v205/';
const BASE207='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v207/';
const BASE212='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v212/';
const BASE202='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v202/';
const BASE185='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v185/';
const SAN_JULIAN_2024='data:image/jpeg;base64,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...truncated'; // san-julian-photo-data
const EXACT=[
  {need:['san julian','18 feb 2024'],src:SAN_JULIAN_2024,pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['lobos jrs','23 sep 2026'],src:BASE212+'lobos-jrs-campeon-segunda-23-sep-2026.jpg?v=20260923-lobos-segunda-v212',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['galacticos','09 feb 2025'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg',pos:'center 48%',photoOnly:true,scale:1.06,origin:'center 48%'},
  {need:['linces','04 mar 2024'],src:BASE202+'linces-campeon-copa-04-mar-2024.webp',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['boca jrs','04 may 2024'],src:BASE202+'boca-jrs-campeon-liga-v50-04-may-2024.webp',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['psv','02 oct 2021'],src:BASE134+'psv-campeon-campeones-veteranos-2020-2021.jpg',pos:'center 68%',photoOnly:true,scale:2.00,origin:'center 67%'},
  {need:['la esperanza','25 sep 2021'],src:BASE134+'la-esperanza-campeon-liga-veteranos-2020-2021.jpg',pos:'72% 77%',photoOnly:true,scale:2.25,origin:'72% 77%'},
  {need:['juventus','16 feb 2020'],src:BASE134+'juventus-campeon-copa-primera-2019-2020.jpg',pos:'center 48%'},
  {need:['tavera','16 feb 2020'],src:BASE134+'tavera-campeon-copa-segunda-2019-2020.jpg',pos:'center 46%'},
  {need:['el alto','19 ene 2020'],src:BASE134+'el-alto-campeon-copa-intermedia-2020.jpg',pos:'center 69%',photoOnly:true,scale:2.05,origin:'center 68%'},
  {need:['juventus','21 sep 2024'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v201/juventus-campeon-campeones-21-sep-2024.jpg',pos:'center 44%'},
  {need:['juventus','17 feb 2024'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v202/juventus-campeon-copa-veteranos35-17-feb-2024.webp',pos:'center 45%'},
  {need:['promesas de pozos','17 nov 2024'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v117/promesas-campeon-2024.webp',pos:'center 46%'},
  {need:['barza','23 jul 2023'],src:BASE133+'barza-campeon-campeones-intermedia-2022-2023.jpg',pos:'center 44%'},
  {need:['juventus','02 oct 2022'],src:BASE133+'juventus-campeon-copa-primera-2022.jpg',pos:'center 46%'},
  {need:['barza','25 sep 2022'],src:BASE133+'barza-campeon-copa-intermedia-2022.jpg',pos:'center 45%'},
  {need:['la canchita deportes','07 jun 2026'],src:BASE132+'canchita-deportes-campeon-segunda-2026.jpg',pos:'center 45%'},
  {need:['franco fc','24 may 2026'],src:BASE132+'franco-fc-campeon-de-campeones-2026.jpg',pos:'center 44%'},
  {need:['la esperanza','23 may 2026'],src:BASE132+'la-esperanza-campeon-23-mayo-2026.jpg',pos:'center 44%'},
  {need:['franco fc','10 may 2026'],src:BASE132+'franco-fc-campeon-intermedia-2026.jpg?v=20260923-franco-blue-v211',pos:'center 43%',photoOnly:true,scale:1.03,origin:'center 43%'},
  {need:['la esperanza','10 may 2026'],src:BASE132+'la-esperanza-subcampeon-intermedia-2026.jpg?v=20260923-esperanza-yellow-v211',pos:'center 45%'},
  {need:['linces','15 mar 2026'],src:BASE132+'linces-campeon-primera-2026.jpg',pos:'center 45%'},
  {need:['galacticos','15 mar 2026'],src:BASE132+'galacticos-subcampeon-primera-2026.jpg',pos:'center 45%'},
  {need:['salvajes','20 dic 2025'],src:BASE132+'salvajes-campeon-copa-2025.jpg',pos:'center 42%'},
  {need:['la esperanza','08 nov 2025'],src:BASE195+'la-esperanza-campeon-veteranos50-2025-2026.jpg',pos:'center 46%'},
  {need:['juventus','20 sep 2025'],src:BASE132+'juventus-campeon-liga-veteranos-35-2025.jpg',pos:'center 43%'},
  {need:['la huerta de cuenda','29 jun 2025'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg',pos:'center 43%'},
  {need:['tavera fc','29 jun 2025'],src:BASE119+'tavera-finalista-2025.jpg',pos:'center 43%'},
  {need:['galacticos fc','20 mar 2022'],src:BASE185+'galacticos-campeon-segunda-2022.webp',pos:'center 44%'},
  {need:['magisterio','09 jul 2016'],src:BASE+'magisterio-campeon-copa-2016.jpg',pos:'center 42%'},
  {need:['malvinas','28 feb 2016'],src:BASE+'malvinas-campeon-campeones-intermedia-2016.jpg',pos:'center 42%'},
  {need:['tecos','campe'],src:BASE+'tecos-campeon-historico.jpg',pos:'center 46%'},
  {need:['real cerrito de gasca','15 dic 2013'],src:BASE+'real-cerrito-campeon-2013.jpg',pos:'center 38%'},
  {need:['la esperanza','14 jun 2014'],src:BASE+'la-esperanza-campeon-copa-veteranos-2014.jpg',pos:'center 42%'},
  {need:['juventus','01 feb 2025'],src:BASE197+'juventus-campeon-copa-01-feb-2025.jpg',pos:'center 45%'},
  {need:['lobos cdg','15 jun 2025'],src:BASE207+'lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp?v=20260923-lobos-clean-v212',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['boavista','12 abr 2025'],src:BASE+'boavista-fc-campeon-2025.jpg',pos:'center 42%'},
  {need:['galacticos','08 jun 2025'],src:BASE205+'galacticos-pozos-campeon-copa-08-jun-2025.webp?v=20260923-galacticos-fix211',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  {need:['pozos fc','15 sep 2024'],src:BASE199+'pozos-fc-campeon-liga-veteranos35-15-sep-2024.jpg',pos:'center 47%'},
  {need:['herreras','04 feb 2025'],src:BASE207+'herreras-fc-campeon-liga-primera-04-feb-2025.webp',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['herreras','09 feb 2025'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v208/herreras-fc-campeon-relampago-intermedia-09-feb-2025.webp',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['lobos jrs','16 feb 2025'],src:BASE207+'lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  
  {need:['deportivo cg','19 sep 2026'],src:BASE+'deportivo-cg-campeon-liga-2025-2026.jpg',pos:'center 42%'},
  {need:['cerrito de gasca','19 sep 2026'],src:BASE+'deportivo-cg-campeon-liga-2025-2026.jpg',pos:'center 42%'},
  {need:['oklahoma city','campe'],src:BASE+'oklahoma-city-campeon.jpg',pos:'center 44%'}
];

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
function matchExact(card){
  const all=norm(card.textContent);
  const heading=norm(card.querySelector('h3,h4')?.textContent||'');
  const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
  /* V212 — el nombre del equipo se valida contra el título de la tarjeta.
     Antes se buscaba en todo el texto; por eso la tarjeta "La Esperanza"
     coincidía primero con "Franco FC" al mencionar al rival en la descripción. */
  const strict=EXACT.find(x=>{
    const need=(x.need||[]).map(norm).filter(Boolean);
    if(!need.length)return false;
    if(!heading.includes(need[0]))return false;
    return need.slice(1).every(n=>date.includes(n)||all.includes(n));
  });
  if(strict)return strict;
  return EXACT.find(x=>x.need.every(n=>all.includes(norm(n))))||null;
}
function installStyle(){
  if(document.getElementById('v120-history-exact-style'))return;
  const s=document.createElement('style');
  s.id='v120-history-exact-style';
  s.textContent=`
    .v120-has-exact-bg{position:relative!important;overflow:hidden!important;isolation:isolate!important;background:#060653!important}
    .v120-exact-event-bg{position:absolute!important;inset:0!important;z-index:0!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;object-fit:cover!important;border:0!important;border-radius:inherit!important;filter:saturate(1.05) contrast(1.02) brightness(.98)!important}
    .v120-photo-only-card{overflow:hidden!important}
    .v120-photo-only-card .v120-exact-event-bg{will-change:transform!important}
    .v120-has-exact-bg>.v120-exact-shade{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(180deg,rgba(2,5,45,.00) 0%,rgba(2,5,45,.035) 34%,rgba(2,5,45,.18) 66%,rgba(2,5,45,.62) 100%),linear-gradient(90deg,rgba(2,5,45,.17) 0%,rgba(2,5,45,.035) 72%,rgba(2,5,45,0) 100%)}
    .v120-has-exact-bg .v35-history-moment-content,.v120-has-exact-bg .v35-champion-content,.v115-card.v120-has-exact-bg .v115-card-body{position:relative!important;z-index:2!important;background:transparent!important}
    .v35-history-moment.v120-has-exact-bg{min-height:310px!important;display:flex!important;align-items:flex-end!important;padding:0!important}
    .v35-history-moment.v120-has-exact-bg .v35-history-moment-content{width:100%!important;padding:20px 18px 18px!important}
    .v35-champion-card.v120-has-exact-bg{min-height:300px!important;display:flex!important;align-items:flex-end!important;padding:0!important}
    .v35-champion-card.v120-has-exact-bg .v35-champion-content{width:100%!important;padding:18px 16px 17px!important}
    .v120-has-exact-bg .v35-history-status span{background:rgba(3,8,58,.10)!important;border:1px solid rgba(58,232,242,.50)!important;box-shadow:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    .v120-has-exact-bg .v35-history-date,.v120-has-exact-bg .v35-champion-date{background:rgba(3,7,60,.48)!important;backdrop-filter:blur(4px)!important;-webkit-backdrop-filter:blur(4px)!important}
    .v120-has-exact-bg h3,.v120-has-exact-bg h4,.v120-has-exact-bg b,.v120-has-exact-bg strong,.v120-has-exact-bg p,.v120-has-exact-bg small{position:relative;z-index:2;text-shadow:0 2px 9px rgba(0,0,0,.78)}
    .v115-card.v120-has-exact-bg{min-height:310px!important;display:flex!important;align-items:flex-end!important;padding:0!important;border-color:rgba(92,225,245,.30)!important}
    .v115-card.v120-has-exact-bg .v115-card-body{width:100%!important;padding:18px 16px!important}
    .v115-card.v120-has-exact-bg .v115-date{background:rgba(4,8,63,.46)!important;border:1px solid rgba(80,230,242,.42)!important;border-radius:999px!important;padding:5px 9px!important;display:inline-flex!important}
    .v115-card.v120-has-exact-bg .v115-card-body p,.v115-card.v120-has-exact-bg .v115-card-body small{color:#f0f3ff!important}
    .v120-photo-proof{position:absolute;top:13px;right:13px;z-index:3;padding:5px 8px;border:1px solid rgba(255,255,255,.23);border-radius:999px;background:rgba(3,7,60,.44);color:#fff;font-size:7px;font-weight:900;letter-spacing:.08em;text-transform:uppercase;text-shadow:0 1px 4px #000}
    @media(max-width:420px){.v35-history-moment.v120-has-exact-bg,.v35-champion-card.v120-has-exact-bg,.v115-card.v120-has-exact-bg{min-height:292px!important}}
  `;
  document.head.appendChild(s);
}
function clearWrongReference(card){
  const visual=card.querySelector('.v115-visual');
  if(visual && /referencia de archivo/i.test(visual.textContent||'')) visual.remove();
}
function apply(card){
  const hit=matchExact(card);
  const nextKey=hit?.src||'none';
  if(card.dataset.v120Checked==='1'&&card.dataset.v120Key===nextKey)return;
  card.dataset.v120Checked='1';
  card.dataset.v120Key=nextKey;
  if(!hit){
    if(card.matches('.v115-card'))clearWrongReference(card);
    return;
  }
  card.querySelectorAll('.v35-history-bg-photo,.v35-champion-bg-photo,.v120-exact-event-bg,.v115-visual').forEach(n=>n.remove());
  const img=document.createElement('img');
  img.className='v120-exact-event-bg';
  img.src=hit.src;
  img.alt='Fotografía exacta del campeonato o premiación';
  img.loading='lazy';
  img.decoding='async';
  img.style.objectPosition=hit.pos||'center';
  if(hit.photoOnly){
    img.classList.add('v120-photo-only-bg');
    img.style.transform='scale('+(hit.scale||1.42)+')';
    img.style.transformOrigin=hit.origin||'center center';
  }
  img.onerror=()=>{card.classList.remove('v120-has-exact-bg');img.remove();};
  card.prepend(img);
  if(!card.querySelector(':scope > .v120-exact-shade')){
    const sh=document.createElement('span'); sh.className='v120-exact-shade'; sh.setAttribute('aria-hidden','true'); card.insertBefore(sh,img.nextSibling);
  }
  if(hit.photoOnly){
    card.querySelectorAll('.v120-photo-proof').forEach(n=>n.remove());
    [...card.querySelectorAll('span')].forEach(n=>{
      if(String(n.textContent||'').trim().toUpperCase()==='FOTO DEL ARCHIVO') n.remove();
    });
    card.classList.add('v120-photo-only-card');
  }else if(!card.querySelector('.v120-photo-proof')){
    const proof=document.createElement('span'); proof.className='v120-photo-proof'; proof.textContent='FOTO DEL ARCHIVO'; card.appendChild(proof);
  }
  card.classList.add('v120-has-exact-bg');
  if(card.matches('.v35-history-moment'))card.classList.add('v35-history-moment-photo');
  if(card.matches('.v35-champion-card'))card.classList.add('v35-champion-card-photo');
}
function patch(){
  if((location.hash||'').indexOf('history')<0 && (location.hash||'').indexOf('safe-about')<0)return;
  installStyle();
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(apply);
}
let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(patch)}
window.addEventListener('hashchange',()=>setTimeout(schedule,30));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab]'))setTimeout(schedule,80)},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule()).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(schedule,80),{once:true});else setTimeout(schedule,80);
})();