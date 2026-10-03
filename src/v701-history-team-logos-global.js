/* V701 — Sincronización global de escudos históricos.
   Recorre todas las vistas de Historia y aplica el mismo registro de escudos
   en Campeones, Temporadas, Finales, Récords, Vídeos, tablas y Memoria de clubes. */
(function(){
'use strict';
if(window.__LJR_V701_HISTORY_LOGO_SYNC__)return;
window.__LJR_V701_HISTORY_LOGO_SYNC__=true;

const FORCE={
  salvajes:'./assets/history/team-logos/salvajes.webp',
  salvaje:'./assets/history/team-logos/salvajes.webp',
  tecos:'./assets/history/team-logos/tecos.webp',
  'tecos fc':'./assets/history/team-logos/tecos.webp',
  xolos:'./assets/history/team-logos/xolos-jaralillo.webp',
  'xolos jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  'xolos de jaralillo':'./assets/history/team-logos/xolos-jaralillo.webp',
  jaralillo:'./assets/history/team-logos/xolos-jaralillo.webp',
  'jaralillo fc':'./assets/history/team-logos/xolos-jaralillo.webp',
  'club tijuana':'./assets/history/team-logos/xolos-jaralillo.webp',
  xoloitzcuintles:'./assets/history/team-logos/xolos-jaralillo.webp',
  universidad:'./assets/history/team-logos/universidad-pumas.webp',
  unam:'./assets/history/team-logos/universidad-pumas.webp',
  pumas:'./assets/history/team-logos/universidad-pumas.webp',
  'pumas unam':'./assets/history/team-logos/universidad-pumas.webp'
};

function route(){
  return (location.hash.replace(/^#\/?/,'')||document.body?.dataset?.appRoute||'home').split('?')[0];
}
function norm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()
    .replace(/&/g,' y ').replace(/[().,:;·]/g,' ').replace(/[^a-z0-9+]+/g,' ')
    .trim().replace(/\s+/g,' ');
}
function forced(name){
  const n=norm(name);
  if(FORCE[n])return FORCE[n];
  if(n.includes('salvajes'))return FORCE.salvajes;
  if(n==='tecos'||n.startsWith('tecos '))return FORCE.tecos;
  if(n.includes('xolos')||n.includes('jaralillo')||n.includes('xoloitz'))return FORCE.xolos;
  if(n==='universidad'||n.includes('pumas unam'))return FORCE.universidad;
  return '';
}
function logo(name){
  const f=forced(name);
  if(f)return f;
  try{
    const x=window.LJR_TEAM_LOGOS?.get?.(name);
    if(x)return x;
  }catch(_){}
  try{
    const x=window.LJR_OFFICIAL_API?.getLogo?.(name);
    if(x)return x;
  }catch(_){}
  return '';
}
function setHolder(holder,name){
  if(!holder||!name)return;
  const src=logo(name);
  if(!src)return;
  const isForced=!!forced(name);
  let img=holder.querySelector(':scope > img');
  if(!img){
    img=document.createElement('img');
    holder.prepend(img);
  }
  if(isForced || !img.getAttribute('src'))img.src=src;
  img.alt=name;
  img.loading='lazy';
  img.decoding='async';
  img.hidden=false;
  img.dataset.v701Logo='1';
  holder.classList.remove('is-fallback');
  holder.classList.add('v701-has-logo');
  holder.querySelectorAll(':scope > b,:scope > .v328-season-initials,:scope > .v35-era-fallback').forEach(x=>x.hidden=true);
}
function patchPair(selector,nameSel,holderSel,attr){
  document.querySelectorAll(selector).forEach(card=>{
    const name=(attr?card.getAttribute(attr):'')||card.querySelector(nameSel)?.textContent||'';
    setHolder(card.querySelector(holderSel),String(name).trim());
  });
}
function patchEraCards(){
  document.querySelectorAll('.v35-era-team').forEach(card=>{
    const name=card.querySelector(':scope > b')?.textContent?.trim()||'';
    const src=logo(name);
    if(!src)return;
    let img=card.querySelector(':scope > img');
    if(!img){
      img=document.createElement('img');
      card.prepend(img);
    }
    if(forced(name)||!img.src)img.src=src;
    img.alt=name;img.loading='lazy';img.decoding='async';img.dataset.v701Logo='1';
    card.querySelector(':scope > .v35-era-fallback')?.remove();
  });
}
function patchRecords(){
  document.querySelectorAll('.v35-record-card').forEach(card=>{
    const name=card.querySelector('h3')?.textContent?.trim()||'';
    const src=logo(name);
    if(!src)return;
    const mark=card.querySelector(':scope > .v35-record-mark');
    if(mark){
      const img=document.createElement('img');
      img.src=src;img.alt=name;img.loading='lazy';img.decoding='async';img.dataset.v701Logo='1';
      mark.replaceWith(img);
      return;
    }
    const img=card.querySelector(':scope > img');
    if(img && forced(name)){
      const u=String(img.getAttribute('src')||'').toLowerCase();
      const isPhoto=/archive-v\d+|history\/[^/]+\.(jpg|jpeg)/.test(u);
      if(!isPhoto){img.src=src;img.alt=name;img.dataset.v701Logo='1';}
    }
  });
}
function addInlineLogo(el,name){
  if(!el||el.querySelector(':scope > .v701-inline-logo'))return;
  const src=logo(name);
  if(!src)return;
  const img=document.createElement('img');
  img.className='v701-inline-logo';
  img.src=src;img.alt='';img.loading='lazy';img.decoding='async';
  el.prepend(img);
}
function patchTablesAndResults(){
  document.querySelectorAll('.v35-old-table-row').forEach(row=>{
    const team=row.querySelector(':scope > b');
    if(team)addInlineLogo(team,team.textContent.trim());
  });
  document.querySelectorAll('.v35-result-list article').forEach(row=>{
    const a=row.querySelector(':scope > b'),b=row.querySelector(':scope > strong');
    if(a)addInlineLogo(a,a.textContent.trim());
    if(b)addInlineLogo(b,b.textContent.trim());
  });
  document.querySelectorAll('.v35-retro-names > span').forEach(x=>addInlineLogo(x,x.textContent.trim()));
}
function patchNoPhotoChampionCards(){
  document.querySelectorAll('.v35-champion-card,.v35-history-moment').forEach(card=>{
    if(card.querySelector(':scope > img,.v701-card-logo'))return;
    const name=card.querySelector('h3,h4')?.textContent?.trim()||'';
    const src=logo(name);
    if(!src)return;
    const wrap=document.createElement('span');
    wrap.className='v701-card-logo';
    const img=document.createElement('img');
    img.src=src;img.alt=name;img.loading='lazy';img.decoding='async';
    wrap.appendChild(img);
    card.prepend(wrap);
  });
}
function patch(){
  if(route()!=='history')return;
  patchPair('.v340-champion-row','.v340-champion-name','.v340-champion-logo');
  patchPair('.v341-era-item','.v341-era-season','.v341-era-logo','data-v35-era-team');
  patchPair('.v328-season-item','.v328-season-initials','.v328-season-logo','data-v328-team');
  patchPair('.v370-legacy-team','.v370-legacy-copy strong','.v370-legacy-crest');
  patchPair('.v358-team','strong','.v358-final-crest');
  patchPair('.v355-final-team','strong','.v355-final-crest');
  patchPair('.v330-team','strong','.v330-crest');
  patchPair('.v329-team-line','strong','.v329-final-crest');
  patchEraCards();
  patchRecords();
  patchTablesAndResults();
  patchNoPhotoChampionCards();
}
let t=0;
function schedule(ms=40){clearTimeout(t);t=setTimeout(()=>requestAnimationFrame(patch),ms);}
function boot(){
  const host=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(55)).observe(host,{childList:true,subtree:true,characterData:true});
  window.addEventListener('hashchange',()=>schedule(80));
  window.addEventListener('ljr:official-data',()=>schedule(80));
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-v35-tab],[data-v340-champion-cat]'))schedule(90)},true);
  schedule(10);setTimeout(patch,350);setTimeout(patch,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();