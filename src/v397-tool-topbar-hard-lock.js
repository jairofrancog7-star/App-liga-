/* V403 — conserva las cabeceras ultra compactas existentes,
   pero aplica la barra exacta de la primera captura a las páginas solicitadas. */
(function(){
  'use strict';

  const ROUTES=new Set([
    "v38Alerts","v38Weather","v4-matchcenter","venues","matchday","search","ligaQR","players",
    "agendaBuilder","simulator","v38Stats","bracketBuilder","tableExport","motionHub","recruitment",
    "credentialBuilder","tactics","publications","v38Weekly","scheduleChanges","weatherFields",
    "cedulas","cedulaBuilder","rulebook","rankings","leagueData","leagueTools"
  ]);

  const REFERENCE_ROUTES=new Set([
    "leagueTools","search","ligaQR","players","agendaBuilder","v38Alerts","simulator","v38Stats"
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

  function sync(){
    const topbar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!topbar)return;

    const route=current();
    const bodyRoute=String(document.body?.dataset?.appRoute||'');
    const active=ROUTES.has(route)||ROUTES.has(bodyRoute);
    const reference=REFERENCE_ROUTES.has(route)||REFERENCE_ROUTES.has(bodyRoute);

    topbar.classList.toggle('v402-tool-topbar-compact',active);
    topbar.classList.toggle('v397-tool-topbar-exact',reference);
    topbar.classList.toggle('v403-reference-topbar',reference);

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
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(sync).observe(screen,{childList:true,subtree:false});
  if(document.readyState!=='loading')burst();

  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update().catch(()=>{}))).catch(()=>{});
  }
})();