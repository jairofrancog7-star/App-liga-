/* V250 — La Esperanza · 22 jun 2019 · fondo exacto aportado por el usuario */
(function(){
  if(window.__LJR_V250_ESPERANZA_2019__) return;
  window.__LJR_V250_ESPERANZA_2019__=true;

  const PHOTO=new URL('./assets/history/archive-v250/la-esperanza-campeon-campeones-veteranos-22-jun-2019.webp?v=20260923-esperanza-2019-bg-v250',document.baseURI).href;
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function isTarget(card){
    const t=norm(card.textContent);
    return t.includes('la esperanza') &&
           t.includes('22 jun 2019') &&
           t.includes('campeon de campeones') &&
           t.includes('veteranos');
  }

  function ensureStyle(){
    if(document.getElementById('v250-esperanza-2019-style')) return;
    const style=document.createElement('style');
    style.id='v250-esperanza-2019-style';
    style.textContent=`
      .v250-esperanza-2019{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#07075d!important;
        background-image:
          linear-gradient(180deg,rgba(3,6,50,.025) 0%,rgba(3,6,50,.07) 34%,rgba(3,6,50,.26) 70%,rgba(3,6,50,.70) 100%),
          linear-gradient(90deg,rgba(3,6,50,.14) 0%,rgba(3,6,50,.025) 74%,rgba(3,6,50,0) 100%),
          url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 43%!important;
        background-repeat:no-repeat!important;
      }
      .v250-esperanza-2019 > .v250-esperanza-2019-photo{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        object-fit:cover!important;
        object-position:center 43%!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        z-index:0!important;
        pointer-events:none!important;
        border:0!important;
        margin:0!important;
        padding:0!important;
        filter:saturate(1.03) contrast(1.02) brightness(.96)!important;
      }
      .v250-esperanza-2019 > .v250-esperanza-2019-overlay{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:
          linear-gradient(180deg,rgba(2,5,45,.01) 0%,rgba(2,5,45,.04) 34%,rgba(2,5,45,.21) 68%,rgba(2,5,45,.60) 100%),
          linear-gradient(90deg,rgba(2,5,45,.12) 0%,rgba(2,5,45,.02) 74%,rgba(2,5,45,0) 100%)!important;
      }
      .v250-esperanza-2019 > :not(.v250-esperanza-2019-photo):not(.v250-esperanza-2019-overlay){
        position:relative!important;
        z-index:2!important;
      }
      .v250-esperanza-2019 .v35-history-moment-content,
      .v250-esperanza-2019 .v35-history-status,
      .v250-esperanza-2019 .v35-history-meta{
        background:transparent!important;
      }
    `;
    document.head.appendChild(style);
  }

  function patch(card){
    if(!card || !isTarget(card)) return false;
    ensureStyle();
    card.classList.add('v250-esperanza-2019');

    // Inline hard fallback as well as CSS class.
    card.style.setProperty('background-image',
      'linear-gradient(180deg,rgba(3,6,50,.025) 0%,rgba(3,6,50,.07) 34%,rgba(3,6,50,.26) 70%,rgba(3,6,50,.70) 100%),'+
      'linear-gradient(90deg,rgba(3,6,50,.14) 0%,rgba(3,6,50,.025) 74%,rgba(3,6,50,0) 100%),'+
      'url("'+PHOTO+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 43%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    let img=card.querySelector(':scope > .v250-esperanza-2019-photo');
    if(!img){
      img=document.createElement('img');
      img.className='v250-esperanza-2019-photo';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.loading='eager';
      img.decoding='async';
      card.prepend(img);
    }
    if(img.src!==PHOTO) img.src=PHOTO;

    let overlay=card.querySelector(':scope > .v250-esperanza-2019-overlay');
    if(!overlay){
      overlay=document.createElement('span');
      overlay.className='v250-esperanza-2019-overlay';
      overlay.setAttribute('aria-hidden','true');
      img.after(overlay);
    }

    // Hide only old generic background photos that might sit above the requested one.
    card.querySelectorAll(':scope > .v35-history-bg-photo,:scope > .v120-exact-event-bg').forEach(old=>{
      if(old!==img) old.style.setProperty('display','none','important');
    });

    card.dataset.v250Esperanza2019='applied';
    return true;
  }

  function scan(){
    ensureStyle();
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,[data-history-card],article').forEach(patch);
  }

  let timer=0;
  const schedule=()=>{ clearTimeout(timer); timer=setTimeout(scan,45); };
  const screen=document.getElementById('screen');
  if(screen) new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,characterData:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) schedule(); });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scan,{once:true});
  else scan();
  setTimeout(scan,120);
  setTimeout(scan,450);
  setTimeout(scan,1000);
  setTimeout(scan,2200);
})();