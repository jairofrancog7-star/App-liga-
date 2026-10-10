/* V1071 — Administración de la Liga: interfaz compacta sin cambiar permisos ni API.
   Conserva los botones originales y sus manejadores autorizados del servidor. */
(()=>{
'use strict';
if(window.__LJR_ADMIN_MODERN_V1071__)return;
window.__LJR_ADMIN_MODERN_V1071__=true;
const ns='http://www.w3.org/2000/svg';
const glyphs={
 content:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h7M7 16h5"/>',
 publish:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m4 17 6-5 4 3 3-3 3 3"/>',
 live:'<rect x="5" y="4" width="14" height="16" rx="3"/><path d="M10 8.5 15 12l-5 3.5zM9 18h6"/>',
 password:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2"/>',
 devices:'<rect x="2.5" y="5" width="14" height="11" rx="2"/><path d="M7 20h5m-2.5-4v4M18 9h3v11h-6v-2"/>',
 posts:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/>',
 invites:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m4 7 8 6 8-6M8 17h8"/>',
 logout:'<path d="M10 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5M14 8l4 4-4 4m-8-4h12"/>',
 news:'<path d="M4 5h13v15H6a2 2 0 0 1-2-2V5Zm13 3h3v10a2 2 0 0 1-2 2M7 9h7M7 13h7M7 17h4"/>',
 scorers:'<circle cx="12" cy="12" r="9"/><path d="m12 6 4 3-1.5 5H9.5L8 9l4-3Zm-5 10 2.5-2m7 0 2.5 2"/>',
 standings:'<path d="M4 20V9h4v11m4 0V4h4v16m4 0v-7h3v7M2 20h20"/>',
 fixture:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 10h18m-14 4h3m3 0h4M7 18h3"/>',
 sanction:'<path d="m12 3 10 18H2L12 3Zm0 6v5m0 4v.2"/>',
 document:'<path d="M6 3h9l4 4v14H6V3Zm8 0v5h5M9 12h7M9 16h7"/>',
 transmission:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 4h8M9 11l6 3-6 3z"/>',
 product:'<path d="m4 8 8-5 8 5v11l-8 4-8-4V8Zm0 0 8 5 8-5m-8 5v10"/>',
 player:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 3-8 8-8s8 3 8 8"/>',
 team:'<circle cx="8" cy="9" r="3"/><circle cx="17" cy="8" r="2.5"/><path d="M2 21c0-5 2.5-8 6-8 3.4 0 6 3 6 8m0-7c3-1 8 1 8 7"/>',
 page:'<path d="M4 4h16v16H4zM4 9h16m-10 0v11M7 6h1m3 0h1"/>',
 design:'<path d="m3 17 12-12 4 4-12 12H3v-4Zm10-10 4 4M18 4l2 2m-2 2 2 2"/>',
 inbox:'<path d="M3 4h18v15H3zM3 14h5l2 3h4l2-3h5"/>'
};
function icon(name){
 const original=window.LJR_ICONS?.node(name);if(original)return original;
 const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','0 0 24 24');
 svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');
 svg.setAttribute('stroke-width','1.65');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.innerHTML=glyphs[name]||glyphs.content;
 return svg;
}
function styleButton(button,name){
 if(!button||button.dataset.ljrAdminIcon)return;
 button.dataset.ljrAdminIcon=name;
 button.classList.add('ljr-admin-tile');
 const label=document.createElement('span');label.className='ljr-admin-tile-label';
 while(button.firstChild)label.append(button.firstChild);
 const wrap=document.createElement('span');wrap.className='ljr-admin-tile-icon';wrap.append(icon(name));
 button.append(wrap,label);
 const next=document.createElement('span');next.className='ljr-admin-tile-next';next.setAttribute('aria-hidden','true');next.textContent='›';button.append(next);
}
function el(tag,cls,text){
 const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;
}
function improveManage(dialog){
 if(dialog.classList.contains('ljr-admin-manage'))return;
 const content=[...dialog.children].find(x=>x.matches?.('button')&&/Contenido y datos de la Liga/i.test(x.textContent||''));
 const actions=[...dialog.children].filter(x=>x.classList?.contains('liga-media-actions'));
 if(!content||actions.length<2)return;
 dialog.classList.add('ljr-admin-manage');
 const header=dialog.querySelector(':scope > header');
 const intro=el('div','ljr-admin-intro');
 intro.append(el('span','ljr-admin-eyebrow','LIGA MUNICIPAL DE FÚTBOL · CONTROL'));
 const greeting=[...dialog.children].find(x=>x.tagName==='P'&&!x.hasAttribute('data-status'));
 intro.append(el('p','ljr-admin-greeting',greeting?.textContent||'Presidente de la Liga'));
 greeting?.remove();
 header?.after(intro);
 const tools=el('div','ljr-admin-area');
 tools.append(el('h3','ljr-admin-section-title','Gestión y herramientas'));
 tools.append(el('p','ljr-admin-section-sub','Selecciona una herramienta para administrar la Liga.'));
 const grid=el('div','ljr-admin-action-grid');
 const buttons=[content,...actions.flatMap(a=>[...a.querySelectorAll(':scope > button')])];
 const types=['content','publish','live','password','devices','posts','invites','logout'];
 buttons.forEach((button,i)=>{
   const key=button.hasAttribute('data-logout')?'logout':button===content?'content':button.hasAttribute('data-edit')?'publish':button.hasAttribute('data-live')?'live':button.hasAttribute('data-password')?'password':button.hasAttribute('data-devices')?'devices':button.hasAttribute('data-posts')?'posts':button.hasAttribute('data-invites')?'invites':types[i]||'content';
   styleButton(button,key);
   if(key==='logout')button.classList.add('ljr-admin-tile-danger');
   if(key==='content')button.classList.add('ljr-admin-tile-primary');
   grid.append(button);
 });
 tools.append(grid);
 intro.after(tools);actions.forEach(a=>a.remove());
 const title=[...dialog.children].find(x=>x.tagName==='H3'&&/Accesos autorizados/.test(x.textContent||''));
 const users=dialog.querySelector('[data-users]');
 const form=[...dialog.children].find(x=>x.tagName==='FORM');
 if(title&&users&&form){
   const access=el('div','ljr-admin-area ljr-admin-access');
   access.append(title,el('p','ljr-admin-section-sub','Gestiona administradores autorizados. Los permisos por apartado aún requieren soporte del servidor: no compartas contraseñas y autoriza solo a personas de confianza.'));
   access.append(users);
   const details=el('details','ljr-admin-add-details');
   const summary=el('summary','','＋ Añadir administrador');
   details.append(summary,form);
   form.classList.add('ljr-admin-add-form');
   access.append(details);tools.after(access);
   const submit=form.querySelector('button:not([type=button])');
   if(submit)submit.classList.add('ljr-admin-submit');
 }
 const status=dialog.querySelector('[data-status]');
 if(status)status.setAttribute('aria-live','polite');
}
function improveCMS(dialog){
 if(dialog.classList.contains('ljr-admin-cms'))return;
 const grid=dialog.querySelector('.cms-kind-grid');
 const list=grid?.querySelector('[data-cms-list]');
 if(!grid||!list)return;
 dialog.classList.add('ljr-admin-cms');
 const head=dialog.querySelector(':scope > header');
 const intro=el('div','ljr-admin-intro');
 intro.append(el('span','ljr-admin-eyebrow','LIGA JUVENTINO · EDICIÓN OFICIAL'));
 intro.append(el('p','ljr-admin-greeting','Publica y actualiza la información de cada apartado.'));
 head?.after(intro);
 const section=el('div','ljr-admin-area ljr-admin-cms-area');
 section.append(el('h3','ljr-admin-section-title','Contenido y datos'));
 section.append(el('p','ljr-admin-section-sub','Elige la sección que quieres modificar.'));
 grid.before(section);section.append(grid);
 const results=el('div','ljr-admin-results');
 const hint=el('p','ljr-admin-results-hint','Selecciona una sección para ver su contenido y herramientas de edición.');
 results.append(hint,list);section.after(results);
 const buttons=[...grid.querySelectorAll('button')];
 buttons.forEach(button=>{
   const name=button.dataset.cmsKind||'inbox';
   styleButton(button,name);
   button.addEventListener('click',()=>{
     buttons.forEach(x=>x.classList.toggle('is-active',x===button));
     hint.hidden=true;
   });
 });

 const status=dialog.querySelector('[data-status]');
 if(status)status.setAttribute('aria-live','polite');
}
function scan(){
 document.querySelectorAll('.liga-media-modal > section').forEach(dialog=>{
   if(dialog.classList.contains('ljr-admin-manage')||dialog.classList.contains('ljr-admin-cms'))return;
   if(dialog.querySelector('[data-logout]')&&dialog.querySelector('[data-devices]'))improveManage(dialog);
   else if(dialog.querySelector('.cms-kind-grid [data-cms-kind]'))improveCMS(dialog);
   else if(/^(Administración|Mis dispositivos|Publicaciones de la Liga|Cambiar contraseña|Publicar en la Liga|Invitaciones de hospitalidad|Transmitir directamente desde el teléfono)$/i.test(dialog.getAttribute('aria-label')||'')){
     dialog.classList.add('ljr-admin-child');
     dialog.querySelector('[data-status]')?.setAttribute('aria-live','polite');
   }
 });
}
document.addEventListener('click',event=>{
 const btn=event.target instanceof Element?event.target.closest('.ljr-admin-manage [data-revoke],.ljr-admin-manage [data-logout]'):null;
 if(!btn)return;
 const removing=btn.hasAttribute('data-revoke');
 if(!confirm(removing?'¿Revocar el acceso de este administrador?':'¿Cerrar sesión de administración?')){
   event.preventDefault();event.stopImmediatePropagation();
 }
},true);
const observer=new MutationObserver(scan);
function start(){
 if(!document.body)return;
 observer.observe(document.body,{childList:true});
 scan();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});
else start();
})();

