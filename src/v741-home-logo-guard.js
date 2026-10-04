/* V741 — Home logo guard.
   Keeps each Primera Fuerza card/row bound to its own official crest. */
(function(){
'use strict';
if(window.__LJR_V741_HOME_LOGO_GUARD__)return;
window.__LJR_V741_HOME_LOGO_GUARD__=true;

const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LOGOS={
  'san jose fc':BASE+'assets/official-logos/san-jose-fc.png',
  'juventus':BASE+'assets/official-logos/juventus.png',
  'linces':BASE+'assets/official-logos/linces.png',
  'napoli':BASE+'assets/official-logos/napoli.png',
  'hermanos':BASE+'assets/official-logos/hermanos.png',
  'franco fc':BASE+'assets/official-logos/franco-fc.png',
  'herreras fc':BASE+'assets/official-logos/herreras-fc.png',
  'abejas':BASE+'assets/official-logos/abejas.png',
  'terricolas':BASE+'assets/official-logos/terricolas.png',
  'lobos cdg':BASE+'assets/official-logos/lobos-cdg.png',
  'galacticos':BASE+'assets/teams/galacticos-pozos.webp'
};

function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/[^a-z0-9]+/g,' ').trim().replace(/\s+/g,' ');
}
function isHome(){
  const r=String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
  return !r||r==='home';
}
function nameFor(img){
  const alt=norm(img.getAttribute('alt')||img.getAttribute('title')||'');
  if(LOGOS[alt])return alt;
  const one=img.closest('.v446-home-club,.v6-league-team,.v6-table-row,.club-cell,.match-row');
  if(!one)return '';
  const texts=[
    one.dataset?.team,
    one.querySelector('.home')?.textContent,
    one.querySelector('b')?.textContent,
    one.querySelector('strong')?.textContent
  ].filter(Boolean);
  for(const t of texts){const k=norm(t);if(LOGOS[k])return k}
  return '';
}
function patchImg(img){
  if(!(img instanceof HTMLImageElement))return;
  const k=nameFor(img); if(!k)return;
  const src=LOGOS[k];
  if(img.getAttribute('src')!==src){img.src=src;img.removeAttribute('srcset')}
  img.dataset.v741HomeLogo=k;
  img.style.objectFit='contain';
  img.style.objectPosition='center';
}
function patch(){
  if(!isHome())return;
  const root=document.querySelector('#screen')||document;
  root.querySelectorAll('.v446-home-club img,.v6-league-team img,.v6-table-row img,.club-cell img,.match-row img').forEach(patchImg);
}
function boot(){
  patch();
  const root=document.querySelector('#screen')||document.body;
  if(root)new MutationObserver(()=>requestAnimationFrame(patch)).observe(root,{childList:true,subtree:true});
  window.addEventListener('hashchange',()=>setTimeout(patch,0));
  window.addEventListener('load',patch);
  window.addEventListener('ljr:official-data',patch);
  setTimeout(patch,100);setTimeout(patch,600);setTimeout(patch,1500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();