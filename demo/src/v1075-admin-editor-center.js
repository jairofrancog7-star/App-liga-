/* V1075 — Centro editorial sin codigo. Usa API del servidor con sesion verificada.
   Los visitantes nunca reciben controles de escritura; los avisos programados del
   navegador siguen siendo LOCALES, no una publicacion remota garantizada. */
(()=>{
'use strict';
if(window.__LJR_V1075_EDITOR__)return;
window.__LJR_V1075_EDITOR__=true;
const CATS=[['all','Todas las categorías'],['3','Primera Fuerza'],['5','Intermedia'],['4','Segunda Fuerza'],['2','Veteranos 35+'],['1','Veteranos 50+']];
const TYPES={
 jornada:['Jornada','Aviso de jornada','Se informa a los equipos la programación de la jornada.'],
 horario:['Cambio de horario','Cambio de horario','Se informa una modificación de horario.'],
 cancha:['Cambio de cancha','Cambio de cancha','Se informa un cambio de cancha o sede.'],
 suspension:['Suspensión','Aviso de suspensión','Se informa una suspensión que requiere atención de los equipos.'],
 resultados:['Resultados','Resultados oficiales','Se informa la actualización de resultados oficiales.'],
 junta:['Junta','Convocatoria a junta','Se convoca a los delegados a una junta de la Liga.'],
 registro:['Inscripciones','Aviso de inscripciones','Se informa una actualización del registro de jugadores.'],
 clima:['Clima','Aviso por condiciones climáticas','Se informa una medida relacionada con las condiciones climáticas.']
};
const $=(s,r=document)=>r.querySelector(s);
const admin=()=>!!window.LJR_MEDIA?.admin;
const media=()=>window.LJR_MEDIA;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateString=s=>{try{return s?new Date(s+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}):''}catch(_){return ''}};
const catName=v=>CATS.find(x=>x[0]===v)?.[1]||'Todas las categorías';
function status(modal,value){const box=$('[data-status]',modal);if(box)box.textContent=value}
async function verified(){
 if(!admin())throw Error('Solo los administradores autorizados pueden editar la Liga.');
 const response=await media().api('me');
 if(!response?.admin)throw Error('La sesión de administración expiró. Vuelve a entrar.');
 return response.admin;
}
function createModal(title,html,className){
 const modal=media().modal(title,html);
 modal.querySelector('section')?.classList.add('ljr-editor-dialog',className);
 return modal;
}
function showComposer(prefill){
 if(!admin())return media()?.login?.(()=>showComposer(prefill));
 const choices=Object.entries(TYPES).map(([key,val])=>'<option value="'+key+'">'+esc(val[0])+'</option>').join('');
 const modal=createModal('Crear aviso oficial','<form class="ljr-editor-form" data-editor-form>'+
  '<p class="ljr-editor-note">Sin programar: escribe, revisa y confirma. La publicación aparecerá en Noticias de toda la Liga; un borrador queda privado en el servidor.</p>'+
  '<div class="ljr-editor-two">'+
  '<label>Tipo de aviso<select name="type">'+choices+'</select></label>'+
  '<label>Categoría<select name="category">'+CATS.map(x=>'<option value="'+x[0]+'">'+esc(x[1])+'</option>').join('')+'</select></label>'+
  '<label>Jornada (opcional)<input name="round" inputmode="numeric" type="number" min="1" max="60" placeholder="Ej. 12"></label>'+
  '<label>Fecha del evento (opcional)<input type="date" name="date"></label>'+
  '<label>Hora (opcional)<input type="time" name="time"></label>'+
  '<label>Cancha / sede (opcional)<input name="field" maxlength="110" placeholder="Ej. Campo 3"></label>'+
  '</div>'+
  '<label>Detalles confirmados<textarea name="details" rows="2" maxlength="1200" placeholder="Escribe el cambio o la información oficial. No se inventan resultados."></textarea></label>'+
  '<div class="ljr-editor-tools"><button type="button" data-generate="formal">Generar comunicado</button><button type="button" data-generate="short">Versión corta</button><button type="button" data-generate="urgent">Aviso urgente</button></div>'+
  '<label>Título<input name="title" required maxlength="160"></label>'+
  '<label>Mensaje<textarea name="body" required rows="5" minlength="15" maxlength="4000"></textarea></label>'+
  '<label>Mostrar en<select name="scope"><option value="Liga">Liga</option><option value="Equipos">Equipos</option><option value="Fichajes">Fichajes</option></select></label>'+
  '<div class="ljr-editor-preview"><small>VISTA PREVIA · NOTICIAS</small><strong data-preview-title></strong><p data-preview-body></p><small data-preview-meta></small></div>'+
  '<div class="ljr-editor-bottom"><button type="button" data-editor-draft>Guardar borrador</button><button type="submit" data-editor-publish>Publicar en Noticias</button></div>'+
  '<small>Las notificaciones push fuera del navegador no se envían desde este formulario. Para eso se necesita un servicio de envío configurado.</small>'+
  '</form>','ljr-editor-compose');
 const form=$('[data-editor-form]',modal);
 const title=$('[name=title]',form),body=$('[name=body]',form);
 let savedId='', savedRevision=0, saving=false;
 const updatePreview=()=>{
  $('[data-preview-title]',form).textContent=title.value||'Título del aviso';
  $('[data-preview-body]',form).textContent=body.value||'Aquí aparecerá el comunicado oficial.';
  $('[data-preview-meta]',form).textContent=catName(form.elements.category.value)+' · '+form.elements.scope.value;
 };
 function generate(mode='formal'){
  const f=form.elements,t=TYPES[f.type.value]||TYPES.jornada,parts=[];
  if(f.category.value!=='all')parts.push(catName(f.category.value));
  const round=Number(f.round.value);if(Number.isInteger(round)&&round>=1&&round<=60)parts.push('Jornada '+round);
  if(f.field.value.trim())parts.push('Sede: '+f.field.value.trim());
  if(f.date.value)parts.push(dateString(f.date.value));
  if(f.time.value)parts.push('Hora: '+f.time.value);
  const details=f.details.value.trim().replace(/\s+/g,' ');
  const intro=mode==='urgent'?'ATENCIÓN. ':mode==='formal'?'La Liga Municipal de Fútbol Juventino Rosas A.C. informa: ':'';
  title.value=(mode==='urgent'?'URGENTE · ':'')+t[1];
  body.value=(intro+t[2]+' '+(parts.length?parts.join(' · ')+'. ':'')+
   (details?details+'. ':'')+
   (mode==='formal'?'Consulta esta información en la página oficial de la Liga.':'')).replace(/\s+/g,' ').trim();
  updatePreview();
 }
 form.querySelectorAll('[data-generate]').forEach(b=>b.onclick=()=>generate(b.dataset.generate));
 form.addEventListener('input',updatePreview);form.addEventListener('change',updatePreview);
 generate('formal');
 // V1077: importación opcional del aviso de suspensión, sin publicar ni eludir la API.
 // Solo se rellenan campos del formulario; el administrador debe revisar y pulsar Publicar.
 if(prefill&&typeof prefill==='object'&&!Array.isArray(prefill)){
  const values={type:'suspension',category:String(prefill.category||'all'),round:String(prefill.round||''),date:String(prefill.date||''),time:String(prefill.time||''),field:String(prefill.field||'').slice(0,110)};
  for(const [key,value] of Object.entries(values)){
   const field=form.elements[key];if(!field)continue;
   if(field.tagName==='SELECT'&&![...field.options].some(o=>o.value===value))continue;
   field.value=value;
  }
  form.elements.details.value=String(prefill.details||'').slice(0,1200);
  title.value=String(prefill.title||'Aviso de suspensión').slice(0,160);
  body.value=String(prefill.body||'').slice(0,4000);
  updatePreview();
 }
 async function save(published){
  if(saving||!form.reportValidity())return;
  if(body.value.trim().length<15){status(modal,'Agrega un mensaje de por lo menos 15 caracteres.');return}
  if(published&&!form.elements.details.value.trim()){status(modal,'Antes de publicar, escribe los detalles oficiales confirmados del aviso.');form.elements.details.focus();return}
  const buttons=form.querySelectorAll('[data-editor-draft],[data-editor-publish]');
  saving=true;buttons.forEach(x=>x.disabled=true);
  status(modal,'Verificando permiso y guardando…');
  try{
   await verified();
   const id=savedId||'content:'+crypto.randomUUID();
   const payload={title:title.value.trim(),body:body.value.trim(),scope:form.elements.scope.value,
    category:form.elements.category.value,type:form.elements.type.value};
   const result=await media().api('content/'+encodeURIComponent(id),{method:'PUT',body:{kind:'news',payload,revision:savedRevision,published}});
   savedId=id;savedRevision=Number(result?.revision??savedRevision+1);
   await window.LJR_CMS?.refresh?.();
   status(modal,published?'Aviso publicado en Noticias.':'Borrador privado guardado. Ábrelo desde Revisar avisos.');
   form.querySelector('[data-editor-publish]').textContent=published?'Publicado ✓':'Publicar en Noticias';
   form.querySelector('[data-editor-draft]').textContent=published?'Guardar borrador':'Guardado ✓';
   if(published){window.dispatchEvent(new Event('liga:content'));setTimeout(()=>{if(modal.isConnected)modal.querySelector('[data-close]')?.click()},900);}
   else buttons.forEach(x=>x.disabled=false);
  }catch(err){
   status(modal,'No se guardó el aviso: '+(err?.message||'Error de conexión'));
   buttons.forEach(x=>x.disabled=false);
   if([401,403].includes(err?.status))media()?.login?.();
  }finally{saving=false}
 }
 form.onsubmit=ev=>{ev.preventDefault();save(true)};
 $('[data-editor-draft]',form).onclick=()=>save(false);
}
function openReview(){
 if(!admin())return media()?.login?.(openReview);
 const modal=createModal('Revisar avisos','<div class="ljr-editor-review">'+
  '<p class="ljr-editor-note">Avisos guardados en el servidor de la Liga. Solo los administradores pueden editar, publicar o retirar.</p>'+
  '<div class="ljr-editor-tools"><button type="button" data-state="all" aria-pressed="true">Todos</button><button type="button" data-state="draft">Borradores</button><button type="button" data-state="published">Publicados</button></div>'+
  '<div data-editor-list aria-live="polite">Cargando avisos…</div>'+
  '<button type="button" data-reload>Actualizar lista</button>'+
  '</div>','ljr-editor-review-dialog');
 let records=[],filter='all',loading=false;
 const list=$('[data-editor-list]',modal);
 function paint(){
  list.replaceChildren();
  const shown=records.filter(x=>filter==='all'||(filter==='published'?!!x.published:!x.published));
  if(!shown.length){const p=document.createElement('p');p.className='ljr-editor-empty';p.textContent='No hay avisos en este filtro.';list.append(p);return}
  shown.slice(0,40).forEach(record=>{
   const card=document.createElement('article');card.className='ljr-editor-row';
   const info=document.createElement('div'),label=document.createElement('strong'),sub=document.createElement('small');
   label.textContent=record.payload?.title||'Aviso sin título';
   sub.textContent=(record.published?'Publicado':'Borrador')+' · '+catName(String(record.payload?.category||'all'));
   info.append(label,sub);card.append(info);
   const actions=document.createElement('div');actions.className='ljr-editor-row-actions';
   const edit=document.createElement('button');edit.type='button';edit.textContent='Editar';
   edit.onclick=()=>window.LJR_CMS?.editor?.('news',record);
   actions.append(edit);
   if(!record.published){
    const publish=document.createElement('button');publish.type='button';publish.textContent='Publicar';
    publish.onclick=async()=>{
     if(!confirm('¿Publicar este aviso para todos los visitantes?'))return;
     publish.disabled=true;status(modal,'Guardando publicación…');
     try{
      await verified();
      await media().api('content/'+encodeURIComponent(record.id),{method:'PUT',body:{
       kind:'news',payload:record.payload,revision:record.revision,published:true}});
      await window.LJR_CMS?.refresh?.();await reload();
      status(modal,'Aviso publicado en Noticias.');
     }catch(err){status(modal,'No se pudo publicar: '+(err?.message||'Error'));publish.disabled=false}
    };actions.append(publish);
   }
   const remove=document.createElement('button');remove.type='button';
   remove.textContent=record.published?'Retirar':'Eliminar';
   remove.title=record.published?'Ocultar esta publicación en toda la Liga':'Eliminar borrador';
   remove.onclick=async()=>{
    if(!confirm(record.published?'¿Retirar este aviso de Noticias para todos los visitantes?':'¿Eliminar este borrador?'))return;
    remove.disabled=true;status(modal,'Retirando aviso…');
    try{
     await verified();
     await media().api('content/'+encodeURIComponent(record.id),{method:'DELETE',body:{revision:record.revision}});
     await window.LJR_CMS?.refresh?.();await reload();
     status(modal,'Aviso retirado correctamente.');
    }catch(err){status(modal,'No se pudo retirar: '+(err?.message||'Error'));remove.disabled=false}
   };
   actions.append(remove);
   card.append(actions);list.append(card);
  });
 }
 async function reload(){
  if(loading)return;loading=true;list.textContent='Consultando avisos…';
  try{
   await verified();
   const result=await media().api('content?admin=1');
   if(!Array.isArray(result.items))throw Error('El servidor no devolvió un listado válido.');
   records=result.items.filter(x=>x.kind==='news').sort((a,b)=>
    String(b.updated||b.updatedAt||b.created||'').localeCompare(String(a.updated||a.updatedAt||a.created||'')));
   paint();
  }catch(err){list.textContent='No se pueden consultar los avisos: '+(err?.message||'Error de conexión')}
  finally{loading=false}
 }
 $('[data-reload]',modal).onclick=reload;
 modal.querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>{
  filter=b.dataset.state;modal.querySelectorAll('[data-state]').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));paint();
 });
 reload();
}

