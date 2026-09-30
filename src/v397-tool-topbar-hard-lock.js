/* V402 — topbar compacta para 26 rutas.
   Refuerza por JS con estilos inline !important para que ningún CSS viejo la vuelva a agrandar. */
(function(){
  'use strict';
  const ROUTES=new Set(["v38Alerts","v38Weather","v4-matchcenter","venues","matchday","search","ligaQR","players","agendaBuilder","simulator","v38Stats","bracketBuilder","tableExport","motionHub","recruitment","credentialBuilder","tactics","publications","v38Weekly","scheduleChanges","weatherFields","cedulas","cedulaBuilder","rulebook","rankings","leagueData"]);
  const PROPS=['height','min-height','max-height','margin','padding'];
  function current(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||
      String(document.body?.dataset?.appRoute||'home');
  }
  function clearInline(el,names){ if(!el)return; for(const n of names) el.style.removeProperty(n); }
  function setImp(el,name,value){ if(el) el.style.setProperty(name,value,'important'); }
  function sync(){
    const topbar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!topbar)return;
    const route=current();
    const active=ROUTES.has(route)||ROUTES.has(String(document.body?.dataset?.appRoute||''));
    topbar.classList.toggle('v402-tool-topbar-compact',active);
    if(!active){
      clearInline(topbar,PROPS);
      return;
    }
    setImp(topbar,'height',matchMedia('(max-width:390px)').matches?'40px':'42px');
    setImp(topbar,'min-height',matchMedia('(max-width:390px)').matches?'40px':'42px');
    setImp(topbar,'max-height',matchMedia('(max-width:390px)').matches?'40px':'42px');
    setImp(topbar,'margin','0');
    setImp(topbar,'padding','0');

    const back=topbar.querySelector('.back-button');
    const profile=topbar.querySelector('.profile-button');
    const small=matchMedia('(max-width:390px)').matches;
    if(back){
      back.classList.remove('is-hidden');
      setImp(back,'left',small?'2px':'3px');
      setImp(back,'top','10px');
      setImp(back,'width',small?'20px':'21px');
      setImp(back,'height',small?'20px':'21px');
      setImp(back,'min-width',small?'20px':'21px');
      setImp(back,'min-height',small?'20px':'21px');
      setImp(back,'max-width',small?'20px':'21px');
      setImp(back,'max-height',small?'20px':'21px');
    }
    if(profile){
      profile.classList.remove('is-hidden');
      setImp(profile,'right',small?'4px':'5px');
      setImp(profile,'top',small?'8px':'9px');
      setImp(profile,'width',small?'22px':'23px');
      setImp(profile,'height',small?'22px':'23px');
      setImp(profile,'min-width',small?'22px':'23px');
      setImp(profile,'min-height',small?'22px':'23px');
      setImp(profile,'max-width',small?'22px':'23px');
      setImp(profile,'max-height',small?'22px':'23px');
    }
  }
  const burst=()=>{sync();requestAnimationFrame(sync);setTimeout(sync,50);setTimeout(sync,180);setTimeout(sync,600)};
  window.addEventListener('hashchange',burst);
  window.addEventListener('popstate',burst);
  window.addEventListener('resize',sync);
  document.addEventListener('DOMContentLoaded',burst,{once:true});
  new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['data-app-route']});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(sync).observe(screen,{childList:true,subtree:false});
  if(document.readyState!=='loading')burst();

  // Si existe un service worker antiguo, pide actualización para no conservar un build viejo.
  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.update().catch(()=>{}))).catch(()=>{});
  }
})();