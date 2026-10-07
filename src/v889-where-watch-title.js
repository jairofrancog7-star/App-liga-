/* V889 — Título real de "Dónde verlo" en la barra superior. */
(function(){
  'use strict';
  if(window.__LJR_V889_WHERE_TITLE__)return;
  window.__LJR_V889_WHERE_TITLE__=true;

  function route(){
    return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||
      String(document.body?.dataset?.appRoute||'home');
  }

  function sync(){
    const wordmark=document.querySelector('#app > .topbar .wordmark, .app-shell > .topbar .wordmark');
    if(!wordmark)return;

    const isWhere=route()==='whereToWatch' || document.body?.dataset?.appRoute==='whereToWatch' ||
      !!document.querySelector('#screen [data-v412-screen="where"]');

    if(isWhere){
      if(!wordmark.dataset.v889OriginalHtml){
        wordmark.dataset.v889OriginalHtml=wordmark.innerHTML;
        wordmark.dataset.v889OriginalAria=wordmark.getAttribute('aria-label')||'';
      }
      if(wordmark.textContent.trim()!=='Dónde verlo')wordmark.textContent='Dónde verlo';
      wordmark.classList.add('v889-where-title');
      wordmark.setAttribute('aria-label','Dónde verlo');
      return;
    }

    if(wordmark.classList.contains('v889-where-title')){
      const original=wordmark.dataset.v889OriginalHtml;
      if(original)wordmark.innerHTML=original;
      const aria=wordmark.dataset.v889OriginalAria;
      if(aria)wordmark.setAttribute('aria-label',aria); else wordmark.removeAttribute('aria-label');
      wordmark.classList.remove('v889-where-title');
    }
  }

  function burst(){
    sync();
    requestAnimationFrame(sync);
    setTimeout(sync,80);
    setTimeout(sync,220);
  }

  window.addEventListener('hashchange',burst);
  document.addEventListener('DOMContentLoaded',burst,{once:true});
  new MutationObserver(()=>requestAnimationFrame(sync)).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['data-app-route']});
  burst();
})();