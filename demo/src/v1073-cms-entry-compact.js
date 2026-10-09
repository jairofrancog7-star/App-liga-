/* V1073 · Accesos rápidos de administración: cuatro tarjetas compactas, eventos originales intactos. */
(()=>{
  'use strict';
  if(window.__LJR_CMS_QUICK_V1073__)return;
  window.__LJR_CMS_QUICK_V1073__=true;
  const NS='http://www.w3.org/2000/svg';
  const icons={
    'data-cms-open':'<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="M8 9h8M8 13h6M8 17h4"/>',
    'data-cms-edit-page':'<path d="M12 5H5.5A2.5 2.5 0 0 0 3 7.5v11A2.5 2.5 0 0 0 5.5 21h11a2.5 2.5 0 0 0 2.5-2.5V12"/><path d="m9 15 8.8-8.8a2 2 0 0 1 2.8 2.8L11.8 17.8 8 19z"/>',
    'data-cms-story':'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2M7.5 3.8l-1.8-1M16.5 3.8l1.8-1"/>',
    'data-cms-design':'<rect x="3.5" y="4" width="17" height="16" rx="2.5"/><path d="m5 16 4.5-4.5 3.2 3.1 2.7-2.6 4.1 4M8.4 9h.1"/>'
  };
  const labels={
    'data-cms-open':'Administrar contenido',
    'data-cms-edit-page':'Editar esta página',
    'data-cms-story':'Historia · 24 h',
    'data-cms-design':'Crear publicación'
  };
  function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||''}
  function svg(markup){
    const node=document.createElementNS(NS,'svg');
    node.setAttribute('viewBox','0 0 24 24');
    node.setAttribute('fill','none');
    node.setAttribute('stroke','currentColor');
    node.setAttribute('stroke-width','1.7');
    node.setAttribute('stroke-linecap','round');
    node.setAttribute('stroke-linejoin','round');
    node.setAttribute('aria-hidden','true');
    node.innerHTML=markup;
    return node;
  }
  function upgrade(){
    const screen=document.querySelector('#screen');
    if(!screen)return;
    const entry=screen.querySelector(':scope > .ljr-cms-entry');
    if(!entry||entry.dataset.ljrCmsV1073==='1')return;
    if(!['ligaControl','adminFut'].includes(route())&&!screen.querySelector('[data-v563-control]'))return;
    entry.dataset.ljrCmsV1073='1';
    entry.setAttribute('role','group');
    entry.setAttribute('aria-label','Herramientas privadas de la Liga');
    for(const [attribute,markup] of Object.entries(icons)){
      const button=entry.querySelector('button['+attribute+']');
      if(!button)continue;
      // Nunca se reemplaza el botón: se conservan su onclick y las comprobaciones de acceso.
      const title=String(button.textContent||'').trim()||labels[attribute];
      const icon=document.createElement('span');icon.className='ljr-cms-quick-icon';icon.append(svg(markup));
      const label=document.createElement('span');label.className='ljr-cms-quick-title';label.textContent=title;
      const arrow=document.createElement('span');arrow.className='ljr-cms-quick-arrow';arrow.setAttribute('aria-hidden','true');arrow.textContent='›';
      button.replaceChildren(icon,label,arrow);
      button.setAttribute('aria-label',title);
      button.classList.add('ljr-cms-quick-button');
    }
  }
  function start(){
    const screen=document.querySelector('#screen');
    if(screen)new MutationObserver(upgrade).observe(screen,{childList:true});
    upgrade();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
  window.addEventListener('hashchange',()=>setTimeout(upgrade,70));
  window.addEventListener('liga:admin',()=>queueMicrotask(upgrade));
})();
