/* V743 — Escudos activos 2026 globales en todas las secciones.\n   Los escudos actuales tienen prioridad también en Historia, Records y pantallas derivadas. */
(function(){
'use strict';
if(window.__LJR_V743_ACTIVE_TEAM_LOGOS__)return;
window.__LJR_V743_ACTIVE_TEAM_LOGOS__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP_BASE='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/';
const SITE='https://jairofrancog7-star.github.io/App-liga-/';

const LOGOS={
  /* Escudos nuevos aportados por el usuario: se conservan como prioridad. */
  'san-jose-fc':SITE+'assets/official-logos/san-jose-fc-2026.webp',
  'hermanos':SITE+'assets/official-logos/hermanos-2026.webp',
  'terricolas':SITE+'assets/official-logos/terricolas-2026.webp',
  'oklahoma-city-fc':APP_BASE+'assets/official-logos/oklahoma-city-fc.png',
  'boavista':SITE+'assets/official-logos/boavista-2026.webp',
  'manchester':BASE+'assets/official-logos/manchester.png',
  'herreras-fc':BASE+'assets/official-logos/herreras-fc.png',
  'america-j-rosas':BASE+'assets/branding/america-veteranos-35-user.png',
  'boca-jrs':APP_BASE+'assets/official-logos/boca-jrs.png',
  'tecos':APP_BASE+'assets/history/team-logos/tecos.webp',
  'real-de-roque':APP_BASE+'assets/history/team-logos/real-de-roque.webp',
  'cebolleros-cuenda':BASE+'assets/teams/cebolleros-fc-cuenda.webp',
  'abejas':SITE+'assets/official-logos/abejas-2026.webp',
  'cuenda':SITE+'assets/official-logos/cuenda-2026.webp',
  'promesas-fc':SITE+'assets/official-logos/promesas-fc-2026.webp',
  'la-esperanza':BASE+'assets/official-logos/la-esperanza.png',
  'mazacotes-fc':BASE+'assets/official-logos/mazacotes-fc.png',
  'tavera-fc':BASE+'assets/official-logos/tavera-fc.png',
  'franco-tavera-jr':BASE+'assets/teams/franco-tavera-jr-veteranos.webp',
  'la-cuadrilla':BASE+'assets/official-logos/la-cuadrilla.png',
  'napoli':BASE+'assets/official-logos/napoli.png',

  /* V743 — faltantes activos: URL oficial explícita por equipo.
     Evita que team_logos heredado reutilice por error el escudo de San José o Tavera. */
  'juventus':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Juventus_ntqr0b',
  'linces':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Linces_l1lc7c',
  'franco-fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/FrancoFC_vtd8d7',
  'lobos-cdg':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Lobos_efloib',
  'galacticos':BASE+'assets/teams/galacticos-pozos.webp?v=20261004-v740',
  'toros-de-cuenda':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/TorosCuenda_od8vcf',
  'dep-nopalero':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Nopalero_skdsij',
  'dep-zapata':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Dep.Zapata_a5dsaz',
  'san-juan-fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJuanFC_jhprtf',
  'tapatio':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/tapatio_svt6lz',
  'san-antonio-fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioFC_tw7bi1',
  'celticos':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/CelticosFC_nv4ukd',
  'san-julian':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJulianFC_wetv0z',
  'dep-la-luz':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/DepLaLuz_wibidf',
  'pachangas-fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Pachangas_upqelg',
  'san-jose-jrs':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanJoseJR_dio2dt',
  'barza':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Barcelona_amoaiq',
  'dep-maravillas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/MAravillasFC_mnmhwx',
  'populares':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/PopularesFC_onellt',
  'promesas-fc':SITE+'assets/official-logos/promesas-fc-2026.webp',
  'capibaras':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Capibara_vocmbl',
  'la-canchita-deportes':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaCanchita_enf6ca',
  'galeana':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Galeana_kujrh0',
  'aldama-fc':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Aldama_mqm3r1',
  'malvinas':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Malvinas_wdiwk9',
  'osasuna':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/Osasuna_lv6rsa',
  'san-antonio-jrs':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/SanAntonioJR_jzmfka',
  'la-huerta':'https://res.cloudinary.com/rdk7ndhb/image/upload/v1/logos/LaHuertaCuenda_bm4fxj'
};
const ALIAS={
  'san jose fc':'san-jose-fc','san jose':'san-jose-fc','san jose de la montana':'san-jose-fc','san jose de la montana fc':'san-jose-fc','san jose montana':'san-jose-fc',
  'hermanos':SITE+'assets/official-logos/hermanos-2026.webp',
  'terricolas':SITE+'assets/official-logos/terricolas-2026.webp',
  'oklahoma':'oklahoma-city-fc','oklahoma fc':'oklahoma-city-fc','oklahoma city':'oklahoma-city-fc','oklahoma city fc':'oklahoma-city-fc',
  'boavista':SITE+'assets/official-logos/boavista-2026.webp',
  'manchester':'manchester','manchester fc':'manchester','manchester united':'manchester',
  'herrera':'herreras-fc','herrera fc':'herreras-fc','herreras':'herreras-fc','herreras fc':'herreras-fc',
  'america':'america-j-rosas','america veteranos':'america-j-rosas','club america':'america-j-rosas','club america veteranos':'america-j-rosas','club america j rosas':'america-j-rosas','america j rosas':'america-j-rosas',
  'boca jrs':'boca-jrs','boca juniors':'boca-jrs','cabj':'boca-jrs','c a boca juniors':'boca-jrs',
  'tecos':'tecos','tecos fc':'tecos','tecos de pozos':'tecos','tecos pozos':'tecos',
  'real de roque':'real-de-roque','real roque':'real-de-roque','real de roque fc':'real-de-roque',
  'cebolleros':'cebolleros-cuenda','cebolleros fc':'cebolleros-cuenda','cebolleros fc cuenda':'cebolleros-cuenda','cebolleros de cuenda':'cebolleros-cuenda',
  'abejas':SITE+'assets/official-logos/abejas-2026.webp',
  'cuenda':SITE+'assets/official-logos/cuenda-2026.webp',
  'promesas':'promesas-fc','promesas fc':'promesas-fc','promesas pozos':'promesas-fc','promesas fc pozos':'promesas-fc',
  'la esperanza':'la-esperanza','la esperanza fc':'la-esperanza','esperanza':'la-esperanza',
  'mazacotes':'mazacotes-fc','mazacotes fc':'mazacotes-fc',
  'tavera':'tavera-fc','tavera fc':'tavera-fc',
  'franco tavera':'franco-tavera-jr','franco tavera jr':'franco-tavera-jr','franco-tavera-jr':'franco-tavera-jr','f tavera':'franco-tavera-jr',
  'la cuadrilla':'la-cuadrilla','cuadrilla':'la-cuadrilla','cuadrilla fc':'la-cuadrilla',
  'napoli':'napoli','napoli fc':'napoli','ssc napoli':'napoli',

  'juventus':'juventus','juventus fc':'juventus',
  'linces':'linces','linces fc':'linces',
  'franco fc':'franco-fc','franco':'franco-fc',
  'lobos cdg':'lobos-cdg','lobos c d g':'lobos-cdg','cerrito de gasca':'lobos-cdg',
  'galacticos':'galacticos','galacticos de pozos':'galacticos',
  'toros de cuenda':'toros-de-cuenda',
  'dep nopalero':'dep-nopalero','deportivo nopalero':'dep-nopalero','nopalero':'dep-nopalero',
  'dep zapata':'dep-zapata','deportivo zapata':'dep-zapata',
  'san juan fc':'san-juan-fc','san juan':'san-juan-fc',
  'tapatio':'tapatio',
  'san antonio fc':'san-antonio-fc','san antonio':'san-antonio-fc',
  'celticos':'celticos','celticos fc':'celticos',
  'san julian':'san-julian','san julian fc':'san-julian',
  'dep la luz':'dep-la-luz','deportivo la luz':'dep-la-luz','la luz':'dep-la-luz',
  'pachangas fc':'pachangas-fc','pachangas':'pachangas-fc',
  'san jose jrs':'san-jose-jrs','san jose jr':'san-jose-jrs',
  'barza':'barza','barcelona':'barza','barcelona fc':'barza',
  'dep maravillas':'dep-maravillas','deportivo maravillas':'dep-maravillas',
  'populares':'populares',
  'promesas fc':'promesas-fc','promesas':'promesas-fc','promesas de pozos':'promesas-fc',
  'capibaras':'capibaras',
  'la canchita deportes':'la-canchita-deportes','la canchita':'la-canchita-deportes',
  'galeana':'galeana','atl galeana':'galeana','atletico galeana':'galeana',
  'aldama fc':'aldama-fc','aldama':'aldama-fc',
  'malvinas':'malvinas',
  'osasuna':'osasuna',
  'san antonio jrs':'san-antonio-jrs','san antonio jr':'san-antonio-jrs',
  'la huerta':'la-huerta','la huerta de cuenda':'la-huerta'
};
const SOURCE_MATCH={
  'san-jose-fc':SITE+'assets/official-logos/san-jose-fc-2026.webp',
  'juventus':['Juventus_fpshqs','official-logos/juventus.png'],
  'linces':['Linces_l1lc7c','official-logos/linces.png'],
  'napoli':['official-logos/napoli.png','Napoli_cp25dv','Napoli'],
  'hermanos':SITE+'assets/official-logos/hermanos-2026.webp',
  'franco-fc':['official-logos/franco-fc.png','Franco'],
  'lobos-cdg':['official-logos/lobos-cdg.png','LobosCDG','lobos-cdg'],
  'galacticos':['teams/galacticos-pozos.webp','Galacticos'],
  'terricolas':SITE+'assets/official-logos/terricolas-2026.webp',
  'oklahoma-city-fc':['official-logos/oklahoma-city-fc.png','teams/oklahoma-city-fc.webp'],
  'boavista':SITE+'assets/official-logos/boavista-2026.webp',
  'manchester':['ManchesterU_zltkh0','official-logos/manchester.png','teams/manchester-united.webp'],
  'herreras-fc':['HerreraFC_mnmlsd','official-logos/herreras-fc.png','teams/herrera-fc.webp'],
  'america-j-rosas':['America_wbi53g','america-veteranos-35-user.png','official-logos/america-j-rosas.png'],
  'boca-jrs':['Boca_Juniors_2012','official-logos/boca-jrs.png'],
  'tecos':['history/team-logos/tecos.webp','Tecos15logo'],
  'real-de-roque':['history/team-logos/real-de-roque.webp','real-de-roque'],
  'cebolleros-cuenda':['cebolleros-fc-cuenda.webp','cebolleros'],
  'abejas':SITE+'assets/official-logos/abejas-2026.webp',
  'cuenda':SITE+'assets/official-logos/cuenda-2026.webp',
  'promesas-fc':SITE+'assets/official-logos/promesas-fc-2026.webp',
  'la-esperanza':['LaEsperanzaFC_vazya7','official-logos/la-esperanza.png','teams/la-esperanza-fc.webp'],
  'mazacotes-fc':['Mazacotes_ko8o0w','official-logos/mazacotes-fc.png'],
  'tavera-fc':['TaveraFC_gpdbhg','official-logos/tavera-fc.png'],
  'franco-tavera-jr':['FrancoTaveraVeteranos_qwrqrc','franco-tavera-jr-veteranos.webp'],
  'la-cuadrilla':['CuadrillaFC_vpfbtr','official-logos/la-cuadrilla.png']
};

const ACTIVE_DESIGN_BASE=APP_BASE+'assets/official-logos/active-2026/';
const USER_LOGO_CHUNKS={};
let userLogoLoad=null;
const userLogoWait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function fetchUserLogoChunk(file){
  let last=null;
  for(let attempt=0;attempt<4;attempt++){
    try{
      const res=await fetch(ACTIVE_DESIGN_BASE+file+'?v=20261004-v743-'+attempt,{cache:'no-store'});
      if(res.ok)return (await res.text()).trim();
      last=new Error(file+' HTTP '+res.status);
    }catch(err){last=err;}
    await userLogoWait(450*(attempt+1));
  }
  throw last||new Error('No se pudo cargar '+file);
}
function loadUserLogoDesigns(){
  if(userLogoLoad)return userLogoLoad;
  userLogoLoad=Promise.all(Object.entries(USER_LOGO_CHUNKS).map(async([key,files])=>{
    const parts=await Promise.all(files.map(fetchUserLogoChunk));
    LOGOS[key]='data:image/webp;base64,'+parts.join('');
  })).then(()=>{
    const reg=window.LJR_TEAM_LOGOS;
    if(reg)reg.active2026={...LOGOS};
    return true;
  }).catch(err=>{
    console.warn('[V743] No se pudieron cargar los tres diseños activos aportados por el usuario',err);
    return false;
  });
  return userLogoLoad;
}


function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function keyFor(name){return ALIAS[norm(name)]||'';}
function logoForTeam(name){const k=keyFor(name);return k&&LOGOS[k]?LOGOS[k]:'';}
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
function teamFrom(img){
  const dataVals=[
    img.dataset?.team,img.dataset?.v62Team,img.dataset?.v42CompareTeam,img.dataset?.v27Team,img.dataset?.teamCode
  ].filter(Boolean);
  for(const v of dataVals)if(keyFor(v))return String(v).trim();

  const crest=img.closest?.('.crest');
  if(crest){
    const prev=crest.previousElementSibling, next=crest.nextElementSibling;
    for(const node of [prev,next]){
      if(!node || node.matches?.('.score,.v446-relevant-center'))continue;
      const txt=String(node.textContent||'').trim();
      if(keyFor(txt))return txt;
    }
  }

  const side=img.closest?.('.v446-relevant-team,.v446-home-club,.v28-side,.v27-team,.v40-team,.v42-mini-team,.v46-team-card,.v62-team-card,.v6-league-team,.v6-table-row,.club-cell,[data-team-code],[data-team],[data-v62-team],[data-v42-compare-team],[data-v27-team]');
  if(side){
    const vals=[
      side.dataset?.teamCode,side.dataset?.team,side.dataset?.v62Team,side.dataset?.v42CompareTeam,side.dataset?.v27Team,
      side.querySelector?.('b')?.textContent,
      side.querySelector?.('strong')?.textContent,
      side.querySelector?.('.v27-team-name')?.textContent,
      side.querySelector?.('.v46-team-copy strong')?.textContent,
      side.querySelector?.('.v40-team strong')?.textContent,
      side.querySelector?.('.v42-mini-team b')?.textContent,
      side.querySelector?.('.v28-side span')?.textContent,
      side.querySelector?.('.home')?.textContent
    ].filter(Boolean);
    for(const v of vals)if(keyFor(v))return String(v).trim();
  }

  for(const v of [img.title,img.alt].filter(Boolean))if(keyFor(v))return String(v).trim();
  return '';
}
function looksLogo(img){
  const cls=String(img.className||'').toLowerCase();
  const src=String(img.getAttribute('src')||'').toLowerCase();
  return /logo|crest|badge|shield|team/.test(cls)||/logos|official-logos|\/teams\/|branding|cloudinary/.test(src)||!!sourceKey(src);
}
function patchImg(img){
  if(!(img instanceof HTMLImageElement)||playerPhoto(img))return;
  const raw=String(img.currentSrc||img.src||'');
  let team=teamFrom(img);
  let key=keyFor(team);
  if(!key)key=sourceKey(raw);
  if(!key||!LOGOS[key]||!looksLogo(img))return;

  const src=LOGOS[key];
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=src;
    img.removeAttribute('srcset');
  }
  if(team)img.alt=team;
  img.dataset.v743ActiveLogo=key;
  img.style.setProperty('object-fit','contain');
  img.style.setProperty('object-position','center');
  if(!img.dataset.v743ErrorGuard){
    img.dataset.v743ErrorGuard='1';
    img.addEventListener('error',()=>{
      const retry=LOGOS[key];
      if(retry && img.src!==new URL(retry,document.baseURI).href){
        img.src=retry;
        img.removeAttribute('srcset');
      }
    });
  }
}
function patch(root=document){root.querySelectorAll?.('img').forEach(patchImg);}
function installRegistry(){
  const reg=window.LJR_TEAM_LOGOS;
  if(!reg||reg.__v743Wrapped)return;
  const previous=typeof reg.get==='function'?reg.get.bind(reg):()=> '';
  reg.get=function(name){const k=keyFor(name);return (k&&LOGOS[k])||previous(name);};
  reg.active2026={...LOGOS};
  reg.__v743Wrapped=true;
}
function sync(){
  installRegistry();
  requestAnimationFrame(()=>patch(document));
  setTimeout(()=>patch(document),90);
  setTimeout(()=>patch(document),500);
}
function boot(){
  installRegistry(); patch(document);
  loadUserLogoDesigns().then(ok=>{if(ok)sync();});
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