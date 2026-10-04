/* V750 — Recuperación global de escudos.
   Fuente única por identidad de equipo, con fallbacks verificados y reparación
   de <img> rotos/ausentes en todas las pantallas activas. */
(function(){
'use strict';
if(window.__LJR_V750_GLOBAL_LOGO_RECOVERY__)return;
window.__LJR_V750_GLOBAL_LOGO_RECOVERY__=true;

const RAW='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/';
const V='?v=20261004-v750';

const LOGOS={
  /* Veteranos 35+ */
  'deportivo-cg':RAW+'assets/teams/deportivo-cg.webp',
  'juventus':RAW+'assets/official-logos/juventus.png',
  'cuenda':APP+'assets/official-logos/cuenda-2026.webp'+V,
  'pozos-fc':RAW+'assets/teams/pozos-fc.webp',
  'boavista':APP+'assets/official-logos/boavista-2026.webp'+V,
  'psv':RAW+'assets/official-logos/psv.png',
  'atletico-santiago':RAW+'assets/teams/atletico-santiago.webp',
  'franco-tavera-jr':RAW+'assets/official-logos/franco-tavera-jr.png',
  'america':RAW+'assets/branding/america-veteranos-35-user.png',
  'huracan':RAW+'assets/official-logos/huracan.png',
  'aguilares':RAW+'assets/official-logos/aguilares.png',
  'leyendas-fc':RAW+'assets/official-logos/leyendas-fc.png',
  'la-trinidad':RAW+'assets/official-logos/la-trinidad.png',

  /* Veteranos 50+ */
  'la-esperanza':RAW+'assets/official-logos/la-esperanza.png',
  'dynamo':RAW+'assets/official-logos/dynamo.png',
  'boca-jrs':APP+'assets/official-logos/boca-jrs.png'+V,
  'toros-de-cuenda':RAW+'assets/official-logos/toros-de-cuenda.png',
  'manchester':RAW+'assets/official-logos/manchester.png',

  /* Primera Fuerza */
  'san-jose-fc':RAW+'assets/teams/san-jose.webp',
  'linces':RAW+'assets/official-logos/linces.png',
  'napoli':RAW+'assets/official-logos/napoli.png',
  'hermanos':RAW+'assets/official-logos/hermanos.png',
  'franco-fc':RAW+'assets/official-logos/franco-fc.png',
  'herreras-fc':RAW+'assets/official-logos/herreras-fc.png',
  'abejas':RAW+'assets/official-logos/abejas.png',
  'terricolas':APP+'assets/official-logos/terricolas-2026.webp'+V,
  'lobos-cdg':RAW+'assets/official-logos/lobos-cdg.png',
  'galacticos':RAW+'assets/teams/galacticos-pozos.webp',

  /* Intermedia */
  'la-canchita':RAW+'assets/official-logos/la-canchita-deportes.png',
  'galeana':RAW+'assets/official-logos/galeana.png',
  'aldama-fc':RAW+'assets/official-logos/aldama-fc.png',
  'malvinas':RAW+'assets/official-logos/malvinas.png',
  'capibaras':RAW+'assets/official-logos/capibaras.png',
  'la-cuadrilla':RAW+'assets/official-logos/la-cuadrilla.png',
  'mazacotes-fc':RAW+'assets/official-logos/mazacotes-fc.png',
  'dep-maravillas':RAW+'assets/official-logos/dep-maravillas.png',
  'osasuna':RAW+'assets/official-logos/osasuna.png',
  'san-antonio-jrs':RAW+'assets/official-logos/san-antonio-jrs.png',
  'populares':RAW+'assets/official-logos/populares.png',
  'promesas-fc':RAW+'assets/official-logos/promesas-fc.png',
  'la-huerta':RAW+'assets/official-logos/la-huerta.png',

  /* Segunda Fuerza */
  'tavera-fc':RAW+'assets/official-logos/tavera-fc.png',
  'pachangas-fc':RAW+'assets/official-logos/pachangas-fc.png',
  'san-juan-fc':RAW+'assets/official-logos/san-juan-fc.png',
  'tapatio':RAW+'assets/official-logos/tapatio.png',
  'dep-la-luz':RAW+'assets/official-logos/dep-la-luz.png',
  'san-julian':RAW+'assets/official-logos/san-julian.png',
  'barza':RAW+'assets/official-logos/barza.png',
  'san-jose-jrs':RAW+'assets/official-logos/san-jose-jrs.png',
  'san-antonio-fc':RAW+'assets/official-logos/san-antonio-fc.png',
  'celticos':RAW+'assets/official-logos/celticos.png',
  'dep-nopalero':RAW+'assets/official-logos/dep-nopalero.png',
  'dep-zapata':RAW+'assets/official-logos/dep-zapata.png',

  /* Archivo / equipos usados en Historia, Records y pantallas derivadas */
  'oklahoma':APP+'assets/official-logos/oklahoma-city-fc.png'+V,
  'tecos':APP+'assets/history/team-logos/tecos.webp'+V,
  'real-de-roque':APP+'assets/history/team-logos/real-de-roque.webp'+V,
  'xolos':APP+'assets/history/team-logos/xolos-jaralillo.webp'+V,
  'salvajes':APP+'assets/history/team-logos/salvajes.webp'+V,
  'cebolleros':RAW+'assets/teams/cebolleros-fc-cuenda.webp',
  'atletico-santa-cruz':RAW+'assets/teams/atletico-santa-cruz.webp',
  'santiago-de-cuenda':RAW+'assets/teams/deportivo-santiago-cuenda.webp'
};

const FALLBACK={
  'san-jose-fc':RAW+'assets/official-logos/san-jose-fc.png',
  'hermanos':RAW+'assets/official-logos/hermanos.png',
  'terricolas':RAW+'assets/official-logos/terricolas.png',
  'boavista':RAW+'assets/official-logos/boavista.png',
  'cuenda':RAW+'assets/official-logos/cuenda.png',
  'oklahoma':RAW+'assets/teams/oklahoma-city-fc.webp',
  'real-de-roque':APP+'assets/history/team-logos/real-de-roque.webp'+V
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
const ALIAS={};
function add(key,...names){for(const n of [key,...names])ALIAS[norm(n)]=key}

/* Códigos + nombres oficiales. */
add('san-jose-fc','San José FC','San Jose FC','San José','SJO');
add('juventus','Juventus','Juventus FC','JVS','JUV');
add('linces','Linces','Linces FC','LIN');
add('napoli','Napoli','Napoli FC','SSC Napoli','NAP');
add('hermanos','Hermanos','Hermanos FC','Deportivo Hermanos','Club Deportivo Hermanos','HER');
add('franco-fc','Franco FC','Franco','FRA');
add('herreras-fc','Herreras FC','Herrera FC','Herreras','HFC');
add('abejas','Abejas','Abejas FC','ABE');
add('terricolas','Terrícolas','Terricolas','Terrícolas SEDER','TER');
add('lobos-cdg','Lobos CDG','Lobos C.D.G.','LOB');
add('galacticos','Galácticos','Galacticos','Galácticos de Pozos','GAC');

add('deportivo-cg','C. de Gasca','C de Gasca','Cerrito de Gasca','Deportivo CG','Real Cerrito de Gasca','CDG');
add('cuenda','Cuenda','CUE');
add('pozos-fc','Pozos FC','Pozos','Deportivo Pozos','POZ');
add('boavista','Boavista','Boavista FC','BFC','BOA');
add('psv','PSV','PSV Eindhoven');
add('atletico-santiago','A. Santiago','Atlético Santiago','Atletico Santiago','ATS');
add('franco-tavera-jr','F. Tavera','Franco Tavera','Franco-Tavera-JR','Franco Tavera JR','FTV');
add('america','América','America','América Veteranos','Club América','AME');
add('huracan','Huracán','Huracan','HUR');
add('aguilares','Aguilares','AGU');
add('leyendas-fc','Leyendas FC','Leyendas','LEY');
add('la-trinidad','La Trinidad','Trinidad','TRI');

add('la-esperanza','La Esperanza','La Esperanza FC','ESP');
add('dynamo','Dynamo','Dinamo','DYN');
add('boca-jrs','Boca JRS','Boca Jrs.','Boca Juniors','BOC');
add('toros-de-cuenda','Toros de Cuenda','Toros Cuenda','TDC');
add('manchester','Manchester','Manchester United','MAN');

add('la-canchita','La Canchita Deportes','La Canchita','LCD');
add('galeana','Galeana','Atl. Galeana','Atlético Galeana','GAL');
add('aldama-fc','Aldama FC','Aldama','ALD');
add('malvinas','Malvinas','MAL');
add('capibaras','Capibaras','CAP');
add('la-cuadrilla','La Cuadrilla','Cuadrilla','CUA');
add('mazacotes-fc','Mazacotes FC','Mazacotes','Masacotes','MAZ');
add('dep-maravillas','Dep. Maravillas','Deportivo Maravillas','MAR');
add('osasuna','Osasuna','OSA');
add('san-antonio-jrs','San Antonio JRS','San Antonio Jr.','SAJ');
add('populares','Populares','POP');
add('promesas-fc','Promesas FC','Promesas','Promesas de Pozos','PRO');
add('la-huerta','La Huerta','La Huerta de Cuenda','HUE');

add('tavera-fc','Tavera FC','Tavera','TAV','TVF');
add('pachangas-fc','Pachangas FC','Pachangas','PAC');
add('san-juan-fc','San Juan FC','San Juan','SJU');
add('tapatio','Tapatío','Tapatio','TAP');
add('dep-la-luz','Dep. La Luz','Deportivo La Luz','La Luz','LUZ');
add('san-julian','San Julián','San Julian','San Julián FC','SJL');
add('barza','Barza','Barsa','BAR');
add('san-jose-jrs','San José JRS','San Jose JRS','San José Jr.','SJJ');
add('san-antonio-fc','San Antonio FC','SAF');
add('celticos','Célticos FC','Celticos FC','Célticos','CEL');
add('dep-nopalero','Dep. Nopalero','Deportivo Nopalero','Nopalero','NOP');
add('dep-zapata','Dep. Zapata','Deportivo Zapata','Zapata','ZAP');

add('oklahoma','Oklahoma','Oklahoma FC','Oklahoma City FC','Dep. OKC','OKC');
add('tecos','Tecos','Tecos FC','Tecos de Pozos','TEC');
add('real-de-roque','Real de Roque','Real Roque','Roque','RDR');
add('xolos','Xolos','Xolos Jaralillo','Xolos de Jaralillo');
add('salvajes','Salvajes','Salvaje');
add('cebolleros','Cebolleros','Cebolleros FC','Cebolleros de Cuenda');
add('atletico-santa-cruz','Atlético Santa Cruz','Atletico Santa Cruz','Santa Cruz');
add('santiago-de-cuenda','Santiago de Cuenda','Santiago de Cuenda FC');

function keyFor(v){return ALIAS[norm(v)]||''}
function srcFor(v){const k=keyFor(v);return k?LOGOS[k]||'':''}

const SINGLE_TEAM_SELECTOR=[
  '[data-team]','[data-v62-team]','[data-v42-compare-team]','[data-v27-team]',
  '[data-v41-team]','[data-v28-team]','[data-v33-team]','[data-v40-team]',
  '[data-v66-open-team]','.club-cell','.team-cell','.team-logo','.v42-mini-team',
  '.v27-team','.v27-team-tile','.v28-side','.v28-rank-row','.v40-side',
  '.v46-team-card','.v62-team-card','.v62-inline-team','.v66-team-card',
  '.v569-team','.v592-team','.v70-club','.v446-home-club','.v6-league-team',
  '.v6-table-row','.v65-table-row'
].join(',');

function playerPhoto(img){
  return !!img.closest?.('[data-player-portrait],.v123-avatar,.v123-option-avatar,.v66-player-avatar,.v42-avatar,.v576-player-avatar,.v379-related-avatar,.v562-avatar,.v124-avatar') ||
    img.matches?.('.v379-player-photo,.v610-generic-player,.v576-player-photo,.v576-hero-player-photo');
}
function likelyLogo(img){
  if(!(img instanceof HTMLImageElement)||playerPhoto(img))return false;
  const src=String(img.getAttribute('src')||'').toLowerCase();
  const cls=String(img.className||'').toLowerCase();
  const alt=String(img.getAttribute('alt')||'');
  return !!keyFor(alt)||/logo|crest|badge|shield|team/.test(cls)||
    /official-logos|\/teams\/|branding|team-logos|cloudinary/.test(src)||
    !!img.closest?.(SINGLE_TEAM_SELECTOR);
}
function keyFromElement(el){
  if(!(el instanceof Element))return '';
  const data=el.dataset||{};
  const direct=[
    data.team,data.v62Team,data.v42CompareTeam,data.v27Team,data.v41Team,
    data.v28Team,data.v33Team,data.v40Team,data.v66OpenTeam,data.teamCode,
    el.getAttribute?.('aria-label'),el.getAttribute?.('title')
  ].filter(Boolean);
  for(const v of direct){const k=keyFor(v);if(k)return k}

  const text=String(el.textContent||'').replace(/\s+/g,' ').trim();
  if(!text)return '';
  const hits=new Set();
  for(const [label,k] of Object.entries(ALIAS)){
    if(label.length<3)continue;
    const padded=' '+norm(text)+' ';
    if(padded.includes(' '+label+' '))hits.add(k);
    if(hits.size>1)break;
  }
  return hits.size===1?[...hits][0]:'';
}
function keyFromImg(img){
  const direct=[
    img.dataset?.team,img.dataset?.v62Team,img.dataset?.v42CompareTeam,img.dataset?.v27Team,
    img.dataset?.teamCode,img.getAttribute('alt'),img.getAttribute('title')
  ].filter(v=>String(v||'').trim());
  for(const v of direct){const k=keyFor(v);if(k)return k}

  const single=img.closest?.(SINGLE_TEAM_SELECTOR);
  if(single){
    const k=keyFromElement(single);
    if(k)return k;
  }

  let node=img.parentElement;
  for(let depth=0;depth<3&&node;depth++,node=node.parentElement){
    const k=keyFromElement(node);
    if(k)return k;
  }
  return '';
}
function applyStyle(img){
  img.style.setProperty('object-fit','contain','important');
  img.style.setProperty('object-position','center','important');
  img.style.setProperty('background','transparent','important');
  img.style.setProperty('padding','0','important');
  img.style.setProperty('clip-path','none','important');
}
function patchImg(img){
  if(!likelyLogo(img))return;
  const key=keyFromImg(img);
  if(!key||!LOGOS[key])return;
  const src=LOGOS[key];
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=src;
    img.removeAttribute('srcset');
  }
  img.dataset.v750TeamLogo=key;
  applyStyle(img);

  if(!img.dataset.v750ErrorGuard){
    img.dataset.v750ErrorGuard='1';
    img.addEventListener('error',()=>{
      const k=img.dataset.v750TeamLogo||keyFromImg(img);
      const fallback=FALLBACK[k]||LOGOS[k];
      if(!fallback)return;
      const target=new URL(fallback,document.baseURI).href;
      if(String(img.src||'')===target)return;
      img.src=fallback;
      img.removeAttribute('srcset');
      applyStyle(img);
    });
  }
}
function repairEmptyHolders(root=document){
  const holders=root.querySelectorAll?.(
    '.crest,.v6-crest,.v446-home-club-logo,.v62-team-logo,.v62-inline-logo,'+
    '.v40-team-logo,.v28-team-logo,.team-logo,.v66-team-logo'
  )||[];
  holders.forEach(holder=>{
    if(holder instanceof HTMLImageElement){patchImg(holder);return}
    if(holder.querySelector?.('img')){holder.querySelectorAll('img').forEach(patchImg);return}
    const owner=holder.closest?.(SINGLE_TEAM_SELECTOR);
    const key=owner?keyFromElement(owner):'';
    if(!key||!LOGOS[key])return;
    const img=document.createElement('img');
    img.alt='';
    img.src=LOGOS[key];
    img.dataset.v750TeamLogo=key;
    img.loading='lazy';
    img.decoding='async';
    img.style.width='100%';
    img.style.height='100%';
    applyStyle(img);
    holder.textContent='';
    holder.appendChild(img);
  });
}
function patch(root=document){
  if(root instanceof HTMLImageElement)patchImg(root);
  root.querySelectorAll?.('img').forEach(patchImg);
  repairEmptyHolders(root);
}
function installRegistry(){
  const reg=window.LJR_TEAM_LOGOS;
  if(!reg||reg.__v750Wrapped)return;
  const prev=typeof reg.get==='function'?reg.get.bind(reg):()=> '';
  reg.get=function(name){return srcFor(name)||prev(name)||''};
  reg.active2026={...(reg.active2026||{}),...LOGOS};
  reg.__v750Wrapped=true;
}
function patchOfficialData(){
  let data=null;
  try{data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}catch(_){data=window.LJR_OFFICIAL_DATA||null}
  if(!data)return;
  if(!data.team_logos||typeof data.team_logos!=='object')data.team_logos={};
  for(const alias of Object.keys(ALIAS)){
    const key=ALIAS[alias],src=LOGOS[key];
    if(!src)continue;
    const label=alias.toUpperCase();
    const old=data.team_logos[label];
    data.team_logos[label]=(old&&typeof old==='object'&&!Array.isArray(old))?{...old,app:src}:{app:src};
  }
}
function sync(){
  installRegistry();
  patchOfficialData();
  requestAnimationFrame(()=>patch(document));
  setTimeout(()=>patch(document),80);
  setTimeout(()=>patch(document),400);
  setTimeout(()=>patch(document),1200);
}
function boot(){
  sync();
  const target=document.querySelector('#screen')||document.body||document.documentElement;
  if(target)new MutationObserver(ms=>{
    for(const m of ms){
      if(m.type==='attributes'&&m.target instanceof HTMLImageElement){patchImg(m.target);continue}
      for(const n of m.addedNodes)if(n.nodeType===1)patch(n);
    }
  }).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','alt','data-team']});

  document.addEventListener('error',e=>{
    const img=e.target;
    if(img instanceof HTMLImageElement)patchImg(img);
  },true);
  window.addEventListener('hashchange',sync);
  window.addEventListener('load',sync);
  window.addEventListener('ljr:official-data',sync);
  document.addEventListener('click',()=>setTimeout(sync,50),true);
  setTimeout(sync,250);
  setTimeout(sync,1600);
}
window.LJR_GLOBAL_TEAM_LOGOS={logos:LOGOS,keyFor,srcFor,sync};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();