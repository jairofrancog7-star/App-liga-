/* Ajustes visuales/funcionales pedidos para el modo escritorio. */
(function(){
'use strict';
const isDesktop=()=>document.body.classList.contains('lj-desktop')||new URLSearchParams(location.search).get('mode')==='desktop'||innerWidth>=1024;
const currentRoute=()=>location.hash.replace(/^#\/?/,'')||'home';

function openLeagueCenter(){
  location.hash='#/more';
}

function patchUtilityTrigger(){
  if(!isDesktop()) return;
  document.querySelectorAll('.desk-utility .desk-wrap > span').forEach(el=>{
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

  document.querySelectorAll('.ds-utility .desk-wrap > span').forEach(el=>{
    if(el.dataset.ljDirectoryTrigger==='1') return;
    el.dataset.ljDirectoryTrigger='1';
    el.classList.add('lj-directory-trigger');
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.setAttribute('aria-label','Centro completo de la Liga');
    const arrow=document.createElement('span');
    arrow.className='lj-directory-trigger-arrow open';
    arrow.textContent='▲';
    el.appendChild(arrow);
  });
}

function patch(){
  patchUtilityTrigger();
  document.documentElement.dataset.ljDesktopPatch='blue-directory-v1';
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
