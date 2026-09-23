/* V258 — Puros Cuates · 11 ene 2015 · fondo exacto detrás del texto */
(function(){
  if(window.__LJR_V258_PUROS_CUATES_2015__) return;
  window.__LJR_V258_PUROS_CUATES_2015__=true;

  const PHOTO=new URL('./assets/history/archive-v258/puros-cuates-campeon-intermedia-11-ene-2015.webp?v=20260923-puros-cuates-2015-bg-v258',document.baseURI).href;
  const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();

  function isTarget(el){
    const t=norm(el?.textContent);
    return t.includes('puros cuates') &&
           t.includes('11 ene 2015') &&
           t.includes('intermedia') &&
           (t.includes('campeonato') || t.includes('campeon'));
  }

  function installStyle(){
    if(document.getElementById('v258-puros-cuates-style')) return;
    const st=document.createElement('style');
    st.id='v258-puros-cuates-style';
    st.textContent=`
      .v258-puros-cuates-2015{
        position:relative!important;
        overflow:hidden!important;
        isolation:isolate!important;
        background-color:#071064!important;
        background-image:
          linear-gradient(180deg,rgba(2,7,45,.30) 0%,rgba(2,7,45,.36) 32%,rgba(2,7,45,.48) 66%,rgba(2,7,45,.72) 100%),
          linear-gradient(90deg,rgba(2,7,45,.26) 0%,rgba(2,7,45,.15) 58%,rgba(2,7,45,.22) 100%),
          url("${PHOTO}")!important;
        background-size:cover!important;
        background-position:center 44%!important;
        background-repeat:no-repeat!important;
      }
      .v258-puros-cuates-2015 > .v258-puros-cuates-photo{
        position:absolute!important;
        inset:0!important;
        width:100%!important;
        height:100%!important;
        margin:0!important;
        padding:0!important;
        border:0!important;
        border-radius:inherit!important;
        object-fit:cover!important;
        object-position:center 44%!important;
        display:block!important;
        visibility:visible!important;
        opacity:1!important;
        z-index:0!important;
        pointer-events:none!important;
        filter:saturate(1.03) contrast(1.02) brightness(.94)!important;
      }
      .v258-puros-cuates-2015 > .v258-puros-cuates-shade{
        position:absolute!important;
        inset:0!important;
        z-index:1!important;
        pointer-events:none!important;
        border-radius:inherit!important;
        background:
          linear-gradient(180deg,rgba(2,6,43,.27) 0%,rgba(2,6,43,.34) 32%,rgba(2,6,43,.47) 66%,rgba(2,6,43,.73) 100%),
          linear-gradient(90deg,rgba(2,6,43,.24) 0%,rgba(2,6,43,.12) 58%,rgba(2,6,43,.20) 100%)!important;
      }
      .v258-puros-cuates-2015 > :not(.v258-puros-cuates-photo):not(.v258-puros-cuates-shade){
        position:relative!important;
        z-index:2!important;
      }
      .v258-puros-cuates-2015 .v35-history-moment-content,
      .v258-puros-cuates-2015 .v35-history-status,
      .v258-puros-cuates-2015 .v35-history-meta,
      .v258-puros-cuates-2015 .v35-champion-content,
      .v258-puros-cuates-2015 .v115-card-body{
        background:transparent!important;
      }
    `;
    document.head.appendChild(st);
  }

  function patch(card){
    if(!card || !isTarget(card)) return false;
    installStyle();
    card.classList.add('v258-puros-cuates-2015');

    // Inline fallback in case a later stylesheet wins.
    card.style.setProperty('position','relative','important');
    card.style.setProperty('overflow','hidden','important');
    card.style.setProperty('isolation','isolate','important');
    card.style.setProperty(
      'background-image',
      'linear-gradient(180deg,rgba(2,7,45,.30) 0%,rgba(2,7,45,.36) 32%,rgba(2,7,45,.48) 66%,rgba(2,7,45,.72) 100%),'+
      'linear-gradient(90deg,rgba(2,7,45,.26) 0%,rgba(2,7,45,.15) 58%,rgba(2,7,45,.22) 100%),'+
      'url("'+PHOTO+'")',
      'important'
    );
    card.style.setProperty('background-size','cover','important');
    card.style.setProperty('background-position','center 44%','important');
    card.style.setProperty('background-repeat','no-repeat','important');

    let img=card.querySelector(':scope > .v258-puros-cuates-photo');
    if(!img){
      img=document.createElement('img');
      img.className='v258-puros-cuates-photo';
      img.alt='';
      img.setAttribute('aria-hidden','true');
      img.loading='eager';
      img.decoding='async';
      card.prepend(img);
    }
    if(img.src!==PHOTO) img.src=PHOTO;

    let shade=card.querySelector(':scope > .v258-puros-cuates-shade');
    if(!shade){
      shade=document.createElement('span');
      shade.className='v258-puros-cuates-shade';
      shade.setAttribute('aria-hidden','true');
      img.after(shade);
    }

    // Prevent older generic photo layers from covering the requested photo.
    card.querySelectorAll(':scope > .v35-history-bg-photo,:scope > .v120-exact-event-bg').forEach(old=>{
      if(old!==img) old.style.setProperty('display','none','important');
    });

    card.dataset.v258PurosCuates='applied';
    return true;
  }

  function candidateFromHeading(){
    const hs=[...document.querySelectorAll('h1,h2,h3,h4,strong')].filter(x=>norm(x.textContent).includes('puros cuates'));
    for(const h of hs){
      let el=h;
      for(let n=0;n<7 && el;n++,el=el.parentElement){
        if(isTarget(el) && el.getBoundingClientRect().height>180) return el;
      }
    }
    return null;
  }

  function scan(){
    installStyle();
    let done=false;
    document.querySelectorAll(
      '.v35-history-moment,.v35-champion-card,.v115-card,.v35-archive-card,.v35-history-card,[data-history-card],article'
    ).forEach(el=>{ if(patch(el)) done=true; });
    if(!done){
      const card=candidateFromHeading();
      if(card) patch(card);
    }
  }

  let timer=0;
  const schedule=()=>{clearTimeout(timer);timer=setTimeout(scan,45);};
  const screen=document.getElementById('screen');
  if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:true,characterData:true});
  window.addEventListener('hashchange',schedule);
  window.addEventListener('pageshow',schedule);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule();});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scan,{once:true});
  else scan();
  setTimeout(scan,120);
  setTimeout(scan,450);
  setTimeout(scan,1000);
  setTimeout(scan,2200);
})();