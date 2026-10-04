/* V752 — Guardia final de escudos.
   Corre al final de las capas de logos y fuerza URLs raw estables por identidad.
   También recupera placeholders vacíos en Historia/Récords sin tocar fotos históricas. */
(function(){
'use strict';
if(window.__LJR_V752_LOGO_FINAL_GUARD__)return;
window.__LJR_V752_LOGO_FINAL_GUARD__=true;

const DATA='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/';
const V='?v=20261004-v752';

const SOURCES={
  'san-jose-fc':[APP+'assets/official-logos/san-jose-fc-2026.webp'+V,DATA+'assets/official-logos/san-jose-fc.png'],
  'hermanos':[APP+'assets/official-logos/hermanos-2026.webp'+V,DATA+'assets/official-logos/hermanos.png',DATA+'assets/teams/club-deportivo-hermanos.webp'],
  'terricolas':[APP+'assets/official-logos/terricolas-2026.webp'+V,DATA+'assets/official-logos/terricolas.png',DATA+'assets/teams/terricolas-fc.webp'],
  'boavista':[APP+'assets/official-logos/boavista-2026.webp'+V,DATA+'assets/official-logos/boavista.png',DATA+'assets/teams/boavista-fc.webp'],
  'abejas':[APP+'assets/official-logos/abejas-2026.webp'+V,DATA+'assets/official-logos/abejas.png'],
  'cuenda':[APP+'assets/official-logos/cuenda-2026.webp'+V,DATA+'assets/official-logos/cuenda.png',DATA+'assets/teams/tc-cuenda.webp'],
  'promesas-fc':[APP+'assets/official-logos/promesas-fc-2026.webp'+V,DATA+'assets/official-logos/promesas-fc.png',DATA+'assets/teams/promesas-fc-pozos.webp'],
  'herreras-fc':[DATA+'assets/official-logos/herreras-fc.png',DATA+'assets/teams/herrera-fc.webp'],
  'america':[DATA+'assets/branding/america-veteranos-35-user.png',DATA+'assets/official-logos/america.png'],
  'la-esperanza':[DATA+'assets/official-logos/la-esperanza.png',DATA+'assets/teams/la-esperanza-fc.webp'],
  'boca-jrs':[APP+'assets/official-logos/boca-jrs.png'+V],
  'oklahoma-city-fc':[APP+'assets/official-logos/oklahoma-city-fc.png'+V,DATA+'assets/teams/oklahoma-city-fc.webp'],
  'tecos':[APP+'assets/history/team-logos/tecos.webp'+V],
  'real-de-roque':[APP+'assets/history/team-logos/real-de-roque.webp'+V],
  'cebolleros-cuenda':[DATA+'assets/teams/cebolleros-fc-cuenda.webp']
};

const ALIASES={
  'san jose fc':'san-jose-fc','san jose':'san-jose-fc','san jose de la montana':'san-jose-fc','san jose montana':'san-jose-fc',
  'hermanos':'hermanos','hermanos fc':'hermanos','dep hermanos':'hermanos','deportivo hermanos':'hermanos','club deportivo hermanos':'hermanos',
  'terricolas':'terricolas','terricolas fc':'terricolas','terricolas seder':'terricolas',
  'boavista':'boavista','boavista fc':'boavista','bfc':'boavista',
  'abejas':'abejas','abejas fc':'abejas',
  'cuenda':'cuenda','santiago de cuenda':'cuenda','santiago de cuenda fc':'cuenda',
  'promesas':'promesas-fc','promesas fc':'promesas-fc','promesas de pozos':'promesas-fc',
  'herrera':'herreras-fc','herrera fc':'herreras-fc','herreras':'herreras-fc','herreras fc':'herreras-fc',
  'america':'america','america veteranos':'america','club america':'america','club america veteranos':'america','america j rosas':'america','club america j rosas':'america',
  'la esperanza':'la-esperanza','la esperanza fc':'la-esperanza',
  'boca jrs':'boca-jrs','boca juniors':'boca-jrs','cabj':'boca-jrs',
  'oklahoma':'oklahoma-city-fc','oklahoma fc':'oklahoma-city-fc','oklahoma city':'oklahoma-city-fc','oklahoma city fc':'oklahoma-city-fc',
  'tecos':'tecos','tecos fc':'tecos','tecos jr':'tecos','tecos jrs':'tecos','tecos pozos':'tecos','tecos de pozos':'tecos',
  'real de roque':'real-de-roque','real roque':'real-de-roque','real de roque fc':'real-de-roque',
  'cebolleros':'cebolleros-cuenda','cebolleros fc':'cebolleros-cuenda','cebolleros fc cuenda':'cebolleros-cuenda','cebolleros de cuenda':'cebolleros-cuenda'
};

const DISPLAY={
  'san-jose-fc':'San José FC','hermanos':'Hermanos','terricolas':'Terrícolas','boavista':'Boavista',
  'abejas':'Abejas','cuenda':'Cuenda','promesas-fc':'Promesas FC','herreras-fc':'Herreras FC',
  'america':'América','la-esperanza':'La Esperanza','boca-jrs':'Boca Juniors','oklahoma-city-fc':'Oklahoma City FC',
  'tecos':'Tecos','real-de-roque':'Real de Roque','cebolleros-cuenda':'Cebolleros F.C. Cuenda'
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
const ORDER=Object.keys(ALIASES).sort((a,b)=>b.length-a.length);
function keyExact(v){return ALIASES[norm(v)]||''}
function keyFromText(v){
  const n=norm(v); if(!n)return '';
  if(ALIASES[n])return ALIASES[n];
  const padded=' '+n+' ';
  const found=new Set();
  for(const a of ORDER){
    if(a.length<5)continue;
    if(padded.includes(' '+a+' '))found.add(ALIASES[a]);
  }
  return found.size===1?[...found][0]:'';
}
function isPlayer(img){
  return !!img.closest?.('[data-player-portrait],.v123-avatar,.v123-option-avatar,.v66-player-avatar,.v42-avatar,.v576-player-avatar,.v379-related-avatar,.v562-avatar,.v124-avatar') ||
    img.matches?.('.v379-player-photo,.v610-generic-player,.v576-player-photo,.v576-hero-player-photo');
}
function isHistoricPhoto(img){
  const s=String(img.currentSrc||img.src||'').toLowerCase();
  return /\/assets\/history\/archive-v\d+\//.test(s);
}
function looksLogo(img){
  const s=String(img.getAttribute('src')||'').toLowerCase();
  const c=String(img.className||'').toLowerCase();
  return /logo|crest|badge|shield|team/.test(c) ||
    /official-logos|\/teams\/|branding|team-logos|cloudinary/.test(s) ||
    !!img.closest?.('.v35-record-card,.v370-legacy-team,.v340-champion-row,.v341-era-item,.v328-season-item,.v35-season-card,.v35-retro-club,.v358-team,.v355-final-team,.v330-team,.v329-team-line,.v358-stat-row,[data-team]');
}
function keyForImg(img){
  const direct=[img.dataset?.team,img.getAttribute('alt'),img.getAttribute('title')].filter(Boolean);
  for(const v of direct){const k=keyExact(v);if(k)return k}
  let n=img.parentElement;
  for(let d=0;d<6&&n;d++,n=n.parentElement){
    const vals=[n.dataset?.team,n.dataset?.v62Team,n.dataset?.v42CompareTeam,n.dataset?.v27Team].filter(Boolean);
    for(const v of vals){const k=keyExact(v);if(k)return k}
    const t=String(n.textContent||'').replace(/\s+/g,' ').trim();
    if(t&&t.length<800){const k=keyFromText(t);if(k)return k}
  }
  return '';
}
function installErrorCycle(img,key){
  img.dataset.v752Key=key;
  img.dataset.v752Try='0';
  if(img.dataset.v752ErrorBound==='1')return;
  img.dataset.v752ErrorBound='1';
  img.addEventListener('error',()=>{
    const k=img.dataset.v752Key||'';
    const list=SOURCES[k]||[];
    let i=Number(img.dataset.v752Try||0)+1;
    if(i>=list.length)return;
    img.dataset.v752Try=String(i);
    img.src=list[i];
    img.removeAttribute('srcset');
  });
}
function forceImg(img,key){
  const list=SOURCES[key]; if(!list?.length)return;
  installErrorCycle(img,key);
  img.dataset.v752Try='0';
  const wanted=new URL(list[0],document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=list[0];
    img.removeAttribute('srcset');
  }
  if(!String(img.alt||'').trim())img.alt=DISPLAY[key]||key;
  img.loading='eager';
  img.decoding='async';
  img.style.setProperty('object-fit','contain','important');
  img.style.setProperty('object-position','center','important');
  img.style.setProperty('background','transparent','important');
  img.style.setProperty('padding','0','important');
  img.dataset.v752Logo='1';
}
function patchImg(img){
  if(!(img instanceof HTMLImageElement)||isPlayer(img)||isHistoricPhoto(img)||!looksLogo(img))return;
  const k=keyForImg(img); if(k)forceImg(img,k);
}
const HOLDERS=[
  '.v35-record-mark','.v370-legacy-crest','.v340-champion-logo','.v341-era-logo','.v328-season-logo',
  '.v35-season-crest','.v35-retro-logo','.v358-final-crest','.v355-final-crest','.v330-crest',
  '.v329-final-crest','.v358-stat-logo'
];
function patchHolders(root=document){
  root.querySelectorAll?.(HOLDERS.join(',')).forEach(h=>{
    const existing=h instanceof HTMLImageElement?h:h.querySelector('img');
    if(existing){patchImg(existing);return}
    const context=h.closest('.v35-record-card,.v370-legacy-team,.v340-champion-row,.v341-era-item,.v328-season-item,.v35-season-card,.v35-retro-club,.v358-team,.v355-final-team,.v330-team,.v329-team-line,.v358-stat-row')||h.parentElement;
    const k=keyFromText(context?.textContent||''); if(!k)return;
    const im=document.createElement('img');
    im.className='v752-recovered-team-logo';
    forceImg(im,k);
    h.replaceChildren(im);
  });
  root.querySelectorAll?.('.v35-era-fallback,.v328-season-initials,.v725-legacy-monogram').forEach(p=>{
    const context=p.closest('.v35-era-team,.v328-season-item,.v370-legacy-team')||p.parentElement;
    const k=keyFromText(context?.textContent||''); if(!k)return;
    const im=document.createElement('img');
    im.className='v752-recovered-team-logo';
    forceImg(im,k);
    p.replaceWith(im);
  });
}
function patch(root=document){
  root.querySelectorAll?.('img').forEach(patchImg);
  patchHolders(root);
}
let queued=false;
function queue(root=document){
  if(queued)return;queued=true;
  requestAnimationFrame(()=>{queued=false;patch(root)});
}
function boot(){
  patch(document);
  const target=document.querySelector('#screen')||document.body||document.documentElement;
  if(target)new MutationObserver(ms=>{
    for(const m of ms){
      if(m.type==='attributes'&&m.target instanceof HTMLImageElement)patchImg(m.target);
      for(const n of m.addedNodes||[]){
        if(n.nodeType!==1)continue;
        if(n instanceof HTMLImageElement)patchImg(n);
        queue(n);
      }
    }
  }).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset','alt']});
  window.addEventListener('hashchange',()=>setTimeout(()=>patch(document),30));
  window.addEventListener('load',()=>patch(document));
  window.addEventListener('ljr:official-data',()=>patch(document));
  document.addEventListener('click',()=>setTimeout(()=>patch(document),80),true);
  setTimeout(()=>patch(document),250);
  setTimeout(()=>patch(document),900);
  setTimeout(()=>patch(document),2200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();