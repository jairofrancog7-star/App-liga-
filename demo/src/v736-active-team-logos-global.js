/* V744 — Registro global seguro de escudos 2026.
   - Cada equipo se resuelve por su nombre/identidad, nunca por el src previo.
   - Evita que un escudo incorrecto (por ejemplo San José) se propague a otros equipos.
   - Los diseños 2026 aportados por el usuario usan archivos WebP directos y fallback estable.
*/
(function(){
'use strict';
if(window.__LJR_V744_ACTIVE_TEAM_LOGOS__)return;
window.__LJR_V744_ACTIVE_TEAM_LOGOS__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP_BASE='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/';
const SITE='https://jairofrancog7-star.github.io/App-liga-/';
const V='?v=20261004-v744';

const LOGOS={
  'san-jose-fc':SITE+'assets/official-logos/san-jose-fc-2026.webp'+V,
  'hermanos':SITE+'assets/official-logos/hermanos-2026.webp'+V,
  'linces':BASE+'assets/official-logos/linces.png',
  'juventus':BASE+'assets/official-logos/juventus.png',
  'napoli':BASE+'assets/official-logos/napoli.png',
  'lobos-cdg':BASE+'assets/official-logos/lobos-cdg.png',
  'terricolas':SITE+'assets/official-logos/terricolas-2026.webp'+V,
  'galacticos':BASE+'assets/teams/galacticos-pozos.webp',
  'franco-fc':BASE+'assets/official-logos/franco-fc.png',
  'herreras-fc':BASE+'assets/official-logos/herreras-fc.png',
  'abejas':SITE+'assets/official-logos/abejas-2026.webp'+V,

  'la-canchita-deportes':BASE+'assets/official-logos/la-canchita-deportes.png',
  'galeana':BASE+'assets/official-logos/galeana.png',
  'aldama-fc':BASE+'assets/official-logos/aldama-fc.png',
  'malvinas':BASE+'assets/official-logos/malvinas.png',
  'capibaras':BASE+'assets/official-logos/capibaras.png',
  'la-cuadrilla':BASE+'assets/official-logos/la-cuadrilla.png',
  'mazacotes-fc':BASE+'assets/official-logos/mazacotes-fc.png',
  'dep-maravillas':BASE+'assets/official-logos/dep-maravillas.png',
  'osasuna':BASE+'assets/official-logos/osasuna.png',
  'san-antonio-jrs':BASE+'assets/official-logos/san-antonio-jrs.png',
  'populares':BASE+'assets/official-logos/populares.png',
  'promesas-fc':SITE+'assets/official-logos/promesas-fc-2026.webp'+V,
  'la-huerta':BASE+'assets/official-logos/la-huerta.png',

  'tavera-fc':BASE+'assets/official-logos/tavera-fc.png',
  'pachangas-fc':BASE+'assets/official-logos/pachangas-fc.png',
  'san-juan-fc':BASE+'assets/official-logos/san-juan-fc.png',
  'tapatio':BASE+'assets/official-logos/tapatio.png',
  'dep-la-luz':BASE+'assets/official-logos/dep-la-luz.png',
  'san-julian':BASE+'assets/official-logos/san-julian.png',
  'barza':BASE+'assets/official-logos/barza.png',
  'san-jose-jrs':BASE+'assets/official-logos/san-jose-jrs.png',
  'san-antonio-fc':BASE+'assets/official-logos/san-antonio-fc.png',
  'celticos':BASE+'assets/official-logos/celticos.png',
  'dep-nopalero':BASE+'assets/official-logos/dep-nopalero.png',
  'dep-zapata':BASE+'assets/official-logos/dep-zapata.png',

  'boavista':SITE+'assets/official-logos/boavista-2026.webp'+V,
  'franco-tavera-jr':BASE+'assets/official-logos/franco-tavera-jr.png',
  'huracan':BASE+'assets/official-logos/huracan.png',
  'cuenda':SITE+'assets/official-logos/cuenda-2026.webp'+V,
  'america-j-rosas':BASE+'assets/branding/america-veteranos-35-user.png',
  'aguilares':BASE+'assets/official-logos/aguilares.png',
  'leyendas-fc':BASE+'assets/official-logos/leyendas-fc.png',
  'psv':BASE+'assets/official-logos/psv.png',
  'la-trinidad':BASE+'assets/official-logos/la-trinidad.png',

  'la-esperanza':BASE+'assets/official-logos/la-esperanza.png',
  'dynamo':BASE+'assets/official-logos/dynamo.png',
  'boca-jrs':APP_BASE+'assets/official-logos/boca-jrs.png'+V,
  'toros-de-cuenda':BASE+'assets/official-logos/toros-de-cuenda.png',
  'manchester':BASE+'assets/official-logos/manchester.png',

  /* Equipos que también aparecen en Records/Historia y páginas derivadas. */
  'oklahoma-city-fc':BASE+'assets/teams/oklahoma-city-fc.webp',
  'tecos':APP_BASE+'assets/history/team-logos/tecos.webp'+V,
  'real-de-roque':APP_BASE+'assets/history/team-logos/real-de-roque.webp'+V,
  'cebolleros-cuenda':BASE+'assets/teams/cebolleros-fc-cuenda.webp'
};

const FALLBACK={
  'san-jose-fc':BASE+'assets/official-logos/san-jose-fc.png',
  'hermanos':BASE+'assets/official-logos/hermanos.png',
  'terricolas':BASE+'assets/official-logos/terricolas.png',
  'boavista':BASE+'assets/official-logos/boavista.png',
  'abejas':BASE+'assets/official-logos/abejas.png',
  'cuenda':BASE+'assets/official-logos/cuenda.png',
  'promesas-fc':BASE+'assets/official-logos/promesas-fc.png'
};

const ALIAS={
  'san jose fc':'san-jose-fc','san jose':'san-jose-fc','san jose de la montana':'san-jose-fc','san jose de la montana fc':'san-jose-fc','san jose montana':'san-jose-fc',
  'hermanos':'hermanos','hermanos fc':'hermanos','dep hermanos':'hermanos','deportivo hermanos':'hermanos','club deportivo hermanos':'hermanos','cd hermanos':'hermanos',
  'linces':'linces','linces fc':'linces',
  'juventus':'juventus','juventus fc':'juventus',
  'napoli':'napoli','napoli fc':'napoli','ssc napoli':'napoli',
  'lobos cdg':'lobos-cdg','lobos c d g':'lobos-cdg',
  'terricolas':'terricolas','terricolas fc':'terricolas','terricolas seder':'terricolas','terricolas 1987':'terricolas',
  'galacticos':'galacticos','galacticos de pozos':'galacticos',
  'franco fc':'franco-fc','franco':'franco-fc',
  'herrera':'herreras-fc','herrera fc':'herreras-fc','herreras':'herreras-fc','herreras fc':'herreras-fc',
  'abejas':'abejas','abejas fc':'abejas','abejas futbol club':'abejas',

  'la canchita deportes':'la-canchita-deportes','la canchita':'la-canchita-deportes',
  'galeana':'galeana','atl galeana':'galeana','atletico galeana':'galeana',
  'aldama fc':'aldama-fc','aldama':'aldama-fc',
  'malvinas':'malvinas',
  'capibaras':'capibaras',
  'la cuadrilla':'la-cuadrilla','cuadrilla':'la-cuadrilla','cuadrilla fc':'la-cuadrilla',
  'mazacotes':'mazacotes-fc','mazacotes fc':'mazacotes-fc',
  'dep maravillas':'dep-maravillas','deportivo maravillas':'dep-maravillas',
  'osasuna':'osasuna',
  'san antonio jrs':'san-antonio-jrs','san antonio jr':'san-antonio-jrs',
  'populares':'populares',
  'promesas':'promesas-fc','promesas fc':'promesas-fc','promesas de pozos':'promesas-fc','promesas pozos':'promesas-fc','promesas fc pozos':'promesas-fc',
  'la huerta':'la-huerta','la huerta de cuenda':'la-huerta',

  'tavera':'tavera-fc','tavera fc':'tavera-fc',
  'pachangas':'pachangas-fc','pachangas fc':'pachangas-fc',
  'san juan':'san-juan-fc','san juan fc':'san-juan-fc',
  'tapatio':'tapatio',
  'dep la luz':'dep-la-luz','deportivo la luz':'dep-la-luz','la luz':'dep-la-luz',
  'san julian':'san-julian','san julian fc':'san-julian',
  'barza':'barza','barcelona':'barza','barcelona fc':'barza',
  'san jose jrs':'san-jose-jrs','san jose jr':'san-jose-jrs',
  'san antonio fc':'san-antonio-fc','san antonio':'san-antonio-fc',
  'celticos':'celticos','celticos fc':'celticos',
  'dep nopalero':'dep-nopalero','deportivo nopalero':'dep-nopalero','nopalero':'dep-nopalero',
  'dep zapata':'dep-zapata','deportivo zapata':'dep-zapata',

  'boavista':'boavista','boavista fc':'boavista','bfc':'boavista','b f c':'boavista',
  'franco tavera':'franco-tavera-jr','franco tavera jr':'franco-tavera-jr','franco-tavera-jr':'franco-tavera-jr','f tavera':'franco-tavera-jr',
  'huracan':'huracan',
  'cuenda':'cuenda','santiago de cuenda':'cuenda','santiago de cuenda fc':'cuenda','santiago cuenda':'cuenda',
  'america':'america-j-rosas','america veteranos':'america-j-rosas','club america':'america-j-rosas','club america veteranos':'america-j-rosas','club america j rosas':'america-j-rosas','america j rosas':'america-j-rosas',
  'aguilares':'aguilares',
  'leyendas':'leyendas-fc','leyendas fc':'leyendas-fc',
  'psv':'psv','psv eindhoven':'psv',
  'la trinidad':'la-trinidad','trinidad':'la-trinidad',

  'la esperanza':'la-esperanza','la esperanza fc':'la-esperanza','esperanza':'la-esperanza',
  'dynamo':'dynamo','dinamo':'dynamo',
  'boca jrs':'boca-jrs','boca juniors':'boca-jrs','cabj':'boca-jrs','c a boca juniors':'boca-jrs',
  'toros de cuenda':'toros-de-cuenda',
  'manchester':'manchester','manchester fc':'manchester','manchester united':'manchester',

  'oklahoma':'oklahoma-city-fc','oklahoma fc':'oklahoma-city-fc','oklahoma city':'oklahoma-city-fc','oklahoma city fc':'oklahoma-city-fc',
  'tecos':'tecos','tecos fc':'tecos','tecos de pozos':'tecos','tecos pozos':'tecos',
  'real de roque':'real-de-roque','real roque':'real-de-roque','real de roque fc':'real-de-roque',
  'cebolleros':'cebolleros-cuenda','cebolleros fc':'cebolleros-cuenda','cebolleros fc cuenda':'cebolleros-cuenda','cebolleros de cuenda':'cebolleros-cuenda'
};

const DATA_NAMES={
  'HERMANOS':'hermanos','SAN JOSE FC':'san-jose-fc','LINCES':'linces','JUVENTUS':'juventus','NAPOLI':'napoli',
  'LOBOS CDG':'lobos-cdg','TERRICOLAS':'terricolas','GALACTICOS':'galacticos','FRANCO FC':'franco-fc','HERRERAS FC':'herreras-fc','ABEJAS':'abejas',
  'LA CANCHITA DEPORTES':'la-canchita-deportes','GALEANA':'galeana','ALDAMA FC':'aldama-fc','MALVINAS':'malvinas','CAPIBARAS':'capibaras',
  'LA CUADRILLA':'la-cuadrilla','MAZACOTES FC':'mazacotes-fc','DEP. MARAVILLAS':'dep-maravillas','OSASUNA':'osasuna','SAN ANTONIO JRS':'san-antonio-jrs',
  'POPULARES':'populares','PROMESAS FC':'promesas-fc','LA HUERTA':'la-huerta',
  'TAVERA FC':'tavera-fc','PACHANGAS FC':'pachangas-fc','SAN JUAN FC':'san-juan-fc','TAPATIO':'tapatio','DEP. LA LUZ':'dep-la-luz',
  'SAN JULIAN':'san-julian','BARZA':'barza','SAN JOSE JRS':'san-jose-jrs','SAN ANTONIO FC':'san-antonio-fc','CELTICOS':'celticos',
  'DEP. NOPALERO':'dep-nopalero','DEP. ZAPATA':'dep-zapata',
  'BOAVISTA':'boavista','FRANCO-TAVERA-JR':'franco-tavera-jr','HURACAN':'huracan','CUENDA':'cuenda','AMERICA':'america-j-rosas',
  'AGUILARES':'aguilares','LEYENDAS FC':'leyendas-fc','PSV':'psv','LA TRINIDAD':'la-trinidad',
  'LA ESPERANZA':'la-esperanza','DYNAMO':'dynamo','BOCA JRS':'boca-jrs','TOROS DE CUENDA':'toros-de-cuenda','MANCHESTER':'manchester'
};

const TEXT_NAMES=[
  ['san jose fc','san-jose-fc'],['hermanos','hermanos'],['linces','linces'],['juventus','juventus'],['napoli','napoli'],['lobos cdg','lobos-cdg'],
  ['terricolas','terricolas'],['galacticos','galacticos'],['franco fc','franco-fc'],['herreras fc','herreras-fc'],['abejas','abejas'],
  ['la canchita deportes','la-canchita-deportes'],['galeana','galeana'],['aldama fc','aldama-fc'],['malvinas','malvinas'],['capibaras','capibaras'],
  ['la cuadrilla','la-cuadrilla'],['mazacotes fc','mazacotes-fc'],['dep maravillas','dep-maravillas'],['deportivo maravillas','dep-maravillas'],
  ['osasuna','osasuna'],['san antonio jrs','san-antonio-jrs'],['populares','populares'],['promesas fc','promesas-fc'],['promesas de pozos','promesas-fc'],['la huerta','la-huerta'],
  ['tavera fc','tavera-fc'],['pachangas fc','pachangas-fc'],['san juan fc','san-juan-fc'],['tapatio','tapatio'],['dep la luz','dep-la-luz'],
  ['san julian','san-julian'],['barza','barza'],['barcelona','barza'],['san jose jrs','san-jose-jrs'],['san antonio fc','san-antonio-fc'],
  ['celticos','celticos'],['dep nopalero','dep-nopalero'],['dep zapata','dep-zapata'],
  ['boavista','boavista'],['franco tavera jr','franco-tavera-jr'],['franco-tavera-jr','franco-tavera-jr'],['huracan','huracan'],['santiago de cuenda','cuenda'],
  ['america','america-j-rosas'],['aguilares','aguilares'],['leyendas fc','leyendas-fc'],['psv','psv'],['la trinidad','la-trinidad'],
  ['la esperanza','la-esperanza'],['dynamo','dynamo'],['dinamo','dynamo'],['boca jrs','boca-jrs'],['boca juniors','boca-jrs'],
  ['toros de cuenda','toros-de-cuenda'],['manchester','manchester'],
  ['oklahoma city fc','oklahoma-city-fc'],['tecos','tecos'],['real de roque','real-de-roque'],['cebolleros fc cuenda','cebolleros-cuenda']
];

const DISPLAY=Object.fromEntries(Object.entries(DATA_NAMES).map(([name,key])=>[key,name]));

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function keyFor(name){return ALIAS[norm(name)]||'';}
function logoForTeam(name){const key=keyFor(name);return key&&LOGOS[key]?LOGOS[key]:'';}

function keyFromText(text){
  const n=norm(text);
  if(!n)return '';
  const exact=ALIAS[n];
  if(exact)return exact;
  const padded=' '+n+' ';
  const found=new Set();
  for(const [label,key] of TEXT_NAMES){
    const p=' '+label+' ';
    if(padded.includes(p))found.add(key);
  }
  return found.size===1?[...found][0]:'';
}

function playerPhoto(img){
  return !!img.closest?.('[data-player-portrait],.v123-avatar,.v123-option-avatar,.v66-player-avatar,.v42-avatar,.v576-player-avatar,.v379-related-avatar,.v562-avatar,.v124-avatar') ||
    img.matches?.('.v379-player-photo,.v610-generic-player,.v576-player-photo,.v576-hero-player-photo');
}
function looksLogo(img){
  const cls=String(img.className||'').toLowerCase();
  const src=String(img.getAttribute('src')||'').toLowerCase();
  const alt=norm(img.getAttribute('alt')||'');
  return /logo|crest|badge|shield|team/.test(cls) ||
    /logos|official-logos|\/teams\/|branding|cloudinary|team-logos/.test(src) ||
    !!ALIAS[alt] ||
    !!img.closest?.('[data-team],[data-v62-team],[data-v42-compare-team],[data-v27-team],.v12-team-cell,.v40-side,.v569-team,.v62-team-card,.club-cell');
}
function keyFromImg(img){
  const direct=[
    img.dataset?.team,img.dataset?.v62Team,img.dataset?.v42CompareTeam,img.dataset?.v27Team,img.dataset?.teamCode,
    img.getAttribute('alt'),img.getAttribute('title')
  ].filter(v=>String(v||'').trim());
  for(const v of direct){
    const k=keyFor(v);
    if(k)return k;
  }

  let node=img.parentElement;
  for(let depth=0;depth<4&&node;depth++,node=node.parentElement){
    const attrs=[
      node.dataset?.team,node.dataset?.v62Team,node.dataset?.v42CompareTeam,node.dataset?.v27Team,node.dataset?.teamCode
    ].filter(Boolean);
    for(const v of attrs){
      const k=keyFor(v);
      if(k)return k;
    }
    const text=String(node.textContent||'').replace(/\s+/g,' ').trim();
    if(text && text.length<=180){
      const k=keyFromText(text);
      if(k)return k;
    }
  }
  return '';
}
function patchImg(img){
  if(!(img instanceof HTMLImageElement)||playerPhoto(img)||!looksLogo(img))return;
  const key=keyFromImg(img);
  if(!key||!LOGOS[key])return;

  const src=LOGOS[key];
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=src;
    img.removeAttribute('srcset');
  }
  img.dataset.v744ActiveLogo=key;
  if(!String(img.alt||'').trim()&&DISPLAY[key])img.alt=DISPLAY[key];
  img.style.setProperty('object-fit','contain');
  img.style.setProperty('object-position','center');

  if(!img.dataset.v744ErrorGuard){
    img.dataset.v744ErrorGuard='1';
    img.addEventListener('error',()=>{
      const k=img.dataset.v744ActiveLogo||'';
      const fallback=FALLBACK[k];
      if(!fallback)return;
      const target=new URL(fallback,document.baseURI).href;
      if(String(img.src||'')===target)return;
      img.src=fallback;
      img.removeAttribute('srcset');
    });
  }
}
function patch(root=document){
  if(root instanceof HTMLImageElement)patchImg(root);
  root.querySelectorAll?.('img').forEach(patchImg);
}

function patchData(){
  let data=null;
  try{data=window.LJR_OFFICIAL_API?.getData?.()||window.LJR_OFFICIAL_DATA||null}catch(_){data=window.LJR_OFFICIAL_DATA||null}
  if(!data)return;
  if(!data.team_logos||typeof data.team_logos!=='object')data.team_logos={};
  for(const [name,key] of Object.entries(DATA_NAMES)){
    const src=LOGOS[key];
    if(!src)continue;
    const old=data.team_logos[name];
    data.team_logos[name]=(old&&typeof old==='object'&&!Array.isArray(old))?{...old,app:src}:{app:src};
  }
}

function installRegistry(){
  const reg=window.LJR_TEAM_LOGOS;
  if(!reg||reg.__v744Wrapped)return;
  const previous=typeof reg.get==='function'?reg.get.bind(reg):()=> '';
  reg.get=function(name){return logoForTeam(name)||previous(name);};
  reg.active2026={...LOGOS};
  reg.__v744Wrapped=true;
}
function installOfficialApi(){
  const api=window.LJR_OFFICIAL_API;
  if(!api||api.__v744LogoWrapped)return;
  const previous=typeof api.getLogo==='function'?api.getLogo.bind(api):()=> '';
  api.getLogo=function(name){return logoForTeam(name)||previous(name);};
  api.__v744LogoWrapped=true;
}
function installDirectory(){
  const dir=window.V66_OFFICIAL_DIRECTORY;
  if(!dir||dir.__v744LogoWrapped)return;
  const previous=typeof dir.logoFor==='function'?dir.logoFor.bind(dir):()=> '';
  dir.logoFor=function(name){return logoForTeam(name)||previous(name);};
  dir.__v744LogoWrapped=true;
}

function sync(){
  patchData();
  installRegistry();
  installOfficialApi();
  installDirectory();
  requestAnimationFrame(()=>patch(document));
  setTimeout(()=>patch(document),80);
  setTimeout(()=>patch(document),350);
  setTimeout(()=>patch(document),1000);
}
function boot(){
  sync();
  const target=document.querySelector('#screen')||document.body||document.documentElement;
  if(target)new MutationObserver(ms=>{
    for(const m of ms){
      if(m.type==='attributes'){
        if(m.target instanceof HTMLImageElement)patchImg(m.target);
        continue;
      }
      for(const n of m.addedNodes){
        if(n.nodeType===1)patch(n);
      }
    }
  }).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','alt','data-team']});

  window.addEventListener('hashchange',sync);
  window.addEventListener('load',sync);
  window.addEventListener('ljr:official-data',sync);
  document.addEventListener('click',()=>setTimeout(sync,40),true);
  setTimeout(sync,250);
  setTimeout(sync,1400);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();