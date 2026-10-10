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
  '<label>Equipo afectado (opcional)<input name="team" maxlength="90" placeholder="Ej. Manchester"></label>'+
  '</div>'+
  '<label>Detalles confirmados<textarea name="details" rows="2" maxlength="1200" placeholder="Escribe el cambio o la información oficial. No se inventan resultados."></textarea></label>'+
  '<div class="ljr-editor-tools"><button type="button" data-generate="formal">Generar comunicado</button><button type="button" data-generate="short">Versión corta</button><button type="button" data-generate="urgent">Aviso urgente</button></div>'+
  '<label>Título<input name="title" required maxlength="160"></label>'+
  '<label>Mensaje<textarea name="body" required rows="5" minlength="15" maxlength="4000"></textarea></label>'+
  '<label>Mostrar en<select name="scope"><option value="Liga">Liga</option><option value="Equipos">Equipos</option><option value="Fichajes">Fichajes</option></select></label>'+
  '<div class="ljr-editor-preview"><small>VISTA PREVIA · NOTICIAS</small><strong data-preview-title></strong><p data-preview-body></p><small data-preview-meta></small></div>'+
  '<div class="ljr-editor-bottom"><button type="button" data-editor-draft>Guardar borrador</button><button type="submit" data-editor-publish>Publicar en Noticias</button></div>'+
  '<small>Cuando esté conectado el servidor Web Push, las publicaciones oficiales se notificarán automáticamente según categoría, equipo y cancha. Sin servidor, se publican solo en Noticias.</small>'+
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
  if(f.team.value.trim())parts.push('Equipo: '+f.team.value.trim());
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
  const values={type:'suspension',category:String(prefill.category||'all'),round:String(prefill.round||''),date:String(prefill.date||''),time:String(prefill.time||''),field:String(prefill.field||'').slice(0,110),team:String(prefill.team||'').slice(0,90)};
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
    category:form.elements.category.value,type:form.elements.type.value,
    field:form.elements.field.value.trim().slice(0,110),team:form.elements.team.value.trim().slice(0,90),
    date:form.elements.date.value,time:form.elements.time.value,
    round:form.elements.round.value?Number(form.elements.round.value):null};
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
 const modal=createModal('Revisar avisos','<div class="ljr-editor-review ljr-review-smart">'+
  '<p class="ljr-editor-note">Comunicados guardados en el servidor de la Liga. Solo la administración autorizada puede publicar, editar o retirar.</p>'+
  '<div class="ljr-review-stats" data-review-stats aria-label="Resumen de avisos"></div>'+
  '<div class="ljr-editor-tools ljr-review-tabs" role="group" aria-label="Estado">'+
  '<button type="button" data-state="all" aria-pressed="true">Todos <span data-count="all">0</span></button>'+
  '<button type="button" data-state="draft" aria-pressed="false">Borradores <span data-count="draft">0</span></button>'+
  '<button type="button" data-state="published" aria-pressed="false">Publicados <span data-count="published">0</span></button></div>'+
  '<div class="ljr-review-filters" role="search" aria-label="Buscar avisos">'+
  '<label class="ljr-review-search"><span>Buscar aviso</span><input type="search" data-review-query placeholder="Título, equipo, sede, contenido…" autocomplete="off"></label>'+
  '<label><span>Categoría</span><select data-review-category>'+CATS.map(x=>'<option value="'+x[0]+'">'+esc(x[1])+'</option>').join('')+'</select></label>'+
  '<label><span>Orden</span><select data-review-order><option value="recent">Más recientes</option><option value="old">Más antiguos</option><option value="title">Título A–Z</option></select></label></div>'+
  '<div class="ljr-review-automation"><button type="button" data-review-audit>✓ Revisar calidad</button>'+
  '<button type="button" data-review-ai>✦ IA en el dispositivo</button>'+
  '<label><input type="checkbox" data-review-auto> Actualizar cada minuto</label></div>'+
  '<div class="ljr-review-insights" data-review-insights hidden role="status" aria-live="polite"></div>'+
  '<div class="ljr-review-meta" data-review-meta role="status" aria-live="polite">Consultando avisos…</div>'+
  '<div data-editor-list aria-live="polite">Cargando avisos…</div>'+
  '<button type="button" data-review-more hidden>Ver más avisos</button>'+
  '<div class="ljr-review-footer"><button type="button" data-reload>↻ Actualizar lista</button>'+
  '<button type="button" data-review-new>＋ Crear aviso</button>'+
  '<button type="button" data-review-csv>↓ CSV privado</button></div>'+
  '</div>','ljr-editor-review-dialog');
 let records=[],filter='all',query='',category='all',order='recent',loading=false,ready=false,limit=40,interval=null,aiAvailability='unavailable';
 const list=$('[data-editor-list]',modal),meta=$('[data-review-meta]',modal),insights=$('[data-review-insights]',modal);
 const clean=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
 const timestamp=r=>String(r.updated||r.updatedAt||r.created||r.createdAt||'');
 const niceDate=d=>{const n=new Date(d);return d&&!Number.isNaN(n.getTime())?n.toLocaleDateString('es-MX',{day:'2-digit',month:'short',year:'numeric'}):'Sin fecha'};
 const entryText=r=>{const p=r.payload||{};return [p.title,p.body,p.team,p.field,p.category,p.type,p.date].join(' ')};
 const makeButton=(text,click,cls)=>{const b=document.createElement('button');b.type='button';b.textContent=text;if(cls)b.className=cls;b.addEventListener('click',click);return b};
 const allCounts=()=>{
  const counts={all:records.length,draft:records.filter(r=>!r.published).length,published:records.filter(r=>!!r.published).length};
  modal.querySelectorAll('[data-count]').forEach(e=>{e.textContent=String(counts[e.dataset.count]||0)});
  const stats=$('[data-review-stats]',modal);
  stats.replaceChildren();
  [['Total',counts.all],['Borradores',counts.draft],['Publicados',counts.published]].forEach(([name,count])=>{
   const x=document.createElement('div');const n=document.createElement('strong');n.textContent=String(count);
   const t=document.createElement('small');t.textContent=name;x.append(n,t);stats.append(x);
  });
 };
 function paint(){
  if(!modal.isConnected)return;
  list.replaceChildren();allCounts();
  if(!ready){meta.textContent='Consultando el servidor de la Liga…';return}
  const shown=records.filter(r=>{
   const p=r.payload||{};
   return (filter==='all'||(filter==='published'?!!r.published:!r.published))&&
    (category==='all'||String(p.category??'all')===category)&&
    (!query||clean(entryText(r)).includes(clean(query)));
  }).sort((a,b)=>order==='title'?
   String(a.payload?.title||'').localeCompare(String(b.payload?.title||''),'es',{sensitivity:'base'}):
   order==='old'?timestamp(a).localeCompare(timestamp(b)):timestamp(b).localeCompare(timestamp(a)));
  meta.textContent=shown.length+' de '+records.length+' avisos · Solo administración · '+(interval?'Actualización automática activa':'Actualización manual');
  $('[data-review-more]',modal).hidden=shown.length<=limit;
  if(!shown.length){
   const p=document.createElement('div');p.className='ljr-editor-empty ljr-review-empty';
   const title=document.createElement('strong');title.textContent=records.length?'No hay resultados para estos filtros.':'Todavía no hay avisos guardados.';
   const hint=document.createElement('p');hint.textContent=records.length?'Prueba con otra categoría, búsqueda o estado.':'Puedes crear el primer aviso, guardarlo como borrador y publicarlo después de revisarlo.';
   p.append(title,hint);list.append(p);return;
  }
  shown.slice(0,limit).forEach(record=>{
   const p=record.payload||{},card=document.createElement('article');
   card.className='ljr-editor-row ljr-review-card';
   const top=document.createElement('div');top.className='ljr-review-card-top';
   const badge=document.createElement('span');badge.className='ljr-review-badge '+(record.published?'is-published':'is-draft');badge.textContent=record.published?'✓ Publicado':'◷ Borrador';
   const date=document.createElement('small');date.textContent=niceDate(timestamp(record));
   top.append(badge,date);card.append(top);
   const h=document.createElement('strong');h.className='ljr-review-heading';h.textContent=p.title||'Aviso sin título';card.append(h);
   const details=document.createElement('div');details.className='ljr-review-chips';
   [catName(String(p.category||'all')),TYPES[p.type]?.[0]||'General',p.team?('Equipo: '+p.team):'',p.field?('Sede: '+p.field):'']
    .filter(Boolean).forEach(value=>{const tag=document.createElement('span');tag.textContent=value;details.append(tag)});
   card.append(details);
   const body=document.createElement('p');body.className='ljr-review-body';body.textContent=p.body||'Sin contenido';
   body.hidden=true;card.append(body);
   const actions=document.createElement('div');actions.className='ljr-editor-row-actions ljr-review-actions';
   actions.append(makeButton('Ver',()=>{body.hidden=!body.hidden;preview.textContent=body.hidden?'Ver':'Ocultar'},'ljr-review-view'));
   const preview=actions.lastElementChild;
   actions.append(makeButton('Editar',()=>{window.LJR_CMS?.editor?.('news',record)},'ljr-review-edit'));
   actions.append(makeButton('Compartir',async()=>{
    const txt=(p.title||'Aviso oficial')+'\n\n'+(p.body||'')+'\n\nLiga Juventino Rosas';
    try{
     if(navigator.share){await navigator.share({title:p.title||'Aviso oficial',text:txt});status(modal,'Se abrió la opción para compartir.')}
     else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(txt);status(modal,'Aviso copiado. Puedes pegarlo en WhatsApp.')}
     else status(modal,'Tu navegador no permite compartir o copiar directamente.');
    }catch(e){if(e?.name!=='AbortError')status(modal,'No se pudo compartir: '+(e?.message||'Error'))}
   },'ljr-review-share'));
   if(!record.published){
    actions.append(makeButton('Publicar',async ev=>{
     if(!confirm('¿Publicar este aviso en Noticias para todos los visitantes? Revisa antes fechas y datos oficiales.'))return;
     const btn=ev.currentTarget;btn.disabled=true;
     try{
      await verified();
      await media().api('content/'+encodeURIComponent(record.id),{method:'PUT',body:{kind:'news',payload:record.payload,revision:record.revision,published:true}});
      await window.LJR_CMS?.refresh?.();await reload();window.dispatchEvent(new Event('liga:content'));
      status(modal,'Aviso publicado en Noticias.');
     }catch(err){status(modal,'No se pudo publicar: '+(err?.message||'Error'));btn.disabled=false}
    },'ljr-review-publish'));
   }
   actions.append(makeButton(record.published?'Retirar':'Eliminar',async ev=>{
    if(!confirm(record.published?'¿Retirar este aviso de Noticias para todos los visitantes?':'¿Eliminar este borrador permanentemente?'))return;
    const btn=ev.currentTarget;btn.disabled=true;
    try{
     await verified();
     await media().api('content/'+encodeURIComponent(record.id),{method:'DELETE',body:{revision:record.revision}});
     await window.LJR_CMS?.refresh?.();await reload();window.dispatchEvent(new Event('liga:content'));
     status(modal,'Aviso retirado correctamente.');
    }catch(err){status(modal,'No se pudo retirar: '+(err?.message||'Error'));btn.disabled=false}
   },'ljr-review-danger'));
   card.append(actions);list.append(card);
  });
 }
 function audit(){
  const findings=[],seen=new Map(),urgent=['horario','cancha','suspension','junta','jornada'];
  records.forEach(r=>{
   const p=r.payload||{},name=p.title||'Sin título',key=clean([name,p.category,p.date].join('|'));
   if(key&&seen.has(key))findings.push('Posible duplicado: '+name);
   else if(key)seen.set(key,true);
   if(!p.title?.trim())findings.push('Falta título en un aviso.');
   if(!p.body||p.body.trim().length<35)findings.push('Texto demasiado corto: '+name);
   if(urgent.includes(p.type)&&!p.date) findings.push('Revisar fecha del aviso: '+name);
   if(p.type==='cancha'&&!p.field) findings.push('Revisar sede del aviso: '+name);
   if(p.type==='horario'&&!p.time) findings.push('Revisar horario del aviso: '+name);
  });
  insights.hidden=false;insights.replaceChildren();
  const heading=document.createElement('strong');heading.textContent=findings.length?'Revisión local · '+findings.length+' observaciones':'Revisión local · Sin observaciones básicas';
  const hint=document.createElement('p');hint.textContent='Análisis automático por reglas en este dispositivo. No confirma datos oficiales ni modifica publicaciones.';
  insights.append(heading,hint);
  const ul=document.createElement('ul');
  (findings.length?[...new Set(findings)].slice(0,8):['Los avisos revisados no tienen advertencias básicas.']).forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});
  insights.append(ul);return findings;
 }
 async function reload(){
  if(loading||!modal.isConnected)return;
  loading=true;const btn=$('[data-reload]',modal);btn.disabled=true;
  if(!ready){list.textContent='Consultando avisos…';meta.textContent='Conectando…'}
  try{
   await verified();
   const result=await media().api('content?admin=1');
   if(!Array.isArray(result?.items))throw Error('El servidor no devolvió un listado válido.');
   records=result.items.filter(x=>x?.kind==='news');ready=true;paint();
  }catch(err){
   const message='No se pueden consultar los avisos: '+(err?.message||'Error de conexión');
   meta.textContent=message;
   if(!ready){list.replaceChildren();const error=document.createElement('p');error.className='ljr-editor-empty';error.textContent=message;list.append(error)}
   status(modal,'La lista anterior, si existe, se conserva. '+message);
   if([401,403].includes(err?.status))media()?.login?.();
  }finally{loading=false;btn.disabled=false}
 }
 modal.querySelectorAll('[data-state]').forEach(b=>b.onclick=()=>{
  filter=b.dataset.state;limit=40;
  modal.querySelectorAll('[data-state]').forEach(v=>v.setAttribute('aria-pressed',String(v===b)));paint()
 });
 $('[data-review-query]',modal).addEventListener('input',e=>{query=e.target.value;limit=40;paint()});
 $('[data-review-category]',modal).addEventListener('change',e=>{category=e.target.value;limit=40;paint()});
 $('[data-review-order]',modal).addEventListener('change',e=>{order=e.target.value;paint()});
 $('[data-review-more]',modal).onclick=()=>{limit+=40;paint()};
 $('[data-reload]',modal).onclick=reload;
 $('[data-review-new]',modal).onclick=()=>showComposer();
 $('[data-review-audit]',modal).onclick=()=>{if(!ready)return status(modal,'Espera a que carguen los avisos.');audit()};
 $('[data-review-auto]',modal).onchange=e=>{
  if(interval){clearInterval(interval);interval=null}
  if(e.target.checked)interval=setInterval(()=>{
   if(!modal.isConnected){clearInterval(interval);interval=null;return}
   if(document.visibilityState==='visible')reload();
  },60000);
  if(ready)paint();
 };
 $('[data-review-ai]',modal).onclick=async e=>{
  if(!ready)return status(modal,'Espera a que carguen los avisos.');
  audit();
  if(!records.length)return;
  if(aiAvailability!=='available'||typeof window.LanguageModel?.create!=='function'){
   return status(modal,'IA del navegador no disponible aquí; se usó la revisión local por reglas sin enviar datos.');
  }
  const button=e.currentTarget;button.disabled=true;
  let session;
  try{
   // Crear la sesión al tocar el botón; ningún modelo externo recibe los borradores.
   const pending=window.LanguageModel.create();
   status(modal,'Analizando avisos con el modelo local del navegador…');
   session=await pending;
   const sample=records.slice(0,8).map(r=>({
    estado:r.published?'publicado':'borrador',titulo:String(r.payload?.title||'').slice(0,120),
    texto:String(r.payload?.body||'').slice(0,320),tipo:r.payload?.type||'',fecha:r.payload?.date||''
   }));
   const reply=await session.prompt('Revisa la claridad de estos comunicados de una liga de fútbol. Responde en español con máximo 5 sugerencias breves y concretas. No inventes datos, resultados ni fechas. No publiques nada. Datos: '+JSON.stringify(sample));
   const result=document.createElement('p');result.className='ljr-review-ai-response';result.textContent=String(reply).slice(0,2000);
   insights.hidden=false;insights.append(result);status(modal,'Análisis local terminado. Revisa las sugerencias antes de usarlas.');
  }catch(err){status(modal,'IA local no disponible: '+(err?.message||'Error')+'. Se conserva la revisión por reglas.')}
  finally{try{session?.destroy?.()}catch(_){}button.disabled=false}
 };
 if(typeof window.LanguageModel?.availability==='function'){
  window.LanguageModel.availability().then(x=>{aiAvailability=x;
   const button=$('[data-review-ai]',modal);
   if(button)button.title=x==='available'?'Modelo de IA disponible en este navegador':'Modelo local no instalado. El botón utilizará revisión por reglas.';
  }).catch(()=>{aiAvailability='unavailable'});
 }
 $('[data-review-csv]',modal).onclick=()=>{
  if(!ready||!records.length)return status(modal,'No hay avisos para exportar.');
  if(!confirm('Se descargará un CSV privado que podría contener borradores no publicados. No lo compartas sin autorización. ¿Continuar?'))return;
  const safe=x=>{let s=String(x??'').replace(/\r?\n/g,' ');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};
  const lines=[['Estado','Título','Categoría','Tipo','Fecha','Equipo','Cancha','Mensaje'].map(safe).join(',')];
  records.forEach(r=>{const p=r.payload||{};lines.push([r.published?'Publicado':'Borrador',p.title,catName(String(p.category||'all')),p.type,p.date,p.team,p.field,p.body].map(safe).join(','))});
  const url=URL.createObjectURL(new Blob(['\ufeff'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'}));
  const a=document.createElement('a');a.href=url;a.download='avisos-liga-privado-'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  status(modal,'CSV privado descargado en este dispositivo.');
 };
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
  if(!who.owner)throw Error('El respaldo completo solo pueden exportarlo las cuentas principales autorizadas por el servidor.');
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
  (media()?.admin?.owner?'<button type="button" data-editor-open="backup"><b>↓</b><span>Respaldo privado<small>Solo acceso total verificado</small></span></button>':'')+'</div>'+
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