/* V1073 · Centro de alertas climáticas de la Liga.
 * Fuente: Open-Meteo y catálogo local de campos. Solo ofrece señales preventivas,
 * no cambia estados de partidos ni decisiones oficiales. Sin servicios secretos.
 * Revisiones programadas mientras la página está abierta y visible.
 */
(function(){
'use strict';
if(window.__LJR_V1073_WEATHER_ALERTS__)return;
window.__LJR_V1073_WEATHER_ALERTS__=true;
const KEY='ljr-v1073-weather-alerts';
const TZ='America/Mexico_City';
const EVERY=20*60*1000;
const $=(s,r=document)=>r.querySelector(s);
const esc=v=>String(v==null?'':v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const route=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
const initial={field:'',automatic:false,device:false,alerts:[],seen:{}};
let options=read(),fields=[],fieldsPromise=null,panel=null,last=null,fetching=false,cache=new Map(),lastRun=0,timer=0;
function read(){try{const x=JSON.parse(localStorage.getItem(KEY)||'{}');return {...initial,...x,alerts:Array.isArray(x.alerts)?x.alerts.slice(0,30):[],seen:x.seen&&typeof x.seen==='object'?x.seen:{}}}catch(_){return {...initial}}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(options))}catch(_){}}
function labelPrecision(x){return x==='exact'||x==='admin-pin'?'Pin del campo':x==='complex'?'Referencia del complejo':'Referencia de localidad/región'}
async function loadFields(force=false){
 if(fields.length&&!force)return fields;
 if(fieldsPromise)return fieldsPromise;
 fieldsPromise=(async()=>{
  const response=await fetch('./data/fields-v38-22.json',{cache:'no-cache'});
  if(!response.ok)throw new Error('Catálogo de campos no disponible');
  const data=await response.json();
  if(!Array.isArray(data.fields)||!data.fields.length)throw new Error('Sin campos válidos');
  fields=data.fields.filter(f=>f&&f.id&&f.name&&f.weatherEligible!==false);
  if(!fields.some(f=>f.id===options.field)){options.field=fields[0].id;save()}
  return fields;
 })().finally(()=>{fieldsPromise=null});
 return fieldsPromise;
}
function coords(field){
 let f=field;
 try{
  const p=JSON.parse(localStorage.getItem('jr54-field-pin:'+field.id)||'null');
  if(p&&Number.isFinite(+p.latitude)&&Number.isFinite(+p.longitude)&&Math.abs(+p.latitude)<=90&&Math.abs(+p.longitude)<=180)f={...field,latitude:+p.latitude,longitude:+p.longitude,precision:'admin-pin'};
 }catch(_){}
 const lat=f.latitude==null?Number(f.weatherLatitude):Number(f.latitude);
 const lon=f.longitude==null?Number(f.weatherLongitude):Number(f.longitude);
 const valid=Number.isFinite(lat)&&Number.isFinite(lon)&&Math.abs(lat)<=90&&Math.abs(lon)<=180;
 return valid?{lat,lon,precision:f.latitude==null?(f.weatherPrecision||'regional'):(f.precision||'locality')}:null;
}
function mxNow(){
 const p=Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:TZ,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date()).filter(x=>x.type!=='literal').map(x=>[x.type,x.value]));
 return p.year+'-'+p.month+'-'+p.day+'T'+p.hour+':'+p.minute;
}
function aggregate(arr,kind){return arr.reduce((n,x)=>n+(Number(x?.[kind])||0),0)}
function max(arr,kind){return arr.reduce((n,x)=>Math.max(n,Number(x?.[kind])||0),0)}
function evaluate(data){
 const h=data?.hourly;
 if(!Array.isArray(h?.time))throw new Error('Pronóstico incompleto');
 const now=mxNow(),items=h.time.map((time,i)=>({
  time, rain:Math.max(0,Number(h.precipitation?.[i])||0),
  chance:Math.max(0,Number(h.precipitation_probability?.[i])||0),
  gust:Math.max(0,Number(h.wind_gusts_10m?.[i])||0),
  code:Number(h.weather_code?.[i])||0
 }));
 const past=items.filter(x=>x.time<now).slice(-24);
 const future=items.filter(x=>x.time>=now);
 if(future.length<6)throw new Error('No hay horas de pronóstico suficientes');
 const f6=future.slice(0,6),f24=future.slice(0,24),f48=future.slice(0,48);
 const past24=aggregate(past,'rain'),next24=aggregate(f24,'rain'),next48=aggregate(f48,'rain'),gust=max(f24,'gust'),chance=max(f24,'chance');
 const storm6=f6.some(x=>x.code>=95),storm24=f24.some(x=>x.code>=95),earlyRain=aggregate(f6,'rain');
 const danger=storm6||gust>=65||next24>=18||past24>=22;
 const watch=storm24||gust>=45||next24>=6||past24>=8||next48>=18||earlyRain>=3;
 const level=danger?'high':watch?'watch':'info';
 const reasons=[];
 if(storm6)reasons.push('posible tormenta eléctrica en 6 h');
 else if(storm24)reasons.push('posible tormenta eléctrica en 24 h');
 if(gust>=45)reasons.push('ráfagas de '+Math.round(gust)+' km/h');
 if(next24>=6)reasons.push(next24.toFixed(1)+' mm previstos en 24 h');
 if(past24>=8)reasons.push(past24.toFixed(1)+' mm estimados en las últimas 24 h');
 if(!reasons.length)reasons.push('sin señales meteorológicas destacadas');
 return {level,reasons,past24,next24,next48,gust,chance,storm6,checkedAt:Date.now()};
}
function inspection(field){
 try{
  const x=JSON.parse(localStorage.getItem('v177-field-inspection:'+field.id)||'null');
  if(!x?.updatedAt)return 'Sin revisión física reciente registrada aquí.';
  const hours=Math.max(0,Math.round((Date.now()-Number(x.updatedAt))/3600000));
  return 'Revisión física local: hace '+hours+' h'+(hours>24?' · conviene actualizarla':'')+'.';
 }catch(_){return 'Sin revisión física registrada aquí.'}
}
function localDecision(field){
 const ids={'sur-1':'uds-1','sur-2':'uds-2','sur-3':'uds-3','zapata-4':'campo-4','tavera':'franco-tavera'};
 const id=ids[field.id]||field.id;
 try{
  const d=JSON.parse(localStorage.getItem('v668-field-decisions')||'{}')[id];
  if(!d)return 'Sin decisión oficial verificada en esta pantalla.';
  const status=({play:'Se juega',review:'En revisión',delay:'Por confirmar',closed:'No se juega'})[d.status]||'Estado local';
  return 'Registro de este dispositivo: '+status+' (no verifica publicación oficial).';
 }catch(_){return 'Sin decisión oficial verificada en esta pantalla.'}
}
async function forecast(field,force=false){
 const p=coords(field);
 if(!p)throw new Error('Esta cancha necesita una referencia geográfica confirmada');
 const key=p.lat+','+p.lon,existing=cache.get(key);
 if(!force&&existing&&Date.now()-existing.time<EVERY)return {...existing.value,precision:p.precision};
 const query=new URLSearchParams({latitude:String(p.lat),longitude:String(p.lon),timezone:TZ,forecast_days:'3',past_days:'2',hourly:'precipitation,precipitation_probability,wind_gusts_10m,weather_code',precipitation_unit:'mm',wind_speed_unit:'kmh'});
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),14000);
 let response;
 try{response=await fetch('https://api.open-meteo.com/v1/forecast?'+query,{signal:controller.signal,credentials:'omit',cache:'no-store'})}
 finally{clearTimeout(timeout)}
 if(!response.ok)throw new Error('Servicio meteorológico no disponible ('+response.status+')');
 const value=evaluate(await response.json());cache.set(key,{value,time:Date.now()});
 return {...value,precision:p.precision};
}
function levelText(level){return ({high:'Precaución alta',watch:'Revisar condiciones',info:'Seguimiento normal'})[level]||'Sin información'}
function stamp(at){return new Date(at).toLocaleString('es-MX',{timeZone:TZ,day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'})}
function notify(title,body){
 if(!options.automatic||!options.device||!('Notification'in window)||Notification.permission!=='granted')return;
 if(!('serviceWorker'in navigator))return;
 navigator.serviceWorker.getRegistration().then(r=>r?.showNotification?.(title,{body,tag:'ljr-weather-alert'})).catch(()=>{});
}
function addAlert(field,wx){
 if(!options.automatic||wx.level==='info')return;
 const bucket=Math.floor(Date.now()/(12*3600000)),signature=wx.level+':'+bucket;
 if(options.seen[field.id]===signature)return;
 options.seen[field.id]=signature;
 options.alerts.unshift({id:field.id+'-'+Date.now(),field:field.name,level:wx.level,text:wx.reasons.join(' · '),at:Date.now()});
 options.alerts=options.alerts.slice(0,30);
 save();notify('Liga Juventino Rosas · '+levelText(wx.level),field.name+': '+wx.reasons.join('; ')+'. Pendiente de inspección física y decisión de la Liga.');
}
function logMarkup(){
 return options.alerts.length?options.alerts.slice(0,4).map(a=>'<div class="v1073-log-item '+esc(a.level)+'"><span>'+esc(stamp(a.at))+' · '+esc(a.field)+'</span><b>'+esc(levelText(a.level))+'</b><small>'+esc(a.text)+'</small></div>').join(''):'<p class="v1073-empty">Sin avisos preventivos guardados. Activa la vigilancia si deseas recibir alertas.</p>';
}
function updateControls(){
 if(!panel)return;
 const b=$('[data-v1073-auto]',panel);if(b){b.classList.toggle('on',options.automatic);b.textContent=options.automatic?'● Vigilancia activada':'○ Activar vigilancia'}
 const n=$('[data-v1073-notify]',panel);if(n){const ok=('Notification'in window)&&Notification.permission==='granted'&&options.device;n.textContent=ok?'🔔 Avisos del dispositivo activos':'🔕 Avisos del dispositivo';n.classList.toggle('on',ok)}
 const log=$('[data-v1073-log]',panel);if(log)log.innerHTML=logMarkup();
}
function output(wx,field){
 if(!panel)return;
 const box=$('[data-v1073-result]',panel);if(!box)return;
 const note=wx.level==='high'?'Precaución meteorológica importante; revisar cancha y seguridad.':wx.level==='watch'?'Conviene revisar físicamente la cancha y confirmar el programa.':'El pronóstico no muestra señales destacadas; aun así se debe revisar el terreno.';
 box.innerHTML='<div class="v1073-result-head '+esc(wx.level)+'"><span>'+esc(levelText(wx.level))+'</span><b>'+esc(field.name)+'</b><small>'+esc(labelPrecision(wx.precision))+' · '+esc(stamp(wx.checkedAt))+'</small></div>'+
 '<div class="v1073-metrics"><div><b>'+wx.past24.toFixed(1)+'<small> mm</small></b><span>Lluvia últimas 24 h*</span></div><div><b>'+wx.next24.toFixed(1)+'<small> mm</small></b><span>Lluvia próximas 24 h</span></div><div><b>'+wx.next48.toFixed(1)+'<small> mm</small></b><span>Lluvia próximas 48 h</span></div><div><b>'+Math.round(wx.gust)+'<small> km/h</small></b><span>Ráfaga máxima 24 h</span></div></div>'+
 '<p class="v1073-advice">'+esc(note)+' '+esc(wx.reasons.join(' · '))+'.</p>'+
 '<p class="v1073-check">'+esc(inspection(field))+'</p><p class="v1073-check">'+esc(localDecision(field))+'</p>'+
 '<small class="v1073-disclaimer">*Lluvia estimada por modelo, no medición en cancha. Umbrales preventivos orientativos, no reglas oficiales. Los porcentajes no suspenden partidos.</small>';
}
function status(msg,kind=''){if(!panel)return;const el=$('[data-v1073-status]',panel);if(el){el.textContent=msg;el.dataset.kind=kind}}
async function check(force=false){
 if(route()!=='v38Weather'||fetching||!panel)return;
 const field=fields.find(f=>f.id===options.field);if(!field)return;
 if(!force&&Date.now()-lastRun<EVERY)return;
 fetching=true;status('Consultando Open-Meteo…');
 const btn=$('[data-v1073-refresh]',panel);if(btn)btn.disabled=true;
 try{
  const wx=await forecast(field,force);
  if(route()!=='v38Weather'||options.field!==field.id)return;
  last={field,wx};lastRun=Date.now();
  output(wx,field);addAlert(field,wx);updateControls();
  status('Pronóstico consultado '+stamp(Date.now())+' · Monitoreo '+(options.automatic?'activado':'manual'),'ok');
 }catch(err){
  status('No se pudo actualizar: '+(err?.name==='AbortError'?'tiempo de espera agotado':err.message||String(err))+'. Intenta de nuevo.','error');
 }finally{fetching=false;if(btn)btn.disabled=false;if(route()==='v38Weather'&&options.field!==field.id)queueMicrotask(()=>check(true))}
}
function message(){
 if(!last)return '';
 const {field,wx}=last;
 return ['⚠️ AVISO PREVENTIVO — NO OFICIAL','Liga Juventino Rosas · '+field.name,'Referencia: '+labelPrecision(wx.precision),'Nivel: '+levelText(wx.level),'Lluvia anterior 24 h (modelo): '+wx.past24.toFixed(1)+' mm','Pronóstico 24/48 h: '+wx.next24.toFixed(1)+' / '+wx.next48.toFixed(1)+' mm','Ráfagas próximas 24 h: '+Math.round(wx.gust)+' km/h','Señales: '+wx.reasons.join(' · '),'Actualizado: '+stamp(wx.checkedAt),'Este mensaje NO confirma suspensión ni autorización. Esperar revisión física y comunicado de la Liga.'].join('\n');
}
async function share(copyOnly=false){
 const str=message();if(!str){status('Primero consulta el pronóstico.','error');return}
 try{
  if(!copyOnly&&navigator.share){await navigator.share({title:'Aviso preventivo de clima · Liga',text:str});return}
  await navigator.clipboard.writeText(str);status('Borrador preventivo copiado. No es comunicado oficial.','ok');
 }catch(err){if(err?.name!=='AbortError')status('No se pudo compartir. Revisa permisos del navegador.','error')}
}
async function askNotification(){
 if(!('Notification'in window)){status('Tu navegador no admite notificaciones del dispositivo. Los avisos se mostrarán aquí.','error');return}
 try{
  if(Notification.permission==='default')await Notification.requestPermission();
  options.device=Notification.permission==='granted';save();updateControls();
  status(options.device?'Permiso de avisos activado. Solo se notifica mientras la app comprueba el clima.':'Permiso no concedido; siguen disponibles los avisos en la página.',options.device?'ok':'error');
 }catch(_){status('El dispositivo no permitió activar notificaciones.','error')}
}
function bind(){
 panel.addEventListener('change',e=>{
  if(e.target.matches('[data-v1073-field]')){
   options.field=e.target.value;save();last=null;lastRun=0;
   const box=$('[data-v1073-result]',panel);if(box)box.innerHTML='';
   check(true);
  }
 });
 panel.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.matches('[data-v1073-auto]')){options.automatic=!options.automatic;save();updateControls();status(options.automatic?'Vigilancia activa: revisión cada 20 min mientras esta página está abierta y visible.':'Vigilancia automática pausada.','ok');if(options.automatic)check(true)}
  else if(b.matches('[data-v1073-refresh]'))check(true);
  else if(b.matches('[data-v1073-notify]'))askNotification();
  else if(b.matches('[data-v1073-copy]'))share(true);
  else if(b.matches('[data-v1073-share]'))share(false);
  else if(b.matches('[data-v1073-official]'))location.hash='#/notices';
  else if(b.matches('[data-v1073-fields]'))Promise.resolve(window.LJR_V172_WEATHER?.openFields?.()).then(()=>{const select=$('[data-v172-field-select]');if(select&&Array.from(select.options).some(x=>x.value===options.field)){select.value=options.field;select.dispatchEvent(new Event('change',{bubbles:true}))}}).catch(()=>{});
  else if(b.matches('[data-v1073-clear]')){options.alerts=[];save();updateControls();status('Historial de este dispositivo borrado.','ok')}
 });
}
function markup(){
 return '<section class="v1073-weather" data-v1073-weather aria-label="Centro de avisos meteorológicos">'+
 '<div class="v1073-title"><span>🔔 CENTRO DE AVISOS · CLIMA</span><b>Vigilancia preventiva</b><small>Automatización local, sin suspensiones automáticas.</small></div>'+
 '<div class="v1073-field"><label for="v1073-field">Campo a vigilar</label><select id="v1073-field" data-v1073-field>'+fields.map(f=>'<option value="'+esc(f.id)+'"'+(f.id===options.field?' selected':'')+'>'+esc(f.name)+'</option>').join('')+'</select></div>'+
 '<div class="v1073-actions"><button type="button" data-v1073-auto></button><button type="button" data-v1073-refresh>↻ Actualizar clima</button><button type="button" data-v1073-notify></button></div>'+
 '<div class="v1073-status" data-v1073-status role="status" aria-live="polite">Preparando pronóstico…</div>'+
 '<div class="v1073-result" data-v1073-result></div>'+
 '<div class="v1073-actions secondary"><button type="button" data-v1073-copy>📋 Copiar borrador</button><button type="button" data-v1073-share>↗ Compartir</button><button type="button" data-v1073-fields>🏟 Revisar campo</button><button type="button" data-v1073-official>✓ Avisos Liga</button></div>'+
 '<details class="v1073-history"><summary>Historial preventivo <span>⌄</span></summary><div data-v1073-log></div><button type="button" data-v1073-clear>Limpiar historial local</button></details>'+
 '<p class="v1073-bottom"><a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer">Datos: Open-Meteo</a> · Interpretación preventiva propia de la Liga. Los avisos solo aparecen mientras la página está abierta y con internet. Para segundo plano se requiere un servicio push seguro. La decisión oficial corresponde a la Liga.</p>'+
 '</section>';
}
async function mount(){
 if(route()!=='v38Weather')return;
 const page=$('.v163-weather-page');if(!page||page.querySelector('[data-v1073-weather]'))return;
 try{await loadFields()}catch(err){
  if(!page.isConnected)return;
  const error=document.createElement('div');error.className='v1073-loading-error';
  error.textContent='No se pudo cargar el catálogo de campos. Recarga la pantalla cuando tengas conexión.';
  page.querySelector('.v163-weather-head')?.after(error);return;
 }
 if(!page.isConnected||route()!=='v38Weather')return;
 const host=document.createElement('div');host.innerHTML=markup();
 panel=host.firstElementChild;
 (page.querySelector('.v163-weather-head')||page).after(panel);
 bind();updateControls();lastRun=0;check(true);
}
function schedule(){clearTimeout(timer);timer=setTimeout(mount,120)}
window.addEventListener('hashchange',schedule);
window.addEventListener('popstate',schedule);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&options.automatic&&route()==='v38Weather')check(false)});
window.addEventListener('focus',()=>{if(options.automatic&&route()==='v38Weather')check(false)});
setInterval(()=>{if(options.automatic&&document.visibilityState==='visible'&&route()==='v38Weather')check(false)},EVERY);
const screen=$('#screen');if(screen)new MutationObserver(schedule).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();
window.LJR_V1073_WEATHER_ALERTS={refresh:()=>check(true),get enabled(){return options.automatic}};
})();