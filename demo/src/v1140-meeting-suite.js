/* V1140: funciones avanzadas de juntas - extensión local, sin IA remota ni permisos ficticios. */
(()=>{'use strict';
if(window.LJR_MEETING_ADVANCED_V1140)return;
const $=(s,r=document)=>r?.querySelector?.(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const trim=(s,n=240)=>String(s??'').trim().slice(0,n);
const id=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9);
const today=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const fmt=d=>d?new Date(d+'T12:00:00').toLocaleDateString('es-MX',{day:'numeric',month:'long',year:'numeric'}):'Sin fecha';
const safeImage=s=>typeof s==='string'&&/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(s)&&s.length<230000?s:'';
const iconLabel=(s,v)=>'<label>'+s+'<input '+v+'></label>';
function summaryText(ctx){
 const r=ctx.item(),m=ctx.snapshot(),a=r.attendance||[],tasks=r.tasks||[],v=r.votes||[];
 const pending=tasks.filter(t=>t.status!=='Completado'),done=tasks.filter(t=>t.status==='Completado'),late=pending.filter(t=>t.due&&t.due<today());
 const statuses={Presente:0,Tarde:0,Ausente:0};a.forEach(x=>{if(Object.hasOwn(statuses,x.status))statuses[x.status]++});
 const topics=[['Resultados y jornadas',/jornada|resultado|marcador|partido|tabla/i],['Disciplina',/sanci[oó]n|amonesta|expuls|tarjeta|disciplina/i],['Arbitraje',/[aá]rbitro|arbitraje|silbante/i],['Campos y horarios',/cancha|campo|sede|horario|programaci[oó]n/i],['Registros',/registro|fichaje|credencial|jugador/i]];
 const material=[m.agenda,m.agreements,...tasks.map(t=>t.name)].join(' ');
 const detected=topics.filter(x=>x[1].test(material)).map(x=>x[0]);
 const lines=[
  'BORRADOR DE RESUMEN · Junta de la Liga Juventino Rosas',
  'Fecha: '+fmt(ctx.date())+' · Hora: '+(m.time||'Sin definir')+' · Lugar: '+(m.place||'Sin definir'),
  'Responsable: '+(m.owner||'Sin registrar'),
  'Presidente de la Liga (registrado): '+(m.president||'Sin asignar'),
  'Secretario de la Liga (registrado): '+(m.secretary||'Sin asignar'),
  'Asistencia: '+a.length+' equipos registrados ('+statuses.Presente+' presentes, '+statuses.Tarde+' tarde, '+statuses.Ausente+' ausentes).',
  'Temas detectados: '+(detected.join(', ')||'Sin temas clasificables todavía')+'.',
  'Orden del día: '+(m.agenda||'No se registró orden del día.'),
  'Acuerdos de la minuta: '+(m.agreements||'No se registraron acuerdos en la minuta.'),
  'Seguimiento: '+pending.length+' pendientes, '+done.length+' completados, '+late.length+' vencidos.'
 ];
 for(const t of pending.slice(0,15))lines.push('• '+trim(t.name,140)+' · '+(t.owner||'Sin responsable')+' · vence '+(t.due||'sin fecha')+' · '+t.status+(t.due&&t.due<today()?' [VENCIDO]':''));
 for(const p of v.slice(0,12)){
  const ballots=Object.values(p.ballots||{}),count=x=>ballots.filter(y=>y.vote===x).length;
  lines.push('Propuesta: '+trim(p.title,150)+' · Sí '+count('Sí')+' / No '+count('No')+' / Abstenciones '+count('Abstención')+' ('+ballots.length+' equipos).');
 }
 lines.push('Documento generado a partir de datos guardados; verificar antes de firmar o publicar. No es una transcripción ni una decisión oficial.');
 return lines.join('\n');
}
function viewSummary(ctx){
 const r=ctx.item(),s=r.summary||{},current=String(s.text||'');
 return '<div class="mh-overview"><b>Resumen inteligente · asistido</b><small>Organiza asistencia, temas, vencimientos y votaciones sin enviar datos a servicios externos.</small></div>'+
 '<p class="mh-tip">El texto es un borrador generado de los datos reales de esta junta. Revísalo y corrígelo antes de compartirlo.</p>'+
 '<div class="mh-buttons"><button type="button" data-mh-action="adv-summary-generate">Generar resumen</button><button type="button" data-mh-action="adv-summary-save">Guardar revisión</button></div>'+
 '<label class="mh-full">Resumen editable<textarea class="mh-adv-summary" data-mh-advanced="summary" rows="10" placeholder="Toca Generar resumen para analizar la reunión.">'+esc(current)+'</textarea></label>'+
 '<div class="mh-buttons"><button type="button" data-mh-action="adv-summary-copy">Copiar</button><button type="button" data-mh-action="adv-summary-txt">Descargar TXT</button></div>'+
 '<small class="mh-adv-footnote">'+(s.reviewed?'Revisado y guardado: '+esc(s.reviewed):'Pendiente de revisión por un administrador.')+'</small>';
}
function viewCalendar(ctx,base){
 return base+'<div class="mh-adv-extra"><h5>Recordatorios de la junta</h5><p class="mh-tip">Prepara la junta en Google Calendar o programa un aviso oficial en la app si el servidor privado está activo.</p>'+
 '<label>Anticipación<select data-mh-advanced="hours"><option value="24">24 horas antes</option><option value="2">2 horas antes</option><option value="1">1 hora antes</option></select></label>'+
 '<label class="mh-check"><input type="checkbox" data-mh-advanced="weekly"> Repetir todos los martes (calendario)</label>'+
 '<div class="mh-buttons"><button type="button" data-mh-action="adv-ics-reminders">Guardar junta en Google Calendar</button><button type="button" data-mh-action="adv-server-reminder">Programar aviso oficial en app</button></div>'+
 '<p class="mh-tip">Configura las alarmas en Google Calendar antes de guardar. WhatsApp sigue siendo un envío manual y voluntario. El aviso de la app usa permisos de servidor.</p></div>';
}
function viewMinutes(ctx,base){
 const sign=ctx.item().sign||{},imgs=sign.images||{};
 return base+'<div class="mh-adv-extra"><h5>Firmas manuscritas</h5><p class="mh-tip">Firma en el recuadro con el dedo. El nombre y la imagen quedan guardados en este dispositivo; no son una firma electrónica certificada.</p>'+
 ['president','secretary'].map(k=>'<div class="mh-adv-pad" data-mh-pad="'+k+'"><div class="mh-adv-pad-head"><b>'+(k==='president'?'Presidencia':'Secretaría')+'</b><button type="button" data-mh-action="adv-clear-sign" data-kind="'+k+'">Borrar firma</button></div><canvas data-mh-canvas="'+k+'" width="480" height="145" aria-label="Firma '+(k==='president'?'presidente':'secretario')+'"></canvas>'+(safeImage(imgs[k])?'<small>Firma capturada · revisa que sea correcta</small>':'<small>Sin firma manuscrita</small>')+'</div>').join('')+'</div>';
}
function viewFiles(ctx){
 const attachments=ctx.item().attachments||[];
 return '<div class="mh-overview"><b>Documentos y evidencias</b><small>Archivos guardados en este dispositivo, mediante IndexedDB.</small></div>'+
 '<p class="mh-tip">Adjunta fotos, PDF, Word o documentos. Máximo 12 MB por archivo. El respaldo JSON guarda sus referencias, pero no incluye los archivos: descárgalos aparte para conservarlos.</p>'+
 '<label>Seleccionar archivo<input type="file" data-mh-file="evidence" accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xlsx,.txt"></label>'+
 '<div class="mh-records">'+(attachments.length?attachments.map(f=>'<div class="mh-record"><div><b>'+esc(f.name)+'</b><small>'+Math.round(f.size/1024)+' KB · '+esc(f.added||'')+'</small></div><div class="mh-mini"><button type="button" data-mh-action="adv-open-file" data-id="'+esc(f.id)+'">Abrir</button><button type="button" data-mh-action="adv-delete-file" data-id="'+esc(f.id)+'">Quitar</button></div></div>').join(''):'<p class="mh-empty">Todavía no se han adjuntado archivos.</p>')+'</div>'+
 '<div class="mh-adv-extra"><h5>Respaldo del historial</h5><p class="mh-tip">Descarga una copia JSON de las juntas para recuperar acuerdos, minutas, asistencia y votaciones. La importación conserva los registros existentes: no sobreescribe fechas guardadas.</p>'+
 '<div class="mh-buttons"><button type="button" data-mh-action="export">Descargar JSON</button><button type="button" data-mh-action="adv-import">Importar respaldo</button></div>'+
 '<input type="file" accept=".json,application/json" data-mh-file="restore" hidden><small>Los adjuntos de IndexedDB se exportan por separado.</small></div>';
}
function view(tab,ctx,base){
 if(tab==='summary')return viewSummary(ctx);
 if(tab==='calendar')return viewCalendar(ctx,base);
 if(tab==='minutes')return viewMinutes(ctx,base);
 if(tab==='files')return viewFiles(ctx);
 return null;
}
const dbName='LJR-Juntas-Archivos';
function openDB(){
 return new Promise((resolve,reject)=>{
  if(!('indexedDB'in window))return reject(Error('IndexedDB no disponible'));
  const req=window.indexedDB.open(dbName,1);
  req.onupgradeneeded=()=>{if(!req.result.objectStoreNames.contains('files'))req.result.createObjectStore('files',{keyPath:'id'})};
  req.onerror=()=>reject(req.error||Error('Error de base local'));req.onsuccess=()=>resolve(req.result);
 });
}
async function dbOperation(mode,val){
 const db=await openDB();
 try{return await new Promise((resolve,reject)=>{
  const tx=db.transaction('files',mode==='read'?'readonly':'readwrite'),store=tx.objectStore('files');
  const req=mode==='put'?store.put(val):mode==='delete'?store.delete(val):store.get(val);
  req.onsuccess=()=>resolve(req.result);
  req.onerror=()=>reject(req.error||Error('No se pudo acceder al archivo'));
  tx.onabort=()=>reject(tx.error||Error('Almacenamiento interrumpido'));
 })}finally{db.close()}
}
function addFile(file,ctx){
 if(!file)return;
 const mime=String(file.type||'').toLowerCase();
 const ext=/\.(jpe?g|png|webp|pdf|docx?|xlsx|txt)$/i.test(file.name);
 if(!ext||file.size<1||file.size>12*1024*1024)return ctx.msg('Archivo inválido o mayor de 12 MB.');
 const r=ctx.item(),ref={id:id(),name:trim(file.name,150),size:file.size,mime,added:new Date().toISOString().slice(0,10)};
 dbOperation('put',{id:ref.id,blob:file,name:ref.name,mime}).then(()=>{
  if(!Array.isArray(r.attachments))r.attachments=[];r.attachments.push(ref);ctx.persist();ctx.render();ctx.msg('Evidencia guardada localmente. Descárgala antes de limpiar los datos del navegador.');
 }).catch(e=>ctx.msg('No se pudo guardar evidencia: '+e.message));
}
function openFile(file,ctx){
 if(!file)return;dbOperation('read',file.id).then(x=>{
  if(!x?.blob)return ctx.msg('Falta este archivo local. Busca su copia original.');
  const url=URL.createObjectURL(x.blob),a=document.createElement('a');a.href=url;a.download=file.name;a.rel='noopener';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),20000);
 }).catch(e=>ctx.msg(e.message));
}
const icsEsc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[,;]/g,'\\$&');
const stamp=()=>new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function clock(ctx){
 const d=ctx.date(),m=ctx.snapshot();if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return null;
 const t=/^\d{2}:\d{2}$/.test(m.time)?m.time:'19:00',start=new Date(d+'T'+t+':00-06:00');
 if(!Number.isFinite(+start))return null;const end=new Date(+start+60*60000);
 const fmtUTC=x=>x.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
 const local=x=>x.replace(/-/g,'')+'T'+t.replace(':','')+'00';
 return {m,d,t,start,end,fmtUTC,local};
}
function alarmCalendar(ctx){
 const x=clock(ctx);if(!x)return ctx.msg('Introduce una fecha válida de junta.');
 const weekly=!!$('[data-mh-advanced="weekly"]',ctx.host)?.checked;
 const hours=Number($('[data-mh-advanced="hours"]',ctx.host)?.value)||24;
 const opened=window.LJR_GOOGLE_CALENDAR_GLOBAL.open({
   title:'Junta de la Liga Juventino Rosas',iso:x.d,time:x.t,duration:60,
   venue:x.m.place||'',weekly,
   description:(x.m.agenda||'Orden del día por confirmar')+' · Recordatorio sugerido: '+hours+' horas antes. Ajusta los avisos al guardar.'
 });
 if(opened)ctx.msg('Google Calendar se abrió con la junta. Revisa los avisos y pulsa Guardar.');
}
async function serverReminder(ctx){
 const x=clock(ctx);if(!x)return ctx.msg('Introduce una fecha válida.');
 if(!window.LJR_MEDIA?.admin||!window.LJR_MEDIA?.notifyAPI)return ctx.msg('Inicia sesión de administración.');
 const hours=Number($('[data-mh-advanced="hours"]',ctx.host)?.value)||24;
 const sendAt=new Date(x.start.getTime()-hours*3600000);
 if(sendAt.getTime()<Date.now()+180000)return ctx.msg('El horario del recordatorio ya pasó; selecciona otra anticipación o fecha.');
 if(!window.confirm('¿Programar aviso oficial en la app '+hours+' horas antes de la junta?'))return;
 try{
  const me=await window.LJR_MEDIA.notifyAPI('/admin/me');
  if(!me.actor?.permissions?.includes('notices:write'))return ctx.msg('Tu rol no permite programar avisos.');
  const r=await window.LJR_MEDIA.notifyAPI('/admin/notices',{method:'POST',body:{
   title:'Recordatorio · Junta de la Liga',body:'Junta el '+fmt(x.d)+' a las '+x.t+'. Lugar: '+(trim(x.m.place,100)||'por confirmar')+'. Consulta el orden del día en la aplicación.',
   sendAt:sendAt.toISOString(),category:'Todas',channels:['app'],type:'junta'
  }});
  ctx.msg(r?.ok?'Aviso programado en el servidor oficial.':'El servidor no confirmó la programación.');
 }catch(e){ctx.msg('No se programó ningún aviso: '+String(e?.message||'servidor no configurado').slice(0,160))}
}
function initializeSignatures(ctx){
 const r=ctx.item(),saved=r.sign?.images||{};
 ctx.host.querySelectorAll('canvas[data-mh-canvas]').forEach(canvas=>{
  const role=canvas.dataset.mhCanvas,context=canvas.getContext?.('2d');if(!context)return;
  context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
  if(safeImage(saved[role])&&typeof Image!=='undefined'){
   const img=new Image();img.onload=()=>{context.drawImage(img,0,0,canvas.width,canvas.height)};img.src=saved[role];
  }
  context.strokeStyle='#0b2b63';context.lineWidth=3;context.lineJoin='round';context.lineCap='round';
  let drawing=false;
  const pos=e=>{const box=canvas.getBoundingClientRect();return {x:(e.clientX-box.left)*canvas.width/box.width,y:(e.clientY-box.top)*canvas.height/box.height}};
  canvas.addEventListener('pointerdown',e=>{if(!window.LJR_MEDIA?.admin)return;e.preventDefault();drawing=true;canvas.setPointerCapture?.(e.pointerId);const p=pos(e);context.beginPath();context.moveTo(p.x,p.y);context.lineTo(p.x+.01,p.y+.01);context.stroke()});
  canvas.addEventListener('pointermove',e=>{if(!drawing)return;e.preventDefault();const p=pos(e);context.lineTo(p.x,p.y);context.stroke()});
  const finish=()=>{if(!drawing)return;drawing=false;if(!r.sign)r.sign={};if(!r.sign.images)r.sign.images={};r.sign.images[role]=canvas.toDataURL('image/png');r.sign.approved=false;ctx.persist();ctx.msg('Firma guardada en este dispositivo; vuelve a marcar la conformidad tras revisarla.')};
  canvas.addEventListener('pointerup',finish);canvas.addEventListener('pointercancel',finish);canvas.addEventListener('lostpointercapture',finish);
 });
}
function exportText(text,file,ctx){ctx.download(file,text,'text/plain;charset=utf-8')}
async function restore(file,ctx){
 if(!file||file.size>2*1024*1024)return ctx.msg('El respaldo JSON no es válido o supera 2 MB.');
 try{
  const parsed=JSON.parse(await file.text());
  if(!['LJR-meetings-v1130','LJR-meetings-v1140'].includes(parsed.format)||!parsed.records||typeof parsed.records!=='object'||Array.isArray(parsed.records))throw Error('Formato de respaldo no reconocido');
  const candidates=Object.entries(parsed.records);
  if(candidates.length>300)throw Error('Respaldo excede el límite de 300 juntas');
  const valid=candidates.filter(([d,r])=>ctx.validDate(d)&&r&&typeof r==='object'&&!Array.isArray(r));
  const fresh=valid.filter(([d])=>!Object.hasOwn(ctx.state,d));
  if(!fresh.length)return ctx.msg('No hay fechas nuevas. Se conservaron todos los registros existentes.');
  if(!window.confirm('¿Importar '+fresh.length+' juntas nuevas? Las fechas existentes no se reemplazarán.'))return;
  for(const [d,r] of fresh){
   ctx.state[d]={
    attendance:Array.isArray(r.attendance)?r.attendance.slice(0,1000):[],
    tasks:Array.isArray(r.tasks)?r.tasks.slice(0,2000):[],
    votes:Array.isArray(r.votes)?r.votes.slice(0,200):[],
    sign:r.sign&&typeof r.sign==='object'?r.sign:{president:'',secretary:'',approved:false},
    evidence:Array.isArray(r.evidence)?r.evidence.slice(0,250):[],
    attachments:Array.isArray(r.attachments)?r.attachments.slice(0,250):[],
    minute:r.minute&&typeof r.minute==='object'?r.minute:{},
    summary:r.summary&&typeof r.summary==='object'?r.summary:{},
    created:Number(r.created)||Date.now(),updated:Number(r.updated)||Date.now()
   };
  }
  try{localStorage.setItem(ctx.KEY,JSON.stringify(ctx.state))}catch(e){for(const [d] of fresh)delete ctx.state[d];throw Error('No hay espacio disponible para importar el respaldo')}
  ctx.render();ctx.msg(fresh.length+' juntas recuperadas. Las fechas existentes se conservaron; los adjuntos físicos no vienen en el JSON.');
 }catch(e){ctx.msg('No se importó el respaldo: '+e.message)}
}
function onChange(e,ctx){
 if(!window.LJR_MEDIA?.admin){ctx.msg('Inicia sesión de administración.');return true}
 if(e.target?.matches?.('[data-mh-file="evidence"]')){addFile(e.target.files?.[0],ctx);return true}
 if(e.target?.matches?.('[data-mh-file="restore"]')){restore(e.target.files?.[0],ctx);return true}
 return false;
}
function handle(action,target,ctx){
 if(!action.startsWith('adv-'))return false;
 if(!window.LJR_MEDIA?.admin){ctx.msg('Inicia sesión de administración.');return true}
 const r=ctx.item();
 if(action==='adv-summary-generate'){
  ctx.preserve();
  r.summary={text:summaryText(ctx),reviewed:''};ctx.persist();ctx.render();ctx.msg('Resumen creado a partir de datos guardados: revísalo antes de usarlo.');
 }else if(action==='adv-summary-save'){
  r.summary={text:trim($('[data-mh-advanced="summary"]',ctx.host)?.value,12000),reviewed:new Date().toLocaleString('es-MX')};ctx.persist();ctx.render();ctx.msg('Resumen revisado y guardado.');
 }else if(action==='adv-summary-copy'){
  const text=$('[data-mh-advanced="summary"]',ctx.host)?.value||'';if(!text)return ctx.msg('Genera o escribe un resumen primero.');
  navigator.clipboard?.writeText(text).then(()=>ctx.msg('Resumen copiado.')).catch(()=>ctx.msg('No se pudo copiar; selecciona el texto.'))||ctx.msg('Selecciona el texto para copiarlo.');
 }else if(action==='adv-summary-txt'){
  exportText($('[data-mh-advanced="summary"]',ctx.host)?.value||summaryText(ctx),'resumen-junta-'+ctx.date()+'.txt',ctx);
 }else if(action==='adv-ics-reminders')alarmCalendar(ctx);
 else if(action==='adv-server-reminder')serverReminder(ctx);
 else if(action==='adv-clear-sign'){
  if(!window.confirm('¿Borrar esta firma manuscrita del registro local?'))return true;
  if(!r.sign)r.sign={};if(!r.sign.images)r.sign.images={};delete r.sign.images[target.dataset.kind];r.sign.approved=false;ctx.persist();ctx.render();
 }else if(action==='adv-import')$('[data-mh-file="restore"]',ctx.host)?.click();
 else if(action==='adv-open-file'){openFile((r.attachments||[]).find(x=>x.id===target.dataset.id),ctx)}
 else if(action==='adv-delete-file'){
  const attachments=r.attachments||[],idx=attachments.findIndex(x=>x.id===target.dataset.id);
  if(idx<0||!window.confirm('¿Eliminar este adjunto de este dispositivo?'))return true;
  const [a]=attachments.splice(idx,1);dbOperation('delete',a.id).catch(e=>ctx.msg('Error al borrar archivo: '+e.message));ctx.persist();ctx.render();
 }
 return true;
}
const afterRender=(tab,ctx)=>{if(tab==='minutes')initializeSignatures(ctx)};
window.LJR_MEETING_ADVANCED_V1140={view,handle,afterRender,onChange,summaryText};
})();