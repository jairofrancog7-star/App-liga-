/* V683 — respaldo runtime para la cabecera fija de Más.
   Fuerza únicamente posición/visibilidad mientras #/more está activo. */
(function(){
'use strict';
if(window.__LJR_V683_MORE_FIXED_HEADER__)return;
window.__LJR_V683_MORE_FIXED_HEADER__=true;

const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||'home';
const setImp=(el,p,v)=>{ if(el) el.style.setProperty(p,v,'important'); };
const rem=(el,p)=>{ if(el) el.style.removeProperty(p); };

function apply(){
  const top=document.querySelector('#app > .topbar,.app-shell > .topbar');
  const screen=document.querySelector('#screen');
  if(!top||!screen)return;

  if(route()!=='more'){
    ['position','top','left','right','width','z-index','display','visibility','opacity','transform','margin'].forEach(p=>rem(top,p));
    rem(screen,'padding-top');
    return;
  }

  setImp(top,'display','block');
  setImp(top,'visibility','visible');
  setImp(top,'opacity','1');
  setImp(top,'position','fixed');
  setImp(top,'top','0');
  setImp(top,'left','0');
  setImp(top,'right','0');
  setImp(top,'width','100%');
  setImp(top,'margin','0');
  setImp(top,'transform','none');
  setImp(top,'z-index','2147483000');

  requestAnimationFrame(()=>{
    const h=Math.max(1,Math.round(top.getBoundingClientRect().height));
    setImp(screen,'padding-top',h+'px');
  });
}

window.addEventListener('hashchange',()=>requestAnimationFrame(apply));
window.addEventListener('pageshow',()=>requestAnimationFrame(apply));
window.addEventListener('resize',()=>requestAnimationFrame(apply));
document.addEventListener('DOMContentLoaded',apply,{once:true});

const mo=new MutationObserver(()=>requestAnimationFrame(apply));
mo.observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['class','style','data-app-route']});

requestAnimationFrame(apply);
setTimeout(apply,250);
setTimeout(apply,900);
})();