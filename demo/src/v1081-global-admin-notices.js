/* V1081 — Programación global, cargos y bitácora. 
   El navegador JAMÁS otorga permisos: /admin/* verifica la sesión de la Liga y roles en PostgreSQL.
   Cuando no hay servidor HTTPS configurado, las acciones no se simulan. */
(()=>{
'use strict';
if(window.__LJR_V1081_GLOBAL__)return;
window.__LJR_V1081_GLOBAL__=true;
const $=(s,r=document)=>r?.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const media=()=>window.LJR_MEDIA;
const active=()=>!!media()?.admin;
const cats=[['Todas','Todas las categorías'],['Primera','Primera Fuerza'],['Intermedia','Intermedia'],['Segunda','Segunda Fuerza'],['Veteranos 35+','Veteranos 35+'],['Veteranos 50+','Veteranos 50+']];
const fmt=date=>{if(!date)return 'Sin fecha';const d=new Date(date);return Number.isFinite(+d)?d.toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short',timeZone:'America/Mexico_City'}):'Fecha inválida'};
let basePromise;
async function server(){
 if(!basePromise)basePromise=fetch('./data/notifications-client.json',{cache:'no-store'})
  .then(x=>x.ok?x.json():{}).then(c=>{
   const u=String(c.apiBaseUrl||'').trim();
   if(!/^https:\/\//.test(u))return null;
   const url=new URL(u);
   return !url.username&&!url.password&&!url.search&&!url.hash?url.origin:null;
  }).catch(()=>null);
 return basePromise;
}
const message=(modal,text)=>{const p=$('[data-v1081-status]',modal)||$('[data-status]',modal);if(p)p.textContent=text};
async function call(path,options={}){
 if(!active()||!media()?.notifyAPI)throw Error('Inicia sesión de administración.');
 if(!await server())throw Error('Aún no se configuró el servidor privado. Activa apiBaseUrl en data/notifications-client.json.');
 return media().notifyAPI(path,options);
}
async function publicCall(path,options={}){
 const b=await server();if(!b)return null;
 const r=await fetch(b+path,{...options,cache:'no-store',redirect:'error'});
 if(!r.ok)throw Error('Servicio temporalmente no disponible ('+r.status+')');
 return r.json();
}
function dialog(title,html){
 const modal=media().modal(title,html);
 modal.querySelector('section')?.classList.add('ljr-editor-dialog','v1081-dialog');
 return modal;
}
// El campo fecha/hora se interpreta en Juventino Rosas (no en la zona del teléfono).
function mexicoMillis(raw){
 const m=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(raw||'');
 if(!m)return NaN;
 const [y,mon,day,h,min]=m.slice(1).map(Number);
 if(mon<1||mon>12||h>23||min>59||new Date(Date.UTC(y,mon-1,day)).getUTCDate()!==day)return NaN;
 const desired=Date.UTC(y,mon-1,day,h,min),f=new Intl.DateTimeFormat('en-CA',
 {timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 let found=desired;
 for(let i=0;i<3;i++){
  const p=Object.fromEntries(f.formatToParts(found).map(q=>[q.type,q.value]));
  found+=desired-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
 }
 const verify=Object.fromEntries(f.formatToParts(found).map(q=>[q.type,q.value]));
 return Date.UTC(+verify.year,+verify.month-1,+verify.day,+verify.hour,+verify.minute)===desired?found:NaN;
}
function mexicoInput(value){
 const date=new Date(value);if(!Number.isFinite(+date))return '';
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-CA',{
  timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'
 }).formatToParts(date).map(q=>[q.type,q.value]));
 return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute;
}
function makeAdminForm(){
 const modal=dialog('Avisos globales programados',
  '<div class="v1081"><p class="v1081-note">Los avisos se publican en el servidor aunque el teléfono esté apagado. Requiere que el servicio HTTPS esté desplegado y configurado. Todo cambio se verifica con tu sesión.</p>'+
  '<form data-v1081-form>'+
  '<label>Título<input name="title" required maxlength="120" placeholder="Ej. Cambio de cancha"></label>'+
  '<label>Mensaje oficial<textarea name="body" required minlength="15" maxlength="700" rows="3" placeholder="Escribe solo datos confirmados"></textarea></label>'+
  '<div class="v1081-two">'+
  '<label>Categoría<select name="category">'+cats.map(([v,t])=>'<option value="'+esc(v)+'">'+esc(t)+'</option>').join('')+'</select></label>'+
  '<label>Tipo de aviso<select name="type"><option value="general">General</option><option value="jornada">Jornada</option><option value="horario">Cambio de horario</option><option value="cancha">Cambio de cancha</option><option value="suspension">Suspensión</option><option value="resultados">Resultados</option><option value="partido">Partido</option><option value="junta">Junta</option><option value="registro">Registro</option><option value="clima">Clima</option></select></label>'+
  '<label>Equipo afectado (opcional)<input name="team" maxlength="90" placeholder="Solo si aplica"></label>'+
  '<label>Cancha afectada (opcional)<input name="field" maxlength="100" placeholder="Solo si aplica"></label>'+
  '<label>Publicar · hora Juventino Rosas<input name="when" type="datetime-local" required></label></div>'+
  '<label class="v1081-check"><input type="checkbox" name="push"> Avisar también por notificación Push (requiere VAPID)</label>'+
  '<p class="v1081-preview">Se publicará en Noticias para todos. No se agregan resultados automáticamente.</p>'+
  '<div class="v1081-actions"><button type="button" data-v1081-reset>Limpiar</button><button type="submit" data-v1081-save>Programar publicación</button></div>'+
  '</form><div class="v1081-list"><div class="v1081-list-head"><strong>Publicaciones programadas</strong><button type="button" data-v1081-refresh>Actualizar</button></div><div data-v1081-items>Cargando...</div></div>'+
  '<p class="v1081-status" data-v1081-status role="status" aria-live="polite"></p></div>');
 const form=$('[data-v1081-form]',modal),list=$('[data-v1081-items]',modal),save=$('[data-v1081-save]',modal);
 let editing=null,rows=[],busy=false;
 function clear(){
  editing=null;form.reset();save.textContent='Programar publicación';
  form.elements.when.value=mexicoInput(Date.now()+3600000).slice(0,16);
 }
 clear();
 async function refresh(){
  list.textContent='Consultando avisos…';
  try{
   const r=await call('/admin/notices');rows=Array.isArray(r.items)?r.items:[];
   list.replaceChildren();
   if(!rows.length){list.textContent='Todavía no se han programado avisos en el servidor.';return}
   for(const item of rows.slice(0,80)){
    const card=document.createElement('article');card.className='v1081-item';
    const info=document.createElement('div'),h=document.createElement('strong'),small=document.createElement('small');
    h.textContent=item.title||'Aviso';
    const labels={queued:'Pendiente',processing:'Publicando',done:'Publicado',cancelled:'Cancelado'};
    small.textContent=(labels[item.status]||item.status)+' · '+(item.category||'Todas')+' · '+fmt(item.send_at);
    info.append(h,small);card.append(info);
    if(item.status==='queued'){
     const buttons=document.createElement('div');buttons.className='v1081-item-actions';
     const edit=document.createElement('button');edit.textContent='Editar';
     edit.onclick=()=>{
      editing=item;form.elements.title.value=item.title||'';form.elements.body.value=item.body||'';
      form.elements.category.value=item.category||'Todas';form.elements.type.value=item.notice_type||'general';
      form.elements.team.value=item.team||'';form.elements.field.value=item.field||'';
      form.elements.when.value=mexicoInput(item.send_at);
      form.elements.push.checked=Array.isArray(item.channels)&&item.channels.includes('push');
      save.textContent='Guardar cambios';form.scrollIntoView({block:'nearest',behavior:'smooth'});
     };
     const cancel=document.createElement('button');cancel.textContent='Cancelar';cancel.className='is-danger';
     cancel.onclick=async()=>{
      if(!confirm('¿Cancelar esta publicación pendiente?'))return;
      cancel.disabled=true;
      try{
       await call('/admin/notices/'+encodeURIComponent(item.id),{method:'DELETE',body:{revision:item.revision}});
       message(modal,'Publicación cancelada.');await refresh();
      }catch(err){message(modal,'No se pudo cancelar: '+err.message);cancel.disabled=false}
     };
     buttons.append(edit,cancel);card.append(buttons);
    }
    list.append(card);
   }
  }catch(err){list.textContent='No se pueden consultar avisos: '+err.message}
 }
 form.onsubmit=async e=>{
  e.preventDefault();if(busy||!form.reportValidity())return;
  const sendAt=mexicoMillis(form.elements.when.value);
  if(!Number.isFinite(sendAt)||sendAt<Date.now()+30000){message(modal,'Elige una fecha futura válida en hora de Juventino Rosas.');return}
  const payload={title:form.elements.title.value.trim(),body:form.elements.body.value.trim(),
   category:form.elements.category.value,type:form.elements.type.value,
   team:form.elements.team.value.trim(),field:form.elements.field.value.trim(),
   channels:form.elements.push.checked?['app','push']:['app'],
   sendAt:new Date(sendAt).toISOString()};
  if(payload.body.length<15){message(modal,'Escribe al menos 15 caracteres con datos oficiales.');return}
  if(!confirm('¿Guardar la programación oficial? No se publicará hasta la fecha indicada.'))return;
  busy=true;save.disabled=true;
  try{
   const item=editing;
   await call(item?'/admin/notices/'+encodeURIComponent(item.id):'/admin/notices',
    {method:item?'PUT':'POST',body:item?{...payload,revision:item.revision}:payload});
   message(modal,item?'Aviso actualizado.':'Aviso programado en servidor.');
   clear();await refresh();
  }catch(err){message(modal,'No se guardó: '+err.message)}
  finally{busy=false;save.disabled=false}
 };
 $('[data-v1081-reset]',modal).onclick=clear;
 $('[data-v1081-refresh]',modal).onclick=refresh;
 refresh();
}
async function showRoles(){
 if(!media()?.admin?.owner)return;
 const modal=dialog('Permisos de administradores',
 '<div class="v1081"><p class="v1081-note">Solo el presidente asigna cargos. El servidor valida cada modificación de avisos; los permisos del editor de otras secciones necesitan conectarse al mismo sistema de roles.</p>'+
 '<div data-v1081-roles>Consultando...</div><p data-v1081-status class="v1081-status" role="status"></p></div>');
 const box=$('[data-v1081-roles]',modal);
 try{
  const [perms,admins]=await Promise.all([call('/admin/roles'),media().api('admins')]);
  box.replaceChildren();
  const assigned=new Map((perms.roles||[]).map(p=>[String(p.subject),p.role]));
  const roleTitles={lector:'Solo lectura',editor:'Editor de avisos',secretario:'Secretario (avisos)',disciplina:'Disciplina (lectura)'};
  for(const user of (admins.admins||[]).filter(u=>u.active&&!u.owner)){
   const subject=String(user.id||'');if(!/^[a-zA-Z0-9:_-]{1,128}$/.test(subject))continue;
   const row=document.createElement('div');row.className='v1081-role';
   const name=document.createElement('strong');name.textContent=user.name||user.username||subject;
   const pick=document.createElement('select');pick.setAttribute('aria-label','Permiso de '+name.textContent);
   Object.entries(roleTitles).forEach(([value,label])=>{const option=document.createElement('option');option.value=value;option.textContent=label;pick.append(option)});
   pick.value=assigned.get(subject)||'lector';
   const save=document.createElement('button');save.textContent='Guardar cargo';
   save.onclick=async()=>{
    if(!confirm('¿Asignar este cargo al administrador seleccionado?'))return;
    save.disabled=true;
    try{await call('/admin/roles/'+encodeURIComponent(subject),{method:'PUT',body:{role:pick.value}});
      message(modal,'Cargo actualizado en el servidor.');}
    catch(err){message(modal,err.message)}finally{save.disabled=false}
   };
   row.append(name,pick,save);box.append(row);
  }
  if(!box.children.length)box.textContent='No hay administradores adicionales activos.';
 }catch(err){box.textContent='Permisos no disponibles: '+err.message}
}
async function showAudit(){
 if(!media()?.admin?.owner)return;
 const modal=dialog('Historial de cambios','<div class="v1081"><p class="v1081-note">Registro persistente de cambios de avisos y cargos efectuados desde el servidor de notificaciones.</p><div data-v1081-audit>Consultando…</div><p data-v1081-status class="v1081-status"></p></div>');
 const box=$('[data-v1081-audit]',modal);
 try{
  const data=await call('/admin/audit');box.replaceChildren();
  for(const row of (data.items||[]).slice(0,90)){
   const article=document.createElement('article');article.className='v1081-audit-row';
   const head=document.createElement('strong');head.textContent=String(row.action||'Edición').replaceAll(':',' · ');
   const details=document.createElement('small');details.textContent=String(row.actor||'Admin')+' · '+fmt(row.created_at)+' · '+String(row.target||'');
   article.append(head,details);box.append(article);
  }
  if(!box.children.length)box.textContent='No hay operaciones registradas todavía.';
 }catch(err){box.textContent='No se pudo cargar el historial: '+err.message}
}
function adminMount(){
 const grid=$('.liga-media-modal > section.ljr-admin-manage [data-ljr-editor-center] .ljr-editor-hub-grid');
 if(!grid||!active()||grid.querySelector('[data-v1081-global]'))return;
 const buttons=[['global','◷','Avisos globales','Programación para todos'],
  ...(media().admin?.owner?[['roles','♧','Permisos','Cargos de la directiva'],['audit','≡','Historial','Registro de cambios']]:[])];
 for(const [key,icon,title,sub] of buttons){
  const b=document.createElement('button');b.type='button';b.dataset.v1081Global=key;
  b.innerHTML='<b aria-hidden="true">'+esc(icon)+'</b><span>'+esc(title)+'<small>'+esc(sub)+'</small></span>';
  b.onclick=()=>{if(!active())return;key==='global'?makeAdminForm():key==='roles'?showRoles():showAudit()};
  grid.append(b);
  server().then(url=>{
   if(url||!b.isConnected)return;
   const hint=b.querySelector('small');if(hint)hint.textContent='Pendiente conectar servidor HTTPS';
  }).catch(()=>{});
 }
}
let publicLast=0,publicRunning=false;
const newsRoute=()=>['news','notifications'].includes(String(location.hash||'').replace(/^#\/?/,'').split('?')[0]);
async function publicMount(force=false){
 if(!newsRoute()){document.querySelector('[data-v1081-public]')?.remove();return}
 const main=$('#screen');if(!main||publicRunning||(!force&&Date.now()-publicLast<55000))return;
 const b=await server();if(!b)return;
 publicLast=Date.now();publicRunning=true;
 try{
  const data=await publicCall('/notices');
  const rows=Array.isArray(data?.items)?data.items:[];
  let panel=$('[data-v1081-public]',main);
  if(!panel){panel=document.createElement('section');panel.className='v1081-public';panel.dataset.v1081Public='';main.append(panel);}
  panel.replaceChildren();
  const header=document.createElement('div');header.className='v1081-public-header';
  const h=document.createElement('h3');h.textContent='Avisos automáticos oficiales';header.append(h);
  panel.append(header);
  const shown=rows.slice(0,12);
  for(const item of shown){
   const card=document.createElement('article');card.className='v1081-public-card';
   const badge=document.createElement('small');badge.textContent=(item.category||'Todas')+' · '+fmt(item.published_at);
   const title=document.createElement('strong');title.textContent=item.title||'Aviso';
   const body=document.createElement('p');body.textContent=item.body||'';
   card.append(badge,title,body);panel.append(card);
  }
  // La suscripción Push se administra exclusivamente en el módulo v1082 existente.
  // Aquí solo se muestran los comunicados globales, evitando paneles y botones duplicados.
  if(!shown.length)panel.remove();

 }catch(err){const panel=$('[data-v1081-public]',main);if(panel)panel.remove();}
 finally{publicRunning=false}
}
let scheduled=false;
function tick(){
 if(scheduled)return;scheduled=true;
 setTimeout(()=>{scheduled=false;adminMount();if(newsRoute())publicMount();else document.querySelector('[data-v1081-public]')?.remove()},100);
}
function start(){
 new MutationObserver(tick).observe(document.body,{childList:true});
 window.addEventListener('hashchange',()=>{publicLast=0;tick()});
 document.addEventListener('liga:admin',tick);
 window.addEventListener('focus',()=>{publicLast=0;tick()});
 setInterval(()=>{if(newsRoute())publicMount()},60000);
 tick();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();