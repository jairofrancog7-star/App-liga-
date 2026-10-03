/* V673 — limpiar locks huérfanos que bloquean el gesto vertical en rutas raíz. */
(function(){
'use strict';
if(window.__LJR_V673_ROOT_SCROLL_RESCUE__)return;
window.__LJR_V673_ROOT_SCROLL_RESCUE__=true;

const ROOTS=new Set(['home','competition','more']);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';

const LOCKS=[
  ['v68-notif-open','.v68-notif-layer,.v68-notif-sheet'],
  ['v132-picker-open','.v132-layer.open'],
  ['v439-cast-open','.v439-cast-sheet.is-open'],
  ['v369-notify-open','#v369-team-notify'],
  ['v571-sheet-open','.v571-sheet-layer,.v571-sheet'],
  ['v566-sheet-open','.v566-sheet-layer,.v566-sheet'],
  ['v515-sheet-dragging','.v501-sheet.is-dragging'],
  ['v543-more-portal-open','.v543-more-portal']
];

function imp(el,name,value){if(el)el.style.setProperty(name,value,'important')}

function rescue(){
  const r=route();
  if(!ROOTS.has(r))return;

  for(const [cls,selector] of LOCKS){
    if(document.body.classList.contains(cls) && !document.querySelector(selector)){
      document.body.classList.remove(cls);
    }
  }

  const html=document.documentElement,body=document.body,app=document.querySelector('#app'),screen=document.querySelector('#screen');
  imp(body,'overflow-y','auto');
  imp(body,'overflow-x','hidden');
  imp(body,'height','auto');
  imp(body,'max-height','none');
  imp(body,'min-height','100dvh');
  imp(body,'touch-action','auto');

  for(const el of [app,screen]){
    imp(el,'height','auto');
    imp(el,'max-height','none');
    imp(el,'overflow-y','visible');
    imp(el,'touch-action','auto');
  }
  if(app)imp(app,'overflow-x','visible');

  if(r==='more'){
    const top=document.querySelector('#app > .topbar,.app-shell > .topbar');
    imp(top,'display','block');
    imp(top,'visibility','visible');
    imp(top,'opacity','1');
    imp(top,'position','sticky');
    imp(top,'top','0');
    imp(top,'transform','none');
    imp(top,'z-index','2147483600');
  }
}

new MutationObserver(()=>rescue()).observe(document.documentElement,{attributes:true,subtree:true,attributeFilter:['class','data-app-route']});
window.addEventListener('hashchange',()=>requestAnimationFrame(rescue));
window.addEventListener('pageshow',()=>requestAnimationFrame(rescue));
document.addEventListener('DOMContentLoaded',rescue,{once:true});
requestAnimationFrame(rescue);
setTimeout(rescue,250);
setTimeout(rescue,900);
})();