/* Editor visual para administradores que no conocen rutas ni programación. */
const SECTIONS=[
 ['Inicio','home','news'],['Noticias y avisos','news','news'],
 ['Competición','competition','fixture'],['Jornadas y resultados','competition','fixture'],
 ['Clasificación','competition','standings'],['Goleadores','scorers','scorers'],
 ['Equipos','teams','team'],['Jugadores','players','player'],
 ['Sancionados','discipline','sanction'],['Cédulas y documentos','cedulas','document'],
 ['Vídeos y transmisiones','video','transmission'],['Historia','history','page'],
 ['Tienda','club-store','product'],['Match Center','match','fixture'],
 ['Más y herramientas','more','page']
];
function openPages(){
 if(!admin())return media()?.login?.(openPages);
 const options=SECTIONS.map((x,i)=>'<option value="'+i+'">'+esc(x[0])+'</option>').join('');
 const modal=createModal('Editar mi página','<section class="ljr-editor-review">'+
 '<p class="ljr-editor-note">Elige una sección. Puedes modificar su información oficial o tocar directamente textos, imágenes y tarjetas sin programar.</p>'+
 '<label class="ljr-editor-target">Sección de la aplicación<select data-section>'+options+'</select></label>'+
 '<div class="ljr-editor-two-choice">'+
 '<button type="button" data-page-content>Editar información</button>'+
 '<button type="button" data-page-visual>Editar diseño en pantalla</button></div>'+
 '<small class="ljr-editor-note">Solo se publican cambios cuando los guardas. Las ediciones necesitan una sesión verificada por el servidor.</small>'+
 '</section>','ljr-editor-page-picker');
 const select=$('[data-section]',modal);
 async function execute(mode){
  const item=SECTIONS[Number(select.value)];
  if(!item)return;
  try{
   await verified();
   if(mode==='content'){
    window.LJR_CMS?.open?.(item[2]);
    modal.querySelector('[data-close]')?.click();
   }else{
    modal.querySelector('[data-close]')?.click();
    location.hash='#/'+item[1];
    setTimeout(()=>{
     if(!admin()||!window.LJR_CMS?.editPage)return;
     window.LJR_CMS.editPage();
    },550);
   }
  }catch(err){status(modal,'No se puede editar: '+(err?.message||'Error de sesión'))}
 }
 $('[data-page-content]',modal).onclick=()=>execute('content');
 $('[data-page-visual]',modal).onclick=()=>execute('visual');
}
/* Exportación voluntaria de respaldo, nunca a una dirección externa. */
async function exportBackup(){
 if(!admin())return media()?.login?.(exportBackup);
 if(!confirm('Se descargará un archivo JSON con contenido de administración que podría incluir datos personales de jugadores. Guárdalo en un lugar privado. ¿Continuar?'))return;
 try{
  const who=await verified();
  if(!who.owner)throw Error('El respaldo completo solo puede exportarlo el presidente.');
  const data=await media().api('content?admin=1');
  if(!Array.isArray(data.items))throw Error('El servidor no devolvió los registros esperados.');
  const dump={schema:'ljr-admin-backup-v1',exportedAt:new Date().toISOString(),records:data.items};
  const url=URL.createObjectURL(new Blob([JSON.stringify(dump,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='liga-juventino-respaldo-'+new Date().toISOString().slice(0,10)+'.json';
  document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
 }catch(err){alert('No se pudo descargar el respaldo: '+(err?.message||'Error'))}
}

function openScheduler(origin){
 if(!admin())return media()?.login?.(()=>openScheduler(origin));
 origin?.closest('.liga-media-modal')?.querySelector('[data-close]')?.click();
 location.hash='#/notifications';
}
function addPanel(dialog){
 if(!admin()||dialog.querySelector('[data-ljr-editor-center]'))return;
 const home=dialog.querySelector('.ljr-admin-area');
 if(!home)return;
 const box=document.createElement('section');box.className='ljr-admin-area ljr-editor-hub';
 box.setAttribute('data-ljr-editor-center','');
 box.innerHTML='<h3 class="ljr-admin-section-title">Avisos y automatización</h3>'+
  '<p class="ljr-admin-section-sub">Publica sin programar, gestiona borradores y configura avisos desde el teléfono.</p>'+
  '<div class="ljr-editor-hub-grid">'+
  '<button type="button" data-editor-open="compose"><b>✎</b><span>Crear aviso<small>Texto guiado y publicación</small></span></button>'+
  '<button type="button" data-editor-open="review"><b>✓</b><span>Revisar avisos<small>Borradores y publicados</small></span></button>'+
  '<button type="button" data-editor-open="schedule"><b>◷</b><span>Programar avisos<small>Recordatorios en este teléfono</small></span></button>'+ 
  '<button type="button" data-editor-open="page"><b>▣</b><span>Editar páginas<small>Texto, fotos y secciones</small></span></button>'+ 
  (media()?.admin?.owner?'<button type="button" data-editor-open="backup"><b>↓</b><span>Respaldo privado<small>Solo presidente</small></span></button>':'')+'</div>'+
  '<p class="ljr-editor-security">🔒 Los visitantes solo consultan información. Editar y publicar requiere una sesión autorizada y permiso del servidor.</p>';
 home.after(box);
 box.addEventListener('click',event=>{
  const b=event.target.closest('[data-editor-open]');if(!b)return;
  const choice=b.dataset.editorOpen;
  if(choice==='compose')showComposer();
  else if(choice==='review')openReview();
  else if(choice==='schedule')openScheduler(b);
  else if(choice==='page')openPages();
  else if(choice==='backup')exportBackup();
 });
}
function scan(){
 document.querySelectorAll('.liga-media-modal > section.ljr-admin-manage').forEach(addPanel);
 if(!admin())document.querySelectorAll('[data-ljr-editor-center]').forEach(n=>n.remove());
}
let pending=false;
function scheduleScan(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;scan()})}
document.addEventListener('liga:admin',scheduleScan);
function start(){new MutationObserver(scheduleScan).observe(document.body,{childList:true,subtree:true});scan()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
window.LJR_EDITOR_CENTER={openNotice:showComposer,openReview,openPages,exportBackup};
})();