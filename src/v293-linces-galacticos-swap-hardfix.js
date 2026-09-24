/* V293 — swap definitivo de fondos: Linces / Galácticos · 15 mar 2026.
   La foto que estaba en Galácticos pasa a Linces y la de Linces pasa a Galácticos.
   Se aplica al final para impedir que otro renderer vuelva a ponerlas como antes. */
(function(){
  'use strict';
  if(window.__LJR_V293_SWAP_15032026__) return;
  window.__LJR_V293_SWAP_15032026__=true;

  const LINCES_PHOTO='./assets/history/archive-v132/galacticos-subcampeon-primera-2026.jpg?v=20260924-swap-final-v293';
  const GALACTICOS_PHOTO='./assets/history/archive-v132/linces-campeon-primera-2026.jpg?v=20260924-swap-final-v293';

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }

  function addStyle(){
    if(document.getElementById('v293-swap-style')) return;
    const s=document.createElement('style');
    s.id='v293-swap-style';
    s.textContent=`
      .v293-swapped-15032026{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
      }
      .v293-swapped-15032026::before,
      .v293-swapped-15032026::after{display:none!important}
      .v293-swapped-15032026>.v293-swap-bg{
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        min-width:100%!important;
        min-height:100%!important;
        max-width:none!important;
        max-height:none!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:inherit!important;
        object-fit:cover!important;
        object-position:center 45%!important;
        filter:none!important;
        transform:none!important;
        z-index:0!important;
        pointer-events:none!important;
      }
      .v293-swapped-15032026>.v293-swap-shade{
        display:block!important;
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        border-radius:inherit!important;
        background:
          linear-gradient(180deg,rgba(2,6,48,.05) 0%,rgba(2,6,48,.14) 36%,rgba(2,6,48,.54) 74%,rgba(2,6,48,.82) 100%),
          linear-gradient(90deg,rgba(2,6,48,.28),rgba(2,6,48,.02))!important;
      }
      .v293-swapped-15032026>.v120-exact-event-bg,
      .v293-swapped-15032026>.v35-history-bg-photo,
      .v293-swapped-15032026>.v35-champion-bg-photo,
      .v293-swapped-15032026>.v35-history-moment-shade,
      .v293-swapped-15032026>.v35-champion-shade{
        display:none!important;
      }
      .v293-swapped-15032026 .v35-history-moment-content,
      .v293-swapped-15032026 .v35-champion-content,
      .v293-swapped-15032026 .v115-card-body{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
    `;
    document.head.appendChild(s);
  }

  function identify(card){
    const title=norm(card.querySelector('h3,h4')?.textContent||'');
    const date=norm(card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date')?.textContent||'');
    const all=norm(card.textContent||'');
    const isDate=date.includes('15 mar 2026')||all.includes('15 mar 2026');
    if(!isDate) return null;
    if(title==='linces'||title.includes('linces')) return {photo:LINCES_PHOTO,key:'linces'};
    if(title==='galacticos'||title.includes('galacticos')) return {photo:GALACTICOS_PHOTO,key:'galacticos'};
    return null;
  }

  function patch(card){
    const hit=identify(card);
    if(!hit) return false;

    addStyle();
    card.classList.add('v293-swapped-15032026');
    card.dataset.v293Swap=hit.key;

    card.style.setProperty('position','relative','important');
    card.style.setProperty('overflow','hidden','important');
    card.style.setProperty('isolation','isolate','important');
    card.style.setProperty('background-image','url("'+hit.photo+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 45%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    card.querySelectorAll(':scope > .v293-swap-bg,:scope > .v293-swap-shade').forEach(n=>n.remove());

    const img=document.createElement('img');
    img.className='v293-swap-bg';
    img.src=hit.photo;
    img.alt=hit.key==='linces'?'Linces · 15 mar 2026':'Galácticos · 15 mar 2026';
    img.loading='eager';
    img.decoding='async';
    img.fetchPriority='high';

    const shade=document.createElement('span');
    shade.className='v293-swap-shade';
    shade.setAttribute('aria-hidden','true');

    card.prepend(shade);
    card.prepend(img);

    const content=card.querySelector('.v35-history-moment-content,.v35-champion-content,.v115-card-body');
    if(content){
      content.style.setProperty('position','relative','important');
      content.style.setProperty('z-index','2','important');
      content.style.setProperty('background','transparent','important');
      content.style.setProperty('background-image','none','important');
    }
    return true;
  }

  function run(){
    if(!String(location.hash||'').toLowerCase().includes('history')) return;
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,article').forEach(patch);
  }

  let timer=0;
  function schedule(ms=0){
    clearTimeout(timer);
    timer=setTimeout(function(){
      run();
      setTimeout(run,80);
      setTimeout(run,250);
      setTimeout(run,700);
      setTimeout(run,1500);
    },ms);
  }

  window.addEventListener('hashchange',()=>schedule(20));
  window.addEventListener('popstate',()=>schedule(20));
  window.addEventListener('load',()=>schedule(20),{once:true});
  document.addEventListener('click',()=>schedule(50),true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(25)).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(40),{once:true});
  }else{
    schedule(40);
  }
})();