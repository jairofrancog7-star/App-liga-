/* V948 — force the correct team emblem on the legacy player comparator.
   Supports old cached card markup, asynchronously mounted cards, and selection changes.
   Does not change size, layout, scoring, selected players or navigation. */
(function(){
'use strict';
if(window.__LJR_COMPARE_LOGO_GUARD_V948__)return;
window.__LJR_COMPARE_LOGO_GUARD_V948__=true;
const routes=new Set(['compare','comparar','v4-compare']);
const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const LOCAL={
  'la canchita deportes':'assets/official-logos/la-canchita-deportes.png',
  'la canchita':'assets/official-logos/la-canchita-deportes.png',
  'juventus':'assets/official-logos/juventus.png'
};
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[().]/g,' ').replace(/\s+/g,' ').trim();
const currentRoute=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const isSummary=s=>/^\d+\s+goles?\s+en\s+temporada$/i.test(String(s||'').trim());
const initials=s=>String(s||'?').trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x.charAt(0).toUpperCase()).join('');
function teamFor(holder){
 const explicit=holder.dataset.v948Team||holder.getAttribute('title')||'';
 if(explicit&&explicit!=='Equipo'&&!isSummary(explicit))return explicit;
 const card=holder.closest('.v944-player');
 if(card){
  const subtitle=card.querySelector('.v944-player-team')?.textContent?.trim()||'';
  return isSummary(subtitle)?card.querySelector('.v944-player-name')?.textContent?.trim()||'':subtitle;
 }
 const opt=holder.closest('.v944-option');
 if(opt){
  const label=opt.querySelector('small')?.textContent?.split(' · ')[0]?.trim()||'';
  return isSummary(label)?opt.querySelector('strong')?.textContent?.trim()||'':label;
 }
 return '';
}
function sources(team){
 const options=[],add=value=>{
  if(!value||typeof value!=='string')return;
  let v=value.trim();if(!v)return;
  if(/^(?:\.\/)?assets\/official-logos\//i.test(v))v=ROOT+v.replace(/^\.\//,'');
  if(!/^(https?:\/\/|\.\/|\/|data:image\/)/i.test(v))return;
  if(!options.includes(v))options.push(v);
 };
 const n=norm(team);
 if(LOCAL[n])add(ROOT+LOCAL[n]);
 try{add(window.LJR_TEAM_LOGOS?.get?.(team))}catch(_){}
 try{add(window.LJR_SEASON_LOGOS?.get?.(team))}catch(_){}
 try{add(window.V66_OFFICIAL_DIRECTORY?.logoFor?.(team))}catch(_){}
 try{add(window.LJR_OFFICIAL_API?.getLogo?.(team))}catch(_){}
 return options;
}
function replace(holder,team){
 if(!team||!holder.isConnected)return;
 const key=norm(team),list=sources(team);
 // Do not retry known failing URLs on every MutationObserver callback.
 if(holder.dataset.v948Team===key&&holder.dataset.v948LogoUnavailable==='true')return;
 // No image loading cycle: the emblem remains in place on every scan.
 const existing=holder.querySelector('img[data-v948-team]');
 if(existing?.dataset.v948Team===key)return;
 if(!list.length){
  if(existing)return;
  const old=holder.querySelector('img');
  if(old&&old.complete&&old.naturalWidth>0)return;
  holder.replaceChildren();
  const ab=document.createElement('span');
  ab.className='v946-crest-initials';
  ab.textContent=initials(team);
  holder.append(ab);
  holder.dataset.v948Team=key;
  holder.dataset.v948LogoUnavailable='true';
  return;
 }
 const img=document.createElement('img');
 img.dataset.v948Team=key;
 img.alt='Escudo de '+team;
 img.loading='eager';
 img.decoding='async';
 img.style.objectFit='contain';
 img.style.objectPosition='center';
 img.style.background='transparent';
 img.style.filter='none';
 let attempt=0;
 img.onerror=()=>{
  if(!img.isConnected)return;
  attempt++;
  if(attempt<list.length){img.src=list[attempt];return}
  const span=document.createElement('span');
  span.className='v946-crest-initials';
  span.textContent=initials(team);
  holder.replaceChildren(span);
  holder.dataset.v948Team=key;
  holder.dataset.v948LogoUnavailable='true';
 };
 // Remove old legacy emoji and any previously failed crest image.
 holder.replaceChildren(img);
 holder.classList.add('v946-team-crest');
 holder.dataset.v948Team=key;
 delete holder.dataset.v948LogoUnavailable;
 img.src=list[0];
}
let scheduled=false;
function scan(){
 scheduled=false;
 if(!routes.has(currentRoute()))return;
 const screen=document.getElementById('screen');
 if(!screen)return;
 for(const holder of screen.querySelectorAll('.v944-player .v944-crest')){
  const team=teamFor(holder);
  if(team)replace(holder,team);
 }
 for(const holder of document.querySelectorAll('.v944-overlay .v944-option .v944-crest')){
  const team=teamFor(holder);
  if(team)replace(holder,team);
 }
}
function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(scan)}}
function init(){
 const screen=document.getElementById('screen');
 if(!screen)return;
 new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
 new MutationObserver(schedule).observe(document.body,{childList:true,subtree:false});
 addEventListener('hashchange',schedule);
 addEventListener('pageshow',schedule);
 schedule();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();