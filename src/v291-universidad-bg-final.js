/* V291 — Universidad campeón de Veteranos · 09 mar 2013.
   Hard-fix final: fuerza la foto real detrás del texto y también inserta un <img>
   absoluto para evitar que cualquier shorthand/background global vuelva a taparla. */
(function(){
  'use strict';
  if(window.__LJR_V291_UNIVERSIDAD_BG__) return;
  window.__LJR_V291_UNIVERSIDAD_BG__=true;

  const PHOTO='./assets/history/archive-v291/universidad-campeon-veteranos-09-mar-2013.webp?v=20260923-universidad-final-v291';

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }

  function addStyle(){
    if(document.getElementById('v291-universidad-bg-style')) return;
    const s=document.createElement('style');
    s.id='v291-universidad-bg-style';
    s.textContent=`
      .v291-universidad-bg-final{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#07106f!important;
        background-image:url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 46%!important;
        background-repeat:no-repeat!important;
      }
      .v291-universidad-bg-final::before,
      .v291-universidad-bg-final::after{display:none!important}
      .v291-universidad-bg-final>.v291-universidad-bg-img{
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
        object-position:center 46%!important;
        filter:none!important;
        transform:none!important;
        z-index:0!important;
        pointer-events:none!important;
      }
      .v291-universidad-bg-final>.v291-universidad-overlay{
        display:block!important;
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        border-radius:inherit!important;
        background:
          linear-gradient(180deg,rgba(2,7,55,.04) 0%,rgba(2,7,55,.14) 35%,rgba(2,7,55,.56) 72%,rgba(2,7,55,.84) 100%),
          linear-gradient(90deg,rgba(2,7,55,.30),rgba(2,7,55,.02))!important;
      }
      .v291-universidad-bg-final>.v264-universidad-photo,
      .v291-universidad-bg-final>.v35-history-bg-photo,
      .v291-universidad-bg-final>.v35-champion-bg-photo,
      .v291-universidad-bg-final>.v120-exact-event-bg,
      .v291-universidad-bg-final>.v35-history-moment-shade,
      .v291-universidad-bg-final>.v35-champion-shade,
      .v291-universidad-bg-final>.v289-universidad-bg,
      .v291-universidad-bg-final>.v289-universidad-overlay{
        display:none!important;
      }
      .v291-universidad-bg-final .v35-history-moment-content,
      .v291-universidad-bg-final .v35-champion-content,
      .v291-universidad-bg-final .v115-card-body{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
    `;
    document.head.appendChild(s);
  }

  function isTarget(card){
    if(!card) return false;
    const title=norm(card.querySelector('h3,h4')?.textContent||'');
    const txt=norm(card.textContent||'');
    return title==='universidad' && txt.includes('09 mar 2013') && txt.includes('campeon');
  }

  function patch(card){
    if(!isTarget(card)) return false;
    addStyle();
    card.classList.add('v291-universidad-bg-final');
    card.dataset.v291Universidad='1';

    card.style.setProperty('position','relative','important');
    card.style.setProperty('overflow','hidden','important');
    card.style.setProperty('isolation','isolate','important');
    card.style.setProperty('background-color','#07106f','important');
    card.style.setProperty('background-image','url("'+PHOTO+'")','important');
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 46%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    card.querySelectorAll(':scope > .v291-universidad-bg-img,:scope > .v291-universidad-overlay').forEach(n=>n.remove());

    const img=document.createElement('img');
    img.className='v291-universidad-bg-img';
    img.src=PHOTO;
    img.alt='Universidad · Campeón de Veteranos · 09 mar 2013';
    img.loading='eager';
    img.decoding='sync';
    img.fetchPriority='high';
    img.style.setProperty('display','block','important');
    img.style.setProperty('visibility','visible','important');
    img.style.setProperty('opacity','1','important');
    img.style.setProperty('position','absolute','important');
    img.style.setProperty('inset','0','important');
    img.style.setProperty('width','100%','important');
    img.style.setProperty('height','100%','important');
    img.style.setProperty('object-fit','cover','important');
    img.style.setProperty('object-position','center 46%','important');
    img.style.setProperty('z-index','0','important');

    const overlay=document.createElement('span');
    overlay.className='v291-universidad-overlay';
    overlay.setAttribute('aria-hidden','true');

    card.prepend(overlay);
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

  let t=0;
  function schedule(ms=0){
    clearTimeout(t);
    t=setTimeout(function(){
      run();
      setTimeout(run,60);
      setTimeout(run,180);
      setTimeout(run,500);
      setTimeout(run,1200);
    },ms);
  }

  window.addEventListener('hashchange',()=>schedule(20));
  window.addEventListener('popstate',()=>schedule(20));
  window.addEventListener('load',()=>schedule(20),{once:true});
  document.addEventListener('click',()=>schedule(40),true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(20)).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(30),{once:true});
  }else{
    schedule(30);
  }
})();