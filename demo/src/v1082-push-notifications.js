/* V1082 — Suscripciones Web Push reales, opcionales.
   Sin servidor configurado no se prometen avisos con la aplicación cerrada. */
(()=>{
'use strict';
if(window.__LJR_V1082_PUSH__)return;
window.__LJR_V1082_PUSH__=true;
const KEY='ljr-push-preferences-v1082';
const CATEGORIES=[['all','Todas'],['3','Primera'],['5','Intermedia'],['4','Segunda'],['2','Veteranos 35+'],['1','Veteranos 50+']];
const FIELDS=['','Campo 1','Campo 2','Campo 3','Campo 4','Fraccionamiento','Romerillo','San Julián','Franco Tavera','Cuenda','Campo de Fútbol de Pozos','Campo Cerrito de Gasca','Campo San José de la Montaña','Campo San Juan de la Cruz','Campo Rincón de Centeno'];
const TYPES=[['suspension','Suspensiones'],['cancha','Cambios de cancha'],['horario','Cambios de horario'],['jornada','Jornadas'],['partido','Partidos'],['resultados','Resultados'],['junta','Juntas'],['registro','Inscripciones'],['clima','Clima']];
const read=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch{return {}}};
const $=(s,root=document)=>root.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
const path=()=>String(location.hash||'').replace(/^#\/?/,'').split('?')[0];
let basePromise,working=false,renderQueued=false;
async function apiBase(){
 if(basePromise)return basePromise;
 basePromise=(async()=>{
  try{
   // La misma URL HTTPS sirve para avisos globales, Push y envíos de la directiva.
   const r=await fetch('./data/notifications-client.json',{cache:'no-store'});
   const v=r.ok?await r.json():{};
   let address=String(v.apiBaseUrl||'').trim();
   if(!address){
    const fallback=await fetch('./push-config.json',{cache:'no-store'});
    const legacy=fallback.ok?await fallback.json():{};
    address=String(legacy.apiBase||'').trim();
   }
   if(!address)return '';
   const u=new URL(address);
   if(u.protocol!=='https:'||u.username||u.password||u.search||u.hash)return '';
   return u.origin+u.pathname.replace(/\/+$/,'');
  }catch{return ''}
 })();
 return basePromise;
}
async function server(path,opts={}){
 const base=await apiBase();if(!base)throw Error('El servidor de notificaciones todavía no está configurado.');
 const res=await fetch(base+'/api/push/'+path,{...opts,headers:{'Content-Type':'application/json'},cache:'no-store'});
 let data;try{data=await res.json()}catch{data={}}
 if(!res.ok)throw Error(data.error||'Error del servidor ('+res.status+')');
 return data;
}
function supported(){return isSecureContext&&'Notification'in window&&'serviceWorker'in navigator&&'PushManager'in window;}
function keyBytes(str){
 const padding='='.repeat((4-str.length%4)%4),bin=atob((str+padding).replace(/-/g,'+').replace(/_/g,'/'));
 return Uint8Array.from(bin,c=>c.charCodeAt(0));
}
function keyMatches(sub,key){
 const current=sub?.options?.applicationServerKey;
 if(!current)return false;
 const a=new Uint8Array(current),b=keyBytes(key);
 return a.length===b.length&&a.every((value,i)=>value===b[i]);
}
function preferences(){
 const p=read();
 return {category:CATEGORIES.some(x=>x[0]===p.category)?p.category:'all',
  team:String(p.team||'').slice(0,90),field: FIELDS.includes(p.field)?p.field:'',
  types:Array.isArray(p.types)?p.types.filter(t=>TYPES.some(x=>x[0]===t)):TYPES.map(x=>x[0])};
}
function save(p){try{localStorage.setItem(KEY,JSON.stringify(p))}catch{}}
function routeHost(){
 const r=path();
 if(!['notifications','venues','weatherFields','news'].includes(r))return null;
 if(r==='notifications'){
  return $('#screen [data-v1073-center]')||$('#screen [data-v66-notifications]')||$('#screen');
 }
 if(r==='news')return $('#screen [data-news-list]')?.parentElement||null;
 return $('#screen .v921-field-page');
}
function markup(){
 const p=preferences();
 return '<section class="v1082-push" data-v1082-push>'+
 '<header class="v1082-head"><span><small>ALERTAS OFICIALES</small><strong>Notificaciones de la Liga</strong><em data-v1082-state>Comprobando servicio…</em></span><span class="v1082-signal" aria-hidden="true">♧</span></header>'+
 '<div class="v1082-filters">'+
 '<label>Categoría<select data-v1082-category>'+CATEGORIES.map(([id,label])=>'<option value="'+id+'" '+(id===p.category?'selected':'')+'>'+esc(label)+'</option>').join('')+'</select></label>'+
 '<label>Equipo favorito (opcional)<input data-v1082-team maxlength="90" type="text" value="'+esc(p.team)+'" placeholder="Todos los equipos"></label>'+
 '<label>Cancha (opcional)<select data-v1082-field>'+FIELDS.map(f=>'<option value="'+esc(f)+'" '+(p.field===f?'selected':'')+'>'+(f?esc(f):'Todas las canchas')+'</option>').join('')+'</select></label>'+
 '</div>'+
 '<details class="v1082-types"><summary>Elegir tipos de aviso</summary><div>'+
 TYPES.map(([id,label])=>'<label><input type="checkbox" value="'+id+'" data-v1082-type '+(p.types.includes(id)?'checked':'')+'>'+esc(label)+'</label>').join('')+
 '</div></details>'+
 '<div class="v1082-actions"><button type="button" data-v1082-toggle>Activar avisos</button><button type="button" data-v1082-save>Guardar filtros</button></div>'+
 '<p class="v1082-status" data-v1082-status aria-live="polite">Publicaciones oficiales de la Liga, verificadas antes del envío.</p>'+
 '<small class="v1082-note">La Liga decide oficialmente los cambios; el pronóstico del tiempo no cancela partidos. Solo se envían avisos si el administrador los publica en el sistema oficial.</small>'+
 '</section>';
}
function status(root,s){const el=$('[data-v1082-status]',root);if(el)el.textContent=s;}
function getValues(root){
 const types=Array.from(root.querySelectorAll('[data-v1082-type]:checked'),el=>el.value);
 return {category:$('[data-v1082-category]',root)?.value||'all',
  team:$('[data-v1082-team]',root)?.value.trim().slice(0,90)||'',
  field:$('[data-v1082-field]',root)?.value||'',types};
}
async function registration(){
 // Esta ruta utiliza el service worker existente (sw.js) sin reemplazar su cache de la app.
 return await navigator.serviceWorker.register('./sw.js');
}
async function subscription(){
 if(!supported())return null;
 const reg=await registration();return reg.pushManager.getSubscription();
}
async function syncState(root){
 const label=$('[data-v1082-state]',root),toggle=$('[data-v1082-toggle]',root);
 if(!label||!toggle)return;
 toggle.disabled=false;
 if(!supported()){
  label.textContent='Web Push no compatible con este navegador';
  toggle.disabled=true;
  status(root,'Puedes consultar los avisos en la página. Para notificaciones con la app cerrada se requiere un navegador compatible y permiso del dispositivo.');
  return;
 }
 const base=await apiBase();
 if(!base){
  label.textContent='Servidor de envío no configurado';toggle.disabled=true;
  status(root,'Los avisos locales siguen disponibles. Las notificaciones con la app cerrada requieren un servidor Web Push.');
  return;
 }
 // Verificar primero el backend aunque este navegador todavía no esté suscrito.
 // Una suscripción local nunca prueba por sí sola que el servidor pueda entregar avisos.
 let config;
 try{
  config=await server('public-key');
  if(!config?.publicKey)throw Error('Sin clave pública VAPID');
 }catch(_){
  label.textContent='Servidor Push no disponible';
  toggle.disabled=true;
  status(root,'No se pudo conectar al servidor de notificaciones. Revisa tu conexión y vuelve a intentarlo. Los avisos de la página siguen disponibles.');
  return;
 }
 try{
  const sub=await subscription();
  if(sub&&!keyMatches(sub,config.publicKey)){
   label.textContent='Suscripción de otro servicio detectada';
   status(root,'El navegador ya tiene una suscripción con otra clave. No se cambiará ni eliminará sin tu autorización.');
   toggle.disabled=true;return;
  }
  const enabled=!!sub;
  toggle.dataset.active=String(enabled);
  toggle.textContent=enabled?'Desactivar avisos':'Activar avisos';
  if(Notification.permission==='denied'){
   label.textContent='Notificaciones bloqueadas en el navegador';
   status(root,'Abre los permisos de este sitio en Chrome o Android y permite las notificaciones. La suscripción guardada no garantiza recepción.');
   if(!enabled)toggle.disabled=true;
  }else{
   label.textContent=enabled?'Servidor disponible · suscripción en este navegador':'Servidor Push disponible · falta activar este dispositivo';
   status(root,enabled
    ?'Hay una suscripción del navegador y el servidor responde. La entrega con la app cerrada aún requiere una prueba real en este teléfono y un aviso oficial publicado.'
    :'El servidor está accesible. Activa avisos para autorizar este dispositivo; no se enviará ningún mensaje de prueba automáticamente.');
  }
 }catch(_){
  label.textContent='No fue posible comprobar la suscripción';
  toggle.disabled=true;
  status(root,'Comprueba tu conexión y permisos de Chrome antes de volver a intentar.');
 }
}
async function enable(root){
 if(!getValues(root).types.length)throw Error('Selecciona al menos un tipo de aviso.');
 if(!supported())throw Error('Las notificaciones push no son compatibles con este navegador.');
 const info=await server('public-key');
 if(!info.publicKey)throw Error('Servidor sin clave pública VAPID');
 let permission=Notification.permission;
 if(permission==='default')permission=await Notification.requestPermission();
 if(permission!=='granted')throw Error('Debes permitir las notificaciones en el navegador.');
 const reg=await registration();
 const ready=await navigator.serviceWorker.ready;
 const manager=(ready?.scope===reg.scope?ready:reg).pushManager;
 let sub=await manager.getSubscription(),created=false;
 if(sub&&!keyMatches(sub,info.publicKey))throw Error('Ya hay otro servicio Push activo. Desactívalo desde sus ajustes antes de cambiar de servidor.');
 if(!sub){sub=await manager.subscribe({userVisibleOnly:true,applicationServerKey:keyBytes(info.publicKey)});created=true;}
 try{
  const ack=await server('subscribe',{method:'POST',body:JSON.stringify({subscription:sub.toJSON(),preferences:getValues(root)})});
  if(!ack.active)throw Error('El servidor no confirmó la suscripción');
 }catch(err){if(created)await sub.unsubscribe().catch(()=>{});throw err;}
 save(getValues(root));
 status(root,'✓ Suscripción confirmada. Llegarán avisos solo después de una publicación oficial.');
}
async function disable(root){
 const sub=await subscription();
 if(sub){
  // El servidor borra la suscripción antes de quitarla del navegador.
  await server('unsubscribe',{method:'POST',body:JSON.stringify({subscription:{endpoint:sub.endpoint}})});
  await sub.unsubscribe();
 }
 status(root,'Avisos desactivados en este dispositivo.');
}
async function saveFilters(root){
 if(!getValues(root).types.length)throw Error('Selecciona al menos un tipo de aviso.');
 const next=getValues(root);save(next);
 const sub=await subscription();
 if(sub){
  await server('subscribe',{method:'POST',body:JSON.stringify({subscription:sub.toJSON(),preferences:next})});
  status(root,'Filtros actualizados. Solo recibirás las categorías seleccionadas.');
 }else status(root,'Filtros guardados en este dispositivo. Activa avisos cuando el servidor esté disponible.');
}

/* Reutilizar el panel Push existente dentro del registro, sin segundo proveedor
   ni solicitar permiso del navegador automáticamente. */
window.LJR_V1082_PUSH_PANEL={
 // Cambiar selección visual no activa Push ni envía preferencias al servidor.
 syncSelection(host,profile={}){
  const panel=host?.querySelector?.('[data-v1082-push]');
  if(!panel)return false;
  const cat=$('[data-v1082-category]',panel),team=$('[data-v1082-team]',panel);
  if(cat&&CATEGORIES.some(([id])=>id===String(profile.category||'')))cat.value=String(profile.category);
  if(team&&profile.team!==undefined)team.value=String(profile.team||'').slice(0,90);
  const note=$('[data-v1082-status]',panel);
  if(note)note.textContent='Selección sincronizada con tu formulario. Pulsa “Guardar filtros” para actualizar una suscripción Push existente.';
  return true;
 },
 async mountInto(host,profile={}){
  if(!host)return false;
  let panel=host.querySelector('[data-v1082-push]');
  if(!panel){
   const fragment=document.createElement('div');
   fragment.innerHTML=markup();
   panel=fragment.firstElementChild;
   host.replaceChildren(panel);
  }
  await syncState(panel);
  this.syncSelection(host,profile);
  return true;
 }
};

document.addEventListener('click',async event=>{
 const button=event.target.closest('[data-v1082-toggle],[data-v1082-save]');
 if(!button||working)return;
 const root=button.closest('[data-v1082-push]');if(!root)return;
 event.preventDefault();working=true;
 root.querySelectorAll('button').forEach(b=>b.disabled=true);
 status(root,'Guardando preferencias…');
 try{
  if(button.hasAttribute('data-v1082-save'))await saveFilters(root);
  else{
   const sub=await subscription();
   if(sub)await disable(root);else await enable(root);
  }
 }catch(err){status(root,'⚠ '+String(err.message||'No se pudo activar. Revisa conexión y permisos.'));}
 finally{
  working=false;root.querySelectorAll('button').forEach(b=>b.disabled=false);
  await syncState(root);
 }
});
function mount(){
 if(renderQueued)return;renderQueued=true;
 setTimeout(async()=>{
  renderQueued=false;
  const host=routeHost();if(!host||host.querySelector('[data-v1082-push]'))return;
  const template=document.createElement('div');template.innerHTML=markup();
  const panel=template.firstElementChild;
  // Se coloca antes de la lista, sin duplicar barras ni ocupar espacio entre tarjetas.
  const anchor=host.querySelector('[data-v1073-list],.v921-field-list,[data-news-list]');
  if(anchor)anchor.before(panel);else host.append(panel);
  await syncState(panel);
 },110);
}
window.addEventListener('hashchange',mount);
window.addEventListener('pageshow',mount);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')mount();});
const screen=document.querySelector('#screen');
if(screen)new MutationObserver(mount).observe(screen,{childList:true,subtree:false});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
