/* V1073 · Asistente local de jornada. No publica ni altera los registros oficiales. */
(()=>{
'use strict';
if(window.__LJR_V1073_AGENDA__)return;window.__LJR_V1073_AGENDA__=true;
const $=(s,r=document)=>r.querySelector(s);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const html=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const KEY='v64-agenda', PREF='ljr-v1073-agenda-pref', SENT='ljr-v1073-agenda-reminders';
const TZ='America/Mexico_City';
const route=()=>location.hash.replace(/^#\/?/,'').split('?')[0];
const val=s=>$(s)?.value?.trim()||'';
const read=()=>{try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x.filter(v=>v&&typeof v==='object').slice(0,150):[]}catch{return []}};
const preference=()=>{try{return {...{enabled:false,lead:120},...JSON.parse(localStorage.getItem(PREF)||'{}')}}catch{return {enabled:false,lead:120}}};
function datetime(v){
 const m=/^(\d{4})-(\d\d)-(\d\d)T(\d\d):(\d\d)/.exec(String(v||''));
 if(!m)return NaN;
 const p=m.slice(1).map(Number),[y,mo,d,h,mi]=p;
 if(y<2020||mo<1||mo>12||d<1||d>31||h>23||mi>59||new Date(Date.UTC(y,mo-1,d)).getUTCDate()!==d)return NaN;
 const wall=Date.UTC(y,mo-1,d,h,mi,0);
 let ms=wall;
 const f=new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});
 for(let i=0;i<3;i++){const x=Object.fromEntries(f.formatToParts(ms).map(z=>[z.type,z.value]));const displayed=Date.UTC(+x.year,+x.month-1,+x.day,+x.hour,+x.minute,+x.second);ms+=wall-displayed}
 return ms;
}
const id=m=>[m.start,norm(m.home),norm(m.away),norm(m.field)].join('|');
function draft(){return {home:val('[data-v64-ag-home]'),away:val('[data-v64-ag-away]'),field:val('[data-v64-ag-field]'),start:val('[data-v64-ag-start]'),duration:Number(val('[data-v64-ag-duration]')||120)}}
function checks(m,list,excludeIndex=-1){
 const errors=[];if(!m.home||!m.away)errors.push('Selecciona los dos equipos');
 if(m.home&&m.away&&norm(m.home)===norm(m.away))errors.push('El equipo local y visitante no pueden ser iguales');
 if(!m.field)errors.push('Elige un campo registrado');
 const a=datetime(m.start),duration=Number(m.duration)||120;
 if(!Number.isFinite(a))errors.push('Selecciona una fecha y hora válidas');
 if(duration<30||duration>360)errors.push('La duración debe estar entre 30 y 360 minutos');
 if(Number.isFinite(a)){
  for(let i=0;i<list.length;i++){
   if(i===excludeIndex)continue;const b=list[i],t=datetime(b.start);if(!Number.isFinite(t))continue;
   if(a<t+(Number(b.duration)||120)*60000&&t<a+duration*60000){
    if(m.field&&b.field&&norm(m.field)===norm(b.field))errors.push('Ese campo ya está ocupado a esa hora');
    if([m.home,m.away].some(team=>team&&[b.home,b.away].some(x=>norm(team)===norm(x))))errors.push('Un equipo ya tiene partido en ese horario');
   }
   if(id(m)===id(b))errors.push('Ese mismo cruce ya está guardado');
  }
 }
 return [...new Set(errors)];
}
function summary(){
 const all=read(),bad=all.flatMap((g,i)=>checks(g,all,i));
 return {all, bad:[...new Set(bad)], next:all.filter(g=>datetime(g.start)>Date.now()).sort((a,b)=>datetime(a.start)-datetime(b.start))[0]};
}
function message(m,kind='Partido programado'){
 const date=m.start?m.start.slice(8,10)+'/'+m.start.slice(5,7)+'/'+m.start.slice(0,4)+' a las '+m.start.slice(11,16)+' h (Juventino Rosas)':'Hora pendiente';
 return ['BORRADOR · Liga Juventino Rosas',kind.toUpperCase(),'','⚽ '+(m.home||'Local por confirmar')+' vs '+(m.away||'Visitante por confirmar'),'📅 '+date,'📍 '+(m.field||'Campo por confirmar'),'','Información para revisión. NO es una publicación oficial; confirma los datos antes de compartir.'].join('\n');
}
function selected(){const m=draft();return (m.home||m.away||m.start||m.field)?m:(summary().next||summary().all.at(-1)||m)}
function toast(s){let t=$('[data-ag1073-toast]');if(!t){t=document.createElement('div');t.dataset.ag1073Toast='';document.body.append(t)}t.textContent=s;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),3500)}
function download(text,type,filename){const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=filename;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1800)}
const escICS=s=>String(s||'').replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
const stamp=v=>new Date(v).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');
function calendar(){
 const all=summary().all.filter(x=>Number.isFinite(datetime(x.start))&&x.home&&x.away);
 if(!all.length)return toast('Primero guarda al menos un partido con equipos y horario');
 const rows=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Liga Juventino Rosas//Agenda local//ES','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Agenda local de jornada'];
 all.forEach((m,i)=>{const start=datetime(m.start),end=start+Math.min(360,Math.max(30,Number(m.duration)||120))*60000;
 rows.push('BEGIN:VEVENT','UID:'+stamp(start)+'-'+i+'-ljr-local@agenda.invalid','DTSTAMP:'+stamp(Date.now()),'DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+escICS(m.home+' vs '+m.away),'LOCATION:'+escICS(m.field),'DESCRIPTION:'+escICS('Borrador local. Confirmar con la Liga antes del partido.'),'END:VEVENT')});
 rows.push('END:VCALENDAR','');download(rows.join('\r\n'),'text/calendar;charset=utf-8','Agenda_Juventino_Rosas.ics');toast('Calendario descargado para importar en tu teléfono');
}
function syncPanel(){
 if(route()!=='agendaBuilder')return;
 const p=$('[data-ag1073]');if(!p)return;
 const s=summary(),info=$('[data-ag1073-info]',p),preview=$('[data-ag1073-preview]',p),alerts=$('[data-ag1073-warnings]',p);
 let text=s.all.length+' cruces guardados · '+(s.bad.length?s.bad.length+' alertas por revisar':'sin conflictos detectados');
 if(s.next)text+=' · Próximo: '+html(s.next.home)+' vs '+html(s.next.away)+' ('+html(s.next.start.replace('T',' '))+')';
 if(info&&info.textContent!==text)info.textContent=text;
 const issues=checks(draft(),s.all).filter(x=>draft().home||draft().away||draft().start||draft().field);
 const problems=[...new Set([...s.bad,...issues])];
 const mark=problems.length?problems.map(x=>'⚠ '+x).join(' · '):'✓ El sistema comprueba equipos, campo y horarios antes de guardar.';
 if(alerts&&alerts.textContent!==mark)alerts.textContent=mark;
 if(alerts)alerts.dataset.error=String(problems.length>0);
 if(preview&&!preview.matches(':focus')){const msg=message(selected(),$('[data-ag1073-kind]',p)?.value||'Partido programado');if(preview.value!==msg)preview.value=msg}
}
function mount(){
 if(route()!=='agendaBuilder')return;
 const host=$('.v64-form-grid.one');if(!host||$('[data-ag1073]'))return;
 const section=document.createElement('section');section.dataset.ag1073='';section.className='ag1073';
 section.innerHTML='<div class="ag1073-head"><span><small>ASISTENTE LOCAL · JORNADA</small><strong>Avisos y automatización</strong></span><b>ACTIVO</b></div>'+
 '<div class="ag1073-info" data-ag1073-info aria-live="polite"></div>'+
 '<div class="ag1073-actions">'+
 '<button type="button" data-ag1073-action="notice">✦ Preparar aviso</button>'+
 '<button type="button" data-ag1073-action="calendar">▣ Calendario (.ics)</button>'+
 '<button type="button" data-ag1073-action="last">↺ Reutilizar campo</button>'+
 '<button type="button" data-ag1073-action="weather">☁ Revisar clima</button></div>'+
 '<div data-ag1073-warnings class="ag1073-warnings" aria-live="polite"></div>'+
 '<details class="ag1073-details"><summary>⚙ Avisos, recordatorios y compartir <span>▾</span></summary>'+
 '<div class="ag1073-controls"><label>Tipo de aviso<select data-ag1073-kind><option>Partido programado</option><option>Recordatorio de partido</option><option>Confirmación de sede</option><option>Cambio de horario (revisión)</option></select></label>'+
 '<label>Recordarme con anticipación<select data-ag1073-lead><option value="1440">24 horas antes</option><option value="120">2 horas antes</option><option value="30">30 minutos antes</option></select></label></div>'+
 '<label class="ag1073-toggle"><input type="checkbox" data-ag1073-enabled><span>Activar avisos en este dispositivo, mientras la aplicación esté abierta</span></label>'+
 '<label class="ag1073-preview-label">Vista previa editable<textarea data-ag1073-preview rows="6" aria-label="Texto de aviso"></textarea></label>'+
 '<div class="ag1073-actions small"><button type="button" data-ag1073-action="copy">Copiar texto</button><button type="button" data-ag1073-action="share">Compartir</button><button type="button" data-ag1073-action="whatsapp">WhatsApp</button><button type="button" data-ag1073-action="test">Probar aviso</button></div>'+
 '<p class="ag1073-foot">Los recordatorios son locales: se revisan cuando la web está abierta. No se envían automáticamente a otros usuarios ni se publican partidos oficiales.</p>'+
 '</details>';
 const stack=$('.v64-stack-actions');if(stack)stack.insertAdjacentElement('afterend',section);else host.insertAdjacentElement('afterend',section);
 const pref=preference();$('[data-ag1073-lead]',section).value=String(pref.lead);$('[data-ag1073-enabled]',section).checked=!!pref.enabled;
 section.addEventListener('change',e=>{if(e.target.matches('[data-ag1073-enabled],[data-ag1073-lead]')){const settings={enabled:$('[data-ag1073-enabled]',section).checked,lead:Number($('[data-ag1073-lead]',section).value)};localStorage.setItem(PREF,JSON.stringify(settings));if(settings.enabled)enableNotifications();}syncPanel()});
 section.addEventListener('click',e=>{const b=e.target.closest('[data-ag1073-action]');if(!b)return;const action=b.dataset.ag1073Action;
 if(action==='notice'){section.querySelector('details').open=true;syncPanel();$('[data-ag1073-preview]',section)?.focus({preventScroll:true});return}
 if(action==='calendar')return calendar();
 if(action==='weather'){location.hash='#/v38Weather';return}
 if(action==='last'){const last=read().at(-1);if(!last)return toast('Guarda un cruce primero');const field=$('[data-v64-ag-field]');if(field){field.value=last.field||'';field.dispatchEvent(new Event('change',{bubbles:true}));const visual=field.parentElement?.querySelector('.v159-picker');if(visual){visual.querySelector('b').textContent=last.field||'Por confirmar';visual.querySelector('small').textContent='Campo reutilizado'}}toast('Campo recuperado; escoge los equipos y un nuevo horario');return}
 const txt=$('[data-ag1073-preview]',section).value;if(action==='copy'){navigator.clipboard?.writeText(txt).then(()=>toast('Aviso copiado'),()=>toast('No se pudo copiar')).catch(()=>toast('No se pudo copiar'));return}
 if(action==='whatsapp'){window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank','noopener,noreferrer');return}
 if(action==='share'){if(navigator.share){navigator.share({title:'Borrador de aviso · Liga Juventino Rosas',text:txt}).catch(()=>{});}else navigator.clipboard?.writeText(txt).then(()=>toast('Aviso copiado para compartir')).catch(()=>toast('No disponible'));return}
 if(action==='test')showNotice('Prueba · Liga Juventino Rosas','Tus avisos están configurados para este dispositivo.');
 });
 const form=$('.v64-form-grid.one');form?.addEventListener('input',debounceSync);form?.addEventListener('change',debounceSync);
 syncPanel();
}
function debounceSync(){clearTimeout(debounceSync.t);debounceSync.t=setTimeout(syncPanel,120)}
/* La app ya tiene su guardado nativo: solo impedimos que almacene cruces imposibles. */
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-v64-ag-add]');if(!button||route()!=='agendaBuilder')return;
 const issues=checks(draft(),read());if(issues.length){e.stopImmediatePropagation();e.preventDefault();toast(issues.slice(0,2).join(' · '));syncPanel();return}
 setTimeout(()=>{syncPanel();checkReminders()},100);
},true);
document.addEventListener('click',e=>{if(route()!=='agendaBuilder')return;if(e.target.closest('[data-v64-ag-remove],[data-v64-ag-clear]'))setTimeout(syncPanel,120)},true);
async function enableNotifications(){
 if(!('Notification' in window)){toast('Este navegador no permite notificaciones');return}
 if(Notification.permission==='default'){try{const result=await Notification.requestPermission();toast(result==='granted'?'Notificaciones permitidas':'Activa los permisos en tu navegador')}catch{toast('El navegador no permitió activar los avisos')}}
 else if(Notification.permission==='denied')toast('Las notificaciones están bloqueadas en este navegador');
 checkReminders();
}
async function showNotice(title,body){
 if(!('Notification' in window))return toast('Este navegador no admite notificaciones');
 if(Notification.permission!=='granted'){await enableNotifications();if(Notification.permission!=='granted')return}
 try{
  const reg=await navigator.serviceWorker?.getRegistration?.();
  if(reg&&reg.showNotification)await reg.showNotification(title,{body,tag:'ljr-agenda-'+norm(title).slice(0,20)});
  else if(!/Android|iPhone|iPad/i.test(navigator.userAgent))new Notification(title,{body});
  else toast('Instala la app para recibir notificaciones compatibles con Android');
 }catch{toast('No fue posible mostrar la notificación en este dispositivo')}
}
function checkReminders(){
 const pref=preference();if(!pref.enabled||!('Notification' in window)||Notification.permission!=='granted')return;
 const now=Date.now(),threshold=(Number(pref.lead)||120)*60000;
 let sent={};try{sent=JSON.parse(localStorage.getItem(SENT)||'{}')||{}}catch{}
 for(const [k,t] of Object.entries(sent)){if(!Number.isFinite(t)||now-t>7*86400000)delete sent[k]}
 for(const m of read()){
  const t=datetime(m.start);if(!Number.isFinite(t)||!m.home||!m.away)continue;
  const key=id(m)+'|'+pref.lead;
  if(now>=t-threshold&&now<t&&!(key in sent)){
   sent[key]=now;showNotice('Próximo partido · Juventino Rosas',m.home+' vs '+m.away+' · '+m.start.replace('T',' ')+' · '+(m.field||'Campo pendiente'));
  }
 }
 try{localStorage.setItem(SENT,JSON.stringify(sent))}catch{}
}
let setupTimer=0;function setup(){clearTimeout(setupTimer);setupTimer=setTimeout(()=>{mount();syncPanel()},130)}
window.addEventListener('hashchange',setup);
window.addEventListener('pageshow',setup);
window.addEventListener('storage',e=>{if(e.key===KEY)setup()});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkReminders()});
setInterval(checkReminders,60000);
const screen=$('#screen');if(screen)new MutationObserver(setup).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup,{once:true});else setup();
setTimeout(setup,1000);
})();