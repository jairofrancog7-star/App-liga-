/* V693 — Historia / Buscar por temporada: fuerza los escudos de los equipos.
   Evita que cualquier parche anterior vuelva a mostrar el escudo de la Liga. */
(function(){
'use strict';
if(window.__LJR_V693_HISTORY_SEASON_TEAM_LOGOS__)return;
window.__LJR_V693_HISTORY_SEASON_TEAM_LOGOS__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP='./assets/history/team-logos/';
const MAP={
  '2022/23':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2021/22':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2020/21':{team:'La Esperanza',src:ROOT+'assets/official-logos/la-esperanza.png?v=20261003-v693'},
  '2019/20':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2018/19':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2017/18':{team:'Tecos',src:APP+'tecos.webp?v=20261003-v693-user-logo'},
  '2015/16':{team:'La Esperanza',src:ROOT+'assets/official-logos/la-esperanza.png?v=20261003-v693'},
  '2013/14':{team:'La Esperanza',src:ROOT+'assets/official-logos/la-esperanza.png?v=20261003-v693'}
};

function route(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'';
}
function forceOne(card){
  const label=String(card.querySelector('.v35-season-label')?.textContent||'').trim();
  const data=MAP[label];
  if(!data)return;
  const crest=card.querySelector('.v35-season-crest');
  if(!crest)return;
  let img=crest.querySelector('img');
  if(!img){
    crest.innerHTML='';
    img=document.createElement('img');
    crest.appendChild(img);
  }
  if(img.getAttribute('src')!==data.src)img.setAttribute('src',data.src);
  img.alt=data.team;
  img.loading='eager';
  img.decoding='async';
  crest.classList.remove('is-fallback');
  crest.dataset.v693Team=data.team;
  card.dataset.v693SeasonLogo='1';
  card.setAttribute('aria-label','Temporada '+label+' · '+data.team);
}
function force(){
  if(route()!=='history')return;
  document.querySelectorAll('.v35-history-page .v35-season-card').forEach(forceOne);
  document.querySelectorAll('.v35-history-page .v351-season-preview-item').forEach(item=>{
    const label=String(item.querySelector('.v341-era-season')?.textContent||'').trim();
    const data=MAP[label];
    if(!data)return;
    const crest=item.querySelector('.v341-era-logo');
    if(!crest)return;
    let img=crest.querySelector('img');
    if(!img){
      crest.innerHTML='';
      img=document.createElement('img');
      crest.appendChild(img);
    }
    if(img.getAttribute('src')!==data.src)img.setAttribute('src',data.src);
    img.alt=data.team;
    img.loading='eager';
    img.decoding='async';
    crest.classList.remove('is-fallback');
    item.setAttribute('aria-label','Temporada '+label+' · '+data.team);
  });
}

let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(force));
}
new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('hashchange',schedule);
window.addEventListener('load',schedule);
document.addEventListener('DOMContentLoaded',schedule,{once:true});
document.addEventListener('click',e=>{
  if(e.target.closest?.('[data-v35-tab],[data-v35-season],[data-v351-load-seasons]'))setTimeout(schedule,30);
},true);
schedule();
setTimeout(schedule,250);
setTimeout(schedule,1000);
})();