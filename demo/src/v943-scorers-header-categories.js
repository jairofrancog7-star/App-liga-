/* V944: cabecera compacta de Máximo goleador — flecha, título y perfil. */
(function(){
  'use strict';
  if(window.__LJR_V944_SCORERS_HEADER__)return;
  window.__LJR_V944_SCORERS_HEADER__=true;
  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';

  function mount(){
    if(route()!=='scorers')return;
    const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!bar)return;

    /* Limpia el trofeo grande de la versión anterior. */
    bar.querySelectorAll(':scope > .v943-scorers-trophy').forEach(el=>el.remove());

    let back=bar.querySelector(':scope > .v943-scorers-back');
    if(!back){
      back=document.createElement('button');
      back.type='button';
      back.className='v943-scorers-back';
      back.setAttribute('aria-label','Regresar');
      back.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
      back.addEventListener('click',()=>{
        const native=bar.querySelector('#backButton');
        if(native){native.click();return}
        if(window.LJR_NAVIGATION?.back){window.LJR_NAVIGATION.back();return}
        history.length>1?history.back():(location.hash='#/more');
      });
      bar.appendChild(back);
    }

    let title=bar.querySelector(':scope > .v944-scorers-title');
    if(!title){
      title=document.createElement('div');
      title.className='v944-scorers-title';
      title.textContent='Máximo goleador';
      bar.appendChild(title);
    }

    const profile=bar.querySelector(':scope > .profile-button');
    if(profile){
      profile.classList.remove('is-hidden');
      profile.removeAttribute('hidden');
      profile.setAttribute('aria-label',profile.getAttribute('aria-label')||'Perfil');
    }
  }

  let pending=false;
  const schedule=()=>{
    if(pending)return;
    pending=true;
    requestAnimationFrame(()=>{pending=false;mount()});
  };

  window.addEventListener('hashchange',schedule);
  window.addEventListener('popstate',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  const app=document.getElementById('app');
  if(app)new MutationObserver(()=>{if(route()==='scorers')schedule()}).observe(app,{childList:true,subtree:true});
  schedule();
  setTimeout(schedule,120);
  setTimeout(schedule,500);
  setTimeout(schedule,1200);
})();