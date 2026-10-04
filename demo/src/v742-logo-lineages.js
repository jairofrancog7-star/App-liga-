/* V746 — Linajes de escudos: un equipo puede tener varios escudos sin convertirse
   en varios equipos. La identidad se resuelve por nombre/alias exacto; las variantes
   sólo cambian la imagen según contexto (actual / histórico / Récords). */
(function(){
'use strict';
if(window.__LJR_V746_TEAM_LOGO_LINEAGES__)return;
window.__LJR_V744_TEAM_LOGO_LINEAGES__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP='https://jairofrancog7-star.github.io/App-liga-/';
const local=p=>new URL(p,document.baseURI).href;
const remote=p=>BASE+p;
const app=p=>APP+p;

const LINEAGES={
  america:{
    aliases:['america','america veteranos','club america','club america veteranos','club america j rosas','america j rosas','america j. rosas','america jr','club america jr'],
    current:remote('assets/branding/america-veteranos-35-user.png'),
    variants:[remote('assets/branding/america-veteranos-35-user.png'),remote('assets/official-logos/america.png')]
  },
  pozos:{
    aliases:['pozos','pozos fc','deportivo pozos','dep pozos','atletico pozos','a pozos','pozos veteranos','veteranos pozos','veteranos pozos fc'],
    current:remote('assets/teams/pozos-fc.webp'),
    variants:[remote('assets/teams/pozos-fc.webp'),remote('assets/teams/veteranos-pozos-fc.webp')]
  },
  'la-huerta':{
    aliases:['la huerta','la huerta fc','la huerta de cuenda','club la huerta','club la huerta de cuenda'],
    current:remote('assets/official-logos/la-huerta.png'),
    variants:[remote('assets/official-logos/la-huerta.png'),remote('assets/teams/la-huerta-cuenda.webp')]
  },
  hermanos:{
    aliases:['hermanos','hermanos fc','dep hermanos','deportivo hermanos','club deportivo hermanos'],
    current:app('assets/official-logos/hermanos-2026.webp'),
    variants:[app('assets/official-logos/hermanos-2026.webp'),remote('assets/official-logos/hermanos.png'),remote('assets/teams/club-deportivo-hermanos.webp')]
  },
  terricolas:{
    aliases:['terricolas','terricolas fc','terricolas seder','terricolas seder fc'],
    current:app('assets/official-logos/terricolas-2026.webp'),
    variants:[app('assets/official-logos/terricolas-2026.webp'),remote('assets/official-logos/terricolas.png'),remote('assets/teams/terricolas-fc.webp')]
  },
  'san-jose-fc':{
    aliases:['san jose fc','san jose de la montana','san jose montana'],
    current:app('assets/official-logos/san-jose-fc-2026.webp'),
    variants:[app('assets/official-logos/san-jose-fc-2026.webp'),remote('assets/official-logos/san-jose-fc.png'),remote('assets/teams/san-jose-montana.webp'),remote('assets/teams/san-jose.webp')]
  },
  abejas:{
    aliases:['abejas','abejas fc','abejas futbol club'],
    current:app('assets/official-logos/abejas-2026.webp'),
    variants:[app('assets/official-logos/abejas-2026.webp'),remote('assets/official-logos/abejas.png')]
  },
  boavista:{
    aliases:['boavista','boavista fc','bfc','b f c'],
    current:app('assets/official-logos/boavista-2026.webp'),
    variants:[app('assets/official-logos/boavista-2026.webp'),remote('assets/official-logos/boavista.png'),remote('assets/teams/boavista-fc.webp')]
  },
  manchester:{
    aliases:['manchester','manchester fc','manchester united','man united'],
    current:remote('assets/official-logos/manchester.png'),
    variants:[remote('assets/official-logos/manchester.png'),remote('assets/teams/manchester-united.webp')]
  },
  'tavera-fc':{
    aliases:['tavera','tavera fc'],
    current:remote('assets/official-logos/tavera-fc.png'),
    variants:[remote('assets/official-logos/tavera-fc.png'),remote('assets/teams/tavera-fc.webp')]
  },
  'franco-fc':{
    aliases:['franco fc','franco'],
    current:remote('assets/official-logos/franco-fc.png'),
    variants:[remote('assets/official-logos/franco-fc.png'),remote('assets/teams/franco-fc.webp')]
  },
  herreras:{
    aliases:['herrera','herrera fc','herreras','herreras fc'],
    current:remote('assets/official-logos/herreras-fc.png'),
    variants:[remote('assets/official-logos/herreras-fc.png'),remote('assets/teams/herrera-fc.webp')]
  },
  linces:{
    aliases:['linces','linces fc'],
    current:remote('assets/official-logos/linces.png'),
    variants:[remote('assets/official-logos/linces.png'),remote('assets/teams/linces.webp')]
  },
  juventus:{
    aliases:['juventus','juventus fc'],
    current:remote('assets/official-logos/juventus.png'),
    variants:[remote('assets/official-logos/juventus.png'),remote('assets/teams/juventus.webp')]
  },
  psv:{
    aliases:['psv','psv eindhoven'],
    current:remote('assets/official-logos/psv.png'),
    variants:[remote('assets/official-logos/psv.png'),remote('assets/teams/psv.webp')]
  },
  'la-esperanza':{
    aliases:['la esperanza','la esperanza fc'],
    current:remote('assets/official-logos/la-esperanza.png'),
    variants:[remote('assets/official-logos/la-esperanza.png'),remote('assets/teams/la-esperanza-fc.webp')]
  },
  galacticos:{
    aliases:['galacticos','galacticos fc','galacticos de pozos','galacticos pozos'],
    current:remote('assets/teams/galacticos-pozos.webp'),
    variants:[remote('assets/teams/galacticos-pozos.webp')]
  },
  'lobos-cdg':{
    aliases:['lobos cdg','lobos c d g','cerrito de gasca fc'],
    current:remote('assets/official-logos/lobos-cdg.png'),
    variants:[remote('assets/official-logos/lobos-cdg.png'),remote('assets/teams/lobos-cdg.webp')]
  },
  'lobos-jrs':{
    aliases:['lobos jr','lobos jrs','lobos jr cerrito de gasca','lobos jrs cerrito de gasca'],
    current:remote('assets/teams/lobos-jr-cerrito-gasca.webp'),
    variants:[remote('assets/teams/lobos-jr-cerrito-gasca.webp')]
  },
  promesas:{
    aliases:['promesas','promesas fc','promesas de pozos','promesas fc pozos'],
    current:app('assets/official-logos/promesas-fc-2026.webp'),
    variants:[app('assets/official-logos/promesas-fc-2026.webp'),remote('assets/official-logos/promesas-fc.png'),remote('assets/teams/promesas-fc-pozos.webp')]
  },
  galeana:{
    aliases:['galeana','atl galeana','atletico galeana'],
    current:remote('assets/official-logos/galeana.png'),
    variants:[remote('assets/official-logos/galeana.png'),remote('assets/teams/atletico-galeana.webp')]
  },
  'san-julian':{
    aliases:['san julian','san julian fc','atletico san julian','a san julian','atletico sj'],
    current:remote('assets/official-logos/san-julian.png'),
    variants:[remote('assets/official-logos/san-julian.png'),remote('assets/teams/san-julian-fc.webp')]
  },
  'san-jose-jrs':{
    aliases:['san jose jrs','san jose jr'],
    current:remote('assets/official-logos/san-jose-jrs.png'),
    variants:[remote('assets/official-logos/san-jose-jrs.png'),remote('assets/teams/san-jose-jr.webp')]
  },
  cuenda:{
    aliases:['cuenda','tc cuenda'],
    current:app('assets/official-logos/cuenda-2026.webp'),
    variants:[app('assets/official-logos/cuenda-2026.webp'),remote('assets/official-logos/cuenda.png'),remote('assets/teams/tc-cuenda.webp')]
  },
  'toros-de-cuenda':{
    aliases:['toros de cuenda','toros cuenda'],
    current:remote('assets/official-logos/toros-de-cuenda.png'),
    variants:[remote('assets/official-logos/toros-de-cuenda.png')]
  },
  'atletico-santiago':{
    aliases:['atletico santiago','a santiago'],
    current:remote('assets/teams/atletico-santiago.webp'),
    variants:[remote('assets/teams/atletico-santiago.webp')]
  },
  'atletico-santa-cruz':{
    aliases:['atletico santa cruz','santa cruz'],
    current:remote('assets/teams/atletico-santa-cruz.webp'),
    variants:[remote('assets/teams/atletico-santa-cruz.webp')]
  },
  cebolleros:{
    aliases:['cebolleros','cebolleros fc','cebolleros fc cuenda','cebolleros de cuenda'],
    current:remote('assets/teams/cebolleros-fc-cuenda.webp'),
    variants:[remote('assets/teams/cebolleros-fc-cuenda.webp')]
  },
  oklahoma:{
    aliases:['oklahoma','oklahoma fc','oklahoma city','oklahoma city fc','dep okc','deportivo okc'],
    current:local('./assets/official-logos/oklahoma-city-fc.png'),
    variants:[local('./assets/official-logos/oklahoma-city-fc.png'),remote('assets/teams/oklahoma-city-fc.webp')]
  },
  mineros:{
    aliases:['mineros','mineros fc','minero'],
    current:remote('assets/teams/mineros-fc.webp'),
    variants:[remote('assets/teams/mineros-fc.webp')]
  },
  'deportivo-cg':{
    aliases:['deportivo cg','dep cg','c de gasca','c de g','cerrito de gasca','real cerrito','real cerrito de gasca','deportivo cerrito','dep cerrito'],
    current:remote('assets/teams/deportivo-cg.webp'),
    variants:[remote('assets/teams/deportivo-cg.webp')]
  },
  'boca-jrs':{
    aliases:['boca jrs','boca juniors','boca jrs cuenda','boca juniors cuenda'],
    current:local('./assets/official-logos/boca-jrs.png'),
    variants:[local('./assets/official-logos/boca-jrs.png')]
  },
  'real-de-roque':{
    aliases:['real de roque','real roque','real de roque fc','roque'],
    current:local('./assets/history/team-logos/real-de-roque.webp'),
    variants:[local('./assets/history/team-logos/real-de-roque.webp')]
  },
  tecos:{
    aliases:['tecos','tecos fc','tecos jr','tecos jrs','tecos de pozos','tecos pozos'],
    current:local('./assets/history/team-logos/tecos.webp'),
    variants:[local('./assets/history/team-logos/tecos.webp')]
  },
  xolos:{
    aliases:['xolos','xolos jaralillo','xolos de jaralillo','jaralillo','jaralillo fc','club tijuana'],
    current:local('./assets/history/team-logos/xolos-jaralillo.webp'),
    variants:[local('./assets/history/team-logos/xolos-jaralillo.webp')]
  },
  'franco-tavera-jr':{
    aliases:['franco tavera','franco tavera jr','franco tavera jrs','franco tavera veteranos','franco tavera jr veteranos','f tavera'],
    current:remote('assets/official-logos/franco-tavera-jr.png'),
    variants:[remote('assets/official-logos/franco-tavera-jr.png'),remote('assets/teams/franco-tavera-jr-veteranos.webp')]
  },
  napoli:{
    aliases:['napoli','napoli fc','ssc napoli'],
    current:remote('assets/official-logos/napoli.png'),
    variants:[remote('assets/official-logos/napoli.png')]
  },
  huracan:{
    aliases:['huracan','huracan fc'],
    current:remote('assets/official-logos/huracan.png'),
    variants:[remote('assets/official-logos/huracan.png')]
  },
  aguilares:{
    aliases:['aguilares','aguilares fc'],
    current:remote('assets/official-logos/aguilares.png'),
    variants:[remote('assets/official-logos/aguilares.png')]
  },
  leyendas:{
    aliases:['leyendas','leyendas fc'],
    current:remote('assets/official-logos/leyendas-fc.png'),
    variants:[remote('assets/official-logos/leyendas-fc.png')]
  },
  'la-trinidad':{
    aliases:['la trinidad','trinidad','la trinidad fc'],
    current:remote('assets/official-logos/la-trinidad.png'),
    variants:[remote('assets/official-logos/la-trinidad.png')]
  },
  dynamo:{
    aliases:['dynamo','dinamo','dynamo fc','dinamo fc'],
    current:remote('assets/official-logos/dynamo.png'),
    variants:[remote('assets/official-logos/dynamo.png')]
  },
  capibaras:{
    aliases:['capibaras','capibaras fc'],
    current:remote('assets/official-logos/capibaras.png'),
    variants:[remote('assets/official-logos/capibaras.png')]
  },
  'mazacotes-fc':{
    aliases:['mazacotes','mazacotes fc','masacotes','masacotes fc'],
    current:remote('assets/official-logos/mazacotes-fc.png'),
    variants:[remote('assets/official-logos/mazacotes-fc.png')]
  },
  'la-canchita':{
    aliases:['la canchita','la canchita deportes','la canchita fc'],
    current:remote('assets/official-logos/la-canchita-deportes.png'),
    variants:[remote('assets/official-logos/la-canchita-deportes.png'),remote('assets/teams/la-canchita.webp')]
  },
  populares:{
    aliases:['populares','populares fc'],
    current:remote('assets/official-logos/populares.png'),
    variants:[remote('assets/official-logos/populares.png')]
  },
  malvinas:{
    aliases:['malvinas','malvinas fc'],
    current:remote('assets/official-logos/malvinas.png'),
    variants:[remote('assets/official-logos/malvinas.png')]
  },
  'la-cuadrilla':{
    aliases:['la cuadrilla','la cuadrilla fc','deportivo la cuadrilla','cuadrilla','cuadrilla fc'],
    current:remote('assets/official-logos/la-cuadrilla.png'),
    variants:[remote('assets/official-logos/la-cuadrilla.png')]
  },
  'dep-maravillas':{
    aliases:['dep maravillas','deportivo maravillas','dep. maravillas','las maravillas'],
    current:remote('assets/official-logos/dep-maravillas.png'),
    variants:[remote('assets/official-logos/dep-maravillas.png')]
  },
  'san-antonio-jrs':{
    aliases:['san antonio jrs','san antonio jr','san antonio junior','san antonio juniors'],
    current:remote('assets/official-logos/san-antonio-jrs.png'),
    variants:[remote('assets/official-logos/san-antonio-jrs.png'),remote('assets/teams/san-antonio-jr.webp')]
  },
  osasuna:{
    aliases:['osasuna','osasuna fc'],
    current:remote('assets/official-logos/osasuna.png'),
    variants:[remote('assets/official-logos/osasuna.png')]
  },
  'aldama-fc':{
    aliases:['aldama','aldama fc','deportivo aldama'],
    current:remote('assets/official-logos/aldama-fc.png'),
    variants:[remote('assets/official-logos/aldama-fc.png'),remote('assets/teams/aldama.webp')]
  },
  'dep-zapata':{
    aliases:['dep zapata','deportivo zapata','dep zapata fc','deportivo zapata fc'],
    current:remote('assets/official-logos/dep-zapata.png'),
    variants:[remote('assets/official-logos/dep-zapata.png')]
  },
  barza:{
    aliases:['barza','barza fc','barsa','barcelona','barcelona fc'],
    current:remote('assets/official-logos/barza.png'),
    variants:[remote('assets/official-logos/barza.png')]
  },
  'san-juan-fc':{
    aliases:['san juan','san juan fc'],
    current:remote('assets/official-logos/san-juan-fc.png'),
    variants:[remote('assets/official-logos/san-juan-fc.png')]
  },
  tapatio:{
    aliases:['tapatio','tapatio fc'],
    current:remote('assets/official-logos/tapatio.png'),
    variants:[remote('assets/official-logos/tapatio.png')]
  },
  'dep-la-luz':{
    aliases:['dep la luz','deportivo la luz','la luz'],
    current:remote('assets/official-logos/dep-la-luz.png'),
    variants:[remote('assets/official-logos/dep-la-luz.png')]
  },
  'pachangas-fc':{
    aliases:['pachangas','pachangas fc'],
    current:remote('assets/official-logos/pachangas-fc.png'),
    variants:[remote('assets/official-logos/pachangas-fc.png')]
  },
  'san-antonio-fc':{
    aliases:['san antonio','san antonio fc'],
    current:remote('assets/official-logos/san-antonio-fc.png'),
    variants:[remote('assets/official-logos/san-antonio-fc.png')]
  },
  celticos:{
    aliases:['celticos','celticos fc','celtics','celtics fc'],
    current:remote('assets/official-logos/celticos.png'),
    variants:[remote('assets/official-logos/celticos.png')]
  },
  'dep-nopalero':{
    aliases:['dep nopalero','deportivo nopalero','nopalero'],
    current:remote('assets/official-logos/dep-nopalero.png'),
    variants:[remote('assets/official-logos/dep-nopalero.png'),remote('assets/teams/deportivo-nopalero.webp')]
  },
  'santiago-de-cuenda':{
    aliases:['santiago de cuenda','santiago de cuenda fc','deportivo santiago cuenda','deportivo santiago de cuenda'],
    current:remote('assets/teams/deportivo-santiago-cuenda.webp'),
    variants:[remote('assets/teams/deportivo-santiago-cuenda.webp')]
  },
  'el-cerri':{
    aliases:['el cerri','el cerri fc'],
    current:remote('assets/teams/el-cerri.webp'),
    variants:[remote('assets/teams/el-cerri.webp')]
  },
  salvajes:{
    aliases:['salvajes','salvaje'],
    current:local('./assets/history/team-logos/salvajes.webp'),
    variants:[local('./assets/history/team-logos/salvajes.webp')]
  }
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
const ALIAS={};
for(const [key,row] of Object.entries(LINEAGES)){
  ALIAS[norm(key)]=key;
  for(const name of row.aliases||[])ALIAS[norm(name)]=key;
}
function keyFor(name){return ALIAS[norm(name)]||''}
function currentFor(name){const k=keyFor(name);return k?LINEAGES[k]?.current||'':''}
function variantsFor(name){const k=keyFor(name);return k?[...(LINEAGES[k]?.variants||[])]:[]}

const USER_GLOBAL_CURRENT=new Set(['america','herreras','la-esperanza','cebolleros','oklahoma','boca-jrs','real-de-roque','tecos']);

function recordFor(name,context=''){
  const k=keyFor(name),text=norm(context);
  if(!k)return '';
  /* V743 — Estos diseños fueron confirmados por el usuario como los escudos que
     deben verse también en Historia y Récords. No sustituirlos por variantes antiguas. */
  if(USER_GLOBAL_CURRENT.has(k))return LINEAGES[k]?.current||'';
  if(k==='america'){
    /* El mismo América tuvo varios diseños. En archivo antiguo se conserva
       una variante anterior; en temporadas recientes se usa el escudo actual. */
    if(/\b(2012|2013|2014|2015|2016|2017|2018|2019|2020|2021|2022|2023)\b/.test(text)){
      return remote('assets/official-logos/america.png');
    }
    return LINEAGES[k].current;
  }
  if(k==='pozos'){
    if(text.includes('veteran'))return remote('assets/teams/veteranos-pozos-fc.webp');
    return remote('assets/teams/pozos-fc.webp');
  }
  /* Para otros linajes, Récords usa una variante secundaria cuando existe.
     Sigue siendo el mismo equipo: nunca se crea una identidad nueva. */
  const v=LINEAGES[k].variants||[];
  return v[1]||LINEAGES[k].current||'';
}

function installRegistry(){
  const reg=window.LJR_TEAM_LOGOS;
  if(!reg)return;
  if(reg.__v742Lineages)return;
  const prev=typeof reg.get==='function'?reg.get.bind(reg):()=> '';
  reg.get=function(name){
    const exact=currentFor(name);
    return exact||prev(name);
  };
  reg.lineages=LINEAGES;
  reg.getVariants=variantsFor;
  reg.getRecordLogo=(name,context)=>recordFor(name,context);
  reg.__v742Lineages=true;
}

function likelyLogo(img){
  const src=String(img.getAttribute('src')||'').toLowerCase();
  const cls=String(img.className||'').toLowerCase();
  return /logo|crest|badge|shield|team/.test(cls)||
    /official-logos|\/teams\/|branding|history\/team-logos|cloudinary\.com\/.*\/logos/.test(src);
}
function teamFromImage(img){
  const own=[img.dataset?.team,img.dataset?.v62Team,img.dataset?.v42CompareTeam,img.dataset?.v27Team].filter(v=>String(v||'').trim());
  for(const v of own)if(keyFor(v))return String(v).trim();

  const owner=img.closest?.('[data-team],[data-v62-team],[data-v42-compare-team],[data-v27-team]');
  if(owner){
    const vals=[owner.dataset?.team,owner.dataset?.v62Team,owner.dataset?.v42CompareTeam,owner.dataset?.v27Team].filter(Boolean);
    for(const v of vals)if(keyFor(v))return String(v).trim();
  }

  const direct=[img.alt,img.title].filter(v=>String(v||'').trim());
  for(const v of direct)if(keyFor(v))return String(v).trim();
  if(direct.length)return '';

  const card=img.closest?.('.v27-team,.v40-team,.v42-mini-team,.v46-team-card,.v28-side,.v62-team-card,.v446-home-club,.v6-league-team,.v6-table-row,.club-cell,.match-row,.v412-row,.v411-row');
  if(!card)return '';
  const vals=[
    card.dataset?.team,
    card.querySelector?.('.v27-team-name')?.textContent,
    card.querySelector?.('.v46-team-copy strong')?.textContent,
    card.querySelector?.('.v40-team strong')?.textContent,
    card.querySelector?.('.v42-mini-team b')?.textContent,
    card.querySelector?.('.v28-side span')?.textContent,
    card.querySelector?.('.home')?.textContent,
    card.querySelector?.('strong')?.textContent,
    card.querySelector?.('b')?.textContent
  ].filter(Boolean);
  for(const v of vals)if(keyFor(v))return String(v).trim();
  return '';
}
function historicalContext(img){
  return !!img.closest?.('.v35-history-page,.v370-legacy-team,.v35-record-card,[data-history-era-logo],[data-v724-legacy-logo]');
}
function patchGlobalImage(img){
  if(!(img instanceof HTMLImageElement)||historicalContext(img)||!likelyLogo(img))return;
  const team=teamFromImage(img),src=currentFor(team);
  if(!src)return;
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){img.src=src;img.removeAttribute('srcset')}
  img.alt=team;
  img.dataset.v742Lineage=keyFor(team);
  img.style.objectFit='contain';
  img.style.objectPosition='center';
}
function patchGlobal(root=document){
  installRegistry();
  root.querySelectorAll?.('img').forEach(patchGlobalImage);
}

function historyRoute(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]==='history';
}
function recordTeam(card){
  const title=String(card.querySelector('h3')?.textContent||'').trim();
  if(keyFor(title))return title;
  /* Sólo alias exactos del título. No usamos "contains": Galácticos de Pozos,
     Promesas de Pozos, Olímpicos de Pozos, etc. NO deben colapsarse a Pozos FC. */
  return '';
}
function isHistoricPhoto(img){
  const src=String(img?.currentSrc||img?.src||'').toLowerCase();
  return /\/assets\/history\/archive-v\d+\//.test(src)||
    (/\/assets\/history\//.test(src)&&!/\/team-logos\//.test(src));
}
function makeImg(src,name,cls=''){
  const el=document.createElement('img');
  el.src=src;el.alt=name;el.loading='lazy';el.decoding='async';
  if(cls)el.className=cls;
  el.dataset.v742RecordLogo='1';
  el.style.objectFit='contain';
  return el;
}
function patchRecords(root=document){
  if(!historyRoute())return;
  root.querySelectorAll?.('.v35-record-card').forEach(card=>{
    const team=recordTeam(card);
    if(!team)return;
    const src=recordFor(team,card.textContent||'');
    if(!src)return;

    const mark=card.querySelector(':scope > .v35-record-mark');
    if(mark){
      mark.replaceWith(makeImg(src,team,'v672-record-logo v704-record-logo v742-record-logo'));
      return;
    }
    const main=card.querySelector(':scope > img');
    if(!main)return;
    if(isHistoricPhoto(main)){
      let mini=card.querySelector('.v742-record-mini-logo,.v672-record-mini-logo');
      if(!mini){
        mini=document.createElement('span');
        mini.className='v672-record-mini-logo v742-record-mini-logo';
        card.appendChild(mini);
      }
      let im=mini.querySelector('img');
      if(!im){im=makeImg(src,team);mini.appendChild(im)}
      else if(String(im.src||'')!==new URL(src,document.baseURI).href)im.src=src;
      im.alt=team;
      return;
    }
    if(String(main.src||'')!==new URL(src,document.baseURI).href)main.src=src;
    main.alt=team;
    main.dataset.v742RecordLogo='1';
    card.querySelector('.v742-record-mini-logo')?.remove();
  });
}

let timer=0;
function sync(root=document){
  clearTimeout(timer);
  timer=setTimeout(()=>{
    installRegistry();
    patchGlobal(root);
    patchRecords(root);
  },30);
}
function boot(){
  installRegistry();
  patchGlobal(document);
  patchRecords(document);
  const target=document.querySelector('#screen')||document.body||document.documentElement;
  if(target)new MutationObserver(ms=>{
    for(const m of ms){
      for(const n of m.addedNodes){
        if(n.nodeType!==1)continue;
        if(n instanceof HTMLImageElement)patchGlobalImage(n);
        sync(n);
      }
    }
  }).observe(target,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>sync(document));
  window.addEventListener('load',()=>sync(document));
  window.addEventListener('ljr:official-data',()=>sync(document));
  document.addEventListener('click',()=>setTimeout(()=>sync(document),70),true);
  setTimeout(()=>sync(document),250);
  setTimeout(()=>sync(document),1000);
}
window.LJR_TEAM_LOGO_LINEAGES={lineages:LINEAGES,keyFor,currentFor,variantsFor,recordFor};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();