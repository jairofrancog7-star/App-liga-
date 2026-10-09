/* V1003 · Rótulo accesible de la cabecera en Preparar mi jornada.
   No reemplaza la barra de navegación, los selectores ni sus acciones. */
(()=>{
  'use strict';
  if(window.__LJR_V1003_AGENDA_HEADER__)return;
  window.__LJR_V1003_AGENDA_HEADER__=true;
  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
  const titleClass='v1003-agenda-header-title';

  function sync(){
    const bar=document.querySelector('#app > .topbar,.app-shell > .topbar');
    if(!bar)return;
    const active=route()==='agendaBuilder';
    const old=bar.querySelector('.'+titleClass);
    if(!active){old?.remove();return}
    if(old)return;
    const title=document.createElement('span');
    title.className=titleClass;
    title.setAttribute('aria-hidden','true');
    title.innerHTML='<strong>Preparar mi jornada</strong><small>PARTIDOS · CAMPOS · HORARIOS</small>';
    bar.appendChild(title);
  }

  function refresh(){
    sync();
    requestAnimationFrame(sync);
    setTimeout(sync,180);
  }
  window.addEventListener('hashchange',refresh);
  window.addEventListener('popstate',refresh);
  window.addEventListener('pageshow',refresh);
  const boot=()=>{
    refresh();
    const bar=document.querySelector('#app > .topbar,.app-shell > .topbar');
    if(bar)new MutationObserver(()=>{
      if(route()==='agendaBuilder'&&!bar.querySelector('.'+titleClass))sync();
    }).observe(bar,{childList:true});
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();