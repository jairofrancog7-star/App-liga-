/* V736 — Escudos activos 2026 aportados por el usuario.
   Fuente global para equipos activos; no altera escudos históricos de época. */
(function(){
'use strict';
if(window.__LJR_V736_ACTIVE_TEAM_LOGOS__)return;
window.__LJR_V736_ACTIVE_TEAM_LOGOS__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';

const LOGOS={
  'san-jose-fc':BASE+'assets/official-logos/san-jose-fc.png',
  'hermanos':BASE+'assets/official-logos/hermanos.png',
  'terricolas':BASE+'assets/official-logos/terricolas.png',
  'oklahoma-city-fc':BASE+'assets/teams/oklahoma-city-fc.webp',
  'boavista':BASE+'assets/official-logos/boavista.png',
  'manchester':BASE+'assets/official-logos/manchester.png',
  'herreras-fc':BASE+'assets/official-logos/herreras-fc.png',
  'america-j-rosas':BASE+'assets/branding/america-veteranos-35-user.png',
  'boca-jrs':'./assets/official-logos/boca-jrs.png',
  'abejas':BASE+'assets/official-logos/abejas.png',
  'la-esperanza':BASE+'assets/official-logos/la-esperanza.png',
  'mazacotes-fc':BASE+'assets/official-logos/mazacotes-fc.png',
  'tavera-fc':BASE+'assets/official-logos/tavera-fc.png',
  'franco-tavera-jr':BASE+'assets/teams/franco-tavera-jr-veteranos.webp',
  'la-cuadrilla':BASE+'assets/official-logos/la-cuadrilla.png',
  'napoli':BASE+'assets/official-logos/napoli.png'
};
const ALIAS={
  'san jose fc':'san-jose-fc','san jose':'san-jose-fc','san jose de la montana':'san-jose-fc','san jose montana':'san-jose-fc',
  'hermanos':'hermanos','hermanos fc':'hermanos','dep hermanos':'hermanos','deportivo hermanos':'hermanos','club deportivo hermanos':'hermanos',
  'terricolas':'terricolas','terricolas fc':'terricolas','terricolas seder':'terricolas',
  'oklahoma':'oklahoma-city-fc','oklahoma fc':'oklahoma-city-fc','oklahoma city':'oklahoma-city-fc','oklahoma city fc':'oklahoma-city-fc',
  'boavista':'boavista','boavista fc':'boavista','bfc':'boavista','b f c':'boavista',
  'manchester':'manchester','manchester fc':'manchester','manchester united':'manchester','mfc':'manchester','m f c':'manchester',
  'herrera':'herreras-fc','herrera fc':'herreras-fc','herreras':'herreras-fc','herreras fc':'herreras-fc',
  'america':'america-j-rosas','america veteranos':'america-j-rosas','club america':'america-j-rosas','club america veteranos':'america-j-rosas','club america j rosas':'america-j-rosas','america j rosas':'america-j-rosas',
  'boca jrs':'boca-jrs','boca juniors':'boca-jrs','cabj':'boca-jrs','c a boca juniors':'boca-jrs',
  'abejas':'abejas','abejas fc':'abejas','abejas futbol club':'abejas',
  'la esperanza':'la-esperanza','la esperanza fc':'la-esperanza','esperanza':'la-esperanza',
  'mazacotes':'mazacotes-fc','mazacotes fc':'mazacotes-fc','mfc':'mazacotes-fc',
  'tavera':'tavera-fc','tavera fc':'tavera-fc',
  'franco tavera':'franco-tavera-jr','franco tavera jr':'franco-tavera-jr','franco-tavera-jr':'franco-tavera-jr','f tavera':'franco-tavera-jr',
  'la cuadrilla':'la-cuadrilla','cuadrilla':'la-cuadrilla','cuadrilla fc':'la-cuadrilla',
  'napoli':'napoli','napoli fc':'napoli','ssc napoli':'napoli'
};
const SOURCE_MATCH={
  'san-jose-fc':['SanJoseMonta%C3%B1a_ilen4d','SanJoseMontana_ilen4d','official-logos/san-jose-fc.png','teams/san-jose.webp','teams/san-jose-montana.webp'],
  'hermanos':['Hermanos_kbfrmh','official-logos/hermanos.png','teams/club-deportivo-hermanos.webp'],
  'terricolas':['Terricolas_ltbrzy','official-logos/terricolas.png','teams/terricolas-fc.webp'],
  'oklahoma-city-fc':['official-logos/oklahoma-city-fc.png','teams/oklahoma-city-fc.webp'],
  'boavista':['Boavista_wioj7b','Boavista_qiq0dy','official-logos/boavista.png','teams/boavista-fc.webp'],
  'manchester':['ManchesterU_zltkh0','official-logos/manchester.png','teams/manchester-united.webp'],
  'herreras-fc':['HerreraFC_mnmlsd','official-logos/herreras-fc.png','teams/herrera-fc.webp'],
  'america-j-rosas':['America_wbi53g','america-veteranos-35-user.png','official-logos/america-j-rosas.png'],
  'boca-jrs':['Boca_Juniors_2012','official-logos/boca-jrs.png'],
  'abejas':['Abejas_lxn6l9','official-logos/abejas.png'],
  'la-esperanza':['LaEsperanzaFC_vazya7','official-logos/la-esperanza.png','teams/la-esperanza-fc.webp'],
  'mazacotes-fc':['Mazacotes_ko8o0w','official-logos/mazacotes-fc.png'],
  'tavera-fc':['TaveraFC_gpdbhg','official-logos/tavera-fc.png'],
  'franco-tavera-jr':['FrancoTaveraVeteranos_qwrqrc','franco-tavera-jr-veteranos.webp'],
  'la-cuadrilla':['CuadrillaFC_vpfbtr','official-logos/la-cuadrilla.png'],
  'napoli':['official-logos/napoli.png','Napoli']
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function keyFor(name){return ALIAS[norm(name)]||'';}
function sourceKey(src){
  const s=String(src||'');
  for(const [key,parts] of Object.entries(SOURCE_MATCH))if(parts.some(p=>s.includes(p)))return key;
  return '';
}
function historical(img){
  return !!img.closest?.('.v370-legacy-team,.v35-record-card,[data-v724-legacy-logo],.v725-broken-logo-fallback,[data-history-era-logo]');
}
function playerPhoto(img){
  return !!img.closest?.('[data-player-portrait],.v123-avatar,.v123-option-avatar,.v66-player-avatar,.v42-avatar,.v576-player-avatar,.v379-related-avatar,.v562-avatar,.v124-avatar') ||
    img.matches?.('.v379-player-photo,.v610-generic-player,.v576-player-photo,.v576-hero-player-photo');
}
function logoForTeam(name){
  const k=keyFor(name);
  if(k&&LOGOS[k])return LOGOS[k];
  try{
    const src=window.LJR_TEAM_LOGOS?.get?.(name)||
      window.LJR_OFFICIAL_API?.getLogo?.(name)||
      window.V66_OFFICIAL_DIRECTORY?.logoFor?.(name)||'';
    if(src)return src;
  }catch(_){}
  return '';
}
function validTeamName(v){
  const name=String(v||'').trim();
  return name&&!!logoForTeam(name);
}
function teamFrom(img){
  /* V740 — nunca deducir el club por el src actual: una imagen equivocada
     puede venir heredada de otra tarjeta. Primero manda el nombre visible/dataset. */
  let node=img.parentElement;
  for(let depth=0;depth<5&&node;depth++,node=node.parentElement){
    const vals=[
      node.dataset?.team,node.dataset?.v62Team,node.dataset?.v42CompareTeam,node.dataset?.v27Team,
      node.querySelector?.(':scope > b')?.textContent,
      node.querySelector?.(':scope > strong')?.textContent,
      node.matches?.('.v103-upcoming-team,.v12-result-team,.v40-team,.v42-mini-team,.v28-side,.v27-team')?node.textContent:'',
      node.querySelector?.('.v27-team-name')?.textContent,
      node.querySelector?.('.v46-team-copy strong')?.textContent,
      node.querySelector?.('.v40-team strong')?.textContent,
      node.querySelector?.('.v42-mini-team b')?.textContent,
      node.querySelector?.('.v28-side span')?.textContent
    ].filter(Boolean);
    for(const v of vals)if(validTeamName(v))return String(v).trim();
  }
  const direct=[img.dataset?.team,img.dataset?.v62Team,img.dataset?.v42CompareTeam,img.dataset?.v27Team,img.alt,img.title].filter(Boolean);
  for(const v of direct)if(validTeamName(v))return String(v).trim();
  return '';
}
function looksLogo(img){
  const cls=String(img.className||'').toLowerCase();
  const src=String(img.getAttribute('src')||'').toLowerCase();
  return /logo|crest|badge|shield|team/.test(cls)||/logos|official-logos|\/teams\/|branding|cloudinary/.test(src)||!!sourceKey(src);
}
function patchImg(img){
  if(!(img instanceof HTMLImageElement)||historical(img)||playerPhoto(img))return;
  const raw=String(img.currentSrc||img.src||'');
  if(/\/assets\/history\/archive-v\d+\//i.test(raw))return;
  /* V740 — corrección global por identidad del equipo.
     No reutilizar sourceKey(raw) como identidad: si el src ya está cruzado
     (ej. San José en una tarjeta de Napoli), perpetuaría el error. */
  const team=teamFrom(img);
  if(!team||!looksLogo(img))return;
  const src=logoForTeam(team);
  if(!src)return;
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=src;
    img.removeAttribute('srcset');
  }
  img.alt=team;
  img.dataset.v736ActiveLogo=keyFor(team)||norm(team);
  img.style.setProperty('object-fit','contain');
  img.style.setProperty('object-position','center');
}
function patch(root=document){root.querySelectorAll?.('img').forEach(patchImg);}
function installRegistry(){
  const reg=window.LJR_TEAM_LOGOS;
  if(!reg||reg.__v736Wrapped)return;
  const previous=typeof reg.get==='function'?reg.get.bind(reg):()=> '';
  reg.get=function(name){const k=keyFor(name);return (k&&LOGOS[k])||previous(name);};
  reg.active2026={...LOGOS};
  reg.__v736Wrapped=true;
}
function sync(){
  installRegistry();
  requestAnimationFrame(()=>patch(document));
  setTimeout(()=>patch(document),90);
  setTimeout(()=>patch(document),500);
}
function boot(){
  installRegistry(); patch(document);
  const target=document.querySelector('#screen')||document.body||document.documentElement;
  if(target)new MutationObserver(ms=>{
    for(const m of ms){
      if(m.type==='attributes'){if(m.target instanceof HTMLImageElement)patchImg(m.target);continue;}
      for(const n of m.addedNodes)if(n.nodeType===1){if(n instanceof HTMLImageElement)patchImg(n);patch(n);}
    }
  }).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset']});
  window.addEventListener('hashchange',sync);
  window.addEventListener('load',sync);
  window.addEventListener('ljr:official-data',sync);
  document.addEventListener('click',()=>setTimeout(()=>patch(document),60),true);
  setTimeout(sync,300); setTimeout(sync,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();