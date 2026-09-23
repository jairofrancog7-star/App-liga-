/* V284 — Tecos campeón de Liga · 15 jun 2018.
   Parche tardío para sustituir cualquier tarjeta antigua que todavía muestre
   "Fecha exacta pendiente / Temporada por confirmar" en Historia > Campeones. */
(function(){
  'use strict';
  if(window.__LJR_V284_TECOS_2018__) return;
  window.__LJR_V284_TECOS_2018__=true;

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }

  function isTecosCard(card){
    if(!card) return false;
    const title=norm(card.querySelector('h3,h4')?.textContent||'');
    const all=norm(card.textContent||'');
    const bg=String(card.querySelector('img')?.getAttribute('src')||'').toLowerCase();
    return title==='tecos' && (
      all.includes('campeon') ||
      bg.includes('tecos-campeon-historico')
    );
  }

  function patch(card){
    if(!isTecosCard(card)) return false;

    card.dataset.v284Tecos2018='1';

    const time=card.querySelector('time,.v35-history-date,.v35-champion-date,.v115-date');
    if(time){
      time.textContent='15 jun 2018';
      time.setAttribute('datetime','2018-06-15');
    }

    const content=card.querySelector('.v35-history-moment-content,.v35-champion-content,.v115-card-body')||card;
    const title=content.querySelector('h3,h4');
    if(title) title.textContent='Tecos';

    let subtitle=content.querySelector(':scope > strong');
    if(!subtitle) subtitle=content.querySelector('strong');
    if(subtitle) subtitle.textContent='Campeón · Torneo de Liga';

    let status=content.querySelector('.v35-history-status');
    if(!status){
      status=document.createElement('div');
      status.className='v35-history-status';
      const p=content.querySelector('p');
      if(p) content.insertBefore(status,p); else content.appendChild(status);
    }
    status.innerHTML='<span><b>Ganador</b>Tecos</span><span><b>Temporada</b>2018</span>';

    const p=content.querySelector(':scope > p')||content.querySelector('p');
    if(p) p.textContent='Tecos fue campeón del Torneo de Liga el 15 de junio de 2018. La fotografía muestra al plantel campeón con el trofeo.';

    const img=card.querySelector('.v35-history-bg-photo,.v35-champion-bg-photo,.v120-exact-event-bg,img');
    if(img){
      img.alt='Tecos · Campeón del Torneo de Liga · 15 jun 2018';
    }

    return true;
  }

  function run(){
    if((location.hash||'').indexOf('history')<0) return;
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card,[data-history-card],article').forEach(patch);
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

  window.addEventListener('hashchange',function(){schedule(20)});
  document.addEventListener('click',function(e){
    if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(50);
  },true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(function(){schedule(25)}).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',function(){schedule(40)},{once:true});
  }else{
    schedule(40);
  }
})();