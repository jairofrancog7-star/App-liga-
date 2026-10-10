/* V1074 · Google Calendar real + Web Push opt-in y estado Twilio.
   No altera partidos oficiales; mensajes masivos siempre requieren backend seguro. */
(()=>{
 'use strict';
 if(window.__LJR_V1074_AGENDA_INTEGRATIONS__)return;window.__LJR_V1074_AGENDA_INTEGRATIONS__=true;
 const $=(s,p=document)=>p.querySelector(s);
 const store='ljr-v1074-push-settings';
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
 const val=s=>$(s)?.value?.trim()||'';
 const tz='America/Mexico_City';
 const AG_ICONS={"google":"<rect x=\"3\" y=\"5\" width=\"18\" height=\"16\" rx=\"2\"/><path d=\"M7 3v4m10-4v4M3 10h18m-12 5h6\"/>","ics":"<circle cx=\"12\" cy=\"12\" r=\"9\"/><path d=\"M12 7v5l3 2\"/>","push":"<path d=\"M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-11 12h4\"/>","off":"<path d=\"m3 3 18 18M18 8a6 6 0 0 0-9.4-4.9M6.1 6.4C6 7 6 7.4 6 8c0 7-3 7-3 9h14M10 21h4\"/>","message":"<path d=\"M20 11a8 8 0 0 1-11.5 7L3 21l2.5-6.5A8 8 0 1 1 20 11Z\"/><path d=\"m9 10 2 2 4-3\"/>"};
 const agAction=(name,label)=>'<svg class="ljr-ag-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">'+AG_ICONS[name]+'</svg><span class="ljr-ag-label">'+label+'</span>';

 function parseDateTime(raw){
  const m=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)$/.exec(String(raw||''));if(!m)return NaN;
  const [y,mon,day,h,min]=m.slice(1).map(Number);
  if(mon<1||mon>12||h>23||min>59||new Date(Date.UTC(y,mon-1,day)).getUTCDate()!==day)return NaN;
  const wall=Date.UTC(y,mon-1,day,h,min);let ms=wall;
  const f=new Intl.DateTimeFormat('en-US',{timeZone:tz,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
  for(let i=0;i<3;i++){const p=Object.fromEntries(f.formatToParts(ms).map(z=>[z.type,z.value]));ms+=wall-Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second)}
  return ms;
 }
 const utcStamp=ms=>new Date(ms).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const icsEscape=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
 function read(){
  try{const v=JSON.parse(localStorage.getItem('v64-agenda')||'[]');return Array.isArray(v)?v.filter(x=>x&&typeof x==='object'):[]}catch{return []}
 }
 function input(){
  return {home:val('[data-v64-ag-home]'),away:val('[data-v64-ag-away]'),field:val('[data-v64-ag-field]'),start:val('[data-v64-ag-start]'),duration:Number(val('[data-v64-ag-duration]')||120)}
 }
 function chosen(){
  const selected=input(),isDirty=Boolean(selected.home||selected.away||selected.field||selected.start);
  if(isDirty)return selected;
  return read().filter(g=>Number.isFinite(parseDateTime(g.start))).sort((a,b)=>parseDateTime(a.start)-parseDateTime(b.start)).find(g=>parseDateTime(g.start)>=Date.now())||read().at(-1)||selected;
 }
 function notify(message){const p=$('[data-ag1074-status]');if(p)p.textContent=message;else window.alert(message)}
 function check(g){return g.home&&g.away&&g.field&&Number.isFinite(parseDateTime(g.start))&&g.home!==g.away}
 function googleCalendar(){
  const g=chosen();if(!check(g))return notify('Selecciona primero los dos equipos, campo y fecha/hora válidos.');
  const start=parseDateTime(g.start),end=start+Math.max(30,Math.min(360,Number(g.duration)||120))*60000;
  const u=new URL('https://calendar.google.com/calendar/render');
  u.search=new URLSearchParams({action:'TEMPLATE',text:g.home+' vs '+g.away,dates:utcStamp(start)+'/'+utcStamp(end),
   ctz:tz,stz:tz,etz:tz,details:'Liga Juventino Rosas · BORRADOR local sin carácter oficial. Confirmar programación con la Liga.',location:g.field}).toString();
  const a=document.createElement('a');a.href=u.href;a.target='_blank';a.rel='noopener noreferrer';document.body.append(a);a.click();a.remove();
  notify('Google Calendar: revisa el evento y pulsa Guardar para añadirlo a tu cuenta.');
 }
 function downloadCalendar(){
  const current=input(),saved=read().filter(check);
  const games=(check(current)?[current,...saved.filter(g=>g.start!==current.start||g.home!==current.home||g.away!==current.away)]:saved);
  if(!games.length)return notify('Primero indica equipos, cancha, fecha y hora válidos.');
  const events=games.map(g=>({
   title:g.home+' - '+g.away,iso:g.start.slice(0,10),time:g.start.slice(11,16),
   duration:Math.max(30,Math.min(360,Number(g.duration)||120)),venue:g.field,
   description:'Liga Juventino Rosas · Borrador local. Confirma la programación oficial antes de acudir.'
  }));
  window.LJR_GOOGLE_CALENDAR_GLOBAL.choose(events,'Partidos de la agenda');
  notify('Selecciona un partido y pulsa Guardar en Google Calendar. Los avisos se configuran allí.');
 }
 let configPromise;
 async function config(){
  if(configPromise)return configPromise;
  configPromise=(async()=>{try{const r=await fetch('./data/notifications-client.json',{cache:'no-store'});
   if(!r.ok)return null;const local=await r.json();if(!local.apiBaseUrl||!/^https:\/\//.test(local.apiBaseUrl))return null;
   const base=new URL(local.apiBaseUrl);if(base.username||base.password||base.pathname!=='/'&&base.pathname!=='')return null;
   const response=await fetch(base.origin+'/config',{cache:'no-store'});
   if(!response.ok)return null;const state=await response.json();return {base:base.origin,...state};
  }catch{return null}})();
  return configPromise;
 }
 const vapidToArray=key=>{const b64=key.replace(/-/g,'+').replace(/_/g,'/'),raw=atob(b64.padEnd(Math.ceil(b64.length/4)*4,'=')),array=new Uint8Array(raw.length);
  for(let i=0;i<raw.length;i++)array[i]=raw.charCodeAt(i);return array};
 async function registration(){
  if(!('serviceWorker'in navigator))throw Error('Este navegador no admite notificaciones push');
  // El SW compartido de la PWA ya tiene listeners push y notificationclick.
  return navigator.serviceWorker.register('./sw.js');
 }
 async function pushEnable(){
  const state=await config();
  if(!state?.pushEnabled||!state.vapidPublicKey)return notify('El servidor de notificaciones todavía no está conectado. No se ha activado el envío en segundo plano.');
  if(!('PushManager'in window)||!('Notification'in window))return notify('El navegador no admite Web Push.');
  try{
   const p=await Notification.requestPermission();if(p!=='granted')return notify('No se concedieron permisos de notificación.');
   const reg=await registration();let sub=await reg.pushManager.getSubscription();
   if(!sub)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:vapidToArray(state.vapidPublicKey)});
   const response=await fetch(state.base+'/push/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({subscription:sub.toJSON(),category:'Todas'})});
   if(!response.ok)throw Error('El servidor no guardó la suscripción');
   localStorage.setItem(store,JSON.stringify({enabled:true,at:new Date().toISOString()}));
   notify('✓ Avisos push activados; podrán recibirse con la aplicación cerrada si el sistema lo permite.');
   updateButtons();
  }catch(e){notify('No se pudo activar Web Push: '+(e?.message||'Error desconocido'))}
 }
 async function pushDisable(){
  try{
   const reg=await navigator.serviceWorker.getRegistration('./');
   const sub=await reg?.pushManager?.getSubscription();
   if(sub){
    const state=await config();
    if(state?.base){const result=await fetch(state.base+'/push/unsubscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({endpoint:sub.endpoint})});
     if(!result.ok)throw Error('No se pudo cancelar la suscripción en el servidor');}
    await sub.unsubscribe();
   }
   localStorage.removeItem(store);notify('Se desactivaron las notificaciones push en este teléfono.');updateButtons();
  }catch(e){notify('No se pudo desactivar: '+e.message)}
 }
 async function updateButtons(){
  const state=await config(),enabled=Boolean(state?.pushEnabled);
  const push=$('[data-ag1074="push"]'),off=$('[data-ag1074="off"]');
  if(push){push.title=enabled?'Activar avisos push de fondo':'Se necesita publicar y configurar el servidor de notificaciones';push.dataset.available=String(enabled)}
  if(off){let subscribed=false;try{const reg=await navigator.serviceWorker?.getRegistration?.('./');subscribed=!!(await reg?.pushManager?.getSubscription?.())}catch(_){}off.hidden=!enabled||!subscribed;}
  const s=$('[data-ag1074-backend-status]');if(s){
   s.textContent=state?.pushEnabled?'Servicio Web Push conectado'+(state.twilioEnabled?' · Twilio conectado':' · Twilio sin configurar'):
    'Push de fondo y Twilio: servidor pendiente de configurar. Calendario, avisos locales y compartir sí están disponibles.';
  }
 }
 function mount(){
  if(route()!=='agendaBuilder')return;
  const panel=$('[data-ag1073]');if(!panel||$('[data-ag1074]'))return;
  const box=document.createElement('div');box.className='ag1074';box.dataset.ag1074='';
  box.innerHTML='<div class="ag1074-title"><b>Calendario y notificaciones</b><small>Integraciones</small></div>'+
   '<div class="ag1074-actions">'+
   '<button type="button" data-ag1074="google" aria-label="Guardar partido en Google Calendar">'+agAction('google','Google Calendar')+'</button>'+
   '<button type="button" data-ag1074="ics">'+agAction('ics','Guardar partido')+'</button>'+
   '<button type="button" data-ag1074="push">'+agAction('push','Activar push')+'</button>'+
   '<button type="button" data-ag1074="off" hidden>'+agAction('off','Desactivar push')+'</button></div>'+
   '<p data-ag1074-backend-status class="ag1074-backend">Consultando disponibilidad de notificaciones…</p>'+
   '<p data-ag1074-status class="ag1074-status" role="status" aria-live="polite"></p>'+
   '<details class="ag1074-twilio"><summary>'+agAction('message','SMS y WhatsApp mediante Twilio')+'<span class="ag1074-chevron" aria-hidden="true">▾</span></summary>'+
   '<p>El servidor admite programación automática, registro de destinatarios con consentimiento y seguimiento de entregas. Requiere cuenta Twilio, remitente aprobado, base de datos y despliegue del servidor. Nunca se envía desde el navegador ni sin autorización.</p></details>';
  const actions=$('.ag1073-actions',panel);if(actions)actions.insertAdjacentElement('beforebegin',box);else panel.append(box);
  box.addEventListener('click',e=>{const b=e.target.closest('button[data-ag1074]');if(!b)return;
   const a=b.dataset.ag1074;
   if(a==='google')googleCalendar();if(a==='ics')downloadCalendar();if(a==='push')pushEnable();if(a==='off')pushDisable();
  });
  updateButtons();
 }
 let timer;function schedule(){clearTimeout(timer);timer=setTimeout(mount,130)}
 window.addEventListener('hashchange',schedule);window.addEventListener('pageshow',schedule);
 const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
 setTimeout(schedule,1100);
})();
