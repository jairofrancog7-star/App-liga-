/* V796 — Quiz Arena sin barra superior.
   Aplica bloqueo directo además del CSS para cabeceras que se crean después. */
(function(){
'use strict';
if(window.__LJR_V796_QUIZ_NO_TOPBAR__)return;
window.__LJR_V796_QUIZ_NO_TOPBAR__=true;

// Ocultar solo la barra GENERAL: la barra interna de Quiz Arena tiene menú ⋮ y botones propios.
const SEL='#app>.topbar,#app>header.topbar,.app-shell>.topbar,.app-shell>header.topbar';
function route(){
  return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
}
function isQuiz(){const r=route();return r==='quizArena'||r==='quiz'}
function hide(node){
  if(!(node instanceof HTMLElement)||node.dataset.v796QuizHidden==='1')return;
  node.dataset.v796QuizHidden='1';
  node.dataset.v796PrevDisplay=node.style.getPropertyValue('display')||'';
  node.style.setProperty('display','none','important');
  node.hidden=true;
  node.setAttribute('aria-hidden','true');
}
function restore(node){
  if(!(node instanceof HTMLElement)||node.dataset.v796QuizHidden!=='1')return;
  node.hidden=false;
  node.removeAttribute('aria-hidden');
  const prev=node.dataset.v796PrevDisplay||'';
  if(prev)node.style.setProperty('display',prev);
  else node.style.removeProperty('display');
  delete node.dataset.v796QuizHidden;
  delete node.dataset.v796PrevDisplay;
}
function sync(){
  const q=isQuiz();
  document.querySelectorAll(SEL).forEach(q?hide:restore);
  const body=document.body;
  if(body){
    if(q){
      body.style.setProperty('--v768-head-h','0px','important');
      body.style.setProperty('--ui-master-topbar-h','0px','important');
      body.style.setProperty('--topbar-h','0px','important');
    }else{
      body.style.removeProperty('--v768-head-h');
      body.style.removeProperty('--ui-master-topbar-h');
      body.style.removeProperty('--topbar-h');
    }
  }
  if(q){
    const screen=document.querySelector('#screen');
    if(screen){
      screen.style.setProperty('top','0','important');
      screen.style.setProperty('margin-top','0','important');
      screen.style.setProperty('padding-top','0','important');
    }
  }
}
function boot(){
  sync();
  window.addEventListener('hashchange',()=>requestAnimationFrame(sync));
  const root=document.querySelector('#app')||document.body;
  if(root)new MutationObserver(()=>{if(isQuiz())requestAnimationFrame(sync)}).observe(root,{childList:true,subtree:true});
  setTimeout(sync,80);setTimeout(sync,400);setTimeout(sync,1200);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();