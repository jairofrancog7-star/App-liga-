/* V1073 — Avisos de canchas. Solo pronóstico informativo; no altera decisiones oficiales. */
(function(){
'use strict';
if(window.__LJR_V1073_FIELD_ALERTS__)return;
window.__LJR_V1073_FIELD_ALERTS__=true;
var STORE='ljr-field-weather-alerts-v1073';
var FIELDS=[
 ['sur-1','Campo 1 · Unidad Deportiva Sur',20.63753,-100.99297,'complejo'],
 ['sur-2','Campo 2 · Unidad Deportiva Sur',20.63753,-100.99297,'complejo'],
 ['sur-3','Campo 3 · Unidad Deportiva Sur',20.63753,-100.99297,'complejo'],
 ['zapata-4','Campo 4 · Emiliano Zapata',20.64337,-100.99286,'regional'],
 ['cerrito','Campo Cerrito de Gasca',20.617778,-101.0625,'localidad'],
 ['tavera','Campo de Tavera',20.60839,-100.93238,'localidad'],
 ['san-juan','Campo San Juan de la Cruz',20.63379,-100.911569,'localidad'],
 ['cuenda','Unidad Deportiva Santiago de Cuenda',20.59793,-100.99663,'localidad'],
 ['romerillo','Campo San Antonio de Romerillo',20.60784,-100.94854,'localidad'],
 ['fraccionamiento','Campo Fraccionamiento Comontuoso',20.59793,-100.99663,'regional'],
 ['pozos','Campo de Fútbol de Pozos',20.61767,-100.90033,'campo'],
 ['rincon','Campo Rincón de Centeno',20.660153,-100.886766,'localidad'],
 ['san-jose','Campo San José de la Montaña',20.60102,-101.07242,'localidad'],
 ['san-julian','Campo San Julián Tierra Blanca',20.591403,-101.040358,'localidad']
].map(function(row){return {id:row[0],name:row[1],lat:row[2],lon:row[3],precision:row[4]};});
var byId=new Map(FIELDS.map(function(f){return [f.id,f];}));
var cache=new Map(), riskById=new Map(), lastRefresh=0, mounting=false, scheduled=false, checking=null;
function stored(){
 try{
  var s=JSON.parse(localStorage.getItem(STORE)||'{}')||{};
  return {followed:Array.isArray(s.followed)?s.followed.filter(function(id){return byId.has(id);}):[],alerts:s.alerts&&typeof s.alerts==='object'?s.alerts:{},notify:!!s.notify};
 }catch(_){return {followed:[],alerts:{},notify:false};}
}
var state=stored();
function save(){try{localStorage.setItem(STORE,JSON.stringify(state));}catch(_){}}
function route(){return String(location.hash||'').replace(/^#\/?/,'').split('?')[0]||document.body.dataset.appRoute||'';}
function host(){var r=route();return r==='venues'||r==='weatherFields'?document.querySelector('#screen .v921-field-page'):null;}
function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c];});}
function cardId(card,index){var attr=card.getAttribute('data-v921-field');return byId.has(attr)?attr:(FIELDS[index]||{}).id;}
function mapUrl(f){return 'https://www.google.com/maps/dir/?api=1&destination='+encodeURIComponent(f.name+', Guanajuato, México');}
function el(html){var div=document.createElement('div');div.innerHTML=html.trim();return div.firstElementChild;}
function weatherBadge(id){
 var r=riskById.get(id);
 return r?'<span class="v1073-risk" data-tone="'+r.tone+'">'+esc(r.short)+'</span>':
 '<span class="v1073-risk" data-tone="neutral">Sin consultar</span>';
}
function cardMarkup(f){
 var on=state.followed.includes(f.id);
 return '<div class="v1073-field" data-v1073-field="'+esc(f.id)+'">'+
  '<div class="v1073-inline"><span class="v1073-live">'+weatherBadge(f.id)+'</span>'+
   '<button type="button" class="v1073-mini" data-v1073-check="'+esc(f.id)+'">⟳ <span>Revisar riesgo</span></button></div>'+
  '<div class="v1073-shortcuts">'+
   '<button type="button" data-v1073-follow="'+esc(f.id)+'" aria-pressed="'+on+'">'+(on?'✓ Siguiendo':'♧ Seguir cancha')+'</button>'+
   '<button type="button" data-v1073-share="'+esc(f.id)+'">↗ Compartir</button>'+
   '<a href="'+esc(mapUrl(f))+'" target="_blank" rel="noopener noreferrer">➤ Cómo llegar</a>'+
  '</div>'+
  '<div class="v1073-detail" data-v1073-detail="'+esc(f.id)+'" hidden></div>'+
 '</div>';
}
function dashboardMarkup(){
 return '<section class="v1073-dashboard" data-v1073-dashboard aria-label="Avisos de canchas">'+
  '<div class="v1073-heading"><div><small>SEGUIMIENTO DE SEDES</small><h2>Alertas de canchas</h2></div>'+
   '<span class="v1073-count" data-v1073-count>0 seguidas</span></div>'+
  '<div class="v1073-dashboard-actions">'+
   '<button type="button" data-v1073-refresh>⟳ Actualizar</button>'+
   '<button type="button" data-v1073-notify>♧ Notificaciones</button>'+
   '<button type="button" data-v1073-notices>▣ Avisos de la Liga</button></div>'+
  '<p class="v1073-message" data-v1073-message role="status" aria-live="polite">Sigue un campo para revisar su pronóstico automáticamente.</p>'+
  '<p class="v1073-disclaimer">Avisos meteorológicos orientativos · no cancelan partidos ni representan una decisión oficial. Se revisan al abrir esta página y mientras la app permanece abierta; no son alertas push de fondo.</p>'+
 '</section>';
}
function syncDashboard(){
 var panel=document.querySelector('#screen [data-v1073-dashboard]');if(!panel)return;
 var count=panel.querySelector('[data-v1073-count]');
 if(count)count.textContent=state.followed.length+' seguida'+(state.followed.length===1?'':'s');
 var notify=panel.querySelector('[data-v1073-notify]');
 if(notify)notify.textContent=(state.notify&&'Notification'in window&&Notification.permission==='granted')?'✓ Notificaciones':'♧ Notificaciones';
 document.querySelectorAll('#screen [data-v1073-follow]').forEach(function(b){
  var on=state.followed.includes(b.dataset.v1073Follow);
  b.setAttribute('aria-pressed',String(on));b.textContent=on?'✓ Siguiendo':'♧ Seguir cancha';
 });
}
function msg(str){var p=document.querySelector('#screen [data-v1073-message]');if(p)p.textContent=str;}
function mount(){
 if(mounting)return;
 var h=host();if(!h)return;
 var list=h.querySelector('.v921-field-list');
 if(!list)return;
 mounting=true;
 try{
  if(!h.querySelector('[data-v1073-dashboard]')){
   var dashboard=el(dashboardMarkup());
   h.insertBefore(dashboard,list);
  }
  Array.from(list.querySelectorAll('.v921-field-card')).forEach(function(card,i){
   if(card.querySelector('[data-v1073-field]'))return;
   var id=cardId(card,i),f=byId.get(id);if(!f)return;
   card.appendChild(el(cardMarkup(f)));
  });
  syncDashboard();
  if(state.followed.length&&Date.now()-lastRefresh>25*60*1000)refreshFollowed(false);
 }finally{mounting=false;}
}
function scheduleMount(){
 if(scheduled)return;scheduled=true;
 setTimeout(function(){scheduled=false;mount();},90);
}
function riskOf(data){
 var h=data&&data.hourly||{},time=h.time||[];
 if(!Array.isArray(time)||!time.length)throw new Error('Faltan datos horarios');
 var offset=Number(data.utc_offset_seconds||0)*1000,now=Date.now();
 var p=0,mm=0,g=0,thunder=false,periods=0;
 time.forEach(function(t,i){
  var epoch=Date.parse(String(t)+'Z')-offset;
  if(!Number.isFinite(epoch)||epoch<now-60*60*1000||epoch>now+24*60*60*1000)return;
  periods++;
  var prob=Number((h.precipitation_probability||[])[i]);
  var rain=Number((h.precipitation||[])[i]);
  var gust=Number((h.wind_gusts_10m||[])[i]);
  var code=Number((h.weather_code||[])[i]);
  if(Number.isFinite(prob))p=Math.max(p,prob);
  if(Number.isFinite(rain))mm=Math.max(mm,rain);
  if(Number.isFinite(gust))g=Math.max(g,gust);
  if([95,96,99].includes(code))thunder=true;
 });
 if(!periods)throw new Error('Pronóstico no disponible para las próximas 24 horas');
 var tone=(thunder||mm>=10||g>=55)?'danger':(mm>=3||p>=65||g>=40)?'watch':'good';
 var short=tone==='danger'?'Riesgo elevado':tone==='watch'?'Precaución':'Sin señales destacadas';
 return {tone:tone,short:short,prob:Math.round(p),rain:mm.toFixed(1),gust:Math.round(g),thunder:thunder,
  checked:Date.now(),precision:data._precision||''};
}
async function fetchRisk(f,force){
 var key=f.lat.toFixed(5)+':'+f.lon.toFixed(5),entry=cache.get(key),now=Date.now();
 if(entry&&(!force||now-entry.at<60*1000)&&now-entry.at<25*60*1000)return entry.promise;
 var u='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(f.lat)+
   '&longitude='+encodeURIComponent(f.lon)+
   '&hourly=precipitation_probability,precipitation,wind_gusts_10m,weather_code&forecast_days=2&timezone=America%2FMexico_City';
 var promise=fetch(u).then(function(res){if(!res.ok)throw new Error('Error de conexión ('+res.status+')');return res.json();})
  .then(function(data){return riskOf(data);});
 cache.set(key,{at:now,promise:promise});
 try{return await promise;}catch(e){cache.delete(key);throw e;}
}
function paint(f,r,expanded){
 riskById.set(f.id,r);
 document.querySelectorAll('#screen [data-v1073-field="'+f.id+'"]').forEach(function(box){
  var chip=box.querySelector('.v1073-live');
  if(chip)chip.innerHTML=weatherBadge(f.id);
  var d=box.querySelector('.v1073-detail');
  if(d&&(expanded||!d.hidden)){
   d.hidden=false;
   d.textContent='';
   var date=new Date(r.checked).toLocaleString('es-MX',{dateStyle:'short',timeStyle:'short'});
   d.innerHTML='<div><b>Próximas 24 h</b><span>Prob. lluvia máx. <strong>'+r.prob+'%</strong></span>'+
    '<span>Precipitación horaria máx. <strong>'+r.rain+' mm</strong></span>'+
    '<span>Rachas máx. <strong>'+r.gust+' km/h</strong></span></div>'+
    '<small>Consulta '+esc(date)+' · zona aproximada; verificar terreno antes de jugar.</small>';
  }
 });
}
async function notifyRisk(f,r){
 if(!state.followed.includes(f.id))return;
 if(r.tone==='good'){if(state.alerts[f.id]){delete state.alerts[f.id];save();}return;}
 var last=state.alerts[f.id],recent=last&&last.tone===r.tone&&Date.now()-last.time<12*60*60*1000;
 if(recent)return;
 state.alerts[f.id]={tone:r.tone,time:Date.now()};save();
 msg('Atención en '+f.name+': '+r.short.toLowerCase()+'. Verifica antes del partido.');
 if(!state.notify||!('Notification'in window)||Notification.permission!=='granted')return;
 var title='Pronóstico · '+f.name,body=r.short+' (24 h). No es suspensión oficial.';
 try{
  if('serviceWorker'in navigator){
   var sw=await navigator.serviceWorker.getRegistration('./src/field-alerts/');
   if(sw&&typeof sw.showNotification==='function'){
    await sw.showNotification(title,{body:body,tag:'ljr-weather-'+f.id});
    return;
   }
  }
  new Notification(title,{body:body,tag:'ljr-weather-'+f.id});
 }catch(_){/* Aviso dentro de la página sigue disponible. */}
}
async function checkField(id,expand,force){
 var f=byId.get(id);if(!f)return;
 document.querySelectorAll('#screen [data-v1073-field="'+id+'"] .v1073-live').forEach(function(el){
  if(!riskById.has(id))el.textContent='Consultando pronóstico…';
 });
 try{
  var r=await fetchRisk(f,!!force);
  paint(f,r,!!expand);
  await notifyRisk(f,r);
 }catch(_){
  document.querySelectorAll('#screen [data-v1073-field="'+id+'"] .v1073-live').forEach(function(el){
   el.textContent='Sin conexión · reintentar';
  });
  if(expand)msg('No se pudo consultar '+f.name+'. Revisa tu conexión.');
 }
}
async function refreshFollowed(force){
 if(checking)return checking;
 if(!state.followed.length){msg('Selecciona “Seguir cancha” en una sede para activar su seguimiento local.');return;}
 lastRefresh=Date.now();
 msg('Revisando pronóstico de '+state.followed.length+' cancha(s)…');
 var ids=state.followed.slice();
 checking=Promise.allSettled(ids.map(function(id){return checkField(id,false,force);}))
 .then(function(){msg('Seguimiento revisado · '+new Date().toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit'})+'. Riesgos orientativos, no oficiales.');})
 .finally(function(){checking=null;});
 return checking;
}
function shareText(f){
 var r=riskById.get(f.id);
 return '🏟️ '+f.name+'\nLiga Juventino Rosas\n'+(r?'Pronóstico 24 h: '+r.short+' · lluvia máx. '+r.prob+'% · rachas '+r.gust+' km/h\n':'')+
  'Ver ubicación: '+mapUrl(f)+'\n⚠️ Pronóstico informativo. La Liga confirma oficialmente si se juega.';
}
async function shareField(id){
 var f=byId.get(id);if(!f)return;
 var t=shareText(f);
 try{
  if(navigator.share){await navigator.share({title:f.name,text:t});return;}
  if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(t);msg('Información de la cancha copiada.');return;}
 }catch(err){if(err&&err.name==='AbortError')return;}
 var inp=document.createElement('textarea');inp.value=t;document.body.appendChild(inp);inp.select();
 try{if(document.execCommand('copy'))msg('Información de la cancha copiada.');else msg('No se pudo copiar automáticamente.');}
 catch(_){msg('No se pudo copiar automáticamente.');}
 inp.remove();
}
async function askNotify(){
 if(!('Notification'in window)||!isSecureContext){
  msg('Este navegador no permite notificaciones. El seguimiento dentro de la página sigue disponible.');return;
 }
 try{
  var permission=Notification.permission==='default'?await Notification.requestPermission():Notification.permission;
  state.notify=permission==='granted';save();syncDashboard();
  if(state.notify&&'serviceWorker'in navigator){
   try{await navigator.serviceWorker.register('./src/field-weather-worker.js',{scope:'./src/field-alerts/'});}catch(_){/* avisos en pantalla siguen activos */}
  }
  msg(permission==='granted'?'Notificaciones permitidas mientras abres la app. No hay envíos push con la página cerrada.':
   'No se activaron notificaciones; puedes seguir consultando los avisos dentro de la app.');
 }catch(_){msg('No se pudo activar el permiso de notificaciones en este dispositivo.');}
}
document.addEventListener('click',function(e){
 if(!host())return;
 var target=e.target.closest('[data-v1073-check],[data-v1073-follow],[data-v1073-share],[data-v1073-refresh],[data-v1073-notify],[data-v1073-notices]');
 if(!target)return;
 if(target.hasAttribute('data-v1073-check')){
  e.preventDefault();checkField(target.dataset.v1073Check,true,true);
 }else if(target.hasAttribute('data-v1073-follow')){
  e.preventDefault();
  var id=target.dataset.v1073Follow;
  if(!byId.has(id))return;
  state.followed=state.followed.includes(id)?state.followed.filter(function(x){return x!==id;}):state.followed.concat(id);
  save();syncDashboard();
  if(state.followed.includes(id)){msg('Siguiendo '+byId.get(id).name+' · revisando clima.');checkField(id,true,false);}
  else msg('Dejaste de seguir '+byId.get(id).name+'.');
 }else if(target.hasAttribute('data-v1073-share')){
  e.preventDefault();shareField(target.dataset.v1073Share);
 }else if(target.hasAttribute('data-v1073-refresh')){
  e.preventDefault();refreshFollowed(true);
 }else if(target.hasAttribute('data-v1073-notify')){
  e.preventDefault();askNotify();
 }else if(target.hasAttribute('data-v1073-notices')){
  e.preventDefault();location.hash='#/notices';
 }
});
document.addEventListener('visibilitychange',function(){
 if(document.visibilityState==='visible'&&Date.now()-lastRefresh>25*60*1000)scheduleMount();
});
window.addEventListener('hashchange',scheduleMount);
window.addEventListener('pageshow',scheduleMount);
setInterval(function(){if(document.visibilityState==='visible'&&host()&&Date.now()-lastRefresh>30*60*1000)refreshFollowed(false);},30*60*1000);
var screen=document.querySelector('#screen');
if(screen)new MutationObserver(scheduleMount).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',scheduleMount,{once:true});
else scheduleMount();
})();