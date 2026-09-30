/* V403 — conserva las cabeceras ultra compactas existentes,
   pero aplica la barra exacta de la primera captura a las páginas solicitadas. */
(function(){
  'use strict';

  const ROUTES=new Set([
    "v38Alerts","v38Weather","v4-matchcenter","venues","matchday","search","ligaQR","players",
    "agendaBuilder","simulator","v38Stats","bracketBuilder","tableExport","motionHub","recruitment",
    "credentialBuilder","tactics","publications","v38Weekly","scheduleChanges","weatherFields",
    "cedulas","cedulaBuilder","rulebook","rankings","leagueTools","news"
  ]);

  const REFERENCE_ROUTES=new Set([
    "leagueTools","search","ligaQR","players","agendaBuilder","v38Alerts","simulator","v38Stats","recruitment","news"
  ]);

  const TOPBAR_PROPS=['height','min-height','max-height','margin','padding'];
  const BACK_PROPS=['left','top','width','height','min-width','min-height','max-width','max-height','transform'];
  const PROFILE_PROPS=['right','top','width','height','min-width','min-height','max-width','max-height','transform'];

  function current(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||
      String(document.body?.dataset?.appRoute||'home');
  }
  function clearInline(el,names){
    if(!el)return;
    for(const n of names)el.style.removeProperty(n);
  }
  function setImp(el,name,value){
    if(el)el.style.setProperty(name,value,'important');
  }
  function clearTopbarInline(topbar){
    if(!topbar)return;
    ['display','visibility','opacity','pointer-events','height','min-height','max-height','margin','padding','overflow'].forEach(p=>topbar.style.removeProperty(p));
  }
  function ensureOverlayTopbar(overlay){
    if(!overlay || overlay.querySelector('.v408-tv-topbar,.v410-overlay-topbar'))return;
    const head=document.createElement('header');
    head.className='v410-overlay-topbar';
    head.setAttribute('aria-label','Barra superior');
    head.innerHTML=
      '<button class="v410-overlay-back" type="button" aria-label="Regresar">'+
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5 8 12l6.5 6.5M8 12h12"/></svg>'+
      '</button>'+
      '<span class="v410-overlay-trophy" aria-hidden="true"></span>'+
      '<button class="v410-overlay-profile" type="button" aria-label="Perfil">'+
        '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.6"/><circle cx="12" cy="8.1" r="2.85"/><path d="M5.35 19.15c1.55-3.35 3.76-4.9 6.65-4.9s5.1 1.55 6.65 4.9"/></svg>'+
      '</button>';
    overlay.prepend(head);
    head.querySelector('.v410-overlay-back')?.addEventListener('click',()=>{
      overlay.querySelector('.v100-modal-close,.v105-close')?.click() || overlay.remove();
      requestAnimationFrame(sync);
    });
    head.querySelector('.v410-overlay-profile')?.addEventListener('click',()=>{
      overlay.querySelector('.v100-modal-close,.v105-close')?.click() || overlay.remove();
      location.hash='#/profile';
      requestAnimationFrame(sync);
    });
  }

  function sync(){
    const topbar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!topbar)return;

    const route=current();
    const bodyRoute=String(document.body?.dataset?.appRoute||'');

    // V410: Competición debe mostrar su barra propia desde el primer frame,
    // incluso si venimos de Estadísticas, donde la topbar global se oculta.
    const competitionOwned=route==='competition'||bodyRoute==='competition';
    if(competitionOwned){
      if(document.body.dataset.appRoute!=='competition')document.body.dataset.appRoute='competition';
      document.body.classList.remove('v33-data-active','v404-tool-overlay-open','v410-overlay-open');
      topbar.classList.remove('v402-tool-topbar-compact','v397-tool-topbar-exact','v403-reference-topbar','v404-missing-pages-topbar');
      clearTopbarInline(topbar);
      setImp(topbar,'display','block');
      setImp(topbar,'visibility','visible');
      setImp(topbar,'opacity','1');
      setImp(topbar,'pointer-events','auto');
      return;
    }

    // Estadísticas (V33) tiene su propia cabecera con flecha/título/pestañas.
    // No debe recibir la barra global superior.
    const statsOwned=route==='safe-data'||route==='leagueData'||document.body.classList.contains('v33-data-active');
    if(statsOwned){
      topbar.classList.remove('v402-tool-topbar-compact','v397-tool-topbar-exact','v403-reference-topbar','v404-missing-pages-topbar');
      topbar.style.setProperty('display','none','important');
      topbar.style.setProperty('visibility','hidden','important');
      topbar.style.setProperty('height','0','important');
      topbar.style.setProperty('min-height','0','important');
      topbar.style.setProperty('max-height','0','important');
      topbar.style.setProperty('margin','0','important');
      topbar.style.setProperty('padding','0','important');
      return;
    }else{
      ['display','visibility'].forEach(p=>topbar.style.removeProperty(p));
    }

    const overlay=document.querySelector('.v100-modal,.v105-modal,.v160-tv-layer');
    const overlayActive=!!overlay;

    // Los modales/Modo TV usan ahora una cabecera propia dentro del overlay.
    // Así no se ve contenido de "Más" por encima cuando la página estaba desplazada.
    if(overlayActive){
      ensureOverlayTopbar(overlay);
      document.body.classList.remove('v404-tool-overlay-open');
      document.body.classList.add('v410-overlay-open');
      topbar.classList.remove('v402-tool-topbar-compact','v397-tool-topbar-exact','v403-reference-topbar','v404-missing-pages-topbar');
      setImp(topbar,'display','none');
      setImp(topbar,'visibility','hidden');
      setImp(topbar,'opacity','0');
      setImp(topbar,'pointer-events','none');
      return;
    }else{
      document.body.classList.remove('v410-overlay-open','v404-tool-overlay-open');
      clearTopbarInline(topbar);
    }

    const contentMarker=!!document.querySelector('#v190-recruitment-page,.v60-tool-page');
    const active=ROUTES.has(route)||ROUTES.has(bodyRoute)||contentMarker;
    const reference=REFERENCE_ROUTES.has(route)||REFERENCE_ROUTES.has(bodyRoute)||contentMarker;

    topbar.classList.toggle('v402-tool-topbar-compact',active);
    topbar.classList.toggle('v397-tool-topbar-exact',reference);
    topbar.classList.toggle('v403-reference-topbar',reference);
    topbar.classList.toggle('v404-missing-pages-topbar',reference);

    const back=topbar.querySelector('.back-button');
    const profile=topbar.querySelector('.profile-button');

    if(!active){
      clearInline(topbar,TOPBAR_PROPS);
      clearInline(back,BACK_PROPS);
      clearInline(profile,PROFILE_PROPS);
      return;
    }

    const small=matchMedia('(max-width:390px)').matches;
    const h=reference?'clamp(82px,21.68vw,90px)':(small?'40px':'42px');

    setImp(topbar,'height',h);
    setImp(topbar,'min-height',h);
    setImp(topbar,'max-height',h);
    setImp(topbar,'margin','0');
    setImp(topbar,'padding','0');

    if(back){
      back.classList.remove('is-hidden');
      if(reference){
        setImp(back,'left','14px');
        setImp(back,'top','50%');
        setImp(back,'width','25px');
        setImp(back,'height','25px');
        setImp(back,'min-width','25px');
        setImp(back,'min-height','25px');
        setImp(back,'max-width','25px');
        setImp(back,'max-height','25px');
        setImp(back,'transform','translateY(-50%)');
      }else{
        setImp(back,'left',small?'2px':'3px');
        setImp(back,'top','10px');
        setImp(back,'width',small?'20px':'21px');
        setImp(back,'height',small?'20px':'21px');
        setImp(back,'min-width',small?'20px':'21px');
        setImp(back,'min-height',small?'20px':'21px');
        setImp(back,'max-width',small?'20px':'21px');
        setImp(back,'max-height',small?'20px':'21px');
        setImp(back,'transform','none');
      }
    }

    if(profile){
      profile.classList.remove('is-hidden');
      if(reference){
        setImp(profile,'right','14px');
        setImp(profile,'top','50%');
        setImp(profile,'width','27px');
        setImp(profile,'height','27px');
        setImp(profile,'min-width','27px');
        setImp(profile,'min-height','27px');
        setImp(profile,'max-width','27px');
        setImp(profile,'max-height','27px');
        setImp(profile,'transform','translateY(-50%)');
      }else{
        setImp(profile,'right',small?'4px':'5px');
        setImp(profile,'top',small?'8px':'9px');
        setImp(profile,'width',small?'22px':'23px');
        setImp(profile,'height',small?'22px':'23px');
        setImp(profile,'min-width',small?'22px':'23px');
        setImp(profile,'min-height',small?'22px':'23px');
        setImp(profile,'max-width',small?'22px':'23px');
        setImp(profile,'max-height',small?'22px':'23px');
        setImp(profile,'transform','none');
      }
    }
  }

  const burst=()=>{
    sync();
    requestAnimationFrame(sync);
    setTimeout(sync,50);
    setTimeout(sync,180);
    setTimeout(sync,600);
  };

  window.addEventListener('hashchange',burst);
  window.addEventListener('popstate',burst);
  window.addEventListener('resize',sync);
  document.addEventListener('DOMContentLoaded',burst,{once:true});
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-app-route']});
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.body,{childList:true,subtree:false});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(sync).observe(screen,{childList:true,subtree:false});
  if(document.readyState!=='loading')burst();

  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update().catch(()=>{}))).catch(()=>{});
  }
})();