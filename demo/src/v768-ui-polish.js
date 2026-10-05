/* V768 — refuerzo funcional y limpieza visual sin reescribir datos oficiales. */
(function(){
'use strict';
if(window.__LJR_V768_UI_POLISH__)return;
window.__LJR_V768_UI_POLISH__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

function removeIrrelevantHistory(){
  if(route()!=='history')return;
  document.querySelectorAll('.v35-history-sources,.v35-tagged-facebook').forEach(n=>n.remove());
  document.querySelectorAll('#screen section').forEach(section=>{
    const t=norm(section.textContent);
    if(t.includes('fuentes de temporadas anteriores') ||
       t.includes('personas que publicaban, etiquetaban o compartian tablas y roles')){
      section.remove();
    }
  });
}

function dedupeScorerLogos(){
  if(route()!=='scorers')return;
  document.querySelectorAll('.v28-team-logo').forEach(holder=>{
    const imgs=[...holder.querySelectorAll('img')];
    imgs.slice(1).forEach(img=>img.remove());
    let next=holder.nextElementSibling;
    while(next&&next.classList?.contains('v28-team-logo')){
      const doomed=next;next=next.nextElementSibling;doomed.remove();
    }
  });
}

function centerLogos(){
  if(!['rankings','scorers','club-store'].includes(route()))return;
  document.querySelectorAll('.v32-logo img,.v28-team-logo img,.v66-team-logo img').forEach(img=>{
    img.style.setProperty('object-fit','contain','important');
    img.style.setProperty('object-position','50% 50%','important');
  });
}

function fallbackNewsFilter(label){
  if(route()!=='news')return;
  const buttons=[...document.querySelectorAll('[data-news-filter]')];
  buttons.forEach(b=>{
    const active=norm(b.dataset.newsFilter)===norm(label);
    b.classList.toggle('active',active);
    b.setAttribute('aria-selected',active?'true':'false');
  });
  const rows=[...document.querySelectorAll('[data-news-list] .news-row')];
  if(!rows.length)return;
  const wanted=norm(label);
  rows.forEach(row=>{
    if(wanted==='todas'){row.hidden=false;return}
    const meta=norm(row.querySelector('small')?.textContent||'');
    const title=norm(row.querySelector('b')?.textContent||'');
    const body=norm(row.querySelector('p')?.textContent||'');
    const all=meta+' '+title+' '+body;
    let show=false;
    if(wanted==='fichajes')show=/fichaj|alta|baja|refuerzo|transfer/.test(all);
    else if(wanted==='equipos')show=/equipo|club|plantilla/.test(all);
    else if(wanted==='liga')show=!/fichaj|alta|baja|refuerzo|transfer/.test(all)&&!/\bequipo(s)?\b|\bclub(es)?\b|plantilla/.test(all);
    row.hidden=!show;
  });
}

function activateHistoryChampions(){
  const fire=()=>{
    if(route()!=='history')return;
    const tab=[...document.querySelectorAll('[data-v35-tab]')].find(b=>norm(b.textContent).includes('campeones'));
    if(window.LJR_HISTORY_FAST_TAB){window.LJR_HISTORY_FAST_TAB('Campeones');return}
    tab?.click?.();
  };
  if(route()==='history'){fire();return}
  location.hash='#/history';
  setTimeout(fire,80);setTimeout(fire,260);
}

function reinforceHistoryButtons(){
  if(route()!=='history')return;
  document.querySelectorAll(
    '[data-v35-tab],[data-v35-season],[data-v35-era-team],[data-v340-champion-cat],'+
    '[data-v674-details],[data-v731-history-details],[data-v329-details],[data-v330-details],'+
    '[data-v355-final-detail],[data-v358-details]'
  ).forEach(btn=>{
    if(btn.tagName==='BUTTON')btn.type='button';
    btn.style.setProperty('pointer-events','auto','important');
    btn.style.setProperty('touch-action','manipulation','important');
  });
}

function patch(){
  removeIrrelevantHistory();
  dedupeScorerLogos();
  centerLogos();
  reinforceHistoryButtons();
}

let raf=0;
function schedule(){
  cancelAnimationFrame(raf);
  raf=requestAnimationFrame(()=>requestAnimationFrame(patch));
}

document.addEventListener('click',e=>{
  if(!(e.target instanceof Element))return;

  const news=e.target.closest('[data-news-filter]');
  if(news&&route()==='news'){
    const label=news.dataset.newsFilter||'Todas';
    setTimeout(()=>fallbackNewsFilter(label),30);
    setTimeout(()=>fallbackNewsFilter(label),140);
    return;
  }

  const candidate=e.target.closest('button,a,[role="button"]');
  if(candidate){
    const t=norm(candidate.textContent);
    if(t==='palmares'||t==='palmarés'||t.includes('ver historia, campeones, finales y records')||t.includes('ver historia, campeones, finales y récords')){
      e.preventDefault();
      activateHistoryChampions();
      return;
    }
  }

  const detail=e.target.closest('[data-v674-details],[data-v731-history-details]');
  if(detail&&route()==='history'){
    const card=detail.closest('.v672-modern-card,.v731-history-card,.v674-source-card,.v35-record-card,.v35-stat-card,.v35-final-row');
    if(card){
      setTimeout(()=>{
        if(!detail.hasAttribute('aria-expanded'))return;
        const expanded=detail.getAttribute('aria-expanded')==='true';
        card.classList.toggle('is-v768-open',expanded);
      },20);
    }
  }
},true);

window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
})();