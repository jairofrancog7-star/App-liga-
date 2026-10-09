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
const missing=s=>{
 const out=[];
 for(const [key,label] of [['cat','Categoría'],['round','Jornada'],['type','Tipo de aviso'],['reason','Motivo'],['date','Fecha efectiva'],['time','Hora'],['message','Mensaje adicional']])if(!s[key])out.push(label);
 if(s.scope==='Un partido'&&(!s.match||s.match==='Todos los partidos'))out.push('Partido afectado');
 if(s.scope==='Uno o varios campos'&&(!s.venue||s.venue==='Todos los campos'))out.push('Campo / sede');
 return out;
};
const isAuthorized=p=>{
 if(!p)return false;
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
 '<div class="v1074-buttons"><button type="button" data-v1074-schedule>Ir al programador</button><button type="button" data-v1074-official>Abrir editor oficial</button></div>'+
 '<small data-v1074-schedule-status></small><button type="button" data-v1074-cancel hidden>Cancelar programación local anterior</button></div>'+
 '<div class="v1074-group"><b>04 · Avisar a los equipos</b><p>Usa los equipos del rol oficial. Cada envío y recepción se registra manualmente en este teléfono.</p>'+
 '<button type="button" data-v1074-export>Descargar registro CSV</button><div class="v1074-recipients" data-v1074-teams></div></div>'+
 '<small class="v1074-disclaimer">Las marcas “enviado” o “recibido” no se verifican con WhatsApp. Las notificaciones automáticas fuera del teléfono requieren un servicio autenticado y configuración adicional.</small>'+
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
   const x=document.createElement('span');x.className='v1074-step'+(i<=index?' is-done':'');
   x.textContent=label;progress.append(x);
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
 try{
  if(navigator.share)await navigator.share({title:'Solicitud de aprobación',text:txt});
  else window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank','noopener,noreferrer');
  message(p,'Solicitud preparada. Espera la respuesta; el envío no cuenta como autorización.');
 }catch(e){if(e?.name!=='AbortError')message(p,'No se abrió el panel de compartir. Utiliza Copiar texto como alternativa.')}
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
 try{
  if(navigator.share)await navigator.share({title:'Aviso para '+name,text:body});
  else window.open('https://wa.me/?text='+encodeURIComponent(body),'_blank','noopener,noreferrer');
  message(p,'Mensaje preparado para '+name+'. Marca Enviado solo después de verificar el envío.');
 }catch(e){if(e?.name!=='AbortError')message(p,'No se pudo abrir Compartir.')}
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
  const page=btn.closest('.v425-suspension');
  if(!page||isAuthorized(page))return;
  e.preventDefault();
  e.stopImmediatePropagation();
  const flow=$('[data-v1074-flow]',page);if(flow)flow.open=true;
  message(page,'Primero revisa y registra una autorización real. Para solicitarla usa «Solicitar visto bueno».');
 },true);
 screen.addEventListener('click',e=>{
  if(route()!=='suspensionTool')return;
  const p=e.target.closest('.v425-suspension');
  if(!p)return;
  const b=e.target.closest('button');
  if(!b)return;
  if(b.matches('[data-v1074-review]'))review(p);
  else if(b.matches('[data-v1074-ask]'))ask(p);
  else if(b.matches('[data-v1074-show-auth]')){
    const box=$('[data-v1074-auth]',p);if(box)box.hidden=!box.hidden;
  }else if(b.matches('[data-v1074-authorize]'))authorize(p);
  else if(b.matches('[data-v1074-schedule]'))schedule(p);
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
 },true);
 window.addEventListener('ljr:auto-notice',()=>{const p=$('.v425-suspension',screen);if(p)refresh(p)});
 window.addEventListener('hashchange',queueRedraw);
 window.addEventListener('pageshow',queueRedraw);
 window.addEventListener('focus',()=>{if(route()==='suspensionTool'){const p=$('.v425-suspension',screen);if(p)refresh(p)}});
 queueRedraw();
}
window.LJR_SUSPENSION_WORKFLOW={canSchedule:isAuthorized};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
})();
