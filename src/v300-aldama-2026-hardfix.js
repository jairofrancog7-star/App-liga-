/* V300 — Aldama FC · Subcampeón Segunda Fuerza · 07 jun 2026.
   Fuerza la foto correcta aportada por el usuario como fondo del cuadro en Historia. */
(function(){
  'use strict';
  if(window.__LJR_V300_ALDAMA_2026__) return;
  window.__LJR_V300_ALDAMA_2026__=true;

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }
  function photo(){ return window.LJR_ALDAMA_2026_PHOTO||''; }

  function installStyle(){
    if(document.getElementById('v300-aldama-2026-style')) return;
    const s=document.createElement('style');
    s.id='v300-aldama-2026-style';
    s.textContent=`
      .v300-aldama-2026-card{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#07075d!important;
        background-size:cover!important;
        background-position:center 44%!important;
        background-repeat:no-repeat!important;
      }
      .v300-aldama-2026-card>.v300-aldama-bg{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        min-width:100%!important;
        min-height:100%!important;
        max-width:none!important;
        max-height:none!important;
        object-fit:cover!important;
        object-position:center 44%!important;
        display:block!important;
        opacity:1!important;
        visibility:visible!important;
        z-index:0!important;
        margin:0!important;
        border:0!important;
        border-radius:inherit!important;
        pointer-events:none!important;
      }
      .v300-aldama-2026-card>.v300-aldama-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:linear-gradient(180deg,rgba(4,7,45,.03) 0%,rgba(4,7,45,.12) 38%,rgba(4,7,45,.45) 72%,rgba(4,7,45,.82) 100%)!important;
      }
      .v300-aldama-2026-card>.v35-history-moment-content,
      .v300-aldama-2026-card>.v35-champion-content,
      .v300-aldama-2026-card>.v115-card-body{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
      .v300-aldama-2026-card .v35-history-kind,
      .v300-aldama-2026-card .v35-history-date,
      .v300-aldama-2026-card h3,
      .v300-aldama-2026-card h4,
      .v300-aldama-2026-card strong,
      .v300-aldama-2026-card b,
      .v300-aldama-2026-card p,
      .v300-aldama-2026-card span,
      .v300-aldama-2026-card time{
        text-shadow:0 2px 5px rgba(0,0,0,.82);
      }
    `;
    document.head.appendChild(s);
  }

  function isTarget(card){
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const all=norm(card.textContent||'');
    return heading==='aldama fc' && (all.includes('07 jun 2026')||all.includes('7 jun 2026'));
  }

  function patch(card){
    if(!isTarget(card)) return;
    const src=photo();
    if(!src) return;
    installStyle();

    card.classList.add('v300-aldama-2026-card');
    card.querySelectorAll(':scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo,:scope > .v120-exact-event-bg,:scope > .v300-aldama-bg,:scope > .v300-aldama-shade').forEach(n=>n.remove());

    const img=document.createElement('img');
    img.className='v300-aldama-bg';
    img.src=src;
    img.alt='Aldama FC · Subcampeón Segunda Fuerza · 07 jun 2026';
    img.loading='eager';
    img.decoding='async';
    card.prepend(img);

    const sh=document.createElement('span');
    sh.className='v300-aldama-shade';
    sh.setAttribute('aria-hidden','true');
    card.insertBefore(sh,img.nextSibling);

    card.style.setProperty('background-image','linear-gradient(180deg,rgba(4,7,45,.03),rgba(4,7,45,.82)),url("'+src+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 44%','important');
    card.style.setProperty('background-repeat','no-repeat','important');
    card.dataset.v300Aldama='1';
  }

  function run(){
    if((location.hash||'').indexOf('history')<0) return;
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(patch);
  }

  let timer=0;
  function schedule(delay){
    clearTimeout(timer);
    timer=setTimeout(function(){
      run();
      setTimeout(run,80);
      setTimeout(run,250);
      setTimeout(run,700);
    },delay||0);
  }

  window.addEventListener('hashchange',()=>schedule(30));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(60);
  },true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(40)).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(70),{once:true});
  }else schedule(70);
})();