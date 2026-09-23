/* V237 — fuerza la foto exacta enviada por el usuario en
   Historia > Campeones > Manchester · 09 nov 2024. */
(function(){
  'use strict';

  const PHOTO = './assets/history/archive-v237/manchester-campeon-copa-v50-09-nov-2024.webp?v=20260923-v237';

  function norm(v){
    return String(v||'')
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .toLowerCase().replace(/\s+/g,' ').trim();
  }

  function isManchester2024(card){
    const text = norm(card.textContent);
    const title = norm(card.querySelector('h1,h2,h3,h4,strong,b')?.textContent || '');
    return (title.includes('manchester') || text.includes('manchester')) &&
           (text.includes('09 nov 2024') || text.includes('9 nov 2024') ||
            text.includes('09 noviembre 2024') || text.includes('9 noviembre 2024'));
  }

  function installCss(){
    if(document.getElementById('v237-manchester-bg-css')) return;
    const s = document.createElement('style');
    s.id = 'v237-manchester-bg-css';
    s.textContent = `
      .v237-manchester-bg{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#07106d!important;
        background-image:
          linear-gradient(180deg,rgba(3,7,58,.12) 0%,rgba(3,7,58,.20) 45%,rgba(3,7,58,.68) 100%),
          url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center center!important;
        background-repeat:no-repeat!important;
      }
      .v237-manchester-bg::after{
        content:""!important;
        position:absolute!important;
        inset:0!important;
        z-index:0!important;
        pointer-events:none!important;
        background:linear-gradient(90deg,rgba(2,5,45,.10),rgba(2,5,45,0) 70%)!important;
      }
      .v237-manchester-bg > *{
        position:relative!important;
        z-index:2!important;
      }
      .v237-manchester-bg .v120-exact-event-bg,
      .v237-manchester-bg .v35-history-bg-photo,
      .v237-manchester-bg .v35-champion-bg-photo{
        display:none!important;
      }
    `;
    document.head.appendChild(s);
  }

  function apply(){
    if((location.hash||'').indexOf('history') < 0) return;
    installCss();

    const cards = document.querySelectorAll(
      '.v35-history-moment,.v35-champion-card,.v115-card,[class*="champion"],[class*="history"]'
    );

    cards.forEach(card=>{
      if(!isManchester2024(card)) return;

      card.classList.add('v237-manchester-bg');
      card.dataset.v237ManchesterBg = '1';

      // Inline !important como respaldo ante estilos de versiones anteriores.
      card.style.setProperty(
        'background-image',
        'linear-gradient(180deg,rgba(3,7,58,.12) 0%,rgba(3,7,58,.20) 45%,rgba(3,7,58,.68) 100%),url("'+PHOTO+'")',
        'important'
      );
      card.style.setProperty('background-size','cover','important');
      card.style.setProperty('background-position','center center','important');
      card.style.setProperty('background-repeat','no-repeat','important');
      card.style.setProperty('background-color','#07106d','important');
    });
  }

  let timer;
  function schedule(){
    clearTimeout(timer);
    timer = setTimeout(apply, 30);
  }

  window.addEventListener('hashchange', schedule);
  document.addEventListener('click', schedule, true);

  const root = document.querySelector('#screen') || document.body;
  if(root) new MutationObserver(schedule).observe(root,{childList:true,subtree:true});

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', ()=>setTimeout(apply,80), {once:true});
  } else {
    setTimeout(apply,80);
  }
  setTimeout(apply,400);
  setTimeout(apply,1200);
})();