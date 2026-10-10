/* V1075 · Panel de programación Twilio + Web Push. Autoriza siempre en el backend. */
(()=>{
 'use strict';
 if(window.__LJR_V1075_DELIVERY_ADMIN__)return;window.__LJR_V1075_DELIVERY_ADMIN__=true;
 const $=(s,p=document)=>p.querySelector(s);
 const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
 const e=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
 function mexicoTime(source){
  const m=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(String(source||''));if(!m)return NaN;
  const [year,month,day,hour,minute]=m.slice(1).map(Number);
  if(month<1||month>12||hour>23||minute>59||new Date(Date.UTC(year,month-1,day)).getUTCDate()!==day)return NaN;
  const wall=Date.UTC(year,month-1,day,hour,minute);let now=wall;
  const formatter=new Intl.DateTimeFormat('en-US',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  for(let n=0;n<3;n++){const p=Object.fromEntries(formatter.formatToParts(now).map(z=>[z.type,z.value]));now+=wall-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)}
  return now;
 }
 let configPromise;
 async function getAPI(){
  if(!configPromise)configPromise=(async()=>{try{const r=await fetch('./data/notifications-client.json',{cache:'no-store'});
   const v=await r.json();if(!/^https:\/\//.test(v.apiBaseUrl||''))return '';
   const url=new URL(v.apiBaseUrl);return url.pathname==='/'&&url.username===''&&url.password===''?url.origin:'';
  }catch{return ''}})();
  return configPromise;
 }
 function match(){
  const home=$('[data-v64-ag-home]')?.value||'',away=$('[data-v64-ag-away]')?.value||'',
        field=$('[data-v64-ag-field]')?.value||'',start=$('[data-v64-ag-start]')?.value||'';
  if(home&&away&&start)return {home,away,field,start};
  try{const a=JSON.parse(localStorage.getItem('v64-agenda')||'[]');
   return Array.isArray(a)?a.at(-1):null}catch{return null}
 }
 async function send(endpoint,payload){
  const api=await getAPI(),panel=$('[data-ag1075]'),status=$('[data-ag1075-status]',panel);
  if(!api){status.textContent='Primero configura el servidor de notificaciones.';return}
  if(!window.LJR_MEDIA?.admin||!window.LJR_MEDIA?.notifyAPI){status.textContent='Inicia sesión de administración para programar.';return}
  const button=$('[data-ag1075-submit]',panel);if(button)button.disabled=true;
  status.textContent='Verificando permisos y programando…';
  try{
   const result=await window.LJR_MEDIA.notifyAPI(endpoint,{method:'POST',body:payload});
   status.textContent='✓ Solicitud aceptada. '+(result.id?'ID '+result.id.slice(0,8):'Registrada');
  }catch(err){status.textContent='No se pudo programar: '+(err.message||'Servidor no disponible')}
  finally{if(button)button.disabled=false}
 }
 function mount(){
  if(route()!=='agendaBuilder'||!window.LJR_MEDIA?.admin)return;
  const host=$('[data-ag1074]');if(!host||$('[data-ag1075]'))return;
  const details=$('.ag1074-twilio',host);if(!details)return;
  const s=document.createElement('section');s.className='ag1075';s.dataset.ag1075='';
  s.innerHTML='<div class="ag1075-title"><strong>Administrar envíos programados</strong><small>Solo directiva</small></div>'+
   '<p class="ag1075-note">Los envíos se programan en el servidor; no se envía nada al pulsar Guardar. Requiere destinatarios registrados con consentimiento explícito.</p>'+
   '<p class="ag1075-note">Autorización mediante tu sesión oficial. No se solicitan contraseñas ni claves de servidor.</p>'+
   '<label>Título del aviso<input data-ag1075-title maxlength="120" value="Recordatorio de partido"></label>'+
   '<label>Mensaje<textarea data-ag1075-body maxlength="700" rows="3" placeholder="Datos oficiales, cambios, recordatorios"></textarea></label>'+
   '<label>Envío · hora de Juventino Rosas<input type="datetime-local" data-ag1075-when></label>'+
   '<div class="ag1075-grid"><label>Categoría<select data-ag1075-category><option>Todas</option><option>Primera</option><option>Intermedia</option><option>Segunda</option><option>Veteranos 35+</option><option>Veteranos 50+</option></select></label>'+
   '<label>Anticipación<select data-ag1075-lead><option value="120">2 horas antes</option><option value="1440">24 horas antes</option><option value="30">30 minutos antes</option></select></label></div>'+
   '<fieldset class="ag1075-channels"><legend>Enviar por</legend><label><input type="checkbox" data-ag1075-ch="push" checked> Push</label><label><input type="checkbox" data-ag1075-ch="sms"> SMS</label><label><input type="checkbox" data-ag1075-ch="whatsapp"> WhatsApp (plantilla aprobada)</label></fieldset>'+
   '<div class="ag1075-actions"><button data-ag1075-fill type="button">✦ Usar partido seleccionado</button><button data-ag1075-submit type="button">▣ Programar aviso</button></div>'+
   '<details class="ag1075-consents"><summary>Registrar teléfono con consentimiento</summary>'+
   '<p>El teléfono particular del presidente NO es un remitente Twilio automático. Regístralo únicamente como destinatario autorizado después de su consentimiento; no se publica el número.</p>'+
   '<label>Cargo del contacto<select data-ag1075-contact-role><option value="presidencia">Presidencia de la Liga</option><option value="delegado">Delegado de equipo</option><option value="general">Otro contacto autorizado</option></select></label>'+ 
   '<label>Teléfono privado del contacto<input data-ag1075-phone type="tel" inputmode="tel" autocomplete="off" placeholder="+52XXXXXXXXXX"></label>'+
   '<p class="ag1075-note">Escribe el número cuando entres como administrador. No está precargado en GitHub ni se usará como remitente sin verificación en Twilio.</p>'+
   '<label>Origen del consentimiento<input data-ag1075-source placeholder="Ej. Formulario firmado, fecha y responsable" maxlength="300"></label>'+
   '<label>Canal<select data-ag1075-consent-channel><option value="sms">SMS</option><option value="whatsapp">WhatsApp</option></select></label>'+
   '<label class="ag1075-checked"><input type="checkbox" data-ag1075-confirm> Confirmo que el titular autorizó recibir estos avisos.</label>'+
   '<div class="ag1075-actions"><button data-ag1075-request-consent type="button">Solicitar autorización</button><button data-ag1075-save-phone type="button">Guardar destinatario autorizado</button></div></details>'+
   '<p class="ag1075-status" data-ag1075-status role="status" aria-live="polite">Sin envíos pendientes de esta pantalla.</p>';
  details.append(s);
  $('[data-ag1075-fill]',s).onclick=()=>{const g=match(),status=$('[data-ag1075-status]',s);
   if(!g?.home||!g?.away||!Number.isFinite(mexicoTime(g.start))){status.textContent='Selecciona un partido con fecha y hora.';return}
   $('[data-ag1075-title]',s).value='Recordatorio: '+g.home+' vs '+g.away;
   $('[data-ag1075-body]',s).value='Liga Juventino Rosas · '+g.home+' vs '+g.away+' · '+g.start.replace('T',' ')+' h · '+(g.field||'Campo pendiente')+'. Confirma con la Liga.';
   const lead=Number($('[data-ag1075-lead]',s).value)||120;const when=mexicoTime(g.start)-lead*60000;
   // Mostrar hora de Juventino para la programación, no hora local del teléfono.
   const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(when);
   const p=Object.fromEntries(parts.map(v=>[v.type,v.value]));
   $('[data-ag1075-when]',s).value=[p.year,p.month,p.day].join('-')+'T'+[p.hour,p.minute].join(':');
   status.textContent='Aviso preparado para revisión. Revisa el contenido y pulsa Programar aviso.';
  };
  $('[data-ag1075-submit]',s).onclick=async()=>{const title=$('[data-ag1075-title]',s).value.trim(),body=$('[data-ag1075-body]',s).value.trim();
   const when=mexicoTime($('[data-ag1075-when]',s).value),channels=[...s.querySelectorAll('[data-ag1075-ch]:checked')].map(x=>x.dataset.ag1075Ch);
   if(!title||!body||!Number.isFinite(when)||when<Date.now()||!channels.length){$('[data-ag1075-status]',s).textContent='Revisa título, texto, canales y fecha futura.';return}
   if(!window.confirm('¿Programar este aviso para destinatarios que ya dieron consentimiento?'))return;
   await send('/admin/notices',{title,body,sendAt:new Date(when).toISOString(),channels,category:$('[data-ag1075-category]',s).value});
  };
  // Solicitud manual: abrir WhatsApp y permitir que el administrador decida enviarla.
  // No invocar Twilio, no publicar contactos, no guardar teléfonos en el navegador.
  $('[data-ag1075-request-consent]',s).onclick=()=>{
   const phone=$('[data-ag1075-phone]',s).value.replace(/[\s()-]/g,'');
   const status=$('[data-ag1075-status]',s);
   if(!/^\+[1-9]\d{7,14}$/.test(phone)){status.textContent='Escribe el teléfono internacional antes de solicitar autorización.';return}
   const channel=$('[data-ag1075-consent-channel]',s).value;
   const label=$('[data-ag1075-contact-role]',s).selectedOptions?.[0]?.textContent||'Contacto';
   const text='Hola. Estamos configurando los avisos de la Liga Juventino Rosas para '+label+'. ¿Autorizas recibir recordatorios y cambios de jornada por '+(channel==='sms'?'SMS':'WhatsApp')+'? Si aceptas, responde expresamente SÍ. Puedes darte de baja cuando lo necesites. No se enviará ningún aviso automático sin tu autorización.';
   const link='https://wa.me/'+encodeURIComponent(phone.slice(1))+'?text='+encodeURIComponent(text);
   window.open(link,'_blank','noopener,noreferrer');
   status.textContent='Solicitud preparada en WhatsApp. Solo guarda el contacto después de recibir su autorización.';
  };
  $('[data-ag1075-save-phone]',s).onclick=async()=>{const phone=$('[data-ag1075-phone]',s).value.replace(/\s/g,''),
    source=$('[data-ag1075-source]',s).value.trim(),ch=$('[data-ag1075-consent-channel]',s).value;
   if(!/^\+[1-9]\d{7,14}$/.test(phone)||!source||!$('[data-ag1075-confirm]',s).checked){
    $('[data-ag1075-status]',s).textContent='Es obligatorio el número válido y el consentimiento confirmado.';return}
   if(!window.confirm('¿Confirmas que este número aceptó recibir '+(ch==='sms'?'SMS':'WhatsApp')+' de la Liga?'))return;
   await send('/admin/recipients',{number:phone,channel:ch,contactRole:$('[data-ag1075-contact-role]',s).value,consentAt:new Date().toISOString(),consentSource:source,category:$('[data-ag1075-category]',s).value});
   $('[data-ag1075-phone]',s).value='';$('[data-ag1075-confirm]',s).checked=false;
  };
 }
 let tid;const schedule=()=>{clearTimeout(tid);tid=setTimeout(mount,160)};
 window.addEventListener('hashchange',schedule);const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 setTimeout(schedule,1400);
})();
