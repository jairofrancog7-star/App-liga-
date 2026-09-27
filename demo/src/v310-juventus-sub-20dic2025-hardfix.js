/* V310 — Juventus subcampeón · 20 dic 2025
   Fuerza la fotografía exacta aportada por el usuario como fondo del cuadro
   en Historia > Campeones sin modificar texto, fecha ni estructura. */
(function(){
  'use strict';
  if(window.__LJR_V310_JUVENTUS_SUB_20DEC2025__) return;
  window.__LJR_V310_JUVENTUS_SUB_20DEC2025__=true;

  const PHOTO='./assets/history/archive-v310/juventus-subcampeon-copa-20-dic-2025.webp?v=20260923-juventus-sub-photo-v310';
  function photo(){ return PHOTO; }
  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }
  function isTarget(card){
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    return heading.includes('juventus') && (date.includes('20 dic 2025') || norm(card.textContent).includes('20 dic 2025'));
  }
  function installStyle(){
    if(document.getElementById('v310-juventus-sub-style')) return;
    const s=document.createElement('style');
    s.id='v310-juventus-sub-style';
    s.textContent=`
      .v310-juventus-sub-card{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#060653!important;
        min-height:360px!important;
      }
      .v310-juventus-sub-card>.v310-juventus-sub-photo{
        position:absolute!important;
        inset:0!important;
        z-index:0!important;
        width:100%!important;
        height:100%!important;
        max-width:none!important;
        max-height:none!important;
        object-fit:cover!important;
        object-position:center 47%!important;
        display:block!important;
        opacity:1!important;
        visibility:visible!important;
        border:0!important;
        border-radius:inherit!important;
        pointer-events:none!important;
      }
      .v310-juventus-sub-card>.v310-juventus-sub-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:linear-gradient(180deg,rgba(2,5,45,.10) 0%,rgba(2,5,45,.20) 38%,rgba(2,5,45,.48) 70%,rgba(2,5,45,.78) 100%)!important;
      }
      .v310-juventus-sub-card>.v35-history-moment-content,
      .v310-juventus-sub-card>.v35-champion-content,
      .v115-card.v310-juventus-sub-card>.v115-card-body{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
      .v310-juventus-sub-card>.v120-exact-event-bg,
      .v310-juventus-sub-card>.v35-history-bg-photo,
      .v310-juventus-sub-card>.v35-champion-bg-photo{
        display:none!important;
      }
      .v310-juventus-sub-card h3,
      .v310-juventus-sub-card h4,
      .v310-juventus-sub-card strong,
      .v310-juventus-sub-card p,
      .v310-juventus-sub-card span,
      .v310-juventus-sub-card time{
        text-shadow:0 2px 5px rgba(0,0,0,.72);
      }
    `;
    document.head.appendChild(s);
  }
  function patch(card){
    if(!isTarget(card)) return;
    const src=photo();
    if(!src) return;
    installStyle();
    card.classList.add('v310-juventus-sub-card','v120-has-exact-bg','v120-photo-only-card');
    card.querySelectorAll(':scope > .v310-juventus-sub-photo,:scope > .v310-juventus-sub-shade').forEach(n=>n.remove());
    const img=document.createElement('img');
    img.className='v310-juventus-sub-photo';
    img.src=src;
    img.alt='Juventus · Subcampeón · Torneo de Copa · 20 dic 2025';
    img.loading='eager';
    img.decoding='async';
    card.prepend(img);
    const shade=document.createElement('span');
    shade.className='v310-juventus-sub-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);
    card.style.setProperty('background-image','linear-gradient(180deg,rgba(2,5,45,.10),rgba(2,5,45,.78)),url("'+src+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 47%','important');
    card.style.setProperty('background-repeat','no-repeat','important');
    card.dataset.v310JuventusSub='1';
  }
  function run(){
    if((location.hash||'').indexOf('history')<0) return;
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(patch);
  }
  let raf=0;
  function schedule(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){
      run();
      setTimeout(run,90);
      setTimeout(run,280);
      setTimeout(run,700);
    });
  }
  window.addEventListener('hashchange',schedule);
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-v35-tab]')) setTimeout(schedule,40);
  },true);
  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(schedule).observe(root,{childList:true,subtree:true});
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',schedule,{once:true});
  else schedule();
})();