/* V943: restaurar la flecha real, trofeo y perfil superior sólo en Máximo goleador. */
(function(){
  'use strict';
  if(window.__LJR_V943_SCORERS_HEADER__)return;
  window.__LJR_V943_SCORERS_HEADER__=true;
  const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
  function mount(){
    if(route()!=='scorers')return;
    const bar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!bar)return;
    if(!bar.querySelector(':scope > .v943-scorers-back')){
      const button=document.createElement('button');
      button.type='button';
      button.className='v943-scorers-back';
      button.setAttribute('aria-label','Regresar a la página anterior');
      button.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>';
      button.addEventListener('click',()=>{
        const back=bar.querySelector('#backButton');
        if(back){back.click();return}
        if(window.LJR_NAVIGATION?.back){window.LJR_NAVIGATION.back();return}
        location.hash='#/more';
      });
      bar.appendChild(button);
    }
    if(!bar.querySelector(':scope > .v943-scorers-trophy')){
      const trophy=document.createElement('span');
      trophy.className='v943-scorers-trophy';
      trophy.setAttribute('aria-hidden','true');
      trophy.innerHTML='<svg viewBox="0 0 64 68" aria-hidden="true"><path d="M19 8h26l-3.3 26c-.8 6-4.5 11-9.7 12.5-5.2-1.5-8.9-6.5-9.7-12.5L19 8Z"/><path d="M18 15H8v7c0 9 4.7 14 15 15M46 15h10v7c0 9-4.7 14-15 15"/><path d="M32 47v9m-13 5h26M24 56h16v5H24z"/><circle cx="32" cy="27" r="10"/><path d="m32 21 4 2.7-1.4 4.7h-5.2L28 23.7z"/></svg>';
      bar.appendChild(trophy);
    }
    bar.querySelector('.profile-button')?.classList.remove('is-hidden');
  }
  let pending=false;
  const schedule=()=>{if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;mount()})};
  window.addEventListener('hashchange',schedule);
  window.addEventListener('popstate',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  const app=document.getElementById('app');
  if(app)new MutationObserver(()=>{if(route()==='scorers')schedule()}).observe(app,{childList:true,subtree:false});
  schedule();
  setTimeout(schedule,250);
  setTimeout(schedule,1200);
})();