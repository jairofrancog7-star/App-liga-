/* V747 — Home logo guard.
   Keeps each home card/row bound to its own team crest and defers to the
   canonical logo-lineage registry when available. */
(function(){
'use strict';
if(window.__LJR_V747_HOME_LOGO_GUARD__)return;
window.__LJR_V747_HOME_LOGO_GUARD__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP_BASE='https://raw.githubusercontent.com/jairofrancog7-star/App-liga-/main/';

const FALLBACK={
  'san jose fc':APP_BASE+'assets/official-logos/san-jose-fc-2026.webp',
  'juventus':BASE+'assets/official-logos/juventus.png',
  'linces':BASE+'assets/official-logos/linces.png',
  'napoli':BASE+'assets/official-logos/napoli.png',
  'hermanos':APP_BASE+'assets/official-logos/hermanos-2026.webp',
  'franco fc':BASE+'assets/official-logos/franco-fc.png',
  'herreras fc':BASE+'assets/official-logos/herreras-fc.png',
  'abejas':BASE+'assets/official-logos/abejas.png',
  'terricolas':APP_BASE+'assets/official-logos/terricolas-2026.webp',
  'lobos cdg':BASE+'assets/official-logos/lobos-cdg.png',
  'galacticos':BASE+'assets/teams/galacticos-pozos.webp',
  'boavista':APP_BASE+'assets/official-logos/boavista-2026.webp',
  'cuenda':APP_BASE+'assets/official-logos/cuenda-2026.webp',
  'santiago de cuenda':BASE+'assets/teams/deportivo-santiago-cuenda.webp',
  'promesas':BASE+'assets/official-logos/promesas-fc.png',
  'promesas fc':BASE+'assets/official-logos/promesas-fc.png',
  'pozos fc':BASE+'assets/teams/pozos-fc.webp',
  'america':BASE+'assets/branding/america-veteranos-35-user.png',
  'la huerta':BASE+'assets/official-logos/la-huerta.png',
  'oklahoma':APP_BASE+'assets/official-logos/oklahoma-city-fc.png'
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function isHome(){
  const r=String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
  return !r||r==='home';
}
function canonicalSrc(name){
  const raw=String(name||'').trim();
  if(!raw)return '';
  try{
    const x=window.LJR_TEAM_LOGO_LINEAGES?.currentFor?.(raw);
    if(x)return x;
  }catch(_){}
  try{
    const x=window.LJR_TEAM_LOGOS?.get?.(raw);
    if(x)return x;
  }catch(_){}
  return FALLBACK[norm(raw)]||'';
}
function candidateNames(img){
  const out=[
    img.dataset?.team,
    img.dataset?.v62Team,
    img.dataset?.v42CompareTeam,
    img.dataset?.v27Team,
    img.getAttribute('alt'),
    img.getAttribute('title')
  ].filter(v=>String(v||'').trim());

  const card=img.closest?.(
    '.v446-home-club,.v6-league-team,.v6-table-row,.club-cell,.match-row,'+
    '.v412-row,.v411-row,[data-team],[data-v62-team],[data-v42-compare-team],[data-v27-team]'
  );
  if(card){
    out.push(
      card.dataset?.team,
      card.dataset?.v62Team,
      card.dataset?.v42CompareTeam,
      card.dataset?.v27Team,
      card.querySelector?.('.home')?.textContent,
      card.querySelector?.('.v27-team-name')?.textContent,
      card.querySelector?.('.v46-team-copy strong')?.textContent,
      card.querySelector?.('.v40-team strong')?.textContent,
      card.querySelector?.('.v42-mini-team b')?.textContent,
      card.querySelector?.('.v28-side span')?.textContent,
      card.querySelector?.('strong')?.textContent,
      card.querySelector?.('b')?.textContent
    );
  }
  return out.filter(v=>String(v||'').trim());
}
function resolveTeam(img){
  for(const name of candidateNames(img)){
    if(canonicalSrc(name))return String(name).trim();
  }
  return '';
}
function patchImg(img){
  if(!(img instanceof HTMLImageElement))return;
  const team=resolveTeam(img);
  if(!team)return;
  const src=canonicalSrc(team);
  if(!src)return;
  const wanted=new URL(src,document.baseURI).href;
  if(String(img.src||'')!==wanted){
    img.src=src;
    img.removeAttribute('srcset');
  }
  img.dataset.v747HomeLogo=norm(team);
  img.style.objectFit='contain';
  img.style.objectPosition='center';
}
function patch(){
  if(!isHome())return;
  const root=document.querySelector('#screen')||document;
  root.querySelectorAll(
    '.v446-home-club img,.v6-league-team img,.v6-table-row img,.club-cell img,.match-row img,'+
    '.v412-row img,.v411-row img'
  ).forEach(patchImg);
}
function boot(){
  patch();
  const root=document.querySelector('#screen')||document.body;
  if(root)new MutationObserver(()=>requestAnimationFrame(patch)).observe(root,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(patch,0));
  window.addEventListener('load',patch);
  window.addEventListener('ljr:official-data',patch);
  setTimeout(patch,100);
  setTimeout(patch,600);
  setTimeout(patch,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();