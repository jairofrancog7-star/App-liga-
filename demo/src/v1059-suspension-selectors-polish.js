/* V1059 — Iconos decorativos del formulario de aviso de suspensión.
   Los selectores nativos y sus change/input listeners originales se conservan. */
(()=>{
  'use strict';
  if(window.__LJR_V1059_SUSPENSION_SELECTORS__)return;
  window.__LJR_V1059_SUSPENSION_SELECTORS__=true;

  const specs={
    round:{icon:'calendar',arrow:true},
    type:{icon:'alert',arrow:true},
    scope:{icon:'target',arrow:true},
    match:{icon:'ball',arrow:true},
    venue:{icon:'field',arrow:true},
    reason:{icon:'cloud',arrow:true},
    priority:{icon:'flag',arrow:true},
    date:{icon:'calendar'},
    time:{icon:'clock'},
    channel:{icon:'share',arrow:true},
    message:{icon:'note'}
  };
  const glyph={
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18"/>',
    alert:'<path d="M10.5 3.7 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.5 3.7a1.7 1.7 0 0 0-3 0Z"/><path d="M12 9v5m0 3h.01"/>',
    target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 1v5m0 12v5M1 12h5m12 0h5"/>',
    ball:'<circle cx="12" cy="12" r="9"/><path d="m9.2 9.5 5.6 0 1.8 5.1-4.6 3.2-4.6-3.2zM9.2 9.5 6.5 6.1M14.8 9.5l2.7-3.4M7.4 14.6l-3.2 1M16.6 14.6l3.2 1"/>',
    field:'<rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="M12 4.5v15M2.5 9h3m0 0v6h-3M21.5 9h-3m0 0v6h3"/><circle cx="12" cy="12" r="3"/>',
    cloud:'<path d="M7 18h11a4 4 0 0 0 .3-8 6 6 0 0 0-11.7-1.5A4.8 4.8 0 0 0 7 18Z"/><path d="M9 20l-1 2m6-2-1 2"/>',
    flag:'<path d="M5 3v18M5 4c4-2 7 2 11 0v11c-4 2-7-2-11 0"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>',
    note:'<path d="M5 3h10l4 4v14H5zM15 3v5h4M8 12h8M8 16h7"/>',
    down:'<path d="m6 9 6 6 6-6"/>'
  };
  const svg=k=>'<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">'+glyph[k]+'</svg>';

  let queued=false;
  function apply(){
    queued=false;
    const route=String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||String(document.body?.dataset?.appRoute||'');
    if(route!=='suspensionTool')return;
    const page=document.querySelector('#screen .v425-suspension');
    if(!page)return;
    const fields=page.querySelectorAll('.v425-panel .v64-form-grid select,.v425-panel .v64-form-grid input,.v425-panel .v64-form-grid textarea');
    for(const control of fields){
      const label=control.closest('label');
      if(!label||!label.closest('.v425-panel'))continue;
      const attr=Array.from(control.attributes).find(x=>x.name.startsWith('data-v64-susp-'));
      if(!attr)continue;
      const key=attr.name.slice('data-v64-susp-'.length);
      if(key==='cat'){
        label.classList.add('v1059-category');
        label.querySelectorAll('.v1059-chevron').forEach(node=>node.remove());
        continue;
      }
      const spec=specs[key];
      if(!spec)continue;
      label.classList.add('v1059-field');
      if(key==='message')label.classList.add('v1059-textarea');
      if(control.matches('select'))control.classList.add('v1059-native-select');
      if(!label.querySelector(':scope > .v1059-field-icon')){
        const i=document.createElement('span');
        i.className='v1059-field-icon';
        i.setAttribute('aria-hidden','true');
        i.innerHTML=svg(spec.icon);
        label.appendChild(i);
      }
      // Evitar la segunda flecha: Android/Chrome ya proporciona la flecha nativa.
      // Limpiar restos decorativos de versiones anteriores, sin tocar el select.
      label.querySelectorAll('.v1059-chevron').forEach(node=>node.remove());
    }
  }
  const queue=()=>{
    if(queued)return;
    queued=true;
    requestAnimationFrame(apply);
  };
  function boot(){
    const screen=document.querySelector('#screen');
    if(screen)new MutationObserver(queue).observe(screen,{childList:true,subtree:true});
    window.addEventListener('hashchange',queue);
    window.addEventListener('pageshow',queue);
    queue();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
