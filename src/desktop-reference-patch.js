/* Ajustes visuales/funcionales pedidos para el modo escritorio. */
(function(){
'use strict';
const isDesktop=()=>document.body.classList.contains('lj-desktop')||document.documentElement.classList.contains('preview-desktop')||new URLSearchParams(location.search).get('mode')==='desktop'||innerWidth>=1024;
const currentRoute=()=>location.hash.replace(/^#\/?/,'')||'home';

function goHome(){
  location.hash='#/home';
}

function openLeagueCenter(){
  location.hash='#/more';
}

function hideMobileAppChrome(){
  if(!isDesktop()) return;
  document.querySelectorAll('#app > .topbar,#app > .bottom-nav,.v7-startup').forEach(el=>{
    el.classList.add('lj-desktop-app-hidden');
    el.setAttribute('aria-hidden','true');
  });
}

function patchHomeButton(){
  if(!isDesktop()) return;
  const wrappers=[...document.querySelectorAll('.desk-utility .desk-wrap,.ds-utility .ds-wrap')];
  wrappers.forEach(wrap=>{
    let btn=wrap.querySelector('.lj-home-return');
    if(currentRoute()==='home'){
      if(btn) btn.remove();
      return;
    }
    if(btn) return;
    btn=document.createElement('button');
    btn.type='button';
    btn.className='lj-home-return';
    btn.setAttribute('aria-label','Regresar al inicio');
    btn.innerHTML='<span aria-hidden="true">←</span><b>Inicio</b>';
    btn.addEventListener('click',e=>{
      e.preventDefault();
      e.stopPropagation();
      goHome();
    });
    wrap.prepend(btn);
  });
}

function patchUtilityTrigger(){
  if(!isDesktop()) return;
  document.querySelectorAll('.desk-utility .desk-wrap > span,.ds-utility .ds-wrap > span').forEach(el=>{
    if(el.dataset.ljDirectoryTrigger==='1') return;
    el.dataset.ljDirectoryTrigger='1';
    el.classList.add('lj-directory-trigger');
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.setAttribute('aria-label','Abrir centro completo de la Liga');
    const arrow=document.createElement('span');
    arrow.className='lj-directory-trigger-arrow';
    arrow.textContent='▲';
    el.appendChild(arrow);
    el.addEventListener('click',openLeagueCenter);
    el.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();openLeagueCenter();}
    });
  });
}

function patch(){
  if(!isDesktop()) return;
  hideMobileAppChrome();
  patchHomeButton();
  patchUtilityTrigger();
  document.documentElement.dataset.ljDesktopPatch='desktop-home-return-v2';
}

patch();
const obs=new MutationObserver(()=>{
  clearTimeout(window.__ljReferencePatchTimer);
  window.__ljReferencePatchTimer=setTimeout(patch,20);
});
obs.observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('hashchange',()=>setTimeout(patch,0));
window.addEventListener('resize',()=>setTimeout(patch,0));
})();
