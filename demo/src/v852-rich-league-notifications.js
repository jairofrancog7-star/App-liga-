/* V852 — Liga Juventino rich editorial notifications.
   OneFootball-inspired notification center, but using Liga Juventino identity.
   Published records are managed by the existing authenticated CMS. */
(()=>{
'use strict';
if(window.__LJR_V852_RICH_EDITORIAL_NOTIFICATIONS__)return;
window.__LJR_V852_RICH_EDITORIAL_NOTIFICATIONS__=true;

const BUILD='v852';
const KIND='notification';
const SEEN='ljr-rich-cms-seen-v852';
const INIT='ljr-rich-cms-init-v852';
const EXPANDED='ljr-rich-expanded-v852';
const DEFAULT_ICON='./icons/icon-192.png';
let renderTimer=0,syncing=false,lastRecords=[];

const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body?.dataset?.appRoute||'home';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||'null')??d}catch(_){return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const media=()=>window.LJR_MEDIA||null;
const cms=()=>window.LJR_CMS||null;

function records(){
  const all=Array.isArray(cms()?.records)?cms().records:lastRecords;
  return (all||[]).filter(x=>x&&x.kind===KIND&&x.published).sort((a,b)=>{
    const at=Number(a?.payload?.updatedAt||a?.payload?.createdAt||a?.updated||a?.created||0);
    const bt=Number(b?.payload?.updatedAt||b?.payload?.createdAt||b?.updated||b?.created||0);
    return bt-at;
  });
}
function iconFor(p={}){
  if(p.icon)return p.icon;
  const type=String(p.type||'').toLowerCase();
  if(type==='resultado'||type==='partido')return './icons/icon-192.png';
  return DEFAULT_ICON;
}
function typeIcon(type=''){
  return ({resultado:'⚽',partido:'🏟️',urgente:'🚨',evento:'📅',transmision:'📺',noticia:'📰',aviso:'🔔'})[String(type).toLowerCase()]||'🔔';
}
function typeLabel(type=''){
  return ({resultado:'RESULTADO',partido:'PARTIDO',urgente:'URGENTE',evento:'EVENTO',transmision:'TRANSMISIÓN',noticia:'NOTICIA',aviso:'AVISO'})[String(type).toLowerCase()]||'LIGA';
}
function timeValue(rec){
  return Number(rec?.payload?.updatedAt||rec?.payload?.createdAt||rec?.updated||rec?.created||0)||Date.now();
}
function timeText(rec){
  const ts=timeValue(rec),diff=Math.max(0,Date.now()-ts),m=Math.floor(diff/60000);
  if(m<1)return 'ahora';
  if(m<60)return m+' min';
  const h=Math.floor(m/60);if(h<24)return h+' h';
  const d=Math.floor(h/24);if(d<7)return d+' d';
  try{return new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short'}).format(new Date(ts))}catch(_){return ''}
}
function safeRoute(v){
  const s=String(v||'notifications').trim().replace(/^#\/?/,'').replace(/^\//,'');
  return s||'notifications';
}
function payload(rec){return rec?.payload||{}}

async function syncPublished(){
  if(syncing)return;
  syncing=true;
  try{
    const all=Array.isArray(cms()?.records)?cms().records:[];
    if(!all.length)return;
    lastRecords=all;
    const list=all.filter(x=>x&&x.kind===KIND&&x.published);
    const seen=read(SEEN,{});
    const initialized=localStorage.getItem(INIT)==='1';
    let changed=false;
    for(const rec of list){
      const rev=String(rec.revision??rec.updated??rec?.payload?.updatedAt??'1');
      if(!initialized){
        seen[rec.id]=rev;changed=true;continue;
      }
      if(seen[rec.id]===rev)continue;
      seen[rec.id]=rev;changed=true;
      const p=payload(rec);
      if(window.LJR_V840_NOTIFICATIONS?.sendRich){
        await window.LJR_V840_NOTIFICATIONS.sendRich({
          title:String(p.title||'Liga Juventino Rosas'),
          body:String(p.body||'Nueva actualización de la Liga.'),
          imageUrl:String(p.image||''),
          iconUrl:String(iconFor(p)||DEFAULT_ICON),
          group:'liga-'+String(p.type||'avisos').toLowerCase().replace(/[^a-z0-9]+/g,'-')
        });
      }
    }
    if(!initialized){localStorage.setItem(INIT,'1');changed=true}
    if(changed)write(SEEN,seen);
    render();
  }finally{syncing=false}
}

function recordMarkup(rec){
  const p=payload(rec),expanded=read(EXPANDED,{})[rec.id]===true;
  const img=String(p.image||''),icon=String(iconFor(p)||DEFAULT_ICON);
  return '<article class="v852-notice '+(expanded?'is-expanded':'')+'" data-v852-record="'+esc(rec.id)+'">'+
    '<button type="button" class="v852-notice-main" data-v852-toggle="'+esc(rec.id)+'">'+
      '<span class="v852-thumb">'+(img?'<img src="'+esc(img)+'" alt="" loading="lazy" decoding="async">':'<img src="'+esc(icon)+'" alt="" loading="lazy" decoding="async">')+'</span>'+
      '<span class="v852-copy">'+
        '<span class="v852-title-line"><b>'+esc(p.title||'Liga Juventino Rosas')+'</b><small>· '+esc(timeText(rec))+'</small></span>'+
        '<span class="v852-body">'+esc(p.body||'Actualización de la Liga Juventino Rosas')+'</span>'+
      '</span>'+
      '<span class="v852-chevron" aria-hidden="true">'+(expanded?'⌃':'⌄')+'</span>'+
    '</button>'+
    (expanded?'<div class="v852-expanded">'+
      '<div class="v852-expanded-meta"><span>'+typeIcon(p.type)+' '+esc(typeLabel(p.type))+'</span><small>Liga Juventino Rosas</small></div>'+
      '<h3>'+esc(p.title||'Liga Juventino Rosas')+'</h3>'+
      '<p>'+esc(p.body||'')+'</p>'+
      (img?'<img class="v852-hero-image" src="'+esc(img)+'" alt="'+esc(p.title||'Aviso de la Liga')+'" loading="eager" decoding="async">':'')+
      '<button type="button" class="v852-open" data-v852-open="'+esc(safeRoute(p.route))+'">Abrir en la app</button>'+
    '</div>':'')+
  '</article>';
}
function feedMarkup(){
  const list=records().slice(0,12);
  const isAdmin=!!media()?.admin;
  return '<section class="v852-feed" data-v852-feed>'+
    '<header class="v852-feed-head">'+
      '<span class="v852-brand"><img src="'+DEFAULT_ICON+'" alt=""><span><small>LIGA JUVENTINO ROSAS</small><b>Noticias y avisos</b></span></span>'+
      (isAdmin?'<button type="button" class="v852-admin-btn" data-v852-admin>+ Crear aviso</button>':'')+
    '</header>'+
    '<div class="v852-feed-list">'+
      (list.length?list.map(recordMarkup).join(''):'<div class="v852-empty"><span>🔔</span><b>Aquí aparecerán los avisos oficiales</b><small>Resultados, partidos, noticias, transmisiones y comunicados de la Liga.</small></div>')+
    '</div>'+
  '</section>';
}
function host(){
  return document.querySelector('.v46-ref-notifications-main')||
         document.querySelector('.v414-notifications')||
         document.querySelector('[data-v46-account="notifications"]')||
         document.querySelector('#screen');
}
function render(){
  if(route()!=='notifications')return;
  const h=host();if(!h)return;
  h.querySelector('[data-v852-feed]')?.remove();
  const match=h.querySelector('[data-v840-feed]');
  if(match)match.insertAdjacentHTML('beforebegin',feedMarkup());
  else{
    const device=h.querySelector('.v46-ref-device,.v414-device-card');
    if(device)device.insertAdjacentHTML('afterend',feedMarkup());
    else h.insertAdjacentHTML('afterbegin',feedMarkup());
  }
  bind(h.querySelector('[data-v852-feed]'));
}
function bind(root){
  if(!root)return;
  root.querySelectorAll('[data-v852-toggle]').forEach(b=>b.addEventListener('click',()=>{
    const id=b.dataset.v852Toggle,st=read(EXPANDED,{});
    st[id]=!st[id];write(EXPANDED,st);render();
  }));
  root.querySelectorAll('[data-v852-open]').forEach(b=>b.addEventListener('click',e=>{
    e.stopPropagation();location.hash='#/'+safeRoute(b.dataset.v852Open);
  }));
  root.querySelector('[data-v852-admin]')?.addEventListener('click',()=>openAdmin());
}

async function adminRecords(){
  if(!media()?.admin)return [];
  try{
    const data=await media().api('content?admin=1');
    const list=Array.isArray(data?.items)?data.items:[];
    lastRecords=list;
    return list.filter(x=>x?.kind===KIND).sort((a,b)=>timeValue(b)-timeValue(a));
  }catch(_){return []}
}
function closeAdmin(){document.querySelector('[data-v852-admin-modal]')?.remove()}
function formHtml(rec){
  const p=rec?.payload||{};
  return '<form class="v852-admin-form" data-v852-form>'+
    '<label><span>Tipo de aviso</span><select name="type">'+
      ['aviso','partido','resultado','noticia','evento','transmision','urgente'].map(v=>'<option value="'+v+'" '+(p.type===v?'selected':'')+'>'+typeIcon(v)+' '+typeLabel(v)+'</option>').join('')+
    '</select></label>'+
    '<label><span>Título</span><input name="title" maxlength="90" required value="'+esc(p.title||'')+'" placeholder="Ej. ¡Partidazo este domingo!"></label>'+
    '<label><span>Texto</span><textarea name="body" rows="4" maxlength="260" required placeholder="Escribe el mensaje que verán los aficionados">'+esc(p.body||'')+'</textarea></label>'+
    '<label><span>Imagen principal</span><input name="image" type="url" value="'+esc(p.image||'')+'" placeholder="https://..."></label>'+
    '<label class="v852-file"><span>O subir imagen desde el teléfono</span><input data-v852-file type="file" accept="image/jpeg,image/png,image/webp"></label>'+
    '<label><span>Icono / escudo</span><input name="icon" type="url" value="'+esc(p.icon||'')+'" placeholder="Opcional · PNG sin fondo"></label>'+
    '<label><span>Al tocar abrir</span><select name="route">'+
      [['notifications','Notificaciones'],['home','Inicio'],['competition','Competición'],['scorers','Goleadores'],['video','Vídeo'],['match','Match Center'],['calendar','Calendario']].map(([v,n])=>'<option value="'+v+'" '+((p.route||'notifications')===v?'selected':'')+'>'+n+'</option>').join('')+
    '</select></label>'+
    '<label class="v852-publish"><input name="published" type="checkbox" '+(!rec||rec.published?'checked':'')+'> <span>Publicar para todos</span></label>'+
    '<div class="v852-admin-actions"><button type="button" data-v852-preview>Vista previa</button><button type="submit" class="primary">'+(rec?'Guardar cambios':'Publicar aviso')+'</button></div>'+
  '</form>';
}
function previewFromForm(form){
  const data=Object.fromEntries(new FormData(form));
  const p={...data};
  const box=document.querySelector('[data-v852-preview-box]');if(!box)return;
  box.innerHTML='<div class="v852-preview-card">'+
    '<div class="v852-preview-top"><img src="'+esc(p.icon||DEFAULT_ICON)+'" alt=""><b>Liga Juventino Rosas</b><small>ahora</small></div>'+
    '<h3>'+esc(p.title||'Título del aviso')+'</h3>'+
    '<p>'+esc(p.body||'Aquí se verá el texto del aviso.')+'</p>'+
    (p.image?'<img class="v852-preview-image" src="'+esc(p.image)+'" alt="">':'')+
  '</div>';
}
async function saveAdmin(form,rec,status){
  const btn=form.querySelector('[type="submit"]');btn.disabled=true;
  try{
    const data=Object.fromEntries(new FormData(form));
    let image=String(data.image||'').trim();
    const file=form.querySelector('[data-v852-file]')?.files?.[0];
    if(file){
      if(!cms()?.upload)throw Error('El cargador de imágenes aún no está listo.');
      status.textContent='Subiendo imagen…';
      image=await cms().upload(file,data.title||'Aviso Liga Juventino');
    }
    const now=Date.now();
    const payload={
      type:String(data.type||'aviso'),
      title:String(data.title||'Liga Juventino Rosas').trim(),
      body:String(data.body||'').trim(),
      image,
      icon:String(data.icon||'').trim(),
      route:safeRoute(data.route),
      createdAt:Number(rec?.payload?.createdAt||now),
      updatedAt:now
    };
    const id=rec?.id||'notification:'+crypto.randomUUID();
    const result=await media().api('content/'+encodeURIComponent(id),{
      method:'PUT',
      body:{kind:KIND,payload,revision:rec?.revision||0,published:data.published==='on'}
    });
    status.textContent='Aviso guardado. Se mostrará en la Liga azul.';
    if(cms()?.refresh)await cms().refresh();
    if(data.published==='on'&&window.LJR_V840_NOTIFICATIONS?.sendRich){
      await window.LJR_V840_NOTIFICATIONS.sendRich({
        title:payload.title,body:payload.body,imageUrl:payload.image,iconUrl:payload.icon||DEFAULT_ICON,
        group:'liga-'+payload.type
      });
      const seen=read(SEEN,{});
      seen[id]=String(result?.revision??rec?.revision??payload.updatedAt);
      write(SEEN,seen);
    }
    setTimeout(()=>{closeAdmin();render()},700);
  }catch(err){status.textContent=err?.message||'No se pudo guardar el aviso.';btn.disabled=false}
}
async function removeAdmin(rec,status){
  if(!rec||!confirm('¿Retirar este aviso de la Liga?'))return;
  try{
    await media().api('content/'+encodeURIComponent(rec.id),{method:'DELETE',body:{revision:rec.revision}});
    status.textContent='Aviso retirado.';
    if(cms()?.refresh)await cms().refresh();
    openAdmin();
  }catch(err){status.textContent=err?.message||'No se pudo retirar.'}
}
async function openAdmin(editRec=null){
  if(!media()?.admin){
    media()?.login?.(()=>openAdmin(editRec));
    return;
  }
  closeAdmin();
  const overlay=document.createElement('div');
  overlay.className='v852-admin-modal';overlay.dataset.v852AdminModal='';
  overlay.innerHTML='<section class="v852-admin-sheet">'+
    '<header><div><small>ADMINISTRADOR</small><h2>Notificaciones de la Liga</h2><p>Texto, imagen e icono editables para la Liga azul.</p></div><button type="button" data-v852-close aria-label="Cerrar">×</button></header>'+
    '<div class="v852-admin-grid"><div>'+formHtml(editRec)+'</div><aside><h3>Vista previa</h3><div data-v852-preview-box></div><div class="v852-existing" data-v852-existing><small>Cargando avisos…</small></div></aside></div>'+
    '<p class="v852-status" data-v852-status></p>'+
  '</section>';
  document.body.appendChild(overlay);
  overlay.querySelector('[data-v852-close]').onclick=closeAdmin;
  overlay.addEventListener('click',e=>{if(e.target===overlay)closeAdmin()});
  const form=overlay.querySelector('[data-v852-form]'),status=overlay.querySelector('[data-v852-status]');
  previewFromForm(form);
  form.addEventListener('input',()=>previewFromForm(form));
  form.querySelector('[data-v852-preview]').onclick=async()=>{
    previewFromForm(form);
    const d=Object.fromEntries(new FormData(form));
    if(window.LJR_V840_NOTIFICATIONS?.sendRich){
      const ok=await window.LJR_V840_NOTIFICATIONS.sendRich({title:d.title||'Liga Juventino Rosas',body:d.body||'Vista previa',imageUrl:d.image||'',iconUrl:d.icon||DEFAULT_ICON,group:'liga-preview'});
      status.textContent=ok?'Vista previa enviada al dispositivo.':'Vista previa lista en pantalla.';
    }
  };
  form.onsubmit=e=>{e.preventDefault();saveAdmin(form,editRec,status)};
  const list=await adminRecords(),wrap=overlay.querySelector('[data-v852-existing]');
  wrap.innerHTML='<h3>Avisos guardados</h3>'+(list.length?list.slice(0,8).map(r=>{
    const p=payload(r);
    return '<div class="v852-existing-row"><span><b>'+esc(p.title||'Aviso')+'</b><small>'+esc(typeLabel(p.type))+(r.published?' · Publicado':' · Borrador')+'</small></span><button type="button" data-v852-edit="'+esc(r.id)+'">Editar</button><button type="button" data-v852-remove="'+esc(r.id)+'">×</button></div>'
  }).join(''):'<small>Aún no hay avisos creados.</small>');
  wrap.querySelectorAll('[data-v852-edit]').forEach(b=>b.onclick=()=>openAdmin(list.find(r=>r.id===b.dataset.v852Edit)));
  wrap.querySelectorAll('[data-v852-remove]').forEach(b=>b.onclick=()=>removeAdmin(list.find(r=>r.id===b.dataset.v852Remove),status));
}

function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(render,60)}
window.addEventListener('hashchange',scheduleRender);
window.addEventListener('liga:content',()=>{syncPublished();scheduleRender()});
window.addEventListener('liga:admin',scheduleRender);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){syncPublished();scheduleRender()}});
window.addEventListener('focus',()=>{syncPublished();scheduleRender()});
new MutationObserver(()=>{if(route()==='notifications')scheduleRender()}).observe(document.documentElement,{childList:true,subtree:true});
window.LJR_V852_RICH_NOTIFICATIONS={render,sync:syncPublished,openAdmin,build:BUILD};
setTimeout(()=>{syncPublished();render()},450);
setTimeout(()=>{syncPublished();render()},1600);
})();
