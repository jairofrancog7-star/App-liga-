/* V397 — activa la cabecera exacta por el hash real.
   Evita depender de body[data-app-route], que otros módulos pueden reescribir. */
(function(){
  'use strict';
  const routes=new Set(['v38Alerts','v38Weather','v4-matchcenter','venues','matchday']);
  function route(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
  }
  function sync(){
    const topbar=document.querySelector('#app > .topbar, .app-shell > .topbar');
    if(!topbar)return;
    const active=routes.has(route());
    topbar.classList.toggle('v397-tool-topbar-exact',active);
    if(active){
      topbar.classList.remove('has-route-title');
      topbar.removeAttribute('data-title');
      const back=topbar.querySelector('.back-button');
      const profile=topbar.querySelector('.profile-button');
      if(back)back.classList.remove('is-hidden');
      if(profile)profile.classList.remove('is-hidden');
    }
  }
  window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
  window.addEventListener('popstate',()=>requestAnimationFrame(sync));
  document.addEventListener('DOMContentLoaded',sync,{once:true});
  const screen=document.querySelector('#screen');
  if(screen)new MutationObserver(()=>requestAnimationFrame(sync)).observe(screen,{childList:true,subtree:false});
  if(document.readyState!=='loading')sync();
})();