/* V249 — FORZADO FINAL: Terrícolas SEDER · 18 sep 2022
   Aplica la foto al nodo que realmente está visible en Historia > Campeones. */
(function(){
  if(window.__LJR_V249_TERRICOLAS_FORCE__) return;
  window.__LJR_V249_TERRICOLAS_FORCE__=true;

  const PHOTO=new URL('/App-liga-/assets/history/archive-v254/terricolas-seder-campeon-copa-18-sep-2022.webp?v=20260923-terricolas-hardfix-v255',location.origin).href;
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function installStyle(){
    if(document.getElementById('v249-terricolas-style')) return;
    const style=document.createElement('style');
    style.id='v249-terricolas-style';
    style.textContent=`
      .v249-terricolas-force{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#07075d!important;
        background-image:
          linear-gradient(180deg,rgba(3,6,50,.03) 0%,rgba(3,6,50,.08) 35%,rgba(3,6,50,.28) 70%,rgba(3,6,50,.72) 100%),
          linear-gradient(90deg,rgba(3,6,50,.15) 0%,rgba(3,6,50,.03) 74%,rgba(3,6,50,0) 100%),
          url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 42%!important;
        background-repeat:no-repeat!important;
      }
      .v249-terricolas-force > .v249-terricolas-photo{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        object-fit:cover!important;
        object-position:center 42%!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        z-index:0!important;
        pointer-events:none!important;
      }
      .v249-terricolas-force > .v249-terricolas-overlay{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:
          linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.06) 34%,rgba(2,5,45,.23) 70%,rgba(2,5,45,.60) 100%),
          linear-gradient(90deg,rgba(2,5,45,.13) 0%,rgba(2,5,45,.02) 74%,rgba(2,5,45,0) 100%)!important;
      }
      .v249-terricolas-force > :not(.v249-terricolas-photo):not(.v249-terricolas-overlay){
        position:relative!important;
        z-index:2!important;
      }
      .v249-terricolas-force .v35-history-moment-content,
      .v249-terricolas-force .v35-history-status,
      .v249-terricolas-force .v35-history-meta{
        background:transparent!important;
      }
    `;
    document.head.appendChild(style);
  }

  function isTarget(el){
    const t=norm(el.textContent);
    return t.includes('terricolas seder') &&
           t.includes('18 sep 2022') &&
           (t.includes('campeon de copa') || t.includes('segunda fuerza'));
  }

  function patchCard(card){
    if(!card || !isTarget(card)) return false;
    card.classList.add('v249-terricolas-force');
    card.style.setProperty('background-image',
      'linear-gradient(180deg,rgba(3,6,50,.03) 0%,rgba(3,6,50,.08) 35%,rgba(3,6,50,.28) 70%,rgba(3,6,50,.72) 100%),'+
      'linear-gradient(90deg,rgba(3,6,50,.15) 0%,rgba(3,6,50,.03) 74%,rgba(3,6,50,0) 100%),'+
      'url("'+PHOTO+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 42%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    let img=card.querySelector(':scope > .v249-terricolas-photo');
    if(!img){
      img=document.createElement('img');
      img.className='v249-terricolas-photo';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.loading='eager';
      img.decoding='async';
      card.prepend(img);
    }
    if(img.src!==PHOTO) img.src=PHOTO;

    let overlay=card.querySelector(':scope > .v249-terricolas-overlay');
    if(!overlay){
      overlay=document.createElement('span');
      overlay.className='v249-terricolas-overlay';
      overlay.setAttribute('aria-hidden','true');
      img.after(overlay);
    }

    // Any old generic photo is hidden so it cannot cover the exact image.
    card.querySelectorAll(':scope > .v35-history-bg-photo,:scope > .v120-exact-event-bg').forEach(old=>{
      if(old!==img) old.style.setProperty('display','none','important');
    });

    card.dataset.v249Terricolas='applied';
    return true;
  }

  function scan(){
    installStyle();
    const selectors=[
      '.v35-history-moment',
      '.v35-champion-card',
      '.v115-card',
      '[data-history-card]',
      'article'
    ];
    const seen=new Set();
    selectors.forEach(sel=>{
      document.querySelectorAll(sel).forEach(el=>{
        if(seen.has(el)) return;
        seen.add(el);
        patchCard(el);
      });
    });
  }

  let timer=0;
  const schedule=()=>{
    clearTimeout(timer);
    timer=setTimeout(scan,40);
  };

  const screen=document.getElementById('screen');
  if(screen) new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,characterData:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{ if(!document.hidden) schedule(); });

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',scan,{once:true});
  else scan();

  setTimeout(scan,150);
  setTimeout(scan,500);
  setTimeout(scan,1200);
  const interval=setInterval(scan,1800);
  setTimeout(()=>clearInterval(interval),30000);
})();