/* V1081 · Mejoras progresivas de los modales privados, sin sustituir funciones originales. */
(()=>{
 'use strict';
 if(window.__LJR_ADMIN_V1081__)return;window.__LJR_ADMIN_V1081__=true;
 const lower=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const titles=/administraci[oó]n|publicar en la liga|crear dise[nñ]o nuevo|editar esta p[aá]gina|editar mi p[aá]gina|publicaciones de la liga|cambiar contrase[nñ]a|mis dispositivos|invitaciones de hospitalidad|transmitir directamente|aviso oficial|revisar avisos|noticias|tabla de goleo|tabla de posiciones|c[eé]dulas y documentos/i;
 function studio(dialog){
  dialog.classList.add('ljr-admin-studio');
  const intro=dialog.querySelector('.cms-design-intro');
  if(intro&&!intro.closest('details')){
   const details=document.createElement('details');details.className='ljr-admin-howto';
   const summary=document.createElement('summary');summary.textContent='Cómo crear y descargar el diseño';
   intro.before(details);details.append(summary,intro);
  }
  const presets=dialog.querySelector('.cms-design-presets');
  if(!presets||presets.dataset.ljrV1081)return;
  presets.dataset.ljrV1081='1';
  const buttons=[...presets.querySelectorAll('button[data-design-preset]')];
  const bar=document.createElement('div');bar.className='ljr-admin-preset-tools';
  const search=document.createElement('input');search.type='search';search.placeholder='Buscar diseño…';search.setAttribute('aria-label','Buscar tipo de diseño');
  const count=document.createElement('span');count.className='ljr-admin-preset-count';bar.append(search,count);presets.before(bar);
  const update=()=>{const q=lower(search.value).trim();let n=0;buttons.forEach(b=>{b.hidden=!!q&&!lower(b.textContent).includes(q);if(!b.hidden)n++});count.textContent=n+' diseños'};
  buttons.forEach(b=>{b.setAttribute('aria-pressed','false');b.addEventListener('click',()=>buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b))))});
  search.addEventListener('input',update);update();
 }
 function decorate(dialog){
  if(dialog.dataset.ljrAdminV1081||!window.LJR_MEDIA?.admin)return;
  const title=(dialog.querySelector(':scope > header h2')?.textContent||dialog.getAttribute('aria-label')||'').trim();
  if(!(dialog.matches('.ljr-admin-manage,.ljr-admin-cms,.ljr-admin-child,.ljr-editor-dialog')||
   dialog.querySelector('.cms-design-form,.cms-design-presets,.cms-kind-grid,[data-pick-element],.ljr-editor-form,.cms-table-wrap')||titles.test(title)))return;
  dialog.dataset.ljrAdminV1081='1';dialog.classList.add('ljr-admin-v1081');
  if(dialog.querySelector('.cms-design-presets'))studio(dialog);
  if(/editar esta p[aá]gina/i.test(title))dialog.classList.add('ljr-admin-picker');
  const close=dialog.querySelector(':scope > header [data-close]');
  if(close){close.setAttribute('aria-label','Cerrar '+(title||'administración'));close.title='Cerrar'}
  const status=dialog.querySelector('[data-status]');if(status)status.setAttribute('aria-live','polite');
  dialog.querySelectorAll('input[type=file]').forEach(input=>{
   if(input.dataset.ljrUploadV1081)return;input.dataset.ljrUploadV1081='1';
   const hint=document.createElement('small');hint.className='ljr-admin-upload-name';hint.setAttribute('aria-live','polite');
   input.after(hint);const update=()=>{hint.textContent=[...(input.files||[])].map(f=>f.name).join(' · ')};
   input.addEventListener('change',update);update();
  });
 }
 let pending=false;
 function scan(){if(!window.LJR_MEDIA?.admin)return;document.querySelectorAll('.liga-media-modal>section').forEach(decorate)}
 function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;scan()})}
 function start(){new MutationObserver(schedule).observe(document.body,{childList:true,subtree:true});scan()}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
 window.addEventListener('liga:admin',schedule);
})();
