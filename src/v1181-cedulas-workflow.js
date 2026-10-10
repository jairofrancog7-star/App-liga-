/* V1181 — Control de cédulas verificadas por Railway.
 * No guarda firmas o fotos en localStorage; cada acción exige sesión real.
 * En el listado público se conserva la consulta del rol y el PDF existente. */
(function(){
'use strict';
if(window.__LJR_CEDULA_WORKFLOW_V1181__)return;
window.__LJR_CEDULA_WORKFLOW_V1181__=true;
const $=(s,p=document)=>p?.querySelector?.(s)||null;
const $$=(s,p=document)=>Array.from(p?.querySelectorAll?.(s)||[]);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CAT={1:'Veteranos 50+',2:'Veteranos 35+',3:'Primera Fuerza',4:'Segunda Fuerza',5:'Intermedia'};
const LABEL={draft:'Borrador',submitted:'Entregada',review:'En revisión',approved:'Aprobada',published:'Publicada',correction:'Corrección requerida',void:'Anulada'};
const TYPE={goal:'Gol',yellow:'Amarilla',second_yellow:'Segunda amarilla',red:'Roja',substitution:'Cambio',injury:'Lesión',penalty:'Penal',suspension:'Suspensión',note:'Observación'};
const TGT={draft:['submitted','void'],submitted:['review','correction'],review:['approved','correction'],approved:['published','correction'],published:['correction'],correction:['submitted','void'],void:[]};
const PERM={submitted:'cedulas:write',void:'cedulas:write',review:'cedulas:review',approved:'cedulas:review',published:'cedulas:publish',correction:'cedulas:review'};
const url=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const dateOf=s=>{
 const str=String(s||'').trim(),m=str.match(/^(\d{4})-(\d{2})-(\d{2})/)||str.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
 return !m?'':str.startsWith(m[1]+'-')?[m[1],m[2],m[3]].join('-'):[m[3],m[2],m[1]].join('-');
};
let current=null,root=null,modal=null,actor=null,apiBase='',docs=[],trueCounts={},totalRecords=0,activeDoc=null,incidents=[],checking=false,pending=false,saveTimer=null;
const has=p=>actor?.permissions?.includes(p);
const notifyApi=()=>window.LJR_MEDIA?.notifyAPI;
async function api(path,options){
 if(!window.LJR_MEDIA?.admin||typeof notifyApi()!=='function')throw Error('Inicia sesión en JR Control antes de gestionar cédulas.');
 return notifyApi()(path,options||{});
}
async function base(){
 if(apiBase)return apiBase;
 const response=await fetch('./data/notifications-client.json',{cache:'no-store'});
 if(!response.ok)throw Error('Falta configuración de servidor privado');
 const value=(await response.json()).apiBaseUrl;
 if(!/^https:\/\/[a-z0-9.-]+$/i.test(value||''))throw Error('La dirección del servidor no es válida');
 apiBase=value;return apiBase;
}
const feedback=(message)=>{const el=$('[data-v1181-message]',modal);if(el)el.textContent=message};
const doing=async(work)=>{
 if(pending)return;pending=true;
 $$('[data-v1181-action]',modal).forEach(el=>el.disabled=true);
 try{await work()}catch(e){feedback('No se completó: '+String(e?.message||e).slice(0,170))}
 finally{pending=false;$$('[data-v1181-action]',modal).forEach(el=>el.disabled=false)}
};
function parties(){
 return $$('[data-v66-directory="cedulas"] .v638-cedula-list [data-v66-cedula-home]').map((el,i)=>{
  const d=el.dataset;
  const category=String(d.v66CedulaCat||'').toLowerCase();
  const cat=category.includes('primera')?'3':category.includes('intermedia')?'5':category.includes('segunda')?'4':category.includes('35')?'2':category.includes('50')?'1':'';
  return {i,cat,home:d.v66CedulaHome||'',away:d.v66CedulaAway||'',round:d.v66CedulaRound||'',date:dateOf(d.v66CedulaDate),field:d.v66CedulaField||''};
 }).filter(x=>x.cat&&x.home&&x.away);
}
function statusHTML(){
 const counts=trueCounts;
 return '<div class="v1181-stats"><span><b>'+totalRecords+'</b><small>Registradas</small></span>'+
 ['draft','submitted','review','approved','published'].map(k=>'<span><b>'+Number(counts[k]||0)+'</b><small>'+esc(LABEL[k])+'</small></span>').join('')+
 '</div>';
}
function button(action,text,disabled=false){
 return '<button type="button" data-v1181-action="'+action+'"'+(disabled?' disabled':'')+'>'+esc(text)+'</button>';
}
function modalHTML(){
 const matches=parties();
 return '<div class="v1181-backdrop" data-v1181-modal role="dialog" aria-modal="true" aria-label="Administración de cédulas oficiales">'+
 '<div class="v1181-sheet"><header><div><small>CENTRO ARBITRAL · ACCESO PRIVADO</small><h2>Cédulas oficiales</h2><p>Captura, revisa y publica actas verificadas en el servidor.</p></div><button type="button" data-v1181-close aria-label="Cerrar">×</button></header>'+
 '<div class="v1181-body"><p class="v1181-privacy">Solo los usuarios autorizados pueden editar. El rol de partidos no equivale a cédulas aprobadas.</p>'+
 statusHTML()+
 '<section class="v1181-panel"><h3>Crear desde un partido del rol</h3>'+
 '<label>Partido<select data-v1181-fixture><option value="">Selecciona un encuentro</option>'+matches.map(m=>'<option value="'+m.i+'">'+esc((CAT[m.cat]||'')+' · J'+m.round+' · '+m.home+' vs '+m.away)+'</option>').join('')+'</select></label>'+
 '<label>ID del árbitro autorizado (asignado por la directiva)<input data-v1181-assigned placeholder="Usuario verificado del árbitro" maxlength="128"></label>'+
 button('create','+ Crear borrador',!has('cedulas:write'))+
 '</section>'+
 '<section class="v1181-panel"><h3>Archivo privado de cédulas</h3>'+
 '<div class="v1181-line"><label>Seleccionar cédula<select data-v1181-document><option value="">Elige una cédula</option></select></label>'+button('reload','Actualizar')+'</div>'+
 '<div class="v1181-ops">'+button('reminder','Preparar recordatorio manual')+'</div>'+ 
 '<div data-v1181-detail></div></section>'+
 '<output data-v1181-message aria-live="polite"></output></div></div></div>';
}
function renderDocSelect(){
 const select=$('[data-v1181-document]',modal);if(!select)return;
 select.innerHTML='<option value="">Elige una cédula</option>'+docs.map(d=>'<option value="'+esc(d.id)+'"'+(activeDoc?.id===d.id?' selected':'')+'>'+esc((LABEL[d.status]||d.status)+' · '+d.home+' vs '+d.away+' · J'+(d.round||'—'))+'</option>').join('');
 const stats=$('.v1181-stats',modal);
 if(stats)stats.outerHTML=statusHTML();
}
function incidentsHTML(){
 return '<div class="v1181-incidents">'+incidents.map((x,i)=>'<div class="v1181-event"><span>'+esc(TYPE[x.type]||x.type)+' · '+esc(x.minute)+"' · "+esc(x.player||'Sin jugador')+' · '+esc(x.team==='home'?'Local':x.team==='away'?'Visitante':'General')+'</span>'+button('delete-event-'+i,'Quitar',!has('cedulas:write'))+'</div>').join('')+'</div>';
}
function detailHTML(d){
 if(!d)return '<p class="v1181-help">Selecciona una cédula o crea un borrador nuevo.</p>';
 const editable=has('cedulas:write')&&['draft','correction'].includes(d.status);
 const p=d.payload||{};
 const events=activeDoc.events||[],attachments=activeDoc.attachments||[];
 const readonly=editable?'':' disabled';
 return '<div class="v1181-detail"><div class="v1181-selected"><b>'+esc(d.home)+' vs '+esc(d.away)+'</b><span>'+esc(LABEL[d.status]||d.status)+' · Versión '+d.revision+'</span></div>'+
 '<p class="v1181-help">Folio: '+esc(d.id)+' · '+esc(CAT[d.categoryId]||'')+' · J'+esc(d.round||'—')+' · '+esc(d.date||'Sin fecha')+'</p>'+
 '<div class="v1181-fields">'+
 '<label>Goles local<input type="number" min="0" max="99" data-v1181-home value="'+esc(p.homeScore??'')+'"'+readonly+'></label>'+
 '<label>Goles visitante<input type="number" min="0" max="99" data-v1181-away value="'+esc(p.awayScore??'')+'"'+readonly+'></label>'+
 '<label class="v1181-wide">Árbitro<input data-v1181-referee maxlength="100" value="'+esc(p.referee||'')+'"'+readonly+'></label>'+
 '<label class="v1181-wide">Observaciones<textarea data-v1181-notes rows="3" maxlength="2000"'+readonly+'>'+esc(p.notes||'')+'</textarea></label>'+
 '</div>'+
 '<h4>Goles, tarjetas y otras incidencias</h4>'+incidentsHTML()+
 (editable?'<div class="v1181-new-event"><label>Tipo<select data-v1181-type>'+Object.keys(TYPE).map(x=>'<option value="'+x+'">'+esc(TYPE[x])+'</option>').join('')+'</select></label>'+
 '<label>Equipo<select data-v1181-team><option value="home">Local</option><option value="away">Visitante</option><option value="general">General</option></select></label>'+
 '<label>Minuto<input type="number" min="0" max="150" data-v1181-minute value="0"></label>'+
 '<label>Jugador<input data-v1181-player maxlength="100" placeholder="Nombre"></label>'+
 '<label class="v1181-wide">Detalle<input data-v1181-desc maxlength="180" placeholder="Nota opcional"></label>'+button('add-event','Agregar incidencia')+'</div>':'')+
 '<div class="v1181-ops">'+button('save','Guardar acta',!editable)+
 button('sign',d.signed?'Firmada en servidor':'Firmar acta',!has('cedulas:sign')||!editable||d.signed)+
 button('pdf','Abrir generador PDF')+'</div>'+
 '<p class="v1181-help">Firma electrónica simple: identidad y fecha registradas en el servidor. No es una firma electrónica avanzada. '+(d.signed?'Firmado por '+esc(d.signedBy):'Pendiente de firma del árbitro autorizado.')+'</p>'+
 '<h4>Avance y aprobación</h4><div class="v1181-ops">'+
 (TGT[d.status]||[]).map(k=>button('state-'+k,LABEL[k],!has(PERM[k]))).join('')+
 '</div>'+
 '<h4>Escaneos y evidencias privadas</h4>'+
 (editable?'<label>Adjuntar JPG, PNG o PDF (máximo 1.5 MB)<input type="file" accept="image/jpeg,image/png,application/pdf" data-v1181-file></label>'+button('upload','Guardar archivo privado'):'')+
 '<div class="v1181-history">'+attachments.map(a=>'<div class="v1181-event"><span>'+esc(a.filename)+' · '+Math.round(a.size/1024)+' KB</span>'+button('file-'+a.id,'Descargar')+'</div>').join('')+
 '<small>Los archivos se conservan privados: no aparecen en el QR ni en la página pública.</small></div>'+
 (d.status==='published'?'<h4>Verificación pública</h4><div class="v1181-ops">'+button('verification','Abrir folio verificable')+button('qr','Ver código QR')+button('share','Compartir folio')+'</div>':'')+
 '<details><summary>Historial de cambios ('+events.length+')</summary><div class="v1181-history">'+
 events.map(e=>'<p><strong>'+esc(e.action)+'</strong> · '+esc(e.actor)+' · '+esc(new Date(e.created_at).toLocaleString('es-MX'))+'</p>').join('')+
 '</div></details></div>';
}
function render(){
 if(!modal)return;
 renderDocSelect();const target=$('[data-v1181-detail]',modal);
 if(target)target.innerHTML=detailHTML(activeDoc?.document||null);
}
async function reminder(){
 const outstanding=docs.filter(d=>['draft','submitted','review','correction'].includes(d.status));
 if(!outstanding.length){feedback('No hay cédulas registradas en estado pendiente.');return}
 const message='Liga Juventino Rosas · Seguimiento de cédulas pendientes (requiere revisión):\n'+
  outstanding.slice(0,15).map(d=>d.home+' vs '+d.away+' · '+(LABEL[d.status]||d.status)+' · J'+(d.round||'—')).join('\n')+
  (outstanding.length>15?'\n… y '+(outstanding.length-15)+' cédulas más.':'')+
  '\nMensaje preparado manualmente; verifica los datos antes de enviarlo.';
 if(!window.confirm('¿Preparar el recordatorio para compartir manualmente? No se enviará ningún mensaje automáticamente.'))return;
 if(navigator.share){
  try{await navigator.share({title:'Cédulas pendientes de la Liga',text:message});feedback('Se abrió el menú de compartir.');return}
  catch(e){if(e.name==='AbortError')return}
 }
 window.open('https://wa.me/?text='+encodeURIComponent(message),'_blank','noopener,noreferrer');
 feedback('Se abrió WhatsApp para compartir manualmente. No se marcó como enviado.');
}
async function autoSave(){
 const d=activeDoc?.document;
 if(!d||pending||!has('cedulas:write')||d.signed||!['draft','correction'].includes(d.status))return;
 pending=true;
 try{
  const draft=formPayload();
  const response=await api('/admin/cedulas/'+d.id,{method:'PUT',body:{ifRevision:d.revision,payload:draft}});
  d.revision=response.revision;
  d.payload={...draft,incidents:draft.incidents.slice()};
  feedback('Borrador guardado automáticamente en servidor · versión '+d.revision+'.');
 }catch(e){feedback('No se guardaron los últimos cambios: '+String(e.message||e).slice(0,145)+'. Revisa y pulsa Guardar acta.')}
 finally{pending=false}
}
function scheduleSave(e){
 const el=e.target;
 if(!el?.matches?.('[data-v1181-home],[data-v1181-away],[data-v1181-referee],[data-v1181-notes]'))return;
 clearTimeout(saveTimer);
 saveTimer=setTimeout(autoSave,1600);
}
async function list(){
 const response=await api('/admin/cedulas');
 if(!Array.isArray(response.items))throw Error('Lista privada inválida');
 docs=response.items;
 trueCounts=response.counts||{};totalRecords=Number(response.total)||0;
 render();
}
async function loadDoc(id){
 clearTimeout(saveTimer);
 if(!id){activeDoc=null;incidents=[];render();return}
 const response=await api('/admin/cedulas/'+encodeURIComponent(id));
 if(!response.document||!Array.isArray(response.events))throw Error('Documento inválido');
 activeDoc=response;incidents=Array.isArray(response.document.payload?.incidents)?response.document.payload.incidents.slice():[];
 render();
}
async function create(){
 if(!has('cedulas:write'))throw Error('No tienes permiso de captura');
 const i=Number($('[data-v1181-fixture]',modal)?.value);
 const raw=$('[data-v1181-fixture]',modal)?.value;
 const match=parties().find(x=>x.i===i);
 if(!raw||!match)throw Error('Primero selecciona un partido');
 let assignedTo=String($('[data-v1181-assigned]',modal)?.value||'').trim();
 if(actor.role==='arbitro')assignedTo=actor.id;
 if(!assignedTo&&!window.confirm('No asignaste al árbitro. La cédula no podrá firmarse hasta configurar la identidad del árbitro. ¿Continuar como borrador?'))return;
 const result=await api('/admin/cedulas',{method:'POST',body:{categoryId:match.cat,home:match.home,away:match.away,round:match.round,field:match.field,date:match.date||null,assignedTo}});
 await list();await loadDoc(result.id);
 feedback('Borrador creado en servidor. Primero captura el acta; después solicita la firma del árbitro.');
}
function formPayload(){
 if(!activeDoc?.document)throw Error('Selecciona una cédula');
 const home=$('[data-v1181-home]',modal)?.value,away=$('[data-v1181-away]',modal)?.value;
 const score=v=>v===''?null:Number(v);
 return {homeScore:score(home),awayScore:score(away),referee:$('[data-v1181-referee]',modal)?.value||'',
 notes:$('[data-v1181-notes]',modal)?.value||'',incidents};
}
async function save(){
 const d=activeDoc?.document;if(!d)throw Error('Selecciona una cédula');
 clearTimeout(saveTimer);
 const r=await api('/admin/cedulas/'+d.id,{method:'PUT',body:{ifRevision:d.revision,payload:formPayload()}});
 await list();await loadDoc(d.id);feedback('Guardado en servidor. Versión '+r.revision+'. Las firmas anteriores se invalidan al editar.');
}
async function sign(){
 const d=activeDoc?.document;
 if(!d||!has('cedulas:sign'))throw Error('Firma reservada al árbitro autorizado');
 clearTimeout(saveTimer);
 const entered=formPayload(),saved=d.payload||{};
 if(entered.homeScore!==saved.homeScore||entered.awayScore!==saved.awayScore||
    entered.referee!==saved.referee||entered.notes!==saved.notes||
    JSON.stringify(entered.incidents)!==JSON.stringify(saved.incidents||[]))
   throw Error('Hay cambios sin guardar. Guarda el acta y vuelve a firmar.');
 if(!window.confirm('Confirmo que revisé el acta y sus incidencias, y asumo la autoría de esta firma electrónica simple. ¿Firmar?'))return;
 const result=await api('/admin/cedulas/'+d.id+'/sign',{method:'POST',body:{ifRevision:d.revision,acknowledge:true}});
 await list();await loadDoc(d.id);
 feedback('Firma electrónica simple registrada en servidor. Versión '+result.revision+'.');
}
async function setStatus(target){
 const d=activeDoc?.document;if(!d)throw Error('Selecciona una cédula');
 if(!has(PERM[target]))throw Error('El servidor requiere un cargo autorizado');
 let reason='';
 if(['correction','void'].includes(target)){
  reason=window.prompt('Escribe el motivo oficial del cambio (mínimo 8 caracteres):','')||'';
  if(reason.trim().length<8)return feedback('No se cambió el estado. Falta explicar el motivo.');
 }
 if(!window.confirm('¿Confirmas cambiar la cédula a '+LABEL[target]+'? El servidor guardará tu usuario y fecha.'))return;
 const response=await api('/admin/cedulas/'+d.id+'/status',{method:'POST',body:{status:target,ifRevision:d.revision,reason}});
 await list();await loadDoc(d.id);feedback('Estado actualizado y registrado: '+LABEL[response.status]+'.');
}
async function upload(){
 const doc=activeDoc?.document,file=$('[data-v1181-file]',modal)?.files?.[0];
 if(!doc||!file)throw Error('Selecciona una cédula y un archivo');
 if(file.size>1500000||!['image/png','image/jpeg','application/pdf'].includes(file.type))throw Error('Máximo 1.5 MB en PDF, JPG o PNG');
 if(!window.confirm('El archivo quedará en el servidor privado. No subas credenciales ni datos personales innecesarios. ¿Continuar?'))return;
 const data=await new Promise((resolve,reject)=>{
  const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||'').split(',')[1]||'');reader.onerror=()=>reject(Error('No se pudo leer el documento'));reader.readAsDataURL(file);
 });
 await api('/admin/cedulas/'+doc.id+'/attachments',{method:'POST',body:{mime:file.type,data,filename:file.name}});
 await list();await loadDoc(doc.id);feedback('Archivo guardado en privado. Firma previa invalidada por seguridad.');
}
async function downloadAttachment(id){
 const d=activeDoc?.document;if(!d||!id)throw Error('No hay anexo seleccionado');
 const response=await api('/admin/cedulas/'+d.id+'/attachments/'+encodeURIComponent(id)+'/file');
 if(!['application/pdf','image/jpeg','image/png'].includes(response.mime)||!response.data)throw Error('Archivo privado inválido');
 const raw=atob(response.data),data=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)data[i]=raw.charCodeAt(i);
 const objectURL=URL.createObjectURL(new Blob([data],{type:response.mime}));
 try{const link=document.createElement('a');link.href=objectURL;link.download=response.filename||'acta-evidencia';link.click();feedback('Descarga del anexo privado iniciada.')}finally{setTimeout(()=>URL.revokeObjectURL(objectURL),1500)}
}
async function linkFor(d){
 if(!d||d.status!=='published')throw Error('Solo se comparten actas publicadas');
 return (await base())+'/cedulas/verify/'+d.id;
}
async function publicAction(action){
 const d=activeDoc?.document,link=await linkFor(d);
 if(action==='qr')return window.open(link+'/qr.png','_blank','noopener,noreferrer');
 if(action==='verification')return window.open(link,'_blank','noopener,noreferrer');
 if(action==='share'){
  if(navigator.share){try{await navigator.share({title:'Cédula oficial verificada',text:d.home+' vs '+d.away,url:link});return}catch(e){if(e.name==='AbortError')return}}
  window.open('https://wa.me/?text='+encodeURIComponent('Cédula oficial verificada: '+d.home+' vs '+d.away+'\n'+link),'_blank','noopener,noreferrer');
 }
}
function pdf(){
 const d=activeDoc?.document;if(!d)return feedback('Elige primero una cédula');
 if(!window.confirm('Se abrirá el generador PDF actual con los equipos. Revisa los campos del documento antes de descargarlo.'))return;
 ['home','away','cat','date','field','round','source','autogenerate'].forEach(k=>{
  const v=k==='home'?d.home:k==='away'?d.away:k==='cat'?CAT[d.categoryId]:k==='date'?d.date:k==='field'?d.field:k==='round'?d.round:k==='source'?'official-directory':'1';
  localStorage.setItem('v66-cedula-'+k,String(v||''));
 });
 close();if(window.LJR_MAIN_ROUTE?.go)window.LJR_MAIN_ROUTE.go('cedulaBuilder');else location.hash='#/cedulaBuilder';
}
function addEvent(){
 const minute=Number($('[data-v1181-minute]',modal)?.value);
 if(!Number.isInteger(minute)||minute<0||minute>150)return feedback('Minuto entre 0 y 150.');
 if(incidents.length>=100)return feedback('Máximo 100 incidencias.');
 incidents.push({type:$('[data-v1181-type]',modal)?.value||'note',team:$('[data-v1181-team]',modal)?.value||'general',
  minute,player:$('[data-v1181-player]',modal)?.value||'',detail:$('[data-v1181-desc]',modal)?.value||''});
 render();feedback('Incidencia agregada al formulario. Pulsa Guardar acta para enviarla al servidor.');
}
function close(){clearTimeout(saveTimer);modal?.remove();modal=null;activeDoc=null;incidents=[]}
async function open(){
 if(modal)return;
 modal=document.createElement('div');modal.innerHTML=modalHTML();modal=modal.firstElementChild;document.body.appendChild(modal);
 $('[data-v1181-close]',modal)?.addEventListener('click',close);
 modal.addEventListener('click',e=>{if(e.target===modal)close()});
 modal.addEventListener('input',scheduleSave);
 $('[data-v1181-document]',modal)?.addEventListener('change',e=>doing(()=>loadDoc(e.target.value)));
 modal.addEventListener('click',e=>{
  const button=e.target.closest('[data-v1181-action]');if(!button)return;
  const action=button.dataset.v1181Action;
  if(action==='pdf'){pdf();return}
  doing(async()=>{
   if(action==='create')return create();
   if(action==='reload')return list();
   if(action==='save')return save();
   if(action==='sign')return sign();
   if(action==='upload')return upload();
   if(action==='reminder')return reminder();
   if(action==='add-event')return addEvent();
   if(action.startsWith('delete-event-')){const n=Number(action.slice(13));if(Number.isInteger(n)&&n>=0&&n<incidents.length){incidents.splice(n,1);render();feedback('Incidencia quitada del formulario. Guarda el acta para confirmar.')}return}
   if(action.startsWith('state-'))return setStatus(action.slice(6));
   if(action.startsWith('file-'))return downloadAttachment(action.slice(5));
   return publicAction(action);
  });
 });
 await doing(async()=>{await list();feedback('Sesión autorizada. Los documentos permanecen en PostgreSQL.')});
}
async function mount(){
 if(url()!=='cedulas'){close();root=null;actor=null;return}
 const host=$('[data-v66-directory="cedulas"]');
 if(!host||host===root||checking||!window.LJR_MEDIA?.admin||typeof notifyApi()!=='function')return;
 checking=true;
 try{
  const response=await api('/admin/me');
  const authorized=response?.actor;
  if(!authorized?.permissions?.includes('cedulas:read'))return;
  actor=authorized;
  const button=document.createElement('button');button.type='button';button.className='v1181-entry';
  button.textContent='⚖ Gestionar cédulas · acceso privado';
  button.addEventListener('click',()=>open().catch(e=>{feedback('Error: '+String(e.message||e));}));
  const where=$('.v1131-tools',host)||$('.v638-cedula-top',host);
  where?.after(button);root=host;
 }catch(_){/* Sin sesión verificada, no se muestra el acceso */}finally{checking=false}
}
let scheduled=false;
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;mount()})}
function start(){
 const screen=$('#screen');if(!screen)return;
 new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
 window.addEventListener('hashchange',schedule);
 window.addEventListener('ljr:admin-login',schedule);window.addEventListener('ljr:admin-logout',schedule);
 schedule();setInterval(()=>{if(url()==='cedulas'&&!root)schedule()},3500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
else start();
})();
