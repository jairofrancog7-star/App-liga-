/* V1058 — Iconos y columnas simétricas en Aviso de suspensión.
   Añade elementos decorativos sin reemplazar botones ni modificar eventos. */
(()=>{
  'use strict';
  if(window.__LJR_V1058_SUSPENSION_UI__)return;
  window.__LJR_V1058_SUSPENSION_UI__=true;

  const normalize=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,' ').trim().toLowerCase();
  const paths={
    eye:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3.5 12s3-4.5 8.5-4.5 8.5 4.5 8.5 4.5-3 4.5-8.5 4.5S3.5 12 3.5 12Z"/><circle cx="12" cy="12" r="2.25"/>',
    save:'<path d="M4 3h13l3 3v15H4z"/><path d="M8 3v7h8V3M7 21v-8h10v8"/>',
    copy:'<rect x="8" y="7" width="12" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h2"/>',
    chat:'<path d="M20 11.5a8 8 0 0 1-11.6 7.1L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z"/><path d="M9 9.5c1.5 3 3 4 6 5"/>',
    image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8" r="1.4"/><path d="m5.5 18 5-5 2.5 2.5 3.5-4 3 4"/>',
    download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v3h16v-3"/>',
    share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5m-8 7 8 5"/>'
  };
  const rules=[
    {exact:'vista previa avanzada',icon:'eye',primary:true},
    {exact:'guardar borrador',icon:'save'},
    {exact:'copiar texto',icon:'copy'},
    {exact:'whatsapp',icon:'chat'},
    {exact:'vista previa png del aviso',icon:'image',primary:true,extra:true},
    {exact:'descargar png',icon:'download',extra:true},
    {exact:'compartir imagen',icon:'share',extra:true},
    {exact:'whatsapp · presidente',icon:'chat',president:true,extra:true},
    {exact:'whatsapp - presidente',icon:'chat',president:true,extra:true}
  ];
  const choose=el=>{
    const label=normalize(el.textContent);
    return rules.find(r=>label===r.exact)||
      (label.startsWith('whatsapp')&&label.includes('presidente')?rules.find(r=>r.president):null);
  };
  const icon=key=>'<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+paths[key]+'</svg>';
  let pending=false;
  function apply(){
    pending=false;
    if(!String(location.hash||'').startsWith('#/suspensionTool') &&
      document.body?.dataset?.appRoute!=='suspensionTool')return;
    const root=document.querySelector('#screen .v425-suspension');
    if(!root)return;
    const extras=[];
    for(const el of root.querySelectorAll('button,a')){
      if(el.matches('[data-v1058-ready]')){
        if(el.dataset.v1058Extra==='1')extras.push(el);
        continue;
      }
      const rule=choose(el);
      if(!rule)continue;
      el.dataset.v1058Ready='1';
      if(rule.extra){el.dataset.v1058Extra='1';extras.push(el)}
      el.classList.add('v1058-action-btn');
      if(rule.primary)el.classList.add('v1058-action-primary');
      if(rule.president)el.classList.add('v1058-action-president');
      el.insertAdjacentHTML('afterbegin',icon(rule.icon));
      // Conservar el texto original y los escuchadores instalados por cada función.
      const textNodes=[...el.childNodes].filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
      if(textNodes.length===1){
        const label=document.createElement('span');label.className='v1058-action-label';
        textNodes[0].replaceWith(label);
        label.textContent=textNodes[0].textContent;
      }
    }
    // Sólo convertir en cuadrícula un contenedor de acciones ya existente.
    // Nunca mover botones, reemplazar elementos ni mezclar controles del formulario.
    const parents=new Set(extras.map(el=>el.parentElement).filter(Boolean));
    for(const parent of parents){
      const direct=extras.filter(el=>el.parentElement===parent);
      if(direct.length<2)continue;
      const interactive=[...parent.children].filter(el=>el.matches('button,a'));
      if(interactive.length===direct.length){
        parent.classList.add('v1058-action-grid');
      }
    }
  }
  function schedule(){
    if(pending)return;
    pending=true;
    requestAnimationFrame(apply);
  }
  function boot(){
    const screen=document.querySelector('#screen');
    if(screen)new MutationObserver(schedule).observe(screen,{subtree:true,childList:true});
    window.addEventListener('hashchange',schedule);
    window.addEventListener('pageshow',schedule);
    schedule();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
})();
