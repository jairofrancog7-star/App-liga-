/* V51 — iconos inferiores invariables entre páginas/estado activo. */
(function(){
  'use strict';

  const ICONS={
    home:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5607,9.9393C20.842,10.2206 21,10.6022 21,11V20.5C21,21.3284 20.3284,22 19.5,22H15C14.1715,22 13.5,21.3284 13.5,20.5V15H10.4999L10.5,20.5C10.5,21.3284 9.8284,22 9,22H4.5C3.6716,22 3,21.3284 3,20.5V11C3,10.6022 3.158,10.2206 3.4393,9.9393L10.9393,2.4393C11.5251,1.8535 12.4749,1.8535 13.0607,2.4393L20.5607,9.9393ZM8.9999,13.5H15V20.5H19.5V11L12,3.5L4.5,11V20.5H9L8.9999,13.5Z" fill="currentColor"/></svg>',
    competition:'<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M5.25 3.5h13.5A1.75 1.75 0 0 1 20.5 5.25v13.5a1.75 1.75 0 0 1-1.75 1.75H5.25a1.75 1.75 0 0 1-1.75-1.75V5.25A1.75 1.75 0 0 1 5.25 3.5Zm0 1.5a.25.25 0 0 0-.25.25v6h4.56a2.75 2.75 0 0 1 4.88 0H19v-6a.25.25 0 0 0-.25-.25H15v2.25A.75.75 0 0 1 14.25 8h-4.5A.75.75 0 0 1 9 7.25V5H5.25ZM10.5 5v1.5h3V5h-3ZM5 12.75v6c0 .138.112.25.25.25H9v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V19h3.75a.25.25 0 0 0 .25-.25v-6h-4.56a2.75 2.75 0 0 1-4.88 0H5Zm5.5 6.25h3v-1.5h-3V19ZM12 10.75a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z"/></svg>',
    video:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.684,19C7.684,19.552 8.132,20 8.684,20H15.316C15.868,20 16.316,19.552 16.316,19V18.118H20.287C20.766,18.118 21.171,17.953 21.503,17.624C21.834,17.294 22,16.892 22,16.416V5.701C22,5.226 21.834,4.824 21.503,4.494C21.171,4.165 20.766,4 20.287,4H3.713C3.234,4 2.829,4.165 2.497,4.494C2.166,4.824 2,5.226 2,5.701V16.416C2,16.892 2.166,17.294 2.497,17.624C2.829,17.953 3.234,18.118 3.713,18.118H7.684V19ZM20.287,16.706H3.713C3.64,16.706 3.573,16.676 3.512,16.615C3.451,16.555 3.421,16.489 3.421,16.416V5.701C3.421,5.629 3.451,5.563 3.512,5.502C3.573,5.442 3.64,5.412 3.713,5.412H20.287C20.36,5.412 20.427,5.442 20.488,5.502C20.549,5.563 20.579,5.629 20.579,5.701V16.416C20.579,16.489 20.549,16.555 20.488,16.615C20.427,16.676 20.36,16.706 20.287,16.706ZM10.269,14.369L14.797,11.48C15.105,11.284 15.105,10.834 14.797,10.637L10.269,7.748C9.936,7.536 9.5,7.775 9.5,8.17V13.948C9.5,14.342 9.936,14.582 10.269,14.369Z" fill="currentColor"/></svg>',
    fantasy:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21,11.02C21,11.638 20.445,12.108 19.836,12.007L18,11.701V20.996C18,21.548 17.552,21.996 17,21.996H7C6.448,21.996 6,21.548 6,20.996V11.701L4.164,12.007C3.555,12.108 3,11.638 3,11.02V3.217L3.684,2.989C5.08,2.524 6.685,2.173 9.5,1.938C9.5,3.271 10.667,3.938 12,3.938C13.333,3.938 14.5,3.271 14.5,1.938C17.315,2.173 18.92,2.524 20.316,2.989L21,3.217V11.02ZM4.5,10.43L7.5,9.93V20.496H16.5V9.93L19.5,10.43V4.299L19.125,4.203C18.951,4.158 18.781,4.107 18.553,4.034L18.143,3.9C17.406,3.663 16.841,3.53 16.056,3.441L15.725,3.403L15.563,3.694C14.96,4.777 13.714,5.438 12,5.438C10.286,5.438 9.04,4.777 8.437,3.694L8.275,3.403L7.944,3.441C7.158,3.53 6.594,3.663 5.857,3.9L5.447,4.034C5.219,4.107 5.049,4.158 4.875,4.203L4.5,4.299V10.43Z" fill="currentColor"/><path d="M13,7.5H15.5C15.5,8.167 15.5,8.833 15.5,9.5C15.5,10.052 15.052,10.5 14.5,10.5H14C13.448,10.5 13,10.052 13,9.5C13,8.833 13,8.167 13,7.5Z" fill="currentColor"/></svg>',
    more:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="2.5" fill="currentColor"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="19" cy="12" r="2.5" fill="currentColor"/></svg>'
  };

  let queued=false;

  function lockIcons(){
    queued=false;
    const nav=document.querySelector('.bottom-nav');
    if(!nav)return;
    nav.querySelectorAll('.nav-item[data-route]').forEach(item=>{
      const route=item.dataset.route;
      const icon=item.querySelector('.nav-icon');
      const desired=ICONS[route];
      if(!icon||!desired)return;
      if(icon.innerHTML!==desired){
        icon.innerHTML=desired;
      }
      icon.dataset.navLocked='v51';
    });
  }

  function schedule(){
    if(queued)return;
    queued=true;
    requestAnimationFrame(()=>requestAnimationFrame(lockIcons));
  }

  window.addEventListener('hashchange',schedule);
  document.addEventListener('DOMContentLoaded',schedule,{once:true});
  document.addEventListener('click',e=>{
    if(e.target.closest('.bottom-nav .nav-item'))setTimeout(schedule,0);
  },true);

  const nav=document.querySelector('.bottom-nav');
  if(nav){
    new MutationObserver(schedule).observe(nav,{
      subtree:true,
      childList:true,
      attributes:true,
      attributeFilter:['class']
    });
  }

  schedule();
  setTimeout(schedule,120);
  setTimeout(schedule,500);
  setTimeout(schedule,1200);
})();
