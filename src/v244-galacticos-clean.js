/* V244 — Galácticos de Pozos · Campeón de Campeones · 09 feb 2025.
   Corrige el fondo para que la foto cubra TODA la tarjeta sin corte gris ni imagen cacheada anterior. */
(function(){
  'use strict';
  if(window.__LJR_V244_GALACTICOS_CLEAN__) return;
  window.__LJR_V244_GALACTICOS_CLEAN__=true;

  const PHOTO='./assets/history/archive-v244/galacticos-campeon-campeones-09-feb-2025-clean.jpg?v=20260923-galacticos-clean-v244b';

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }
  function style(){
    if(document.getElementById('v244-galacticos-clean-style')) return;
    const s=document.createElement('style');
    s.id='v244-galacticos-clean-style';
    s.textContent=`
      .v244-galacticos-clean{
        position:relative!important;overflow:hidden!important;isolation:isolate!important;
        background-color:#060653!important;
        background-image:linear-gradient(180deg,rgba(3,7,55,.05),rgba(3,7,55,.55)),url("${PHOTO}")!important;
        background-size:cover!important;background-position:center 44%!important;background-repeat:no-repeat!important
      }
      .v244-galacticos-clean>.v244-galacticos-photo{
        position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
        min-width:100%!important;min-height:100%!important;max-width:none!important;max-height:none!important;
        object-fit:cover!important;object-position:center 44%!important;
        transform:none!important;filter:none!important;opacity:1!important;visibility:visible!important;
        display:block!important;z-index:0!important;border:0!important;border-radius:inherit!important
      }
      .v244-galacticos-clean>.v244-galacticos-shade{
        position:absolute!important;inset:0!important;z-index:1!important;pointer-events:none!important;
        background:linear-gradient(180deg,rgba(2,5,45,.04) 0%,rgba(2,5,45,.10) 35%,rgba(2,5,45,.26) 67%,rgba(2,5,45,.58) 100%)!important
      }
      .v244-galacticos-clean .v35-champion-content,
      .v244-galacticos-clean .v35-history-moment-content,
      .v115-card.v244-galacticos-clean .v115-card-body{
        position:relative!important;z-index:2!important;background:transparent!important;background-image:none!important
      }
      .v244-galacticos-clean .v120-exact-event-bg,
      .v244-galacticos-clean .v35-history-bg-photo,
      .v244-galacticos-clean .v35-champion-bg-photo{display:none!important}
    `;
    document.head.appendChild(s);
  }

  function patchCard(card){
    const heading=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    const all=norm(card.textContent||'');
    if(!heading.includes('galacticos de pozos') && !heading.includes('galacticos')) return;
    if(!(date.includes('09 feb 2025')||all.includes('09 feb 2025'))) return;

    style();
    card.classList.add('v244-galacticos-clean','v120-has-exact-bg','v120-photo-only-card');

    card.querySelectorAll(':scope > .v244-galacticos-photo,:scope > .v244-galacticos-shade').forEach(n=>n.remove());

    const img=document.createElement('img');
    img.className='v244-galacticos-photo';
    img.src=PHOTO;
    img.alt='Galácticos de Pozos · Campeón de Campeones · 09 feb 2025';
    img.loading='eager';
    img.decoding='async';
    card.prepend(img);

    const shade=document.createElement('span');
    shade.className='v244-galacticos-shade';
    shade.setAttribute('aria-hidden','true');
    card.insertBefore(shade,img.nextSibling);

    card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,7,55,.05),rgba(3,7,55,.55)),url("'+PHOTO+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 44%','important');
    card.style.setProperty('background-repeat','no-repeat','important');
  }

  function run(){
    if((location.hash||'').indexOf('history')<0) return;
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(patchCard);
  }

  let raf=0;
  const schedule=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{run();setTimeout(run,120)})};
  window.addEventListener('hashchange',schedule);
  document.addEventListener('click',e=>{if(e.target.closest('[data-v35-tab]'))setTimeout(run,80)},true);
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(run,120),{once:true});
  else setTimeout(run,120);
})();
