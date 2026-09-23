/* V120 — fondos históricos exactos. Solo aplica fotos del mismo campeonato/premiación.
   Si no existe una foto exacta, no reutiliza una imagen de otro evento. */
(function(){
'use strict';

// V235 — foto exacta aportada por el usuario para Manchester · Campeón de Campeones · 26 abr 2025.
// Se embebe para evitar que GitHub Pages/cache deje la tarjeta azul sin fotografía.
const MANCHESTER_2025_INLINE='data:image/webp;base64,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';

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
  {need:['manchester','09 nov 2024'],src:'./assets/history/archive-v222/manchester-campeon-copa-v50-09-nov-2024.webp?v=20260923-manchester-bg-v236',pos:'center 50%',photoOnly:true,scale:1.08,origin:'center 50%'},
  {need:['manchester','26 abr 2025'],src:MANCHESTER_2025_INLINE,pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['san julian','18 feb 2024'],src:SAN_JULIAN_2024,pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['lobos jrs','23 sep 2026'],src:BASE212+'lobos-jrs-campeon-segunda-23-sep-2026.jpg?v=20260923-lobos-segunda-v212',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['galacticos','09 feb 2025'],src:'./assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-local-v235',pos:'center 48%',photoOnly:true,scale:1.00,origin:'center 48%'},
  {need:['linces','04 mar 2024'],src:BASE202+'linces-campeon-copa-04-mar-2024.webp',pos:'center 46%',photoOnly:true,scale:1.0,origin:'center 46%'},
  {need:['boca jrs','04 may 2024'],src:BASE202+'boca-jrs-campeon-liga-v50-04-may-2024.webp',pos:'center 48%',photoOnly:true,scale:1.0,origin:'center 48%'},
  {need:['psv','02 oct 2021'],src:BASE134+'psv-campeon-campeones-veteranos-2020-2021.jpg',pos:'center 68%',photoOnly:true,scale:2.00,origin:'center 67%'},
  {need:['la esperanza','25 sep 2021'],src:BASE134+'la-esperanza-campeon-liga-veteranos-2020-2021.jpg',pos:'72% 77%',photoOnly:true,scale:2.25,origin:'72% 77%'},
  {need:['juventus','16 feb 2020'],src:BASE134+'juventus-campeon-copa-primera-2019-2020.jpg',pos:'center 48%'},
  {need:['tavera','16 feb 2020'],src:BASE134+'tavera-campeon-copa-segunda-2019-2020.jpg',pos:'center 46%'},
  {need:['el alto','19 ene 2020'],src:BASE134+'el-alto-campeon-copa-intermedia-2020.jpg',pos:'center 69%',photoOnly:true,scale:2.05,origin:'center 68%'},
  {need:['juventus','21 sep 2024'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v201/juventus-campeon-campeones-21-sep-2024.jpg?v=20260923-juventus-photo-v222',pos:'center 44%'},
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
  {need:['la esperanza','08 nov 2025'],src:ESPERANZA_2025_PHOTO,pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['juventus','20 sep 2025'],src:BASE132+'juventus-campeon-liga-veteranos-35-2025.jpg',pos:'center 43%'},
  {need:['la huerta de cuenda','29 jun 2025'],src:'https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/assets/history/archive-v203/la-huerta-cuenda-campeon-segunda-29-jun-2025.jpg',pos:'center 43%'},
  {need:['tavera fc','29 jun 2025'],src:BASE119+'tavera-finalista-2025.jpg',pos:'center 43%'},
  {need:['galacticos fc','20 mar 2022'],src:BASE185+'galacticos-campeon-segunda-2022.webp',pos:'center 44%'},
  {need:['magisterio','09 jul 2016'],src:BASE+'magisterio-campeon-copa-2016.jpg',pos:'center 42%'},
  {need:['malvinas','28 feb 2016'],src:BASE+'malvinas-campeon-campeones-intermedia-2016.jpg',pos:'center 42%'},
  {need:['tecos','campe'],src:BASE+'tecos-campeon-historico.jpg',pos:'center 46%'},
  {need:['real cerrito de gasca','15 dic 2013'],src:BASE+'real-cerrito-campeon-2013.jpg',pos:'center 38%'},
  {need:['la esperanza','14 jun 2014'],src:BASE+'la-esperanza-campeon-copa-veteranos-2014.jpg',pos:'center 42%'},
  {need:['juventus','01 feb 2025'],src:BASE214+'juventus-campeon-copa-veteranos35-01-feb-2025.webp?v=20260923-juventus-live-v217',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['lobos cdg','15 jun 2025'],src:BASE207+'lobos-cdg-campeon-copa-intermedia-15-jun-2025.webp?v=20260923-lobos-clean-v212',pos:'center 50%',photoOnly:true,scale:1.0,origin:'center 50%'},
  {need:['boavista','12 abr 2025'],src:BASE+'boavista-fc-campeon-2025.jpg',pos:'center 42%'},
  {need:['galacticos','08 jun 2025'],src:BASE205+'galacticos-pozos-campeon-copa-08-jun-2025.webp?v=20260923-galacticos-fix211',pos:'center 43%',photoOnly:true,scale:1.0,origin:'center 43%'},
  {need:['pozos fc','15 sep 2024'],src:BASE199+'pozos-fc-campeon-liga-veteranos35-15-sep-2024.jpg',pos:'center 47%'},
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
  const wanted='./assets/history/archive-v203/galacticos-campeon-campeones-09-feb-2025.jpg?v=20260923-galacticos-local-v235';
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
    card.classList.add('v120-has-exact-bg','v120-photo-only-card');
    card.dataset.v213Galacticos='1';
  });
}

function forceManchester2024(){
  const wanted='./assets/history/archive-v222/manchester-campeon-copa-v50-09-nov-2024.webp?v=20260923-manchester-bg-v236';
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
  const wanted=MANCHESTER_2025_INLINE;
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