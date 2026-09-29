/* V346 — Historia: carga progresiva de parches históricos.
   Objetivo: que #/history sea interactiva primero. Los parches de fotos/fondos
   se cargan después, sin borrar contenido ni cambiar los datos del archivo. */
(function(){
'use strict';
if(window.__LJR_V346_HISTORY_DEFERRED_PATCHES__)return;
window.__LJR_V346_HISTORY_DEFERRED_PATCHES__=true;

const BASE='./src/';
const loaded=new Set();

const stagePhotos=[
  ['v254-magisterio-2018-photo-1.js?v=20260923-magisterio-2018-v254','classic'],
  ['v254-magisterio-2018-photo-2.js?v=20260923-magisterio-2018-v254','classic'],
  ['v254-magisterio-2018-photo-3.js?v=20260923-magisterio-2018-v254','classic'],
  ['v269-real-dhp-photo-1.js?v=20260923-real-dhp-2017-v269','classic'],
  ['v269-real-dhp-photo-2.js?v=20260923-real-dhp-2017-v269','classic'],
  ['v269-real-dhp-photo-3.js?v=20260923-real-dhp-2017-v269','classic'],
  ['v269-real-dhp-photo-4.js?v=20260923-real-dhp-2017-v269','classic'],
  ['v269-real-dhp-photo-init.js?v=20260923-real-dhp-2017-v269','classic'],
  ['v276-universidad-photo-01.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v276-universidad-photo-03.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v276-universidad-photo-03b.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v276-universidad-photo-04b.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v276-universidad-photo-04.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v276-universidad-photo-05.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v276-universidad-photo-06.js?v=20260923-universidad-first-photo-v277','classic'],
  ['v300-aldama-2026-photo-01.js?v=20260924-aldama-green-v300','classic'],
  ['v300-aldama-2026-photo-02.js?v=20260924-aldama-green-v300','classic'],
  ['v300-aldama-2026-photo-03.js?v=20260924-aldama-green-v300','classic'],
  ['v300-aldama-2026-photo-04.js?v=20260924-aldama-green-v300','classic'],
  ['v300-aldama-2026-photo-05.js?v=20260924-aldama-green-v300','classic'],
  ['v305-salvajes-20sep2025-photo.js?v=20260923-salvajes-direct-v305','classic'],
  ['v214-san-julian-photo.js?v=20260923-v214b','classic']
];

const stageCore=[
  ['v115-history-archive-expansion.js?v=20260923-esperanza-photo-v220','module'],
  ['v120-history-exact-backgrounds.js?v=20260924-restored-backgrounds-v325','module'],
  ['v244-galacticos-clean.js?v=20260923-galacticos-clean-v244b','module'],
  ['v266-magisterio-2018-hardfix.js?v=20260923-magisterio-hardfix-v266','classic']
];

const stageFixes=[
  ['v249-terricolas-force.js?v=20260923-terricolas-hardfix-v255','module'],
  ['v250-esperanza-2019-force.js?v=20260923-esperanza-2019-bg-v250','module'],
  ['v258-puros-cuates-2015-force.js?v=20260923-puros-cuates-2015-bg-v258','module'],
  ['v262-esperanza-2021-force.js?v=20260923-esperanza-2021-hard-v262','module'],
  ['v268-juventus-2022-force.js?v=20260923-juventus-17abr2022-hard-v285','module'],
  ['v269-real-dhp-2017-force.js?v=20260923-real-dhp-bg-hardfix-v271','module'],
  ['v282-esperanza-2014-card-hardfix.js?v=20260923-esperanza-2014-card-v282','classic'],
  ['v283-campeones-copa-2015-hardfix.js?v=20260923-juventus-copa-14abr2015-v294','module'],
  ['v282-valencia-2012-force.js?v=20260923-valencia-copa-2012-v282','module'],
  ['v284-tecos-2018-hardfix.js?v=20260923-tecos-2018-hardfix-v284','module'],
  ['v287-abejas-final-trophy-hardfix.js?v=20260923-abejas-photo-v290','module'],
  ['v346-abejas-2019-lazy.js?v=20260929-history-fast-v346','classic'],
  ['v291-universidad-bg-final.js?v=20260923-universidad-hq-clean-v322','module'],
  ['v286-linces-2022-hardfix.js?v=20260924-linces-canonical-v312','module'],
  ['v293-linces-galacticos-swap-hardfix.js?v=20260924-swap-final-v293','module'],
  ['v296-boca-jrs-dedupe-hardfix.js?v=20260923-boca-jrs-dedupe-hardfix-v296','module'],
  ['v300-aldama-2026-hardfix.js?v=20260923-aldama-photo-v304','classic'],
  ['v303-salvajes-20sep2025-hardfix.js?v=20260923-salvajes-fixed-v307','module'],
  ['v310-juventus-sub-20dic2025-hardfix.js?v=20260923-juventus-sub-photo-v310','classic'],
  ['v286-boavista-2015-force.js?v=20260923-boavista-11ene2015-final-v317','module'],
  ['v319-dhp-puros-2014-fullcard.js?v=20260924-dhp-puros-fullcard-v319','classic'],
  ['v323-history-preserve-backgrounds.js?v=20260924-restored-backgrounds-v325','module'],
  ['v324-el-alto-crop.js?v=20260924-restored-backgrounds-v325','module'],
  ['v325-lobos-cdg-superlider-photo-restore.js?v=20260928-lobos-cdg-force-v327','module'],
  ['v329-history-finals-image1.js?v=20260929-history-finals-reference-v331','module']
];

function route(){
  return (location.hash.replace(/^#\//,'')||'home').split('?')[0];
}
function active(){
  const r=route();
  return r==='history'||r==='safe-about';
}
function wait(ms){return new Promise(r=>setTimeout(r,ms))}
function loadOne(item){
  const [src,type]=item;
  if(loaded.has(src))return Promise.resolve();
  loaded.add(src);
  return new Promise(resolve=>{
    const s=document.createElement('script');
    if(type==='module')s.type='module';
    s.src=BASE+src;
    s.async=false;
    s.onload=resolve;
    s.onerror=resolve;
    document.body.appendChild(s);
  });
}
async function loadParallel(items){
  await Promise.all(items.filter(x=>!loaded.has(x[0])).map(loadOne));
}
async function loadSequential(items){
  for(const item of items){
    if(!active())return;
    await loadOne(item);
    await wait(28);
  }
}
let token=0;
async function schedule(){
  const mine=++token;
  if(!active())return;
  // Primer frame: la Historia principal y sus tabs aparecen sin competir
  // con decenas de observadores/parches antiguos.
  await wait(360);
  if(mine!==token||!active())return;
  await loadParallel(stagePhotos);
  if(mine!==token||!active())return;

  // Fondos/archivo principal después de que la pantalla ya responde.
  await wait(220);
  if(mine!==token||!active())return;
  await loadSequential(stageCore);
  if(mine!==token||!active())return;

  // Hardfixes históricos restantes: repartir el trabajo evita un pico largo.
  const runFixes=()=>loadSequential(stageFixes);
  if('requestIdleCallback' in window){
    requestIdleCallback(()=>{if(mine===token&&active())runFixes()},{timeout:1400});
  }else{
    setTimeout(()=>{if(mine===token&&active())runFixes()},700);
  }
}
window.addEventListener('hashchange',schedule);
window.addEventListener('pageshow',schedule);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});
else schedule();
})();