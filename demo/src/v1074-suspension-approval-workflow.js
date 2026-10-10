/* V1074 — Aviso de suspensión: revisión, constancia local de autorización,
   programación asistida y bitácora de avisos a equipos reales.
   La web pública NO autentica autoridades ni acredita entrega/lectura. */
(()=>{
'use strict';
if(window.__LJR_V1074_APPROVAL__)return;
window.__LJR_V1074_APPROVAL__=true;
const KEY='ljr-v1074-suspension-flow';
const IMPORT_MARK='ljr-v1074-pending-schedule';
const QUEUE='ljr-v713-auto-notices';
const $=(s,p=document)=>p?.querySelector(s);
const $$=(s,p=document)=>Array.from(p?.querySelectorAll(s)||[]);
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const pick=(k,p)=>String($('[data-v64-susp-'+k+']',p)?.value||'').trim();
const fields=p=>Object.fromEntries(['cat','round','type','scope','match','venue','reason','priority','date','time','message','channel'].map(k=>[k,pick(k,p)]));
const stable=s=>JSON.stringify(s);
const stamp=()=>new Date().toISOString();
const read=()=>{try{const data=JSON.parse(localStorage.getItem(KEY)||'null');return data&&typeof data==='object'?data:{}}catch(_){return {}}};
const write=s=>{try{localStorage.setItem(KEY,JSON.stringify(s));return true}catch(_){return false}};
const queue=()=>{try{const a=JSON.parse(localStorage.getItem(QUEUE)||'[]');return Array.isArray(a)?a:[]}catch(_){return []}};
async function verifyAdminSession(){
 const media=window.LJR_MEDIA;
 if(!media?.admin||typeof media.api!=='function')return false;
 try{return !!(await media.api('me'))?.admin}catch(_){return false}
}
const missing=s=>{
 const out=[];
 for(const [key,label] of [['cat','Categoría'],['round','Jornada'],['type','Tipo de aviso'],['reason','Motivo'],['date','Fecha efectiva'],['time','Hora'],['message','Mensaje adicional']])if(!s[key])out.push(label);
 if(s.scope==='Un partido'&&(!s.match||s.match==='Todos los partidos'))out.push('Partido afectado');
 if(s.scope==='Uno o varios campos'&&(!s.venue||s.venue==='Todos los campos'))out.push('Campo / sede');
 return out;
};
const isAuthorized=p=>{
 if(!p||!window.LJR_MEDIA?.admin)return false;
 const s=read(),hash=stable(fields(p));
 return !!s.reviewedAt&&s.reviewHash===hash&&s.authorization?.hash===hash&&!!s.authorization?.name&&!!s.authorization?.at;
};
const getScheduled=s=>s.scheduledId?queue().find(x=>String(x.id)===String(s.scheduledId)):null;
function state(p){
 const s=read(),hash=stable(fields(p));
 if(s.reviewHash!==hash)return {key:'draft',label:'Borrador',s,hash};
 if(!s.reviewedAt)return {key:'draft',label:'Borrador',s,hash};
 if(!isAuthorized(p))return {key:'review',label:'Revisado',s,hash};
 const notice=getScheduled(s);
 if(notice?.published)return {key:'published',label:'Publicación local procesada',s,hash,notice};
 if(notice)return {key:'scheduled',label:'Programado en este teléfono',s,hash,notice};
 return {key:'authorized',label:'Autorización anotada',s,hash};
}
function message(p,value){
 const n=$('[data-v1074-message]',p);
 if(!n)return;
 n.hidden=!value;
 n.textContent=value||'';
}
function panel(p){
 if(!window.LJR_MEDIA?.admin){$('[data-v1074-flow]',p)?.remove();return}
 if($('[data-v1074-flow]',p))return;
 const anchor=$('[data-v1066-auto]',p)||$('.v425-summary',p);
 if(!anchor)return;
 const details=document.createElement('details');
 details.className='v1074-flow';
 details.dataset.v1074Flow='';
 details.innerHTML=
 '<summary><span class="v1074-mark" aria-hidden="true">✓</span><span><strong>Flujo de aprobación y avisos</strong><small>Revisar · autorizar · programar · seguimiento</small></span><span class="v1074-open" aria-hidden="true">⌄</span></summary>'+
 '<div class="v1074-content">'+
 '<div class="v1074-progress" data-v1074-progress></div>'+
 '<p class="v1074-alert" data-v1074-message role="status" aria-live="polite" hidden></p>'+
 '<div class="v1074-group"><b>01 · Revisión del aviso</b><p>Comprueba los datos seleccionados y deja constancia de que revisaste el texto.</p><button type="button" data-v1074-review>✓ Revisar datos y texto</button></div>'+
 '<div class="v1074-group"><b>02 · Autorización</b><p>Envía una solicitud de visto bueno; después anota quién te confirmó la decisión.</p>'+
 '<div class="v1074-buttons"><button type="button" data-v1074-ask>Solicitar visto bueno</button><button type="button" data-v1074-show-auth>Registrar autorización</button></div>'+
 '<div class="v1074-auth" data-v1074-auth hidden><label>Nombre de quien autorizó<input type="text" data-v1074-author maxlength="90" placeholder="Escribe el nombre que te confirmó"></label>'+
 '<label>Medio de confirmación<select data-v1074-method><option>WhatsApp</option><option>Presencial</option><option>Llamada</option><option>Otro</option></select></label>'+
 '<label class="v1074-confirm"><input type="checkbox" data-v1074-agree><span>Confirmo que recibí autorización real y revisé los datos. Este registro local no verifica identidad.</span></label>'+
 '<button type="button" data-v1074-authorize>Guardar constancia local</button></div></div>'+
 '<div class="v1074-group"><b>03 · Programación</b><p>Elige cuándo publicar en el programador existente. Nada se envía hasta que confirmes allí.</p>'+
 '<div class="v1074-buttons"><button type="button" data-v1074-schedule>Programador local</button><button type="button" data-v1074-official>Editor oficial</button><button type="button" data-v1074-global>Programar avisos en app / Push / Twilio</button></div>'+
 '<small data-v1074-schedule-status></small><button type="button" data-v1074-cancel hidden>Cancelar programación local anterior</button></div>'+
 '<div class="v1074-group"><b>04 · Avisar a los equipos</b><p>Comparte con WhatsApp normal desde tu teléfono. La app prepara el mensaje, pero tú eliges el chat y pulsas Enviar. No se envía automáticamente.</p>'+
 '<div class="v1074-buttons"><button type="button" data-v1074-wa-manual>WhatsApp normal · compartir aviso</button><button type="button" data-v1074-export>Descargar registro CSV</button></div>'+
 '<div class="v1074-recipients" data-v1074-teams></div></div>'+
 '<small class="v1074-disclaimer">WhatsApp normal: envío manual, sin acceso automático a los chats. Las marcas “enviado” o “recibido” se anotan manualmente y no prueban entrega real. Twilio exige WhatsApp Business aprobado.</small>'+
 '</div>';
 anchor.before(details);
 refresh(p);
}
function refresh(p){
 const ui=$('[data-v1074-flow]',p);if(!ui)return;
 const st=state(p);
 const progress=$('[data-v1074-progress]',ui);
 const steps=[['draft','Borrador'],['review','Revisado'],['authorized','Autorizado'],['scheduled','Programado'],['published','Procesado']];
 const index=steps.findIndex(x=>x[0]===st.key);
 if(progress){
  progress.replaceChildren();
  steps.forEach(([key,label],i)=>{
   const x=document.createElement('button');
   x.type='button';x.dataset.v1074Stage=key;
   x.className='v1074-step'+(i<=index?' is-done':'')+(i===index?' is-current':'');
   x.textContent=label;
   x.setAttribute('aria-label',label+(i===index?' · estado actual':i<index?' · etapa completada':' · etapa pendiente')+'. Abrir acción');
   if(i===index)x.setAttribute('aria-current','step');
   progress.append(x);
  });
 }
 const status=$('[data-v1074-schedule-status]',ui);
 if(status)status.textContent=st.notice?('Estado del programador local: '+(st.notice.published?'procesado':'programado')+'. Publicación global no comprobada.'):
  (st.s.previousScheduledId?'Atención: existe una programación anterior. Revísala y elimínala manualmente si quedó obsoleta.':
  st.s.scheduledId?'El aviso ya no aparece en el programador; revisa si fue eliminado.':'Sin programación confirmada.');
 const scheduleButton=$('[data-v1074-schedule]',ui);
 if(scheduleButton)scheduleButton.disabled=!isAuthorized(p);
 const official=$('[data-v1074-official]',ui);
 if(official)official.disabled=!isAuthorized(p);
 const global=$('[data-v1074-global]',ui);
 if(global)global.disabled=!isAuthorized(p);
 const whatsApp=$('[data-v1074-wa-manual]',ui);
 if(whatsApp)whatsApp.disabled=!isAuthorized(p);
 const cancel=$('[data-v1074-cancel]',ui);
 const previous=st.s.previousScheduledId||(!st.notice?st.s.scheduledId:null);
 if(cancel)cancel.hidden=!previous||!queue().some(x=>String(x.id)===String(previous)&&!x.published);
 const savedAuth=st.s.authorization;
 const author=$('[data-v1074-author]',ui);if(author&&document.activeElement!==author)author.value=savedAuth?.hash===st.hash?(savedAuth.name||''):'';
 drawTeams(p);
}
function review(p){
 const s=fields(p),unfilled=missing(s);
 if(unfilled.length){message(p,'Completa antes de revisar: '+unfilled.join(', ')+'.');return}
 const previous=read(),hash=stable(s);
 const next={...previous,reviewHash:hash,reviewedAt:stamp()};
 if(previous.reviewHash!==hash){delete next.authorization;delete next.scheduledId;next.delivery={};}
 if(!write(next)){message(p,'No se pudo guardar la revisión en este dispositivo.');return}
 message(p,'Revisión registrada. Solicita el visto bueno y confirma personalmente la autorización.');
 refresh(p);
}
async function ask(p){
 if(state(p).key==='draft'){message(p,'Primero completa y revisa los datos.');return}
 const s=fields(p);
 const txt='SOLICITUD DE REVISIÓN — NO PUBLICAR\nLiga Municipal de Fútbol Juventino Rosas A. C.\n'+
  'Tipo: '+s.type+'\nCategoría: '+s.cat+' · Jornada '+s.round+'\n'+
  'Alcance: '+s.scope+'\nMotivo: '+s.reason+'\nFecha efectiva: '+s.date+' '+s.time+'\n'+
  (s.match&&s.match!=='Todos los partidos'?'Partido: '+s.match+'\n':'')+
  (s.venue&&s.venue!=='Todos los campos'?'Campo: '+s.venue+'\n':'')+
  '\nBorrador propuesto:\n'+s.message+'\n\nPor favor confirma expresamente tu autorización antes de programar.';
 openWhatsApp(p,txt,'524121715599','Solicitud abierta para el presidente. Espera su confirmación; esto NO es una autorización.');
}
function approvedNoticeText(s){
 return [
  'LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS A. C.',
  (s.type||'AVISO').toUpperCase(),
  'Categoría: '+s.cat+' · Jornada: '+s.round,
  'Alcance: '+s.scope,
  s.match&&s.match!=='Todos los partidos'?'Partido: '+s.match:'',
  s.venue&&s.venue!=='Todos los campos'?'Campo: '+s.venue:'',
  s.reason?'Motivo: '+s.reason:'',
  'Fecha efectiva: '+s.date+' '+s.time,
  s.message
 ].filter(Boolean).join('\n');
}
function openWhatsApp(p,txt,number='',confirmation='WhatsApp abierto: elige el chat y pulsa Enviar manualmente.'){
 const url='https://wa.me/'+number+'?text='+encodeURIComponent(txt);
 message(p,confirmation+' Ningún mensaje se envió automáticamente.');
 try{window.location.assign(url)}
 catch(_){
  try{navigator.clipboard?.writeText(txt).then(()=>message(p,'No se abrió WhatsApp; texto copiado para pegarlo manualmente.')).catch(()=>message(p,'No se pudo abrir WhatsApp. Usa Copiar texto.'))}
  catch(__){message(p,'No se pudo abrir WhatsApp; utiliza Copiar texto.')}
 }
}
function presidentWhatsApp(p){
 const s=fields(p),authorized=isAuthorized(p);
 const txt=authorized?approvedNoticeText(s):
  'SOLICITUD DE VISTO BUENO — BORRADOR, NO PUBLICAR\n'+
  'Liga Municipal de Fútbol Juventino Rosas A. C.\n'+
  'Tipo: '+s.type+'\nCategoría: '+s.cat+' · Jornada '+s.round+
  '\nMotivo: '+s.reason+'\nAlcance: '+s.scope+
  '\nFecha efectiva: '+s.date+' '+s.time+
  '\nMensaje propuesto: '+s.message+
  '\n\nPor favor revisa y confirma tu autorización. NO difundir como aviso oficial.';
 openWhatsApp(p,txt,'524121715599',authorized?
  'Aviso preparado para compartir con el presidente.':
  'Solicitud de visto bueno preparada para el presidente. Debes registrar después su autorización real.');
}
function stageAction(p,key){
 const flow=$('[data-v1074-flow]',p);if(flow)flow.open=true;
 if(key==='draft'){
  const save=$('[data-v64-susp-save]',p);
  if(save){save.click();message(p,'Borrador guardado en este dispositivo; todavía no está publicado.')}
  else message(p,'No se encontró el botón Guardar borrador.');
 }else if(key==='review')review(p);
 else if(key==='authorized'){
  if(state(p).key==='draft'){message(p,'Primero pulsa Revisado para comprobar el aviso.');return}
  const box=$('[data-v1074-auth]',p);if(box)box.hidden=false;
  message(p,isAuthorized(p)?'Autorización ya anotada en este teléfono. Puedes actualizar la constancia.':
   'Solicita el visto bueno y registra únicamente una autorización realmente recibida.');
  box?.scrollIntoView({behavior:'smooth',block:'nearest'});
 }else if(key==='scheduled')schedule(p);
 else if(key==='published'){
  const st=state(p);
  message(p,st.key==='published'?
   'El programador local marca este aviso como procesado. Revisa la entrega real en los canales oficiales.':
   'Procesado es un estado de seguimiento, NO un botón para publicar. Solo se activa cuando el programador registra el procesamiento.');
  $('[data-v1074-teams]',p)?.scrollIntoView({behavior:'smooth',block:'nearest'});
 }
}
function authorize(p){
 const ui=$('[data-v1074-flow]',p),name=String($('[data-v1074-author]',ui)?.value||'').trim();
 const method=$('[data-v1074-method]',ui)?.value||'WhatsApp';
 if(state(p).key==='draft'){message(p,'Primero revisa el aviso.');return}
 if(name.length<3){message(p,'Escribe el nombre completo de quien autorizó.');return}
 if(!$('[data-v1074-agree]',ui)?.checked){message(p,'Marca la confirmación únicamente si recibiste autorización real.');return}
 const prev=read(),hash=stable(fields(p));
 if(prev.reviewHash!==hash){message(p,'El formulario cambió. Haz la revisión otra vez.');return}
 prev.authorization={hash,name:name.slice(0,90),method,at:stamp(),type:'local-manual-attestation'};
 if(!write(prev)){message(p,'No se pudo guardar la constancia.');return}
 const box=$('[data-v1074-auth]',ui);if(box)box.hidden=true;
 message(p,'Constancia anotada en este teléfono. No es una firma verificada; ahora puedes preparar la programación.');
 refresh(p);
}
function schedule(p){
 if(!isAuthorized(p)){message(p,'Antes de programar, revisa y registra la autorización recibida.');return}
 const button=$('[data-v1066-schedule]',p);
 if(!button){message(p,'No se encontró el programador existente.');return}
 try{
  sessionStorage.setItem(IMPORT_MARK,JSON.stringify({
    at:Date.now(),ids:queue().map(x=>String(x.id)),
    hash:stable(fields(p)), type:fields(p).type,category:fields(p).cat,
    round:fields(p).round,message:fields(p).message
  }));
 }catch(_){}
 button.click();
}
function checkScheduled(){
 let raw;try{raw=JSON.parse(sessionStorage.getItem(IMPORT_MARK)||'null')}catch(_){return}
 if(!raw||Date.now()-raw.at>15*60000)return;
 const before=new Set(raw.ids||[]);
 const created=queue().filter(item=>!before.has(String(item.id)));
 if(!created.length)return;
 const s=read();
 // Asociar exclusivamente el aviso importado, no otra programación hecha en otra pestaña.
 const expected=created.find(item=>String(item.type)==='suspension'&&
   String(item.title||'').trim()===String(raw.type||'').trim()&&
   String(item.body||'').includes('Categoría: '+String(raw.category||''))&&
   String(item.body||'').includes('Jornada: '+String(raw.round||''))&&
   String(item.body||'').includes(String(raw.message||''))&&
   String(item.category||'').length>0);
 if(expected&&s.reviewHash===raw.hash&&s.authorization?.hash===raw.hash){
  s.scheduledId=expected.id;s.scheduledAt=stamp();
  write(s);
  sessionStorage.removeItem(IMPORT_MARK);
  return;
 }
 // Dejar el marcador para poder asociar la publicación correcta al guardar.
 // Si pasan 15 minutos expira al inicio de esta función.
}
function teams(p){
 const s=fields(p),result=[];
 const unique=new Set();
 try{
  // v64SuspensionMatches() es privada de main.js (ES module).
  // Leer el MISMO catálogo oficial, sin fabricar clubes ni depender de un global inexistente.
  const categories=Object.values(window.LJR_OFFICIAL_DATA?.categories||{});
  const wantedCat=String(s.cat||'').trim().toLocaleLowerCase('es-MX');
  const category=categories.find(c=>String(c?.name||'').trim().toLocaleLowerCase('es-MX')===wantedCat);
  const rows=(category?.fixtures||[]).flatMap(block=>Array.isArray(block?.rows)?block.rows:[])
    .filter(r=>Array.isArray(r)&&r[2]&&r[6]&&String(r[1]??'').trim()===String(s.round||'').trim());
  const wanted=String(s.match||'').trim().toLocaleLowerCase('es-MX');
  const field=String(s.venue||'').trim().toLocaleLowerCase('es-MX');
  for(const r of rows){
   if(s.scope==='Un partido'&&wanted!=='todos los partidos'&&
      (String(r?.[2]||'')+' vs '+String(r?.[6]||'')).toLocaleLowerCase('es-MX')!==wanted)continue;
   if(s.scope==='Uno o varios campos'&&field&&field!=='todos los campos'&&
      String(r?.[7]||'').toLocaleLowerCase('es-MX')!==field)continue;
   for(const n of [r?.[2],r?.[6]]){
    const name=String(n||'').trim(),key=name.toLocaleLowerCase('es-MX');
    if(name&&!unique.has(key)){unique.add(key);result.push(name)}
   }
  }
 }catch(_){}
 return result.slice(0,64);
}
function drawTeams(p){
 const host=$('[data-v1074-teams]',p);if(!host)return;
 const values=teams(p),current=read(),auth=isAuthorized(p);
 const key=stable(fields(p)),log=current.deliveryHash===key?(current.delivery||{}):{};
 host.replaceChildren();
 if(!values.length){
  const n=document.createElement('p');n.textContent='No hay equipos en el rol oficial para la categoría y jornada seleccionadas. No se agregan equipos ficticios.';host.append(n);return;
 }
 const sent=values.filter(name=>!!log[name]?.sentAt).length;
 const received=values.filter(name=>!!log[name]?.receivedAt).length;
 const count=document.createElement('small');
 count.textContent=values.length+' equipos · '+sent+' envíos anotados · '+received+' recepciones anotadas (solo en este dispositivo)';
 host.append(count);
 for(const name of values){
  const s=log[name]||{},row=document.createElement('div');row.className='v1074-team';
  const title=document.createElement('span');title.textContent=name;
  const status=document.createElement('small');
  status.textContent=s.receivedAt?'Recepción anotada':s.sentAt?'Envío anotado':'Pendiente';
  const send=document.createElement('button');send.type='button';send.dataset.v1074Share=name;
  send.textContent='Preparar';send.disabled=!auth;
  const mark=document.createElement('button');mark.type='button';mark.dataset.v1074Mark=name;
  mark.textContent=s.sentAt?(s.receivedAt?'Reiniciar':'Recibido'):'Enviado';
  mark.disabled=!auth;
  row.append(title,status,send,mark);host.append(row);
 }
}
async function shareNormalWhatsApp(p){
 if(!isAuthorized(p)){message(p,'Revisa y registra primero una autorización real para compartir el aviso.');return}
 openWhatsApp(p,approvedNoticeText(fields(p)),'','Aviso preparado. Selecciona el equipo o contacto y confirma Enviar en WhatsApp.');
}
async function prepare(p,name){
 if(!isAuthorized(p)){message(p,'Registra primero la autorización recibida.');return}
 const s=fields(p),body='Para el equipo '+name+':\n\n'+
  'LIGA MUNICIPAL DE FÚTBOL JUVENTINO ROSAS A. C.\n'+(s.type||'AVISO').toUpperCase()+
  '\n'+s.cat+' · Jornada '+s.round+'\nAlcance: '+s.scope+
  (s.match&&s.match!=='Todos los partidos'?'\nPartido: '+s.match:'')+
  (s.venue&&s.venue!=='Todos los campos'?'\nCampo: '+s.venue:'')+
  '\nMotivo: '+s.reason+'\nFecha efectiva: '+s.date+' '+s.time+
  '\n'+s.message+
  '\n\nConfirma que recibiste este aviso con tu delegado.';
 openWhatsApp(p,body,'','Aviso preparado para '+name+'. Marca Enviado únicamente después de verificar el envío.');
}
function mark(p,name){
 if(!isAuthorized(p))return;
 const f=stable(fields(p)),s=read();
 if(s.deliveryHash!==f){s.deliveryHash=f;s.delivery={}}
 const v=s.delivery[name]||{};
 if(!v.sentAt)v.sentAt=stamp();
 else if(!v.receivedAt)v.receivedAt=stamp();
 else{delete v.sentAt;delete v.receivedAt;}
 s.delivery[name]=v;write(s);drawTeams(p);
 message(p,'Estado de '+name+' anotado manualmente. No demuestra entrega ni lectura real.');
}
/* El CSV es un archivo LOCAL: las marcas no son constancia verificada de recepción. */
function exportLog(p){
 const names=teams(p),s=read(),form=fields(p);
 if(!names.length){message(p,'No hay equipos oficiales para exportar con estos filtros.');return}
 const key=stable(form),delivery=s.deliveryHash===key?s.delivery||{}:{};
 const safe=value=>{
  let v=String(value??'').replace(/[\r\n]+/g,' ').trim();
  // Impedir ejecución de fórmulas al abrir CSV con Excel/Sheets.
  if(/^[=+@\-\t\r]/.test(v))v="'"+v;
  return '"'+v.replace(/"/g,'""')+'"';
 };
 const rows=[['Categoría','Jornada','Equipo','Estado anotado','Envío (local)','Recepción (local)','Verificación']];
 for(const name of names){
  const row=delivery[name]||{};
  rows.push([form.cat,form.round,name,row.receivedAt?'Recepción anotada':row.sentAt?'Envío anotado':'Pendiente',
   row.sentAt||'',row.receivedAt||'','No verificado; registro del dispositivo']);
 }
 const csv='\uFEFF'+rows.map(row=>row.map(safe).join(',')).join('\r\n');
 const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
 const url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='liga-avisos-equipos-'+new Date().toISOString().slice(0,10)+'.csv';
 document.body.append(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1500);
 message(p,'Descargado el reporte CSV con '+names.length+' equipos reales. Las confirmaciones son anotaciones manuales.');
}
function openOfficialEditor(p){
 if(!isAuthorized(p)){message(p,'Revisa el aviso y registra el visto bueno antes de preparar el editor oficial.');return}
 const editor=window.LJR_EDITOR_CENTER;
 if(!editor?.openNotice){message(p,'El editor oficial aún no está disponible. Abre Administración y vuelve a intentarlo.');return}
 const s=fields(p);
 const category=Object.entries(window.LJR_OFFICIAL_DATA?.categories||{})
   .find(([,cat])=>String(cat?.name||'').trim()===s.cat)?.[0]||'all';
 const details=[
  'Motivo: '+s.reason,'Alcance: '+s.scope,
  s.match!=='Todos los partidos'?'Partido: '+s.match:'',
  s.venue!=='Todos los campos'?'Campo: '+s.venue:''
 ].filter(Boolean).join('. ').slice(0,1200);
 const body=[
  'La Liga Municipal de Fútbol Juventino Rosas A. C. informa:',
  s.type+'.',s.cat+', jornada '+s.round+'.',
  details+'.','Fecha efectiva: '+s.date+' '+s.time+'.',s.message
 ].filter(Boolean).join(' ').slice(0,4000);
 try{
  editor.openNotice({type:'suspension',category,round:s.round,date:s.date,time:s.time,
   field:s.venue==='Todos los campos'?'':s.venue,title:s.type,
   details,body});
  message(p,'Aviso enviado al editor para revisión, NO publicado. Solo una sesión de administración autorizada puede guardarlo en el servidor.');
 }catch(e){message(p,'No se pudo abrir el editor oficial. Revisa tu sesión de administración.')}
}
function openGlobalNotice(p){
 if(!isAuthorized(p)){message(p,'Antes de programar el envío global, revisa y registra la autorización realmente recibida.');return}
 const s=fields(p),manager=window.LJR_GLOBAL_NOTICES;
 if(typeof manager?.open!=='function'){message(p,'Abre Administración y espera a que se cargue Avisos globales.');return}
 const text=[
  'Liga Municipal de Fútbol Juventino Rosas A. C.',
  s.type+'.','Categoría: '+s.cat+' · Jornada: '+s.round+'.',
  s.match&&s.match!=='Todos los partidos'?'Partido: '+s.match+'.':'',
  s.venue&&s.venue!=='Todos los campos'?'Campo: '+s.venue+'.':'',
  s.reason?'Motivo: '+s.reason+'.':'',
  'Fecha efectiva: '+s.date+' '+s.time+'.',
  s.message
 ].filter(Boolean).join(' ').slice(0,700);
 const result=manager.open({title:(s.type||'Aviso de suspensión').slice(0,120),
  type:'suspension',category:s.cat,team:'',field:s.venue==='Todos los campos'?'':s.venue,body:text});
 if(!result)message(p,'Inicia sesión en Administración para programar el comunicado.');
 else message(p,'El aviso se abrió para revisión en el programador global. Elige la hora de envío y confirma; no se ha publicado.');
}

function cancelLocalSchedule(p){
 const s=read(),id=s.previousScheduledId||s.scheduledId;
 if(!id){message(p,'No hay programación local que cancelar.');return}
 const list=queue(),item=list.find(x=>String(x.id)===String(id));
 if(!item){message(p,'La programación ya no existe en este dispositivo.');return}
 if(item.published){message(p,'El aviso ya figura como procesado. No se puede retirar con esta función local; revisa el editor oficial.');return}
 if(!window.confirm('¿Eliminar esta programación local? No cancela avisos publicados ni programaciones guardadas en otros dispositivos.'))return;
 try{
  localStorage.setItem(QUEUE,JSON.stringify(list.filter(x=>String(x.id)!==String(id))));
  delete s.previousScheduledId;
  if(String(s.scheduledId)===String(id)){delete s.scheduledId;delete s.scheduledAt}
  write(s);refresh(p);
  message(p,'Programación eliminada de este dispositivo. Confirma por separado si existía una publicación global.');
 }catch(e){message(p,'No se pudo cancelar la programación local.')}
}

function invalidate(p){
 const s=read(),h=stable(fields(p));
 if(s.reviewHash===h)return;
 // Mantener historia pero revocar revisión y autorización cuando cambia el aviso.
 if(s.reviewHash||s.authorization||s.scheduledId){
  const queuedBefore=s.scheduledId&&queue().some(x=>String(x.id)===String(s.scheduledId));
  if(queuedBefore)s.previousScheduledId=s.scheduledId;
  s.reviewHash='';s.reviewedAt='';delete s.authorization;delete s.scheduledId;
  s.delivery={};s.deliveryHash='';
  write(s);
  message(p,queuedBefore?
    'Cambió el aviso. La programación anterior SIGUE ACTIVA: elimínala manualmente en el Programador. Vuelve a revisar y autorizar este texto.':
    'Cambió el aviso: vuelve a revisar y solicitar autorización.');
 }
 refresh(p);
}
let tick=0;
function boot(){
 const screen=$('#screen');if(!screen)return;
 let pending=false;
 const redraw=()=>{pending=false;
  if(route()==='suspensionTool'){
   const p=$('.v425-suspension',screen);if(p)panel(p);
  }else if(route()==='v38Alerts'){checkScheduled()}
 };
 const queueRedraw=()=>{if(pending)return;pending=true;requestAnimationFrame(redraw)};
 new MutationObserver(queueRedraw).observe(screen,{childList:true,subtree:true});
 // No compartir avisos como oficiales sin revisión y constancia de autorización.
 // Para pedir aprobación existe el botón "Solicitar visto bueno".
 screen.addEventListener('click',e=>{
  if(route()!=='suspensionTool')return;
  const btn=e.target.closest('button');
  if(!btn?.matches('[data-v64-susp-whatsapp],[data-v1066-share]'))return;
  const page=btn.closest('.v425-suspension');if(!page)return;
  if(btn.matches('[data-v64-susp-whatsapp]')){
   // Captura también el manejador antiguo {once:true}. Nunca abrir dos chats.
   e.preventDefault();e.stopImmediatePropagation();
   verifyAdminSession().then(ok=>{
    if(!page.isConnected)return;
    if(ok)presidentWhatsApp(page);
    else{const flow=$('[data-v1074-flow]',page);if(flow)flow.open=true;
     message(page,'Inicia sesión como administrador para preparar el WhatsApp del presidente.')}
   });
   return;
  }
  if(isAuthorized(page))return;
  e.preventDefault();e.stopImmediatePropagation();
  const flow=$('[data-v1074-flow]',page);if(flow)flow.open=true;
  message(page,'Primero revisa y registra una autorización real. Para solicitarla usa «Solicitar visto bueno».');
 },true);
 screen.addEventListener('click',async e=>{
  if(route()!=='suspensionTool')return;
  const p=e.target.closest('.v425-suspension');
  if(!p)return;
  const b=e.target.closest('button');
  if(!b)return;
  // La aprobación en localStorage no es una credencial; exigir además sesión del servidor.
  if(b.matches('[data-v1074-stage],[data-v1074-review],[data-v1074-ask],[data-v1074-show-auth],[data-v1074-authorize],[data-v1074-schedule],[data-v1074-official],[data-v1074-global],[data-v1074-wa-manual],[data-v1074-share],[data-v1074-mark],[data-v1074-cancel],[data-v1074-export]')){
   if(!await verifyAdminSession()){
    const flow=$('[data-v1074-flow]',p);if(flow)flow.open=true;
    message(p,'Inicia sesión en Administración: este control requiere permiso verificado del servidor.');
    return;
   }
   if(!p.isConnected)return;
  }
  if(b.matches('[data-v1074-stage]'))stageAction(p,b.dataset.v1074Stage);
  else if(b.matches('[data-v1074-review]'))review(p);
  else if(b.matches('[data-v1074-ask]'))ask(p);
  else if(b.matches('[data-v1074-show-auth]')){
    const box=$('[data-v1074-auth]',p);if(box)box.hidden=!box.hidden;
  }else if(b.matches('[data-v1074-authorize]'))authorize(p);
  else if(b.matches('[data-v1074-schedule]'))schedule(p);
  else if(b.matches('[data-v1074-official]'))openOfficialEditor(p);
  else if(b.matches('[data-v1074-global]'))openGlobalNotice(p);
  else if(b.matches('[data-v1074-wa-manual]'))shareNormalWhatsApp(p);
  else if(b.matches('[data-v1074-export]'))exportLog(p);
  else if(b.matches('[data-v1074-cancel]'))cancelLocalSchedule(p);
  else if(b.matches('[data-v1074-share]'))prepare(p,b.dataset.v1074Share);
  else if(b.matches('[data-v1074-mark]'))mark(p,b.dataset.v1074Mark);
 });
 screen.addEventListener('change',e=>{
  if(route()!=='suspensionTool'||!e.target.closest('.v425-suspension'))return;
  if(e.target.matches('[data-v64-susp-cat],[data-v64-susp-round],[data-v64-susp-type],[data-v64-susp-scope],[data-v64-susp-match],[data-v64-susp-venue],[data-v64-susp-reason],[data-v64-susp-priority],[data-v64-susp-date],[data-v64-susp-time],[data-v64-susp-channel],[data-v64-susp-message]'))invalidate(e.target.closest('.v425-suspension'));
 });
 screen.addEventListener('input',e=>{
  if(route()!=='suspensionTool'||!e.target.matches('[data-v64-susp-message]'))return;
  const p=e.target.closest('.v425-suspension');if(!p)return;
  clearTimeout(tick);tick=setTimeout(()=>invalidate(p),250);
 });
 // La confirmación del programador se registra solo si realmente creó un aviso nuevo.
 screen.addEventListener('click',e=>{
  if(route()!=='v38Alerts'||!e.target.closest('[data-v713-save]'))return;
  setTimeout(checkScheduled,240);
  setTimeout(checkScheduled,1200);
 },true);
 window.addEventListener('ljr:auto-notice',()=>{checkScheduled();const p=$('.v425-suspension',screen);if(p)refresh(p)});
 window.addEventListener('hashchange',queueRedraw);
 window.addEventListener('liga:admin',queueRedraw);
 document.addEventListener('liga:admin',queueRedraw);
 window.addEventListener('pageshow',queueRedraw);
 window.addEventListener('focus',()=>{
  if(route()!=='suspensionTool')return;
  const p=$('.v425-suspension',screen);
  if(p){panel(p);if(window.LJR_MEDIA?.admin)refresh(p)}
 });
 queueRedraw();
}
window.LJR_SUSPENSION_WORKFLOW={canSchedule:isAuthorized};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
