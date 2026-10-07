/* V890 — Título "Dónde verlo" visible en la barra superior. */
(function(){
  'use strict';
  if(window.__LJR_V890_WHERE_TITLE__)return;
  window.__LJR_V890_WHERE_TITLE__=true;

  function currentRoute(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||
      String(document.body?.dataset?.appRoute||'home');
  }

  function isWhere(){
    return currentRoute()==='whereToWatch' ||
      String(document.body?.dataset?.appRoute||'')==='whereToWatch' ||
      !!document.querySelector('#screen [data-v412-screen="where"]');
  }

  function getTopbar(){
    return document.querySelector('#app > .topbar, .app-shell > .topbar');
  }

  function ensureLabel(topbar){
    let label=topbar.querySelector('.v890-where-title-label');
    if(!label){
      label=document.createElement('span');
      label.className='v890-where-title-label';
      label.textContent='Dónde verlo';
      label.setAttribute('aria-hidden','true');
      topbar.appendChild(label);
    }
    return label;
  }

  function sync(){
    const topbar=getTopbar();
    if(!topbar)return;

    const active=isWhere();
    topbar.classList.toggle('v890-where-topbar',active);

    const label=ensureLabel(topbar);
    label.hidden=!active;

    if(active){
      label.textContent='Dónde verlo';
      const wordmark=topbar.querySelector('.wordmark');
      if(wordmark)wordmark.setAttribute('aria-label','Dónde verlo');
    }
  }

  function burst(){
    sync();
    requestAnimationFrame(sync);
    setTimeout(sync,60);
    setTimeout(sync,180);
    setTimeout(sync,500);
  }

  window.addEventListener('hashchange',burst);
  window.addEventListener('pageshow',burst);
  document.addEventListener('DOMContentLoaded',burst,{once:true});

  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{
    subtree:true,
    childList:true,
    attributes:true,
    attributeFilter:['data-app-route','class']
  });

  burst();
})();