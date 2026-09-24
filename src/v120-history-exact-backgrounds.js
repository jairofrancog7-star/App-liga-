/* V120 — fondos históricos exactos. Solo aplica fotos del mismo campeonato/premiación.
   Si no existe una foto exacta, no reutiliza una imagen de otro evento. */
(function(){
'use strict';

// V235 — foto exacta aportada por el usuario para Manchester · Campeón de Campeones · 26 abr 2025.
// Se embebe para evitar que GitHub Pages/cache deje la tarjeta azul sin fotografía.
const MANCHESTER_2025_PHOTO='./assets/history/archive-v225/manchester-campeon-campeones-26-abr-2025.webp?v=20260923-manchester-real-v237';

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
const BASE214='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v214/';
const BASE216='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v216/';
const BASE222='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v222/';
const BASE202='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v202/';
const ESPERANZA_2025_PHOTO='./assets/history/archive-v224/la-esperanza-campeon-copa-veteranos50-08-nov-2025.webp?v=20260923-esperanza-bg-v225';
const BASE185='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v185/';
const SAN_JULIAN_2024=window.LJR_SAN_JULIAN_PHOTO||'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v218/san-julian-campeon-copa-segunda-18-feb-2024.jpg?v=20260923-san-julian-v224';
const EXACT=[
  {need:['abejas','03 nov 2019'],src:(window.LJR_ABEJAS_2019_PHOTO||''),pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['aldama fc','07 jun 2026'],src:'./assets/history/archive-v304/aldama-fc-subcampeon-segunda-07-jun-2026.webp?v=20260923-aldama-photo-v304',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['romerillo','23 nov 2013'],src:'./assets/history/archive-v293/romerillo-tercer-lugar-intermedia-23-nov-2013.jpg?v=20260923-romerillo-bg-23nov2013-v293',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['valencia','03 dic 2012'],src:'./assets/history/archive-v282/valencia-campeon-copa-intermedia-03-dic-2012.webp?v=20260923-valencia-copa-2012-v282',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['real dhp','31 dic 2017'],src:'./assets/history/archive-v271/real-dhp-campeon-copa-intermedia-31-dic-2017.webp?v=20260923-real-dhp-bg-hardfix-v271',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['tavera fc','11 dic 2012'],src:'./assets/history/archive-v260/tavera-campeon-copa-segunda-11-dic-2012.webp?v=20260923-old-history-v260',pos:'center 47%',photoOnly:true,scale:1.0,origin:'center 47%'},
  {need:['universidad vs dinamo','09 mar 2013'],src:'./assets/history/archive-v260/universidad-vs-dinamo-final-veteranos-09-mar-2013.webp?v=20260923-old-history-v260',pos:'center 47%',photoOnly:true,scale:1.0,origin:'center 47%'},
  {need:['dhp','22 feb 2014'],src:'./assets/history/archive-v260/dhp-campeon-copa-segunda-22-feb-2014.webp?v=20260923-old-history-v260',pos:'center 36%',photoOnly:true,scale:0.78,origin:'center 36%'},
  {need:['puros cuates','22 feb 2014'],src:'./assets/history/archive-v260/puros-cuates-campeon-copa-intermedia-22-feb-2014.webp?v=20260923-puros-cuates-2014-live-v280',pos:'center 34%',photoOnly:true,scale:0.78,origin:'center 34%'},
  {need:['juventus','26 nov 2012'],src:'./assets/history/archive-v261/juventus-campeon-primera-26-nov-2012.webp?v=20260923-juventus-hardfix-v261',pos:'center 56%',photoOnly:true,scale:1.0,origin:'center 56%'},
  {need:['puros cuates','11 ene 2015'],src:'./assets/history/archive-v258/puros-cuates-campeon-intermedia-11-ene-2015.webp?v=20260923-puros-cuates-2015-bg-v258',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['boavista','18 ene 2015'],src:'./assets/history/archive-v278/boavista-campeon-de-campeones-primera-18-ene-2015.jpg?v=20260923-boavista-cdc-user-v278',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['juventus','17 abr 2022'],src:'./assets/history/archive-v269/juventus-campeon-liga-primera-17-abr-2022.jpg?v=20260923-juventus-17abr2022-hard-v285',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['tavera fc','10 abr 2022'],src:'./assets/history/archive-v253/tavera-campeon-liga-intermedia-10-abr-2022.webp?v=20260923-tavera-2022-v253',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['manchester','09 nov 2024'],src:'./assets/history/archive-v240/manchester-campeon-copa-v50-09-nov-2024-user.webp?v=20260923-manchester-user-v240',pos:'center 50%',photoOnly:true,scale:1.08,origin:'center 50%'},
  {need:['manchester','26 abr 2025'],src:MANCHESTER_2025_PHOTO,pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['san julian','18 feb 2024'],src:SAN_JULIAN_2024,pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['lobos jrs','23 sep 2026'],src:BASE212+'lobos-jrs-campeon-segunda-23-sep-2026.jpg?v=20260923-lobos-segunda-v212',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['galacticos','09 feb 2025'],src:'./assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-real-v244',pos:'center 48%',photoOnly:true,scale:1.00,origin:'center 48%'},
  {need:['linces','04 mar 2024'],src:BASE202+'linces-campeon-copa-04-mar-2024.webp',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['boca jrs','04 may 2024'],src:BASE202+'boca-jrs-campeon-liga-v50-04-may-2024.webp',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['la esperanza','22 jun 2019'],src:'./assets/history/archive-v250/la-esperanza-campeon-campeones-veteranos-22-jun-2019.webp?v=20260923-esperanza-2019-bg-v250',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  {need:['psv','17 nov 2019'],src:'./assets/history/archive-v249/psv-campeon-copa-veteranos-17-nov-2019.webp?v=20260923-psv-copa2019-real-v249',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['la pandilla de morales','16 sep 2019'],src:'./assets/history/archive-v249/la-pandilla-morales-campeon-liga-2019.jpg?v=20260923-pandilla-linces-v249',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['linces jr','16 sep 2019'],src:'./assets/history/archive-v249/linces-jr-campeon-liga-2019.jpg?v=20260923-pandilla-linces-v249',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['psv','02 oct 2021'],src:BASE134+'psv-campeon-campeones-veteranos-2020-2021.jpg',pos:'center 68%',photoOnly:true,scale:2.00,origin:'center 67%'},
  {need:['la esperanza','25 sep 2021'],src:'./assets/history/archive-v256/la-esperanza-campeon-liga-veteranos-25-sep-2021.webp?v=20260923-esperanza-2021-user-v260',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['juventus','16 feb 2020'],src:BASE134+'juventus-campeon-copa-primera-2019-2020.jpg',pos:'center 48%'},
  {need:['tavera','16 feb 2020'],src:BASE134+'tavera-campeon-copa-segunda-2019-2020.jpg',pos:'center 46%'},
  {need:['el alto','19 ene 2020'],src:BASE134+'el-alto-campeon-copa-intermedia-2020.jpg',pos:'center 69%',photoOnly:true,scale:2.05,origin:'center 68%'},
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
  {need:['linces','15 mar 2026'],src:BASE132+'galacticos-subcampeon-primera-2026.jpg?v=20260924-swap-linces-galacticos-v292',pos:'center 45%'},
  {need:['galacticos','15 mar 2026'],src:BASE132+'linces-campeon-primera-2026.jpg?v=20260924-swap-linces-galacticos-v292',pos:'center 45%'},
  {need:['salvajes','20 sep 2025'],src:'./assets/history/archive-v305/salvajes-subcampeon-veteranos35-20-sep-2025.webp?v=20260923-salvajes-fixed-v307',pos:'center 45%',photoOnly:true,scale:1.0,origin:'center 45%'},
  {need:['salvajes','20 dic 2025'],src:BASE132+'salvajes-campeon-copa-2025.jpg',pos:'center 42%'},
  {need:['la esperanza','08 nov 2025'],src:ESPERANZA_2025_PHOTO,pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['juventus','20 sep 2025'],src:BASE132+'juventus-campeon-liga-veteranos-35-2025.jpg',pos:'center 43%'},
  {need:['la huerta de cuenda','29 jun 2025'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg',pos:'center 43%'},
  {need:['tavera fc','29 jun 2025'],src:BASE119+'tavera-finalista-2025.jpg',pos:'center 43%'},
  {need:['galacticos fc','20 mar 2022'],src:BASE185+'galacticos-campeon-segunda-2022.webp',pos:'center 44%'},
  {need:['boavista','11 ene 2015'],src:'./assets/history/archive-v286/boavista-campeon-primera-11-ene-2015.webp?v=20260924-boavista-11ene2015-valid-v294',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  {need:['los campeones de copa','14 abr 2015'],src:'./assets/history/archive-v279/campeones-copa-14-abr-2015.jpg?v=20260923-campeones-copa-14abr2015-v279',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['magisterio','09 jun 2018'],src:'./assets/history/archive-v266/magisterio-campeon-09-jun-2018.jpg?v=20260923-magisterio-hardfix-v266',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['magisterio','09 jul 2016'],src:BASE+'magisterio-campeon-copa-2016.jpg',pos:'center 42%'},
  {need:['malvinas','28 feb 2016'],src:BASE+'malvinas-campeon-campeones-intermedia-2016.jpg',pos:'center 42%'},
  {need:['tecos','campe'],src:BASE+'tecos-campeon-historico.jpg',pos:'center 46%'},
  {need:['real cerrito de gasca','15 dic 2013'],src:'./assets/history/archive-v279/real-cerrito-campeon-segunda-15-dic-2013.jpg?v=20260923-real-cerrito-user-v279',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['la esperanza','14 jun 2014'],src:'./assets/history/archive-v120/la-esperanza-campeon-copa-veteranos-2014.jpg?v=20260923-esperanza-copa2014-v267',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['juventus','01 feb 2025'],src:BASE214+'juventus-campeon-copa-veteranos35-01-feb-2025.webp?v=20260923-juventus-live-v217',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['lobos cdg','15 jun 2025'],src:BASE207+'lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp?v=20260923-lobos-clean-v212',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['boavista','12 abr 2025'],src:BASE+'boavista-fc-campeon-2025.jpg',pos:'center 42%'},
  {need:['galacticos','08 jun 2025'],src:BASE205+'galacticos-pozos-campeon-copa-08-jun-2025.webp?v=20260923-galacticos-fix211',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  {need:['pozos fc','15 sep 2024'],src:'./assets/history/archive-v239/pozos-fc-campeon-liga-veteranos35-15-sep-2024.webp?v=20260923-pozos-user-v239',pos:'center 47%',photoOnly:true,scale:1.0,origin:'center 47%'},
  {need:['herreras','09 feb 2025'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v208/herreras-fc-campeon-relampago-intermedia-09-feb-2025.webp',pos:'center 44%',photoOnly:true,scale:1.0,origin:'center 44%'},
  {need:['lobos jrs','16 feb 2025'],src:BASE207+'lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp?v=20260923-lobos-jrs-photo-v219',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  
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
    .v120-has-exact-bg{position:relative!important;overflow:hidden!important;isolation:isolate!important;background-color:#060653!important}
    .v120-exact-event-bg{position:absolute!important;inset:0!important;z-index:0!important;width:100%!important;height:100%!important;margin:0!important;padding:0!important;object-fit:cover!important;border:0!important;border-radius:inherit!important;filter:saturate(1.05) contrast(1.02) brightness(.98)!important;opacity:1!important;visibility:visible!important;display:block!important}
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
function forceGalacticosCDC(){
  const wanted='./assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-real-v244';
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    if(!heading.includes('galacticos')||!date.includes('09 feb 2025'))return;
    let img=card.querySelector('.v120-exact-event-bg');
    if(!img){
      img=document.createElement('img');
      img.className='v120-exact-event-bg v120-photo-only-bg';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.loading='eager';
      img.decoding='async';
      card.prepend(img);
    }
    img.alt='';
    img.setAttribute('aria-hidden','true');
    img.src=wanted;
    img.style.objectPosition='center 48%';
    img.style.transform='scale(1)';
    img.style.transformOrigin='center 48%';
    // V244 — fondo Galácticos con la foto real completa aportada por el usuario.
    img.onerror=()=>{
      img.onerror=null;
      img.src='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-real-v244';
    };
    const cssWanted='https://jairofrancog7-star.github.io/App-liga-/assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-real-v244';
    card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,5,45,.08),rgba(2,5,45,.52)),url("'+cssWanted+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 48%','important');
    card.style.setProperty('background-repeat','no-repeat','important');
    card.classList.add('v120-has-exact-bg','v120-photo-only-card');
    card.dataset.v213Galacticos='1';
  });
}

function forceManchester2024(){
  const wanted='./assets/history/archive-v240/manchester-campeon-copa-v50-09-nov-2024-user.webp?v=20260923-manchester-user-v240';
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    const all=norm(card.textContent||'');
    if(!heading.includes('manchester') || !(date.includes('09 nov 2024')||all.includes('09 nov 2024')))return;

    let img=card.querySelector('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo');
    if(!img){
      img=document.createElement('img');
      img.className='v120-exact-event-bg v120-photo-only-bg';
      card.prepend(img);
    }
    img.src=wanted;
    img.alt='Manchester · Campeón de Copa · Veteranos 50 y más · 09 nov 2024';
    img.loading='eager';
    img.decoding='async';
    img.style.objectPosition='center 50%';
    img.style.transform='scale(1)';
    img.style.transformOrigin='center 50%';

    // Fallback adicional: el mismo archivo también queda como background CSS del card.
    card.style.setProperty('background-image','linear-gradient(rgba(4,8,70,.16),rgba(4,8,70,.36)),url("'+wanted+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 50%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    card.classList.add('v120-has-exact-bg','v120-photo-only-card','v35-history-moment-photo');
    card.dataset.v224Manchester='1';
  });
}

function forceManchester2025(){
  const wanted=MANCHESTER_2025_PHOTO;
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    const all=norm(card.textContent||'');
    if(!heading.includes('manchester') || !(date.includes('26 abr 2025')||all.includes('26 abr 2025')))return;

    let img=card.querySelector('.v120-exact-event-bg,.v35-history-bg-photo,.v35-champion-bg-photo');
    if(!img){
      img=document.createElement('img');
      img.className='v120-exact-event-bg v120-photo-only-bg';
      card.prepend(img);
    }
    img.src=wanted;
    img.alt='Manchester · Campeón de Campeones · Veteranos 50 y más · 26 abr 2025';
    img.loading='eager';
    img.decoding='async';
    img.onerror=null;
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('z-index','0','important');
    img.style.setProperty('inset','0','important');
    img.style.setProperty('width','100%','important');
    img.style.setProperty('height','100%','important');
    img.style.setProperty('object-fit','cover','important');
    img.style.objectPosition='center 46%';
    img.style.transform='scale(1)';
    img.style.transformOrigin='center 46%';

    card.style.setProperty('background-image','linear-gradient(rgba(4,8,70,.12),rgba(4,8,70,.46)),url("'+wanted+'")','important');
    card.style.backgroundSize='cover';
    card.style.backgroundPosition='center 46%';
    card.style.backgroundRepeat='no-repeat';

    card.classList.add('v120-has-exact-bg','v120-photo-only-card','v35-history-moment-photo','v35-champion-card-photo');
    card.dataset.v226Manchester='1';
  });
}

function forceLobosJrs2025(){
  const wanted=BASE207+'lobos-jrs-campeon-relampago-segunda-16-feb-2025.webp?v=20260923-lobos-jrs-photo-v219';
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    const all=norm(card.textContent||'');
    if(!heading.includes('lobos jrs') || !(date.includes('16 feb 2025')||all.includes('16 feb 2025')))return;
    let img=card.querySelector('.v120-exact-event-bg');
    if(!img){
      img=document.createElement('img');
      img.className='v120-exact-event-bg v120-photo-only-bg';
      img.alt='Lobos Jrs. · Campeón Torneo Relámpago · Segunda Fuerza · 16 feb 2025';
      card.prepend(img);
    }
    img.loading='eager';
    img.decoding='async';
    img.src=wanted;
    img.style.objectPosition='center 48%';
    img.style.transform='scale(1)';
    img.style.transformOrigin='center 48%';
    card.classList.add('v120-has-exact-bg','v120-photo-only-card');
    card.dataset.v219LobosJrs='1';
  });
}
/* V219_LOBOS_JRS_FORCE */

/* V213_GALACTICOS_CDC_FORCE */
function patch(){
  if((location.hash||'').indexOf('history')<0 && (location.hash||'').indexOf('safe-about')<0)return;
  installStyle();
  document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(apply);
  forceGalacticosCDC();
  forceManchester2024();
  forceManchester2025();
  forceLobosJrs2025();
}
let raf=0;
function schedule(){cancelAnimationFrame(raf);raf=requestAnimationFrame(patch)}
window.addEventListener('hashchange',()=>setTimeout(schedule,30));
document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab]'))setTimeout(schedule,80)},true);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule()).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(schedule,80),{once:true});else setTimeout(schedule,80);
})();