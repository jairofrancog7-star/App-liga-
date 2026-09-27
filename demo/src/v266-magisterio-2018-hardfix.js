/* V266 — hardfix Magisterio campeón 09 jun 2018.
   Fuerza la fotografía real como fondo de la tarjeta en Historia > Campeones. */
(function(){
  'use strict';
  if(window.__LJR_V266_MAGISTERIO_2018__) return;
  window.__LJR_V266_MAGISTERIO_2018__=true;

  const PHOTO='./assets/history/archive-v266/magisterio-campeon-09-jun-2018.jpg?v=20260923-magisterio-hardfix-v266';

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }

  function installStyle(){
    if(document.getElementById('v266-magisterio-style')) return;
    const s=document.createElement('style');
    s.id='v266-magisterio-style';
    s.textContent=`
      .v266-magisterio-card{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        min-height:320px!important;
        background-color:#060653!important;
        background-image:linear-gradient(180deg,rgba(2,5,45,.05) 0%,rgba(2,5,45,.12) 36%,rgba(2,5,45,.38) 70%,rgba(2,5,45,.70) 100%),url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 46%!important;
        background-repeat:no-repeat!important;
      }
      .v266-magisterio-card>.v266-magisterio-photo{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        min-width:100%!important;
        min-height:100%!important;
        max-width:none!important;
        max-height:none!important;
        object-fit:cover!important;
        object-position:center 46%!important;
        transform:none!important;
        opacity:1!important;
        visibility:visible!important;
        display:block!important;
        z-index:0!important;
        border:0!important;
        border-radius:inherit!important;
        pointer-events:none!important;
      }
      .v266-magisterio-card>.v266-magisterio-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:linear-gradient(180deg,rgba(2,5,45,.02) 0%,rgba(2,5,45,.10) 34%,rgba(2,5,45,.35) 70%,rgba(2,5,45,.72) 100%)!important;
      }
      .v266-magisterio-card .v35-champion-content,
      .v266-magisterio-card .v35-history-moment-content,
      .v115-card.v266-magisterio-card .v115-card-body{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
      .v266-magisterio-card>.v120-exact-event-bg,
      .v266-magisterio-card>.v35-history-bg-photo,
      .v266-magisterio-card>.v35-champion-bg-photo{
        display:none!important;
      }
    `;
    document.head.appendChild(s);
  }

  function isTarget(card){
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    const all=norm(card.textContent||'');
    const hasTeam=heading.includes('magisterio') || all.includes('magisterio');
    const hasDate=date.includes('09 jun 2018') || all.includes('09 jun 2018') || all.includes('9 jun 2018');
    return hasTeam && hasDate;
  }

  function patchCard(card){
    if(!isTarget(card)) return;
    installStyle();
    card.classList.add('v266-magisterio-card','v120-has-exact-bg','v120-photo-only-card');

    card.querySelectorAll(':scope > .v266-magisterio-photo,:scope > .v266-magisterio-shade').forEach(n=>n.remove());

    const img=document.createElement('img');
    img.className='v266-magisterio-photo';
    img.src=PHOTO;
    img.alt='Magisterio · Campeón · 09 jun 2018';
    img.loading='eager';
    img.decoding='async';
    img.onerror=function(){ this.style.display='none'; };
    card.prepend(img);

    const shade=document.createElement('span');
    shade.className='v266-magisterio-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);

    card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,5,45,.05),rgba(2,5,45,.70)),url("'+PHOTO+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 46%','important');
    card.style.setProperty('background-repeat','no-repeat','important');
    card.dataset.v266Magisterio='1';
  }

  function run(){
    if((location.hash||'').indexOf('history')<0) return;
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(patchCard);
  }

  let raf=0;
  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){
      run();
      setTimeout(run,80);
      setTimeout(run,250);
    });
  }

  window.addEventListener('hashchange',schedule);
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-v35-tab]')) setTimeout(schedule,50);
  },true);

  const screen=document.querySelector('#screen');
  if(screen) new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){setTimeout(schedule,80)},{once:true});
  }else{
    setTimeout(schedule,80);
  }
})();