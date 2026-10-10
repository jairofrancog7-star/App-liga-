/* V1130 · Junta de la Liga: local-first operations. No claims of remote sync or automatic delivery. */
(()=>{'use strict';
if(window.LJR_MEETING_HUB_V1130)return;
const KEY='ljr-meeting-hub-v1130';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clean=s=>String(s||'').trim().slice(0,240);
const uid=()=>Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8);
const empty=()=>({attendance:[],tasks:[],votes:[],sign:{president:'',secretary:'',approved:false},evidence:[],created:Date.now(),updated:Date.now()});
const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return x&&typeof x==='object'&&!Array.isArray(x)?x:{}}catch(_){return {}}};
const state=read();
const drafts={};
const advanced=()=>window.LJR_MEETING_ADVANCED_V1140;
const sync=()=>window.LJR_MEETING_SYNC_V1150;
let form=null,host=null,tab='attendance',qrValue='',scanner=null,search='';
function date(){return $('input[data-x="date"]',form)?.value||''}
function validDate(d){if(!/^\d{4}-\d{2}-\d{2}$/.test(d))return false;const x=new Date(d+'T12:00:00');return !isNaN(x)&&x.getDay()===2}
function item(d=date()){const r=state[d]||(drafts[d]||(drafts[d]=empty()));for(const k of ['attendance','tasks','votes','evidence'])if(!Array.isArray(r[k]))r[k]=[];if(!r.sign)r.sign={president:'',secretary:'',approved:false};return r}
function persist(d=date()){if(!validDate(d))return msg('Selecciona una fecha de martes válida.');const r=item(d);r.updated=Date.now();state[d]=r;try{localStorage.setItem(KEY,JSON.stringify(state))}catch(_){msg('Sin espacio local. Exporta tu respaldo y libera almacenamiento.');return}msg('Guardado en este dispositivo, sin sincronización en línea.')}
function msg(s){const el=$('[data-mh-status]',host);if(el)el.textContent=s}
function fmt(d){if(!d)return '—';const x=new Date(d+'T12:00:00');return isNaN(x)?d:x.toLocaleDateString('es-MX',{day:'numeric',month:'short',year:'numeric'})}
function go(t){tab=t;render()}
function line(t){return esc(t).replace(/\n/g,'<br>')}
function txt(sel){return $(sel,form)?.value?.trim()||''}
function field(name){return txt('[data-meeting-field="'+name+'"]')}
function set(sel,value){const el=$(sel,form);if(el){el.value=value||'';el.dispatchEvent(new Event('input',{bubbles:true}))}}
function snapshot(){return {date:date(),agenda:txt('[data-x="agenda"]'),agreements:txt('[data-x="agreements"]'),attendanceText:txt('[data-x="attendance"]'),time:field('time'),place:field('place'),owner:field('owner'),deadline:field('deadline'),taskNotes:field('tasks')}}
function preserve(){const d=date();if(!validDate(d))return;const r=item(d);r.minute=snapshot();persist(d)}
function applyMinute(s){if(!s)return;set('[data-x="agenda"]',s.agenda);set('[data-x="agreements"]',s.agreements);set('[data-x="attendance"]',s.attendanceText);for(const k of ['time','place','owner','deadline'])set('[data-meeting-field="'+k+'"]',s[k]);set('[data-meeting-field="tasks"]',s.taskNotes)}
function button(action,label,more=''){return '<button type="button" data-mh-action="'+action+'" '+more+'>'+label+'</button>'}
function allNames(){return [...new Set(item().attendance.map(a=>a.team).filter(Boolean))]}
function qrSvg(text){
 if(typeof window.qrcode!=='function')return '';
 try{const qr=window.qrcode(0,'M');qr.addData(text,'Byte');qr.make();const n=qr.getModuleCount(),a=[];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++)if(qr.isDark(y,x))a.push('M'+(x+4)+' '+(y+4)+'h1v1h-1z');
 return '<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Código QR de asistencia" viewBox="0 0 '+(n+8)+' '+(n+8)+'"><rect width="100%" height="100%" fill="#fff"/><path d="'+a.join('')+'" fill="#072054"/></svg>'}catch(e){return ''}
}
function code(d,team,delegate){return 'LJR-JUNTA|'+d+'|'+encodeURIComponent(team)+'|'+encodeURIComponent(delegate)}
function parseCode(s){const p=String(s||'').trim().split('|');if(p.length!==4||p[0]!=='LJR-JUNTA'||!validDate(p[1]))return null;try{return {date:p[1],team:clean(decodeURIComponent(p[2])),delegate:clean(decodeURIComponent(p[3]))}}catch(_){return null}}
function checkin(raw){const data=parseCode(raw);if(!data||!data.team||!data.delegate)return msg('Código de junta no válido.');if(data.date!==date())return msg('Este pase corresponde a otra fecha.');let r=item();const id=data.team.toLocaleLowerCase('es-MX');const prev=r.attendance.find(x=>x.team.toLocaleLowerCase('es-MX')===id);if(prev){prev.delegate=data.delegate;prev.status='Presente';prev.at=new Date().toISOString()}else r.attendance.push({id:uid(),team:data.team,delegate:data.delegate,status:'Presente',at:new Date().toISOString()});persist();qrValue='';go('attendance')}
function attendance(){
 const a=item().attendance;
 return '<div class="mh-stats">'+[['Equipos',a.length],['Presentes',a.filter(x=>x.status==='Presente').length],['Tarde',a.filter(x=>x.status==='Tarde').length],['Ausentes',a.filter(x=>x.status==='Ausente').length]].map(x=>'<div><small>'+x[0]+'</small><b>'+x[1]+'</b></div>').join('')+'</div>'+
 '<p class="mh-tip">Registra un delegado por equipo. El QR se lee en el dispositivo del administrador; no registra asistencia a distancia sin servidor.</p>'+
 '<div class="mh-fields"><label>Equipo<input data-mh-input="team" placeholder="Nombre del equipo" maxlength="90"></label><label>Delegado<input data-mh-input="delegate" placeholder="Nombre del delegado" maxlength="120"></label><label>Estado<select data-mh-input="status"><option>Presente</option><option>Tarde</option><option>Ausente</option></select></label></div>'+
 '<div class="mh-buttons">'+button('add-attendee','Agregar / actualizar')+button('make-qr','Generar pase QR')+button('camera','Escanear QR')+'</div>'+
 (qrValue?'<div class="mh-qr">'+qrSvg(qrValue)+'<small>Presenta este pase al administrador para registrar asistencia.</small>'+button('copy-qr','Copiar código')+'</div>':'')+
 '<label>Introducir código QR manualmente<input data-mh-input="qrtext" placeholder="Pega el código de asistencia"></label>'+button('paste-qr','Registrar código')+
 '<div class="mh-records">'+(a.length?a.map(p=>'<div class="mh-record"><div><b>'+esc(p.team)+'</b><small>'+esc(p.delegate)+' · '+esc(p.status)+'</small></div><div class="mh-mini">'+button('cycle-attendee','Cambiar', 'data-id="'+esc(p.id)+'"')+button('remove-attendee','Quitar','data-id="'+esc(p.id)+'"')+'</div></div>').join(''):'<p class="mh-empty">Todavía no hay delegados registrados.</p>')+'</div>';
}
function tasks(){
 const a=item().tasks;
 return '<p class="mh-tip">Asigna acuerdos concretos con responsable y fecha límite. El estado se conserva por cada martes.</p><div class="mh-fields"><label class="mh-full">Acuerdo<input data-mh-input="task" placeholder="Ej. Confirmar árbitros" maxlength="240"></label><label>Responsable<input data-mh-input="owner" placeholder="Equipo o delegado" maxlength="120"></label><label>Fecha límite<input type="date" data-mh-input="due"></label></div>'+button('add-task','Agregar acuerdo')+
 '<div class="mh-records">'+(a.length?a.map(t=>'<div class="mh-record"><div><b>'+esc(t.name)+'</b><small>'+esc(t.owner||'Sin responsable')+' · '+fmt(t.due)+' · '+esc(t.status)+'</small></div><div class="mh-mini">'+button('cycle-task','Cambiar estado','data-id="'+esc(t.id)+'"')+button('remove-task','Quitar','data-id="'+esc(t.id)+'"')+'</div></div>').join(''):'<p class="mh-empty">No hay acuerdos asignados todavía.</p>')+'</div>';
}
function votes(){
 const a=item().votes;
 return '<p class="mh-tip">Votación administrativa: un voto registrado por equipo para cada propuesta. No verifica identidad ni sustituye una votación oficial autenticada.</p>'+
 '<div class="mh-fields"><label class="mh-full">Propuesta<input data-mh-input="proposal" placeholder="Ej. Aprobar cambio de cancha" maxlength="180"></label></div>'+button('add-proposal','Crear propuesta')+
 a.map(v=>{const tally=z=>Object.values(v.ballots||{}).filter(b=>b.vote===z).length;return '<div class="mh-proposal" data-proposal="'+esc(v.id)+'"><b>'+esc(v.title)+'</b><small>A favor '+tally('Sí')+' · En contra '+tally('No')+' · Abstención '+tally('Abstención')+'</small><div class="mh-fields"><label>Equipo<input data-mh-vote="team" maxlength="90" placeholder="Equipo"></label><label>Voto<select data-mh-vote="vote"><option>Sí</option><option>No</option><option>Abstención</option></select></label></div><div class="mh-buttons">'+button('cast-vote','Registrar voto','data-id="'+esc(v.id)+'"')+button('remove-proposal','Eliminar','data-id="'+esc(v.id)+'"')+'</div><div class="mh-ballots">'+Object.values(v.ballots||{}).map(b=>'<small>'+esc(b.team)+' · '+esc(b.vote)+'</small>').join('')+'</div></div>'}).join('')+
 (!a.length?'<p class="mh-empty">Sin propuestas registradas.</p>':'');
}
function minutes(){
 const r=item(),s=r.sign;
 return '<p class="mh-tip">Estas firmas son nombres de conformidad escritos por el administrador, no firmas digitales certificadas.</p><div class="mh-fields"><label>Presidente<input data-mh-sign="president" value="'+esc(s.president)+'" placeholder="Nombre"></label><label>Secretario<input data-mh-sign="secretary" value="'+esc(s.secretary)+'" placeholder="Nombre"></label></div><label class="mh-check"><input type="checkbox" data-mh-sign="approved" '+(s.approved?'checked':'')+'> Confirmo que los acuerdos fueron revisados</label>'+
 '<div class="mh-buttons">'+button('save-sign','Guardar conformidad')+button('print-act','Imprimir acta / PDF')+button('export','Descargar respaldo JSON')+'</div>'+
 '<p class="mh-tip">Adjunta referencias HTTPS a documentos o evidencias. Los archivos no se suben ni se sincronizan automáticamente.</p><div class="mh-fields"><label class="mh-full">Descripción<input data-mh-input="evidtitle" maxlength="120" placeholder="Ej. Fotografías de la reunión"></label><label class="mh-full">Enlace HTTPS<input data-mh-input="evidlink" placeholder="https://..." inputmode="url"></label></div>'+button('add-evidence','Guardar referencia')+
 '<div class="mh-records">'+r.evidence.map(e=>'<div class="mh-record"><a href="'+esc(e.url)+'" target="_blank" rel="noopener noreferrer">'+esc(e.title)+'</a>'+button('remove-evidence','Quitar','data-id="'+esc(e.id)+'"')+'</div>').join('')+'</div>';
}
function history(){
 const rows=Object.entries(state).filter(([d,r])=>validDate(d)&&r&&(!search||JSON.stringify(r).toLocaleLowerCase('es-MX').includes(search)||d.includes(search))).sort((a,b)=>b[0].localeCompare(a[0]));
 return '<label>Buscar por fecha, equipo o acuerdo<input data-mh-input="search" placeholder="Buscar juntas guardadas..." value="'+esc(search)+'"></label><div class="mh-records">'+(rows.length?rows.map(([d,r])=>'<div class="mh-record"><div><b>'+fmt(d)+'</b><small>'+(r.attendance||[]).length+' equipos · '+(r.tasks||[]).length+' acuerdos · '+(r.votes||[]).length+' propuestas</small></div>'+button('load-meeting','Abrir','data-date="'+esc(d)+'"')+'</div>').join(''):'<p class="mh-empty">No hay juntas que coincidan.</p>')+'</div>';
}
function calendar(){
 const s=snapshot();
 return '<p class="mh-tip">Crea un evento en Google Calendar o descarga un archivo .ics para invitar a los delegados. El envío de WhatsApp requiere confirmación manual.</p><div class="mh-overview"><b>'+fmt(date())+'</b><small>'+esc(s.time||'Hora por definir')+' · '+esc(s.place||'Lugar por definir')+'</small></div><div class="mh-buttons">'+button('google','Abrir Google Calendar')+button('ics','Descargar invitación .ics')+button('whatsapp','Compartir convocatoria')+'</div><p class="mh-tip">Los recordatorios recurrentes y sincronización multiusuario necesitan un backend con consentimiento.</p>';
}
const advancedCtx={get host(){return host},KEY,state,date,item,snapshot,preserve,persist,render,go,download,validDate,fmt,esc,msg,applyMinute};
function render(){
 if(!host?.isConnected)return;
 const choices=[['attendance','Asistencia'],['tasks','Acuerdos'],['votes','Votaciones'],['minutes','Acta'],['history','Historial'],['calendar','Calendario'],['summary','Resumen'],['files','Archivos'],['sync','Servidor']];
 const views={attendance,tasks,votes,minutes,history,calendar};
 const base=views[tab]?.()||'';
 const replacement=tab==='sync'?sync()?.view?.(advancedCtx):advanced()?.view?.(tab,advancedCtx,base);
 const body=replacement??base;
 host.innerHTML='<div class="mh-header"><div><small>GESTIÓN DE JUNTAS</small><h4>Control de delegados</h4></div><span>Local</span></div><div class="mh-tabs" role="tablist" aria-label="Herramientas de junta">'+choices.map(([id,label])=>'<button type="button" role="tab" aria-selected="'+(id===tab)+'" data-mh-action="tab" data-tab="'+id+'" class="'+(id===tab?'active':'')+'">'+label+'</button>').join('')+'</div><div class="mh-body">'+body+'</div><p class="mh-status" aria-live="polite" data-mh-status>Los registros nuevos se guardan solo en este navegador.</p>';
 advanced()?.afterRender?.(tab,advancedCtx);
}
function download(file,content,type){const b=new Blob([content],{type}),url=URL.createObjectURL(b),a=document.createElement('a');a.href=url;a.download=file;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1200)}
const icsEsc=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/[,;]/g,'\\$&');
function when(d,t){return d.replace(/-/g,'')+'T'+(t||'19:00').replace(':','')+'00'}
function eventInfo(){const d=date(),s=snapshot();if(!validDate(d))return null;const t=/^\d{2}:\d{2}$/.test(s.time)?s.time:'19:00';const end=new Date(d+'T'+t+':00');end.setHours(end.getHours()+1);const p=n=>String(n).padStart(2,'0');return {start:when(d,t),end:when(d,p(end.getHours())+':'+p(end.getMinutes())),name:'Junta de la Liga Juventino Rosas',place:s.place,description:'Orden del día: '+s.agenda}}
function doCalendar(mode){
 const x=eventInfo();if(!x)return msg('Selecciona una fecha válida.');
 if(mode==='google'){const u=new URL('https://calendar.google.com/calendar/render');u.searchParams.set('action','TEMPLATE');u.searchParams.set('text',x.name);u.searchParams.set('dates',x.start+'/'+x.end);u.searchParams.set('details',x.description);u.searchParams.set('location',x.place);u.searchParams.set('ctz','America/Mexico_City');window.open(u.toString(),'_blank','noopener,noreferrer');return}
 const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Juntas//ES','BEGIN:VEVENT','UID:ljr-junta-'+date()+'@juventinorosasliga.local','DTSTAMP:'+new Date().toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'').replace('Z','Z'),'DTSTART;TZID=America/Mexico_City:'+x.start,'DTEND;TZID=America/Mexico_City:'+x.end,'SUMMARY:'+icsEsc(x.name),'LOCATION:'+icsEsc(x.place),'DESCRIPTION:'+icsEsc(x.description),'END:VEVENT','END:VCALENDAR'].join('\r\n');download('convocatoria-junta-'+date()+'.ics',ics,'text/calendar;charset=utf-8');
}
function whatsapp(){const x=eventInfo();if(!x)return msg('Selecciona una fecha válida.');const s=snapshot(),message='Convocatoria · Junta de la Liga Juventino Rosas\nFecha: '+fmt(date())+'\nHora: '+(s.time||'por definir')+'\nLugar: '+(s.place||'por definir')+'\nOrden del día: '+(s.agenda||'Por confirmar');window.open('https://wa.me/?text='+encodeURIComponent(message),'_blank','noopener,noreferrer')}
function printAct(){
 const d=date(),r=item(),s=snapshot();const blocks=[
 ['Asistencia',r.attendance.map(a=>a.team+' — '+a.delegate+' ('+a.status+')').join('\n')],
 ['Orden del día',s.agenda],['Acuerdos / minuta',s.agreements],['Seguimiento',r.tasks.map(t=>t.name+' — '+(t.owner||'—')+' — '+(t.due||'—')+' ('+t.status+')').join('\n')],
 ['Votaciones',r.votes.map(v=>v.title+': '+Object.values(v.ballots||{}).map(b=>b.team+' '+b.vote).join(', ')).join('\n')]
 ];
 if(r.summary?.reviewed&&r.summary?.text)blocks.push(['Resumen revisado',r.summary.text]);
 const signature=s=>/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(String(s||''))&&s.length<230000?s:'';
 const html='<!doctype html><html lang="es"><meta charset="utf-8"><title>Acta Junta '+esc(d)+'</title><style>@page{size:letter;margin:15mm}body{font:12px Arial;color:#102142}h1{color:#084c9e}h2{font-size:15px;color:#0956aa;border-bottom:1px solid #ddd;padding-bottom:5px}.field{padding:10px 0;white-space:pre-wrap;line-height:1.5}.meta{background:#eef5ff;padding:12px;border-radius:8px}footer{margin-top:35px;display:flex;gap:25px}footer div{flex:1;border-top:1px solid #777;padding-top:10px}footer img{display:block;width:180px;height:70px;object-fit:contain}</style><h1>Liga Municipal de Fútbol Juventino Rosas</h1><h2>Acta de junta semanal</h2><div class="meta">Fecha: '+esc(fmt(d))+' · Hora: '+esc(s.time||'—')+' · Lugar: '+esc(s.place||'—')+' · Responsable: '+esc(s.owner||'—')+'</div>'+blocks.map(([h,v])=>'<section><h2>'+esc(h)+'</h2><div class="field">'+line(v||'Sin registros')+'</div></section>').join('')+'<footer><div>'+(signature(r.sign?.images?.president)?'<img src="'+signature(r.sign.images.president)+'" alt="Firma de presidencia">':'')+'Presidente: '+esc(r.sign.president||'Sin registrar')+'</div><div>'+(signature(r.sign?.images?.secretary)?'<img src="'+signature(r.sign.images.secretary)+'" alt="Firma de secretaría">':'')+'Secretario: '+esc(r.sign.secretary||'Sin registrar')+'</div></footer><p>Conformidad registrada: '+(r.sign.approved?'Sí':'No')+'. Documento generado desde datos locales; requiere validación de los responsables.</p></html>';
 const frame=document.createElement('iframe');frame.style.cssText='position:fixed;left:-10000px;top:0;width:816px;height:1000px;border:0';frame.setAttribute('aria-hidden','true');document.body.append(frame);frame.onload=()=>{try{frame.contentWindow.focus();frame.contentWindow.print()}catch(_){msg('No se pudo imprimir; usa Descargar respaldo.')}};frame.srcdoc=html;setTimeout(()=>frame.remove(),60000);
}
function exportData(){preserve();download('respaldo-juntas-liga-'+date()+'.json',JSON.stringify({format:'LJR-meetings-v1130',exported:new Date().toISOString(),records:state},null,2),'application/json;charset=utf-8')}
async function camera(){
 if(!navigator.mediaDevices?.getUserMedia||!('BarcodeDetector'in window))return msg('Escáner no compatible aquí. Pega un código QR en el campo manual.');
 if(scanner)return;const video=document.createElement('video');video.setAttribute('playsinline','');video.autoplay=true;video.muted=true;
 const layer=document.createElement('div');layer.className='mh-camera';layer.innerHTML='<p>Apunta al QR de un delegado.</p>'+button('close-camera','Cerrar cámara');layer.prepend(video);host.append(layer);
 try{const stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}},audio:false});if(!layer.isConnected){stream.getTracks().forEach(t=>t.stop());return}scanner={stream,layer,active:true};video.srcObject=stream;await video.play();const detector=new BarcodeDetector({formats:['qr_code']});let busy=false;
 const loop=async()=>{if(!scanner?.active)return;if(!busy&&video.readyState>=2){busy=true;try{const codes=await detector.detect(video);if(codes.length){const data=parseCode(codes[0].rawValue);if(data){stopCamera();checkin(codes[0].rawValue);return}}}catch(_){}busy=false}requestAnimationFrame(loop)};requestAnimationFrame(loop)
 }catch(e){layer.remove();msg('Permiso de cámara denegado o dispositivo no compatible. Usa el código manual.')}
}
function stopCamera(){if(scanner){scanner.active=false;scanner.stream.getTracks().forEach(t=>t.stop());scanner.layer.remove();scanner=null}}
function handle(action,target){
 if(!window.LJR_MEDIA?.admin)return msg('Inicia sesión de administración para modificar la junta.');
 if(action==='tab')return go(target.dataset.tab);
 if(sync()?.handle?.(action,target,advancedCtx))return;
 if(advanced()?.handle?.(action,target,advancedCtx))return;
 if(action==='close-camera'){stopCamera();return}
 if(action==='camera')return camera();
 if(action==='add-attendee'||action==='make-qr'){
 const team=clean($('[data-mh-input="team"]',host)?.value),delegate=clean($('[data-mh-input="delegate"]',host)?.value),status=$('[data-mh-input="status"]',host)?.value||'Presente';
 if(!team||!delegate)return msg('Escribe equipo y delegado.');
 if(action==='make-qr'){qrValue=code(date(),team,delegate);return render()}
 const a=item().attendance,prev=a.find(p=>p.team.toLocaleLowerCase('es-MX')===team.toLocaleLowerCase('es-MX'));if(prev)Object.assign(prev,{delegate,status,at:new Date().toISOString()});else a.push({id:uid(),team,delegate,status,at:new Date().toISOString()});persist();return render();
 }
 if(action==='copy-qr')return navigator.clipboard?.writeText(qrValue).then(()=>msg('Código copiado.')).catch(()=>msg('No se pudo copiar.'))||msg('Copia el código manualmente.');
 if(action==='paste-qr')return checkin($('[data-mh-input="qrtext"]',host)?.value);
 if(action==='cycle-attendee'||action==='remove-attendee'){const a=item().attendance,i=a.findIndex(p=>p.id===target.dataset.id);if(i<0)return;if(action==='remove-attendee')a.splice(i,1);else a[i].status=a[i].status==='Presente'?'Tarde':a[i].status==='Tarde'?'Ausente':'Presente';persist();return render()}
 if(action==='add-task'){const name=clean($('[data-mh-input="task"]',host)?.value),owner=clean($('[data-mh-input="owner"]',host)?.value),due=$('[data-mh-input="due"]',host)?.value||'';if(!name)return msg('Escribe el acuerdo.');item().tasks.push({id:uid(),name,owner,due,status:'Pendiente'});persist();return render()}
 if(action==='cycle-task'||action==='remove-task'){const a=item().tasks,i=a.findIndex(t=>t.id===target.dataset.id);if(i<0)return;if(action==='remove-task')a.splice(i,1);else a[i].status=a[i].status==='Pendiente'?'En proceso':a[i].status==='En proceso'?'Completado':'Pendiente';persist();return render()}
 if(action==='add-proposal'){const title=clean($('[data-mh-input="proposal"]',host)?.value);if(!title)return msg('Escribe la propuesta.');item().votes.push({id:uid(),title,ballots:{}});persist();return render()}
 if(action==='cast-vote'||action==='remove-proposal'){const a=item().votes,v=a.find(x=>x.id===target.dataset.id);if(!v)return;if(action==='remove-proposal')a.splice(a.indexOf(v),1);else{const wrap=target.closest('[data-proposal]'),team=clean($('[data-mh-vote="team"]',wrap)?.value),vote=$('[data-mh-vote="vote"]',wrap)?.value;if(!team)return msg('Escribe el equipo que vota.');v.ballots[team.toLocaleLowerCase('es-MX')]={team,vote}}persist();return render()}
 if(action==='save-sign'){const r=item();r.sign={president:clean($('[data-mh-sign="president"]',host)?.value),secretary:clean($('[data-mh-sign="secretary"]',host)?.value),approved:!!$('[data-mh-sign="approved"]',host)?.checked};persist();return render()}
 if(action==='add-evidence'){const title=clean($('[data-mh-input="evidtitle"]',host)?.value),url=$('[data-mh-input="evidlink"]',host)?.value?.trim()||'';let parsed;try{parsed=new URL(url)}catch(_){}if(!title||!parsed||parsed.protocol!=='https:')return msg('Usa una descripción y un enlace HTTPS válido.');item().evidence.push({id:uid(),title,url:parsed.href});persist();return render()}
 if(action==='remove-evidence'){const a=item().evidence,i=a.findIndex(x=>x.id===target.dataset.id);if(i>=0){a.splice(i,1);persist();render()}return}
 if(action==='load-meeting'){const d=target.dataset.date;if(!validDate(d))return;const r=item(d);set('[data-x="date"]',d);applyMinute(r.minute);go('attendance');return msg('Junta recuperada. Puedes seguir editando.')}
 if(action==='print-act'){preserve();return printAct()}
 if(action==='export')return exportData();
 if(action==='google'||action==='ics')return doCalendar(action);
 if(action==='whatsapp')return whatsapp();
}
function mount(){
 if(!window.LJR_MEDIA?.admin)return;
 if(scanner&&!scanner.layer.isConnected)stopCamera();
 const found=$('.v105-meeting-form');if(!found||!$('[data-v875-meeting]',found)||found.dataset.mhReady)return;
 form=found;found.dataset.mhReady='1';host=document.createElement('section');host.className='ljr-meeting-hub';host.setAttribute('aria-label','Herramientas de gestión de juntas');
 const after=$('[data-v875-meeting]',form);after.insertAdjacentElement('afterend',host);
 // Preserve old single-meeting data as the first dated historic record.
 try{
  const old=JSON.parse(localStorage.getItem('v105-meeting')||'null');
  if(old&&validDate(old.date)&&!state[old.date]){
   const oldRecord=empty();
   oldRecord.minute={date:old.date,agenda:old.agenda||'',agreements:old.agreements||'',attendanceText:old.attendance||'',time:field('time'),place:field('place'),owner:field('owner'),deadline:field('deadline'),taskNotes:field('tasks')};
   state[old.date]=oldRecord;
   localStorage.setItem(KEY,JSON.stringify(state));
  }
 }catch(_){} 
 host.addEventListener('click',e=>{const b=e.target.closest('[data-mh-action]');if(b){e.preventDefault();handle(b.dataset.mhAction,b)}});
 host.addEventListener('change',e=>advanced()?.onChange?.(e,advancedCtx));
 host.addEventListener('input',e=>{if(e.target.matches('[data-mh-input="search"]')){search=e.target.value.toLocaleLowerCase('es-MX');const start=e.target.selectionStart;render();const input=$('[data-mh-input="search"]',host);input?.focus();input?.setSelectionRange(start,start)}});
 const save=$('[data-save]',form.closest('.v105-dialog'));save?.addEventListener('click',()=>{if(validDate(date())){const r=item();r.minute=snapshot();persist()}});
 // Borrador automático de agenda y minuta: no sobrescribir otra fecha.
 let minuteTimer=0;
 form.addEventListener?.('input',e=>{
  if(!window.LJR_MEDIA?.admin||!e.target.matches?.('[data-x="agenda"],[data-x="agreements"],[data-x="attendance"],[data-meeting-field]'))return;
  const d=date(),draft={...snapshot(),date:d};clearTimeout(minuteTimer);
  minuteTimer=setTimeout(()=>{
   if(!validDate(d))return;const r=item(d);
   if(JSON.stringify(r.minute||{})!==JSON.stringify(draft)&&r.sign?.approved)r.sign.approved=false;
   r.minute=draft;persist(d);
  },700);
 });
 const dateField=$('[data-x="date"]',form);dateField?.addEventListener('change',()=>{qrValue='';render()});
 render();
}
let timer=0;
function schedule(){if(timer)return;timer=setTimeout(()=>{timer=0;mount()},90)}
new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true});
document.addEventListener('visibilitychange',()=>{if(document.hidden)stopCamera()});
document.addEventListener('click',e=>{if(scanner&&!e.target.closest('.mh-camera')&&!e.target.closest('[data-mh-action="camera"]')){if(!e.target.closest('.ljr-meeting-hub'))stopCamera()}});
window.LJR_MEETING_HUB_V1130={mount,parseCode};
schedule();
})();