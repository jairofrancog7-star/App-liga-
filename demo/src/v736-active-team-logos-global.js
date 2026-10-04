/* V742 — Escudos activos 2026 globales en todas las secciones.\n   Los escudos actuales tienen prioridad también en Historia, Records y pantallas derivadas. */
(function(){
'use strict';
if(window.__LJR_V742_ACTIVE_TEAM_LOGOS__)return;
window.__LJR_V742_ACTIVE_TEAM_LOGOS__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP_BASE='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/';

const LOGOS={
  /* Escudos nuevos aportados por el usuario: se conservan como prioridad. */
  'san-jose-fc':BASE+'assets/official-logos/san-jose-fc.png',
  'hermanos':BASE+'assets/official-logos/hermanos.png',
  'terricolas':BASE+'assets/official-logos/terricolas.png',
  'oklahoma-city-fc':BASE+'assets/teams/oklahoma-city-fc.webp',
  'boavista':APP_BASE+'assets/official-logos/boavista-2026.webp',
  'manchester':BASE+'assets/official-logos/manchester.png',
  'herreras-fc':BASE+'assets/official-logos/herreras-fc.png',
  'america-j-rosas':BASE+'assets/branding/america-veteranos-35-user.png',
  'boca-jrs':'./assets/official-logos/boca-jrs.png',
  'abejas':APP_BASE+'assets/official-logos/abejas-2026.webp',
  'cuenda':APP_BASE+'assets/official-logos/cuenda-2026.webp',
  'promesas-fc':APP_BASE+'assets/official-logos/promesas-fc-2026.webp',
  'la-esperanza':BASE+'assets/official-logos/la-esperanza.png',
  'mazacotes-fc':BASE+'assets/official-logos/mazacotes-fc.png',
  'tavera-fc':BASE+'assets/official-logos/tavera-fc.png',
  'franco-tavera-jr':BASE+'assets/teams/franco-tavera-jr-veteranos.webp',
  'la-cuadrilla':BASE+'assets/official-logos/la-cuadrilla.png',
  'napoli':BASE+'assets/official-logos/napoli.png',

  /* V741 — faltantes activos: URL oficial explícita por equipo.
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
  'promesas-fc':APP_BASE+'assets/official-logos/promesas-fc-2026.webp',
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
  'hermanos':'hermanos','hermanos fc':'hermanos','dep hermanos':'hermanos','deportivo hermanos':'hermanos','club deportivo hermanos':'hermanos','cd hermanos':'hermanos',
  'terricolas':'terricolas','terricolas fc':'terricolas','terricolas seder':'terricolas','terricolas 1987':'terricolas',
  'oklahoma':'oklahoma-city-fc','oklahoma fc':'oklahoma-city-fc','oklahoma city':'oklahoma-city-fc','oklahoma city fc':'oklahoma-city-fc',
  'boavista':'boavista','boavista fc':'boavista','bfc':'boavista','b f c':'boavista',
  'manchester':'manchester','manchester fc':'manchester','manchester united':'manchester',
  'herrera':'herreras-fc','herrera fc':'herreras-fc','herreras':'herreras-fc','herreras fc':'herreras-fc',
  'america':'america-j-rosas','america veteranos':'america-j-rosas','club america':'america-j-rosas','club america veteranos':'america-j-rosas','club america j rosas':'america-j-rosas','america j rosas':'america-j-rosas',
  'boca jrs':'boca-jrs','boca juniors':'boca-jrs','cabj':'boca-jrs','c a boca juniors':'boca-jrs',
  'abejas':'abejas','abejas fc':'abejas','abejas futbol club':'abejas',
  'cuenda':'cuenda','santiago de cuenda':'cuenda','santiago de cuenda fc':'cuenda','santiago cuenda':'cuenda',
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
  'san-jose-fc':['SanJoseMonta%C3%B1a_ilen4d','SanJoseMontana_ilen4d','official-logos/san-jose-fc.png','teams/san-jose.webp','teams/san-jose-montana.webp'],
  'juventus':['Juventus_fpshqs','official-logos/juventus.png'],
  'linces':['Linces_l1lc7c','official-logos/linces.png'],
  'napoli':['official-logos/napoli.png','Napoli_cp25dv','Napoli'],
  'hermanos':['Hermanos_kbfrmh','official-logos/hermanos.png','teams/club-deportivo-hermanos.webp'],
  'franco-fc':['official-logos/franco-fc.png','Franco'],
  'lobos-cdg':['official-logos/lobos-cdg.png','LobosCDG','lobos-cdg'],
  'galacticos':['teams/galacticos-pozos.webp','Galacticos'],
  'terricolas':['Terricolas_ltbrzy','official-logos/terricolas.png','teams/terricolas-fc.webp'],
  'oklahoma-city-fc':['official-logos/oklahoma-city-fc.png','teams/oklahoma-city-fc.webp'],
  'boavista':['Boavista_wioj7b','Boavista_qiq0dy','official-logos/boavista.png','official-logos/boavista-2026.webp','teams/boavista-fc.webp'],
  'manchester':['ManchesterU_zltkh0','official-logos/manchester.png','teams/manchester-united.webp'],
  'herreras-fc':['HerreraFC_mnmlsd','official-logos/herreras-fc.png','teams/herrera-fc.webp'],
  'america-j-rosas':['America_wbi53g','america-veteranos-35-user.png','official-logos/america-j-rosas.png'],
  'boca-jrs':['Boca_Juniors_2012','official-logos/boca-jrs.png'],
  'abejas':['Abejas_lxn6l9','official-logos/abejas.png','official-logos/abejas-2026.webp'],
  'cuenda':['SantiagoCuenda_fvaq9e','official-logos/cuenda.png','official-logos/cuenda-2026.webp','teams/cuenda.webp'],
  'promesas-fc':['Promesas','official-logos/promesas-fc.png','official-logos/promesas-fc-2026.webp','teams/promesas-fc-pozos.webp'],
  'la-esperanza':['LaEsperanzaFC_vazya7','official-logos/la-esperanza.png','teams/la-esperanza-fc.webp'],
  'mazacotes-fc':['Mazacotes_ko8o0w','official-logos/mazacotes-fc.png'],
  'tavera-fc':['TaveraFC_gpdbhg','official-logos/tavera-fc.png'],
  'franco-tavera-jr':['FrancoTaveraVeteranos_qwrqrc','franco-tavera-jr-veteranos.webp'],
  'la-cuadrilla':['CuadrillaFC_vpfbtr','official-logos/la-cuadrilla.png']
};

const ACTIVE_DESIGN_BASE=APP_BASE+'assets/official-logos/active-2026/';
const USER_LOGO_CHUNKS={
  'san-jose-fc':['san-jose-fc.01.b64','san-jose-fc.02.b64'],
  'hermanos':['hermanos.01.b64','hermanos.02.b64'],
  'terricolas':['terricolas.01.b64','terricolas.02.b64','terricolas.03.b64']
};
let userLogoLoad=null;
const userLogoWait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function fetchUserLogoChunk(file){
  let last=null;
  for(let attempt=0;attempt<4;attempt++){
    try{
      const res=await fetch(ACTIVE_DESIGN_BASE+file+'?v=20261004-v741-'+attempt,{cache:'no-store'});
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
    console.warn('[V742] No se pudieron cargar los tres diseños activos aportados por el usuario',err);
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
  const direct=[img.alt,img.title,img.dataset?.team,img.dataset?.v62Team,img.dataset?.v42CompareTeam,img.dataset?.v27Team]
    .filter(v=>String(v||'').trim());
  for(const v of direct)if(keyFor(v))return String(v).trim();

  const owner=img.closest?.('[data-team],[data-v62-team],[data-v42-compare-team],[data-v27-team]');
  if(owner){
    const vals=[owner.dataset?.team,owner.dataset?.v62Team,owner.dataset?.v42CompareTeam,owner.dataset?.v27Team].filter(Boolean);
    for(const v of vals)if(keyFor(v))return String(v).trim();
  }

  const card=img.closest?.('.v27-team,.v40-team,.v42-mini-team,.v46-team-card,.v28-side,.v62-team-card,.v446-home-club,.v6-league-team,.v6-table-row,.club-cell');
  if(!card)return '';
  const vals=[
    card.dataset?.team,card.dataset?.v62Team,card.dataset?.v42CompareTeam,card.dataset?.v27Team,
    card.querySelector?.('.v27-team-name')?.textContent,
    card.querySelector?.('.v46-team-copy strong')?.textContent,
    card.querySelector?.('.v40-team strong')?.textContent,
    card.querySelector?.('.v42-mini-team b')?.textContent,
    card.querySelector?.('.v28-side span')?.textContent
  ].filter(Boolean);
  for(const v of vals)if(keyFor(v))return String(v).trim();
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
  /* V741 — corrección global por identidad del equipo.
     No reutilizar sourceKey(raw) como identidad: si el src ya está cruzado
     (ej. San José en una tarjeta de Napoli), perpetuaría el error. */
  let team=teamFrom(img);
  let key=keyFor(team);
  if(!key){
    const bySource=sourceKey(raw);
    if(['abejas','boavista','cuenda','promesas-fc'].includes(bySource)){
      key=bySource;
      team=team||bySource;
    }
  }
  if(!key||!looksLogo(img))return;
  const src=LOGOS[key];
  if(!src)return;
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=src;
    img.removeAttribute('srcset');
  }
  if(team)img.alt=team;
  img.dataset.v742ActiveLogo=key;
  img.style.setProperty('object-fit','contain');
  img.style.setProperty('object-position','center');
}
function patch(root=document){root.querySelectorAll?.('img').forEach(patchImg);}
function installRegistry(){
  const reg=window.LJR_TEAM_LOGOS;
  if(!reg||reg.__v742Wrapped)return;
  const previous=typeof reg.get==='function'?reg.get.bind(reg):()=> '';
  reg.get=function(name){const k=keyFor(name);return (k&&LOGOS[k])||previous(name);};
  reg.active2026={...LOGOS};
  reg.__v742Wrapped=true;
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