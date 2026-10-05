/* V693 — Historia / Buscar por temporada: fuerza los escudos de los equipos.
   Evita que cualquier parche anterior vuelva a mostrar el escudo de la Liga. */
(function(){
'use strict';
if(window.__LJR_V693_HISTORY_SEASON_TEAM_LOGOS__)return;
window.__LJR_V693_HISTORY_SEASON_TEAM_LOGOS__=true;

const ROOT='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const APP='./assets/history/team-logos/';
const TECOS_LOGO='./assets/history/team-logos/tecos.webp';
const TECOS_FALLBACK='https://www.futbox.com/img/v1/f0a/8b6/3e6/552/2d01f40af30745f3a1da_zoom.png';
const REAL_DHP_LOGO='data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20240%20240%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22g%22%20x1%3D%220%22%20y1%3D%220%22%20x2%3D%221%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23102aa8%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%2307105d%22%2F%3E%3C%2FlinearGradient%3E%3C%2Fdefs%3E%3Cpath%20d%3D%22M120%2010%20210%2042v70c0%2059-35%2096-90%20118-55-22-90-59-90-118V42z%22%20fill%3D%22url(%23g)%22%20stroke%3D%22%2328e6f1%22%20stroke-width%3D%227%22%2F%3E%3Cpath%20d%3D%22M63%2082h114v56H63z%22%20rx%3D%2210%22%20fill%3D%22%23fff%22%20opacity%3D%22.96%22%2F%3E%3Ctext%20x%3D%22120%22%20y%3D%22121%22%20text-anchor%3D%22middle%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2242%22%20font-weight%3D%22900%22%20fill%3D%22%230b1779%22%3EDHP%3C%2Ftext%3E%3Ccircle%20cx%3D%22120%22%20cy%3D%22173%22%20r%3D%2224%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%225%22%2F%3E%3Cpath%20d%3D%22m120%20151%209%207-3%2011h-12l-3-11zm-21%2013%2012%205%201%2013-10%207m39-25-12%205-1%2013%2010%207m-18%208v18%22%20fill%3D%22none%22%20stroke%3D%22%23fff%22%20stroke-width%3D%224%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E';
const MAP={
  '2022/23':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2021/22':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2020/21':{team:'La Esperanza',src:ROOT+'assets/official-logos/la-esperanza.png?v=20261003-v693'},
  '2019/20':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2018/19':{team:'Juventus',src:ROOT+'assets/official-logos/juventus.png?v=20261003-v693'},
  '2017/18':{team:'Tecos',src:TECOS_LOGO,fallback:TECOS_FALLBACK},
  '2016/17':{team:'Real DHP',src:REAL_DHP_LOGO},
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
  const src=window.LJR_SEASON_LOGOS?.get(data.team)||data.src;
  if(img.getAttribute('src')!==src)img.setAttribute('src',src);
  img.onerror=!window.LJR_SEASON_LOGOS?.get(data.team)&&data.fallback?function(){this.onerror=null;this.src=data.fallback}:null;
  img.alt=data.team;
  img.loading='eager';
  img.decoding='async';
  (crest.classList.contains('is-fallback')&&crest.classList.remove('is-fallback'));
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
    const src=window.LJR_SEASON_LOGOS?.get(data.team)||data.src;
  if(img.getAttribute('src')!==src)img.setAttribute('src',src);
    img.alt=data.team;
    img.loading='eager';
    img.decoding='async';
    (crest.classList.contains('is-fallback')&&crest.classList.remove('is-fallback'));
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