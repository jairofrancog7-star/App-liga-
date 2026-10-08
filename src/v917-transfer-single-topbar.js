/* V917 — Coloca título y campana junto al perfil de la cabecera original. */
(()=>{
  'use strict';
  if(window.__LJR_V917_TRANSFER_SINGLE_TOPBAR__)return;
  window.__LJR_V917_TRANSFER_SINGLE_TOPBAR__=true;
  const currentRoute=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
  let scheduled=false;
  function sync(){
    scheduled=false;
    const header=document.querySelector('#app > .topbar');
    if(!header)return;
    const profile=header.querySelector('.profile-button');
    if(!profile)return;
    let title=header.querySelector('.v917-transfer-title');
    if(!title){
      title=document.createElement('span');
      title.className='v917-transfer-title';
      title.textContent='Centro de fichajes';
      header.insertBefore(title,profile);
    }
    let bell=header.querySelector('.v917-transfer-bell');
    if(!bell){
      bell=document.createElement('button');
      bell.type='button';
      bell.className='v917-transfer-bell';
      bell.setAttribute('aria-label','Notificaciones');
      bell.setAttribute('title','Notificaciones');
      bell.innerHTML='<svg viewBox="0 0 28 28" aria-hidden="true"><path class="v917-bell-body" d="M7.8 19.4h12.4c-1.5-1.8-2.1-3.5-2.1-6.7 0-3.1-1.6-5.5-4.1-6.2V5.4a1.6 1.6 0 0 0-3.2 0v1.1c-2.5.7-4.1 3.1-4.1 6.2 0 3.2-.6 4.9-2.1 6.7h3.2Z"/><path class="v917-bell-body" d="M10.6 21.1c.4 1.3 1.5 2.1 2.8 2.1s2.4-.8 2.8-2.1"/><circle class="v917-bell-check-circle" cx="20.9" cy="7.2" r="4.3"/><path class="v917-bell-check" d="m18.8 7.2 1.3 1.4 2.7-3"/></svg>';
      bell.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        if(currentRoute()!=='transfers')return;
        if(typeof window.LJR_MAIN_ROUTE?.go==='function')window.LJR_MAIN_ROUTE.go('notifications');
        else location.hash='#/notifications';
      });
      header.insertBefore(bell,profile);
    }
    if(currentRoute()!=='transfers')return;
    const box=header.getBoundingClientRect();
    const anchor=profile.getBoundingClientRect();
    if(box.width>0&&anchor.width>0){
      const center=Math.round(anchor.top-box.top+anchor.height/2);
      const bellRight=Math.round(box.right-anchor.left+8);
      header.style.setProperty('--v917-transfer-control-y',center+'px');
      header.style.setProperty('--v917-transfer-bell-right',bellRight+'px');
    }
    window.LJR_SCROLL_CHROME?.refresh?.();
  }
  function schedule(){
    if(scheduled)return;
    scheduled=true;
    requestAnimationFrame(sync);
  }
  function boot(){
    const app=document.getElementById('app');
    if(!app)return;
    new MutationObserver(schedule).observe(app,{childList:true});
    window.addEventListener('hashchange',schedule);
    window.addEventListener('resize',schedule);
    window.addEventListener('load',schedule);
    schedule();
    setTimeout(schedule,300);
    setTimeout(schedule,1200);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();