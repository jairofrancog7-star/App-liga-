/* V882 — Hardfix del escudo de Galácticos en Inicio.
   Sustituye cualquier fallback GAC/G por el escudo real sin modificar el diseño. */
(function(){
'use strict';
if(window.__LJR_V882_HOME_GALACTICOS_LOGO__)return;
window.__LJR_V882_HOME_GALACTICOS_LOGO__=true;

const SOURCES=[
  'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp?v=20261007-v882',
  'https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/768d83b77ccbe73e8bf557f0189886fb6f246f84/assets/teams/galacticos-pozos.webp?v=20261007-v882',
  'https://github.com/jairofrancog7-star/Liga_Futbol/raw/refs/heads/main/assets/teams/galacticos-pozos.webp?v=20261007-v882'
];

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}
function isGalacticos(v){
  const n=norm(v);
  return n==='galacticos'||n==='galacticos de pozos'||n.includes('galacticos');
}
function makeImg(){
  const img=document.createElement('img');
  img.alt='Galácticos';
  img.loading='eager';
  img.decoding='async';
  img.dataset.v882GalacticosLogo='1';
  let i=0;
  const load=()=>{
    if(i>=SOURCES.length)return;
    img.src=SOURCES[i++];
  };
  img.addEventListener('error',load);
  load();
  return img;
}
function patchV6(){
  document.querySelectorAll('.v6-calendar-team').forEach(team=>{
    const label=team.querySelector('em')?.textContent||team.textContent||'';
    if(!isGalacticos(label))return;
    let crest=team.querySelector('.v6-crest');
    if(!crest){
      crest=document.createElement('span');
      crest.className='v6-crest v6-crest-image';
      team.prepend(crest);
    }
    if(crest.querySelector('img[data-v882-galacticos-logo]'))return;
    crest.classList.add('v6-crest-image');
    crest.classList.remove('v6-crest-fallback');
    crest.textContent='';
    crest.appendChild(makeImg());
  });
}
function patchV103(){
  document.querySelectorAll('.v103-upcoming-team,.v103-cal-pair>div').forEach(team=>{
    const label=team.querySelector('b')?.textContent||team.textContent||'';
    if(!isGalacticos(label))return;
    let crest=team.querySelector('.v103-cal-logo');
    if(!crest){
      crest=document.createElement('span');
      crest.className='v103-cal-logo';
      team.prepend(crest);
    }
    if(crest.querySelector('img[data-v882-galacticos-logo]'))return;
    crest.classList.remove('v103-cal-fallback');
    crest.textContent='';
    crest.appendChild(makeImg());
  });
}
function patchGeneric(){
  document.querySelectorAll('[class*="calendar"],[class*="match"]').forEach(card=>{
    const txt=card.textContent||'';
    if(!isGalacticos(txt))return;
    card.querySelectorAll('.v6-crest,.v103-cal-logo').forEach(crest=>{
      const t=norm(crest.textContent||'');
      if(t!=='gac'&&t!=='g'&&!crest.classList.contains('v103-cal-fallback'))return;
      crest.textContent='';
      crest.classList.add('v6-crest-image');
      crest.classList.remove('v103-cal-fallback','v6-crest-fallback');
      crest.appendChild(makeImg());
    });
  });
}
function patch(){
  patchV6();
  patchV103();
  patchGeneric();
}
function installRegistry(){
  try{
    const reg=window.LJR_TEAM_LOGOS;
    if(reg&&typeof reg.set==='function'){
      for(const n of ['Galácticos','GALACTICOS','Galacticos','Galácticos de Pozos','Galacticos de Pozos']){
        reg.set(n,SOURCES[0]);
      }
    }
  }catch(_){}
}
function run(){
  installRegistry();
  patch();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
window.addEventListener('hashchange',()=>setTimeout(run,0));
window.addEventListener('pageshow',run);
const root=document.querySelector('#screen')||document.body;
if(root)new MutationObserver(()=>run()).observe(root,{childList:true,subtree:true});
setTimeout(run,80);setTimeout(run,300);setTimeout(run,900);setTimeout(run,1800);
})();