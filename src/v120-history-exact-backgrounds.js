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
const BASE202='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v202/';
const BASE185='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v185/';
const EXACT=[
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
  {need:['herreras','09 feb 2025'],src:BASE+'herreras-fc-campeon-relampago-intermedia-2025.jpg',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['lobos jrs','16 feb 2025'],src:BASE207+'lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  
  {need:['deportivo cg','19 sep 2026'],src:BASE+'deportivo-cg-campeon-liga-2025-2026.jpg',pos:'center 42%'},
  {need:['cerrito de gasca','19 sep 2026'],src:BASE+'deportivo-cg-campeon-liga-2025-2026.jpg',pos:'center 42%'},
  {need:['oklahoma city','campe'],src:BASE+'oklahoma-city-campeon.jpg',pos:'center 44%'}
];

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
}
function matchExact(card){
  const t=norm(card.textContent);
  return EXACT.find(x=>x.need.every(n=>t.includes(norm(n))))||null;
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
  if(card.dataset.v120Checked==='1')return;
  card.dataset.v120Checked='1';
  const hit=matchExact(card);
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