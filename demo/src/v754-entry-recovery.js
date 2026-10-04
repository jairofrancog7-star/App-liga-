/* V754 — recuperación de entrada.
   Si una capa secundaria de logos deja #screen vacío, vuelve a ejecutar el
   render principal una sola vez y siempre libera el preboot. */
(function(){
'use strict';
if(window.__LJR_V754_ENTRY_RECOVERY__)return;
window.__LJR_V754_ENTRY_RECOVERY__=true;

function hasContent(){
  const screen=document.querySelector('#screen');
  return !!(screen&&(screen.children.length||(screen.textContent||'').trim()));
}
function reveal(){
  document.documentElement.classList.remove('ljr-preboot');
}
function recover(){
  if(hasContent()){reveal();return true}
  try{
    if(window.LJR_MAIN_ROUTE&&typeof window.LJR_MAIN_ROUTE.render==='function'){
      window.LJR_MAIN_ROUTE.render();
    }
  }catch(_){}
  if(hasContent()){reveal();return true}
  return false;
}
function boot(){
  setTimeout(recover,120);
  setTimeout(recover,500);
  setTimeout(recover,1100);
  setTimeout(reveal,1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
window.addEventListener('load',recover,{once:true});
})();