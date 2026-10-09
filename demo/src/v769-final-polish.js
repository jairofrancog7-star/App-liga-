/* V769 — hard final polish for the mobile blue app. */
(function(){
'use strict';
if(window.__LJR_V769_FINAL_POLISH__)return;
window.__LJR_V769_FINAL_POLISH__=true;

const CSS=`
@media(max-width:1023px){
  /* Global mobile topbar: smaller back/profile controls. */
  html body:not([data-app-route="home"]) #app>.topbar .back-button,
  html body:not([data-app-route="home"]) #app>.topbar .profile-button,
  html body:not([data-app-route="home"]) .app-shell>.topbar .back-button,
  html body:not([data-app-route="home"]) .app-shell>.topbar .profile-button{
    width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;
    max-width:28px!important;max-height:28px!important;padding:0!important;margin:0!important;
    border:0!important;border-radius:0!important;background-color:transparent!important;box-shadow:none!important;
    display:grid!important;place-items:center!important
  }
  html body:not([data-app-route="home"]) .topbar .back-button svg{
    width:21px!important;height:21px!important;stroke-width:1.9!important
  }
  html body:not([data-app-route="home"]) .topbar .profile-button{
    background-size:24px 24px!important;background-position:center!important;background-repeat:no-repeat!important
  }

  /* Historia custom header also uses the smaller arrow. */
  html body[data-app-route="history"] .v35-history-head .v35-back{
    width:28px!important;height:28px!important;min-width:28px!important;min-height:28px!important;
    padding:0!important;border:0!important;background:transparent!important
  }
  html body[data-app-route="history"] .v35-history-head .v35-back svg{
    width:22px!important;height:22px!important
  }

  /* Rankings: remove duplicated global bar, keep only Rankings de la Liga. */
  html body[data-app-route="rankings"] #app>.topbar,
  html body[data-app-route="rankings"] .app-shell>.topbar{
    display:none!important;visibility:hidden!important;opacity:0!important;height:0!important;
    min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;border:0!important
  }
  html body[data-app-route="rankings"] #screen{padding-top:0!important;margin-top:0!important}
  html body[data-app-route="rankings"] .v32-head{padding:8px 16px 0!important}
  html body[data-app-route="rankings"] .v32-head-row{min-height:52px!important}
  html body[data-app-route="rankings"] .v32-head-row h1{font-size:25px!important;margin:0!important}
  html body[data-app-route="rankings"] .v32-icon{width:30px!important;height:30px!important}
  html body[data-app-route="rankings"] .v32-icon svg{width:20px!important;height:20px!important}
  html body[data-app-route="rankings"] .v32-card{
    background:#0c116d!important;border-radius:18px!important;
    border:1px solid rgba(71,218,244,.13)!important;box-shadow:0 9px 22px rgba(0,0,46,.15)!important
  }
  html body[data-app-route="rankings"] .v32-fed-row,
  html body[data-app-route="rankings"] .v32-club-row,
  html body[data-app-route="rankings"] .v32-full-row{background:#0c116d!important}
  html body[data-app-route="rankings"] .v32-logo{
    width:42px!important;height:42px!important;min-width:42px!important;max-width:42px!important;
    min-height:42px!important;max-height:42px!important;aspect-ratio:1/1!important;border-radius:50%!important;
    overflow:hidden!important;display:grid!important;place-items:center!important;background:#10177b!important
  }
  html body[data-app-route="rankings"] .v32-logo img{
    width:35px!important;height:35px!important;max-width:35px!important;max-height:35px!important;
    object-fit:contain!important;object-position:50% 50%!important;margin:auto!important;transform:none!important
  }

  /* Performance/Home circles: exact circles with centered crest. */
  html body .v20-story-ring{
    width:72px!important;height:72px!important;min-width:72px!important;min-height:72px!important;
    max-width:72px!important;max-height:72px!important;aspect-ratio:1/1!important;border-radius:50%!important;
    display:grid!important;place-items:center!important;overflow:hidden!important;box-sizing:border-box!important
  }
  html body .v20-story-ring img{
    width:58px!important;height:58px!important;max-width:58px!important;max-height:58px!important;
    object-fit:contain!important;object-position:center!important;margin:auto!important;padding:0!important;
    border-radius:0!important;transform:none!important
  }
  html body .v20-card-logo{
    object-fit:contain!important;object-position:center!important
  }

  /* Historial: exact circular team badges and single unified navy background. */
  html body[data-app-route="historyLog"],
  html body[data-app-route="historyLog"] #app,
  html body[data-app-route="historyLog"] #screen,
  html body[data-app-route="historyLog"] .v164-history-page{
    background:#06075f!important
  }
  html body[data-app-route="historyLog"] .v164-history-head,
  html body[data-app-route="historyLog"] .v164-history-results{background:#0a0d6b!important}
  html body[data-app-route="historyLog"] .v164-history-match{background:#0a0d6b!important}
  html body[data-app-route="historyLog"] .v164-history-logo{
    width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;
    max-width:42px!important;max-height:42px!important;aspect-ratio:1/1!important;border-radius:50%!important;
    display:grid!important;place-items:center!important;overflow:hidden!important;background:#11177b!important
  }
  html body[data-app-route="historyLog"] .v164-history-logo img{
    width:35px!important;height:35px!important;max-width:35px!important;max-height:35px!important;
    object-fit:contain!important;object-position:center!important;margin:auto!important
  }
  html body[data-app-route="historyLog"] .v164-history-logo b{
    width:100%!important;height:100%!important;place-items:center!important;color:#58eaf2!important;font-size:9px!important
  }

  /* Statistics/Goals: no duplicated team logo; player block stays avatar/initials. */
  html body :is([data-app-route="stats"],[data-app-route="leagueData"],[data-app-route="v38Stats"]) .v444-stats-card{
    background:linear-gradient(180deg,#0a2aa9 0%,#0a147e 26%,#070a64 100%)!important
  }
  html body :is([data-app-route="stats"],[data-app-route="leagueData"],[data-app-route="v38Stats"]) .v444-stat-panel,
  html body :is([data-app-route="stats"],[data-app-route="leagueData"],[data-app-route="v38Stats"]) .v444-stats-tools,
  html body :is([data-app-route="stats"],[data-app-route="leagueData"],[data-app-route="v38Stats"]) .v444-stats-seg{
    background:#0b1c55!important
  }
  html body .v444-stat-row:not(.is-team){
    grid-template-columns:20px 43px 30px minmax(0,1fr) 28px!important
  }
  html body .v444-stat-row:not(.is-team)>.v444-stat-team-logo{
    display:grid!important;width:28px!important;height:28px!important;min-width:28px!important;
    min-height:28px!important;aspect-ratio:1/1!important;border-radius:50%!important;place-items:center!important;
    overflow:hidden!important
  }
  html body .v444-stat-row:not(.is-team)>.v444-stat-team-logo img{
    width:24px!important;height:24px!important;object-fit:contain!important;object-position:center!important;margin:auto!important
  }
  html body .v444-player-avatar{
    width:42px!important;height:42px!important;min-width:42px!important;min-height:42px!important;
    aspect-ratio:1/1!important;border-radius:50%!important;overflow:hidden!important;
    display:grid!important;place-items:center!important;background:#143887!important
  }
  html body .v444-player-avatar img{
    width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important
  }
  html body .v444-stat-team-main{
    width:38px!important;height:38px!important;aspect-ratio:1/1!important;border-radius:50%!important;
    display:grid!important;place-items:center!important;overflow:hidden!important
  }
  html body .v444-stat-team-main img{object-fit:contain!important;object-position:center!important;margin:auto!important}

  /* Historia appended access block: compact modern cards, no giant gaps. */
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"]{
    margin:10px 14px 12px!important;padding:12px!important;border-radius:20px!important;
    background:#0a0e70!important;border:1px solid rgba(50,225,242,.18)!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-head{
    margin:0 0 9px!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-head h2{
    font-size:18px!important;margin:3px 0!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-head p{
    font-size:9px!important;line-height:1.25!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-motion{
    min-height:105px!important;height:105px!important;margin:0 0 9px!important;border-radius:16px!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-motion-copy{
    min-height:105px!important;padding:12px!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-motion-copy b{font-size:17px!important}
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-motion-copy span{font-size:8.5px!important}
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-grid{
    grid-template-columns:1fr 1fr!important;gap:8px!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-card{
    min-height:72px!important;height:auto!important;padding:9px!important;border-radius:16px!important;
    grid-template-columns:30px minmax(0,1fr) 10px!important;gap:7px!important;
    background:linear-gradient(145deg,#111881,#0b116c)!important;
    border:1px solid rgba(51,225,242,.13)!important;box-shadow:0 7px 18px rgba(0,0,44,.13)!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-icon{
    width:30px!important;height:30px!important;border-radius:10px!important
  }
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-copy b{font-size:10.5px!important}
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-copy small{font-size:8px!important;margin-top:2px!important}
  html body[data-app-route="history"] #v105-bottom[data-v105-route="history"] .v105-footnote{display:none!important}

  /* Main Historia cards: tighter rhythm, same background. */
  html body[data-app-route="history"] .v35-history-page,
  html body[data-app-route="history"] [data-v35-content]{background:#06075f!important}
  html body[data-app-route="history"] .v35-history-page section{margin-bottom:10px!important}
  html body[data-app-route="history"] .v672-modern-card,
  html body[data-app-route="history"] .v35-final-row,
  html body[data-app-route="history"] .v35-record-card,
  html body[data-app-route="history"] .v35-stat-card{
    background:#0f1475!important;border-radius:18px!important;border:1px solid rgba(56,218,242,.13)!important;
    box-shadow:0 8px 20px rgba(0,0,48,.12)!important
  }

  /* About the League: modern compact blocks + animated timeline points. */
  html body[data-app-route="safe-about"] #screen,
  html body[data-app-route="safe-about"] .v33-about{background:#06075f!important}
  html body[data-app-route="safe-about"] .v33-about-board,
  html body[data-app-route="safe-about"] .v33-about-format-grid,
  html body[data-app-route="safe-about"] .v33-about-timeline{gap:8px!important;margin-top:10px!important}
  html body[data-app-route="safe-about"] .v33-about-board article,
  html body[data-app-route="safe-about"] .v33-about-format-grid article,
  html body[data-app-route="safe-about"] .v33-about-timeline article{
    background:#0f1475!important;border:1px solid rgba(55,223,242,.15)!important;border-radius:17px!important;
    box-shadow:0 8px 18px rgba(0,0,46,.12)!important
  }
  html body[data-app-route="safe-about"] .v33-about-timeline:before{
    width:2px!important;background:linear-gradient(#24e8f2,rgba(36,232,242,.14))!important;
    box-shadow:0 0 10px rgba(36,232,242,.22)!important
  }
  html body[data-app-route="safe-about"] .v33-about-timeline article:after{
    width:10px!important;height:10px!important;animation:v769Pulse 1.45s ease-in-out infinite!important
  }

  /* News chips stay small, responsive and tactile. */
  html body[data-app-route="news"] .v727-news-tabs{
    display:flex!important;gap:7px!important;overflow-x:auto!important;padding-bottom:2px!important
  }
  html body[data-app-route="news"] .v727-news-tabs .chip{
    flex:0 0 auto!important;min-height:38px!important;padding:0 17px!important;border-radius:21px!important;
    pointer-events:auto!important;touch-action:manipulation!important
  }
  html body[data-app-route="news"] [data-news-list]{display:grid!important;gap:9px!important}
  html body[data-app-route="news"] .news-row{
    margin:0!important;min-height:126px!important;padding:12px!important;border-radius:20px!important;
    background:#101475!important;border:1px solid rgba(72,216,244,.12)!important
  }

  /* Store: modern dark-blue catalog with tighter spacing. */
  html body[data-app-route="club-store"] #screen,
  html body[data-app-route="club-store"] .v431-store,
  html body[data-app-route="club-store"] .v431-block,
  html body[data-app-route="club-store"] .v437-product-detail{
    background:#06075f!important;color:#fff!important
  }
  html body[data-app-route="club-store"] .v431-store-head,
  html body[data-app-route="club-store"] .v435-store-head{
    background:linear-gradient(180deg,#1236cc,#0a1480)!important;
    border-bottom:1px solid rgba(78,226,244,.16)!important;box-shadow:0 8px 22px rgba(0,0,48,.18)!important
  }
  html body[data-app-route="club-store"] .v431-shop-tabs,
  html body[data-app-route="club-store"] .v435-shop-tabs{
    background:#0b0f70!important;border-bottom:1px solid rgba(74,221,242,.12)!important
  }
  html body[data-app-route="club-store"] .v431-shop-tabs button,
  html body[data-app-route="club-store"] .v435-shop-tabs button{
    background:transparent!important;color:#b8c3ea!important
  }
  html body[data-app-route="club-store"] .v431-shop-tabs button:first-child,
  html body[data-app-route="club-store"] .v435-shop-tabs button.active{
    color:#39e6f0!important;border-bottom-color:#39e6f0!important
  }
  html body[data-app-route="club-store"] .v431-hero{
    min-height:260px!important;padding:22px 16px 20px!important;
    background:radial-gradient(circle at 76% 20%,rgba(44,223,243,.18),transparent 27%),linear-gradient(145deg,#0a1d9c,#0a0e69 66%,#050641)!important
  }
  html body[data-app-route="club-store"] .v431-hero-shirt{height:205px!important;transform:rotate(-4deg) scale(.94)!important}
  html body[data-app-route="club-store"] .v431-block{padding:16px 12px 5px!important}
  html body[data-app-route="club-store"] .v431-products{gap:8px!important}
  html body[data-app-route="club-store"] .v431-product{
    padding:8px!important;border-radius:17px!important;background:#101577!important;color:#fff!important;
    border:1px solid rgba(55,222,242,.14)!important;box-shadow:0 9px 22px rgba(0,0,48,.16)!important
  }
  html body[data-app-route="club-store"] .v431-product-art{
    height:128px!important;border-radius:14px!important;background:linear-gradient(160deg,#17219b,#0d116c)!important
  }
  html body[data-app-route="club-store"] .v431-product h3{font-size:10px!important}
  html body[data-app-route="club-store"] .v431-product p,
  html body[data-app-route="club-store"] .v431-section-title small,
  html body[data-app-route="club-store"] .v431-story p{color:#aeb9e3!important}
  html body[data-app-route="club-store"] .v431-add,
  html body[data-app-route="club-store"] .v431-primary{
    background:linear-gradient(90deg,#20d9e8,#1b79f2)!important;color:#061158!important;
    font-weight:950!important
  }
  html body[data-app-route="club-store"] .v431-edition-card,
  html body[data-app-route="club-store"] .v431-custom-preview,
  html body[data-app-route="club-store"] .v431-story{
    border-radius:19px!important;border:1px solid rgba(55,222,242,.13)!important;
    box-shadow:0 9px 22px rgba(0,0,48,.14)!important
  }
}
@keyframes v769Pulse{
  0%,100%{transform:scale(.78);opacity:.58;box-shadow:0 0 0 3px rgba(36,232,242,.08),0 0 7px rgba(36,232,242,.18)}
  50%{transform:scale(1.2);opacity:1;box-shadow:0 0 0 6px rgba(36,232,242,.12),0 0 18px rgba(36,232,242,.62)}
}
@media(prefers-reduced-motion:reduce){
  html body[data-app-route="safe-about"] .v33-about-timeline article:after{animation:none!important}
}
`;

const style=document.createElement('style');
style.id='v769-final-polish-style';
style.textContent=CSS;
document.head.appendChild(style);

const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const stableCrest='./assets/reference/predictor-v36/liga-crest-white.webp';

function cleanHistory(){
  if(route()!=='history')return;
  document.querySelectorAll('.v35-history-sources,.v35-tagged-facebook').forEach(n=>n.remove());
  const kills=[
    'fuentes de temporadas anteriores',
    'personas que publicaban, etiquetaban o compartian tablas y roles',
    'videos 22-32-59 ya incorporados',
    'escudos e imagenes',
    'criterio de precision'
  ];
  document.querySelectorAll('#screen h2,#screen h3,#screen h4,#screen b,#screen strong').forEach(el=>{
    if(!(el instanceof HTMLElement))return;
    const t=norm(el.textContent);
    if(!kills.some(k=>t===k||t.startsWith(k+' ')))return;
    const card=el.closest('article,.v35-history-source-card,.v35-archive-method,.v672-modern-card');
    if(card){card.remove();return}
    const block=el.closest('.v35-history-sources,.v35-tagged-facebook');
    block?.remove();
  });
}

function repairStats(){
  document.querySelectorAll('.v444-stat-row:not(.is-team)').forEach(row=>{
    const avatar=row.querySelector('.v444-player-avatar');
    if(!avatar)return;
    if(avatar.classList.contains('v576-team-fallback')||avatar.dataset.v576TeamFallback==='1'){
      const name=row.querySelector('.v444-stat-person b')?.textContent||'J';
      const initials=name.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'J';
      avatar.innerHTML=initials;
      avatar.classList.remove('v576-has-photo','v576-team-fallback');
      avatar.removeAttribute('data-v576-team-fallback');
      avatar.removeAttribute('data-v576-photo');
    }
  });
}

function repairPerformance(){
  document.querySelectorAll('.v20-story-ring img,.v20-card-logo').forEach(img=>{
    if(!(img instanceof HTMLImageElement))return;
    const fix=()=>{img.src=stableCrest;img.removeAttribute('crossorigin')};
    if(img.complete&&img.naturalWidth===0)fix();
    img.addEventListener('error',fix,{once:true});
  });
}

function openPendingHistoryTab(){
  if(route()!=='history')return;
  let tab='';try{tab=sessionStorage.getItem('v105-history-tab')||''}catch(_){}
  if(!tab)return;
  const fire=()=>{
    const wanted=norm(tab);
    if(window.LJR_HISTORY_FAST_TAB){try{window.LJR_HISTORY_FAST_TAB(tab);sessionStorage.removeItem('v105-history-tab');return true}catch(_){}}
    const btn=[...document.querySelectorAll('[data-v35-tab],[data-history-tab]')].find(b=>norm(b.textContent).includes(wanted));
    if(btn){btn.click();try{sessionStorage.removeItem('v105-history-tab')}catch(_){};return true}
    return false;
  };
  fire()||setTimeout(fire,120)||setTimeout(fire,320);
}

function filterNews(label){
  if(route()!=='news')return;
  const wanted=norm(label||'Todas');
  document.querySelectorAll('[data-news-filter]').forEach(b=>{
    const on=norm(b.dataset.newsFilter)===wanted;
    b.classList.toggle('active',on);b.setAttribute('aria-selected',on?'true':'false');
  });
  const list=document.querySelector('[data-news-list]');
  if(!list)return;
  list.querySelector('.v769-news-empty')?.remove();
  const rows=[...list.querySelectorAll('.news-row')];
  let shown=0;
  rows.forEach(row=>{
    const meta=norm(row.querySelector('small')?.textContent||'');
    const title=norm(row.querySelector('b')?.textContent||'');
    const body=norm(row.querySelector('p')?.textContent||'');
    const all=meta+' '+title+' '+body;
    let show=wanted==='todas';
    if(wanted==='liga')show=/liga|jornada|torneo|copa/.test(all)&&!/plantilla|equipo|club|fichaj|alta|baja|transfer/.test(all);
    if(wanted==='equipos')show=/equipo|club|plantilla|clasificacion|san jose|juventus|linces/.test(all)&&!/fichaj|alta|baja|transfer/.test(all);
    if(wanted==='fichajes')show=/fichaj|alta|baja|refuerzo|transfer|movimiento/.test(all);
    row.hidden=!show;if(show)shown++;
  });
  if(!shown){
    const empty=document.createElement('div');
    empty.className='empty-state v769-news-empty';
    empty.innerHTML='<h2>Sin publicaciones en '+String(label||'esta sección').replace(/[<>]/g,'')+'</h2><p>Cuando haya novedades de esta sección aparecerán aquí.</p>';
    list.appendChild(empty);
  }
}

function patch(){
  cleanHistory();
  repairStats();
  repairPerformance();
  openPendingHistoryTab();
}

/* Noticias: permitir el onclick original de main.js, que actualiza state.newsFilter
   y reconstruye las noticias oficiales. El handler anterior bloqueaba ese evento
   y duplicaba los estados vacíos al cambiar a Fichajes. */

let timer=0;
function schedule(ms=50){clearTimeout(timer);timer=setTimeout(patch,ms)}
window.addEventListener('hashchange',()=>schedule(80));
window.addEventListener('load',()=>schedule(120));
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(()=>schedule(60)).observe(screen,{childList:true,subtree:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>schedule(10),{once:true});else schedule(0);
setTimeout(()=>schedule(0),500);setTimeout(()=>schedule(0),1500);
})();