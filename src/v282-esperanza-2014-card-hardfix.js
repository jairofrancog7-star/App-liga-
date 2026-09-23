/* V282 — restore La Esperanza · Campeón de Copa Veteranos · 14 jun 2014.
   Keeps the historical card present even if a later renderer rebuilds Historia. */
(function(){
  'use strict';
  if(window.__LJR_V282_ESPERANZA_2014__) return;
  window.__LJR_V282_ESPERANZA_2014__=true;

  const PHOTO='./assets/history/archive-v120/la-esperanza-campeon-copa-veteranos-2014.jpg?v=20260923-esperanza-2014-card-v282';
  const DATE='14 jun 2014';

  function norm(v){
    return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
  }

  function isTarget(card){
    const t=norm(card && card.textContent);
    return t.includes('la esperanza') && (t.includes('14 jun 2014') || t.includes('14 de junio de 2014'));
  }

  function style(){
    if(document.getElementById('v282-esperanza-2014-style')) return;
    const s=document.createElement('style');
    s.id='v282-esperanza-2014-style';
    s.textContent=`
      .v282-esperanza-2014{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        min-height:360px!important;
        background-color:#07075d!important;
        background-image:linear-gradient(180deg,rgba(3,6,50,.03) 0%,rgba(3,6,50,.12) 38%,rgba(3,6,50,.46) 72%,rgba(3,6,50,.86) 100%),url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 46%!important;
        background-repeat:no-repeat!important;
      }
      .v282-esperanza-2014>.v282-esperanza-photo{
        position:absolute!important;
        inset:0!important;
        z-index:0!important;
        width:100%!important;
        height:100%!important;
        min-width:100%!important;
        min-height:100%!important;
        object-fit:cover!important;
        object-position:center 46%!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:inherit!important;
        pointer-events:none!important;
      }
      .v282-esperanza-2014>.v282-esperanza-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        background:linear-gradient(180deg,rgba(2,7,55,.02) 0%,rgba(2,7,55,.12) 34%,rgba(2,7,55,.48) 72%,rgba(2,7,55,.88) 100%)!important;
      }
      .v282-esperanza-2014>.v35-history-moment-content,
      .v282-esperanza-2014>.v35-champion-content{
        position:relative!important;
        z-index:2!important;
        background:transparent!important;
        background-image:none!important;
      }
      .v282-esperanza-2014 .v35-history-kind,
      .v282-esperanza-2014 .v35-history-date,
      .v282-esperanza-2014 h3,
      .v282-esperanza-2014 h4,
      .v282-esperanza-2014 strong,
      .v282-esperanza-2014 b,
      .v282-esperanza-2014 p,
      .v282-esperanza-2014 span,
      .v282-esperanza-2014 time{
        text-shadow:0 2px 5px rgba(0,0,0,.78);
      }
    `;
    document.head.appendChild(s);
  }

  function photo(){
    const img=document.createElement('img');
    img.className='v282-esperanza-photo';
    img.src=PHOTO;
    img.alt='La Esperanza · Campeón de Copa · Veteranos · 14 jun 2014';
    img.loading='eager';
    img.decoding='async';
    return img;
  }
  function shade(){
    const x=document.createElement('span');
    x.className='v282-esperanza-shade';
    x.setAttribute('aria-hidden','true');
    return x;
  }

  function makeMoment(){
    const a=document.createElement('article');
    a.className='v35-history-moment v35-history-moment-photo v282-esperanza-2014';
    a.dataset.v282Esperanza2014='moment';
    a.appendChild(photo());
    a.appendChild(shade());
    const c=document.createElement('div');
    c.className='v35-history-moment-content';
    c.innerHTML=
      '<div class="v35-history-meta"><span class="v35-history-kind">CAMPEÓN</span><time class="v35-history-date">14 jun 2014</time></div>'+
      '<h3>La Esperanza</h3>'+
      '<strong>Campeón de Copa · Veteranos</strong>'+
      '<div class="v35-history-status"><span><b>Ganador</b>La Esperanza</span><span><b>Temporada</b>2014</span></div>'+
      '<p>La Esperanza fue campeón de Copa de Veteranos 2014. Registro histórico del 14 de junio de 2014. Fotografía del equipo campeón con el trofeo.</p>';
    a.appendChild(c);
    return a;
  }

  function makeChampion(){
    const a=document.createElement('article');
    a.className='v35-champion-card v35-champion-card-photo v282-esperanza-2014';
    a.dataset.v282Esperanza2014='champion';
    a.appendChild(photo());
    a.appendChild(shade());
    const c=document.createElement('div');
    c.className='v35-champion-content';
    c.innerHTML=
      '<span class="v35-champion-date">14 jun 2014</span>'+
      '<h4>La Esperanza</h4>'+
      '<b>Torneo de Copa · Veteranos</b>'+
      '<p>La Esperanza fue campeón de Copa de Veteranos 2014. Registro histórico del 14 de junio de 2014; fotografía del equipo campeón con el trofeo.</p>';
    a.appendChild(c);
    return a;
  }

  function forceExisting(){
    document.querySelectorAll('.v35-history-moment,.v35-champion-card,.v115-card').forEach(card=>{
      if(!isTarget(card)) return;
      card.classList.add('v282-esperanza-2014');
      card.style.setProperty('display','block','important');
      card.style.setProperty('visibility','visible','important');
      card.style.setProperty('opacity','1','important');
      card.style.setProperty('background-image','linear-gradient(180deg,rgba(3,6,50,.03),rgba(3,6,50,.86)),url("'+PHOTO+'")','important');
      card.style.setProperty('background-size','cover','important');
      card.style.setProperty('background-position','center 46%','important');
      if(!card.querySelector(':scope > .v282-esperanza-photo')){
        const old=card.querySelector(':scope > .v35-history-bg-photo,:scope > .v35-champion-bg-photo,:scope > .v120-exact-event-bg');
        if(old) old.remove();
        card.prepend(photo());
        const sh=shade();
        card.insertBefore(sh,card.children[1]||null);
      }
    });
  }

  function ensure(){
    if((location.hash||'').indexOf('history')<0) return;
    style();
    forceExisting();

    const moments=document.querySelector('.v35-history-moments');
    if(moments && ![...moments.children].some(isTarget)){
      moments.appendChild(makeMoment());
    }

    const verified=document.querySelector('.v35-verified-history .v35-champion-list');
    if(verified && ![...verified.children].some(isTarget)){
      verified.appendChild(makeChampion());
    }
  }

  let timer=0;
  function schedule(delay){
    clearTimeout(timer);
    timer=setTimeout(()=>{
      ensure();
      setTimeout(ensure,80);
      setTimeout(ensure,260);
      setTimeout(ensure,700);
    },delay||0);
  }

  window.addEventListener('hashchange',()=>schedule(30));
  document.addEventListener('click',e=>{
    if(e.target.closest('[data-v35-tab],button,[data-route]')) schedule(80);
  },true);

  const root=document.querySelector('#screen')||document.body;
  new MutationObserver(()=>schedule(40)).observe(root,{childList:true,subtree:true});

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',()=>schedule(60),{once:true});
  }else{
    schedule(60);
  }
})();